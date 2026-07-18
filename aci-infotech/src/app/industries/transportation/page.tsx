import { Metadata } from 'next';
import RelatedLinks from '@/components/seo/RelatedLinks';
import { transportationRelated } from '@/content/related-links';
import ClusterPosts from '@/components/seo/ClusterPosts';
import { transportationFaqs } from '@/content/industry-faqs';
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
  'Transportation technology consulting for carriers and logistics operators: TMS, telematics, and EDI integration, route optimization, and OTIF improvement.';

export const metadata: Metadata = {
  alternates: { canonical: `${siteUrl}/industries/transportation` },
  title: 'Transportation & Logistics Technology',
  description: DESCRIPTION,
  openGraph: {
    title: 'Transportation & Logistics Technology | ACI Infotech',
    description: DESCRIPTION,
    url: `${siteUrl}/industries/transportation`,
    siteName: 'ACI Infotech',
    type: 'website',
    images: DEFAULT_OG_IMAGES,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Transportation & Logistics Technology | ACI Infotech',
    description: DESCRIPTION,
    images: DEFAULT_TWITTER_IMAGES,
  },
};

/* ------------------------------- page data ------------------------------- */

const OFFERINGS = [
  {
    title: 'Route optimization',
    body: 'AI route planning that reads orders, traffic, hours of service, and fuel data, then re-plans through the day. Engagements have cut fuel costs 15% and fit 20% more deliveries into the same day, with real-time re-routing when the road disagrees with the plan.',
    chips: ['AI planning', 'Real-time re-routing', 'Fuel data', 'Hours of service'],
  },
  {
    title: 'Real-time fleet visibility',
    body: 'Every vehicle, shipment, and driver tracked live through IoT integration and dashboards dispatch actually uses. 100% fleet visibility, ETA accuracy above 95%, and exception alerts that fire while there is still time to act.',
    chips: ['IoT & telematics', 'Live dashboards', 'ETA accuracy', 'Exception alerts'],
  },
  {
    title: 'Predictive maintenance',
    body: 'ML models on telematics and maintenance history that forecast service needs before the breakdown. One regional trucking company saw 26% fewer breakdowns, $195K a year in maintenance savings, and vehicle lifespan extended 15%.',
    chips: ['Telematics', 'ML models', 'Maintenance history', 'Asset life'],
  },
  {
    title: 'Supply chain analytics',
    body: 'End-to-end visibility across orders, warehouses, and transit, with demand planning and supplier performance tracking on the same governed data. Inventory has come down 30% where the forecast finally met the shelf.',
    chips: ['Demand planning', 'Inventory optimization', 'Supplier tracking', 'WMS data'],
  },
  {
    title: 'Carbon footprint tracking',
    body: 'Scope 1 through 3 emissions measured from operational data, with automated ESG reporting instead of an annual spreadsheet hunt. Operators have cut emissions 18% once they could see where the carbon actually was.',
    chips: ['Scope 1-3', 'Automated ESG reporting', 'Emissions data', 'Sustainability'],
  },
  {
    title: 'Driver performance & safety',
    body: 'AI coaching on driving behavior that cut accidents 32% and lowered insurance premiums, with scorecards drivers can read without a lawyer. Safer fleet, cheaper coverage, same data.',
    chips: ['Driver scorecards', 'AI coaching', 'Safety analytics', 'Insurance'],
  },
];

// Signature: the logistics capabilities band, kept from the published page.
const CAPABILITIES = [
  { name: 'TMS integration', description: 'All major systems supported' },
  { name: 'ELD compliance', description: 'Hours of service tracking' },
  { name: 'IoT & telematics', description: 'Real-time sensor data' },
  { name: 'EDI/API connectivity', description: 'Partner integrations' },
  { name: 'FMCSA compliance', description: 'Regulatory requirements' },
  { name: 'Multi-modal support', description: 'Truck, rail, air, ocean' },
];

// Fleet results from the published Fortune 500 logistics engagement.
const FLEET_RESULTS = [
  { value: '$250K', label: 'Annual fuel cost savings' },
  { value: '16%', label: 'Improvement in on-time delivery' },
  { value: '18%', label: 'Reduction in empty miles' },
  { value: '26%', label: 'Reduction in breakdowns' },
];

