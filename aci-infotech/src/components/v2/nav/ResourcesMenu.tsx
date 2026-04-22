'use client';

/**
 * ResourcesMenu — 4-column feature grid, one featured item per
 * resource type. Each card shows a 16:9 cover, mono category eyebrow,
 * title, and a category-appropriate CTA.
 *
 * Data comes in from the server (NavV2 orchestrator pre-fetches) so
 * hover is snappy and renderers aren't waiting on async calls.
 * Playbooks are sourced from the static PLAYBOOKS constant — they
 * don't live in the CMS.
 */

import { useRef } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { RESOURCES } from './menu-data';

export interface ResourcesMenuData {
  featuredCaseStudy?: {
    slug: string;
    title: string;
    featured_image_url: string | null;
  } | null;
  featuredWhitepaper?: {
    slug: string;
    title: string;
    cover_image: string | null;
  } | null;
  featuredBlog?: {
    slug: string;
    title: string;
    featured_image_url: string | null;
    category: string | null;
  } | null;
  featuredPlaybook?: {
    slug: string;
    title: string;
    category: string;
  } | null;
}

export default function ResourcesMenu({ data }: { data: ResourcesMenuData }) {
  const playbook = data.featuredPlaybook ?? null;
  const caseStudy = data.featuredCaseStudy ?? null;
  const whitepaper = data.featuredWhitepaper ?? null;
  const blog = data.featuredBlog ?? null;

  return (
    <div style={{ padding: '32px 36px' }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
          gap: 18,
        }}
      >
        <FeatureCard
          eyebrow={RESOURCES.playbooks.eyebrow}
          title={playbook?.title ?? 'Repeatable engagement models'}
          href={playbook ? `/playbooks/${playbook.slug}` : RESOURCES.playbooks.indexHref}
          cta={RESOURCES.playbooks.cta}
          image={null}
          tint="var(--v2-accent)"
        />
        <FeatureCard
          eyebrow={RESOURCES.work.eyebrow}
          title={caseStudy?.title ?? 'Production engagements across the portfolio'}
          href={caseStudy ? `/case-studies/${caseStudy.slug}` : RESOURCES.work.indexHref}
          cta={RESOURCES.work.cta}
          image={caseStudy?.featured_image_url ?? null}
        />
        <FeatureCard
          eyebrow={RESOURCES.whitepapers.eyebrow}
          title={whitepaper?.title ?? 'Research briefs and deep dives'}
          href={whitepaper ? `/whitepapers/${whitepaper.slug}` : RESOURCES.whitepapers.indexHref}
          cta={RESOURCES.whitepapers.cta}
          image={whitepaper?.cover_image ?? null}
        />
        <FeatureCard
          eyebrow={RESOURCES.insights.eyebrow}
          title={blog?.title ?? 'Perspectives from the practice'}
          href={blog ? `/blogs/${blog.slug}` : RESOURCES.insights.indexHref}
          cta={RESOURCES.insights.cta}
          image={blog?.featured_image_url ?? null}
          tag={blog?.category ?? null}
        />
      </div>

      {/* Footer strip */}
      <div
        style={{
          marginTop: 22,
          paddingTop: 16,
          borderTop: '1px dashed var(--v2-border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 16,
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'var(--v2-text-muted)',
          }}
        >
          / Index
        </span>
        <div
          style={{
            display: 'flex',
            gap: 24,
            flexWrap: 'wrap',
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
          }}
        >
          {Object.entries(RESOURCES).map(([key, res]) => (
            <Link
              key={key}
              href={res.indexHref}
              style={{
                color: 'var(--v2-text-secondary)',
                textDecoration: 'none',
              }}
              className="v2-res-index"
            >
              All {res.eyebrow.toLowerCase()}
            </Link>
          ))}
        </div>
        <style>{`
          .v2-res-index { transition: color 200ms var(--v2-ease); }
          .v2-res-index:hover { color: var(--v2-accent); }
        `}</style>
      </div>
    </div>
  );
}

interface FeatureCardProps {
  eyebrow: string;
  title: string;
  href: string;
  cta: string;
  image: string | null;
  tag?: string | null;
  tint?: string;
}

function FeatureCard({ eyebrow, title, href, cta, image, tag, tint }: FeatureCardProps) {
  const ref = useRef<HTMLAnchorElement>(null);

  return (
    <Link
      ref={ref}
      href={href}
      onMouseMove={(e) => {
        const el = ref.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        el.style.setProperty('--mx', `${e.clientX - rect.left}px`);
        el.style.setProperty('--my', `${e.clientY - rect.top}px`);
      }}
      className="v2-res-card"
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--v2-surface-2)',
        border: '1px solid var(--v2-border-subtle)',
        borderRadius: 6,
        overflow: 'hidden',
        textDecoration: 'none',
        color: 'var(--v2-text-primary)',
        transition: 'border-color 220ms var(--v2-ease), transform 220ms var(--v2-ease)',
      }}
    >
      {/* 16:9 cover */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          paddingBottom: '56.25%',
          background: image
            ? `url(${image}) center/cover no-repeat`
            : tint
              ? `linear-gradient(135deg, rgba(198, 255, 61, 0.12), rgba(198, 255, 61, 0.02))`
              : 'linear-gradient(135deg, var(--v2-surface-3), var(--v2-surface-2))',
          borderBottom: '1px solid var(--v2-border-subtle)',
          overflow: 'hidden',
        }}
      >
        <span
          aria-hidden
          className="v2-res-spotlight"
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(220px 160px at var(--mx, 50%) var(--my, 50%), rgba(198, 255, 61, 0.18), transparent 70%)',
            opacity: 0,
            transition: 'opacity 220ms var(--v2-ease)',
            pointerEvents: 'none',
          }}
        />
        <span
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(180deg, rgba(5, 11, 31, 0.0) 30%, rgba(5, 11, 31, 0.55) 100%)',
            pointerEvents: 'none',
          }}
        />
      </div>

      <div
        style={{
          padding: '14px 16px 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          flex: 1,
        }}
      >
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'var(--v2-accent)',
          }}
        >
          / {eyebrow}
          {tag && (
            <span
              style={{
                marginLeft: 8,
                color: 'var(--v2-text-muted)',
                fontSize: 10,
              }}
            >
              · {tag}
            </span>
          )}
        </div>
        <div
          style={{
            fontFamily: 'var(--font-title)',
            fontSize: 15,
            fontWeight: 600,
            lineHeight: 1.3,
            letterSpacing: '-0.01em',
            color: 'var(--v2-text-primary)',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {title}
        </div>
        <div
          style={{
            marginTop: 'auto',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'var(--v2-accent)',
          }}
        >
          {cta}
          <ArrowRight size={11} />
        </div>
      </div>

      <style>{`
        .v2-res-card:hover { border-color: var(--v2-border-hot); }
        .v2-res-card:hover .v2-res-spotlight { opacity: 1; }
      `}</style>
    </Link>
  );
}
