import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ArrowUpRight } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import ReactMarkdown from 'react-markdown';

import { displayClient } from '@/lib/content/anonymize';
import { DEFAULT_OG_IMAGES, DEFAULT_TWITTER_IMAGES } from '@/lib/seo/og';
import CtaSection from '@/components/v4/hero/CtaSection';
import { v4Display, v4DisplayVar, v4Sans } from '@/components/v4/fonts';
import { cardShadow, CheckBadge } from '@/components/v4/page/kit';
// Supabase client for server-side fetching
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Fetch case study from Supabase by slug
async function getCaseStudyBySlug(slug: string) {
  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  const { data, error } = await supabase
    .from('case_studies')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (error || !data) {
    return null;
  }

  return data;
}

const CASE_STUDY_PUBLISHER = {
  '@type': 'Organization',
  name: 'ACI Infotech',
  logo: { '@type': 'ImageObject', url: 'https://aciinfotech.com/brand/favicon-192.png' },
};

// Article + BreadcrumbList JSON-LD for a case-study detail page. Kept
// loose on inputs so both the CMS and the hardcoded render paths can call
// it with whatever fields they have.
function caseStudyJsonLd(input: {
  slug: string;
  headline: string;
  description?: string | null;
  image?: string | null;
  industry?: string | null;
  datePublished?: string | null;
  dateModified?: string | null;
}) {
  const url = `https://aciinfotech.com/case-studies/${input.slug}`;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        headline: input.headline,
        ...(input.description ? { description: input.description } : {}),
        ...(input.image ? { image: [input.image] } : {}),
        ...(input.datePublished ? { datePublished: input.datePublished } : {}),
        ...(input.dateModified ? { dateModified: input.dateModified } : {}),
        author: { '@type': 'Organization', name: 'ACI Infotech' },
        publisher: CASE_STUDY_PUBLISHER,
        mainEntityOfPage: { '@type': 'WebPage', '@id': url },
        ...(input.industry ? { about: input.industry } : {}),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://aciinfotech.com' },
          { '@type': 'ListItem', position: 2, name: 'Case Studies', item: 'https://aciinfotech.com/case-studies' },
          { '@type': 'ListItem', position: 3, name: input.headline, item: url },
        ],
      },
    ],
  };
}

