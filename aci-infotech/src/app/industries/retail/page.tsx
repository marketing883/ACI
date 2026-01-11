import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, CheckCircle2, ShoppingCart, TrendingUp, Users, BarChart3 } from 'lucide-react';
import Button from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'Retail & Consumer Technology Solutions',
  description: 'Enterprise data, AI, and cloud solutions for retailers. Customer data platforms, demand forecasting, personalization, and supply chain optimization.',
};

const solutions = [
  {
    title: 'Customer Data Platform',
    description: 'Unify customer data across all touchpoints to enable personalized experiences and improve retention.',
    outcomes: ['Single customer view', '360° profiles', 'Real-time segmentation'],
    services: ['MarTech & CDP', 'Data Engineering'],
  },
  {
    title: 'AI-Powered Personalization',
    description: 'Deploy ML models that deliver personalized product recommendations and offers in real-time.',
    outcomes: ['35% engagement lift', '20% higher conversion', 'Real-time recommendations'],
    services: ['Applied AI & ML', 'MarTech & CDP'],
  },
  {
    title: 'Demand Forecasting',
    description: 'Implement ML-based demand forecasting to optimize inventory and reduce stockouts.',
    outcomes: ['$18M+ annual savings', '92% forecast accuracy', '23% fewer stockouts'],
    services: ['Applied AI & ML', 'Data Engineering'],
  },
  {
    title: 'Supply Chain Analytics',
    description: 'Build real-time visibility into your supply chain with predictive analytics for disruption management.',
    outcomes: ['Real-time visibility', 'Predictive alerts', 'Cost optimization'],
    services: ['Data Engineering', 'Applied AI & ML'],
  },
  {
    title: 'Omnichannel Analytics',
    description: 'Unify data across online, mobile, and in-store channels for complete customer journey visibility.',
    outcomes: ['Cross-channel attribution', 'Journey analytics', 'Store performance'],
    services: ['Data Engineering', 'MarTech & CDP'],
  },
  {
    title: 'Pricing Optimization',
    description: 'Implement dynamic pricing models that maximize margin while maintaining competitive positioning.',
    outcomes: ['3-5% margin lift', 'Competitive monitoring', 'Markdown optimization'],
    services: ['Applied AI & ML', 'Data Engineering'],
  },
];

const caseStudies = [
  {
    client: 'RaceTrac',
    type: 'Convenience Retail',
    challenge: 'Fragmented customer data across 800+ locations preventing personalized engagement',
    solution: 'Salesforce Marketing Cloud with custom CDP integration and journey automation',
    results: [
      { metric: '$2.3M', label: 'Incremental revenue from personalization' },
      { metric: '35%', label: 'Increase in customer engagement' },
      { metric: 'Unified', label: 'Customer profiles across all locations' },
    ],
    technologies: ['Salesforce Marketing Cloud', 'Snowflake', 'AWS'],
  },
  {
    client: 'Fortune 100 Retailer',
    type: 'Department Store',
    challenge: 'Manual forecasting causing $50M+ in inventory inefficiencies annually',
    solution: 'ML-powered demand forecasting on Databricks with AutoML pipeline',
    results: [
      { metric: '$18M', label: 'Annual savings from forecast accuracy' },
      { metric: '92%', label: 'Forecast accuracy achieved' },
      { metric: '23%', label: 'Reduction in stockouts' },
    ],
    technologies: ['Databricks', 'Python', 'MLflow', 'Snowflake'],
  },
];

const capabilities = [
  { name: 'POS Data Integration', description: 'Real-time transaction data' },
  { name: 'Loyalty Analytics', description: 'Customer lifetime value' },
  { name: 'E-commerce Platforms', description: 'Shopify, Magento, custom' },
  { name: 'Inventory Systems', description: 'SAP, Oracle, Manhattan' },
  { name: 'Marketing Platforms', description: 'Salesforce, Adobe, Braze' },
  { name: 'Supply Chain', description: 'Blue Yonder, Kinaxis' },
];

