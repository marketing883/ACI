import { Metadata } from 'next';
import { ArrowRight, CheckCircle, ChevronDown, Shield, ShieldCheck, Eye, Lock, AlertTriangle, FileCheck, Server, Activity, Network } from 'lucide-react';
import Button from '@/components/ui/Button';
import { ServiceSchema, FAQSchema, BreadcrumbSchema } from '@/components/seo/StructuredData';

import { displayClient } from '@/lib/content/anonymize';
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://aciinfotech.com';

export const metadata: Metadata = {
  title: 'Cyber Security Services | ACI Infotech',
  description: 'Security built in, not bolted on. DevSecOps, observability, compliance. SOC 2, ISO 27001 compliant architectures from day one.',
  keywords: 'cyber security, DevSecOps, SOC 2, ISO 27001, security compliance, enterprise security',
  alternates: {
    canonical: `${siteUrl}/services/cyber-security`,
  },
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
    description: 'SOC 2, ISO 27001, HIPAA, PCI-DSS, we know the frameworks and how to implement them efficiently.',
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
    answer: 'We integrate with your existing stack. Most enterprises have multiple security tools, we help you rationalize, integrate, and get value from your investments.',
  },
  {
    question: 'Do you provide ongoing security support?',
    answer: 'Yes. We offer managed security services, 24/7 monitoring, and incident response. Security is not a one-time project.',
  },
  {
    question: 'Do you run NOC and SOC operations, or just set them up?',
    answer: "Both. Design, implement, operate. Our NOC runs on SolarWinds, Datadog, Dynatrace, and Genesys for infrastructure, application, network, and contact-center coverage. Our SOC runs on LogRhythm, Splunk, Microsoft Sentinel, and CrowdStrike for detection and response. Same engineers across both, same phone line, SLA-backed. No handoff to a separate managed services team that doesn't know your environment.",
  },
];

const managedOpsOutcomes = [
  '24/7 coverage with SLA-backed escalation paths',
  'Incident detection and response measured in minutes, not hours',
  'Runbooks written by the people who built the systems they operate',
];

const operationsPillars = [
  {
    id: 'noc',
    label: 'Network Operations',
    icon: Network,
    oneLiner: 'Uptime, performance, customer-facing systems. The business never finds out before you do.',
    tools: ['SolarWinds', 'Datadog', 'Dynatrace', 'Genesys'],
    outcomes: [
      'Infra, app, and network health monitored in one pane',
      'Contact center and telephony watched alongside the stack that feeds it',
      'Performance degradation caught and fixed before the ticket lands',
    ],
  },
  {
    id: 'soc',
    label: 'Security Operations',
    icon: ShieldCheck,
    oneLiner: "Threat detection, triage, response. The alerts that matter, without the ones that don't.",
    tools: ['LogRhythm', 'Splunk', 'Microsoft Sentinel', 'CrowdStrike'],
    outcomes: [
      'SIEM tuned to your environment, not out-of-the-box noise',
      'Incident response with documented escalation paths',
      'Audit-ready logs aligned to your compliance framework',
    ],
  },
];

