'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Filter, Search, Loader2 } from 'lucide-react';
import Button from '@/components/ui/Button';

// Types for case studies
interface CaseStudyResult {
  metric: string;
  description: string;
}

interface CaseStudy {
  id?: string;
  slug: string;
  client: string;
  logo_url?: string;
  featured_image?: string;
  industry: string;
  service: string;
  headline: string;
  challenge: string;
  solution: string;
  results: CaseStudyResult[];
  technologies: string[];
  is_featured?: boolean;
  is_published?: boolean;
}

// Demo case study data - used as fallback
const demoCaseStudies: CaseStudy[] = [
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
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Helper to parse JSON fields that might be stored as strings
  const parseJsonField = <T,>(value: T | string | null | undefined, fallback: T): T => {
    if (!value) return fallback;
    if (typeof value === 'string') {
      try {
        return JSON.parse(value) as T;
      } catch {
        return fallback;
      }
    }
    return value as T;
  };

  // Fetch case studies from database
  useEffect(() => {
    async function fetchCaseStudies() {
      setIsLoading(true);

      try {
        const response = await fetch('/api/admin/case-studies');
        const result = await response.json();

        if (result.error) {
          console.error('Error fetching case studies:', result.error);
          setCaseStudies(demoCaseStudies);
        } else if (result.caseStudies && result.caseStudies.length > 0) {
          // Transform database format to card component format
          interface DbCaseStudy {
            id?: string;
            slug: string;
            title?: string;
            client_name?: string;
            client_logo_url?: string;
            featured_image_url?: string;
            industry?: string;
            services?: string[] | string;
            challenge?: string;
            solution?: string;
            results?: string;
            metrics?: { label: string; value: string; description?: string }[] | string;
            technologies?: string[] | string;
            is_featured?: boolean;
            status?: string;
          }

          const transformedCaseStudies = result.caseStudies.map((study: DbCaseStudy) => {
            // Parse services array
            const servicesArray = parseJsonField<string[]>(study.services, []);

            // Parse metrics and convert to results format
            const metricsArray = parseJsonField<{ label: string; value: string; description?: string }[]>(study.metrics, []);
            const resultsArray = metricsArray.map(m => ({
              metric: m.value,
              description: m.label + (m.description ? ` - ${m.description}` : ''),
            }));

            // Parse technologies
            const techArray = parseJsonField<string[]>(study.technologies, []);

            return {
              id: study.id,
              slug: study.slug,
              client: study.client_name || 'Enterprise Client',
              logo_url: study.client_logo_url,
              featured_image: study.featured_image_url,
              industry: study.industry || 'Technology',
              service: servicesArray[0] || 'Data Engineering',
              headline: study.title || 'Enterprise Transformation',
              challenge: study.challenge || '',
              solution: study.solution || '',
              results: resultsArray.length > 0 ? resultsArray : [
                { metric: 'Significant', description: 'Business impact achieved' }
              ],
              technologies: techArray,
              is_featured: study.is_featured,
              is_published: study.status === 'published',
            };
          });

          setCaseStudies(transformedCaseStudies);
        } else if (result.demo) {
          setCaseStudies(demoCaseStudies);
        } else {
          setCaseStudies(demoCaseStudies);
        }
      } catch (error) {
        console.error('Error fetching case studies:', error);
        setCaseStudies(demoCaseStudies);
      }

      setIsLoading(false);
    }

    fetchCaseStudies();
  }, []);

  // Filter studies - maintain chronological order from API (created_at DESC)
  const filteredStudies = caseStudies.filter((study) => {
    const matchesIndustry = selectedIndustry === 'All' || study.industry === selectedIndustry;
    const matchesService = selectedService === 'All' || study.service === selectedService;
    const matchesSearch = searchQuery === '' ||
      study.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      study.headline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      study.technologies?.some(tech => tech.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesIndustry && matchesService && matchesSearch;
  });

  // Latest case studies for hero section (first 3 by created_at DESC)
  const latestStudies = filteredStudies.slice(0, 3);
  // Remaining case studies for grid
  const remainingStudies = filteredStudies.slice(3);

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

      {/* Loading State */}
      {isLoading && (
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center justify-center">
              <Loader2 className="w-12 h-12 text-[var(--aci-primary)] animate-spin mb-4" />
              <p className="text-gray-500">Loading case studies...</p>
            </div>
          </div>
        </section>
      )}

      
      {/* Latest Case Studies Hero */}
      {!isLoading && latestStudies.length > 0 && selectedIndustry === 'All' && selectedService === 'All' && searchQuery === '' && (
        <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-[var(--aci-secondary)] mb-3">Latest Case Studies</h2>
              <p className="text-gray-600">Our most recent enterprise transformations</p>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              {latestStudies.map((study) => (
                <CaseStudyCard key={study.slug} study={study} featured={study.is_featured} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Case Studies */}
      {!isLoading && (
        <section className="py-20 bg-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {(selectedIndustry === 'All' && selectedService === 'All' && searchQuery === '' && latestStudies.length > 0 && remainingStudies.length > 0) && (
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-[var(--aci-secondary)] mb-3">More Success Stories</h2>
                <p className="text-gray-600">Explore our complete portfolio of enterprise transformations</p>
              </div>
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
            <div className="grid md:grid-cols-2 gap-8">
              {(selectedIndustry === 'All' && selectedService === 'All' && searchQuery === '' && latestStudies.length > 0 ? remainingStudies : filteredStudies).map((study) => (
                <CaseStudyCard key={study.slug} study={study} featured={study.is_featured} />
              ))}
            </div>
          )}
        </div>
      </section>
      )}

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
  study: CaseStudy;
  featured?: boolean;
}

function CaseStudyCard({ study, featured }: CaseStudyCardProps) {
  return (
    <Link
      href={`/case-studies/${study.slug}`}
      className="group relative block rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
    >
      {/* Background Image with Gradient Overlay */}
      <div className="absolute inset-0">
        {study.featured_image ? (
          <Image
            src={study.featured_image}
            alt={study.headline}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[var(--aci-secondary)] via-[#1a3a5c] to-[#0a2540]" />
        )}
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--aci-secondary)] via-[var(--aci-secondary)]/80 to-transparent" />
      </div>

      {/* Glass Card Content */}
      <div className="relative min-h-[480px] flex flex-col justify-end p-8">
        {/* Top badges */}
        <div className="absolute top-5 left-5 right-5 flex items-center justify-between">
          <div className="flex gap-2">
            <span className="px-3 py-1.5 bg-white/10 backdrop-blur-md text-white text-xs font-medium rounded-full border border-white/20">
              {study.industry}
            </span>
            <span className="px-3 py-1.5 bg-[var(--aci-primary)]/80 backdrop-blur-md text-white text-xs font-medium rounded-full">
              {study.service}
            </span>
          </div>
          {featured && (
            <span className="px-3 py-1.5 bg-amber-500/90 backdrop-blur-md text-white text-xs font-bold rounded-full flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              Featured
            </span>
          )}
        </div>

        {/* Client Name */}
        <div className="mb-3">
          <span className="text-white/80 text-sm font-semibold uppercase tracking-wider">
            {study.client}
          </span>
        </div>

        {/* Headline */}
        <h3 className="text-2xl font-bold text-white mb-5 group-hover:text-[var(--aci-primary-light)] transition-colors">
          {study.headline}
        </h3>

        {/* Results - Glass Panel */}
        {study.results && study.results.length > 0 && (
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-5 mb-5 border border-white/10">
            <div className="grid grid-cols-3 gap-4">
              {study.results.slice(0, 3).map((result, index) => (
                <div key={index} className="text-center">
                  <div className="text-xl font-bold text-[var(--aci-primary-light)]">
                    {result.metric}
                  </div>
                  <div className="text-xs text-white/70 leading-snug mt-1">
                    {result.description}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Technologies */}
        <div className="flex flex-wrap gap-2 mb-4">
          {study.technologies?.slice(0, 4).map((tech) => (
            <span
              key={tech}
              className="px-2.5 py-1 bg-white/5 backdrop-blur-sm rounded-md text-xs text-white/70 border border-white/10"
            >
              {tech}
            </span>
          ))}
          {(study.technologies?.length || 0) > 4 && (
            <span className="px-2.5 py-1 text-xs text-white/40">
              +{(study.technologies?.length || 0) - 4}
            </span>
          )}
        </div>

        {/* CTA */}
        <div className="flex items-center gap-2 text-white font-medium group-hover:text-[var(--aci-primary-light)] transition-colors">
          <span className="text-sm">Read Case Study</span>
          <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
}
