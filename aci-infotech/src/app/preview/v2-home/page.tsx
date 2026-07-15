/**
 * v2 Homepage preview route.
 *
 * Always rendered on every build (staging and production), regardless
 * of the `NEXT_PUBLIC_USE_V2_HOME` flag. Share one source of truth
 * with `/` (when staged) by delegating to the `V2HomeContent` server
 * component — any edit to v2 content is automatically reflected on
 * both URLs.
 *
 * Route: /preview/v2-home
 */

import type { Metadata } from 'next';
import V2HomeContent from '@/components/v2/home/V2HomeContent';
import { getSiteUrl } from '@/lib/site-url';

export const dynamic = 'force-dynamic';

// Canonical origin: always production, so staging builds can never
// self-canonicalize (see src/lib/site-url.ts).
const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  title: 'ACI Infotech | Enterprise Technology Services — Data & AI, Cloud, Managed Operations',
  description:
    'ACI Infotech builds, ships, and runs production-grade enterprise systems. Data & AI, cloud infrastructure, and managed operations for Fortune 500 companies. 280+ deployments across financial services, healthcare, retail, and manufacturing.',
  keywords:
    'enterprise technology services, data engineering, AI ML, cloud modernization, managed operations, Databricks, Snowflake, AWS, Azure, SAP, ServiceNow, Fortune 500, digital transformation',
  openGraph: {
    title: 'ACI Infotech | Enterprise Technology. Delivered.',
    description:
      'Data & AI. Cloud. Managed operations. 280+ production systems for enterprises in financial services, healthcare, retail, and manufacturing.',
    url: siteUrl,
    siteName: 'ACI Infotech',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ACI Infotech | Enterprise Technology. Delivered.',
    description:
      'Data & AI. Cloud. Managed operations. 280+ production systems for Fortune 500 enterprises.',
  },
  alternates: {
    canonical: siteUrl,
  },
  // Internal design-comparison route: never index a competing homepage.
  robots: {
    index: false,
    follow: false,
  },
};

interface PageProps {
  searchParams?: Promise<{ layout?: string | string[] }>;
}

export default async function V2HomePreviewPage({ searchParams }: PageProps = {}) {
  const resolved = (await searchParams) ?? {};
  return <V2HomeContent searchParams={resolved} />;
}
