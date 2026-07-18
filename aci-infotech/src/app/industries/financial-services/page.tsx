import { Metadata } from 'next';
import RelatedLinks from '@/components/seo/RelatedLinks';
import { financialServicesRelated } from '@/content/related-links';
import ClusterPosts from '@/components/seo/ClusterPosts';
import { financialServicesFaqs } from '@/content/industry-faqs';
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
  ProcessStrip,
  BridgeBand,
  FactsRow,
  PageFaq,
  CheckBadge,
  cardShadow,
} from '@/components/v4/page/kit';
import CmsProofCards from '@/components/v4/page/CmsProofCards';
import FlowScene from '@/components/v4/page/FlowScene';
import { FLOWS } from '@/components/v4/page/flow-configs';

export const revalidate = 3600;

const siteUrl = getSiteUrl();

const DESCRIPTION =
  'Enterprise data, AI, and cloud solutions for banks, insurance companies, and asset managers. Regulatory compliance, fraud detection, and digital transformation.';

export const metadata: Metadata = {
  alternates: { canonical: `${siteUrl}/industries/financial-services` },
  title: 'Financial Services Technology Solutions',
  description: DESCRIPTION,
  openGraph: {
    title: 'Financial Services Technology Solutions | ACI Infotech',
    description: DESCRIPTION,
    url: `${siteUrl}/industries/financial-services`,
    siteName: 'ACI Infotech',
    type: 'website',
    images: DEFAULT_OG_IMAGES,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Financial Services Technology Solutions | ACI Infotech',
    description: DESCRIPTION,
    images: DEFAULT_TWITTER_IMAGES,
  },
};

/* ------------------------------- page data ------------------------------- */

const OFFERINGS = [
  {
    title: 'Data platform modernization',
    body: 'Legacy finance systems consolidated onto governed cloud platforms built for real-time analytics and AI. One engagement folded 40+ systems into a single core with zero reporting disruptions and $180K+ in annual savings.',
    chips: ['SAP S/4HANA', 'Databricks', 'Azure', 'Snowflake'],
  },
  {
    title: 'Fraud detection in real time',
    body: 'Machine learning that scores transactions in under 100 milliseconds and explains itself to compliance. One deployment cut fraud losses by $230K a year and false positives by 52%, which is the difference between a review queue and a review department.',
    chips: ['Python', 'TensorFlow', 'Kafka', 'Databricks'],
  },
  {
    title: 'Regulatory compliance engineering',
    body: 'Data lineage, audit trails, and access controls designed in from day one and mapped to SOX and SOC 2. Audit readiness stops being a season and becomes the default state of the platform.',
    chips: ['Unity Catalog', 'Collibra', 'Audit logging'],
  },
  {
    title: 'Customer 360 and personalization',
    body: 'Customer data unified across every touchpoint into one governed profile. Where we have run it, engagement lifted 35% and cross-sell doubled, measured against baseline rather than asserted.',
    chips: ['Salesforce', 'Braze', 'Snowflake'],
  },
  {
    title: 'Risk analytics',
    body: 'Real-time risk scoring, scenario modeling, and regulatory capital optimization on live data instead of last night’s batch. Dashboards the risk committee can read without a translator.',
    chips: ['Databricks', 'MLflow', 'Power BI'],
  },
  {
    title: 'Core modernization',
    body: 'Core banking systems modernized and manual processes automated for digital-first operations. Engagements we have delivered hold 99.7% uptime at 45% lower run cost.',
    chips: ['Azure', 'AWS', 'ServiceNow'],
  },
];

const COMPLIANCE = [
  { name: 'SOC 2 Type II', description: 'Security controls certified' },
  { name: 'SOX Compliance', description: 'Financial reporting controls' },
  { name: 'GDPR/CCPA', description: 'Privacy regulations' },
  { name: 'PCI-DSS', description: 'Payment card security' },
  { name: 'Basel III/IV', description: 'Banking regulations' },
  { name: 'Dodd-Frank', description: 'Financial reform compliance' },
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
    eyebrow: 'Fortune 500 Financial Services Firm',
    metric: '40+',
    metricLabel: 'Finance systems consolidated',
    summary:
      'Finance reporting consolidated onto one S/4HANA core, without disrupting the close along the way.',
    href: '/case-studies/modernizes-finance-reporting-with-sap-transformation',
    linkLabel: 'Read the SAP story',
    image: '/images/v4/case-finance.jpg',
  },
  {
    eyebrow: 'Global Technology Enterprise',
    metric: '0.1%',
    metricLabel: 'Contract error rate',
    summary:
      'Contract creation, review, approval, and renewal automated end to end in a governed CLM environment, with cycle time down 67%.',
    href: '/case-studies/accelerating-contract-performance-through-intelligent-automation',
    linkLabel: 'Read the automation story',
    image: '/images/v4/svc-ops.jpg',
  },
];

