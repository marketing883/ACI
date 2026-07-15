import { Metadata } from 'next';
import { ArrowRight, CheckCircle, ChevronDown, Code2, Cpu, Plug, RefreshCw, Layers, Sparkles, Activity, FileCheck, TrendingUp, Users, Globe, Smartphone, Database } from 'lucide-react';
import Button from '@/components/ui/Button';
import { ServiceSchema, FAQSchema, BreadcrumbSchema } from '@/components/seo/StructuredData';

import { displayClient } from '@/lib/content/anonymize';
import { getSiteUrl } from '@/lib/site-url';
// Canonical origin: always production, so staging builds can never
// self-canonicalize (see src/lib/site-url.ts).
const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  title: 'Application Development Services',
  description: 'Enterprise application engineering that sits on top of your data and AI infrastructure. Custom, web, and AI-powered applications built with production-grade rigor — not agency output.',
  keywords: 'enterprise application development, custom application development, AI-powered applications, web application development, legacy modernization, API development, enterprise software engineering',
  alternates: {
    canonical: `${siteUrl}/services/app-development`,
  },
  // Per-page social card. Without this, every share and link preview
  // inherited the homepage's OpenGraph (title, image, and og:url all
  // pointing at /), mis-attributing all 21 service/platform pages.
  openGraph: {
    title: 'Application Development Services | ACI Infotech',
    description: 'Enterprise application engineering that sits on top of your data and AI infrastructure. Custom, web, and AI-powered applications built with production-grade rigor — not agency output.',
    url: `${siteUrl}/services/app-development`,
    siteName: 'ACI Infotech',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Application Development Services | ACI Infotech',
    description: 'Enterprise application engineering that sits on top of your data and AI infrastructure. Custom, web, and AI-powered applications built with production-grade rigor — not agency output.',
  },
};

// Service data
const keyOutcomes = [
  'Enterprise applications that survive production scale',
  'AI-powered features that ship, not PoC demos',
  'Applications integrated with your data and AI stack from day one',
  'SLA-backed delivery, not fire-and-forget project closures',
];

const offerings = [
  {
    id: 'enterprise-applications',
    title: 'Enterprise Applications',
    description: 'Custom web and enterprise applications built for Fortune 500 operations. Production-grade from day one, not polished prototypes.',
    icon: Layers,
    technologies: ['Next.js', 'React', 'Node.js', 'TypeScript', 'PostgreSQL'],
    outcomes: ['Production-ready on launch', '99.5% uptime SLAs', 'Scales to millions of users'],
  },
  {
    id: 'ai-powered-applications',
    title: 'AI-Powered Applications',
    description: 'Applications with real AI embedded, not just an LLM chat widget bolted onto a marketing site. Copilots, agents, recommendation engines, intelligent workflows.',
    icon: Sparkles,
    technologies: ['OpenAI', 'Anthropic', 'LangChain', 'Pinecone', 'Azure OpenAI'],
    outcomes: ['Measurable business impact', 'Integrated with your data', 'Governed AI responses'],
  },
  {
    id: 'custom-business-apps',
    title: 'Custom Business Applications',
    description: 'Internal tools, workflow automation, and line-of-business applications that replace spreadsheets, legacy systems, and manual processes.',
    icon: Code2,
    technologies: ['React', 'Python', 'FastAPI', '.NET', 'GraphQL'],
    outcomes: ['Replaces 5+ manual tools', 'Reduces process time 22%+', 'Full audit trail'],
  },
  {
    id: 'api-development',
    title: 'API & Integration Platforms',
    description: 'Enterprise-grade APIs, GraphQL gateways, and integration layers that connect your applications, data, and partner systems.',
    icon: Plug,
    technologies: ['GraphQL', 'REST', 'gRPC', 'Kafka', 'MuleSoft'],
    outcomes: ['<100ms API latency', 'Full OpenAPI documentation', 'Automated contract testing'],
  },
  {
    id: 'legacy-modernization',
    title: 'Legacy Application Modernization',
    description: 'Modernize aging Java, .NET, and mainframe applications into cloud-native, microservices-based systems — without big-bang rewrites.',
    icon: RefreshCw,
    technologies: ['Kubernetes', 'Docker', 'Spring Boot', 'Strangler Pattern'],
    outcomes: ['Zero-downtime migration', 'Phased modernization', '18-28% cost reduction'],
  },
  {
    id: 'platform-engineering',
    title: 'Platform Engineering',
    description: 'Internal developer platforms, DX tooling, and engineering productivity systems that help your teams ship faster with fewer bugs.',
    icon: Cpu,
    technologies: ['Backstage', 'GitHub Actions', 'Terraform', 'ArgoCD'],
    outcomes: ['2x faster deployment', 'Self-service tooling', 'Standardized delivery'],
  },
];

