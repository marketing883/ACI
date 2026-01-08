import Link from 'next/link';
import { ArrowRight, Database, Brain, Cloud, Users, Shield, Zap } from 'lucide-react';
import Button from '@/components/ui/Button';
import {
  HeroSection,
  CaseStudiesSection,
  PartnersSection,
  TestimonialsSection,
  NewsSection,
  AwardsSection,
  DynamicBlogSection,
  ArqAISection,
} from '@/components/sections';
import PlaybookVaultSection from '@/components/sections/PlaybookVaultSection';

// Homepage data from content_homepage.json
const caseStudies = [
  {
    slug: 'msci-data-automation',
    client: 'MSCI',
    logo_url: '/images/clients/msci-logo.svg',
    industry: 'Financial Services',
    challenge: '40+ finance systems post-acquisitions needed consolidation',
    solution: 'SAP S/4HANA implementation with automated data quality gates',
    results: [
      { metric: '$12M', description: 'Operational savings in year one' },
      { metric: '18 months', description: 'Delivery timeline' },
      { metric: 'Zero', description: 'Financial reporting disruptions' },
    ],
    technologies: ['SAP S/4HANA', 'Python', 'Azure DevOps'],
  },
  {
    slug: 'racetrac-martech',
    client: 'RaceTrac',
    logo_url: '/images/clients/racetrac-logo.svg',
    industry: 'Retail / Convenience',
    challenge: 'Payment systems across 600+ locations, zero downtime tolerance',
    solution: 'Modernized payment infrastructure, integrated loyalty program with Braze',
    results: [
      { metric: '30%', description: 'Reduction in data latency' },
      { metric: '25%', description: 'Improvement in promotion effectiveness' },
      { metric: '600+', description: 'Locations with zero downtime' },
    ],
    technologies: ['Salesforce', 'Braze', 'AWS', 'Databricks'],
  },
  {
    slug: 'sodexo-unified-data',
    client: 'Sodexo',
    logo_url: '/images/clients/sodexo-logo.svg',
    industry: 'Hospitality',
    challenge: 'Global operations with data scattered across regional silos',
    solution: 'Unified data platform with Informatica IICS and MDM',
    results: [
      { metric: 'Single', description: 'Source of truth across all operations' },
      { metric: 'Global', description: 'Supply chain visibility' },
      { metric: '50%', description: 'Faster decision-making' },
    ],
    technologies: ['Informatica IICS', 'MDM', 'Cloud Integration'],
  },
];

const partners = [
  { name: 'Databricks', logo_url: '/images/partners/databricks.svg', badge: 'Exclusive Partner', badge_style: 'gold' as const },
  { name: 'Dynatrace', logo_url: '/images/partners/dynatrace.svg', badge: 'Partner', badge_style: 'silver' as const },
  { name: 'Salesforce', logo_url: '/images/partners/salesforce.svg', badge: 'Agentforce Exclusive Partner', badge_style: 'gold' as const },
  { name: 'AWS', logo_url: '/images/partners/aws.svg', badge: 'Partner', badge_style: 'silver' as const },
  { name: 'Microsoft Azure', logo_url: '/images/partners/azure.svg', badge: 'Solutions Partner', badge_style: 'silver' as const },
  { name: 'Snowflake', logo_url: '/images/partners/snowflake.svg' },
  { name: 'SAP', logo_url: '/images/partners/sap.svg' },
  { name: 'ServiceNow', logo_url: '/images/partners/servicenow.svg' },
  { name: 'Adobe', logo_url: '/images/partners/adobe.svg' },
  { name: 'Oracle', logo_url: '/images/partners/oracle.svg' },
  { name: 'Braze', logo_url: '/images/partners/braze.svg' },
  { name: 'Mulesoft', logo_url: '/images/partners/mulesoft.svg' },
];

