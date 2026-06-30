import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ShieldCheck, Award, BadgeCheck } from 'lucide-react';
import Button from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'Partners & Certifications',
  description:
    'The platforms ACI Infotech is certified and partnered on, and the security certifications enterprise buyers ask for: SOC 2 Type II, ISO 27001, and HIPAA readiness.',
  alternates: { canonical: 'https://aciinfotech.com/partners' },
};

// Logos live in public/images/Solution-Partners. `href` links to the
// matching platform page where one exists, which is the internal-linking
// the SEO audit asked for. Partnership language is kept honest: a
// capability statement, not an invented tier.
const partners: { name: string; logo: string; href?: string; blurb: string }[] = [
  { name: 'Snowflake', logo: '/images/Solution-Partners/snowflake.svg', href: '/platforms/snowflake', blurb: 'Select Partner. Data Cloud architecture, migration, and optimization.' },
  { name: 'Databricks', logo: '/images/Solution-Partners/databricks.png', href: '/platforms/databricks', blurb: 'Lakehouse implementation, Unity Catalog governance, and production ML.' },
  { name: 'AWS', logo: '/images/Solution-Partners/aws.png', href: '/platforms/aws', blurb: 'Cloud architecture, migration, and FinOps on AWS.' },
  { name: 'Microsoft Azure', logo: '/images/Solution-Partners/azure.png', href: '/platforms/azure', blurb: 'Azure landing zones, data, and AI workloads.' },
  { name: 'Google Cloud', logo: '/images/Solution-Partners/googlecloud.svg', href: '/platforms/gcp', blurb: 'GCP data platforms and analytics modernization.' },
  { name: 'Salesforce', logo: '/images/Solution-Partners/salesforce.png', href: '/platforms/salesforce', blurb: 'Implementation, integration, and customer data work.' },
  { name: 'ServiceNow', logo: '/images/Solution-Partners/servicenow.png', href: '/platforms/servicenow', blurb: 'ITSM, ITOM, and workflow automation with managed support.' },
  { name: 'SAP', logo: '/images/Solution-Partners/sap.png', href: '/platforms/sap', blurb: 'S/4HANA implementation and data integration.' },
  { name: 'Braze', logo: '/images/Solution-Partners/braze.png', href: '/platforms/braze', blurb: 'Customer engagement and lifecycle messaging.' },
  { name: 'Dynatrace', logo: '/images/Solution-Partners/dynatrace.png', blurb: 'Observability and full-stack monitoring for production systems.' },
];

const certifications: { name: string; detail: string; icon: typeof ShieldCheck }[] = [
  { name: 'SOC 2 Type II', detail: 'Independently audited controls for security, availability, and confidentiality.', icon: ShieldCheck },
  { name: 'ISO 27001', detail: 'Information security management aligned to the ISO 27001 standard.', icon: Award },
  { name: 'HIPAA', detail: 'HIPAA-ready delivery for healthcare and life-sciences workloads.', icon: BadgeCheck },
];

export default function PartnersPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://aciinfotech.com' },
      { '@type': 'ListItem', position: 2, name: 'Partners & Certifications', item: 'https://aciinfotech.com/partners' },
    ],
  };

  return (
    <main className="min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero */}
      <section className="bg-[var(--aci-secondary)] pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-[var(--aci-primary-light)] font-medium mb-4 tracking-wide uppercase">
              Partners & Certifications
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              The platforms we build on, and the proof behind it.
            </h1>
            <p className="text-xl text-gray-400">
              We are certified and partnered across the platforms enterprises actually run, and we
              hold the security certifications your review process asks for. The work is on the
              record in our case studies.
            </p>
          </div>
        </div>
      </section>

      {/* Partner ecosystem */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--aci-secondary)] mb-3">
            Platform partnerships
          </h2>
          <p className="text-lg text-gray-600 mb-10 max-w-3xl">
            We partner with both data clouds and stay vendor-honest about which fits your workloads.
            Each links to what we actually do on it.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {partners.map((p) => {
              const card = (
                <div className="h-full border border-gray-200 rounded-xl p-6 hover:border-[var(--aci-primary)]/40 hover:shadow-sm transition-all">
                  <div className="relative h-10 w-32 mb-5">
                    <Image src={p.logo} alt={p.name} fill className="object-contain object-left" />
                  </div>
                  <div className="font-bold text-[var(--aci-secondary)] mb-1">{p.name}</div>
                  <p className="text-sm text-gray-600 leading-relaxed">{p.blurb}</p>
                  {p.href && (
                    <span className="inline-flex items-center gap-1 text-[var(--aci-primary)] text-sm font-medium mt-3">
                      What we build <ArrowRight className="w-4 h-4" />
                    </span>
                  )}
                </div>
              );
              return p.href ? (
                <Link key={p.name} href={p.href} className="block">
                  {card}
                </Link>
              ) : (
                <div key={p.name}>{card}</div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-16 md:py-20 bg-gray-50 border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--aci-secondary)] mb-3">
            Security & compliance
          </h2>
          <p className="text-lg text-gray-600 mb-10 max-w-3xl">
            The certifications enterprise buyers ask for in the first security review, so it is a
            box you already ticked, not a surprise at the end.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {certifications.map((c) => {
              const Icon = c.icon;
              return (
                <div key={c.name} className="bg-white rounded-xl p-7 border border-gray-200">
                  <div className="w-12 h-12 rounded-lg bg-[var(--aci-primary)]/10 flex items-center justify-center mb-5">
                    <Icon className="w-6 h-6 text-[var(--aci-primary)]" />
                  </div>
                  <h3 className="text-lg font-bold text-[var(--aci-secondary)] mb-2">{c.name}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{c.detail}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Proof / CTA */}
      <section className="py-20 bg-[var(--aci-primary)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Partnerships are easy to claim. Look at the work.
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Every platform above shows up in a case study with a number attached.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button href="/case-studies" variant="lime" size="lg">
              See the Case Studies
            </Button>
            <Button href="/contact?reason=architecture-call" variant="secondary" size="lg">
              Talk to an Architect
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
