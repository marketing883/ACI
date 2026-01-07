import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, CheckCircle2, Quote, ExternalLink } from 'lucide-react';
import Button from '@/components/ui/Button';

// Case study data - in production, fetch from Supabase
const caseStudiesData: Record<string, CaseStudyDetail> = {
  'msci-data-automation': {
    slug: 'msci-data-automation',
    client: 'MSCI',
    logo_url: '/images/clients/msci-logo.svg',
    industry: 'Financial Services',
    service: 'Data Engineering',
    headline: 'Consolidating 40+ Finance Systems Post-Acquisition',
    subheadline: 'How we helped MSCI achieve $12M in operational savings through SAP S/4HANA implementation',
    challenge: {
      summary: 'Following multiple acquisitions, MSCI faced a critical challenge: 40+ disparate finance systems needed consolidation without disrupting financial reporting cycles.',
      points: [
        'Multiple legacy ERP systems from acquired companies',
        'Inconsistent data formats and business processes',
        'Regulatory compliance requirements across jurisdictions',
        'Zero tolerance for financial reporting disruptions',
        'Aggressive 18-month timeline mandated by leadership',
      ],
    },
    solution: {
      summary: 'We designed and implemented a comprehensive SAP S/4HANA transformation with automated data quality gates and real-time integration pipelines.',
      points: [
        'Phased SAP S/4HANA rollout with parallel operation capability',
        'Automated data migration with quality validation at every step',
        'Real-time integration pipelines using Azure DevOps',
        'Custom reporting dashboards for finance leadership',
        'Comprehensive training program for 200+ finance users',
      ],
      approach: 'Our team worked in 2-week sprints with daily standups with MSCI stakeholders. We used a parallel-run approach to validate data accuracy before each cutover phase.',
    },
    results: [
      { metric: '$12M', description: 'Operational savings in year one', detail: 'Achieved through process automation and system consolidation' },
      { metric: '18 months', description: 'Delivery timeline', detail: 'Completed on time despite COVID-19 disruptions' },
      { metric: 'Zero', description: 'Financial reporting disruptions', detail: 'All quarterly closes completed without issues' },
      { metric: '40+', description: 'Systems consolidated', detail: 'Migrated to single unified platform' },
      { metric: '200+', description: 'Users trained', detail: 'Across 5 countries and 3 time zones' },
    ],
    technologies: ['SAP S/4HANA', 'Python', 'Azure DevOps', 'Databricks', 'Power BI', 'Azure Data Factory'],
    timeline: '18 months',
    teamSize: '25+ consultants',
    testimonial: {
      quote: "ACI Infotech's team demonstrated exceptional expertise in navigating our complex post-merger landscape. They delivered on an aggressive timeline while maintaining the highest quality standards.",
      author: 'VP of Finance Operations',
      title: 'MSCI',
    },
    relatedStudies: ['sodexo-unified-data', 'pharma-data-lake'],
  },
  'racetrac-martech': {
    slug: 'racetrac-martech',
    client: 'RaceTrac',
    logo_url: '/images/clients/racetrac-logo.svg',
    industry: 'Retail',
    service: 'MarTech & CDP',
    headline: 'Real-Time Customer Engagement Across 600+ Locations',
    subheadline: 'Building a unified customer data platform that increased promotion effectiveness by 25%',
    challenge: {
      summary: 'RaceTrac needed to modernize their payment infrastructure and create a unified view of customers across 600+ convenience store locations.',
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
      quote: "I'm thrilled with our Data Team's achievement at ACI Infotech. They've flawlessly delivered top-tier Digital Data to Altria, marking a critical milestone for RaceTrac.",
      author: 'Director of Data and MarTech',
      title: 'RaceTrac',
    },
    relatedStudies: ['retail-personalization', 'msci-data-automation'],
  },
  'sodexo-unified-data': {
    slug: 'sodexo-unified-data',
    client: 'Sodexo',
    logo_url: '/images/clients/sodexo-logo.svg',
    industry: 'Hospitality',
    service: 'Data Engineering',
    headline: 'Unified Global Data Platform for 400K+ Employees',
    subheadline: 'Creating a single source of truth across 80+ countries',
    challenge: {
      summary: 'Sodexo\'s global operations spanning 80+ countries faced data fragmentation that hindered strategic decision-making.',
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
      title: 'Sodexo',
    },
    relatedStudies: ['msci-data-automation', 'pharma-data-lake'],
  },
};

// Add more case studies with basic data for routing
const basicCaseStudies = [
  'fortune-100-retailer-ai',
  'healthcare-cloud-migration',
  'finserv-fraud-detection',
  'manufacturing-iot',
  'insurance-digital-platform',
  'energy-security-overhaul',
  'pharma-data-lake',
  'retail-personalization',
  'logistics-optimization',
];

interface CaseStudyDetail {
  slug: string;
  client: string;
  logo_url?: string;
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
  const study = caseStudiesData[slug];

  if (!study) {
    return {
      title: 'Case Study Not Found | ACI Infotech',
    };
  }

  return {
    title: `${study.client} Case Study | ${study.headline} | ACI Infotech`,
    description: study.subheadline,
  };
}

export default async function CaseStudyPage({ params }: PageProps) {
  const { slug } = await params;
  const study = caseStudiesData[slug];

  if (!study) {
    // For basic case studies without full content, show a coming soon or redirect
    if (basicCaseStudies.includes(slug)) {
      return (
        <main className="min-h-screen">
          <section className="bg-[var(--aci-secondary)] pt-32 pb-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <p className="text-[var(--aci-primary-light)] font-medium mb-4">Case Study</p>
              <h1 className="text-4xl font-bold text-white mb-6">Full Case Study Coming Soon</h1>
              <p className="text-xl text-gray-400 mb-8">
                We're preparing the detailed case study for this project. In the meantime, explore our other success stories.
              </p>
              <Button href="/case-studies" variant="secondary">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Case Studies
              </Button>
            </div>
          </section>
        </main>
      );
    }
    notFound();
  }

  const relatedStudies = study.relatedStudies
    ?.map(slug => caseStudiesData[slug])
    .filter(Boolean) || [];

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-[var(--aci-secondary)] pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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
                alt={study.client}
                width={120}
                height={48}
                className="object-contain brightness-0 invert"
              />
            ) : (
              <span className="text-2xl font-bold text-white">{study.client}</span>
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
                        alt={related.client}
                        width={80}
                        height={32}
                        className="object-contain"
                      />
                    ) : (
                      <span className="text-lg font-bold text-[var(--aci-secondary)]">{related.client}</span>
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
