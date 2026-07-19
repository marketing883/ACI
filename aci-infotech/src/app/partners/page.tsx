import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import CtaSection from '@/components/v4/hero/CtaSection';
import { v4Sans, v4Display } from '@/components/v4/fonts';
import { SectionHead, CheckBadge, cardShadow, glueWidow } from '@/components/v4/page/kit';

export const metadata: Metadata = {
  title: 'Partners & Certifications',
  description:
    'The platforms ACI Infotech is certified and partnered on, and the security certifications enterprise buyers ask for: SOC 2 Type II, ISO 27001, and HIPAA readiness.',
  alternates: { canonical: 'https://aciinfotech.com/partners' },
};

// Partnership language is kept honest: every status line below is a
// status the site already claims on the matching platform or service
// page, not an invented tier. `href` links to the platform page where
// one exists. The padded 146x77 wordmark PNGs need explicit render
// heights (see flow-configs.ts); tight SVG marks sit a step smaller.
const partners: {
  name: string;
  logo: string;
  logoHeight: number;
  status: string;
  href?: string;
  blurb: string;
}[] = [
  {
    name: 'Databricks',
    logo: '/brand/databricks-color-on-light.svg',
    logoHeight: 38,
    status: 'Databricks consulting partner',
    href: '/platforms/databricks',
    blurb: 'Lakehouse implementation, Unity Catalog governance, and production ML. 40+ lakehouse implementations, with certified architects on data engineering, ML, and platform administration.',
  },
  {
    name: 'Snowflake',
    logo: '/brand/snowflake-color.svg',
    logoHeight: 36,
    status: 'Snowflake Partner',
    href: '/platforms/snowflake',
    blurb: 'Data Cloud architecture, migration, and optimization, with SnowPro certified architects. We hold the Databricks partnership too, so the recommendation follows your workloads.',
  },
  {
    name: 'Salesforce',
    logo: '/brand/salesforce-color.png',
    logoHeight: 48,
    status: 'Salesforce consulting partner',
    href: '/platforms/salesforce',
    blurb: 'Sales Cloud, Service Cloud, Marketing Cloud, and Data Cloud, plus an Agentforce practice that ships working agents.',
  },
  {
    name: 'AWS',
    logo: '/brand/aws-color.png',
    logoHeight: 48,
    status: 'AWS Advanced Consulting Partner',
    href: '/platforms/aws',
    blurb: 'Cloud architecture, migration, landing zones, and FinOps. Part of 200+ cloud migrations delivered across the three majors.',
  },
  {
    name: 'Microsoft Azure',
    logo: '/brand/azure-color.png',
    logoHeight: 48,
    status: 'Microsoft Solutions Partner',
    href: '/platforms/azure',
    blurb: 'Azure landing zones, data, and AI workloads, with Fabric, Synapse, and the Microsoft 365 and Dynamics estate wired in.',
  },
  {
    name: 'Google Cloud',
    logo: '/brand/googlecloud-color.svg',
    logoHeight: 36,
    status: 'Google Cloud Professional certified',
    href: '/platforms/gcp',
    blurb: 'BigQuery lakehouses, Vertex AI, and GKE, with Professional certifications across data engineering, machine learning, security, and infrastructure.',
  },
  {
    name: 'SAP',
    logo: '/brand/sap-color.svg',
    logoHeight: 36,
    status: 'SAP Partner',
    href: '/platforms/sap',
    blurb: 'S/4HANA implementation, migration, and data integration, with Basis and the estate run under SLAs after go-live.',
  },
  {
    name: 'ServiceNow',
    logo: '/images/Solution-Partners/servicenow.png',
    logoHeight: 48,
    status: 'ServiceNow partner',
    href: '/platforms/servicenow',
    blurb: 'ITSM, ITOM, and workflow automation with managed support. Certified consultants across ITSM, ITOM, HRSD, and platform development.',
  },
  {
    name: 'Braze',
    logo: '/images/Solution-Partners/braze.png',
    logoHeight: 48,
    status: 'Braze Alloy partner',
    href: '/platforms/braze',
    blurb: 'Customer engagement and lifecycle messaging: implementations, ESP migrations, and managed campaign operations.',
  },
  {
    name: 'UiPath',
    logo: '/brand/tech/uipath.svg',
    logoHeight: 36,
    status: 'UiPath certified',
    blurb: 'Intelligent process automation, with delivery across UiPath, Power Automate, and Automation Anywhere.',
  },
  {
    name: 'Dynatrace',
    logo: '/brand/dynatrace-color.svg',
    logoHeight: 36,
    status: 'Dynatrace partner',
    blurb: 'Observability and full-stack monitoring for production systems, with SIEM operations on Splunk, Microsoft Sentinel, and CrowdStrike.',
  },
];

