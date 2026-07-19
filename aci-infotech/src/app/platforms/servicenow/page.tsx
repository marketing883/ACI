import { Metadata } from 'next';
import RelatedLinks from '@/components/seo/RelatedLinks';
import { servicenowRelated } from '@/content/related-links';
import ClusterPosts from '@/components/seo/ClusterPosts';
import { servicenowFaqs } from '@/content/pillar-faqs';
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
  alternates: { canonical: `${siteUrl}/platforms/servicenow` },
  title: 'ServiceNow Implementation Services',
  description:
    'ACI Infotech is a ServiceNow partner. ITSM, ITOM, HR Service Delivery, and workflow automation implementation and optimization.',
  openGraph: {
    title: 'ServiceNow Implementation Services | ACI Infotech',
    description:
      'ACI Infotech is a ServiceNow partner. ITSM, ITOM, HR Service Delivery, and workflow automation implementation and optimization.',
    url: `${siteUrl}/platforms/servicenow`,
    siteName: 'ACI Infotech',
    type: 'website',
    images: DEFAULT_OG_IMAGES,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ServiceNow Implementation Services | ACI Infotech',
    description:
      'ACI Infotech is a ServiceNow partner. ITSM, ITOM, HR Service Delivery, and workflow automation implementation and optimization.',
    images: DEFAULT_TWITTER_IMAGES,
  },
};

/* ------------------------------- page data ------------------------------- */

const OFFERINGS = [
  {
    title: 'ITSM implementation',
    body: 'Incident, problem, change, and a service catalog people actually order from. We design the process with the teams who live in the queue, then configure the platform to match. Configure first, customize only where it earns its keep.',
    chips: ['ITSM', 'Service catalog', 'Change management', 'Virtual Agent'],
  },
  {
    title: 'CMDB and Discovery',
    body: 'An auto-populated CMDB with no owner rots within a quarter. We set discovery schedules, reconciliation rules, and named owners, so impact analysis becomes a lookup instead of a meeting.',
    chips: ['CMDB', 'Discovery', 'Service Mapping'],
  },
  {
    title: 'ITOM and event management',
    body: 'Event management wired to the monitoring you already run, not a parallel universe of alerts. Noise gets correlated away, and what remains routes to the team that owns the service.',
    chips: ['ITOM', 'Event Management', 'Dynatrace', 'Splunk'],
  },
  {
    title: 'HR Service Delivery',
    body: 'Employee center, case management, and onboarding flows that spare HR the shared inbox. The same workflow discipline as ITSM, pointed at the employee side of the house.',
    chips: ['HRSD', 'Employee Center', 'Case management', 'Onboarding'],
  },
  {
    title: 'App Engine and Integration Hub',
    body: 'Custom apps on App Engine where the standard process does not fit how you work, and Integration Hub spokes instead of one-off scripts. Low code where it helps, real engineering where it counts.',
    chips: ['App Engine', 'Flow Designer', 'Integration Hub'],
  },
  {
    title: 'Managed ServiceNow operations',
    body: 'ServiceNow ships two major releases a year, ready or not. We keep instances current, patched, and close to standard under an SLA, so upgrade weekend stays boring.',
    chips: ['Upgrade management', '24/7 support', 'SLAs', 'Platform admin'],
  },
];

const DECISION_ROWS = [
  { need: 'One system of record for incidents, changes, and requests', pick: 'a' as const },
  { need: 'Workflows that cross IT, HR, and facilities', pick: 'a' as const },
  { need: 'A CMDB driving change and impact analysis', pick: 'a' as const },
  { need: 'Approvals and audit trails a regulator will read', pick: 'a' as const },
  { need: 'A ticket queue for a single team', pick: 'b' as const },
  { need: 'A helpdesk for a company of fifty', pick: 'b' as const },
];

const PROOF_FALLBACK = [
  {
    eyebrow: 'Enterprise Technology Company',
    metric: '99.97%',
    metricLabel: 'Uptime across 72+ servers',
    summary:
      'Automated DevOps and monitoring across the estate, with incidents caught and routed before users noticed them.',
    href: '/case-studies/optimizing-enterprise-it-operations-with-automated-devops-and-monitoring',
    linkLabel: 'Read the operations story',
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
    eyebrow: 'Global Technology Enterprise',
    metric: '0.1%',
    metricLabel: 'Error rate after automation',
    summary:
      'Contract lifecycle automation across a global enterprise, with manual rework engineered out of the process.',
    href: '/case-studies/accelerating-contract-performance-through-intelligent-automation',
    linkLabel: 'Read the contract story',
    image: '/images/v4/svc-ai.jpg',
  },
];

const PROCESS = [
  {
    title: 'Assess',
    body: 'Instance and process audit. Where the queue actually hurts, what the CMDB really contains, and which workflows deserve the platform.',
  },
  {
    title: 'Design',
    body: 'Process decisions first: how incident, change, and request should flow, and who owns each step. The cleaner these calls, the faster everything after.',
  },
  {
    title: 'Build',
    body: 'Configuration in sprints, kept close to standard. A focused ITSM rollout typically lands in 10 to 16 weeks, and the variable is process, not configuration.',
  },
  {
    title: 'Adopt',
    body: 'Go live team by team, with training and a feedback loop. Adoption gets measured in the platform, not asserted in a deck.',
  },
  {
    title: 'Run',
    body: 'Upgrades, new workflows, and run support under SLA. Staying current is a standing job, and it is one we take on.',
  },
];

