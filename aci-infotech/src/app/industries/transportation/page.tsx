import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, CheckCircle2, MapPin, Clock, TrendingDown, Leaf, Truck } from 'lucide-react';
import Button from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'Transportation & Logistics Technology Solutions',
  description: 'Enterprise data, AI, and cloud solutions for logistics companies, freight carriers, and supply chain operators. Route optimization, real-time tracking, and predictive analytics.',
};

const solutions = [
  {
    title: 'Route Optimization',
    description: 'AI-powered route planning that reduces fuel costs, improves delivery times, and maximizes fleet utilization.',
    outcomes: ['15% fuel cost reduction', '20% more deliveries/day', 'Real-time re-routing'],
    services: ['Applied AI & ML', 'Data Engineering'],
  },
  {
    title: 'Real-Time Fleet Visibility',
    description: 'Track every vehicle, shipment, and driver in real-time with IoT integration and live dashboards.',
    outcomes: ['100% fleet visibility', 'ETA accuracy >95%', 'Instant exception alerts'],
    services: ['Data Engineering', 'Cloud Modernization'],
  },
  {
    title: 'Predictive Maintenance',
    description: 'Prevent breakdowns before they happen with ML models that analyze vehicle sensor data and maintenance history.',
    outcomes: ['40% fewer breakdowns', '25% maintenance cost reduction', 'Extended asset life'],
    services: ['Applied AI & ML', 'Data Engineering'],
  },
  {
    title: 'Supply Chain Analytics',
    description: 'End-to-end visibility across your supply chain with advanced analytics for demand planning and inventory optimization.',
    outcomes: ['30% inventory reduction', 'Demand forecast accuracy', 'Supplier performance tracking'],
    services: ['Data Engineering', 'Applied AI & ML'],
  },
  {
    title: 'Carbon Footprint Tracking',
    description: 'Measure, report, and reduce emissions across your operations with real-time sustainability dashboards.',
    outcomes: ['Scope 1-3 tracking', 'Automated ESG reporting', '18% emissions reduction'],
    services: ['Data Engineering', 'Digital Transformation'],
  },
  {
    title: 'Driver Performance & Safety',
    description: 'Improve driver behavior, reduce accidents, and lower insurance costs with AI-powered coaching.',
    outcomes: ['32% accident reduction', 'Lower insurance premiums', 'Driver scorecards'],
    services: ['Applied AI & ML', 'Data Engineering'],
  },
];

const caseStudies = [
  {
    client: 'Fortune 500 Logistics Company',
    type: 'Freight & Logistics',
    challenge: 'Rising fuel costs and inefficient routing costing millions annually, with limited visibility into fleet performance',
    solution: 'AI-powered route optimization platform with real-time fleet tracking and predictive analytics',
    results: [
      { metric: '$30M', label: 'Annual fuel cost savings' },
      { metric: '22%', label: 'Improvement in on-time delivery' },
      { metric: '18%', label: 'Reduction in empty miles' },
    ],
    technologies: ['AWS', 'Databricks', 'IoT Sensors', 'Python ML'],
  },
  {
    client: 'Regional Trucking Company',
    type: 'Transportation',
    challenge: 'High maintenance costs and unexpected breakdowns disrupting operations and customer commitments',
    solution: 'Predictive maintenance system using telematics data and ML to forecast vehicle service needs',
    results: [
      { metric: '40%', label: 'Reduction in breakdowns' },
      { metric: '$4.2M', label: 'Annual maintenance savings' },
      { metric: '15%', label: 'Extended vehicle lifespan' },
    ],
    technologies: ['Azure IoT', 'Snowflake', 'TensorFlow', 'Power BI'],
  },
];

const capabilities = [
  { name: 'TMS Integration', description: 'All major systems supported' },
  { name: 'ELD Compliance', description: 'Hours of service tracking' },
  { name: 'IoT & Telematics', description: 'Real-time sensor data' },
  { name: 'EDI/API Connectivity', description: 'Partner integrations' },
  { name: 'FMCSA Compliance', description: 'Regulatory requirements' },
  { name: 'Multi-Modal Support', description: 'Truck, rail, air, ocean' },
];

export default function TransportationPage() {
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
              <Truck className="w-8 h-8 text-white" />
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Transportation & Logistics
            <span className="text-[var(--aci-primary-light)]"> Technology Solutions</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mb-8">
            From global freight carriers to regional delivery fleets, we help transportation
            and logistics companies optimize every mile. We reduce costs, improve visibility,
            and deliver the insights you need to stay competitive in a demanding market.
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
                <TrendingDown className="w-7 h-7 text-[var(--aci-primary)]" />
              </div>
              <h3 className="font-semibold text-[var(--aci-secondary)] mb-2">Cost Reduction</h3>
              <p className="text-gray-600 text-sm">
                $30M+ fuel savings for enterprise fleets.
              </p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-7 h-7 text-[var(--aci-primary)]" />
              </div>
              <h3 className="font-semibold text-[var(--aci-secondary)] mb-2">Real-Time Tracking</h3>
              <p className="text-gray-600 text-sm">
                100% visibility across your entire fleet.
              </p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Clock className="w-7 h-7 text-[var(--aci-primary)]" />
              </div>
              <h3 className="font-semibold text-[var(--aci-secondary)] mb-2">Predictive Power</h3>
              <p className="text-gray-600 text-sm">
                AI that prevents problems before they happen.
              </p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Leaf className="w-7 h-7 text-[var(--aci-primary)]" />
              </div>
              <h3 className="font-semibold text-[var(--aci-secondary)] mb-2">Sustainability</h3>
              <p className="text-gray-600 text-sm">
                Meet ESG goals with emissions tracking.
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
              Solutions for Transportation & Logistics
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Purpose-built solutions that address the unique challenges of moving goods efficiently.
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
              Transportation & Logistics Success Stories
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
            Transportation & Logistics Capabilities
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
            Ready to Optimize Your Logistics Operations?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Schedule a consultation with our transportation technology experts to discuss your challenges.
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
