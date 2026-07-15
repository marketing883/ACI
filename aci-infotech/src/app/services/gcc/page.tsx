import { Metadata } from 'next';
import {
  ArrowRight,
  CheckCircle,
  ChevronDown,
  Building2,
  Users,
  Shield,
  Landmark,
  GitBranch,
  ClipboardList,
  Cpu,
  Globe,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import { ServiceSchema, FAQSchema, BreadcrumbSchema } from '@/components/seo/StructuredData';
import { getSiteUrl } from '@/lib/site-url';

// Canonical origin: always production, so staging builds can never
// self-canonicalize (see src/lib/site-url.ts).
const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  title: 'GCC Setup & Captive Center Services',
  description:
    'Stand up and operate Global Capability Centers in India and LatAm. Entity setup, hiring, facilities, IT, and operating model delivered in one engagement, with a documented build-operate-transfer path.',
  keywords:
    'GCC services, global capability center, captive center setup, build operate transfer, BOT, India GCC, LatAm GCC, offshore captive',
  alternates: {
    canonical: `${siteUrl}/services/gcc`,
  },
  // Per-page social card. Without this, every share and link preview
  // inherited the homepage's OpenGraph (title, image, and og:url all
  // pointing at /), mis-attributing all 21 service/platform pages.
  openGraph: {
    title: 'GCC Setup & Captive Center Services | ACI Infotech',
    description: 'Stand up and operate Global Capability Centers in India and LatAm. Entity setup, hiring, facilities, IT, and operating model delivered in one engagement, with a documented build-operate-transfer path.',
    url: `${siteUrl}/services/gcc`,
    siteName: 'ACI Infotech',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GCC Setup & Captive Center Services | ACI Infotech',
    description: 'Stand up and operate Global Capability Centers in India and LatAm. Entity setup, hiring, facilities, IT, and operating model delivered in one engagement, with a documented build-operate-transfer path.',
  },
};

const keyOutcomes = [
  'First engineering pod live in ninety days, entity and all',
  'Hiring, facilities, IT, and governance in one statement of work',
  'Build-operate-transfer onto your payroll when you are ready',
  'Run like your team, not like a vendor',
];

const offerings = [
  {
    id: 'feasibility',
    title: 'Feasibility & site selection',
    description:
      'Honest read on whether a captive center makes sense, where to put it, and what it will cost over three years. Written so a CFO can sign it.',
    icon: ClipboardList,
    artifacts: ['Site comparison', 'Three-year TCO', 'Talent-pool depth report'],
    outcomes: ['Defensible site choice', 'Board-ready business case', 'No surprises at go-live'],
  },
  {
    id: 'entity-setup',
    title: 'Entity & compliance',
    description:
      'Legal entity setup, tax registrations, labour compliance, and the STPI or SEZ paperwork when the benefits are worth it. Your lawyers still sign; we do the legwork.',
    icon: Landmark,
    artifacts: ['Incorporated entity', 'Tax and labour registrations', 'SEZ / STPI filing'],
    outcomes: ['Operationally compliant on day one', 'Audit trail for every filing', 'Nothing to clean up later'],
  },
  {
    id: 'talent',
    title: 'Talent pipeline',
    description:
      'Hiring partners vetted on your role profiles, not on generic JDs. Assessment workflow owned by your engineering leaders, calibrated against offers they have made before.',
    icon: Users,
    artifacts: ['Role definitions', 'Hiring funnel SLAs', 'Calibrated assessment rubrics'],
    outcomes: ['Offer-to-join rate above 80%', 'First pod staffed in 60 days', 'Attrition under industry median'],
  },
  {
    id: 'facilities',
    title: 'Facilities & ops',
    description:
      'Office fit-out, access control, BCP, and the mundane logistics that decide whether engineers show up the second month. Leased or coworking to match the ramp.',
    icon: Building2,
    artifacts: ['Fit-out plan', 'BCP + access policy', 'Vendor contracts'],
    outcomes: ['Office ready before hiring completes', 'Documented continuity plan', 'No scramble at quarter end'],
  },
  {
    id: 'it-security',
    title: 'IT & security',
    description:
      'Network, endpoints, identity, and the SOC integration that lets the center operate on your trust perimeter from day one.',
    icon: Cpu,
    artifacts: ['Network + endpoint build', 'IAM integration', 'SOC onboarding'],
    outcomes: ['Your identity provider, your policies', 'Audit-ready telemetry', 'No orphan environment'],
  },
  {
    id: 'operating-model',
    title: 'Operating model',
    description:
      'Leadership hire sequencing, reporting lines back to HQ, cadences, metrics, and the cultural work that keeps the captive feeling like one team, not a remote vendor.',
    icon: Globe,
    artifacts: ['Org design', 'Reporting + cadence playbook', 'Culture plan'],
    outcomes: ['Leadership hired before scale-up', 'Metrics HQ actually trusts', 'Team feels like yours'],
  },
];

