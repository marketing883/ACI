import Link from 'next/link';
import { Metadata } from 'next';
import { ArrowUpRight } from 'lucide-react';
import { BreadcrumbSchema } from '@/components/seo/StructuredData';
import { getSiteUrl } from '@/lib/site-url';
import CtaSection from '@/components/v4/hero/CtaSection';
import { v4Sans, v4Display } from '@/components/v4/fonts';

// Canonical origin: always production, so staging builds can never
// self-canonicalize (see src/lib/site-url.ts).
const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  title: 'Industries We Serve',
  description: 'ACI Infotech serves Fortune 500 companies across Financial Services, Retail, Healthcare, Manufacturing, Energy, and more with enterprise technology solutions.',
  alternates: {
    canonical: `${siteUrl}/industries`,
  },
};

// The full industry catalog. Order matters: it drives both the visible
// index numbering and the ItemList positions below.
const industries = [
  {
    id: 'financial-services',
    name: 'Financial Services',
    line: 'Fraud scoring in under a second, audit-ready lineage, and legacy systems taught to agree.',
    href: '/industries/financial-services',
  },
  {
    id: 'retail',
    name: 'Retail & Consumer',
    line: 'One view of customer and inventory, with forecasting that keeps the shelves honest.',
    href: '/industries/retail',
  },
  {
    id: 'healthcare',
    name: 'Healthcare & Life Sciences',
    line: 'HIPAA-compliant platforms that unify patient records and speed research.',
    href: '/industries/healthcare',
  },
  {
    id: 'hospitality',
    name: 'Hospitality & Food Services',
    line: 'One guest record across every property, and global operations on a single platform.',
    href: '/industries/hospitality',
  },
  {
    id: 'manufacturing',
    name: 'Manufacturing',
    line: 'IoT analytics and predictive maintenance that catch failures before the line stops.',
    href: '/industries/manufacturing',
  },
  {
    id: 'energy',
    name: 'Energy & Utilities',
    line: 'NERC CIP programs that pass audit, with grid analytics on live operational data.',
    href: '/industries/energy',
  },
  {
    id: 'oil-gas',
    name: 'Oil & Gas',
    line: 'SCADA, historians, and ERP unified into one governed platform, wellhead to regulator.',
    href: '/industries/oil-gas',
  },
  {
    id: 'transportation',
    name: 'Transportation & Logistics',
    line: 'Route optimization and fleet visibility, measured the way shippers grade you: OTIF.',
    href: '/industries/transportation',
  },
];

// ItemList JSON-LD: enumerate all eight industry detail pages so
// crawlers see the full catalog from the hub, not just anchor links.
const industriesItemList = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Industries ACI Infotech Serves',
  itemListElement: industries.map((industry, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: industry.name,
    url: `${siteUrl}${industry.href}`,
  })),
};

export default function IndustriesPage() {
  return (
    <main className={`min-h-screen bg-white text-black ${v4Sans}`}>
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(industriesItemList) }}
      />
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: '/' },
          { name: 'Industries', url: '/industries' },
        ]}
      />

      {/* Hero */}
      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 pb-14 pt-12 md:pt-16">
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
            / Industries
          </p>
          <h1
            className={`max-w-4xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl xl:text-[64px] ${v4Display}`}
            style={{ lineHeight: 1.04 }}
          >
            The industries we{' '}
            <span style={{ color: '#1D4ED8' }}>build&nbsp;for</span>
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-gray-700 md:text-lg">
            We build the data platforms, AI systems, and cloud infrastructure
            that regulated, high-volume businesses run on: FHIR pipelines for
            hospital systems, SCADA integration for energy operators, fraud
            models for banks. Different rulebooks, same
            engineering&nbsp;bar.
          </p>
        </div>
      </section>

      {/* Editorial index of all eight industries */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-14 md:py-16">
          <div>
            {industries.map((industry, index) => (
              <Link
                key={industry.id}
                href={industry.href}
                className="group flex items-center gap-5 border-t border-gray-200 py-7 transition-colors duration-300 hover:bg-gray-50/60 sm:gap-8 md:py-8"
              >
                <span className={`w-9 shrink-0 text-sm font-semibold text-gray-300 ${v4Display}`}>
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="flex min-w-0 flex-1 flex-col gap-1 md:flex-row md:items-baseline md:gap-8">
                  <span
                    className={`text-2xl font-bold tracking-tight text-black transition-colors duration-300 group-hover:text-[#1D4ED8] sm:text-3xl md:w-[320px] md:shrink-0 lg:w-[420px] ${v4Display}`}
                  >
                    {industry.name}
                  </span>
                  <span className="text-[15px] leading-relaxed text-gray-500">{industry.line}</span>
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
      <CtaSection label="Tell us which rulebook you answer to" />
    </main>
  );
}
