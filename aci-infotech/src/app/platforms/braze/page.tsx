import { Metadata } from 'next';
import RelatedLinks from '@/components/seo/RelatedLinks';
import { brazeRelated } from '@/content/related-links';
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
  alternates: { canonical: `${siteUrl}/platforms/braze` },
  title: 'Braze Implementation Services',
  description:
    'ACI Infotech is a Braze Alloy Partner. Customer engagement, lifecycle marketing, and real-time personalization implementation.',
  openGraph: {
    title: 'Braze Implementation Services | ACI Infotech',
    description:
      'ACI Infotech is a Braze Alloy Partner. Customer engagement, lifecycle marketing, and real-time personalization implementation.',
    url: `${siteUrl}/platforms/braze`,
    siteName: 'ACI Infotech',
    type: 'website',
    images: DEFAULT_OG_IMAGES,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Braze Implementation Services | ACI Infotech',
    description:
      'ACI Infotech is a Braze Alloy Partner. Customer engagement, lifecycle marketing, and real-time personalization implementation.',
    images: DEFAULT_TWITTER_IMAGES,
  },
};

/* ------------------------------- page data ------------------------------- */

const OFFERINGS = [
  {
    title: 'Platform implementation',
    body: 'SDK integration, identity resolution, subscription groups, and the first live campaigns. We train your marketers as we build, so handover is not a separate phase at the end.',
    chips: ['Braze', 'SDK integration', 'Subscription groups'],
  },
  {
    title: 'Canvas journey orchestration',
    body: 'Lifecycle journeys in Canvas across email, push, SMS, and in-app, with triggers, experiments, and exit rules that respect the customer. The channel decision happens per person, not per campaign.',
    chips: ['Braze Canvas', 'Email', 'Push and SMS', 'In-app'],
  },
  {
    title: 'Data integration',
    body: 'Cloud Data Ingestion from your warehouse, the SDK streaming behavioral events, and Currents streaming engagement back out for analytics. Braze reads from the warehouse and reports back to it.',
    chips: ['Cloud Data Ingestion', 'Braze Currents', 'Snowflake', 'Databricks'],
  },
  {
    title: 'Personalization at scale',
    body: 'Liquid templating, Connected Content calling your APIs at send time, and catalogs for product and offer data. Send-time optimization where it earns its keep, simple sends where it does not.',
    chips: ['Liquid', 'Connected Content', 'Catalogs'],
  },
  {
    title: 'ESP migration',
    body: 'Templates converted, subscriber data and preferences migrated, IPs and domains warmed while both systems run in parallel. Deliverability is what breaks in rushed migrations, so we do not cut over until inbox placement holds.',
    chips: ['IP warmup', 'Template migration', 'Parallel runs'],
  },
  {
    title: 'Managed campaign operations',
    body: 'Campaign operations under a managed agreement, or your team trained with us on call for deliverability and optimization. Either way, someone owns the send calendar and answers for it.',
    chips: ['Campaign ops', 'Deliverability', 'SLAs'],
  },
];

const DECISION_ROWS = [
  { need: 'Messages triggered by live product events', pick: 'a' as const },
  { need: 'Mobile-first: push, in-app, and Content Cards', pick: 'a' as const },
  { need: 'Marketers shipping journeys without engineering tickets', pick: 'a' as const },
  { need: 'Engagement data streamed back to your warehouse', pick: 'a' as const },
  { need: 'CRM, service, and sales already on Salesforce', pick: 'b' as const },
  { need: 'Journeys driven by CRM fields more than app events', pick: 'b' as const },
];

