import { Metadata } from 'next';
import { ArrowRight, CheckCircle, ChevronDown, Cloud, Server, RefreshCw, Lock, Gauge, Container } from 'lucide-react';
import Button from '@/components/ui/Button';
import { ServiceSchema, FAQSchema, BreadcrumbSchema } from '@/components/seo/StructuredData';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://aciinfotech.com';

export const metadata: Metadata = {
  title: 'Cloud Modernization Services | ACI Infotech',
  description: 'AWS, Azure, GCP migrations and cloud modernization. Refactor, replatform, or rearchitect with proven playbooks. 200+ cloud migrations, zero downtime deployments.',
  keywords: 'cloud modernization, AWS migration, Azure migration, cloud consulting, kubernetes, multi-cloud',
  alternates: {
    canonical: `${siteUrl}/services/cloud-modernization`,
  },
};

const keyOutcomes = [
  'On-time, on-budget cloud migrations with zero downtime',
  'Multi-cloud architectures without vendor lock-in',
  '30-50% infrastructure cost reduction',
  'Security and compliance built in from day one',
];

const offerings = [
  {
    id: 'cloud-migration',
    title: 'Cloud Migration',
    description: 'Lift and shift, replatform, or refactor, we migrate your workloads to AWS, Azure, or GCP with zero downtime.',
    icon: Cloud,
    technologies: ['AWS', 'Azure', 'GCP', 'VMware Cloud'],
    outcomes: ['Zero-downtime migration', '30-50% cost reduction', 'Legacy decommissioning'],
  },
  {
    id: 'application-modernization',
    title: 'Application Modernization',
    description: 'Refactor monoliths to microservices, containerize legacy applications, and enable CI/CD pipelines.',
    icon: RefreshCw,
    technologies: ['Kubernetes', 'Docker', 'Terraform', 'GitOps'],
    outcomes: ['10x faster deployments', 'Improved scalability', 'Reduced tech debt'],
  },
  {
    id: 'kubernetes-platform',
    title: 'Kubernetes Platform Engineering',
    description: 'Enterprise-grade Kubernetes platforms with service mesh, observability, and security.',
    icon: Container,
    technologies: ['EKS', 'AKS', 'GKE', 'OpenShift', 'Istio'],
    outcomes: ['Self-service developer platform', 'Automated scaling', 'Multi-cluster management'],
  },
  {
    id: 'infrastructure-as-code',
    title: 'Infrastructure as Code',
    description: 'Terraform, Pulumi, and CloudFormation for reproducible, version-controlled infrastructure.',
    icon: Server,
    technologies: ['Terraform', 'Pulumi', 'CloudFormation', 'Ansible'],
    outcomes: ['Reproducible environments', 'Automated provisioning', 'Drift detection'],
  },
  {
    id: 'cloud-security',
    title: 'Cloud Security & Compliance',
    description: 'Security posture management, compliance automation, and zero-trust architectures.',
    icon: Lock,
    technologies: ['AWS Security Hub', 'Azure Security Center', 'CIS Benchmarks'],
    outcomes: ['Audit-ready compliance', 'Automated security scanning', 'Zero-trust architecture'],
  },
  {
    id: 'cloud-cost-optimization',
    title: 'Cloud Cost Optimization',
    description: 'FinOps practices to reduce cloud spend without sacrificing performance.',
    icon: Gauge,
    technologies: ['AWS Cost Explorer', 'Azure Cost Management', 'Spot Instances'],
    outcomes: ['30-50% cost savings', 'Right-sizing recommendations', 'Reserved instance strategy'],
  },
];

const caseStudies = [
  {
    slug: 'insurance-cloud-migration',
    client: 'Fortune 500 Insurer',
    industry: 'Insurance',
    challenge: 'Legacy data center costing $20M annually with aging hardware',
    results: [
      { metric: '$8M', description: 'Annual savings' },
      { metric: 'Zero', description: 'Downtime during migration' },
      { metric: '18 months', description: 'Data center exit' },
    ],
    technologies: ['AWS', 'Terraform', 'Kubernetes'],
  },
  {
    slug: 'retail-modernization',
    client: 'National Retailer',
    industry: 'Retail',
    challenge: 'Monolithic e-commerce platform unable to handle peak traffic',
    results: [
      { metric: '10x', description: 'Improved scalability' },
      { metric: '99.99%', description: 'Uptime achieved' },
      { metric: '5x', description: 'Faster deployment cycles' },
    ],
    technologies: ['Azure', 'Kubernetes', 'Microservices'],
  },
  {
    slug: 'manufacturing-multicloud',
    client: 'Global Manufacturer',
    industry: 'Manufacturing',
    challenge: 'Locked into single cloud vendor with no disaster recovery',
    results: [
      { metric: 'Multi-cloud', description: 'Architecture deployed' },
      { metric: 'Active-active', description: 'Disaster recovery' },
      { metric: '40%', description: 'Cost reduction' },
    ],
    technologies: ['AWS', 'Azure', 'Terraform', 'Consul'],
  },
];

