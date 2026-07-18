import { Metadata } from 'next';
import RelatedLinks from '@/components/seo/RelatedLinks';
import { awsRelated } from '@/content/related-links';
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
  alternates: { canonical: `${siteUrl}/platforms/aws` },
  title: 'AWS Cloud Services',
  description:
    'ACI Infotech is an AWS Advanced Consulting Partner. Cloud migration, data lakes, serverless architecture, and managed AWS services.',
  openGraph: {
    title: 'AWS Cloud Services | ACI Infotech',
    description:
      'ACI Infotech is an AWS Advanced Consulting Partner. Cloud migration, data lakes, serverless architecture, and managed AWS services.',
    url: `${siteUrl}/platforms/aws`,
    siteName: 'ACI Infotech',
    type: 'website',
    images: DEFAULT_OG_IMAGES,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AWS Cloud Services | ACI Infotech',
    description:
      'ACI Infotech is an AWS Advanced Consulting Partner. Cloud migration, data lakes, serverless architecture, and managed AWS services.',
    images: DEFAULT_TWITTER_IMAGES,
  },
};

/* ------------------------------- page data ------------------------------- */

const OFFERINGS = [
  {
    title: 'Migration in waves',
    body: 'The assessment sets the sequence: easy wins first, tangled dependencies last, retirements flagged before anything moves. Workloads cut over in planned waves, so the business never bets everything on one long weekend.',
    chips: ['AWS Migration Hub', 'AWS DMS', 'Wave planning', 'Parallel runs'],
  },
  {
    title: 'Landing zones and foundations',
    body: 'Accounts, identity, networking, and policy guardrails built before the first workload arrives, all of it as code. Cost controls go on with the foundation, not after the first surprising bill.',
    chips: ['AWS Control Tower', 'AWS Organizations', 'AWS IAM', 'Terraform'],
  },
  {
    title: 'Data lakes and analytics',
    body: 'Data lakes on S3 with Glue pipelines, Athena for open query, and Redshift where a warehouse earns its place. Governance starts at the first bucket instead of arriving with the auditors.',
    chips: ['Amazon S3', 'AWS Glue', 'Amazon Athena', 'Amazon Redshift'],
  },
  {
    title: 'Serverless and containers',
    body: 'Event-driven backends on Lambda and EventBridge, containers on EKS and ECS where the workload wants a cluster. Scale is automatic, and idle capacity stops being a line item.',
    chips: ['AWS Lambda', 'Amazon EventBridge', 'Amazon EKS', 'Amazon ECS'],
  },
  {
    title: 'AI and ML on AWS',
    body: 'Models trained and served on SageMaker, GenAI on Bedrock against your own data, with the same IAM and network controls as everything else in the estate. One governance story, not a parallel one.',
    chips: ['Amazon SageMaker', 'Amazon Bedrock', 'Amazon Comprehend', 'Amazon Rekognition'],
  },
  {
    title: 'Managed operations and cost control',
    body: 'Monitoring, security, and incident response after cutover, around the clock under SLAs. Rightsizing, Savings Plans, storage tiering, and shutting down what nobody owns happen on a schedule, not after a scare.',
    chips: ['24/7 NOC', 'SLAs', 'Savings Plans', 'Rightsizing'],
  },
];

const DECISION_ROWS = [
  { need: 'The widest catalog of managed services and regions', pick: 'a' as const },
  { need: 'Serverless and containers as the default way to build', pick: 'a' as const },
  { need: 'Data lakes on S3 with open query engines', pick: 'a' as const },
  { need: 'GenAI on Bedrock with a choice of models', pick: 'a' as const },
  { need: 'Identity, licensing, and desktops already on Microsoft', pick: 'b' as const },
  { need: 'Analytics gravity already around BigQuery', pick: 'b' as const },
];

