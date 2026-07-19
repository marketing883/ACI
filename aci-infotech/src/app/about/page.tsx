import { Metadata } from 'next';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { BreadcrumbSchema } from '@/components/seo/StructuredData';
import { getSiteUrl } from '@/lib/site-url';
import { DEFAULT_OG_IMAGES, DEFAULT_TWITTER_IMAGES } from '@/lib/seo/og';
import { v4Sans, v4Display } from '@/components/v4/fonts';
import CtaSection from '@/components/v4/hero/CtaSection';
import {
  SectionHead,
  ServiceHero,
  CheckBadge,
  BridgeBand,
  FactsRow,
  cardShadow,
  glueWidow,
} from '@/components/v4/page/kit';

// Canonical origin: always production, so staging builds can never
// self-canonicalize (see src/lib/site-url.ts).
const siteUrl = getSiteUrl();

const ABOUT_TITLE = 'About ACI Infotech | The Engineers Behind Enterprise Modernization';
const ABOUT_DESCRIPTION =
  'Founded 2006. 500+ large enterprise projects delivered building data platforms, AI systems, and cloud architectures. We answer the 2am call.';

export const metadata: Metadata = {
  title: ABOUT_TITLE,
  description: ABOUT_DESCRIPTION,
  keywords: 'enterprise technology consulting, data engineering company, AI ML consulting, Fortune 500 technology partner, production-grade engineering',
  alternates: {
    canonical: `${siteUrl}/about`,
  },
  // Per-page social card: without this the page inherited the root
  // layout's OpenGraph and every share rendered the homepage card.
  openGraph: {
    title: ABOUT_TITLE,
    description: ABOUT_DESCRIPTION,
    url: `${siteUrl}/about`,
    siteName: 'ACI Infotech',
    type: 'website',
    images: DEFAULT_OG_IMAGES,
  },
  twitter: {
    card: 'summary_large_image',
    title: ABOUT_TITLE,
    description: ABOUT_DESCRIPTION,
    images: DEFAULT_TWITTER_IMAGES,
  },
};

/* ------------------------------- page data ------------------------------- */

// Company facts. Same numbers that appear on every practice page:
// founded 2006, 1,200+ engineers, 500+ projects, 11 hubs, plus the
// certifications held right now.
const COMPANY_FACTS = [
  {
    label: 'Founded',
    line: '2006, in Monmouth Junction, New Jersey. Teams across the USA, India, Europe, and APAC.',
  },
  {
    label: 'Scale',
    line: '1,200+ engineers across 11 global delivery hubs. Product, data, apps, QA, and SRE working as one unit.',
  },
  {
    label: 'Delivery',
    line: '500+ large enterprise projects. Banking, healthcare, retail, manufacturing, and hospitality.',
  },
  {
    label: 'Credentials',
    line: 'ISO 27001:2022 certified and CMMI Level 3 appraised. Great Place to Work Certified 2024-25.',
  },
];

const TIMELINE = [
  {
    marker: '2006',
    title: 'Founded',
    body: 'ACI Infotech starts in Monmouth Junction, New Jersey, with a small team of passionate engineers.',
  },
  {
    marker: '20 yrs',
    title: 'One discipline',
    body: 'Twenty years spent on one thing: production-grade enterprise systems. Code that runs in production, carries SLAs, and delivers measurable ROI.',
  },
  {
    marker: '500+',
    title: 'Enterprise projects',
    body: 'Delivered for enterprise companies in banking, healthcare, retail, manufacturing, and hospitality.',
  },
  {
    marker: 'Today',
    title: 'Global delivery',
    body: '1,200+ experts across 11 delivery hubs in the USA, India, Europe, and APAC.',
  },
];

