'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Filter, Search } from 'lucide-react';
import Button from '@/components/ui/Button';

// Case study data - in production, fetch from Supabase
const allCaseStudies = [
  {
    slug: 'msci-data-automation',
    client: 'MSCI',
    logo_url: '/images/clients/msci-logo.svg',
    industry: 'Financial Services',
    service: 'Data Engineering',
    headline: 'Consolidating 40+ Finance Systems Post-Acquisition',
    challenge: '40+ finance systems post-acquisitions needed consolidation with zero disruption to financial reporting',
    solution: 'SAP S/4HANA implementation with automated data quality gates and real-time integration pipelines',
    results: [
      { metric: '$12M', description: 'Operational savings in year one' },
      { metric: '18 months', description: 'Delivery timeline' },
      { metric: 'Zero', description: 'Financial reporting disruptions' },
    ],
    technologies: ['SAP S/4HANA', 'Python', 'Azure DevOps', 'Databricks'],
    is_featured: true,
  },
  {
    slug: 'racetrac-martech',
    client: 'RaceTrac',
    logo_url: '/images/clients/racetrac-logo.svg',
    industry: 'Retail',
    service: 'MarTech & CDP',
    headline: 'Real-Time Customer Engagement Across 600+ Locations',
    challenge: 'Payment systems across 600+ locations, zero downtime tolerance, fragmented customer data',
    solution: 'Modernized payment infrastructure, integrated loyalty program with Braze, unified customer profiles',
    results: [
      { metric: '30%', description: 'Reduction in data latency' },
      { metric: '25%', description: 'Improvement in promotion effectiveness' },
      { metric: '600+', description: 'Locations with zero downtime' },
    ],
    technologies: ['Salesforce', 'Braze', 'AWS', 'Databricks'],
    is_featured: true,
  },
  {
    slug: 'sodexo-unified-data',
    client: 'Sodexo',
    logo_url: '/images/clients/sodexo-logo.svg',
    industry: 'Hospitality',
    service: 'Data Engineering',
    headline: 'Unified Global Data Platform for 400K+ Employees',
    challenge: 'Global operations with data scattered across regional silos, inconsistent reporting',
    solution: 'Unified data platform with Informatica IICS and MDM, standardized data governance',
    results: [
      { metric: 'Single', description: 'Source of truth across all operations' },
      { metric: 'Global', description: 'Supply chain visibility' },
      { metric: '50%', description: 'Faster decision-making' },
    ],
    technologies: ['Informatica IICS', 'MDM', 'Cloud Integration', 'Snowflake'],
    is_featured: true,
  },
  {
    slug: 'fortune-100-retailer-ai',
    client: 'Fortune 100 Retailer',
    industry: 'Retail',
    service: 'Applied AI & ML',
    headline: 'AI-Powered Demand Forecasting at Scale',
    challenge: 'Manual forecasting causing $50M+ in inventory inefficiencies annually',
    solution: 'ML-powered demand forecasting with AutoML pipeline and real-time inventory optimization',
    results: [
      { metric: '23%', description: 'Reduction in stockouts' },
      { metric: '$18M', description: 'Annual inventory savings' },
      { metric: '92%', description: 'Forecast accuracy achieved' },
    ],
    technologies: ['Databricks', 'MLflow', 'Python', 'Azure ML'],
    is_featured: false,
  },
  {
    slug: 'healthcare-cloud-migration',
    client: 'Regional Healthcare System',
    industry: 'Healthcare',
    service: 'Cloud Modernization',
    headline: 'HIPAA-Compliant Cloud Migration for 15 Hospitals',
    challenge: 'Legacy on-premise systems, compliance concerns, 24/7 availability requirements',
    solution: 'Phased cloud migration with zero downtime, HIPAA-compliant architecture on AWS',
    results: [
      { metric: '40%', description: 'Infrastructure cost reduction' },
      { metric: '99.99%', description: 'Uptime achieved' },
      { metric: 'Zero', description: 'Compliance incidents' },
    ],
    technologies: ['AWS', 'Terraform', 'Kubernetes', 'CloudWatch'],
    is_featured: false,
  },
  {
    slug: 'finserv-fraud-detection',
    client: 'Major Financial Institution',
    industry: 'Financial Services',
    service: 'Applied AI & ML',
    headline: 'Real-Time Fraud Detection Reducing Losses by $25M',
    challenge: 'Rising fraud losses, slow manual review process, high false positive rates',
    solution: 'ML-based fraud detection with real-time scoring and explainable AI for compliance',
    results: [
      { metric: '$25M', description: 'Annual fraud loss reduction' },
      { metric: '85%', description: 'Reduction in false positives' },
      { metric: '<100ms', description: 'Transaction scoring time' },
    ],
    technologies: ['Python', 'TensorFlow', 'Kafka', 'Databricks'],
    is_featured: false,
  },
  {
    slug: 'manufacturing-iot',
    client: 'Global Manufacturer',
    industry: 'Manufacturing',
    service: 'Digital Transformation',
    headline: 'IoT-Enabled Predictive Maintenance Across 12 Plants',
    challenge: 'Unplanned downtime costing $2M+ monthly, reactive maintenance culture',
    solution: 'IoT sensor deployment with real-time analytics and predictive maintenance ML models',
    results: [
      { metric: '67%', description: 'Reduction in unplanned downtime' },
      { metric: '$18M', description: 'Annual maintenance savings' },
      { metric: '12', description: 'Plants connected globally' },
    ],
    technologies: ['Azure IoT', 'Databricks', 'Power BI', 'Python'],
    is_featured: false,
  },
  {
    slug: 'insurance-digital-platform',
    client: 'Top 10 Insurance Company',
    industry: 'Insurance',
    service: 'Digital Transformation',
    headline: 'Digital-First Customer Platform for 5M+ Policyholders',
    challenge: 'Outdated customer portal, high call center volume, poor digital experience',
    solution: 'Modern digital platform with self-service capabilities and AI-powered chatbot',
    results: [
      { metric: '45%', description: 'Reduction in call center volume' },
      { metric: '4.5★', description: 'App store rating achieved' },
      { metric: '5M+', description: 'Active digital users' },
    ],
    technologies: ['React', 'Node.js', 'AWS', 'Salesforce'],
    is_featured: false,
  },
  {
    slug: 'energy-security-overhaul',
    client: 'Energy Utility Company',
    industry: 'Energy',
    service: 'Cyber Security',
    headline: 'Zero-Trust Security Architecture for Critical Infrastructure',
    challenge: 'Legacy security posture, regulatory compliance gaps, increasing threat landscape',
    solution: 'Zero-trust architecture implementation with SOC modernization and threat hunting',
    results: [
      { metric: '100%', description: 'NERC CIP compliance achieved' },
      { metric: '90%', description: 'Reduction in incident response time' },
      { metric: 'Zero', description: 'Security breaches since implementation' },
    ],
    technologies: ['Splunk', 'CrowdStrike', 'Azure Sentinel', 'Palo Alto'],
    is_featured: false,
  },
  {
    slug: 'pharma-data-lake',
    client: 'Global Pharmaceutical Company',
    industry: 'Healthcare',
    service: 'Data Engineering',
    headline: 'Enterprise Data Lake for Drug Discovery Acceleration',
    challenge: 'Siloed research data, slow time-to-insight, regulatory data lineage requirements',
    solution: 'Unified data lake with automated data lineage tracking and self-service analytics',
    results: [
      { metric: '40%', description: 'Faster research data access' },
      { metric: '100%', description: 'Data lineage compliance' },
      { metric: '3x', description: 'Increase in researcher productivity' },
    ],
    technologies: ['Snowflake', 'dbt', 'Informatica', 'Tableau'],
    is_featured: false,
  },
  {
    slug: 'retail-personalization',
    client: 'National Retail Chain',
    industry: 'Retail',
    service: 'MarTech & CDP',
    headline: 'AI-Powered Personalization Driving 35% Revenue Lift',
    challenge: 'Generic marketing campaigns, low email engagement, untapped customer data',
    solution: 'Customer Data Platform with AI-driven personalization and omnichannel orchestration',
    results: [
      { metric: '35%', description: 'Increase in revenue from personalized campaigns' },
      { metric: '2.5x', description: 'Email engagement improvement' },
      { metric: '60%', description: 'Reduction in campaign setup time' },
    ],
    technologies: ['Adobe CDP', 'Braze', 'Databricks', 'AWS'],
    is_featured: false,
  },
  {
    slug: 'logistics-optimization',
    client: 'Fortune 500 Logistics Company',
    industry: 'Transportation',
    service: 'Applied AI & ML',
    headline: 'Route Optimization Saving $30M in Fuel Costs',
    challenge: 'Inefficient routing, rising fuel costs, driver scheduling complexities',
    solution: 'ML-powered route optimization with real-time traffic integration and dynamic scheduling',
    results: [
      { metric: '$30M', description: 'Annual fuel cost savings' },
      { metric: '15%', description: 'Improvement in on-time delivery' },
      { metric: '22%', description: 'Reduction in carbon emissions' },
    ],
    technologies: ['Python', 'Google OR-Tools', 'AWS', 'Kafka'],
    is_featured: false,
  },
  // ========== PLAYBOOK CASE STUDIES ==========
  {
    slug: 'post-acquisition-consolidation',
    client: 'Fortune 500 Financial Services',
    industry: 'Financial Services',
    service: 'Data Engineering',
    headline: 'Post-Acquisition System Consolidation: 30+ Systems to One',
    challenge: '30-50 disparate systems post-merger with multiple data formats, finance teams manually reconciling, and regulatory compliance requiring unified audit trails',
    solution: 'Phased migration with parallel runs, automated data quality gates catching 95% of issues, SOX compliance designed in from day one',
    results: [
      { metric: '$9.2M', description: 'Average year-one operational savings' },
      { metric: 'Zero', description: 'Financial reporting disruptions' },
      { metric: '78%', description: 'Manual effort reduction' },
    ],
    technologies: ['SAP S/4HANA', 'Python ETL', 'Azure/AWS Data Lakes', 'PowerBI', 'Automated Reconciliation'],
    is_featured: false,
  },
  {
    slug: 'real-time-data-platform',
    client: 'Multi-Location Retail Chain',
    industry: 'Retail',
    service: 'Data Engineering',
    headline: 'Real-Time Data Platform Across 600+ Locations',
    challenge: '300-1000+ physical locations generating transaction data with zero tolerance for payment downtime, legacy batch ETL creating 12-24hr latency',
    solution: 'Payment integration with dual-write pattern, auto-scaling for 3x weekend traffic spikes, Dynatrace observability preventing 90% of production issues',
    results: [
      { metric: '64%', description: 'Average latency reduction' },
      { metric: '99.97%', description: 'Uptime maintained during rollout' },
      { metric: 'Zero', description: 'Payment processing disruptions' },
    ],
    technologies: ['Kafka/Kinesis', 'Databricks Lakehouse', 'Delta Lake', 'Salesforce/Braze CDP', 'Dynatrace'],
    is_featured: false,
  },
  {
    slug: 'global-data-unification',
    client: 'Global Hospitality Company',
    industry: 'Hospitality',
    service: 'Data Engineering',
    headline: 'Global Data Unification Across 40+ Countries',
    challenge: 'Operations across 40-60 countries with regional data silos, inconsistent standards, no unified view of operations, executive reporting taking weeks',
    solution: 'Master data management established before integration, API-based integration for flexibility, data quality automation reducing manual effort 85%',
    results: [
      { metric: '50%', description: 'Faster decision-making' },
      { metric: '100%', description: 'Supply chain visibility achieved' },
      { metric: '65%', description: 'Duplicate record reduction' },
    ],
    technologies: ['Informatica IICS', 'Master Data Management', 'Cloud Data Lakes', 'API Gateway', 'Global Dashboards'],
    is_featured: false,
  },
  {
    slug: 'self-service-analytics',
    client: 'Enterprise Insurance Company',
    industry: 'Insurance',
    service: 'Data Engineering',
    headline: 'Self-Service Analytics for 10,000+ Users',
    challenge: '5,000-15,000 end users needing data access, every request going through IT with 2-week backlogs, row-level security required for multi-tenant access',
    solution: 'Row-level security designed upfront, pre-configured dashboards covering 80% of use cases, power user training creating internal champions',
    results: [
      { metric: '88%', description: 'IT request reduction' },
      { metric: '92%', description: 'User satisfaction improvement' },
      { metric: '2hrs', description: 'Time-to-insight (from 2 weeks)' },
    ],
    technologies: ['Databricks Lakehouse', 'Power BI/Tableau', 'Row-Level Security', 'Real-time Refresh', 'HIPAA Logging'],
    is_featured: false,
  },
  {
    slug: 'healthcare-data-platform',
    client: 'Multi-Country Healthcare Provider',
    industry: 'Healthcare',
    service: 'Data Engineering',
    headline: 'Multi-Jurisdiction Healthcare Data Platform',
    challenge: 'Patient data across multiple countries with different compliance requirements (HIPAA, GDPR), no unified patient identity, extremely stringent audit requirements',
    solution: 'Jurisdiction-specific compliance automated, master patient index with fuzzy matching reducing duplicates 60%, encryption at rest and in transit as baseline',
    results: [
      { metric: '100%', description: 'Global patient identity unified' },
      { metric: '58%', description: 'Duplicate patient record reduction' },
      { metric: 'Zero', description: 'HIPAA/GDPR violations' },
    ],
    technologies: ['Patient MDM', 'Multi-jurisdiction Compliance', 'Encrypted Storage', 'API Gateway', 'Clinical Integration', 'Audit Logging'],
    is_featured: false,
  },
  {
    slug: 'supply-chain-visibility',
    client: 'Global Manufacturing Company',
    industry: 'Manufacturing',
    service: 'Data Engineering',
    headline: 'End-to-End Supply Chain Visibility Platform',
    challenge: 'Supply chain data scattered across procurement, logistics, inventory with no end-to-end visibility, forecasting based on outdated data, disruption response taking days',
    solution: 'IoT integration for real-time location tracking, supplier data standardization, ML forecasting models outperforming historical trends',
    results: [
      { metric: '100%', description: 'End-to-end visibility achieved' },
      { metric: '25%', description: 'Reduction in carrying costs' },
      { metric: '4hrs', description: 'Disruption response time (from 3 days)' },
    ],
    technologies: ['Snowflake/Databricks', 'IoT Integration', 'SAP/Oracle ERP', 'ML Forecasting', 'Tableau/PowerBI', 'Real-time Alerting'],
    is_featured: false,
  },
  {
    slug: 'legacy-cloud-migration',
    client: 'Enterprise Financial Institution',
    industry: 'Financial Services',
    service: 'Cloud Modernization',
    headline: 'Legacy to Cloud Migration: 68% Cost Reduction',
    challenge: 'On-premise Hadoop/Teradata/Oracle aging, infrastructure costs growing 15-20% annually, scaling requiring 6-12 month hardware procurement, maintenance consuming 40%+ of team time',
    solution: 'Re-architecture for 3x better ROI, zero-downtime migration with parallel run strategy, cloud cost optimization designed in from start',
    results: [
      { metric: '68%', description: 'Infrastructure cost reduction' },
      { metric: '10x', description: 'Processing speed improvement' },
      { metric: '$3.2M', description: 'Average TCO savings over 3 years' },
    ],
    technologies: ['AWS/Azure/GCP', 'Databricks/Snowflake', 'Automated Migration Tools', 'Data Validation', 'Terraform IaC', 'Cost Optimization'],
    is_featured: false,
  },
  {
    slug: 'multi-source-integration',
    client: 'Technology Services Company',
    industry: 'Technology',
    service: 'Data Engineering',
    headline: 'Multi-Source Data Integration: 32 Systems Unified',
    challenge: 'Data scattered across 20-40 disparate source systems including SaaS, on-prem databases, spreadsheets, APIs, with no unified data model and dramatically varying data quality',
    solution: 'Source system discovery planning 3x longer, automated data quality issue detection, CDC for real-time sources, self-healing pipelines reducing overhead 80%',
    results: [
      { metric: '32', description: 'Average source systems integrated' },
      { metric: '85%', description: 'Data quality improvement' },
      { metric: '99.8%', description: 'Pipeline reliability' },
    ],
    technologies: ['Fivetran/Airbyte', 'Informatica/Mulesoft', 'Databricks/Snowflake', 'Great Expectations', 'Unified Data Model', 'Self-healing Pipelines'],
    is_featured: false,
  },
];

