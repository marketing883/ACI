import { Metadata } from 'next';
import { ArrowRight, CheckCircle, ChevronDown, Users, Target, BarChart3, Mail, Sparkles, Database } from 'lucide-react';
import Button from '@/components/ui/Button';
import { ServiceSchema, FAQSchema, BreadcrumbSchema } from '@/components/seo/StructuredData';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://aciinfotech.com';

export const metadata: Metadata = {
  title: 'MarTech & CDP Services | ACI Infotech',
  description: 'Customer 360 that actually works. Salesforce Marketing Cloud, Adobe Experience Platform, Braze implementations. Real-time personalization at scale.',
  keywords: 'CDP implementation, Salesforce Marketing Cloud, Adobe Experience Platform, Braze, customer data platform, martech consulting',
  alternates: {
    canonical: `${siteUrl}/services/martech-cdp`,
  },
};

const keyOutcomes = [
  '1:1 personalization at scale',
  'Unified customer view across all touchpoints',
  'Real-time journey orchestration',
  'Measurable lift in conversion and retention',
];

const offerings = [
  {
    id: 'cdp-implementation',
    title: 'CDP Implementation',
    description: 'Salesforce Data Cloud, Adobe Real-Time CDP, or Segment implementations with unified customer profiles.',
    icon: Database,
    technologies: ['Salesforce Data Cloud', 'Adobe RT-CDP', 'Segment', 'mParticle'],
    outcomes: ['360° customer view', 'Real-time profile updates', 'Privacy-compliant activation'],
  },
  {
    id: 'journey-orchestration',
    title: 'Journey Orchestration',
    description: 'Multi-channel customer journeys that respond in real-time to behavior signals.',
    icon: Target,
    technologies: ['Salesforce Journey Builder', 'Adobe Journey Optimizer', 'Braze Canvas'],
    outcomes: ['20% lift in engagement', 'Automated lifecycle marketing', 'Cross-channel consistency'],
  },
  {
    id: 'personalization-engine',
    title: 'Personalization Engine',
    description: 'AI-driven personalization for web, email, mobile, and paid media.',
    icon: Sparkles,
    technologies: ['Einstein AI', 'Adobe Sensei', 'Dynamic Yield'],
    outcomes: ['25% increase in conversion', 'Product recommendations', 'Next-best-action'],
  },
  {
    id: 'email-marketing',
    title: 'Email & Messaging',
    description: 'High-deliverability email programs with dynamic content and A/B testing.',
    icon: Mail,
    technologies: ['Salesforce Marketing Cloud', 'Braze', 'Klaviyo', 'SendGrid'],
    outcomes: ['Improved deliverability', 'Higher open rates', 'Reduced unsubscribes'],
  },
  {
    id: 'loyalty-crm',
    title: 'Loyalty & CRM',
    description: 'Loyalty program design and CRM integrations that drive repeat purchase.',
    icon: Users,
    technologies: ['Salesforce CRM', 'Loyalty Management', 'Service Cloud'],
    outcomes: ['Increased LTV', 'Higher retention', 'Unified service experience'],
  },
  {
    id: 'analytics-attribution',
    title: 'Analytics & Attribution',
    description: 'Marketing mix modeling, multi-touch attribution, and campaign analytics.',
    icon: BarChart3,
    technologies: ['Adobe Analytics', 'Google Analytics 4', 'Tableau', 'Looker'],
    outcomes: ['Clear ROI measurement', 'Channel optimization', 'Budget allocation'],
  },
];

const caseStudies = [
  {
    slug: 'racetrac-martech',
    client: 'RaceTrac',
    industry: 'Retail',
    challenge: 'Fragmented customer data across 600+ locations, no unified view',
    results: [
      { metric: '30%', description: 'Reduction in data latency' },
      { metric: '25%', description: 'Improvement in promotions' },
      { metric: '600+', description: 'Locations integrated' },
    ],
    technologies: ['Salesforce', 'Braze', 'AWS', 'Databricks'],
  },
  {
    slug: 'retail-personalization',
    client: 'National Retailer',
    industry: 'Retail',
    challenge: 'Generic marketing driving customers to competitors',
    results: [
      { metric: '25%', description: 'Increase in conversion' },
      { metric: '15%', description: 'Lift in AOV' },
      { metric: '3x', description: 'Email engagement' },
    ],
    technologies: ['Adobe Experience Platform', 'Target', 'Campaign'],
  },
  {
    slug: 'hospitality-loyalty',
    client: 'Global Hospitality Brand',
    industry: 'Hospitality',
    challenge: 'Loyalty program data siloed from marketing systems',
    results: [
      { metric: 'Unified', description: 'Customer profile' },
      { metric: '20%', description: 'Increase in bookings' },
      { metric: 'Real-time', description: 'Personalization' },
    ],
    technologies: ['Salesforce', 'Marketing Cloud', 'Data Cloud'],
  },
];

const differentiators = [
  {
    title: 'Salesforce Agentforce Partner',
    description: "Exclusive Agentforce partnership means we're at the cutting edge of AI-powered marketing.",
    proof: 'Agentforce Exclusive Partner',
  },
  {
    title: 'Data-First Approach',
    description: 'CDP implementations built on solid data foundations, not marketing-first chaos.',
    proof: 'Data engineering heritage',
  },
  {
    title: 'Measurable Outcomes',
    description: 'Every campaign, every journey measured. We optimize based on data, not opinions.',
    proof: 'Clear attribution models',
  },
  {
    title: 'Production-Grade Quality',
    description: 'Same engineering rigor we apply to data platforms, applied to your marketing stack.',
    proof: '24/7 SLA support available',
  },
];

