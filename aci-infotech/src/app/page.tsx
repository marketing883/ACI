/**
 * Root route — the v5 dark homepage, promoted from /preview/v5.
 *
 * Ships its own nav and footer (ConditionalLayout suppresses the
 * global chrome on `/`). The v4 editorial homepage this replaced stays
 * reachable at /preview/v4, and the older ones at /v1 and /preview/home.
 *
 * The page carries no CTA section by design; the footer's "Start a
 * project" is the only ask on it.
 *
 * SEO/AEO/GEO notes:
 *   - Site-wide Organization + WebSite JSON-LD comes from the root
 *     layout (GlobalStructuredData); this page adds the page-scoped
 *     graph: WebPage, the service OfferCatalog, and FAQPage.
 *   - The FAQ answers render server-side (native <details>) from the
 *     same data module the JSON-LD is built from, so the visible page
 *     and the schema can never disagree.
 *   - /llms.txt carries the crawlable plain-text site map for
 *     generative engines; the sitemap lists `/` at priority 1.
 */

import type { Metadata } from 'next';
import V5Hero from '@/components/v5/V5Hero';
import V5Foldcraft from '@/components/v5/V5Foldcraft';
import VaultLedger from '@/components/v5/VaultLedger';
import V5SuccessStories, { SUCCESS_STORY_SLUGS } from '@/components/v5/V5SuccessStories';
import ServicesColumns from '@/components/v5/ServicesColumns';
import V5Insights from '@/components/v5/V5Insights';
import V5HomeFaq from '@/components/v5/V5HomeFaq';
import PartnerMarquee from '@/components/v4/hero/PartnerMarquee';
import SiteFooter from '@/components/v4/hero/SiteFooter';
import { v4Display, v4Sans } from '@/components/v4/fonts';
import { HOME_FAQ } from '@/components/v4/hero/home-faq-data';
import {
  getV4FeaturedNews,
  getV4Insights,
  getV4Whitepaper,
  getV4CaseStudyFacts,
} from '@/lib/v4/fetch-v4-home';
import { getSiteUrl } from '@/lib/site-url';

// Canonical origin: always production, so staging builds can never
// self-canonicalize (see src/lib/site-url.ts).
const siteUrl = getSiteUrl();

// The news/insights/case-study content comes from the CMS at render
// time; revalidate hourly so fresh publishes show up without a deploy.
export const revalidate = 3600;

