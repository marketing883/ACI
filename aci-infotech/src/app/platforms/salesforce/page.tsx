import { Metadata } from 'next';
import RelatedLinks from '@/components/seo/RelatedLinks';
import { salesforceRelated } from '@/content/related-links';
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
  alternates: { canonical: `${siteUrl}/platforms/salesforce` },
  title: 'Salesforce Implementation Services',
  description:
    'ACI Infotech is a Salesforce Consulting Partner. Sales Cloud, Service Cloud, Marketing Cloud, and Data Cloud implementation and integration.',
  openGraph: {
    title: 'Salesforce Implementation Services | ACI Infotech',
    description:
      'ACI Infotech is a Salesforce Consulting Partner. Sales Cloud, Service Cloud, Marketing Cloud, and Data Cloud implementation and integration.',
    url: `${siteUrl}/platforms/salesforce`,
    siteName: 'ACI Infotech',
    type: 'website',
    images: DEFAULT_OG_IMAGES,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Salesforce Implementation Services | ACI Infotech',
    description:
      'ACI Infotech is a Salesforce Consulting Partner. Sales Cloud, Service Cloud, Marketing Cloud, and Data Cloud implementation and integration.',
    images: DEFAULT_TWITTER_IMAGES,
  },
};

/* ------------------------------- page data ------------------------------- */

const OFFERINGS = [
  {
    title: 'Sales Cloud',
    body: 'Pipeline, forecasting, and CPQ set up around how your deals actually move. Fewer required fields, cleaner stages, and reporting sales leaders actually read. Adoption is designed in, not begged for later.',
    chips: ['Sales Cloud', 'CPQ', 'Einstein Forecasting', 'Revenue reporting'],
  },
  {
    title: 'Service Cloud',
    body: 'Case routing, knowledge, and Einstein Bots that deflect the easy tickets and escalate the hard ones with context attached. Omnichannel means one queue for agents, not five consoles.',
    chips: ['Service Cloud', 'Omni-Channel', 'Einstein Bots', 'Knowledge'],
  },
  {
    title: 'Marketing Cloud',
    body: 'Journeys built on segments that resolve to real people. Email, mobile, and ads working from the same profile, measured against revenue instead of open rates.',
    chips: ['Marketing Cloud', 'Journey Builder', 'Email Studio', 'Segmentation'],
  },
  {
    title: 'Data Cloud and Agentforce',
    body: 'Identity resolution turns six conflicting records into one, and Agentforce agents work from that record: qualifying leads, resolving cases, drafting follow-ups. Agents are only as good as the data they read, so we build the data first.',
    chips: ['Data Cloud', 'Agentforce', 'Identity resolution', 'Activation'],
  },
  {
    title: 'Integration',
    body: 'Salesforce wired to the ERP and the warehouse through MuleSoft, Platform Events, or plain APIs, chosen by latency and volume. Orders and invoices stay in the ERP. Salesforce gets a live view, not a stale copy.',
    chips: ['MuleSoft', 'Platform Events', 'REST APIs', 'CDC'],
  },
  {
    title: 'Managed services',
    body: 'Three Salesforce releases a year, handled. Release management, admin support, and ongoing configuration under SLAs, with your team trained so the knowledge stays when the project ends.',
    chips: ['Release management', 'Admin support', 'SLAs', 'User training'],
  },
];

const DECISION_ROWS = [
  { need: 'Sales, service, and marketing on one platform', pick: 'a' as const },
  { need: 'Admins, not engineers, running the roadmap', pick: 'a' as const },
  { need: 'AI agents inside the CRM with Agentforce', pick: 'a' as const },
  { need: 'One resolved customer record with Data Cloud', pick: 'a' as const },
  { need: 'Best-of-breed tools on a warehouse core', pick: 'b' as const },
  { need: 'Engineering owns the customer data stack', pick: 'b' as const },
  { need: 'Deep custom logic that fights any suite', pick: 'b' as const },
];

