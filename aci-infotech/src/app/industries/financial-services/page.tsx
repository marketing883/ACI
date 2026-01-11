import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, CheckCircle2, Shield, TrendingUp, Clock, Building2 } from 'lucide-react';
import Button from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'Financial Services Technology Solutions',
  description: 'Enterprise data, AI, and cloud solutions for banks, insurance companies, and asset managers. Regulatory compliance, fraud detection, and digital transformation.',
};

const solutions = [
  {
    title: 'Data Platform Modernization',
    description: 'Consolidate legacy systems into modern, cloud-native data platforms that support real-time analytics and AI.',
    outcomes: ['40+ systems consolidated', '$12M+ annual savings', 'Zero reporting disruptions'],
    services: ['Data Engineering', 'Cloud Modernization'],
  },
  {
    title: 'AI-Powered Fraud Detection',
    description: 'Deploy machine learning models that detect fraud in real-time while minimizing false positives.',
    outcomes: ['$25M fraud reduction', '85% fewer false positives', '<100ms scoring'],
    services: ['Applied AI & ML', 'Data Engineering'],
  },
  {
    title: 'Regulatory Compliance',
    description: 'Build data lineage, audit trails, and governance frameworks that satisfy regulators.',
    outcomes: ['100% audit readiness', 'Automated compliance', 'SOX/SOC 2 certified'],
    services: ['Data Engineering', 'Cyber Security'],
  },
  {
    title: 'Customer 360 & Personalization',
    description: 'Unify customer data across touchpoints to enable personalized experiences and improve retention.',
    outcomes: ['Single customer view', '35% engagement lift', '2x cross-sell'],
    services: ['MarTech & CDP', 'Data Engineering'],
  },
  {
    title: 'Risk Analytics',
    description: 'Build real-time risk models and dashboards that enable proactive risk management.',
    outcomes: ['Real-time risk scoring', 'Scenario modeling', 'Regulatory capital optimization'],
    services: ['Applied AI & ML', 'Data Engineering'],
  },
  {
    title: 'Digital Transformation',
    description: 'Modernize core banking systems, automate processes, and enable digital-first experiences.',
    outcomes: ['45% cost reduction', 'Digital-first UX', '99.99% uptime'],
    services: ['Digital Transformation', 'Cloud Modernization'],
  },
];

const caseStudies = [
  {
    client: 'MSCI',
    type: 'Asset Management',
    challenge: '40+ finance systems post-acquisitions needed consolidation with zero disruption to financial reporting',
    solution: 'SAP S/4HANA implementation with automated data quality gates and real-time integration pipelines',
    results: [
      { metric: '$12M', label: 'Operational savings in year one' },
      { metric: '18 months', label: 'Delivery timeline' },
      { metric: 'Zero', label: 'Financial reporting disruptions' },
    ],
    technologies: ['SAP S/4HANA', 'Azure DevOps', 'Databricks'],
  },
  {
    client: 'Major Financial Institution',
    type: 'Banking',
    challenge: 'Rising fraud losses, slow manual review process, high false positive rates',
    solution: 'ML-based fraud detection with real-time scoring and explainable AI for compliance',
    results: [
      { metric: '$25M', label: 'Annual fraud loss reduction' },
      { metric: '85%', label: 'Reduction in false positives' },
      { metric: '<100ms', label: 'Transaction scoring time' },
    ],
    technologies: ['Python', 'TensorFlow', 'Kafka', 'Databricks'],
  },
];

const compliance = [
  { name: 'SOC 2 Type II', description: 'Security controls certified' },
  { name: 'SOX Compliance', description: 'Financial reporting controls' },
  { name: 'GDPR/CCPA', description: 'Privacy regulations' },
  { name: 'PCI-DSS', description: 'Payment card security' },
  { name: 'Basel III/IV', description: 'Banking regulations' },
  { name: 'Dodd-Frank', description: 'Financial reform compliance' },
];

