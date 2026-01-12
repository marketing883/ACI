import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, CheckCircle2, Globe, Users, TrendingUp, Clock, Utensils } from 'lucide-react';
import Button from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'Hospitality & Food Services Technology Solutions',
  description: 'Enterprise data, AI, and cloud solutions for hotels, restaurants, and food service companies. Global operations, customer engagement, and supply chain optimization.',
};

const solutions = [
  {
    title: 'Global Data Unification',
    description: 'Consolidate data from hundreds of locations worldwide into a single source of truth for real-time visibility.',
    outcomes: ['Single global data platform', 'Real-time operational visibility', '400K+ employees connected'],
    services: ['Data Engineering', 'Cloud Modernization'],
  },
  {
    title: 'Customer Engagement Platform',
    description: 'Build unified customer profiles that power personalized experiences across all touchpoints.',
    outcomes: ['360° guest profiles', '28% loyalty engagement lift', 'Omnichannel personalization'],
    services: ['MarTech & CDP', 'Data Engineering'],
  },
  {
    title: 'Supply Chain Optimization',
    description: 'AI-powered demand forecasting and inventory optimization to reduce waste and ensure availability.',
    outcomes: ['15% waste reduction', '22% inventory optimization', 'Predictive ordering'],
    services: ['Applied AI & ML', 'Data Engineering'],
  },
  {
    title: 'Workforce Management',
    description: 'Optimize staffing levels with AI-driven scheduling that balances cost efficiency with service quality.',
    outcomes: ['Labor cost optimization', 'Improved scheduling accuracy', 'Employee satisfaction boost'],
    services: ['Applied AI & ML', 'Digital Transformation'],
  },
  {
    title: 'Revenue Management',
    description: 'Dynamic pricing and revenue optimization powered by real-time market data and demand signals.',
    outcomes: ['8% RevPAR increase', 'Dynamic pricing enabled', 'Competitive rate intelligence'],
    services: ['Applied AI & ML', 'Data Engineering'],
  },
  {
    title: 'Operational Analytics',
    description: 'Real-time dashboards and KPI tracking across all locations for data-driven decision making.',
    outcomes: ['Executive dashboards', 'Location benchmarking', 'Operational excellence'],
    services: ['Data Engineering', 'Digital Transformation'],
  },
];

const caseStudies = [
  {
    client: 'Sodexo',
    type: 'Global Food Services',
    challenge: 'Unify data across 400,000+ employees in 53 countries to enable real-time workforce analytics and operational visibility',
    solution: 'Enterprise data platform on Azure with Databricks, enabling global HR analytics and operational dashboards',
    results: [
      { metric: '400K+', label: 'Employees on unified platform' },
      { metric: '53', label: 'Countries connected' },
      { metric: 'Real-time', label: 'Global visibility achieved' },
    ],
    technologies: ['Azure', 'Databricks', 'Power BI', 'SAP Integration'],
  },
  {
    client: 'Major Hotel Chain',
    type: 'Hospitality',
    challenge: 'Fragmented guest data across properties preventing personalized experiences and loyalty optimization',
    solution: 'Customer data platform with unified guest profiles powering personalized marketing and service delivery',
    results: [
      { metric: '28%', label: 'Increase in loyalty engagement' },
      { metric: '3.2x', label: 'ROI on marketing spend' },
      { metric: '45%', label: 'Faster guest recognition' },
    ],
    technologies: ['Salesforce CDP', 'AWS', 'Snowflake', 'Braze'],
  },
];

const capabilities = [
  { name: 'Multi-Brand Management', description: 'Unified systems across brands' },
  { name: 'Global Operations', description: 'Multi-region, multi-currency' },
  { name: 'POS Integration', description: 'All major systems supported' },
  { name: 'Food Safety Compliance', description: 'HACCP & regulatory tracking' },
  { name: 'Guest Privacy', description: 'GDPR & CCPA compliant' },
  { name: 'Franchise Analytics', description: 'Owner & operator dashboards' },
];

export default function HospitalityPage() {
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
              <Utensils className="w-8 h-8 text-white" />
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Hospitality & Food Services
            <span className="text-[var(--aci-primary-light)]"> Technology Solutions</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mb-8">
            From global food service operators to boutique hotel groups, we help hospitality
            companies unify their data, personalize guest experiences, and optimize operations
            across every location—delivering the insights you need to serve customers better.
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
                <Globe className="w-7 h-7 text-[var(--aci-primary)]" />
              </div>
              <h3 className="font-semibold text-[var(--aci-secondary)] mb-2">Global Scale</h3>
              <p className="text-gray-600 text-sm">
                Proven across 50+ countries and 400K+ employees.
              </p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Clock className="w-7 h-7 text-[var(--aci-primary)]" />
              </div>
              <h3 className="font-semibold text-[var(--aci-secondary)] mb-2">Real-Time Ops</h3>
              <p className="text-gray-600 text-sm">
                Live visibility into every location and metric.
              </p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-7 h-7 text-[var(--aci-primary)]" />
              </div>
              <h3 className="font-semibold text-[var(--aci-secondary)] mb-2">Guest Experience</h3>
              <p className="text-gray-600 text-sm">
                Personalized service that drives loyalty.
              </p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-7 h-7 text-[var(--aci-primary)]" />
              </div>
              <h3 className="font-semibold text-[var(--aci-secondary)] mb-2">ROI Focused</h3>
              <p className="text-gray-600 text-sm">
                Measurable impact on revenue and costs.
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
              Solutions for Hospitality & Food Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Purpose-built solutions that address the unique challenges of hospitality operations.
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
              Hospitality Success Stories
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
            Hospitality Capabilities
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {capabilities.map((item) => (
              <div key={item.name} className="bg-white p-4 rounded-lg flex items-center gap-4">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
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
            Ready to Elevate Your Hospitality Operations?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Schedule a consultation with our hospitality technology experts to discuss your challenges.
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