const industries = ['All', 'Financial Services', 'Retail', 'Healthcare', 'Hospitality', 'Manufacturing', 'Insurance', 'Energy', 'Transportation', 'Technology'];
const services = ['All', 'Data Engineering', 'Applied AI & ML', 'Cloud Modernization', 'MarTech & CDP', 'Digital Transformation', 'Cyber Security'];

export default function CaseStudiesPage() {
  const [selectedIndustry, setSelectedIndustry] = useState('All');
  const [selectedService, setSelectedService] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredStudies = allCaseStudies.filter((study) => {
    const matchesIndustry = selectedIndustry === 'All' || study.industry === selectedIndustry;
    const matchesService = selectedService === 'All' || study.service === selectedService;
    const matchesSearch = searchQuery === '' ||
      study.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      study.headline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      study.technologies.some(tech => tech.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesIndustry && matchesService && matchesSearch;
  });

  const featuredStudies = filteredStudies.filter(s => s.is_featured);
  const otherStudies = filteredStudies.filter(s => !s.is_featured);

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-[var(--aci-secondary)] pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <p className="text-[var(--aci-primary-light)] font-medium mb-4 tracking-wide uppercase">
              Client Success Stories
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              80+ Enterprise Transformations.
              <span className="text-[var(--aci-primary-light)]"> Real Results.</span>
            </h1>
            <p className="text-xl text-gray-400 mb-8">
              Explore how we've helped Fortune 500 companies and industry leaders
              solve their most complex data, AI, and technology challenges.
            </p>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-8 mt-12">
              <div className="text-center">
                <div className="text-4xl font-bold text-white">80+</div>
                <div className="text-gray-400">Client Engagements</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-white">$500M+</div>
                <div className="text-gray-400">Value Delivered</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-white">15+</div>
                <div className="text-gray-400">Industries Served</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="bg-gray-50 py-6 sticky top-20 z-40 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by client, technology..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[var(--aci-primary)] focus:border-transparent"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">Filters:</span>
              </div>

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

              <select
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[var(--aci-primary)] focus:border-transparent"
              >
                {services.map((service) => (
                  <option key={service} value={service}>
                    {service === 'All' ? 'All Services' : service}
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
            Showing <span className="font-semibold text-[var(--aci-secondary)]">{filteredStudies.length}</span> case studies
            {selectedIndustry !== 'All' && <span> in <span className="font-semibold">{selectedIndustry}</span></span>}
            {selectedService !== 'All' && <span> for <span className="font-semibold">{selectedService}</span></span>}
          </p>
        </div>
      </section>

      {/* Featured Case Studies */}
      {featuredStudies.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-[var(--aci-secondary)] mb-8">Featured Case Studies</h2>
            <div className="grid lg:grid-cols-3 gap-8">
              {featuredStudies.map((study) => (
                <CaseStudyCard key={study.slug} study={study} featured />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Case Studies */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {featuredStudies.length > 0 && otherStudies.length > 0 && (
            <h2 className="text-2xl font-bold text-[var(--aci-secondary)] mb-8">More Success Stories</h2>
          )}

          {filteredStudies.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">No case studies found matching your criteria.</p>
              <Button
                variant="secondary"
                className="mt-4"
                onClick={() => {
                  setSelectedIndustry('All');
                  setSelectedService('All');
                  setSearchQuery('');
                }}
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {(featuredStudies.length > 0 ? otherStudies : filteredStudies).map((study) => (
                <CaseStudyCard key={study.slug} study={study} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[var(--aci-primary)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Be Our Next Success Story?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Let's discuss how we can help transform your business with enterprise-grade solutions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button href="/contact?reason=architecture-call" variant="secondary" size="lg">
              Schedule Architecture Call
            </Button>
            <Button href="/services" variant="ghost" size="lg" className="text-white border-white hover:bg-white/10">
              Explore Our Services
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}

// Case Study Card Component
interface CaseStudyCardProps {
  study: typeof allCaseStudies[0];
  featured?: boolean;
}

function CaseStudyCard({ study, featured }: CaseStudyCardProps) {
  return (
    <Link
      href={`/case-studies/${study.slug}`}
      className={`group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 ${
        featured ? 'ring-2 ring-[var(--aci-primary)]' : ''
      }`}
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between mb-3">
          {study.logo_url ? (
            <Image
              src={study.logo_url}
              alt={`${study.client} logo - ${study.title} case study`}
              width={100}
              height={40}
              className="object-contain"
            />
          ) : (
            <span className="text-lg font-bold text-[var(--aci-secondary)]">{study.client}</span>
          )}
          {featured && (
            <span className="px-2 py-1 bg-[var(--aci-primary)] text-white text-xs font-medium rounded">
              Featured
            </span>
          )}
        </div>
        <div className="flex gap-2 mb-3">
          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">{study.industry}</span>
          <span className="px-2 py-1 bg-blue-50 text-[var(--aci-primary)] text-xs rounded">{study.service}</span>
        </div>
        <h3 className="text-lg font-semibold text-[var(--aci-secondary)] group-hover:text-[var(--aci-primary)] transition-colors line-clamp-2">
          {study.headline}
        </h3>
      </div>

      {/* Results */}
      <div className="p-6">
        <div className="space-y-3 mb-6">
          {study.results.slice(0, 3).map((result, index) => (
            <div key={index} className="flex items-baseline gap-3">
              <span className="text-xl font-bold text-[var(--aci-primary)]">
                {result.metric}
              </span>
              <span className="text-sm text-gray-600">{result.description}</span>
            </div>
          ))}
        </div>

        {/* Technologies */}
        <div className="flex flex-wrap gap-2 mb-4">
          {study.technologies.slice(0, 3).map((tech) => (
            <span
              key={tech}
              className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-600"
            >
              {tech}
            </span>
          ))}
          {study.technologies.length > 3 && (
            <span className="px-2 py-1 text-xs text-gray-400">
              +{study.technologies.length - 3} more
            </span>
          )}
        </div>

        {/* CTA */}
        <span className="text-[var(--aci-primary)] text-sm font-medium inline-flex items-center gap-1 group-hover:gap-2 transition-all">
          Read Full Case Study <ArrowRight className="w-4 h-4" />
        </span>
      </div>
    </Link>
  );
}
