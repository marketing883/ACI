'use client';

/**
 * NewsGrid — 4-card dark grid of recent press items. Data is real,
 * pulled from Supabase news table. Falls back to a placeholder set when
 * the CMS returns nothing so the preview still looks right in dev.
 */

import type { HomeNewsItem } from '@/lib/v2/fetch-home-data';

const PLACEHOLDERS: HomeNewsItem[] = [
  {
    id: 'n1',
    title: "ACI Infotech named a Major Contender in Everest Group's GenAI Services PEAK Matrix",
    excerpt: null,
    source: 'Business Wire',
    external_url: null,
    published_at: '2026-04-01',
    image_url: null,
  },
  {
    id: 'n2',
    title: 'ACI opens new AI engineering hub in Toronto, adding 300 roles this year',
    excerpt: null,
    source: 'Company',
    external_url: null,
    published_at: '2026-03-10',
    image_url: null,
  },
  {
    id: 'n3',
    title: 'Expanded strategic partnership with Databricks across North America',
    excerpt: null,
    source: 'Partnership',
    external_url: null,
    published_at: '2026-02-18',
    image_url: null,
  },
  {
    id: 'n4',
    title: "Forbes recognizes ACI on America's Best Management Consulting list for 2026",
    excerpt: null,
    source: 'Awards',
    external_url: null,
    published_at: '2026-01-22',
    image_url: null,
  },
];

function formatDate(iso: string | null): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

export default function NewsGrid({ items }: { items: HomeNewsItem[] }) {
  const list = (items.length >= 2 ? items : PLACEHOLDERS).slice(0, 4);

  return (
    <section
      id="news"
      style={{
        background: 'var(--v2-bg)',
        paddingTop: 'var(--v2-section-py)',
        paddingBottom: 'var(--v2-section-py)',
        paddingLeft: 'var(--v2-container-px)',
        paddingRight: 'var(--v2-container-px)',
        borderTop: '1px solid var(--v2-border-subtle)',
      }}
    >
      <div style={{ maxWidth: 'var(--v2-container-max)', margin: '0 auto' }}>
        <SectionHead label="News · 005" headline="In the" emphasized="press." />

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: 16,
            marginTop: 48,
          }}
        >
          {list.map((n) => (
            <a
              key={n.id}
              href={n.external_url ?? '/news'}
              target={n.external_url ? '_blank' : undefined}
              rel={n.external_url ? 'noopener noreferrer' : undefined}
              className="v2-news-card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                background: 'var(--v2-surface-1)',
                border: '1px solid var(--v2-border-subtle)',
                borderRadius: 6,
                padding: 24,
                minHeight: 280,
                color: 'var(--v2-text-primary)',
                textDecoration: 'none',
                transition: 'transform 300ms var(--v2-ease), border-color 300ms var(--v2-ease)',
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 10,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: 'var(--v2-text-muted)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: 32,
                }}
              >
                <span>{n.source ?? 'News'}</span>
                <strong style={{ color: 'var(--v2-text-secondary)', fontWeight: 500 }}>
                  {formatDate(n.published_at)}
                </strong>
              </div>
              <h4
                style={{
                  fontFamily: 'var(--font-title)',
                  fontSize: 18,
                  fontWeight: 600,
                  lineHeight: 1.3,
                  letterSpacing: '-0.01em',
                  margin: 0,
                  color: 'var(--v2-text-primary)',
                  flex: 1,
                }}
              >
                {n.title}
              </h4>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 11,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'var(--v2-accent)',
                  marginTop: 24,
                }}
              >
                Read release →
              </span>
            </a>
          ))}
        </div>

        <style>{`
          .v2-news-card:hover {
            transform: translateY(-4px);
            border-color: var(--v2-accent);
          }
        `}</style>
      </div>
    </section>
  );
}

export function SectionHead({
  label,
  headline,
  emphasized,
  aside,
}: {
  label: string;
  headline: string;
  emphasized: string;
  aside?: string;
}) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        gap: 32,
        flexWrap: 'wrap',
      }}
    >
      <div>
        <div
          style={{
            color: 'var(--v2-accent)',
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
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: 'var(--v2-accent)',
              boxShadow: '0 0 8px var(--v2-accent)',
              display: 'inline-block',
            }}
          />
          {label}
        </div>
        <h2
          style={{
            fontFamily: 'var(--font-title)',
            fontSize: 'clamp(32px, 5vw, 68px)',
            lineHeight: 0.95,
            letterSpacing: '-0.03em',
            fontWeight: 700,
            color: 'inherit',
            margin: 0,
            maxWidth: 900,
          }}
        >
          {headline}{' '}
          <em
            style={{
              fontStyle: 'italic',
              fontWeight: 500,
              position: 'relative',
              display: 'inline-block',
            }}
          >
            <span style={{ position: 'relative', zIndex: 1 }}>{emphasized}</span>
            <span
              aria-hidden
              style={{
                position: 'absolute',
                left: -4,
                right: -4,
                bottom: '0.1em',
                height: '0.14em',
                background: 'var(--v2-accent)',
                zIndex: 0,
              }}
            />
          </em>
        </h2>
      </div>
      {aside && (
        <p
          style={{
            color: 'var(--v2-text-secondary)',
            fontSize: 15,
            lineHeight: 1.6,
            maxWidth: 380,
            margin: 0,
          }}
        >
          {aside}
        </p>
      )}
    </div>
  );
}
