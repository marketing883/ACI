import { Metadata } from 'next';
import RelatedLinks from '@/components/seo/RelatedLinks';
import { microsoftDynamicsRelated } from '@/content/related-links';
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

// Keyword split for the Dynamics cluster: this page owns the
// informational "Microsoft Dynamics 365 consulting" intent;
// /lp/dynamics-365-implementation owns the transactional
// "Dynamics 365 implementation services" intent; the roadmap LP is
// noindexed paid-campaign inventory.
const TITLE = 'Microsoft Dynamics 365 Consulting | ACI Infotech';
const DESCRIPTION =
  'Microsoft Dynamics 365 consulting for enterprise teams: Copilot, Power Platform, and Fabric implementation, integration, migration, and managed support.';

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: `${siteUrl}/platforms/microsoft-dynamics` },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${siteUrl}/platforms/microsoft-dynamics`,
    siteName: 'ACI Infotech',
    type: 'website',
    images: DEFAULT_OG_IMAGES,
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
    images: DEFAULT_TWITTER_IMAGES,
  },
};

/* ------------------------------- page data ------------------------------- */

const OFFERINGS = [
  {
    title: 'Dynamics 365 CRM',
    body: 'Sales, Customer Service, and Field Service on one Dataverse, with the integrations that keep records honest. A CRM works when sellers stop keeping a second spreadsheet, so that is the bar we build to.',
    chips: ['Dynamics 365 Sales', 'Customer Service', 'Field Service', 'Dataverse'],
  },
  {
    title: 'Dynamics 365 ERP',
    body: 'Finance and Supply Chain for the full ERP footprint, Business Central for mid-sized operations. We migrate the data, rebuild the integrations, and keep the old ledger readable until the numbers reconcile.',
    chips: ['Finance & Supply Chain', 'Business Central', 'Customer Insights'],
  },
  {
    title: 'Power Platform extensions',
    body: 'Power Apps for the screens Dynamics does not ship, Power Automate for approvals and handoffs, Power Pages for people outside the tenant. Extensions live here instead of in core code, which is why upgrades stay boring.',
    chips: ['Power Apps', 'Power Automate', 'Power Pages', 'Dataverse'],
  },
  {
    title: 'Copilot and custom agents',
    body: 'Copilot drafting emails and case summaries from your own records, and custom agents built in Copilot Studio on the same foundation. The wins are the boring ones: less typing, faster case wrap-up.',
    chips: ['Microsoft Copilot', 'Copilot Studio', 'Azure OpenAI Service'],
  },
  {
    title: 'Fabric and analytics',
    body: 'Dataverse linked into OneLake without ETL pipelines, so Dynamics data lands in governed dashboards instead of exported spreadsheets. Power BI on top, secured once, reused everywhere.',
    chips: ['Microsoft Fabric', 'OneLake', 'Power BI'],
  },
  {
    title: 'Migration and managed support',
    body: 'Legacy ERP and CRM estates moved in phases, by entity or region, then run under SLA. Release waves get tested and applied on schedule, and the integrations stay watched around the clock.',
    chips: ['Azure Integration Services', 'Data migration', '24/7 support'],
  },
];

const DECISION_ROWS = [
  { need: 'CRM and ERP on one data layer', pick: 'a' as const },
  { need: 'Teams, Outlook, and Microsoft 365 as the daily surface', pick: 'a' as const },
  { need: 'Extensions your own team maintains in low code', pick: 'a' as const },
  { need: 'Copilot grounded in your business records', pick: 'a' as const },
  { need: 'A sales motion built around a different CRM', pick: 'b' as const },
  { need: 'Deep vertical features one suite cannot match', pick: 'b' as const },
];

const PROOF_FALLBACK = [
  {
    eyebrow: 'Global Technology Enterprise',
    metric: '0.1%',
    metricLabel: 'Error rate after automation',
    summary:
      'Contract lifecycle automation across a global enterprise, with manual rework engineered out of the process.',
    href: '/case-studies/accelerating-contract-performance-through-intelligent-automation',
    linkLabel: 'Read the contract story',
    image: '/images/v4/svc-ops.jpg',
  },
  {
    eyebrow: 'National Healthcare Provider',
    metric: '4h',
    metricLabel: 'Claims processing, down from 72',
    summary:
      'Eligibility verification automated end to end, taking claims processing from three days to four hours.',
    href: '/case-studies/healthcare-eligibility-verification-automation-aci-yesbot',
    linkLabel: 'Read the automation story',
    image: '/images/v4/case-healthcare.jpg',
  },
  {
    eyebrow: 'Global Food Services Operator',
    metric: '53',
    metricLabel: 'Countries on one platform',
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
    body: 'Current estate, the licensing you already own, and the first process worth moving. If Dynamics is the wrong fit, this is where we say so.',
  },
  {
    title: 'Design',
    body: 'Solution architecture across Dataverse, security roles, and integrations, with extensions planned into Power Platform from day one.',
  },
  {
    title: 'Build',
    body: 'Phased delivery by entity or region. A focused Sales or Business Central rollout typically lands in 3 to 4 months; full ERP programs run 6 to 12.',
  },
  {
    title: 'Prove',
    body: 'Parallel run against the legacy system until the numbers reconcile and the business signs off. Nothing retires on faith.',
  },
  {
    title: 'Run',
    body: 'Release waves tested and applied, agents and automations tuned, and support under SLA around the clock.',
  },
];

const FACTS = [
  {
    label: 'Partnership',
    line: 'Microsoft partner. Dynamics 365, Power Platform, Fabric, and Azure delivered by one certified team.',
  },
  {
    label: 'Delivery',
    line: 'The architects who scope the rollout stay on it through go-live. No handoff between the pitch and the delivery pod.',
  },
  {
    label: 'Scale',
    line: 'Founded 2006. 1,200+ engineers across 11 global delivery hubs. 500+ enterprise projects.',
  },
  {
    label: 'Operations',
    line: 'ISO 27001 certified and CMMI Level 3 appraised, with 24/7 operations under SLAs.',
  },
];

const FAQS = [
  {
    question: 'How long does a Dynamics 365 implementation take?',
    answer:
      'A focused Sales or Business Central rollout typically lands in 3 to 4 months. Finance and Supply Chain programs replacing a legacy ERP run 6 to 12 months and go live in phases, usually by entity or region. The first phase ships something people use, not a design document.',
  },
  {
    question: 'Can Dynamics 365 replace our legacy ERP?',
    answer:
      'Yes. Dynamics 365 Finance and Supply Chain covers the core ERP footprint: general ledger, procurement, inventory, and order to cash. Business Central handles the same ground for mid-sized operations. We migrate the data, rebuild the integrations, and keep the old system readable until the numbers reconcile.',
  },
  {
    question: 'What does Copilot actually do inside Dynamics 365?',
    answer:
      'It drafts emails and case summaries from CRM context, answers questions against your own records, and automates the routine steps in sales and service workflows. With Copilot Studio we build custom agents on the same foundation. The practical wins are the boring ones: less typing, faster case wrap-up.',
  },
  {
    question: 'Do we need Microsoft Fabric alongside Dynamics 365?',
    answer:
      'Not on day one, but it is the natural next step. Fabric links Dataverse data into OneLake without ETL pipelines, which is how Dynamics data ends up in real dashboards instead of exported spreadsheets. We usually add it once the transactional rollout is stable.',
  },
  {
    question: 'Can you extend Dynamics with Power Platform?',
    answer:
      'Yes, that is where most of the customization belongs. Power Apps for the screens Dynamics does not ship, Power Automate for approvals and handoffs, Power Pages for external users, all on the same Dataverse. Keeping extensions there instead of in core code keeps upgrades painless.',
  },
];

/* --------------------------------- page ---------------------------------- */

export default function MicrosoftDynamicsPage() {
  return (
    <div className={`bg-white text-black ${v4Sans}`}>
      <ServiceSchema
        name="Microsoft Dynamics 365 Consulting"
        description="Microsoft Dynamics 365 consulting for enterprise teams: CRM, ERP, Copilot, Power Platform, and Fabric implementation, integration, migration, and managed support."
        url="/platforms/microsoft-dynamics"
        serviceType="Microsoft Dynamics 365 Consulting"
      />
      {/* FAQPage JSON-LD comes from PageFaq below. One per page. */}
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: '/' },
          { name: 'Platforms', url: '/platforms' },
          { name: 'Microsoft Dynamics 365', url: '/platforms/microsoft-dynamics' },
        ]}
      />

      <ServiceHero
        kicker="Microsoft Dynamics 365"
        title={
          <>
            Dynamics 365, delivered as{' '}
            <span style={{ color: '#1D4ED8' }}>one&nbsp;system</span>
          </>
        }
        lede="ACI Infotech is a Microsoft partner. We implement Dynamics 365 across CRM and ERP, extend it with Power Platform instead of core code, and put Copilot to work inside the workflows your teams run every day. Fabric ties the data together, Azure sits underneath, and one team delivers all of it."
        chips={[
          'Microsoft partner',
          'Dynamics 365 CRM and ERP',
          'Power Platform',
          'Azure underneath',
        ]}
        primary={{ label: 'Talk to a Dynamics consultant', href: '/contact' }}
        secondary={{ label: 'See the case studies', href: '/case-studies' }}
        visual={<FlowScene config={FLOWS['platform-microsoft-dynamics']} />}
      />

      {/* Problem band: ERP programs drag for predictable reasons */}
      <FoldcraftHero
        geistClass={v4Geist}
        image="/images/v4/why-visual.jpg"
        pill="Why ERP programs drag"
        headline={
          <>
            The demo was clean.{' '}
            <br className="hidden sm:block" />
            <span className="text-[#60A5FA]">The rollout was not.</span>
          </>
        }
        body="Dynamics programs stall the way most ERP programs do: customizations pile into core code, the legacy system never quite dies, and every integration becomes a special case. We keep extensions in Power Platform, reconcile the numbers before cutover, and retire the old system on evidence, not hope."
        story={{
          metric: { value: '0.1%', label: 'Error rate after automation' },
          title:
            'Contract lifecycle automation for a global technology enterprise, with manual rework engineered out.',
          href: '/case-studies/accelerating-contract-performance-through-intelligent-automation',
          logoSrc: '/brand/microsoft-mono.svg',
          logoAlt: 'Microsoft',
        }}
      />

      {/* Offerings */}
      <section className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <SectionHead
            kicker="What we do on Dynamics 365"
            title={
              <>
                One Dataverse. <span style={{ color: '#1D4ED8' }}>Six disciplines.</span>
              </>
            }
          />
          <OfferingList items={OFFERINGS} />
        </div>
      </section>

      {/* Honest fit panel */}
      <DecisionPanel
        title={<>Is Dynamics 365 the right&nbsp;call?</>}
        body="Usually, when the rest of the business runs on Microsoft. Dynamics earns its place when CRM, ERP, and the collaboration layer share one identity, one data platform, and one support relationship. When a specialist tool is genuinely better at your core motion, a best-of-breed stack wins, and we will say so."
        colA={{ src: '/brand/microsoft-mono.svg', alt: 'Microsoft', label: 'Dynamics 365', px: 28 }}
        colB={{ label: 'Best-of-breed stack' }}
        rows={DECISION_ROWS}
        footnote="When the second column wins, the honest answer is often Salesforce for CRM or a specialist ERP. We are a Salesforce partner too, so the recommendation follows your stack, not our badge wall."
      />

      {/* Proof */}
      <section className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <SectionHead
            kicker="Results"
            title={
              <>
                Business systems that <span style={{ color: '#1D4ED8' }}>went&nbsp;live.</span>
              </>
            }
          />
          <CmsProofCards technology="Microsoft Dynamics" fallback={PROOF_FALLBACK} />
        </div>
      </section>

      {/* Process */}
      <section className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <SectionHead kicker="How an engagement runs" title="Five phases. No mystery." />
          <ProcessStrip steps={PROCESS} />
        </div>
      </section>

      {/* Bridge to the digital transformation practice */}
      <BridgeBand
        title={<>ERP is a process job&nbsp;first.</>}
        body="Dynamics pays off when the processes it runs get redesigned with the same care as the platform choice. That is our digital transformation practice: process, ERP, and integration modernization delivered with engineering rigor."
        link={{ label: 'Digital Transformation', href: '/services/digital-transformation' }}
      />

      {/* Why us */}
      <section className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <SectionHead kicker="Why ACI" title={<>Why enterprises run Dynamics with&nbsp;us</>} />
          <FactsRow facts={FACTS} />
        </div>
      </section>

      <ClusterPosts keywords={['dynamics 365', 'microsoft', 'power platform', 'copilot']} />

      <RelatedLinks items={microsoftDynamicsRelated} />

      <PageFaq
        kicker="Dynamics 365 FAQ"
        title={
          <>
            Dynamics questions,
            <br />
            answered straight.
          </>
        }
        faqs={FAQS}
      />

      <CtaSection label="Let's talk Dynamics 365" />
    </div>
  );
}