const PROOF_FALLBACK = [
  {
    eyebrow: 'Fortune 500 Convenience Retail Chain',
    metric: '2.5x',
    metricLabel: 'Email engagement',
    summary:
      'Customer data unified across 600+ locations, with email engagement up 2.5x and promotions working 15% harder.',
    href: '/case-studies/databricks-modernization-ai-enablement-for-leading-c-store-chain',
    linkLabel: 'Read the story',
    image: '/images/v4/case-retail.jpg',
  },
  {
    eyebrow: 'National Healthcare Provider',
    metric: '4h',
    metricLabel: 'Claims processing, down from 72',
    summary:
      'Eligibility verification automated end to end, taking claims processing from 72 hours to 4.',
    href: '/case-studies/healthcare-eligibility-verification-automation-aci-yesbot',
    linkLabel: 'Read the story',
    image: '/images/v4/case-healthcare.jpg',
  },
  {
    eyebrow: 'Global Technology Enterprise',
    metric: '0.1%',
    metricLabel: 'Contract error rate',
    summary:
      'Contract performance run through intelligent automation, with the error rate held at 0.1%.',
    href: '/case-studies/accelerating-contract-performance-through-intelligent-automation',
    linkLabel: 'Read the story',
    image: '/images/v4/svc-ai.jpg',
  },
];

const PROCESS = [
  {
    title: 'Audit',
    body: 'Org audit first: what is customized, what is dead, and what blocks the roadmap. Rebuilds get recommended only when the math says so.',
  },
  {
    title: 'Design',
    body: 'Object model, integration contracts, and the Data Cloud identity plan agreed before anyone builds. Scope discipline starts here.',
  },
  {
    title: 'Build',
    body: 'Configuration over code, shipped in phases so sales teams work in the system while later phases land. A focused cloud rollout lands in 10 to 16 weeks.',
  },
  {
    title: 'Adopt',
    body: 'Training, admin enablement, and adoption tracking with real numbers. A CRM nobody updates is an expensive address book.',
  },
  {
    title: 'Run',
    body: 'Managed services under SLAs: release management, user support, and the backlog worked steadily. Or a clean handover to your admins.',
  },
];

const FACTS = [
  {
    label: 'Partnership',
    line: 'Salesforce consulting partner with an Agentforce practice. We implement what we recommend.',
  },
  {
    label: 'Integration',
    line: 'Most of our Salesforce work is integration. ERP, warehouse, and CRM connected through MuleSoft, Platform Events, and APIs.',
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
    question: 'Do you work with our existing Salesforce org or rebuild it?',
    answer:
      'We work with the org you have. Most engagements start with an org audit: what is customized, what is dead, and what is blocking the roadmap. A rebuild only makes sense when years of technical debt cost more to untangle than to replace, and we will show you that math before recommending it.',
  },
  {
    question: 'How long does a Salesforce implementation take?',
    answer:
      'A focused Sales Cloud or Service Cloud rollout typically lands in 10 to 16 weeks. Multi-cloud programs with Data Cloud and heavy integration run longer and ship in phases, so sales teams are working in the system while later phases build. Scope discipline, not headcount, is what keeps the timeline honest.',
  },
  {
    question: 'What is Agentforce and do we need Data Cloud to use it?',
    answer:
      'Agentforce is Salesforce’s platform for AI agents that take actions in your CRM: qualifying leads, resolving cases, drafting follow-ups. The agents are only as good as the data they read, which is why Data Cloud matters; it gives them one resolved customer record instead of six conflicting ones. We implement both together.',
  },
  {
    question: 'Can you integrate Salesforce with our ERP and data warehouse?',
    answer:
      'Yes, that is most of our Salesforce work. We build integrations through MuleSoft, REST and SOAP APIs, Platform Events, and CDC, depending on latency and volume. Orders, invoices, and inventory stay in the ERP; Salesforce gets a live view instead of a stale copy.',
  },
  {
    question: 'Who runs Salesforce after go-live?',
    answer:
      'Your admins, if you have them; our managed services team, if you do not. We handle release management for the three Salesforce releases a year, user support, and ongoing configuration under an SLA. Either way, we train your team so knowledge does not walk out with the project.',
  },
];

/* --------------------------------- page ---------------------------------- */

