'use client';

/**
 * InsightsGrid — light-section color flip, 4 blog cards with dark
 * thumbnails that tag category via hue. Real data from the blog CMS;
 * falls back to placeholders when nothing is published.
 */

import Link from 'next/link';
import type { HomeBlogPost } from '@/lib/v2/fetch-home-data';

const PLACEHOLDERS: HomeBlogPost[] = [
  {
    id: 'b1',
    slug: 'llm-eval-enterprise-pilots',
    title: 'The evaluation problem: why most enterprise LLM pilots die in month 4',
    excerpt: null,
    category: 'GenAI',
    read_time_minutes: 8,
    published_at: '2026-04-14',
    featured_image_url: null,
  },
  {
    id: 'b2',
    slug: 'paved-roads-idp',
    title: 'Paved roads, not policy PDFs: how we stand up an IDP in 30 days',
    excerpt: null,
    category: 'Platform',
    read_time_minutes: 6,
    published_at: '2026-04-07',
    featured_image_url: null,
  },
  {
    id: 'b3',
    slug: 'lakehouse-audit-ready',
    title: 'Lakehouse patterns that survive audit, billing, and the on-call bridge',
    excerpt: null,
    category: 'Data',
    read_time_minutes: 12,
    published_at: '2026-03-29',
    featured_image_url: null,
  },
  {
    id: 'b4',
    slug: 'intentional-chaos',
    title: 'Why we pay engineers to intentionally break production once a quarter',
    excerpt: null,
    category: 'SRE',
    read_time_minutes: 5,
    published_at: '2026-03-18',
    featured_image_url: null,
  },
];

// Category hue for the thumbnail background. Matches design handoff.
const CATEGORY_COLORS: Record<string, { bg: string; glyph: string; glyphColor: string }> = {
  GenAI: { bg: '#0A1530', glyph: 'AI', glyphColor: '#C6FF3D' },
  AI: { bg: '#0A1530', glyph: 'AI', glyphColor: '#C6FF3D' },
  Platform: { bg: '#142146', glyph: '>_', glyphColor: '#9BE600' },
  Data: { bg: '#0a2d1f', glyph: '⊗', glyphColor: '#C6FF3D' },
  SRE: { bg: '#2a1236', glyph: '●', glyphColor: '#C6FF3D' },
  default: { bg: '#0A1530', glyph: '§', glyphColor: '#C6FF3D' },
};

function getCategoryColor(cat: string | null) {
  if (!cat) return CATEGORY_COLORS.default;
  return CATEGORY_COLORS[cat] ?? CATEGORY_COLORS.default;
}

function formatDate(iso: string | null): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
}

export default function InsightsGrid({ posts }: { posts: HomeBlogPost[] }) {
  // Show real published blog posts. Placeholders only used when the
  // CMS returns nothing at all (dev, misconfigured env).
  const list = (posts.length > 0 ? posts : PLACEHOLDERS).slice(0, 4);

  return (
    <section
      id="insights"
      style={{
        background: 'var(--v2-light-bg)',
        color: 'var(--v2-light-ink)',
        paddingTop: 'var(--v2-section-py)',
        paddingBottom: 'var(--v2-section-py)',
        paddingLeft: 'var(--v2-container-px)',
        paddingRight: 'var(--v2-container-px)',
      }}
    >
      <div style={{ maxWidth: 'var(--v2-container-max)', margin: '0 auto' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            gap: 32,
            flexWrap: 'wrap',
            marginBottom: 48,
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
                margin: 0,
              }}
            >
              Perspectives from the{' '}
              <em
                style={{
                  fontStyle: 'italic',
                  fontWeight: 500,
                  // Keep the emphasis dark so it reads on the light
                  // section surface. Lime-accent pops on dark, not here.
                  color: '#0A1530',
                }}
              >
                practice.
              </em>
            </h2>
            <p
              style={{
                color: '#627089',
                fontSize: 15,
                lineHeight: 1.6,
                marginTop: 16,
                marginBottom: 0,
                maxWidth: 520,
              }}
            >
              Architecture reviews, post-mortems, and technical write-ups
              from the teams running our client engagements.
            </p>
          </div>
          <Link
            href="/blogs"
            style={{
              color: '#627089',
              fontFamily: 'var(--font-mono)',
              fontSize: 12,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              textDecoration: 'none',
            }}
          >
            All insights →
          </Link>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: 20,
          }}
        >
          {list.map((p) => {
            const color = getCategoryColor(p.category);
            return (
              <Link
                key={p.id}
                href={`/blogs/${p.slug}`}
                className="v2-ins-card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  background: '#FFFFFF',
                  borderRadius: 6,
                  minHeight: 360,
                  color: '#0A1530',
                  textDecoration: 'none',
                  overflow: 'hidden',
                  transition: 'transform 300ms var(--v2-ease), box-shadow 300ms var(--v2-ease)',
                }}
              >
                {/* Thumbnail: real featured image when published, else a
                    category-hued fallback so the layout stays intact. */}
                <div
                  style={{
                    position: 'relative',
                    width: '100%',
                    aspectRatio: '16 / 9',
                    background: color.bg,
                    overflow: 'hidden',
                  }}
                >
                  {p.featured_image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={p.featured_image_url}
                      alt={p.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block',
                      }}
                      loading="lazy"
                    />
                  ) : (
                    <>
                      <div
                        aria-hidden
                        style={{
                          position: 'absolute',
                          inset: 0,
                          backgroundImage:
                            'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
                          backgroundSize: '20px 20px',
                        }}
                      />
                      <span
                        aria-hidden
                        style={{
                          position: 'absolute',
                          right: 16,
                          bottom: 8,
                          fontFamily: 'var(--font-title)',
                          fontSize: 64,
                          fontWeight: 700,
                          color: color.glyphColor,
                          opacity: 0.85,
                          letterSpacing: '-0.04em',
                        }}
                      >
                        {color.glyph}
                      </span>
                    </>
                  )}
                  {p.category && (
                    <span
                      style={{
                        position: 'absolute',
                        top: 12,
                        left: 12,
                        fontFamily: 'var(--font-mono)',
                        fontSize: 9,
                        letterSpacing: '0.18em',
                        textTransform: 'uppercase',
                        color: 'var(--v2-text-inverted)',
                        background: 'var(--v2-accent)',
                        padding: '3px 8px',
                        borderRadius: 2,
                      }}
                    >
                      {p.category}
                    </span>
                  )}
                </div>
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
                      letterSpacing: '0.14em',
                      textTransform: 'uppercase',
                      color: '#627089',
                      marginBottom: 10,
                    }}
                  >
                    {p.category ?? 'Article'}
                    {p.read_time_minutes ? ` · ${p.read_time_minutes} min read` : ''}
                  </div>
                  <h4
                    style={{
                      fontFamily: 'var(--font-title)',
                      fontSize: 17,
                      fontWeight: 600,
                      lineHeight: 1.3,
                      letterSpacing: '-0.01em',
                      margin: 0,
                      flex: 1,
                    }}
                  >
                    {p.title}
                  </h4>
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 11,
                      letterSpacing: '0.12em',
                      color: '#627089',
                      marginTop: 16,
                    }}
                  >
                    {formatDate(p.published_at)}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <style>{`
          .v2-ins-card:hover {
            transform: translateY(-6px);
            box-shadow: 0 30px 60px -20px rgba(10, 21, 48, 0.25);
          }
        `}</style>
      </div>
    </section>
  );
}
