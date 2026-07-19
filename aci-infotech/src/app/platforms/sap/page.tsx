import { Metadata } from 'next';
import RelatedLinks from '@/components/seo/RelatedLinks';
import { sapRelated } from '@/content/related-links';
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
  alternates: { canonical: `${siteUrl}/platforms/sap` },
  title: 'SAP Implementation Services',
  description:
    'ACI Infotech is an SAP Partner. S/4HANA implementation, migration, integration, and managed services for enterprise.',
  openGraph: {
    title: 'SAP Implementation Services | ACI Infotech',
    description:
      'ACI Infotech is an SAP Partner. S/4HANA implementation, migration, integration, and managed services for enterprise.',
    url: `${siteUrl}/platforms/sap`,
    siteName: 'ACI Infotech',
    type: 'website',
    images: DEFAULT_OG_IMAGES,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SAP Implementation Services | ACI Infotech',
    description:
      'ACI Infotech is an SAP Partner. S/4HANA implementation, migration, integration, and managed services for enterprise.',
    images: DEFAULT_TWITTER_IMAGES,
  },
};

/* ------------------------------- page data ------------------------------- */

const OFFERINGS = [
  {
    title: 'S/4HANA implementation',
    body: 'Greenfield when the process debt is worth clearing, fit-to-standard where the standard is good enough, and straight advice about which is which before the program gets priced. SAP Activate keeps the build on rails.',
    chips: ['SAP S/4HANA', 'SAP Activate', 'Fit-to-standard', 'Greenfield'],
  },
  {
    title: 'ECC to S/4HANA conversion',
    body: 'System conversion that keeps your history and the processes that are sound. Custom code gets inventoried, dead objects retired, the rest remediated. Most clients find a third of their custom code can simply go.',
    chips: ['System conversion', 'Custom code remediation', 'Selective data transition', 'Parallel runs'],
  },
  {
    title: 'Integration on BTP',
    body: 'New extensions go on SAP BTP instead of into the core, so future upgrades stop being projects of their own. APIs, events, and CDC keep the rest of the estate in sync in real time.',
    chips: ['SAP BTP', 'API management', 'Event Mesh', 'CDC'],
  },
  {
    title: 'SAP analytics',
    body: 'SAP Analytics Cloud for planning and reporting, embedded analytics where the work happens, and group reporting that consolidates the close instead of exporting it to spreadsheets.',
    chips: ['SAP Analytics Cloud', 'Embedded analytics', 'Planning', 'Group reporting'],
  },
  {
    title: 'SAP on cloud',
    body: 'S/4HANA on AWS, Azure, or Google Cloud, directly or through RISE with SAP, with HA and DR sized to your recovery objectives. The cloud choice follows where the rest of your estate already lives.',
    chips: ['RISE with SAP', 'AWS', 'Azure', 'GCP'],
  },
  {
    title: 'Managed SAP operations',
    body: 'Basis administration, performance monitoring, security patching, and upgrade management under SLAs, around the clock. Go-live is the start of the run phase, not the end of the engagement.',
    chips: ['Basis administration', 'Monitoring', 'Security patching', 'Upgrade management'],
  },
];

const DECISION_ROWS = [
  { need: 'A finance close that needs one version of the truth', pick: 'a' as const },
  { need: 'Process debt worth clearing with fit-to-standard', pick: 'a' as const },
  { need: 'New builds landing on BTP, not in the core', pick: 'a' as const },
  { need: 'Real-time reporting on live transactions', pick: 'a' as const },
  { need: 'A stable ECC core and bigger fires elsewhere', pick: 'b' as const },
  { need: 'Acquisitions still reshaping the org chart', pick: 'b' as const },
];

