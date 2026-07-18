import { Metadata } from 'next';
import RelatedLinks from '@/components/seo/RelatedLinks';
import { snowflakeRelated } from '@/content/related-links';
import ClusterPosts from '@/components/seo/ClusterPosts';
import { snowflakeFaqs } from '@/content/pillar-faqs';
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
  alternates: { canonical: `${siteUrl}/platforms/snowflake` },
  title: 'Snowflake Implementation Services',
  description:
    'ACI Infotech is a Snowflake Partner. Data Cloud architecture, data sharing, Snowpark, and enterprise analytics solutions.',
  openGraph: {
    title: 'Snowflake Implementation Services | ACI Infotech',
    description:
      'ACI Infotech is a Snowflake Partner. Data Cloud architecture, data sharing, Snowpark, and enterprise analytics solutions.',
    url: `${siteUrl}/platforms/snowflake`,
    siteName: 'ACI Infotech',
    type: 'website',
    images: DEFAULT_OG_IMAGES,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Snowflake Implementation Services | ACI Infotech',
    description:
      'ACI Infotech is a Snowflake Partner. Data Cloud architecture, data sharing, Snowpark, and enterprise analytics solutions.',
    images: DEFAULT_TWITTER_IMAGES,
  },
};

/* ------------------------------- page data ------------------------------- */

const OFFERINGS = [
  {
    title: 'Warehouse and platform architecture',
    body: 'Warehouses sized for the workloads you actually run, with resource monitors and auto-suspend set on day one. Storage and compute scale apart, roles and masking are designed in, and month six on the platform looks like month one.',
    chips: ['Snowflake', 'Multi-cluster warehouses', 'Zero-copy cloning', 'Resource monitors'],
  },
  {
    title: 'Migrations from legacy warehouses',
    body: 'Teradata, Oracle, Netezza, and homegrown estates moved by domain, heaviest cost first. Old and new run in parallel until the numbers match, and nothing cuts over until the business signs off on parity.',
    chips: ['Teradata', 'Oracle', 'Netezza', 'Parallel runs'],
  },
  {
    title: 'Snowpark and data apps',
    body: 'Pipelines, UDFs, and ML built in Python where the data already lives, plus Streamlit apps for teams who need more than a dashboard. One platform to govern instead of a sidecar stack nobody owns.',
    chips: ['Snowpark', 'Python', 'Snowpark ML', 'Streamlit'],
  },
  {
    title: 'Data sharing and clean rooms',
    body: 'Live shares with partners and customers, with no copies and no file drops to babysit. Clean rooms let two companies compute on joined data without seeing each other’s rows, and the governance model comes along for free.',
    chips: ['Secure Data Sharing', 'Data Clean Rooms', 'Snowflake Marketplace'],
  },
  {
    title: 'Performance and cost control',
    body: 'Snowflake bills by the second, so the bill follows the query plan. We profile the heavy queries, right-size the warehouses, and set clustering only where it pays. Then finance gets a report that explains the number.',
    chips: ['Query profiling', 'Warehouse sizing', 'Clustering', 'FinOps baseline'],
  },
  {
    title: 'Managed Snowflake operations',
    body: 'Monitoring, security management, access reviews, and upgrade planning after go-live, under SLAs and around the clock. The platform stays fast and governed without pulling your engineers off their own roadmap.',
    chips: ['24/7 NOC', 'SLAs', 'Access reviews', 'Cost reporting'],
  },
];

const DECISION_ROWS = [
  { need: 'SQL analytics and BI as the center of gravity', pick: 'a' as const },
  { need: 'Sharing governed data with partners and customers', pick: 'a' as const },
  { need: 'A small platform team with no appetite for tuning clusters', pick: 'a' as const },
  { need: 'Elastic concurrency without capacity planning', pick: 'a' as const },
  { need: 'Heavy streaming and ML on one copy of the data', pick: 'b' as const },
  { need: 'Deep Spark skills already in the building', pick: 'b' as const },
];

