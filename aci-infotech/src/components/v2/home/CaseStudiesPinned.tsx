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
import StackChip from './StackChip';

/**
 * Trim a potentially long challenge/solution string to a homepage-friendly
 * excerpt. Strips any HTML, collapses whitespace, tries to end on a word
 * boundary, and appends an ellipsis when truncated.
 */
function excerpt(text: string | null | undefined, maxChars: number): string {
  if (!text) return '';
  const plain = text.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
  if (plain.length <= maxChars) return plain;
  const cut = plain.slice(0, maxChars);
  const lastSpace = cut.lastIndexOf(' ');
  const base = lastSpace > maxChars * 0.6 ? cut.slice(0, lastSpace) : cut;
  return base.replace(/[,;:\-\s]+$/, '') + '…';
}

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

  // Render exactly what the CMS returned. If the admin publishes two
  // featured case studies, the horizontal scroll shows two. Placeholders
  // are only used when the CMS is completely empty (dev without data,
  // misconfigured env, etc.) so the preview still demonstrates the
  // intended layout.
  const slides = (caseStudies.length > 0 ? caseStudies : PLACEHOLDERS).slice(0, 4);

  const { scrollYProgress } = useScroll({
    target: stageRef,
    offset: ['start start', 'end end'],
  });

  // Translate X moves the track by (slideCount - 1) viewport widths so the
  // last slide ends flush with the right edge of the viewport. Hardcoded
  // -75% is only correct for exactly 4 slides — generalize it here.
  const translateEnd = slides.length > 1 ? `-${(slides.length - 1) * 100}vw` : '0vw';
  const x = useTransform(scrollYProgress, [0, 1], ['0vw', translateEnd]);

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
            // Anchor slide content to the top of the viewport so the
            // title and eyebrow are always visible. Centering clipped
            // the top of tall slides equally with the bottom.
            alignItems: 'flex-start',
          }}
        >
          {/* Progress rail (right edge) */}
          <RailProgress count={slides.length} progress={scrollYProgress} labels={slides.map((s, i) => `${String(i + 1).padStart(2, '0')} · ${getShortLabel(s)}`)} />

          {/* Slides track. Each slide is explicitly 100vw wide so the
              horizontal scroll math stays correct regardless of the
              number of slides the CMS returned. */}
          <motion.div
            style={{
              x,
              display: 'flex',
              width: `${slides.length * 100}vw`,
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
        <h2
          style={{
            fontFamily: 'var(--font-title)',
            fontSize: 'clamp(32px, 5vw, 68px)',
            lineHeight: 0.95,
            letterSpacing: '-0.03em',
            fontWeight: 700,
            color: 'var(--v2-text-primary)',
            margin: 0,
          }}
        >
          Receipts,{' '}
          <em style={{ fontStyle: 'italic', fontWeight: 500, position: 'relative', display: 'inline-block' }}>
            <span style={{ position: 'relative', zIndex: 1 }}>not references.</span>
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
        Four production engagements. The outcome we signed up for, and the
        metric that tells you we hit it.
      </p>
    </div>
  );
}

function CaseSlide({ slide, theme }: { slide: HomeCaseStudy; theme: (typeof THEMES)[number] }) {
  return (
    <article
      style={{
        width: '100vw',
        flex: '0 0 100vw',
        background: `linear-gradient(135deg, ${theme.bg} 0%, var(--v2-bg) 100%)`,
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)',
        gap: 60,
        // Top-heavy padding: breathing room above the title, minimal
        // padding below since content anchors from the top of the pin.
        padding: '80px 80px 32px',
        alignItems: 'start',
      }}
    >
      <CaseSlideContent slide={slide} theme={theme} />
    </article>
  );
}

/**
 * CaseSlideContent — the per-slide content.
 *
 * Left column: the story
 *   - industry + anonymized client descriptor (never the real name)
 *   - title
 *   - short excerpt from the challenge/problem statement
 *   - a short solution summary
 *   - the stack as monochrome logo chips
 *   - CTA to the full case study
 *
 * Right column: the impact
 *   - every measured outcome from the CMS, rendered as stacked tiles
 *   - lime accent border on each tile to echo the theme
 */