// Legacy hardcoded case study data — fallback rendered only when the
// Supabase lookup misses (network outage, draft row, etc.). The MSCI/
// financial-giant entry was retired: the live CMS row at the same slug
// ('modernizes-finance-reporting-with-sap-transformation') is the
// source of truth.
const caseStudiesData: Record<string, CaseStudyDetail> = {
  'databricks-modernization-ai-enablement-for-leading-c-store-chain': {
    slug: 'databricks-modernization-ai-enablement-for-leading-c-store-chain',
    client: 'Fortune 500 Convenience Retailer',
    industry: 'Retail',
    service: 'MarTech & CDP',
    headline: 'Real-Time Customer Engagement Across 600+ Locations',
    subheadline: 'Building a unified customer data platform that increased promotion effectiveness by 25%',
    challenge: {
      summary: 'The client needed to modernize their payment infrastructure and create a unified view of customers across 600+ convenience store locations.',
      points: [
        'Fragmented customer data across multiple systems',
        'Payment systems requiring modernization with zero downtime',
        'Loyalty program integration with existing infrastructure',
        'Real-time personalization requirements',
        'High transaction volumes during peak hours',
      ],
    },
    solution: {
      summary: 'We implemented a comprehensive MarTech stack with Salesforce and Braze, unified on a Databricks-powered customer data platform.',
      points: [
        'Salesforce implementation for unified customer profiles',
        'Braze integration for real-time messaging and personalization',
        'Databricks lakehouse for customer data unification',
        'AWS infrastructure for scalability and reliability',
        'Real-time payment system modernization',
      ],
      approach: 'Location-by-location rollout with extensive A/B testing to validate improvements before full deployment.',
    },
    results: [
      { metric: '30%', description: 'Reduction in data latency', detail: 'From hours to real-time data availability' },
      { metric: '25%', description: 'Improvement in promotion effectiveness', detail: 'Measured by redemption rates and ROI' },
      { metric: '600+', description: 'Locations with zero downtime', detail: 'Seamless migration without business disruption' },
      { metric: '2.5x', description: 'Email engagement improvement', detail: 'Through personalized messaging' },
    ],
    technologies: ['Salesforce', 'Braze', 'AWS', 'Databricks', 'Kafka', 'Redis'],
    timeline: '12 months',
    teamSize: '18 consultants',
    testimonial: {
      quote: "I'm thrilled with our Data Team's achievement at ACI Infotech. They've flawlessly delivered top-tier digital data capability, a critical milestone for our convenience retail operations.",
      author: 'Director of Data and MarTech',
      title: 'Fortune 500 Convenience Retailer',
    },
    relatedStudies: ['how-aci-infotech-enabled-a-retail-leader-to-unlock-the-power-of-data', 'modernizes-finance-reporting-with-sap-transformation'],
  },
  'global-food-facilities-data-intelligence': {
    slug: 'global-food-facilities-data-intelligence',
    client: 'Global Hospitality Leader',
    industry: 'Hospitality',
    service: 'Data Engineering',
    headline: 'Unified Global Data Platform for 400K+ Employees',
    subheadline: 'Creating a single source of truth across 80+ countries',
    challenge: {
      summary: 'The client\'s global operations spanning 80+ countries faced data fragmentation that hindered strategic decision-making.',
      points: [
        'Data scattered across regional silos with inconsistent formats',
        'No unified view of global supply chain operations',
        'Reporting delays impacting business decisions',
        'Complex regulatory requirements across regions',
        'Legacy systems with limited integration capabilities',
      ],
    },
    solution: {
      summary: 'We implemented a unified data platform using Informatica IICS and MDM, establishing enterprise-wide data governance.',
      points: [
        'Informatica IICS for enterprise-wide data integration',
        'Master Data Management (MDM) for data consistency',
        'Snowflake data warehouse for analytics',
        'Automated data quality monitoring',
        'Self-service analytics platform for business users',
      ],
      approach: 'Region-by-region implementation with a center of excellence model to ensure knowledge transfer and sustainability.',
    },
    results: [
      { metric: 'Single', description: 'Source of truth established', detail: 'Across all operations globally' },
      { metric: 'Global', description: 'Supply chain visibility', detail: 'Real-time insights across 80+ countries' },
      { metric: '50%', description: 'Faster decision-making', detail: 'Through automated reporting and dashboards' },
      { metric: '80+', description: 'Countries unified', detail: 'On a single data platform' },
    ],
    technologies: ['Informatica IICS', 'MDM', 'Snowflake', 'Cloud Integration', 'Tableau'],
    timeline: '24 months',
    teamSize: '30+ consultants',
    testimonial: {
      quote: "I'm extremely satisfied with ACI Infotech, especially their work on IICS Informatica and MDM integrations. Their commitment to deliverables without compromising quality is impressive.",
      author: 'Senior Director',
      title: 'Global Hospitality Leader',
    },
    relatedStudies: ['modernizes-finance-reporting-with-sap-transformation', 'intelligent-cms-modernization-productivity-engagement'],
  },
};

interface CaseStudyDetail {
  slug: string;
  client: string;
  logo_url?: string;
  featured_image?: string;
  industry: string;
  service: string;
  headline: string;
  subheadline: string;
  challenge: {
    summary: string;
    points: string[];
  };
  solution: {
    summary: string;
    points: string[];
    approach: string;
  };
  results: {
    metric: string;
    description: string;
    detail?: string;
  }[];
  technologies: string[];
  timeline: string;
  teamSize: string;
  testimonial?: {
    quote: string;
    author: string;
    title: string;
  };
  relatedStudies?: string[];
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return Object.keys(caseStudiesData).map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;

