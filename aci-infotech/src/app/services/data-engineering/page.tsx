import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, CheckCircle, ChevronDown, Database, Zap, Eye, Shield, Settings, Cloud } from 'lucide-react';
import Button from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'Data Engineering Services | ACI Infotech',
  description: 'Enterprise data platforms that feed AI and analytics. Databricks lakehouses, Snowflake warehouses, real-time pipelines with Dynatrace observability. 40+ deployments, 30%+ latency reduction.',
  keywords: 'data engineering services, databricks consulting, snowflake implementation, data lakehouse, real-time data pipelines, enterprise data platform',
};

// Service data
const keyOutcomes = [
  'Cut data latency 30%+ with real-time pipelines',
  'Unify scattered data into single source of truth',
  'Enable AI-ready data products from day one',
  'Instrument observability so you see issues before users',
];

const offerings = [
  {
    id: 'unified-lakehouse',
    title: 'Unified Data Lakehouse',
    description: 'Consolidate scattered data warehouses into one governed lakehouse built on Databricks or Snowflake.',
    icon: Database,
    technologies: ['Azure Databricks', 'Delta Lake', 'Snowflake', 'Apache Iceberg', 'dbt'],
    outcomes: ['30-40% storage cost reduction', 'Single source of truth', 'AI-ready data products'],
  },
  {
    id: 'real-time-pipelines',
    title: 'Real-Time Data Pipelines',
    description: 'Streaming data pipelines that feed dashboards, ML models, and operational systems with millisecond latency.',
    icon: Zap,
    technologies: ['Kafka', 'Spark Streaming', 'AWS Kinesis', 'Azure Event Hubs'],
    outcomes: ['<1 second data latency', 'Real-time insights', 'Self-healing pipelines'],
  },
  {
    id: 'data-observability',
    title: 'Data Observability & Quality',
    description: 'Monitor data lineage, freshness, and SLAs end-to-end with Dynatrace or similar platforms.',
    icon: Eye,
    technologies: ['Dynatrace', 'Great Expectations', 'Monte Carlo', 'DataHub'],
    outcomes: ['90% reduction in quality incidents', 'Full lineage tracking', 'SLA compliance visibility'],
  },
  {
    id: 'dataops-automation',
    title: 'DataOps & Automation',
    description: 'CI/CD pipelines for data with automated testing, deployment, and monitoring.',
    icon: Settings,
    technologies: ['GitLab CI/CD', 'Terraform', 'Airflow', 'Dagster'],
    outcomes: ['40% faster pipeline development', 'Automated testing', 'Version-controlled infrastructure'],
  },
  {
    id: 'data-governance',
    title: 'Data Governance & Cataloging',
    description: 'Enterprise data governance with Unity Catalog, Collibra, or Alation.',
    icon: Shield,
    technologies: ['Unity Catalog', 'Collibra', 'Alation', 'Apache Atlas'],
    outcomes: ['100% data cataloged', 'Automated PII classification', 'Audit-ready logs'],
  },
  {
    id: 'cloud-data-migration',
    title: 'Cloud Data Migration',
    description: 'Migrate on-premises data warehouses to cloud with zero downtime.',
    icon: Cloud,
    technologies: ['AWS DMS', 'Azure Data Migration', 'Snowflake Migration'],
    outcomes: ['Zero-downtime migration', '30-50% cost reduction', 'Legacy decommissioning'],
  },
];

const caseStudies = [
  {
    slug: 'msci-data-automation',
    client: 'MSCI',
    industry: 'Financial Services',
    challenge: '40+ finance systems post-acquisitions needed consolidation into unified platform',
    results: [
      { metric: '$12M', description: 'Operational savings in year one' },
      { metric: '18 months', description: 'Delivery timeline' },
      { metric: 'Zero', description: 'Financial reporting disruptions' },
    ],
    technologies: ['SAP S/4HANA', 'Python', 'Azure DevOps'],
  },
  {
    slug: 'racetrac-real-time-data',
    client: 'RaceTrac',
    industry: 'Retail',
    challenge: 'Payment systems across 600+ locations needed real-time data with zero downtime',
    results: [
      { metric: '30%', description: 'Reduction in data latency' },
      { metric: '600+', description: 'Locations with zero downtime' },
      { metric: 'Real-time', description: 'Inventory visibility' },
    ],
    technologies: ['Databricks', 'Kafka', 'AWS', 'Braze'],
  },
  {
    slug: 'sodexo-unified-data',
    client: 'Sodexo',
    industry: 'Hospitality',
    challenge: 'Global operations with data scattered across regional silos',
    results: [
      { metric: 'Single', description: 'Source of truth' },
      { metric: 'Global', description: 'Supply chain visibility' },
      { metric: '50%', description: 'Faster decision-making' },
    ],
    technologies: ['Informatica IICS', 'MDM', 'Cloud Integration'],
  },
];