export default function RetailPage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-[var(--aci-secondary)] pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/industries"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            All Industries
          </Link>

          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-[var(--aci-primary)] rounded-2xl flex items-center justify-center">
              <ShoppingCart className="w-8 h-8 text-white" />
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Retail & Consumer
            <span className="text-[var(--aci-primary-light)]"> Technology Solutions</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mb-8">
            From convenience stores to department store chains, we help retailers harness data
            to deliver personalized experiences, optimize inventory, and drive growth. Our solutions
            span the entire customer journey, from acquisition to loyalty.
          </p>

          <div className="flex flex-wrap gap-4">
            <Button href="/contact?reason=architecture-call" variant="primary" size="lg">
              Schedule Consultation
            </Button>
            <Button href="/case-studies" variant="secondary" size="lg">
              View Case Studies
            </Button>
          </div>
        </div>
      </section>

      {/* Value Props */}
      <section className="py-16 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-7 h-7 text-[var(--aci-primary)]" />
              </div>
              <h3 className="font-semibold text-[var(--aci-secondary)] mb-2">Customer 360</h3>
              <p className="text-gray-600 text-sm">
                Unified customer profiles across all channels.
              </p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-7 h-7 text-[var(--aci-primary)]" />
              </div>
              <h3 className="font-semibold text-[var(--aci-secondary)] mb-2">Proven ROI</h3>
              <p className="text-gray-600 text-sm">
                $50M+ in documented value for retail clients.
              </p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-7 h-7 text-[var(--aci-primary)]" />
              </div>
              <h3 className="font-semibold text-[var(--aci-secondary)] mb-2">Real-Time</h3>
              <p className="text-gray-600 text-sm">
                Real-time analytics for instant insights.
              </p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <ShoppingCart className="w-7 h-7 text-[var(--aci-primary)]" />
              </div>
              <h3 className="font-semibold text-[var(--aci-secondary)] mb-2">Omnichannel</h3>
              <p className="text-gray-600 text-sm">
                Seamless online, mobile, and in-store integration.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Solutions */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--aci-secondary)] mb-4">
              Solutions for Retail
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Purpose-built solutions that address the unique challenges of modern retail.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {solutions.map((solution) => (
              <div key={solution.title} className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-xl font-bold text-[var(--aci-secondary)] mb-3">{solution.title}</h3>
                <p className="text-gray-600 mb-4">{solution.description}</p>

                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-500 mb-2">Outcomes</h4>
                  <ul className="space-y-1">
                    {solution.outcomes.map((outcome) => (
                      <li key={outcome} className="flex items-center gap-2 text-sm text-gray-700">
                        <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                        {outcome}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-wrap gap-2">
                  {solution.services.map((service) => (
                    <span key={service} className="px-2 py-1 bg-blue-50 text-[var(--aci-primary)] text-xs rounded">
                      {service}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Case Studies */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--aci-secondary)] mb-4">
              Retail Success Stories
            </h2>
          </div>

          <div className="space-y-8">
            {caseStudies.map((cs, index) => (
              <div key={index} className="bg-gray-50 rounded-2xl p-8">
                <div className="flex flex-col lg:flex-row gap-8">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="px-3 py-1 bg-[var(--aci-primary)] text-white text-sm font-medium rounded-full">
                        {cs.type}
                      </span>
                      <span className="text-gray-500">{cs.client}</span>
                    </div>

                    <div className="mb-4">
                      <h3 className="font-semibold text-gray-700 mb-2">Challenge</h3>
                      <p className="text-gray-600">{cs.challenge}</p>
                    </div>

                    <div className="mb-4">
                      <h3 className="font-semibold text-gray-700 mb-2">Solution</h3>
                      <p className="text-gray-600">{cs.solution}</p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {cs.technologies.map((tech) => (
                        <span key={tech} className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded-full">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="lg:w-80">
                    <h3 className="font-semibold text-gray-700 mb-4">Results</h3>
                    <div className="space-y-4">
                      {cs.results.map((result, i) => (
                        <div key={i} className="bg-white p-4 rounded-lg">
                          <div className="text-2xl font-bold text-[var(--aci-primary)]">{result.metric}</div>
                          <div className="text-sm text-gray-600">{result.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href="/case-studies" className="inline-flex items-center gap-2 text-[var(--aci-primary)] font-semibold hover:underline">
              View All Case Studies <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-[var(--aci-secondary)] mb-8 text-center">
            Retail Systems Expertise
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {capabilities.map((item) => (
              <div key={item.name} className="bg-white p-4 rounded-lg flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <ShoppingCart className="w-5 h-5 text-[var(--aci-primary)]" />
                </div>
                <div>
                  <div className="font-semibold text-[var(--aci-secondary)]">{item.name}</div>
                  <div className="text-sm text-gray-500">{item.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[var(--aci-primary)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Retail Operations?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Schedule a consultation with our retail technology experts to discuss your challenges.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button href="/contact?reason=architecture-call" variant="secondary" size="lg">
              Schedule Consultation
            </Button>
            <Button href="/industries" variant="ghost" size="lg" className="text-white border-white hover:bg-white/10">
              Explore Other Industries
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
