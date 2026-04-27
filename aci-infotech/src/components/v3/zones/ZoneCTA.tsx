'use client';

export function ZoneCTA() {
  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '0 2rem',
        textAlign: 'center',
      }}
    >
      <h2
        style={{
          fontFamily: 'var(--v3-font-display)',
          fontSize: 'clamp(2rem, 6vw, 4.5rem)',
          fontWeight: 800,
          lineHeight: 1.05,
          letterSpacing: '-0.03em',
          textTransform: 'uppercase',
          color: 'var(--v3-text)',
          marginBottom: '1.5rem',
        }}
      >
        Ready to talk<br />
        <span style={{ color: 'var(--v3-lime)' }}>architecture?</span>
      </h2>

      <p
        style={{
          fontFamily: 'var(--v3-font-body)',
          fontSize: '1.1rem',
          color: 'var(--v3-text-secondary)',
          marginBottom: '2.5rem',
          lineHeight: 1.5,
        }}
      >
        30-minute call with the engineers<br />
        who will do the work.
      </p>

      <a
        href="/contact?service=general"
        style={{
          fontFamily: 'var(--v3-font-mono)',
          fontSize: '0.8rem',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: 'var(--v3-bg)',
          background: 'var(--v3-lime)',
          padding: '1rem 2.5rem',
          borderRadius: '9999px',
          textDecoration: 'none',
          fontWeight: 600,
          boxShadow: '0 0 30px rgba(196, 255, 97, 0.3), 0 0 60px rgba(196, 255, 97, 0.15)',
          transition: 'box-shadow 0.3s, transform 0.3s',
          pointerEvents: 'auto',
          display: 'inline-block',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = '0 0 40px rgba(196, 255, 97, 0.5), 0 0 80px rgba(196, 255, 97, 0.25)';
          e.currentTarget.style.transform = 'translateY(-2px)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = '0 0 30px rgba(196, 255, 97, 0.3), 0 0 60px rgba(196, 255, 97, 0.15)';
          e.currentTarget.style.transform = 'translateY(0)';
        }}
      >
        Book a conversation
      </a>

      <div
        style={{
          fontFamily: 'var(--v3-font-mono)',
          fontSize: '0.65rem',
          color: 'var(--v3-text-muted)',
          marginTop: '3rem',
          letterSpacing: '0.08em',
        }}
      >
        hello@aciinfotech.com
      </div>
    </div>
  );
}
