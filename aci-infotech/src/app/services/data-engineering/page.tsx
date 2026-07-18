import { Metadata } from 'next';
import RelatedLinks from '@/components/seo/RelatedLinks';
import { dataEngineeringRelated } from '@/content/related-links';
import ClusterPosts from '@/components/seo/ClusterPosts';
import { ServiceSchema, BreadcrumbSchema } from '@/components/seo/StructuredData';
import { DEFAULT_OG_IMAGES, DEFAULT_TWITTER_IMAGES } from '@/lib/seo/og';
import { getSiteUrl } from '@/lib/site-url';
import FoldcraftHero from '@/components/v4/hero/FoldcraftHero';
import CtaSection from '@/components/v4/hero/CtaSection';
import DataFlowPanel from '@/components/v4/page/DataFlowPanel';
import { v4Sans, v4Geist } from '@/components/v4/fonts';
import {
  SectionHead,
  ServiceHero,
  OfferingList,
  DecisionPanel,
  ProofCards,
  ProcessStrip,
  BridgeBand,
  FactsRow,
  PageFaq,
} from '@/components/v4/page/kit';

export const revalidate = 3600;

// Canonical origin: always production, so staging builds can never
// self-canonicalize (see src/lib/site-url.ts).
const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  title: 'Data Engineering Services',
  description: 'Data engineering services that feed AI and analytics. Databricks lakehouses, Snowflake warehouses, real-time pipelines with Dynatrace observability.',
  keywords: 'data engineering services, databricks consulting, snowflake implementation, data lakehouse, real-time data pipelines, enterprise data platform',
  alternates: {
    canonical: `${siteUrl}/services/data-engineering`,
  },
  openGraph: {
    title: 'Data Engineering Services | ACI Infotech',
    description: 'Data engineering services that feed AI and analytics. Databricks lakehouses, Snowflake warehouses, real-time pipelines with Dynatrace observability.',
    url: `${siteUrl}/services/data-engineering`,
    siteName: 'ACI Infotech',
    type: 'website',
    images: DEFAULT_OG_IMAGES,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Data Engineering Services | ACI Infotech',
    description: 'Data engineering services that feed AI and analytics. Databricks lakehouses, Snowflake warehouses, real-time pipelines with Dynatrace observability.',
    images: DEFAULT_TWITTER_IMAGES,
  },
};

/* ------------------------------- page copy ------------------------------- */

const OFFERINGS = [
  {
    title: 'Lakehouse architecture',
    body: 'Databricks lakehouses on Delta Lake with Unity Catalog governance. One copy of the data serves BI, streaming, and machine learning, with lineage and access controls from day one.',
    chips: ['Databricks', 'Delta Lake', 'Unity Catalog', 'Apache Iceberg'],
  },
  {
    title: 'Cloud data warehouses',
    body: 'Snowflake warehouses sized and tuned so compute spend follows real demand. Resource monitors and auto-suspend go in on day one, because most Snowflake overspend is warehouses nobody turned off.',
    chips: ['Snowflake', 'Snowpark', 'dbt'],
  },
  {
    title: 'Real-time pipelines',
    body: 'Kafka and Spark streaming for decisions that cannot wait for the nightly batch: inventory, fraud, pricing, alerts. Millions of records per second, with observability wired through Dynatrace.',
    chips: ['Kafka', 'Spark Streaming', 'Kinesis', 'Event Hubs', 'Dynatrace'],
  },
  {
    title: 'Data governance',
    body: 'Catalogs, quality scores, lineage, and access policy written as code. When an auditor asks where a number came from, the answer is a query, not a meeting.',
    chips: ['Unity Catalog', 'Collibra', 'Alation', 'Great Expectations'],
  },
  {
    title: 'Migration and modernization',
    body: 'Teradata, Oracle, Netezza, and Hadoop estates moved in staged waves. Parallel runs prove parity before anything old gets switched off.',
    chips: ['Teradata', 'Oracle', 'Netezza', 'Hadoop'],
  },
  {
    title: 'AI-ready data products',
    body: 'Feature stores, vector search, and curated datasets your models can train on without a six-week data hunt. This is the layer most stalled AI programs are missing.',
    chips: ['Feature stores', 'Vector search', 'MLflow'],
  },
];

const DECISION_ROWS = [
  { need: 'SQL analytics, BI, and governed data sharing', pick: 'a' as const },
  { need: 'BI, streaming, and machine learning on one copy of the data', pick: 'b' as const },
  { need: 'Enterprise governance across every workload', pick: 'both' as const },
];

