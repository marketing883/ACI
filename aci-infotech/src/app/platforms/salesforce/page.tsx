import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, CheckCircle2, Award, Users, Shield, TrendingUp, Zap } from 'lucide-react';
import Button from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'Salesforce Implementation Services',
  description: 'ACI Infotech is a Salesforce Consulting Partner. Sales Cloud, Service Cloud, Marketing Cloud, and Data Cloud implementation and integration.',
};

const capabilities = [
  {
    title: 'Sales Cloud Implementation',
    description: 'Deploy and customize Sales Cloud to accelerate revenue and improve sales productivity.',
    features: ['Lead management', 'Opportunity tracking', 'Forecasting', 'CPQ integration'],
  },
  {
    title: 'Service Cloud Solutions',
    description: 'Transform customer service with omnichannel support and AI-powered case management.',
    features: ['Case management', 'Knowledge base', 'Omnichannel routing', 'Einstein AI bots'],
  },
  {
    title: 'Marketing Cloud',
    description: 'Deliver personalized customer journeys across email, mobile, social, and advertising.',
    features: ['Journey Builder', 'Email Studio', 'Audience segmentation', 'Analytics'],
  },
  {
    title: 'Data Cloud (CDP)',
    description: 'Unify customer data across all touchpoints for a true single customer view.',
    features: ['Data unification', 'Identity resolution', 'Segmentation', 'Activation'],
  },
  {
    title: 'Integration Services',
    description: 'Connect Salesforce with your enterprise systems using MuleSoft or custom integrations.',
    features: ['MuleSoft', 'REST/SOAP APIs', 'Platform Events', 'CDC integration'],
  },
  {
    title: 'Managed Services',
    description: 'Ongoing Salesforce administration, optimization, and support with certified experts.',
    features: ['Admin support', 'Release management', 'User training', 'Performance tuning'],
  },
];

const caseStudies = [
  {
    client: 'RaceTrac',
    industry: 'Retail',
    challenge: 'Fragmented customer data across 800+ locations preventing personalized engagement',
    solution: 'Salesforce Marketing Cloud with custom CDP integration and journey automation',
    results: ['Unified customer profiles', '35% engagement lift', '$2.3M incremental revenue'],
  },
  {
    client: 'Financial Services Firm',
    industry: 'Financial Services',
    challenge: 'Manual processes and disconnected systems slowing sales cycles',
    solution: 'Sales Cloud + CPQ implementation with ERP and data warehouse integration',
    results: ['40% faster quotes', '25% higher win rate', 'Single source of truth'],
  },
];

const clouds = [
  { name: 'Sales Cloud', color: 'bg-blue-100 text-blue-700' },
  { name: 'Service Cloud', color: 'bg-green-100 text-green-700' },
  { name: 'Marketing Cloud', color: 'bg-purple-100 text-purple-700' },
  { name: 'Data Cloud', color: 'bg-cyan-100 text-cyan-700' },
  { name: 'Experience Cloud', color: 'bg-orange-100 text-orange-700' },
  { name: 'Commerce Cloud', color: 'bg-pink-100 text-pink-700' },
];

export default function SalesforcePage() {
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
            <div className="w-16 h-16 bg-[#00A1E0] rounded-2xl flex items-center justify-center">
              <Users className="w-8 h-8 text-white" />
            </div>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-[#00A1E0]/20 text-[#00A1E0] text-sm font-medium rounded-full flex items-center gap-1">
                <Award className="w-4 h-4" />
                Consulting Partner
              </span>
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Salesforce Implementation
            <span className="text-[var(--aci-primary-light)]"> & Integration</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mb-8">
            As a Salesforce Consulting Partner, we help enterprises maximize their Salesforce
            investment. From initial implementation to complex integrations, our certified
            consultants deliver solutions that drive business value.
          </p>

          <div className="flex flex-wrap gap-4">
            <Button href="/contact?reason=architecture-call" variant="primary" size="lg">
              Schedule Salesforce Assessment
            </Button>
            <Button href="/case-studies" variant="secondary" size="lg">
              View Case Studies
            </Button>
          </div>
        </div>
      </section>

      {/* Clouds */}
      <section className="py-12 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-center font-semibold text-gray-500 mb-6">Salesforce Clouds We Implement</h3>
          <div className="flex flex-wrap justify-center gap-3">
            {clouds.map((cloud) => (
              <span key={cloud.name} className={`px-4 py-2 ${cloud.color} text-sm font-medium rounded-full`}>
                {cloud.name}
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
              <div className="w-14 h-14 bg-[#00A1E0]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Zap className="w-7 h-7 text-[#00A1E0]" />
              </div>
              <h3 className="font-semibold text-[var(--aci-secondary)] mb-2">Certified Experts</h3>
              <p className="text-gray-600 text-sm">
                30+ Salesforce certifications across Sales, Service, Marketing, and Platform.
              </p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-[#00A1E0]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-7 h-7 text-[#00A1E0]" />
              </div>
              <h3 className="font-semibold text-[var(--aci-secondary)] mb-2">End-to-End Delivery</h3>
              <p className="text-gray-600 text-sm">
                From strategy to implementation to ongoing managed services.
              </p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-[#00A1E0]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-7 h-7 text-[#00A1E0]" />
              </div>
              <h3 className="font-semibold text-[var(--aci-secondary)] mb-2">Integration Focus</h3>
              <p className="text-gray-600 text-sm">
                Deep expertise connecting Salesforce to ERPs, data warehouses, and more.
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
              Comprehensive Salesforce services from strategy to managed operations.
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
              Salesforce Success Stories
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {caseStudies.map((cs, index) => (
              <div key={index} className="bg-gray-50 rounded-2xl p-8">
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-3 py-1 bg-[#00A1E0]/10 text-[#00A1E0] text-sm font-medium rounded-full">
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
      <section className="py-20 bg-[#00A1E0]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Maximize Your Salesforce Investment?
          </h2>
          <p className="text-xl text-cyan-100 mb-8">
            Schedule a free assessment with our Salesforce certified consultants.
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
