import { Metadata } from 'next';
import RelatedLinks from '@/components/seo/RelatedLinks';
import { gcpRelated } from '@/content/related-links';
import ClusterPosts from '@/components/seo/ClusterPosts';
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
  alternates: { canonical: `${siteUrl}/platforms/gcp` },
  title: 'Google Cloud Platform Services',
  description:
    'ACI Infotech builds on Google Cloud Platform. BigQuery, Vertex AI, GKE, Anthos, and data-driven AI workloads delivered end to end.',
  openGraph: {
    title: 'Google Cloud Platform Services | ACI Infotech',
    description:
      'ACI Infotech builds on Google Cloud Platform. BigQuery, Vertex AI, GKE, Anthos, and data-driven AI workloads delivered end to end.',
    url: `${siteUrl}/platforms/gcp`,
    siteName: 'ACI Infotech',
    type: 'website',
    images: DEFAULT_OG_IMAGES,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Google Cloud Platform Services | ACI Infotech',
    description:
      'ACI Infotech builds on Google Cloud Platform. BigQuery, Vertex AI, GKE, Anthos, and data-driven AI workloads delivered end to end.',
    images: DEFAULT_TWITTER_IMAGES,
  },
};

/* ------------------------------- page data ------------------------------- */

const OFFERINGS = [
  {
    title: 'BigQuery warehousing and analytics',
    body: 'BigQuery as the warehouse, streaming ingestion through Dataflow, Spark on Dataproc where it earns a place, and Looker on a governed model. No clusters to babysit, and the slot spend gets planned instead of discovered.',
    chips: ['BigQuery', 'Dataflow', 'Dataproc', 'Looker'],
  },
  {
    title: 'Vertex AI and GenAI',
    body: 'Models that ship. Vertex AI pipelines carry work from notebook to production, Gemini handles GenAI grounded in your own data, and every model gets an owner, a monitor, and a rollback path.',
    chips: ['Vertex AI', 'Gemini', 'Agent Builder', 'Model Garden'],
  },
  {
    title: 'GKE and containers',
    body: 'Container estates on GKE, Autopilot where it fits, service mesh where it is needed, and Workload Identity tied to IAM. Binary Authorization keeps unsigned images out of production.',
    chips: ['GKE', 'Cloud Run', 'Anthos', 'Workload Identity'],
  },
  {
    title: 'Migration to Google Cloud',
    body: 'Moves from on premise, AWS, or Azure in staged waves. Migrate to Containers for the lift, Database Migration Service for the databases, Transfer Appliance when the data outweighs the wire. Cutovers are rehearsed, not improvised.',
    chips: ['Migrate to Containers', 'Database Migration Service', 'Transfer Appliance', 'Cutover runbooks'],
  },
  {
    title: 'Security and compliance',
    body: 'The landing zone carries the posture: VPC Service Controls around sensitive data, Security Command Center for findings, and audit logs wired to your SIEM. HIPAA and PCI workloads get their controls designed in, not bolted on.',
    chips: ['Security Command Center', 'VPC Service Controls', 'Cloud IAM', 'Audit logging'],
  },
  {
    title: 'FinOps and cost governance',
    body: 'Committed use discounts planned against real usage, BigQuery slots sized to the workload, and chargeback built on the billing export. Recommender flags the waste. We act on it monthly, not at renewal.',
    chips: ['Committed use planning', 'BigQuery slots', 'Recommender', 'Billing export'],
  },
];

const DECISION_ROWS = [
  { need: 'Analytics at scale without cluster management', pick: 'a' as const },
  { need: 'ML and GenAI as first-class workloads', pick: 'a' as const },
  { need: 'Kubernetes as the center of gravity', pick: 'a' as const },
  { need: 'Streaming and batch on one data stack', pick: 'a' as const },
  { need: 'A mostly Windows, Microsoft-licensed estate', pick: 'b' as const },
  { need: 'A team already deep in AWS primitives', pick: 'b' as const },
];