const PROOF_FALLBACK = [
  {
    eyebrow: 'Enterprise Technology Company',
    metric: '99.97%',
    metricLabel: 'Uptime across 72+ servers',
    summary:
      'Automated DevOps and 24/7 monitoring across a complex estate. The operations discipline we bring to platforms that dispatch depends on.',
    href: '/case-studies/optimizing-enterprise-it-operations-with-automated-devops-and-monitoring',
    linkLabel: 'Read the operations story',
    image: '/images/v4/svc-ops.jpg',
  },
  {
    eyebrow: 'Fortune 500 Convenience Retail Chain',
    metric: '30%',
    metricLabel: 'Reduction in data latency',
    summary:
      'A governed Databricks lakehouse across 600+ locations, with real-time inventory visibility and zero downtime through the cutover.',
    href: '/case-studies/databricks-modernization-ai-enablement-for-leading-c-store-chain',
    linkLabel: 'Read the Databricks story',
    image: '/images/v4/case-retail.jpg',
  },
  {
    eyebrow: 'Global Food Services Operator',
    metric: '53',
    metricLabel: 'Countries on one data platform',
    summary:
      'One governed platform for 400,000 employees replacing dozens of regional reporting stacks, with decisions landing 22% faster.',
    href: '/case-studies/global-food-facilities-data-intelligence',
    linkLabel: 'Read the story',
    image: '/images/v4/why-visual.jpg',
  },
];

const PROCESS = [
  {
    title: 'Assess',
    timeframe: 'Weeks 1 to 2',
    body: 'Inventory the estate: TMS, telematics, ELD, EDI feeds, and where OTIF failures actually start. Pick the first lane or region to prove on.',
  },
  {
    title: 'Architect',
    timeframe: 'Weeks 2 to 4',
    body: 'Logistics data core design: one governed view of orders, vehicles, and shipments, with partner feeds handled as first-class inputs.',
  },
  {
    title: 'Build',
    timeframe: 'Weeks 4 to 12',
    body: 'Pipelines from the operational systems into the platform, with the first use case, like ETA accuracy or empty-mile reduction, shipped inside the window.',
  },
  {
    title: 'Prove',
    body: 'Measure fuel, miles, and on-time performance against your current planning, not a vendor benchmark. One lane first, then the network.',
  },
  {
    title: 'Run',
    body: 'Around-the-clock operations under SLAs, because freight does not stop moving at 6pm and neither can the platform.',
  },
];

const FACTS = [
  {
    label: 'Scale',
    line: 'Founded 2006. 1,200+ engineers across 11 global delivery hubs. 500+ enterprise projects.',
  },
  {
    label: 'Compliance',
    line: 'ISO 27001 certified and CMMI Level 3 appraised. ELD and FMCSA records stay audit-ready as a byproduct of normal operations.',
  },
  {
    label: 'Operations',
    line: '24/7 managed operations under published SLAs. The estate stays watched on every shift, in every time zone.',
  },
  {
    label: 'Delivery',
    line: 'The architects who scope the work are the ones who build it. No handoff between the pitch deck and the delivery pod.',
  },
];

const FAQS = transportationFaqs.map((f) => ({ question: f.q, answer: f.a }));

/* --------------------------------- page ---------------------------------- */