const PROOF = [
  {
    eyebrow: 'Fortune 500 Convenience Retail Chain',
    metric: '30%',
    metricLabel: 'Reduction in data latency',
    summary: 'A governed Databricks lakehouse across 600+ locations, with real-time inventory visibility and zero downtime through the cutover.',
    href: '/case-studies/databricks-modernization-ai-enablement-for-leading-c-store-chain',
    linkLabel: 'Read the Databricks story',
  },
  {
    eyebrow: 'Global Financial Services Firm',
    metric: '90d',
    metricLabel: 'From prototype to production',
    summary: 'Azure Data Lake, Databricks, AKS, and Synapse connected into one governed foundation for analytics and machine learning.',
    href: '/case-studies/driving-enterprise-data-transformation-with-aci-s-azure-lakehouse',
    linkLabel: 'Read the Azure Lakehouse story',
  },
  {
    eyebrow: 'Global Food Services Operator',
    metric: '53',
    metricLabel: 'Countries on one data platform',
    summary: 'One platform for 400,000 employees replacing dozens of regional reporting stacks, with decisions landing 22% faster.',
    href: '/case-studies/global-food-facilities-data-intelligence',
    linkLabel: 'Read the story',
  },
];

const PROCESS = [
  {
    title: 'Discover',
    timeframe: 'Weeks 1 to 4',
    body: 'Inventory the sources, meet the teams, and agree on the first use case that is worth real money.',
  },
  {
    title: 'Architect',
    timeframe: 'Weeks 3 to 6',
    body: 'Platform choice, governance model, and a cost plan you can defend to finance.',
  },
  {
    title: 'Build',
    timeframe: 'Weeks 6 to 16',
    body: 'Pipelines, lakehouse, and quality gates shipped in increments, not saved up for a big reveal.',
  },
  {
    title: 'Prove',
    body: 'Parallel run against the old numbers until the business signs off. Nothing legacy is turned off on faith.',
  },
  {
    title: 'Run',
    body: 'Around-the-clock operations under SLA with our managed team, or a clean handover to yours with runbooks that work at 3am.',
  },
];

const FACTS = [
  {
    label: 'Delivery',
    line: 'The architects who scope your platform are the ones who build it. No switch between the pitch team and the delivery pod.',
  },
  {
    label: 'Partnerships',
    line: 'Databricks and Snowflake partners, with certified architects on both and 40+ lakehouse implementations behind them.',
  },
  {
    label: 'Scale',
    line: 'Founded 2006. 1,200+ engineers across 11 global delivery hubs. 500+ enterprise projects.',
  },
  {
    label: 'Operations',
    line: 'ISO 27001 certified, with 24/7 managed operations under published SLAs.',
  },
];

const FAQS = [
  {
    question: 'What is enterprise data engineering?',
    answer: 'Building the pipelines, storage, and governance that turn scattered source data into something analytics and AI can use. It covers ingestion, the lakehouse or warehouse itself, quality, lineage, and serving data to the people and systems that need it.',
  },
  {
    question: 'How long does a data platform take?',
    answer: 'A first governed use case ships in 8 to 12 weeks. Full platform migrations run 6 to 18 months depending on the estate. We ship in increments either way, so value lands long before the final cutover.',
  },
  {
    question: 'Snowflake or Databricks: which one do we need?',
    answer: 'Snowflake for SQL-centered analytics and sharing, Databricks when BI, streaming, and ML must share one copy of the data. Many enterprises run both. We are certified on each and will tell you which fits, workload by workload.',
  },
  {
    question: 'What is the ROI of a modern data platform?',
    answer: 'Typical results from our engagements: 15 to 20% lower storage costs, insights delivered 22% faster, and roughly double the productivity per analyst. The bigger number is usually the AI projects that stop stalling.',
  },
  {
    question: 'Can you work with our existing team and stack?',
    answer: 'Yes. We build alongside your engineers and operate the tools you already run. The goal is a platform your team owns, not a dependency on ours.',
  },
  {
    question: 'How do you handle governance and compliance?',
    answer: 'Lineage, access control, and audit trails are designed in from the start, not patched on before an audit. Every dataset gets an owner, a quality score, and a documented path back to its source.',
  },
  {
    question: 'Do you run the platform after go-live?',
    answer: 'Both options. Our managed operations team runs it 24/7 under SLA, or we hand over to your team with runbooks and stay on call during the transition.',
  },
  {
    question: 'Is our data ready for AI?',
    answer: 'Probably not yet, and that is normal. AI-ready means governed, documented, and fresh enough for the use case. We assess that gap in the first four weeks and build the missing layer instead of writing a report about it.',
  },
];

/* --------------------------------- page ---------------------------------- */

