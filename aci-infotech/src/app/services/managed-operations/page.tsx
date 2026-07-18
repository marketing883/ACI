import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import RelatedLinks from '@/components/seo/RelatedLinks';
import { managedOperationsRelated } from '@/content/related-links';
import ClusterPosts from '@/components/seo/ClusterPosts';
import { ServiceSchema, BreadcrumbSchema } from '@/components/seo/StructuredData';
import { DEFAULT_OG_IMAGES, DEFAULT_TWITTER_IMAGES } from '@/lib/seo/og';
import { getSiteUrl } from '@/lib/site-url';
import FoldcraftHero from '@/components/v4/hero/FoldcraftHero';
import CtaSection from '@/components/v4/hero/CtaSection';
import { v4Sans, v4Geist, v4Display } from '@/components/v4/fonts';
import {
  SectionHead,
  ServiceHero,
  PageFaq,
} from '@/components/v4/page/kit';
import FlowScene from '@/components/v4/page/FlowScene';
import { FLOWS } from '@/components/v4/page/flow-configs';

export const revalidate = 3600;

// Canonical origin: always production, so staging builds can never
// self-canonicalize (see src/lib/site-url.ts).
const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  title: 'Managed Operations: NOC and SOC Services',
  description:
    '24/7 NOC and SOC operations backed by SLAs. SolarWinds, Datadog, Dynatrace, LogRhythm, Splunk, Sentinel. Follow the sun coverage across three time zones.',
  keywords:
    'NOC services, SOC services, managed operations, 24/7 monitoring, SolarWinds, Datadog, Dynatrace, LogRhythm, Splunk, Microsoft Sentinel, CrowdStrike, Genesys, ServiceNow ITSM',
  alternates: {
    canonical: `${siteUrl}/services/managed-operations`,
  },
  // Per-page social card. Without this, every share and link preview
  // inherited the homepage's OpenGraph (title, image, and og:url all
  // pointing at /), mis-attributing all 21 service/platform pages.
  openGraph: {
    title: 'Managed Operations: NOC and SOC Services | ACI Infotech',
    description: '24/7 NOC and SOC operations backed by SLAs. SolarWinds, Datadog, Dynatrace, LogRhythm, Splunk, Sentinel. Follow the sun coverage across three time zones.',
    url: `${siteUrl}/services/managed-operations`,
    siteName: 'ACI Infotech',
    type: 'website',
    images: DEFAULT_OG_IMAGES,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Managed Operations: NOC and SOC Services | ACI Infotech',
    description: '24/7 NOC and SOC operations backed by SLAs. SolarWinds, Datadog, Dynatrace, LogRhythm, Splunk, Sentinel. Follow the sun coverage across three time zones.',
    images: DEFAULT_TWITTER_IMAGES,
  },
};

/* ------------------------------- page copy ------------------------------- */

// Signature: the NOC | SOC side-by-side. Two disciplines, shared
// ticketing. Platform lists and SLA specifics kept exactly as published.
const CENTERS = [
  {
    eyebrow: 'Network Operations',
    title: 'Network Operations Center',
    intro:
      'Keeping the estate up. Infrastructure, network, application, and cloud monitoring around the clock.',
    platforms: [
      'SolarWinds NPM / SAM',
      'Datadog',
      'Dynatrace (partner)',
      'Genesys (incident intake)',
      'ServiceNow ITSM',
    ],
    coverage:
      'Follow the sun across India, US, and EU shifts. L1 triage, L2 resolution, L3 engineering escalation, with runbooks tied to your service catalog.',
    slas: [
      { label: 'P1 response', value: '15 min' },
      { label: 'P2 response', value: '1 hour' },
      { label: 'Uptime target', value: '99.95%' },
    ],
    runFor:
      'Multi-site manufacturers, hospital networks, national telcos, and cloud-first SaaS operators.',
  },
  {
    eyebrow: 'Security Operations',
    title: 'Security Operations Center',
    intro:
      'Keeping the estate safe. Threat detection, incident response, forensics, and audit evidence the auditor will actually accept.',
    platforms: [
      'LogRhythm',
      'Splunk',
      'Microsoft Sentinel',
      'CrowdStrike',
      'PagerDuty',
    ],
    coverage:
      'Tier 1 through Tier 3 analysts on shift with a weekly threat hunting cadence. Incident response playbooks tied to your compliance obligations.',
    slas: [
      { label: 'P1 response', value: '10 min' },
      { label: 'Threat hunts', value: 'Weekly' },
      { label: 'Frameworks', value: 'SOC 2, ISO 27001, HIPAA' },
    ],
    runFor:
      'Regulated healthcare, financial services, and retail payment environments.',
  },
];

