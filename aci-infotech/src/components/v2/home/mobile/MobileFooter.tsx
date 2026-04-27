/**
 * MobileFooter — compact footer for the phone homepage. Four primary
 * links, copyright line, two legal links. No accordions, no social
 * icons (LinkedIn is on the contact page); everything renders in
 * under 200px of vertical space.
 */

import Link from 'next/link';

const PRIMARY_LINKS = [
  { label: 'Services', href: '/services' },
  { label: 'Case studies', href: '/case-studies' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

const LEGAL_LINKS = [
  { label: 'Privacy', href: '/privacy-policy' },
  { label: 'Terms', href: '/terms-of-service' },
];

export default function MobileFooter() {
  const year = new Date().getUTCFullYear();
  return (
    <footer className="m-footer">
      <ul className="m-footer__primary">
        {PRIMARY_LINKS.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="m-footer__link">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>

      <div className="m-footer__bottom">
        <span className="m-footer__copy">
          © {year} ACI Infotech
        </span>
        <ul className="m-footer__legal">
          {LEGAL_LINKS.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="m-footer__legal-link">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <style>{`
        .m-footer {
          padding: 32px 24px;
          background: var(--v2-footer-bg);
          border-top: 1px solid var(--v2-border-subtle);
          color: var(--v2-text-muted);
        }
        .m-footer__primary {
          list-style: none;
          margin: 0 0 24px;
          padding: 0;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px 16px;
        }
        .m-footer__link {
          display: block;
          padding: 10px 0;
          font-family: var(--font-sans);
          font-size: 14px;
          color: var(--v2-text-secondary);
          text-decoration: none;
          border-bottom: 1px solid var(--v2-border-subtle);
        }
        .m-footer__bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 0.06em;
        }
        .m-footer__copy {
          color: var(--v2-text-muted);
        }
        .m-footer__legal {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          gap: 16px;
        }
        .m-footer__legal-link {
          color: var(--v2-text-muted);
          text-decoration: none;
        }
      `}</style>
    </footer>
  );
}
