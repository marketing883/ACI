'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import CtaSection from '@/components/v4/hero/CtaSection';
import { v4Sans, v4Display } from '@/components/v4/fonts';

// Playbook data - matches PlaybookVaultSection
const allPlaybooks = [
  {
    id: 'post-acquisition',
    slug: 'post-acquisition-consolidation',
    displayTitle: '40 Systems → One',
    fullTitle: 'Post-Acquisition System Consolidation',
    deployments: 23,
    description: 'Complete playbook for consolidating 30-50 disparate systems post-merger with zero disruption to financial reporting.',
    challengePattern: [
      '30-50 disparate systems post-merger',
      'Multiple data formats, inconsistent standards',
      'Finance teams manually reconciling',
      'Regulatory compliance needs unified audit',
    ],
    outcomes: [
      { metric: '$210K', description: 'Year-one savings' },
      { metric: '0', description: 'Disruptions' },
      { metric: '32%', description: 'Effort reduced' },
    ],
    industries: ['Financial Services', 'Private Equity', 'Healthcare', 'Manufacturing'],
    technologies: ['SAP S/4HANA', 'Python ETL', 'Azure/AWS', 'PowerBI'],
    category: 'Data Engineering',
  },
  {
    id: 'multi-location',
    slug: 'real-time-data-platform',
    displayTitle: '600 Stores, Real-Time',
    fullTitle: 'Multi-Location Real-Time Data Platform',
    deployments: 47,
    description: 'Production architecture for real-time data across 300-1000+ locations with zero tolerance for payment downtime.',
    challengePattern: [
      '300-1000+ locations generating data',
      'Zero tolerance for payment downtime',
      'Real-time customer behavior insights needed',
      'Legacy batch ETL causing 12-24hr latency',
    ],
    outcomes: [
      { metric: '28%', description: 'Latency reduced' },
      { metric: '99.5%', description: 'Uptime' },
      { metric: '0', description: 'Disruptions' },
    ],
    industries: ['Retail', 'QSR/Fast Food', 'Convenience Stores', 'Hospitality'],
    technologies: ['Kafka/Kinesis', 'Databricks', 'Delta Lake', 'Dynatrace'],
    category: 'Data Engineering',
  },
  {
    id: 'global-unification',
    slug: 'global-data-unification',
    displayTitle: '55 Countries, One System',
    fullTitle: 'Global Data Unification',
    deployments: 31,
    description: 'Proven approach for unifying data across 40-60 countries with regional silos and inconsistent standards.',
    challengePattern: [
      '40-60 countries with regional silos',
      'Inconsistent data standards globally',
      'No unified view of operations',
      'Executive reporting takes weeks',
    ],
    outcomes: [
      { metric: '50%', description: 'Faster decisions' },
      { metric: '100%', description: 'Visibility' },
      { metric: '65%', description: 'Duplicates removed' },
    ],
    industries: ['Hospitality', 'Manufacturing', 'Logistics', 'Professional Services'],
    technologies: ['Informatica IICS', 'MDM', 'Cloud Data Lakes', 'API Gateway'],
    category: 'Data Engineering',
  },
  {
    id: 'self-service-analytics',
    slug: 'self-service-analytics',
    displayTitle: '10K Users, Self-Served',
    fullTitle: 'Enterprise Self-Service Analytics',
    deployments: 19,
    description: 'Architecture for enabling 5,000-15,000 users with self-service analytics while maintaining row-level security.',
    challengePattern: [
      '5,000-15,000 users need data access',
      'IT backlog creating 2-week delays',
      'Users can\'t answer questions real-time',
      'Row-level security required',
    ],
    outcomes: [
      { metric: '88%', description: 'IT requests reduced' },
      { metric: '92%', description: 'Satisfaction' },
      { metric: '2hrs', description: 'Time-to-insight' },
    ],
    industries: ['Financial Services', 'Healthcare', 'Insurance', 'Retail'],
    technologies: ['Databricks', 'Power BI/Tableau', 'Row-Level Security', 'Real-time Refresh'],
    category: 'Analytics',
  },
  {
    id: 'healthcare-data',
    slug: 'healthcare-data-platform',
    displayTitle: 'HIPAA + GDPR + More',
    fullTitle: 'Multi-Jurisdiction Healthcare Data',
    deployments: 12,
    description: 'Comprehensive playbook for managing patient data across multiple countries with different compliance requirements.',
    challengePattern: [
      'Patient data across multiple countries',
      'Different compliance per region (HIPAA, GDPR)',
      'No unified patient identity',
      'Audit requirements extremely stringent',
    ],
    outcomes: [
      { metric: '100%', description: 'Identity unified' },
      { metric: '58%', description: 'Duplicates removed' },
      { metric: '0', description: 'Violations' },
    ],
    industries: ['Healthcare Services', 'Healthcare Tech', 'Clinical Research', 'Pharma'],
    technologies: ['Patient MDM', 'Compliance Automation', 'Encrypted Storage', 'Audit Logging'],
    category: 'Healthcare',
  },
  {
    id: 'supply-chain',
    slug: 'supply-chain-visibility',
    displayTitle: 'Supplier → Customer',
    fullTitle: 'Supply Chain Visibility',
    deployments: 28,
    description: 'End-to-end supply chain visibility platform integrating IoT, forecasting, and real-time alerting.',
    challengePattern: [
      'Data scattered across procurement/logistics',
      'No end-to-end supplier visibility',
      'Forecasting based on outdated data',
      'Disruption response takes days',
    ],
    outcomes: [
      { metric: '100%', description: 'E2E visibility' },
      { metric: '25%', description: 'Cost reduced' },
      { metric: '4hrs', description: 'Response time' },
    ],
    industries: ['Food & Beverage', 'Manufacturing', 'Retail', 'Automotive'],
    technologies: ['Snowflake/Databricks', 'IoT Integration', 'SAP/Oracle', 'ML Forecasting'],
    category: 'Supply Chain',
  },
  {
    id: 'cloud-migration',
    slug: 'legacy-cloud-migration',
    displayTitle: 'Hadoop → Cloud',
    fullTitle: 'Legacy to Cloud Migration',
    deployments: 52,
    description: 'Our most deployed playbook - migrating from aging on-prem Hadoop/Teradata/Oracle to modern cloud with 3x better ROI.',
    challengePattern: [
      'On-prem Hadoop/Teradata/Oracle aging',
      'Infrastructure costs growing 15-20%/year',
      'Scaling requires 6-12 month procurement',
      'Maintenance consuming 40%+ team time',
    ],
    outcomes: [
      { metric: '24%', description: 'Cost cut' },
      { metric: '3x', description: 'Speed gain' },
      { metric: '$420K', description: '3yr savings' },
    ],
    industries: ['Financial Services', 'Healthcare', 'Retail', 'Education'],
    technologies: ['AWS/Azure/GCP', 'Databricks/Snowflake', 'Migration Tools', 'Terraform IaC'],
    category: 'Cloud',
  },
  {
    id: 'data-integration',
    slug: 'multi-source-integration',
    displayTitle: '40 Sources, One Truth',
    fullTitle: 'Multi-Source Data Integration',
    deployments: 34,
    description: 'Playbook for integrating 20-40 disparate source systems with automated quality detection and self-healing pipelines.',
    challengePattern: [
      '20-40 disparate source systems',
      'SaaS, on-prem, spreadsheets, APIs mixed',
      'No unified data model or standards',
      'Data quality varies dramatically',
    ],
    outcomes: [
      { metric: '32', description: 'Avg systems' },
      { metric: '85%', description: 'Quality improved' },
      { metric: '99.8%', description: 'Reliability' },
    ],
    industries: ['Technology', 'Financial Services', 'Healthcare', 'Retail'],
    technologies: ['Fivetran/Airbyte', 'Informatica/Mulesoft', 'Databricks/Snowflake', 'Great Expectations'],
    category: 'Data Engineering',
  },
  {
    id: 'agentic-ai',
    slug: 'agentic-ai-deployment',
    displayTitle: 'AI Agent → Workflow',
    fullTitle: 'Enterprise Agentic AI Deployment',
    deployments: 18,
    description: 'Production playbook for deploying AI agents that make autonomous decisions—from multi-agent orchestration to legacy system integration.',
    challengePattern: [
      'Agents making decisions with only 20% of required context',
      'Multi-agent orchestration without clear handoff protocols',
      'Legacy systems lacking APIs for real-time agent interaction',
      'No boundaries between autonomous vs. human-approved decisions',
    ],
    outcomes: [
      { metric: '20-30%', description: 'Faster operations' },
      { metric: '1.5x', description: 'Scale without headcount' },
      { metric: '100%', description: 'Audit coverage' },
    ],
    industries: ['Financial Services', 'Healthcare', 'Retail', 'Technology', 'Manufacturing'],
    technologies: ['LangChain/LlamaIndex', 'Azure OpenAI/Bedrock', 'Vector DBs', 'Orchestration Platforms'],
    category: 'AI & ML',
  },
  {
    id: 'ai-governance',
    slug: 'enterprise-ai-governance',
    displayTitle: 'Governed AI',
    fullTitle: 'Enterprise AI Governance & Compliance',
    deployments: 14,
    description: 'Operational AI governance covering shadow AI detection, model risk management, EU AI Act compliance, and audit infrastructure.',
    challengePattern: [
      'Shadow AI proliferating without IT oversight',
      'No inventory of AI systems including vendor-embedded AI',
      'EU AI Act, CCPA, HIPAA with overlapping requirements',
      'Manual audit evidence taking weeks to assemble',
    ],
    outcomes: [
      { metric: '100%', description: 'AI visibility' },
      { metric: '40%', description: 'Faster audits' },
      { metric: '<5 days', description: 'Governance cycle' },
    ],
    industries: ['Financial Services', 'Healthcare', 'Insurance', 'Government'],
    technologies: ['AI Discovery', 'MLflow', 'Model Monitoring', 'GRC Integration'],
    category: 'AI & ML',
  },
];