const PROOF_FALLBACK = [
  {
    eyebrow: 'Global Food Services Operator',
    metric: '22%',
    metricLabel: 'Faster decisions',
    summary:
      'One governed data platform for 400,000 employees in 53 countries, replacing dozens of regional reporting stacks.',
    href: '/case-studies/global-food-facilities-data-intelligence',
    linkLabel: 'Read the story',
    image: '/images/v4/case-retail.jpg',
  },
  {
    eyebrow: 'Global Financial Services Firm',
    metric: '90d',
    metricLabel: 'From prototype to production',
    summary:
      'A cloud lakehouse connected into one governed foundation for analytics and machine learning, live in ninety days.',
    href: '/case-studies/driving-enterprise-data-transformation-with-aci-s-azure-lakehouse',
    linkLabel: 'Read the story',
    image: '/images/v4/case-finance.jpg',
  },
  {
    eyebrow: 'Enterprise Technology Company',
    metric: '99.97%',
    metricLabel: 'Uptime across 72+ servers',
    summary:
      'Automated DevOps and monitoring across the estate, run as a steady operation instead of a rescue.',
    href: '/case-studies/optimizing-enterprise-it-operations-with-automated-devops-and-monitoring',
    linkLabel: 'Read the story',
    image: '/images/v4/svc-ops.jpg',
  },
];

const PROCESS = [
  {
    title: 'Assess',
    body: 'Estate review, cost baseline, and the first workload worth moving. If Google Cloud is the wrong home for it, this is where we say so.',
  },
  {
    title: 'Land',
    body: 'Landing zone first: IAM, VPC Service Controls, network design, and billing export. Governance before workloads, in that order.',
  },
  {
    title: 'Build',
    body: 'BigQuery models, Dataflow pipelines, and GKE services shipped in increments. A single warehouse move typically runs 3 to 6 months end to end.',
  },
  {
    title: 'Prove',
    body: 'Parallel runs against the old reports until the business stops checking them. The legacy system stays on until parity is signed off.',
  },
  {
    title: 'Run',
    body: '24/7 operations under SLAs with monthly FinOps reviews, or a clean handover to your team with runbooks that have been used, not just written.',
  },
];

const FACTS = [
  {
    label: 'Certifications',
    line: 'Google Cloud Professional certifications across data engineering, machine learning, security, and infrastructure. The people who hold them do the delivery.',
  },
  {
    label: 'Migrations',
    line: '200+ cloud migrations delivered across Google Cloud, AWS, and Azure. Landing zone first, workloads second, every time.',
  },
  {
    label: 'Scale',
    line: 'Founded 2006. 1,200+ engineers across 11 global delivery hubs. 500+ enterprise projects.',
  },
  {
    label: 'Operations',
    line: 'ISO 27001 certified and CMMI Level 3 appraised, with 24/7 managed operations under SLAs.',
  },
];

const FAQS = [
  {
    question: 'Why pick Google Cloud over AWS or Azure?',
    answer:
      'Pick it for the data and AI stack: BigQuery needs no cluster management, Vertex AI carries models from notebook to production, and GKE is the most mature managed Kubernetes. If your workloads are mostly Windows and Microsoft-licensed, Azure usually wins on economics, and we will say so in the assessment.',
  },
  {
    question: 'How long does a BigQuery migration take?',
    answer:
      'A single warehouse typically moves in 3 to 6 months, including schema conversion, pipeline rebuilds in Dataflow, and parallel-run validation against the old system. The long pole is rarely BigQuery itself; it is untangling the reports and jobs that grew around the legacy warehouse.',
  },
  {
    question: 'Can you migrate us from AWS or on-premise to Google Cloud?',
    answer:
      'Yes. We use Migrate to Containers for lift-and-modernize moves onto GKE, Database Migration Service for the databases, and Transfer Appliance when the data is too big for the wire. Every migration lands in a proper landing zone with IAM, VPC Service Controls, and billing export set up first.',
  },
  {
    question: 'How do you keep Google Cloud costs under control?',
    answer:
      'Committed use discounts planned against real usage, BigQuery slot sizing and query tuning, and chargeback built on the billing export so every team sees its own line. Google Cloud Recommender flags the idle resources; the discipline is acting on it monthly rather than at renewal time.',
  },
  {
    question: 'Do you support HIPAA or PCI workloads on Google Cloud?',
    answer:
      'Yes. We build the compliance posture into the landing zone: VPC Service Controls around sensitive data, Security Command Center for findings, and audit logging wired to your SIEM. Our healthcare deployments have passed their audits with that architecture in place.',
  },
];

/* --------------------------------- page ---------------------------------- */

