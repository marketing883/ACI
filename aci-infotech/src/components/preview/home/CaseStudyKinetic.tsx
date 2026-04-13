'use client';

/**
 * CaseStudyKinetic - one case study rendered with its own "micro-identity"
 * (palette + animation metaphor) while sharing the structural grid with its
 * siblings. Three of these stack to form the kinetic case-studies section
 * on /preview/home.
 *
 * What this version fixes vs the previous build:
 *   - Real scroll-driven entrance: every text element fades and rises only
 *     when the article enters the viewport, in a deliberate stagger.
 *   - The huge metric counts up from zero (or animates to its glyph) when
 *     the article scrolls into view, instead of just popping in.
 *   - The right-side artwork animates in alongside the text, not silently.
 *   - Type rebalanced so the metric isn't deafening the meaning. The label
 *     under the metric is now a real sentence in display weight, the client
 *     descriptor is large and prominent, and the outcome paragraph leads.
 *
 * prefers-reduced-motion freezes both stagger and counter at final state.
 */

import Link from 'next/link';
import Image from 'next/image';
import {
  motion,
  useInView,
  useReducedMotion,
  useMotionValue,
  useTransform,
  animate,
} from 'framer-motion';
import { useEffect, useRef } from 'react';

export type KineticStudy = {
  id: string;
  slug: string;
  descriptor: string; // industry-and-scale phrase (e.g. "Fortune 500 Financial Services")
  industry: string; // chip label (e.g. "Financial Services")
  metric: string; // huge display value (e.g. "$12M" or "67%")
  metricLabel: string; // sentence under metric (e.g. "saved in year one")
  outcome: string; // one-line outcome sentence
  approach: string; // one-line approach sentence
  playbookUsed?: string;
  /**
   * Full URL of the case study's featured image (usually Supabase storage).
   * When present, the image fills the entire card as an atmospheric
   * background under a strong, consistent treatment. When absent, the
   * card falls back to the solid theme color and the generated art
   * stands on its own.
   */
  featuredImageUrl?: string;
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
  panelBg: string;
};

const THEMES: Record<Theme, ThemeConfig> = {
  industrial: {
    bg: '#15181d',
    accent: '#F5A524',
    text: '#fafafa',
    subtext: 'rgba(250,250,250,0.7)',
    hairline: 'rgba(245,165,36,0.4)',
    chipBg: 'rgba(245,165,36,0.12)',
    chipText: '#F5A524',
    panelBg: 'rgba(255,255,255,0.03)',
  },
  analytical: {
    bg: '#0A1A3A',
    accent: '#22D3EE',
    text: '#fafafa',
    subtext: 'rgba(250,250,250,0.7)',
    hairline: 'rgba(34,211,238,0.4)',
    chipBg: 'rgba(34,211,238,0.12)',
    chipText: '#22D3EE',
    panelBg: 'rgba(255,255,255,0.03)',
  },
  warm: {
    bg: '#FFF5EF',
    accent: '#E2553F',
    text: '#1A0E0A',
    subtext: 'rgba(26,14,10,0.72)',
    hairline: 'rgba(226,85,63,0.45)',
    chipBg: 'rgba(226,85,63,0.1)',
    chipText: '#B83A28',
    panelBg: 'rgba(26,14,10,0.04)',
  },
};

// Apple-style smooth out
const EASE_OUT = [0.16, 1, 0.3, 1] as const;

// ---------- Per-theme animated artwork ----------

function HeartbeatArt({ accent, animateIn }: { accent: string; animateIn: boolean }) {
  return (
    <svg viewBox="0 0 400 200" className="w-full h-auto" aria-hidden>
      <g stroke={accent} strokeOpacity="0.12" strokeWidth="0.5">
        {[40, 80, 120, 160].map((y) => (
          <line key={y} x1="0" y1={y} x2="400" y2={y} />
        ))}
      </g>
      <motion.path
        d="M0 110 L40 110 L50 30 L60 180 L80 110 L120 110 L130 50 L140 170 L160 110 L200 110 L210 40 L220 180 L240 110 L280 110 L290 60 L300 160 L320 110 L400 110"
        fill="none"
        stroke={accent}
        strokeWidth="1.5"
        strokeOpacity="0.35"
        initial={{ pathLength: 0 }}
        animate={animateIn ? { pathLength: 1 } : { pathLength: 0 }}
        transition={{ duration: 1.6, ease: EASE_OUT }}
      />
      <motion.path
        d="M0 130 L40 130 L60 128 L100 132 L140 130 L180 131 L220 129 L260 130 L300 131 L340 130 L400 130"
        fill="none"
        stroke={accent}
        strokeWidth="2.5"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={animateIn ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
        transition={{ duration: 1.2, ease: EASE_OUT, delay: 1.4 }}
      />
    </svg>
  );
}

function BarColumnsArt({ accent, animateIn }: { accent: string; animateIn: boolean }) {
  const heights = [40, 70, 55, 95, 60, 110, 85, 130, 100, 150];
  return (
    <svg viewBox="0 0 400 200" className="w-full h-auto" aria-hidden>
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
            animate={animateIn ? { scaleY: 1 } : { scaleY: 0 }}
            style={{ transformOrigin: `${x + 11}px 180px` }}
            transition={{ duration: 0.5, ease: EASE_OUT, delay: 0.08 * i }}
          />
        );
      })}
      <motion.circle
        cx={20 + 9 * 38 + 11}
        cy={180 - 150}
        r={4}
        fill={accent}
        initial={{ scale: 0 }}
        animate={animateIn ? { scale: 1 } : { scale: 0 }}
        transition={{ duration: 0.3, delay: 0.08 * 10 + 0.2, ease: EASE_OUT }}
      />
    </svg>
  );
}

