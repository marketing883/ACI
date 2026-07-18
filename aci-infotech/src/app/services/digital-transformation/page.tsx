import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import RelatedLinks from '@/components/seo/RelatedLinks';
import { digitalTransformationRelated } from '@/content/related-links';
import ClusterPosts from '@/components/seo/ClusterPosts';
import { ServiceSchema, BreadcrumbSchema } from '@/components/seo/StructuredData';
import { displayClient } from '@/lib/content/anonymize';
import { DEFAULT_OG_IMAGES, DEFAULT_TWITTER_IMAGES } from '@/lib/seo/og';
import { getSiteUrl } from '@/lib/site-url';
import FoldcraftHero from '@/components/v4/hero/FoldcraftHero';
import CtaSection from '@/components/v4/hero/CtaSection';
import { v4Sans, v4Geist, v4Display } from '@/components/v4/fonts';
import {
  SectionHead,
  ServiceHero,
  OfferingList,
  ProofCards,
  ProcessStrip,
  BridgeBand,
  FactsRow,
  PageFaq,
  cardShadow,
} from '@/components/v4/page/kit';
import FlowScene from '@/components/v4/page/FlowScene';
import { FLOWS } from '@/components/v4/page/flow-configs';

export const revalidate = 3600;

// Canonical origin: always production, so staging builds can never
// self-canonicalize (see src/lib/site-url.ts).
const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  title: 'Digital Transformation Services',
  description: 'Intelligent process automation. ServiceNow workflows, RPA, document processing. Automate what humans shouldn\'t do manually. 20% reduction in manual processes.',
  keywords: 'digital transformation, RPA, ServiceNow, process automation, intelligent automation, enterprise automation',
  alternates: {
    canonical: `${siteUrl}/services/digital-transformation`,
  },
  // Per-page social card. Without this, every share and link preview
  // inherited the homepage's OpenGraph (title, image, and og:url all
  // pointing at /), mis-attributing all 21 service/platform pages.
  openGraph: {
    title: 'Digital Transformation Services | ACI Infotech',
    description: 'Intelligent process automation. ServiceNow workflows, RPA, document processing. Automate what humans shouldn\'t do manually. 20% reduction in manual processes.',
    url: `${siteUrl}/services/digital-transformation`,
    siteName: 'ACI Infotech',
    type: 'website',
    images: DEFAULT_OG_IMAGES,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Digital Transformation Services | ACI Infotech',
    description: 'Intelligent process automation. ServiceNow workflows, RPA, document processing. Automate what humans shouldn\'t do manually. 20% reduction in manual processes.',
    images: DEFAULT_TWITTER_IMAGES,
  },
};

/* ------------------------------- page copy ------------------------------- */

const OFFERINGS = [
  {
    title: 'Process discovery and mining',
    body: 'Celonis and UiPath Process Mining on your event logs, plus time spent with the people who actually do the work. We find where the hours go before anyone writes a bot. Automating a bad process just makes the mess faster.',
    chips: ['Celonis', 'UiPath Process Mining', 'Power BI'],
  },
  {
    title: 'ServiceNow workflows',
    body: 'ITSM, HRSD, and Customer Service Management built so requests stop dying in shared inboxes. Every ticket gets an owner, a visible status, and an SLA someone answers for.',
    chips: ['ServiceNow', 'ITSM', 'HRSD', 'CSM'],
  },
  {
    title: 'Robotic process automation',
    body: 'UiPath, Power Automate, and Automation Anywhere bots for the systems that will never get an API. Attended or unattended, monitored in production, and rebuilt fast when a screen changes. Screens change.',
    chips: ['UiPath', 'Power Automate', 'Automation Anywhere'],
  },
  {
    title: 'Document AI',
    body: 'Classification and extraction for invoices, claims, and contracts, with a human review queue for the exceptions. Straight-through processing for the clean documents, eyeballs on the rest.',
    chips: ['Azure Document AI', 'AWS Textract', 'Google Document AI'],
  },
  {
    title: 'Workflow automation',
    body: 'Approvals, escalations, and compliance steps orchestrated end to end in Power Platform or Camunda. The process gets a visible state, which means no more status meetings held just to find a request.',
    chips: ['Power Platform', 'Camunda', 'Nintex'],
  },
  {
    title: 'Integration and APIs',
    body: 'MuleSoft, Workato, and Azure Logic Apps connecting the systems that should have been talking all along. When systems integrate properly, half the bots become unnecessary. We count that as a win.',
    chips: ['MuleSoft', 'Workato', 'Azure Logic Apps'],
  },
];

