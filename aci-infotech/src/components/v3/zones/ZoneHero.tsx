'use client';

import { useRef, useEffect } from 'react';

export function ZoneHero() {
  const h1Ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!h1Ref.current) return;
    h1Ref.current.style.opacity = '1';
    h1Ref.current.style.transform = 'translateY(0)';
  }, []);

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
        position: 'relative',
      }}
    >
      {/* Pill nav */}
      <nav
        style={{
          position: 'fixed',
          top: '1.5rem',
          right: '1.5rem',
          zIndex: 50,
          display: 'flex',
          alignItems: 'center',
          gap: '1.5rem',
          background: 'rgba(10, 10, 10, 0.7)',
          backdropFilter: 'blur(12px)',
          border: '1px solid var(--v3-border)',
          borderRadius: '9999px',
          padding: '0.625rem 1.5rem',
          fontFamily: 'var(--v3-font-mono)',
          fontSize: '0.75rem',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: 'var(--v3-text)',
          pointerEvents: 'auto',
        }}
      >
        <a href="#work" style={{ color: 'var(--v3-text)', textDecoration: 'none' }}>Work</a>
        <span style={{ color: 'var(--v3-text-muted)' }}>|</span>
        <a href="/contact" style={{ color: 'var(--v3-text)', textDecoration: 'none' }}>Contact</a>
      </nav>

      <h1
        ref={h1Ref}
        style={{
          fontFamily: 'var(--v3-font-display)',
          fontSize: 'clamp(2.5rem, 8vw, 6rem)',
          fontWeight: 800,
          lineHeight: 1.05,
          letterSpacing: '-0.03em',
          textTransform: 'uppercase',
          color: 'var(--v3-text)',
          opacity: 0,
          transform: 'translateY(20px)',
          transition: 'opacity 1.2s ease, transform 1.2s ease',
          marginBottom: '1.5rem',
        }}
      >
        We build what<br />
        <span style={{ color: 'var(--v3-lime)' }}>enterprises run&nbsp;on.</span>
      </h1>

      <p
        style={{
          fontFamily: 'var(--v3-font-body)',
          fontSize: 'clamp(0.95rem, 1.5vw, 1.25rem)',
          lineHeight: 1.6,
          color: 'var(--v3-text-secondary)',
          maxWidth: '40rem',
          opacity: 0,
          animation: 'v3FadeIn 1s ease 0.6s forwards',
        }}
      >
        Data platforms. Cloud architectures. Intelligent automation.
        280+ production systems across Fortune 500&nbsp;enterprises.
      </p>

      <style>{`
        @keyframes v3FadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