const categories = ['All', 'Data Engineering', 'Cloud', 'Analytics', 'AI & ML', 'Healthcare', 'Supply Chain'];
const industries = ['All', 'Financial Services', 'Retail', 'Healthcare', 'Hospitality', 'Manufacturing', 'Technology'];

export default function PlaybooksPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedIndustry, setSelectedIndustry] = useState('All');

  const filteredPlaybooks = allPlaybooks.filter((playbook) => {
    const matchesCategory = selectedCategory === 'All' || playbook.category === selectedCategory;
    const matchesIndustry = selectedIndustry === 'All' || playbook.industries.includes(selectedIndustry);
    return matchesCategory && matchesIndustry;
  });

  const totalDeployments = allPlaybooks.reduce((sum, p) => sum + p.deployments, 0);

  return (
    <main className={`min-h-screen bg-white text-black ${v4Sans}`}>
      {/* Header */}
      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 pb-14 pt-12 md:pt-16">
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
            / Playbooks
          </p>
          <h1
            className={`max-w-4xl text-3xl font-bold tracking-tight sm:text-4xl lg:text-[44px] ${v4Display}`}
            style={{ lineHeight: 1.06 }}
          >
            Patterns we have shipped{' '}
            <span style={{ color: '#1D4ED8' }}>again and&nbsp;again</span>
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-gray-700 md:text-lg">
            Each playbook condenses dozens of deployments of the same pattern:
            what breaks, what order to do it in, and the numbers that came out
            the other&nbsp;side.
          </p>
        </div>
      </section>

      {/* Facts band */}
      <section className="border-b border-gray-200 bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 py-12 md:py-14">
          <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3">
            {[
              { value: `${allPlaybooks.length}`, label: 'Playbooks' },
              { value: `${totalDeployments}+`, label: 'Total deployments' },
              { value: '40+', label: 'Documented patterns' },
            ].map((fact) => (
              <div key={fact.label}>
                <p className={`text-4xl font-bold leading-none text-[#1D4ED8] sm:text-5xl ${v4Display}`}>
                  {fact.value}
                </p>
                <p className="mt-2 text-sm font-medium text-gray-500">{fact.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Filters: hairline selects, no pills */}
      <section className="sticky top-20 z-40 border-b border-gray-200 bg-white/95 backdrop-blur">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            {/* Results count */}
            <p className="text-sm text-gray-500">
              Showing <span className="font-semibold text-black">{filteredPlaybooks.length}</span> playbooks
              {selectedCategory !== 'All' && <span> in <span className="font-semibold text-black">{selectedCategory}</span></span>}
              {selectedIndustry !== 'All' && <span> for <span className="font-semibold text-black">{selectedIndustry}</span></span>}
            </p>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="border-0 border-b border-gray-200 bg-transparent py-2 pr-6 text-sm text-gray-700 focus:border-blue-700 focus:outline-none focus:ring-0"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category === 'All' ? 'All Categories' : category}
                  </option>
                ))}
              </select>

              <select
                value={selectedIndustry}
                onChange={(e) => setSelectedIndustry(e.target.value)}
                className="border-0 border-b border-gray-200 bg-transparent py-2 pr-6 text-sm text-gray-700 focus:border-blue-700 focus:outline-none focus:ring-0"
              >
                {industries.map((industry) => (
                  <option key={industry} value={industry}>
                    {industry === 'All' ? 'All Industries' : industry}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Playbooks Grid */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-14 md:py-16">
          {filteredPlaybooks.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-lg text-gray-500">No playbooks found matching your criteria.</p>
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setSelectedIndustry('All');
                }}
                className="group mt-4 inline-flex items-center gap-1 text-sm font-semibold text-blue-700 hover:underline"
              >
                Clear the filters
                <ArrowUpRight size={15} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {filteredPlaybooks.map((playbook) => (
                <PlaybookCard key={playbook.id} playbook={playbook} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Closing CTA: video stage, one button, nothing else */}
      <CtaSection label="Ask about the other patterns" href="/contact?reason=project-inquiry&source=playbooks-hub" />
    </main>
  );
}

// Playbook Card Component: dark v4 card with the deployment count and
// outcome metrics carrying the lime accent.
interface PlaybookCardProps {
  playbook: typeof allPlaybooks[0];
}

function PlaybookCard({ playbook }: PlaybookCardProps) {
  return (
    <Link
      href={`/playbooks/${playbook.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-3xl bg-[#0b1220] p-8 ring-1 ring-white/10 transition-all duration-300 hover:ring-white/25"
    >
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/60">
          {playbook.category}
        </p>
        <span className="shrink-0 text-xs font-semibold text-[#84CC16]">
          {playbook.deployments}x deployed
        </span>
      </div>

      <h3 className={`mt-5 text-2xl font-bold leading-snug text-white ${v4Display}`}>
        {playbook.displayTitle}
      </h3>
      <p className="mt-1 text-sm text-white/60">{playbook.fullTitle}</p>

      <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-white/75">
        {playbook.description}
      </p>

      {/* Outcomes */}
      <div className="mt-6 grid grid-cols-3 gap-4">
        {playbook.outcomes.slice(0, 3).map((outcome) => (
          <div key={outcome.description}>
            <p className={`text-xl font-bold leading-none text-[#84CC16] ${v4Display}`}>
              {outcome.metric}
            </p>
            <p className="mt-1 text-[11px] uppercase leading-tight tracking-[0.12em] text-white/50">
              {outcome.description}
            </p>
          </div>
        ))}
      </div>

      <div className="flex-1" />

      {/* Technologies */}
      <p className="mt-6 text-xs text-white/50">
        {playbook.technologies.slice(0, 3).join(' · ')}
        {playbook.technologies.length > 3 ? ` +${playbook.technologies.length - 3}` : ''}
      </p>

      <span className="mt-5 flex items-center gap-1 text-sm font-semibold text-[#84CC16]">
        Read the playbook
        <ArrowUpRight size={15} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </span>
    </Link>
  );
}
