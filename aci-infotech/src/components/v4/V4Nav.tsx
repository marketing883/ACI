'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';

const LINKS = [
  { label: 'Services', href: '/services' },
  { label: 'Case Studies', href: '/case-studies' },
  { label: 'Blog', href: '/blogs' },
  { label: 'About', href: '/about' },
];

export default function V4Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        transition: 'background 0.3s, box-shadow 0.3s, border-color 0.3s',
        background: scrolled ? 'rgba(246,247,244,0.88)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--v4-mist)' : '1px solid transparent',
      }}
    >
      <nav
        style={{
          maxWidth: 1240,
          margin: '0 auto',
          padding: '0 24px',
          height: 72,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 24,
        }}
      >
        <Link href="/" aria-label="ACI Infotech home" style={{ display: 'flex', alignItems: 'center' }}>
          <Image src="/aci-infotech-logo.png" alt="ACI Infotech" width={119} height={38} priority />
        </Link>

        <div className="v4-nav-links" style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              style={{
                font: '500 14.5px/1 var(--font-funnel-sans)',
                color: 'var(--v4-ink)',
                textDecoration: 'none',
                opacity: 0.82,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.82')}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <Link href="/contact" className="v4-btn v4-btn--primary" style={{ padding: '11px 20px' }}>
          Start a project
        </Link>
      </nav>
      {/* Hide middle links on small screens; CTA + logo stay. */}
      <style>{`
        @media (max-width: 820px) {
          .v4-nav-links { display: none !important; }
        }
      `}</style>
    </header>
  );
}
