'use client';

/**
 * CaseStudyKinetic - one case study rendered with its own
 * "micro-identity" (palette + animation metaphor) while sharing the
 * structural grid with its siblings. Three of these stack to form the
 * kinetic case-studies section on /preview/home.
 *
 * Identity themes (assigned in order, data-agnostic):
 *   - 'industrial' : charcoal + amber, heartbeat-line SVG.
 *   - 'analytical' : deep blue + cyan, risk-dashboard bar columns.
 *   - 'warm'       : coral + off-white, converging journey lines.
 *
 * prefers-reduced-motion is respected: framer-motion freezes animations
 * via useReducedMotion and the SVG paths render at their final state.
 */

import Link from 'next/link';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { useRef } from 'react';

export type KineticStudy = {
  id: string;
  slug: string;
  descriptor: string; // industry-and-scale phrase (e.g. "Fortune 500 Financial Services")
  industry: string; // chip label (e.g. "Financial Services")
  metric: string; // huge display value (e.g. "$12M")
  metricLabel: string; // small line under metric (e.g. "saved year one")
  outcome: string; // one-line outcome
  approach: string; // one-line approach
  playbookUsed?: string;
};

export type Theme = 'industrial' | 'analytical' | 'warm';

type ThemeConfig = {
  bg: string;
  accent: string;
  text: string;
  subtext: string;
  hairline: string;
  chipBg: string;
  chipText: string;
};

const THEMES: Record<Theme, ThemeConfig> = {
  industrial: {
    bg: '#15181d',
    accent: '#F5A524',
    text: '#fafafa',
    subtext: 'rgba(250,250,250,0.65)',
    hairline: 'rgba(245,165,36,0.4)',
    chipBg: 'rgba(245,165,36,0.12)',
    chipText: '#F5A524',
  },
  analytical: {
    bg: '#0A1A3A',
    accent: '#22D3EE',
    text: '#fafafa',
    subtext: 'rgba(250,250,250,0.65)',
    hairline: 'rgba(34,211,238,0.4)',
    chipBg: 'rgba(34,211,238,0.12)',
    chipText: '#22D3EE',
  },
  warm: {
    bg: '#FFF5EF',
    accent: '#E2553F',
    text: '#1A0E0A',
    subtext: 'rgba(26,14,10,0.7)',
    hairline: 'rgba(226,85,63,0.45)',
    chipBg: 'rgba(226,85,63,0.1)',
    chipText: '#B83A28',
  },
};

// ---------- Per-theme animated artwork ----------

function HeartbeatArt({ accent, reduced }: { accent: string; reduced: boolean }) {
  // Downtime baseline -> collapse: a noisy line that flattens to near-zero.
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, margin: '-20% 0px -20% 0px' });
  const animate = inView && !reduced;

  return (
    <svg ref={ref} viewBox="0 0 400 200" className="w-full h-auto" aria-hidden>
      {/* Baseline grid */}
      <g stroke={accent} strokeOpacity="0.12" strokeWidth="0.5">
        {[40, 80, 120, 160].map((y) => (
          <line key={y} x1="0" y1={y} x2="400" y2={y} />
        ))}
      </g>
      {/* "Before" trace - high-noise heartbeat */}
      <motion.path
        d="M0 110 L40 110 L50 30 L60 180 L80 110 L120 110 L130 50 L140 170 L160 110 L200 110 L210 40 L220 180 L240 110 L280 110 L290 60 L300 160 L320 110 L400 110"
        fill="none"
        stroke={accent}
        strokeWidth="1.5"
        strokeOpacity="0.35"
        initial={{ pathLength: 0 }}
        animate={animate ? { pathLength: 1 } : { pathLength: 1 }}
        transition={{ duration: 1.4, ease: 'easeOut' }}
      />
      {/* "After" trace - flat, calm */}
      <motion.path
        d="M0 130 L40 130 L60 128 L100 132 L140 130 L180 131 L220 129 L260 130 L300 131 L340 130 L400 130"
        fill="none"
        stroke={accent}
        strokeWidth="2.5"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={
          animate ? { pathLength: 1, opacity: 1 } : { pathLength: 1, opacity: 1 }
        }
        transition={{ duration: 1.2, ease: 'easeOut', delay: 1.2 }}
      />
    </svg>
  );
}

function BarColumnsArt({ accent, reduced }: { accent: string; reduced: boolean }) {
  // Risk dashboard "coming online": columns grow from zero, right-aligned.
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, margin: '-20% 0px -20% 0px' });
  const animate = inView && !reduced;
  const heights = [40, 70, 55, 95, 60, 110, 85, 130, 100, 150];

  return (
    <svg ref={ref} viewBox="0 0 400 200" className="w-full h-auto" aria-hidden>
      {/* Baseline */}
      <line x1="0" y1="180" x2="400" y2="180" stroke={accent} strokeOpacity="0.3" strokeWidth="1" />
      {heights.map((h, i) => {
        const x = 20 + i * 38;
        return (
          <motion.rect
            key={i}
            x={x}
            y={180 - h}
            width={22}
            height={h}
            fill={accent}
            fillOpacity={0.7 - i * 0.04}
            initial={{ scaleY: 0 }}
            animate={animate ? { scaleY: 1 } : { scaleY: 1 }}
            style={{ transformOrigin: `${x + 11}px 180px` }}
            transition={{ duration: 0.45, ease: 'easeOut', delay: 0.08 * i }}
          />
        );
      })}
      {/* Cap dot on the tallest column */}
      <motion.circle
        cx={20 + 9 * 38 + 11}
        cy={180 - 150}
        r={4}
        fill={accent}
        initial={{ scale: 0 }}
        animate={animate ? { scale: 1 } : { scale: 1 }}
        transition={{ duration: 0.3, delay: 0.08 * 10 + 0.2 }}
      />
    </svg>
  );
}

