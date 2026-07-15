import { Metadata } from 'next';
import {
  ArrowRight,
  CheckCircle,
  ChevronDown,
  Compass,
  GitBranch,
  LineChart,
  ListChecks,
  Map,
  Target,
  Wrench,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import { ServiceSchema, FAQSchema, BreadcrumbSchema } from '@/components/seo/StructuredData';
import { getSiteUrl } from '@/lib/site-url';

// Canonical origin: always production, so staging builds can never
// self-canonicalize (see src/lib/site-url.ts).
const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  title: 'Advisory & Strategy Consulting Services',
  description:
    'Technology strategy grounded in delivery. North-star maps, TCO models, capability audits, and ROI frameworks. Advisors who arrive with the engineers who will build what the plan recommends.',
  keywords:
    'technology advisory, data strategy, AI strategy, cloud strategy, capability audit, TCO modeling, ROI framework, CTO advisory',
  alternates: {
    canonical: `${siteUrl}/services/advisory-strategy`,
  },
};

const keyOutcomes = [
  'A written plan in forty-eight hours, not six weeks',
  'Recommendations paired with the build team that will deliver them',
  'TCO models that survive procurement review',
  'Outcomes measured on the roadmap, not on a slide',
];

const offerings = [
  {
    id: 'north-star',
    title: 'North-star architecture',
    description:
      'Target-state maps for data, AI, cloud, and application estates. Written so an engineer can read them, sized so a CFO can sign them off.',
    icon: Compass,
    artifacts: ['Current-state diagram', 'Target-state architecture', 'Transition roadmap'],
    outcomes: ['Shared technical direction', 'Stakeholder alignment', 'Sequenced delivery plan'],
  },
  {
    id: 'capability-audit',
    title: 'Capability audit',
    description:
      'Honest read on what your teams, platforms, and partners can actually do. No vendor pitch, no swag-based conclusions.',
    icon: ListChecks,
    artifacts: ['Capability heatmap', 'Gap analysis', 'Build-vs-buy recommendation'],
    outcomes: ['Objective baseline', 'Sequenced investment priorities', 'Defensible build-vs-buy decisions'],
  },
  {
    id: 'tco-modeling',
    title: 'TCO & FinOps modeling',
    description:
      'Total cost of ownership models for cloud, data, and application estates. Sensitivity analysis so procurement does not find the edge case for you.',
    icon: LineChart,
    artifacts: ['Three-year TCO model', 'Sensitivity analysis', 'FinOps baseline'],
    outcomes: ['Budget defensibility', 'Identified takeout targets', 'Procurement-ready estimates'],
  },
  {
    id: 'roi-frameworks',
    title: 'ROI frameworks',
    description:
      'Outcome definitions tied to the work, with instrumentation baked into the platform. The metric exists before the engagement closes.',
    icon: Target,
    artifacts: ['Outcome tree', 'Instrumentation plan', 'Baseline + target dashboard'],
    outcomes: ['Measurable wins', 'Tied to the roadmap', 'Reported without a deck'],
  },
  {
    id: 'transformation-roadmap',
    title: 'Transformation roadmaps',
    description:
      'Multi-quarter plans for data modernization, AI adoption, and platform consolidation. Sequenced so early wins fund the next quarter.',
    icon: Map,
    artifacts: ['Quarterly roadmap', 'Dependency map', 'Investment case'],
    outcomes: ['Funded phase one', 'Defensible scope for phase two', 'Optionality preserved'],
  },
  {
    id: 'delivery-pod',
    title: 'Build pod on standby',
    description:
      'The engineers who authored the plan stay to build the first increment. No handover meetings, no lost context, no second statement of work.',
    icon: Wrench,
    artifacts: ['Staffed delivery pod', 'Two-week kickoff plan', 'Shared backlog'],
    outcomes: ['No handoff drop', 'Ships within two weeks', 'Strategy meets production'],
  },
];

const differentiators = [
  {
    title: 'Advisors who still ship',
    description:
      'Every advisor on a named engagement has shipped production code in the last year. The plan is grounded because the author knows what will break.',
  },
  {
    title: 'Plans written to be built',
    description:
      'Our deliverables are working artifacts: architecture diagrams an engineer can execute, TCO models a CFO can defend, roadmaps a PMO can track.',
  },
  {
    title: 'One engagement, not two',
    description:
      'Strategy and delivery live on one statement of work. The build pod is named in the plan, so "phase two" is not a sales cycle.',
  },
  {
    title: 'Outcomes, not slide count',
    description:
      'We track the metric the plan was written to move. If the dashboard does not exist at the start, we build it as part of the engagement.',
  },
];

const engagementTypes = [
  {
    audience: 'CIO / CTO',
    focus: 'Technology strategy, platform consolidation, M&A integration, vendor rationalization.',
    typicalLength: '4 to 8 weeks',
  },
  {
    audience: 'Chief Data Officer',
    focus: 'Data strategy, lakehouse target-state, governance operating model, BI rationalization.',
    typicalLength: '3 to 6 weeks',
  },
  {
    audience: 'Chief AI / AI Lead',
    focus: 'AI adoption roadmap, GenAI readiness assessment, build-vs-buy for copilots and agents.',
    typicalLength: '2 to 4 weeks',
  },
  {
    audience: 'Head of Engineering',
    focus: 'Platform engineering roadmap, delivery metrics, IDP design, SRE maturity.',
    typicalLength: '3 to 6 weeks',
  },
];