const botStages = [
  {
    stage: 'Build',
    window: 'Month 0 to 6',
    focus: 'Entity, first leadership hires, facilities, and IT go live. First pod in production on a real workstream, not training exercises.',
  },
  {
    stage: 'Operate',
    window: 'Month 6 to 24',
    focus: 'Scale to target headcount. We run HR, payroll, admin, and compliance while your leadership owns delivery. Monthly reporting to HQ on fixed metrics.',
  },
  {
    stage: 'Transfer',
    window: 'Month 24 onwards',
    focus: 'Pre-negotiated transfer of the entity and payroll to you, on a timeline written into the original contract. No renegotiation at the finish line.',
  },
];

const differentiators = [
  {
    title: 'A captive, not an outsourcing contract',
    description:
      'The engineers report to your leadership from week one. We run the plumbing so your people can focus on the work, not the logistics.',
  },
  {
    title: 'Transfer terms written up front',
    description:
      'The BOT transfer price, conditions, and timeline are in the original statement of work. Not a second negotiation when you have the most to lose.',
  },
  {
    title: 'Delivery pod as reference architecture',
    description:
      'The first pod runs on our engineering practices for data, AI, and cloud, so you see the operating model in action before scaling it.',
  },
  {
    title: 'Optional, not compulsory, transfer',
    description:
      'If you decide to keep the operate model long term, the contract stays in place. The transfer option never expires, and we do not push it.',
  },
];

const geos = [
  {
    name: 'Hyderabad, India',
    strengths: 'Deep engineering talent, mature GCC ecosystem, strong SEZ/STPI incentives.',
    suited: 'Data, AI, platform engineering, 24×7 operations.',
  },
  {
    name: 'Bengaluru, India',
    strengths: 'Product engineering density, best-in-class leadership talent pool.',
    suited: 'Application engineering, platform, senior architecture roles.',
  },
  {
    name: 'Pune, India',
    strengths: 'Strong enterprise-app talent, lower attrition than tier-one metros.',
    suited: 'ERP, enterprise applications, managed services.',
  },
  {
    name: 'LatAm (Mexico / Costa Rica / Colombia)',
    strengths: 'Time-zone alignment with US hours, bilingual talent.',
    suited: 'Near-shore pods, support centers, product engineering for US customers.',
  },
];

const faqs = [
  {
    question: 'How is this different from staff augmentation or a managed-services contract?',
    answer:
      'Staff augmentation rents individuals. Managed services rents outcomes against a defined scope. A captive is your own legal entity, your own employees, and your own leadership, operated by us while it scales. The difference shows up at year three, when the staff-aug body shop has churned twice and the captive still has the same tech leads running the same platforms.',
  },
  {
    question: 'Why not set up the captive ourselves?',
    answer:
      'Many enterprises do, and several succeed. The trade-off is that the first twelve months consume senior leadership attention that would otherwise sit on product work. Firms come to us when they want the entity, hiring, and operating model delivered on a timeline, with contractual commitments around when the first pod goes live.',
  },
  {
    question: 'How quickly can we get a pod live?',
    answer:
      'Ninety days from signed engagement to first engineering pod running on a real workstream. That assumes standard Indian entity setup; BOT-style entity transfers add two to three weeks. Offer-to-join timelines for senior roles can extend the ramp for the second and third pods.',
  },
  {
    question: 'What headcount does a captive make sense at?',
    answer:
      'Forty engineers is the rough floor below which the operating cost of an entity starts to exceed the savings. Below that, a managed-services contract or near-shore staff-aug pod is usually cleaner. Above two hundred engineers, a captive is almost always the right answer on a three-year horizon.',
  },
  {
    question: 'How is the BOT transfer priced?',
    answer:
      'The transfer consideration is negotiated into the original statement of work as a pre-agreed formula, typically a function of headcount and entity valuation at the transfer date. We do not believe in discovering the transfer price when the client has least leverage.',
  },
  {
    question: 'Can you operate only part of the captive and leave the rest to us?',
    answer:
      'Yes. The most common split is: we run HR, payroll, facilities, and compliance; you run delivery, engineering leadership, and the technical roadmap. That split holds for as long as you want it to.',
  },
];