function ConvergingLinesArt({ accent, animateIn }: { accent: string; animateIn: boolean }) {
  const lines = [
    'M0 30 Q120 30 200 100 T400 100',
    'M0 70 Q120 70 200 100 T400 100',
    'M0 110 Q120 110 200 100 T400 100',
    'M0 150 Q120 150 200 100 T400 100',
    'M0 190 Q120 190 200 100 T400 100',
  ];
  return (
    <svg viewBox="0 0 400 200" className="w-full h-auto" aria-hidden>
      {lines.map((d, i) => (
        <motion.path
          key={i}
          d={d}
          fill="none"
          stroke={accent}
          strokeWidth="1.5"
          strokeOpacity={0.45}
          initial={{ pathLength: 0 }}
          animate={animateIn ? { pathLength: 1 } : { pathLength: 0 }}
          transition={{ duration: 1.0, ease: 'easeInOut', delay: 0.15 * i }}
        />
      ))}
      <motion.path
        d="M200 100 L400 100"
        fill="none"
        stroke={accent}
        strokeWidth="3"
        initial={{ pathLength: 0 }}
        animate={animateIn ? { pathLength: 1 } : { pathLength: 0 }}
        transition={{ duration: 0.8, ease: EASE_OUT, delay: 1.1 }}
      />
    </svg>
  );
}

// ---------- Counter that animates the metric value ----------

/**
 * AnimatedMetric tries to count up to the numeric portion of `value` while
 * preserving the prefix (e.g. "$") and suffix (e.g. "M", "%") characters
 * verbatim. Falls back to printing the raw value when no numeric portion is
 * present (e.g. "<5 days") or when reduced motion is on.
 */
