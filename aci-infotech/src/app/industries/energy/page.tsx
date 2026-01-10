import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, CheckCircle2, Zap, Shield, BarChart3, Leaf } from 'lucide-react';
import Button from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'Energy & Utilities Technology Solutions',
  description: 'Secure, compliant technology solutions for energy companies and utilities. NERC CIP compliance, grid optimization, and renewable integration.',
};

const solutions = [
  {
    title: 'NERC CIP Compliance',
    description: 'Implement comprehensive cybersecurity programs that meet all NERC CIP requirements.',
    outcomes: ['100% audit ready', 'Automated evidence', 'Continuous monitoring'],
    services: ['Cyber Security', 'Data Engineering'],
  },
  {
    title: 'Grid Analytics',
    description: 'Build real-time analytics platforms for grid monitoring, optimization, and predictive maintenance.',
    outcomes: ['Real-time monitoring', 'Outage prediction', 'Load optimization'],
    services: ['Data Engineering', 'Applied AI & ML'],
  },
  {
    title: 'Asset Performance Management',
    description: 'Deploy predictive maintenance for critical assets to extend life and prevent failures.',
    outcomes: ['40% less downtime', 'Extended asset life', 'Optimized maintenance'],
    services: ['Applied AI & ML', 'Data Engineering'],
  },
  {
    title: 'Renewable Integration',
    description: 'Integrate renewable energy sources with forecasting and grid balancing solutions.',
    outcomes: ['Solar/wind forecasting', 'Grid stability', 'Storage optimization'],
    services: ['Applied AI & ML', 'Data Engineering'],
  },
  {
    title: 'OT/IT Convergence',
    description: 'Securely connect operational and information technology for unified visibility and control.',
    outcomes: ['Unified operations', 'Secure connectivity', 'Real-time data'],
    services: ['Cloud Modernization', 'Cyber Security'],
  },
  {
    title: 'Customer Analytics',
    description: 'Understand customer behavior, predict demand, and optimize rate structures.',
    outcomes: ['Demand forecasting', 'Customer segmentation', 'Rate optimization'],
    services: ['Data Engineering', 'Applied AI & ML'],
  },
];

const caseStudies = [
  {
    client: 'Major Energy Utility',
    type: 'Electric Utility',
    challenge: 'NERC CIP compliance gaps putting critical infrastructure at risk',
    solution: 'Comprehensive cybersecurity program with automated evidence collection and continuous monitoring',
    results: [
      { metric: '100%', label: 'NERC CIP compliance achieved' },
      { metric: 'Zero', label: 'Critical findings in audit' },
      { metric: '60%', label: 'Reduction in compliance effort' },
    ],
    technologies: ['Splunk', 'Azure', 'ServiceNow', 'Custom tools'],
  },
  {
    client: 'Regional Utility',
    type: 'Gas & Electric',
    challenge: 'Aging infrastructure causing unplanned outages and safety risks',
    solution: 'IoT-based asset monitoring with ML predictive maintenance',
    results: [
      { metric: '40%', label: 'Reduction in unplanned outages' },
      { metric: '$15M', label: 'Annual savings from optimized maintenance' },
      { metric: '99.9%', label: 'Grid reliability achieved' },
    ],
    technologies: ['Azure IoT', 'Databricks', 'Power BI', 'OSIsoft PI'],
  },
];

const compliance = [
  { name: 'NERC CIP', description: 'Critical infrastructure protection' },
  { name: 'SOC 2 Type II', description: 'Security controls' },
  { name: 'ISO 27001', description: 'Information security' },
  { name: 'NIST CSF', description: 'Cybersecurity framework' },
  { name: 'IEC 62443', description: 'Industrial cybersecurity' },
  { name: 'TSA Pipeline', description: 'Pipeline security' },
];

export default function EnergyPage() {
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
              <Zap className="w-8 h-8 text-white" />
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Energy & Utilities
            <span className="text-[var(--aci-primary-light)]"> Technology Solutions</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mb-8">
            From electric utilities to oil & gas companies, we help energy organizations
            secure critical infrastructure, optimize operations, and integrate renewables.
            Our solutions are built for the unique regulatory and operational requirements
            of the energy sector.
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
              <div className="w-14 h-14 bg-yellow-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-7 h-7 text-yellow-600" />
              </div>
              <h3 className="font-semibold text-[var(--aci-secondary)] mb-2">NERC CIP Experts</h3>
              <p className="text-gray-600 text-sm">
                Deep expertise in critical infrastructure protection.
              </p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-yellow-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Zap className="w-7 h-7 text-yellow-600" />
              </div>
              <h3 className="font-semibold text-[var(--aci-secondary)] mb-2">OT Security</h3>
              <p className="text-gray-600 text-sm">
                Specialized operational technology security.
              </p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-yellow-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-7 h-7 text-yellow-600" />
              </div>
              <h3 className="font-semibold text-[var(--aci-secondary)] mb-2">Grid Analytics</h3>
              <p className="text-gray-600 text-sm">
                Real-time grid monitoring and optimization.
              </p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-yellow-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Leaf className="w-7 h-7 text-yellow-600" />
              </div>
              <h3 className="font-semibold text-[var(--aci-secondary)] mb-2">Renewables</h3>
              <p className="text-gray-600 text-sm">
                Renewable integration and forecasting.
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
              Solutions for Energy
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Secure, compliant solutions built for the unique requirements of energy organizations.
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
                    <span key={service} className="px-2 py-1 bg-yellow-50 text-yellow-700 text-xs rounded">
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
              Energy Success Stories
            </h2>
          </div>

          <div className="space-y-8">
            {caseStudies.map((cs, index) => (
              <div key={index} className="bg-gray-50 rounded-2xl p-8">
                <div className="flex flex-col lg:flex-row gap-8">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="px-3 py-1 bg-yellow-500 text-white text-sm font-medium rounded-full">
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
                          <div className="text-2xl font-bold text-yellow-600">{result.metric}</div>
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
            Compliance & Security Expertise
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
      <section className="py-20 bg-yellow-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Secure and Optimize Your Energy Operations?
          </h2>
          <p className="text-xl text-yellow-100 mb-8">
            Schedule a consultation with our energy technology experts to discuss your challenges.
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
