'use client';

/**
 * FooterV2 — dark footer with 4-column link grid and bottom meta row.
 * Brand column has a short tagline and certification pills. Link
 * columns are Services, Resources, Company. All links route to real
 * pages in the codebase.
 */

import Link from 'next/link';

const LINKS = {
  Services: [
    { label: 'Applied AI & GenAI', href: '/services/applied-ai-ml' },
    { label: 'Cloud & Data', href: '/services/cloud-modernization' },
    { label: 'Platform Engineering', href: '/services/app-development' },
    { label: 'Digital Experience', href: '/services/digital-transformation' },
    { label: 'Managed Operations', href: '/services/managed-operations' },
  ],
  Resources: [
    { label: 'Playbooks', href: '/playbooks' },
    { label: 'Case Studies', href: '/case-studies' },
    { label: 'Insights', href: '/blogs' },
    { label: 'News & Press', href: '/news' },
    { label: 'Whitepapers', href: '/whitepapers' },
  ],
  Company: [
    { label: 'About', href: '/about' },
    { label: 'Careers', href: '/careers' },
    { label: 'Contact', href: '/contact' },
  ],
};

export default function FooterV2() {
  return (
    <footer
      style={{
        background: 'var(--v2-footer-bg)',
        color: 'var(--v2-text-secondary)',
        padding: '60px 44px 30px',
      }}
    >
      <div style={{ maxWidth: 'var(--v2-container-max)', margin: '0 auto' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(280px, 1.6fr) repeat(3, minmax(140px, 1fr))',
            gap: 40,
            paddingBottom: 60,
            borderBottom: '1px solid var(--v2-border-subtle)',
          }}
        >
          <style>{`
            @media (max-width: 820px) {
              .v2-footer-grid { grid-template-columns: 1fr 1fr !important; }
            }
            @media (max-width: 520px) {
              .v2-footer-grid { grid-template-columns: 1fr !important; }
            }
          `}</style>

          {/* Brand column */}
          <div className="v2-footer-grid">
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                marginBottom: 18,
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 6,
                  background: 'var(--v2-accent)',
                  color: 'var(--v2-text-inverted)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'var(--font-title)',
                  fontSize: 18,
                  fontWeight: 700,
                }}
              >
                A
              </div>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 13,
                  letterSpacing: '0.14em',
                  color: 'var(--v2-text-primary)',
                  fontWeight: 500,
                }}
              >
                ACI.INFOTECH
              </span>
            </div>
            <p
              style={{
                fontSize: 14,
                lineHeight: 1.6,
                maxWidth: 340,
                margin: '0 0 18px 0',
                color: 'var(--v2-text-secondary)',
              }}
            >
              Production-grade engineering at enterprise scale. 1,600+ engineers across NJ,
              Hyderabad, Bengaluru and Toronto. Est. 2003.
            </p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {['SOC 2', 'ISO 27001', 'HIPAA', 'GDPR'].map((c) => (
                <span
                  key={c}
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 10,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    padding: '4px 8px',
                    border: '1px solid var(--v2-border-strong)',
                    borderRadius: 2,
                    color: 'var(--v2-text-muted)',
                  }}
                >
                  {c}
                </span>
              ))}
            </div>
          </div>

          {Object.entries(LINKS).map(([heading, links]) => (
            <div key={heading}>
              <h6
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 10,
                  letterSpacing: '0.24em',
                  textTransform: 'uppercase',
                  color: 'var(--v2-accent)',
                  margin: '0 0 18px 0',
                  fontWeight: 500,
                }}
              >
                {heading}
              </h6>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
                {links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      style={{
                        fontSize: 14,
                        color: 'var(--v2-text-primary)',
                        textDecoration: 'none',
                        padding: '6px 0',
                        display: 'inline-block',
                        transition: 'color 200ms var(--v2-ease)',
                      }}
                      className="v2-footer-link"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <style>{`
            .v2-footer-link:hover { color: var(--v2-accent); }
          `}</style>
        </div>

        <div
          style={{
            marginTop: 24,
            display: 'flex',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 16,
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'var(--v2-text-muted)',
          }}
        >
          <span>© 2026 ACI Infotech, Inc.</span>
          <span>
            <Link href="/privacy-policy" style={{ color: 'inherit', textDecoration: 'none' }}>
              Privacy
            </Link>
            {' · '}
            <Link href="/terms-of-service" style={{ color: 'inherit', textDecoration: 'none' }}>
              Terms
            </Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
