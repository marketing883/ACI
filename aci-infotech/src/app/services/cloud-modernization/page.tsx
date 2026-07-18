import { Metadata } from 'next';
import RelatedLinks from '@/components/seo/RelatedLinks';
import { cloudModernizationRelated } from '@/content/related-links';
import ClusterPosts from '@/components/seo/ClusterPosts';
import { ServiceSchema, BreadcrumbSchema } from '@/components/seo/StructuredData';
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
} from '@/components/v4/page/kit';

export const revalidate = 3600;

// Canonical origin: always production, so staging builds can never
// self-canonicalize (see src/lib/site-url.ts).
const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  title: 'Cloud Modernization Services',
  description: 'Cloud modernization and migration across AWS, Azure, and GCP. Refactor, replatform, or rearchitect with playbooks that reduce risk. 200+ cloud migrations.',
  keywords: 'cloud modernization, AWS migration, Azure migration, cloud consulting, kubernetes, multi-cloud',
  alternates: {
    canonical: `${siteUrl}/services/cloud-modernization`,
  },
  // Per-page social card. Without this, every share and link preview
  // inherited the homepage's OpenGraph (title, image, and og:url all
  // pointing at /), mis-attributing all 21 service/platform pages.
  openGraph: {
    title: 'Cloud Modernization Services | ACI Infotech',
    description: 'Cloud modernization and migration across AWS, Azure, and GCP. Refactor, replatform, or rearchitect with playbooks that reduce risk. 200+ cloud migrations.',
    url: `${siteUrl}/services/cloud-modernization`,
    siteName: 'ACI Infotech',
    type: 'website',
    images: DEFAULT_OG_IMAGES,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cloud Modernization Services | ACI Infotech',
    description: 'Cloud modernization and migration across AWS, Azure, and GCP. Refactor, replatform, or rearchitect with playbooks that reduce risk. 200+ cloud migrations.',
    images: DEFAULT_TWITTER_IMAGES,
  },
};

/* ------------------------------- page copy ------------------------------- */

const OFFERINGS = [
  {
    title: 'Cloud migration',
    body: 'Rehost, replatform, or refactor to AWS, Azure, or GCP, moved in waves with rehearsed cutovers. 200+ migrations delivered without production downtime, and the legacy estate actually gets decommissioned instead of running just in case.',
    chips: ['AWS', 'Azure', 'GCP', 'VMware Cloud'],
  },
  {
    title: 'Application modernization',
    body: 'Monoliths refactored to microservices, legacy applications containerized, CI/CD wired in. Teams ship 3 to 4x faster once deployment stops being a ceremony.',
    chips: ['Kubernetes', 'Docker', 'Terraform', 'GitOps'],
  },
  {
    title: 'Kubernetes platform engineering',
    body: 'Enterprise Kubernetes with service mesh, observability, and security built into the platform, not bolted onto each cluster. Developers get self-service; the platform team gets one estate to manage instead of forty snowflakes.',
    chips: ['EKS', 'AKS', 'GKE', 'OpenShift', 'Istio'],
  },
  {
    title: 'Infrastructure as code',
    body: 'Every environment defined in Terraform or Pulumi, version-controlled and reproducible. Drift gets caught by a pipeline, not discovered during an outage.',
    chips: ['Terraform', 'Pulumi', 'CloudFormation', 'Ansible'],
  },
  {
    title: 'Cloud security and compliance',
    body: 'Landing zones with guardrails, zero-trust network design, and compliance automation from the first workload. The audit becomes a report you export, not a quarter you lose.',
    chips: ['AWS Security Hub', 'Azure Security Center', 'CIS Benchmarks'],
  },
  {
    title: 'Cloud cost optimization',
    body: 'FinOps from day one: tagging, budgets, right-sizing, and committed-use planning. Our engagements typically cut infrastructure cost 15 to 25%, mostly by turning off what nobody was using.',
    chips: ['AWS Cost Explorer', 'Azure Cost Management', 'Spot Instances'],
  },
];

