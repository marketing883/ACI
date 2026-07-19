import { Metadata } from 'next';
import RelatedLinks from '@/components/seo/RelatedLinks';
import { retailRelated } from '@/content/related-links';
import ClusterPosts from '@/components/seo/ClusterPosts';
import { retailFaqs } from '@/content/industry-faqs';
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
  'Enterprise data, AI, and cloud solutions for retailers. Customer data platforms, demand forecasting, personalization, and supply chain optimization.';

export const metadata: Metadata = {
  alternates: { canonical: `${siteUrl}/industries/retail` },
  title: 'Retail & Consumer Technology Solutions',
  description: DESCRIPTION,
  openGraph: {
    title: 'Retail & Consumer Technology Solutions | ACI Infotech',
    description: DESCRIPTION,
    url: `${siteUrl}/industries/retail`,
    siteName: 'ACI Infotech',
    type: 'website',
    images: DEFAULT_OG_IMAGES,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Retail & Consumer Technology Solutions | ACI Infotech',
    description: DESCRIPTION,
    images: DEFAULT_TWITTER_IMAGES,
  },
};

/* ------------------------------- page data ------------------------------- */

const OFFERINGS = [
  {
    title: 'Customer data platform',
    body: 'Customer data unified across POS, ecommerce, and loyalty into one governed profile with real-time segmentation. Everything downstream, from offers to forecasts, depends on getting this record right first.',
    chips: ['Salesforce', 'Snowflake', 'Braze'],
  },
  {
    title: 'Personalization at scale',
    body: 'ML-driven recommendations and offers delivered in real time, measured against holdouts. Where we have run it: 35% engagement lift and 20% higher conversion, against baseline rather than a brochure.',
    chips: ['Braze', 'Salesforce Marketing Cloud', 'Databricks'],
  },
  {
    title: 'Demand forecasting',
    body: 'Spreadsheet forecasts replaced with models that read sales, promotions, and seasonality. One program reached 85% forecast accuracy, cut stockouts 23%, and returned $220K+ a year in inventory savings.',
    chips: ['Databricks', 'MLflow', 'Python'],
  },
  {
    title: 'Supply chain analytics',
    body: 'Real-time visibility from distribution center to shelf, with predictive alerts that surface disruptions while there is still time to reroute. Works with the planning systems you already run.',
    chips: ['Kafka', 'Snowflake', 'Blue Yonder', 'Kinaxis'],
  },
  {
    title: 'Omnichannel analytics',
    body: 'Online, mobile, and in-store data stitched into one journey, with cross-channel attribution and store performance on the same governed numbers. One customer, one view, whichever door they came in through.',
    chips: ['Snowflake', 'dbt', 'Power BI'],
  },
  {
    title: 'Pricing optimization',
    body: 'Dynamic pricing and markdown optimization with competitive monitoring built in. Engagements typically land a 3 to 5% margin lift, measured against your current price book.',
    chips: ['Databricks', 'Python'],
  },
];

const CAPABILITIES = [
  { name: 'POS Data Integration', description: 'Real-time transaction data' },
  { name: 'Loyalty Analytics', description: 'Customer lifetime value' },
  { name: 'E-commerce Platforms', description: 'Shopify, Magento, custom' },
  { name: 'Inventory Systems', description: 'SAP, Oracle, Manhattan' },
  { name: 'Marketing Platforms', description: 'Salesforce, Adobe, Braze' },
  { name: 'Supply Chain', description: 'Blue Yonder, Kinaxis' },
];

const PROOF_FALLBACK = [
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
      'One platform for 400,000 employees replacing dozens of regional reporting stacks, with decisions landing 22% faster.',
    href: '/case-studies/global-food-facilities-data-intelligence',
    linkLabel: 'Read the story',
    image: '/images/v4/case-retail.jpg',
  },
  {
    eyebrow: 'Global CPG & Beverage Leader',
    metric: '94%',
    metricLabel: 'Brand manager adoption',
    summary:
      'Self-service analytics across a global consumer portfolio, cutting campaign analysis from three weeks to four hours.',
    href: '/case-studies/global-cpg-self-service-analytics-brand-managers',
    linkLabel: 'Read the CPG story',
    image: '/images/v4/svc-data.jpg',
  },
];

const PROCESS = [
  {
    title: 'Map',
    body: 'Inventory the customer touchpoints and data sources, then pick the use case that moves a number you care about: stockouts, conversion, margin.',
  },
  {
    title: 'Design',
    body: 'Data foundation, identity model, and activation plan. Snowflake or Databricks underneath, your marketing stack on top.',
  },
  {
    title: 'Build',
    body: 'Pipelines and the unified customer record shipped in increments. A first governed customer view and a working use case land inside the 8 to 12 weeks we quote.',
  },
  {
    title: 'Prove',
    body: 'Lift measured against holdouts and your current baseline before anything is declared a win. Load-tested for peak before the season, not during it.',
  },
  {
    title: 'Scale',
    body: 'Roll out across banners, channels, and regions, with 24/7 operations under SLA so the platform holds through the holiday spike.',
  },
];