export default function DataEngineeringPage() {
  return (
    <div className={`bg-white text-black ${v4Sans}`}>
      <ServiceSchema
        name="Data Engineering Services"
        description="Enterprise data platforms that feed AI and analytics. Databricks lakehouses, Snowflake warehouses, real-time pipelines with Dynatrace observability."
        url="/services/data-engineering"
        serviceType="Data Engineering Consulting"
      />
      {/* FAQPage JSON-LD comes from PageFaq below — one per page. */}
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: '/' },
          { name: 'Services', url: '/services' },
          { name: 'Data Engineering', url: '/services/data-engineering' },
        ]}
      />

      <ServiceHero
        kicker="Data Engineering"
        title={
          <>
            Data engineering that feeds{' '}
            <span style={{ color: '#1D4ED8' }}>AI and&nbsp;analytics</span>
          </>
        }
        lede="ACI Infotech builds enterprise data platforms: Databricks lakehouses, Snowflake warehouses, and real-time pipelines that run around the clock with SLAs. We take data scattered across dozens of systems and turn it into one governed foundation your analysts, your applications, and your AI models can actually use."
        chips={[
          '40+ lakehouse implementations',
          'Databricks and Snowflake partner',
          '24/7 run teams',
          'ISO 27001',
        ]}
        primary={{ label: 'Talk to a data architect', href: '/contact' }}
        secondary={{ label: 'See the case studies', href: '/case-studies' }}
        visual={<DataFlowPanel />}
      />

      {/* Problem band: the underwater beat, retargeted at data platforms */}
      <FoldcraftHero
        geistClass={v4Geist}
        pill="Why platforms stall"
        headline={
          <>
            Your data is not <span className="text-[#60A5FA]">the problem.</span>{' '}
            <br className="hidden sm:block" />
            Where it lives is.
          </>
        }
        body="Most enterprises sit on ten to fifty source systems collected through years of growth and acquisitions. CRM in one cloud, ERP in another, operational data stuck in overnight batch jobs. Every report needs three teams, and every AI pilot dies waiting for clean data. The fix is not another tool. It is an engineered platform with ownership, lineage, and a pipeline SLA that somebody actually answers for."
        story={{
          metric: { value: '87%', label: 'Reduction in processing time' },
          title: 'Lakehouse modernization across 600+ locations',
          quote:
            'They flawlessly delivered top-tier digital data on a milestone that mattered to us. Their dedication and expertise made them a genuine partner, not a vendor.',
          role: 'Director of Data and MarTech',
          org: 'A national convenience retailer',
          href: '/case-studies/databricks-modernization-ai-enablement-for-leading-c-store-chain',
        }}
      />

      {/* What we build */}
      <section className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <SectionHead
            kicker="What we build"
            title={
              <>
                One governed platform. <span style={{ color: '#1D4ED8' }}>Six ways&nbsp;in.</span>
              </>
            }
          />
          <OfferingList items={OFFERINGS} />
        </div>
      </section>

      {/* Decision block */}
      <DecisionPanel
        title="Snowflake or Databricks?"
        body="Both, honestly, depending on the job. Snowflake wins when the center of gravity is SQL analytics, sharing, and a predictable warehouse. Databricks wins when the same data has to serve BI, streaming, and machine learning without keeping three copies of it. Plenty of enterprises run both under one governance layer. We hold certifications on each, so the recommendation follows your workloads, not our margins."
        colA={{ src: '/brand/snowflake-color.svg', alt: 'Snowflake' }}
        colB={{ src: '/brand/databricks-color-on-light.svg', alt: 'Databricks' }}
        rows={DECISION_ROWS}
      />

      {/* Proof */}
      <section className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <SectionHead
            kicker="Results"
            title={
              <>
                Built for enterprises. <span style={{ color: '#1D4ED8' }}>Measured in&nbsp;production.</span>
              </>
            }
          />
          <ProofCards cards={PROOF} />
        </div>
      </section>

      {/* Process */}
      <section className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <SectionHead kicker="How an engagement runs" title="Five phases. No mystery." />
          <ProcessStrip steps={PROCESS} />
        </div>
      </section>

      {/* Bridge to managed operations */}
      <BridgeBand
        title="Go-live is the halfway point."
        body="A data platform earns its keep in year two, when the pipelines still run, the costs still hold, and the quality scores still mean something. Our managed operations team keeps platforms up around the clock, with P1 response in fifteen minutes and misses reported monthly with root cause."
        link={{ label: 'Managed Operations', href: '/services/managed-operations' }}
      />

      {/* Why ACI */}
      <section className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <SectionHead kicker="Why ACI" title="Why enterprises pick us for data" />
          <FactsRow facts={FACTS} />
        </div>
      </section>

      <PageFaq
        kicker="Questions"
        title={
          <>
            Data questions,
            <br />
            <span style={{ color: '#1D4ED8' }}>answered straight.</span>
          </>
        }
        sub="The questions we hear most before a data engagement. Anything else belongs in a conversation."
        faqs={FAQS}
      />

      <ClusterPosts keywords={['data engineering', 'data pipeline', 'data platform', 'lakehouse', 'etl']} />

      <RelatedLinks items={dataEngineeringRelated} />

      {/* Closing CTA: video stage, one button, nothing else */}
      <CtaSection label="Let's talk about your data" />
    </div>
  );
}
