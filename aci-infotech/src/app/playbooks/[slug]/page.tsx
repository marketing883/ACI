'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, ArrowRight, Download, CheckCircle2, Loader2, X, Mail, Building2, User } from 'lucide-react';
import Button from '@/components/ui/Button';

// Playbook detailed data
const playbooksData: Record<string, PlaybookDetail> = {
  'post-acquisition-consolidation': {
    slug: 'post-acquisition-consolidation',
    id: 'post-acquisition',
    displayTitle: '40 Systems → One',
    fullTitle: 'Post-Acquisition System Consolidation',
    deployments: 23,
    description: 'Complete playbook for consolidating 30-50 disparate systems post-merger with zero disruption to financial reporting.',
    overview: 'This playbook documents our proven approach for post-acquisition system consolidation, refined across 23 enterprise deployments. It covers the complete lifecycle from assessment through stabilization, with specific patterns for financial services, private equity portfolio companies, healthcare, and manufacturing.',
    challengePattern: [
      '30-50 disparate systems from merged entities requiring consolidation',
      'Multiple data formats with inconsistent standards and definitions',
      'Finance teams spending 40%+ of time manually reconciling',
      'Regulatory compliance requiring unified audit trails (SOX, GDPR, etc.)',
      'Executive mandate for aggressive timeline without business disruption',
    ],
    solutionApproach: [
      'Discovery & Assessment: Comprehensive inventory of all systems, data flows, and dependencies',
      'Phased Migration Strategy: Parallel runs with automated validation before each cutover',
      'Data Quality Gates: Automated checks catching 95%+ of issues before they impact downstream',
      'SOX Compliance by Design: Audit logging, segregation of duties, and control frameworks built in',
      'Change Management: Stakeholder communication plan and user training program',
    ],
    keyLearnings: [
      'Phased migration with parallel runs eliminates cutover risk - never do "big bang"',
      'Automated data quality gates catch 95% of issues before they become problems',
      'SOX compliance must be designed in from day one, not retrofitted',
      'Executive sponsorship is critical - weekly steering committee meetings are essential',
      'Plan for 30% more complexity than initial assessment suggests',
    ],
    outcomes: [
      { metric: '$9.2M', description: 'Average year-one savings', detail: 'Achieved through process automation and system consolidation' },
      { metric: 'Zero', description: 'Financial reporting disruptions', detail: 'All quarterly closes completed on time' },
      { metric: '78%', description: 'Manual effort reduced', detail: 'Finance team time freed for value-add activities' },
      { metric: '6 months', description: 'Faster close cycle', detail: 'From 15 days to 5 days monthly close' },
    ],
    industries: ['Financial Services', 'Private Equity', 'Healthcare', 'Manufacturing'],
    technologies: ['SAP S/4HANA', 'Python ETL', 'Azure/AWS Data Lakes', 'PowerBI', 'Auto Reconciliation', 'Audit Logging'],
    category: 'Data Engineering',
    timeline: '12-18 months typical',
    teamSize: '15-25 consultants',
    relatedPlaybooks: ['multi-source-integration', 'legacy-cloud-migration'],
    downloadAvailable: true,
  },
  'real-time-data-platform': {
    slug: 'real-time-data-platform',
    id: 'multi-location',
    displayTitle: '600 Stores, Real-Time',
    fullTitle: 'Multi-Location Real-Time Data Platform',
    deployments: 47,
    description: 'Battle-tested architecture for real-time data across 300-1000+ locations with zero tolerance for payment downtime.',
    overview: 'Our most battle-tested playbook, deployed 47 times across retail chains, QSR franchises, convenience stores, and hospitality groups. This architecture handles the unique challenges of distributed physical locations with zero-downtime requirements.',
    challengePattern: [
      '300-1000+ physical locations generating high-volume transaction data',
      'Zero tolerance for payment processing downtime',
      'Real-time customer behavior insights needed for personalization',
      'Legacy batch ETL creating 12-24hr latency, missing opportunities',
      'Weekend traffic spikes requiring 3x normal capacity handling',
    ],
    solutionApproach: [
      'Dual-Write Pattern: Payment data captured at both POS and central platform simultaneously',
      'Event-Driven Architecture: Kafka/Kinesis streams processing transactions in real-time',
      'Auto-Scaling Infrastructure: Pre-configured scaling policies for predictable traffic patterns',
      'Edge Processing: Critical business logic runs at store level for resilience',
      'Observability First: Dynatrace integration with automated anomaly detection',
    ],
    keyLearnings: [
      'Payment integration requires dual-write pattern - never single point of failure',
      'Auto-scaling must be pre-configured for predictable spikes (weekends, holidays)',
      'Dynatrace observability prevents 90% of production issues before customer impact',
      'Store-level edge processing is essential for resilience',
      'Start with pilot stores, validate for 4-6 weeks before broader rollout',
    ],
    outcomes: [
      { metric: '64%', description: 'Average latency reduction', detail: 'From 12-24hr batch to <5 minute real-time' },
      { metric: '99.97%', description: 'Uptime maintained', detail: 'During rollout across all locations' },
      { metric: 'Zero', description: 'Payment disruptions', detail: 'No payment processing downtime during migration' },
      { metric: '3x', description: 'Peak capacity handled', detail: 'Weekend traffic spikes managed automatically' },
    ],
    industries: ['Retail', 'QSR/Fast Food', 'Convenience Stores', 'Hospitality'],
    technologies: ['Kafka/Kinesis', 'Databricks Lakehouse', 'Delta Lake', 'Salesforce/Braze CDP', 'Dynatrace', 'Real-time Dashboards'],
    category: 'Data Engineering',
    timeline: '9-15 months typical',
    teamSize: '18-30 consultants',
    relatedPlaybooks: ['global-data-unification', 'self-service-analytics'],
    downloadAvailable: true,
  },
  'global-data-unification': {
    slug: 'global-data-unification',
    id: 'global-unification',
    displayTitle: '55 Countries, One System',
    fullTitle: 'Global Data Unification',
    deployments: 31,
    description: 'Proven approach for unifying data across 40-60 countries with regional silos and inconsistent standards.',
    overview: 'Deploying data platforms across multiple countries introduces unique complexity around regional compliance, time zones, languages, and local business practices. This playbook addresses these challenges head-on.',
    challengePattern: [
      '40-60 countries operating with regional data silos',
      'Inconsistent data standards and definitions across regions',
      'No unified view of global operations for executive decision-making',
      'Executive reporting taking weeks to compile manually',
      'Regional compliance requirements (GDPR, local data residency laws)',
    ],
    solutionApproach: [
      'MDM First: Establish master data management before any integration work',
      'Regional Hub Architecture: Data remains in-region with federated global view',
      'API-First Integration: REST/GraphQL APIs for flexibility over batch',
      'Compliance Automation: Built-in data classification and residency enforcement',
      'Regional Centers of Excellence: Local teams trained to maintain and extend',
    ],
    keyLearnings: [
      'MDM must be established before integration - cannot retrofit data quality',
      'Regional compliance varies significantly - plan for GDPR, local laws',
      'API integration is more flexible than batch for changing requirements',
      'Local champions in each region accelerate adoption',
      'Time zone complexity requires 24/7 support model planning',
    ],
    outcomes: [
      { metric: '50%', description: 'Faster decision-making', detail: 'Executive reports now available same-day' },
      { metric: '100%', description: 'Global visibility achieved', detail: 'Single view across all operations' },
      { metric: '65%', description: 'Duplicate records removed', detail: 'Through MDM implementation' },
      { metric: '40+', description: 'Countries unified', detail: 'On consistent data platform' },
    ],
    industries: ['Hospitality', 'Manufacturing', 'Logistics', 'Professional Services'],
    technologies: ['Informatica IICS', 'Master Data Management', 'Cloud Data Lakes', 'API Gateway', 'Global Dashboards', 'Regional Integration'],
    category: 'Data Engineering',
    timeline: '18-24 months typical',
    teamSize: '25-40 consultants',
    relatedPlaybooks: ['real-time-data-platform', 'multi-source-integration'],
    downloadAvailable: true,
  },
  'self-service-analytics': {
    slug: 'self-service-analytics',
    id: 'self-service-analytics',
    displayTitle: '10K Users, Self-Served',
    fullTitle: 'Enterprise Self-Service Analytics',
    deployments: 19,
    description: 'Architecture for enabling 5,000-15,000 users with self-service analytics while maintaining row-level security.',
    overview: 'Moving from IT-driven reporting to true self-service analytics requires careful architecture to balance user empowerment with data security and governance.',
    challengePattern: [
      '5,000-15,000 end users needing data access',
      'Every data request going through IT with 2-week backlogs',
      'Business users can\'t answer questions in real-time',
      'Row-level security required for multi-tenant/multi-region access',
      'Data literacy varies dramatically across user base',
    ],
    solutionApproach: [
      'Row-Level Security by Design: Security model designed upfront, not retrofitted',
      'Pre-Built Dashboards: Curated dashboards covering 80% of common use cases',
      'Power User Program: Training and certification for departmental champions',
      'Semantic Layer: Business-friendly data models hiding technical complexity',
      'Governance Framework: Clear policies for data access and sharing',
    ],
    keyLearnings: [
      'Row-level security must be designed upfront - retrofitting is 3x more expensive',
      'Pre-configured dashboards satisfy 80% of users - focus self-service on power users',
      'Power user training creates internal champions who drive adoption',
      'Semantic layer is essential for business user success',
      'Start with one department, prove value, then expand',
    ],
    outcomes: [
      { metric: '88%', description: 'IT request reduction', detail: 'Users self-serve most data needs' },
      { metric: '92%', description: 'User satisfaction', detail: 'Measured via quarterly surveys' },
      { metric: '2hrs', description: 'Time-to-insight', detail: 'Down from 2-week IT backlog' },
      { metric: '10K+', description: 'Active users', detail: 'Across organization' },
    ],
    industries: ['Financial Services', 'Healthcare', 'Insurance', 'Retail'],
    technologies: ['Databricks Lakehouse', 'Power BI/Tableau', 'Row-Level Security', 'Real-time Refresh', 'Pre-built Dashboards', 'HIPAA Logging'],
    category: 'Analytics',
    timeline: '9-12 months typical',
    teamSize: '12-20 consultants',
    relatedPlaybooks: ['healthcare-data-platform', 'global-data-unification'],
    downloadAvailable: true,
  },
  'healthcare-data-platform': {
    slug: 'healthcare-data-platform',
    id: 'healthcare-data',
    displayTitle: 'HIPAA + GDPR + More',
    fullTitle: 'Multi-Jurisdiction Healthcare Data',
    deployments: 12,
    description: 'Comprehensive playbook for managing patient data across multiple countries with different compliance requirements.',
    overview: 'Healthcare data platforms face unique challenges around patient privacy, regulatory compliance, and clinical integration. This playbook addresses multi-jurisdiction complexity.',
    challengePattern: [
      'Patient data distributed across multiple countries',
      'Different compliance requirements per region (HIPAA, GDPR, local laws)',
      'No unified patient identity causing duplicate records',
      'Extremely stringent audit requirements',
      'Clinical system integration with HL7/FHIR requirements',
    ],
    solutionApproach: [
      'Jurisdiction-Specific Compliance: Automated data classification and handling rules',
      'Master Patient Index: Probabilistic matching reducing duplicate records 60%',
      'Encryption Everywhere: At-rest and in-transit encryption as baseline',
      'Complete Audit Trail: Every access logged for compliance reporting',
      'Clinical Integration: HL7/FHIR connectors for EHR/EMR systems',
    ],
    keyLearnings: [
      'Compliance must be automated - manual processes don\'t scale',
      'Master patient index with fuzzy matching is essential for data quality',
      'Encryption is baseline, not optional - design for it from day one',
      'Audit trail requirements are more extensive than you expect',
      'Clinical staff involvement in design is critical for adoption',
    ],
    outcomes: [
      { metric: '100%', description: 'Identity unified', detail: 'Global patient identity established' },
      { metric: '58%', description: 'Duplicate reduction', detail: 'Through master patient index' },
      { metric: 'Zero', description: 'Compliance violations', detail: 'HIPAA/GDPR compliance maintained' },
      { metric: '100%', description: 'Audit coverage', detail: 'Complete access logging' },
    ],
    industries: ['Healthcare Services', 'Healthcare Tech', 'Clinical Research', 'Pharma'],
    technologies: ['Patient MDM', 'Compliance Automation', 'Encrypted Storage', 'API Gateway', 'Clinical Integration', 'Audit Logging'],
    category: 'Healthcare',
    timeline: '15-24 months typical',
    teamSize: '20-35 consultants',
    relatedPlaybooks: ['self-service-analytics', 'global-data-unification'],
    downloadAvailable: true,
  },
  'supply-chain-visibility': {
    slug: 'supply-chain-visibility',
    id: 'supply-chain',
    displayTitle: 'Supplier → Customer',
    fullTitle: 'Supply Chain Visibility',
    deployments: 28,
    description: 'End-to-end supply chain visibility platform integrating IoT, forecasting, and real-time alerting.',
    overview: 'Supply chain disruptions can cost millions. This playbook establishes end-to-end visibility from supplier to customer with predictive capabilities.',
    challengePattern: [
      'Supply chain data scattered across procurement, logistics, inventory',
      'No end-to-end visibility from supplier to customer',
      'Forecasting based on outdated data causing stockouts/overstock',
      'Disruption response measured in days, not hours',
      'Multiple ERP systems with inconsistent data',
    ],
    solutionApproach: [
      'IoT Integration: Real-time location and condition tracking',
      'Supplier Portal: Single source of truth for supplier data',
      'ML Forecasting: Demand prediction outperforming historical trends',
      'Real-Time Alerting: Automated detection and notification of disruptions',
      'Control Tower: Unified visibility dashboard for operations',
    ],
    keyLearnings: [
      'IoT integration reduces blind spots - invest in sensors',
      'Supplier data standardization is more difficult than internal data',
      'ML forecasting models beat historical trends after 6 months of training',
      'Real-time alerting requires clear escalation procedures',
      'Start with highest-impact supply chain segments',
    ],
    outcomes: [
      { metric: '100%', description: 'E2E visibility', detail: 'Supplier to customer tracking' },
      { metric: '25%', description: 'Carrying cost reduction', detail: 'Through better forecasting' },
      { metric: '4hrs', description: 'Disruption response', detail: 'Down from 3 days average' },
      { metric: '40%', description: 'Forecast accuracy gain', detail: 'ML vs. historical methods' },
    ],
    industries: ['Food & Beverage', 'Manufacturing', 'Retail', 'Automotive'],
    technologies: ['Snowflake/Databricks', 'IoT Integration', 'SAP/Oracle ERP', 'ML Forecasting', 'Tableau/PowerBI', 'Real-time Alerting'],
    category: 'Supply Chain',
    timeline: '12-18 months typical',
    teamSize: '18-28 consultants',
    relatedPlaybooks: ['real-time-data-platform', 'multi-source-integration'],
    downloadAvailable: true,
  },
  'legacy-cloud-migration': {
    slug: 'legacy-cloud-migration',
    id: 'cloud-migration',
    displayTitle: 'Hadoop → Cloud',
    fullTitle: 'Legacy to Cloud Migration',
    deployments: 52,
    description: 'Our most deployed playbook - migrating from aging on-prem Hadoop/Teradata/Oracle to modern cloud with 3x better ROI.',
    overview: 'With 52 deployments, this is our most battle-tested playbook. It addresses the unique challenges of migrating from legacy on-premise data platforms to modern cloud architectures.',
    challengePattern: [
      'On-premise Hadoop/Teradata/Oracle aging and expensive to maintain',
      'Infrastructure costs growing 15-20% annually',
      'Scaling requires 6-12 month hardware procurement cycles',
      'Maintenance consuming 40%+ of data team time',
      'Losing talent who want to work with modern technologies',
    ],
    solutionApproach: [
      'Assessment & Planning: Comprehensive workload analysis and cloud readiness',
      'Re-Architecture: Transform for cloud-native benefits (not lift-and-shift)',
      'Parallel Run Strategy: Validate in cloud while production continues on-prem',
      'Automated Migration: Tooling for schema conversion and data movement',
      'Cost Optimization: FinOps practices from day one',
    ],
    keyLearnings: [
      'Lift-and-shift misses 70% of cloud benefits - invest in re-architecture',
      'Re-architecture delivers 3x better ROI than lift-and-shift',
      'Zero-downtime requires parallel run strategy - plan for 3-6 months',
      'FinOps practices must be established from day one',
      'Team upskilling should start 3 months before migration begins',
    ],
    outcomes: [
      { metric: '68%', description: 'Cost reduction', detail: 'Infrastructure and licensing savings' },
      { metric: '10x', description: 'Processing speed', detail: 'For typical workloads' },
      { metric: '$3.2M', description: 'Average 3-year savings', detail: 'TCO reduction' },
      { metric: 'Zero', description: 'Downtime', detail: 'During migration cutover' },
    ],
    industries: ['Financial Services', 'Healthcare', 'Retail', 'Education'],
    technologies: ['AWS/Azure/GCP', 'Databricks/Snowflake', 'Automated Migration Tools', 'Data Validation', 'Terraform IaC', 'Cost Optimization'],
    category: 'Cloud',
    timeline: '9-18 months typical',
    teamSize: '15-30 consultants',
    relatedPlaybooks: ['post-acquisition-consolidation', 'multi-source-integration'],
    downloadAvailable: true,
  },
  'multi-source-integration': {
    slug: 'multi-source-integration',
    id: 'data-integration',
    displayTitle: '40 Sources, One Truth',
    fullTitle: 'Multi-Source Data Integration',
    deployments: 34,
    description: 'Playbook for integrating 20-40 disparate source systems with automated quality detection and self-healing pipelines.',
    overview: 'Modern enterprises have data scattered across dozens of systems. This playbook provides a proven approach for establishing a single source of truth.',
    challengePattern: [
      '20-40 disparate source systems requiring integration',
      'Mix of SaaS, on-prem databases, spreadsheets, and APIs',
      'No unified data model or standards across sources',
      'Data quality varies dramatically between systems',
      'Manual data integration processes prone to error',
    ],
    solutionApproach: [
      'Source Discovery: Comprehensive inventory (plan for 3x expected time)',
      'Unified Data Model: Canonical model bridging all source semantics',
      'Automated Quality: Great Expectations or similar for data validation',
      'CDC for Real-Time: Change data capture for sources requiring real-time',
      'Self-Healing Pipelines: Automated retry and error handling',
    ],
    keyLearnings: [
      'Source system discovery takes 3x longer than expected - plan accordingly',
      'Data quality issues always surface - automate detection from start',
      'CDC is essential for any source requiring real-time updates',
      'Self-healing pipelines reduce operational overhead by 80%',
      'Involve source system owners early - they know the edge cases',
    ],
    outcomes: [
      { metric: '32', description: 'Average systems integrated', detail: 'Across deployments' },
      { metric: '85%', description: 'Data quality improvement', detail: 'Measured by error rates' },
      { metric: '99.8%', description: 'Pipeline reliability', detail: 'Self-healing architecture' },
      { metric: '80%', description: 'Operational overhead reduction', detail: 'Through automation' },
    ],
    industries: ['Technology', 'Financial Services', 'Healthcare', 'Retail'],
    technologies: ['Fivetran/Airbyte', 'Informatica/Mulesoft', 'Databricks/Snowflake', 'Great Expectations', 'Unified Data Model', 'Self-healing Pipelines'],
    category: 'Data Engineering',
    timeline: '6-12 months typical',
    teamSize: '10-20 consultants',
    relatedPlaybooks: ['post-acquisition-consolidation', 'global-data-unification'],
    downloadAvailable: true,
  },
};