export default function CyberSecurityPage() {
  return (
    <>
      {/* Structured Data for SEO/AEO */}
      <ServiceSchema
        name="Cyber Security Services"
        description="Security built in, not bolted on. DevSecOps, observability, compliance. SOC 2, ISO 27001 compliant architectures."
        url="/services/cyber-security"
        serviceType="Cybersecurity Consulting"
      />
      <FAQSchema faqs={faqs} />
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: '/' },
          { name: 'Services', url: '/services' },
          { name: 'Cyber Security', url: '/services/cyber-security' },
        ]}
      />

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
                ISO 27001 Certified | SOC 2 Compliant | 24/7 NOC and SOC | Dynatrace Partner
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

      {/* Managed Operations: NOC and SOC */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-[var(--aci-primary-light)] font-semibold text-sm uppercase tracking-wide">
                Managed Operations
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-[var(--aci-secondary)] mt-3 mb-4">
                We run what we build. NOC and SOC.
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                For enterprises that need eyes on the environment around the clock, we run
                both sides. Network Operations keeps the infrastructure, applications, and
                customer-facing systems up and performing. Security Operations watches for
                the things those systems weren&apos;t supposed to do. Same observability stack
                we designed for you, same engineers who built it, one phone to pick up
                when something goes wrong.
              </p>

              <ul className="space-y-3 mb-8">
                {managedOpsOutcomes.map((outcome) => (
                  <li key={outcome} className="flex items-start gap-3 text-gray-700">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>{outcome}</span>
                  </li>
                ))}
              </ul>

              <Button href="/contact?service=cyber-security" variant="primary" size="lg">
                Talk to a Security Architect <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>

            {/* Visual: 24/7 Operations Center */}
            <div className="relative hidden lg:block">
              <div className="bg-gradient-to-br from-[var(--aci-secondary)] to-gray-900 rounded-2xl p-8 shadow-2xl">
                <div className="flex items-center gap-3 mb-6">
                  <Activity className="w-6 h-6 text-[var(--aci-primary-light)]" />
                  <div className="text-sm text-gray-400">24/7 Operations Center</div>
                </div>
                <div className="space-y-4">
                  {/* Monitor layer */}
                  <div className="flex gap-2">
                    {['Infra', 'Apps', 'Network', 'Identity'].map((src) => (
                      <div key={src} className="flex-1 bg-gray-800 rounded-lg p-3 text-center text-xs text-gray-300">
                        {src}
                      </div>
                    ))}
                  </div>
                  <div className="text-center text-gray-500">↓</div>
                  {/* NOC + SOC split */}
                  <div className="bg-[var(--aci-primary)]/20 rounded-lg p-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="text-center">
                        <div className="text-[var(--aci-primary-light)] font-medium text-sm">NOC</div>
                        <div className="text-xs text-gray-400 mt-1 leading-relaxed">
                          SolarWinds · Datadog
                          <br />
                          Dynatrace · Genesys
                        </div>
                      </div>
                      <div className="text-center border-l border-white/10 pl-3">
                        <div className="text-[var(--aci-primary-light)] font-medium text-sm">SOC</div>
                        <div className="text-xs text-gray-400 mt-1 leading-relaxed">
                          LogRhythm · Splunk
                          <br />
                          Sentinel · CrowdStrike
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-center text-gray-500">↓</div>
                  {/* Response */}
                  <div className="bg-[var(--aci-primary)]/30 rounded-lg p-4 text-center">
                    <div className="text-white font-bold">Triage and Response</div>
                    <div className="text-xs text-gray-300 mt-1">24/7 on-call, SLA-backed escalation</div>
                  </div>
                  <div className="text-center text-gray-500">↓</div>
                  {/* Outcome */}
                  <div className="flex gap-2">
                    {['Contained', 'Resolved', 'Reported'].map((dest) => (
                      <div key={dest} className="flex-1 bg-green-900/30 rounded-lg p-3 text-center text-xs text-green-300">
                        {dest}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="absolute -inset-4 bg-[var(--aci-primary)]/10 rounded-3xl blur-3xl -z-10"></div>
            </div>
          </div>

          {/* NOC and SOC pillars */}
          <div className="grid md:grid-cols-2 gap-8 mt-16">
            {operationsPillars.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={pillar.id}
                  className="bg-gray-50 p-8 rounded-xl border border-gray-100"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <Icon className="w-8 h-8 text-[var(--aci-primary)]" />
                    <h3 className="text-xl font-semibold text-[var(--aci-secondary)]">
                      {pillar.label}
                    </h3>
                  </div>
                  <p className="text-gray-700 mb-6">{pillar.oneLiner}</p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {pillar.tools.map((tool) => (
                      <span
                        key={tool}
                        className="px-3 py-1 bg-white border border-gray-200 rounded-full text-sm text-gray-700 font-medium"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>

                  <ul className="space-y-2">
                    {pillar.outcomes.map((outcome) => (
                      <li
                        key={outcome}
                        className="flex items-start gap-2 text-sm text-gray-600"
                      >
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                        <span>{outcome}</span>
                      </li>
                    ))}
                  </ul>
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
                    <span className="text-xl font-bold text-white">{displayClient(study)}</span>
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

          <Button href="/contact?service=cyber-security" variant="lime" size="lg">
            Talk to a Security Architect
          </Button>
        </div>
      </section>
    </>
  );
}
