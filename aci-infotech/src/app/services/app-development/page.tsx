import { Metadata } from 'next';
import RelatedLinks from '@/components/seo/RelatedLinks';
import { appDevelopmentRelated } from '@/content/related-links';
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
  cardShadow,
  CheckBadge,
  DecisionCircle,
} from '@/components/v4/page/kit';
import CmsProofCards from '@/components/v4/page/CmsProofCards';
import FlowScene from '@/components/v4/page/FlowScene';
import { FLOWS } from '@/components/v4/page/flow-configs';

export const revalidate = 3600;

// Canonical origin: always production, so staging builds can never
// self-canonicalize (see src/lib/site-url.ts).
const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  title: 'Application Development Services',
  description: 'Enterprise application development on top of your data and AI stack. Custom, web, and AI-powered applications built with production rigor, not agency output.',
  keywords: 'enterprise application development, custom application development, AI-powered applications, web application development, legacy modernization, API development, enterprise software engineering',
  alternates: {
    canonical: `${siteUrl}/services/app-development`,
  },
  // Per-page social card. Without this, every share and link preview
  // inherited the homepage's OpenGraph (title, image, and og:url all
  // pointing at /), mis-attributing all 21 service/platform pages.
  openGraph: {
    title: 'Application Development Services | ACI Infotech',
    description: 'Enterprise application development on top of your data and AI stack. Custom, web, and AI-powered applications built with production rigor, not agency output.',
    url: `${siteUrl}/services/app-development`,
    siteName: 'ACI Infotech',
    type: 'website',
    images: DEFAULT_OG_IMAGES,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Application Development Services | ACI Infotech',
    description: 'Enterprise application development on top of your data and AI stack. Custom, web, and AI-powered applications built with production rigor, not agency output.',
    images: DEFAULT_TWITTER_IMAGES,
  },
};

/* ------------------------------- page copy ------------------------------- */

const OFFERINGS = [
  {
    title: 'Enterprise applications',
    body: 'Custom web and line-of-business applications built for Fortune 500 operations. Production-grade from the first sprint: observability, security, and CI/CD go in before the feature code does.',
    chips: ['Next.js', 'React', 'TypeScript', 'Node.js', 'PostgreSQL'],
  },
  {
    title: 'AI-powered applications',
    body: 'Copilots, agents, and recommendation systems with real AI in the loop, not a chat widget bolted onto the corner of the screen. Responses stay grounded in your data and governed, which keeps legal calm.',
    chips: ['Azure OpenAI', 'Anthropic', 'LangChain', 'Vector search'],
  },
  {
    title: 'Custom business applications',
    body: 'Internal tools and workflow systems that retire the spreadsheet empire. Every action audited, every state visible, nothing important living in someone’s inbox.',
    chips: ['React', 'Python', 'FastAPI', '.NET', 'GraphQL'],
  },
  {
    title: 'APIs and integration platforms',
    body: 'REST, GraphQL, and event streams that connect applications, data, and partner systems. Contract-tested and documented, so integrating with you stops being anyone’s least favorite job.',
    chips: ['GraphQL', 'REST', 'gRPC', 'Kafka', 'MuleSoft'],
  },
  {
    title: 'Legacy modernization',
    body: 'Java, .NET, and mainframe estates modernized in strangler-pattern increments. No big-bang rewrite, no weekend cutover heroics. The old system shrinks until turning it off is boring.',
    chips: ['Kubernetes', 'Docker', 'Spring Boot', 'Strangler Pattern'],
  },
  {
    title: 'Platform engineering',
    body: 'Internal developer platforms and delivery tooling so your teams ship faster with fewer 2am surprises. Golden paths and self-service, not a gatekeeping committee.',
    chips: ['Backstage', 'GitHub Actions', 'Terraform', 'ArgoCD'],
  },
];

