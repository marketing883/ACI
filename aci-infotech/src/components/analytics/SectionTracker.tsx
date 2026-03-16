'use client';

import { useRef, useEffect, ReactNode, ElementType } from 'react';

interface SectionTrackerProps {
  id: string;
  name?: string;
  children: ReactNode;
  className?: string;
  as?: ElementType;
}

/**
 * SectionTracker - Wrapper component for tracking section visibility and engagement
 *
 * Usage:
 * <SectionTracker id="hero" name="Hero Section">
 *   <HeroSection />
 * </SectionTracker>
 *
 * Or with custom element:
 * <SectionTracker id="pricing" name="Pricing" as="section" className="bg-gray-100">
 *   <PricingContent />
 * </SectionTracker>
 */
export function SectionTracker({
  id,
  name,
  children,
  className,
  as: Component = 'div',
}: SectionTrackerProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Dispatch enter event when element becomes visible
    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          window.dispatchEvent(
            new CustomEvent('aci:section_enter', {
              detail: {
                section_id: id,
                section_name: name || id,
                intersection_ratio: entry.intersectionRatio,
              },
            })
          );
        } else {
          window.dispatchEvent(
            new CustomEvent('aci:section_exit', {
              detail: {
                section_id: id,
                section_name: name || id,
              },
            })
          );
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, {
      threshold: [0, 0.25, 0.5, 0.75, 1.0],
      rootMargin: '0px',
    });

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [id, name]);

  return (
    <Component
      ref={ref as React.RefObject<HTMLDivElement>}
      data-track-section={id}
      data-section-name={name || id}
      className={className}
    >
      {children}
    </Component>
  );
}

/**
 * Hook for manually tracking sections
 */
export function useSectionTracking(sectionId: string, sectionName?: string) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          window.dispatchEvent(
            new CustomEvent('aci:section_enter', {
              detail: {
                section_id: sectionId,
                section_name: sectionName || sectionId,
                intersection_ratio: entry.intersectionRatio,
              },
            })
          );
        } else {
          window.dispatchEvent(
            new CustomEvent('aci:section_exit', {
              detail: {
                section_id: sectionId,
                section_name: sectionName || sectionId,
              },
            })
          );
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, {
      threshold: [0, 0.25, 0.5, 0.75, 1.0],
    });

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [sectionId, sectionName]);

  return ref;
}

export default SectionTracker;