export default function FinancialServicesPage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-[var(--aci-secondary)] pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/industries"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            All Industries
          </Link>

          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-[var(--aci-primary)] rounded-2xl flex items-center justify-center">
              <Building2 className="w-8 h-8 text-white" />
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Financial Services
            <span className="text-[var(--aci-primary-light)]"> Technology Solutions</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mb-8">
            From global asset managers to regional banks, we help financial institutions
            modernize their technology infrastructure, implement AI at scale, and meet
            evolving regulatory requirements, all while maintaining the security and
            reliability your operations demand.
          </p>

          <div className="flex flex-wrap gap-4">
            <Button href="/contact?reason=architecture-call" variant="primary" size="lg">
              Schedule Consultation
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
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-7 h-7 text-[var(--aci-primary)]" />
              </div>
              <h3 className="font-semibold text-[var(--aci-secondary)] mb-2">Compliance First</h3>
              <p className="text-gray-600 text-sm">
                Built-in compliance for SOX, SOC 2, PCI-DSS, and more.
              </p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Clock className="w-7 h-7 text-[var(--aci-primary)]" />
              </div>
              <h3 className="font-semibold text-[var(--aci-secondary)] mb-2">Real-Time Ready</h3>
              <p className="text-gray-600 text-sm">
                Sub-second fraud detection and trading analytics.
              </p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-7 h-7 text-[var(--aci-primary)]" />
              </div>
              <h3 className="font-semibold text-[var(--aci-secondary)] mb-2">Proven at Scale</h3>
              <p className="text-gray-600 text-sm">
                Experience with global financial institutions.
              </p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-7 h-7 text-[var(--aci-primary)]" />
              </div>
              <h3 className="font-semibold text-[var(--aci-secondary)] mb-2">Industry Expertise</h3>
              <p className="text-gray-600 text-sm">
                Consultants with financial services backgrounds.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Solutions */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--aci-secondary)] mb-4">
              Solutions for Financial Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Purpose-built solutions that address the unique challenges of financial institutions.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {solutions.map((solution) => (
              <div key={solution.title} className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-xl font-bold text-[var(--aci-secondary)] mb-3">{solution.title}</h3>
                <p className="text-gray-600 mb-4">{solution.description}</p>

                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-500 mb-2">Outcomes</h4>
                  <ul className="space-y-1">
                    {solution.outcomes.map((outcome) => (
                      <li key={outcome} className="flex items-center gap-2 text-sm text-gray-700">
                        <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                        {outcome}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-wrap gap-2">
                  {solution.services.map((service) => (
                    <span key={service} className="px-2 py-1 bg-blue-50 text-[var(--aci-primary)] text-xs rounded">
                      {service}
                    </span>
                  ))}
                </div>
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
              Financial Services Success Stories
            </h2>
          </div>

          <div className="space-y-8">
            {caseStudies.map((cs, index) => (
              <div key={index} className="bg-gray-50 rounded-2xl p-8">
                <div className="flex flex-col lg:flex-row gap-8">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="px-3 py-1 bg-[var(--aci-primary)] text-white text-sm font-medium rounded-full">
                        {cs.type}
                      </span>
                      <span className="text-gray-500">{cs.client}</span>
                    </div>

                    <div className="mb-4">
                      <h3 className="font-semibold text-gray-700 mb-2">Challenge</h3>
                      <p className="text-gray-600">{cs.challenge}</p>
                    </div>

                    <div className="mb-4">
                      <h3 className="font-semibold text-gray-700 mb-2">Solution</h3>
                      <p className="text-gray-600">{cs.solution}</p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {cs.technologies.map((tech) => (
                        <span key={tech} className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded-full">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="lg:w-80">
                    <h3 className="font-semibold text-gray-700 mb-4">Results</h3>
                    <div className="space-y-4">
                      {cs.results.map((result, i) => (
                        <div key={i} className="bg-white p-4 rounded-lg">
                          <div className="text-2xl font-bold text-[var(--aci-primary)]">{result.metric}</div>
                          <div className="text-sm text-gray-600">{result.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href="/case-studies" className="inline-flex items-center gap-2 text-[var(--aci-primary)] font-semibold hover:underline">
              View All Case Studies <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Compliance */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-[var(--aci-secondary)] mb-8 text-center">
            Compliance & Regulatory Expertise
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {compliance.map((item) => (
              <div key={item.name} className="bg-white p-4 rounded-lg flex items-center gap-4">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Shield className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <div className="font-semibold text-[var(--aci-secondary)]">{item.name}</div>
                  <div className="text-sm text-gray-500">{item.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[var(--aci-primary)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Financial Operations?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Schedule a consultation with our financial services experts to discuss your challenges.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button href="/contact?reason=architecture-call" variant="secondary" size="lg">
              Schedule Consultation
            </Button>
            <Button href="/industries" variant="ghost" size="lg" className="text-white border-white hover:bg-white/10">
              Explore Other Industries
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
