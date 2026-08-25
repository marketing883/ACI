'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Reveal-once gate for the v5 sections. Returns a ref for the section
 * and whether it has scrolled into view; pair with the `.is-revealed`
 * class so the CSS entrances in v5.css fire on scroll, not page load.
 */
export function useReveal<T extends HTMLElement>(threshold = 0.15) {
  const ref = useRef<T>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') {
      // Reveal from a frame callback so state never updates
      // synchronously in the effect body (matches SiteNav's pattern).
      const raf = requestAnimationFrame(() => setRevealed(true));
      return () => cancelAnimationFrame(raf);
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          io.disconnect();
        }
      },
      { threshold, rootMargin: '0px 0px -60px 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);

  return { ref, revealed };
}

/**
 * rAF count-up from 0 to `target` once `run` flips true. Quartic
 * ease-out over ~1.6s, matching the v4 vault counter. Snaps to the
 * target under reduced motion.
 */
export function useCountUp(target: number, run: boolean, duration = 1600) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!run) return;
    const reduce =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      if (reduce) {
        setValue(target);
        return;
      }
      const p = Math.min(1, (t - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 4);
      setValue(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [run, target, duration]);

  return value;
}