const PROOF_FALLBACK = [
  {
    eyebrow: 'Fortune 500 Convenience Retail Chain',
    metric: '2.5x',
    metricLabel: 'Email engagement lift',
    summary:
      'A unified customer data foundation across 600+ locations feeding real-time engagement, with promotion effectiveness up 15%.',
    href: '/case-studies/databricks-modernization-ai-enablement-for-leading-c-store-chain',
    linkLabel: 'Read the retail story',
  },
  {
    eyebrow: 'Global Financial Services Firm',
    metric: '90d',
    metricLabel: 'From prototype to production',
    summary:
      'A governed data foundation stood up in 90 days, the pattern every engagement platform reads from.',
    href: '/case-studies/driving-enterprise-data-transformation-with-aci-s-azure-lakehouse',
    linkLabel: 'Read the data story',
    image: '/images/v4/case-finance.jpg',
  },
  {
    eyebrow: 'Global Food Services Operator',
    metric: '22%',
    metricLabel: 'Faster decisions',
    summary:
      'One data platform across 53 countries and 400,000 employees, replacing dozens of regional reporting stacks.',
    href: '/case-studies/global-food-facilities-data-intelligence',
    linkLabel: 'Read the story',
    image: '/images/v4/case-retail.jpg',
  },
];

const PROCESS = [
  {
    title: 'Assess',
    body: 'Stack and data audit: identity, events, consent, and what the current ESP actually sends. The gaps surface here, not mid-build.',
  },
  {
    title: 'Architect',
    body: 'Data design first: identity resolution, event taxonomy, and the warehouse sync. A journey is only as smart as the profile that triggers it.',
  },
  {
    title: 'Build',
    body: 'SDK integration, templates, and the first live Canvas journeys. A standard implementation runs 8 to 12 weeks.',
  },
  {
    title: 'Prove',
    body: 'Parallel sends while IPs and domains warm. We cut over when inbox placement holds, not when the calendar says so.',
  },
  {
    title: 'Run',
    body: 'Your team ships campaigns while we watch deliverability and experiments, or we run the whole calendar under a managed agreement.',
  },
];

const FACTS = [
  {
    label: 'Partnership',
    line: 'Braze Alloy partner. Implementations, ESP migrations, and managed campaign operations.',
  },
  {
    label: 'Delivery',
    line: 'The engineers who design the data architecture wire the SDK. Marketing and data work as one pod, not two vendors.',
  },
  {
    label: 'Scale',
    line: 'Founded 2006. 1,200+ engineers across 11 global delivery hubs. 500+ enterprise projects.',
  },
  {
    label: 'Operations',
    line: 'ISO 27001 certified, with 24/7 operations under SLAs.',
  },
];

const FAQS = [
  {
    question: 'How long does a Braze implementation take?',
    answer:
      'A standard implementation runs 8 to 12 weeks: SDK integration, data architecture, template setup, and the first live campaigns. Add time if identity resolution is messy or if you are migrating an ESP at the same time. We train your team as we build, so handover is not a separate phase.',
  },
  {
    question: 'Can you migrate us from our current ESP to Braze?',
    answer:
      'Yes. We audit the existing platform, convert templates, migrate subscriber data and preferences, and run both systems in parallel while the new IPs and domains warm up. Deliverability is the thing that breaks in rushed migrations, so we do not cut over until inbox placement holds.',
  },
  {
    question: 'How does Braze get our customer data?',
    answer:
      'Three routes, usually together: the SDK streams behavioral events from your apps and sites, Cloud Data Ingestion syncs profiles from your warehouse or CDP, and Currents streams engagement data back out for analytics. We design the data architecture first, because a campaign is only as good as the profile behind it.',
  },
  {
    question: 'Which channels can Braze actually send?',
    answer:
      'Email, mobile and web push, SMS and MMS, in-app messages, Content Cards, and webhooks into anything else. Canvas orchestrates all of them in one journey, so the channel decision happens per customer rather than per campaign.',
  },
  {
    question: 'Do you run our campaigns after launch or train our team?',
    answer:
      'Either. Some clients hand us campaign operations under a managed services agreement; most have us build, train their marketers, and stay on for deliverability and optimization. The goal is that your team ships campaigns without a ticket queue in the middle.',
  },
];

/* --------------------------------- page ---------------------------------- */

