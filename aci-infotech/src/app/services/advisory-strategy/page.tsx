import { Metadata } from 'next';
import RelatedLinks from '@/components/seo/RelatedLinks';
import { advisoryStrategyRelated } from '@/content/related-links';
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
  OfferingList,
  ProcessStrip,
  FactsRow,
  PageFaq,
} from '@/components/v4/page/kit';
import FlowScene from '@/components/v4/page/FlowScene';
import { FLOWS } from '@/components/v4/page/flow-configs';

export const revalidate = 3600;

// Canonical origin: always production, so staging builds can never
// self-canonicalize (see src/lib/site-url.ts).
const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  title: 'Advisory & Strategy Consulting Services',
  description:
    'Technology advisory grounded in delivery. North-star maps, TCO models, capability audits, and ROI frameworks from advisors who ship what they recommend.',
  keywords:
    'technology advisory, data strategy, AI strategy, cloud strategy, capability audit, TCO modeling, ROI framework, CTO advisory',
  alternates: {
    canonical: `${siteUrl}/services/advisory-strategy`,
  },
  // Per-page social card. Without this, every share and link preview
  // inherited the homepage's OpenGraph (title, image, and og:url all
  // pointing at /), mis-attributing all 21 service/platform pages.
  openGraph: {
    title: 'Advisory & Strategy Consulting Services | ACI Infotech',
    description: 'Technology advisory grounded in delivery. North-star maps, TCO models, capability audits, and ROI frameworks from advisors who ship what they recommend.',
    url: `${siteUrl}/services/advisory-strategy`,
    siteName: 'ACI Infotech',
    type: 'website',
    images: DEFAULT_OG_IMAGES,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Advisory & Strategy Consulting Services | ACI Infotech',
    description: 'Technology advisory grounded in delivery. North-star maps, TCO models, capability audits, and ROI frameworks from advisors who ship what they recommend.',
    images: DEFAULT_TWITTER_IMAGES,
  },
};

/* ------------------------------- page copy ------------------------------- */

const OFFERINGS = [
  {
    title: 'North-star architecture',
    body: 'Target-state maps for data, AI, cloud, and application estates. Written so an engineer can read them, sized so a CFO can sign them off.',
    chips: ['Current-state diagram', 'Target-state architecture', 'Transition roadmap'],
  },
  {
    title: 'Capability audit',
    body: 'Honest read on what your teams, platforms, and partners can actually do. No vendor pitch, no swag-based conclusions.',
    chips: ['Capability heatmap', 'Gap analysis', 'Build-vs-buy recommendation'],
  },
  {
    title: 'TCO & FinOps modeling',
    body: 'Total cost of ownership models for cloud, data, and application estates. Sensitivity analysis so procurement does not find the edge case for you.',
    chips: ['Three-year TCO model', 'Sensitivity analysis', 'FinOps baseline'],
  },
  {
    title: 'ROI frameworks',
    body: 'Outcome definitions tied to the work, with instrumentation baked into the platform. The metric exists before the engagement closes.',
    chips: ['Outcome tree', 'Instrumentation plan', 'Baseline + target dashboard'],
  },
  {
    title: 'Transformation roadmaps',
    body: 'Multi-quarter plans for data modernization, AI adoption, and platform consolidation. Sequenced so early wins fund the next quarter.',
    chips: ['Quarterly roadmap', 'Dependency map', 'Investment case'],
  },
  {
    title: 'Build pod on standby',
    body: 'The engineers who authored the plan stay to build the first increment. No handover meetings, no lost context, no second statement of work.',
    chips: ['Staffed delivery pod', 'Two-week kickoff plan', 'Shared backlog'],
  },
];

