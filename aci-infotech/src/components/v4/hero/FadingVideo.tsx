'use client';

import { useEffect, useRef } from 'react';

/**
 * Full-bleed background video that lazy-loads and only plays while it is
 * near the viewport — off-screen it stays paused and unbuffered, so the
 * page doesn't decode several videos at once. Fades in once on first
 * play. offsetX/offsetY shift the framing; scale keeps the frame covered
 * after a shift; mirror flips horizontally.
 */
export default function FadingVideo({
  src,
  webmSrc,
  className,
  offsetX = 0,
  offsetY = 0,
  scale = 1,
  mirror = false,
}: {
  src: string;
  /** optional VP9 WebM, preferred by browsers that support it */
  webmSrc?: string;
  className?: string;
  offsetX?: number;
  offsetY?: number;
  scale?: number;
  /** flip horizontally (e.g. to move the subject to the other side) */
  mirror?: boolean;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;

    const FADE = 700;
    const cancel = () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
    const fadeIn = () => {
      cancel();
      const from = Number(v.style.opacity || '0');
      const start = performance.now();
      const step = (now: number) => {
        const t = Math.min(1, (now - start) / FADE);
        v.style.opacity = String(from + (1 - from) * t);
        if (t < 1) rafRef.current = requestAnimationFrame(step);
        else rafRef.current = null;
      };
      rafRef.current = requestAnimationFrame(step);
    };
    const onLoaded = () => fadeIn();
    v.addEventListener('loadeddata', onLoaded);

    // Only load + play while near the viewport; pause otherwise.
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          v.play().catch(() => {});
          if (v.readyState >= 2) fadeIn();
        } else {
          v.pause();
        }
      },
      { rootMargin: '300px 0px' },
    );
    io.observe(v);

    return () => {
      cancel();
      io.disconnect();
      v.removeEventListener('loadeddata', onLoaded);
    };
  }, [src]);

  return (
    <video
      ref={ref}
      className={className}
      muted
      loop
      playsInline
      preload="none"
      style={{
        opacity: 0,
        transform:
          mirror || offsetX || offsetY || scale !== 1
            ? `${mirror ? 'scaleX(-1) ' : ''}translate(${offsetX}%, ${offsetY}%) scale(${scale})`
            : undefined,
      }}
    >
      {webmSrc ? <source src={webmSrc} type="video/webm" /> : null}
      <source src={src} type="video/mp4" />
    </video>
  );
}