  // First try Supabase
  const dbStudy = await getCaseStudyBySlug(slug);
  if (dbStudy) {
    // `absolute` opts out of the root "%s | ACI Infotech" template —
    // plain strings here previously rendered a double brand suffix.
    // Lead with the study title (the searchable part), not the
    // anonymized client descriptor.
    const dbTitle = dbStudy.meta_title || `${dbStudy.title} | ${displayClient(dbStudy)} Case Study | ACI Infotech`;
    const dbDescription = dbStudy.meta_description || dbStudy.excerpt || dbStudy.challenge?.substring(0, 160);
    // Per-page social card: without this the page inherited the ROOT
    // layout's OpenGraph, so every case-study share rendered the
    // homepage card with og:url pointing at /.
    const dbImages = dbStudy.featured_image_url
      ? [{ url: dbStudy.featured_image_url, alt: dbStudy.title }]
      : DEFAULT_OG_IMAGES;
    return {
      title: { absolute: dbTitle },
      description: dbDescription,
      alternates: { canonical: `https://aciinfotech.com/case-studies/${slug}` },
      openGraph: {
        title: dbTitle,
        description: dbDescription,
        url: `https://aciinfotech.com/case-studies/${slug}`,
        siteName: 'ACI Infotech',
        type: 'article',
        images: dbImages,
      },
      twitter: {
        card: 'summary_large_image',
        title: dbTitle,
        description: dbDescription,
        images: dbStudy.featured_image_url ? [dbStudy.featured_image_url] : DEFAULT_TWITTER_IMAGES,
      },
    };
  }

  // Fallback to hardcoded data
  const study = caseStudiesData[slug];

  if (!study) {
    return {
      title: { absolute: 'Case Study Not Found | ACI Infotech' },
    };
  }

  const fallbackTitle = `${study.headline} | ${displayClient(study)} Case Study | ACI Infotech`;
  return {
    title: { absolute: fallbackTitle },
    description: study.subheadline,
    alternates: { canonical: `https://aciinfotech.com/case-studies/${slug}` },
    openGraph: {
      title: fallbackTitle,
      description: study.subheadline,
      url: `https://aciinfotech.com/case-studies/${slug}`,
      siteName: 'ACI Infotech',
      type: 'article',
      images: DEFAULT_OG_IMAGES,
    },
    twitter: {
      card: 'summary_large_image',
      title: fallbackTitle,
      description: study.subheadline,
      images: DEFAULT_TWITTER_IMAGES,
    },
  };
}

/* ------------------------------ v4 fragments ------------------------------ */

// Markdown body styling: no typography plugin in this Tailwind setup, so
// element styles are applied via descendant utilities. Headings pick up
// Funnel Display through the font CSS variable.
const MD_BODY = `max-w-3xl text-[17px] leading-relaxed text-gray-800 ${v4DisplayVar} [&_h1]:[font-family:var(--font-v4-display)] [&_h2]:[font-family:var(--font-v4-display)] [&_h3]:[font-family:var(--font-v4-display)] [&_h1]:mb-4 [&_h1]:mt-10 [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:tracking-tight [&_h1]:text-black [&_h2]:mb-4 [&_h2]:mt-10 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:tracking-tight [&_h2]:text-black [&_h3]:mb-3 [&_h3]:mt-8 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-black [&_p]:mb-5 [&_ul]:mb-5 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6 [&_ol]:mb-5 [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-6 [&_strong]:font-semibold [&_strong]:text-black [&_a]:text-blue-700 [&_a]:underline [&_a]:underline-offset-2 [&_blockquote]:my-8 [&_blockquote]:border-l-2 [&_blockquote]:border-blue-700 [&_blockquote]:pl-5 [&_blockquote]:text-gray-600`;

/** Slash-label section head for the article-width sections. */
function StudySectionHead({ kicker, title }: { kicker: string; title: string }) {
  return (
    <div>
      <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">/ {kicker}</p>
      <h2
        className={`text-2xl font-bold tracking-tight text-black sm:text-3xl ${v4Display}`}
        style={{ lineHeight: 1.1 }}
      >
        {title}
      </h2>
    </div>
  );
}

