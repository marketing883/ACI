import { Metadata } from 'next';
import RelatedLinks from '@/components/seo/RelatedLinks';
import { azureRelated } from '@/content/related-links';
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
  alternates: { canonical: `${siteUrl}/platforms/azure` },
  title: 'Microsoft Azure Cloud Services',
  description:
    'ACI Infotech is a Microsoft Solutions Partner. Azure migration, Synapse Analytics, Power Platform, and enterprise cloud solutions.',
  openGraph: {
    title: 'Microsoft Azure Cloud Services | ACI Infotech',
    description:
      'ACI Infotech is a Microsoft Solutions Partner. Azure migration, Synapse Analytics, Power Platform, and enterprise cloud solutions.',
    url: `${siteUrl}/platforms/azure`,
    siteName: 'ACI Infotech',
    type: 'website',
    images: DEFAULT_OG_IMAGES,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Microsoft Azure Cloud Services | ACI Infotech',
    description:
      'ACI Infotech is a Microsoft Solutions Partner. Azure migration, Synapse Analytics, Power Platform, and enterprise cloud solutions.',
    images: DEFAULT_TWITTER_IMAGES,
  },
};

/* ------------------------------- page data ------------------------------- */

const OFFERINGS = [
  {
    title: 'Landing zones and migration',
    body: 'Identity through Entra ID, network topology, policy guardrails, and cost management built before any workload arrives. Then Azure Migrate moves the estate in waves, with the retire list settled first.',
    chips: ['Azure Migrate', 'Microsoft Entra ID', 'Azure Policy', 'Terraform'],
  },
  {
    title: 'Microsoft Fabric and Synapse',
    body: 'New analytics builds land on Fabric, where Microsoft is investing: OneLake, warehousing, and Power BI in one platform. Existing Synapse estates keep running, and we map the move to Fabric only when it saves money or effort.',
    chips: ['Microsoft Fabric', 'OneLake', 'Azure Synapse', 'Power BI'],
  },
  {
    title: 'Data integration',
    body: 'ETL and ELT on Data Factory across cloud and on-prem sources, with SSIS packages migrated instead of rewritten from memory. CI/CD is wired in from the first pipeline, so releases are repeatable.',
    chips: ['Azure Data Factory', 'SSIS migration', 'Azure DevOps'],
  },
  {
    title: 'Azure AI',
    body: 'Azure OpenAI against your own documents and data, inside the tenant controls you already manage. Azure ML carries the models that need training, and everything inherits Entra ID access instead of a parallel permission system.',
    chips: ['Azure OpenAI', 'Azure ML', 'Cognitive Services'],
  },
  {
    title: 'Power Platform',
    body: 'Dashboards in Power BI, internal apps in Power Apps, and workflow in Power Automate, with governance set so citizen development does not turn into shadow IT. Dataverse keeps the data where admins can see it.',
    chips: ['Power BI', 'Power Apps', 'Power Automate', 'Dataverse'],
  },
  {
    title: 'Azure DevOps and operations',
    body: 'Pipelines, infrastructure as code, and release management on Azure DevOps, then 24/7 managed operations under SLAs once the estate is live. The people who built the landing zone stay on the console.',
    chips: ['Azure Pipelines', 'AKS', 'Terraform', '24/7 NOC'],
  },
];

const DECISION_ROWS = [
  { need: 'Identity, licensing, and desktops already on Microsoft', pick: 'a' as const },
  { need: 'Analytics on Fabric feeding Power BI', pick: 'a' as const },
  { need: 'A hybrid estate with on-prem Active Directory and SQL Server', pick: 'a' as const },
  { need: 'Azure OpenAI inside the tenant controls you already manage', pick: 'a' as const },
  { need: 'A greenfield build with no Microsoft footprint', pick: 'b' as const },
  { need: 'Data science gravity around BigQuery or SageMaker', pick: 'b' as const },
];

const PROOF_FALLBACK = [
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
    metric: '22%',
    metricLabel: 'Faster decisions',
    summary:
      'One governed data platform for 400,000 employees across 53 countries, replacing dozens of regional reporting stacks.',
    href: '/case-studies/global-food-facilities-data-intelligence',
    linkLabel: 'Read the story',
    image: '/images/v4/case-retail.jpg',
  },
  {
    eyebrow: 'Enterprise Technology Company',
    metric: '99.97%',
    metricLabel: 'Uptime across 72+ servers',
    summary:
      'Automated DevOps pipelines and monitoring across an enterprise server estate, run as a managed operation.',
    href: '/case-studies/optimizing-enterprise-it-operations-with-automated-devops-and-monitoring',
    linkLabel: 'Read the operations story',
    image: '/images/v4/svc-ops.jpg',
  },
];

