import { Metadata } from 'next';
import RelatedLinks from '@/components/seo/RelatedLinks';
import { oilGasRelated } from '@/content/related-links';
import ClusterPosts from '@/components/seo/ClusterPosts';
import { oilGasFaqs } from '@/content/industry-faqs';
import { ServiceSchema, BreadcrumbSchema } from '@/components/seo/StructuredData';
import { DEFAULT_OG_IMAGES, DEFAULT_TWITTER_IMAGES } from '@/lib/seo/og';
import { getSiteUrl } from '@/lib/site-url';
import { v4Sans, v4Geist, v4Display } from '@/components/v4/fonts';
import FoldcraftHero from '@/components/v4/hero/FoldcraftHero';
import CtaSection from '@/components/v4/hero/CtaSection';
import {
  SectionHead,
  ServiceHero,
  OfferingList,
  ProcessStrip,
  BridgeBand,
  FactsRow,
  PageFaq,
  CheckBadge,
  cardShadow,
  glueWidow,
} from '@/components/v4/page/kit';
import CmsProofCards from '@/components/v4/page/CmsProofCards';
import FlowScene from '@/components/v4/page/FlowScene';
import { FLOWS } from '@/components/v4/page/flow-configs';

export const revalidate = 3600;

// Canonical origin: always production, so staging builds can never
// self-canonicalize (see src/lib/site-url.ts).
const siteUrl = getSiteUrl();

const DESCRIPTION =
  'Data, AI, and cloud for upstream, midstream, and downstream operators. SCADA and historian integration, predictive maintenance, production analytics, and HSE and emissions reporting.';

export const metadata: Metadata = {
  title: 'Oil & Gas Technology Solutions',
  description: DESCRIPTION,
  alternates: { canonical: `${siteUrl}/industries/oil-gas` },
  openGraph: {
    title: 'Oil & Gas Technology Solutions | ACI Infotech',
    description: DESCRIPTION,
    url: `${siteUrl}/industries/oil-gas`,
    siteName: 'ACI Infotech',
    type: 'website',
    images: DEFAULT_OG_IMAGES,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Oil & Gas Technology Solutions | ACI Infotech',
    description: DESCRIPTION,
    images: DEFAULT_TWITTER_IMAGES,
  },
};

/* ------------------------------- page data ------------------------------- */

// Signature: the value-chain structure, kept from the published page.
// Three stages, different systems, different clocks, one data foundation.
const VALUE_CHAIN = [
  {
    stage: 'Upstream',
    body: 'Production and drilling analytics on top of SCADA, historian, and well data. One governed view of output and equipment instead of a folder of exported spreadsheets.',
    points: ['Production surveillance', 'Drilling and completion analytics', 'Well and reservoir data'],
  },
  {
    stage: 'Midstream',
    body: 'Pipeline and asset monitoring that brings sensor, SCADA, and maintenance data together so integrity and throughput are visible in real time, not after an incident.',
    points: ['Pipeline integrity monitoring', 'Asset performance', 'Throughput and balancing'],
  },
  {
    stage: 'Downstream',
    body: 'Refinery, trading, and supply-chain data unified for margin, yield, and scheduling decisions, with the lineage to trace any figure back to where it came from.',
    points: ['Refinery and yield analytics', 'Trading and supply data', 'Demand and scheduling'],
  },
];

const OFFERINGS = [
  {
    title: 'SCADA & historian integration',
    body: 'SCADA, historians like PI, and ERP pulled into one governed cloud platform, so engineers and analysts stop exporting CSVs and start working from a single source. Real-time where operations need it, batch where it does not.',
    chips: ['SCADA', 'PI historians', 'ERP', 'Real-time pipelines'],
  },
  {
    title: 'Predictive maintenance',
    body: 'Models that read sensor, historian, and maintenance history flag equipment issues before they become failures or safety incidents. In this industry a missed failure is rarely just downtime, so the reliability bar is high.',
    chips: ['Sensor data', 'ML models', 'Maintenance history', 'Asset integrity'],
  },
  {
    title: 'Production analytics',
    body: 'Surveillance and optimization across wells and facilities, so production teams see what is happening now instead of last week. The morning meeting runs on live numbers, not a reconciliation argument.',
    chips: ['Production surveillance', 'Well data', 'Facilities', 'Optimization'],
  },
  {
    title: 'HSE & emissions reporting',
    body: 'A trustworthy data foundation for health, safety, emissions, and regulatory reporting, with lineage to back every figure when an auditor asks. The number on the filing traces to the sensor that produced it.',
    chips: ['HSE', 'Emissions tracking', 'Regulatory reporting', 'Data lineage'],
  },
  {
    title: 'Energy transition & ESG',
    body: 'The same governed platform that runs production analytics carries emissions, ESG, and energy-transition reporting, so sustainability data holds up like financial data instead of living in a separate spreadsheet exercise.',
    chips: ['ESG reporting', 'Energy transition', 'Emissions data', 'Governance'],
  },
  {
    title: 'Cloud modernization',
    body: 'Aging on-prem analytics moved to a governed cloud platform with FinOps and security built in, phased so operations never wait on a big bang. The old system stays on until the new one has earned trust.',
    chips: ['Cloud migration', 'FinOps', 'Security', 'Phased cutover'],
  },
];