// Decision artifact: three routes instead of the kit's two-logo table,
// so this is an inline variant of DecisionPanel.
const ROUTES: {
  label: string;
  body: string;
  chips: string;
  link?: { label: string; href: string };
}[] = [
  {
    label: 'Automate with RPA',
    body: 'For stable UIs and legacy systems that will never get an API. Bots ship in weeks and take the keying work off people, with the honest caveat that a changed screen means a changed bot.',
    chips: 'UiPath · Power Automate · Automation Anywhere',
  },
  {
    label: 'Integrate the workflow',
    body: 'When the systems can talk, let them. APIs, events, and ServiceNow workflows give you straight-through processing that does not care what the UI looks like this quarter.',
    chips: 'ServiceNow · MuleSoft · Azure Logic Apps',
  },
  {
    label: 'Rebuild the application',
    body: 'When the process is the product, automation is a patch. The spreadsheet-and-email system deserves to be an actual system. That is an application development job, and we do those too.',
    chips: 'Custom builds · APIs · Modern platforms',
    link: { label: 'App Development', href: '/services/app-development' },
  },
];

const PROOF = [
  {
    client_descriptor: 'Fortune 500 Financial Services Firm',
    metric: '0.1%',
    metricLabel: 'Error rate after automation',
    summary: 'Accounts payable rebuilt with UiPath and Azure Document AI. Processing time fell 35%, and exceptions route to a human review queue instead of a backlog.',
    href: '/case-studies',
    linkLabel: 'Explore the case studies',
  },
  {
    client_descriptor: 'Global Technology Enterprise',
    metric: '67%',
    metricLabel: 'Reduction in contract cycle time',
    summary: 'Contract creation, review, approval, compliance, and renewal automated end to end in a governed Conga CLM environment.',
    href: '/case-studies/accelerating-contract-performance-through-intelligent-automation',
    linkLabel: 'Read the automation story',
  },
  {
    client_descriptor: 'Enterprise Technology Company',
    metric: '99.97%',
    metricLabel: 'Uptime across 72+ servers',
    summary: 'Automated CI/CD, monitoring, load balancing, and centralized logging keep releases moving without disrupting operations.',
    href: '/case-studies/optimizing-enterprise-it-operations-with-automated-devops-and-monitoring',
    linkLabel: 'Read the DevOps story',
  },
];

const PROCESS = [
  {
    title: 'Discover',
    timeframe: 'Weeks 1 to 3',
    body: 'Process mining on the event logs, plus time with the people doing the work. The map shows where the hours actually go.',
  },
  {
    title: 'Prioritize',
    timeframe: 'Weeks 3 to 4',
    body: 'Value against effort, process by process. Each automation gets a business case and a baseline to beat.',
  },
  {
    title: 'Build',
    timeframe: 'Weeks 4 to 8',
    body: 'First bots and workflows into production. A first automation ships in 4 to 8 weeks, not next fiscal year.',
  },
  {
    title: 'Prove',
    body: 'Hours saved, error rates, and cycle times measured against the baseline. Adoption gets tracked, not assumed.',
  },
  {
    title: 'Scale',
    body: 'Governance, a pipeline of candidates, and change management. Enterprise-wide programs run 6 to 12 months.',
  },
];

const FACTS = [
  {
    label: 'Delivery',
    line: 'The engineers who map your processes build the automations. Discovery is not a separate sales exercise.',
  },
  {
    label: 'Partnerships',
    line: 'ServiceNow partner and UiPath certified, with delivery across Power Automate and Automation Anywhere.',
  },
  {
    label: 'Measurement',
    line: 'Hours saved, error rates, and cycle times tracked per project, before and after. If a number did not move, we say so.',
  },
  {
    label: 'Scale',
    line: 'Founded 2006. 1,200+ engineers across 11 global delivery hubs. 500+ enterprise projects.',
  },
];

