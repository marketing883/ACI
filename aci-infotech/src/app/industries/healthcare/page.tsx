import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, CheckCircle2, Heart, Shield, Clock, FileText } from 'lucide-react';
import Button from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'Healthcare & Life Sciences Technology Solutions',
  description: 'HIPAA-compliant data, AI, and cloud solutions for healthcare providers, payers, and life sciences. Clinical data integration, drug discovery, and patient outcomes.',
};

const solutions = [
  {
    title: 'Clinical Data Integration',
    description: 'Unify EHR, claims, and clinical data into a single platform for comprehensive patient insights.',
    outcomes: ['Unified patient view', 'Real-time data access', 'FHIR compliance'],
    services: ['Data Engineering', 'Cloud Modernization'],
  },
  {
    title: 'Population Health Analytics',
    description: 'Identify at-risk populations and improve outcomes with predictive analytics and care management.',
    outcomes: ['Risk stratification', 'Care gap identification', 'Outcome prediction'],
    services: ['Applied AI & ML', 'Data Engineering'],
  },
  {
    title: 'Drug Discovery Acceleration',
    description: 'Accelerate research with unified data platforms, AI-powered analysis, and collaboration tools.',
    outcomes: ['40% faster data access', 'Automated lineage', 'Research collaboration'],
    services: ['Data Engineering', 'Applied AI & ML'],
  },
  {
    title: 'Claims & Revenue Analytics',
    description: 'Optimize revenue cycle with automated claims analysis, denial prediction, and payment optimization.',
    outcomes: ['Reduced denials', 'Faster payments', 'Revenue optimization'],
    services: ['Applied AI & ML', 'Data Engineering'],
  },
  {
    title: 'HIPAA-Compliant Cloud',
    description: 'Migrate healthcare workloads to the cloud with built-in HIPAA compliance and security.',
    outcomes: ['HIPAA certified', 'BAA coverage', 'Audit ready'],
    services: ['Cloud Modernization', 'Cyber Security'],
  },
  {
    title: 'AI for Clinical Decision Support',
    description: 'Deploy AI models that assist clinicians with diagnosis, treatment recommendations, and alerts.',
    outcomes: ['Clinical insights', 'Alert optimization', 'Evidence-based care'],
    services: ['Applied AI & ML', 'Digital Transformation'],
  },
];

const caseStudies = [
  {
    client: 'Regional Healthcare System',
    type: 'Healthcare Provider',
    challenge: 'Fragmented patient data across 12 hospitals preventing coordinated care',
    solution: 'HIPAA-compliant data platform on AWS with FHIR APIs and real-time integration',
    results: [
      { metric: 'Unified', label: 'Patient records across all facilities' },
      { metric: '99.99%', label: 'Platform uptime achieved' },
      { metric: 'HIPAA', label: 'Full compliance maintained' },
    ],
    technologies: ['AWS', 'Snowflake', 'FHIR', 'Kafka'],
  },
  {
    client: 'Global Pharmaceutical',
    type: 'Life Sciences',
    challenge: 'Siloed research data slowing drug discovery timelines',
    solution: 'Unified data lake on Databricks with automated lineage tracking and collaboration',
    results: [
      { metric: '40%', label: 'Faster research data access' },
      { metric: '100%', label: 'Data lineage compliance' },
      { metric: '3x', label: 'Researcher productivity' },
    ],
    technologies: ['Databricks', 'Delta Lake', 'Python', 'Airflow'],
  },
];

const compliance = [
  { name: 'HIPAA', description: 'Health data privacy' },
  { name: 'HITRUST', description: 'Security framework' },
  { name: 'SOC 2 Type II', description: 'Security controls' },
  { name: 'FDA 21 CFR Part 11', description: 'Electronic records' },
  { name: 'GDPR', description: 'EU data protection' },
  { name: 'GxP', description: 'Pharma quality standards' },
];

export default function HealthcarePage() {
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
              <Heart className="w-8 h-8 text-white" />
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Healthcare & Life Sciences
            <span className="text-[var(--aci-primary-light)]"> Technology Solutions</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mb-8">
            From hospital systems to pharmaceutical companies, we help healthcare organizations
            harness data to improve patient outcomes, accelerate research, and maintain
            compliance, all while ensuring the highest levels of security and privacy.
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
              <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-7 h-7 text-red-600" />
              </div>
              <h3 className="font-semibold text-[var(--aci-secondary)] mb-2">HIPAA Compliant</h3>
              <p className="text-gray-600 text-sm">
                Built-in compliance for all healthcare regulations.
              </p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Clock className="w-7 h-7 text-red-600" />
              </div>
              <h3 className="font-semibold text-[var(--aci-secondary)] mb-2">Real-Time Data</h3>
              <p className="text-gray-600 text-sm">
                Real-time clinical data for immediate insights.
              </p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FileText className="w-7 h-7 text-red-600" />
              </div>
              <h3 className="font-semibold text-[var(--aci-secondary)] mb-2">Interoperability</h3>
              <p className="text-gray-600 text-sm">
                FHIR-native solutions for seamless integration.
              </p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Heart className="w-7 h-7 text-red-600" />
              </div>
              <h3 className="font-semibold text-[var(--aci-secondary)] mb-2">Patient-Centric</h3>
              <p className="text-gray-600 text-sm">
                Solutions designed to improve patient outcomes.
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
              Solutions for Healthcare
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Purpose-built solutions that address the unique challenges of healthcare organizations.
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
                    <span key={service} className="px-2 py-1 bg-red-50 text-red-700 text-xs rounded">
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
              Healthcare Success Stories
            </h2>
          </div>

          <div className="space-y-8">
            {caseStudies.map((cs, index) => (
              <div key={index} className="bg-gray-50 rounded-2xl p-8">
                <div className="flex flex-col lg:flex-row gap-8">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="px-3 py-1 bg-red-600 text-white text-sm font-medium rounded-full">
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
                          <div className="text-2xl font-bold text-red-600">{result.metric}</div>
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
      <section className="py-20 bg-red-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Transform Healthcare Delivery?
          </h2>
          <p className="text-xl text-red-100 mb-8">
            Schedule a consultation with our healthcare technology experts to discuss your challenges.
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
