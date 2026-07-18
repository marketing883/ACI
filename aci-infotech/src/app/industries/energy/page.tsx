import { Metadata } from 'next';
import RelatedLinks from '@/components/seo/RelatedLinks';
import { energyRelated } from '@/content/related-links';
import ClusterPosts from '@/components/seo/ClusterPosts';
import { energyFaqs } from '@/content/industry-faqs';
import { ServiceSchema, BreadcrumbSchema } from '@/components/seo/StructuredData';
import { DEFAULT_OG_IMAGES, DEFAULT_TWITTER_IMAGES } from '@/lib/seo/og';
import { getSiteUrl } from '@/lib/site-url';
import { v4Sans, v4Geist, v4Display } from '@/components/v4/fonts';
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
  glueWidow,
} from '@/components/v4/page/kit';
import CmsProofCards from '@/components/v4/page/CmsProofCards';
import FlowScene from '@/components/v4/page/FlowScene';
import { FLOWS } from '@/components/v4/page/flow-configs';

export const revalidate = 3600;

// Canonical origin: always production, so staging builds can never
// self-canonicalize (see src/lib/site-url.ts).
const siteUrl = getSiteUrl();

const DESCRIPTION =
  'Energy technology consulting for utilities and energy companies: NERC CIP and FERC compliance, OT/IT convergence, grid analytics, and renewable integration.';

export const metadata: Metadata = {
  alternates: { canonical: `${siteUrl}/industries/energy` },
  title: 'Energy & Utilities Technology Solutions',
  description: DESCRIPTION,
  openGraph: {
    title: 'Energy & Utilities Technology Solutions | ACI Infotech',
    description: DESCRIPTION,
    url: `${siteUrl}/industries/energy`,
    siteName: 'ACI Infotech',
    type: 'website',
    images: DEFAULT_OG_IMAGES,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Energy & Utilities Technology Solutions | ACI Infotech',
    description: DESCRIPTION,
    images: DEFAULT_TWITTER_IMAGES,
  },
};

/* ------------------------------- page data ------------------------------- */

const OFFERINGS = [
  {
    title: 'NERC CIP compliance',
    body: 'Security controls, automated evidence collection, and continuous monitoring built to what a NERC CIP audit actually checks. One utility went into its audit 100 percent ready, came out with zero critical findings, and cut compliance effort by 60 percent. FERC and state regulators read the same evidence.',
    chips: ['NERC CIP', 'FERC', 'Splunk', 'ServiceNow'],
  },
  {
    title: 'Grid analytics',
    body: 'Real-time platforms that pull SCADA, meter, and sensor data together for grid monitoring, outage prediction, and load optimization. Operators see the grid as it is right now, not as last night’s batch left it.',
    chips: ['SCADA', 'Outage prediction', 'Load optimization', 'Azure'],
  },
  {
    title: 'Asset performance management',
    body: 'Predictive maintenance for critical assets that extends life and prevents failures. For one regional gas and electric utility, IoT monitoring with ML cut unplanned outages by 24 percent and saved $190K a year in maintenance, at 99.5 percent grid reliability.',
    chips: ['Azure IoT', 'Databricks', 'OSIsoft PI', 'Power BI'],
  },
  {
    title: 'Renewable integration',
    body: 'Solar and wind forecasting, storage optimization, and the balancing analytics that keep intermittent generation from destabilizing the grid. DERMS-ready data foundations, because distributed resources are a data problem before they are a turbine problem.',
    chips: ['Solar & wind forecasting', 'DERMS', 'Storage optimization', 'Grid stability'],
  },
  {
    title: 'OT/IT convergence',
    body: 'Operational and information technology connected for unified visibility without opening a path back into control systems. Segmented networks, one-way data flows where the risk warrants them, and controls aligned to IEC 62443.',
    chips: ['IEC 62443', 'Network segmentation', 'Real-time data', 'OT security'],
  },
  {
    title: 'Customer analytics',
    body: 'Demand forecasting, customer segmentation, and rate structure optimization on the meter and billing data you already collect. The regulator sees a defensible rate case; the planning team sees next summer coming.',
    chips: ['Demand forecasting', 'Segmentation', 'Rate optimization', 'AMI data'],
  },
];

// Signature: the compliance frameworks band, kept exactly as published.
const COMPLIANCE = [
  { name: 'NERC CIP', description: 'Critical infrastructure protection' },
  { name: 'SOC 2 Type II', description: 'Security controls' },
  { name: 'ISO 27001', description: 'Information security' },
  { name: 'NIST CSF', description: 'Cybersecurity framework' },
  { name: 'IEC 62443', description: 'Industrial cybersecurity' },
  { name: 'TSA Pipeline', description: 'Pipeline security' },
];

