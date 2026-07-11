'use client';

import { useEffect, useRef } from 'react';

/**
 * Full-bleed background video that fades in once on load and then loops
 * natively and continuously — no fade-to-black, no reset between loops
 * or slide transitions. offsetX/offsetY shift the framing; scale keeps
 * the frame covered after a shift.
 */
export default function FadingVideo({
  src,
  webmSrc,
  className,
  offsetX = 0,
  offsetY = 0,
  scale = 1,
}: {
  src: string;
  /** optional VP9 WebM, preferred by browsers that support it */
  webmSrc?: string;
  className?: string;
  offsetX?: number;
  offsetY?: number;
  scale?: number;
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

    const onLoaded = () => {
      v.play().catch(() => {});
      fadeIn();
    };

    v.addEventListener('loadeddata', onLoaded);
    if (v.readyState >= 2) onLoaded();

    return () => {
      cancel();
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
      preload="auto"
      style={{
        opacity: 0,
        transform:
          offsetX || offsetY || scale !== 1
            ? `translate(${offsetX}%, ${offsetY}%) scale(${scale})`
            : undefined,
      }}
    >
      {webmSrc ? <source src={webmSrc} type="video/webm" /> : null}
      <source src={src} type="video/mp4" />
    </video>
  );
}
