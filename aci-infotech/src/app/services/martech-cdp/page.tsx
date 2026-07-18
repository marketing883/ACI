import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import RelatedLinks from '@/components/seo/RelatedLinks';
import { martechCdpRelated } from '@/content/related-links';
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
  title: 'MarTech & CDP Services',
  description: 'Customer 360 that actually works. Salesforce Marketing Cloud, Adobe Experience Platform, Braze implementations. Real-time personalization at scale.',
  keywords: 'CDP implementation, Salesforce Marketing Cloud, Adobe Experience Platform, Braze, customer data platform, martech consulting',
  alternates: {
    canonical: `${siteUrl}/services/martech-cdp`,
  },
  // Per-page social card. Without this, every share and link preview
  // inherited the homepage's OpenGraph (title, image, and og:url all
  // pointing at /), mis-attributing all 21 service/platform pages.
  openGraph: {
    title: 'MarTech & CDP Services | ACI Infotech',
    description: 'Customer 360 that actually works. Salesforce Marketing Cloud, Adobe Experience Platform, Braze implementations. Real-time personalization at scale.',
    url: `${siteUrl}/services/martech-cdp`,
    siteName: 'ACI Infotech',
    type: 'website',
    images: DEFAULT_OG_IMAGES,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MarTech & CDP Services | ACI Infotech',
    description: 'Customer 360 that actually works. Salesforce Marketing Cloud, Adobe Experience Platform, Braze implementations. Real-time personalization at scale.',
    images: DEFAULT_TWITTER_IMAGES,
  },
};

/* ------------------------------- page copy ------------------------------- */

const OFFERINGS = [
  {
    title: 'CDP implementation',
    body: 'Salesforce Data Cloud, Adobe Real-Time CDP, or Segment, implemented end to end: sources connected, identities resolved, duplicates merged into one record per human. Consent rides along with every profile, so activation stays legal in every region you sell in.',
    chips: ['Salesforce Data Cloud', 'Adobe RT-CDP', 'Segment', 'mParticle'],
  },
  {
    title: 'Journey orchestration',
    body: 'Multi-channel journeys in Journey Builder, Adobe Journey Optimizer, or Braze Canvas that react to what the customer just did, not what last month’s batch said. Entry and exit rules get tested against holdout groups, so lift is measured, not assumed.',
    chips: ['Journey Builder', 'Adobe Journey Optimizer', 'Braze Canvas'],
  },
  {
    title: 'Personalization engines',
    body: 'Einstein, Adobe Sensei, and Braze tuned for web, email, and app. Recommendations and next best action run off the unified profile, which is why the identity work comes first. Personalizing on bad identity just gets the wrong name in the greeting faster.',
    chips: ['Einstein AI', 'Adobe Sensei', 'Braze', 'Dynamic Yield'],
  },
  {
    title: 'Email and messaging',
    body: 'Marketing Cloud and Braze programs with deliverability treated as engineering: authentication, warm-up, list hygiene, and suppression logic. Dynamic content and A/B testing come standard, not as a phase two.',
    chips: ['Salesforce Marketing Cloud', 'Braze', 'Klaviyo', 'SendGrid'],
  },
  {
    title: 'Loyalty and CRM',
    body: 'Loyalty programs wired into the CRM and the CDP, so points, tiers, and offers read from the same profile the campaigns use. Service sees what marketing promised. That alone ends a lot of internal arguments.',
    chips: ['Salesforce CRM', 'Loyalty Management', 'Service Cloud'],
  },
  {
    title: 'Analytics and attribution',
    body: 'Multi-touch attribution and campaign analytics your finance team can interrogate. We would rather show a smaller number that holds up than a big one that dies in the quarterly review.',
    chips: ['Adobe Analytics', 'Google Analytics 4', 'Tableau', 'Looker'],
  },
];

// CDP chooser: three columns instead of the kit's two, and text headers
// instead of logos, so this stays an inline variant of DecisionPanel.
const CDP_COLUMNS = ['Salesforce Data Cloud', 'Adobe RT-CDP', 'Lakehouse build'];

const CDP_ROWS: { need: string; picks: [boolean, boolean, boolean] }[] = [
  { need: 'Your CRM, service desk, and commerce already live in Salesforce', picks: [true, false, false] },
  { need: 'Adobe carries your content, journeys, and analytics', picks: [false, true, false] },
  { need: 'A governed lakehouse already holds the customer data', picks: [false, false, true] },
  { need: 'Activation this quarter matters more than owning the stack', picks: [true, true, false] },
  { need: 'Marketing and data science must share one identity graph', picks: [false, false, true] },
];

