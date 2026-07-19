import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';
import { ArrowUpRight } from 'lucide-react';
import { BreadcrumbSchema } from '@/components/seo/StructuredData';
import { getSiteUrl } from '@/lib/site-url';
import { DEFAULT_OG_IMAGES, DEFAULT_TWITTER_IMAGES } from '@/lib/seo/og';
import CtaSection from '@/components/v4/hero/CtaSection';
import { v4Sans, v4Display } from '@/components/v4/fonts';

// Canonical origin: always production, so staging builds can never
// self-canonicalize (see src/lib/site-url.ts).
const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  title: 'Technology Platforms',
  description: 'ACI Infotech is a certified partner for Databricks, Snowflake, Salesforce, AWS, Azure, SAP, and more. Enterprise-grade implementations by senior architects.',
  alternates: {
    canonical: `${siteUrl}/platforms`,
  },
  openGraph: {
    title: 'Technology Platforms | ACI Infotech',
    description: 'ACI Infotech is a certified partner for Databricks, Snowflake, Salesforce, AWS, Azure, SAP, and more. Enterprise-grade implementations by senior architects.',
    url: `${siteUrl}/platforms`,
    siteName: 'ACI Infotech',
    type: 'website',
    images: DEFAULT_OG_IMAGES,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Technology Platforms | ACI Infotech',
    description: 'ACI Infotech is a certified partner for Databricks, Snowflake, Salesforce, AWS, Azure, SAP, and more. Enterprise-grade implementations by senior architects.',
    images: DEFAULT_TWITTER_IMAGES,
  },
};

// The full platform catalog. Order matters: it drives both the visible
// index numbering and the ItemList positions below.
const platforms = [
  {
    id: 'databricks',
    name: 'Databricks',
    logo: '/images/Solution-Partners/databricks.png',
    line: 'Lakehouses on Delta Lake, governed with Unity Catalog and tuned until the bill makes sense.',
    href: '/platforms/databricks',
  },
  {
    id: 'snowflake',
    name: 'Snowflake',
    logo: '/images/Solution-Partners/snowflake.svg',
    line: 'Governed SQL analytics and data sharing, with the compute spend watched from day one.',
    href: '/platforms/snowflake',
  },
  {
    id: 'aws',
    name: 'AWS',
    logo: '/images/Solution-Partners/aws.png',
    line: 'Migrations, landing zones, and FinOps for estates that run production on AWS.',
    href: '/platforms/aws',
  },
  {
    id: 'azure',
    name: 'Microsoft Azure',
    logo: '/images/Solution-Partners/azure.png',
    line: 'Landing zones, Synapse, and Fabric for enterprises already deep in Microsoft.',
    href: '/platforms/azure',
  },
  {
    id: 'gcp',
    name: 'Google Cloud',
    logo: '/images/Solution-Partners/googlecloud.svg',
    line: 'BigQuery, Vertex AI, and GKE for analytics-heavy, container-native workloads.',
    href: '/platforms/gcp',
  },
  {
    id: 'salesforce',
    name: 'Salesforce',
    logo: '/images/Solution-Partners/salesforce.png',
    line: 'CRM, Data Cloud, and an Agentforce practice that ships working agents.',
    href: '/platforms/salesforce',
  },
  {
    id: 'sap',
    name: 'SAP',
    logo: '/images/Solution-Partners/sap.png',
    line: 'S/4HANA moves with the finance close reconciled before anything retires.',
    href: '/platforms/sap',
  },
  {
    id: 'servicenow',
    name: 'ServiceNow',
    logo: '/images/Solution-Partners/servicenow.png',
    line: 'ITSM, ITOM, and workflows with an owner, an SLA, and a CMDB that stays accurate.',
    href: '/platforms/servicenow',
  },
  {
    id: 'microsoft-dynamics',
    name: 'Microsoft Dynamics 365',
    logo: '/brand/microsoft-mono.svg',
    line: 'CRM and ERP on one Dataverse, extended with Power Platform and Copilot.',
    href: '/platforms/microsoft-dynamics',
  },
  {
    id: 'braze',
    name: 'Braze',
    logo: '/images/Solution-Partners/braze.png',
    line: 'Canvas journeys wired to your customer data, with deliverability watched through migration.',
    href: '/platforms/braze',
  },
];

