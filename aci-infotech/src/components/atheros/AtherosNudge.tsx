'use client';

/**
 * AtherosNudge - the proactive bubble that surfaces above the desktop
 * Ask Atheros button with a context-aware message.
 *
 * Behavior:
 *   - Desktop only (>= 1024px). Mobile already has its own proactive
 *     PillPeek system; mounting another nudge there would conflict.
 *   - Suppressed on /admin and /lp routes (matches ChatWidget rules).
 *   - First show condition: 7 seconds dwell on the page OR 25% scroll
 *     past, whichever fires first. Avoids "popup on arrival" feel.
 *   - Once visible, copy swaps as the visitor scrolls between sections.
 *     Section-context resolution + debounce live in useAtherosContext.
 *   - Click anywhere on bubble (other than the X) opens the chat AND
 *     seeds the chat input with the entry's seedPrompt.
 *   - Click X dismisses the bubble. A localStorage flag with a 30-day
 *     TTL keeps it dismissed across sessions; the chat button itself
 *     stays visible and clickable.
 *   - prefers-reduced-motion: bubble fades in without slide; section
 *     copy swaps without animation.
 *
 * Communication with the chat widget:
 *   - Dispatches `atheros:open` to ask the desktop ChatWidget to open.
 *   - Dispatches `atheros:seed` to ask ChatColumn to pre-fill the
 *     input with the given prompt. Both are fired together on click.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Sparkles, X } from 'lucide-react';
import { useAtherosContext } from '@/lib/atheros/useAtherosContext';

const DISMISS_KEY = 'atheros_nudge_dismissed_until';
const DISMISS_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days
const SHOW_AFTER_DWELL_MS = 7000;
const SHOW_AFTER_SCROLL_PCT = 25;

function isSuppressedRoute(pathname: string | null): boolean {
  if (!pathname) return false;
  if (pathname.startsWith('/admin')) return true;
  if (pathname === '/lp' || pathname.startsWith('/lp/')) return true;
  return false;
}

function readDismissedUntil(): number {
  if (typeof window === 'undefined') return 0;
  try {
    const raw = window.localStorage.getItem(DISMISS_KEY);
    if (!raw) return 0;
    const ts = parseInt(raw, 10);
    return Number.isFinite(ts) ? ts : 0;
  } catch {
    return 0;
  }
}

function writeDismissedUntil(): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(
      DISMISS_KEY,
      String(Date.now() + DISMISS_TTL_MS),
    );
  } catch {
    // localStorage unavailable; the bubble will return next session, fine.
  }
}

export default function AtherosNudge() {
  const pathname = usePathname();
  const context = useAtherosContext();

  const [isDesktop, setIsDesktop] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [shown, setShown] = useState(false);
  const [dismissed, setDismissed] = useState(true); // assume dismissed until check
  const dwellTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Detect desktop + reduced motion + dismissal flag once on mount.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const desktopMq = window.matchMedia('(min-width: 1024px)');
    const motionMq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const applyDesktop = () => setIsDesktop(desktopMq.matches);
    const applyMotion = () => setReducedMotion(motionMq.matches);
    applyDesktop();
    applyMotion();
    desktopMq.addEventListener('change', applyDesktop);
    motionMq.addEventListener('change', applyMotion);

    const dismissedUntil = readDismissedUntil();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- bootstrap from localStorage
    setDismissed(dismissedUntil > Date.now());

    return () => {
      desktopMq.removeEventListener('change', applyDesktop);
      motionMq.removeEventListener('change', applyMotion);
    };
  }, []);

  // Show timer + scroll trigger. Whichever fires first reveals the bubble.
  useEffect(() => {
    if (!isDesktop) return;
    if (dismissed) return;
    if (isSuppressedRoute(pathname)) return;

    if (dwellTimerRef.current) clearTimeout(dwellTimerRef.current);
    dwellTimerRef.current = setTimeout(() => {
      setShown(true);
    }, SHOW_AFTER_DWELL_MS);

    function onScroll() {
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - window.innerHeight;
      if (scrollable <= 0) return;
      const pct = (window.scrollY / scrollable) * 100;
      if (pct >= SHOW_AFTER_SCROLL_PCT) {
        setShown(true);
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      if (dwellTimerRef.current) clearTimeout(dwellTimerRef.current);
      window.removeEventListener('scroll', onScroll);
    };
  }, [isDesktop, dismissed, pathname]);

  const handleDismiss = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    writeDismissedUntil();
    setDismissed(true);
    setShown(false);
  }, []);

  const handleOpen = useCallback(() => {
    if (typeof window === 'undefined') return;
    const seed = context?.seedPrompt ?? context?.message ?? '';
    // Open the chat first so ChatColumn is mounted and listening when
    // the seed-and-submit event fires next tick.
    window.dispatchEvent(new CustomEvent('atheros:open'));
    if (seed) {
      // Yield to the mount cycle deterministically: request a frame,
      // then a task, then dispatch. A fixed 60ms timeout was racing on
      // slow iOS devices; this chain is both faster on fast devices
      // and safer on slow ones. ChatColumn also queues the prompt if
      // its send callback isn't wired yet, so a second layer of
      // safety catches any remaining race.
      const dispatchSeed = () =>
        window.dispatchEvent(
          new CustomEvent('atheros:seed', {
            detail: { prompt: seed, submit: true },
          }),
        );
      if (typeof window.requestAnimationFrame === 'function') {
        window.requestAnimationFrame(() => setTimeout(dispatchSeed, 0));
      } else {
        setTimeout(dispatchSeed, 0);
      }
    }
    // Hide the bubble after opening; do not write dismissedUntil so it
    // returns next session if the visitor closes the chat without
    // dismissing the bubble explicitly.
    setShown(false);
  }, [context]);

  // Bail out conditions render nothing.
  if (!isDesktop) return null;
  if (dismissed) return null;
  if (isSuppressedRoute(pathname)) return null;
  if (!shown) return null;
  if (!context) return null;

  const transitionClass = reducedMotion
    ? ''
    : 'transition-all duration-300 ease-out';

  return (
    <div
      className={`fixed bottom-20 right-6 z-[60] max-w-[340px] ${transitionClass}`}
    >
      {/* Bubble container is a positioned div, not a button, so the
          dismiss button can sit beside the main click target as a
          sibling instead of being nested inside it (nested <button>
          is invalid HTML and breaks click handling in some browsers,
          which was the cause of the earlier non-responsive behavior). */}
      <div className="relative rounded-xl border border-[#C4FF61]/30 bg-[#0A1628]/95 backdrop-blur-md shadow-2xl shadow-black/40 hover:border-[#C4FF61]/60 transition-colors">
        <button
          type="button"
          onClick={handleOpen}
          aria-label={`Atheros: ${context.message}`}
          className="group block w-full text-left px-4 py-3.5 pr-10 rounded-xl cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#C4FF61]/60"
        >
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5 inline-flex items-center justify-center w-6 h-6 rounded-md bg-[#C4FF61]/15 ring-1 ring-[#C4FF61]/40">
              <Sparkles className="w-3.5 h-3.5 text-[#C4FF61]" aria-hidden />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#C4FF61]/85 mb-1">
                Atheros
              </div>
              <p className="text-sm leading-snug text-white">
                {context.message}
              </p>
            </div>
          </div>
        </button>
        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Dismiss"
          className="absolute top-2 right-2 inline-flex items-center justify-center w-6 h-6 rounded text-white/55 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-3.5 h-3.5" aria-hidden />
        </button>
      </div>
      {/* Caret pointing down at the chat button. */}
      <div
        className="absolute right-8 -bottom-1.5 w-3 h-3 rotate-45 bg-[#0A1628]/95 border-r border-b border-[#C4FF61]/30"
        aria-hidden
      />
    </div>
  );
}