export default function BrazePage() {
  return (
    <div className={`bg-white text-black ${v4Sans}`}>
      <ServiceSchema
        name="Braze Implementation Services"
        description="Braze Alloy Partner. Customer engagement, lifecycle marketing, Canvas orchestration, ESP migration, and real-time personalization implementation."
        url="/platforms/braze"
        serviceType="Braze Consulting"
      />
      {/* FAQPage JSON-LD comes from PageFaq below. One per page. */}
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: '/' },
          { name: 'Platforms', url: '/platforms' },
          { name: 'Braze', url: '/platforms/braze' },
        ]}
      />

      <ServiceHero
        kicker="Braze"
        title={
          <>
            Braze, wired into{' '}
            <span style={{ color: '#1D4ED8' }}>your&nbsp;data</span>
          </>
        }
        lede="ACI Infotech is a Braze Alloy partner. We implement Braze end to end: SDK integration, data pipelines from your warehouse, and Canvas journeys across email, push, SMS, and in-app. ESP migrations run in parallel until deliverability holds, and your team ships campaigns without a ticket queue in the middle."
        chips={[
          'Braze Alloy partner',
          'Canvas orchestration',
          'ESP migrations',
          'Deliverability watched',
        ]}
        primary={{ label: 'Talk to a Braze consultant', href: '/contact' }}
        secondary={{ label: 'See the case studies', href: '/case-studies' }}
        visual={<FlowScene config={FLOWS['platform-braze']} />}
      />

      {/* Problem band: the platform is rarely the weak link */}
      <FoldcraftHero
        geistClass={v4Geist}
        image="/images/v4/hero-atmosphere.jpg"
        pill="Why engagement platforms disappoint"
        headline={
          <>
            The platform sends.{' '}
            <br className="hidden sm:block" />
            <span className="text-[#60A5FA]">The data never arrives.</span>
          </>
        }
        body="Most Braze estates underperform for the same reason: the profile behind the message is thin. Events never leave the app, the warehouse syncs weekly, and personalization falls back to first name. We build the data plumbing first, because a journey is only as smart as the profile that triggers it."
        story={{
          metric: { value: '2.5x', label: 'Email engagement lift' },
          title:
            'A governed customer data foundation across 600+ retail locations, feeding real-time engagement.',
          href: '/case-studies/databricks-modernization-ai-enablement-for-leading-c-store-chain',
          logoSrc: '/images/Solution-Partners/braze.png',
          logoAlt: 'Braze',
        }}
      />

      {/* Offerings */}
      <section className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <SectionHead
            kicker="What we do on Braze"
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
        title={<>Is Braze the right&nbsp;call?</>}
        body="Usually, when engagement has to react in real time. Braze earns its place when product events should trigger messages in seconds and marketers need to ship journeys without engineering tickets. When the center of gravity is Salesforce CRM, the Marketing Cloud route can win, and we will tell you which, since we implement both."
        colA={{ src: '/images/Solution-Partners/braze.png', alt: 'Braze', px: 36 }}
        colB={{ label: 'Marketing Cloud route' }}
        rows={DECISION_ROWS}
        footnote="We hold both the Braze Alloy partnership and a Salesforce partnership, so the recommendation follows your stack, not our badge list."
      />

      {/* Proof */}
      <section className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <SectionHead
            kicker="Results"
            title={
              <>
                Engagement that <span style={{ color: '#1D4ED8' }}>moved&nbsp;numbers.</span>
              </>
            }
          />
          <CmsProofCards
            technology="Braze"
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
        title={<>The message is the last&nbsp;step.</>}
        body="Braze performs when the customer data underneath is unified, consented, and current. That is our MarTech and CDP practice: the customer record first, then the journeys that read it."
        link={{ label: 'MarTech & CDP', href: '/services/martech-cdp' }}
      />

      {/* Why us */}
      <section className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <SectionHead kicker="Why ACI" title={<>Why brands run Braze with&nbsp;us</>} />
          <FactsRow facts={FACTS} />
        </div>
      </section>

      <ClusterPosts keywords={['braze', 'customer engagement', 'martech', 'cdp']} />

      <RelatedLinks items={brazeRelated} />

      <PageFaq
        kicker="Braze FAQ"
        title={
          <>
            Braze questions,
            <br />
            answered straight.
          </>
        }
        faqs={FAQS}
      />

      <CtaSection label="Let's talk Braze" />
    </div>
  );
}