// Signature: the five-step cross-discipline handoff.
const HANDOFF_STEPS = [
  'NOC picks up the alert',
  'Shared ticket in ServiceNow',
  'SOC triages in parallel',
  'Joint incident bridge',
  'Contain, restore, report',
];

const OPERATIONS_METRICS = [
  { value: '24/7/365', label: 'Follow the sun coverage across three time zones' },
  { value: '15 min', label: 'P1 response SLA, NOC and SOC' },
  { value: '10+', label: 'Observability and SIEM platforms we operate' },
  { value: 'L1 to L3', label: 'Full escalation ladder in both centers' },
];

const WHATS_INCLUDED = [
  {
    title: '24/7 Monitoring',
    body: 'Continuous visibility across infrastructure, applications, and security events. Dashboards tuned to your service catalog, not generic defaults.',
  },
  {
    title: 'Incident Response',
    body: 'Documented runbooks, on-call rotations, and escalation paths. Every alert has an owner and a defined next step.',
  },
  {
    title: 'SLA Management',
    body: 'Response and resolution targets written into the contract, reported monthly. You see the misses and the reasons, not just the wins.',
  },
  {
    title: 'Runbook Automation',
    body: 'Self-healing workflows for the alerts that do not need a human. The team focuses on incidents that actually matter.',
  },
  {
    title: 'Compliance Reporting',
    body: 'Audit evidence ready for SOC 2, ISO 27001, HIPAA, and PCI-DSS reviews. Logs, access records, and change history on demand.',
  },
  {
    title: 'Capacity and Performance',
    body: 'Trend analysis, right-sizing recommendations, and pre-peak load reviews. Ops insight that feeds back into the platform roadmap.',
  },
];

const ADJACENT_SERVICES = [
  {
    title: 'Managed IT and Infrastructure',
    body: 'End-to-end infrastructure management for hybrid and cloud environments. Monitoring, operations, and support built around what you actually run.',
    href: '/contact?service=managed-infrastructure&source=managed-operations',
  },
  {
    title: 'IT Support Services',
    body: 'Structured L1, L2, and L3 support aligned to your operations. Delivered as part of a managed engagement, not a generic helpdesk contract.',
    href: '/contact?service=it-support&source=managed-operations',
  },
  {
    title: 'Application Managed Services',
    body: 'Post-deployment operations for the applications and integrations we build. SLA-backed support, release management, continuous improvement.',
    href: '/contact?service=application-managed-services&source=managed-operations',
  },
];

const FAQS = [
  {
    question: 'Do you run NOC and SOC from the same team?',
    answer:
      'Separate disciplines, shared tooling. NOC analysts and SOC analysts sit on different rotations with different certifications, but they share the ticketing system, the on-call bridge, and the runbook library. An alert that starts as a latency spike and ends as an intrusion stays on one bridge until it closes.',
  },
  {
    question: 'Can you operate our existing monitoring stack, or do we have to switch?',
    answer:
      'We operate what you already run. Our engineers are certified on SolarWinds, Datadog, Dynatrace, LogRhythm, Splunk, Microsoft Sentinel, CrowdStrike, Genesys, and ServiceNow. If you have a stack we do not list here, tell us and we will tell you honestly whether we can run it well.',
  },
  {
    question: 'How does follow the sun coverage work?',
    answer:
      'Three shifts across India, US, and EU with documented handoff checkpoints. Tickets carry context, not just state. A P1 opened in one shift gets the same treatment as a P1 raised in the next, because the runbook and ticket history travel with it.',
  },
  {
    question: 'What are your SLA commitments?',
    answer:
      'P1 response in fifteen minutes for NOC and ten minutes for SOC. P2 response in one hour. Uptime targets of 99.95 percent or higher depending on your platform. Misses are reported monthly with root cause, not hidden in a stoplight dashboard.',
  },
  {
    question: 'Do you help with SOC 2, ISO 27001, or HIPAA audits?',
    answer:
      'Yes. Audit-ready evidence is part of the engagement. We maintain access logs, change history, alert timelines, and incident documentation in formats the auditor expects. Several of our clients pass audits using the artifacts we produce as a byproduct of normal operations.',
  },
  {
    question: 'What happens if we want to move off managed services later?',
    answer:
      'Your runbooks, dashboards, alert definitions, and incident history belong to you. We document the environment throughout the engagement so a transition back in-house or to another provider is a real option, not a hostage negotiation.',
  },
];

/* --------------------------------- page ---------------------------------- */

