'use client';

import { useEffect, useRef } from 'react';

interface LazyVideoProps {
  src: string;
  poster: string;
  className?: string;
}

/**
 * The poster paints immediately; the video file is only fetched once the
 * element nears the viewport (preload="none" + IntersectionObserver),
 * then autoplays muted. Keeps the full-screen background videos off the
 * critical path so initial load stays fast. Driven imperatively so there
 * is no extra React render.
 */
export default function LazyVideo({ src, poster, className }: LazyVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const start = () => {
      if (el.dataset.loaded) return;
      el.dataset.loaded = '1';
      el.src = src;
      el.load();
      el.play().catch(() => {});
    };

    if (typeof IntersectionObserver === 'undefined') {
      start();
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            start();
            io.disconnect();
            break;
          }
        }
      },
      { rootMargin: '300px 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [src]);

  return (
    <video
      ref={ref}
      className={className}
      poster={poster}
      muted
      loop
      playsInline
      preload="none"
      aria-hidden="true"
    />
  );
}