const testimonials = [
  {
    quote: "I'm thrilled with our Data Team's achievement at ACI Infotech. They've flawlessly delivered top-tier Digital Data to Altria, marking a critical milestone for RaceTrac. Their dedication and expertise have made ACI Infotech a valuable partner to RaceTrac.",
    author: 'Director of Data and MarTech',
    company: 'RaceTrac',
    company_logo: '/images/clients/racetrac-logo.svg',
  },
  {
    quote: "I'm extremely satisfied with ACI Infotech, especially their work on IICS Informatica and MDM integrations. Their commitment to deliverables without compromising quality is impressive. It's a pleasure working with such a dedicated, professional team.",
    author: 'Senior Director',
    company: 'Sodexo',
    company_logo: '/images/clients/sodexo-logo.svg',
  },
  {
    quote: "It was truly a pleasure working with ACI Infotech. I am really impressed by the quality of the services Arcadia University received from ACI. Jag and the team have significantly contributed to the process of identifying the best ways to add values to the institution.",
    author: 'Interim CIO',
    company: 'Arcadia University',
    company_logo: '/images/clients/arcadia-logo.svg',
  },
  {
    quote: "ACI Infotech's dedicated resources consistently deliver excellent work quality, exceeding our expectations. Their dedicated onshore and onsite resources have been commendable, consistently demonstrating excellence.",
    author: 'Director',
    company: 'Gen II',
    company_logo: '/images/clients/genii-logo.svg',
  },
];

const newsItems = [
  {
    id: 'cio-world-recognition',
    title: 'Enterprise Visionary',
    excerpt: 'CIO World recognizes Jag Kanumuri, CEO of ACI Infotech, for pioneering AI-native enterprises and shaping a technopreneurial era.',
    image_url: '/images/news/cio-world.jpg',
    source: 'CIO World',
    date: 'December 2025',
  },
  {
    id: 'salesforce-agentforce',
    title: 'Agentforce Alliance',
    excerpt: 'ACI Infotech Accelerates Growth with Exclusive Salesforce-Agentforce Partnership and Bold Vision for the Future.',
    image_url: '/images/news/salesforce-partnership.jpg',
    source: 'PR Newswire',
    date: 'November 2025',
  },
  {
    id: 'arqai-launch',
    title: 'Innovation in MENA',
    excerpt: 'ACI Infotech unveils ArqAI at the World CIO 200 Summit Egypt, enabling MENA enterprises to scale AI responsibly.',
    image_url: '/images/news/arqai-launch.jpg',
    source: 'GEC Newswire',
    date: 'October 2025',
  },
];

const badges = [
  { name: 'Great Place to Work', description: 'Certified 2024-25', image_url: '/images/certifications/gptw.png' },
  { name: 'ISO 27001:2022', description: 'Information Security Certified', image_url: '/images/certifications/iso27001.png' },
  { name: 'CMMi Level 3', description: 'Process Maturity Certified', image_url: '/images/certifications/cmmi.png' },
  { name: '5 Best Data Analytics Companies', description: 'To Watch in 2025', image_url: '/images/certifications/best-data-analytics.png' },
];