const processPhases = [
  {
    number: 1,
    title: 'Discovery & Architecture',
    duration: 'Weeks 1-4',
    description: 'Assess your current data landscape, understand business requirements, and design the target architecture.',
  },
  {
    number: 2,
    title: 'Foundation & Setup',
    duration: 'Weeks 5-12',
    description: 'Platform provisioning, security framework, governance setup. The foundation everything builds on.',
  },
  {
    number: 3,
    title: 'Build & Iterate',
    duration: 'Months 4-8',
    description: 'Iterative development in 2-week sprints. Build pipelines, transform data, create data products.',
  },
  {
    number: 4,
    title: 'Launch & Stabilize',
    duration: 'Weeks 9-12',
    description: 'Production deployment with monitoring, alerting, and runbooks. We stabilize until SLAs are met.',
  },
  {
    number: 5,
    title: 'Optimize & Scale',
    duration: 'Ongoing',
    description: 'Continuous optimization, cost management, and feature enhancements.',
  },
];

const differentiators = [
  {
    title: 'Deep Platform Expertise',
    description: "We're Databricks Exclusive Partner and Snowflake certified with 40+ lakehouse implementations.",
    proof: '40+ enterprise data platforms deployed',
  },
  {
    title: 'Observability Built In',
    description: 'Dynatrace partnership means we instrument observability from day one.',
    proof: 'Every platform ships with monitoring',
  },
  {
    title: 'Production-Grade from Start',
    description: "We don't build pilots that die. We architect for production scale from the first sprint.",
    proof: 'Zero production failures in last 3 years',
  },
  {
    title: 'Cost-Effective Delivery',
    description: '40-60% less than Big 4 consultancies. Senior architects leading, not junior analysts.',
    proof: '70% senior engineers on every project',
  },
];

const faqs = [
  {
    question: 'How long does a typical data platform project take?',
    answer: '6-12 months for enterprise-scale lakehouse consolidation. Smaller projects (single pipeline, specific integration) can be 3-6 months.',
  },
  {
    question: "What's the ROI of a modern data platform?",
    answer: 'Typical clients see 30-40% reduction in storage costs, 50%+ faster time to insights, and 3-5x improvement in data analyst productivity.',
  },
  {
    question: 'Do we need to migrate everything at once?',
    answer: "No. We use a phased approach, critical systems first, then expand. You'll see value within 3-4 months.",
  },
  {
    question: 'Can you work with our existing cloud provider?',
    answer: "Yes. We're certified on AWS, Azure, and GCP. We design for your environment and can handle multi-cloud.",
  },
];