// Field results from the two published utility engagements.
const FIELD_RESULTS = [
  { value: '100%', label: 'NERC CIP compliance achieved, with zero critical audit findings' },
  { value: '60%', label: 'Reduction in compliance effort' },
  { value: '24%', label: 'Reduction in unplanned outages' },
  { value: '99.5%', label: 'Grid reliability achieved' },
];

const PROOF_FALLBACK = [
  {
    eyebrow: 'Enterprise Technology Company',
    metric: '99.97%',
    metricLabel: 'Uptime across 72+ servers',
    summary:
      'Automated DevOps and 24/7 monitoring across a complex estate. The same operations discipline we bring to OT and IT environments that cannot go down.',
    href: '/case-studies/optimizing-enterprise-it-operations-with-automated-devops-and-monitoring',
    linkLabel: 'Read the operations story',
    image: '/images/v4/svc-ops.jpg',
  },
  {
    eyebrow: 'Global Food Services Operator',
    metric: '53',
    metricLabel: 'Countries on one data platform',
    summary:
      'One governed platform for 400,000 employees replacing dozens of regional reporting stacks, with decisions landing 22% faster. Global operational data at utility scale.',
    href: '/case-studies/global-food-facilities-data-intelligence',
    linkLabel: 'Read the story',
    image: '/images/v4/case-retail.jpg',
  },
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
];

const PROCESS = [
  {
    title: 'Assess',
    timeframe: 'Weeks 1 to 2',
    body: 'Inventory the estate: SCADA, historians, meters, and the compliance obligations attached to each. The first use case is picked here, against a number you already report.',
  },
  {
    title: 'Architect',
    timeframe: 'Weeks 2 to 4',
    body: 'Data platform design with segmentation, one-way flows, and IEC 62443 alignment decided up front, not retrofitted after the first audit question.',
  },
  {
    title: 'Build',
    timeframe: 'Weeks 4 to 12',
    body: 'Pipelines from the operational estate into the governed platform, shipped in increments and tested against live field data.',
  },
  {
    title: 'Prove',
    body: 'Parallel run against the numbers operations already trusts. Nothing cuts over until the control room agrees the new view is right.',
  },
  {
    title: 'Run',
    body: 'Around-the-clock operations under SLAs, or a clean handover with runbooks written for the night shift.',
  },
];

const FACTS = [
  {
    label: 'Scale',
    line: 'Founded 2006. 1,200+ engineers across 11 global delivery hubs. 500+ enterprise projects.',
  },
  {
    label: 'Compliance',
    line: 'ISO 27001 certified and CMMI Level 3 appraised. Audit evidence comes out of normal operations, not a scramble before the review.',
  },
  {
    label: 'Operations',
    line: '24/7 managed operations under published SLAs. The platform stays watched after go-live.',
  },
  {
    label: 'Delivery',
    line: 'The architects who scope the work are the ones who build it. No handoff between the pitch deck and the delivery pod.',
  },
];

const FAQS = energyFaqs.map((f) => ({ question: f.q, answer: f.a }));

/* --------------------------------- page ---------------------------------- */