/** Dark metrics band: lime values in Funnel Display, small-caps labels. */
function MetricsBand({ metrics }: { metrics: { value: string; label: string }[] }) {
  return (
    <div className="rounded-3xl bg-[#0b1220] p-8 ring-1 ring-white/10 md:p-10">
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/60">/ Results at a glance</p>
      <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4">
        {metrics.map((metric, index) => (
          <div key={index}>
            <p className={`text-4xl font-bold leading-none text-[#84CC16] lg:text-5xl ${v4Display}`}>
              {metric.value}
            </p>
            <p className="mt-3 text-[11px] font-semibold uppercase leading-snug tracking-[0.16em] text-white/60">
              {metric.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Large Funnel Display pull quote with a hairline left rule. */
function PullQuote({ quote, author, title }: { quote: string; author?: string | null; title?: string | null }) {
  return (
    <figure className="border-l border-gray-200 pl-6 md:pl-10">
      <blockquote
        className={`max-w-3xl text-2xl font-medium tracking-tight text-black sm:text-3xl ${v4Display}`}
        style={{ lineHeight: 1.25 }}
      >
        &ldquo;{quote}&rdquo;
      </blockquote>
      {(author || title) && (
        <figcaption className="mt-6 text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-500">
          {author}
          {author && title ? ' / ' : ''}
          {title}
        </figcaption>
      )}
    </figure>
  );
}

export default async function CaseStudyPage({ params }: PageProps) {
  const { slug } = await params;

  // First try to fetch from Supabase (CMS-created case studies)
  const dbStudy = await getCaseStudyBySlug(slug);

  // If found in Supabase, render the CMS version
  if (dbStudy) {
    // Parse metrics if stored as JSON string
    const metrics = Array.isArray(dbStudy.metrics)
      ? dbStudy.metrics
      : typeof dbStudy.metrics === 'string'
        ? JSON.parse(dbStudy.metrics)
        : [];

    // Parse technologies if stored as array or string
    const technologies = Array.isArray(dbStudy.technologies)
      ? dbStudy.technologies
      : typeof dbStudy.technologies === 'string'
        ? dbStudy.technologies.split(',').map((t: string) => t.trim())
        : [];

    // Parse services if stored as array
    const services = Array.isArray(dbStudy.services) ? dbStudy.services : [];

    const jsonLd = caseStudyJsonLd({
      slug,
      headline: dbStudy.meta_title || dbStudy.title,
      description: dbStudy.meta_description || dbStudy.excerpt,
      image: dbStudy.featured_image_url,
      industry: dbStudy.industry,
      datePublished: dbStudy.published_at || dbStudy.created_at,
      dateModified: dbStudy.updated_at,
    });

    const heroChips = [...services, ...technologies];

    return (
      <main className={`min-h-screen bg-white text-black ${v4Sans}`}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

        {/* Hero */}
        <section className="bg-white">
          <div className="mx-auto max-w-[960px] px-6 pt-12 md:pt-16">
            <Link
              href="/case-studies"
              className="group inline-flex items-center gap-1.5 text-sm font-semibold text-blue-700"
            >
              <span className="relative">
                All case studies
                <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-current transition-transform duration-300 ease-out group-hover:scale-x-100" />
              </span>
              <ArrowUpRight size={14} aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>

            <p className="mb-4 mt-10 text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
              / {dbStudy.industry || 'Case Study'}
            </p>
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-gray-500">
              {displayClient(dbStudy)}
            </p>
            <h1
              className={`mt-4 text-3xl font-bold tracking-tight text-black sm:text-4xl lg:text-[44px] ${v4Display}`}
              style={{ lineHeight: 1.08 }}
            >
              {dbStudy.title}
            </h1>
            {dbStudy.excerpt && (
              <div className="mt-5 max-w-2xl text-base leading-relaxed text-gray-600 md:text-lg [&_p]:mb-3 [&_strong]:font-semibold [&_strong]:text-gray-800">
                <ReactMarkdown>{dbStudy.excerpt}</ReactMarkdown>
              </div>
            )}

            {heroChips.length > 0 && (
              <ul className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                {heroChips.map((chip: string) => (
                  <li key={chip} className="whitespace-nowrap">
                    {chip}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        {/* Metrics band right after the hero */}
        {metrics.length > 0 && (
          <section className="bg-white">
            <div className="mx-auto max-w-[960px] px-6 pt-12">
              <MetricsBand metrics={metrics.slice(0, 4)} />
            </div>
          </section>
        )}

        {/* Featured image */}
        {dbStudy.featured_image_url && (
          <div className="mx-auto max-w-[960px] px-6 pt-12">
            <div className="relative aspect-[16/9] overflow-hidden rounded-2xl">
              <Image
                src={dbStudy.featured_image_url}
                alt={dbStudy.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 960px"
                className="object-cover"
              />
            </div>
          </div>
        )}

        {/* Challenge */}
        {dbStudy.challenge && (
          <section className="bg-white pt-16 md:pt-20">
            <div className="mx-auto max-w-[960px] border-t border-gray-200 px-6 pt-16 md:pt-20">
              <StudySectionHead kicker="Challenge" title="Where the client started" />
              <div className={`mt-6 ${MD_BODY}`}>
                <ReactMarkdown>{dbStudy.challenge}</ReactMarkdown>
              </div>
            </div>
          </section>
        )}

        {/* Solution */}
        {dbStudy.solution && (
          <section className="bg-white pt-16 md:pt-20">
            <div className="mx-auto max-w-[960px] border-t border-gray-200 px-6 pt-16 md:pt-20">
              <StudySectionHead kicker="Solution" title="What we built" />
              <div className={`mt-6 ${MD_BODY}`}>
                <ReactMarkdown>{dbStudy.solution}</ReactMarkdown>
              </div>
            </div>
          </section>
        )}

        {/* Results */}
        {dbStudy.results && (
          <section className="bg-white pt-16 md:pt-20">
            <div className="mx-auto max-w-[960px] border-t border-gray-200 px-6 pt-16 md:pt-20">
              <StudySectionHead kicker="Results" title="What changed in production" />
              <div className={`mt-6 ${MD_BODY}`}>
                <ReactMarkdown>{dbStudy.results}</ReactMarkdown>
              </div>
            </div>
          </section>
        )}

        {/* Testimonial */}
        {dbStudy.testimonial_quote && (
          <section className="bg-white pt-16 md:pt-20">
            <div className="mx-auto max-w-[960px] border-t border-gray-200 px-6 pt-16 md:pt-20">
              <PullQuote
                quote={dbStudy.testimonial_quote}
                author={dbStudy.testimonial_author}
                title={dbStudy.testimonial_title}
              />
            </div>
          </section>
        )}

        <div className="pt-16 md:pt-20" />

        {/* Closing CTA: video stage, one button, nothing else */}
        <CtaSection label="Let's Build Your Version of This" href="/contact?reason=architecture-call" />
      </main>
    );
  }

  // Fallback to hardcoded data for legacy case studies
  const study = caseStudiesData[slug];

  if (!study) {
    // No CMS row and no hardcoded fallback: this case study does not
    // exist or was retired. Return a real 404 rather than a 200
    // "coming soon" placeholder, which the audit flagged as a soft 404.
    notFound();
  }

  const relatedStudies = study.relatedStudies
    ?.map(slug => caseStudiesData[slug])
    .filter(Boolean) || [];

  const jsonLd = caseStudyJsonLd({
    slug,
    headline: study.headline,
    description: study.subheadline,
    image: study.featured_image,
    industry: study.industry,
  });

  return (
    <main className={`min-h-screen bg-white text-black ${v4Sans}`}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero */}
      <section className="bg-white">
        <div className="mx-auto max-w-[960px] px-6 pt-12 md:pt-16">
          <Link
            href="/case-studies"
            className="group inline-flex items-center gap-1.5 text-sm font-semibold text-blue-700"
          >
            <span className="relative">
              All case studies
              <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-current transition-transform duration-300 ease-out group-hover:scale-x-100" />
            </span>
            <ArrowUpRight size={14} aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>

          <p className="mb-4 mt-10 text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
            / {study.industry}
          </p>
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-gray-500">
            {displayClient(study)}
          </p>
          <h1
            className={`mt-4 text-3xl font-bold tracking-tight text-black sm:text-4xl lg:text-[44px] ${v4Display}`}
            style={{ lineHeight: 1.08 }}
          >
            {study.headline}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-gray-600 md:text-lg">
            {study.subheadline}
          </p>

          <ul className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-[11px] font-semibold uppercase tracking-wide text-gray-500">
            {[study.service, ...study.technologies, study.timeline, study.teamSize].map((chip) => (
              <li key={chip} className="whitespace-nowrap">
                {chip}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Metrics band right after the hero */}
      <section className="bg-white">
        <div className="mx-auto max-w-[960px] px-6 pt-12">
          <MetricsBand
            metrics={study.results.slice(0, 4).map((r) => ({ value: r.metric, label: r.description }))}
          />
        </div>
      </section>

      {/* Featured image */}
      {study.featured_image && (
        <div className="mx-auto max-w-[960px] px-6 pt-12">
          <div className="relative aspect-[16/9] overflow-hidden rounded-2xl">
            <Image
              src={study.featured_image}
              alt={study.headline}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 960px"
              className="object-cover"
            />
          </div>
        </div>
      )}

      {/* Challenge */}
      <section className="bg-white pt-16 md:pt-20">
        <div className="mx-auto max-w-[960px] border-t border-gray-200 px-6 pt-16 md:pt-20">
          <StudySectionHead kicker="Challenge" title="Where the client started" />
          <p className="mt-6 max-w-3xl text-[17px] leading-relaxed text-gray-800">{study.challenge.summary}</p>
          <ul className="mt-8 max-w-3xl space-y-4">
            {study.challenge.points.map((point, index) => (
              <li key={index} className="flex items-baseline gap-4 border-t border-gray-200 pt-4">
                <span className={`text-sm font-semibold text-gray-300 ${v4Display}`}>
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="text-[15px] leading-relaxed text-gray-700">{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Solution */}
      <section className="bg-white pt-16 md:pt-20">
        <div className="mx-auto max-w-[960px] border-t border-gray-200 px-6 pt-16 md:pt-20">
          <StudySectionHead kicker="Solution" title="What we built" />
          <p className="mt-6 max-w-3xl text-[17px] leading-relaxed text-gray-800">{study.solution.summary}</p>
          <ul className="mt-8 max-w-3xl space-y-4">
            {study.solution.points.map((point, index) => (
              <li key={index} className="flex items-start gap-3">
                <CheckBadge />
                <span className="text-[15px] leading-relaxed text-gray-700">{point}</span>
              </li>
            ))}
          </ul>

          {/* Approach */}
          <div className={`mt-10 max-w-3xl rounded-2xl bg-white p-7 ${cardShadow}`}>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">/ How we rolled it out</p>
            <p className="mt-4 text-[15px] leading-relaxed text-gray-700">{study.solution.approach}</p>
          </div>
        </div>
      </section>

      {/* Detailed results */}
      <section className="bg-white pt-16 md:pt-20">
        <div className="mx-auto max-w-[960px] border-t border-gray-200 px-6 pt-16 md:pt-20">
          <StudySectionHead kicker="Results" title="What changed in production" />
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {study.results.map((result, index) => (
              <div key={index} className={`rounded-2xl bg-white p-7 ${cardShadow}`}>
                <p className={`text-4xl font-bold leading-none text-[#1D4ED8] ${v4Display}`}>{result.metric}</p>
                <p className={`mt-4 text-lg font-semibold text-black ${v4Display}`}>{result.description}</p>
                {result.detail && <p className="mt-2 text-sm leading-relaxed text-gray-600">{result.detail}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial */}
      {study.testimonial && (
        <section className="bg-white pt-16 md:pt-20">
          <div className="mx-auto max-w-[960px] border-t border-gray-200 px-6 pt-16 md:pt-20">
            <PullQuote
              quote={study.testimonial.quote}
              author={study.testimonial.author}
              title={study.testimonial.title}
            />
          </div>
        </section>
      )}

      {/* Related case studies */}
      {relatedStudies.length > 0 && (
        <section className="bg-white pt-16 md:pt-20">
          <div className="mx-auto max-w-7xl border-t border-gray-200 px-6 pb-16 pt-16 md:pb-20 md:pt-20">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">/ More proof</p>
            <h2
              className={`text-3xl font-bold tracking-tight text-black sm:text-4xl ${v4Display}`}
              style={{ lineHeight: 1.08 }}
            >
              Related case studies
            </h2>
            <div className="mt-10 grid gap-5 md:grid-cols-2">
              {relatedStudies.map((related) => (
                <Link
                  key={related.slug}
                  href={`/case-studies/${related.slug}`}
                  className="group relative flex flex-col overflow-hidden rounded-3xl bg-[#0b1220] p-8 ring-1 ring-white/10 transition-all duration-300 hover:ring-white/25"
                >
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/60">
                    {displayClient(related)} / {related.service}
                  </p>
                  <h3 className={`mt-5 text-xl font-semibold text-white md:text-2xl ${v4Display}`}>
                    {related.headline}
                  </h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-white/75">{related.subheadline}</p>
                  <span className="mt-6 flex items-center gap-1 text-sm font-semibold text-[#84CC16]">
                    Read the case study
                    <ArrowUpRight size={15} aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {relatedStudies.length === 0 && <div className="pt-16 md:pt-20" />}

      {/* Closing CTA: video stage, one button, nothing else */}
      <CtaSection label="Let's Build Your Version of This" href="/contact?reason=architecture-call" />
    </main>
  );
}