const faqs = [
  {
    question: 'How is this different from a traditional consulting engagement?',
    answer:
      'Two things. First, every advisor on a named engagement has shipped production code in the last twelve months, so recommendations are grounded in what actually works. Second, the engineers who will build the plan are named in the plan, so strategy and delivery are one engagement, not a handoff between two firms.',
  },
  {
    question: 'What does a forty-eight-hour written plan actually include?',
    answer:
      'A short-form strategy memo: problem statement, the three most credible options, the recommended path with its trade-offs, the first increment of work that could start next sprint, and what success would look like. It is a working document, not a glossy deliverable. The longer engagement produces the architecture, TCO, and roadmap that anchor the program.',
  },
  {
    question: 'Do you take the work if we disagree with your recommendation?',
    answer:
      'Yes. Advisors disagree with clients on the right answer roughly twenty percent of the time. In those cases we write up both paths with the trade-offs and hand the decision back. If you pick a path we do not agree with, we either take the work under your direction and write down where we think the risk sits, or we refer you to someone who believes in your path.',
  },
  {
    question: 'Can you advise without building the implementation?',
    answer:
      'Yes, though we recommend against it. Standalone advisory engagements are available when the build team already exists and the gap is strategic clarity. Most of our work combines the two because the handoff from slide to working system is where the damage usually gets done.',
  },
  {
    question: 'How quickly can you stand up an engagement?',
    answer:
      'A two-person advisory pod can start in five business days. A build pod paired with it is typically staffed within two weeks of the statement of work being signed. Both timelines assume standard enterprise due diligence; regulated industries with MSA reviews add one to two weeks.',
  },
  {
    question: 'What does pricing look like?',
    answer:
      'Advisory engagements are scoped fixed-fee with named deliverables. Paired build pods are time-and-materials or outcome-based depending on how well-defined the first increment is. We prefer outcome-based pricing once the roadmap is stable enough to underwrite it.',
  },
];

export default function AdvisoryStrategyPage() {
  return (
    <>
      <ServiceSchema
        name="Advisory & Strategy"
        description="Technology strategy grounded in delivery. North-star architecture, capability audits, TCO modeling, and ROI frameworks — with the build team that delivers the plan."
        url="/services/advisory-strategy"
        serviceType="Technology Advisory"
      />
      <FAQSchema faqs={faqs} />
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: '/' },
          { name: 'Services', url: '/services' },
          { name: 'Advisory & Strategy', url: '/services/advisory-strategy' },
        ]}
      />

      {/* Hero Section */}
      <section className="py-20 lg:py-28 bg-gradient-to-br from-[var(--aci-secondary)] to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-[var(--aci-primary-light)] font-semibold text-sm uppercase tracking-wide">
                Advisory & Strategy
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-white mt-3 mb-6">
                Strategy grounded in&nbsp;delivery.
              </h1>
              <p className="text-lg text-gray-300 mb-8">
                Our advisors arrive with the engineers who will build what the strategy
                recommends. No six-week calendar invite, no deck that outlives its author.
                A written plan in forty-eight hours and a build pod on standby.
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
                <Button
                  href="/contact?service=advisory-strategy"
                  variant="primary"
                  size="lg"
                >
                  Start an advisory engagement
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

            {/* Visual — compact engagement flow */}
            <div className="relative hidden lg:block">
              <div className="bg-gray-800 rounded-2xl p-8 shadow-2xl">
                <div className="text-sm text-gray-400 mb-4">Advisory engagement</div>
                <div className="space-y-3">
                  {[
                    { step: 'Problem', meta: 'Day 1' },
                    { step: 'Assessment', meta: 'Day 2 to 7' },
                    { step: 'Written plan', meta: 'Day 2, short form' },
                    { step: 'Architecture + TCO', meta: 'Week 2 to 4' },
                    { step: 'Build pod', meta: 'Ships in 2 weeks' },
                    { step: 'Outcomes reported', meta: 'Every increment' },
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
              What the engagement produces
            </h2>
            <p className="text-lg text-gray-600">
              Working artifacts, not deliverables written to be archived.
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

      {/* Engagement types */}
      <section className="py-20 bg-[var(--aci-secondary)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Who we advise
            </h2>
            <p className="text-lg text-gray-400">
              Senior technology leaders on the hook for the outcome.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {engagementTypes.map((eng) => (
              <div key={eng.audience} className="bg-gray-800 rounded-xl p-8">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-semibold text-white">{eng.audience}</h3>
                  <span className="text-xs text-[var(--aci-primary-light)] uppercase tracking-wider">
                    {eng.typicalLength}
                  </span>
                </div>
                <p className="text-gray-300">{eng.focus}</p>
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
              Why advisory lives next to delivery
            </h2>
            <p className="text-lg text-gray-600">
              The handoff from plan to working system is where most programs fail.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {differentiators.map((diff) => (
              <div key={diff.title} className="bg-white p-8 rounded-xl shadow-sm">
                <h3 className="text-xl font-semibold text-[var(--aci-secondary)] mb-3">
                  {diff.title}
                </h3>
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
              Common questions about advisory engagements
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
            Bring us the problem. We will bring a written plan and a build pod.
          </h2>
          <p className="text-lg text-blue-100 mb-8">
            Start an advisory engagement and we will return a short-form strategy memo
            in forty-eight hours.
          </p>

          <Button href="/contact?service=advisory-strategy" variant="lime" size="lg">
            Start an advisory engagement
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </section>
    </>
  );
}