const PROCESS = [
  {
    title: 'Assess',
    body: 'Inventory the estate, map the regulatory obligations, and pick the first use case worth real money. If a workload should not move yet, this is where we say so.',
  },
  {
    title: 'Design',
    body: 'Platform architecture, lineage model, and access controls mapped to the frameworks your examiners already use.',
  },
  {
    title: 'Build',
    body: 'Pipelines, controls, and quality gates shipped in increments, with audit evidence generated as a byproduct of normal delivery.',
  },
  {
    title: 'Reconcile',
    body: 'Parallel run against the source until the numbers match and the business signs off. No regulated workload cuts over on faith.',
  },
  {
    title: 'Run',
    body: 'Around-the-clock operations under SLA with our managed team, or a clean handover to yours with runbooks that survive an examiner.',
  },
];

const FACTS = [
  {
    label: 'Controls',
    line: 'Delivery mapped to SOX, SOC 2, PCI-DSS, and Basel reporting requirements. Lineage and audit trails are designed in, not bolted on.',
  },
  {
    label: 'Delivery',
    line: 'The architects who scope the platform are the ones who build it. Parallel runs and reconciliation before any regulated workload cuts over.',
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

const FAQS = financialServicesFaqs.map((f) => ({ question: f.q, answer: f.a }));

/* --------------------------------- page ---------------------------------- */

export default function FinancialServicesPage() {
  return (
    <div className={`bg-white text-black ${v4Sans}`}>
      <ServiceSchema
        name="Financial Services Technology Solutions"
        description={DESCRIPTION}
        url="/industries/financial-services"
        serviceType="Financial Services Technology Consulting"
      />
      {/* FAQPage JSON-LD comes from PageFaq below, one per page. */}
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: '/' },
          { name: 'Industries', url: '/industries' },
          { name: 'Financial Services', url: '/industries/financial-services' },
        ]}
      />

      <ServiceHero
        kicker="Financial Services"
        title={
          <>
            Financial services technology that{' '}
            <span style={{ color: '#1D4ED8' }}>survives the&nbsp;audit</span>
          </>
        }
        lede="From global asset managers to regional banks, we modernize the infrastructure, put AI into production, and keep pace with the regulators, without breaking the security and reliability your operations run on. Every platform we build assumes an examiner will read it."
        chips={[
          '40+ finance systems consolidated',
          'Sub-100ms fraud scoring',
          'SOX and SOC 2 delivery',
          'ISO 27001',
        ]}
        primary={{ label: 'Talk to a financial services team', href: '/contact?reason=architecture-call' }}
        secondary={{ label: 'See the case studies', href: '/case-studies' }}
        visual={<FlowScene config={FLOWS['industry-financial-services']} />}
      />

      {/* Problem band: every number needs a paper trail */}
      <FoldcraftHero
        geistClass={v4Geist}
        image="/images/v4/case-finance.jpg"
        pill="Why regulated data stalls"
        headline={
          <>
            Every number needs{' '}
            <br className="hidden sm:block" />
            <span className="text-[#60A5FA]">a paper trail.</span>
          </>
        }
        body="Mergers leave dozens of finance systems behind, each with its own version of the truth. Fraud models wait on overnight batches, and audit season turns into archaeology. The fix is one governed platform where lineage is a query, controls are code, and the numbers reconcile before anyone asks."
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
            kicker="What we build for finance"
            title={
              <>
                Six builds. <span style={{ color: '#1D4ED8' }}>One standard of&nbsp;evidence.</span>
              </>
            }
          />
          <OfferingList items={OFFERINGS} />
        </div>
      </section>

      {/* Compliance band: the signature regulatory content, restyled */}
      <section className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <SectionHead
            kicker="Compliance"
            title={<>Built to be&nbsp;examined.</>}
            sub="The frameworks and regulations our financial services work is delivered against. Controls and evidence are part of the build, not a project that starts when the audit letter arrives."
          />
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {COMPLIANCE.map((item) => (
              <div key={item.name} className={`flex items-start gap-3 rounded-2xl bg-white px-5 py-4 ${cardShadow}`}>
                <CheckBadge />
                <div>
                  <p className="text-[15px] font-semibold leading-snug text-black">{item.name}</p>
                  <p className="mt-0.5 text-sm text-gray-500">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Proof */}
      <section className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <SectionHead
            kicker="Results"
            title={
              <>
                Numbers that hold up <span style={{ color: '#1D4ED8' }}>under&nbsp;review.</span>
              </>
            }
          />
          <CmsProofCards industry="Financial" fallback={PROOF_FALLBACK} />
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
        title={<>The audit trail starts in the&nbsp;pipeline.</>}
        body="Fraud models, risk dashboards, and regulatory reports are only as trustworthy as the data underneath them. Our data engineering practice builds that layer: governed, lineage-complete, and reconciled against source before anything depends on it."
        link={{ label: 'Data Engineering', href: '/services/data-engineering' }}
      />

      {/* Why us */}
      <section className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <SectionHead kicker="Why ACI" title={<>Why financial institutions build with&nbsp;us</>} />
          <FactsRow facts={FACTS} />
        </div>
      </section>

      <ClusterPosts keywords={['financial services', 'banking', 'fraud detection', 'compliance']} />

      <RelatedLinks items={financialServicesRelated} />

      <PageFaq
        kicker="Financial services FAQ"
        title={
          <>
            Regulated questions,
            <br />
            answered straight.
          </>
        }
        faqs={FAQS}
      />

      <CtaSection label="Let's talk regulated data" />
    </div>
  );
}
