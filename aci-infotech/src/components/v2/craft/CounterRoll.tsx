'use client';

import { useRef, useState, useEffect } from 'react';

interface CounterRollProps {
  value: string;
  className?: string;
  style?: React.CSSProperties;
  duration?: number;
}

export function CounterRoll({ value, className, style, duration = 1500 }: CounterRollProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(value);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!ref.current || hasAnimated.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || hasAnimated.current) return;
        hasAnimated.current = true;

        const numericPart = value.replace(/[^0-9.]/g, '');
        const prefix = value.match(/^[^0-9]*/)?.[0] || '';
        const suffix = value.match(/[^0-9.]*$/)?.[0] || '';
        const target = parseFloat(numericPart);
        const isFloat = numericPart.includes('.');
        const startTime = performance.now();

        const step = (now: number) => {
          const progress = Math.min((now - startTime) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const current = target * eased;
          const formatted = isFloat ? current.toFixed(1) : Math.floor(current).toString();
          setDisplay(`${prefix}${formatted}${suffix}`);

          if (progress < 1) {
            requestAnimationFrame(step);
          } else {
            setDisplay(value);
          }
        };

        requestAnimationFrame(step);
      },
      { threshold: 0.5 }
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value, duration]);

  return (
    <span ref={ref} className={className} style={style}>
      {display}
    </span>
  );
}