const caseStudies = [
  {
    slug: 'databricks-modernization-ai-enablement-for-leading-c-store-chain',
    client: 'Fortune 500 Convenience Retailer',
    industry: 'Retail — Convenience',
    challenge: 'Needed a unified digital guest experience and loyalty platform across 600+ locations with real-time personalization at the point of sale.',
    results: [
      { metric: '600+', description: 'Locations with zero downtime' },
      { metric: '15%', description: 'Improvement in promotion effectiveness' },
      { metric: '2.5x', description: 'Email engagement lift' },
    ],
    technologies: ['Salesforce', 'Braze', 'Databricks', 'AWS', 'Kafka'],
  },
];

const processPhases = [
  {
    number: 1,
    title: 'Discovery & Design',
    duration: 'Weeks 1-3',
    description: 'Understand the business problem, user journeys, and existing data/AI infrastructure. Design for production from day one.',
  },
  {
    number: 2,
    title: 'Architecture & Foundation',
    duration: 'Weeks 4-6',
    description: 'Technical architecture, CI/CD, observability, security, and data integration foundations before any feature code.',
  },
  {
    number: 3,
    title: 'Iterative Build',
    duration: 'Months 2-6',
    description: 'Two-week sprints with working software at the end of each. Real users testing, not mockups in Figma.',
  },
  {
    number: 4,
    title: 'Launch & Stabilize',
    duration: 'Weeks before go-live',
    description: 'Production hardening, load testing, runbooks, and SLA baseline. We stay on the release, not offshore while you cut over.',
  },
  {
    number: 5,
    title: 'Operate & Evolve',
    duration: 'Ongoing',
    description: 'Post-launch operations, feature evolution, and continuous optimization. We run what we build.',
  },
];

const differentiators = [
  {
    title: 'Sits On Top of Your Data & AI',
    description: 'We build applications that are integrated with your data platform and AI systems from day one — not isolated frontends that need ETL jobs to find the data.',
    proof: 'Native integration with your lakehouse, CDP, and AI stack',
  },
  {
    title: 'Senior Architects, Not Agency Generalists',
    description: 'Our engineers have built applications that run Fortune 500 operations. Not freelancers stitching together Webflow and Zapier.',
    proof: 'Senior engineers on every engagement',
  },
  {
    title: 'Production SLAs, Not Project Handoffs',
    description: "We don't build it and disappear. SLA-backed operations, monitoring, and continuous evolution are part of how we engage.",
    proof: '24/7 incident response included',
  },
  {
    title: 'Systems That Survive Scale',
    description: 'We architect for the day you 10x your users, not just launch day. Load-tested, observable, and built to last.',
    proof: 'Zero production outages in last 3 years',
  },
];

const beyondDelivery = [
  {
    title: 'Production Operations',
    description: '24/7 monitoring, incident response, and platform health management — with defined SLAs and named engineering ownership.',
    icon: Activity,
  },
  {
    title: 'SLA-Backed Support',
    description: 'Contractual response times, defined escalation paths, and accountable ownership. Not helpdesk tickets that disappear into a queue.',
    icon: FileCheck,
  },
  {
    title: 'Continuous Optimization',
    description: 'Cost tuning, performance improvements, and capacity planning as part of ongoing engagement — not a separate line item.',
    icon: TrendingUp,
  },
  {
    title: 'Evolution as Partners',
    description: "Roadmap co-ownership, feature delivery, and architectural evolution. We're in it with you for the long arc, not just the launch sprint.",
    icon: Users,
  },
];