export default function HomePage() {
  return (
    <>
      {/* Hero Section with Video Background */}
      <HeroSection />

      {/* Testimonials Section - Light relief between dark sections */}
      <TestimonialsSection
        headline="What Fortune 500 Leaders Say"
        testimonials={testimonials}
      />

      {/* Playbook Vault Section */}
      <PlaybookVaultSection />

      {/* Why We're Different Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--aci-secondary)] mb-4 font-[var(--font-title)]">
              Why We're Different
            </h2>
            <p className="text-lg text-gray-600">
              Most firms build and leave. We build, deploy, and stand behind it.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-lg transition-shadow">
              <div className="text-4xl font-bold text-[var(--aci-primary)] mb-2 font-[var(--font-title)]">70%</div>
              <div className="text-sm text-gray-500 mb-4">Senior architects with 10+ years</div>
              <h3 className="text-xl font-semibold text-[var(--aci-secondary)] mb-3 font-[var(--font-title)]">
                Engineers Who've Been on the Call
              </h3>
              <p className="text-gray-600">
                Your project lead has 15-20 years enterprise experience and has built this specific
                system 10+ times. Not junior analysts learning on your time.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-lg transition-shadow">
              <div className="text-4xl font-bold text-[var(--aci-primary)] mb-2 font-[var(--font-title)]">100%</div>
              <div className="text-sm text-gray-500 mb-4">Production deployments with SLAs</div>
              <h3 className="text-xl font-semibold text-[var(--aci-secondary)] mb-3 font-[var(--font-title)]">
                Production Code, Not PowerPoints
              </h3>
              <p className="text-gray-600">
                We ship working systems with SLAs. Databricks lakehouses. Salesforce CDP integrations.
                AWS cloud architectures. Every line designed for production scale.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-lg transition-shadow">
              <div className="text-4xl font-bold text-[var(--aci-primary)] mb-2 font-[var(--font-title)]">80+</div>
              <div className="text-sm text-gray-500 mb-4">Fortune 500 clients</div>
              <h3 className="text-xl font-semibold text-[var(--aci-secondary)] mb-3 font-[var(--font-title)]">
                Proven at Enterprise Scale
              </h3>
              <p className="text-gray-600">
                RaceTrac, MSCI, Sodexo, Nestle, PDS. 80+ Fortune 500 companies trust our code.
                Pattern recognition from 19 years of production experience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--aci-secondary)] mb-4 font-[var(--font-title)]">
              What We Build
            </h2>
            <p className="text-lg text-gray-600">
              Enterprise systems that run 24/7, backed by SLAs
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Link href="/services/data-engineering" className="group">
              <div className="bg-gray-50 p-6 rounded-xl hover:shadow-lg transition-all hover:-translate-y-1">
                <Database className="w-10 h-10 text-[var(--aci-primary)] mb-4" />
                <h3 className="text-xl font-semibold text-[var(--aci-secondary)] mb-2 group-hover:text-[var(--aci-primary)] font-[var(--font-title)]">
                  Data Engineering
                </h3>
                <p className="text-sm text-gray-500 mb-3">Platforms that feed AI and analytics</p>
                <p className="text-gray-600 text-sm mb-4">
                  Databricks lakehouses, Snowflake warehouses, real-time pipelines with Dynatrace observability.
                </p>
                <span className="text-[var(--aci-primary)] text-sm font-medium inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                  See Data Projects <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </Link>

            <Link href="/services/applied-ai-ml" className="group">
              <div className="bg-gray-50 p-6 rounded-xl hover:shadow-lg transition-all hover:-translate-y-1">
                <Brain className="w-10 h-10 text-[var(--aci-primary)] mb-4" />
                <h3 className="text-xl font-semibold text-[var(--aci-secondary)] mb-2 group-hover:text-[var(--aci-primary)] font-[var(--font-title)]">
                  Applied AI & ML
                </h3>
                <p className="text-sm text-gray-500 mb-3">From GenAI pilots to production ML</p>
                <p className="text-gray-600 text-sm mb-4">
                  GenAI chatbots, forecasting engines, recommendation systems. With MLOps, governance, and SLAs.
                </p>
                <span className="text-[var(--aci-primary)] text-sm font-medium inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                  See AI Projects <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </Link>

            <Link href="/services/cloud-modernization" className="group">
              <div className="bg-gray-50 p-6 rounded-xl hover:shadow-lg transition-all hover:-translate-y-1">
                <Cloud className="w-10 h-10 text-[var(--aci-primary)] mb-4" />
                <h3 className="text-xl font-semibold text-[var(--aci-secondary)] mb-2 group-hover:text-[var(--aci-primary)] font-[var(--font-title)]">
                  Cloud Modernization
                </h3>
                <p className="text-sm text-gray-500 mb-3">Multi-cloud without the chaos</p>
                <p className="text-gray-600 text-sm mb-4">
                  AWS, Azure, GCP migrations. Refactor, replatform, or rearchitect. Proven playbooks that reduce risk.
                </p>
                <span className="text-[var(--aci-primary)] text-sm font-medium inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                  See Cloud Projects <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </Link>

            <Link href="/services/martech-cdp" className="group">
              <div className="bg-gray-50 p-6 rounded-xl hover:shadow-lg transition-all hover:-translate-y-1">
                <Users className="w-10 h-10 text-[var(--aci-primary)] mb-4" />
                <h3 className="text-xl font-semibold text-[var(--aci-secondary)] mb-2 group-hover:text-[var(--aci-primary)] font-[var(--font-title)]">
                  MarTech & CDP
                </h3>
                <p className="text-sm text-gray-500 mb-3">Customer 360 that actually works</p>
                <p className="text-gray-600 text-sm mb-4">
                  Salesforce Marketing Cloud, Adobe Experience Platform, Braze. Real-time personalization at scale.
                </p>
                <span className="text-[var(--aci-primary)] text-sm font-medium inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                  See MarTech Projects <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </Link>

            <Link href="/services/digital-transformation" className="group">
              <div className="bg-gray-50 p-6 rounded-xl hover:shadow-lg transition-all hover:-translate-y-1">
                <Zap className="w-10 h-10 text-[var(--aci-primary)] mb-4" />
                <h3 className="text-xl font-semibold text-[var(--aci-secondary)] mb-2 group-hover:text-[var(--aci-primary)] font-[var(--font-title)]">
                  Digital Transformation
                </h3>
                <p className="text-sm text-gray-500 mb-3">Intelligent process automation</p>
                <p className="text-gray-600 text-sm mb-4">
                  ServiceNow workflows, RPA, document processing. Automate what humans shouldn't do manually.
                </p>
                <span className="text-[var(--aci-primary)] text-sm font-medium inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                  See Automation Projects <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </Link>

            <Link href="/services/cyber-security" className="group">
              <div className="bg-gray-50 p-6 rounded-xl hover:shadow-lg transition-all hover:-translate-y-1">
                <Shield className="w-10 h-10 text-[var(--aci-primary)] mb-4" />
                <h3 className="text-xl font-semibold text-[var(--aci-secondary)] mb-2 group-hover:text-[var(--aci-primary)] font-[var(--font-title)]">
                  Cyber Security
                </h3>
                <p className="text-sm text-gray-500 mb-3">Security built in, not bolted on</p>
                <p className="text-gray-600 text-sm mb-4">
                  DevSecOps, observability, compliance. SOC 2, ISO 27001 compliant architectures from day one.
                </p>
                <span className="text-[var(--aci-primary)] text-sm font-medium inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                  See Security Projects <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Case Studies Section */}
      <CaseStudiesSection
        headline="Here's What We Built. Here's What It Delivered."
        subheadline="Real projects. Real Fortune 500 clients. Real outcomes."
        studies={caseStudies}
        viewAllUrl="/case-studies"
        viewAllText="See All Success Stories"
      />

      {/* Partners Section */}
      <PartnersSection
        headline="Built on Enterprise-Grade Platforms"
        subheadline="We're certified experts in the platforms enterprises already trust"
        partners={partners}
      />

      {/* News Section */}
      <NewsSection
        headline="In The News"
        subheadline="Recent recognition and partnerships"
        news={newsItems}
      />

      {/* ArqAI Platform Section */}
      <ArqAISection
        eyebrow="Introducing ArqAI"
        headline="Enterprise AI Governance Platform"
        description="ArqAI is our purpose-built AI governance platform for enterprises scaling AI responsibly. Policy-as-code, model observability, automated compliance reporting, and audit trails that satisfy regulators."
        features={[
          { title: 'Automated AI Governance', description: 'Policy enforcement across all ML models, automated compliance checks' },
          { title: 'Model Observability', description: 'Drift detection, bias monitoring, performance tracking in production' },
          { title: 'Compliance Ready', description: 'EU AI Act, GDPR, DPDP compliant out of the box, audit-ready logs' },
        ]}
        demoUrl="https://demo.thearq.ai"
        websiteUrl="https://thearq.ai"
      />

      {/* Awards Section */}
      <AwardsSection
        headline="Trusted & Certified"
        subheadline="Our work, culture, and capabilities have been validated by global benchmarks"
        badges={badges}
      />

      {/* Blog Preview Section - Dynamic from Database */}
      <DynamicBlogSection
        headline="Thoughts and Insights"
        subheadline="Technical depth from engineers who've been there"
        limit={3}
      />

      {/* Final CTA Section */}
      <section className="py-20 bg-[var(--aci-primary)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 font-[var(--font-title)]">
            Ready to Build Something That Lasts?
          </h2>
          <p className="text-lg text-blue-100 mb-8">
            Talk to an architect about your specific challenge. No sales pitch.
            Just an engineering conversation about what's actually possible.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <span className="text-blue-200 text-sm">Talk to senior architects, not sales reps</span>
            <span className="text-blue-300">|</span>
            <span className="text-blue-200 text-sm">30-minute technical discussion</span>
            <span className="text-blue-300">|</span>
            <span className="text-blue-200 text-sm">We'll tell you if we're not the right fit</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button href="/contact" variant="secondary" size="lg">
              Start Your Transformation
            </Button>
            <Button
              href="/case-studies"
              variant="ghost"
              size="lg"
              className="text-white border-white hover:bg-white/10 hover:text-[#84cc16]"
            >
              See Our Success Stories
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