const PROCESS = [
  {
    title: 'Assess',
    body: 'Azure Migrate scans the estate for a per-workload estimate and a retire list. Existing Microsoft agreements and Azure Hybrid Benefit go into the math from the start.',
  },
  {
    title: 'Land',
    body: 'The landing zone first: Entra ID, network topology, policy guardrails, and cost management before a single workload moves.',
  },
  {
    title: 'Migrate',
    body: 'Waves, with the hairiest dependencies scheduled last. A single application lands in weeks; a full estate move typically runs 6 to 12 months.',
  },
  {
    title: 'Prove',
    body: 'Nothing cuts over until it has passed testing in the target subscription and the owners have signed off. The old environment retires on evidence, not optimism.',
  },
  {
    title: 'Run',
    body: 'Around-the-clock operations under SLA with our managed team, or a clean handover to yours with runbooks that hold up during an incident.',
  },
];

const FACTS = [
  {
    label: 'Partnership',
    line: 'Microsoft Solutions Partner. 200+ cloud migrations delivered across Azure, AWS, and GCP.',
  },
  {
    label: 'Delivery',
    line: 'One team across Azure, Microsoft 365, Dynamics, and Power Platform. The estate gets designed as a whole, not one product at a time.',
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

// Reused from the previous Azure page: the buyer questions and answers were
// already in the site voice, so they carry over intact.
const FAQS = [
  {
    question: 'What does an Azure migration cost?',
    answer:
      'The drivers are workload count, how much needs re-platforming instead of lift and shift, and data volume. We run a fixed-scope assessment with Azure Migrate first, so you get a per-workload estimate and a list of servers that should be retired rather than moved. Existing Microsoft agreements and Azure Hybrid Benefit often cover more of the run cost than teams expect.',
  },
  {
    question: 'How long does an Azure migration take?',
    answer:
      'A single application usually lands in weeks. A full estate move typically runs 6 to 12 months in waves, with the landing zone built first and the hairiest dependencies scheduled last. Nothing cuts over until it has passed testing in the target subscription.',
  },
  {
    question: 'Do we need an Azure landing zone before migrating?',
    answer:
      'Yes, and it is the first thing we build: identity through Entra ID, network topology, policy guardrails, and cost management before any workload arrives. Skipping it is how estates end up with 40 subscriptions and no owner. A solid landing zone makes every wave after it faster.',
  },
  {
    question: 'Should we use Microsoft Fabric or Azure Synapse?',
    answer:
      'For new analytics builds, Microsoft Fabric is where Microsoft is investing: OneLake, warehousing, and Power BI in one SaaS platform. Existing Synapse estates still run fine, and we support both. We will map a migration path to Fabric when it saves you money or effort, and tell you to stay put when it does not.',
  },
  {
    question: 'Can you connect Azure to our Microsoft 365 and Dynamics estate?',
    answer:
      'Yes, that is usually the point of picking Azure. We wire identity through Entra ID, land Dynamics and Dataverse data in Fabric for analytics, and use Azure OpenAI against your own data with the access controls you already manage.',
  },
];

/* --------------------------------- page ---------------------------------- */

export default function AzurePage() {
  return (
    <div className={`bg-white text-black ${v4Sans}`}>
      <ServiceSchema
        name="Microsoft Azure Cloud Services"
        description="Microsoft Solutions Partner. Azure landing zones, migration, Microsoft Fabric and Synapse analytics, Azure AI, and Power Platform for enterprise."
        url="/platforms/azure"
        serviceType="Azure Consulting"
      />
      {/* FAQPage JSON-LD comes from PageFaq below — one per page. */}
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: '/' },
          { name: 'Platforms', url: '/platforms' },
          { name: 'Microsoft Azure', url: '/platforms/azure' },
        ]}
      />

      <ServiceHero
        kicker="Microsoft Azure"
        title={
          <>
            Azure for the company that{' '}
            <span style={{ color: '#1D4ED8' }}>already runs&nbsp;Microsoft</span>
          </>
        }
        lede="ACI Infotech is a Microsoft Solutions Partner. We build Azure landing zones with identity through Entra ID, migrate workloads in waves with Azure Migrate, and stand up analytics on Microsoft Fabric and Synapse. The same team wires Azure OpenAI and Power Platform into the Microsoft 365 and Dynamics estate your business already runs on."
        chips={[
          'Microsoft Solutions Partner',
          '200+ cloud migrations',
          'Fabric and Synapse',
          'ISO 27001',
        ]}
        primary={{ label: 'Talk to an Azure architect', href: '/contact' }}
        secondary={{ label: 'See the cloud stories', href: '/case-studies' }}
        visual={<FlowScene config={FLOWS['platform-azure']} />}
      />

      {/* Problem band: sprawl arrives before governance does */}
      <FoldcraftHero
        geistClass={v4Geist}
        image="/images/v4/case-energy.jpg"
        pill="Why Azure estates sprawl"
        headline={
          <>
            Subscriptions multiply.{' '}
            <br className="hidden sm:block" />
            <span className="text-[#60A5FA]">Owners do not.</span>
          </>
        }
        body="Azure is easy to start and just as easy to sprawl: dozens of subscriptions, no landing zone, policy bolted on after the audit. Identity comes first, then guardrails, then workloads. Done in that order, every wave after the first one gets faster."
        story={{
          metric: { value: '90d', label: 'From prototype to production' },
          title:
            'Azure Data Lake, Databricks, AKS, and Synapse connected into one governed foundation for a global financial services firm.',
          href: '/case-studies/driving-enterprise-data-transformation-with-aci-s-azure-lakehouse',
          logoSrc: '/brand/azure-color.png',
          logoAlt: 'Microsoft Azure',
        }}
      />

      {/* Offerings */}
      <section className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <SectionHead
            kicker="What we do on Azure"
            title={
              <>
                One tenant. <span style={{ color: '#1D4ED8' }}>Six disciplines.</span>
              </>
            }
          />
          <OfferingList items={OFFERINGS} />
        </div>
      </section>

      {/* Honest fit panel */}
      <DecisionPanel
        title={<>Is Azure the right&nbsp;call?</>}
        body="Usually, when the company already runs on Microsoft. Entra ID, Microsoft 365, Dynamics, and existing agreements pull the answer toward Azure, and Azure Hybrid Benefit often covers more of the run cost than teams expect. When there is no Microsoft gravity, another cloud can be the shorter road, and we will say so before you commit. We migrate to all three majors."
        colA={{ src: '/brand/azure-color.png', alt: 'Microsoft Azure', px: 44 }}
        colB={{ label: 'A different road' }}
        rows={DECISION_ROWS}
        footnote="When the second column wins, it is usually AWS or Google Cloud. Both have pages of their own, and the full comparison lives on our cloud modernization page."
      />

      {/* Proof */}
      <section className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <SectionHead
            kicker="Results"
            title={
              <>
                Azure work that reached <span style={{ color: '#1D4ED8' }}>production.</span>
              </>
            }
          />
          <CmsProofCards technology="Azure" fallback={PROOF_FALLBACK} />
        </div>
      </section>

      {/* Process */}
      <section className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <SectionHead kicker="How an engagement runs" title="Five phases. No surprises." />
          <ProcessStrip steps={PROCESS} />
        </div>
      </section>

      {/* Bridge to the cloud modernization practice */}
      <BridgeBand
        title={<>The landing zone is the start, not the&nbsp;finish.</>}
        body="Azure pays off when the applications, data, and operations on top of it are modernized with the same care as the foundation. That is our cloud modernization practice, from the first assessment to the managed run."
        link={{ label: 'Cloud Modernization', href: '/services/cloud-modernization' }}
      />

      {/* Why us */}
      <section className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <SectionHead kicker="Why ACI" title={<>Why enterprises run Azure with&nbsp;us</>} />
          <FactsRow facts={FACTS} />
        </div>
      </section>

      <ClusterPosts keywords={['azure', 'microsoft fabric', 'synapse']} />

      <RelatedLinks items={azureRelated} />

      <PageFaq
        kicker="Azure FAQ"
        title={
          <>
            Azure questions,
            <br />
            answered straight.
          </>
        }
        faqs={FAQS}
      />

      <CtaSection label="Let's talk Azure" />
    </div>
  );
}
