import { Metadata } from 'next';
import RelatedLinks from '@/components/seo/RelatedLinks';
import { gccRelated } from '@/content/related-links';
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
  BridgeBand,
  FactsRow,
  PageFaq,
  cardShadow,
  CheckBadge,
  glueWidow,
} from '@/components/v4/page/kit';
import FlowScene from '@/components/v4/page/FlowScene';
import { FLOWS } from '@/components/v4/page/flow-configs';

export const revalidate = 3600;

// Canonical origin: always production, so staging builds can never
// self-canonicalize (see src/lib/site-url.ts).
const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  title: 'GCC Setup & Captive Center Services',
  description:
    'GCC setup in India and LatAm: entity, hiring, facilities, IT, and operating model in one engagement, with a documented build-operate-transfer path.',
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
    description: 'GCC setup in India and LatAm: entity, hiring, facilities, IT, and operating model in one engagement, with a documented build-operate-transfer path.',
    url: `${siteUrl}/services/gcc`,
    siteName: 'ACI Infotech',
    type: 'website',
    images: DEFAULT_OG_IMAGES,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GCC Setup & Captive Center Services | ACI Infotech',
    description: 'GCC setup in India and LatAm: entity, hiring, facilities, IT, and operating model in one engagement, with a documented build-operate-transfer path.',
    images: DEFAULT_TWITTER_IMAGES,
  },
};

/* ------------------------------- page copy ------------------------------- */

const OFFERINGS = [
  {
    title: 'Feasibility & site selection',
    body: 'Honest read on whether a captive center makes sense, where to put it, and what it will cost over three years. Written so a CFO can sign it.',
    chips: ['Site comparison', 'Three-year TCO', 'Talent-pool depth report'],
  },
  {
    title: 'Entity & compliance',
    body: 'Legal entity setup, tax registrations, labour compliance, and the STPI or SEZ paperwork when the benefits are worth it. Your lawyers still sign; we do the legwork.',
    chips: ['Incorporated entity', 'Tax and labour registrations', 'SEZ / STPI filing'],
  },
  {
    title: 'Talent pipeline',
    body: 'Hiring partners vetted on your role profiles, not on generic JDs. Assessment workflow owned by your engineering leaders, calibrated against offers they have made before. Offer-to-join above 80%, first pod staffed in 60 days.',
    chips: ['Role definitions', 'Hiring funnel SLAs', 'Calibrated assessment rubrics'],
  },
  {
    title: 'Facilities & ops',
    body: 'Office fit-out, access control, BCP, and the mundane logistics that decide whether engineers show up the second month. Leased or coworking to match the ramp.',
    chips: ['Fit-out plan', 'BCP + access policy', 'Vendor contracts'],
  },
  {
    title: 'IT & security',
    body: 'Network, endpoints, identity, and the SOC integration that lets the center operate on your trust perimeter from day one. Your identity provider, your policies, no orphan environment.',
    chips: ['Network + endpoint build', 'IAM integration', 'SOC onboarding'],
  },
  {
    title: 'Operating model',
    body: 'Leadership hire sequencing, reporting lines back to HQ, cadences, metrics, and the cultural work that keeps the captive feeling like one team, not a remote vendor.',
    chips: ['Org design', 'Reporting + cadence playbook', 'Culture plan'],
  },
];