export default function EnergyPage() {
  return (
    <div className={`bg-white text-black ${v4Sans}`}>
      <ServiceSchema
        name="Energy & Utilities Technology Solutions"
        description={DESCRIPTION}
        url="/industries/energy"
        serviceType="Energy Technology Consulting"
      />
      {/* FAQPage JSON-LD comes from PageFaq below - one per page. */}
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: '/' },
          { name: 'Industries', url: '/industries' },
          { name: 'Energy & Utilities', url: '/industries/energy' },
        ]}
      />

      <ServiceHero
        kicker="Energy & Utilities"
        title={
          <>
            Utility-grade data, from field to{' '}
            <span style={{ color: '#1D4ED8' }}>control&nbsp;room</span>
          </>
        }
        lede="NERC CIP programs that pass audit, grid and asset analytics on live operational data, and renewable integration that keeps the grid stable. Built for utilities and energy companies by engineers who respect an outage window."
        chips={[
          'NERC CIP programs',
          'OT/IT convergence',
          'Grid analytics',
          'ISO 27001',
        ]}
        primary={{ label: 'Talk to an energy data architect', href: '/contact?industry=energy' }}
        secondary={{ label: 'See the case studies', href: '/case-studies' }}
        visual={<FlowScene config={FLOWS['industry-energy']} />}
      />

      {/* Problem band: the grid modernized, the data did not */}
      <FoldcraftHero
        geistClass={v4Geist}
        image="/images/v4/case-energy.jpg"
        pill="Why utility data stalls"
        headline={
          <>
            Every signal from the field,{' '}
            <br className="hidden sm:block" />
            <span className="text-[#60A5FA]">live in the control room.</span>
          </>
        }
        body="Smart meters, renewables, and DERMS pilots throw off signals worth acting on. We bring SCADA, historians, and billing onto one governed platform, keep NERC CIP evidence flowing as a byproduct of normal operations, and leave the systems that keep the lights on exactly where they are. The planning team sees the grid as it is right now."
        story={{
          metric: { value: '99.97%', label: 'Uptime across 72+ servers' },
          title:
            'A complex digital estate kept available around the clock with automated DevOps and monitoring. The operations bar we hold for infrastructure that cannot go down.',
          href: '/case-studies/optimizing-enterprise-it-operations-with-automated-devops-and-monitoring',
          logoSrc: '/brand/aci-infotech-logo-white.png',
          logoAlt: 'ACI Infotech',
        }}
      />

      {/* Offerings */}
      <section className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <SectionHead
            kicker="What we build for energy"
            title={
              <>
                Six disciplines. One rule: <span style={{ color: '#1D4ED8' }}>the grid stays&nbsp;up.</span>
              </>
            }
            sub="Energy technology consulting scoped to the rules you answer to: FERC, NERC CIP, and an OT estate that cannot go down."
          />
          <OfferingList items={OFFERINGS} />
        </div>
      </section>

      {/* Signature: compliance frameworks band */}
      <section className="border-t border-gray-200 bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <SectionHead
            kicker="Compliance & security"
            title={
              <>
                Built to the rulebooks you{' '}
                <span style={{ color: '#1D4ED8' }}>answer&nbsp;to.</span>
              </>
            }
            sub="Every platform we build for a utility is designed against these frameworks from the first architecture diagram, so the audit reads the system, not a binder assembled the week before."
          />
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {COMPLIANCE.map((item) => (
              <div key={item.name} className={`flex items-start gap-3 rounded-2xl bg-white px-5 py-4 ${cardShadow}`}>
                <CheckBadge />
                <div>
                  <p className={`text-[15px] font-semibold leading-snug text-black ${v4Display}`}>{item.name}</p>
                  <p className="mt-1 text-sm text-gray-500">{glueWidow(item.description)}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Field results from the two published utility engagements */}
          <div className="mt-14 grid grid-cols-2 gap-x-8 gap-y-10 border-t border-gray-200 pt-10 lg:grid-cols-4">
            {FIELD_RESULTS.map((metric) => (
              <div key={metric.label}>
                <p className={`text-3xl font-bold leading-none text-[#1D4ED8] sm:text-4xl ${v4Display}`}>
                  {metric.value}
                </p>
                <p className="mt-2 text-sm font-medium text-gray-500">{glueWidow(metric.label)}</p>
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
                Operational data, held to an{' '}
                <span style={{ color: '#1D4ED8' }}>operational&nbsp;bar.</span>
              </>
            }
          />
          <CmsProofCards industry="Energy" fallback={PROOF_FALLBACK} />
        </div>
      </section>

      {/* Process */}
      <section className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <SectionHead kicker="How an engagement runs" title="Five phases. No science projects." />
          <ProcessStrip steps={PROCESS} />
        </div>
      </section>

      {/* Bridge to the data engineering practice */}
      <BridgeBand
        title={<>The compliance program is only as good as the&nbsp;data.</>}
        body="NERC CIP evidence, outage prediction, and renewable forecasting all stand on the same foundation: grid, meter, and asset data engineered into one governed platform. That is our data engineering practice, and utilities are where it earns its keep."
        link={{ label: 'Data Engineering', href: '/services/data-engineering' }}
      />

      {/* Why us */}
      <section className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <SectionHead kicker="Why ACI" title={<>Why utilities build with&nbsp;us</>} />
          <FactsRow facts={FACTS} />
        </div>
      </section>

      <ClusterPosts keywords={['energy', 'utilities', 'grid', 'nerc cip', 'scada']} />

      <RelatedLinks items={energyRelated} />

      <PageFaq
        kicker="Energy & utilities FAQ"
        title={
          <>
            Energy questions,
            <br />
            answered straight.
          </>
        }
        faqs={FAQS}
      />

      <CtaSection label="Talk through your grid data" href="/contact?industry=energy" />
    </div>
  );
}