function ConvergingLinesArt({ accent, reduced }: { accent: string; reduced: boolean }) {
  // Customer journeys converge into one path.
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, margin: '-20% 0px -20% 0px' });
  const animate = inView && !reduced;

  const lines = [
    'M0 30 Q120 30 200 100 T400 100',
    'M0 70 Q120 70 200 100 T400 100',
    'M0 110 Q120 110 200 100 T400 100',
    'M0 150 Q120 150 200 100 T400 100',
    'M0 190 Q120 190 200 100 T400 100',
  ];

  return (
    <svg ref={ref} viewBox="0 0 400 200" className="w-full h-auto" aria-hidden>
      {lines.map((d, i) => (
        <motion.path
          key={i}
          d={d}
          fill="none"
          stroke={accent}
          strokeWidth="1.5"
          strokeOpacity={0.45}
          initial={{ pathLength: 0 }}
          animate={animate ? { pathLength: 1 } : { pathLength: 1 }}
          transition={{ duration: 1.0, ease: 'easeInOut', delay: 0.15 * i }}
        />
      ))}
      {/* Convergence emphasis line */}
      <motion.path
        d="M200 100 L400 100"
        fill="none"
        stroke={accent}
        strokeWidth="3"
        initial={{ pathLength: 0 }}
        animate={animate ? { pathLength: 1 } : { pathLength: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut', delay: 1.1 }}
      />
    </svg>
  );
}

// ---------- Main component ----------

export default function CaseStudyKinetic({
  study,
  theme,
  index,
}: {
  study: KineticStudy;
  theme: Theme;
  index: number;
}) {
  const t = THEMES[theme];
  const reduced = useReducedMotion() ?? false;
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-15% 0px -15% 0px' });
  const animate = inView && !reduced;

  const Art =
    theme === 'industrial'
      ? HeartbeatArt
      : theme === 'analytical'
        ? BarColumnsArt
        : ConvergingLinesArt;

  return (
    <article
      ref={ref}
      className="relative py-20 md:py-28 lg:min-h-[85vh] flex items-center"
      style={{ backgroundColor: t.bg, color: t.text }}
    >
      <div className="relative w-full max-w-[1320px] mx-auto px-5 md:px-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
        {/* LEFT: text column */}
        <div className="lg:col-span-7">
          {/* Top row: index + descriptor + industry chip */}
          <div className="flex items-center gap-4 mb-8 flex-wrap">
            <span
              className="font-mono text-xs tracking-[0.25em] uppercase"
              style={{ color: t.subtext }}
            >
              CS-{(index + 1).toString().padStart(2, '0')}
            </span>
            <span
              className="block w-8 h-px"
              style={{ backgroundColor: t.hairline }}
            />
            <span
              className="font-mono text-xs tracking-[0.18em] uppercase"
              style={{ color: t.subtext }}
            >
              {study.descriptor}
            </span>
            <span
              className="ml-auto font-mono text-[10px] tracking-[0.2em] uppercase px-2.5 py-1"
              style={{ backgroundColor: t.chipBg, color: t.chipText }}
            >
              {study.industry}
            </span>
          </div>

          {/* HUGE METRIC */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={animate ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
            className="font-bold font-[var(--font-title)] mb-5"
            style={{
              fontSize: 'clamp(72px, 11vw, 160px)',
              lineHeight: 0.95,
              letterSpacing: '-0.04em',
              color: t.accent,
            }}
          >
            {study.metric}
          </motion.div>
          <div
            className="font-mono text-sm md:text-base tracking-wide mb-10"
            style={{ color: t.subtext }}
          >
            {study.metricLabel}
          </div>

          {/* Outcome */}
          <p
            className="mb-6 max-w-[640px]"
            style={{ fontSize: 'clamp(20px, 2vw, 28px)', lineHeight: 1.35, color: t.text }}
          >
            {study.outcome}
          </p>

          {/* Approach */}
          <p
            className="mb-12 max-w-[640px]"
            style={{ fontSize: 'clamp(15px, 1.3vw, 18px)', lineHeight: 1.55, color: t.subtext }}
          >
            {study.approach}
          </p>

          {/* Footer row: playbook used + read full link */}
          <div className="flex items-center gap-6 flex-wrap">
            {study.playbookUsed && (
              <div className="flex items-center gap-3">
                <span
                  className="font-mono text-[10px] tracking-[0.2em] uppercase"
                  style={{ color: t.subtext }}
                >
                  playbook used
                </span>
                <span
                  className="font-mono text-xs md:text-sm"
                  style={{ color: t.text }}
                >
                  {study.playbookUsed}
                </span>
              </div>
            )}
            <Link
              href={`/case-studies/${study.slug}`}
              className="ml-auto group inline-flex items-center gap-2 font-mono text-xs md:text-sm transition-colors"
              style={{ color: t.accent }}
            >
              <span>read full case study</span>
              <span className="transition-transform duration-200 group-hover:translate-x-1">
                -&gt;
              </span>
            </Link>
          </div>
        </div>

        {/* RIGHT: animated artwork */}
        <div className="lg:col-span-5">
          <div
            className="relative aspect-[2/1] rounded-sm p-6 md:p-8"
            style={{
              backgroundColor:
                theme === 'warm' ? 'rgba(26,14,10,0.04)' : 'rgba(255,255,255,0.03)',
              border: `1px solid ${t.hairline}`,
            }}
          >
            <Art accent={t.accent} reduced={reduced} />
          </div>
        </div>
      </div>
    </article>
  );
}
