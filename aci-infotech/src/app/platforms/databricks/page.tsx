import { Metadata } from 'next';
import RelatedLinks from '@/components/seo/RelatedLinks';
import { databricksRelated } from '@/content/related-links';
import ClusterPosts from '@/components/seo/ClusterPosts';
import { databricksFaqs } from '@/content/pillar-faqs';
import { ServiceSchema, BreadcrumbSchema } from '@/components/seo/StructuredData';
import { DEFAULT_OG_IMAGES, DEFAULT_TWITTER_IMAGES } from '@/lib/seo/og';
import { getSiteUrl } from '@/lib/site-url';
import { v4Sans, v4Geist } from '@/components/v4/fonts';
import FoldcraftHero from '@/components/v4/hero/FoldcraftHero';
import CtaSection from '@/components/v4/hero/CtaSection';
import {
  SectionHead,
  ServiceHero,
  OfferingList,
  DecisionPanel,
  ProcessStrip,
  BridgeBand,
  FactsRow,
  PageFaq,
} from '@/components/v4/page/kit';
import CmsProofCards from '@/components/v4/page/CmsProofCards';
import FlowScene from '@/components/v4/page/FlowScene';
import { FLOWS } from '@/components/v4/page/flow-configs';

export const revalidate = 3600;

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  alternates: { canonical: `${siteUrl}/platforms/databricks` },
  title: 'Databricks Implementation Services',
  description:
    'ACI Infotech is a Databricks consulting partner. Lakehouse architecture, Delta Lake, MLflow, and Spark optimization for enterprise.',
  openGraph: {
    title: 'Databricks Implementation Services | ACI Infotech',
    description:
      'ACI Infotech is a Databricks consulting partner. Lakehouse architecture, Delta Lake, MLflow, and Spark optimization for enterprise.',
    url: `${siteUrl}/platforms/databricks`,
    siteName: 'ACI Infotech',
    type: 'website',
    images: DEFAULT_OG_IMAGES,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Databricks Implementation Services | ACI Infotech',
    description:
      'ACI Infotech is a Databricks consulting partner. Lakehouse architecture, Delta Lake, MLflow, and Spark optimization for enterprise.',
    images: DEFAULT_TWITTER_IMAGES,
  },
};

/* ------------------------------- page data ------------------------------- */

const OFFERINGS = [
  {
    title: 'Lakehouse architecture',
    body: 'Medallion layers on Delta Lake, designed around the workloads you actually run. One governed copy of the data serves BI, streaming, and ML, and the small-file problem gets solved in the design, not discovered in the bill.',
    chips: ['Delta Lake', 'Unity Catalog', 'Photon', 'Apache Iceberg'],
  },
  {
    title: 'Unity Catalog governance',
    body: 'Access control, lineage, and discovery in one place, across every workspace and cloud. Who touched what becomes a query. Auditors notice the difference, and so do the engineers who stop guessing.',
    chips: ['Unity Catalog', 'Access policy', 'Lineage', 'Audit logging'],
  },
  {
    title: 'MLflow and MLOps',
    body: 'Experiment tracking, model registry, feature stores, and retraining pipelines that keep models honest after launch. The GenAI work rides the same spine through Mosaic AI, so governance is built once.',
    chips: ['MLflow', 'Feature stores', 'Databricks Mosaic AI', 'Model registry'],
  },
  {
    title: 'Spark and cost optimization',
    body: 'Cluster policies, Photon, and query tuning that pull real money out of the compute line. Most estates we audit are paying for clusters nobody sized and jobs nobody profiled. We profile them.',
    chips: ['Spark', 'Photon', 'Cluster policies', 'FinOps baseline'],
  },
  {
    title: 'Migrations to the lakehouse',
    body: 'Hadoop, Teradata, Oracle, and legacy warehouse estates moved in staged waves. Parallel runs prove parity against the old numbers before anything gets switched off. Nothing retires on faith.',
    chips: ['Hadoop', 'Teradata', 'Oracle', 'Parallel runs'],
  },
  {
    title: 'Managed Databricks operations',
    body: 'The platform stays fast, governed, and patched after go-live. 24/7 monitoring under SLAs, upgrade management, and a monthly cost report finance can read without a translator.',
    chips: ['24/7 NOC', 'SLAs', 'Upgrade management', 'Cost reporting'],
  },
];

