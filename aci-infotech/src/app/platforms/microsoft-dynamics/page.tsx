'use client';

import Link from 'next/link';
import {
  ArrowLeft,
  CheckCircle2,
  Award,
  Zap,
  TrendingUp,
  Bot,
  Database,
  BarChart3,
  Workflow,
} from 'lucide-react';
import Button from '@/components/ui/Button';

const capabilities = [
  {
    icon: Bot,
    title: 'Microsoft Copilot',
    description: 'Implement AI-powered assistants across Dynamics 365 and Power Platform for enhanced productivity.',
    features: ['Copilot for Dynamics 365', 'Copilot Studio', 'Custom AI Agents', 'Copilot for Power Platform'],
  },
  {
    icon: Database,
    title: 'Dynamics 365 AI ERP',
    description: 'Modern ERP solutions with intelligent automation and real-time insights for finance and operations.',
    features: ['Finance & Supply Chain', 'Business Central', 'Customer Insights', 'Intelligent Order Management'],
  },
  {
    icon: TrendingUp,
    title: 'Dynamics 365 CRM',
    description: 'Customer relationship management with AI-driven insights and seamless integrations.',
    features: ['Sales', 'Customer Service', 'Field Service', 'Marketing'],
  },
  {
    icon: BarChart3,
    title: 'Microsoft Fabric',
    description: 'Unified analytics platform bringing together data engineering, science, and business intelligence.',
    features: ['Unified Data Platform', 'Real-time Analytics', 'Data Warehouse', 'Power BI Integration'],
  },
  {
    icon: Zap,
    title: 'Power Platform',
    description: 'Low-code solutions for rapid application development and business process automation.',
    features: ['Power Apps', 'Power Automate', 'Power Pages', 'Power Virtual Agents'],
  },
  {
    icon: Workflow,
    title: 'Integration & AI',
    description: 'Connect systems and infuse AI capabilities across your Microsoft ecosystem.',
    features: ['Azure OpenAI Service', 'Dataverse', 'Azure Integration Services', 'Custom Connectors'],
  },
];

const caseStudies = [
  {
    client: 'Global Manufacturing',
    industry: 'Manufacturing',
    challenge: 'Disconnected systems causing delays in order-to-cash cycle',
    solution: 'Dynamics 365 Finance & Supply Chain with Power Automate workflows',
    results: ['60% faster order processing', '$4M annual savings', '99.5% order accuracy'],
  },
  {
    client: 'Professional Services Firm',
    industry: 'Services',
    challenge: 'Manual resource allocation and project tracking',
    solution: 'Dynamics 365 Project Operations with Copilot integration',
    results: ['40% improvement in utilization', '25% faster project delivery', 'Real-time profitability insights'],
  },
];

export default function MicrosoftDynamicsPage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#0078D4] to-[#002050] pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/platforms"
            className="inline-flex items-center gap-2 text-blue-200 hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            All Platforms
          </Link>

          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-white/10 backdrop-blur rounded-2xl flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-10 h-10" fill="none">
                <rect x="1" y="1" width="10" height="10" fill="#F25022" />
                <rect x="13" y="1" width="10" height="10" fill="#7FBA00" />
                <rect x="1" y="13" width="10" height="10" fill="#00A4EF" />
                <rect x="13" y="13" width="10" height="10" fill="#FFB900" />
              </svg>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-yellow-500/20 text-yellow-300 text-sm font-medium rounded-full flex items-center gap-1">
                <Award className="w-4 h-4" />
                Microsoft Partner
              </span>
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Microsoft Dynamics, Copilot
            <span className="text-[#00A4EF]"> & Power Platform</span>
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mb-8">
            As a Microsoft Partner, we deliver end-to-end implementations of Dynamics 365,
            Copilot, Power Platform, and Microsoft Fabric. Our certified architects help
            enterprises accelerate with AI-powered business applications.
          </p>

          <div className="flex flex-wrap gap-4">
            <Button href="/contact?reason=architecture-call" variant="secondary" size="lg">
              Schedule Architecture Call
            </Button>
            <Button href="/case-studies" variant="outline" size="lg">
              View Case Studies
            </Button>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-3 gap-8 mt-12 pt-8 border-t border-white/10">
            <div>
              <div className="text-3xl font-bold text-white">50+</div>
              <div className="text-blue-200">Dynamics Implementations</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white">100%</div>
              <div className="text-blue-200">Certified Team</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white">24/7</div>
              <div className="text-blue-200">Support Available</div>
            </div>
          </div>
        </div>
      </section>

      {/* Capabilities Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[var(--aci-secondary)] mb-4">
              Our Microsoft Practice
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              End-to-end implementation across Dynamics 365, Copilot, Fabric, and the entire Microsoft AI-powered business ecosystem.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {capabilities.map((cap) => (
              <div key={cap.title} className="bg-white rounded-xl p-6 shadow-sm">
                <div className="w-12 h-12 bg-[#0078D4]/10 rounded-xl flex items-center justify-center mb-4">
                  <cap.icon className="w-6 h-6 text-[#0078D4]" />
                </div>
                <h3 className="text-xl font-semibold text-[var(--aci-secondary)] mb-2">{cap.title}</h3>
                <p className="text-gray-600 mb-4">{cap.description}</p>
                <ul className="space-y-2">
                  {cap.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Case Studies Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[var(--aci-secondary)] mb-12 text-center">
            Microsoft Success Stories
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {caseStudies.map((study) => (
              <div key={study.client} className="bg-gray-50 rounded-xl p-8">
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-3 py-1 bg-[#0078D4]/10 text-[#0078D4] text-sm font-medium rounded-full">
                    {study.industry}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-[var(--aci-secondary)] mb-3">{study.client}</h3>
                <p className="text-gray-600 mb-4">
                  <span className="font-medium">Challenge:</span> {study.challenge}
                </p>
                <p className="text-gray-600 mb-4">
                  <span className="font-medium">Solution:</span> {study.solution}
                </p>
                <div className="flex flex-wrap gap-2">
                  {study.results.map((result) => (
                    <span key={result} className="flex items-center gap-1 text-sm text-green-700 bg-green-50 px-3 py-1 rounded-full">
                      <CheckCircle2 className="w-4 h-4" />
                      {result}
                    </span>
                  ))}
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
            Ready to Transform with Microsoft?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Our certified architects can help you build a roadmap for Dynamics 365, Copilot, and Power Platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button href="/contact?reason=architecture-call" variant="secondary" size="lg">
              Schedule Architecture Call
            </Button>
            <Button href="/case-studies" variant="outline" size="lg" className="text-white border-white hover:bg-white/10">
              View Case Studies
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
