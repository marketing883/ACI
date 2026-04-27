'use client';

/**
 * AnimatedCounter — counts from 0 to `target` when it enters the
 * viewport. Fires once. Respects prefers-reduced-motion.
 *
 * For non-integer values, pass `decimals`. For a prefix like "$" or a
 * suffix like "%", pass those props rather than concatenating into
 * target.
 *
 * Usage:
 *   <AnimatedCounter target={280} suffix="+" />
 *   <AnimatedCounter target={99.5} decimals={1} suffix="%" />
 */

import { useEffect, useRef, useState } from 'react';
import { useInView, useReducedMotion, animate } from 'framer-motion';
import { V2_EASE } from './variants';

interface AnimatedCounterProps {
  target: number;
  prefix?: string;
  suffix?: string;
  /** Animation duration in seconds. Default 2. */
  duration?: number;
  /** Number of decimal places to show. Default 0. */
  decimals?: number;
  className?: string;
}

export default function AnimatedCounter({
  target,
  prefix = '',
  suffix = '',
  duration = 2,
  decimals = 0,
  className,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();
  const inView = useInView(ref, { once: true, amount: 0.5 });
  // If the user prefers reduced motion we skip the animation entirely
  // and start at the target value. Initial state is computed from
  // `reduced` (returned synchronously by useReducedMotion) so the
  // effect never has to set state just to reach the final number.
  const [value, setValue] = useState(() => (reduced ? target : 0));

  useEffect(() => {
    if (reduced || !inView) return;
    const controls = animate(0, target, {
      duration,
      ease: V2_EASE,
      onUpdate: (latest) => setValue(latest),
    });
    return () => controls.stop();
  }, [inView, target, duration, reduced]);

  const display =
    decimals > 0
      ? value.toFixed(decimals)
      : Math.round(value).toLocaleString();

  return (
    <span ref={ref} className={className}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}