const FAQS = [
  {
    question: 'What does digital transformation actually involve?',
    answer: 'Less than the conference talks suggest. We find the manual work, decide whether to automate it, integrate around it, or rebuild the system underneath it, then ship the fix with monitoring and a measured baseline. Digital transformation is a sequence of engineered process fixes, not a culture program.',
  },
  {
    question: 'Where should we start with automation?',
    answer: 'Process discovery. We identify high-volume, repetitive processes with a clear payback before anything gets built. Typical quick wins: accounts payable, employee onboarding, report generation.',
  },
  {
    question: 'How long does an RPA implementation take?',
    answer: '4 to 8 weeks for a first bot in production. Enterprise-wide programs run 6 to 12 months. We recommend starting small, proving the numbers, then scaling.',
  },
  {
    question: 'Will the bots break when a system updates?',
    answer: 'Sometimes, yes. RPA reads screens, and screens change. We monitor every bot in production, catch failures fast, and push API-based integration wherever one exists, so there are fewer bots around to break.',
  },
  {
    question: 'What about change management?',
    answer: 'Automation changes how people work, so every project includes communication, training, and support. A bot nobody trusts gets worked around, which is worse than no bot at all.',
  },
  {
    question: 'How do you measure automation ROI?',
    answer: 'Hours saved, error rates reduced, and cycle times improved, all measured against a baseline we capture before building. Every project carries a business case we keep tracking after go-live, not just in the proposal.',
  },
  {
    question: 'Do you run the automations after go-live?',
    answer: 'Both options. Our managed operations team monitors and maintains bots and workflows 24/7 under SLA, or we hand over to your team with runbooks and stay on call through the transition.',
  },
];

/* --------------------------------- page ---------------------------------- */

