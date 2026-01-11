import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Linkedin, CheckCircle } from 'lucide-react';
import Button from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'About ACI Infotech | The Engineers Behind Enterprise Modernization',
  description: '1,250+ engineers building data platforms, AI systems, and cloud architectures for 80+ Fortune 500 clients. 19 years of production-grade engineering. We answer the 2am call.',
  keywords: 'enterprise technology consulting, data engineering company, AI ML consulting, Fortune 500 technology partner, production-grade engineering',
};

// About page data
const stats = [
  { number: '19', unit: 'Years', description: 'Founded 2006' },
  { number: '80+', unit: 'Fortune 500', description: 'Clients served' },
  { number: '$650M+', unit: 'Value', description: 'Delivered to clients' },
  { number: '1,250+', unit: 'Engineers', description: 'Technologists globally' },
  { number: '10', unit: 'Countries', description: 'Global delivery' },
];

const principles = [
  {
    number: '01',
    title: 'Outcome-Engineered',
    description: 'Every engagement starts with baseline metrics and ends with audited results. We align on KPIs for time to value, cost to serve, and reliability.',
    proofPoints: [
      'Measurable KPIs defined upfront',
      'Executive dashboards for visibility',
      'Value realized at close, documented',
    ],
  },
  {
    number: '02',
    title: 'Governed by Design',
    description: 'Security, compliance, and lineage are built into data, models, and workflows. Policies as code. Full observability. Audit-ready by default.',
    proofPoints: [
      'Policy guardrails automated',
      'Data quality gates at every stage',
      'End-to-end lineage tracking',
      'SOC-friendly audit logs',
    ],
  },
  {
    number: '03',
    title: 'Built for Scale',
    description: 'Cross-functional pods that ship fast and stand behind SLAs. Product, data, apps, QA, and SRE work as one unit.',
    proofPoints: [
      'Faster release cycles',
      'Lower MTTR',
      'SLA-backed operations',
      'Production support included',
    ],
  },
];

const capabilities = [
  {
    title: 'Data Resilience',
    description: 'Unify your data estate and make it AI-ready with platform-native observability, lineage, and policy controls.',
    outcomes: ['Executive-grade dashboards', 'Real-time decisioning', 'Compliant analytics', 'High-trust data products'],
    technologies: ['Databricks', 'Snowflake', 'AWS Glue', 'Azure Data Factory', 'dbt', 'Dynatrace'],
  },
  {
    title: 'Observability & Platform Reliability',
    description: 'Instrument apps, data pipelines, and infrastructure end to end. Set SLOs, trace latency across the stack.',
    outcomes: ['Fewer Sev1 incidents', 'Faster MTTR', 'Release stability', 'Performance SLOs met'],
    technologies: ['Dynatrace', 'Datadog', 'Prometheus', 'Grafana', 'PagerDuty'],
  },
  {
    title: 'MarTech & CDP',
    description: 'Modern growth runs on composable CDP stacks and signal-rich journeys.',
    outcomes: ['1:1 personalization', 'Loyalty intelligence', 'Media ROI measurement', 'Privacy-safe activation'],
    technologies: ['Salesforce Marketing Cloud', 'Adobe Experience Platform', 'Braze', 'Segment'],
  },
  {
    title: 'Intelligent Automation',
    description: 'Move from scattered bots to intelligent process automation that spans systems and teams.',
    outcomes: ['Straight-through processing', 'Faster close cycles', 'Measurable cost reduction', 'Human-in-the-loop where needed'],
    technologies: ['ServiceNow', 'UiPath', 'Automation Anywhere', 'Power Automate'],
  },
];

const teamMembers = [
  {
    name: 'Jag Kanumuri',
    title: 'Founder & CEO',
    bio: 'At ACI Infotech, our purpose is to drive enterprise excellence through innovation and intelligence. We partner with organizations to help them reimagine their business models, modernize operations, and unlock value through technology.',
    photo_url: '/images/team/jag-kanumuri.jpg',
    linkedin_url: 'https://linkedin.com/in/jagkanumuri',
  },
  {
    name: 'Habib Mehmoodi',
    title: 'VP Strategy & Innovation',
    bio: 'Drives strategic initiatives and innovation programs across the enterprise portfolio.',
    photo_url: '/images/team/habib-mehmoodi.jpg',
  },
  {
    name: 'Narayanan Nanjan',
    title: 'VP Head of Delivery',
    bio: 'Leads delivery operations ensuring Fortune 500 projects meet timelines, budgets, and SLAs.',
    photo_url: '/images/team/narayanan-nanjan.jpg',
  },
];

