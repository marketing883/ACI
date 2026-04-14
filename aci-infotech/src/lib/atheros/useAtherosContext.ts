'use client';

/**
 * useAtherosContext - returns the active Atheros context for the
 * current pathname + most-visible section in the viewport.
 *
 * Resolution rules:
 *   1. Walk ATHEROS_CONTEXTS in declaration order.
 *   2. An entry is eligible if:
 *      a. its route matcher accepts the current pathname AND
 *      b. either it has no `section` selector, or that section is the
 *         currently most-visible section on the page.
 *   3. The first eligible entry wins.
 *
 * Section detection uses one IntersectionObserver across all unique
 * section selectors declared in the manifest. The hook keeps the
 * "currently most-visible" section as state and re-resolves the
 * winning entry whenever pathname or active section changes.
 *
 * Section transitions are debounced (SECTION_DEBOUNCE_MS) so a fast
 * scroll past three sections does not flicker the bubble copy.
 */

import { useEffect, useMemo, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import {
  ATHEROS_CONTEXTS,
  SECTION_DEBOUNCE_MS,
  type AtherosContextEntry,
  type RouteMatcher,
} from './contextMap';

function routeMatches(
  matcher: RouteMatcher | RouteMatcher[],
  pathname: string,
): boolean {
  const matchers = Array.isArray(matcher) ? matcher : [matcher];
  for (const m of matchers) {
    if (typeof m === 'string') {
      if (m === pathname) return true;
    } else if (m.test(pathname)) {
      return true;
    }
  }
  return false;
}

function entryEligible(
  entry: AtherosContextEntry,
  pathname: string,
  activeSection: string | null,
): boolean {
  if (!routeMatches(entry.match.route, pathname)) return false;
  if (entry.match.section) return entry.match.section === activeSection;
  return true;
}

function resolveEntry(
  pathname: string,
  activeSection: string | null,
): AtherosContextEntry | null {
  for (const entry of ATHEROS_CONTEXTS) {
    if (entryEligible(entry, pathname, activeSection)) return entry;
  }
  return null;
}

export function useAtherosContext(): AtherosContextEntry | null {
  const pathname = usePathname() ?? '/';
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Collect every unique section selector the manifest mentions for
  // the current pathname. We only observe sections that could matter
  // here, which keeps the IntersectionObserver work tiny.
  const sectionSelectors = useMemo(() => {
    const set = new Set<string>();
    for (const entry of ATHEROS_CONTEXTS) {
      if (!entry.match.section) continue;
      if (!routeMatches(entry.match.route, pathname)) continue;
      set.add(entry.match.section);
    }
    return Array.from(set);
  }, [pathname]);

  useEffect(() => {
    if (sectionSelectors.length === 0) {
      // No section-specific entries on this page; clear and bail.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActiveSection(null);
      return;
    }
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      return;
    }

    const elements = sectionSelectors
      .map((sel) => ({ sel, el: document.querySelector(sel) }))
      .filter((x): x is { sel: string; el: Element } => x.el !== null);

    if (elements.length === 0) return;

    // Track the latest visibility ratio per element so we can pick
    // the most prominent at any time.
    const ratios = new Map<string, number>();
    elements.forEach(({ sel }) => ratios.set(sel, 0));

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const sel = elements.find(({ el }) => el === entry.target)?.sel;
          if (sel) ratios.set(sel, entry.intersectionRatio);
        }
        // Pick the element with the highest visible ratio. Threshold
        // of 0.15 avoids flicker when only a sliver is visible.
        let bestSel: string | null = null;
        let bestRatio = 0.15;
        for (const [sel, ratio] of ratios) {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            bestSel = sel;
          }
        }
        // Debounce the swap so a fast scroll does not flicker.
        if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = setTimeout(() => {
          setActiveSection(bestSel);
        }, SECTION_DEBOUNCE_MS);
      },
      {
        // Multiple thresholds give us smooth ratio updates as
        // sections enter and leave the viewport.
        threshold: [0, 0.15, 0.3, 0.5, 0.75, 1],
      },
    );

    elements.forEach(({ el }) => observer.observe(el));

    return () => {
      observer.disconnect();
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, [sectionSelectors]);

  return useMemo(
    () => resolveEntry(pathname, activeSection),
    [pathname, activeSection],
  );
}
