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
  title: 'Enterprise Technology Services',
  description: 'Data Engineering, AI/ML, Cloud Modernization, MarTech, Digital Transformation, and Cyber Security services for Fortune 500 companies.',
  alternates: {
    canonical: `${siteUrl}/services`,
  },
};

// The full practice catalog. Order matters: it drives both the visible
// index numbering and the ItemList positions below.
const services = [
  {
    id: 'data-engineering',
    title: 'Data Engineering',
    line: 'Databricks lakehouses, Snowflake warehouses, and real-time pipelines that feed AI and analytics.',
    href: '/services/data-engineering',
  },
  {
    id: 'applied-ai-ml',
    title: 'Applied AI & ML',
    line: 'AI systems that ship to production and move a business metric, not a slide deck.',
    href: '/services/applied-ai-ml',
  },
  {
    id: 'cloud-modernization',
    title: 'Cloud Modernization',
    line: 'Migrations and modernizations that cut cost, hold performance, and set up the next build.',
    href: '/services/cloud-modernization',
  },
  {
    id: 'martech-cdp',
    title: 'MarTech & CDP',
    line: 'Customer data platforms that turn engagement into measurable marketing revenue.',
    href: '/services/martech-cdp',
  },
  {
    id: 'digital-transformation',
    title: 'Digital Transformation',
    line: 'Process, ERP, and integration modernization delivered with enterprise engineering rigor.',
    href: '/services/digital-transformation',
  },
  {
    id: 'app-development',
    title: 'App Development',
    line: 'Enterprise applications built to survive production, on top of your data and AI delivery.',
    href: '/services/app-development',
  },
  {
    id: 'quality-engineering',
    title: 'Quality Engineering',
    line: 'Quality as an engineering discipline, not a test phase. AI-augmented and owned by the team that ships.',
    href: '/services/quality-engineering',
  },
  {
    id: 'cyber-security',
    title: 'Cyber Security',
    line: 'Zero trust architecture, DevSecOps, and compliance that satisfies the regulator.',
    href: '/services/cyber-security',
  },
  {
    id: 'advisory-strategy',
    title: 'Advisory & Strategy',
    line: 'Technology strategy written to be built, with the build pod that delivers the plan.',
    href: '/services/advisory-strategy',
  },
  {
    id: 'gcc',
    title: 'GCC & Captive Operations',
    line: 'Captive centers in India and LatAm, run like your team, with a documented transfer path.',
    href: '/services/gcc',
  },
  {
    id: 'managed-operations',
    title: 'Managed Operations',
    line: '24/7 NOC and SOC on the platforms you already run, backed by SLAs across three time zones.',
    href: '/services/managed-operations',
  },
];

const FACTS = [
  { value: '2006', label: 'Founded' },
  { value: '1,200+', label: 'Engineers' },
  { value: '500+', label: 'Large enterprise projects' },
  { value: '11', label: 'Global delivery hubs' },
];

// ItemList JSON-LD: enumerate all 11 service detail pages so crawlers
// see the full practice catalog from the hub, not just anchor links.
const servicesItemList = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'ACI Infotech Services',
  itemListElement: services.map((service, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: service.title,
    url: `${siteUrl}${service.href}`,
  })),
};

export default function ServicesPage() {
  return (
    <main className={`min-h-screen bg-white text-black ${v4Sans}`}>
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesItemList) }}
      />
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: '/' },
          { name: 'Services', url: '/services' },
        ]}
      />

      {/* Hero */}
      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 pb-14 pt-12 md:pt-16">
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
            / Services
          </p>
          <h1
            className={`max-w-4xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl xl:text-[64px] ${v4Display}`}
            style={{ lineHeight: 1.04 }}
          >
            Enterprise{' '}
            <span style={{ color: '#1D4ED8' }}>Technology&nbsp;Services</span>
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-gray-700 md:text-lg">
            Eleven practice areas. One engineering standard. Every engagement
            staffed with senior architects who have shipped production systems
            at Fortune 500 scale.
          </p>
        </div>
      </section>

      {/* Editorial index of all eleven practices */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-14 md:py-16">
          <div>
            {services.map((service, index) => (
              <Link
                key={service.id}
                href={service.href}
                className="group flex items-baseline gap-5 border-t border-gray-200 py-7 transition-colors duration-300 hover:bg-gray-50/60 sm:gap-8 md:py-8"
              >
                <span className={`w-9 shrink-0 text-sm font-semibold text-gray-300 ${v4Display}`}>
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="flex min-w-0 flex-1 flex-col gap-1 md:flex-row md:items-baseline md:gap-8">
                  <span
                    className={`text-2xl font-bold tracking-tight text-black transition-colors duration-300 group-hover:text-[#1D4ED8] sm:text-3xl md:w-[340px] md:shrink-0 lg:w-[420px] lg:text-4xl ${v4Display}`}
                  >
                    {service.title}
                  </span>
                  <span className="text-[15px] leading-relaxed text-gray-500">{service.line}</span>
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
            {FACTS.map((fact) => (
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
      <CtaSection label="Tell us what you are building" href="/contact?reason=project-inquiry&source=services-hub" />
    </main>
  );
}