const certifications: { name: string; detail: string }[] = [
  { name: 'SOC 2 Type II', detail: 'Independently audited controls for security, availability, and confidentiality.' },
  { name: 'ISO 27001', detail: 'Information security management aligned to the ISO 27001 standard.' },
  { name: 'HIPAA', detail: 'HIPAA-ready delivery for healthcare and life-sciences workloads.' },
];

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://aciinfotech.com' },
    { '@type': 'ListItem', position: 2, name: 'Partners & Certifications', item: 'https://aciinfotech.com/partners' },
  ],
};

// Organization-level credential assertions. Every memberOf and
// hasCredential entry mirrors a status already claimed in site copy
// (platform pages, service pages, and the About page); nothing here is
// asserted for the first time.
const credentialSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': 'https://aciinfotech.com/#organization',
  name: 'ACI Infotech',
  url: 'https://aciinfotech.com',
  memberOf: [
    { '@type': 'ProgramMembership', name: 'Databricks Consulting Partner', hostingOrganization: { '@type': 'Organization', name: 'Databricks' } },
    { '@type': 'ProgramMembership', name: 'Snowflake Partner', hostingOrganization: { '@type': 'Organization', name: 'Snowflake' } },
    { '@type': 'ProgramMembership', name: 'Salesforce Consulting Partner', hostingOrganization: { '@type': 'Organization', name: 'Salesforce' } },
    { '@type': 'ProgramMembership', name: 'AWS Advanced Consulting Partner', hostingOrganization: { '@type': 'Organization', name: 'Amazon Web Services' } },
    { '@type': 'ProgramMembership', name: 'Microsoft Solutions Partner', hostingOrganization: { '@type': 'Organization', name: 'Microsoft' } },
    { '@type': 'ProgramMembership', name: 'SAP Partner', hostingOrganization: { '@type': 'Organization', name: 'SAP' } },
    { '@type': 'ProgramMembership', name: 'ServiceNow Partner', hostingOrganization: { '@type': 'Organization', name: 'ServiceNow' } },
    { '@type': 'ProgramMembership', name: 'Braze Alloy Partner', hostingOrganization: { '@type': 'Organization', name: 'Braze' } },
    { '@type': 'ProgramMembership', name: 'Dynatrace Partner', hostingOrganization: { '@type': 'Organization', name: 'Dynatrace' } },
  ],
  hasCredential: [
    { '@type': 'EducationalOccupationalCredential', name: 'ISO 27001', credentialCategory: 'certification' },
    { '@type': 'EducationalOccupationalCredential', name: 'SOC 2 Type II', credentialCategory: 'certification' },
    { '@type': 'EducationalOccupationalCredential', name: 'CMMI Level 3', credentialCategory: 'certification' },
    { '@type': 'EducationalOccupationalCredential', name: 'UiPath Certified', credentialCategory: 'certification' },
    { '@type': 'EducationalOccupationalCredential', name: 'Google Cloud Professional Certifications', credentialCategory: 'certification' },
  ],
};

