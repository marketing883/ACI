import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, CheckCircle2, Award, Cloud, Shield, TrendingUp, Cpu } from 'lucide-react';
import Button from '@/components/ui/Button';
import FaqBlock from '@/components/seo/FaqBlock';
import RelatedLinks from '@/components/seo/RelatedLinks';
import { azureRelated } from '@/content/related-links';
import { DEFAULT_OG_IMAGES, DEFAULT_TWITTER_IMAGES } from '@/lib/seo/og';

import { displayClient } from '@/lib/content/anonymize';
export const metadata: Metadata = {
  alternates: { canonical: 'https://aciinfotech.com/platforms/azure' },
  title: 'Microsoft Azure Cloud Services',
  description: 'ACI Infotech is a Microsoft Solutions Partner. Azure migration, Synapse Analytics, Power Platform, and enterprise cloud solutions.',
  // Per-page social card. Without this, every share and link preview
  // inherited the homepage's OpenGraph (title, image, and og:url all
  // pointing at /), mis-attributing all 21 service/platform pages.
  openGraph: {
    title: 'Microsoft Azure Cloud Services | ACI Infotech',
    description: 'ACI Infotech is a Microsoft Solutions Partner. Azure migration, Synapse Analytics, Power Platform, and enterprise cloud solutions.',
    url: 'https://aciinfotech.com/platforms/azure',
    siteName: 'ACI Infotech',
    type: 'website',
    images: DEFAULT_OG_IMAGES,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Microsoft Azure Cloud Services | ACI Infotech',
    description: 'ACI Infotech is a Microsoft Solutions Partner. Azure migration, Synapse Analytics, Power Platform, and enterprise cloud solutions.',
    images: DEFAULT_TWITTER_IMAGES,
  },
};

const capabilities = [
  {
    title: 'Landing Zones & Migration',
    description: 'Stand up Azure landing zones with identity, networking, and policy guardrails, then migrate workloads with Azure Migrate.',
    features: ['Azure landing zones', 'Assessment & planning', 'Azure Migrate tools', 'Hybrid scenarios'],
  },
  {
    title: 'Microsoft Fabric & Synapse',
    description: 'Build unified analytics on Microsoft Fabric and Synapse, from OneLake through the warehouse to Power BI.',
    features: ['OneLake & Fabric', 'Dedicated SQL pools', 'Data pipelines', 'Power BI integration'],
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
    client: 'Global Financial Giant',
    industry: 'Financial Services',
    challenge: '40+ finance systems post-acquisitions requiring consolidation',
    solution: 'Azure-based SAP S/4HANA implementation with Azure DevOps CI/CD',
    results: ['$500K annual savings', '18-month delivery', 'Zero disruptions'],
  },
  {
    client: 'Manufacturing Enterprise',
    industry: 'Manufacturing',
    challenge: 'Disconnected factory data preventing operational visibility',
    solution: 'Azure IoT Hub and Synapse Analytics for unified manufacturing intelligence',
    results: ['Real-time visibility', '67% less downtime', 'Predictive maintenance'],
  },
];

const azureFaqs = [
  {
    q: 'What does an Azure migration cost?',
    a: 'The drivers are workload count, how much needs re-platforming instead of lift and shift, and data volume. We run a fixed-scope assessment with Azure Migrate first, so you get a per-workload estimate and a list of servers that should be retired rather than moved. Existing Microsoft agreements and Azure Hybrid Benefit often cover more of the run cost than teams expect.',
  },
  {
    q: 'How long does an Azure migration take?',
    a: 'A single application usually lands in weeks. A full estate move typically runs 6 to 12 months in waves, with the landing zone built first and the hairiest dependencies scheduled last. Nothing cuts over until it has passed testing in the target subscription.',
  },
  {
    q: 'Do we need an Azure landing zone before migrating?',
    a: 'Yes, and it is the first thing we build: identity through Entra ID, network topology, policy guardrails, and cost management before any workload arrives. Skipping it is how estates end up with 40 subscriptions and no owner. A solid landing zone makes every wave after it faster.',
  },
  {
    q: 'Should we use Microsoft Fabric or Azure Synapse?',
    a: 'For new analytics builds, Microsoft Fabric is where Microsoft is investing: OneLake, warehousing, and Power BI in one SaaS platform. Existing Synapse estates still run fine, and we support both. We will map a migration path to Fabric when it saves you money or effort, and tell you to stay put when it does not.',
  },
  {
    q: 'Can you connect Azure to our Microsoft 365 and Dynamics estate?',
    a: 'Yes, that is usually the point of picking Azure. We wire identity through Entra ID, land Dynamics and Dataverse data in Fabric for analytics, and use Azure OpenAI against your own data with the access controls you already manage.',
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
                Solutions Partner
              </span>
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Microsoft Azure
            <span className="text-[var(--aci-primary-light)]"> Consulting and&nbsp;Migration</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mb-8">
            We build Azure landing zones, migrate workloads with Azure Migrate, and stand up
            analytics on Microsoft Fabric and Synapse. The same team wires Azure OpenAI and
            Power Platform into the Microsoft 365 and Dynamics estate your business
            already runs on.
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
                  <span className="text-gray-500 text-sm">{displayClient(cs)}</span>
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

      <RelatedLinks items={azureRelated} />

      <FaqBlock items={azureFaqs} eyebrow="Azure FAQ" />

      {/* CTA Section */}
      <section className="py-20 bg-[#0078D4]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Transform with Azure?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Schedule a free Azure assessment with our certified architects.
          </p>
          <Button href="/contact?platform=azure" variant="lime" size="lg">
            Talk to Azure Expert
          </Button>
        </div>
      </section>
    </main>
  );
}