const PROOF_FALLBACK = [
  {
    eyebrow: 'Fortune 500 Financial Services Firm',
    metric: '40+',
    metricLabel: 'Finance systems consolidated',
    summary:
      'Finance reporting consolidated from 40+ systems onto one S/4HANA core, without disrupting the close along the way.',
    href: '/case-studies/modernizes-finance-reporting-with-sap-transformation',
    linkLabel: 'Read the SAP story',
    image: '/images/v4/case-finance.jpg',
  },
  {
    eyebrow: 'Global Food Services Operator',
    metric: '22%',
    metricLabel: 'Faster decisions',
    summary:
      'One data platform for operations in 53 countries, replacing dozens of regional reporting stacks.',
    href: '/case-studies/global-food-facilities-data-intelligence',
    linkLabel: 'Read the story',
    image: '/images/v4/case-retail.jpg',
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
    body: 'Custom code inventory, data volumes, and interface count sized before anyone commits to a date. Greenfield or brownfield gets decided here, on evidence.',
  },
  {
    title: 'Design',
    body: 'Target processes, the BTP extension plan, and the data migration approach agreed. The fit-to-standard debates happen here, once.',
  },
  {
    title: 'Build',
    body: 'Conversion or build in staged increments, with test cycles on real data. A single-instance conversion typically runs 9 to 18 months end to end.',
  },
  {
    title: 'Rehearse',
    body: 'Full dress rehearsals of the cutover, timed, until the downtime window is a measurement instead of an estimate.',
  },
  {
    title: 'Run',
    body: 'Basis, monitoring, patching, and upgrades under SLAs with our managed team, or a structured handover to yours, runbooks included.',
  },
];

const FACTS = [
  {
    label: 'Delivery',
    line: 'S/4HANA programs delivered greenfield and by conversion. That includes consolidating finance reporting for a Fortune 500 financial services firm.',
  },
  {
    label: 'Method',
    line: 'SAP Activate with parallel runs and rehearsed cutovers. Go-live is a milestone, not a gamble.',
  },
  {
    label: 'Scale',
    line: 'Founded 2006. 1,200+ engineers across 11 global delivery hubs. 500+ enterprise projects.',
  },
  {
    label: 'Operations',
    line: 'ISO 27001 certified and CMMI Level 3 appraised, with 24/7 Basis operations under SLAs.',
  },
];

const FAQS = [
  {
    question: 'How long does an ECC to S/4HANA move take?',
    answer:
      'A system conversion for a single-instance ECC typically runs 9 to 18 months, depending on how much custom code and historical data comes along. Greenfield programs that redesign processes take longer and ship in phases. The honest answer comes out of the assessment, which sizes your custom code, data volumes, and interfaces before anyone commits to a date.',
  },
  {
    question: 'Greenfield or brownfield: which S/4HANA path is right for us?',
    answer:
      'Brownfield conversion keeps your processes and history, so it is faster and cheaper when your ECC processes are basically sound. Greenfield is a reset: fit-to-standard processes and clean data, at the cost of a bigger change program. Selective data transition sits between the two. We recommend based on how much process debt you are actually carrying.',
  },
  {
    question: 'What happens to our ECC customizations in S/4HANA?',
    answer:
      'We inventory every custom object, drop the ones nobody has run in years, and remediate the rest for S/4HANA. New extensions go on SAP BTP instead of into the core, which keeps future upgrades from becoming projects of their own. Most clients find a third of their custom code can simply be retired.',
  },
  {
    question: 'Can SAP run on AWS, Azure, or Google Cloud?',
    answer:
      'Yes. We deploy S/4HANA on all three hyperscalers, directly or through RISE with SAP, with HA/DR architecture sized for your recovery objectives. The cloud choice usually follows where the rest of your estate already lives.',
  },
  {
    question: 'Do you support the SAP estate after go-live?',
    answer:
      'Yes. Our managed services team runs Basis administration, performance monitoring, security patching, and upgrade management under an SLA. Go-live is the start of the run phase, not the end of the engagement.',
  },
];

/* --------------------------------- page ---------------------------------- */

