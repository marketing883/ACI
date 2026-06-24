'use client';

/**
 * Reusable motion primitives for the v3 homepage, built on
 * framer-motion. Every primitive degrades to fully-visible, static
 * content when the user prefers reduced motion, so nothing depends on
 * JS to be readable.
 */

import {
  motion,
  useInView,
  useReducedMotion,
  animate,
  useMotionValue,
  useTransform,
  type Variants,
} from 'framer-motion';
import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type CSSProperties,
} from 'react';

const EASE = [0.16, 1, 0.3, 1] as const;

// ---- Reveal: fade + rise on scroll into view ------------------------
export function Reveal({
  children,
  delay = 0,
  y = 28,
  className,
  as = 'div',
  style,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: 'div' | 'span' | 'li';
  style?: CSSProperties;
}) {
  const reduce = useReducedMotion();
  const MotionTag = motion[as];
  if (reduce) {
    const Tag = as;
    return (
      <Tag className={className} style={style}>
        {children}
      </Tag>
    );
  }
  return (
    <MotionTag
      className={className}
      style={style}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-12% 0px' }}
      transition={{ duration: 0.7, ease: EASE, delay }}
    >
      {children}
    </MotionTag>
  );
}

// ---- Stagger container + items --------------------------------------
export const staggerParent: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};
export const staggerChild: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE } },
};

// ---- Headline line reveal (clip + rise) -----------------------------
export function LineReveal({
  children,
  delay = 0,
  className,
  innerClassName,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  innerClassName?: string;
}) {
  const reduce = useReducedMotion();
  if (reduce) {
    return (
      <span className={className}>
        <span className={innerClassName}>{children}</span>
      </span>
    );
  }
  return (
    <span className={className}>
      <motion.span
        className={innerClassName}
        initial={{ y: '110%' }}
        animate={{ y: '0%' }}
        transition={{ duration: 0.95, ease: EASE, delay }}
        style={{ display: 'block' }}
      >
        {children}
      </motion.span>
    </span>
  );
}

// ---- CountUp: animate a number when it scrolls into view ------------
export function CountUp({
  to,
  duration = 1.6,
  className,
}: {
  to: number;
  duration?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-10% 0px' });
  const [display, setDisplay] = useState(reduce ? to : 0);

  // Decimals preserved for values like 1 -> keep integer formatting;
  // values < 10 with no decimals still read fine.
  useEffect(() => {
    if (reduce || !inView) return;
    const controls = animate(0, to, {
      duration,
      ease: EASE,
      onUpdate(v) {
        setDisplay(to % 1 === 0 ? Math.round(v) : Math.round(v * 10) / 10);
      },
    });
    return () => controls.stop();
  }, [inView, to, duration, reduce]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}

// ---- Bar fill: scale a bar to a fraction when in view ---------------
export function BarFill({
  fraction,
  className,
}: {
  fraction: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const f = Math.max(0.04, Math.min(1, fraction));
  if (reduce) {
    return <div className={className} style={{ transform: `scaleX(${f})` }} />;
  }
  return (
    <motion.div
      className={className}
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: f }}
      viewport={{ once: true, margin: '-10% 0px' }}
      transition={{ duration: 1.1, ease: EASE }}
    />
  );
}

// ---- Magnetic button: subtle pull toward the cursor -----------------
export function Magnetic({
  children,
  className,
  strength = 0.32,
}: {
  children: ReactNode;
  className?: string;
  strength?: number;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  function onMove(e: React.MouseEvent) {
    if (reduce || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const mx = e.clientX - (rect.left + rect.width / 2);
    const my = e.clientY - (rect.top + rect.height / 2);
    x.set(mx * strength);
    y.set(my * strength);
  }
  function reset() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      onMouseMove={onMove}
      onMouseLeave={reset}
      style={{ x, y, display: 'inline-flex' }}
      transition={{ type: 'spring', stiffness: 250, damping: 18, mass: 0.4 }}
    >
      {children}
    </motion.div>
  );
}

export { motion, useReducedMotion, useTransform };