const PROOF_FALLBACK = [
  {
    eyebrow: 'Global Food Services Operator',
    metric: '22%',
    metricLabel: 'Faster decisions',
    summary:
      'One governed data platform for 400,000 employees across 53 countries, replacing dozens of regional reporting stacks.',
    href: '/case-studies/global-food-facilities-data-intelligence',
    linkLabel: 'Read the story',
    image: '/images/v4/svc-data.jpg',
  },
  {
    eyebrow: 'Global Financial Services Firm',
    metric: '90d',
    metricLabel: 'From prototype to production',
    summary:
      'A governed cloud data foundation for analytics and machine learning, taken from first prototype to production in one quarter.',
    href: '/case-studies/driving-enterprise-data-transformation-with-aci-s-azure-lakehouse',
    linkLabel: 'Read the lakehouse story',
    image: '/images/v4/case-finance.jpg',
  },
  {
    eyebrow: 'Fortune 500 Convenience Retail Chain',
    metric: '30%',
    metricLabel: 'Reduction in data latency',
    summary:
      'A modern data platform across 600+ locations, with real-time inventory visibility and zero downtime through the cutover.',
    href: '/case-studies/databricks-modernization-ai-enablement-for-leading-c-store-chain',
    linkLabel: 'Read the retail story',
    image: '/images/v4/case-retail.jpg',
  },
];

const PROCESS = [
  {
    title: 'Assess',
    body: 'Current spend, workload inventory, and the first domain worth moving. If Snowflake is the wrong tool for your workloads, this is where we say so.',
  },
  {
    title: 'Architect',
    body: 'Warehouse layout, role hierarchy, masking policies, and resource monitors, with a cost model you can defend to finance before a single credit burns.',
  },
  {
    title: 'Migrate',
    body: 'Schemas, pipelines, and reports moved by domain. Most enterprise migrations land in 3 to 6 months; a single-source warehouse swap can land in weeks.',
  },
  {
    title: 'Prove',
    body: 'Old and new run in parallel until the numbers match and the data owners sign off. Nothing gets switched off on faith.',
  },
  {
    title: 'Run',
    body: 'Around-the-clock operations under SLA with our managed team, or a clean handover to yours with runbooks that hold up at 3am.',
  },
];

const FACTS = [
  {
    label: 'Partnership',
    line: 'Snowflake partner with SnowPro certified architects. We are a Databricks partner too, so the platform recommendation follows your workloads, not our margins.',
  },
  {
    label: 'Delivery',
    line: 'The architects who design your warehouse are the ones who tune it. No handoff between the pitch deck and the delivery pod.',
  },
  {
    label: 'Scale',
    line: 'Founded 2006. 1,200+ engineers across 11 global delivery hubs. 500+ enterprise projects.',
  },
  {
    label: 'Operations',
    line: 'ISO 27001 certified and CMMI Level 3 appraised, with 24/7 managed operations under published SLAs.',
  },
];

const FAQS = snowflakeFaqs.map((f) => ({ question: f.q, answer: f.a }));

/* --------------------------------- page ---------------------------------- */

