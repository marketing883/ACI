'use client';

import { useEffect, useRef } from 'react';

/**
 * Full-bleed background video with a custom JS fade loop (no CSS
 * transitions), per the slide-1 spec: 500ms rAF fade-in on load / loop
 * start, 500ms fade-out when 0.55s remain, reset on ended. Each new fade
 * cancels the running frame and resumes from the current opacity.
 */
export default function FadingVideo({
  src,
  className,
  offsetY = 0,
  active = true,
}: {
  src: string;
  className?: string;
  /** vertical shift as a percentage (e.g. 17 crops the top) */
  offsetY?: number;
  /** when false the video pauses (offscreen slide) */
  active?: boolean;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const rafRef = useRef<number | null>(null);
  const fadingOutRef = useRef(false);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;

    const FADE = 500;
    const cancel = () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
    const fade = (to: number) => {
      cancel();
      const from = Number(v.style.opacity || '0');
      const start = performance.now();
      const step = (now: number) => {
        const t = Math.min(1, (now - start) / FADE);
        v.style.opacity = String(from + (to - from) * t);
        if (t < 1) rafRef.current = requestAnimationFrame(step);
        else rafRef.current = null;
      };
      rafRef.current = requestAnimationFrame(step);
    };

    const onLoaded = () => {
      v.style.opacity = '0';
      fadingOutRef.current = false;
      v.play().catch(() => {});
      fade(1);
    };
    const onTime = () => {
      if (!v.duration) return;
      if (!fadingOutRef.current && v.duration - v.currentTime <= 0.55) {
        fadingOutRef.current = true;
        fade(0);
      }
    };
    const onEnded = () => {
      v.style.opacity = '0';
      setTimeout(() => {
        v.currentTime = 0;
        fadingOutRef.current = false;
        v.play().catch(() => {});
        fade(1);
      }, 100);
    };

    v.style.opacity = '0';
    v.addEventListener('loadeddata', onLoaded);
    v.addEventListener('timeupdate', onTime);
    v.addEventListener('ended', onEnded);
    if (v.readyState >= 2) onLoaded();

    return () => {
      cancel();
      v.removeEventListener('loadeddata', onLoaded);
      v.removeEventListener('timeupdate', onTime);
      v.removeEventListener('ended', onEnded);
    };
  }, [src]);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (active) v.play().catch(() => {});
    else v.pause();
  }, [active]);

  return (
    <video
      ref={ref}
      className={className}
      muted
      loop={false}
      playsInline
      preload="auto"
      style={{
        opacity: 0,
        transform: offsetY ? `translateY(${offsetY}%)` : undefined,
      }}
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}
