'use client';

/**
 * CompanyMenu — compact 2-column.
 *
 *   LEFT  — About / Careers / News list (3 items)
 *   RIGHT — latest press release spotlight
 *
 * Lighter-weight than the other menus: Company only has 3 items, so
 * it doesn't need live-swap previews. The right panel always shows
 * the newest press item.
 */

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { COMPANY } from './menu-data';

export interface CompanyMenuData {
  latestPress?: {
    title: string;
    source: string | null;
    published_at: string | null;
    external_url: string | null;
    image_url: string | null;
  } | null;
}

function formatDate(iso: string | null): string | null {
  if (!iso) return null;
  try {
    return new Date(iso).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return null;
  }
}

export default function CompanyMenu({ data }: { data: CompanyMenuData }) {
  const press = data.latestPress ?? null;
  const pressHref = press?.external_url || '/news';
  const pressDate = formatDate(press?.published_at ?? null);

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.1fr)',
        gap: 32,
        padding: '32px 36px',
      }}
    >
      {/* LEFT — company list */}
      <div>
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'var(--v2-text-muted)',
            marginBottom: 18,
          }}
        >
          / Company
        </div>
        <div>
          {COMPANY.map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              className="v2-company-row"
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr auto',
                alignItems: 'center',
                gap: 14,
                padding: '14px 0',
                borderTop: i === 0 ? 'none' : '1px solid var(--v2-border-subtle)',
                textDecoration: 'none',
                color: 'inherit',
              }}
            >
              <div>
                <div
                  style={{
                    fontFamily: 'var(--font-title)',
                    fontSize: 17,
                    fontWeight: 600,
                    letterSpacing: '-0.01em',
                    color: 'var(--v2-text-primary)',
                    marginBottom: 2,
                  }}
                >
                  {item.label}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    lineHeight: 1.45,
                    color: 'var(--v2-text-secondary)',
                  }}
                >
                  {item.description}
                </div>
              </div>
              <ArrowRight
                size={14}
                className="v2-company-arrow"
                style={{
                  color: 'var(--v2-text-muted)',
                  transition: 'color 200ms var(--v2-ease), transform 200ms var(--v2-ease)',
                }}
              />
            </Link>
          ))}
        </div>
        <style>{`
          .v2-company-row:hover .v2-company-arrow {
            color: var(--v2-accent);
            transform: translateX(4px);
          }
        `}</style>
      </div>

      {/* RIGHT — latest press spotlight */}
      <aside
        style={{
          position: 'relative',
          background: 'var(--v2-surface-2)',
          border: '1px solid var(--v2-border-subtle)',
          borderRadius: 6,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          minHeight: 220,
        }}
      >
        {press?.image_url && (
          <div
            style={{
              position: 'relative',
              width: '100%',
              paddingBottom: '42%',
              background: `url(${press.image_url}) center/cover no-repeat`,
              borderBottom: '1px solid var(--v2-border-subtle)',
            }}
          >
            <span
              aria-hidden
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  'linear-gradient(180deg, rgba(5, 11, 31, 0.0) 40%, rgba(5, 11, 31, 0.55) 100%)',
              }}
            />
          </div>
        )}

        <div
          style={{
            padding: '18px 22px 20px',
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
            / Latest Press
          </div>
          <div
            style={{
              fontFamily: 'var(--font-title)',
              fontSize: 17,
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
            {press?.title ?? 'Press releases, partnerships, and announcements.'}
          </div>

          {press && (press.source || pressDate) && (
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 10,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'var(--v2-text-muted)',
              }}
            >
              {[press.source, pressDate].filter(Boolean).join(' · ')}
            </div>
          )}

          <div style={{ marginTop: 'auto', paddingTop: 6 }}>
            <Link
              href={pressHref}
              target={press?.external_url ? '_blank' : undefined}
              rel={press?.external_url ? 'noopener noreferrer' : undefined}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                fontFamily: 'var(--font-mono)',
                fontSize: 11,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'var(--v2-accent)',
                textDecoration: 'none',
              }}
            >
              {press ? 'Read release' : 'See all news'}
              <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </aside>
    </div>
  );
}