const SIX_R = [
  {
    name: 'Rehost',
    when: 'Lift and shift as-is. Right when the data center lease is the deadline and the app just needs a new home.',
  },
  {
    name: 'Replatform',
    when: 'Small upgrades on the way over, like managed databases. Right when minor changes buy major running costs.',
  },
  {
    name: 'Refactor',
    when: 'Rebuild for cloud-native. Right for the applications that carry the business and need to scale or ship faster.',
  },
  {
    name: 'Repurchase',
    when: 'Swap it for SaaS. Right when a commodity application is no longer worth owning.',
  },
  {
    name: 'Retire',
    when: 'Turn it off. Right more often than anyone admits; every estate has servers nobody can name a user for.',
  },
  {
    name: 'Retain',
    when: 'Leave it where it is, for now. Right when latency, licensing, or regulation says the move costs more than it returns.',
  },
];

const PROOF = [
  {
    eyebrow: 'Fortune 500 Insurance Carrier',
    metric: '$8M',
    metricLabel: 'Saved per year after DC exit',
    summary: 'A legacy data center costing $20M a year exited in 18 months, rebuilt on AWS with Terraform and Kubernetes. Zero downtime through every cutover.',
    href: '/case-studies?service=cloud-modernization',
    linkLabel: 'Browse the cloud case studies',
  },
  {
    eyebrow: 'National Retail Chain',
    metric: '99.7%',
    metricLabel: 'Uptime through peak traffic',
    summary: 'A monolithic e-commerce platform rebuilt on Azure and Kubernetes: 3 to 4x the scalability, with deployment cycles 2 to 3x faster.',
    href: '/case-studies?industry=retail',
    linkLabel: 'See the retail stories',
  },
  {
    eyebrow: 'Global Industrial Manufacturer',
    metric: '20%',
    metricLabel: 'Cost reduction on multi-cloud',
    summary: 'Single-vendor lock-in replaced with an active-active architecture across AWS and Azure, and disaster recovery that actually gets rehearsed.',
    href: '/case-studies?industry=manufacturing',
    linkLabel: 'See the manufacturing stories',
  },
];

const PROCESS = [
  {
    title: 'Inventory',
    timeframe: 'Weeks 1 to 4',
    body: 'Map the estate, the dependencies, and the contracts. Every workload gets a 6R call and a named owner.',
  },
  {
    title: 'Design',
    timeframe: 'Weeks 3 to 6',
    body: 'Landing zone, guardrails, network, and identity, plus a cost model finance can hold us to.',
  },
  {
    title: 'Migrate',
    timeframe: 'Weeks 6 to 12',
    body: 'First workloads land inside 12 weeks. Waves after that, each cutover rehearsed before the real one.',
  },
  {
    title: 'Prove',
    body: 'Parallel run until the numbers and the latencies match. Nothing legacy is switched off on faith.',
  },
  {
    title: 'Run',
    body: 'FinOps, patching, and around-the-clock operations under SLA with our team, or a clean handover to yours.',
  },
];

const FACTS = [
  {
    label: 'Delivery',
    line: 'The architects who plan your migration run your cutover. No handoff between the pitch team and the delivery pod.',
  },
  {
    label: 'Clouds',
    line: 'Certified on AWS, Azure, and GCP, with 200+ migrations delivered. We design for your estate, not our partnership tiers.',
  },
  {
    label: 'Scale',
    line: 'Founded 2006. 1,200+ engineers across 11 global delivery hubs. 500+ enterprise projects.',
  },
  {
    label: 'Operations',
    line: 'ISO 27001 certified, with 24/7 managed NOC coverage under published SLAs.',
  },
];

