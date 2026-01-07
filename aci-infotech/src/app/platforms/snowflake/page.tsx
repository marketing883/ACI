import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, CheckCircle2, Award, Database, Shield, TrendingUp, Snowflake } from 'lucide-react';
import Button from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'Snowflake Implementation Services',
  description: 'ACI Infotech is a Snowflake Select Partner. Data Cloud architecture, data sharing, Snowpark, and enterprise analytics solutions.',
};

const capabilities = [
  {
    title: 'Data Cloud Architecture',
    description: 'Design scalable, performant Snowflake architectures that support analytics, data sharing, and AI/ML workloads.',
    features: ['Multi-cluster warehouses', 'Resource monitors', 'Time travel & fail-safe', 'Zero-copy cloning'],
  },
  {
    title: 'Data Sharing & Marketplace',
    description: 'Enable secure data sharing across organizations and monetize data through Snowflake Marketplace.',
    features: ['Secure data sharing', 'Data Clean Rooms', 'Marketplace publishing', 'Reader accounts'],
  },
  {
    title: 'Snowpark Development',
    description: 'Build data pipelines and ML models directly in Snowflake using Python, Java, or Scala.',
    features: ['Python UDFs', 'Snowpark ML', 'Stored procedures', 'Streamlit apps'],
  },
  {
    title: 'Performance Optimization',
    description: 'Optimize query performance and reduce costs with our deep Snowflake expertise.',
    features: ['Query optimization', 'Warehouse sizing', 'Clustering strategies', 'Cost governance'],
  },
  {
    title: 'Migration Services',
    description: 'Migrate from legacy data warehouses like Teradata, Oracle, or Netezza to Snowflake.',
    features: ['Assessment', 'Schema conversion', 'Data migration', 'Query translation'],
  },
  {
    title: 'Managed Services',
    description: 'Ongoing Snowflake administration, monitoring, and optimization with SLA-backed support.',
    features: ['24/7 monitoring', 'Cost optimization', 'Security management', 'Upgrade planning'],
  },
];

const caseStudies = [
  {
    client: 'Global Insurance Company',
    industry: 'Financial Services',
    challenge: 'Legacy Teradata warehouse with $2M+ annual costs and limited scalability',
    solution: 'Full migration to Snowflake with automated data pipelines and real-time dashboards',
    results: ['60% cost reduction', '10x faster queries', 'Unlimited scalability'],
  },
  {
    client: 'Major Retailer',
    industry: 'Retail',
    challenge: 'Siloed data preventing unified customer analytics across channels',
    solution: 'Snowflake data mesh with secure data sharing between business units',
    results: ['Single customer view', '45% faster insights', 'Self-service analytics'],
  },
];

export default function SnowflakePage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-[var(--aci-secondary)] pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/platforms"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            All Platforms
          </Link>

          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-[#29B5E8] rounded-2xl flex items-center justify-center">
              <Snowflake className="w-8 h-8 text-white" />
            </div>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-[#29B5E8]/20 text-[#29B5E8] text-sm font-medium rounded-full flex items-center gap-1">
                <Award className="w-4 h-4" />
                Select Partner
              </span>
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Snowflake Implementation
            <span className="text-[var(--aci-primary-light)]"> & Data Cloud</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mb-8">
            As a Snowflake Select Partner, we help enterprises unlock the full potential of the
            Data Cloud. From migration to optimization, our certified architects deliver
            scalable, cost-effective Snowflake solutions.
          </p>

          <div className="flex flex-wrap gap-4">
            <Button href="/contact?reason=architecture-call" variant="primary" size="lg">
              Schedule Snowflake Assessment
            </Button>
            <Button href="/case-studies" variant="secondary" size="lg">
              View Case Studies
            </Button>
          </div>
        </div>
      </section>

      {/* Value Props */}
      <section className="py-16 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-14 h-14 bg-[#29B5E8]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Database className="w-7 h-7 text-[#29B5E8]" />
              </div>
              <h3 className="font-semibold text-[var(--aci-secondary)] mb-2">Certified Architects</h3>
              <p className="text-gray-600 text-sm">
                SnowPro certified team with deep expertise in Data Cloud architecture.
              </p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-[#29B5E8]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-7 h-7 text-[#29B5E8]" />
              </div>
              <h3 className="font-semibold text-[var(--aci-secondary)] mb-2">Proven ROI</h3>
              <p className="text-gray-600 text-sm">
                Average 50% reduction in total cost of ownership for our clients.
              </p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-[#29B5E8]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-7 h-7 text-[#29B5E8]" />
              </div>
              <h3 className="font-semibold text-[var(--aci-secondary)] mb-2">Enterprise Security</h3>
              <p className="text-gray-600 text-sm">
                Built-in governance, encryption, and compliance from day one.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--aci-secondary)] mb-4">
              What We Deliver
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              End-to-end Snowflake services from assessment to managed operations.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {capabilities.map((cap) => (
              <div key={cap.title} className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-xl font-bold text-[var(--aci-secondary)] mb-3">{cap.title}</h3>
                <p className="text-gray-600 mb-4">{cap.description}</p>
                <ul className="space-y-2">
                  {cap.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-gray-700">
                      <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Case Studies */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--aci-secondary)] mb-4">
              Snowflake Success Stories
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {caseStudies.map((cs, index) => (
              <div key={index} className="bg-gray-50 rounded-2xl p-8">
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-3 py-1 bg-[#29B5E8]/10 text-[#29B5E8] text-sm font-medium rounded-full">
                    {cs.industry}
                  </span>
                  <span className="text-gray-500 text-sm">{cs.client}</span>
                </div>

                <div className="mb-6">
                  <h3 className="font-semibold text-gray-700 mb-2">Challenge</h3>
                  <p className="text-gray-600">{cs.challenge}</p>
                </div>

                <div className="mb-6">
                  <h3 className="font-semibold text-gray-700 mb-2">Solution</h3>
                  <p className="text-gray-600">{cs.solution}</p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-700 mb-3">Results</h3>
                  <div className="flex flex-wrap gap-3">
                    {cs.results.map((result) => (
                      <span key={result} className="px-3 py-2 bg-green-100 text-green-700 text-sm font-medium rounded-lg">
                        {result}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#29B5E8]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Harness the Data Cloud?
          </h2>
          <p className="text-xl text-cyan-100 mb-8">
            Schedule a free assessment with our Snowflake experts to discuss your data strategy.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button href="/contact?reason=architecture-call" variant="secondary" size="lg">
              Schedule Free Assessment
            </Button>
            <Button href="/platforms" variant="ghost" size="lg" className="text-white border-white hover:bg-white/10">
              Explore Other Platforms
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
