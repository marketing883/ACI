/**
 * Shared Framer Motion variants for v2 homepage (and future v2 pages).
 *
 * All variants use the v2 easing curve (cubic-bezier(0.16, 1, 0.3, 1))
 * and reveal durations calibrated to feel premium, not twitchy.
 * Mirrors tokens from src/styles/design-system-v2.css.
 */

import type { Variants } from 'framer-motion';

export const V2_EASE = [0.16, 1, 0.3, 1] as const;

/** Fade + upward translate. Default reveal for most content. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: V2_EASE },
  },
};

/** Fade + downward translate. Used for elements "descending" in. */
export const fadeDown: Variants = {
  hidden: { opacity: 0, y: -24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: V2_EASE },
  },
};

/** Plain fade, no translation. Used for logos, backgrounds. */
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.7, ease: V2_EASE },
  },
};

/** Slide from right. Used for editorial row lists. */
export const slideInFromRight: Variants = {
  hidden: { opacity: 0, x: 24 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: V2_EASE },
  },
};

/** Container variant that staggers children on reveal. Pair with child
 *  variants like fadeUp for a staggered list entrance. */
export const staggerChildren: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

/** Child variant for word-by-word headline split. Paired with
 *  staggerChildren on the parent h1/h2. */
export const textSplitChild: Variants = {
  hidden: { opacity: 0, y: 16, filter: 'blur(4px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.6, ease: V2_EASE },
  },
};
