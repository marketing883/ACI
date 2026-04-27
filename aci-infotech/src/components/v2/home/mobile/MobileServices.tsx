/**
 * MobileServices — vertical list of 7 service tiles for the mobile
 * homepage. Names + 1-line description + chevron. Tap routes to the
 * full service page on /services/[slug].
 *
 * Curated set (not the desktop dial's 10) because mobile readers are
 * scanning, not exploring. The seven listed map to real /services
 * routes; nothing here links to a page that doesn't exist.
 */

import Link from 'next/link';
import {
  Database,
  Sparkles,
  Cloud,
  Activity,
  Megaphone,
  LayoutGrid,
  ShieldCheck,
  ChevronRight,
  type LucideIcon,
} from 'lucide-react';

interface ServiceItem {
  slug: string;
  Icon: LucideIcon;
  title: string;
  desc: string;
}

const SERVICES: ServiceItem[] = [
  {
    slug: 'data-engineering',
    Icon: Database,
    title: 'Data engineering',
    desc: 'Lakehouses, pipelines, governance that holds up to audit.',
  },
  {
    slug: 'applied-ai-ml',
    Icon: Sparkles,
    title: 'Applied AI & ML',
    desc: 'Production copilots, agentic systems, document intelligence.',
  },
  {
    slug: 'cloud-modernization',
    Icon: Cloud,
    title: 'Cloud modernization',
    desc: 'Mainframe and on-prem cutovers across AWS, Azure, GCP.',
  },
  {
    slug: 'managed-operations',
    Icon: Activity,
    title: 'Managed operations',
    desc: 'SLO-driven on-call, follow-the-sun, runbooks worth reading.',
  },
  {
    slug: 'martech-cdp',
    Icon: Megaphone,
    title: 'MarTech & CDP',
    desc: 'Customer data unified and activated in real time.',
  },
  {
    slug: 'digital-transformation',
    Icon: LayoutGrid,
    title: 'Digital transformation',
    desc: 'SAP S/4HANA, ServiceNow, ERP modernization, end to end.',
  },
  {
    slug: 'cyber-security',
    Icon: ShieldCheck,
    title: 'Cyber & trust',
    desc: 'Zero-trust architecture, SOC 2, HIPAA, PCI readiness.',
  },
];

export default function MobileServices() {
  return (
    <section className="m-services" aria-labelledby="m-services-h">
      <p className="m-eyebrow">/ What we do</p>
      <h2 id="m-services-h" className="m-h2">
        Seven practices.
        <br />
        <em className="m-h2-em">One delivery&nbsp;team.</em>
      </h2>

      <ul className="m-services__list">
        {SERVICES.map(({ slug, Icon, title, desc }) => (
          <li key={slug}>
            <Link href={`/services/${slug}`} className="m-services__row">
              <span className="m-services__icon" aria-hidden>
                <Icon size={18} strokeWidth={1.5} />
              </span>
              <span className="m-services__text">
                <span className="m-services__title">{title}</span>
                <span className="m-services__desc">{desc}</span>
              </span>
              <ChevronRight
                size={16}
                strokeWidth={1.5}
                className="m-services__chev"
                aria-hidden
              />
            </Link>
          </li>
        ))}
      </ul>

      <style>{`
        .m-services {
          padding: 64px 24px;
          background: var(--v2-bg);
        }
        .m-services__list {
          list-style: none;
          margin: 32px 0 0;
          padding: 0;
          border-top: 1px solid var(--v2-border-subtle);
        }
        .m-services__list li {
          border-bottom: 1px solid var(--v2-border-subtle);
        }
        .m-services__row {
          display: grid;
          grid-template-columns: 36px 1fr 16px;
          gap: 14px;
          align-items: center;
          padding: 16px 4px;
          color: inherit;
          text-decoration: none;
          min-height: 56px;
        }
        .m-services__icon {
          width: 36px;
          height: 36px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: 1px solid var(--v2-border-strong);
          border-radius: 8px;
          background: var(--v2-surface-1);
          color: var(--v2-accent);
          flex-shrink: 0;
        }
        .m-services__text {
          display: flex;
          flex-direction: column;
          gap: 4px;
          min-width: 0;
        }
        .m-services__title {
          font-family: var(--font-sans);
          font-size: 15px;
          font-weight: 600;
          color: var(--v2-text-primary);
          line-height: 1.3;
        }
        .m-services__desc {
          font-family: var(--font-sans);
          font-size: 13px;
          color: var(--v2-text-muted);
          line-height: 1.4;
        }
        .m-services__chev {
          color: var(--v2-text-muted);
          flex-shrink: 0;
        }
        .m-services__row:active .m-services__chev {
          color: var(--v2-accent);
          transform: translateX(2px);
        }
      `}</style>
    </section>
  );
}
