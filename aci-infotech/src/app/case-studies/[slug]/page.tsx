import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, CheckCircle2, Quote, ExternalLink } from 'lucide-react';
import Button from '@/components/ui/Button';
import { createClient } from '@supabase/supabase-js';
import ReactMarkdown from 'react-markdown';

import { displayClient } from '@/lib/content/anonymize';
import { DEFAULT_OG_IMAGES, DEFAULT_TWITTER_IMAGES } from '@/lib/seo/og';
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

    return (
      <main className="min-h-screen">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        {/* Hero Section */}
        <section className="relative bg-[var(--aci-secondary)] pt-32 pb-20 overflow-hidden">
          {dbStudy.featured_image_url && (
            <>
              <Image
                src={dbStudy.featured_image_url}
                alt=""
                fill
                priority
                sizes="100vw"
                className="object-cover opacity-30"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--aci-secondary)] via-[var(--aci-secondary)]/85 to-[var(--aci-secondary)]/50" />
            </>
          )}
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Breadcrumb */}
            <Link
              href="/case-studies"
              className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Case Studies
            </Link>

            <div className="flex items-center gap-4 mb-6">
              <span className="text-2xl font-bold text-white">{displayClient(dbStudy)}</span>
              <div className="flex gap-2">
                {dbStudy.industry && (
                  <span className="px-3 py-1 bg-gray-700 text-gray-300 text-sm rounded">{dbStudy.industry}</span>
                )}
                {services[0] && (
                  <span className="px-3 py-1 bg-[var(--aci-primary)] text-white text-sm rounded">{services[0]}</span>
                )}
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              {dbStudy.title}
            </h1>
            {dbStudy.excerpt && (
              <div className="text-xl text-gray-400 prose prose-lg prose-invert max-w-none prose-strong:text-gray-300">
                <ReactMarkdown>{dbStudy.excerpt}</ReactMarkdown>
              </div>
            )}

            {/* Quick Stats */}
            {metrics.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 pt-8 border-t border-gray-700">
                {metrics.slice(0, 4).map((metric: { value: string; label: string }, index: number) => (
                  <div key={index}>
                    <div className="text-2xl font-bold text-[var(--aci-primary-light)]">{metric.value}</div>
                    <div className="text-sm text-gray-400">{metric.label}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Results Highlight */}
        {metrics.length > 0 && (
          <section className="py-16 bg-[var(--aci-primary)]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-center text-white text-lg font-medium mb-8">Key Results</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {metrics.slice(0, 4).map((metric: { value: string; label: string; description?: string }, index: number) => (
                  <div key={index} className="text-center">
                    <div className="text-4xl md:text-5xl font-bold text-white mb-2">{metric.value}</div>
                    <div className="text-blue-100">{metric.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Challenge Section */}
        {dbStudy.challenge && (
          <section className="py-20 bg-white">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">🎯</span>
                </div>
                <h2 className="text-3xl font-bold text-[var(--aci-secondary)]">The Challenge</h2>
              </div>
              <div className="text-lg text-gray-600 prose prose-lg max-w-none prose-headings:text-[var(--aci-secondary)] prose-headings:font-bold prose-strong:text-gray-800 prose-ul:list-disc prose-ol:list-decimal prose-li:text-gray-600">
                <ReactMarkdown>{dbStudy.challenge}</ReactMarkdown>
              </div>
            </div>
          </section>
        )}

        {/* Solution Section */}
        {dbStudy.solution && (
          <section className="py-20 bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">💡</span>
                </div>
                <h2 className="text-3xl font-bold text-[var(--aci-secondary)]">Our Solution</h2>
              </div>
              <div className="text-lg text-gray-600 prose prose-lg max-w-none prose-headings:text-[var(--aci-secondary)] prose-headings:font-bold prose-strong:text-gray-800 prose-ul:list-disc prose-ol:list-decimal prose-li:text-gray-600">
                <ReactMarkdown>{dbStudy.solution}</ReactMarkdown>
              </div>
            </div>
          </section>
        )}

        {/* Technologies */}
        {technologies.length > 0 && (
          <section className="py-16 bg-white border-y">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-xl font-bold text-[var(--aci-secondary)] mb-6">Technologies Used</h2>
              <div className="flex flex-wrap gap-3">
                {technologies.map((tech: string) => (
                  <span
                    key={tech}
                    className="px-4 py-2 bg-gray-100 rounded-lg text-gray-700 font-medium"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Results Section */}
        {dbStudy.results && (
          <section className="py-20 bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">📊</span>
                </div>
                <h2 className="text-3xl font-bold text-[var(--aci-secondary)]">Results & Impact</h2>
              </div>
              <div className="text-lg text-gray-600 prose prose-lg max-w-none prose-headings:text-[var(--aci-secondary)] prose-headings:font-bold prose-strong:text-gray-800 prose-ul:list-disc prose-ol:list-decimal prose-li:text-gray-600">
                <ReactMarkdown>{dbStudy.results}</ReactMarkdown>
              </div>
            </div>
          </section>
        )}

        {/* Testimonial */}
        {dbStudy.testimonial_quote && (
          <section className="py-20 bg-[var(--aci-secondary)]">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="relative">
                <Quote className="w-16 h-16 text-[var(--aci-primary)] opacity-50 mb-6" />
                <blockquote className="text-2xl md:text-3xl text-white font-light leading-relaxed mb-8">
                  "{dbStudy.testimonial_quote}"
                </blockquote>
                {(dbStudy.testimonial_author || dbStudy.testimonial_title) && (
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[var(--aci-primary)] rounded-full flex items-center justify-center text-white font-bold">
                      {dbStudy.testimonial_author?.charAt(0) || 'C'}
                    </div>
                    <div>
                      {dbStudy.testimonial_author && (
                        <div className="font-semibold text-white">{dbStudy.testimonial_author}</div>
                      )}
                      {dbStudy.testimonial_title && (
                        <div className="text-gray-400">{dbStudy.testimonial_title}</div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="py-20 bg-[var(--aci-primary)]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Achieve Similar Results?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Let's discuss how we can apply our expertise to your challenges.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button href="/contact?reason=architecture-call" variant="secondary" size="lg">
                Schedule Architecture Call
              </Button>
              <Button href="/case-studies" variant="ghost" size="lg" className="text-white border-white hover:bg-white/10">
                View More Case Studies
              </Button>
            </div>
          </div>
        </section>
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
    <main className="min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {/* Hero Section */}
      <section className="relative bg-[var(--aci-secondary)] pt-32 pb-20 overflow-hidden">
        {study.featured_image && (
          <>
            <Image
              src={study.featured_image}
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover opacity-30"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--aci-secondary)] via-[var(--aci-secondary)]/85 to-[var(--aci-secondary)]/50" />
          </>
        )}
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <Link
            href="/case-studies"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Case Studies
          </Link>

          <div className="flex items-center gap-4 mb-6">
            {study.logo_url ? (
              <Image
                src={study.logo_url}
                alt={`${displayClient(study)} logo - ${study.headline} case study`}
                width={120}
                height={48}
                className="object-contain brightness-0 invert"
              />
            ) : (
              <span className="text-2xl font-bold text-white">{displayClient(study)}</span>
            )}
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-gray-700 text-gray-300 text-sm rounded">{study.industry}</span>
              <span className="px-3 py-1 bg-[var(--aci-primary)] text-white text-sm rounded">{study.service}</span>
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            {study.headline}
          </h1>
          <p className="text-xl text-gray-400">
            {study.subheadline}
          </p>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 pt-8 border-t border-gray-700">
            <div>
              <div className="text-sm text-gray-400 mb-1">Timeline</div>
              <div className="text-xl font-semibold text-white">{study.timeline}</div>
            </div>
            <div>
              <div className="text-sm text-gray-400 mb-1">Team Size</div>
              <div className="text-xl font-semibold text-white">{study.teamSize}</div>
            </div>
            <div>
              <div className="text-sm text-gray-400 mb-1">Industry</div>
              <div className="text-xl font-semibold text-white">{study.industry}</div>
            </div>
            <div>
              <div className="text-sm text-gray-400 mb-1">Service</div>
              <div className="text-xl font-semibold text-white">{study.service}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Results Highlight */}
      <section className="py-16 bg-[var(--aci-primary)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-white text-lg font-medium mb-8">Key Results</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {study.results.slice(0, 4).map((result, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">{result.metric}</div>
                <div className="text-blue-100">{result.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Challenge Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <span className="text-2xl">🎯</span>
            </div>
            <h2 className="text-3xl font-bold text-[var(--aci-secondary)]">The Challenge</h2>
          </div>
          <p className="text-lg text-gray-600 mb-8">{study.challenge.summary}</p>
          <ul className="space-y-4">
            {study.challenge.points.map((point, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-sm font-medium">
                  {index + 1}
                </span>
                <span className="text-gray-700">{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <span className="text-2xl">💡</span>
            </div>
            <h2 className="text-3xl font-bold text-[var(--aci-secondary)]">Our Solution</h2>
          </div>
          <p className="text-lg text-gray-600 mb-8">{study.solution.summary}</p>
          <ul className="space-y-4 mb-8">
            {study.solution.points.map((point, index) => (
              <li key={index} className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">{point}</span>
              </li>
            ))}
          </ul>

          {/* Approach */}
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <h3 className="font-semibold text-[var(--aci-secondary)] mb-3">Our Approach</h3>
            <p className="text-gray-600">{study.solution.approach}</p>
          </div>
        </div>
      </section>

      {/* Technologies */}
      <section className="py-16 bg-white border-y">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-bold text-[var(--aci-secondary)] mb-6">Technologies Used</h2>
          <div className="flex flex-wrap gap-3">
            {study.technologies.map((tech) => (
              <span
                key={tech}
                className="px-4 py-2 bg-gray-100 rounded-lg text-gray-700 font-medium"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Detailed Results */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <span className="text-2xl">📊</span>
            </div>
            <h2 className="text-3xl font-bold text-[var(--aci-secondary)]">Results & Impact</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {study.results.map((result, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm">
                <div className="text-3xl font-bold text-[var(--aci-primary)] mb-2">{result.metric}</div>
                <div className="font-semibold text-[var(--aci-secondary)] mb-2">{result.description}</div>
                {result.detail && <p className="text-sm text-gray-500">{result.detail}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial */}
      {study.testimonial && (
        <section className="py-20 bg-[var(--aci-secondary)]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative">
              <Quote className="w-16 h-16 text-[var(--aci-primary)] opacity-50 mb-6" />
              <blockquote className="text-2xl md:text-3xl text-white font-light leading-relaxed mb-8">
                "{study.testimonial.quote}"
              </blockquote>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[var(--aci-primary)] rounded-full flex items-center justify-center text-white font-bold">
                  {study.testimonial.author.charAt(0)}
                </div>
                <div>
                  <div className="font-semibold text-white">{study.testimonial.author}</div>
                  <div className="text-gray-400">{study.testimonial.title}</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Related Case Studies */}
      {relatedStudies.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-[var(--aci-secondary)] mb-8">Related Case Studies</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {relatedStudies.map((related) => (
                <Link
                  key={related.slug}
                  href={`/case-studies/${related.slug}`}
                  className="group bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-all"
                >
                  <div className="flex items-center gap-4 mb-4">
                    {related.logo_url ? (
                      <Image
                        src={related.logo_url}
                        alt={`${displayClient(related)} logo - ${related.headline} case study`}
                        width={80}
                        height={32}
                        className="object-contain"
                      />
                    ) : (
                      <span className="text-lg font-bold text-[var(--aci-secondary)]">{displayClient(related)}</span>
                    )}
                    <span className="px-2 py-1 bg-blue-100 text-[var(--aci-primary)] text-xs rounded">
                      {related.service}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-[var(--aci-secondary)] group-hover:text-[var(--aci-primary)] transition-colors mb-2">
                    {related.headline}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">{related.subheadline}</p>
                  <span className="text-[var(--aci-primary)] text-sm font-medium inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                    Read Case Study <ArrowRight className="w-4 h-4" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-[var(--aci-primary)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Achieve Similar Results?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Let's discuss how we can apply our expertise to your challenges.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button href="/contact?reason=architecture-call" variant="secondary" size="lg">
              Schedule Architecture Call
            </Button>
            <Button href="/case-studies" variant="ghost" size="lg" className="text-white border-white hover:bg-white/10">
              View More Case Studies
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
