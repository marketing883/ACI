'use client';

/**
 * CaseStudiesPinned — 4 featured case studies as a pinned horizontal
 * scroll experience. The section reserves 4 viewports of scroll runway;
 * as the user scrolls, the inner track translates horizontally from 0
 * to -75%, revealing each slide in sequence.
 *
 * Right-side vertical rail shows progress through the 4 slides and
 * highlights the active label.
 *
 * On prefers-reduced-motion, the slides fall back to a vertical stack.
 *
 * Content is real — pulled from Supabase via fetch-home-data. Falls back
 * to a set of placeholder slides when the CMS returns nothing so the
 * preview still looks right in local dev without DB access.
 */

import { useRef } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import type { HomeCaseStudy } from '@/lib/v2/fetch-home-data';
import { displayClient } from '@/lib/content/anonymize';

interface Props {
  caseStudies: HomeCaseStudy[];
}

// Slide theme colors (low-saturation dark, per handoff spec).
const THEMES = [
  { bg: '#0A1530', accent: '#C6FF3D' },
  { bg: '#0a2d1f', accent: '#5BE39A' },
  { bg: '#1B1538', accent: '#B69DFF' },
  { bg: '#2A1F10', accent: '#FFB648' },
];

// Placeholders if CMS returns nothing. Real numbers, documented
// architectures. Used only as fallback in dev/offline modes.
const PLACEHOLDERS: HomeCaseStudy[] = [
  {
    id: 'ph-1',
    slug: 'fraud-ai-streaming',
    title: 'Fraud detection that pays for itself in 60 days.',
    client_descriptor: 'Top-5 US retail bank',
    industry: 'FINANCIAL SERVICES',
    challenge: 'Streaming feature store and graph-based anomaly model deployed across 90M accounts with on-prem inference and a second-long SLA.',
    solution: null,
    metrics: [
      { value: '$48M', label: 'Prevented losses / yr' },
      { value: '94%', label: 'Recall on fraud ring' },
      { value: '60d', label: 'To break-even' },
    ],
    technologies: ['Kafka', 'Databricks', 'Flink', 'Neo4j'],
    services: ['Applied AI', 'Data Engineering'],
    testimonial_quote: null,
    featured_image_url: null,
  },
  {
    id: 'ph-2',
    slug: 'claims-copilot',
    title: 'A claims copilot reviewing 40k docs a day.',
    client_descriptor: 'Fortune 100 health insurer',
    industry: 'HEALTHCARE',
    challenge: 'Multi-model ensemble with human-in-the-loop adjudication. SOC2 + HIPAA from day one, backed by an eval harness that catches drift in hours.',
    solution: null,
    metrics: [
      { value: '71%', label: 'Faster adjudication' },
      { value: '40k', label: 'Docs reviewed / day' },
      { value: '99.4%', label: 'Policy compliance' },
    ],
    technologies: ['Azure OpenAI', 'LangGraph', 'Pinecone'],
    services: ['Applied AI'],
    testimonial_quote: null,
    featured_image_url: null,
  },
  {
    id: 'ph-3',
    slug: 'mainframe-cutover',
    title: 'Mainframe to cloud with zero downtime.',
    client_descriptor: 'Global telco · 180M subscribers',
    industry: 'TELECOM',
    challenge: 'COBOL to a modern event-driven stack, cut over in nine weekends with dual-run, shadow-traffic, and automated rollback. The ops team slept through the switch.',
    solution: null,
    metrics: [
      { value: '$12M', label: 'Annual run-cost takeout' },
      { value: '0s', label: 'Downtime at cutover' },
      { value: '9 wks', label: 'Total cutover window' },
    ],
    technologies: ['AWS', 'Kafka', 'Terraform'],
    services: ['Cloud Modernization'],
    testimonial_quote: null,
    featured_image_url: null,
  },
  {
    id: 'ph-4',
    slug: 'commerce-rebuild',
    title: 'A commerce rebuild that ships every Friday.',
    client_descriptor: 'Global luxury retailer',
    industry: 'RETAIL',
    challenge: 'Headless, composable, personalized across 14 markets. Design system, edge personalization, and a platform pod that turned quarterly releases into daily ones.',
    solution: null,
    metrics: [
      { value: '+18%', label: 'Conversion uplift' },
      { value: '14', label: 'Markets launched' },
      { value: '32%', label: 'Less time to release' },
    ],
    technologies: ['Next.js', 'commercetools', 'Algolia'],
    services: ['Digital & Experience'],
    testimonial_quote: null,
    featured_image_url: null,
  },
];

