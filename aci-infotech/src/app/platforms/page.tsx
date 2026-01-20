import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, Award } from 'lucide-react';
import Button from '@/components/ui/Button';
import { BreadcrumbSchema } from '@/components/seo/StructuredData';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://aciinfotech.com';

export const metadata: Metadata = {
  title: 'Technology Platforms',
  description: 'ACI Infotech is a certified partner for Databricks, Snowflake, Salesforce, AWS, Azure, SAP, and more. Enterprise-grade implementations by senior architects.',
  alternates: {
    canonical: `${siteUrl}/platforms`,
  },
};

const platforms = [
  {
    id: 'databricks',
    name: 'Databricks',
    logo: '/images/partners/databricks.svg',
    tagline: 'Lakehouse Architecture Experts',
    description: 'Build unified analytics platforms with Delta Lake, MLflow, and Spark. We help enterprises implement data lakehouses that scale.',
    partnership: 'Exclusive Partner',
    partnershipLevel: 'gold',
    capabilities: ['Delta Lake Implementation', 'Unity Catalog Setup', 'MLflow MLOps', 'Spark Optimization', 'Cost Management'],
    caseStudy: { client: 'Fortune 100 Retailer', result: '$18M savings from AI forecasting' },
    href: '/platforms/databricks',
  },
  {
    id: 'snowflake',
    name: 'Snowflake',
    logo: '/images/partners/snowflake.svg',
    tagline: 'Data Cloud Specialists',
    description: 'Design and implement Snowflake data warehouses with optimal architecture, governance, and cost efficiency.',
    partnership: 'Partner',
    partnershipLevel: 'silver',
    capabilities: ['Data Warehouse Design', 'Data Sharing', 'Snowpark Development', 'Cost Optimization', 'Migration Services'],
    caseStudy: { client: 'Healthcare System', result: '40% infrastructure cost reduction' },
    href: '/platforms/snowflake',
  },
  {
    id: 'salesforce',
    name: 'Salesforce',
    logo: '/images/partners/salesforce.svg',
    tagline: 'Agentforce & Data Cloud Experts',
    description: 'End-to-end Salesforce implementations including Data Cloud, Marketing Cloud, and the new Agentforce AI platform.',
    partnership: 'Agentforce Exclusive Partner',
    partnershipLevel: 'gold',
    capabilities: ['Data Cloud Implementation', 'Marketing Cloud', 'Agentforce AI', 'Integration Services', 'Custom Development'],
    caseStudy: { client: 'RaceTrac', result: '25% improvement in promotion effectiveness' },
    href: '/platforms/salesforce',
  },
  {
    id: 'microsoft-dynamics',
    name: 'Microsoft Dynamics',
    logo: '/images/partners/microsoft.svg',
    tagline: 'Copilot & Power Platform Experts',
    description: 'Dynamics 365, Copilot, Power Platform, and Microsoft Fabric implementations. AI-powered business applications at enterprise scale.',
    partnership: 'Microsoft Partner',
    partnershipLevel: 'gold',
    capabilities: ['Dynamics 365 CRM & ERP', 'Microsoft Copilot', 'Power Platform', 'Microsoft Fabric', 'Azure Integration'],
    caseStudy: { client: 'Global Enterprise', result: '60% faster business processes' },
    href: '/platforms/microsoft-dynamics',
  },
  {
    id: 'aws',
    name: 'Amazon Web Services',
    logo: '/images/partners/aws.svg',
    tagline: 'Cloud Migration & Optimization',
    description: 'AWS migrations, architecture design, and cost optimization. From lift-and-shift to cloud-native transformation.',
    partnership: 'Advanced Partner',
    partnershipLevel: 'silver',
    capabilities: ['Cloud Migration', 'Well-Architected Reviews', 'Cost Optimization', 'Kubernetes (EKS)', 'Data & Analytics'],
    caseStudy: { client: 'Energy Company', result: '99.99% uptime achieved' },
    href: '/platforms/aws',
  },
  {
    id: 'azure',
    name: 'Microsoft Azure',
    logo: '/images/partners/azure.svg',
    tagline: 'Enterprise Cloud Solutions',
    description: 'Azure implementations for enterprises already invested in the Microsoft ecosystem. Synapse, Fabric, and hybrid cloud.',
    partnership: 'Solutions Partner',
    partnershipLevel: 'silver',
    capabilities: ['Azure Synapse', 'Microsoft Fabric', 'Azure ML', 'Hybrid Cloud', 'Security & Compliance'],
    caseStudy: { client: 'Financial Institution', result: '$25M fraud loss reduction' },
    href: '/platforms/azure',
  },
  {
    id: 'sap',
    name: 'SAP',
    logo: '/images/partners/sap.svg',
    tagline: 'S/4HANA Transformation',
    description: 'SAP S/4HANA implementations and migrations. We help enterprises modernize their ERP with minimal disruption.',
    partnership: 'Partner',
    partnershipLevel: 'silver',
    capabilities: ['S/4HANA Migration', 'Integration Services', 'Data Migration', 'Change Management', 'Support Services'],
    caseStudy: { client: 'MSCI', result: '$12M operational savings' },
    href: '/platforms/sap',
  },
  {
    id: 'servicenow',
    name: 'ServiceNow',
    logo: '/images/partners/servicenow.svg',
    tagline: 'Digital Workflow Automation',
    description: 'ServiceNow implementations for IT service management, HR, and enterprise workflows. Streamline operations with intelligent automation.',
    partnership: 'Partner',
    partnershipLevel: 'silver',
    capabilities: ['ITSM Implementation', 'HR Service Delivery', 'Custom App Development', 'Integration Hub', 'AI-Powered Workflows'],
    caseStudy: { client: 'Fortune 500 Company', result: '45% reduction in ticket resolution time' },
    href: '/platforms/servicenow',
  },
  {
    id: 'braze',
    name: 'Braze',
    logo: '/images/partners/braze.svg',
    tagline: 'Customer Engagement Platform',
    description: 'Braze implementations for personalized customer engagement across email, push, in-app, and more. Drive retention and lifetime value.',
    partnership: 'Partner',
    partnershipLevel: 'silver',
    capabilities: ['Campaign Orchestration', 'Personalization', 'Data Integration', 'Analytics & Reporting', 'Cross-Channel Messaging'],
    caseStudy: { client: 'Retail Brand', result: '35% increase in customer engagement' },
    href: '/platforms/braze',
  },
];

