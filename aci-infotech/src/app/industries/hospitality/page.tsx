import { Metadata } from 'next';
import RelatedLinks from '@/components/seo/RelatedLinks';
import { hospitalityRelated } from '@/content/related-links';
import ClusterPosts from '@/components/seo/ClusterPosts';
import { hospitalityFaqs } from '@/content/industry-faqs';
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
  'Hospitality technology consulting for hotels, restaurants, and food service: guest data unification, POS and PMS integration, and loyalty personalization.';

export const metadata: Metadata = {
  alternates: { canonical: `${siteUrl}/industries/hospitality` },
  title: 'Hospitality Technology Solutions',
  description: DESCRIPTION,
  openGraph: {
    title: 'Hospitality Technology Solutions | ACI Infotech',
    description: DESCRIPTION,
    url: `${siteUrl}/industries/hospitality`,
    siteName: 'ACI Infotech',
    type: 'website',
    images: DEFAULT_OG_IMAGES,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hospitality Technology Solutions | ACI Infotech',
    description: DESCRIPTION,
    images: DEFAULT_TWITTER_IMAGES,
  },
};

/* ------------------------------- page data ------------------------------- */

const OFFERINGS = [
  {
    title: 'Global data unification',
    body: 'Data from hundreds of locations worldwide consolidated into a single source of truth with real-time operational visibility. We have run this at full scale: 400,000+ employees connected across 53 countries on one platform.',
    chips: ['Azure', 'Databricks', 'Power BI', 'SAP integration'],
  },
  {
    title: 'Guest 360 & loyalty personalization',
    body: 'Unified guest profiles across properties, brands, and franchisees, powering offers that know about last night’s stay. For one major hotel chain that meant an 18% lift in loyalty engagement, 1.8x ROI on marketing spend, and guests recognized 22% faster.',
    chips: ['Salesforce CDP', 'Snowflake', 'Braze', 'Identity resolution'],
  },
  {
    title: 'Supply chain optimization',
    body: 'Demand forecasting and inventory optimization that cut waste without emptying the shelf. AI-driven ordering has delivered 15% waste reduction and 22% inventory optimization across food service operations.',
    chips: ['Demand forecasting', 'Predictive ordering', 'Inventory optimization', 'Waste reduction'],
  },
  {
    title: 'Workforce management',
    body: 'Staffing levels optimized with AI-driven scheduling that balances labor cost against service quality. The GM sees the labor line move; the team stops getting scheduled against their own availability.',
    chips: ['AI scheduling', 'Labor cost', 'Workforce analytics', 'Forecast accuracy'],
  },
  {
    title: 'Revenue management',
    body: 'Dynamic pricing and revenue optimization on real-time market data and demand signals, with competitive rate intelligence built in. One engagement moved RevPAR up 8%, which is the number the whole exercise answers to.',
    chips: ['Dynamic pricing', 'RevPAR', 'Rate intelligence', 'Demand signals'],
  },
  {
    title: 'Operational analytics',
    body: 'Real-time dashboards and KPI tracking across every location: executive views, location benchmarking, and the franchise scorecards that keep owners and operators reading the same numbers.',
    chips: ['Executive dashboards', 'Location benchmarking', 'Power BI', 'Franchise analytics'],
  },
];

// Signature: the hospitality capabilities band, kept from the published page.
const CAPABILITIES = [
  { name: 'Multi-brand management', description: 'Unified systems across brands' },
  { name: 'Global operations', description: 'Multi-region, multi-currency' },
  { name: 'POS integration', description: 'All major systems supported' },
  { name: 'Food safety compliance', description: 'HACCP and regulatory tracking' },
  { name: 'Guest privacy', description: 'GDPR and CCPA compliant' },
  { name: 'Franchise analytics', description: 'Owner and operator dashboards' },
];

const PROOF_FALLBACK = [
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
    eyebrow: 'Fortune 500 Convenience Retail Chain',
    metric: '30%',
    metricLabel: 'Reduction in data latency',
    summary:
      'A governed Databricks lakehouse across 600+ locations, with real-time inventory visibility and zero downtime through the cutover.',
    href: '/case-studies/databricks-modernization-ai-enablement-for-leading-c-store-chain',
    linkLabel: 'Read the Databricks story',
    image: '/images/v4/svc-data.jpg',
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
    body: 'Inventory the estate: PMS, POS, booking, loyalty, and where guest identity breaks between them. Pick the first metric worth moving.',
  },
  {
    title: 'Architect',
    timeframe: 'Weeks 2 to 4',
    body: 'Platform and identity design, with GDPR and CCPA consent handling decided up front instead of bolted on after the first audit.',
  },
  {
    title: 'Build',
    timeframe: 'Weeks 4 to 12',
    body: 'Integrations from Opera, Toast, and the booking and loyalty channels into one governed platform, shipped in increments.',
  },
  {
    title: 'Prove',
    body: 'Measure against your current program: loyalty lift, RevPAR, waste, labor cost. Baseline first, then report against it.',
  },
  {
    title: 'Run',
    body: 'Around-the-clock operations under SLAs, or a clean handover to your team with runbooks that survive a shift change.',
  },
];

