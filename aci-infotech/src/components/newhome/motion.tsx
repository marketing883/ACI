'use client';

// Motion primitives shared by every new-homepage section. Everything here
// honours prefers-reduced-motion: reveals become plain fades (or nothing),
// counters jump to their value, and the magnetic pull switches off.

import { Fragment, useEffect, useRef, useState, type ReactNode } from 'react';
import Link from 'next/link';
import {
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useSpring,
  type Variants,
} from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { EASE, GRAIN } from './tokens';

/** Fade-and-rise on first view. */
export function Reveal({
  children,
  delay = 0,
  y = 28,
  className,
  as = 'div',
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: 'div' | 'li' | 'p' | 'span';
}) {
  const reduce = useReducedMotion();
  const Tag = motion[as];
  return (
    <Tag
      className={className}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{ duration: 0.9, ease: EASE, delay }}
    >
      {children}
    </Tag>
  );
}

const wordParent: Variants = {
  hidden: {},
  show: ({ stagger, delay }: { stagger: number; delay: number }) => ({
    transition: { staggerChildren: stagger, delayChildren: delay },
  }),
};
const wordChild: Variants = {
  hidden: { y: '110%', rotate: 2 },
  show: { y: '0%', rotate: 0, transition: { duration: 0.95, ease: EASE } },
};

/**
 * Headline whose words rise out of a mask one after another. `lines` are
 * authored line breaks; a *starred* phrase gets the accent treatment.
 * Words inside a line are split on spaces, so a non-breaking space keeps
 * two words together as one unit (the widow rule).
 */
export function SplitHeadline({
  lines,
  className,
  accentClassName = 'nh-accent',
  as = 'h2',
  stagger = 0.06,
  delay = 0,
  immediate = false,
}: {
  lines: string[];
  className?: string;
  accentClassName?: string;
  as?: 'h1' | 'h2' | 'h3';
  stagger?: number;
  delay?: number;
  /** Animate on mount instead of on scroll into view (hero). */
  immediate?: boolean;
}) {
  const reduce = useReducedMotion();
  const Tag = motion[as];
  const trigger = immediate
    ? { animate: 'show' as const }
    : { whileInView: 'show' as const, viewport: { once: true, margin: '0px 0px -10% 0px' } };
  return (
    <Tag
      className={`[color:inherit] ${className ?? ''}`}
      initial={reduce ? false : 'hidden'}
      {...trigger}
      variants={wordParent}
      custom={{ stagger, delay }}
    >
      {lines.map((line, li) => (
        <span key={li} className="block">
          {line.split(/(\*[^*]+\*)/g).filter(Boolean).map((chunk, ci) => {
            const accent = chunk.startsWith('*') && chunk.endsWith('*');
            const text = accent ? chunk.slice(1, -1) : chunk;
            return text
              .split(' ')
              .filter(Boolean)
              .map((word, wi) => (
                <Fragment key={`${ci}-${wi}`}>
                  <span className="inline-block overflow-hidden pb-[0.12em] align-bottom">
                    <motion.span variants={reduce ? undefined : wordChild} className={`inline-block ${accent ? accentClassName : ''}`}>
                      {word}
                    </motion.span>
                  </span>{' '}
                </Fragment>
              ));
          })}
        </span>
      ))}
    </Tag>
  );
}

/** Counts a number up when it scrolls into view. Keeps prefix/suffix and
 *  decimals from the source string ("99.97%", "1,200+", "$4.7M"). */
export function CountUp({ value, className, duration = 1.6 }: { value: string; className?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' });
  const reduce = useReducedMotion();
  const match = value.match(/^([^0-9]*)([0-9][0-9,]*\.?[0-9]*)(.*)$/);
  const [shown, setShown] = useState(match ? `${match[1]}0${match[3]}` : value);

  useEffect(() => {
    if (!match) return;
    const [, pre, num, post] = match;
    const target = Number(num.replace(/,/g, ''));
    const decimals = num.includes('.') ? num.split('.')[1].length : 0;
    const grouped = num.includes(',');
    const fmt = (n: number) => {
      const fixed = n.toFixed(decimals);
      return grouped ? Number(fixed).toLocaleString('en-US', { minimumFractionDigits: decimals }) : fixed;
    };
    if (reduce || !inView) {
      if (reduce) setShown(value);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / (duration * 1000));
      const eased = 1 - Math.pow(1 - p, 3);
      setShown(`${pre}${fmt(target * eased)}${post}`);
      if (p < 1) raf = requestAnimationFrame(tick);
      else setShown(value);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // match is derived from value; value is the real dependency
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, reduce, value, duration]);

  return (
    <span ref={ref} className={className} aria-label={value}>
      <span aria-hidden="true">{shown}</span>
    </span>
  );
}

/** Pill button that leans toward the cursor and fills on hover. */
export function MagneticLink({
  href,
  children,
  variant = 'solid',
  className = '',
  external = false,
}: {
  href: string;
  children: ReactNode;
  variant?: 'solid' | 'ghost' | 'light';
  className?: string;
  external?: boolean;
}) {
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 18, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 220, damping: 18, mass: 0.4 });

  const onMove = (e: React.MouseEvent<HTMLElement>) => {
    if (reduce) return;
    const r = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * 0.25);
    y.set((e.clientY - (r.top + r.height / 2)) * 0.35);
  };
  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  const skin =
    variant === 'solid'
      ? 'bg-white text-[#05070d]'
      : variant === 'light'
        ? 'bg-[#05070d] text-white'
        : 'border border-white/25 text-white backdrop-blur-md bg-white/[0.04]';
  const fill = variant === 'solid' ? 'bg-[#1d4ed8]' : variant === 'light' ? 'bg-[#1d4ed8]' : 'bg-white';
  const hoverText = variant === 'ghost' ? 'group-hover:text-[#05070d]' : 'group-hover:text-white';

  const inner = (
    <>
      <span aria-hidden="true" className={`absolute inset-0 origin-bottom scale-y-0 rounded-full ${fill} transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-y-100`} />
      <span className={`relative flex items-center gap-2 transition-colors duration-300 ${hoverText}`}>
        {children}
        <ArrowUpRight size={16} className="transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:rotate-45" />
      </span>
    </>
  );

  const cls = `nh-btn group relative inline-flex items-center overflow-hidden rounded-full px-6 py-3.5 text-sm font-semibold ${skin} ${className}`;
  return (
    <motion.span style={{ x: sx, y: sy }} className="inline-block" onMouseMove={onMove} onMouseLeave={onLeave}>
      {external ? (
        <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
          {inner}
        </a>
      ) : (
        <Link href={href} className={cls}>
          {inner}
        </Link>
      )}
    </motion.span>
  );
}

/** Small uppercase section label with a leading signal dot. */
export function Eyebrow({ children, tone = 'dark' }: { children: ReactNode; tone?: 'dark' | 'light' }) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] ${
        tone === 'dark' ? 'border border-white/15 bg-white/[0.04] text-white/70' : 'border border-[#0a1024]/10 bg-white text-[#0a1024]/60'
      }`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-[#a3e635] shadow-[0_0_10px_#a3e635]" />
      {children}
    </span>
  );
}

/** Film grain overlay for dark scenes. */
export function Grain({ opacity = 0.07 }: { opacity?: number }) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 mix-blend-overlay"
      style={{ backgroundImage: GRAIN, opacity }}
    />
  );
}
