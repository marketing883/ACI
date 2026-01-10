import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, CheckCircle2, Award, Zap, Shield, TrendingUp } from 'lucide-react';
import Button from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'Databricks Implementation Services',
  description: 'ACI Infotech is an exclusive Databricks partner. Lakehouse architecture, Delta Lake, MLflow, and Spark optimization for enterprise.',
};

const capabilities = [
  {
    title: 'Lakehouse Architecture',
    description: 'Design and implement unified analytics platforms on Delta Lake that combine the best of data lakes and warehouses.',
    features: ['Delta Lake setup', 'Medallion architecture', 'Data quality layers', 'Performance tuning'],
  },
  {
    title: 'Unity Catalog & Governance',
    description: 'Implement enterprise-grade data governance with Unity Catalog for security, lineage, and compliance.',
    features: ['Access control', 'Data lineage', 'Audit logging', 'Cross-workspace sharing'],
  },
  {
    title: 'MLflow & MLOps',
    description: 'Build production ML pipelines with experiment tracking, model registry, and automated deployment.',
    features: ['Experiment tracking', 'Model registry', 'Feature store', 'Automated retraining'],
  },
  {
    title: 'Spark Optimization',
    description: 'Optimize Spark workloads for performance and cost efficiency with our deep platform expertise.',
    features: ['Query optimization', 'Cluster sizing', 'Photon engine', 'Cost management'],
  },
  {
    title: 'Migration Services',
    description: 'Migrate from legacy platforms like Hadoop, on-premise data warehouses, or other cloud platforms.',
    features: ['Assessment', 'Migration planning', 'Data validation', 'Cutover support'],
  },
  {
    title: 'Managed Services',
    description: 'Ongoing support and optimization for your Databricks environment with SLA-backed services.',
    features: ['24/7 monitoring', 'Performance tuning', 'Cost optimization', 'Upgrade management'],
  },
];

const caseStudies = [
  {
    client: 'Fortune 100 Retailer',
    industry: 'Retail',
    challenge: 'Manual forecasting causing $50M+ in inventory inefficiencies',
    solution: 'ML-powered demand forecasting on Databricks with AutoML pipeline',
    results: ['$18M annual savings', '92% forecast accuracy', '23% reduction in stockouts'],
  },
  {
    client: 'Global Pharmaceutical',
    industry: 'Healthcare',
    challenge: 'Siloed research data slowing drug discovery',
    solution: 'Unified data lake on Databricks with automated lineage tracking',
    results: ['40% faster data access', '100% lineage compliance', '3x researcher productivity'],
  },
];

export default function DatabricksPage() {
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
            <div className="w-16 h-16 bg-[#FF3621] rounded-2xl flex items-center justify-center">
              <span className="text-white text-2xl font-bold">D</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-yellow-500/20 text-yellow-300 text-sm font-medium rounded-full flex items-center gap-1">
                <Award className="w-4 h-4" />
                Exclusive Partner
              </span>
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Databricks Implementation
            <span className="text-[var(--aci-primary-light)]"> & Optimization</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mb-8">
            As an exclusive Databricks partner, we bring deep expertise in lakehouse architecture,
            Delta Lake, and production ML. Our certified architects have delivered enterprise
            Databricks implementations across Fortune 500 companies.
          </p>

          <div className="flex flex-wrap gap-4">
            <Button href="/contact?reason=architecture-call" variant="primary" size="lg">
              Schedule Databricks Assessment
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
              <div className="w-14 h-14 bg-[#FF3621]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Zap className="w-7 h-7 text-[#FF3621]" />
              </div>
              <h3 className="font-semibold text-[var(--aci-secondary)] mb-2">Certified Expertise</h3>
              <p className="text-gray-600 text-sm">
                Our team holds Databricks certifications including Data Engineer, ML Professional, and Platform Admin.
              </p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-[#FF3621]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-7 h-7 text-[#FF3621]" />
              </div>
              <h3 className="font-semibold text-[var(--aci-secondary)] mb-2">Proven Results</h3>
              <p className="text-gray-600 text-sm">
                We've delivered $100M+ in documented value through Databricks implementations.
              </p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-[#FF3621]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-7 h-7 text-[#FF3621]" />
              </div>
              <h3 className="font-semibold text-[var(--aci-secondary)] mb-2">Enterprise Ready</h3>
              <p className="text-gray-600 text-sm">
                Security, compliance, and governance built in from day one. SOC 2, HIPAA, and more.
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
              End-to-end Databricks services from initial assessment to production operations.
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
              Databricks Success Stories
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {caseStudies.map((cs, index) => (
              <div key={index} className="bg-gray-50 rounded-2xl p-8">
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-3 py-1 bg-[#FF3621]/10 text-[#FF3621] text-sm font-medium rounded-full">
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
      <section className="py-20 bg-[#FF3621]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Unlock the Power of Databricks?
          </h2>
          <p className="text-xl text-red-100 mb-8">
            Schedule a free assessment with our Databricks experts to discuss your data challenges.
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