const certifications = [
  { name: 'Great Place to Work', description: 'Certified 2024-25', logo_url: '/images/certifications/gptw.png' },
  { name: 'ISO 27001:2022', description: 'Information Security Certified', logo_url: '/images/certifications/iso27001.png' },
  { name: 'CMMi Level 3', description: 'Process Maturity Certified', logo_url: '/images/certifications/cmmi.png' },
  { name: 'SOC 2 Type II', description: 'Security & Privacy Controls', logo_url: '/images/certifications/soc2.png' },
];

const trackRecord = [
  { number: '$650M+', label: 'Total value delivered to clients', context: 'Measurable ROI, not estimated' },
  { number: '80+', label: 'Fortune 500 clients served', context: 'Across banking, healthcare, retail, manufacturing' },
  { number: '19 Years', label: 'In business since 2006', context: 'Stable, growing, here for the long term' },
  { number: '1,250+', label: 'Technologists globally', context: 'Engineers, architects, data scientists' },
  { number: '10 Countries', label: 'Global delivery centers', context: 'US, India, and beyond' },
  { number: '85%+', label: 'Client retention rate', context: 'Clients come back because we deliver' },
  { number: '70%', label: 'Senior engineers (10+ years)', context: 'Not junior analysts learning on your dime' },
  { number: '6-12 Months', label: 'Average project timeline', context: 'Enterprise scale, realistic timelines' },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="py-20 lg:py-28 bg-gradient-to-br from-[var(--aci-secondary)] to-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              The Engineers Behind Enterprise Modernization
            </h1>
            <p className="text-lg md:text-xl text-gray-300">
              We're the 1,250-person technical team between your strategy and your operations.
              We build data platforms, deploy AI systems, and stabilize cloud architectures—then
              we stand behind them with SLAs. We're the team that answers the 2am call.
            </p>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 md:gap-8">
            {stats.map((stat) => (
              <div key={stat.unit} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-[var(--aci-primary-light)]">
                  {stat.number}
                </div>
                <div className="text-sm font-semibold text-white">{stat.unit}</div>
                <div className="text-xs text-gray-400">{stat.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who We Are Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-[var(--aci-secondary)] mb-6">
                Built for Enterprise Scale, Moves Like a Startup
              </h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  ACI Infotech isn't trying to be the next Accenture. We're the alternative—large
                  enough to staff Fortune 500 projects, small enough to make decisions in days not
                  months, and focused enough to deliver deep expertise in the platforms enterprises
                  actually use.
                </p>
                <p>
                  Founded in 2006, we've spent 19 years building one thing: production-grade
                  enterprise systems. Not strategy. Not advisory. Not staff augmentation. We ship
                  code that runs in production, carries SLAs, and delivers measurable ROI.
                </p>
                <p>
                  Our clients are Fortune 500 companies in banking, healthcare, retail, manufacturing,
                  and hospitality. They choose us because we combine Big 4 capabilities with boutique
                  speed and cost. Senior architects lead every project. We move fast. We cost 40-60% less.
                </p>
                <p className="font-semibold text-[var(--aci-secondary)]">
                  When your system goes down at 2am, we're the team that answers the phone.
                  That's the difference between consultants who leave and engineers who stay.
                </p>
              </div>
            </div>
            <div className="relative h-80 lg:h-96 bg-gray-100 rounded-xl overflow-hidden">
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[var(--aci-primary)] to-[var(--aci-primary-dark)]">
                <span className="text-white text-6xl font-bold opacity-20">ACI</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How We Work Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--aci-secondary)] mb-4">
              How We Work
            </h2>
            <p className="text-lg text-gray-600">
              Three principles that define every engagement
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {principles.map((principle) => (
              <div
                key={principle.number}
                className="bg-white p-8 rounded-xl shadow-sm hover:shadow-lg transition-shadow"
              >
                <div className="text-5xl font-bold text-[var(--aci-primary)]/20 mb-4">
                  {principle.number}
                </div>
                <h3 className="text-xl font-semibold text-[var(--aci-secondary)] mb-3">
                  {principle.title}
                </h3>
                <p className="text-gray-600 mb-6">{principle.description}</p>
                <ul className="space-y-2">
                  {principle.proofPoints.map((point) => (
                    <li key={point} className="flex items-center gap-2 text-sm text-gray-500">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Capabilities Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--aci-secondary)] mb-4">
              What We've Built 80+ Times
            </h2>
            <p className="text-lg text-gray-600">
              Four capability areas where we have deep, proven expertise
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {capabilities.map((capability) => (
              <div
                key={capability.title}
                className="bg-gray-50 p-8 rounded-xl"
              >
                <h3 className="text-xl font-semibold text-[var(--aci-secondary)] mb-3">
                  {capability.title}
                </h3>
                <p className="text-gray-600 mb-6">{capability.description}</p>

                <div className="mb-6">
                  <div className="text-sm font-semibold text-gray-500 uppercase mb-3">Outcomes</div>
                  <ul className="grid grid-cols-2 gap-2">
                    {capability.outcomes.map((outcome) => (
                      <li key={outcome} className="flex items-center gap-2 text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        {outcome}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-wrap gap-2">
                  {capability.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 bg-white rounded-full text-xs text-gray-600 border border-gray-200"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--aci-secondary)] mb-4">
              Meet the Team
            </h2>
            <p className="text-lg text-gray-600">
              Leadership that's built enterprise systems, not just managed them
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {teamMembers.map((member) => (
              <div
                key={member.name}
                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow"
              >
                <div className="h-64 bg-gray-200 relative">
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[var(--aci-primary)] to-[var(--aci-primary-dark)]">
                    <span className="text-white text-4xl font-bold opacity-30">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-lg text-[var(--aci-secondary)]">
                      {member.name}
                    </h3>
                    {member.linkedin_url && (
                      <a
                        href={member.linkedin_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-[var(--aci-primary)]"
                      >
                        <Linkedin className="w-5 h-5" />
                      </a>
                    )}
                  </div>
                  <div className="text-sm text-[var(--aci-primary)] mb-3">{member.title}</div>
                  <p className="text-sm text-gray-600">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-[var(--aci-secondary)] mb-3">
              Trusted & Certified
            </h2>
            <p className="text-gray-600">
              Our work, culture, and capabilities have been validated by global benchmarks
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {certifications.map((cert) => (
              <div
                key={cert.name}
                className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-xl"
              >
                <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-gray-400">
                    {cert.name.charAt(0)}
                  </span>
                </div>
                <h3 className="font-semibold text-[var(--aci-secondary)] text-sm mb-1">
                  {cert.name}
                </h3>
                <p className="text-xs text-gray-500">{cert.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Track Record Section */}
      <section className="py-20 bg-[var(--aci-secondary)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              The ACI Track Record
            </h2>
            <p className="text-lg text-gray-400">
              Numbers that represent 19 years of production-grade engineering
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {trackRecord.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-[var(--aci-primary-light)] mb-2">
                  {stat.number}
                </div>
                <div className="text-sm font-medium text-white mb-1">{stat.label}</div>
                <div className="text-xs text-gray-400">{stat.context}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-[var(--aci-primary)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Discuss Your Challenge?
          </h2>
          <p className="text-lg text-blue-100 mb-8">
            Talk to an architect about your specific needs. No sales pitch—just an
            engineering conversation about what's actually possible.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <span className="text-blue-200 text-sm">Talk to senior architects, not sales reps</span>
            <span className="text-blue-300">|</span>
            <span className="text-blue-200 text-sm">30-minute technical discussion</span>
            <span className="text-blue-300">|</span>
            <span className="text-blue-200 text-sm">No pressure, no obligation</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button href="/contact" variant="secondary" size="lg">
              Schedule Architecture Call
            </Button>
            <Button
              href="/resources/capabilities-deck"
              variant="ghost"
              size="lg"
              className="text-white border-white hover:bg-white/10"
            >
              Download Capabilities Overview
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
