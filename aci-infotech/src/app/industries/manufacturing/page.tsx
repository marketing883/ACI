import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, CheckCircle2, Factory, Cpu, BarChart3, Wrench } from 'lucide-react';
import Button from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'Manufacturing Technology Solutions',
  description: 'Industry 4.0 solutions for manufacturers. IoT analytics, predictive maintenance, quality analytics, and smart factory implementations.',
};

const solutions = [
  {
    title: 'Predictive Maintenance',
    description: 'Deploy ML models that predict equipment failures before they happen, reducing downtime and maintenance costs.',
    outcomes: ['67% less downtime', '45% lower maintenance costs', 'Extended equipment life'],
    services: ['Applied AI & ML', 'Data Engineering'],
  },
  {
    title: 'IoT Data Platform',
    description: 'Build scalable platforms that ingest, process, and analyze data from thousands of sensors in real-time.',
    outcomes: ['Real-time visibility', 'Scalable architecture', 'Edge-to-cloud integration'],
    services: ['Data Engineering', 'Cloud Modernization'],
  },
  {
    title: 'Quality Analytics',
    description: 'Implement ML-powered quality control that detects defects early and identifies root causes.',
    outcomes: ['35% fewer defects', 'Automated inspection', 'Root cause analysis'],
    services: ['Applied AI & ML', 'Data Engineering'],
  },
  {
    title: 'Supply Chain Intelligence',
    description: 'Gain visibility into your supply chain with predictive analytics for demand, inventory, and supplier risk.',
    outcomes: ['Demand forecasting', 'Inventory optimization', 'Risk prediction'],
    services: ['Applied AI & ML', 'Data Engineering'],
  },
  {
    title: 'Digital Twin',
    description: 'Create digital representations of physical assets for simulation, monitoring, and optimization.',
    outcomes: ['Asset simulation', 'Process optimization', 'What-if analysis'],
    services: ['Digital Transformation', 'Data Engineering'],
  },
  {
    title: 'MES Integration',
    description: 'Connect manufacturing execution systems with enterprise platforms for end-to-end visibility.',
    outcomes: ['Real-time production data', 'ERP integration', 'OEE optimization'],
    services: ['Data Engineering', 'Digital Transformation'],
  },
];

const caseStudies = [
  {
    client: 'Global Manufacturer',
    type: 'Discrete Manufacturing',
    challenge: 'Unplanned equipment failures causing significant production losses and safety risks',
    solution: 'IoT data platform with ML-based predictive maintenance across 50+ production lines',
    results: [
      { metric: '67%', label: 'Reduction in unplanned downtime' },
      { metric: '$8M', label: 'Annual savings from avoided failures' },
      { metric: '99.2%', label: 'Equipment availability' },
    ],
    technologies: ['Azure IoT Hub', 'Databricks', 'Python', 'Power BI'],
  },
  {
    client: 'Industrial Equipment Company',
    type: 'Heavy Manufacturing',
    challenge: 'Quality issues not detected until final inspection, causing rework and delays',
    solution: 'Computer vision quality inspection with real-time defect detection and alerting',
    results: [
      { metric: '35%', label: 'Reduction in defect rate' },
      { metric: '80%', label: 'Faster defect detection' },
      { metric: '$2M', label: 'Annual savings from reduced rework' },
    ],
    technologies: ['AWS SageMaker', 'OpenCV', 'Snowflake', 'Kafka'],
  },
];

const capabilities = [
  { name: 'SCADA/PLC Integration', description: 'Industrial control systems' },
  { name: 'MES Platforms', description: 'Siemens, Rockwell, SAP' },
  { name: 'IoT Platforms', description: 'Azure IoT, AWS IoT, PTC' },
  { name: 'ERP Systems', description: 'SAP, Oracle, Microsoft' },
  { name: 'Quality Systems', description: 'QMS integration' },
  { name: 'Edge Computing', description: 'Real-time processing' },
];

export default function ManufacturingPage() {
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
              <Factory className="w-8 h-8 text-white" />
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Manufacturing
            <span className="text-[var(--aci-primary-light)]"> Technology Solutions</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mb-8">
            From discrete manufacturing to process industries, we help manufacturers implement
            Industry 4.0 solutions that reduce downtime, improve quality, and optimize operations.
            Our expertise spans IoT, AI, and enterprise integration.
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
              <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Cpu className="w-7 h-7 text-orange-600" />
              </div>
              <h3 className="font-semibold text-[var(--aci-secondary)] mb-2">Industry 4.0</h3>
              <p className="text-gray-600 text-sm">
                Smart factory solutions with IoT and AI.
              </p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Wrench className="w-7 h-7 text-orange-600" />
              </div>
              <h3 className="font-semibold text-[var(--aci-secondary)] mb-2">OT Expertise</h3>
              <p className="text-gray-600 text-sm">
                Deep operational technology experience.
              </p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-7 h-7 text-orange-600" />
              </div>
              <h3 className="font-semibold text-[var(--aci-secondary)] mb-2">Real-Time Analytics</h3>
              <p className="text-gray-600 text-sm">
                Millisecond-level insights from production.
              </p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Factory className="w-7 h-7 text-orange-600" />
              </div>
              <h3 className="font-semibold text-[var(--aci-secondary)] mb-2">Proven Results</h3>
              <p className="text-gray-600 text-sm">
                67% reduction in unplanned downtime.
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
              Solutions for Manufacturing
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Industry 4.0 solutions that deliver measurable operational improvements.
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
                    <span key={service} className="px-2 py-1 bg-orange-50 text-orange-700 text-xs rounded">
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
              Manufacturing Success Stories
            </h2>
          </div>

          <div className="space-y-8">
            {caseStudies.map((cs, index) => (
              <div key={index} className="bg-gray-50 rounded-2xl p-8">
                <div className="flex flex-col lg:flex-row gap-8">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="px-3 py-1 bg-orange-600 text-white text-sm font-medium rounded-full">
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
                          <div className="text-2xl font-bold text-orange-600">{result.metric}</div>
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

      {/* Capabilities */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-[var(--aci-secondary)] mb-8 text-center">
            Manufacturing Systems Expertise
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {capabilities.map((item) => (
              <div key={item.name} className="bg-white p-4 rounded-lg flex items-center gap-4">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                  <Factory className="w-5 h-5 text-orange-600" />
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
      <section className="py-20 bg-orange-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Modernize Your Manufacturing?
          </h2>
          <p className="text-xl text-orange-100 mb-8">
            Schedule a consultation with our manufacturing technology experts to discuss your challenges.
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
