import { Metadata } from 'next';
import RelatedLinks from '@/components/seo/RelatedLinks';
import { manufacturingRelated } from '@/content/related-links';
import ClusterPosts from '@/components/seo/ClusterPosts';
import { manufacturingFaqs } from '@/content/industry-faqs';
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
  'Industry 4.0 solutions for manufacturers. IoT analytics, predictive maintenance, quality analytics, and smart factory implementations.';

export const metadata: Metadata = {
  alternates: { canonical: `${siteUrl}/industries/manufacturing` },
  title: 'Manufacturing Technology Solutions',
  description: DESCRIPTION,
  openGraph: {
    title: 'Manufacturing Technology Solutions | ACI Infotech',
    description: DESCRIPTION,
    url: `${siteUrl}/industries/manufacturing`,
    siteName: 'ACI Infotech',
    type: 'website',
    images: DEFAULT_OG_IMAGES,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Manufacturing Technology Solutions | ACI Infotech',
    description: DESCRIPTION,
    images: DEFAULT_TWITTER_IMAGES,
  },
};

/* ------------------------------- page data ------------------------------- */

const OFFERINGS = [
  {
    title: 'Predictive maintenance',
    body: 'Models that read sensor and maintenance history and flag failures before they stop the line. Across 50+ production lines on one engagement: 28% less unplanned downtime, 45% lower maintenance costs, and 99.2% equipment availability.',
    chips: ['Azure IoT Hub', 'Databricks', 'Python'],
  },
  {
    title: 'IoT data platform',
    body: 'Edge-to-cloud platforms that ingest and process data from thousands of sensors in real time. Built to scale with the plant network, not to be rebuilt when the second site comes online.',
    chips: ['Azure IoT', 'AWS IoT', 'Kafka'],
  },
  {
    title: 'Quality analytics',
    body: 'Computer vision and ML quality control that catches defects early and traces root causes. One deployment cut the defect rate 21%, detected defects 35% faster, and took the rework bill down with them.',
    chips: ['AWS SageMaker', 'OpenCV', 'Snowflake'],
  },
  {
    title: 'Supply chain intelligence',
    body: 'Demand forecasting, inventory optimization, and supplier risk prediction on one governed view of the chain. The disruption shows up in the data before it shows up at the dock.',
    chips: ['Databricks', 'SAP', 'Power BI'],
  },
  {
    title: 'Digital twin',
    body: 'Digital representations of physical assets for simulation, monitoring, and what-if analysis. Try the process change on the twin before you try it on a running line.',
    chips: ['Azure', 'PTC', 'Simulation'],
  },
  {
    title: 'MES and ERP integration',
    body: 'Manufacturing execution systems connected with enterprise platforms for end-to-end visibility and OEE optimization. SAP stays the system of record; the platform makes its data usable.',
    chips: ['SAP', 'Siemens', 'Rockwell'],
  },
];

const CAPABILITIES = [
  { name: 'SCADA/PLC Integration', description: 'Industrial control systems' },
  { name: 'MES Platforms', description: 'Siemens, Rockwell, SAP' },
  { name: 'IoT Platforms', description: 'Azure IoT, AWS IoT, PTC' },
  { name: 'ERP Systems', description: 'SAP, Oracle, Microsoft' },
  { name: 'Quality Systems', description: 'QMS integration' },
  { name: 'Edge Computing', description: 'Real-time processing' },
];

const PROOF_FALLBACK = [
  {
    eyebrow: 'Global Enterprise Estate',
    metric: '99.97%',
    metricLabel: 'Uptime across 72+ servers',
    summary:
      'IT operations automated with DevOps pipelines and monitoring, holding availability across a complex estate. The operations discipline that keeps plant systems running.',
    href: '/case-studies/optimizing-enterprise-it-operations-with-automated-devops-and-monitoring',
    linkLabel: 'Read the operations story',
    image: '/images/v4/svc-ops.jpg',
  },
  {
    eyebrow: 'Global CPG & Beverage Leader',
    metric: '94%',
    metricLabel: 'Brand manager adoption',
    summary:
      'Self-service analytics across a global consumer goods portfolio, cutting campaign analysis from three weeks to four hours.',
    href: '/case-studies/global-cpg-self-service-analytics-brand-managers',
    linkLabel: 'Read the CPG story',
    image: '/images/v4/case-manufacturing.jpg',
  },
  {
    eyebrow: 'Global Technology Enterprise',
    metric: '0.1%',
    metricLabel: 'Contract error rate',
    summary:
      'Contract operations automated end to end in a governed CLM environment, with cycle time down 67%.',
    href: '/case-studies/accelerating-contract-performance-through-intelligent-automation',
    linkLabel: 'Read the automation story',
    image: '/images/v4/why-visual.jpg',
  },
];

const PROCESS = [
  {
    title: 'Assess',
    body: 'Walk the plant, inventory the systems, and pick the use case with a number attached: downtime, defects, or OEE. Baseline it before building anything.',
  },
  {
    title: 'Connect',
    body: 'SCADA, MES, ERP, and quality data wired into one governed platform. Real-time where it earns its keep, batch where it does not.',
  },
  {
    title: 'Model',
    body: 'Predictive maintenance, quality, or supply chain models built on the connected data and tested against your own history.',
  },
  {
    title: 'Prove',
    body: 'Results measured on one line or plant against the baseline. A first governed use case lands inside the 10 to 14 weeks we quote.',
  },
  {
    title: 'Scale',
    body: 'Roll out across lines and sites with 24/7 operations under SLA, so the platform outlives the pilot team.',
  },
];