const PRINCIPLES = [
  {
    number: '01',
    title: 'Outcome-Engineered',
    description: 'Every engagement starts with baseline metrics and ends with audited results. We align on KPIs for time to value, cost to serve, and reliability.',
    proofPoints: [
      'Measurable KPIs defined upfront',
      'Executive dashboards for visibility',
      'Value realized at close, documented',
    ],
  },
  {
    number: '02',
    title: 'Governed by Design',
    description: 'Security, compliance, and lineage are built into data, models, and workflows. Policies as code. Full observability. Audit-ready by default.',
    proofPoints: [
      'Policy guardrails automated',
      'Data quality gates at every stage',
      'End-to-end lineage tracking',
      'SOC-friendly audit logs',
    ],
  },
  {
    number: '03',
    title: 'Built for Scale',
    description: 'Cross-functional pods that ship fast and stand behind SLAs. Product, data, apps, QA, and SRE work as one unit.',
    proofPoints: [
      'Faster release cycles',
      'Lower MTTR',
      'SLA-backed operations',
      'Production support included',
    ],
  },
];

const CAPABILITIES = [
  {
    title: 'Data Resilience',
    description: 'Unify your data estate and make it AI-ready with platform-native observability, lineage, and policy controls.',
    outcomes: ['Executive-grade dashboards', 'Real-time decisioning', 'Compliant analytics', 'High-trust data products'],
    technologies: ['Databricks', 'Snowflake', 'AWS Glue', 'Azure Data Factory', 'dbt', 'Dynatrace'],
  },
  {
    title: 'Observability & Platform Reliability',
    description: 'Instrument apps, data pipelines, and infrastructure end to end. Set SLOs, trace latency across the stack.',
    outcomes: ['Fewer Sev1 incidents', 'Faster MTTR', 'Release stability', 'Performance SLOs met'],
    technologies: ['Dynatrace', 'Datadog', 'Prometheus', 'Grafana', 'PagerDuty'],
  },
  {
    title: 'MarTech & CDP',
    description: 'Modern growth runs on composable CDP stacks and signal-rich journeys.',
    outcomes: ['1:1 personalization', 'Loyalty intelligence', 'Media ROI measurement', 'Privacy-safe activation'],
    technologies: ['Salesforce Marketing Cloud', 'Adobe Experience Platform', 'Braze', 'Segment'],
  },
  {
    title: 'Intelligent Automation',
    description: 'Move from scattered bots to intelligent process automation that spans systems and teams.',
    outcomes: ['Straight-through processing', 'Faster close cycles', 'Measurable cost reduction', 'Human-in-the-loop where needed'],
    technologies: ['ServiceNow', 'UiPath', 'Automation Anywhere', 'Power Automate'],
  },
];

// CEO Data
const ceo = {
  name: 'Jag Kanumuri',
  title: 'Founder & CEO',
  vision: `At ACI Infotech, our purpose is enterprise excellence through innovation and intelligence. We partner with organizations to reimagine business models, modernize operations, and turn technology into value you can measure.

Under Jag's leadership, ACI has grown from a small team of passionate engineers to a global organization that has delivered 500+ large enterprise projects. His vision is simple: deliver production-grade systems that create measurable business value, backed by engineers who take ownership and stay accountable.

"We don't just deliver projects. We build partnerships. When your system goes down at 2am, we're the team that answers the phone. That's not a policy. That's who we are."`,
  photo_url: '/images/about-team/Jag.png',
  photo_webp: '/images/about-team/Jag.webp',
  linkedin_url: 'https://www.linkedin.com/in/jagannadhkanumuri/',
};

// CRO Data
const cro = {
  name: 'Prakash Hingorani',
  title: 'Global Chief Revenue Officer',
  bio: `Prakash Hingorani serves as Global Chief Revenue Officer at ACI Infotech, leading global revenue strategy, market expansion, strategic alliances, and customer growth initiatives.

A seasoned business leader with more than 25 years of experience, Prakash has successfully scaled organizations across multiple industries and geographies, delivering transformative growth through technology, innovation, and customer-centric leadership.

He is responsible for accelerating ACI's global expansion, strengthening its position as an AI-first technology company, and growing enterprise adoption of solutions powered by ArqAI Labs and industry-specific AI capabilities.

Prakash is passionate about building high-performance teams, creating lasting customer value, and helping organizations navigate the next era of AI-driven business transformation.`,
  photo_url: '/images/about-team/Prakash.jpg',
  photo_webp: '/images/about-team/Prakash.webp',
  linkedin_url: 'https://www.linkedin.com/in/prakash-hingorani/',
};

