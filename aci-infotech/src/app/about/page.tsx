import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Linkedin, CheckCircle, Target, Eye } from 'lucide-react';
import Button from '@/components/ui/Button';
import { BreadcrumbSchema } from '@/components/seo/StructuredData';
import ParallaxBalloons from '@/components/about/ParallaxBalloons';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://aciinfotech.com';

export const metadata: Metadata = {
  title: 'About ACI Infotech | The Engineers Behind Enterprise Modernization',
  description: '1,250+ engineers building data platforms, AI systems, and cloud architectures for 80+ Fortune 500 clients. 19 years of production-grade engineering. We answer the 2am call.',
  keywords: 'enterprise technology consulting, data engineering company, AI ML consulting, Fortune 500 technology partner, production-grade engineering',
  alternates: {
    canonical: `${siteUrl}/about`,
  },
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

// CEO Data
const ceo = {
  name: 'Jag Kanumuri',
  title: 'Founder & CEO',
  vision: `At ACI Infotech, our purpose is to drive enterprise excellence through innovation and intelligence. We partner with organizations to help them reimagine their business models, modernize operations, and unlock value through technology.

Under Jag's leadership, ACI has grown from a small team of passionate engineers to a 1,250+ strong global organization serving 80+ Fortune 500 clients. His vision is simple yet powerful: deliver production-grade systems that create measurable business value, backed by engineers who take ownership and stay accountable.

"We don't just deliver projects—we build partnerships. When your system goes down at 2am, we're the team that answers the phone. That's not a policy. That's who we are."`,
  photo_url: '/images/about-team/Jag.png',
  photo_webp: '/images/about-team/Jag.webp',
  linkedin_url: 'https://www.linkedin.com/in/jagannadhkanumuri/',
};

// Leadership Team Data
const leadershipTeam = [
  {
    name: 'Krish Karanam',
    title: 'SVP - Global Resources',
    photo_url: '/images/about-team/Krish.png',
    photo_webp: '/images/about-team/Krish.webp',
    linkedin_url: 'https://www.linkedin.com/in/krish-karanam-423783113/',
  },
  {
    name: 'Habib Mehmoodi',
    title: 'VP - Strategy & Innovation',
    photo_url: '/images/about-team/Habib.png',
    photo_webp: '/images/about-team/Habib.webp',
    linkedin_url: 'https://www.linkedin.com/in/hmehmoodi/',
  },
  {
    name: 'Amit Alshaikh',
    title: 'VP - Client Success',
    photo_url: '/images/about-team/Amit-A.png',
    photo_webp: '/images/about-team/Amit-A.webp',
    linkedin_url: 'https://www.linkedin.com/in/amitalshaikh/',
  },
  {
    name: 'Narayanan Nanjan',
    title: 'VP - Project Delivery',
    photo_url: '/images/about-team/Narayanan.png',
    photo_webp: '/images/about-team/Narayanan.webp',
    linkedin_url: 'https://www.linkedin.com/in/narayanan-nanjan-5b655433/',
  },
  {
    name: 'Thomas George',
    title: 'AVP - Strategic Partnerships',
    photo_url: '/images/about-team/Thomas.png',
    photo_webp: '/images/about-team/Thomas.webp',
    linkedin_url: 'https://www.linkedin.com/in/thomas-george-25bb5a61/',
  },
  {
    name: 'Amit Khare',
    title: 'AVP - Client Success, APAC',
    photo_url: '/images/about-team/Amit-K.png',
    photo_webp: '/images/about-team/Amit-K.webp',
    linkedin_url: 'https://www.linkedin.com/in/amit-khare-27850a186/',
  },
  {
    name: 'Madhu Noone',
    title: 'Director - Sales',
    photo_url: '/images/about-team/Madhu.png',
    photo_webp: '/images/about-team/Madhu.webp',
    linkedin_url: 'https://www.linkedin.com/in/madhu-n-mis-mba-9a546b117/',
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
      {/* Structured Data for SEO */}
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: '/' },
          { name: 'About', url: '/about' },
        ]}
      />

      {/* Hero Section */}
      <section className="py-20 lg:py-28 bg-gradient-to-br from-[var(--aci-secondary)] to-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              The Engineers Behind Enterprise Modernization
            </h1>
            <p className="text-lg md:text-xl text-gray-300">
              We're the 1,250-person technical team between your strategy and your operations.
              We build data platforms, deploy AI systems, and stabilize cloud architectures, then
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

      {/* Vision & Mission Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-16">
            {/* Vision */}
            <div className="relative p-8 lg:p-10 bg-gradient-to-br from-[var(--aci-primary)]/5 to-[var(--aci-primary)]/10 rounded-2xl border border-[var(--aci-primary)]/20">
              <div className="absolute -top-5 left-8">
                <div className="w-10 h-10 bg-[var(--aci-primary)] rounded-xl flex items-center justify-center shadow-lg">
                  <Eye className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="pt-4">
                <h2 className="text-2xl md:text-3xl font-bold text-[var(--aci-secondary)] mb-4">
                  Our Vision
                </h2>
                <p className="text-lg md:text-xl text-gray-700 leading-relaxed font-medium">
                  To be the engineering partner that Fortune 500s trust to turn ambitious technology strategies into production-grade reality, while setting the standard for what a modern, agile enterprise consultancy can achieve.
                </p>
                <p className="mt-4 text-gray-600">
                  We envision a world where enterprises don't have to choose between scale and speed, between capability and cost. We're building that alternative.
                </p>
              </div>
            </div>

            {/* Mission */}
            <div className="relative p-8 lg:p-10 bg-gradient-to-br from-[var(--aci-secondary)]/5 to-[var(--aci-secondary)]/10 rounded-2xl border border-[var(--aci-secondary)]/20">
              <div className="absolute -top-5 left-8">
                <div className="w-10 h-10 bg-[var(--aci-secondary)] rounded-xl flex items-center justify-center shadow-lg">
                  <Target className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="pt-4">
                <h2 className="text-2xl md:text-3xl font-bold text-[var(--aci-secondary)] mb-4">
                  Our Mission
                </h2>
                <p className="text-lg md:text-xl text-gray-700 leading-relaxed font-medium">
                  To deliver production-grade data platforms, AI systems, and cloud architectures that drive measurable business outcomes, backed by SLAs and supported by engineers who stay.
                </p>
                <p className="mt-4 text-gray-600">
                  Every system we build runs in production, carries accountability, and creates value you can measure. That's not a tagline. That's our operating model.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Who We Are Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-[var(--aci-secondary)] mb-6">
                Built for Enterprise Scale, Moves Like a Startup
              </h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  ACI Infotech isn't trying to be the next Accenture. We're the alternative: large
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
            <ParallaxBalloons />
          </div>
        </div>
      </section>

      {/* How We Work Section */}
      <section className="py-20 bg-white">
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
      <section className="py-20 bg-gray-50">
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

      {/* Leadership Section - CEO Featured */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--aci-secondary)] mb-4">
              Our Leadership
            </h2>
            <p className="text-lg text-gray-600">
              Leadership that's built enterprise systems, not just managed them
            </p>
          </div>

          {/* CEO Featured Section */}
          <div className="mb-20">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 lg:p-12 shadow-sm border border-gray-100">
              {/* CEO Photo - Left Side */}
              <div className="flex justify-center lg:justify-start">
                <div className="relative">
                  <div className="w-64 h-64 md:w-80 md:h-80 rounded-2xl overflow-hidden shadow-xl">
                    <picture>
                      <source srcSet={ceo.photo_webp} type="image/webp" />
                      <Image
                        src={ceo.photo_url}
                        alt={ceo.name}
                        width={400}
                        height={400}
                        className="w-full h-full object-cover"
                      />
                    </picture>
                  </div>
                  {/* Decorative accent */}
                  <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-[var(--aci-primary)]/10 rounded-xl -z-10" />
                </div>
              </div>

              {/* CEO Info - Right Side */}
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <div>
                    <h3 className="text-2xl md:text-3xl font-bold text-[var(--aci-secondary)]">
                      {ceo.name}
                    </h3>
                    <p className="text-lg text-[var(--aci-primary)] font-medium">{ceo.title}</p>
                  </div>
                  <a
                    href={ceo.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-auto p-2 bg-[#0077B5] text-white rounded-lg hover:bg-[#006396] transition-colors"
                    aria-label={`${ceo.name}'s LinkedIn profile`}
                  >
                    <Linkedin className="w-5 h-5" />
                  </a>
                </div>
                <div className="space-y-4 text-gray-600 leading-relaxed">
                  {ceo.vision.split('\n\n').map((paragraph, idx) => (
                    <p key={idx} className={idx === 2 ? 'italic text-[var(--aci-secondary)] font-medium' : ''}>
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Leadership Team Grid */}
          <div>
            <h3 className="text-2xl font-bold text-[var(--aci-secondary)] text-center mb-10">
              Leadership Team
            </h3>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {leadershipTeam.map((member) => (
                <div
                  key={member.name}
                  className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow border border-gray-100"
                >
                  <div className="h-56 bg-gray-200 relative">
                    {member.photo_url ? (
                      <picture>
                        <source srcSet={member.photo_webp || undefined} type="image/webp" />
                        <Image
                          src={member.photo_url}
                          alt={member.name}
                          fill
                          className="object-cover object-[center_15%]"
                          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        />
                      </picture>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[var(--aci-primary)] to-[var(--aci-primary-dark)]">
                        <span className="text-white text-4xl font-bold opacity-50">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold text-lg text-[var(--aci-secondary)]">
                        {member.name}
                      </h4>
                      <a
                        href={member.linkedin_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#0077B5] hover:text-[#006396] transition-colors"
                        aria-label={`${member.name}'s LinkedIn profile`}
                      >
                        <Linkedin className="w-5 h-5" />
                      </a>
                    </div>
                    <p className="text-sm text-[var(--aci-primary)]">{member.title}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Certifications Section */}
      <section className="py-16 bg-gray-50">
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
            Talk to an architect about your specific needs. No sales pitch, just an
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