const FAQS = [
  {
    question: 'How long does a cloud migration take?',
    answer: 'A landing zone and first workloads land in 8 to 12 weeks. A full estate move runs 6 to 18 months depending on complexity, delivered in phased waves so value ships long before the last server moves.',
  },
  {
    question: 'How do you decide what to migrate, and how?',
    answer: 'The 6R framework: rehost, replatform, refactor, repurchase, retire, retain. Not everything should move, and not everything should be rewritten. We sort the estate first so spend goes where it returns something.',
  },
  {
    question: 'Which cloud should we choose?',
    answer: 'It depends on your existing investments, workloads, and regulatory needs. We hold certifications on all three, so the recommendation follows your estate, not our margins. Plenty of enterprises run more than one.',
  },
  {
    question: 'How do you migrate without downtime?',
    answer: 'Parallel run and phased cutover. The new environment runs alongside the old until it holds up under real load, then traffic shifts. We rehearse every cutover before doing it for real, which is how 200+ migrations have shipped without production disruption.',
  },
  {
    question: 'How do you keep cloud cost from spiraling?',
    answer: 'FinOps from day one: tagging, budgets, right-sizing, and committed-use discounts where usage is steady. Most cloud overspend is not the cloud being expensive. It is workloads nobody turned off.',
  },
  {
    question: 'How do you handle security during migration?',
    answer: 'Security moves first, not last. Identity, encryption, network segmentation, and compliance controls go into the landing zone before any data does.',
  },
  {
    question: 'What about vendor lock-in?',
    answer: 'We design for portability where it matters: containers, infrastructure as code, and open standards. Where a cloud-native service earns its keep, we use it with eyes open rather than avoiding it on principle.',
  },
  {
    question: 'Do you run the estate after migration?',
    answer: 'Both options. Our managed NOC runs it 24/7 under SLA with P1 response in fifteen minutes, or we hand over to your team with runbooks and stay on call through the transition.',
  },
];

/* --------------------- decision artifact (page-local) --------------------- */