// Leadership Team Data
const leadershipTeam = [
  {
    name: 'Krish Karanam',
    title: 'SVP - Global Resources',
    photo_url: '/images/about-team/Krish.png',
    photo_webp: '/images/about-team/Krish.webp',
    linkedin_url: 'https://www.linkedin.com/in/krish-karanam-423783113/',
  },
  {
    name: 'Habib Mehmoodi',
    title: 'VP - Strategy & Innovation',
    photo_url: '/images/about-team/Habib.png',
    photo_webp: '/images/about-team/Habib.webp',
    linkedin_url: 'https://www.linkedin.com/in/hmehmoodi/',
    imageClass: 'object-contain',
  },
  {
    name: 'Amit Alshaikh',
    title: 'VP - Client Success',
    photo_url: '/images/about-team/Amit-A.png',
    photo_webp: '/images/about-team/Amit-A.webp',
    linkedin_url: 'https://www.linkedin.com/in/amitalshaikh/',
  },
  {
    name: 'Narayanan Nanjan',
    title: 'VP - Project Delivery',
    photo_url: '/images/about-team/Narayanan.png',
    photo_webp: '/images/about-team/Narayanan.webp',
    linkedin_url: 'https://www.linkedin.com/in/narayanan-nanjan-5b655433/',
  },
  {
    name: 'Thomas George',
    title: 'AVP - Strategic Partnerships',
    photo_url: '/images/about-team/Thomas.png',
    photo_webp: '/images/about-team/Thomas.webp',
    linkedin_url: 'https://www.linkedin.com/in/thomas-george-25bb5a61/',
  },
  {
    name: 'Amit Khare',
    title: 'AVP - Client Success, APAC',
    photo_url: '/images/about-team/Amit-K.png',
    photo_webp: '/images/about-team/Amit-K.webp',
    linkedin_url: 'https://www.linkedin.com/in/amit-khare-27850a186/',
  },
  {
    name: 'Madhu Noone',
    title: 'Director - Sales',
    photo_url: '/images/about-team/Madhu.png',
    photo_webp: '/images/about-team/Madhu.webp',
    linkedin_url: 'https://www.linkedin.com/in/madhu-n-mis-mba-9a546b117/',
  },
];

const certifications = [
  { name: 'Great Place to Work', description: 'Certified 2024-25', logo_url: '/images/certifications-awards/best-place-to-work.webp' },
  { name: 'ISO 27001:2022', description: 'Information Security Certified', logo_url: '/images/certifications-awards/iso-27001.webp' },
  { name: 'CMMi Level 3', description: 'Process Maturity Certified', logo_url: '/images/certifications-awards/cmmi.webp' },
  { name: '5 Best Data Analytics', description: 'Industry Recognition', logo_url: '/images/certifications-awards/best-data-analytics-company.webp' },
];

// AboutPage + executive Person entities. Person schema on named
// leadership is a primary E-E-A-T and knowledge-panel signal; both
// people are already public on this page with LinkedIn profiles.
const aboutSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'AboutPage',
      '@id': 'https://aciinfotech.com/about#aboutpage',
      url: 'https://aciinfotech.com/about',
      name: 'About ACI Infotech',
      about: { '@id': 'https://aciinfotech.com/#organization' },
      inLanguage: 'en-US',
    },
    {
      '@type': 'Person',
      '@id': 'https://aciinfotech.com/about#jag-kanumuri',
      name: ceo.name,
      jobTitle: ceo.title,
      worksFor: { '@id': 'https://aciinfotech.com/#organization' },
      sameAs: [ceo.linkedin_url],
    },
    {
      '@type': 'Person',
      '@id': 'https://aciinfotech.com/about#prakash-hingorani',
      name: cro.name,
      jobTitle: cro.title,
      worksFor: { '@id': 'https://aciinfotech.com/#organization' },
      sameAs: [cro.linkedin_url],
    },
  ],
};

/* ------------------------------ local pieces ----------------------------- */

function LinkedInLink({ href, name }: { href: string; name: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${name}'s LinkedIn profile`}
      className="group inline-flex items-center gap-1 text-sm font-semibold text-blue-700"
    >
      <span className="relative">
        LinkedIn
        <span className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-current transition-transform duration-300 ease-out group-hover:scale-x-100" />
      </span>
      <ArrowUpRight size={14} aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
    </a>
  );
}