const PROOF_FALLBACK = [
  {
    eyebrow: 'Enterprise Technology Company',
    metric: '99.97%',
    metricLabel: 'Uptime across 72+ servers',
    summary:
      'Automated DevOps and 24/7 monitoring across a complex estate. The operations discipline we bring to platforms that carry production data.',
    href: '/case-studies/optimizing-enterprise-it-operations-with-automated-devops-and-monitoring',
    linkLabel: 'Read the operations story',
    image: '/images/v4/svc-ops.jpg',
  },
  {
    eyebrow: 'Global Food Services Operator',
    metric: '53',
    metricLabel: 'Countries on one data platform',
    summary:
      'One governed platform for 400,000 employees replacing dozens of regional reporting stacks, with decisions landing 22% faster. Proof the global-operations pattern works.',
    href: '/case-studies/global-food-facilities-data-intelligence',
    linkLabel: 'Read the story',
    image: '/images/v4/case-retail.jpg',
  },
  {
    eyebrow: 'Global Financial Services Firm',
    metric: '90d',
    metricLabel: 'From prototype to production',
    summary:
      'Azure Data Lake, Databricks, AKS, and Synapse connected into one governed foundation for analytics and machine learning.',
    href: '/case-studies/driving-enterprise-data-transformation-with-aci-s-azure-lakehouse',
    linkLabel: 'Read the Azure Lakehouse story',
    image: '/images/v4/case-finance.jpg',
  },
];

const PROCESS = [
  {
    title: 'Assess',
    timeframe: 'Weeks 1 to 2',
    body: 'Inventory the estate: SCADA, historians, drilling systems, ERP, and where each figure on a regulatory filing actually comes from today.',
  },
  {
    title: 'Architect',
    timeframe: 'Weeks 2 to 4',
    body: 'Platform design that respects the value chain: upstream, midstream, and downstream tied together without pretending they are the same.',
  },
  {
    title: 'Build',
    timeframe: 'Weeks 4 to 12',
    body: 'Pipelines from the operational systems into the governed platform, shipped in increments and validated against field data.',
  },
  {
    title: 'Prove',
    body: 'Parallel run against the numbers engineers already trust. Production, maintenance, and HSE sign off before anything old retires.',
  },
  {
    title: 'Run',
    body: 'Around-the-clock operations under SLAs, or a clean handover with runbooks that survive a shift change.',
  },
];

const FACTS = [
  {
    label: 'Scale',
    line: 'Founded 2006. 1,200+ engineers across 11 global delivery hubs. 500+ enterprise projects.',
  },
  {
    label: 'Compliance',
    line: 'ISO 27001 certified and CMMI Level 3 appraised. The platforms we build produce audit evidence as a byproduct of running.',
  },
  {
    label: 'Operations',
    line: '24/7 managed operations under published SLAs. Production data does not keep office hours, and neither do we.',
  },
  {
    label: 'Delivery',
    line: 'The architects who scope the work are the ones who build it. No handoff between the pitch deck and the delivery pod.',
  },
];

const FAQS = oilGasFaqs.map((f) => ({ question: f.q, answer: f.a }));

/* --------------------------------- page ---------------------------------- */