export default function DataEngineeringPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="py-20 lg:py-28 bg-gradient-to-br from-[var(--aci-secondary)] to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-[var(--aci-primary-light)] font-semibold text-sm uppercase tracking-wide">
                Data Engineering
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-white mt-3 mb-6">
                Platforms That Feed AI and Analytics
              </h1>
              <p className="text-lg text-gray-300 mb-8">
                Databricks lakehouses, Snowflake warehouses, real-time pipelines with Dynatrace observability.
                We build data platforms that feed AI, power analytics, and run 24/7 with SLAs.
                Not architecture diagrams, production code that handles millions of records per second.
              </p>

              {/* Key Outcomes */}
              <ul className="space-y-3 mb-8">
                {keyOutcomes.map((outcome) => (
                  <li key={outcome} className="flex items-center gap-3 text-gray-300">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                    {outcome}
                  </li>
                ))}
              </ul>

              <p className="text-sm text-[var(--aci-primary-light)] mb-8">
                40+ enterprise data platforms deployed | 30%+ average latency reduction
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button href="/contact?service=data-engineering" variant="primary" size="lg">
                  Talk to a Data Architect
                </Button>
                <Button
                  href="/case-studies?service=data-engineering"
                  variant="ghost"
                  size="lg"
                  className="text-white border-white hover:bg-white/10"
                >
                  See Data Projects
                </Button>
              </div>
            </div>

            {/* Visual - Data Flow Diagram Mockup */}
            <div className="relative hidden lg:block">
              <div className="bg-gray-800 rounded-2xl p-8 shadow-2xl">
                <div className="text-sm text-gray-400 mb-4">Data Platform Architecture</div>
                <div className="space-y-4">
                  {/* Source Layer */}
                  <div className="flex gap-2">
                    {['CRM', 'ERP', 'APIs', 'IoT'].map((src) => (
                      <div key={src} className="flex-1 bg-gray-700 rounded-lg p-3 text-center text-xs text-gray-300">
                        {src}
                      </div>
                    ))}
                  </div>
                  <div className="text-center text-gray-500">↓</div>
                  {/* Ingestion */}
                  <div className="bg-[var(--aci-primary)]/20 rounded-lg p-4 text-center">
                    <div className="text-[var(--aci-primary-light)] font-medium">Data Ingestion Layer</div>
                    <div className="text-xs text-gray-400 mt-1">Kafka • Spark Streaming • AWS Glue</div>
                  </div>
                  <div className="text-center text-gray-500">↓</div>
                  {/* Lakehouse */}
                  <div className="bg-[var(--aci-primary)]/30 rounded-lg p-4 text-center">
                    <div className="text-white font-bold">Unified Lakehouse</div>
                    <div className="text-xs text-gray-300 mt-1">Databricks • Delta Lake • Unity Catalog</div>
                  </div>
                  <div className="text-center text-gray-500">↓</div>
                  {/* Consumption */}
                  <div className="flex gap-2">
                    {['AI/ML', 'BI', 'Apps'].map((dest) => (
                      <div key={dest} className="flex-1 bg-green-900/30 rounded-lg p-3 text-center text-xs text-green-300">
                        {dest}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="absolute -inset-4 bg-[var(--aci-primary)]/10 rounded-3xl blur-3xl -z-10"></div>
            </div>
          </div>
        </div>
      </section>

      {/* What We Build */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--aci-secondary)] mb-6">
              What We Actually Build
            </h2>
            <div className="space-y-4 text-gray-600">
              <p>
                We build data platforms on Databricks, Snowflake, and AWS/Azure cloud data services.
                This isn't abstract architecture, it's production code that handles your data volumes,
                meets your SLAs, and feeds your AI models.
              </p>
              <p>
                Most enterprises have data scattered across 10-50 systems accumulated over decades of
                acquisitions, point solutions, and organic growth. We consolidate that chaos into a
                governed lakehouse where every dataset has lineage, quality scores, and access controls.
              </p>
              <p className="font-semibold text-[var(--aci-secondary)]">
                We've done this 40+ times for Fortune 500 companies. When something breaks at 2am,
                we're on the call with you.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Service Offerings */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--aci-secondary)] mb-4">
              Data Engineering Services
            </h2>
            <p className="text-lg text-gray-600">
              Six core offerings, each delivered with production-grade quality
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {offerings.map((offering) => {
              const Icon = offering.icon;
              return (
                <div
                  key={offering.id}
                  className="bg-white p-8 rounded-xl shadow-sm hover:shadow-lg transition-shadow"
                >
                  <Icon className="w-10 h-10 text-[var(--aci-primary)] mb-4" />
                  <h3 className="text-xl font-semibold text-[var(--aci-secondary)] mb-3">
                    {offering.title}
                  </h3>
                  <p className="text-gray-600 mb-6">{offering.description}</p>

                  <div className="mb-4">
                    <div className="text-sm font-medium text-gray-500 mb-2">Key Outcomes</div>
                    <ul className="space-y-1">
                      {offering.outcomes.map((outcome) => (
                        <li key={outcome} className="flex items-center gap-2 text-sm text-gray-600">
                          <CheckCircle className="w-3 h-3 text-green-500" />
                          {outcome}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {offering.technologies.slice(0, 4).map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-600"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Case Studies */}
      <section className="py-20 bg-[var(--aci-secondary)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Data Engineering Projects We've Built
            </h2>
            <p className="text-lg text-gray-400">
              Real projects. Real Fortune 500 clients. Real outcomes.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {caseStudies.map((study) => (
              <div
                key={study.slug}
                className="bg-gray-800 rounded-xl overflow-hidden hover:bg-gray-700 transition-colors"
              >
                <div className="p-6 border-b border-gray-700">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xl font-bold text-white">{study.client}</span>
                    <span className="text-sm text-gray-400">{study.industry}</span>
                  </div>
                  <p className="text-gray-300 text-sm">{study.challenge}</p>
                </div>
                <div className="p-6">
                  <div className="space-y-3 mb-6">
                    {study.results.map((result, idx) => (
                      <div key={idx} className="flex items-baseline gap-3">
                        <span className="text-2xl font-bold text-[var(--aci-primary-light)]">
                          {result.metric}
                        </span>
                        <span className="text-sm text-gray-400">{result.description}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {study.technologies.map((tech) => (
                      <span key={tech} className="px-2 py-1 bg-gray-700 rounded text-xs text-gray-300">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button href="/case-studies?service=data-engineering" variant="secondary" size="lg">
              See All Data Engineering Case Studies <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--aci-secondary)] mb-4">
              Our Data Engineering Process
            </h2>
            <p className="text-lg text-gray-600">
              From engagement to production: how we work
            </p>
          </div>

          <div className="grid md:grid-cols-5 gap-6">
            {processPhases.map((phase, index) => (
              <div key={phase.number} className="relative">
                <div className="bg-gray-50 rounded-xl p-6 h-full">
                  <div className="text-4xl font-bold text-[var(--aci-primary)]/20 mb-2">
                    0{phase.number}
                  </div>
                  <h3 className="font-semibold text-[var(--aci-secondary)] mb-1">
                    {phase.title}
                  </h3>
                  <div className="text-sm text-[var(--aci-primary)] mb-3">{phase.duration}</div>
                  <p className="text-sm text-gray-600">{phase.description}</p>
                </div>
                {index < processPhases.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2 text-gray-300">
                    →
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose ACI */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--aci-secondary)] mb-4">
              Why Choose ACI for Data Engineering
            </h2>
            <p className="text-lg text-gray-600">
              What makes us different from other consulting firms
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {differentiators.map((diff) => (
              <div key={diff.title} className="bg-white p-8 rounded-xl shadow-sm">
                <h3 className="text-xl font-semibold text-[var(--aci-secondary)] mb-3">
                  {diff.title}
                </h3>
                <p className="text-gray-600 mb-4">{diff.description}</p>
                <div className="flex items-center gap-2 text-sm text-[var(--aci-primary)]">
                  <CheckCircle className="w-4 h-4" />
                  {diff.proof}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--aci-secondary)] mb-4">
              Common Questions About Data Engineering
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq) => (
              <details key={faq.question} className="group bg-gray-50 rounded-xl">
                <summary className="flex items-center justify-between cursor-pointer p-6 text-lg font-medium text-[var(--aci-secondary)]">
                  {faq.question}
                  <ChevronDown className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform" />
                </summary>
                <div className="px-6 pb-6 text-gray-600">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-[var(--aci-primary)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Build Your Data Platform?
          </h2>
          <p className="text-lg text-blue-100 mb-8">
            Schedule a 30-minute technical call with one of our data architects.
            No sales pitch, just an engineering conversation about your specific data challenges.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <span className="text-blue-200 text-sm">Talk to senior data architects, not sales reps</span>
            <span className="text-blue-300">|</span>
            <span className="text-blue-200 text-sm">30-minute technical discussion</span>
            <span className="text-blue-300">|</span>
            <span className="text-blue-200 text-sm">We'll tell you if we're not the right fit</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button href="/contact?service=data-engineering" variant="secondary" size="lg">
              Talk to a Data Architect
            </Button>
            <Button
              href="/case-studies?service=data-engineering"
              variant="ghost"
              size="lg"
              className="text-white border-white hover:bg-white/10"
            >
              See Data Engineering Case Studies
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