function ExecutiveCard({
  person,
  paragraphs,
  quoteIndex,
  photoSize,
}: {
  person: { name: string; title: string; photo_url: string; photo_webp: string; linkedin_url: string };
  paragraphs: string[];
  quoteIndex?: number;
  photoSize: number;
}) {
  return (
    <div className={`grid items-start gap-8 rounded-3xl bg-white p-8 lg:grid-cols-[auto_1fr] lg:gap-12 lg:p-12 ${cardShadow}`}>
      <div className="flex justify-center lg:justify-start">
        <div
          className="overflow-hidden rounded-2xl ring-1 ring-gray-200"
          style={{ width: photoSize, height: photoSize, maxWidth: '100%' }}
        >
          <picture>
            <source srcSet={person.photo_webp} type="image/webp" />
            <Image
              src={person.photo_url}
              alt={person.name}
              width={photoSize}
              height={photoSize}
              className="h-full w-full object-cover object-top"
            />
          </picture>
        </div>
      </div>
      <div>
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <div>
            <h3 className={`text-2xl font-bold text-black md:text-3xl ${v4Display}`}>{person.name}</h3>
            <p className="mt-1 text-sm font-semibold uppercase tracking-[0.14em] text-blue-700">
              {person.title}
            </p>
          </div>
          <LinkedInLink href={person.linkedin_url} name={person.name} />
        </div>
        <div className="mt-5 space-y-4 text-[15px] leading-relaxed text-gray-600">
          {paragraphs.map((paragraph, idx) =>
            idx === quoteIndex ? (
              <p key={idx} className="border-l-2 border-[#84CC16] pl-5 font-medium text-gray-800">
                {glueWidow(paragraph)}
              </p>
            ) : (
              <p key={idx}>{glueWidow(paragraph)}</p>
            ),
          )}
        </div>
      </div>
    </div>
  );
}

/* --------------------------------- page ---------------------------------- */