function CaseSlideContent({ slide, theme }: { slide: HomeCaseStudy; theme: (typeof THEMES)[number] }) {
  const anon = displayClient({ client_descriptor: slide.client_descriptor });
  const problemExcerpt = excerpt(slide.challenge, 200);
  const solutionExcerpt = excerpt(slide.solution, 180);
  const impactMetrics = slide.metrics.slice(0, 4);
  const stack = slide.technologies.slice(0, 7);

  return (
    <>
      {/* LEFT — the story */}
      <div style={{ position: 'relative', zIndex: 2, minWidth: 0 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            marginBottom: 18,
            flexWrap: 'wrap',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: theme.accent,
            }}
          >
            {slide.industry ?? 'Case study'}
          </span>
          <span
            aria-hidden
            style={{
              width: 4,
              height: 4,
              borderRadius: '50%',
              background: 'var(--v2-border-strong)',
              display: 'inline-block',
            }}
          />
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 12,
              color: 'var(--v2-text-secondary)',
            }}
          >
            {anon}
          </span>
        </div>

        <h3
          style={{
            fontFamily: 'var(--font-title)',
            fontSize: 'clamp(22px, 2.6vw, 38px)',
            fontWeight: 700,
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
            color: 'var(--v2-text-primary)',
            margin: '0 0 18px 0',
            maxWidth: 640,
          }}
        >
          {slide.title}
        </h3>

        {problemExcerpt && (
          <p
            style={{
              color: 'var(--v2-text-secondary)',
              fontSize: 15,
              lineHeight: 1.6,
              maxWidth: 600,
              margin: '0 0 22px 0',
            }}
          >
            {problemExcerpt}
          </p>
        )}

        {solutionExcerpt && (
          <div style={{ margin: '0 0 24px 0', maxWidth: 600 }}>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 10,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: 'var(--v2-text-muted)',
                marginBottom: 8,
              }}
            >
              Solution
            </div>
            <p
              style={{
                color: 'var(--v2-text-primary)',
                fontSize: 14,
                lineHeight: 1.55,
                margin: 0,
              }}
            >
              {solutionExcerpt}
            </p>
          </div>
        )}

        {stack.length > 0 && (
          <div style={{ margin: '0 0 28px 0' }}>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 10,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: 'var(--v2-text-muted)',
                marginBottom: 10,
              }}
            >
              Stack
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {stack.map((t) => (
                <StackChip key={t} label={t} compact />
              ))}
            </div>
          </div>
        )}

        <Link
          href={`/case-studies/${slide.slug}`}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '12px 18px',
            background: 'transparent',
            color: 'var(--v2-text-primary)',
            fontFamily: 'var(--font-sans)',
            fontSize: 12,
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

      {/* RIGHT — impact metrics stacked vertically */}
      <div style={{ position: 'relative', zIndex: 2, minWidth: 0 }}>
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'var(--v2-text-muted)',
            marginBottom: 16,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: theme.accent,
              boxShadow: `0 0 8px ${theme.accent}`,
              display: 'inline-block',
            }}
          />
          Impact delivered
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {impactMetrics.length === 0 && (
            <div
              style={{
                padding: '20px',
                background: 'var(--v2-surface-2)',
                border: '1px solid var(--v2-border-subtle)',
                borderRadius: 4,
                color: 'var(--v2-text-muted)',
                fontSize: 13,
              }}
            >
              Impact metrics not published yet.
            </div>
          )}
          {impactMetrics.map((m) => (
            <div
              key={m.label}
              style={{
                borderLeft: `2px solid ${theme.accent}`,
                padding: '16px 18px',
                background: 'var(--v2-surface-2)',
                border: '1px solid var(--v2-border-subtle)',
                borderLeftWidth: 2,
                borderLeftColor: theme.accent,
                borderRadius: 4,
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-title)',
                  fontSize: 'clamp(28px, 3vw, 42px)',
                  fontWeight: 700,
                  letterSpacing: '-0.02em',
                  color: theme.accent,
                  lineHeight: 1,
                }}
              >
                {m.value}
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 10,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: 'var(--v2-text-secondary)',
                  marginTop: 8,
                  lineHeight: 1.4,
                }}
              >
                {m.label}
              </div>
              {m.description && (
                <div
                  style={{
                    color: 'var(--v2-text-muted)',
                    fontSize: 12,
                    lineHeight: 1.5,
                    marginTop: 6,
                  }}
                >
                  {m.description}
                </div>
              )}
            </div>
          ))}
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