const FACTS = [
  {
    label: 'Downtime',
    line: '28% reduction in unplanned downtime on delivered engagements, measured against client baselines rather than a brochure.',
  },
  {
    label: 'OT and IT',
    line: 'SCADA, MES, ERP, and quality systems brought into one platform. The whole line in view, not one slice of it.',
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

const FAQS = manufacturingFaqs.map((f) => ({ question: f.q, answer: f.a }));

/* --------------------------------- page ---------------------------------- */

export default function ManufacturingPage() {
  return (
    <div className={`bg-white text-black ${v4Sans}`}>
      <ServiceSchema
        name="Manufacturing Technology Solutions"
        description={DESCRIPTION}
        url="/industries/manufacturing"
        serviceType="Manufacturing Technology Consulting"
      />
      {/* FAQPage JSON-LD comes from PageFaq below, one per page. */}
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: '/' },
          { name: 'Industries', url: '/industries' },
          { name: 'Manufacturing', url: '/industries/manufacturing' },
        ]}
      />

      <ServiceHero
        kicker="Manufacturing"
        title={
          <>
            Manufacturing data from{' '}
            <span style={{ color: '#1D4ED8' }}>sensor to&nbsp;decision</span>
          </>
        }
        lede="From discrete manufacturing to process industries, we build the Industry 4.0 stack that pays for itself: IoT platforms, predictive maintenance, and quality analytics wired into the ERP. Downtime drops, defects surface early, and the plant runs on numbers instead of hunches."
        chips={[
          '28% less unplanned downtime',
          '21% lower defect rate',
          '99.2% equipment availability',
          'OT and IT integration',
        ]}
        primary={{ label: 'Talk to a manufacturing team', href: '/contact?reason=architecture-call' }}
        secondary={{ label: 'See the case studies', href: '/case-studies' }}
        visual={<FlowScene config={FLOWS['industry-manufacturing']} />}
      />

      {/* Problem band: the plant floor already produces the data */}
      <FoldcraftHero
        geistClass={v4Geist}
        image="/images/v4/case-manufacturing.jpg"
        pill="Why plants fly blind"
        headline={
          <>
            The line already talks.{' '}
            <br className="hidden sm:block" />
            <span className="text-[#60A5FA]">We make it heard.</span>
          </>
        }
        body="SCADA, MES, ERP, and quality systems each hold a slice of the plant, and failures announce themselves in sensor data days before they stop the line. A platform that reads every slice catches them while they are still a work order. We wire OT and IT into one place and keep it running."
        story={{
          metric: { value: '99.97%', label: 'Uptime across 72+ servers' },
          title:
            'Enterprise IT operations automated with DevOps and monitoring. The same operations discipline we bring to plant systems.',
          href: '/case-studies/optimizing-enterprise-it-operations-with-automated-devops-and-monitoring',
          logoSrc: '/brand/aci-infotech-logo-white.png',
          logoAlt: 'ACI Infotech',
        }}
      />

      {/* Offerings */}
      <section className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <SectionHead
            kicker="What we build for manufacturing"
            title={
              <>
                Industry 4.0, with the <span style={{ color: '#1D4ED8' }}>numbers to show&nbsp;it.</span>
              </>
            }
          />
          <OfferingList items={OFFERINGS} />
        </div>
      </section>

      {/* Systems band: the signature OT and IT expertise, restyled */}
      <section className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <SectionHead
            kicker="Manufacturing systems"
            title={<>Fluent on the plant&nbsp;floor.</>}
            sub="The control, execution, and enterprise systems a manufacturing engagement has to integrate with. We connect what you already run."
          />
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CAPABILITIES.map((item) => (
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
                Measured on the line, <span style={{ color: '#1D4ED8' }}>not the&nbsp;slide.</span>
              </>
            }
          />
          <CmsProofCards industry="Manufacturing" fallback={PROOF_FALLBACK} />
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
        title={<>The plant floor is a data&nbsp;source.</>}
        body="Predictive maintenance and quality analytics stand on the same foundation as every other model: governed pipelines that pull sensor, MES, and ERP data into one place and keep it trustworthy. That foundation is our data engineering practice."
        link={{ label: 'Data Engineering', href: '/services/data-engineering' }}
      />

      {/* Why us */}
      <section className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <SectionHead kicker="Why ACI" title={<>Why manufacturers build with&nbsp;us</>} />
          <FactsRow facts={FACTS} />
        </div>
      </section>

      <ClusterPosts keywords={['manufacturing', 'iot', 'predictive maintenance', 'industry 4.0']} />

      <RelatedLinks items={manufacturingRelated} />

      <PageFaq
        kicker="Manufacturing FAQ"
        title={
          <>
            Manufacturing questions,
            <br />
            answered straight.
          </>
        }
        faqs={FAQS}
      />

      <CtaSection label="Let's talk about the plant floor" />
    </div>
  );
}
