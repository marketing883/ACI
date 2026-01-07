import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, CheckCircle2, Award, Workflow, Shield, TrendingUp, Zap } from 'lucide-react';
import Button from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'ServiceNow Implementation Services',
  description: 'ACI Infotech is a ServiceNow Elite Partner. ITSM, ITOM, HR Service Delivery, and workflow automation implementation and optimization.',
};

const capabilities = [
  {
    title: 'ITSM Implementation',
    description: 'Deploy ServiceNow IT Service Management for streamlined incident, problem, and change management.',
    features: ['Incident management', 'Problem management', 'Change management', 'Service catalog'],
  },
  {
    title: 'ITOM & Discovery',
    description: 'Gain visibility into your IT infrastructure with automated discovery and event management.',
    features: ['Discovery', 'Service mapping', 'Event management', 'Cloud management'],
  },
  {
    title: 'HR Service Delivery',
    description: 'Transform employee experiences with self-service HR and automated workflows.',
    features: ['Employee center', 'Case management', 'Onboarding', 'Knowledge management'],
  },
  {
    title: 'App Engine & Low-Code',
    description: 'Build custom applications rapidly with ServiceNow App Engine and Flow Designer.',
    features: ['App Engine Studio', 'Flow Designer', 'Integration Hub', 'Custom apps'],
  },
  {
    title: 'Security Operations',
    description: 'Streamline security incident response with ServiceNow SecOps integration.',
    features: ['Security incident response', 'Vulnerability management', 'Threat intelligence', 'GRC'],
  },
  {
    title: 'Managed Services',
    description: 'Ongoing ServiceNow administration, optimization, and support with certified experts.',
    features: ['Platform admin', 'Upgrade management', 'Performance tuning', 'User training'],
  },
];

const caseStudies = [
  {
    client: 'Fortune 500 Financial',
    industry: 'Financial Services',
    challenge: 'Manual IT processes causing slow ticket resolution and poor employee satisfaction',
    solution: 'Full ITSM implementation with AI-powered virtual agent and self-service portal',
    results: ['70% faster resolution', '45% ticket deflection', '92% employee satisfaction'],
  },
  {
    client: 'Global Manufacturing',
    industry: 'Manufacturing',
    challenge: 'No visibility into IT assets and infrastructure dependencies',
    solution: 'ServiceNow ITOM with Discovery and Service Mapping across hybrid infrastructure',
    results: ['100% asset visibility', '60% faster RCA', '$2M avoided downtime'],
  },
];

const modules = [
  { name: 'ITSM', color: 'bg-green-100 text-green-700' },
  { name: 'ITOM', color: 'bg-blue-100 text-blue-700' },
  { name: 'HRSD', color: 'bg-purple-100 text-purple-700' },
  { name: 'CSM', color: 'bg-orange-100 text-orange-700' },
  { name: 'SecOps', color: 'bg-red-100 text-red-700' },
  { name: 'App Engine', color: 'bg-cyan-100 text-cyan-700' },
];

export default function ServiceNowPage() {
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
            <div className="w-16 h-16 bg-[#81B5A1] rounded-2xl flex items-center justify-center">
              <Workflow className="w-8 h-8 text-white" />
            </div>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-[#81B5A1]/20 text-[#81B5A1] text-sm font-medium rounded-full flex items-center gap-1">
                <Award className="w-4 h-4" />
                Elite Partner
              </span>
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            ServiceNow Implementation
            <span className="text-[var(--aci-primary-light)]"> & Workflow Automation</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mb-8">
            As a ServiceNow Elite Partner, we help enterprises transform their digital workflows
            and deliver exceptional employee and customer experiences. From ITSM to custom apps,
            our certified consultants maximize your ServiceNow investment.
          </p>

          <div className="flex flex-wrap gap-4">
            <Button href="/contact?reason=architecture-call" variant="primary" size="lg">
              Schedule ServiceNow Assessment
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
          <h3 className="text-center font-semibold text-gray-500 mb-6">ServiceNow Products We Implement</h3>
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
              <div className="w-14 h-14 bg-[#81B5A1]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Zap className="w-7 h-7 text-[#81B5A1]" />
              </div>
              <h3 className="font-semibold text-[var(--aci-secondary)] mb-2">Certified Experts</h3>
              <p className="text-gray-600 text-sm">
                50+ ServiceNow certifications across ITSM, ITOM, HRSD, and development.
              </p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-[#81B5A1]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-7 h-7 text-[#81B5A1]" />
              </div>
              <h3 className="font-semibold text-[var(--aci-secondary)] mb-2">Rapid Time-to-Value</h3>
              <p className="text-gray-600 text-sm">
                Accelerated implementations with pre-built templates and best practices.
              </p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-[#81B5A1]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-7 h-7 text-[#81B5A1]" />
              </div>
              <h3 className="font-semibold text-[var(--aci-secondary)] mb-2">Enterprise Scale</h3>
              <p className="text-gray-600 text-sm">
                Experience with global rollouts across 100K+ users.
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
              End-to-end ServiceNow services from strategy to managed operations.
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
              ServiceNow Success Stories
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {caseStudies.map((cs, index) => (
              <div key={index} className="bg-gray-50 rounded-2xl p-8">
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-3 py-1 bg-[#81B5A1]/10 text-[#81B5A1] text-sm font-medium rounded-full">
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
      <section className="py-20 bg-[#81B5A1]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Digital Workflows?
          </h2>
          <p className="text-xl text-green-100 mb-8">
            Schedule a free assessment with our ServiceNow certified consultants.
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