const PROOF = [
  {
    client_descriptor: 'Fortune 500 Convenience Retail Chain',
    metric: '15%',
    metricLabel: 'Improvement in promotion effectiveness',
    summary: 'Salesforce and Braze activated on a Databricks identity spine across 600+ locations. Email engagement lifted 2.5x, and data latency dropped 30%.',
    href: '/case-studies/databricks-modernization-ai-enablement-for-leading-c-store-chain',
    linkLabel: 'Read the retail story',
  },
  {
    client_descriptor: 'Global Hospitality and Resort Brand',
    metric: '20%',
    metricLabel: 'Increase in bookings',
    summary: 'Loyalty data unified with Marketing Cloud and Data Cloud into one guest profile, feeding real-time personalization across the booking journey.',
    href: '/industries/hospitality',
    linkLabel: 'See our hospitality work',
  },
];

const PROCESS = [
  {
    title: 'Map',
    timeframe: 'Weeks 1 to 4',
    body: 'Inventory the sources, audit the identity keys and consent state, and pick the first activation use case worth real money.',
  },
  {
    title: 'Design',
    timeframe: 'Weeks 3 to 8',
    body: 'CDP choice, identity model, consent architecture, and an integration plan your data team signs off on.',
  },
  {
    title: 'Connect',
    timeframe: 'Months 2 to 5',
    body: 'Sources flow in, match rules run, and unified profiles start building. Match rates are reported from the first week.',
  },
  {
    title: 'Activate',
    timeframe: 'Months 4 to 7',
    body: 'First journeys and segments go live, measured against holdout groups so the lift is real.',
  },
  {
    title: 'Scale',
    body: 'More channels, more use cases. Enterprise implementations land in 6 to 9 months; simpler stacks come in well under that.',
  },
];

const FACTS = [
  {
    label: 'Delivery',
    line: 'The architects who design your identity model build the integrations. No switch between the pitch team and the delivery pod.',
  },
  {
    label: 'Partnerships',
    line: 'Salesforce partner with an Agentforce practice, Braze Alloy partner, and Adobe Solution Partner.',
  },
  {
    label: 'Foundations',
    line: 'We are data engineers first. Your CDP sits on identity and pipeline work we do for a living, not on hope.',
  },
  {
    label: 'Scale',
    line: 'Founded 2006. 1,200+ engineers across 11 global delivery hubs. 500+ enterprise projects.',
  },
];

const FAQS = [
  {
    question: 'What is a customer data platform?',
    answer: 'Software that pulls customer records from every system you run, resolves them to one profile per human, and serves that profile to marketing, service, and analytics in real time. The hard part is not the software. It is the identity and consent work underneath it.',
  },
  {
    question: 'Which CDP should we choose?',
    answer: 'It follows your stack. Salesforce Data Cloud for Salesforce-heavy orgs, Adobe Real-Time CDP for Adobe shops, Segment when you want flexibility, and a composable build on the lakehouse when you already govern your data and do not want a second copy of it. We implement all of them, so the recommendation follows your architecture.',
  },
  {
    question: 'How long does a CDP implementation take?',
    answer: 'Enterprise implementations run 6 to 9 months end to end. Simpler deployments come in faster. The first activation use case usually goes live around month four; we do not save all the value for the final reveal.',
  },
  {
    question: 'Do we need a CDP if we already have a lakehouse?',
    answer: 'Maybe not a packaged one. If your lakehouse is governed and the identity graph lives there, a composable CDP can activate straight from it. If marketing needs tooling and speed more than architecture, a packaged CDP still earns its place.',
  },
  {
    question: 'How do you handle privacy and consent?',
    answer: 'Consent management, data residency controls, and GDPR and CCPA compliance are designed in from day one, not patched on before an audit. Every activation reads the consent record before it fires.',
  },
  {
    question: 'Can you work with our existing marketing tools?',
    answer: 'Yes. We integrate with the stack you run and add capability incrementally. Rip and replace is a last resort, not a sales motion.',
  },
  {
    question: 'How do you measure whether it worked?',
    answer: 'Match rates, profile coverage, and activation lift against holdout groups. If a journey cannot beat its holdout, we say so and fix the journey instead of the reporting.',
  },
];