// Refactor-or-rebuild: two text columns with when-each lists, so this is
// an inline variant of the kit's two-logo DecisionPanel.
const REBUILD_COLS = [
  {
    title: 'Refactor with the Strangler Pattern',
    when: [
      'The system still earns its keep and downtime is expensive',
      'The domain logic is sound; the platform under it is not',
      'You have to keep shipping features during the migration',
    ],
    line: 'New services take over one seam at a time while the legacy estate shrinks in production. Value lands every quarter, not at the end.',
  },
  {
    title: 'Rebuild greenfield',
    when: [
      'The data model no longer matches the business',
      'The framework is out of support and blocking security and hiring',
      'The cost of changing the old code now exceeds replacing it',
    ],
    line: 'Built alongside the old system and parallel-run until the numbers match. Nothing gets switched off on faith.',
  },
];

const PROOF = [
  {
    client_descriptor: 'Fortune 500 Convenience Retail Chain',
    metric: '600+',
    metricLabel: 'Locations with zero downtime',
    summary: 'A digital guest experience and loyalty platform with real-time personalization at the point of sale, built on Salesforce, Braze, and Kafka.',
    href: '/case-studies/databricks-modernization-ai-enablement-for-leading-c-store-chain',
    linkLabel: 'Read the platform story',
  },
  {
    client_descriptor: 'Global Financial Services Firm',
    metric: '90d',
    metricLabel: 'From prototype to production',
    summary: 'Application and ML workloads shipped to production on AKS, with a governed Azure data foundation wired in underneath.',
    href: '/case-studies/driving-enterprise-data-transformation-with-aci-s-azure-lakehouse',
    linkLabel: 'Read the Azure story',
    image: '/images/v4/case-finance.jpg',
  },
  {
    client_descriptor: 'Enterprise Technology Company',
    metric: '99.97%',
    metricLabel: 'Uptime across 72+ servers',
    summary: 'Automated CI/CD, monitoring, load balancing, and centralized logs keep releases moving without taking the estate down.',
    href: '/case-studies/optimizing-enterprise-it-operations-with-automated-devops-and-monitoring',
    linkLabel: 'Read the DevOps story',
    image: '/images/v4/svc-ops.jpg',
  },
];

const PROCESS = [
  {
    title: 'Discover and design',
    timeframe: 'Weeks 1 to 3',
    body: 'The business problem, the user journeys, and the infrastructure the application has to live with. Designed for production from day one.',
  },
  {
    title: 'Architect the foundation',
    timeframe: 'Weeks 4 to 6',
    body: 'CI/CD, observability, security, and data integration before any feature code. Boring on purpose.',
  },
  {
    title: 'Build in increments',
    timeframe: 'Months 2 to 6',
    body: 'Two-week sprints with working software at the end of each. Real users testing, not mockups in Figma.',
  },
  {
    title: 'Launch and stabilize',
    body: 'Production hardening, load testing, runbooks, and an SLA baseline. We stay on the release while you cut over.',
  },
  {
    title: 'Operate and evolve',
    body: 'Post-launch operations, feature evolution, and continuous tuning. We run what we build.',
  },
];

const FACTS = [
  {
    label: 'Delivery',
    line: 'Senior engineers on every engagement, and the architects who scope the build write the code. No switch to a junior bench after the kickoff.',
  },
  {
    label: 'Integration',
    line: 'Applications wired into your SSO, lakehouse, and models from day one, because we build those layers too.',
  },
  {
    label: 'Scale',
    line: 'Founded 2006. 1,200+ engineers across 11 global delivery hubs. 500+ enterprise projects.',
  },
  {
    label: 'Operations',
    line: 'ISO 27001 certified, with 24/7 managed operations and SLA-backed incident response after go-live.',
  },
];