// One-off variation on the kit's DecisionPanel grammar: the 6R framework
// as a compact on-page strip instead of a two-logo comparison table, so
// it lives inline rather than in the shared kit.
function SixRStrip() {
  return (
    <section className="border-t border-gray-200 bg-gray-50">
      <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
        <h2
          className={`text-3xl font-bold tracking-tight text-black sm:text-4xl ${v4Display}`}
          style={{ lineHeight: 1.08 }}
        >
          The 6R framework, on one&nbsp;screen
        </h2>
        <p className="mt-5 max-w-3xl text-base leading-relaxed text-gray-600 md:text-lg">
          Every workload gets one of six calls before anything moves. This is the sorting exercise most migration plans skip, which is why most migration plans slip. A typical estate ends up using at least four of the six.
        </p>

        <div className="mt-10 grid gap-x-8 gap-y-8 border-t border-gray-200 pt-8 sm:grid-cols-2 lg:grid-cols-3">
          {SIX_R.map((r, i) => (
            <div key={r.name}>
              <div className="flex items-baseline gap-3">
                <span className={`text-sm font-semibold text-[#1D4ED8] ${v4Display}`}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className={`text-lg font-semibold text-black md:text-xl ${v4Display}`}>{r.name}</h3>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">{r.when}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* --------------------------------- page ---------------------------------- */

export default function CloudModernizationPage() {
  return (
    <div className={`bg-white text-black ${v4Sans}`}>
      <ServiceSchema
        name="Cloud Modernization Services"
        description="AWS, Azure, GCP migrations and cloud modernization. Refactor, replatform, or rearchitect with playbooks that reduce risk."
        url="/services/cloud-modernization"
        serviceType="Cloud Computing Consulting"
      />
      {/* FAQPage JSON-LD comes from PageFaq below — one per page. */}
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: '/' },
          { name: 'Services', url: '/services' },
          { name: 'Cloud Modernization', url: '/services/cloud-modernization' },
        ]}
      />

      <ServiceHero
        kicker="Cloud Modernization"
        title={
          <>
            Cloud Modernization{' '}
            <span style={{ color: '#1D4ED8' }}>Without the&nbsp;Chaos</span>
          </>
        }
        lede="ACI Infotech migrates and modernizes enterprise estates across AWS, Azure, and GCP: 200+ migrations delivered with phased cutovers and zero downtime. We sort the estate with the 6R framework, move what earns its move, retire what does not, and leave you with infrastructure as code and a bill finance can read."
        chips={[
          '200+ cloud migrations',
          'Certified on AWS, Azure, and GCP',
          'Zero-downtime cutovers',
          '15 to 25% cost reduction',
        ]}
        primary={{ label: 'Talk to a cloud architect', href: '/contact?service=cloud-modernization' }}
        secondary={{ label: 'See the cloud case studies', href: '/case-studies?service=cloud-modernization' }}
        logos={[
          { src: '/brand/aws-color.png', alt: 'AWS' },
          { src: '/brand/azure-color.png', alt: 'Microsoft Azure' },
          { src: '/brand/googlecloud-color.svg', alt: 'Google Cloud' },
        ]}
        logosCaption="Migrations delivered across all three clouds. 200+ and counting."
      />

      {/* Problem band: the estate nobody can turn off */}
      <FoldcraftHero
        geistClass={v4Geist}
        pill="Why estates stall"
        headline={
          <>
            The estate nobody{' '}
            <br className="hidden sm:block" />
            <span className="text-[#60A5FA]">can turn off.</span>
          </>
        }
        body="Every enterprise has one: the VMware renewal that doubled, the mainframe contract nobody will touch, the cloud accounts that grew without an owner. The migration has been next year for five years, because nobody can say what breaks if a server goes dark. The fix is not a bigger lift and shift. It is sorting the estate honestly, then moving it in waves that never bet the business on one weekend."
        story={{
          metric: { value: '$8M', label: 'Saved per year' },
          title: 'Data center exit in 18 months with zero downtime',
          role: 'Insurance',
          org: 'A Fortune 500 insurance carrier',
          href: '/case-studies?service=cloud-modernization',
          logoSrc: '/brand/aws-color.png',
          logoAlt: 'AWS',
        }}
      />

      {/* What we do */}
      <section className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <SectionHead
            kicker="What we do"
            title={
              <>
                From migration to run. <span style={{ color: '#1D4ED8' }}>Six&nbsp;disciplines.</span>
              </>
            }
          />
          <OfferingList items={OFFERINGS} />
        </div>
      </section>

      {/* Decision artifact: the 6R framework */}
      <SixRStrip />

      {/* Proof */}
      <section className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <SectionHead
            kicker="Results"
            title={
              <>
                Real estates. <span style={{ color: '#1D4ED8' }}>Real&nbsp;cutovers.</span>
              </>
            }
          />
          <ProofCards cards={PROOF} />
        </div>
      </section>

      {/* Process */}
      <section className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <SectionHead kicker="How an engagement runs" title="Five phases. No mystery." />
          <ProcessStrip steps={PROCESS} />
        </div>
      </section>

      {/* Managed NOC teaser: managed-operations owns the full story */}
      <BridgeBand
        title="Someone still has to run it."
        body="After the migration, the estate needs a pager that gets answered. Our managed NOC runs client clouds 24/7 with follow-the-sun coverage, L1 to L3 escalation, P1 response in fifteen minutes, and uptime targets of 99.95% or higher. The engineers who designed the platform stay on the console."
        link={{ label: 'Managed Operations', href: '/services/managed-operations' }}
      />

      {/* Why ACI */}
      <section className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <SectionHead kicker="Why ACI" title="Why enterprises pick us for cloud" />
          <FactsRow facts={FACTS} />
        </div>
      </section>

      <PageFaq
        kicker="Questions"
        title={
          <>
            Cloud questions,
            <br />
            <span style={{ color: '#1D4ED8' }}>answered straight.</span>
          </>
        }
        sub="The questions we hear most before a migration. Anything else belongs in a conversation."
        faqs={FAQS}
      />

      <ClusterPosts keywords={['cloud migration', 'cloud modernization', 'modernization', 'aws', 'azure', 'finops', 'devops']} />

      <RelatedLinks items={cloudModernizationRelated} />

      {/* Closing CTA: video stage, one button, nothing else */}
      <CtaSection label="Let's plan the migration" />
    </div>
  );
}