/* --------------------------------- page ---------------------------------- */

export default function MarTechCDPPage() {
  return (
    <div className={`bg-white text-black ${v4Sans}`}>
      <ServiceSchema
        name="MarTech & CDP Services"
        description="Customer 360 that actually works. Salesforce Marketing Cloud, Adobe Experience Platform, Braze implementations."
        url="/services/martech-cdp"
        serviceType="Marketing Technology Consulting"
      />
      {/* FAQPage JSON-LD comes from PageFaq below — one per page. */}
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: '/' },
          { name: 'Services', url: '/services' },
          { name: 'MarTech & CDP', url: '/services/martech-cdp' },
        ]}
      />

      <ServiceHero
        kicker="MarTech & CDP"
        title={
          <>
            MarTech &amp; CDP: Customer 360 That{' '}
            <span style={{ color: '#1D4ED8' }}>Actually&nbsp;Works</span>
          </>
        }
        lede="ACI Infotech builds customer data platforms that give marketing one identity-resolved profile per customer: Salesforce Data Cloud, Adobe Real-Time CDP, or a composable build on your lakehouse. We connect the sources, resolve the identities, carry consent through every hop, and hand your team segments that update in real time, not monthly list pulls."
        chips={[
          'Salesforce Agentforce partner',
          'Braze Alloy partner',
          'Adobe Solution Partner',
          'GDPR and CCPA built in',
        ]}
        primary={{ label: 'Talk to a MarTech engineer', href: '/contact' }}
        secondary={{ label: 'See the case studies', href: '/case-studies' }}
        logos={[
          { src: '/brand/salesforce-color.png', alt: 'Salesforce' },
          { src: '/images/Solution-Partners/braze.png', alt: 'Braze' },
        ]}
        logosCaption="Salesforce partner with an Agentforce practice, and a Braze Alloy partner. We implement what we recommend."
      />

      {/* Problem band: identity, consent, and activation as the real fight */}
      <FoldcraftHero
        geistClass={v4Geist}
        pill="Why customer 360 fails"
        headline={
          <>
            Your customer exists in <span className="text-[#60A5FA]">12 systems.</span>{' '}
            <br className="hidden sm:block" />
            None of them agree.
          </>
        }
        body="Web, app, email, store, loyalty, service desk: every channel keeps its own version of the same person. Identity never resolves, consent lives in a spreadsheet, and activation means exporting a CSV at 5pm. A CDP only fixes this when the identity resolution and the governance under it are engineered properly. That part is the job."
        story={{
          metric: { value: '2.5x', label: 'Email engagement lift' },
          title: 'One customer profile across 600+ retail locations',
          quote:
            'They flawlessly delivered top-tier digital data on a milestone that mattered to us. Their dedication and expertise made them a genuine partner, not a vendor.',
          role: 'Director of Data and MarTech',
          org: 'A national convenience retailer',
          href: '/case-studies/databricks-modernization-ai-enablement-for-leading-c-store-chain',
        }}
      />

      {/* What we build */}
      <section className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <SectionHead
            kicker="What we build"
            title={
              <>
                One customer profile. <span style={{ color: '#1D4ED8' }}>Six ways to&nbsp;use it.</span>
              </>
            }
          />
          <OfferingList items={OFFERINGS} />
        </div>
      </section>

      {/* Decision block: the CDP chooser, three columns (inline variant of
          the kit's DecisionPanel, which supports two logo columns) */}
      <section className="border-t border-gray-200 bg-gray-50">
        <div className="mx-auto max-w-5xl px-6 py-16 md:py-20">
          <h2
            className={`text-3xl font-bold tracking-tight text-black sm:text-4xl ${v4Display}`}
            style={{ lineHeight: 1.08 }}
          >
            Which CDP? Sometimes none.
          </h2>
          <p className="mt-5 max-w-3xl text-base leading-relaxed text-gray-600 md:text-lg">
            The honest answer starts with the stack you already run. Salesforce Data Cloud earns
            its keep when the customer record already lives in Salesforce. Adobe Real-Time CDP fits
            Adobe-first experience teams. And if you already run a governed lakehouse, a composable
            build can activate straight from it and skip the second copy of your data entirely. We
            implement all three, so the recommendation follows your architecture, not a reseller
            quota.
          </p>

          <div className="mt-9 overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-left text-sm">
              <thead>
                <tr>
                  <th className="w-2/5 border-b border-gray-200 pb-4 text-xs font-semibold uppercase tracking-wide text-gray-400">
                    The job at hand
                  </th>
                  {CDP_COLUMNS.map((col) => (
                    <th
                      key={col}
                      className={`border-b border-gray-200 pb-4 text-center text-sm font-semibold text-black ${v4Display}`}
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {CDP_ROWS.map((row) => (
                  <tr key={row.need}>
                    <td className="border-b border-gray-200 py-4 pr-6 font-medium text-gray-800">{row.need}</td>
                    {row.picks.map((on, i) => (
                      <td key={CDP_COLUMNS[i]} className="border-b border-gray-200 py-4">
                        <span
                          aria-hidden="true"
                          className="mx-auto block h-3 w-3 rounded-full"
                          style={{ background: on ? '#1D4ED8' : 'rgba(0,0,0,0.08)' }}
                        />
                        <span className="sr-only">{on ? `Fits ${CDP_COLUMNS[i]}` : ''}</span>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Proof: two case studies, so a two-wide inline variant of
          ProofCards plus a pointer card instead of a lopsided 3-grid */}
      <section className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <SectionHead
            kicker="Results"
            title={
              <>
                Measured in production, <span style={{ color: '#1D4ED8' }}>not in the&nbsp;deck.</span>
              </>
            }
          />
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {PROOF.map((card) => (
              <Link
                key={card.href}
                href={card.href}
                className="group flex flex-col rounded-2xl border border-white/10 bg-[#0b1220] p-7 transition-colors duration-300 hover:border-white/25 md:p-8"
              >
                <p className="text-[11px] font-semibold uppercase tracking-wide text-white/50">
                  {displayClient(card)}
                </p>
                <div className="mt-5 flex items-baseline gap-2">
                  <span className={`text-5xl font-bold leading-none text-[#84CC16] ${v4Display}`}>
                    {card.metric}
                  </span>
                </div>
                <p className="mt-2 text-[11px] font-semibold uppercase leading-tight tracking-wide text-white/50">
                  {card.metricLabel}
                </p>
                <p className="mt-5 flex-1 text-sm leading-relaxed text-white/75">{card.summary}</p>
                <span className="mt-6 flex items-center gap-1 text-xs font-semibold text-[#84CC16]">
                  {card.linkLabel}
                  <ArrowUpRight
                    size={14}
                    className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </span>
              </Link>
            ))}
          </div>
          <p className="mt-6 max-w-2xl text-sm leading-relaxed text-gray-500">
            More customer-360 work shows up across our retail and hospitality engagements, usually
            one layer down in the data platform.{' '}
            <Link href="/case-studies" className="font-semibold text-blue-700">
              Browse all case studies
            </Link>
            .
          </p>
        </div>
      </section>

      {/* Process */}
      <section className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <SectionHead kicker="How an engagement runs" title="Five phases. Honest ranges." />
          <ProcessStrip steps={PROCESS} />
        </div>
      </section>

      {/* Bridge to data engineering */}
      <BridgeBand
        title="A CDP is only as good as the pipes under it."
        body="Identity resolution fails quietly when the source data is late, duplicated, or wrong. Our data engineering practice builds the lakehouse, pipelines, and quality gates that make a customer 360 trustworthy, which is why most of our MarTech work starts one layer down."
        link={{ label: 'Data Engineering', href: '/services/data-engineering' }}
      />

      {/* Why ACI */}
      <section className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <SectionHead kicker="Why ACI" title="Why enterprises pick us for MarTech" />
          <FactsRow facts={FACTS} />
        </div>
      </section>

      <PageFaq
        kicker="Questions"
        title={
          <>
            MarTech questions,
            <br />
            <span style={{ color: '#1D4ED8' }}>answered straight.</span>
          </>
        }
        sub="The questions we hear most before a CDP engagement. Anything else belongs in a conversation."
        faqs={FAQS}
      />

      <ClusterPosts keywords={['martech', 'cdp', 'customer data platform', 'personalization', 'customer 360']} />

      <RelatedLinks items={martechCdpRelated} />

      {/* Closing CTA: video stage, one button, nothing else */}
      <CtaSection label="Let's unify your customer data" />
    </div>
  );
}