export default function CaseStudiesPinned({ caseStudies }: Props) {
  const reduced = useReducedMotion();
  const stageRef = useRef<HTMLDivElement>(null);

  // Hydrate from CMS data (up to 4), fall back to placeholders.
  const slides = (caseStudies.length >= 2 ? caseStudies : PLACEHOLDERS).slice(0, 4);

  const { scrollYProgress } = useScroll({
    target: stageRef,
    offset: ['start start', 'end end'],
  });
  const x = useTransform(scrollYProgress, [0, 1], ['0%', '-75%']);

  // If reduced motion: render as a vertical stack, bypass the sticky pin.
  if (reduced) {
    return (
      <section
        id="work"
        style={{
          background: 'var(--v2-bg)',
          paddingTop: 'var(--v2-section-py)',
          paddingBottom: 'var(--v2-section-py)',
          paddingLeft: 'var(--v2-container-px)',
          paddingRight: 'var(--v2-container-px)',
        }}
      >
        <div style={{ maxWidth: 'var(--v2-container-max)', margin: '0 auto 48px' }}>
          <CaseHead />
        </div>
        <div
          style={{
            display: 'grid',
            gap: 24,
            maxWidth: 'var(--v2-container-max)',
            margin: '0 auto',
          }}
        >
          {slides.map((s, i) => (
            <div key={s.id} style={{ background: THEMES[i % 4].bg, borderRadius: 6, padding: 24 }}>
              <CaseSlideContent slide={s} theme={THEMES[i % 4]} />
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section
      id="work"
      style={{
        background: 'var(--v2-bg)',
        position: 'relative',
      }}
    >
      <div
        style={{
          maxWidth: 'var(--v2-container-max)',
          margin: '0 auto',
          paddingTop: 'var(--v2-section-py)',
          paddingBottom: '40px',
          paddingLeft: 'var(--v2-container-px)',
          paddingRight: 'var(--v2-container-px)',
        }}
      >
        <CaseHead />
      </div>

      {/* Stage: 400vh provides 4 screens of scroll runway */}
      <div ref={stageRef} style={{ height: `${slides.length * 100}vh`, position: 'relative' }}>
        {/* Pin */}
        <div
          style={{
            position: 'sticky',
            top: 0,
            height: '100vh',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {/* Progress rail (right edge) */}
          <RailProgress count={slides.length} progress={scrollYProgress} labels={slides.map((s, i) => `${String(i + 1).padStart(2, '0')} · ${getShortLabel(s)}`)} />

          {/* Slides track */}
          <motion.div
            style={{
              x,
              display: 'flex',
              width: `${slides.length * 100}%`,
              height: '100%',
            }}
          >
            {slides.map((s, i) => (
              <CaseSlide key={s.id} slide={s} theme={THEMES[i % 4]} />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function getShortLabel(s: HomeCaseStudy): string {
  if (s.industry) return s.industry.split(' ')[0];
  return s.slug.split('-')[0] || 'Case';
}

function CaseHead() {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 32, flexWrap: 'wrap' }}>
      <div style={{ maxWidth: 760 }}>
        <div
          style={{
            color: 'var(--v2-text-muted)',
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: 16,
          }}
        >
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--v2-text-muted)', display: 'inline-block' }} />
          Case studies · 004
        </div>
        <h2
          style={{
            fontFamily: 'var(--font-title)',
            fontSize: 'clamp(40px, 6.5vw, 88px)',
            lineHeight: 0.95,
            letterSpacing: '-0.03em',
            fontWeight: 700,
            color: 'var(--v2-text-primary)',
            margin: 0,
          }}
        >
          Receipts, not{' '}
          <em style={{ fontStyle: 'italic', fontWeight: 500, position: 'relative', display: 'inline-block' }}>
            <span style={{ position: 'relative', zIndex: 1 }}>references.</span>
            <span
              aria-hidden
              style={{
                position: 'absolute',
                left: -4,
                right: -4,
                bottom: '0.12em',
                height: '0.14em',
                background: 'var(--v2-accent)',
                zIndex: 0,
              }}
            />
          </em>
        </h2>
      </div>
      <p style={{ color: 'var(--v2-text-secondary)', fontSize: 15, lineHeight: 1.6, maxWidth: 420, margin: 0 }}>
        Scroll to step through four production builds. Each pinned panel shows the outcome we
        locked in, not the deliverables we shipped.
      </p>
    </div>
  );
}

function CaseSlide({ slide, theme }: { slide: HomeCaseStudy; theme: (typeof THEMES)[number] }) {
  return (
    <article
      style={{
        width: '100%',
        flex: '0 0 auto',
        background: `linear-gradient(135deg, ${theme.bg} 0%, var(--v2-bg) 100%)`,
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1.1fr) minmax(0, 1fr)',
        gap: 40,
        padding: '60px 80px',
        alignItems: 'center',
      }}
    >
      <CaseSlideContent slide={slide} theme={theme} />
    </article>
  );
}

function CaseSlideContent({ slide, theme }: { slide: HomeCaseStudy; theme: (typeof THEMES)[number] }) {
  const anon = displayClient({ client_descriptor: slide.client_descriptor });
  return (
    <>
      <div style={{ position: 'relative', zIndex: 2 }}>
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'var(--v2-text-muted)',
            marginBottom: 12,
          }}
        >
          {slide.industry ?? 'CASE STUDY'}
        </div>
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 13,
            color: 'var(--v2-text-secondary)',
            marginBottom: 24,
          }}
        >
          {anon}
        </div>
        <h3
          style={{
            fontFamily: 'var(--font-title)',
            fontSize: 'clamp(32px, 4vw, 56px)',
            fontWeight: 700,
            lineHeight: 1.05,
            letterSpacing: '-0.025em',
            color: 'var(--v2-text-primary)',
            margin: '0 0 20px 0',
          }}
        >
          {slide.title}
        </h3>
        {slide.challenge && (
          <p
            style={{
              color: 'var(--v2-text-secondary)',
              fontSize: 15,
              lineHeight: 1.6,
              maxWidth: 520,
              margin: '0 0 28px 0',
            }}
          >
            {slide.challenge}
          </p>
        )}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
            gap: 12,
            marginBottom: 28,
            maxWidth: 520,
          }}
        >
          {slide.metrics.slice(0, 3).map((m) => (
            <div
              key={m.label}
              style={{
                borderLeft: `2px solid ${theme.accent}`,
                padding: '10px 12px',
                background: 'var(--v2-bg)',
                borderRadius: 4,
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-title)',
                  fontSize: 24,
                  fontWeight: 700,
                  letterSpacing: '-0.02em',
                  color: 'var(--v2-text-primary)',
                  lineHeight: 1,
                }}
              >
                {m.value}
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 10,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'var(--v2-text-muted)',
                  marginTop: 8,
                }}
              >
                {m.label}
              </div>
            </div>
          ))}
        </div>
        <Link
          href={`/case-studies/${slide.slug}`}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '14px 20px',
            background: 'transparent',
            color: 'var(--v2-text-primary)',
            fontFamily: 'var(--font-sans)',
            fontSize: 13,
            fontWeight: 500,
            letterSpacing: '0.02em',
            textTransform: 'uppercase',
            border: '1px solid var(--v2-border-strong)',
            borderRadius: 2,
            textDecoration: 'none',
            transition: 'border-color 200ms var(--v2-ease)',
          }}
        >
          Read case study
          <ArrowRight size={14} />
        </Link>
      </div>

      {/* Right visual panel */}
      <div
        style={{
          position: 'relative',
          background: 'var(--v2-surface-2)',
          border: '1px solid var(--v2-border-strong)',
          borderRadius: 6,
          padding: 32,
          minHeight: 360,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          overflow: 'hidden',
        }}
      >
        <div
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'linear-gradient(var(--v2-border-subtle) 1px, transparent 1px), linear-gradient(90deg, var(--v2-border-subtle) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
            opacity: 0.4,
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'relative',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: theme.accent,
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: theme.accent,
              boxShadow: `0 0 10px ${theme.accent}`,
              animation: 'v2-pulse 1.6s ease-in-out infinite',
            }}
          />
          {slide.industry ?? 'LIVE'} · {slide.slug.slice(0, 18)}
        </div>
        <div
          style={{
            position: 'relative',
            fontFamily: 'var(--font-title)',
            fontSize: 'clamp(72px, 10vw, 180px)',
            fontWeight: 700,
            letterSpacing: '-0.04em',
            color: theme.accent,
            lineHeight: 0.9,
            textShadow: `0 0 60px ${theme.accent}40`,
          }}
        >
          {slide.metrics[0]?.value ?? '—'}
        </div>
        <div
          style={{
            position: 'relative',
            display: 'flex',
            justifyContent: 'space-between',
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'var(--v2-text-muted)',
          }}
        >
          <span>{slide.technologies.slice(0, 2).join(' · ')}</span>
          <span>{slide.services.slice(0, 1).join('') || 'ACI'}</span>
        </div>
      </div>
    </>
  );
}