export default function SAPPage() {
  return (
    <div className={`bg-white text-black ${v4Sans}`}>
      <ServiceSchema
        name="SAP Implementation Services"
        description="SAP consulting and delivery. S/4HANA implementation, ECC conversion, BTP integration, analytics, and managed Basis operations."
        url="/platforms/sap"
        serviceType="SAP Consulting"
      />
      {/* FAQPage JSON-LD comes from PageFaq below. One per page. */}
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: '/' },
          { name: 'Platforms', url: '/platforms' },
          { name: 'SAP', url: '/platforms/sap' },
        ]}
      />

      <ServiceHero
        kicker="SAP"
        title={
          <>
            SAP that makes it to&nbsp;
            <span style={{ color: '#1D4ED8' }}>S/4HANA</span>
          </>
        }
        lede="We move enterprises from ECC to S/4HANA, greenfield or system conversion, using SAP Activate and selective data transition. Custom code gets inventoried and mostly retired, new extensions land on BTP, and the cutover is rehearsed until it is boring. After go-live we run Basis and the estate under SLAs."
        chips={[
          'S/4HANA conversions and greenfield',
          'SAP Activate delivery',
          '24/7 Basis operations',
          'ISO 27001',
        ]}
        primary={{ label: 'Book an S/4HANA assessment', href: '/contact?platform=sap&source=hero' }}
        secondary={{ label: 'See the case studies', href: '/case-studies' }}
        visual={<FlowScene config={FLOWS['platform-sap']} />}
      />

      {/* Problem band: the ECC clock is not yours */}
      <FoldcraftHero
        geistClass={v4Geist}
        image="/images/v4/case-manufacturing.jpg"
        pill="S/4HANA on your terms"
        headline={
          <>
            Move to S/4HANA{' '}
            <br className="hidden sm:block" />
            <span className="text-[#60A5FA]">on your own&nbsp;schedule.</span>
          </>
        }
        body="A clean core, interfaces mapped, custom code retired on evidence. Plan the move early and the deadline becomes a milestone you chose: the close gets faster, the estate gets simpler, and the business keeps running through every wave."
        story={{
          metric: { value: '40+', label: 'Finance systems consolidated' },
          title:
            'A Fortune 500 financial services firm consolidated finance reporting from 40+ systems onto one S/4HANA core.',
          href: '/case-studies/modernizes-finance-reporting-with-sap-transformation',
          logoSrc: '/brand/sap-color.svg',
          logoAlt: 'SAP',
        }}
      />

      {/* Offerings */}
      <section className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <SectionHead
            kicker="What we do on SAP"
            title={
              <>
                One clean core. <span style={{ color: '#1D4ED8' }}>Six disciplines.</span>
              </>
            }
          />
          <OfferingList items={OFFERINGS} />
        </div>
      </section>

      {/* Honest fit panel */}
      <DecisionPanel
        title={<>Move to S/4HANA now, or&nbsp;wait?</>}
        body="The move is coming either way. The timing is the real decision. S/4HANA earns it when the close, the reporting, and the process debt are costing you today. Waiting can be right too, when ECC is stable and the bigger fire is somewhere else. Either way, the answer should come from an assessment of your code, data, and interfaces, not from a license renewal date."
        colA={{ src: '/brand/sap-color.svg', alt: 'SAP', px: 40 }}
        colB={{ label: 'Keep ECC longer' }}
        rows={DECISION_ROWS}
        footnote="Waiting is a legitimate strategy, but it needs a date attached. The assessment sizes your custom code, data volumes, and interfaces so the wait is a decision, not a drift."
      />

      {/* Proof */}
      <section className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <SectionHead
            kicker="Results"
            title={
              <>
                Transformations that <span style={{ color: '#1D4ED8' }}>closed the&nbsp;books.</span>
              </>
            }
          />
          <CmsProofCards technology="SAP" fallback={PROOF_FALLBACK} />
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
        title={<>The ERP is the spine, not the&nbsp;strategy.</>}
        body="S/4HANA pays off when the processes, data, and operating model around it move too. That is our digital transformation practice, and the ERP core is where it usually starts."
        link={{ label: 'Digital Transformation', href: '/services/digital-transformation' }}
      />

      {/* Why us */}
      <section className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <SectionHead kicker="Why ACI" title={<>Why enterprises run SAP with&nbsp;us</>} />
          <FactsRow facts={FACTS} />
        </div>
      </section>

      <ClusterPosts keywords={['sap', 's/4hana', 'erp', 'ecc']} />

      <RelatedLinks items={sapRelated} />

      <PageFaq
        kicker="SAP FAQ"
        title={
          <>
            S/4HANA questions,
            <br />
            answered straight.
          </>
        }
        faqs={FAQS}
      />

      <CtaSection label="Let's talk S/4HANA" href="/contact?platform=sap&source=cta-section" />
    </div>
  );
}