const FAQS = [
  {
    question: 'What makes ACI different from a development agency?',
    answer: 'We are an engineering firm, not an agency. We build applications for enterprises that already have complex data and AI infrastructure, and our builds integrate with that infrastructure natively. No greenfield startup products, no marketing sites, no handoff-and-vanish.',
  },
  {
    question: 'Do you build mobile apps or e-commerce platforms?',
    answer: 'Mobile-first consumer apps and e-commerce platforms are not our focus. We build enterprise applications, AI-powered systems, and internal platforms for Fortune 500 operations. If you need a consumer app, we will say so and point you to a better-fit partner.',
  },
  {
    question: 'What technology stack do you prefer?',
    answer: 'Next.js, React, and TypeScript up front; Node.js, Python, and .NET behind; and whatever cloud and data platform you already run. We meet your stack where it is instead of imposing ours because we happen to like it.',
  },
  {
    question: 'Should we refactor or rebuild our legacy application?',
    answer: 'Refactor with the strangler pattern when the system still earns money and the domain logic is sound. Rebuild when the data model no longer matches the business or the platform is blocking security and hiring. We decide with evidence, and we parallel-run either way before anything old gets switched off.',
  },
  {
    question: 'How long does an enterprise application take to build?',
    answer: 'Foundations take the first six weeks. A first production release typically lands within four to six months, shipped in two-week increments so working software shows up long before the end date.',
  },
  {
    question: 'What happens after the application launches?',
    answer: 'This is where most firms disappear. We do not. Post-launch operations, SLA-backed support, and continuous optimization are part of the engagement. We run what we build.',
  },
  {
    question: 'Can you work inside our existing engineering organization?',
    answer: 'Yes. We slot pods into your rituals, your repos, and your standards, or run the build end to end and hand over with runbooks. Either way, your team owns the system at the end.',
  },
];

/* --------------------------------- page ---------------------------------- */