export default function GCPPage() {
  return (
    <div className={`bg-white text-black ${v4Sans}`}>
      <ServiceSchema
        name="Google Cloud Platform Services"
        description="Google Cloud consulting and delivery. BigQuery, Vertex AI, GKE, migration, security, and FinOps for enterprise."
        url="/platforms/gcp"
        serviceType="Google Cloud Consulting"
      />
      {/* FAQPage JSON-LD comes from PageFaq below. One per page. */}
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: '/' },
          { name: 'Platforms', url: '/platforms' },
          { name: 'Google Cloud', url: '/platforms/gcp' },
        ]}
      />

      <ServiceHero
        kicker="Google Cloud"
        title={
          <>
            Google Cloud that starts with{' '}
            <span style={{ color: '#1D4ED8' }}>the&nbsp;data</span>
          </>
        }
        lede="Google Cloud is where we build when the data is the workload. ACI Infotech stands up BigQuery lakehouses, Vertex AI pipelines, and GKE estates, with the landing zone, governance, and cost controls in place before the first workload arrives. Then we run the platform, around the clock, under SLAs."
        chips={[
          'Google Cloud Professional certified',
          '200+ cloud migrations',
          'BigQuery and Vertex AI delivery',
          'ISO 27001',
        ]}
        primary={{ label: 'Book a Google Cloud assessment', href: '/contact?platform=gcp&source=hero' }}
        secondary={{ label: 'See the case studies', href: '/case-studies' }}
        visual={<FlowScene config={FLOWS['platform-gcp']} />}
      />

      {/* Problem band: the console is easy, the platform is not */}
      <FoldcraftHero
        geistClass={v4Geist}
        image="/images/v4/svc-ai.jpg"
        pill="Platform before workloads"
        headline={
          <>
            Landing zone, governance, cost model.{' '}
            <br className="hidden sm:block" />
            <span className="text-[#60A5FA]">Then the&nbsp;workloads.</span>
          </>
        }
        body="BigQuery answers its first query in minutes. Give it a landing zone, an IAM design, and a cost model first, and it keeps answering at scale: pipelines with owners, budgets with alerts, and an invoice that grows only with the business."
        story={{
          metric: { value: '22%', label: 'Faster decisions' },
          title:
            'One governed data platform for 400,000 employees across 53 countries, replacing dozens of regional reporting stacks.',
          href: '/case-studies/global-food-facilities-data-intelligence',
          logoSrc: '/brand/googlecloud-color.svg',
          logoAlt: 'Google Cloud',
        }}
      />

      {/* Offerings */}
      <section className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <SectionHead
            kicker="What we do on Google Cloud"
            title={
              <>
                One cloud. <span style={{ color: '#1D4ED8' }}>Six disciplines.</span>
              </>
            }
          />
          <OfferingList items={OFFERINGS} />
        </div>
      </section>

      {/* Honest fit panel */}
      <DecisionPanel
        title={<>Is Google Cloud the right&nbsp;cloud?</>}
        body="Pick it for the data and AI stack. BigQuery needs no cluster management, Vertex AI carries models to production, and GKE is the most mature managed Kubernetes. When your estate points elsewhere, we will say so in the assessment. We build on all three hyperscalers, so the recommendation follows your workloads, not a reseller margin."
        colA={{ src: '/brand/googlecloud-color.svg', alt: 'Google Cloud', label: 'Google Cloud', px: 30 }}
        colB={{ label: 'Another cloud' }}
        rows={DECISION_ROWS}
        footnote="When the second column wins, the honest answer is usually Azure for Microsoft estates or AWS for teams that already live there. We deliver on all three, so nobody here needs you to pick Google."
      />

      {/* Proof */}
      <section className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <SectionHead
            kicker="Results"
            title={
              <>
                Data platforms that <span style={{ color: '#1D4ED8' }}>went&nbsp;live.</span>
              </>
            }
          />
          <CmsProofCards technology="Google Cloud" fallback={PROOF_FALLBACK} />
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
        title={<>The cloud is the floor, not the&nbsp;building.</>}
        body="BigQuery and Vertex AI pay off when the pipelines, contracts, and governance around them are engineered with the same care as the platform choice. That is our data engineering practice, and Google Cloud is one of its home fields."
        link={{ label: 'Data Engineering', href: '/services/data-engineering' }}
      />

      {/* Why us */}
      <section className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <SectionHead kicker="Why ACI" title={<>Why enterprises run Google Cloud with&nbsp;us</>} />
          <FactsRow facts={FACTS} />
        </div>
      </section>

      <ClusterPosts keywords={['google cloud', 'gcp', 'bigquery', 'vertex ai']} />

      <RelatedLinks items={gcpRelated} />

      <PageFaq
        kicker="Google Cloud FAQ"
        title={
          <>
            Google Cloud questions,
            <br />
            answered straight.
          </>
        }
        faqs={FAQS}
      />

      <CtaSection label="Let's talk Google Cloud" href="/contact?platform=gcp&source=cta-section" />
    </div>
  );
}
