'use client';

/**
 * ScrollReveal — wraps children in a motion.div that fades in on viewport
 * entry. Picks variant based on direction prop. Respects
 * prefers-reduced-motion by rendering children without animation.
 *
 * Usage:
 *   <ScrollReveal>              // default fade + up
 *   <ScrollReveal direction="right" delay={0.2}>
 *   <ScrollReveal direction="fade" amount={0.4} once={false}>
 */

import { ReactNode, useRef } from 'react';
import { motion, useInView, useReducedMotion, type Variants } from 'framer-motion';
import { V2_EASE, fadeUp } from './variants';

type Direction = 'up' | 'down' | 'left' | 'right' | 'fade';

interface ScrollRevealProps {
  children: ReactNode;
  delay?: number;
  direction?: Direction;
  /** Portion of element that must be in view (0-1). Default 0.15. */
  amount?: number;
  /** If true, animate only the first time it enters view. Default true. */
  once?: boolean;
  className?: string;
}

function variantsFor(direction: Direction): Variants {
  const distance = 24;
  switch (direction) {
    case 'down':
      return {
        hidden: { opacity: 0, y: -distance },
        visible: { opacity: 1, y: 0 },
      };
    case 'left':
      return {
        hidden: { opacity: 0, x: distance },
        visible: { opacity: 1, x: 0 },
      };
    case 'right':
      return {
        hidden: { opacity: 0, x: -distance },
        visible: { opacity: 1, x: 0 },
      };
    case 'fade':
      return {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
      };
    case 'up':
    default:
      return fadeUp;
  }
}

export default function ScrollReveal({
  children,
  delay = 0,
  direction = 'up',
  amount = 0.15,
  once = true,
  className,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const inView = useInView(ref, { amount, once });

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
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={variantsFor(direction)}
      transition={{ duration: 0.7, ease: V2_EASE, delay }}
    >
      {children}
    </motion.div>
  );
}
