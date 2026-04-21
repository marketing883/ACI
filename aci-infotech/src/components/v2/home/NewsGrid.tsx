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
  // Show real published news items. Placeholders are only used when
  // the CMS returns nothing at all (e.g. local dev without data access).
  const list = (items.length > 0 ? items : PLACEHOLDERS).slice(0, 4);

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
        <SectionHead headline="Press and" emphasized="announcements." />

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
                minHeight: 340,
                color: 'var(--v2-text-primary)',
                textDecoration: 'none',
                overflow: 'hidden',
                transition: 'transform 300ms var(--v2-ease), border-color 300ms var(--v2-ease)',
              }}
            >
              {/* Featured image (or fallback pattern) */}
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  aspectRatio: '16 / 9',
                  background: 'var(--v2-surface-2)',
                  overflow: 'hidden',
                }}
              >
                {n.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={n.image_url}
                    alt={n.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block',
                    }}
                    loading="lazy"
                  />
                ) : (
                  <div
                    aria-hidden
                    style={{
                      position: 'absolute',
                      inset: 0,
                      backgroundImage:
                        'linear-gradient(var(--v2-border-subtle) 1px, transparent 1px), linear-gradient(90deg, var(--v2-border-subtle) 1px, transparent 1px)',
                      backgroundSize: '20px 20px',
                      opacity: 0.6,
                    }}
                  />
                )}
              </div>

              {/* Text content */}
              <div
                style={{
                  padding: 22,
                  display: 'flex',
                  flexDirection: 'column',
                  flex: 1,
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
                    marginBottom: 14,
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
                    fontSize: 17,
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
                    marginTop: 18,
                  }}
                >
                  Read release →
                </span>
              </div>
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
  headline,
  emphasized,
  aside,
}: {
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
              color: 'var(--v2-accent)',
            }}
          >
            {emphasized}
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