export default function TransportationPage() {
  return (
    <div className={`bg-white text-black ${v4Sans}`}>
      <ServiceSchema
        name="Transportation & Logistics Technology"
        description={DESCRIPTION}
        url="/industries/transportation"
        serviceType="Transportation Technology Consulting"
      />
      {/* FAQPage JSON-LD comes from PageFaq below - one per page. */}
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: '/' },
          { name: 'Industries', url: '/industries' },
          { name: 'Transportation & Logistics', url: '/industries/transportation' },
        ]}
      />

      <ServiceHero
        kicker="Transportation & Logistics"
        title={
          <>
            Every shipment on{' '}
            <span style={{ color: '#1D4ED8' }}>one set of&nbsp;numbers</span>
          </>
        }
        lede="Route optimization, real-time fleet visibility, and predictive maintenance for carriers and logistics operators. We wire TMS, telematics, ELD, and EDI data into one governed platform, so dispatch and maintenance run on the same numbers your customers see."
        chips={[
          'TMS & telematics',
          'ELD & FMCSA',
          'EDI partner feeds',
          'OTIF visibility',
        ]}
        primary={{ label: 'Talk to a logistics data architect', href: '/contact?industry=transportation' }}
        secondary={{ label: 'See the case studies', href: '/case-studies' }}
        visual={<FlowScene config={FLOWS['industry-transportation']} />}
      />

      {/* Problem band: margins leak between systems */}
      <FoldcraftHero
        geistClass={v4Geist}
        image="/images/v4/case-transport.jpg"
        pill="Why margins leak"
        headline={
          <>
            Every truck, every load,{' '}
            <br className="hidden sm:block" />
            <span className="text-[#60A5FA]">one version of the truth.</span>
          </>
        }
        body="The TMS, the telematics, the ELD, and the EDI feeds each see part of the journey. We wire them into one governed platform, so exceptions surface while there is still time to act, empty miles show up on a dashboard, and the OTIF number moves before the shipper brings it up."
        story={{
          metric: { value: '99.97%', label: 'Uptime across 72+ servers' },
          title:
            'A complex digital estate kept available around the clock with automated DevOps and monitoring. The operations bar we hold for platforms dispatch depends on.',
          href: '/case-studies/optimizing-enterprise-it-operations-with-automated-devops-and-monitoring',
          logoSrc: '/brand/aci-infotech-logo-white.png',
          logoAlt: 'ACI Infotech',
        }}
      />

      {/* Offerings */}
      <section className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <SectionHead
            kicker="What we build for logistics"
            title={
              <>
                Measured the way shippers{' '}
                <span style={{ color: '#1D4ED8' }}>grade&nbsp;you.</span>
              </>
            }
            sub="OTIF, on-time delivery, cost per mile. Every build starts from the number it is supposed to move."
          />
          <OfferingList items={OFFERINGS} />
        </div>
      </section>

      {/* Signature: capabilities band with fleet results */}
      <section className="border-t border-gray-200 bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <SectionHead
            kicker="Logistics capabilities"
            title={
              <>
                The systems freight{' '}
                <span style={{ color: '#1D4ED8' }}>actually runs&nbsp;on.</span>
              </>
            }
            sub="We integrate what the fleet already carries rather than proposing a rip and replace. Trucks do not get maintenance windows for science projects either."
          />
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CAPABILITIES.map((item) => (
              <div key={item.name} className={`flex items-start gap-3 rounded-2xl bg-white px-5 py-4 ${cardShadow}`}>
                <CheckBadge />
                <div>
                  <p className={`text-[15px] font-semibold leading-snug text-black ${v4Display}`}>{item.name}</p>
                  <p className="mt-1 text-sm text-gray-500">{glueWidow(item.description)}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Fleet results from the published Fortune 500 logistics engagement */}
          <div className="mt-14 grid grid-cols-2 gap-x-8 gap-y-10 border-t border-gray-200 pt-10 lg:grid-cols-4">
            {FLEET_RESULTS.map((metric) => (
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
                Visibility that survives{' '}
                <span style={{ color: '#1D4ED8' }}>the&nbsp;road.</span>
              </>
            }
          />
          <CmsProofCards industry="Transportation" fallback={PROOF_FALLBACK} />
        </div>
      </section>

      {/* Process */}
      <section className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <SectionHead kicker="How an engagement runs" title="Five phases. One lane at a time." />
          <ProcessStrip steps={PROCESS} />
        </div>
      </section>

      {/* Bridge to the managed operations practice */}
      <BridgeBand
        title={<>Freight moves around the clock. So do&nbsp;we.</>}
        body="A logistics platform is only useful while it is up, and freight does not respect business hours. Our managed operations practice runs the estate 24/7 under published SLAs, so the 3am exception gets a staffed desk instead of a voicemail."
        link={{ label: 'Managed Operations', href: '/services/managed-operations' }}
      />

      {/* Why us */}
      <section className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <SectionHead kicker="Why ACI" title={<>Why carriers build with&nbsp;us</>} />
          <FactsRow facts={FACTS} />
        </div>
      </section>

      <ClusterPosts keywords={['logistics', 'transportation', 'fleet', 'telematics', 'supply chain']} />

      <RelatedLinks items={transportationRelated} />

      <PageFaq
        kicker="Transportation & logistics FAQ"
        title={
          <>
            Logistics questions,
            <br />
            answered straight.
          </>
        }
        faqs={FAQS}
      />

      <CtaSection label="Get every shipment on one set of numbers" href="/contact?industry=transportation" />
    </div>
  );
}
