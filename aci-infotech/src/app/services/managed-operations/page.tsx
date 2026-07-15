import { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowRight,
  CheckCircle,
  ChevronDown,
  Activity,
  Shield,
  Eye,
  Clock,
  Bell,
  Gauge,
  Workflow,
  FileCheck,
  Server,
  Users,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import { ServiceSchema, FAQSchema, BreadcrumbSchema } from '@/components/seo/StructuredData';
import { getSiteUrl } from '@/lib/site-url';

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
};

const heroOutcomes = [
  'Follow the sun coverage across three time zones, no weekend gap',
  'Platforms you already run, operated by engineers certified on them',
  'NOC and SOC in the same ticketing system, not across an org chart',
  'SLA-backed response for P1 incidents in under fifteen minutes',
];

const nocCapability = {
  eyebrow: 'Network Operations',
  title: 'Network Operations Center',
  icon: Activity,
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
};

const socCapability = {
  eyebrow: 'Security Operations',
  title: 'Security Operations Center',
  icon: Shield,
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
};

const handoffSteps = [
  'NOC picks up the alert',
  'Shared ticket in ServiceNow',
  'SOC triages in parallel',
  'Joint incident bridge',
  'Contain, restore, report',
];

const operationsMetrics = [
  { value: '24/7/365', label: 'Follow the sun coverage across three time zones' },
  { value: '15 min', label: 'P1 response SLA, NOC and SOC' },
  { value: '10+', label: 'Observability and SIEM platforms we operate' },
  { value: 'L1 to L3', label: 'Full escalation ladder in both centers' },
];

const whatsIncluded = [
  {
    icon: Eye,
    title: '24/7 Monitoring',
    description:
      'Continuous visibility across infrastructure, applications, and security events. Dashboards tuned to your service catalog, not generic defaults.',
  },
  {
    icon: Bell,
    title: 'Incident Response',
    description:
      'Documented runbooks, on-call rotations, and escalation paths. Every alert has an owner and a defined next step.',
  },
  {
    icon: Clock,
    title: 'SLA Management',
    description:
      'Response and resolution targets written into the contract, reported monthly. You see the misses and the reasons, not just the wins.',
  },
  {
    icon: Workflow,
    title: 'Runbook Automation',
    description:
      'Self-healing workflows for the alerts that do not need a human. The team focuses on incidents that actually matter.',
  },
  {
    icon: FileCheck,
    title: 'Compliance Reporting',
    description:
      'Audit evidence ready for SOC 2, ISO 27001, HIPAA, and PCI-DSS reviews. Logs, access records, and change history on demand.',
  },
  {
    icon: Gauge,
    title: 'Capacity and Performance',
    description:
      'Trend analysis, right-sizing recommendations, and pre-peak load reviews. Ops insight that feeds back into the platform roadmap.',
  },
];

const adjacentServices = [
  {
    icon: Server,
    title: 'Managed IT and Infrastructure',
    description:
      'End-to-end infrastructure management for hybrid and cloud environments. Monitoring, operations, and support built around what you actually run.',
    href: '/contact?service=managed-infrastructure&source=managed-operations',
    cta: 'Talk to us',
  },
  {
    icon: Users,
    title: 'IT Support Services',
    description:
      'Structured L1, L2, and L3 support aligned to your operations. Delivered as part of a managed engagement, not a generic helpdesk contract.',
    href: '/contact?service=it-support&source=managed-operations',
    cta: 'Talk to us',
  },
  {
    icon: Workflow,
    title: 'Application Managed Services',
    description:
      'Post-deployment operations for the applications and integrations we build. SLA-backed support, release management, continuous improvement.',
    href: '/contact?service=application-managed-services&source=managed-operations',
    cta: 'Talk to us',
  },
];