export default function AboutPage() {
  return (
    <div className={`bg-white text-black ${v4Sans}`}>
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutSchema) }}
      />
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: '/' },
          { name: 'About', url: '/about' },
        ]}
      />

      {/* Hero: who ACI is, answered in one line */}
      <ServiceHero
        kicker="About"
        title={
          <>
            The engineers behind{' '}
            <span style={{ color: '#1D4ED8' }}>enterprise&nbsp;modernization</span>
          </>
        }
        lede="ACI Infotech is an enterprise technology consultancy headquartered in Monmouth Junction, New Jersey. Founded in 2006, we build and run data platforms, AI systems, and cloud architectures for enterprises in banking, healthcare, retail, manufacturing, and hospitality. We stand behind the work with SLAs, and we answer the 2am call."
        chips={[
          'Founded 2006',
          '1,200+ engineers',
          '11 global delivery hubs',
          'ISO 27001:2022',
        ]}
        primary={{ label: 'Meet the leadership', href: '#leadership' }}
        secondary={{ label: 'See the work', href: '/case-studies' }}
        visual={
          <div className="relative h-full min-h-[320px] overflow-hidden rounded-3xl ring-1 ring-gray-200 lg:min-h-[440px]">
            <Image
              src="/images/v4/svc-ops.jpg"
              alt="An operations control room with live system consoles"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            <div
              aria-hidden="true"
              className="absolute inset-x-0 bottom-0 h-32"
              style={{ background: 'linear-gradient(180deg, transparent 0%, rgba(4,7,13,0.78) 100%)' }}
            />
            <p className="absolute bottom-5 left-6 right-6 text-sm font-medium text-white/90">
              The desk where the 2am call gets&nbsp;answered.
            </p>
          </div>
        }
      />

      {/* Company facts */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <SectionHead
            kicker="The company"
            title={
              <>
                ACI Infotech <span style={{ color: '#1D4ED8' }}>at a&nbsp;glance</span>
              </>
            }
          />
          <FactsRow facts={COMPANY_FACTS} />
        </div>
      </section>

      {/* Story + timeline */}
      <section className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <SectionHead
            kicker="Our story"
            title={<>Twenty years, one&nbsp;discipline</>}
          />
          <div className="mt-12 grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="space-y-4 text-[15px] leading-relaxed text-gray-600 md:text-base">
              <p>
                ACI Infotech isn&apos;t trying to be the next Accenture. We&apos;re the alternative: large
                enough to staff enterprise projects, small enough to make decisions in days not
                months, and focused enough to deliver deep expertise in the platforms enterprises
                actually use.
              </p>
              <p>
                Founded in 2006, we&apos;ve spent 20 years building one thing: production-grade
                enterprise systems. Not strategy. Not advisory. Not staff augmentation. We ship
                code that runs in production, carries SLAs, and delivers measurable ROI.
              </p>
              <p>
                Our clients are enterprise companies in banking, healthcare, retail, manufacturing,
                and hospitality. They choose us because we combine Big 4 capabilities with boutique
                speed and cost. Senior architects lead every project. We move fast. We cost 40-60% less.
              </p>
              <p className="font-semibold text-black">
                When your system goes down at 2am, we&apos;re the team that answers the phone.
                That&apos;s the difference between consultants who leave and engineers who&nbsp;stay.
              </p>
            </div>
            <ol className="relative border-l border-gray-200 pl-8">
              {TIMELINE.map((step, i) => (
                <li key={step.marker} className={i < TIMELINE.length - 1 ? 'pb-9' : ''}>
                  <span
                    aria-hidden="true"
                    className="absolute -left-[5px] mt-2 h-[9px] w-[9px] rounded-full bg-[#1D4ED8]"
                  />
                  <p className={`text-sm font-bold uppercase tracking-[0.14em] text-blue-700 ${v4Display}`}>
                    {step.marker}
                  </p>
                  <h3 className={`mt-1 text-lg font-semibold text-black ${v4Display}`}>{step.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-gray-600">{glueWidow(step.body)}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Vision and mission */}
      <section className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <SectionHead
            kicker="Vision & mission"
            title={<>The standard we hold ourselves&nbsp;to</>}
          />
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            <div className={`rounded-3xl bg-white p-8 lg:p-10 ${cardShadow}`}>
              <h3 className={`text-xl font-semibold text-black md:text-2xl ${v4Display}`}>Our Vision</h3>
              <p className="mt-4 text-[15px] leading-relaxed text-gray-700 md:text-base">
                To be the engineering partner that enterprises trust to turn ambitious technology
                strategies into production-grade reality, while setting the standard for what a
                modern, agile consultancy can achieve.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-gray-600">
                We envision a world where enterprises don&apos;t have to choose between scale and
                speed, between capability and cost. We&apos;re building that&nbsp;alternative.
              </p>
            </div>
            <div className={`rounded-3xl bg-white p-8 lg:p-10 ${cardShadow}`}>
              <h3 className={`text-xl font-semibold text-black md:text-2xl ${v4Display}`}>Our Mission</h3>
              <p className="mt-4 text-[15px] leading-relaxed text-gray-700 md:text-base">
                To deliver production-grade data platforms, AI systems, and cloud architectures
                with measurable business outcomes, backed by SLAs and supported by engineers
                who stay.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-gray-600">
                Every system we build runs in production, carries accountability, and creates value
                you can measure. That&apos;s not a tagline. That&apos;s our operating&nbsp;model.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How we work */}
      <section className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <SectionHead
            kicker="How we work"
            title={<>Three principles run every&nbsp;engagement</>}
          />
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {PRINCIPLES.map((principle) => (
              <div key={principle.number} className={`flex flex-col rounded-2xl bg-white p-7 ${cardShadow}`}>
                <div className="flex items-center gap-3">
                  <span className={`text-sm font-bold text-[#1D4ED8] ${v4Display}`}>{principle.number}</span>
                  <span aria-hidden="true" className="h-px flex-1 bg-gray-200" />
                </div>
                <h3 className={`mt-5 text-lg font-semibold text-black md:text-xl ${v4Display}`}>
                  {principle.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-gray-600">{glueWidow(principle.description)}</p>
                <ul className="mt-5 space-y-2.5">
                  {principle.proofPoints.map((point) => (
                    <li key={point} className="flex items-start gap-2.5 text-sm text-gray-700">
                      <CheckBadge />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <SectionHead
            kicker="What we build"
            title={<>What we&apos;ve built across 500+&nbsp;projects</>}
            sub="Four capability areas where the work goes deep, with the outcomes and the stack on the record."
          />
          <div className="mt-12 grid gap-x-14 md:grid-cols-2">
            {CAPABILITIES.map((capability, i) => (
              <div key={capability.title} className="border-t border-gray-200 py-8">
                <div className="flex items-baseline gap-4">
                  <span className={`text-sm font-semibold text-gray-300 ${v4Display}`}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className={`text-xl font-semibold text-black md:text-2xl ${v4Display}`}>
                    {capability.title}
                  </h3>
                </div>
                <p className="mt-3 text-[15px] leading-relaxed text-gray-600">
                  {glueWidow(capability.description)}
                </p>
                <ul className="mt-5 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  {capability.outcomes.map((outcome) => (
                    <li key={outcome} className="flex items-start gap-2.5 text-sm text-gray-700">
                      <CheckBadge />
                      {outcome}
                    </li>
                  ))}
                </ul>
                <p className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-medium uppercase tracking-wide text-gray-400">
                  {capability.technologies.map((tech) => (
                    <span key={tech} className="whitespace-nowrap">{tech}</span>
                  ))}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section id="leadership" className="scroll-mt-24 border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <SectionHead
            kicker="Leadership"
            title={
              <>
                The people who sign <span style={{ color: '#1D4ED8' }}>the&nbsp;work</span>
              </>
            }
            sub="Leadership that has built enterprise systems, not just managed them."
          />

          <div className="mt-12 space-y-8">
            <ExecutiveCard
              person={ceo}
              paragraphs={ceo.vision.split('\n\n')}
              quoteIndex={2}
              photoSize={300}
            />
            <ExecutiveCard
              person={cro}
              paragraphs={cro.bio.split('\n\n')}
              photoSize={280}
            />
          </div>

          {/* Leadership team grid */}
          <div className="mt-16">
            <h3 className={`text-2xl font-bold text-black ${v4Display}`}>Leadership&nbsp;Team</h3>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {leadershipTeam.map((member) => (
                <div key={member.name} className={`flex flex-col overflow-hidden rounded-2xl bg-white ${cardShadow}`}>
                  <div className="relative h-56 bg-gray-100">
                    <picture>
                      <source srcSet={member.photo_webp} type="image/webp" />
                      <Image
                        src={member.photo_url}
                        alt={member.name}
                        fill
                        className={`object-cover ${member.imageClass || 'object-[center_15%]'}`}
                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      />
                    </picture>
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <h4 className={`text-lg font-semibold text-black ${v4Display}`}>{member.name}</h4>
                    <p className="mt-0.5 text-sm text-gray-500">{member.title}</p>
                    <div className="mt-3">
                      <LinkedInLink href={member.linkedin_url} name={member.name} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Certifications band */}
      <section className="border-t border-gray-200 bg-gray-50/60">
        <div className="mx-auto max-w-7xl px-6 py-14 md:py-16">
          <SectionHead
            kicker="Certifications & recognition"
            title={<>Certified, appraised, and&nbsp;audited</>}
            sub="The paperwork behind the claims: security, process maturity, and workplace certifications held right now."
          />
          <div className="mt-10 grid grid-cols-2 gap-5 md:grid-cols-4">
            {certifications.map((cert) => (
              <div key={cert.name} className={`flex flex-col items-center rounded-2xl bg-white p-6 text-center ${cardShadow}`}>
                <div className="relative h-20 w-20">
                  <Image src={cert.logo_url} alt={cert.name} fill className="object-contain" />
                </div>
                <h3 className={`mt-4 text-sm font-semibold text-black ${v4Display}`}>{cert.name}</h3>
                <p className="mt-1 text-xs text-gray-500">{cert.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bridge to the proof */}
      <BridgeBand
        title={<>You&apos;ve met the team. Now read the&nbsp;work.</>}
        body="500+ enterprise projects left a paper trail: case studies with baseline numbers, the architecture that shipped, and results audited at close. The team on this page is the team in those stories."
        link={{ label: 'Read the case studies', href: '/case-studies' }}
      />

      {/* Closing CTA: one button, nothing else */}
      <CtaSection label="Meet the team behind the work" href="/contact?reason=general&source=about" />
    </div>
  );
}
