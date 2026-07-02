'use client';

import { CounterRoll } from '../craft/CounterRoll';

const metrics = [
  { value: '2006', label: 'Founded' },
  { value: '1,200+', label: 'Experts' },
  { value: '500+', label: 'Large enterprise projects' },
  { value: '11', label: 'Global delivery hubs' },
];

export function MetricsStrip() {
  return (
    <section
      style={{
        position: 'relative',
        background: 'var(--v2-surface-1, #070F28)',
        padding: '5rem 1.5rem',
        overflow: 'hidden',
      }}
    >

      <div
        style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '2rem',
          textAlign: 'center',
        }}
      >
        {metrics.map((m) => (
          <div key={m.label}>
            <CounterRoll
              value={m.value}
              style={{
                fontFamily: 'var(--v2-font-mono, monospace)',
                fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)',
                fontWeight: 700,
                color: 'var(--v2-accent, #C6FF3D)',
                letterSpacing: '-0.02em',
                lineHeight: 1.1,
                display: 'block',
              }}
            />
            <div
              style={{
                fontFamily: 'var(--v2-font-body, sans-serif)',
                fontSize: '0.75rem',
                color: 'var(--v2-text-muted, #6B7A99)',
                marginTop: '0.5rem',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
              }}
            >
              {m.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