const faqs = [
  {
    question: 'Which CDP should we choose?',
    answer: 'It depends on your existing stack. Salesforce Data Cloud for Salesforce-heavy orgs, Adobe RT-CDP for Adobe shops, Segment for flexibility. We help you evaluate based on your specific requirements.',
  },
  {
    question: 'How long does a CDP implementation take?',
    answer: '6-9 months for enterprise implementations. Simpler deployments can be faster. The timeline depends on data sources, use cases, and integration complexity.',
  },
  {
    question: 'What about data privacy and compliance?',
    answer: 'Privacy is built in. We implement consent management, data residency controls, and ensure GDPR/CCPA compliance from day one.',
  },
  {
    question: 'Can you work with our existing marketing tools?',
    answer: 'Yes. We integrate with your existing stack and add capabilities incrementally. No need to rip and replace.',
  },
];

export default function MarTechCDPPage() {
  return (
    <>
      {/* Structured Data for SEO/AEO */}
      <ServiceSchema
        name="MarTech & CDP Services"
        description="Customer 360 that actually works. Salesforce Marketing Cloud, Adobe Experience Platform, Braze implementations."
        url="/services/martech-cdp"
        serviceType="Marketing Technology Consulting"
      />
      <FAQSchema faqs={faqs} />
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: '/' },
          { name: 'Services', url: '/services' },
          { name: 'MarTech & CDP', url: '/services/martech-cdp' },
        ]}
      />

      {/* Hero Section */}
      <section className="py-20 lg:py-28 bg-gradient-to-br from-[var(--aci-secondary)] to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-[var(--aci-primary-light)] font-semibold text-sm uppercase tracking-wide">
                MarTech & CDP
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-white mt-3 mb-6">
                Customer 360 That Actually Works
              </h1>
              <p className="text-lg text-gray-300 mb-8">
                Salesforce Marketing Cloud, Adobe Experience Platform, Braze. Real-time personalization at scale.
                We build CDPs and marketing stacks that unify your customer data and drive measurable lift.
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
                Salesforce Agentforce Exclusive Partner | Adobe Solution Partner
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button href="/contact?service=martech-cdp" variant="primary" size="lg">
                  Talk to a MarTech Architect
                </Button>
                <Button
                  href="/case-studies?service=martech-cdp"
                  variant="ghost"
                  size="lg"
                  className="text-white border-white hover:bg-white/10"
                >
                  See MarTech Projects
                </Button>
              </div>
            </div>

            {/* Visual */}
            <div className="relative hidden lg:block">
              <div className="bg-gray-800 rounded-2xl p-8 shadow-2xl">
                <div className="text-sm text-gray-400 mb-4">Customer Data Platform</div>
                <div className="space-y-4">
                  <div className="grid grid-cols-4 gap-2">
                    {['Web', 'Mobile', 'Email', 'Store'].map((src) => (
                      <div key={src} className="bg-gray-700 rounded-lg p-2 text-center text-xs text-gray-300">{src}</div>
                    ))}
                  </div>
                  <div className="text-center text-gray-500">↓</div>
                  <div className="bg-[var(--aci-primary)]/30 rounded-lg p-4 text-center">
                    <div className="text-white font-bold">Customer Data Platform</div>
                    <div className="text-xs text-gray-300 mt-1">Unified Profiles • Real-time Segments</div>
                  </div>
                  <div className="text-center text-gray-500">↓</div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-green-900/30 rounded-lg p-3 text-center text-xs text-green-300">Email</div>
                    <div className="bg-blue-900/30 rounded-lg p-3 text-center text-xs text-blue-300">Ads</div>
                    <div className="bg-purple-900/30 rounded-lg p-3 text-center text-xs text-purple-300">App</div>
                  </div>
                </div>
              </div>
              <div className="absolute -inset-4 bg-pink-500/10 rounded-3xl blur-3xl -z-10"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Service Offerings */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--aci-secondary)] mb-4">MarTech & CDP Services</h2>
            <p className="text-lg text-gray-600">From data unification to activation</p>
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
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">MarTech Projects We've Built</h2>
            <p className="text-lg text-gray-400">Real implementations. Measurable outcomes.</p>
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
            <Button href="/case-studies?service=martech-cdp" variant="secondary" size="lg">
              See All MarTech Case Studies <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Why Choose ACI */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--aci-secondary)] mb-4">Why Choose ACI for MarTech</h2>
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
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--aci-secondary)] mb-4">Common Questions About MarTech</h2>
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
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Unify Your Customer Data?</h2>
          <p className="text-lg text-blue-100 mb-8">
            Talk to a MarTech architect about your customer data challenges.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button href="/contact?service=martech-cdp" variant="secondary" size="lg">Talk to a MarTech Architect</Button>
            <Button href="/case-studies?service=martech-cdp" variant="ghost" size="lg" className="text-white border-white hover:bg-white/10">
              See MarTech Case Studies
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
