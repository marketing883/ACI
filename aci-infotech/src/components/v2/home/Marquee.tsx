'use client';

/**
 * Marquee — full-width lime band with capability names scrolling left.
 * Content duplicates inline so the track loops seamlessly. Pauses on
 * hover. Disabled under prefers-reduced-motion (renders static).
 */

import { useReducedMotion } from 'framer-motion';

const ITEMS = [
  'APPLIED AI',
  'CLOUD',
  'DATA',
  'PLATFORM',
  'DIGITAL',
  'SRE',
  'SECURITY',
  'ADVISORY',
];

export default function Marquee() {
  const reduced = useReducedMotion();

  const content = (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 28,
        padding: '0 28px',
      }}
    >
      {ITEMS.map((t, i) => (
        <span key={`${t}-${i}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 28 }}>
          <span>{t}</span>
          <span style={{ opacity: 0.3 }}>/</span>
        </span>
      ))}
    </span>
  );

  return (
    <div
      aria-hidden
      className="v2-marquee"
      style={{
        width: '100%',
        overflow: 'hidden',
        background: 'var(--v2-accent)',
        color: 'var(--v2-text-inverted)',
        padding: '24px 0',
        borderTop: '1px solid var(--v2-accent-dim)',
        borderBottom: '1px solid var(--v2-accent-dim)',
      }}
    >
      <div
        className="v2-marquee-track"
        style={{
          display: 'inline-flex',
          whiteSpace: 'nowrap',
          fontFamily: 'var(--font-title)',
          fontSize: 'clamp(28px, 3.5vw, 48px)',
          fontWeight: 700,
          letterSpacing: '-0.02em',
          animation: reduced ? 'none' : 'v2-marquee-scroll 28s linear infinite',
        }}
      >
        {content}
        {content}
      </div>

      <style>{`
        @keyframes v2-marquee-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .v2-marquee:hover .v2-marquee-track { animation-play-state: paused; }
      `}</style>
    </div>
  );
}
