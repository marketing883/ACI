'use client';

/**
 * NavV2 — fixed top nav that is transparent over the hero and snaps to
 * a subtle surface when scrolled. Minimal: logo + 5 primary links + a
 * lime CTA. Mobile shows the logo and a menu pill that links to a full
 * nav page (keeping this component simple — full mobile drawer can be
 * added later).
 */

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Menu } from 'lucide-react';

const LINKS = [
  { label: 'Services', href: '#services' },
  { label: 'Playbooks', href: '#playbooks' },
  { label: 'Work', href: '#work' },
  { label: 'Insights', href: '#insights' },
  { label: 'Company', href: '/about' },
];

export default function NavV2() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        padding: scrolled ? '14px 44px' : '22px 44px',
        background: scrolled ? 'rgba(5, 11, 31, 0.82)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--v2-border-subtle)' : '1px solid transparent',
        transition: 'all 300ms var(--v2-ease)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <Link
        href="/"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 10,
          textDecoration: 'none',
          color: 'var(--v2-text-primary)',
        }}
      >
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: 6,
            background: 'var(--v2-accent)',
            color: 'var(--v2-text-inverted)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'var(--font-title)',
            fontSize: 16,
            fontWeight: 700,
          }}
        >
          A
        </div>
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 12,
            letterSpacing: '0.14em',
            fontWeight: 500,
          }}
        >
          ACI.INFOTECH
        </span>
      </Link>

      <div
        className="v2-nav-links"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 28,
        }}
      >
        <style>{`
          @media (max-width: 820px) {
            .v2-nav-links .v2-nav-desktop { display: none !important; }
          }
          @media (min-width: 821px) {
            .v2-nav-links .v2-nav-mobile { display: none !important; }
          }
          .v2-nav-link { transition: color 200ms var(--v2-ease); }
          .v2-nav-link:hover { color: var(--v2-accent); }
        `}</style>
        <div className="v2-nav-desktop" style={{ display: 'flex', gap: 28 }}>
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="v2-nav-link"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 12,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'var(--v2-text-secondary)',
                textDecoration: 'none',
              }}
            >
              {l.label}
            </Link>
          ))}
        </div>
        <Link
          href="/contact?source=v2-nav"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '10px 16px',
            background: 'var(--v2-accent)',
            color: 'var(--v2-text-inverted)',
            fontFamily: 'var(--font-sans)',
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            borderRadius: 2,
            textDecoration: 'none',
            transition: 'background 200ms var(--v2-ease)',
          }}
        >
          Start a project →
        </Link>
        <Link
          href="/contact"
          className="v2-nav-mobile"
          aria-label="Open menu"
          style={{
            display: 'none',
            width: 36,
            height: 36,
            borderRadius: 2,
            border: '1px solid var(--v2-border-strong)',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--v2-text-primary)',
          }}
        >
          <Menu size={16} />
        </Link>
      </div>
    </nav>
  );
}
