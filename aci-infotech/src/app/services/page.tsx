import Link from 'next/link';
import { Metadata } from 'next';
import { ArrowRight, Database, Brain, Cloud, Users, Shield, Zap, CheckCircle2 } from 'lucide-react';
import Button from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'Enterprise Technology Services',
  description: 'Data Engineering, AI/ML, Cloud Modernization, MarTech, Digital Transformation, and Cyber Security services for Fortune 500 companies.',
};

const services = [
  {
    id: 'data-engineering',
    icon: Database,
    title: 'Data Engineering',
    tagline: 'The Foundation Everything Else Stands On',
    description: 'Modern data platforms that unify, transform, and deliver the insights your business needs. Databricks, Snowflake, and cloud-native architectures built for scale.',
    capabilities: ['Lakehouse Architecture', 'Real-Time Pipelines', 'Data Quality & Governance', 'Migration & Modernization'],
    technologies: ['Databricks', 'Snowflake', 'dbt', 'Kafka', 'Spark'],
    href: '/services/data-engineering',
  },
  {
    id: 'applied-ai-ml',
    icon: Brain,
    title: 'Applied AI & ML',
    tagline: 'AI That Ships to Production',
    description: 'From predictive models to generative AI, we build AI systems that deliver measurable business outcomes—not PowerPoint demos.',
    capabilities: ['MLOps & Model Deployment', 'Predictive Analytics', 'GenAI & LLM Integration', 'AI Governance (ArqAI)'],
    technologies: ['Python', 'MLflow', 'TensorFlow', 'LangChain', 'Azure ML'],
    href: '/services/applied-ai-ml',
  },
  {
    id: 'cloud-modernization',
    icon: Cloud,
    title: 'Cloud Modernization',
    tagline: 'Migrate Without the Migraine',
    description: 'Strategic cloud migrations and modernizations that reduce costs, improve performance, and set you up for future innovation.',
    capabilities: ['Cloud Migration', 'Kubernetes & Containers', 'Infrastructure as Code', 'Cost Optimization'],
    technologies: ['AWS', 'Azure', 'GCP', 'Terraform', 'Kubernetes'],
    href: '/services/cloud-modernization',
  },
  {
    id: 'martech-cdp',
    icon: Users,
    title: 'MarTech & CDP',
    tagline: 'Turn Customer Data Into Revenue',
    description: 'Unified customer data platforms that power personalization, drive engagement, and deliver measurable marketing ROI.',
    capabilities: ['Customer Data Platforms', 'Marketing Automation', 'Real-Time Personalization', 'Attribution & Analytics'],
    technologies: ['Salesforce', 'Braze', 'Adobe', 'Segment', 'mParticle'],
    href: '/services/martech-cdp',
  },
  {
    id: 'digital-transformation',
    icon: Zap,
    title: 'Digital Transformation',
    tagline: 'Transform Operations, Not Just Slides',
    description: 'End-to-end digital transformation that modernizes processes, systems, and capabilities—delivered with the rigor of enterprise engineering.',
    capabilities: ['Process Automation', 'System Integration', 'ERP Modernization', 'Digital Strategy'],
    technologies: ['SAP', 'ServiceNow', 'MuleSoft', 'Power Platform', 'Workato'],
    href: '/services/digital-transformation',
  },
  {
    id: 'cyber-security',
    icon: Shield,
    title: 'Cyber Security',
    tagline: 'Security Built In, Not Bolted On',
    description: 'Enterprise security architecture, DevSecOps, and compliance frameworks that protect your data and satisfy regulators.',
    capabilities: ['Zero Trust Architecture', 'DevSecOps', 'Compliance & Audit', 'Threat Detection'],
    technologies: ['Splunk', 'CrowdStrike', 'Azure Sentinel', 'Palo Alto', 'Okta'],
    href: '/services/cyber-security',
  },
];