const faqs = [
  {
    question: "What makes ACI different from a development agency?",
    answer: "We're not an agency. We're an engineering firm that builds applications for enterprises that already have complex data and AI infrastructure. Our applications sit on top of that infrastructure and integrate with it natively — we don't do greenfield startup products or marketing sites.",
  },
  {
    question: 'Do you build mobile applications or e-commerce platforms?',
    answer: 'Mobile-first consumer apps and e-commerce platforms are not our focus. We build enterprise applications, AI-powered systems, and internal platforms for Fortune 500 operations. If you need a mobile-first consumer app, we can refer you to a better-fit partner.',
  },
  {
    question: 'What technology stack do you prefer?',
    answer: 'We work primarily in Next.js/React/TypeScript for frontend, Node.js/Python/.NET for backend, and whatever cloud and data platform you already use. We meet you where you are — we don\'t impose a stack just because we like it.',
  },
  {
    question: 'What happens after the application launches?',
    answer: 'This is where most firms disappear. We don\'t. Post-launch operations, SLA-backed support, and continuous optimization are part of how we engage. See "Beyond Delivery" above — we run what we build.',
  },
];

export default function AppDevelopmentPage() {
  return (
    <>
      {/* Structured Data for SEO/AEO */}
      <ServiceSchema
        name="Application Development Services"
        description="Enterprise application engineering that sits on top of your data and AI infrastructure. Custom, web, and AI-powered applications built with production-grade rigor."
        url="/services/app-development"
        serviceType="Application Development Consulting"
      />
      <FAQSchema faqs={faqs} />
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: '/' },
          { name: 'Services', url: '/services' },
          { name: 'App Development', url: '/services/app-development' },
        ]}
      />

      {/* Hero Section */}
      <section className="py-20 lg:py-28 bg-gradient-to-br from-[var(--aci-secondary)] to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-[var(--aci-primary-light)] font-semibold text-sm uppercase tracking-wide">
                Application Development
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-white mt-3 mb-6">
                Applications Built to Survive Production
              </h1>
              <p className="text-lg text-gray-300 mb-8">
                Custom, web, and AI-powered applications engineered for Fortune 500 operations.
                We build on top of your existing data and AI infrastructure — not separate from it —
                with the same production rigor we bring to everything else we ship.
              </p>

              {/* Key Outcomes */}
              <ul className="space-y-3 mb-8">
                {keyOutcomes.map((outcome) => (
                  <li key={outcome} className="flex items-center gap-3 text-gray-300">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                    {outcome}
                  </li>
                ))}
              </ul>

              <p className="text-sm text-[var(--aci-primary-light)] mb-8">
                Enterprise-scale engineering | Production SLAs | Integrated with your data & AI
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button href="/contact?service=app-development" variant="primary" size="lg">
                  Talk to an Engineer
                </Button>
                <Button
                  href="/case-studies?service=app-development"
                  variant="ghost"
                  size="lg"
                  className="text-white border-white hover:bg-white/10"
                >
                  See Application Projects
                </Button>
              </div>
            </div>

            {/* Visual - Enterprise Application Stack
                Four-layer architecture diagram. Reads top-to-bottom
                from entry points -> application -> integration/AI ->
                data & infrastructure. Each layer has its own accent
                color, a numbered header, an icon, and the full list
                of technologies as proper chips. Flow lines connect
                the layers so the stack reads as a system, not four
                loose rectangles. */}
            <div className="relative hidden lg:block">
              <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900 via-[#0A1628] to-slate-950 shadow-2xl">
                {/* Subtle dot-grid pattern behind everything */}
                <div
                  aria-hidden
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    backgroundImage:
                      'radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1px)',
                    backgroundSize: '18px 18px',
                    opacity: 0.5,
                  }}
                />
                {/* Accent glow blobs at corners */}
                <div
                  aria-hidden
                  className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-[var(--aci-primary)]/15 blur-3xl pointer-events-none"
                />
                <div
                  aria-hidden
                  className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full bg-teal-500/10 blur-3xl pointer-events-none"
                />

                <div className="relative p-5">
                  {/* Title strip */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-2">
                      <span className="relative inline-flex h-2 w-2">
                        <span className="absolute inset-0 rounded-full bg-[#C4FF61] opacity-60 animate-ping" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-[#C4FF61]" />
                      </span>
                      <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-slate-300">
                        Enterprise Application Stack
                      </div>
                    </div>
                    <div className="font-mono text-[10px] text-slate-500 tracking-wider">
                      4 LAYERS
                    </div>
                  </div>

                  {/* Entry points row - three icon cards */}
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: 'Web', Icon: Globe },
                      { label: 'Mobile', Icon: Smartphone },
                      { label: 'API', Icon: Plug },
                    ].map(({ label, Icon }) => (
                      <div
                        key={label}
                        className="group relative flex flex-col items-center justify-center gap-1 py-3 rounded-lg border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] hover:border-white/20 transition-colors"
                      >
                        <Icon
                          className="w-4 h-4 text-slate-300 group-hover:text-white transition-colors"
                          strokeWidth={1.5}
                        />
                        <span className="text-[11px] font-medium text-slate-200">
                          {label}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Layers: each with flow connector above */}
                  {[
                    {
                      num: '01',
                      title: 'Application Layer',
                      Icon: Code2,
                      accent: 'blue',
                      techs: [
                        'Next.js',
                        'React',
                        'TypeScript',
                        'Node.js',
                        '.NET Core',
                        'Angular',
                        'Blazor',
                        'Python',
                        'Django',
                      ],
                    },
                    {
                      num: '02',
                      title: 'Integration & AI Layer',
                      Icon: Sparkles,
                      accent: 'violet',
                      techs: [
                        'GraphQL',
                        'LangChain',
                        'Azure OpenAI',
                        'AWS Bedrock',
                        'Kafka',
                        'Event Bus',
                        'Vector DBs',
                      ],
                    },
                    {
                      num: '03',
                      title: 'Data & Infrastructure Layer',
                      Icon: Database,
                      accent: 'teal',
                      techs: [
                        'PostgreSQL',
                        'SQL Server',
                        'Snowflake',
                        'Docker',
                        'Kubernetes',
                        'AWS',
                        'Azure',
                        'GCP',
                      ],
                    },
                  ].map(({ num, title, Icon, accent, techs }) => {
                    // Per-accent palette. Building strings explicitly so
                    // Tailwind's JIT can see them at build time.
                    const palettes: Record<
                      string,
                      {
                        ring: string;
                        bg: string;
                        iconWrap: string;
                        iconColor: string;
                        chip: string;
                        chipBorder: string;
                        title: string;
                        line: string;
                      }
                    > = {
                      blue: {
                        ring: 'ring-blue-500/25',
                        bg: 'bg-blue-500/[0.04]',
                        iconWrap: 'bg-blue-500/20 ring-blue-400/30',
                        iconColor: 'text-blue-300',
                        chip: 'bg-blue-500/10 hover:bg-blue-500/20',
                        chipBorder: 'border-blue-400/20',
                        title: 'text-blue-100',
                        line: 'from-transparent via-blue-400/40 to-transparent',
                      },
                      violet: {
                        ring: 'ring-violet-500/25',
                        bg: 'bg-violet-500/[0.05]',
                        iconWrap: 'bg-violet-500/20 ring-violet-400/30',
                        iconColor: 'text-violet-300',
                        chip: 'bg-violet-500/10 hover:bg-violet-500/20',
                        chipBorder: 'border-violet-400/20',
                        title: 'text-violet-100',
                        line: 'from-transparent via-violet-400/40 to-transparent',
                      },
                      teal: {
                        ring: 'ring-teal-500/25',
                        bg: 'bg-teal-500/[0.05]',
                        iconWrap: 'bg-teal-500/20 ring-teal-400/30',
                        iconColor: 'text-teal-300',
                        chip: 'bg-teal-500/10 hover:bg-teal-500/20',
                        chipBorder: 'border-teal-400/20',
                        title: 'text-teal-100',
                        line: 'from-transparent via-teal-400/40 to-transparent',
                      },
                    };
                    const p = palettes[accent];
                    return (
                      <div key={num}>
                        {/* Flow connector: hairline vertical line with a
                            gradient fade so the layers feel continuous
                            instead of stacked as independent boxes. */}
                        <div className="flex flex-col items-center my-1.5">
                          <div
                            className={`w-px h-6 bg-gradient-to-b ${p.line}`}
                          />
                          <div
                            className={`w-1 h-1 rounded-full ${p.iconColor.replace('text-', 'bg-')}`}
                            style={{ opacity: 0.6 }}
                          />
                        </div>
                        {/* Layer panel */}
                        <div
                          className={`relative rounded-xl ${p.bg} border border-white/[0.06] ring-1 ${p.ring} p-3.5`}
                        >
                          <div className="flex items-center gap-2.5 mb-3">
                            <div
                              className={`flex-shrink-0 inline-flex items-center justify-center w-7 h-7 rounded-md ring-1 ${p.iconWrap}`}
                            >
                              <Icon
                                className={`w-3.5 h-3.5 ${p.iconColor}`}
                                strokeWidth={1.75}
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-mono text-[9px] tracking-[0.2em] uppercase text-slate-500">
                                {num}
                              </div>
                              <div
                                className={`text-[13px] font-semibold ${p.title} leading-tight`}
                              >
                                {title}
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {techs.map((t) => (
                              <span
                                key={t}
                                className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10.5px] font-medium text-slate-100 border ${p.chipBorder} ${p.chip} transition-colors`}
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="absolute -inset-4 bg-[var(--aci-primary)]/10 rounded-3xl blur-3xl -z-10"></div>
            </div>
          </div>
        </div>
      </section>

      {/* What We Build */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--aci-secondary)] mb-6">
              What We Actually Build
            </h2>
            <div className="space-y-4 text-gray-600">
              <p>
                Enterprise applications. AI-powered systems. Custom business tools.
                Not marketing sites, not mobile-first consumer products, not MVPs destined for rewrites.
                We build applications that sit on top of complex enterprise infrastructure and
                integrate with your data and AI stack from day one.
              </p>
              <p>
                The distinction matters. Most development firms build greenfield products.
                We build the enterprise applications that run on top of the data platforms and AI systems
                we've already deployed for Fortune 500 clients — or that integrate cleanly with yours.
              </p>
              <p className="font-semibold text-[var(--aci-secondary)]">
                When your application needs to authenticate against your SSO, query your lakehouse,
                invoke your ML models, and handle 10,000 concurrent users — that's the job we do.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Service Offerings */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--aci-secondary)] mb-4">
              Application Development Services
            </h2>
            <p className="text-lg text-gray-600">
              Six core offerings, each delivered with production-grade quality
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {offerings.map((offering) => {
              const Icon = offering.icon;
              return (
                <div
                  key={offering.id}
                  className="bg-white p-8 rounded-xl shadow-sm hover:shadow-lg transition-shadow"
                >
                  <Icon className="w-10 h-10 text-[var(--aci-primary)] mb-4" />
                  <h3 className="text-xl font-semibold text-[var(--aci-secondary)] mb-3">
                    {offering.title}
                  </h3>
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
                      <span
                        key={tech}
                        className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-600"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Case Study - Convenience Retailer */}
      <section className="py-20 bg-[var(--aci-secondary)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Enterprise Applications We've Built
            </h2>
            <p className="text-lg text-gray-400">
              Real projects. Real Fortune 500 clients. Real outcomes.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            {caseStudies.map((study) => (
              <div
                key={study.slug}
                className="bg-gray-800 rounded-xl overflow-hidden hover:bg-gray-700 transition-colors"
              >
                <div className="p-8 border-b border-gray-700">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold text-white">{displayClient(study)}</span>
                    <span className="text-sm text-gray-400">{study.industry}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-[var(--aci-primary-light)] mb-3">
                    Digital Guest Experience & Loyalty Platform
                  </h3>
                  <p className="text-gray-300">{study.challenge}</p>
                </div>
                <div className="p-8">
                  <div className="grid sm:grid-cols-3 gap-6 mb-6">
                    {study.results.map((result, idx) => (
                      <div key={idx}>
                        <div className="text-3xl font-bold text-[var(--aci-primary-light)] mb-1">
                          {result.metric}
                        </div>
                        <div className="text-sm text-gray-400">{result.description}</div>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {study.technologies.map((tech) => (
                      <span key={tech} className="px-3 py-1 bg-gray-700 rounded text-xs text-gray-300">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button href="/case-studies?service=app-development" variant="secondary" size="lg">
              See More Application Projects <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--aci-secondary)] mb-4">
              Our Application Development Process
            </h2>
            <p className="text-lg text-gray-600">
              From engagement to production: how we work
            </p>
          </div>

          <div className="grid md:grid-cols-5 gap-6">
            {processPhases.map((phase, index) => (
              <div key={phase.number} className="relative">
                <div className="bg-gray-50 rounded-xl p-6 h-full">
                  <div className="text-4xl font-bold text-[var(--aci-primary)]/20 mb-2">
                    0{phase.number}
                  </div>
                  <h3 className="font-semibold text-[var(--aci-secondary)] mb-1">
                    {phase.title}
                  </h3>
                  <div className="text-sm text-[var(--aci-primary)] mb-3">{phase.duration}</div>
                  <p className="text-sm text-gray-600">{phase.description}</p>
                </div>
                {index < processPhases.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2 text-gray-300">
                    →
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Beyond Delivery — Managed Services */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--aci-secondary)] mb-4">
              Beyond Delivery
            </h2>
            <p className="text-lg text-gray-600">
              We don't hand over and walk away. Post-deployment operations, SLA-backed support,
              and continuous optimization are part of how we engage.
              <span className="block mt-2 font-semibold text-[var(--aci-secondary)]">We run what we build.</span>
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {beyondDelivery.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <div key={pillar.title} className="bg-white p-6 rounded-xl shadow-sm">
                  <Icon className="w-8 h-8 text-[var(--aci-primary)] mb-4" />
                  <h3 className="text-lg font-semibold text-[var(--aci-secondary)] mb-2">
                    {pillar.title}
                  </h3>
                  <p className="text-sm text-gray-600">{pillar.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose ACI */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--aci-secondary)] mb-4">
              Why Choose ACI for Application Development
            </h2>
            <p className="text-lg text-gray-600">
              What makes us different from dev agencies
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {differentiators.map((diff) => (
              <div key={diff.title} className="bg-white p-8 rounded-xl shadow-sm">
                <h3 className="text-xl font-semibold text-[var(--aci-secondary)] mb-3">
                  {diff.title}
                </h3>
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
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--aci-secondary)] mb-4">
              Common Questions About Application Development
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq) => (
              <details key={faq.question} className="group bg-gray-50 rounded-xl">
                <summary className="flex items-center justify-between cursor-pointer p-6 text-lg font-medium text-[var(--aci-secondary)]">
                  {faq.question}
                  <ChevronDown className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform" />
                </summary>
                <div className="px-6 pb-6 text-gray-600">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-[var(--aci-primary)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Build an Application That Survives Production?
          </h2>
          <p className="text-lg text-blue-100 mb-8">
            Schedule a 30-minute technical call with one of our engineers.
            No sales pitch, just an engineering conversation about what you're trying to build.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <span className="text-blue-200 text-sm">Talk to senior engineers, not sales reps</span>
            <span className="text-blue-300">|</span>
            <span className="text-blue-200 text-sm">30-minute technical discussion</span>
            <span className="text-blue-300">|</span>
            <span className="text-blue-200 text-sm">We'll tell you if we're not the right fit</span>
          </div>

          <Button href="/contact?service=app-development" variant="lime" size="lg">
            Talk to an Engineer
          </Button>
        </div>
      </section>
    </>
  );
}