const DECISION_ROWS = [
  { need: 'BI, streaming, and ML on one copy of the data', pick: 'a' as const },
  { need: 'Open table formats: Delta Lake and Iceberg', pick: 'a' as const },
  { need: 'Spark skills already in the building', pick: 'a' as const },
  { need: 'GenAI on your own documents and data', pick: 'a' as const },
  { need: 'Pure SQL reporting for a small analyst team', pick: 'b' as const },
  { need: 'A packaged app is 90 percent of the answer', pick: 'b' as const },
];

const PROOF_FALLBACK = [
  {
    eyebrow: 'Fortune 500 Convenience Retail Chain',
    metric: '30%',
    metricLabel: 'Reduction in data latency',
    summary:
      'A governed Databricks lakehouse across 600+ locations, with real-time inventory visibility and zero downtime through the cutover.',
    href: '/case-studies/databricks-modernization-ai-enablement-for-leading-c-store-chain',
    linkLabel: 'Read the Databricks story',
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
  {
    eyebrow: 'Global Food Services Operator',
    metric: '53',
    metricLabel: 'Countries on one data platform',
    summary:
      'One platform for 400,000 employees replacing dozens of regional reporting stacks, with decisions landing 22% faster.',
    href: '/case-studies/global-food-facilities-data-intelligence',
    linkLabel: 'Read the story',
    image: '/images/v4/case-retail.jpg',
  },
];

const PROCESS = [
  {
    title: 'Assess',
    timeframe: 'Weeks 1 to 2',
    body: 'Workspace audit, cost baseline, and the first production use case worth real money. If Databricks is the wrong tool, this is where we say so.',
  },
  {
    title: 'Architect',
    timeframe: 'Weeks 2 to 4',
    body: 'Medallion design, Unity Catalog model, cluster policies, and a cost plan you can defend to finance.',
  },
  {
    title: 'Build',
    timeframe: 'Weeks 4 to 12',
    body: 'Pipelines, quality gates, and CI for jobs and notebooks, shipped in increments instead of a big reveal.',
  },
  {
    title: 'Prove',
    body: 'Parallel run against the legacy numbers until the business signs off. The old platform stays on until parity is boring.',
  },
  {
    title: 'Run',
    body: 'Around-the-clock operations under SLA with our managed team, or a clean handover to yours with runbooks that work at 3am.',
  },
];

const FACTS = [
  {
    label: 'Partnership',
    line: 'Databricks consulting partner. 40+ lakehouse implementations, with certified architects on data engineering, ML, and platform administration.',
  },
  {
    label: 'Delivery',
    line: 'The architects who design your lakehouse are the ones who build it. No handoff between the pitch deck and the delivery pod.',
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

const FAQS = databricksFaqs.map((f) => ({ question: f.q, answer: f.a }));

/* --------------------------------- page ---------------------------------- */

export default function DatabricksPage() {
  return (
    <div className={`bg-white text-black ${v4Sans}`}>
      <ServiceSchema
        name="Databricks Implementation Services"
        description="Databricks consulting partner. Lakehouse architecture, Delta Lake, Unity Catalog, MLflow, and Spark optimization for enterprise."
        url="/platforms/databricks"
        serviceType="Databricks Consulting"
      />
      {/* FAQPage JSON-LD comes from PageFaq below — one per page. */}
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: '/' },
          { name: 'Platforms', url: '/platforms' },
          { name: 'Databricks', url: '/platforms/databricks' },
        ]}
      />

      <ServiceHero
        kicker="Databricks"
        title={
          <>
            Databricks that reaches{' '}
            <span style={{ color: '#1D4ED8' }}>production</span>
          </>
        }
        lede="ACI Infotech is a Databricks consulting partner with certified architects across data engineering, machine learning, and platform administration. We design lakehouses on Delta Lake, govern them with Unity Catalog, and tune Spark until the bill makes sense. Then we run the platform, around the clock, under SLAs."
        chips={[
          'Databricks consulting partner',
          '40+ lakehouse implementations',
          'Certified architects',
          'ISO 27001',
        ]}
        primary={{ label: 'Talk to a lakehouse architect', href: '/contact' }}
        secondary={{ label: 'See the Databricks stories', href: '/case-studies' }}
        visual={<FlowScene config={FLOWS['platform-databricks']} />}
      />

      {/* Problem band: workspaces are easy, production is not */}
      <FoldcraftHero
        geistClass={v4Geist}
        pill="Why lakehouses stall"
        headline={
          <>
            The workspace was easy.{' '}
            <br className="hidden sm:block" />
            <span className="text-[#60A5FA]">Production was not.</span>
          </>
        }
        body="Costs drift, small files pile up, governance arrives late, and the first production workload exposes every shortcut in the demo. We have taken enough lakehouses live to know where the walls are before you hit them."
        story={{
          metric: { value: '30%', label: 'Reduction in data latency' },
          title:
            'A governed lakehouse across 600+ retail locations, with zero downtime through the cutover.',
          href: '/case-studies/databricks-modernization-ai-enablement-for-leading-c-store-chain',
          logoSrc: '/brand/databricks-color.svg',
          logoAlt: 'Databricks',
        }}
      />

      {/* Offerings */}
      <section className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <SectionHead
            kicker="What we do on Databricks"
            title={
              <>
                One lakehouse. <span style={{ color: '#1D4ED8' }}>Six disciplines.</span>
              </>
            }
          />
          <OfferingList items={OFFERINGS} />
        </div>
      </section>

      {/* Honest fit panel */}
      <DecisionPanel
        title={
          <>
            Is Databricks the right&nbsp;call?
          </>
        }
        body="Usually, when data has more than one job to do. The lakehouse earns its keep when BI, streaming, and machine learning need the same governed copy. When the work is simpler than that, a simpler stack wins, and we will say so before you buy anything. The recommendation follows your workloads, not our margins."
        colA={{ src: '/brand/databricks-color-on-light.svg', alt: 'Databricks', px: 64 }}
        colB={{ label: 'A simpler stack' }}
        rows={DECISION_ROWS}
        footnote="When the second column wins, the honest answer is often Snowflake or a packaged product. The full comparison lives on our data engineering page."
      />

      {/* Proof */}
      <section className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <SectionHead
            kicker="Results"
            title={
              <>
                Lakehouses that left <span style={{ color: '#1D4ED8' }}>the&nbsp;lab.</span>
              </>
            }
          />
          <CmsProofCards
            technology="Databricks"
            fallback={PROOF_FALLBACK}
            fallbackVideo={{ mp4: '/videos/retail-bg.mp4' }}
          />
        </div>
      </section>

      {/* Process */}
      <section className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <SectionHead kicker="How an engagement runs" title="Five phases. No mystery." />
          <ProcessStrip steps={PROCESS} />
        </div>
      </section>

      {/* Bridge to the data engineering practice */}
      <BridgeBand
        title={<>The platform is half the&nbsp;job.</>}
        body="Databricks pays for itself when the pipelines, governance, and operations around it are engineered with the same care as the platform choice. That is our data engineering practice, and the lakehouse is its home ground."
        link={{ label: 'Data Engineering', href: '/services/data-engineering' }}
      />

      {/* Why us */}
      <section className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <SectionHead kicker="Why ACI" title={<>Why enterprises run Databricks with&nbsp;us</>} />
          <FactsRow facts={FACTS} />
        </div>
      </section>

      <ClusterPosts keywords={['databricks', 'lakehouse', 'unity catalog', 'spark']} />

      <RelatedLinks items={databricksRelated} />

      <PageFaq
        kicker="Databricks FAQ"
        title={
          <>
            Databricks questions,
            <br />
            answered straight.
          </>
        }
        faqs={FAQS}
      />

      <CtaSection label="Let's talk Databricks" />
    </div>
  );
}
