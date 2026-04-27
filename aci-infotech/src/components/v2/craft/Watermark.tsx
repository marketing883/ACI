'use client';

import { useRef, useEffect } from 'react';

interface WatermarkProps {
  text: string;
  size?: string;
  opacity?: number;
  color?: string;
  offsetY?: string;
}

export function Watermark({
  text,
  size = '18vw',
  opacity = 0.04,
  color = '#ffffff',
  offsetY = '50%',
}: WatermarkProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleScroll = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const progress = 1 - (rect.top + rect.height) / (vh + rect.height);
      const parallax = (progress - 0.5) * 80;
      el.style.transform = `translateY(${parallax}px)`;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      style={{
        position: 'absolute',
        top: offsetY,
        left: '50%',
        transform: 'translateX(-50%)',
        fontSize: size,
        fontFamily: 'var(--v2-font-display, "Funnel Display", sans-serif)',
        fontWeight: 800,
        color,
        opacity,
        textTransform: 'uppercase',
        letterSpacing: '-0.04em',
        lineHeight: 0.85,
        whiteSpace: 'nowrap',
        pointerEvents: 'none',
        userSelect: 'none',
        zIndex: 0,
        willChange: 'transform',
      }}
    >
      {text}
    </div>
  );
}