export default function ManagedOperationsPage() {
  return (
    <div className={`bg-white text-black ${v4Sans}`}>
      <ServiceSchema
        name="Managed Operations: NOC and SOC"
        description="24/7 NOC and SOC operations backed by SLAs. SolarWinds, Datadog, Dynatrace, LogRhythm, Splunk, Sentinel. Follow the sun coverage across three time zones."
        url="/services/managed-operations"
        serviceType="Managed IT Operations"
      />
      {/* FAQPage JSON-LD comes from PageFaq below — one per page. */}
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: '/' },
          { name: 'Services', url: '/services' },
          { name: 'Managed Operations', url: '/services/managed-operations' },
        ]}
      />

      <ServiceHero
        kicker="Managed Operations"
        title={
          <>
            Managed IT Operations:{' '}
            <span style={{ color: '#1D4ED8' }}>24/7 NOC and&nbsp;SOC</span>
          </>
        }
        lede="Two centers, one escalation path. NOC keeps the estate up. SOC keeps it safe. Both run on the platforms you already trust, staffed by engineers certified on them, covered around the clock across three time zones."
        chips={[
          'Dynatrace Partner',
          'ServiceNow Certified',
          'ISO 27001 Certified',
          'Follow the sun',
        ]}
        primary={{ label: 'Talk to an operations architect', href: '/contact?service=managed-operations' }}
        secondary={{ label: 'See operations case studies', href: '/case-studies?service=managed-operations' }}
        visual={<FlowScene config={FLOWS['managed-operations']} />}
      />

      {/* Problem band: the 3am page and the newest person on the rotation */}
      <FoldcraftHero
        geistClass={v4Geist}
        image="/images/v4/svc-ops.jpg"
        pill="Why on-call breaks"
        headline={
          <>
            The 3am page goes to whoever{' '}
            <br className="hidden sm:block" />
            <span className="text-[#60A5FA]">joined the rotation&nbsp;last.</span>
          </>
        }
        body="Every on-call rotation has a newest member, and the worst incidents have a talent for finding them. Runbooks go stale, context lives in one senior engineer's head, and the estate is only as safe as whoever answered the page. A managed NOC and SOC replaces that lottery with a staffed desk: certified engineers on shift around the clock, runbooks that travel with the ticket, and an SLA someone actually answers for."
        story={{
          metric: { value: '99.97%', label: 'Uptime across 72+ servers' },
          title: 'A complex digital estate, engineered to stay available',
          href: '/case-studies/optimizing-enterprise-it-operations-with-automated-devops-and-monitoring',
          logoSrc: '/brand/aci-infotech-logo-white.png',
          logoAlt: 'ACI Infotech',
        }}
      />

      {/* Signature: NOC | SOC side by side */}
      <section className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <SectionHead
            kicker="Two disciplines"
            title={
              <>
                We run the tools you{' '}
                <span style={{ color: '#1D4ED8' }}>already&nbsp;trust.</span>
              </>
            }
            sub="Different clients run different stacks. We keep engineers certified on the platforms enterprises actually use in production."
          />

          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            {CENTERS.map((center) => (
              <div
                key={center.title}
                className="flex flex-col rounded-3xl border border-gray-200 bg-gray-50/60 p-8 md:p-10"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
                  / {center.eyebrow}
                </p>
                <h3 className={`mt-3 text-2xl font-bold text-black md:text-3xl ${v4Display}`}>
                  {center.title}
                </h3>
                <p className="mt-3 text-[15px] leading-relaxed text-gray-700">{center.intro}</p>

                <p className="mt-7 text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">
                  Platforms we operate
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {center.platforms.map((p) => (
                    <span
                      key={p}
                      className="rounded-full border border-gray-200 bg-white px-3 py-1 text-sm font-medium text-gray-700"
                    >
                      {p}
                    </span>
                  ))}
                </div>

                <p className="mt-7 text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">
                  Coverage model
                </p>
                <p className="mt-3 text-sm leading-relaxed text-gray-600">{center.coverage}</p>

                <div className="mt-7 grid grid-cols-3 gap-px overflow-hidden rounded-xl border border-gray-200 bg-gray-200">
                  {center.slas.map((sla) => (
                    <div key={sla.label} className="bg-white p-4">
                      <p className={`text-base font-bold leading-tight text-[#1D4ED8] md:text-lg ${v4Display}`}>
                        {sla.value}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">{sla.label}</p>
                    </div>
                  ))}
                </div>

                <p className="mt-7 text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">
                  Running this for
                </p>
                <p className="mt-3 text-sm leading-relaxed text-gray-600">{center.runFor}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Signature: cross-discipline handoff flow */}
      <section className="border-t border-gray-200 bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <SectionHead
            kicker="Cross-discipline handoff"
            title={
              <>
                When an outage turns out to be an attack,{' '}
                <span style={{ color: '#1D4ED8' }}>no one has to call&nbsp;anyone.</span>
              </>
            }
            sub="Our NOC and SOC share the platform and the ticketing system. An alert that starts as a latency spike and ends as an intrusion never crosses an org chart. It stays on the same bridge until it closes."
          />

          <div className="mt-12 flex flex-col items-stretch gap-3 md:flex-row md:items-center">
            {HANDOFF_STEPS.map((step, i) => (
              <div key={step} className="flex flex-1 flex-col items-center gap-3 md:flex-row">
                <div className="w-full rounded-xl border border-gray-200 bg-white p-4 text-center md:text-left">
                  <span className={`block text-2xl font-bold leading-none text-gray-200 ${v4Display}`}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="mt-2 block text-sm font-medium text-gray-800">{step}</span>
                </div>
                {i < HANDOFF_STEPS.length - 1 && (
                  <ArrowRight
                    size={16}
                    aria-hidden="true"
                    className="shrink-0 rotate-90 text-blue-700 md:rotate-0"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Operations metrics strip */}
      <section className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-12 md:py-14">
          <div className="grid grid-cols-2 gap-x-8 gap-y-10 lg:grid-cols-4">
            {OPERATIONS_METRICS.map((metric) => (
              <div key={metric.label}>
                <p className={`text-3xl font-bold leading-none text-[#1D4ED8] sm:text-4xl ${v4Display}`}>
                  {metric.value}
                </p>
                <p className="mt-2 text-sm font-medium text-gray-500">{metric.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What's included */}
      <section className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <SectionHead
            kicker="What's included"
            title={
              <>
                What a managed operations{' '}
                <span style={{ color: '#1D4ED8' }}>engagement&nbsp;covers.</span>
              </>
            }
            sub="The deliverables behind the dashboard. Every engagement ships with all six, scoped to your environment."
          />
          <div className="mt-12 grid gap-x-14 md:grid-cols-2">
            {WHATS_INCLUDED.map((item, i) => (
              <div key={item.title} className="border-t border-gray-200 py-8">
                <div className="flex items-baseline gap-4">
                  <span className={`text-sm font-semibold text-gray-300 ${v4Display}`}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className={`text-xl font-semibold text-black md:text-2xl ${v4Display}`}>
                    {item.title}
                  </h3>
                </div>
                <p className="mt-3 text-[15px] leading-relaxed text-gray-600">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Adjacent managed services */}
      <section className="border-t border-gray-200 bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <SectionHead
            kicker="Adjacent managed services"
            title={
              <>
                NOC and SOC are the centerpiece.{' '}
                <span style={{ color: '#1D4ED8' }}>Not the only&nbsp;thing.</span>
              </>
            }
            sub="If you need operations on the applications we built, the infrastructure underneath, or the support layer for your users, we run those too."
          />

          {/* Crawlable summary of the managed IT services estate. */}
          <p className="mt-6 max-w-3xl text-base leading-relaxed text-gray-600 md:text-lg">
            Our managed IT services cover the full estate: infrastructure
            monitoring and patching for hybrid and cloud environments,
            application support under SLA, and the L1 to L3 helpdesk in
            between. One contract, one escalation path, reported against the
            same monthly scorecard as the NOC and SOC.
          </p>

          <div className="mt-12 grid gap-x-14 md:grid-cols-3">
            {ADJACENT_SERVICES.map((service) => (
              <div key={service.title} className="border-t border-gray-200 py-8">
                <h3 className={`text-xl font-semibold text-black ${v4Display}`}>{service.title}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-gray-600">{service.body}</p>
                <Link
                  href={service.href}
                  className="group mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-700"
                >
                  <span className="relative">
                    Talk to us
                    <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-current transition-transform duration-300 ease-out group-hover:scale-x-100" />
                  </span>
                  <ArrowUpRight
                    size={14}
                    aria-hidden="true"
                    className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <PageFaq
        kicker="Questions"
        title={
          <>
            Operations questions,
            <br />
            <span style={{ color: '#1D4ED8' }}>answered straight.</span>
          </>
        }
        sub="Coverage, SLAs, and what happens to your runbooks if you ever leave. Anything else belongs in a conversation."
        faqs={FAQS}
      />

      <ClusterPosts keywords={['noc', 'soc', 'managed services', 'monitoring', 'operations']} />

      <RelatedLinks items={managedOperationsRelated} />

      {/* Closing CTA: video stage, one button, nothing else */}
      <CtaSection label="Hand over the 3am pager" href="/contact?service=managed-operations" />
    </div>
  );
}
