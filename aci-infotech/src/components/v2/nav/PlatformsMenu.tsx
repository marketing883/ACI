'use client';

/**
 * PlatformsMenu — 4 columns grouped by category (Data, Cloud,
 * Enterprise, Customer). Each platform renders as a card with the
 * brand logo (reusing the StackChip resolver vocabulary) + name +
 * capability line. Cursor-tracking lime spotlight on hover echoes
 * the Playbooks cards on the homepage.
 */

import { useRef } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { PLATFORM_CATEGORIES, PlatformMenuItem } from './menu-data';
import StackChip from '../home/StackChip';

export default function PlatformsMenu() {
  return (
    <div style={{ padding: '32px 36px' }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
          gap: 20,
        }}
      >
        {PLATFORM_CATEGORIES.map((cat) => (
          <div key={cat.id}>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 10,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: 'var(--v2-text-muted)',
                marginBottom: 12,
              }}
            >
              / {cat.label}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {cat.items.map((p) => (
                <PlatformCard key={p.href} platform={p} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Footer strip */}
      <div
        style={{
          marginTop: 24,
          paddingTop: 16,
          borderTop: '1px dashed var(--v2-border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 12,
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
          Certified partner. Production engagements on all of the above.
        </span>
        <Link
          href="/platforms"
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
          See all platforms
          <ArrowRight size={12} />
        </Link>
      </div>
    </div>
  );
}

function PlatformCard({ platform }: { platform: PlatformMenuItem }) {
  const ref = useRef<HTMLAnchorElement>(null);

  return (
    <Link
      ref={ref}
      href={platform.href}
      onMouseMove={(e) => {
        const el = ref.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        el.style.setProperty('--mx', `${e.clientX - rect.left}px`);
        el.style.setProperty('--my', `${e.clientY - rect.top}px`);
      }}
      className="v2-plat-card"
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        padding: '14px 14px 16px',
        background: 'var(--v2-surface-2)',
        border: '1px solid var(--v2-border-subtle)',
        borderRadius: 6,
        color: 'var(--v2-text-primary)',
        textDecoration: 'none',
        overflow: 'hidden',
        transition:
          'border-color 220ms var(--v2-ease), transform 220ms var(--v2-ease)',
      }}
    >
      <span
        aria-hidden
        className="v2-plat-spotlight"
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(180px 140px at var(--mx, 50%) var(--my, 50%), rgba(198, 255, 61, 0.10), transparent 70%)',
          opacity: 0,
          transition: 'opacity 220ms var(--v2-ease)',
          pointerEvents: 'none',
        }}
      />

      <style>{`
        .v2-plat-card:hover { border-color: var(--v2-border-hot); }
        .v2-plat-card:hover .v2-plat-spotlight { opacity: 1; }
      `}</style>

      <div
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <StackChip label={platform.label} compact />
        <span
          style={{
            fontFamily: 'var(--font-title)',
            fontSize: 14,
            fontWeight: 600,
            letterSpacing: '-0.005em',
            color: 'var(--v2-text-primary)',
            lineHeight: 1.2,
          }}
        >
          {platform.label}
        </span>
      </div>
      <div
        style={{
          position: 'relative',
          fontSize: 12,
          lineHeight: 1.4,
          color: 'var(--v2-text-secondary)',
        }}
      >
        {platform.capability}
      </div>
    </Link>
  );
}
