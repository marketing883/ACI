'use client';

import Link from 'next/link';
import { Reveal, ArrowCircle } from './v4-motion';
import type { BlogListItem } from '@/lib/content/blog';

// Dev fallback rows; production receives live posts from the server.
const FALLBACK: Array<Pick<BlogListItem, 'slug' | 'title' | 'category' | 'published_at'>> = [
  {
    slug: 'vector-database-strategy-the-key-to-ai-success-in-2026',
    title: 'Vector database strategy: the key to AI success in 2026',
    category: 'Applied AI & ML',
    published_at: '2026-07-01',
  },
  {
    slug: 'ai-ready-data-architecture-2026-the-lakehouse-rebuild-you-need',
    title: 'AI-ready data architecture: the lakehouse rebuild you need',
    category: 'Data Engineering',
    published_at: '2026-06-10',
  },
  {
    slug: 'unity-catalog-metrics-deliver-trusted-kpis-across-your-enterprise',
    title: 'Unity Catalog metrics deliver trusted KPIs across your enterprise',
    category: 'Data Engineering',
    published_at: '2026-06-05',
  },
  {
    slug: 'ai-powered-cyber-attacks-autonomous-agents',
    title: 'AI-powered cyber attacks: preparing for autonomous agents',
    category: 'Cyber Security',
    published_at: '2026-05-29',
  },
];

function fmtDate(d?: string | null) {
  if (!d) return '';
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function V4Journal({ posts }: { posts: BlogListItem[] }) {
  const rows = posts.length ? posts.slice(0, 4) : (FALLBACK as BlogListItem[]);

  return (
    <section style={{ padding: '48px 24px 96px' }}>
      <div style={{ maxWidth: 1240, margin: '0 auto' }}>
        <Reveal tier="sm">
          <span className="v4-eyebrow">From the blog</span>
        </Reveal>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            gap: 32,
            flexWrap: 'wrap',
            marginTop: 14,
          }}
        >
          <Reveal tier="md">
            <h2 className="v4-h2" style={{ maxWidth: 560 }}>
              Field notes from production.
            </h2>
          </Reveal>
          <Reveal tier="sm" delay={0.1}>
            <Link
              href="/blogs"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 12,
                font: '500 15px/1 var(--font-funnel-sans)',
                color: 'var(--v4-ink)',
                textDecoration: 'none',
              }}
            >
              All articles <ArrowCircle />
            </Link>
          </Reveal>
        </div>

        <div style={{ marginTop: 36, borderTop: '1px solid var(--v4-mist)' }}>
          {rows.map((p, i) => (
            <Reveal key={p.slug} tier="sm" delay={i * 0.06}>
              <Link
                href={`/blogs/${p.slug}`}
                className="v4-hoverable"
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'minmax(90px, 130px) 1fr auto',
                  alignItems: 'center',
                  gap: 20,
                  padding: '24px 4px',
                  borderBottom: '1px solid var(--v4-mist)',
                  textDecoration: 'none',
                  color: 'var(--v4-ink)',
                }}
              >
                <span
                  style={{
                    font: '400 12px/1.4 var(--font-jetbrains-mono)',
                    letterSpacing: '0.04em',
                    color: 'var(--v4-muted)',
                    textTransform: 'uppercase',
                  }}
                >
                  {fmtDate(p.published_at || p.created_at)}
                </span>
                <span style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 0 }}>
                  <span
                    style={{
                      font: '600 clamp(16px, 2vw, 20px)/1.3 var(--font-funnel-display)',
                      letterSpacing: '-0.01em',
                    }}
                  >
                    {p.title}
                  </span>
                  {p.category && (
                    <span className="v4-chip" style={{ alignSelf: 'flex-start' }}>
                      {p.category}
                    </span>
                  )}
                </span>
                <ArrowCircle />
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
