'use client';

/**
 * ParallaxLayer — translates children vertically based on the user's
 * scroll progress through the viewport. Used for subtle depth effects
 * (gradient meshes, decorative elements).
 *
 * Speed is a multiplier:
 *   speed=0.2   -> moves ~40px over the viewport traversal
 *   speed=-0.2  -> moves opposite direction
 *   speed=0     -> static
 *
 * Disabled on prefers-reduced-motion (safety net).
 *
 * Note: the caller is responsible for applying a mobile guard if the
 * effect is unwanted on small screens (e.g. wrap in `hidden md:block`).
 */

import { ReactNode, useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';

interface ParallaxLayerProps {
  children: ReactNode;
  /** Multiplier: typical range -0.5 to 0.5. Default 0.2. */
  speed?: number;
  className?: string;
}

export default function ParallaxLayer({
  children,
  speed = 0.2,
  className,
}: ParallaxLayerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  // Distance in px that the content moves through the full scroll range.
  const range = speed * 200;
  const y = useTransform(scrollYProgress, [0, 1], [-range, range]);

  if (reduced) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ y, willChange: 'transform' }}
    >
      {children}
    </motion.div>
  );
}