export default function DigitalTransformationPage() {
  return (
    <div className={`bg-white text-black ${v4Sans}`}>
      <ServiceSchema
        name="Digital Transformation Services"
        description="Intelligent process automation. ServiceNow workflows, RPA, document processing. Automate what humans shouldn't do manually."
        url="/services/digital-transformation"
        serviceType="Digital Transformation Consulting"
      />
      {/* FAQPage JSON-LD comes from PageFaq below — one per page. */}
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: '/' },
          { name: 'Services', url: '/services' },
          { name: 'Digital Transformation', url: '/services/digital-transformation' },
        ]}
      />

      <ServiceHero
        kicker="Digital Transformation"
        title={
          <>
            Digital Transformation Through{' '}
            <span style={{ color: '#1D4ED8' }}>Intelligent&nbsp;Automation</span>
          </>
        }
        lede="ACI Infotech delivers digital transformation as an engineering job: ServiceNow workflows, UiPath bots, and document AI that take the swivel-chair work off your teams. We map the process first, automate what repeats, keep people on the judgment calls, and report hours saved, error rates, and cycle times every month."
        chips={[
          'ServiceNow partner',
          'UiPath certified',
          'Process discovery first',
          'Human in the loop',
        ]}
        primary={{ label: 'Talk to an automation engineer', href: '/contact' }}
        secondary={{ label: 'See the case studies', href: '/case-studies' }}
        visual={<FlowScene config={FLOWS['digital-transformation']} />}
      />

      {/* Problem band: the manual work nobody puts on the org chart */}
      <FoldcraftHero
        geistClass={v4Geist}
        pill="Why processes stay manual"
        headline={
          <>
            Your processes run on <span className="text-[#60A5FA]">swivel-chair work</span>{' '}
            <br className="hidden sm:block" />
            and quiet spreadsheets.
          </>
        }
        body="Somebody copies numbers from one system into another all day. Somebody else keeps the real process in a spreadsheet the auditors have never seen. Every handoff adds a day and a chance to fat-finger an account number. Transformation is not a slide deck about culture. It is finding that work, measuring it, and engineering it away."
        story={{
          metric: { value: '67%', label: 'Reduction in contract cycle time' },
          title: 'Contract operations automated end to end',
          org: 'A global technology enterprise',
          href: '/case-studies/accelerating-contract-performance-through-intelligent-automation',
          logoSrc: '/brand/aci-infotech-logo-white.png',
          logoAlt: 'ACI Infotech',
        }}
      />

      {/* What we build. This H2 keeps "digital transformation" on the page
          in a heading, per the SEO cluster work. */}
      <section className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <SectionHead
            kicker="What we build"
            title={
              <>
                Digital transformation, one automated{' '}
                <span style={{ color: '#1D4ED8' }}>process at a&nbsp;time.</span>
              </>
            }
          />
          <OfferingList items={OFFERINGS} />
        </div>
      </section>

      {/* Decision block: automate, integrate, or rebuild */}
      <section className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <h2
            className={`text-3xl font-bold tracking-tight text-black sm:text-4xl lg:text-[44px] ${v4Display}`}
            style={{ lineHeight: 1.08 }}
          >
            Automate, integrate, or rebuild?
          </h2>
          <p className="mt-5 max-w-3xl text-base leading-relaxed text-gray-600 md:text-lg">
            Not every manual process deserves a bot. The right fix depends on what sits underneath
            the process, and picking wrong is how companies end up with a bot farm nobody trusts.
          </p>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {ROUTES.map((route, i) => (
              <div key={route.label} className={`flex flex-col rounded-2xl bg-white p-7 ${cardShadow}`}>
                <div className="flex items-center gap-3">
                  <span className={`text-sm font-bold text-[#1D4ED8] ${v4Display}`}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span aria-hidden="true" className="h-px flex-1 bg-gray-200" />
                </div>
                <h3 className={`mt-5 text-xl font-semibold text-black ${v4Display}`}>{route.label}</h3>
                <p className="mt-2 text-xs font-medium uppercase tracking-wide text-gray-400">{route.chips}</p>
                <p className="mt-4 flex-1 text-[15px] leading-relaxed text-gray-600">{route.body}</p>
                {route.link ? (
                  <Link
                    href={route.link.href}
                    className="group mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-700"
                  >
                    <span className="relative">
                      {route.link.label}
                      <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-current transition-transform duration-300 ease-out group-hover:scale-x-100" />
                    </span>
                    <ArrowUpRight
                      size={15}
                      aria-hidden="true"
                      className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </Link>
                ) : null}
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
                Measured in hours, errors, <span style={{ color: '#1D4ED8' }}>and cycle&nbsp;time.</span>
              </>
            }
          />
          <ProofCards
            cards={PROOF.map((p) => ({
              eyebrow: displayClient(p),
              metric: p.metric,
              metricLabel: p.metricLabel,
              summary: p.summary,
              href: p.href,
              linkLabel: p.linkLabel,
            }))}
          />
        </div>
      </section>

      {/* Process */}
      <section className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <SectionHead kicker="How an engagement runs" title="Discovery first. Always." />
          <ProcessStrip steps={PROCESS} />
        </div>
      </section>

      {/* Bridge to managed operations */}
      <BridgeBand
        title="Bots need running too."
        body="An automation program earns its keep when the bots still run in year two: monitored, patched, and rebuilt when the screens change. Our managed operations team runs automations around the clock under SLA, with the same discipline we bring to data platforms."
        link={{ label: 'Managed Operations', href: '/services/managed-operations' }}
      />

      {/* Why ACI */}
      <section className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <SectionHead kicker="Why ACI" title="Why enterprises pick us for automation" />
          <FactsRow facts={FACTS} />
        </div>
      </section>

      <PageFaq
        kicker="Questions"
        title={
          <>
            Automation questions,
            <br />
            <span style={{ color: '#1D4ED8' }}>answered straight.</span>
          </>
        }
        sub="The questions we hear most before an automation engagement. Anything else belongs in a conversation."
        faqs={FAQS}
      />

      <ClusterPosts keywords={['digital transformation', 'automation', 'rpa', 'servicenow', 'process']} />

      <RelatedLinks items={digitalTransformationRelated} />

      {/* Closing CTA: video stage, one button, nothing else */}
      <CtaSection label="Let's automate the busywork" />
    </div>
  );
}
