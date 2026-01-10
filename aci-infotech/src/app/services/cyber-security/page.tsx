import { Metadata } from 'next';
import { ArrowRight, CheckCircle, ChevronDown, Shield, Eye, Lock, AlertTriangle, FileCheck, Server } from 'lucide-react';
import Button from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'Cyber Security Services | ACI Infotech',
  description: 'Security built in, not bolted on. DevSecOps, observability, compliance. SOC 2, ISO 27001 compliant architectures from day one.',
  keywords: 'cyber security, DevSecOps, SOC 2, ISO 27001, security compliance, enterprise security',
};

const keyOutcomes = [
  'Security built in from day one, not bolted on later',
  'SOC 2, ISO 27001, HIPAA compliant architectures',
  'Reduced security incidents with proactive monitoring',
  'Audit-ready documentation and controls',
];

const offerings = [
  {
    id: 'devsecops',
    title: 'DevSecOps Implementation',
    description: 'Security integrated into CI/CD pipelines. Automated scanning, vulnerability detection, and secure deployments.',
    icon: Shield,
    technologies: ['Snyk', 'SonarQube', 'Checkmarx', 'GitLab Security'],
    outcomes: ['Shift-left security', 'Automated vulnerability scanning', 'Secure by default'],
  },
  {
    id: 'security-observability',
    title: 'Security Observability',
    description: 'Real-time threat detection, SIEM integration, and incident response with Dynatrace and Splunk.',
    icon: Eye,
    technologies: ['Dynatrace', 'Splunk', 'CrowdStrike', 'Microsoft Sentinel'],
    outcomes: ['Real-time threat detection', 'Automated alerting', 'Incident response'],
  },
  {
    id: 'identity-access',
    title: 'Identity & Access Management',
    description: 'Zero-trust architecture, SSO, MFA, and privileged access management.',
    icon: Lock,
    technologies: ['Okta', 'Azure AD', 'CyberArk', 'Ping Identity'],
    outcomes: ['Zero-trust architecture', 'Centralized identity', 'Reduced attack surface'],
  },
  {
    id: 'compliance',
    title: 'Compliance & Audit',
    description: 'SOC 2, ISO 27001, HIPAA, PCI-DSS compliance frameworks and audit preparation.',
    icon: FileCheck,
    technologies: ['Compliance Frameworks', 'GRC Platforms', 'Audit Tools'],
    outcomes: ['Audit-ready documentation', 'Continuous compliance', 'Risk management'],
  },
  {
    id: 'vulnerability-mgmt',
    title: 'Vulnerability Management',
    description: 'Continuous vulnerability scanning, penetration testing, and remediation tracking.',
    icon: AlertTriangle,
    technologies: ['Qualys', 'Tenable', 'Burp Suite', 'OWASP Tools'],
    outcomes: ['Reduced vulnerabilities', 'Prioritized remediation', 'Risk-based approach'],
  },
  {
    id: 'cloud-security',
    title: 'Cloud Security Posture',
    description: 'CSPM, workload protection, and cloud-native security for AWS, Azure, and GCP.',
    icon: Server,
    technologies: ['AWS Security Hub', 'Azure Security Center', 'Prisma Cloud'],
    outcomes: ['Cloud visibility', 'Automated compliance', 'Misconfiguration detection'],
  },
];

const caseStudies = [
  {
    slug: 'healthcare-compliance',
    client: 'Healthcare Provider',
    industry: 'Healthcare',
    challenge: 'HIPAA compliance gaps identified in security audit',
    results: [
      { metric: '100%', description: 'Compliance achieved' },
      { metric: '60%', description: 'Reduction in vulnerabilities' },
      { metric: 'Zero', description: 'Audit findings' },
    ],
    technologies: ['Azure Security', 'CyberArk', 'Splunk'],
  },
  {
    slug: 'financial-devsecops',
    client: 'Financial Services',
    industry: 'Financial',
    challenge: 'Security slowing down release cycles, developers bypassing controls',
    results: [
      { metric: '70%', description: 'Faster secure releases' },
      { metric: '90%', description: 'Automated security checks' },
      { metric: '0', description: 'Security bypasses' },
    ],
    technologies: ['Snyk', 'GitLab', 'SonarQube'],
  },
  {
    slug: 'retail-zerotrust',
    client: 'National Retailer',
    industry: 'Retail',
    challenge: 'Breach concerns with remote workforce and third-party access',
    results: [
      { metric: 'Zero-trust', description: 'Architecture deployed' },
      { metric: '80%', description: 'Reduction in attack surface' },
      { metric: 'MFA', description: 'Everywhere' },
    ],
    technologies: ['Okta', 'CrowdStrike', 'Zscaler'],
  },
];

