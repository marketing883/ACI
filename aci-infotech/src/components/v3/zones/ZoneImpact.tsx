'use client';

const metrics = [
  { value: '$2.1B+', label: 'Portfolio value under management' },
  { value: '68%', label: 'Avg cost reduction' },
  { value: '9 → 3', label: 'Days to monthly close' },
  { value: '42%', label: 'Faster time-to-insight' },
  { value: '99.9%', label: 'Uptime maintained' },
  { value: '15 min', label: 'P1 response SLA' },
];

export function ZoneImpact() {
  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '0 2rem',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '3rem 4rem',
          maxWidth: '56rem',
          width: '100%',
          textAlign: 'center',
        }}
      >
        {metrics.map((m) => (
          <div key={m.label}>
            <div
              style={{
                fontFamily: 'var(--v3-font-mono)',
                fontSize: 'clamp(1.75rem, 4vw, 3rem)',
                fontWeight: 700,
                color: 'var(--v3-lime)',
                letterSpacing: '-0.02em',
                lineHeight: 1.1,
              }}
            >
              {m.value}
            </div>
            <div
              style={{
                fontFamily: 'var(--v3-font-body)',
                fontSize: '0.8rem',
                color: 'var(--v3-text-muted)',
                marginTop: '0.5rem',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
              }}
            >
              {m.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