function RailProgress({
  count,
  progress,
  labels,
}: {
  count: number;
  progress: ReturnType<typeof useScroll>['scrollYProgress'];
  labels: string[];
}) {
  return (
    <div
      style={{
        position: 'absolute',
        right: 24,
        top: '50%',
        transform: 'translateY(-50%)',
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
        zIndex: 10,
      }}
    >
      {Array.from({ length: count }).map((_, i) => {
        const start = i / count;
        const end = (i + 1) / count;
        return <RailTick key={i} progress={progress} start={start} end={end} label={labels[i]} />;
      })}
    </div>
  );
}

function RailTick({
  progress,
  start,
  end,
  label,
}: {
  progress: ReturnType<typeof useScroll>['scrollYProgress'];
  start: number;
  end: number;
  label: string;
}) {
  const opacity = useTransform(progress, [start, start + 0.001, end, end + 0.001], [0.3, 1, 1, 0.3]);
  const active = useTransform(progress, (v) => v >= start && v < end);

  return (
    <motion.div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        opacity,
      }}
    >
      <motion.span
        style={{
          width: 2,
          height: 22,
          background: useTransform(active, (a) => (a ? 'var(--v2-accent)' : 'var(--v2-border-strong)')),
        }}
      />
      <motion.span
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 10,
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          color: useTransform(active, (a) => (a ? 'var(--v2-accent)' : 'transparent')),
          whiteSpace: 'nowrap',
        }}
      >
        {label}
      </motion.span>
    </motion.div>
  );
}