export default function OilGasPage() {
  return (
    <div className={`bg-white text-black ${v4Sans}`}>
      <ServiceSchema
        name="Oil & Gas Technology Solutions"
        description={DESCRIPTION}
        url="/industries/oil-gas"
        serviceType="Oil and Gas Technology Consulting"
      />
      {/* FAQPage JSON-LD comes from PageFaq below - one per page. */}
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: '/' },
          { name: 'Industries', url: '/industries' },
          { name: 'Oil & Gas', url: '/industries/oil-gas' },
        ]}
      />

      <ServiceHero
        kicker="Oil & Gas"
        title={
          <>
            From the wellhead to{' '}
            <span style={{ color: '#1D4ED8' }}>the&nbsp;regulator</span>
          </>
        }
        lede="Data, AI, and cloud for operators who run on decades of data trapped in systems that were never meant to talk. We unify it, govern it, and make it usable, from the wellhead to the refinery to the regulator."
        chips={[
          'SCADA & PI historians',
          'Upstream to downstream',
          'HSE & emissions',
          'ISO 27001',
        ]}
        primary={{ label: 'Talk to an energy data architect', href: '/contact?industry=oil-gas&source=hero' }}
        secondary={{ label: 'See the proof', href: '/case-studies' }}
        visual={<FlowScene config={FLOWS['industry-oil-gas']} />}
      />

      {/* Problem band: decades of data, none of it talking */}
      <FoldcraftHero
        geistClass={v4Geist}
        image="/images/v4/ind-oil-gas.jpg"
        pill="Why operators stall"
        headline={
          <>
            Decades of production data,{' '}
            <br className="hidden sm:block" />
            <span className="text-[#60A5FA]">finally in one conversation.</span>
          </>
        }
        body="SCADA, PI historians, drilling systems, and ERP each hold a piece of the truth. We bring them onto one governed platform, so production, maintenance, and emissions report from the same numbers and every figure traces back to the sensor that produced it. When the regulator asks, the answer is a query."
        story={{
          metric: { value: '99.97%', label: 'Uptime across 72+ servers' },
          title:
            'A complex digital estate kept available around the clock with automated DevOps and monitoring. The operations bar we hold for platforms that carry production data.',
          href: '/case-studies/optimizing-enterprise-it-operations-with-automated-devops-and-monitoring',
          logoSrc: '/brand/aci-infotech-logo-white.png',
          logoAlt: 'ACI Infotech',
        }}
      />

      {/* Signature: the value chain */}
      <section className="border-t border-gray-200 bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <SectionHead
            kicker="Across the value chain"
            title={
              <>
                Three stages. Different clocks.{' '}
                <span style={{ color: '#1D4ED8' }}>One&nbsp;foundation.</span>
              </>
            }
            sub="Upstream, midstream, and downstream run on different systems and different clocks. We build the data foundation that ties them together without pretending they are the same."
          />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {VALUE_CHAIN.map((v, i) => (
              <div key={v.stage} className={`flex flex-col rounded-3xl bg-white p-8 ${cardShadow}`}>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
                  / {String(i + 1).padStart(2, '0')}
                </p>
                <h3 className={`mt-3 text-2xl font-bold text-black ${v4Display}`}>{v.stage}</h3>
                <p className="mt-3 flex-1 text-[15px] leading-relaxed text-gray-600">{glueWidow(v.body)}</p>
                <ul className="mt-6 space-y-3">
                  {v.points.map((p) => (
                    <li key={p} className="flex items-start gap-3 text-sm font-medium text-gray-800">
                      <CheckBadge />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Offerings */}
      <section className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <SectionHead
            kicker="What we build for operators"
            title={
              <>
                Systems that move a number{' '}
                <span style={{ color: '#1D4ED8' }}>you care&nbsp;about.</span>
              </>
            }
            sub="Uptime, throughput, margin, or the figure on a regulatory filing. Every build starts from the metric it is supposed to move."
          />
          <OfferingList items={OFFERINGS} />
        </div>
      </section>

      {/* Proof */}
      <section className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <SectionHead
            kicker="Results"
            title={
              <>
                Held to an <span style={{ color: '#1D4ED8' }}>operational&nbsp;bar.</span>
              </>
            }
          />
          <CmsProofCards industry="Oil" fallback={PROOF_FALLBACK} />
        </div>
      </section>

      {/* Process */}
      <section className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <SectionHead kicker="How an engagement runs" title="Five phases. No big bang." />
          <ProcessStrip steps={PROCESS} />
        </div>
      </section>

      {/* Bridge to the data engineering practice */}
      <BridgeBand
        title={<>The value chain runs on the&nbsp;pipelines.</>}
        body="SCADA integration, predictive maintenance, and emissions reporting all stand on the same discipline: operational data engineered into one governed platform. That is our data engineering practice, and oil and gas is where it works hardest."
        link={{ label: 'Data Engineering', href: '/services/data-engineering' }}
      />

      {/* Why us */}
      <section className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <SectionHead kicker="Why ACI" title={<>Why operators build with&nbsp;us</>} />
          <FactsRow facts={FACTS} />
        </div>
      </section>

      <ClusterPosts keywords={['oil and gas', 'scada', 'historian', 'predictive maintenance', 'emissions']} />

      <RelatedLinks items={oilGasRelated} />

      <PageFaq
        kicker="Oil & gas FAQ"
        title={
          <>
            Oil & gas questions,
            <br />
            answered straight.
          </>
        }
        faqs={FAQS}
      />

      <CtaSection label="Put your operational data to work" href="/contact?industry=oil-gas&source=cta-section" />
    </div>
  );
}