export default function PartnersPage() {
  return (
    <div className={`bg-white text-black ${v4Sans}`}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(credentialSchema) }} />

      {/* Hero */}
      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 pb-14 pt-12 md:pt-16">
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
            / Partners
          </p>
          <h1
            className={`max-w-4xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl xl:text-[64px] ${v4Display}`}
            style={{ lineHeight: 1.04 }}
          >
            The platforms we build on, and the{' '}
            <span style={{ color: '#1D4ED8' }}>proof behind&nbsp;it</span>
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-gray-700 md:text-lg">
            We are certified and partnered across the platforms enterprises actually run, and we
            hold the security certifications your review process asks for. Every status on this
            page is on the record in our case&nbsp;studies.
          </p>
        </div>
      </section>

      {/* Partner grid */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <SectionHead
            kicker="Platform partnerships"
            title={
              <>
                Eleven platforms, one <span style={{ color: '#1D4ED8' }}>engineering&nbsp;bar</span>
              </>
            }
            sub="We hold partnerships on both data clouds and stay vendor-honest about which fits your workloads. Each card links to what we actually do on the platform."
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {partners.map((p) => {
              const card = (
                <div
                  className={`flex h-full flex-col rounded-2xl bg-white p-7 transition-shadow duration-300 ${cardShadow} ${
                    p.href ? 'hover:shadow-[0_6px_16px_rgba(63,74,126,0.12),0_2px_36px_rgba(63,74,126,0.18)]' : ''
                  }`}
                >
                  <div className="flex h-12 items-center">
                    <Image
                      src={p.logo}
                      alt={`${p.name} logo`}
                      width={200}
                      height={56}
                      className="w-auto object-contain"
                      style={{ height: p.logoHeight }}
                    />
                  </div>
                  <h3 className={`mt-5 text-xl font-semibold text-black ${v4Display}`}>{p.name}</h3>
                  <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-blue-700">
                    {p.status}
                  </p>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-gray-600">{glueWidow(p.blurb)}</p>
                  {p.href ? (
                    <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-700">
                      <span className="relative">
                        What we build on {p.name}
                        <span className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-current transition-transform duration-300 ease-out group-hover:scale-x-100" />
                      </span>
                      <ArrowUpRight
                        size={15}
                        aria-hidden="true"
                        className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      />
                    </span>
                  ) : null}
                </div>
              );
              return p.href ? (
                <Link key={p.name} href={p.href} className="group block">
                  {card}
                </Link>
              ) : (
                <div key={p.name}>{card}</div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Security and compliance */}
      <section className="border-t border-gray-200 bg-gray-50/60">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <SectionHead
            kicker="Security & compliance"
            title={<>The certifications the first review asks&nbsp;for</>}
            sub="The certifications enterprise buyers ask for in the first security review, so it is a box you already ticked, not a surprise at the end."
          />
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {certifications.map((c) => (
              <div key={c.name} className={`flex items-start gap-4 rounded-2xl bg-white p-7 ${cardShadow}`}>
                <CheckBadge />
                <div>
                  <h3 className={`text-lg font-semibold text-black ${v4Display}`}>{c.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-600">{glueWidow(c.detail)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Proof */}
      <section className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <SectionHead
              kicker="The proof"
              title={<>Partnerships are easy to claim. Look at the&nbsp;work.</>}
              sub="Every platform above shows up in a case study with a number attached."
            />
            <Link
              href="/case-studies"
              className="group inline-flex shrink-0 items-center gap-1.5 text-[15px] font-semibold text-blue-700"
            >
              <span className="relative">
                See the case studies
                <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-current transition-transform duration-300 ease-out group-hover:scale-x-100" />
              </span>
              <ArrowUpRight
                size={16}
                aria-hidden="true"
                className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>
          </div>
        </div>
      </section>

      {/* Closing CTA: one button, nothing else */}
      <CtaSection label="Tell us which platform you are on" href="/contact?reason=partnership&source=partners" />
    </div>
  );
}