export default function AppDevelopmentPage() {
  return (
    <div className={`bg-white text-black ${v4Sans}`}>
      <ServiceSchema
        name="Application Development Services"
        description="Enterprise application engineering that sits on top of your data and AI infrastructure. Custom, web, and AI-powered applications built with production-grade rigor."
        url="/services/app-development"
        serviceType="Application Development Consulting"
      />
      {/* FAQPage JSON-LD comes from PageFaq below — one per page. */}
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: '/' },
          { name: 'Services', url: '/services' },
          { name: 'App Development', url: '/services/app-development' },
        ]}
      />

      <ServiceHero
        kicker="Application Development"
        title={
          <>
            Enterprise Application Development That{' '}
            <span style={{ color: '#1D4ED8' }}>Survives&nbsp;Production</span>
          </>
        }
        lede="ACI Infotech builds enterprise applications that hold up after launch: cloud-native systems on Azure and Kubernetes, wired into your SSO, your lakehouse, and your models from day one. We design for the integration layer first, because that is where enterprise apps actually fail, then run what we build under SLA."
        chips={[
          'Senior engineers on every build',
          'Production SLAs',
          'Cloud native on your stack',
          'We run what we build',
        ]}
        primary={{ label: 'Talk to an engineer', href: '/contact' }}
        secondary={{ label: 'See the case studies', href: '/case-studies' }}
        visual={<FlowScene config={FLOWS['app-development']} />}
      />

      {/* Problem band: the integration layer is where apps die */}
      <FoldcraftHero
        geistClass={v4Geist}
        image="/images/v4/svc-data.jpg"
        pill="Wiring first, polish second"
        headline={
          <>
            Apps earn trust at{' '}
            <br className="hidden sm:block" />
            <span className="text-[#60A5FA]">the integration&nbsp;layer.</span>
          </>
        }
        body="Authenticate against your SSO, query the lakehouse gently, call your models with governance attached, and hold steady when 10,000 concurrent users arrive at once. We engineer that wiring first and the polish second, which is why the demo and production behave the same."
        story={{
          metric: { value: '2.5x', label: 'Email engagement lift' },
          title: 'Guest experience and loyalty platform across 600+ locations',
          quote:
            'They flawlessly delivered top-tier digital data on a milestone that mattered to us. Their dedication and expertise made them a genuine partner, not a vendor.',
          role: 'Director of Data and MarTech',
          org: 'A national convenience retailer',
          href: '/case-studies/databricks-modernization-ai-enablement-for-leading-c-store-chain',
        }}
      />

      {/* Scope: what we build, and what we politely do not */}
      <section className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <SectionHead
            kicker="Scope"
            title={
              <>
                What we <span style={{ color: '#1D4ED8' }}>actually&nbsp;build</span>
              </>
            }
          />
          <div className="mt-8 max-w-3xl space-y-5 text-base leading-relaxed text-gray-600 md:text-lg">
            <p>
              Enterprise applications. AI-powered systems. Custom business tools. Not marketing
              sites, not mobile-first consumer products, not MVPs destined for rewrites. We build
              applications that sit on top of complex enterprise infrastructure and integrate with
              your data and AI stack from day one.
            </p>
            <p>
              The distinction matters. Most development firms build greenfield products. We build
              the enterprise applications that run on top of the data platforms and AI systems we
              have already deployed for Fortune 500 clients, or that integrate cleanly with yours.
            </p>
            <p className="font-semibold text-black">
              When your application needs to authenticate against your SSO, query your lakehouse,
              invoke your ML models, and handle 10,000 concurrent users: that is the job we do.
            </p>
          </div>
        </div>
      </section>

      {/* What we build */}
      <section className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <SectionHead
            kicker="What we build"
            title={
              <>
                Production software. <span style={{ color: '#1D4ED8' }}>Six ways&nbsp;in.</span>
              </>
            }
          />
          <OfferingList items={OFFERINGS} />
        </div>
      </section>

      {/* Decision block: refactor or rebuild */}
      <section className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <h2
            className={`text-3xl font-bold tracking-tight text-black sm:text-4xl ${v4Display}`}
            style={{ lineHeight: 1.08 }}
          >
            Refactor or rebuild?
          </h2>
          <p className="mt-5 max-w-3xl text-base leading-relaxed text-gray-600 md:text-lg">
            The most expensive sentence in enterprise software is &ldquo;we should just rewrite
            it.&rdquo; Sometimes it is even true. We decide with evidence, and this is the honest
            split we use.
          </p>

          <div className="mt-12 flex flex-col gap-8 lg:grid lg:grid-cols-[1fr_auto_1fr] lg:items-start lg:gap-10">
            <div className="order-first flex justify-center lg:order-none lg:col-start-2 lg:row-start-1 lg:self-center">
              <DecisionCircle />
            </div>
            {REBUILD_COLS.map((col, i) => (
              <div
                key={col.title}
                className={`rounded-2xl bg-white p-7 md:p-8 ${cardShadow} ${i === 0 ? 'lg:col-start-1' : 'lg:col-start-3'} lg:row-start-1`}
              >
                <h3 className={`text-xl font-semibold text-black md:text-2xl ${v4Display}`}>
                  {col.title}
                </h3>
                <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Pick this when
                </p>
                <ul className="mt-3 space-y-2.5">
                  {col.when.map((w) => (
                    <li key={w} className="flex gap-3 text-[15px] leading-relaxed text-gray-700">
                      <CheckBadge />
                      {w}
                    </li>
                  ))}
                </ul>
                <p className="mt-5 border-t border-gray-200 pt-4 text-sm leading-relaxed text-gray-500">
                  {col.line}
                </p>
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
                Built for enterprises. <span style={{ color: '#1D4ED8' }}>Tested by&nbsp;production.</span>
              </>
            }
          />
          <CmsProofCards
            service="App Development"
            fallback={PROOF.map((p) => ({
              eyebrow: displayClient(p),
              metric: p.metric,
              metricLabel: p.metricLabel,
              summary: p.summary,
              href: p.href,
              linkLabel: p.linkLabel,
              image: p.image,
            }))}
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

      {/* Bridge to managed operations */}
      <BridgeBand
        title="Launch day is the starting line."
        body="Most firms hand over a repo and disappear. Our applications go into managed operations: 24/7 monitoring, SLA-backed incident response, and continuous tuning by the team that wrote the code. The 3am page goes to us."
        link={{ label: 'Managed Operations', href: '/services/managed-operations' }}
      />

      {/* Why ACI */}
      <section className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <SectionHead kicker="Why ACI" title="Why enterprises pick us for applications" />
          <FactsRow facts={FACTS} />
        </div>
      </section>

      <PageFaq
        kicker="Questions"
        title={
          <>
            Build questions,
            <br />
            <span style={{ color: '#1D4ED8' }}>answered straight.</span>
          </>
        }
        sub="The questions we hear most before an application engagement. Anything else belongs in a conversation."
        faqs={FAQS}
      />

      <ClusterPosts keywords={['application development', 'app development', 'software engineering', 'modernization', 'api']} />

      <RelatedLinks items={appDevelopmentRelated} />

      {/* Closing CTA: video stage, one button, nothing else */}
      <CtaSection label="Let's scope the build" />
    </div>
  );
}