const FACTS = [
  {
    label: 'In production',
    line: '600+ retail locations running on a lakehouse we built, with 30% lower data latency and zero downtime through the cutover.',
  },
  {
    label: 'Measured',
    line: 'Every build is measured against a revenue or cost baseline. Forecast accuracy, engagement lift, and margin are reported, not implied.',
  },
  {
    label: 'Scale',
    line: 'Founded 2006. 1,200+ engineers across 11 global delivery hubs. 500+ enterprise projects.',
  },
  {
    label: 'Operations',
    line: 'ISO 27001 certified, with 24/7 managed operations under published SLAs. Peak season is rehearsed, not hoped for.',
  },
];

const FAQS = retailFaqs.map((f) => ({ question: f.q, answer: f.a }));

/* --------------------------------- page ---------------------------------- */

export default function RetailPage() {
  return (
    <div className={`bg-white text-black ${v4Sans}`}>
      <ServiceSchema
        name="Retail & Consumer Technology Solutions"
        description={DESCRIPTION}
        url="/industries/retail"
        serviceType="Retail Technology Consulting"
      />
      {/* FAQPage JSON-LD comes from PageFaq below, one per page. */}
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: '/' },
          { name: 'Industries', url: '/industries' },
          { name: 'Retail', url: '/industries/retail' },
        ]}
      />

      <ServiceHero
        kicker="Retail & Consumer"
        title={
          <>
            Retail data at the speed{' '}
            <span style={{ color: '#1D4ED8' }}>of the&nbsp;shelf</span>
          </>
        }
        lede="From convenience chains to department stores, we put retail data to work: one customer record, forecasts that hold, and personalization that keeps up in real time. Every build spans the customer journey from acquisition to loyalty, and every build is measured against a revenue or cost baseline."
        chips={[
          '600+ locations in production',
          '30% lower data latency',
          '85% forecast accuracy',
          '23% fewer stockouts',
        ]}
        primary={{ label: 'Talk to a retail data team', href: '/contact?industry=retail&source=hero' }}
        secondary={{ label: 'See the case studies', href: '/case-studies' }}
        visual={<FlowScene config={FLOWS['industry-retail']} />}
      />

      {/* Problem band: the batch is too slow for the shelf */}
      <FoldcraftHero
        geistClass={v4Geist}
        image="/images/v4/case-retail.jpg"
        pill="Why retail data stalls"
        headline={
          <>
            The shelf moves faster{' '}
            <br className="hidden sm:block" />
            <span className="text-[#60A5FA]">than the batch.</span>
          </>
        }
        body="POS, ecommerce, and loyalty each hold a piece of the customer. Forecasts run on spreadsheets, and by the time the nightly batch lands, the moment has passed. Retail decisions are real-time decisions, so the data has to be too."
        story={{
          metric: { value: '30%', label: 'Reduction in data latency' },
          title:
            'A governed Databricks lakehouse across 600+ locations, with real-time inventory visibility and zero downtime through the cutover.',
          href: '/case-studies/databricks-modernization-ai-enablement-for-leading-c-store-chain',
          logoSrc: '/brand/databricks-color.svg',
          logoAlt: 'Databricks',
        }}
      />

      {/* Offerings */}
      <section className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <SectionHead
            kicker="What we build for retail"
            title={
              <>
                From first visit to <span style={{ color: '#1D4ED8' }}>loyal&nbsp;customer.</span>
              </>
            }
          />
          <OfferingList items={OFFERINGS} />
        </div>
      </section>

      {/* Systems band: the signature retail stack expertise, restyled */}
      <section className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <SectionHead
            kicker="Retail systems"
            title={<>We speak your&nbsp;stack.</>}
            sub="The systems a retail engagement actually has to integrate with. We connect what you already run instead of proposing a rip and replace."
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
                Retail results, measured <span style={{ color: '#1D4ED8' }}>at the&nbsp;register.</span>
              </>
            }
          />
          <CmsProofCards
            industry="Retail"
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
        title={<>One customer record runs&nbsp;it&nbsp;all.</>}
        body="Personalization, forecasting, and loyalty all read from the same place: a unified customer record with identity resolution that actually holds. Building and activating that record is our MarTech and CDP practice."
        link={{ label: 'MarTech & CDP', href: '/services/martech-cdp' }}
      />

      {/* Why us */}
      <section className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <SectionHead kicker="Why ACI" title={<>Why retailers build with&nbsp;us</>} />
          <FactsRow facts={FACTS} />
        </div>
      </section>

      <ClusterPosts keywords={['retail', 'personalization', 'cdp', 'demand forecasting']} />

      <RelatedLinks items={retailRelated} />

      <PageFaq
        kicker="Retail FAQ"
        title={
          <>
            Retail questions,
            <br />
            answered straight.
          </>
        }
        faqs={FAQS}
      />

      <CtaSection label="Let's talk retail data" href="/contact?industry=retail&source=cta-section" />
    </div>
  );
}
