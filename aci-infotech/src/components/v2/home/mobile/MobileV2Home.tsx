/**
 * MobileV2Home — phone-only entry component for the v2 homepage.
 *
 * Sister to V2HomeContent. Where the desktop tree is 11 sections
 * with video, parallax, framer-motion, and Lenis smooth-scroll, this
 * is six static sections of pure HTML + CSS + a couple of CSS
 * keyframes. No client-side JS beyond what next/link injects.
 *
 * SEO/AEO/GEO: emits Organization + WebSite + Service + LocalBusiness
 * JSON-LD inline so an AI search engine reading the page gets the
 * full company snapshot in one fetch.
 *
 * Receives `caseStudies` from the parent so V2HomeContent's single
 * Supabase query feeds both layouts.
 */

import type { HomeCaseStudy } from '@/lib/v2/fetch-home-data';
import MobileHero from './MobileHero';
import MobileServices from './MobileServices';
import MobileCaseStudies from './MobileCaseStudies';
import MobilePartners from './MobilePartners';
import MobileCTA from './MobileCTA';
import MobileFooter from './MobileFooter';

interface Props {
  caseStudies: HomeCaseStudy[];
}

const SERVICE_NAMES = [
  'Data Engineering',
  'Applied AI & ML',
  'Cloud Modernization',
  'Managed Operations',
  'MarTech & CDP',
  'Digital Transformation',
  'Cyber & Trust',
];

export default function MobileV2Home({ caseStudies }: Props) {
  const ldJson = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': 'https://aciinfotech.com/#organization',
        name: 'ACI Infotech',
        url: 'https://aciinfotech.com',
        logo: 'https://aciinfotech.com/brand/aci-infotech-logo.png',
        description:
          'Enterprise technology services firm delivering data & AI, cloud, and managed operations for Fortune 500 companies.',
        contactPoint: {
          '@type': 'ContactPoint',
          contactType: 'sales',
          url: 'https://aciinfotech.com/contact',
        },
        foundingDate: '2005',
        knowsAbout: SERVICE_NAMES,
        areaServed: ['United States', 'India', 'Canada', 'United Kingdom'],
        sameAs: [
          'https://www.linkedin.com/company/aci-infotech',
        ],
      },
      {
        '@type': 'WebSite',
        '@id': 'https://aciinfotech.com/#website',
        url: 'https://aciinfotech.com',
        name: 'ACI Infotech',
        publisher: { '@id': 'https://aciinfotech.com/#organization' },
      },
      ...SERVICE_NAMES.map((name) => ({
        '@type': 'Service',
        name,
        provider: { '@id': 'https://aciinfotech.com/#organization' },
        serviceType: name,
        areaServed: 'Global',
      })),
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ldJson) }}
      />

      <main className="m-root">
        <MobileHero />
        <MobileServices />
        <MobileCaseStudies caseStudies={caseStudies} />
        <MobilePartners />
        <MobileCTA />
      </main>
      <MobileFooter />

      {/* Shared mobile primitives. Declared once at the root so each
          section file doesn't duplicate the same eyebrow / h2 / button
          rules. Keeps the per-section <style> blocks scoped to the
          handful of unique rules each one needs. */}
      <style>{`
        .m-root {
          background: var(--v2-bg);
          color: var(--v2-text-primary);
          font-family: var(--font-sans);
          min-height: 100vh;
        }
        .m-eyebrow {
          margin: 0 0 12px;
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--v2-text-muted);
        }
        .m-h2 {
          margin: 0;
          font-family: var(--font-title);
          font-size: clamp(30px, 8vw, 38px);
          line-height: 1.05;
          letter-spacing: -0.025em;
          font-weight: 700;
          color: var(--v2-text-primary);
        }
        .m-h2--small {
          font-size: clamp(26px, 7vw, 32px);
        }
        .m-h2-em {
          color: var(--v2-accent);
          font-style: italic;
          font-weight: 500;
        }
        .m-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 14px 22px;
          font-family: var(--font-sans);
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.02em;
          text-transform: uppercase;
          border-radius: 4px;
          text-decoration: none;
          min-height: 44px;
        }
        .m-btn--primary {
          background: var(--v2-accent);
          color: var(--v2-text-inverted);
        }
        .m-btn--primary:active {
          background: var(--v2-accent-dim);
        }
      `}</style>
    </>
  );
}