const faqs = [
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

export default function ManagedOperationsPage() {
  return (
    <>
      <ServiceSchema
        name="Managed Operations: NOC and SOC"
        description="24/7 NOC and SOC operations backed by SLAs. SolarWinds, Datadog, Dynatrace, LogRhythm, Splunk, Sentinel. Follow the sun coverage across three time zones."
        url="/services/managed-operations"
        serviceType="Managed IT Operations"
      />
      <FAQSchema faqs={faqs} />
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: '/' },
          { name: 'Services', url: '/services' },
          { name: 'Managed Operations', url: '/services/managed-operations' },
        ]}
      />

      {/* Hero Section */}
      <section className="py-20 lg:py-28 bg-gradient-to-br from-[var(--aci-secondary)] to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-[var(--aci-primary-light)] font-semibold text-sm uppercase tracking-wide">
                Managed Operations
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-white mt-3 mb-6">
                Two centers. One escalation&nbsp;path.
              </h1>
              <p className="text-lg text-gray-300 mb-8">
                NOC keeps the estate up. SOC keeps it safe. Both run on the platforms
                you already trust, staffed by engineers certified on them, covered
                around the clock across three time zones.
              </p>

              <ul className="space-y-3 mb-8">
                {heroOutcomes.map((outcome) => (
                  <li key={outcome} className="flex items-start gap-3 text-gray-300">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span>{outcome}</span>
                  </li>
                ))}
              </ul>

              <p className="text-sm text-[var(--aci-primary-light)] mb-8">
                Dynatrace Partner | ServiceNow Certified | ISO 27001 Certified
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button href="/contact?service=managed-operations" variant="primary" size="lg">
                  Talk to an Operations Architect
                </Button>
                <Button
                  href="/case-studies?service=managed-operations"
                  variant="ghost"
                  size="lg"
                  className="text-white border-white hover:bg-white/10"
                >
                  See Operations Case Studies
                </Button>
              </div>
            </div>

            {/* Visual */}
            <div className="relative hidden lg:block">
              <div className="bg-gray-800 rounded-2xl p-8 shadow-2xl">
                <div className="flex items-center gap-3 mb-6">
                  <Activity className="w-6 h-6 text-[var(--aci-primary-light)]" />
                  <div className="text-sm text-gray-400">24/7 Operations</div>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-[var(--aci-primary)]/20 rounded-lg p-4 text-center">
                    <Activity className="w-6 h-6 text-[var(--aci-primary-light)] mx-auto mb-2" />
                    <div className="text-white font-medium text-sm">NOC</div>
                    <div className="text-xs text-gray-400 mt-1">Uptime & Performance</div>
                  </div>
                  <div className="bg-[var(--aci-primary)]/20 rounded-lg p-4 text-center">
                    <Shield className="w-6 h-6 text-[var(--aci-primary-light)] mx-auto mb-2" />
                    <div className="text-white font-medium text-sm">SOC</div>
                    <div className="text-xs text-gray-400 mt-1">Threats & Response</div>
                  </div>
                </div>
                <div className="text-center text-gray-500 mb-4">↓</div>
                <div className="bg-[var(--aci-primary)]/30 rounded-lg p-4 text-center mb-4">
                  <div className="text-white font-bold">Shared Ticketing</div>
                  <div className="text-xs text-gray-300 mt-1">ServiceNow ITSM • PagerDuty</div>
                </div>
                <div className="text-center text-gray-500 mb-4">↓</div>
                <div className="bg-green-900/30 rounded-lg p-4 text-center">
                  <div className="text-green-300 font-medium">Contained. Restored. Reported.</div>
                </div>
              </div>
              <div className="absolute -inset-4 bg-[var(--aci-primary)]/10 rounded-3xl blur-3xl -z-10"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Side-by-side NOC | SOC */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 max-w-3xl mx-auto">
            <span className="text-[var(--aci-primary-light)] font-semibold text-sm uppercase tracking-wide">
              Two Disciplines
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--aci-secondary)] mt-3 mb-4">
              We run the tools you already&nbsp;trust.
            </h2>
            <p className="text-lg text-gray-600">
              Different clients run different stacks. We keep engineers certified
              on the platforms enterprises actually use in production.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {[nocCapability, socCapability].map((center) => {
              const Icon = center.icon;
              return (
                <div
                  key={center.title}
                  className="bg-gray-50 rounded-2xl p-8 border border-gray-200 flex flex-col"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Icon className="w-7 h-7 text-[var(--aci-primary)]" />
                    <span className="text-[var(--aci-primary-light)] font-semibold text-xs uppercase tracking-wide">
                      {center.eyebrow}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-[var(--aci-secondary)] mb-3">
                    {center.title}
                  </h3>
                  <p className="text-gray-700 mb-6">{center.intro}</p>

                  <div className="mb-6">
                    <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
                      Platforms we operate
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {center.platforms.map((p) => (
                        <span
                          key={p}
                          className="px-3 py-1 bg-white border border-gray-200 rounded-full text-sm text-gray-700 font-medium"
                        >
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mb-6">
                    <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
                      Coverage model
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {center.coverage}
                    </p>
                  </div>

                  <div className="mb-6 grid grid-cols-3 gap-3">
                    {center.slas.map((sla) => (
                      <div
                        key={sla.label}
                        className="bg-white rounded-lg p-3 border border-gray-200"
                      >
                        <div className="text-base font-bold text-[var(--aci-secondary)]">
                          {sla.value}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">{sla.label}</div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-auto">
                    <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
                      Running this for
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {center.runFor}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Cross-discipline handoff */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-[var(--aci-secondary)] to-gray-900 rounded-2xl p-8 lg:p-12">
            <div className="text-center mb-10 max-w-2xl mx-auto">
              <span className="text-[var(--aci-primary-light)] font-semibold text-sm uppercase tracking-wide">
                Cross-discipline handoff
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-white mt-3 mb-4">
                When an outage turns out to be an attack, no one has to call&nbsp;anyone.
              </h2>
              <p className="text-gray-300">
                Our NOC and SOC share the platform and the ticketing system. An alert
                that starts as a latency spike and ends as an intrusion never crosses
                an org chart. It stays on the same bridge until it closes.
              </p>
            </div>

            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-center gap-3">
              {handoffSteps.map((step, idx) => (
                <div key={step} className="flex flex-col md:flex-row items-center gap-3">
                  <div className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-sm text-gray-200 text-center min-w-[160px]">
                    {step}
                  </div>
                  {idx < handoffSteps.length - 1 && (
                    <ArrowRight className="w-4 h-4 text-[var(--aci-primary-light)] flex-shrink-0 rotate-90 md:rotate-0" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Operations metrics strip */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {operationsMetrics.map((metric) => (
              <div key={metric.label} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-[var(--aci-primary)] mb-2">
                  {metric.value}
                </div>
                <div className="text-sm text-gray-600 leading-snug">{metric.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--aci-secondary)] mb-4">
              What a Managed Operations engagement&nbsp;covers.
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              The deliverables behind the dashboard. Every engagement ships with all six,
              scoped to your environment.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {whatsIncluded.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="bg-white p-8 rounded-xl shadow-sm hover:shadow-lg transition-shadow"
                >
                  <Icon className="w-10 h-10 text-[var(--aci-primary)] mb-4" />
                  <h3 className="text-xl font-semibold text-[var(--aci-secondary)] mb-3">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Adjacent managed services */}
      <section className="py-20 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 max-w-3xl">
            <span className="text-[var(--aci-primary-light)] font-semibold text-sm uppercase tracking-wide">
              Adjacent managed services
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--aci-secondary)] mt-3 mb-4">
              NOC and SOC are the centerpiece. They are not the only&nbsp;thing.
            </h2>
            <p className="text-lg text-gray-600">
              If you need operations on the applications we built, the infrastructure
              underneath, or the support layer for your users, we run those too.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {adjacentServices.map((service) => {
              const Icon = service.icon;
              return (
                <div
                  key={service.title}
                  className="bg-gray-50 p-8 rounded-xl border border-gray-200"
                >
                  <Icon className="w-8 h-8 text-[var(--aci-primary)] mb-4" />
                  <h3 className="text-xl font-semibold text-[var(--aci-secondary)] mb-3">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {service.description}
                  </p>
                  <Link
                    href={service.href}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--aci-primary)] hover:text-[var(--aci-secondary)] transition-colors"
                  >
                    {service.cta}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--aci-secondary)] mb-4">
              Common questions about managed&nbsp;operations.
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq) => (
              <details key={faq.question} className="group bg-white rounded-xl">
                <summary className="flex items-center justify-between cursor-pointer p-6 text-lg font-medium text-[var(--aci-secondary)]">
                  {faq.question}
                  <ChevronDown className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform" />
                </summary>
                <div className="px-6 pb-6 text-gray-600 leading-relaxed">{faq.answer}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-[var(--aci-primary)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to hand over the 3am&nbsp;pager?
          </h2>
          <p className="text-lg text-blue-100 mb-8">
            Talk to an operations architect about coverage, SLAs, and the stack
            we would run for your environment.
          </p>

          <Button href="/contact?service=managed-operations" variant="lime" size="lg">
            Talk to an Operations Architect
          </Button>
        </div>
      </section>
    </>
  );
}