// Signature: the "Who we advise" audience table. Senior technology
// leaders on the hook for the outcome, with the focus and the typical
// engagement length for each.
const AUDIENCES = [
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

// The engagement flow, condensed from the old hero visual.
const PROCESS = [
  {
    title: 'Problem',
    timeframe: 'Day 1',
    body: 'You bring the decision that is stuck. We meet the people who own it and the systems it touches.',
  },
  {
    title: 'Written plan',
    timeframe: 'Hour 48',
    body: 'A short-form strategy memo: the problem, the credible options, the recommended path, and the first increment of work.',
  },
  {
    title: 'Architecture + TCO',
    timeframe: 'Week 2 to 4',
    body: 'The target-state maps, cost models, and roadmap that anchor the program and survive procurement review.',
  },
  {
    title: 'Build pod',
    timeframe: 'Ships in 2 weeks',
    body: 'The engineers named in the plan start the first increment. No handover, no second sales cycle.',
  },
  {
    title: 'Outcomes reported',
    timeframe: 'Every increment',
    body: 'The metric the plan was written to move, tracked on a dashboard, not on a slide.',
  },
];

const DIFFERENTIATORS = [
  {
    label: 'Advisors who still ship',
    line: 'Every advisor on a named engagement has shipped production code in the last year. The plan is grounded because the author knows what will break.',
  },
  {
    label: 'Plans written to be built',
    line: 'Our deliverables are working artifacts: architecture diagrams an engineer can execute, TCO models a CFO can defend, roadmaps a PMO can track.',
  },
  {
    label: 'One engagement, not two',
    line: 'Strategy and delivery live on one statement of work. The build pod is named in the plan, so "phase two" is not a sales cycle.',
  },
  {
    label: 'Outcomes, not slide count',
    line: 'We track the metric the plan was written to move. If the dashboard does not exist at the start, we build it as part of the engagement.',
  },
];

const FAQS = [
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

/* --------------------------------- page ---------------------------------- */

export default function AdvisoryStrategyPage() {
  return (
    <div className={`bg-white text-black ${v4Sans}`}>
      <ServiceSchema
        name="Advisory & Strategy"
        description="Technology strategy grounded in delivery. North-star architecture, capability audits, TCO modeling, and ROI frameworks, with the build team that delivers the plan."
        url="/services/advisory-strategy"
        serviceType="Technology Advisory"
      />
      {/* FAQPage JSON-LD comes from PageFaq below — one per page. */}
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: '/' },
          { name: 'Services', url: '/services' },
          { name: 'Advisory & Strategy', url: '/services/advisory-strategy' },
        ]}
      />

      <ServiceHero
        kicker="Advisory & Strategy"
        title={
          <>
            Technology advisory{' '}
            <span style={{ color: '#1D4ED8' }}>grounded in&nbsp;delivery.</span>
          </>
        }
        lede="Our advisors arrive with the engineers who will build what the strategy recommends. No six-week calendar invite, no deck that outlives its author. A written plan in forty-eight hours and a build pod on standby."
        chips={[
          'North-star architecture',
          'Capability audits',
          'TCO models',
          'ROI frameworks',
        ]}
        primary={{ label: 'Start an advisory engagement', href: '/contact?service=advisory-strategy' }}
        secondary={{ label: 'See delivery outcomes', href: '/case-studies' }}
        visual={<FlowScene config={FLOWS['advisory-strategy']} />}
      />

      {/* Problem band: strategy decks that outlive their authors */}
      <FoldcraftHero
        geistClass={v4Geist}
        pill="Why strategy stalls"
        headline={
          <>
            The deck outlived <span className="text-[#60A5FA]">its author.</span>{' '}
            <br className="hidden sm:block" />
            The problem stayed.
          </>
        }
        body="Every enterprise has one: a strategy deck from a firm that left before slide forty shipped. The plan was directionally right and structurally unbuildable, because nobody who wrote it had to live with it. We write plans the way engineers write code: short, testable, and attached to the pod that builds the first increment."
        story={{
          metric: { value: '90d', label: 'From prototype to production' },
          title: 'A plan that became a production lakehouse in one quarter',
          href: '/case-studies/driving-enterprise-data-transformation-with-aci-s-azure-lakehouse',
          logoSrc: '/brand/aci-infotech-logo-white.png',
          logoAlt: 'ACI Infotech',
        }}
      />

      {/* What the engagement produces */}
      <section className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <SectionHead
            kicker="What we deliver"
            title={
              <>
                Working artifacts, <span style={{ color: '#1D4ED8' }}>not&nbsp;shelfware.</span>
              </>
            }
            sub="What the engagement produces: working artifacts, not deliverables written to be archived."
          />
          <OfferingList items={OFFERINGS} />
        </div>
      </section>

      {/* Signature: the "Who we advise" audience table */}
      <section className="border-t border-gray-200 bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <SectionHead
            kicker="Who we advise"
            title={
              <>
                Senior leaders on the hook{' '}
                <span style={{ color: '#1D4ED8' }}>for the&nbsp;outcome.</span>
              </>
            }
          />

          <div className="mt-12 overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-left text-sm">
              <thead>
                <tr>
                  <th className="border-b border-gray-200 pb-4 pr-8 text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">
                    Who
                  </th>
                  <th className="border-b border-gray-200 pb-4 pr-8 text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">
                    Where the engagement focuses
                  </th>
                  <th className="border-b border-gray-200 pb-4 text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">
                    Typical length
                  </th>
                </tr>
              </thead>
              <tbody>
                {AUDIENCES.map((row) => (
                  <tr key={row.audience}>
                    <td className="border-b border-gray-200 py-5 pr-8 align-top">
                      <span className={`text-base font-semibold text-black md:text-lg ${v4Display}`}>
                        {row.audience}
                      </span>
                    </td>
                    <td className="border-b border-gray-200 py-5 pr-8 align-top text-[15px] leading-relaxed text-gray-600">
                      {row.focus}
                    </td>
                    <td className="whitespace-nowrap border-b border-gray-200 py-5 align-top text-[13px] font-semibold uppercase tracking-wide text-blue-700">
                      {row.typicalLength}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Engagement flow */}
      <section className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <SectionHead
            kicker="How it runs"
            title="Forty-eight hours to a plan. Two weeks to a pod."
          />
          <ProcessStrip steps={PROCESS} />
        </div>
      </section>

      {/* Why advisory lives next to delivery */}
      <section className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <SectionHead
            kicker="Why ACI"
            title="Why advisory lives next to delivery"
            sub="The handoff from plan to working system is where most programs fail."
          />
          <FactsRow facts={DIFFERENTIATORS} />
        </div>
      </section>

      <PageFaq
        kicker="Questions"
        title={
          <>
            Advisory questions,
            <br />
            <span style={{ color: '#1D4ED8' }}>answered straight.</span>
          </>
        }
        sub="Including the one about what happens when we think you are wrong. Start an engagement and a short-form strategy memo lands in forty-eight hours."
        faqs={FAQS}
      />

      <ClusterPosts keywords={['strategy', 'advisory', 'roadmap', 'tco', 'ai strategy']} />

      <RelatedLinks items={advisoryStrategyRelated} />

      {/* Closing CTA: video stage, one button, nothing else */}
      <CtaSection label="Bring us the problem" href="/contact?service=advisory-strategy" />
    </div>
  );
}