// ItemList JSON-LD: enumerate all ten platform detail pages so crawlers
// see the full catalog from the hub, not just anchor links.
const platformsItemList = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'ACI Infotech Technology Platforms',
  itemListElement: platforms.map((platform, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: platform.name,
    url: `${siteUrl}${platform.href}`,
  })),
};

export default function PlatformsPage() {
  return (
    <main className={`min-h-screen bg-white text-black ${v4Sans}`}>
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(platformsItemList) }}
      />
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: '/' },
          { name: 'Platforms', url: '/platforms' },
        ]}
      />

      {/* Hero */}
      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 pb-14 pt-12 md:pt-16">
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
            / Platforms
          </p>
          <h1
            className={`max-w-4xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl xl:text-[64px] ${v4Display}`}
            style={{ lineHeight: 1.04 }}
          >
            The platforms we{' '}
            <span style={{ color: '#1D4ED8' }}>build&nbsp;on</span>
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-gray-700 md:text-lg">
            Ten platforms, one engineering bar. Certified teams, real
            implementations, and the willingness to say when a platform is
            the wrong choice for&nbsp;you.
          </p>
        </div>
      </section>

      {/* Editorial index of all ten platforms */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-14 md:py-16">
          <div>
            {platforms.map((platform, index) => (
              <Link
                key={platform.id}
                href={platform.href}
                className="group flex items-center gap-5 border-t border-gray-200 py-7 transition-colors duration-300 hover:bg-gray-50/60 sm:gap-8 md:py-8"
              >
                <span className={`w-9 shrink-0 text-sm font-semibold text-gray-300 ${v4Display}`}>
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="hidden w-28 shrink-0 sm:flex sm:items-center md:w-36">
                  <Image
                    src={platform.logo}
                    alt=""
                    aria-hidden="true"
                    width={144}
                    height={40}
                    className="h-8 w-auto max-w-full object-contain object-left"
                  />
                </span>
                <span className="flex min-w-0 flex-1 flex-col gap-1 md:flex-row md:items-baseline md:gap-8">
                  <span
                    className={`text-2xl font-bold tracking-tight text-black transition-colors duration-300 group-hover:text-[#1D4ED8] sm:text-3xl md:w-[280px] md:shrink-0 lg:w-[360px] ${v4Display}`}
                  >
                    {platform.name}
                  </span>
                  <span className="text-[15px] leading-relaxed text-gray-500">{platform.line}</span>
                </span>
                <ArrowUpRight
                  size={22}
                  aria-hidden="true"
                  className="shrink-0 self-center text-gray-300 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#1D4ED8]"
                />
              </Link>
            ))}
            <div className="border-t border-gray-200" />
          </div>
        </div>
      </section>

      {/* Facts band */}
      <section className="border-t border-gray-200 bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 py-12 md:py-14">
          <div className="grid grid-cols-2 gap-x-8 gap-y-10 lg:grid-cols-4">
            {[
              { value: '2006', label: 'Founded' },
              { value: '1,200+', label: 'Engineers' },
              { value: '500+', label: 'Large enterprise projects' },
              { value: '11', label: 'Global delivery hubs' },
            ].map((fact) => (
              <div key={fact.label}>
                <p className={`text-4xl font-bold leading-none text-[#1D4ED8] sm:text-5xl ${v4Display}`}>
                  {fact.value}
                </p>
                <p className="mt-2 text-sm font-medium text-gray-500">{fact.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Closing CTA: video stage, one button, nothing else */}
      <CtaSection label="Tell us which platform you are on" href="/contact?reason=project-inquiry&source=platforms-hub" />
    </main>
  );
}