export default function GCCPage() {
  return (
    <>
      <ServiceSchema
        name="GCC & Captive Operations"
        description="Stand up and operate Global Capability Centers in India and LatAm. Entity, hiring, facilities, IT, and operating model in one engagement, with a documented build-operate-transfer path."
        url="/services/gcc"
        serviceType="Global Capability Center Setup"
      />
      <FAQSchema faqs={faqs} />
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: '/' },
          { name: 'Services', url: '/services' },
          { name: 'GCC & Captive Operations', url: '/services/gcc' },
        ]}
      />

      {/* Hero Section */}
      <section className="py-20 lg:py-28 bg-gradient-to-br from-[var(--aci-secondary)] to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-[var(--aci-primary-light)] font-semibold text-sm uppercase tracking-wide">
                GCC & Captive Operations
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-white mt-3 mb-6">
                Your team. Your operating model.&nbsp;Offshore.
              </h1>
              <p className="text-lg text-gray-300 mb-8">
                A captive delivery center stood up and run like a first-party
                team, not an outsourcing contract. Entity, hiring, facilities,
                and operating model in one engagement, with a build-operate-transfer
                path onto your payroll when you are ready.
              </p>

              <ul className="space-y-3 mb-8">
                {keyOutcomes.map((outcome) => (
                  <li key={outcome} className="flex items-start gap-3 text-gray-300">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span>{outcome}</span>
                  </li>
                ))}
              </ul>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button href="/contact?service=gcc" variant="primary" size="lg">
                  Scope a captive center
                </Button>
                <Button
                  href="/case-studies"
                  variant="ghost"
                  size="lg"
                  className="text-white border-white hover:bg-white/10"
                >
                  See delivery outcomes
                </Button>
              </div>
            </div>

            {/* Visual — captive stand-up flow */}
            <div className="relative hidden lg:block">
              <div className="bg-gray-800 rounded-2xl p-8 shadow-2xl">
                <div className="text-sm text-gray-400 mb-4">Captive stand-up</div>
                <div className="space-y-3">
                  {[
                    { step: 'Feasibility + site', meta: 'Week 1 to 4' },
                    { step: 'Entity + compliance', meta: 'Week 2 to 10' },
                    { step: 'Facilities + IT', meta: 'Week 4 to 12' },
                    { step: 'Hiring first pod', meta: 'Week 6 to 12' },
                    { step: 'Pod live on real work', meta: 'Day 90' },
                    { step: 'Operate + scale', meta: 'Month 3 to 24' },
                    { step: 'Transfer (optional)', meta: 'Month 24 onwards' },
                  ].map((row) => (
                    <div
                      key={row.step}
                      className="flex items-center justify-between bg-gray-700 rounded-lg px-4 py-3"
                    >
                      <span className="text-white font-medium">{row.step}</span>
                      <span className="text-xs text-gray-400">{row.meta}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="absolute -inset-4 bg-[var(--aci-primary)]/10 rounded-3xl blur-3xl -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* What we deliver */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--aci-secondary)] mb-4">
              What the engagement covers
            </h2>
            <p className="text-lg text-gray-600">
              Everything the captive needs to feel like your team on day one.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {offerings.map((offering) => {
              const Icon = offering.icon;
              return (
                <div
                  key={offering.id}
                  className="bg-white p-8 rounded-xl shadow-sm hover:shadow-lg transition-shadow"
                >
                  <Icon className="w-10 h-10 text-[var(--aci-primary)] mb-4" />
                  <h3 className="text-xl font-semibold text-[var(--aci-secondary)] mb-3">
                    {offering.title}
                  </h3>
                  <p className="text-gray-600 mb-6">{offering.description}</p>

                  <div className="mb-4">
                    <div className="text-sm font-medium text-gray-500 mb-2">Artifacts</div>
                    <ul className="space-y-1">
                      {offering.artifacts.map((artifact) => (
                        <li
                          key={artifact}
                          className="flex items-center gap-2 text-sm text-gray-600"
                        >
                          <GitBranch className="w-3 h-3 text-[var(--aci-primary)]" />
                          {artifact}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-500 mb-2">Outcomes</div>
                    <ul className="space-y-1">
                      {offering.outcomes.map((outcome) => (
                        <li
                          key={outcome}
                          className="flex items-center gap-2 text-sm text-gray-600"
                        >
                          <CheckCircle className="w-3 h-3 text-green-500" />
                          {outcome}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* BOT Lifecycle */}
      <section className="py-20 bg-[var(--aci-secondary)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Build. Operate. Transfer.
            </h2>
            <p className="text-lg text-gray-400">
              The three phases are in the original contract, including the transfer terms.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {botStages.map((stage) => (
              <div key={stage.stage} className="bg-gray-800 rounded-xl p-8">
                <div className="flex items-baseline justify-between mb-4">
                  <h3 className="text-2xl font-semibold text-white">{stage.stage}</h3>
                  <span className="text-xs text-[var(--aci-primary-light)] uppercase tracking-wider">
                    {stage.window}
                  </span>
                </div>
                <p className="text-gray-300">{stage.focus}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Geographies */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--aci-secondary)] mb-4">
              Where we stand captives up
            </h2>
            <p className="text-lg text-gray-600">
              Location is a function of talent depth, time-zone fit, and cost, not a preference.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {geos.map((geo) => (
              <div
                key={geo.name}
                className="bg-gray-50 rounded-xl p-8 border border-gray-100"
              >
                <h3 className="text-xl font-semibold text-[var(--aci-secondary)] mb-3">
                  {geo.name}
                </h3>
                <p className="text-gray-600 mb-3">
                  <span className="font-medium text-gray-700">Strengths:</span> {geo.strengths}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium text-gray-700">Best suited for:</span> {geo.suited}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Differentiators */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--aci-secondary)] mb-4">
              Why a captive, run by us
            </h2>
            <p className="text-lg text-gray-600">
              The plumbing stays with us so your leadership keeps product focus.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {differentiators.map((diff) => (
              <div key={diff.title} className="bg-white p-8 rounded-xl shadow-sm">
                <div className="flex items-start gap-3 mb-3">
                  <Shield className="w-5 h-5 text-[var(--aci-primary)] mt-1 flex-shrink-0" />
                  <h3 className="text-xl font-semibold text-[var(--aci-secondary)]">
                    {diff.title}
                  </h3>
                </div>
                <p className="text-gray-600">{diff.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--aci-secondary)] mb-4">
              Common questions about captive centers
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq) => (
              <details key={faq.question} className="group bg-gray-50 rounded-xl">
                <summary className="flex items-center justify-between cursor-pointer p-6 text-lg font-medium text-[var(--aci-secondary)]">
                  {faq.question}
                  <ChevronDown className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform" />
                </summary>
                <div className="px-6 pb-6 text-gray-600">{faq.answer}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-[var(--aci-primary)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Bring us the scale problem. We will bring the entity, the team,
            and the timeline.
          </h2>
          <p className="text-lg text-blue-100 mb-8">
            Scope a captive center and get a three-year TCO and a ninety-day
            plan to first pod live.
          </p>

          <Button href="/contact?service=gcc" variant="lime" size="lg">
            Scope a captive center
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </section>
    </>
  );
}
