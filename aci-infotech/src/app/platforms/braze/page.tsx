import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, CheckCircle2, Award, MessageSquare, Zap, TrendingUp, Users } from 'lucide-react';
import Button from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'Braze Implementation Services',
  description: 'ACI Infotech is a Braze Alloy Partner. Customer engagement, lifecycle marketing, and real-time personalization implementation.',
};

const capabilities = [
  {
    title: 'Platform Implementation',
    description: 'End-to-end Braze implementation with SDK integration, data pipelines, and campaign setup.',
    features: ['SDK integration', 'Data architecture', 'Template setup', 'Team training'],
  },
  {
    title: 'Customer Journey Orchestration',
    description: 'Design and implement automated customer journeys across email, push, SMS, and in-app.',
    features: ['Canvas flows', 'Multi-channel journeys', 'Trigger automation', 'A/B testing'],
  },
  {
    title: 'Data Integration',
    description: 'Connect Braze to your data warehouse, CDP, and enterprise systems for real-time personalization.',
    features: ['Currents setup', 'CDP integration', 'Real-time sync', 'Data transformation'],
  },
  {
    title: 'Personalization at Scale',
    description: 'Implement dynamic content, recommendation engines, and AI-powered send time optimization.',
    features: ['Liquid templating', 'Connected Content', 'Intelligent timing', 'Predictive analytics'],
  },
  {
    title: 'Migration Services',
    description: 'Migrate from legacy ESPs or competing platforms to Braze with zero disruption.',
    features: ['Platform audit', 'Data migration', 'Template conversion', 'Parallel testing'],
  },
  {
    title: 'Managed Services',
    description: 'Ongoing Braze optimization, campaign management, and strategic support.',
    features: ['Campaign operations', 'Performance optimization', 'Deliverability', 'Strategic guidance'],
  },
];

const caseStudies = [
  {
    client: 'RaceTrac',
    industry: 'Retail',
    challenge: 'Fragmented engagement across 800+ convenience stores with no real-time capabilities',
    solution: 'Braze implementation with real-time triggers, location-based messaging, and loyalty integration',
    results: ['35% engagement lift', '$2.3M incremental revenue', 'Real-time personalization'],
  },
  {
    client: 'E-commerce Brand',
    industry: 'Retail',
    challenge: 'Low email engagement and no mobile push strategy',
    solution: 'Full Braze implementation with lifecycle campaigns and predictive send time',
    results: ['52% higher open rates', '3x push opt-ins', '28% revenue from Braze'],
  },
];

const channels = [
  { name: 'Email', color: 'bg-blue-100 text-blue-700' },
  { name: 'Push Notifications', color: 'bg-green-100 text-green-700' },
  { name: 'SMS/MMS', color: 'bg-purple-100 text-purple-700' },
  { name: 'In-App Messages', color: 'bg-orange-100 text-orange-700' },
  { name: 'Content Cards', color: 'bg-pink-100 text-pink-700' },
  { name: 'Webhooks', color: 'bg-cyan-100 text-cyan-700' },
];

export default function BrazePage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-[var(--aci-secondary)] pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/platforms"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            All Platforms
          </Link>

          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-[#ED4B4B] rounded-2xl flex items-center justify-center">
              <MessageSquare className="w-8 h-8 text-white" />
            </div>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-[#ED4B4B]/20 text-[#ED4B4B] text-sm font-medium rounded-full flex items-center gap-1">
                <Award className="w-4 h-4" />
                Alloy Partner
              </span>
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Braze Customer
            <span className="text-[var(--aci-primary-light)]"> Engagement Platform</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mb-8">
            As a Braze Alloy Partner, we help brands build meaningful customer relationships
            through personalized, cross-channel engagement. From implementation to optimization,
            we unlock the full power of Braze.
          </p>

          <div className="flex flex-wrap gap-4">
            <Button href="/contact?reason=architecture-call" variant="primary" size="lg">
              Schedule Braze Assessment
            </Button>
            <Button href="/case-studies" variant="secondary" size="lg">
              View Case Studies
            </Button>
          </div>
        </div>
      </section>

      {/* Channels */}
      <section className="py-12 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-center font-semibold text-gray-500 mb-6">Channels We Implement</h3>
          <div className="flex flex-wrap justify-center gap-3">
            {channels.map((channel) => (
              <span key={channel.name} className={`px-4 py-2 ${channel.color} text-sm font-medium rounded-full`}>
                {channel.name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Value Props */}
      <section className="py-16 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-14 h-14 bg-[#ED4B4B]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Zap className="w-7 h-7 text-[#ED4B4B]" />
              </div>
              <h3 className="font-semibold text-[var(--aci-secondary)] mb-2">Certified Team</h3>
              <p className="text-gray-600 text-sm">
                Braze-certified consultants with deep platform expertise.
              </p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-[#ED4B4B]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-7 h-7 text-[#ED4B4B]" />
              </div>
              <h3 className="font-semibold text-[var(--aci-secondary)] mb-2">Proven ROI</h3>
              <p className="text-gray-600 text-sm">
                Average 35% lift in customer engagement for our clients.
              </p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-[#ED4B4B]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-7 h-7 text-[#ED4B4B]" />
              </div>
              <h3 className="font-semibold text-[var(--aci-secondary)] mb-2">Full Lifecycle</h3>
              <p className="text-gray-600 text-sm">
                From implementation to ongoing managed services.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--aci-secondary)] mb-4">
              What We Deliver
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              End-to-end Braze services from implementation to managed operations.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {capabilities.map((cap) => (
              <div key={cap.title} className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-xl font-bold text-[var(--aci-secondary)] mb-3">{cap.title}</h3>
                <p className="text-gray-600 mb-4">{cap.description}</p>
                <ul className="space-y-2">
                  {cap.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-gray-700">
                      <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
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
              Braze Success Stories
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {caseStudies.map((cs, index) => (
              <div key={index} className="bg-gray-50 rounded-2xl p-8">
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-3 py-1 bg-[#ED4B4B]/10 text-[#ED4B4B] text-sm font-medium rounded-full">
                    {cs.industry}
                  </span>
                  <span className="text-gray-500 text-sm">{cs.client}</span>
                </div>

                <div className="mb-6">
                  <h3 className="font-semibold text-gray-700 mb-2">Challenge</h3>
                  <p className="text-gray-600">{cs.challenge}</p>
                </div>

                <div className="mb-6">
                  <h3 className="font-semibold text-gray-700 mb-2">Solution</h3>
                  <p className="text-gray-600">{cs.solution}</p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-700 mb-3">Results</h3>
                  <div className="flex flex-wrap gap-3">
                    {cs.results.map((result) => (
                      <span key={result} className="px-3 py-2 bg-green-100 text-green-700 text-sm font-medium rounded-lg">
                        {result}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#ED4B4B]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Transform Customer Engagement?
          </h2>
          <p className="text-xl text-red-100 mb-8">
            Schedule a free assessment with our Braze certified consultants.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button href="/contact?reason=architecture-call" variant="secondary" size="lg">
              Schedule Free Assessment
            </Button>
            <Button href="/platforms" variant="ghost" size="lg" className="text-white border-white hover:bg-white/10">
              Explore Other Platforms
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