const differentiators = [
  {
    title: 'Multi-Cloud Expertise',
    description: "We're certified on AWS, Azure, and GCP. We design for your needs, not our partnership bonuses.",
    proof: 'Partners with all major clouds',
  },
  {
    title: 'Zero-Downtime Migrations',
    description: '200+ migrations without production disruption. We know how to migrate while you run.',
    proof: 'Zero failed migrations',
  },
  {
    title: 'Security-First Approach',
    description: 'Every architecture includes security controls, compliance automation, and audit trails.',
    proof: 'SOC 2 compliant architectures',
  },
  {
    title: 'Cost Optimization Built In',
    description: "FinOps practices from day one. We optimize your cloud spend, not maximize it.",
    proof: '30-50% average cost reduction',
  },
];

const faqs = [
  {
    question: 'How long does a cloud migration take?',
    answer: '6-18 months depending on complexity. Simple lift-and-shift can be faster. Full application modernization takes longer. We can show you a detailed timeline after discovery.',
  },
  {
    question: 'Which cloud should we choose?',
    answer: "It depends on your existing investments, workload requirements, and regulatory needs. We're platform-agnostic and will recommend what's best for your specific situation.",
  },
  {
    question: 'How do you handle security during migration?',
    answer: 'Security is built in, not bolted on. We implement identity management, encryption, network segmentation, and compliance controls before any data moves.',
  },
  {
    question: 'What about vendor lock-in?',
    answer: 'We design for portability where it matters. Container-based workloads, infrastructure as code, and open standards help you avoid lock-in while still leveraging cloud-native services.',
  },
];

