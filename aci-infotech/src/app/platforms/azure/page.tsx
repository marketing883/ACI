import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, CheckCircle2, Award, Cloud, Shield, TrendingUp, Cpu } from 'lucide-react';
import Button from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'Microsoft Azure Cloud Services',
  description: 'ACI Infotech is a Microsoft Gold Partner. Azure migration, Synapse Analytics, Power Platform, and enterprise cloud solutions.',
};

const capabilities = [
  {
    title: 'Azure Migration',
    description: 'Migrate workloads to Azure using Azure Migrate and proven migration methodologies.',
    features: ['Assessment & planning', 'Azure Migrate tools', 'Hybrid scenarios', 'Zero-downtime migration'],
  },
  {
    title: 'Azure Synapse Analytics',
    description: 'Build unified analytics platforms with Synapse for data warehousing and big data.',
    features: ['Dedicated SQL pools', 'Spark integration', 'Data pipelines', 'Power BI integration'],
  },
  {
    title: 'Azure Data Factory',
    description: 'Design and deploy enterprise ETL/ELT pipelines for hybrid data integration.',
    features: ['Data pipelines', 'Mapping data flows', 'SSIS migration', 'CI/CD integration'],
  },
  {
    title: 'Azure AI & Cognitive Services',
    description: 'Implement AI solutions using Azure OpenAI, Cognitive Services, and Azure ML.',
    features: ['Azure OpenAI', 'Azure ML Studio', 'Cognitive Services', 'Bot Framework'],
  },
  {
    title: 'Power Platform',
    description: 'Enable citizen development with Power BI, Power Apps, and Power Automate.',
    features: ['Power BI dashboards', 'Power Apps', 'Power Automate', 'Dataverse'],
  },
  {
    title: 'Azure DevOps',
    description: 'Implement CI/CD pipelines and DevOps practices with Azure DevOps services.',
    features: ['Azure Pipelines', 'Azure Repos', 'Infrastructure as Code', 'Release management'],
  },
];

const caseStudies = [
  {
    client: 'MSCI',
    industry: 'Financial Services',
    challenge: '40+ finance systems post-acquisitions requiring consolidation',
    solution: 'Azure-based SAP S/4HANA implementation with Azure DevOps CI/CD',
    results: ['$12M annual savings', '18-month delivery', 'Zero disruptions'],
  },
  {
    client: 'Manufacturing Enterprise',
    industry: 'Manufacturing',
    challenge: 'Disconnected factory data preventing operational visibility',
    solution: 'Azure IoT Hub and Synapse Analytics for unified manufacturing intelligence',
    results: ['Real-time visibility', '67% less downtime', 'Predictive maintenance'],
  },
];

const certifications = [
  'Azure Solutions Architect Expert',
  'Azure Data Engineer Associate',
  'Azure DevOps Engineer Expert',
  'Azure AI Engineer Associate',
  'Azure Security Engineer Associate',
  'Power Platform Developer',
];

export default function AzurePage() {
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
            <div className="w-16 h-16 bg-[#0078D4] rounded-2xl flex items-center justify-center">
              <Cloud className="w-8 h-8 text-white" />
            </div>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-[#0078D4]/20 text-[#0078D4] text-sm font-medium rounded-full flex items-center gap-1">
                <Award className="w-4 h-4" />
                Gold Partner
              </span>
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Microsoft Azure
            <span className="text-[var(--aci-primary-light)]"> Cloud Solutions</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mb-8">
            As a Microsoft Gold Partner, we deliver enterprise Azure solutions that integrate
            seamlessly with your Microsoft ecosystem. From migration to AI, we help you
            maximize your Azure investment.
          </p>

          <div className="flex flex-wrap gap-4">
            <Button href="/contact?reason=architecture-call" variant="primary" size="lg">
              Schedule Azure Assessment
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
              <div className="w-14 h-14 bg-[#0078D4]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Cpu className="w-7 h-7 text-[#0078D4]" />
              </div>
              <h3 className="font-semibold text-[var(--aci-secondary)] mb-2">Microsoft Expertise</h3>
              <p className="text-gray-600 text-sm">
                Deep expertise across the Microsoft stack including Azure, M365, and Dynamics.
              </p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-[#0078D4]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-7 h-7 text-[#0078D4]" />
              </div>
              <h3 className="font-semibold text-[var(--aci-secondary)] mb-2">Enterprise Focus</h3>
              <p className="text-gray-600 text-sm">
                Specialized in large-scale Azure deployments for Fortune 500 companies.
              </p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-[#0078D4]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-7 h-7 text-[#0078D4]" />
              </div>
              <h3 className="font-semibold text-[var(--aci-secondary)] mb-2">Hybrid Ready</h3>
              <p className="text-gray-600 text-sm">
                Expert in hybrid cloud scenarios with Azure Arc and Azure Stack.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-12 bg-gray-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-center font-semibold text-gray-500 mb-6">Team Certifications</h3>
          <div className="flex flex-wrap justify-center gap-3">
            {certifications.map((cert) => (
              <span key={cert} className="px-4 py-2 bg-white text-gray-700 text-sm rounded-full shadow-sm">
                {cert}
              </span>
            ))}
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
              End-to-end Azure services from cloud strategy to managed operations.
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
              Azure Success Stories
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {caseStudies.map((cs, index) => (
              <div key={index} className="bg-gray-50 rounded-2xl p-8">
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-3 py-1 bg-[#0078D4]/10 text-[#0078D4] text-sm font-medium rounded-full">
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
      <section className="py-20 bg-[#0078D4]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Transform with Azure?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Schedule a free Azure assessment with our certified architects.
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
