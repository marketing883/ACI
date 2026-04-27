'use client';

const categories = [
  'DATA PLATFORMS',
  'CLOUD INFRASTRUCTURE',
  'MANAGED OPERATIONS',
  'AI & AUTOMATION',
  'SECURITY',
];

export function ZoneChat() {
  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        padding: '0 3rem',
        maxWidth: '32rem',
      }}
    >
      <div
        style={{
          fontFamily: 'var(--v3-font-display)',
          fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
          fontWeight: 700,
          color: 'var(--v3-text)',
          letterSpacing: '-0.02em',
          marginBottom: '2rem',
        }}
      >
        Ask us anything.
      </div>

      <div
        style={{
          fontFamily: 'var(--v3-font-body)',
          fontSize: '0.85rem',
          color: 'var(--v3-text-muted)',
          marginBottom: '1.5rem',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
        }}
      >
        What are you looking for?
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '2rem' }}>
        {categories.map((cat) => (
          <div
            key={cat}
            style={{
              fontFamily: 'var(--v3-font-mono)',
              fontSize: '0.7rem',
              letterSpacing: '0.08em',
              color: 'var(--v3-lime)',
              cursor: 'pointer',
              pointerEvents: 'auto',
            }}
          >
            → {cat}
          </div>
        ))}
      </div>

      <div
        style={{
          width: '100%',
          padding: '0.875rem 1.25rem',
          background: 'rgba(255, 255, 255, 0.04)',
          border: '1px solid var(--v3-border)',
          borderRadius: '9999px',
          fontFamily: 'var(--v3-font-mono)',
          fontSize: '0.8rem',
          color: 'var(--v3-text-muted)',
          letterSpacing: '0.05em',
          pointerEvents: 'auto',
          cursor: 'text',
        }}
      >
        Ask us anything...
      </div>

      <div
        style={{
          fontFamily: 'var(--v3-font-body)',
          fontSize: '0.65rem',
          color: 'var(--v3-text-muted)',
          marginTop: '1rem',
          lineHeight: 1.5,
        }}
      >
        Sessions may be recorded. By using chat,<br />
        you acknowledge our{' '}
        <a
          href="/privacy"
          style={{ color: 'var(--v3-text-secondary)', textDecoration: 'underline', pointerEvents: 'auto' }}
        >
          privacy policy
        </a>
        .
      </div>
    </div>
  );
}
