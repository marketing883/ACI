import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';
import {
  ArrowRight,
  Database,
  Brain,
  Cloud,
  Users,
  Shield,
  Zap,
  CheckCircle2,
  Code2,
  UserCheck,
  ShieldCheck,
  Headphones,
  Target,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import { BreadcrumbSchema } from '@/components/seo/StructuredData';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://aciinfotech.com';

export const metadata: Metadata = {
  title: 'Enterprise Technology Services',
  description: 'Data Engineering, AI/ML, Cloud Modernization, MarTech, Digital Transformation, and Cyber Security services for Fortune 500 companies.',
  alternates: {
    canonical: `${siteUrl}/services`,
  },
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
    description: 'From predictive models to generative AI, we build AI systems that deliver measurable business outcomes, not PowerPoint demos.',
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
    description: 'End-to-end digital transformation that modernizes processes, systems, and capabilities, delivered with the rigor of enterprise engineering.',
    capabilities: ['Process Automation', 'System Integration', 'ERP Modernization', 'Digital Strategy'],
    technologies: ['SAP', 'ServiceNow', 'MuleSoft', 'Power Platform', 'Workato'],
    href: '/services/digital-transformation',
  },
  {
    id: 'app-development',
    icon: Code2,
    title: 'App Development',
    tagline: 'Applications Built to Survive Production',
    description: 'Enterprise application engineering that sits on top of your data and AI delivery. Custom, web, and AI-powered applications built with the rigor of production infrastructure, not agency output.',
    capabilities: ['Enterprise Application Development', 'AI-Powered Applications', 'API & Integration', 'Legacy Modernization'],
    technologies: ['Next.js', 'React', 'Node.js', 'Python', 'TypeScript', 'GraphQL'],
    href: '/services/app-development',
    image: '/images/app-development.jpg',
  },
  {
    id: 'qa-testing',
    icon: CheckCircle2,
    title: 'QA & Testing',
    tagline: 'Ship Fast. Break Nothing.',
    description: 'Production engineering discipline, not a standalone testing service. Automated frameworks, CI/CD-integrated QA, AI-driven test coverage, and performance and security testing as part of engineering delivery.',
    capabilities: ['Automated Test Frameworks', 'CI/CD Integrated QA', 'AI-Driven Test Coverage', 'Performance & Security Testing'],
    technologies: ['Playwright', 'Cypress', 'Selenium', 'JMeter', 'SonarQube', 'GitHub Actions'],
    href: '/services/qa-testing',
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
      {/* Structured Data for SEO */}
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: '/' },
          { name: 'Services', url: '/services' },
        ]}
      />

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
                    {service.image ? (
                      <div className="relative w-full aspect-[4/3] overflow-hidden rounded-2xl">
                        <Image
                          src={service.image}
                          alt={service.title}
                          fill
                          sizes="(min-width: 1024px) 560px, 100vw"
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="bg-gradient-to-br from-[var(--aci-primary)] to-[var(--aci-secondary)] rounded-2xl aspect-[4/3] flex items-center justify-center">
                        <Icon className="w-24 h-24 text-white/30" />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Managed & Operational Services */}
      <section className="py-20 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <p className="text-xs uppercase tracking-[0.18em] text-[var(--aci-primary)] font-semibold">
              Operational delivery
            </p>
            <h2 className="mt-2 text-2xl md:text-3xl font-bold text-[var(--aci-secondary)]">
              Managed &amp; Operational Services
            </h2>
            <p className="mt-3 text-gray-600 max-w-3xl">
              Behind every transformation is the team that keeps it running. These are the managed engagements that protect what we build and what you already operate.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
            <div>
              <h3 className="font-semibold text-[var(--aci-secondary)] text-lg">
                Managed IT &amp; Infrastructure
              </h3>
              <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                End-to-end infrastructure management for enterprises running hybrid and cloud environments. Monitoring, operations, and SLA-backed support, built around what you are actually running.
              </p>
              <Link
                href="/contact?service=managed-infrastructure&source=services-managed"
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--aci-primary)] hover:text-[var(--aci-secondary)] transition-colors"
              >
                Talk to us
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div>
              <h3 className="font-semibold text-[var(--aci-secondary)] text-lg">
                NOC &amp; SOC Operations
              </h3>
              <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                24/7 network and security operations backed by the same observability stack we deploy. Proactive monitoring, incident response, and documented escalation paths.
              </p>
              <Link
                href="/services/cyber-security?source=services-managed-noc-soc"
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--aci-primary)] hover:text-[var(--aci-secondary)] transition-colors"
              >
                See our Security practice
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div>
              <h3 className="font-semibold text-[var(--aci-secondary)] text-lg">
                IT Support Services
              </h3>
              <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                Structured support across L1, L2, and L3, aligned to your operations, not a generic helpdesk model. Delivered as part of a managed engagement, not standalone staffing.
              </p>
              <Link
                href="/contact?service=it-support&source=services-managed"
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--aci-primary)] hover:text-[var(--aci-secondary)] transition-colors"
              >
                Talk to us
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div>
              <h3 className="font-semibold text-[var(--aci-secondary)] text-lg">
                Application Managed Services
              </h3>
              <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                Post-deployment operations for the applications and integrations we build. SLA-backed support, release management, and continuous improvement to keep production healthy.
              </p>
              <Link
                href="/contact?service=application-managed-services&source=services-managed"
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--aci-primary)] hover:text-[var(--aci-secondary)] transition-colors"
              >
                Talk to us
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
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
              <div className="w-16 h-16 bg-[var(--aci-primary)]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <UserCheck className="w-7 h-7 text-[var(--aci-primary)]" strokeWidth={1.5} />
              </div>
              <h3 className="font-semibold text-[var(--aci-secondary)] mb-2">Senior Architects Only</h3>
              <p className="text-gray-600 text-sm">
                No junior consultants learning on your dime. Every team member has 10+ years experience.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[var(--aci-primary)]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <ShieldCheck className="w-7 h-7 text-[var(--aci-primary)]" strokeWidth={1.5} />
              </div>
              <h3 className="font-semibold text-[var(--aci-secondary)] mb-2">Production Code with SLAs</h3>
              <p className="text-gray-600 text-sm">
                We ship production-ready code with documented SLAs. No POCs that never go live.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[var(--aci-primary)]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Headphones className="w-7 h-7 text-[var(--aci-primary)]" strokeWidth={1.5} />
              </div>
              <h3 className="font-semibold text-[var(--aci-secondary)] mb-2">We Answer the 2am Call</h3>
              <p className="text-gray-600 text-sm">
                When production breaks, we're there. Our teams provide ongoing support, not just delivery.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[var(--aci-primary)]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Target className="w-7 h-7 text-[var(--aci-primary)]" strokeWidth={1.5} />
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
            No sales pitch, just an honest assessment of your needs.
          </p>
          <Button href="/contact?reason=architecture-call" variant="lime" size="lg">
            Schedule Architecture Call
          </Button>
        </div>
      </section>
    </main>
  );
}