// Signature: the build-operate-transfer lifecycle. All three phases are
// in the original contract, including the transfer terms.
const BOT_STAGES = [
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

// Signature: the geographies table. Location is a function of talent
// depth, time-zone fit, and cost, not a preference.
const GEOS = [
  {
    name: 'Hyderabad, India',
    strengths: 'Deep engineering talent, mature GCC ecosystem, strong SEZ/STPI incentives.',
    suited: 'Data, AI, platform engineering, 24x7 operations.',
  },
  {
    name: 'Bengaluru, India',
    strengths: 'Product engineering density, the deepest leadership talent pool in India.',
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

const DIFFERENTIATORS = [
  {
    label: 'A captive, not an outsourcing contract',
    line: 'The engineers report to your leadership from week one. We run the plumbing so your people can focus on the work, not the logistics.',
  },
  {
    label: 'Transfer terms written up front',
    line: 'The BOT transfer price, conditions, and timeline are in the original statement of work. Not a second negotiation when you have the most to lose.',
  },
  {
    label: 'Delivery pod as reference architecture',
    line: 'The first pod runs on our engineering practices for data, AI, and cloud, so you see the operating model in action before scaling it.',
  },
  {
    label: 'Optional, not compulsory, transfer',
    line: 'If you decide to keep the operate model long term, the contract stays in place. The transfer option never expires, and we do not push it.',
  },
];

const FAQS = [
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

/* --------------------------------- page ---------------------------------- */

export default function GCCPage() {
  return (
    <div className={`bg-white text-black ${v4Sans}`}>
      <ServiceSchema
        name="GCC & Captive Operations"
        description="Stand up and operate Global Capability Centers in India and LatAm. Entity, hiring, facilities, IT, and operating model in one engagement, with a documented build-operate-transfer path."
        url="/services/gcc"
        serviceType="Global Capability Center Setup"
      />
      {/* FAQPage JSON-LD comes from PageFaq below — one per page. */}
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: '/' },
          { name: 'Services', url: '/services' },
          { name: 'GCC & Captive Operations', url: '/services/gcc' },
        ]}
      />

      <ServiceHero
        kicker="GCC & Captive Operations"
        title={
          <>
            GCC Setup: Your Team.{' '}
            <span style={{ color: '#1D4ED8' }}>
              Your Operating Model.&nbsp;Offshore.
            </span>
          </>
        }
        lede="A captive delivery center stood up and run like a first-party team, not an outsourcing contract. Entity, hiring, facilities, and operating model in one engagement, with a build-operate-transfer path onto your payroll when you are ready."
        chips={[
          'India and LatAm',
          'Entity to operating model',
          'Build-operate-transfer',
          'One statement of work',
        ]}
        primary={{ label: 'Scope a captive center', href: '/contact?service=gcc' }}
        secondary={{ label: 'See delivery outcomes', href: '/case-studies' }}
        visual={<FlowScene config={FLOWS['gcc']} />}
      />

      {/* Problem band: outsourcing contracts that never become your team */}
      <FoldcraftHero
        geistClass={v4Geist}
        image="/images/v4/case-transport.jpg"
        pill="Your team, your IP"
        headline={
          <>
            A captive gives you the team,{' '}
            <br className="hidden sm:block" />
            <span className="text-[#60A5FA]">the IP, and the&nbsp;keys.</span>
          </>
        }
        body="Your entity, your employees, your leadership from week one, with us running the plumbing until the handover. Knowledge compounds on your side of the wall, and after the transfer everything from the codebase to the culture belongs to you."
        story={{
          metric: { value: '53', label: 'Countries on one data platform' },
          title: 'One global operating model serving 400,000 employees',
          href: '/case-studies/global-food-facilities-data-intelligence',
          logoSrc: '/brand/aci-infotech-logo-white.png',
          logoAlt: 'ACI Infotech',
        }}
      />

      {/* What the engagement covers */}
      <section className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <SectionHead
            kicker="What we stand up"
            title={
              <>
                One engagement. <span style={{ color: '#1D4ED8' }}>Six&nbsp;workstreams.</span>
              </>
            }
            sub="Everything the captive needs to feel like your team on day one."
          />
          <OfferingList items={OFFERINGS} />
        </div>
      </section>

      {/* Signature: BOT lifecycle table */}
      <section className="border-t border-gray-200 bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <SectionHead
            kicker="The lifecycle"
            title={
              <>
                Build. Operate. <span style={{ color: '#1D4ED8' }}>Transfer.</span>
              </>
            }
            sub="The three phases are in the original contract, including the transfer terms."
          />

          {/* The lifecycle is the page's process: phase, window, and what
              happens map straight onto the kit's process cards. */}
          <ProcessStrip
            steps={BOT_STAGES.map((stage) => ({
              title: stage.stage,
              timeframe: stage.window,
              body: stage.focus,
            }))}
          />
        </div>
      </section>

      {/* Signature: geographies table */}
      <section className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <SectionHead
            kicker="Where"
            title={
              <>
                Where we stand <span style={{ color: '#1D4ED8' }}>captives&nbsp;up.</span>
              </>
            }
            sub="Location is a function of talent depth, time-zone fit, and cost, not a preference."
          />

          {/* Soft-card grid: one card per location, same three facts as the
              old table (location, strengths, best suited for). */}
          <div className="mt-12 grid gap-5 sm:grid-cols-2">
            {GEOS.map((geo) => (
              <div key={geo.name} className={`flex flex-col rounded-2xl bg-white p-7 md:p-8 ${cardShadow}`}>
                <h3 className={`text-xl font-semibold text-black md:text-2xl ${v4Display}`}>
                  {geo.name}
                </h3>
                <p className="mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">
                  Strengths
                </p>
                <p className="mt-3 flex-1 text-[15px] leading-relaxed text-gray-600">
                  {glueWidow(geo.strengths)}
                </p>
                <div className="mt-5 border-t border-gray-200 pt-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">
                    Best suited for
                  </p>
                  <div className="mt-3 flex items-start gap-3">
                    <CheckBadge />
                    <p className="text-sm leading-relaxed text-gray-700">{glueWidow(geo.suited)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-8 max-w-3xl text-sm leading-relaxed text-gray-500">
            Rough sizing heuristic: forty engineers is the floor below which an
            entity costs more than it saves. Above two hundred, a captive is
            almost always the right answer on a three-year horizon.
          </p>
        </div>
      </section>

      {/* Bridge to managed operations: the pre-captive option */}
      <BridgeBand
        title={<>Need the coverage before the&nbsp;captive?</>}
        body="A captive pays off at scale, and plenty of estates need 24/7 coverage long before the headcount justifies an entity. Our managed NOC and SOC run the same follow the sun model under published SLAs, on the platforms you already operate. Some clients start there and stand the captive up once the case is obvious."
        link={{ label: 'Managed Operations', href: '/services/managed-operations' }}
      />

      {/* Why a captive, run by us */}
      <section className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <SectionHead
            kicker="Why ACI"
            title="Why a captive, run by us"
            sub="The plumbing stays with us so your leadership keeps product focus."
          />
          <FactsRow facts={DIFFERENTIATORS} />
        </div>
      </section>

      <PageFaq
        kicker="Questions"
        title={
          <>
            Captive questions,
            <br />
            <span style={{ color: '#1D4ED8' }}>answered straight.</span>
          </>
        }
        sub="Scope a captive center and get a three-year TCO and a ninety-day plan to first pod live."
        faqs={FAQS}
      />

      <ClusterPosts keywords={['gcc', 'captive', 'global capability center', 'offshore', 'build operate transfer']} />

      <RelatedLinks items={gccRelated} />

      {/* Closing CTA: video stage, one button, nothing else */}
      <CtaSection label="Let's plan the captive" href="/contact?service=gcc" />
    </div>
  );
}
