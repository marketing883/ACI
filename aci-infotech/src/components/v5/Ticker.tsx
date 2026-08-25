'use client';

import { useEffect, useRef } from 'react';
import './v5.css';

/**
 * Outlined chapter-divider ticker. The stroke-only line is already in
 * motion when it scrolls into view: a slow base drift plus a scroll
 * scrub, so scrolling drags the text and flips its direction. Under
 * reduced motion it renders static.
 */
export default function Ticker({
  text,
  headingClass,
  background = '#0a0b10',
}: {
  text: string;
  headingClass: string;
  background?: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const halfRef = useRef(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const measure = () => {
      halfRef.current = track.scrollWidth / 2;
    };
    measure();
    window.addEventListener('resize', measure);

    let raf = 0;
    let drift = 0;
    let last = performance.now();
    let lastScroll = window.scrollY;
    let dir = -1; // drift left by default

    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;

      const sy = window.scrollY;
      const dScroll = sy - lastScroll;
      lastScroll = sy;
      if (dScroll > 0.5) dir = -1;
      else if (dScroll < -0.5) dir = 1;

      // Base drift ~36px/s plus the scroll scrub.
      drift += dir * 36 * dt - dScroll * 0.35;

      const half = halfRef.current || 1;
      // Keep the offset inside one copy's width so the loop is seamless.
      const offset = ((drift % half) + half) % half;
      track.style.transform = `translateX(${-offset}px)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', measure);
    };
  }, []);

  const line = `${text} · `;

  return (
    <div
      aria-hidden="true"
      className="flex items-center overflow-hidden border-t border-white/[0.07] py-8 md:py-10"
      style={{ background }}
    >
      <div ref={trackRef} className="flex will-change-transform">
        {[0, 1].map((copy) => (
          <span
            key={copy}
            className={`v5-ticker-text uppercase ${headingClass}`}
            style={{ fontSize: 'clamp(4rem, 10vw, 9rem)', lineHeight: 1 }}
          >
            {line.repeat(3)}
          </span>
        ))}
      </div>
    </div>
  );
}
