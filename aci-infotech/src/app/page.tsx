/**
 * Root route — build-time switch between v1 and v2 homepage.
 *
 *   - `NEXT_PUBLIC_USE_V2_HOME=true` → v2 (dark-premium editorial)
 *   - Unset → v1 (original production homepage)
 *
 * Inactive branch is pruned from the bundle at build time.
 *
 * All versions remain reachable for comparison:
 *   /v1             → always v1
 *   /preview/v2-home → always v2
 */

import type { Metadata } from 'next';
import V2HomeContent from '@/components/v2/home/V2HomeContent';
import V1HomePage from './v1/page';

export const revalidate = 60;

const USE_V2_HOME = process.env.NEXT_PUBLIC_USE_V2_HOME === 'true';
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://aciinfotech.com';

// Build-time-resolved metadata. On v2 builds the homepage gets the
// editorial title/description and a canonical that points at the
// site root. On v1 builds the layout.tsx default title applies.
export const metadata: Metadata = USE_V2_HOME
  ? {
      title:
        'ACI Infotech | Enterprise Technology Services — Data & AI, Cloud, Managed Operations',
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
      alternates: { canonical: siteUrl },
      robots: { index: true, follow: true },
    }
  : {
      alternates: { canonical: siteUrl },
    };

export default async function HomePage() {
  if (USE_V2_HOME) {
    return <V2HomeContent />;
  }
  return <V1HomePage />;
}