// Title ~54 chars and description ~150 chars: both fit their SERP
// limits (~60 / ~158) without truncation.
const TITLE = 'ACI Infotech | Enterprise Data & AI, Run in Production';
const DESCRIPTION =
  'ACI Infotech builds the enterprise data foundation, puts AI on top, and runs both in production. 500+ projects on Databricks, Azure, Snowflake, and AWS.';

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: [
    'enterprise data engineering',
    'applied AI consulting',
    'GenAI production systems',
    'lakehouse modernization',
    'cloud modernization',
    'managed operations',
    'Databricks partner',
    'Azure data platform',
    'Snowflake consulting',
    'MarTech CDP services',
    'enterprise AI company',
  ],
  alternates: { canonical: siteUrl },
  openGraph: {
    title: TITLE,
    description:
      'We engineer the data foundation, build the AI on top, and run both in production. 500+ enterprise projects, documented in playbooks.',
    url: siteUrl,
    siteName: 'ACI Infotech',
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'ACI Infotech: Build the AI foundation. Run it in production.',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description:
      'We engineer the data foundation, build the AI on top, and run both in production.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

// The homepage service catalog for the OfferCatalog schema. Mirrors
// the ServicesSection bars plus the wider practice list the site
// actually sells (each URL is a live service page).
const SERVICE_CATALOG = [
  {
    name: 'Data Engineering & Lakehouse',
    description: 'Modern data platforms on Databricks, Snowflake, and cloud-native architectures: lakehouse migration, real-time pipelines, governance, and self-service BI.',
    path: '/services/data-engineering',
  },
  {
    name: 'Applied AI & GenAI',
    description: 'Copilots, agents, RAG systems, forecasting, and MLOps that move from prototype to governed production.',
    path: '/services/applied-ai-ml',
  },
  {
    name: 'Cloud Modernization',
    description: 'Landing zones, FinOps, and mainframe-to-cloud cutovers run in parallel so nothing goes dark.',
    path: '/services/cloud-modernization',
  },
  {
    name: 'Managed Operations & SRE',
    description: '24/7 NOC and SOC coverage, observability, and site reliability engineering for production estates.',
    path: '/services/managed-operations',
  },
  {
    name: 'MarTech & CDP (ACI Interactive)',
    description: 'Marketing, MarTech, and customer data platform services: strategy, activation, and journey orchestration.',
    path: '/services/martech-cdp',
  },
  {
    name: 'Cybersecurity',
    description: 'Zero-trust architecture, compliance readiness, threat response, and SOC operations.',
    path: '/services/cyber-security',
  },
  {
    name: 'Advisory & Strategy',
    description: 'Technology strategy grounded in delivery: a written plan in 48 hours, a build pod in two weeks.',
    path: '/services/advisory-strategy',
  },
  {
    name: 'GCC & Captive Operations',
    description: 'Captive centers stood up on a documented build-operate-transfer path.',
    path: '/services/gcc',
  },
];

/** Page-scoped JSON-LD graph: WebPage + service OfferCatalog + FAQ. */
function HomeStructuredData() {
  const graph = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${siteUrl}/#webpage`,
        url: siteUrl,
        name: TITLE,
        description: DESCRIPTION,
        isPartOf: { '@id': `${siteUrl}/#website` },
        about: { '@id': `${siteUrl}/#organization` },
        primaryImageOfPage: {
          '@type': 'ImageObject',
          url: `${siteUrl}/og-image.png`,
          width: 1200,
          height: 630,
        },
        inLanguage: 'en-US',
      },
      {
        '@type': 'OfferCatalog',
        '@id': `${siteUrl}/#services`,
        name: 'ACI Infotech Services',
        url: `${siteUrl}/services`,
        provider: { '@id': `${siteUrl}/#organization` },
        itemListElement: SERVICE_CATALOG.map((s, i) => ({
          '@type': 'Offer',
          position: i + 1,
          itemOffered: {
            '@type': 'Service',
            name: s.name,
            description: s.description,
            url: `${siteUrl}${s.path}`,
            provider: { '@id': `${siteUrl}/#organization` },
          },
        })),
      },
      {
        '@type': 'FAQPage',
        '@id': `${siteUrl}/#faq`,
        mainEntity: HOME_FAQ.map((f) => ({
          '@type': 'Question',
          name: f.question,
          acceptedAnswer: { '@type': 'Answer', text: f.answer },
        })),
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}

export default async function HomePage() {
  // One round-trip per content type, all in parallel. Each fetcher
  // degrades to null/empty so the sections fall back to their editorial
  // copy when the CMS is unreachable (e.g. local dev without creds).
  const [news, insights, whitepaper, storyFacts] = await Promise.all([
    getV4FeaturedNews(),
    getV4Insights(3),
    getV4Whitepaper(),
    getV4CaseStudyFacts(SUCCESS_STORY_SLUGS),
  ]);

  return (
    <div className={`bg-[#0a0b10] ${v4Sans}`}>
      <HomeStructuredData />
      <main>
        <V5Hero headingClass={v4Display} />
        <PartnerMarquee headingClass={v4Display} />
        <V5Foldcraft headingClass={v4Display} />
        <VaultLedger headingClass={v4Display} />
        <V5SuccessStories headingClass={v4Display} facts={storyFacts} />
        <ServicesColumns headingClass={v4Display} />
        <V5Insights headingClass={v4Display} news={news} insights={insights} download={whitepaper} />
        <V5HomeFaq headingClass={v4Display} />
      </main>
      <SiteFooter headingClass={v4Display} />
    </div>
  );
}
