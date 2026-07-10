'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Reveal } from './v4-motion';

const FOOTER_LINKS = [
  { label: 'Services', href: '/services' },
  { label: 'Case Studies', href: '/case-studies' },
  { label: 'Blog', href: '/blogs' },
  { label: 'About', href: '/about' },
  { label: 'Careers', href: '/careers' },
  { label: 'Contact', href: '/contact' },
  { label: 'Privacy', href: '/privacy-policy' },
  { label: 'Terms', href: '/terms-of-service' },
];

export default function V4Footer() {
  return (
    <footer style={{ padding: '0 24px 32px' }}>
      <div style={{ maxWidth: 1240, margin: '0 auto' }}>
        {/* Contact band */}
        <Reveal tier="lg">
          <div
            style={{
              background: 'var(--v4-ink)',
              borderRadius: 28,
              padding: 'clamp(40px, 6vw, 88px)',
              color: '#fff',
              position: 'relative',
              overflow: 'hidden',
              textAlign: 'center',
            }}
          >
            <div
              aria-hidden
              style={{
                position: 'absolute',
                top: -300,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 760,
                height: 760,
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(30,63,204,0.4), transparent 62%)',
                pointerEvents: 'none',
              }}
            />
            <div style={{ position: 'relative', display: 'grid', gap: 26, justifyItems: 'center' }}>
              <span className="v4-eyebrow v4-eyebrow--onDark">Start a project</span>
              <h2 className="v4-h2" style={{ color: '#fff', maxWidth: 640 }}>
                Tell us what keeps breaking at 2am.
              </h2>
              <p style={{ margin: 0, maxWidth: 480, font: '400 16px/1.6 var(--font-funnel-sans)', color: 'var(--v4-muted-dark)' }}>
                One call with an architect. A plan and a number within two weeks.
                No deck longer than the codebase.
              </p>
              <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center' }}>
                <Link href="/contact?reason=architecture-call" className="v4-btn v4-btn--onDark">
                  Schedule an architecture call
                </Link>
                <a href="mailto:info@aciinfotech.com" className="v4-btn v4-btn--ghost" style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.28)' }}>
                  info@aciinfotech.com
                </a>
              </div>
              <p
                style={{
                  margin: '10px 0 0',
                  font: '400 12px/1.6 var(--font-jetbrains-mono)',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  color: 'var(--v4-muted-dark)',
                }}
              >
                11 global delivery hubs &middot; USA &middot; India &middot; Europe &middot; APAC
              </p>
            </div>
          </div>
        </Reveal>

        {/* Slim footer row */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 20,
            padding: '28px 6px 0',
          }}
        >
          <Link href="/" aria-label="ACI Infotech home">
            <Image src="/aci-infotech-logo.png" alt="ACI Infotech" width={100} height={32} />
          </Link>
          <nav style={{ display: 'flex', flexWrap: 'wrap', gap: 22 }}>
            {FOOTER_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                style={{ font: '400 13.5px/1 var(--font-funnel-sans)', color: 'var(--v4-muted)', textDecoration: 'none' }}
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <span style={{ font: '400 12.5px/1 var(--font-funnel-sans)', color: 'var(--v4-muted)' }}>
            &copy; {new Date().getFullYear()} ACI Infotech. All rights reserved.
          </span>
        </div>
      </div>
    </footer>
  );
}