const PROOF_FALLBACK = [
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
    eyebrow: 'Global Food Services Operator',
    metric: '53',
    metricLabel: 'Countries on one data platform',
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
    body: 'Workload inventory, dependency mapping, and a fixed-scope estimate per workload. The retire list is usually the cheapest line item in the whole program.',
  },
  {
    title: 'Land',
    body: 'The landing zone first: accounts, identity, networking, and guardrails as code, with cost controls on before any workload arrives.',
  },
  {
    title: 'Migrate',
    body: 'Waves, sequenced easy wins first and tangled dependencies last. A single workload can move in weeks; a full data center exit usually runs 6 to 12 months.',
  },
  {
    title: 'Prove',
    body: 'Every wave passes testing and a parallel run before cutover. The old environment stays on until parity is signed off, not assumed.',
  },
  {
    title: 'Run',
    body: 'Around-the-clock operations under SLA with our managed team, or a clean handover to yours with runbooks that hold up during an incident.',
  },
];

const FACTS = [
  {
    label: 'Partnership',
    line: 'AWS Advanced Consulting Partner. 200+ cloud migrations delivered across AWS, Azure, and GCP.',
  },
  {
    label: 'Delivery',
    line: 'The architects who design your landing zone are the ones who migrate onto it. No handoff between the assessment and the waves.',
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

// Reused from the previous AWS page: the buyer questions and answers were
// already in the site voice, so they carry over intact.
const FAQS = [
  {
    question: 'How long does an AWS migration take?',
    answer:
      'A single workload can move in a few weeks. A full data center exit usually runs 6 to 12 months, executed in waves so the business never depends on one big cutover weekend. The assessment phase sets the sequence: easy wins first, tangled dependencies last.',
  },
  {
    question: 'What does an AWS migration cost?',
    answer:
      'It depends on three things: how many workloads move, how many need re-platforming instead of lift and shift, and how much data has to cross the wire. We scope a fixed-price assessment first so you get a workload-by-workload estimate before committing to the move. The assessment also flags what should be retired instead of migrated, which is often the cheapest line item.',
  },
  {
    question: 'Can you handle regulated workloads like HIPAA on AWS?',
    answer:
      'Yes. We have migrated healthcare systems to HIPAA-compliant AWS architectures with encryption, audit logging, and network isolation designed in from the start. Every build follows the Well-Architected Framework, and compliance controls are part of the landing zone, not a retrofit.',
  },
  {
    question: 'Can you cut our AWS bill without a re-architecture?',
    answer:
      'Usually, yes. Rightsizing, Savings Plans, storage tiering, and shutting down what nobody owns typically trims a meaningful share of spend within the first quarter. Deeper savings come from re-platforming to serverless or containers, which we scope separately.',
  },
  {
    question: 'Do you run the environment after the migration?',
    answer:
      'Yes. Our managed services team handles monitoring, security, incident response, and ongoing cost optimization 24/7. You can hand over the whole estate or just the parts your team does not want to carry.',
  },
];

/* --------------------------------- page ---------------------------------- */

export default function AWSPage() {
  return (
    <div className={`bg-white text-black ${v4Sans}`}>
      <ServiceSchema
        name="AWS Cloud Services"
        description="AWS Advanced Consulting Partner. Cloud migration, landing zones, data lakes, serverless architecture, and managed AWS services."
        url="/platforms/aws"
        serviceType="AWS Consulting"
      />
      {/* FAQPage JSON-LD comes from PageFaq below — one per page. */}
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: '/' },
          { name: 'Platforms', url: '/platforms' },
          { name: 'AWS', url: '/platforms/aws' },
        ]}
      />

      <ServiceHero
        kicker="AWS"
        title={
          <>
            Move to AWS. <span style={{ color: '#1D4ED8' }}>Stay in&nbsp;control.</span>
          </>
        }
        lede="ACI Infotech is an AWS Advanced Consulting Partner with 200+ cloud migrations delivered across AWS, Azure, and GCP. We build the landing zone first, move workloads in waves, and set the cost guardrails before the first big bill. Then our managed team runs the estate around the clock, under SLAs."
        chips={[
          'AWS Advanced Consulting Partner',
          '200+ cloud migrations',
          'Well-Architected reviews',
          'ISO 27001',
        ]}
        primary={{ label: 'Talk to an AWS architect', href: '/contact' }}
        secondary={{ label: 'See the cloud stories', href: '/case-studies' }}
        visual={<FlowScene config={FLOWS['platform-aws']} />}
      />

      {/* Problem band: getting in is easy, running it well is not */}
      <FoldcraftHero
        geistClass={v4Geist}
        image="/images/v4/svc-cloud.jpg"
        pill="Why migrations stall"
        headline={
          <>
            Getting to AWS is easy.{' '}
            <br className="hidden sm:block" />
            <span className="text-[#60A5FA]">Running it well is not.</span>
          </>
        }
        body="Estates stall in the messy middle: tangled dependencies, servers nobody owns, and a cloud bill that grows while the old data center is still on the books. We have run 200+ cloud migrations, and the pattern of what goes wrong is depressingly stable. So is the fix."
        story={{
          metric: { value: '99.97%', label: 'Uptime across 72+ servers' },
          title:
            'Automated DevOps and monitoring across an enterprise technology estate, run as a managed operation.',
          href: '/case-studies/optimizing-enterprise-it-operations-with-automated-devops-and-monitoring',
          logoSrc: '/brand/aws-color.png',
          logoAlt: 'AWS',
        }}
      />

      {/* Offerings */}
      <section className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <SectionHead
            kicker="What we do on AWS"
            title={
              <>
                One estate. <span style={{ color: '#1D4ED8' }}>Six disciplines.</span>
              </>
            }
          />
          <OfferingList items={OFFERINGS} />
        </div>
      </section>

      {/* Honest fit panel */}
      <DecisionPanel
        title={<>Is AWS the right&nbsp;call?</>}
        body="Usually, when engineering wants the widest menu of managed services and the deepest pool of people who already know them. AWS rewards teams that build with infrastructure as code and lean on managed services instead of running their own. When your identity, licensing, and data gravity sit elsewhere, another cloud can be the shorter road, and we will say so. We migrate to all three majors, so the recommendation follows your estate."
        colA={{ src: '/brand/aws-color.png', alt: 'AWS', px: 44 }}
        colB={{ label: 'A different road' }}
        rows={DECISION_ROWS}
        footnote="When the second column wins, it is usually Azure or Google Cloud. Both have pages of their own, and the full comparison lives on our cloud modernization page."
      />

      {/* Proof */}
      <section className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <SectionHead
            kicker="Results"
            title={
              <>
                Cloud moves that <span style={{ color: '#1D4ED8' }}>stayed&nbsp;done.</span>
              </>
            }
          />
          <CmsProofCards technology="AWS" fallback={PROOF_FALLBACK} />
        </div>
      </section>

      {/* Process */}
      <section className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <SectionHead kicker="How an engagement runs" title="Five phases. No guesswork." />
          <ProcessStrip steps={PROCESS} />
        </div>
      </section>

      {/* Bridge to the cloud modernization practice */}
      <BridgeBand
        title={<>Landing is step one. Running is the&nbsp;job.</>}
        body="AWS pays off when the applications, data, and operations around it are modernized with the same care as the move itself. That is our cloud modernization practice, from the first assessment to the managed run."
        link={{ label: 'Cloud Modernization', href: '/services/cloud-modernization' }}
      />

      {/* Why us */}
      <section className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <SectionHead kicker="Why ACI" title={<>Why enterprises run AWS with&nbsp;us</>} />
          <FactsRow facts={FACTS} />
        </div>
      </section>

      <ClusterPosts keywords={['aws', 'cloud migration', 'serverless']} />

      <RelatedLinks items={awsRelated} />

      <PageFaq
        kicker="AWS FAQ"
        title={
          <>
            AWS questions,
            <br />
            answered straight.
          </>
        }
        faqs={FAQS}
      />

      <CtaSection label="Let's talk AWS" />
    </div>
  );
}
