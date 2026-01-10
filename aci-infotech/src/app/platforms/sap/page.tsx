import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, CheckCircle2, Award, Building2, Shield, TrendingUp, Cog } from 'lucide-react';
import Button from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'SAP Implementation Services',
  description: 'ACI Infotech is an SAP Partner. S/4HANA implementation, migration, integration, and managed services for enterprise.',
};

const capabilities = [
  {
    title: 'S/4HANA Implementation',
    description: 'Greenfield and brownfield S/4HANA implementations with industry best practices.',
    features: ['Greenfield implementation', 'Brownfield conversion', 'Selective data migration', 'Fit-to-standard'],
  },
  {
    title: 'S/4HANA Migration',
    description: 'Migrate from ECC to S/4HANA with minimal business disruption.',
    features: ['Assessment & roadmap', 'System conversion', 'Data migration', 'Testing & validation'],
  },
  {
    title: 'SAP Integration',
    description: 'Connect SAP to cloud platforms, data warehouses, and enterprise applications.',
    features: ['SAP BTP integration', 'API management', 'CDC integration', 'Real-time sync'],
  },
  {
    title: 'SAP Analytics',
    description: 'Implement SAP Analytics Cloud and embedded analytics for real-time insights.',
    features: ['SAC implementation', 'Embedded analytics', 'Planning & forecasting', 'Dashboard development'],
  },
  {
    title: 'SAP on Cloud',
    description: 'Deploy and manage SAP workloads on AWS, Azure, or Google Cloud.',
    features: ['RISE with SAP', 'Cloud migration', 'Infrastructure design', 'HA/DR setup'],
  },
  {
    title: 'Managed Services',
    description: 'Ongoing SAP Basis administration, monitoring, and support.',
    features: ['Basis administration', 'Performance monitoring', 'Security patches', 'Upgrade management'],
  },
];

const caseStudies = [
  {
    client: 'MSCI',
    industry: 'Financial Services',
    challenge: '40+ finance systems post-acquisitions requiring consolidation with zero disruption',
    solution: 'SAP S/4HANA implementation with automated data quality gates and real-time integration',
    results: ['$12M annual savings', '18-month delivery', 'Zero financial disruptions'],
  },
  {
    client: 'Global Manufacturer',
    industry: 'Manufacturing',
    challenge: 'Legacy ECC system limiting digital transformation and operational efficiency',
    solution: 'System conversion to S/4HANA with selective data migration and process optimization',
    results: ['30% faster close', '50% reduced inventory', 'Real-time visibility'],
  },
];

const modules = [
  { name: 'Finance (FICO)', color: 'bg-green-100 text-green-700' },
  { name: 'Supply Chain (MM/SD)', color: 'bg-blue-100 text-blue-700' },
  { name: 'Manufacturing (PP)', color: 'bg-orange-100 text-orange-700' },
  { name: 'Human Capital (HCM)', color: 'bg-purple-100 text-purple-700' },
  { name: 'Plant Maintenance', color: 'bg-yellow-100 text-yellow-700' },
  { name: 'Project Systems', color: 'bg-pink-100 text-pink-700' },
];

export default function SAPPage() {
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
            <div className="w-16 h-16 bg-[#0FAAFF] rounded-2xl flex items-center justify-center">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-[#0FAAFF]/20 text-[#0FAAFF] text-sm font-medium rounded-full flex items-center gap-1">
                <Award className="w-4 h-4" />
                SAP Partner
              </span>
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            SAP S/4HANA
            <span className="text-[var(--aci-primary-light)]"> Implementation & Services</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mb-8">
            As an SAP Partner, we deliver enterprise-grade SAP implementations that transform
            business operations. From greenfield deployments to complex migrations, our certified
            consultants ensure success.
          </p>

          <div className="flex flex-wrap gap-4">
            <Button href="/contact?reason=architecture-call" variant="primary" size="lg">
              Schedule SAP Assessment
            </Button>
            <Button href="/case-studies" variant="secondary" size="lg">
              View Case Studies
            </Button>
          </div>
        </div>
      </section>

      {/* Modules */}
      <section className="py-12 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-center font-semibold text-gray-500 mb-6">SAP Modules We Implement</h3>
          <div className="flex flex-wrap justify-center gap-3">
            {modules.map((module) => (
              <span key={module.name} className={`px-4 py-2 ${module.color} text-sm font-medium rounded-full`}>
                {module.name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Value Props */}
      <section className="py-16 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-14 h-14 bg-[#0FAAFF]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Cog className="w-7 h-7 text-[#0FAAFF]" />
              </div>
              <h3 className="font-semibold text-[var(--aci-secondary)] mb-2">Deep SAP Expertise</h3>
              <p className="text-gray-600 text-sm">
                20+ years of SAP experience across industries and modules.
              </p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-[#0FAAFF]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-7 h-7 text-[#0FAAFF]" />
              </div>
              <h3 className="font-semibold text-[var(--aci-secondary)] mb-2">Proven Methodology</h3>
              <p className="text-gray-600 text-sm">
                SAP Activate methodology combined with agile delivery practices.
              </p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-[#0FAAFF]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-7 h-7 text-[#0FAAFF]" />
              </div>
              <h3 className="font-semibold text-[var(--aci-secondary)] mb-2">Zero Disruption</h3>
              <p className="text-gray-600 text-sm">
                Meticulous testing and cutover planning for risk-free go-lives.
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
              End-to-end SAP services from assessment to managed operations.
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
              SAP Success Stories
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {caseStudies.map((cs, index) => (
              <div key={index} className="bg-gray-50 rounded-2xl p-8">
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-3 py-1 bg-[#0FAAFF]/10 text-[#0FAAFF] text-sm font-medium rounded-full">
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
      <section className="py-20 bg-[#0FAAFF]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Transform with S/4HANA?
          </h2>
          <p className="text-xl text-cyan-100 mb-8">
            Schedule a free SAP assessment with our certified consultants.
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