interface PlaybookDetail {
  slug: string;
  id: string;
  displayTitle: string;
  fullTitle: string;
  deployments: number;
  description: string;
  overview: string;
  challengePattern: string[];
  solutionApproach: string[];
  keyLearnings: string[];
  outcomes: { metric: string; description: string; detail: string }[];
  industries: string[];
  technologies: string[];
  category: string;
  timeline: string;
  teamSize: string;
  relatedPlaybooks: string[];
  downloadAvailable: boolean;
}

// Download Modal Component
function DownloadModal({
  isOpen,
  onClose,
  playbookTitle,
  playbookSlug,
}: {
  isOpen: boolean;
  onClose: () => void;
  playbookTitle: string;
  playbookSlug: string;
}) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      setIsSubmitting(false);
      return;
    }

    // Check for work email (basic check)
    const personalDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'aol.com', 'icloud.com'];
    const emailDomain = formData.email.split('@')[1]?.toLowerCase();
    if (personalDomains.includes(emailDomain)) {
      setError('Please use your work email address');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/playbook-leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          playbook_slug: playbookSlug,
          playbook_title: playbookTitle,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit');
      }

      const data = await response.json();

      // Redirect to thank you page with download token
      window.location.href = `/playbooks/thank-you?token=${data.downloadToken}&playbook=${playbookSlug}`;
    } catch {
      setError('Something went wrong. Please try again.');
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-white rounded-xl shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>

        <div className="p-6">
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-[#1890FF]/10 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Download className="w-6 h-6 text-[#1890FF]" />
            </div>
            <h3 className="text-xl font-bold text-[var(--aci-secondary)]">
              Download Playbook
            </h3>
            <p className="text-gray-600 text-sm mt-2">
              {playbookTitle}
            </p>
          </div>

          {success ? (
            <div className="text-center py-8">
              <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <p className="text-gray-600">Check your email for the download link!</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[var(--aci-primary)] focus:border-transparent"
                    placeholder="John Smith"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Work Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[var(--aci-primary)] focus:border-transparent"
                    placeholder="john@company.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    required
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[var(--aci-primary)] focus:border-transparent"
                    placeholder="Acme Corp"
                  />
                </div>
              </div>

              {error && (
                <p className="text-red-500 text-sm">{error}</p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-[var(--aci-primary)] text-white font-semibold rounded-lg hover:bg-[var(--aci-primary-dark)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5" />
                    Get Playbook PDF
                  </>
                )}
              </button>

              <p className="text-xs text-gray-500 text-center">
                By downloading, you agree to receive occasional updates from ACI Infotech.
                Unsubscribe anytime.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default function PlaybookPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [playbook, setPlaybook] = useState<PlaybookDetail | null>(null);

  useEffect(() => {
    if (slug && playbooksData[slug]) {
      setPlaybook(playbooksData[slug]);
    }
  }, [slug]);

  if (!playbook) {
    return (
      <main className="min-h-screen">
        <section className="bg-[#001529] pt-32 pb-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-[#1890FF] font-medium mb-4">Playbook</p>
            <h1 className="text-4xl font-bold text-white mb-6">Playbook Not Found</h1>
            <p className="text-xl text-gray-400 mb-8">
              The playbook you're looking for doesn't exist or has been moved.
            </p>
            <Button href="/playbooks" variant="secondary">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Playbooks
            </Button>
          </div>
        </section>
      </main>
    );
  }

  const relatedPlaybooks = playbook.relatedPlaybooks
    ?.map(slug => playbooksData[slug])
    .filter(Boolean) || [];

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

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <Link
            href="/playbooks"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Playbooks
          </Link>

          <div className="flex items-center gap-4 mb-6">
            <span className="px-3 py-1 bg-[#1890FF]/20 text-[#1890FF] text-sm font-medium rounded">
              {playbook.category}
            </span>
            <span className="text-[#C4FF61] font-mono font-bold">
              {playbook.deployments}x deployed
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {playbook.displayTitle}
          </h1>
          <p className="text-xl text-gray-400 mb-6">
            {playbook.fullTitle}
          </p>
          <p className="text-gray-500">
            {playbook.description}
          </p>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 pt-8 border-t border-gray-700">
            <div>
              <div className="text-sm text-gray-400 mb-1">Deployments</div>
              <div className="text-xl font-semibold text-white">{playbook.deployments}x</div>
            </div>
            <div>
              <div className="text-sm text-gray-400 mb-1">Timeline</div>
              <div className="text-xl font-semibold text-white">{playbook.timeline}</div>
            </div>
            <div>
              <div className="text-sm text-gray-400 mb-1">Team Size</div>
              <div className="text-xl font-semibold text-white">{playbook.teamSize}</div>
            </div>
            <div>
              <div className="text-sm text-gray-400 mb-1">Category</div>
              <div className="text-xl font-semibold text-white">{playbook.category}</div>
            </div>
          </div>

          {/* Download CTA */}
          {playbook.downloadAvailable && (
            <div className="mt-8">
              <button
                onClick={() => setShowDownloadModal(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#C4FF61] text-[#001529] font-bold rounded-lg hover:bg-[#d4ff81] transition-colors"
              >
                <Download className="w-5 h-5" />
                Download Playbook PDF
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Key Outcomes */}
      <section className="py-16 bg-[var(--aci-primary)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-white text-lg font-medium mb-8">Typical Outcomes Achieved</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {playbook.outcomes.map((outcome, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">{outcome.metric}</div>
                <div className="text-blue-100">{outcome.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Overview */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[var(--aci-secondary)] mb-6">Overview</h2>
          <p className="text-lg text-gray-600 leading-relaxed">{playbook.overview}</p>
        </div>
      </section>

      {/* Challenge Pattern */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <span className="text-2xl">🎯</span>
            </div>
            <h2 className="text-3xl font-bold text-[var(--aci-secondary)]">Challenge Pattern</h2>
          </div>
          <p className="text-lg text-gray-600 mb-8">
            This playbook addresses organizations facing these common challenges:
          </p>
          <ul className="space-y-4">
            {playbook.challengePattern.map((point, index) => (
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

      {/* Solution Approach */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <span className="text-2xl">💡</span>
            </div>
            <h2 className="text-3xl font-bold text-[var(--aci-secondary)]">Solution Approach</h2>
          </div>
          <ul className="space-y-4 mb-8">
            {playbook.solutionApproach.map((point, index) => (
              <li key={index} className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Key Learnings */}
      <section className="py-20 bg-[#001529]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-[#1890FF]/20 rounded-xl flex items-center justify-center">
              <span className="text-2xl">📚</span>
            </div>
            <h2 className="text-3xl font-bold text-white">Key Learnings</h2>
          </div>
          <p className="text-gray-400 mb-8">
            Hard-won insights from {playbook.deployments} deployments:
          </p>
          <div className="space-y-4">
            {playbook.keyLearnings.map((learning, index) => (
              <div
                key={index}
                className="p-4 bg-white/5 border border-[#1890FF]/30 rounded-lg"
              >
                <p className="text-white">{learning}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technologies */}
      <section className="py-16 bg-white border-y">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-bold text-[var(--aci-secondary)] mb-6">Technologies Used</h2>
          <div className="flex flex-wrap gap-3">
            {playbook.technologies.map((tech) => (
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

      {/* Industries */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-bold text-[var(--aci-secondary)] mb-6">Industries Served</h2>
          <div className="flex flex-wrap gap-3">
            {playbook.industries.map((industry) => (
              <span
                key={industry}
                className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700"
              >
                {industry}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Detailed Results */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <span className="text-2xl">📊</span>
            </div>
            <h2 className="text-3xl font-bold text-[var(--aci-secondary)]">Results & Impact</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {playbook.outcomes.map((result, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-xl">
                <div className="text-3xl font-bold text-[var(--aci-primary)] mb-2">{result.metric}</div>
                <div className="font-semibold text-[var(--aci-secondary)] mb-2">{result.description}</div>
                <p className="text-sm text-gray-500">{result.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Related Playbooks */}
      {relatedPlaybooks.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-[var(--aci-secondary)] mb-8">Related Playbooks</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {relatedPlaybooks.map((related) => (
                <Link
                  key={related.slug}
                  href={`/playbooks/${related.slug}`}
                  className="group bg-white rounded-xl p-6 hover:shadow-lg transition-all border border-gray-100"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <span className="px-2 py-1 bg-[#1890FF]/10 text-[#1890FF] text-xs font-medium rounded">
                      {related.category}
                    </span>
                    <span className="text-[#C4FF61] text-sm font-mono bg-[#001529] px-2 py-1 rounded">
                      {related.deployments}x
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-[var(--aci-secondary)] group-hover:text-[var(--aci-primary)] transition-colors mb-2">
                    {related.displayTitle}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">{related.fullTitle}</p>
                  <span className="text-[var(--aci-primary)] text-sm font-medium inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                    View Playbook <ArrowRight className="w-4 h-4" />
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
            Ready to Implement This Playbook?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Talk to an architect who has deployed this pattern {playbook.deployments} times.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button href={`/contact?playbook=${playbook.id}`} variant="secondary" size="lg">
              Talk to the Architect
            </Button>
            {playbook.downloadAvailable && (
              <button
                onClick={() => setShowDownloadModal(true)}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/10 text-white font-semibold rounded-lg border border-white/30 hover:bg-white/20 transition-colors"
              >
                <Download className="w-5 h-5" />
                Download PDF
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Download Modal */}
      <DownloadModal
        isOpen={showDownloadModal}
        onClose={() => setShowDownloadModal(false)}
        playbookTitle={playbook.fullTitle}
        playbookSlug={playbook.slug}
      />
    </main>
  );
}
