'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Download, Filter, BookOpen } from 'lucide-react';
import Button from '@/components/ui/Button';

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
      { metric: '$9.2M', description: 'Year-one savings' },
      { metric: '0', description: 'Disruptions' },
      { metric: '78%', description: 'Effort reduced' },
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
    description: 'Battle-tested architecture for real-time data across 300-1000+ locations with zero tolerance for payment downtime.',
    challengePattern: [
      '300-1000+ locations generating data',
      'Zero tolerance for payment downtime',
      'Real-time customer behavior insights needed',
      'Legacy batch ETL causing 12-24hr latency',
    ],
    outcomes: [
      { metric: '64%', description: 'Latency reduced' },
      { metric: '99.97%', description: 'Uptime' },
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
      { metric: '68%', description: 'Cost cut' },
      { metric: '10x', description: 'Speed gain' },
      { metric: '$3.2M', description: '3yr savings' },
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
];

const categories = ['All', 'Data Engineering', 'Cloud', 'Analytics', 'Healthcare', 'Supply Chain'];
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
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-[#001529] pt-32 pb-20 relative overflow-hidden">
        {/* Blueprint grid background */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(rgba(24,144,255,0.06) 1px, transparent 1px),
              linear-gradient(90deg, rgba(24,144,255,0.06) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px',
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <p className="text-[#1890FF] font-medium mb-4 tracking-wide uppercase">
              Enterprise Architecture Library
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Proven Playbooks.
              <span className="text-[#C4FF61]"> Repeatable Success.</span>
            </h1>
            <p className="text-xl text-gray-400 mb-8">
              Every playbook represents dozens of successful deployments. Each one refined through real-world implementation,
              documenting challenges faced and solutions proven.
            </p>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-8 mt-12">
              <div className="text-center">
                <div className="text-4xl font-bold text-white">{allPlaybooks.length}</div>
                <div className="text-gray-400">Playbooks</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-white">{totalDeployments}+</div>
                <div className="text-gray-400">Total Deployments</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-white">100+</div>
                <div className="text-gray-400">Enterprise Patterns</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="bg-gray-50 py-6 sticky top-20 z-40 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">Filter by:</span>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 items-center">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[var(--aci-primary)] focus:border-transparent"
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
                className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[var(--aci-primary)] focus:border-transparent"
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

      {/* Results Count */}
      <section className="py-6 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-gray-600">
            Showing <span className="font-semibold text-[var(--aci-secondary)]">{filteredPlaybooks.length}</span> playbooks
            {selectedCategory !== 'All' && <span> in <span className="font-semibold">{selectedCategory}</span></span>}
            {selectedIndustry !== 'All' && <span> for <span className="font-semibold">{selectedIndustry}</span></span>}
          </p>
        </div>
      </section>

      {/* Playbooks Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredPlaybooks.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">No playbooks found matching your criteria.</p>
              <Button
                variant="secondary"
                className="mt-4"
                onClick={() => {
                  setSelectedCategory('All');
                  setSelectedIndustry('All');
                }}
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPlaybooks.map((playbook) => (
                <PlaybookCard key={playbook.id} playbook={playbook} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#001529]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Can't Find Your Exact Scenario?
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            We've documented 100+ patterns beyond these featured playbooks.
            Talk to an architect who can help identify the right approach for your specific challenge.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button href="/contact?reason=architecture-call" variant="primary" size="lg">
              Schedule Architecture Call
            </Button>
            <Button href="/case-studies" variant="ghost" size="lg" className="text-white border-white hover:bg-white/10">
              View Case Studies
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}

// Playbook Card Component
interface PlaybookCardProps {
  playbook: typeof allPlaybooks[0];
}

function PlaybookCard({ playbook }: PlaybookCardProps) {
  return (
    <Link
      href={`/playbooks/${playbook.slug}`}
      className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 border border-gray-100"
    >
      {/* Header with gradient */}
      <div className="p-6 bg-gradient-to-br from-[#001529] to-[#002140] relative overflow-hidden">
        {/* Blueprint grid */}
        <div
          className="absolute inset-0 pointer-events-none opacity-30"
          style={{
            backgroundImage: `
              linear-gradient(rgba(24,144,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(24,144,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '15px 15px',
          }}
        />

        <div className="relative">
          <div className="flex items-center justify-between mb-3">
            <span className="px-2 py-1 bg-[#1890FF]/20 text-[#1890FF] text-xs font-medium rounded">
              {playbook.category}
            </span>
            <span className="text-[#C4FF61] text-sm font-mono font-bold">
              {playbook.deployments}x deployed
            </span>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">
            {playbook.displayTitle}
          </h3>
          <p className="text-sm text-gray-400">{playbook.fullTitle}</p>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {playbook.description}
        </p>

        {/* Outcomes */}
        <div className="flex gap-4 mb-4">
          {playbook.outcomes.slice(0, 3).map((outcome, index) => (
            <div key={index} className="text-center">
              <div className="text-lg font-bold text-[var(--aci-primary)]">
                {outcome.metric}
              </div>
              <div className="text-xs text-gray-500">{outcome.description}</div>
            </div>
          ))}
        </div>

        {/* Technologies */}
        <div className="flex flex-wrap gap-2 mb-4">
          {playbook.technologies.slice(0, 3).map((tech) => (
            <span
              key={tech}
              className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-600"
            >
              {tech}
            </span>
          ))}
          {playbook.technologies.length > 3 && (
            <span className="px-2 py-1 text-xs text-gray-400">
              +{playbook.technologies.length - 3} more
            </span>
          )}
        </div>

        {/* CTA */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <span className="text-[var(--aci-primary)] text-sm font-medium inline-flex items-center gap-1 group-hover:gap-2 transition-all">
            <BookOpen className="w-4 h-4" /> View Playbook
          </span>
          <span className="text-gray-400 text-sm inline-flex items-center gap-1">
            <Download className="w-4 h-4" /> PDF Available
          </span>
        </div>
      </div>
    </Link>
  );
}