export default function SalesforcePage() {
  return (
    <div className={`bg-white text-black ${v4Sans}`}>
      <ServiceSchema
        name="Salesforce Implementation Services"
        description="Salesforce consulting partner. Sales Cloud, Service Cloud, Marketing Cloud, Data Cloud, and Agentforce implementation and integration."
        url="/platforms/salesforce"
        serviceType="Salesforce Consulting"
      />
      {/* FAQPage JSON-LD comes from PageFaq below. One per page. */}
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: '/' },
          { name: 'Platforms', url: '/platforms' },
          { name: 'Salesforce', url: '/platforms/salesforce' },
        ]}
      />

      <ServiceHero
        kicker="Salesforce"
        title={
          <>
            Salesforce that runs on{' '}
            <span style={{ color: '#1D4ED8' }}>one&nbsp;record</span>
          </>
        }
        lede="ACI Infotech is a Salesforce consulting partner with an Agentforce practice. We implement Sales Cloud, Service Cloud, Marketing Cloud, and Data Cloud working from one customer record, wire the org to your ERP and warehouse through MuleSoft or APIs, and put Agentforce agents to work on data they can actually trust."
        chips={[
          'Salesforce consulting partner',
          'Agentforce practice',
          'Certified across the clouds',
          'ISO 27001',
        ]}
        primary={{ label: 'Book a Salesforce org audit', href: '/contact?platform=salesforce&source=hero' }}
        secondary={{ label: 'See the case studies', href: '/case-studies' }}
        visual={<FlowScene config={FLOWS['platform-salesforce']} />}
      />

      {/* Problem band: the org is fine, the record is not */}
      <FoldcraftHero
        geistClass={v4Geist}
        image="/images/v4/case-retail.jpg"
        pill="Fix the record first"
        headline={
          <>
            Make the record true.{' '}
            <br className="hidden sm:block" />
            <span className="text-[#60A5FA]">Then put AI on&nbsp;it.</span>
          </>
        }
        body="Clean fields with owners, documented integrations, reports the team trusts. Fix the record first and everything on top compounds: Sales Cloud sells, Service Cloud resolves, and Agentforce inherits a customer worth knowing."
        story={{
          metric: { value: '2.5x', label: 'Email engagement' },
          title:
            'Customer data unified across 600+ retail locations, with email engagement up 2.5x and promotions working 15% harder.',
          href: '/case-studies/databricks-modernization-ai-enablement-for-leading-c-store-chain',
          logoSrc: '/brand/salesforce-color.png',
          logoAlt: 'Salesforce',
        }}
      />

      {/* Offerings */}
      <section className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <SectionHead
            kicker="What we do on Salesforce"
            title={
              <>
                One customer record. <span style={{ color: '#1D4ED8' }}>Six&nbsp;disciplines.</span>
              </>
            }
          />
          <OfferingList items={OFFERINGS} />
        </div>
      </section>

      {/* Honest fit panel */}
      <DecisionPanel
        title={<>Is Salesforce the right&nbsp;call?</>}
        body="Usually, when you want one platform to carry sales, service, and marketing, and admins rather than engineers to run the roadmap. When your team wants to compose best-of-breed tools on a warehouse instead, that is a real architecture too, and we build it. The recommendation follows your operating model, not our certification wall."
        colA={{ src: '/brand/salesforce-color.png', alt: 'Salesforce', px: 48 }}
        colB={{ label: 'A composable stack' }}
        rows={DECISION_ROWS}
        footnote="When the composable column wins, the answer is usually a warehouse-native customer stack with a tool like Braze on top. That comparison lives on our MarTech and CDP page."
      />

      {/* Proof */}
      <section className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <SectionHead
            kicker="Results"
            title={
              <>
                Customer data that <span style={{ color: '#1D4ED8' }}>went to&nbsp;work.</span>
              </>
            }
          />
          <CmsProofCards
            technology="Salesforce"
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

      {/* Bridge to the MarTech and CDP practice */}
      <BridgeBand
        title={<>The CRM is half the&nbsp;story.</>}
        body="Salesforce pays off when the customer data underneath it is resolved, governed, and activated across every channel. That is our MarTech and CDP practice, and Data Cloud is one of its home fields."
        link={{ label: 'MarTech & CDP', href: '/services/martech-cdp' }}
      />

      {/* Why us */}
      <section className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <SectionHead kicker="Why ACI" title={<>Why enterprises run Salesforce with&nbsp;us</>} />
          <FactsRow facts={FACTS} />
        </div>
      </section>

      <ClusterPosts keywords={['salesforce', 'crm', 'agentforce', 'data cloud', 'cdp']} />

      <RelatedLinks items={salesforceRelated} />

      <PageFaq
        kicker="Salesforce FAQ"
        title={
          <>
            Salesforce questions,
            <br />
            answered straight.
          </>
        }
        faqs={FAQS}
      />

      <CtaSection label="Let's talk Salesforce" href="/contact?platform=salesforce&source=cta-section" />
    </div>
  );
}