const FACTS = [
  {
    label: 'Scale',
    line: 'Founded 2006. 1,200+ engineers across 11 global delivery hubs. 500+ enterprise projects.',
  },
  {
    label: 'Global reach',
    line: 'We have connected 400,000+ employees across 53 countries onto one data platform for a global food services operator.',
  },
  {
    label: 'Compliance',
    line: 'ISO 27001 certified and CMMI Level 3 appraised. Guest privacy handled to GDPR and CCPA from the first design.',
  },
  {
    label: 'Operations',
    line: '24/7 managed operations under published SLAs. Hotels do not close, and neither does the platform.',
  },
];

const FAQS = hospitalityFaqs.map((f) => ({ question: f.q, answer: f.a }));

/* --------------------------------- page ---------------------------------- */

export default function HospitalityPage() {
  return (
    <div className={`bg-white text-black ${v4Sans}`}>
      <ServiceSchema
        name="Hospitality Technology Solutions"
        description={DESCRIPTION}
        url="/industries/hospitality"
        serviceType="Hospitality Technology Consulting"
      />
      {/* FAQPage JSON-LD comes from PageFaq below - one per page. */}
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: '/' },
          { name: 'Industries', url: '/industries' },
          { name: 'Hospitality & Food Services', url: '/industries/hospitality' },
        ]}
      />

      <ServiceHero
        kicker="Hospitality & Food Services"
        title={
          <>
            One guest record.{' '}
            <span style={{ color: '#1D4ED8' }}>Every&nbsp;property.</span>
          </>
        }
        lede="One guest record across every property and franchise, POS and PMS data that finally reconcile, and loyalty offers that know about last night's stay. Hospitality technology consulting for hotel groups, restaurant brands, and food service operators."
        chips={[
          'PMS & POS integration',
          'Guest 360',
          'GDPR & CCPA',
          'Global scale',
        ]}
        primary={{ label: 'Talk to a hospitality data architect', href: '/contact?industry=hospitality&source=hero' }}
        secondary={{ label: 'See the case studies', href: '/case-studies' }}
        visual={<FlowScene config={FLOWS['industry-hospitality']} />}
      />

      {/* Problem band: the guest the systems forgot */}
      <FoldcraftHero
        geistClass={v4Geist}
        image="/images/v4/ind-hospitality.jpg"
        pill="Why guest data fragments"
        headline={
          <>
            Every guest, recognized{' '}
            <br className="hidden sm:block" />
            <span className="text-[#60A5FA]">at every door.</span>
          </>
        }
        body="The PMS knows the stay, the POS knows the dinner, and loyalty knows the points. We resolve identity across all of it, across every property and franchise, so the front desk, the app, and tomorrow's offer all greet the same person. Personalization runs on one guest record, and the welcome back means it."
        story={{
          metric: { value: '53', label: 'Countries on one data platform' },
          title:
            'One platform for 400,000 employees at a global food services operator, with decisions landing 22% faster.',
          href: '/case-studies/global-food-facilities-data-intelligence',
          logoSrc: '/brand/aci-infotech-logo-white.png',
          logoAlt: 'ACI Infotech',
        }}
      />

      {/* Offerings */}
      <section className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <SectionHead
            kicker="What we build for hospitality"
            title={
              <>
                Aimed at the numbers a{' '}
                <span style={{ color: '#1D4ED8' }}>GM&nbsp;watches.</span>
              </>
            }
            sub="From Opera to Toast, we integrate the systems you already run and point the data at RevPAR, waste, and labor cost."
          />
          <OfferingList items={OFFERINGS} />
        </div>
      </section>

      {/* Signature: capabilities band */}
      <section className="border-t border-gray-200 bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <SectionHead
            kicker="Hospitality capabilities"
            title={
              <>
                Built for both sides of{' '}
                <span style={{ color: '#1D4ED8' }}>the&nbsp;house.</span>
              </>
            }
            sub="The operating realities of running many brands, regions, and franchisees on one platform, handled in the design rather than discovered in month three."
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
        </div>
      </section>

      {/* Proof */}
      <section className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <SectionHead
            kicker="Results"
            title={
              <>
                Global operations, one{' '}
                <span style={{ color: '#1D4ED8' }}>set of&nbsp;numbers.</span>
              </>
            }
          />
          <CmsProofCards industry="Hospitality" fallback={PROOF_FALLBACK} />
        </div>
      </section>

      {/* Process */}
      <section className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <SectionHead kicker="How an engagement runs" title="Five phases. No mystery." />
          <ProcessStrip steps={PROCESS} />
        </div>
      </section>

      {/* Bridge to the MarTech & CDP practice */}
      <BridgeBand
        title={<>The guest record is a marketing engine&nbsp;too.</>}
        body="Once identity resolves across PMS, POS, and loyalty, the same record powers journeys, offers, and campaigns that actually know the guest. That is our MarTech and CDP practice, and hospitality is where it shows off."
        link={{ label: 'MarTech & CDP', href: '/services/martech-cdp' }}
      />

      {/* Why us */}
      <section className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <SectionHead kicker="Why ACI" title={<>Why hospitality groups build with&nbsp;us</>} />
          <FactsRow facts={FACTS} />
        </div>
      </section>

      <ClusterPosts keywords={['hospitality', 'guest', 'cdp', 'loyalty', 'personalization']} />

      <RelatedLinks items={hospitalityRelated} />

      <PageFaq
        kicker="Hospitality FAQ"
        title={
          <>
            Hospitality questions,
            <br />
            answered straight.
          </>
        }
        faqs={FAQS}
      />

      <CtaSection label="Get to one guest record" href="/contact?industry=hospitality&source=cta-section" />
    </div>
  );
}