export default function CloudModernizationPage() {
  return (
    <>
      {/* Structured Data for SEO/AEO */}
      <ServiceSchema
        name="Cloud Modernization Services"
        description="AWS, Azure, GCP migrations and cloud modernization. Refactor, replatform, or rearchitect with proven playbooks."
        url="/services/cloud-modernization"
        serviceType="Cloud Computing Consulting"
      />
      <FAQSchema faqs={faqs} />
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: '/' },
          { name: 'Services', url: '/services' },
          { name: 'Cloud Modernization', url: '/services/cloud-modernization' },
        ]}
      />

      {/* Hero Section */}
      <section className="py-20 lg:py-28 bg-gradient-to-br from-[var(--aci-secondary)] to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-[var(--aci-primary-light)] font-semibold text-sm uppercase tracking-wide">
                Cloud Modernization
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-white mt-3 mb-6">
                Multi-Cloud Without the Chaos
              </h1>
              <p className="text-lg text-gray-300 mb-8">
                AWS, Azure, GCP migrations. Refactor, replatform, or rearchitect. Proven playbooks that reduce risk.
                200+ cloud migrations with zero downtime. We build for your needs, not our partnership bonuses.
              </p>

              <ul className="space-y-3 mb-8">
                {keyOutcomes.map((outcome) => (
                  <li key={outcome} className="flex items-center gap-3 text-gray-300">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                    {outcome}
                  </li>
                ))}
              </ul>

              <p className="text-sm text-[var(--aci-primary-light)] mb-8">
                200+ cloud migrations | Zero failed deployments
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button href="/contact?service=cloud-modernization" variant="primary" size="lg">
                  Talk to a Cloud Architect
                </Button>
                <Button
                  href="/case-studies?service=cloud-modernization"
                  variant="ghost"
                  size="lg"
                  className="text-white border-white hover:bg-white/10"
                >
                  See Cloud Projects
                </Button>
              </div>
            </div>

            {/* Visual */}
            <div className="relative hidden lg:block">
              <div className="bg-gray-800 rounded-2xl p-8 shadow-2xl">
                <div className="text-sm text-gray-400 mb-4">Multi-Cloud Architecture</div>
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-orange-900/30 rounded-lg p-3 text-center text-xs text-orange-300">AWS</div>
                    <div className="bg-blue-900/30 rounded-lg p-3 text-center text-xs text-blue-300">Azure</div>
                    <div className="bg-red-900/30 rounded-lg p-3 text-center text-xs text-red-300">GCP</div>
                  </div>
                  <div className="text-center text-gray-500">↓</div>
                  <div className="bg-[var(--aci-primary)]/30 rounded-lg p-4 text-center">
                    <div className="text-white font-bold">Kubernetes Platform</div>
                    <div className="text-xs text-gray-300 mt-1">Container Orchestration • Service Mesh</div>
                  </div>
                  <div className="text-center text-gray-500">↓</div>
                  <div className="bg-green-900/30 rounded-lg p-4 text-center">
                    <div className="text-green-300 font-medium">Applications</div>
                    <div className="text-xs text-gray-400 mt-1">Microservices • Serverless • APIs</div>
                  </div>
                </div>
              </div>
              <div className="absolute -inset-4 bg-blue-500/10 rounded-3xl blur-3xl -z-10"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Service Offerings */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--aci-secondary)] mb-4">Cloud Modernization Services</h2>
            <p className="text-lg text-gray-600">From migration to optimization, we handle the full journey</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {offerings.map((offering) => {
              const Icon = offering.icon;
              return (
                <div key={offering.id} className="bg-white p-8 rounded-xl shadow-sm hover:shadow-lg transition-shadow">
                  <Icon className="w-10 h-10 text-[var(--aci-primary)] mb-4" />
                  <h3 className="text-xl font-semibold text-[var(--aci-secondary)] mb-3">{offering.title}</h3>
                  <p className="text-gray-600 mb-6">{offering.description}</p>
                  <div className="mb-4">
                    <div className="text-sm font-medium text-gray-500 mb-2">Key Outcomes</div>
                    <ul className="space-y-1">
                      {offering.outcomes.map((outcome) => (
                        <li key={outcome} className="flex items-center gap-2 text-sm text-gray-600">
                          <CheckCircle className="w-3 h-3 text-green-500" />
                          {outcome}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {offering.technologies.slice(0, 4).map((tech) => (
                      <span key={tech} className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-600">{tech}</span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Case Studies */}
      <section className="py-20 bg-[var(--aci-secondary)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Cloud Projects We've Built</h2>
            <p className="text-lg text-gray-400">Real migrations. Real transformations. Real outcomes.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {caseStudies.map((study) => (
              <div key={study.slug} className="bg-gray-800 rounded-xl overflow-hidden hover:bg-gray-700 transition-colors">
                <div className="p-6 border-b border-gray-700">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xl font-bold text-white">{study.client}</span>
                    <span className="text-sm text-gray-400">{study.industry}</span>
                  </div>
                  <p className="text-gray-300 text-sm">{study.challenge}</p>
                </div>
                <div className="p-6">
                  <div className="space-y-3 mb-6">
                    {study.results.map((result, idx) => (
                      <div key={idx} className="flex items-baseline gap-3">
                        <span className="text-2xl font-bold text-[var(--aci-primary-light)]">{result.metric}</span>
                        <span className="text-sm text-gray-400">{result.description}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {study.technologies.map((tech) => (
                      <span key={tech} className="px-2 py-1 bg-gray-700 rounded text-xs text-gray-300">{tech}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button href="/case-studies?service=cloud-modernization" variant="secondary" size="lg">
              See All Cloud Case Studies <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Why Choose ACI */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--aci-secondary)] mb-4">Why Choose ACI for Cloud</h2>
            <p className="text-lg text-gray-600">What makes us different</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {differentiators.map((diff) => (
              <div key={diff.title} className="bg-white p-8 rounded-xl shadow-sm">
                <h3 className="text-xl font-semibold text-[var(--aci-secondary)] mb-3">{diff.title}</h3>
                <p className="text-gray-600 mb-4">{diff.description}</p>
                <div className="flex items-center gap-2 text-sm text-[var(--aci-primary)]">
                  <CheckCircle className="w-4 h-4" />
                  {diff.proof}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--aci-secondary)] mb-4">Common Questions About Cloud</h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq) => (
              <details key={faq.question} className="group bg-gray-50 rounded-xl">
                <summary className="flex items-center justify-between cursor-pointer p-6 text-lg font-medium text-[var(--aci-secondary)]">
                  {faq.question}
                  <ChevronDown className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform" />
                </summary>
                <div className="px-6 pb-6 text-gray-600">{faq.answer}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-[var(--aci-primary)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Modernize Your Cloud?</h2>
          <p className="text-lg text-blue-100 mb-8">
            Talk to a cloud architect about your specific challenge. No sales pitch, just an engineering conversation.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button href="/contact?service=cloud-modernization" variant="secondary" size="lg">Talk to a Cloud Architect</Button>
            <Button href="/case-studies?service=cloud-modernization" variant="ghost" size="lg" className="text-white border-white hover:bg-white/10">
              See Cloud Case Studies
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