export default function ServicesPage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-[var(--aci-secondary)] pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <p className="text-[var(--aci-primary-light)] font-medium mb-4 tracking-wide uppercase">
              Our Services
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Enterprise Technology Services That
              <span className="text-[var(--aci-primary-light)]"> Actually Deliver</span>
            </h1>
            <p className="text-xl text-gray-400 mb-8">
              Six practice areas. One engineering standard. Every engagement staffed with senior architects
              who've shipped production systems at Fortune 500 scale.
            </p>
          </div>

          {/* Value Props */}
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <div className="bg-gray-800 rounded-xl p-6 text-center">
              <div className="text-4xl font-bold text-white mb-2">80+</div>
              <div className="text-gray-400">Enterprise Clients</div>
            </div>
            <div className="bg-gray-800 rounded-xl p-6 text-center">
              <div className="text-4xl font-bold text-white mb-2">$500M+</div>
              <div className="text-gray-400">Client Value Delivered</div>
            </div>
            <div className="bg-gray-800 rounded-xl p-6 text-center">
              <div className="text-4xl font-bold text-white mb-2">98%</div>
              <div className="text-gray-400">Client Retention Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-16">
            {services.map((service, index) => {
              const Icon = service.icon;
              const isEven = index % 2 === 0;

              return (
                <div
                  key={service.id}
                  className={`flex flex-col lg:flex-row gap-8 lg:gap-16 items-center ${
                    !isEven ? 'lg:flex-row-reverse' : ''
                  }`}
                >
                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-14 h-14 bg-[var(--aci-primary)] rounded-xl flex items-center justify-center">
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-[var(--aci-secondary)]">
                          {service.title}
                        </h2>
                        <p className="text-[var(--aci-primary)] font-medium">{service.tagline}</p>
                      </div>
                    </div>

                    <p className="text-lg text-gray-600 mb-6">{service.description}</p>

                    {/* Capabilities */}
                    <div className="mb-6">
                      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                        Key Capabilities
                      </h3>
                      <ul className="grid grid-cols-2 gap-2">
                        {service.capabilities.map((cap) => (
                          <li key={cap} className="flex items-center gap-2 text-gray-700">
                            <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                            <span className="text-sm">{cap}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Technologies */}
                    <div className="mb-6">
                      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                        Technologies
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {service.technologies.map((tech) => (
                          <span
                            key={tech}
                            className="px-3 py-1 bg-gray-200 rounded-full text-sm text-gray-700"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    <Link
                      href={service.href}
                      className="inline-flex items-center gap-2 text-[var(--aci-primary)] font-semibold hover:gap-3 transition-all"
                    >
                      Learn More <ArrowRight className="w-5 h-5" />
                    </Link>
                  </div>

                  {/* Visual */}
                  <div className="flex-1 w-full">
                    <div className="bg-gradient-to-br from-[var(--aci-primary)] to-[var(--aci-secondary)] rounded-2xl aspect-[4/3] flex items-center justify-center">
                      <Icon className="w-24 h-24 text-white/30" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Our Approach */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--aci-secondary)] mb-4">
              The ACI Difference
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Every engagement is delivered with the same rigor that built our Fortune 500 reputation.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">👷</span>
              </div>
              <h3 className="font-semibold text-[var(--aci-secondary)] mb-2">Senior Architects Only</h3>
              <p className="text-gray-600 text-sm">
                No junior consultants learning on your dime. Every team member has 10+ years experience.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📋</span>
              </div>
              <h3 className="font-semibold text-[var(--aci-secondary)] mb-2">Production Code with SLAs</h3>
              <p className="text-gray-600 text-sm">
                We ship production-ready code with documented SLAs. No POCs that never go live.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📞</span>
              </div>
              <h3 className="font-semibold text-[var(--aci-secondary)] mb-2">We Answer the 2am Call</h3>
              <p className="text-gray-600 text-sm">
                When production breaks, we're there. Our teams provide ongoing support, not just delivery.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="font-semibold text-[var(--aci-secondary)] mb-2">Business Outcomes First</h3>
              <p className="text-gray-600 text-sm">
                We measure success by business impact, not lines of code or hours billed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[var(--aci-primary)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Let's Talk About Your Challenge
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Schedule a 30-minute architecture call with one of our senior consultants.
            No sales pitch—just an honest assessment of your needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button href="/contact?reason=architecture-call" variant="secondary" size="lg">
              Schedule Architecture Call
            </Button>
            <Button href="/case-studies" variant="ghost" size="lg" className="text-white border-white hover:bg-white/10">
              View Case Studies
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