const differentiators = [
  {
    title: 'Security by Design',
    description: "We build security in from day one, not as an afterthought. Every architecture we design is secure by default.",
    proof: 'ISO 27001 certified ourselves',
  },
  {
    title: 'DevSecOps Native',
    description: 'Security that enables speed, not slows it down. Automated scanning integrated into your CI/CD.',
    proof: 'Shift-left security approach',
  },
  {
    title: 'Compliance Expertise',
    description: 'SOC 2, ISO 27001, HIPAA, PCI-DSS—we know the frameworks and how to implement them efficiently.',
    proof: 'Multiple compliance certifications',
  },
  {
    title: 'Observability Partnership',
    description: 'Dynatrace partnership means deep integration between security and observability.',
    proof: 'Dynatrace Partner',
  },
];

const faqs = [
  {
    question: 'How do you balance security with development speed?',
    answer: 'By integrating security into CI/CD pipelines. Automated scanning catches issues early when they are cheap to fix. Developers get fast feedback without waiting for security review.',
  },
  {
    question: 'How long does SOC 2 compliance take?',
    answer: '6-12 months for initial certification depending on your starting point. We help you implement controls, document policies, and prepare for audit.',
  },
  {
    question: 'What about existing security tools?',
    answer: 'We integrate with your existing stack. Most enterprises have multiple security tools—we help you rationalize, integrate, and get value from your investments.',
  },
  {
    question: 'Do you provide ongoing security support?',
    answer: 'Yes. We offer managed security services, 24/7 monitoring, and incident response. Security is not a one-time project.',
  },
];

export default function CyberSecurityPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="py-20 lg:py-28 bg-gradient-to-br from-[var(--aci-secondary)] to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-[var(--aci-primary-light)] font-semibold text-sm uppercase tracking-wide">
                Cyber Security
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-white mt-3 mb-6">
                Security Built In, Not Bolted On
              </h1>
              <p className="text-lg text-gray-300 mb-8">
                DevSecOps, observability, compliance. SOC 2, ISO 27001 compliant architectures from day one.
                We build security into every system, so you're audit-ready and protected.
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
                ISO 27001 Certified | SOC 2 Compliant | Dynatrace Security Partner
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button href="/contact?service=cyber-security" variant="primary" size="lg">
                  Talk to a Security Architect
                </Button>
                <Button
                  href="/case-studies?service=cyber-security"
                  variant="ghost"
                  size="lg"
                  className="text-white border-white hover:bg-white/10"
                >
                  See Security Projects
                </Button>
              </div>
            </div>

            {/* Visual */}
            <div className="relative hidden lg:block">
              <div className="bg-gray-800 rounded-2xl p-8 shadow-2xl">
                <div className="text-sm text-gray-400 mb-4">Security Architecture</div>
                <div className="space-y-4">
                  <div className="bg-red-900/30 rounded-lg p-4 text-center">
                    <div className="text-red-300 font-medium">Threats & Attacks</div>
                  </div>
                  <div className="text-center text-gray-500">↓</div>
                  <div className="bg-[var(--aci-primary)]/30 rounded-lg p-4 text-center">
                    <div className="text-white font-bold">Security Controls</div>
                    <div className="text-xs text-gray-300 mt-1">DevSecOps • IAM • Zero Trust</div>
                  </div>
                  <div className="text-center text-gray-500">↓</div>
                  <div className="bg-yellow-900/30 rounded-lg p-4 text-center">
                    <div className="text-yellow-300 font-medium">Observability & SIEM</div>
                    <div className="text-xs text-gray-400 mt-1">Detection • Response • Audit</div>
                  </div>
                  <div className="text-center text-gray-500">↓</div>
                  <div className="bg-green-900/30 rounded-lg p-4 text-center">
                    <div className="text-green-300 font-medium">Protected Enterprise</div>
                  </div>
                </div>
              </div>
              <div className="absolute -inset-4 bg-red-500/10 rounded-3xl blur-3xl -z-10"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Service Offerings */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--aci-secondary)] mb-4">Cyber Security Services</h2>
            <p className="text-lg text-gray-600">Comprehensive security from code to cloud</p>
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
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Security Projects We've Built</h2>
            <p className="text-lg text-gray-400">Real security transformations. Real outcomes.</p>
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
            <Button href="/case-studies?service=cyber-security" variant="secondary" size="lg">
              See All Security Case Studies <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Why Choose ACI */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--aci-secondary)] mb-4">Why Choose ACI for Security</h2>
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
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--aci-secondary)] mb-4">Common Questions About Security</h2>
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
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Secure Your Enterprise?</h2>
          <p className="text-lg text-blue-100 mb-8">
            Talk to a security architect about your compliance and security challenges.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button href="/contact?service=cyber-security" variant="secondary" size="lg">Talk to a Security Architect</Button>
            <Button href="/case-studies?service=cyber-security" variant="ghost" size="lg" className="text-white border-white hover:bg-white/10">
              See Security Case Studies
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