export default function SnowflakePage() {
  return (
    <div className={`bg-white text-black ${v4Sans}`}>
      <ServiceSchema
        name="Snowflake Implementation Services"
        description="Snowflake Partner. Data Cloud architecture, migrations, Snowpark, data sharing, and cost governance for enterprise."
        url="/platforms/snowflake"
        serviceType="Snowflake Consulting"
      />
      {/* FAQPage JSON-LD comes from PageFaq below — one per page. */}
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: '/' },
          { name: 'Platforms', url: '/platforms' },
          { name: 'Snowflake', url: '/platforms/snowflake' },
        ]}
      />

      <ServiceHero
        kicker="Snowflake"
        title={
          <>
            Snowflake that stays fast{' '}
            <span style={{ color: '#1D4ED8' }}>and on&nbsp;budget</span>
          </>
        }
        lede="ACI Infotech is a Snowflake Partner with SnowPro certified architects. We design the warehouse, migrate the data by domain, and set resource monitors and auto-suspend before the first invoice lands. Then we run the platform, around the clock, under SLAs."
        chips={[
          'Snowflake partner',
          'SnowPro certified architects',
          '500+ enterprise projects',
          'ISO 27001',
        ]}
        primary={{ label: 'Talk to a Snowflake architect', href: '/contact' }}
        secondary={{ label: 'See the data platform stories', href: '/case-studies' }}
        visual={<FlowScene config={FLOWS['platform-snowflake']} />}
      />

      {/* Problem band: starting is easy, the bill is the hard part */}
      <FoldcraftHero
        geistClass={v4Geist}
        image="/images/v4/case-finance.jpg"
        pill="Why warehouses drift"
        headline={
          <>
            The demo was fast.{' '}
            <br className="hidden sm:block" />
            <span className="text-[#60A5FA]">The invoice was faster.</span>
          </>
        }
        body="Snowflake makes it easy to start and just as easy to overspend. Warehouses that never suspend, queries nobody profiled, credits burning on jobs no one owns. We have tuned enough Snowflake estates to know where the money hides, and how to get it back."
        story={{
          metric: { value: '22%', label: 'Faster decisions' },
          title:
            'One governed data platform for 400,000 employees across 53 countries.',
          href: '/case-studies/global-food-facilities-data-intelligence',
          logoSrc: '/brand/snowflake-color.svg',
          logoAlt: 'Snowflake',
        }}
      />

      {/* Offerings */}
      <section className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <SectionHead
            kicker="What we do on Snowflake"
            title={
              <>
                One warehouse. <span style={{ color: '#1D4ED8' }}>Six disciplines.</span>
              </>
            }
          />
          <OfferingList items={OFFERINGS} />
        </div>
      </section>

      {/* Honest fit panel */}
      <DecisionPanel
        title={<>Is Snowflake the right&nbsp;call?</>}
        body="Often, when SQL analytics is the center of gravity and the platform team is small. Snowflake removes most of the knobs other platforms make you turn, and data sharing is where it has no real rival. When heavy streaming and ML need the same copy of the data, a lakehouse can fit better, and we will say so before you buy anything. We hold certifications on both."
        colA={{ src: '/brand/snowflake-color.svg', alt: 'Snowflake', label: 'Snowflake', px: 40 }}
        colB={{ label: 'A different road' }}
        rows={DECISION_ROWS}
        footnote="When the second column wins, the honest answer is usually Databricks. The full comparison lives on our data engineering page."
      />

      {/* Proof */}
      <section className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <SectionHead
            kicker="Results"
            title={
              <>
                Data platforms that <span style={{ color: '#1D4ED8' }}>held&nbsp;up.</span>
              </>
            }
          />
          <CmsProofCards technology="Snowflake" fallback={PROOF_FALLBACK} />
        </div>
      </section>

      {/* Process */}
      <section className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <SectionHead kicker="How an engagement runs" title="Five phases. No suspense." />
          <ProcessStrip steps={PROCESS} />
        </div>
      </section>

      {/* Bridge to the data engineering practice */}
      <BridgeBand
        title={<>The warehouse is half the&nbsp;job.</>}
        body="Snowflake pays off when the pipelines, models, and governance around it get the same engineering care as the platform choice. That is our data engineering practice, and the warehouse sits at the center of it."
        link={{ label: 'Data Engineering', href: '/services/data-engineering' }}
      />

      {/* Why us */}
      <section className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <SectionHead kicker="Why ACI" title={<>Why enterprises run Snowflake with&nbsp;us</>} />
          <FactsRow facts={FACTS} />
        </div>
      </section>

      <ClusterPosts keywords={['snowflake', 'data cloud', 'data warehouse']} />

      <RelatedLinks items={snowflakeRelated} />

      <PageFaq
        kicker="Snowflake FAQ"
        title={
          <>
            Snowflake questions,
            <br />
            answered straight.
          </>
        }
        faqs={FAQS}
      />

      <CtaSection label="Let's talk Snowflake" />
    </div>
  );
}