function AnimatedMetric({
  value,
  animateIn,
  reduced,
  className,
  style,
}: {
  value: string;
  animateIn: boolean;
  reduced: boolean;
  className?: string;
  style?: React.CSSProperties;
}) {
  const match = value.match(/^([^0-9.-]*)([0-9]+(?:\.[0-9]+)?)([^0-9].*)?$/);
  const count = useMotionValue(0);
  const target = match ? parseFloat(match[2]) : 0;
  // Decide whether to render decimals based on whether the source carries them.
  const hasDecimal = match && match[2].includes('.');
  const decimals = hasDecimal ? (match[2].split('.')[1]?.length ?? 0) : 0;
  const display = useTransform(count, (latest) =>
    decimals > 0 ? latest.toFixed(decimals) : Math.round(latest).toString(),
  );

  useEffect(() => {
    if (!match) return;
    if (reduced) {
      count.set(target);
      return;
    }
    if (!animateIn) return;
    const controls = animate(count, target, { duration: 1.4, ease: EASE_OUT });
    return controls.stop;
  }, [animateIn, reduced, target, count, match]);

  if (!match) {
    // Non-numeric metrics (e.g. "<5 days"): render verbatim, no count-up.
    return (
      <span className={className} style={style}>
        {value}
      </span>
    );
  }

  const [, prefix, , suffix] = match;
  return (
    <span className={className} style={style}>
      {prefix}
      <motion.span>{display}</motion.span>
      {suffix ?? ''}
    </span>
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
  // useInView with `once: true` already latches: once the article scrolls in
  // it stays true for the rest of the page lifetime, so we can derive
  // animateIn directly without an extra state hop.
  const inView = useInView(ref, { once: true, margin: '-15% 0px -15% 0px' });
  const animateIn = inView || reduced;

  const Art =
    theme === 'industrial'
      ? HeartbeatArt
      : theme === 'analytical'
        ? BarColumnsArt
        : ConvergingLinesArt;

  // Stagger pattern: descriptor -> outcome -> metric -> label -> approach -> footer
  const containerVariants = {
    hidden: {},
    show: {
      transition: { staggerChildren: 0.12, delayChildren: 0.05 },
    },
  };
  const lineUp = {
    hidden: { opacity: 0, y: 24 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: EASE_OUT },
    },
  };

  // True on dark themes. Used to pick the right blend mode for the image
  // treatment (multiply on dark bg, overlay on light bg so the warm
  // theme does not wash the photo out to white).
  const isDark = theme !== 'warm';
  const hasImage = Boolean(study.featuredImageUrl);

  return (
    <article
      ref={ref}
      className="relative py-20 md:py-28 lg:min-h-[85vh] flex items-center overflow-hidden"
      style={{ backgroundColor: t.bg, color: t.text }}
    >
      {/* Background: featured image fills the card when present. A
          consistent three-layer treatment sits on top so image quality
          differences between uploads always resolve to a single
          cohesive look: (1) the image itself, (2) a theme-color
          duotone via mix-blend, (3) a left-heavy gradient scrim that
          keeps text crisp on the left column while letting the image
          breathe on the right where the art panel sits. When no image
          is set, the solid theme bg already applied to the article
          carries the card. */}
      {hasImage && study.featuredImageUrl && (
        <>
          <Image
            src={study.featuredImageUrl}
            alt=""
            fill
            className="object-cover"
            sizes="100vw"
            aria-hidden
          />
          {/* Duotone tint toward the theme accent/base. Multiply on dark
              themes, overlay on the warm theme. */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundColor: t.bg,
              mixBlendMode: isDark ? 'multiply' : 'overlay',
              opacity: isDark ? 0.88 : 0.72,
            }}
            aria-hidden
          />
          {/* Legibility scrim: heavy left, thin right. Text column sits
              on the dark side, art panel on the lighter side. */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `linear-gradient(to right, ${t.bg} 0%, ${t.bg}F2 38%, ${t.bg}B3 72%, ${t.bg}80 100%)`,
            }}
            aria-hidden
          />
          {/* Soft vignette so edges don't feel square-cropped. */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.35) 100%)',
            }}
            aria-hidden
          />
        </>
      )}

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={animateIn ? 'show' : 'hidden'}
        className="relative z-10 w-full max-w-[1320px] mx-auto px-5 md:px-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center"
      >
        {/* LEFT: text column */}
        <div className="lg:col-span-7">
          {/* Top row: index + industry chip. Client descriptor moves into its
              own large line below so it actually reads as the headline subject. */}
          <motion.div
            variants={lineUp}
            className="flex items-center gap-4 mb-6 flex-wrap"
          >
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
              className="font-mono text-[10px] md:text-xs tracking-[0.2em] uppercase px-2.5 py-1"
              style={{ backgroundColor: t.chipBg, color: t.chipText }}
            >
              {study.industry}
            </span>
          </motion.div>

          {/* Client descriptor as the headline subject. Prominent, not buried. */}
          <motion.div
            variants={lineUp}
            className="mb-10 font-[var(--font-title)] font-medium"
            style={{
              fontSize: 'clamp(22px, 2.4vw, 32px)',
              lineHeight: 1.2,
              color: t.text,
            }}
          >
            {study.descriptor}
          </motion.div>

          {/* Metric + label - rebalanced. Metric is large but no longer
              shouting at 160px. Label is a real display sentence. */}
          <motion.div variants={lineUp} className="mb-10">
            <AnimatedMetric
              value={study.metric}
              animateIn={animateIn}
              reduced={reduced}
              className="block font-bold font-[var(--font-title)]"
              style={{
                fontSize: 'clamp(64px, 9vw, 120px)',
                lineHeight: 0.95,
                letterSpacing: '-0.04em',
                color: t.accent,
              }}
            />
            <div
              className="mt-3 max-w-[560px]"
              style={{
                fontSize: 'clamp(20px, 1.9vw, 26px)',
                lineHeight: 1.3,
                color: t.text,
                fontWeight: 500,
              }}
            >
              {study.metricLabel}
            </div>
          </motion.div>

          {/* Outcome */}
          <motion.p
            variants={lineUp}
            className="mb-5 max-w-[640px]"
            style={{ fontSize: 'clamp(17px, 1.5vw, 20px)', lineHeight: 1.5, color: t.text }}
          >
            {study.outcome}
          </motion.p>

          {/* Approach */}
          <motion.p
            variants={lineUp}
            className="mb-12 max-w-[640px]"
            style={{ fontSize: 'clamp(14px, 1.2vw, 16px)', lineHeight: 1.6, color: t.subtext }}
          >
            {study.approach}
          </motion.p>

          {/* Footer row: playbook used + read full link */}
          <motion.div
            variants={lineUp}
            className="flex items-center gap-6 flex-wrap"
          >
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
              <span>see how we built it</span>
              <span className="transition-transform duration-200 group-hover:translate-x-1">
                -&gt;
              </span>
            </Link>
          </motion.div>
        </div>

        {/* RIGHT: animated artwork. With a featured image behind, the
            panel reads as a frosted dashboard window floating over the
            scene: slightly translucent, blurred backdrop, hairline
            border in the theme accent. Without a featured image it
            falls back to the flat panel look. */}
        <motion.div variants={lineUp} className="lg:col-span-5">
          <div
            className="relative aspect-[2/1] rounded-sm p-6 md:p-8 backdrop-blur-md"
            style={{
              backgroundColor: hasImage
                ? isDark
                  ? 'rgba(10, 16, 28, 0.55)'
                  : 'rgba(255, 245, 239, 0.72)'
                : t.panelBg,
              border: `1px solid ${t.hairline}`,
              boxShadow: hasImage
                ? '0 10px 40px rgba(0,0,0,0.35)'
                : undefined,
            }}
          >
            <Art accent={t.accent} animateIn={animateIn} />
          </div>
        </motion.div>
      </motion.div>
    </article>
  );
}