const FACTS = [
  {
    label: 'Partnership',
    line: 'ServiceNow partner. Certified consultants across ITSM, ITOM, HRSD, and platform development.',
  },
  {
    label: 'Delivery',
    line: 'The consultants who design your workflows configure them. No handoff between the process workshop and the build.',
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

const FAQS = servicenowFaqs.map((f) => ({ question: f.q, answer: f.a }));

/* --------------------------------- page ---------------------------------- */

export default function ServiceNowPage() {
  return (
    <div className={`bg-white text-black ${v4Sans}`}>
      <ServiceSchema
        name="ServiceNow Implementation Services"
        description="ServiceNow partner. ITSM, ITOM, HR Service Delivery, and workflow automation implementation, optimization, and managed support."
        url="/platforms/servicenow"
        serviceType="ServiceNow Consulting"
      />
      {/* FAQPage JSON-LD comes from PageFaq below. One per page. */}
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: '/' },
          { name: 'Platforms', url: '/platforms' },
          { name: 'ServiceNow', url: '/platforms/servicenow' },
        ]}
      />

      <ServiceHero
        kicker="ServiceNow"
        title={
          <>
            ServiceNow that outlasts{' '}
            <span style={{ color: '#1D4ED8' }}>the&nbsp;go-live</span>
          </>
        }
        lede="ACI Infotech is a ServiceNow partner. We implement ITSM with a CMDB that stays accurate, wire ITOM into the monitoring you actually run, and build workflows with an owner and an SLA. Then we stay on for the upgrades, twice a year, every year."
        chips={[
          'ServiceNow partner',
          'ITSM, ITOM, HRSD',
          'Upgrade management',
          'ISO 27001',
        ]}
        primary={{ label: 'Talk to a ServiceNow consultant', href: '/contact?platform=servicenow&source=hero' }}
        secondary={{ label: 'See the case studies', href: '/case-studies' }}
        visual={<FlowScene config={FLOWS['platform-servicenow']} />}
      />

      {/* Problem band: the license was the easy part */}
      <FoldcraftHero
        geistClass={v4Geist}
        image="/images/v4/svc-ops.jpg"
        pill="Process first"
        headline={
          <>
            Design the process.{' '}
            <br className="hidden sm:block" />
            <span className="text-[#60A5FA]">Then configure the&nbsp;platform.</span>
          </>
        }
        body="Workflows shaped around the work, a CMDB the team trusts, and a rollout that earns the license. Process design comes first and configuration second. We have done both enough times to know the order matters."
        story={{
          metric: { value: '99.97%', label: 'Uptime across 72+ servers' },
          title:
            'Automated DevOps and monitoring for an enterprise technology company, with incidents caught before users felt them.',
          href: '/case-studies/optimizing-enterprise-it-operations-with-automated-devops-and-monitoring',
          logoSrc: '/images/Solution-Partners/servicenow.png',
          logoAlt: 'ServiceNow',
        }}
      />

      {/* Offerings */}
      <section className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <SectionHead
            kicker="What we do on ServiceNow"
            title={
              <>
                One platform. <span style={{ color: '#1D4ED8' }}>Six disciplines.</span>
              </>
            }
          />
          <OfferingList items={OFFERINGS} />
        </div>
      </section>

      {/* Honest fit panel */}
      <DecisionPanel
        title={<>Is ServiceNow the right&nbsp;call?</>}
        body="Usually, when work crosses teams. ServiceNow earns its licenses when incidents, changes, and requests need one system of record, with audit trails and a CMDB underneath. When the need is a queue for one team, lighter tooling wins, and we will say so before you sign anything."
        colA={{ src: '/images/Solution-Partners/servicenow.png', alt: 'ServiceNow', px: 40 }}
        colB={{ label: 'Lighter tooling' }}
        rows={DECISION_ROWS}
        footnote="When the second column wins, the honest answer is usually Jira Service Management or Zendesk. An enterprise platform with one team on it is the most expensive queue you can buy."
      />

      {/* Proof */}
      <section className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <SectionHead
            kicker="Results"
            title={
              <>
                Workflows that hold <span style={{ color: '#1D4ED8' }}>under&nbsp;load.</span>
              </>
            }
          />
          <CmsProofCards technology="ServiceNow" fallback={PROOF_FALLBACK} />
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
        title={<>Workflow is a transformation&nbsp;job.</>}
        body="ServiceNow pays off when the processes around it get redesigned, not just recorded. That is our digital transformation practice: process, integration, and change management delivered with engineering rigor."
        link={{ label: 'Digital Transformation', href: '/services/digital-transformation' }}
      />

      {/* Why us */}
      <section className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <SectionHead kicker="Why ACI" title={<>Why enterprises run ServiceNow with&nbsp;us</>} />
          <FactsRow facts={FACTS} />
        </div>
      </section>

      <ClusterPosts keywords={['servicenow', 'itsm', 'itom', 'workflow']} />

      <RelatedLinks items={servicenowRelated} />

      <PageFaq
        kicker="ServiceNow FAQ"
        title={
          <>
            ServiceNow questions,
            <br />
            answered straight.
          </>
        }
        faqs={FAQS}
      />

      <CtaSection label="Let's talk ServiceNow" href="/contact?platform=servicenow&source=cta-section" />
    </div>
  );
}