export default function PlatformsPage() {
  return (
    <main className="min-h-screen">
      {/* Structured Data for SEO */}
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: '/' },
          { name: 'Platforms', url: '/platforms' },
        ]}
      />

      {/* Hero Section */}
      <section className="bg-[var(--aci-secondary)] pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <p className="text-[var(--aci-primary-light)] font-medium mb-4 tracking-wide uppercase">
              Technology Platforms
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Certified Experts in the Platforms
              <span className="text-[var(--aci-primary-light)]"> Enterprises Trust</span>
            </h1>
            <p className="text-xl text-gray-400 mb-8">
              We're not just consultants, we're certified partners with deep expertise in the platforms
              that power Fortune 500 operations. Our teams hold advanced certifications and have
              delivered hundreds of enterprise implementations.
            </p>
          </div>

          {/* Partner Badges */}
          <div className="flex flex-wrap justify-center gap-4 mt-12">
            {platforms.filter(p => p.partnershipLevel === 'gold').map((platform) => (
              <div key={platform.id} className="flex items-center gap-2 bg-yellow-500/20 px-4 py-2 rounded-full">
                <Award className="w-5 h-5 text-yellow-400" />
                <span className="text-yellow-300 font-medium">{platform.name} {platform.partnership}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Platforms Grid */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8">
            {platforms.map((platform) => (
              <Link
                key={platform.id}
                href={platform.href}
                className="group bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all"
              >
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-2xl font-bold text-[var(--aci-secondary)] group-hover:text-[var(--aci-primary)]">
                        {platform.name}
                      </h2>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        platform.partnershipLevel === 'gold'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {platform.partnership}
                      </span>
                    </div>
                    <p className="text-[var(--aci-primary)] font-medium">{platform.tagline}</p>
                  </div>
                  <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center">
                    {/* Platform logo placeholder */}
                    <span className="text-2xl font-bold text-gray-400">{platform.name.charAt(0)}</span>
                  </div>
                </div>

                <p className="text-gray-600 mb-6">{platform.description}</p>

                {/* Capabilities */}
                <div className="mb-6">
                  <h5 className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">
                    Key Capabilities
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    {platform.capabilities.map((cap) => (
                      <span key={cap} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                        {cap}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Case Study Highlight */}
                <div className="bg-gray-50 rounded-xl p-4 mb-6">
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-gray-700">{platform.caseStudy.client}</span>
                  </div>
                  <p className="text-sm text-gray-600">{platform.caseStudy.result}</p>
                </div>

                <span className="text-[var(--aci-primary)] font-medium inline-flex items-center gap-2 group-hover:gap-3 transition-all">
                  Learn More <ArrowRight className="w-5 h-5" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Platforms */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-[var(--aci-secondary)] mb-8 text-center">
            We Also Work With
          </h2>
          <div className="flex flex-wrap justify-center gap-8">
            {['Informatica', 'MuleSoft', 'Kafka', 'Terraform', 'Kubernetes', 'Adobe', 'Tableau', 'dbt'].map((name) => (
              <div key={name} className="px-6 py-3 bg-gray-100 rounded-xl text-gray-700 font-medium">
                {name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[var(--aci-primary)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Need Help With a Platform Implementation?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Our certified experts can help you get the most out of your technology investments.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button href="/contact?reason=architecture-call" variant="secondary" size="lg">
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
