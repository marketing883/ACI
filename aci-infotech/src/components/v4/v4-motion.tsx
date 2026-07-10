'use client';

/**
 * Motion primitives for the v4 homepage, matching the motion grammar of
 * the Effica reference: staggered fade-ups in three distance tiers
 * (14/30/50px), images that settle from scale(1.4), scroll-triggered
 * fill bars and counters, and an accordion. Everything collapses to
 * static, fully-visible content under prefers-reduced-motion.
 */

import {
  motion,
  useInView,
  useReducedMotion,
  animate,
  AnimatePresence,
} from 'framer-motion';
import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type CSSProperties,
} from 'react';

// The template's entrance ease: fast out, long settle.
export const EASE = [0.16, 1, 0.3, 1] as const;

// ---- Reveal: fade + rise, three distance tiers like the template ----
export function Reveal({
  children,
  delay = 0,
  tier = 'sm',
  className,
  style,
  once = true,
}: {
  children: ReactNode;
  delay?: number;
  /** sm=14px (text/rows), md=30px (cards), lg=50px (section blocks) */
  tier?: 'sm' | 'md' | 'lg';
  className?: string;
  style?: CSSProperties;
  once?: boolean;
}) {
  const reduce = useReducedMotion();
  const y = tier === 'lg' ? 50 : tier === 'md' ? 30 : 14;
  if (reduce) {
    return (
      <div className={className} style={style}>
        {children}
      </div>
    );
  }
  return (
    <motion.div
      className={className}
      style={style}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount: 0.25 }}
      transition={{ duration: 0.7, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

// ---- ImageSettle: the template's scale(1.4) -> 1 image entrance ------
export function ImageSettle({
  children,
  className,
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  const reduce = useReducedMotion();
  if (reduce) {
    return (
      <div className={className} style={{ ...style, overflow: 'hidden' }}>
        {children}
      </div>
    );
  }
  return (
    <div className={className} style={{ ...style, overflow: 'hidden' }}>
      <motion.div
        style={{ width: '100%', height: '100%' }}
        initial={{ scale: 1.4 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1.1, ease: EASE }}
      >
        {children}
      </motion.div>
    </div>
  );
}

// ---- CountUp: scroll-triggered number roll --------------------------
export function CountUp({
  value,
  className,
  style,
}: {
  /** e.g. "500+", "1,200+", "2006", "11" */
  value: string;
  className?: string;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();
  const numeric = parseFloat(value.replace(/[^0-9.]/g, ''));
  // Non-numeric values and reduced motion render the final string as-is.
  const animatable = !Number.isNaN(numeric);
  const [display, setDisplay] = useState(value.replace(/[0-9]/g, '0'));

  useEffect(() => {
    if (!inView || reduce || !animatable) return;
    const prefix = value.match(/^[^0-9]*/)?.[0] ?? '';
    const suffix = value.match(/[^0-9.,]*$/)?.[0] ?? '';
    const hasComma = value.includes(',');
    const controls = animate(0, numeric, {
      duration: 1.4,
      ease: EASE,
      onUpdate: (v) => {
        const n = Math.round(v);
        setDisplay(`${prefix}${hasComma ? n.toLocaleString('en-US') : n}${suffix}`);
      },
      onComplete: () => setDisplay(value),
    });
    return () => controls.stop();
  }, [inView, value, reduce, animatable, numeric]);

  return (
    <span ref={ref} className={className} style={style}>
      {reduce || !animatable ? value : display}
    </span>
  );
}

// ---- FillBar: the template's "Skill Bar" fill-on-scroll --------------
export function FillBar({
  percent,
  color = 'var(--v4-royal)',
  track = 'var(--v4-mist)',
  height = 6,
  className,
  delay = 0,
}: {
  percent: number;
  color?: string;
  track?: string;
  height?: number;
  className?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <div
      className={className}
      style={{ background: track, height, borderRadius: height, overflow: 'hidden' }}
      role="presentation"
    >
      <motion.div
        style={{ background: color, height: '100%', borderRadius: height }}
        initial={{ width: reduce ? `${percent}%` : '0%' }}
        whileInView={{ width: `${percent}%` }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 1.2, delay, ease: EASE }}
      />
    </div>
  );
}

// ---- Accordion item: FAQ open/close ----------------------------------
export function AccordionItem({
  question,
  children,
  defaultOpen = false,
}: {
  question: string;
  children: ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const reduce = useReducedMotion();
  return (
    <div style={{ borderBottom: '1px solid var(--v4-mist)' }}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
          padding: '22px 0',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
          color: 'var(--v4-ink)',
          font: '500 17px/1.4 var(--font-funnel-sans)',
        }}
      >
        <span>{question}</span>
        <motion.span
          aria-hidden
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: reduce ? 0 : 0.3, ease: EASE }}
          style={{
            flexShrink: 0,
            width: 28,
            height: 28,
            borderRadius: 14,
            border: '1px solid var(--v4-mist)',
            display: 'grid',
            placeItems: 'center',
            fontSize: 16,
            color: 'var(--v4-royal)',
            lineHeight: 1,
          }}
        >
          +
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={reduce ? false : { height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={reduce ? undefined : { height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: EASE }}
            style={{ overflow: 'hidden' }}
          >
            <div
              style={{
                padding: '0 44px 22px 0',
                color: 'var(--v4-muted)',
                font: '400 15.5px/1.65 var(--font-funnel-sans)',
              }}
            >
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ---- ArrowLink: the template's arrow-slide hover micro-interaction ---
export function ArrowCircle({ dark = false }: { dark?: boolean }) {
  return (
    <span
      aria-hidden
      className="v4-arrow"
      style={{
        width: 40,
        height: 40,
        borderRadius: 20,
        display: 'grid',
        placeItems: 'center',
        overflow: 'hidden',
        border: dark ? '1px solid rgba(255,255,255,0.22)' : '1px solid var(--v4-mist)',
        color: dark ? '#fff' : 'var(--v4-ink)',
        flexShrink: 0,
      }}
    >
      <svg className="v4-arrow-svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path
          d="M2 8h11M8.5 2.8 13.7 8l-5.2 5.2"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}
