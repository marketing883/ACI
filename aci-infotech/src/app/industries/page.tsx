import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Building2, ShoppingCart, Heart, Factory, Zap, Truck, Utensils } from 'lucide-react';
import Button from '@/components/ui/Button';
import { BreadcrumbSchema } from '@/components/seo/StructuredData';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://aciinfotech.com';

export const metadata: Metadata = {
  title: 'Industries We Serve',
  description: 'ACI Infotech serves Fortune 500 companies across Financial Services, Retail, Healthcare, Manufacturing, Energy, and more with enterprise technology solutions.',
  alternates: {
    canonical: `${siteUrl}/industries`,
  },
};

const industries = [
  {
    id: 'financial-services',
    name: 'Financial Services',
    icon: Building2,
    tagline: 'Turn Data Into Competitive Advantage',
    description: 'Your data is fragmented across legacy systems while fraud evolves faster than your defenses. We consolidate your infrastructure, deploy real-time ML detection, and build the governance frameworks regulators demand, so you can innovate without compliance risk.',
    challenges: ['40+ legacy systems consolidated', 'Sub-second fraud scoring', 'Audit-ready data lineage', 'M&A data integration'],
    clients: ['MSCI', 'Gen II', 'Top 10 Investment Banks'],
    caseStudy: { metric: '$25M', description: 'Fraud losses eliminated annually' },
    href: '/industries/financial-services',
  },
  {
    id: 'retail',
    name: 'Retail & Consumer',
    icon: ShoppingCart,
    tagline: 'Know Your Customer, Everywhere',
    description: 'Customers expect personalization at every touchpoint, but your data sits in silos. We build unified customer profiles that power real-time recommendations, optimize inventory with AI, and turn every interaction into revenue.',
    challenges: ['Single customer view', 'Real-time personalization', 'AI demand forecasting', 'Inventory optimization'],
    clients: ['RaceTrac', 'Fortune 100 Retailers'],
    caseStudy: { metric: '$18M', description: 'Saved with AI demand forecasting' },
    href: '/industries/retail',
  },
  {
    id: 'healthcare',
    name: 'Healthcare & Life Sciences',
    icon: Heart,
    tagline: 'Accelerate Research, Protect Patients',
    description: 'Clinical breakthroughs are buried in data you can\'t access. We build HIPAA-compliant platforms that unify patient records, accelerate drug discovery timelines, and enable the analytics that improve outcomes without compromising privacy.',
    challenges: ['HIPAA-compliant analytics', 'Clinical data unification', 'Research acceleration', 'EHR interoperability'],
    clients: ['Regional Health Systems', 'Global Pharma Leaders'],
    caseStudy: { metric: '40%', description: 'Faster research data access' },
    href: '/industries/healthcare',
  },
  {
    id: 'hospitality',
    name: 'Hospitality & Food Services',
    icon: Utensils,
    tagline: 'One Platform, Global Operations',
    description: 'Your 400,000 employees across 50 countries generate data you can\'t see. We unify global operations onto a single platform, enabling real-time workforce analytics, personalized guest experiences, and supply chain visibility that reduces waste.',
    challenges: ['Global data unification', 'Real-time operations', 'Guest personalization', 'Supply chain optimization'],
    clients: ['Sodexo', 'Leading Hotel Chains'],
    caseStudy: { metric: '400K+', description: 'Employees on unified platform' },
    href: '/industries/hospitality',
  },
  {
    id: 'manufacturing',
    name: 'Manufacturing',
    icon: Factory,
    tagline: 'Predict Problems Before They Cost You',
    description: 'Unplanned downtime costs you millions while quality issues slip through. We deploy IoT analytics and predictive maintenance that catch failures before they happen, optimize production lines, and deliver the visibility Industry 4.0 promises.',
    challenges: ['Predictive maintenance', 'Quality anomaly detection', 'Production optimization', 'IoT data at scale'],
    clients: ['Global Manufacturers', 'Industrial OEMs'],
    caseStudy: { metric: '67%', description: 'Reduction in unplanned downtime' },
    href: '/industries/manufacturing',
  },
  {
    id: 'energy',
    name: 'Energy & Utilities',
    icon: Zap,
    tagline: 'Secure Infrastructure, Reliable Grid',
    description: 'NERC CIP audits loom while renewables complicate your grid. We implement the secure infrastructure and compliance frameworks regulators require, plus the analytics that optimize generation, predict demand, and integrate clean energy sources.',
    challenges: ['NERC CIP compliance', 'Grid load optimization', 'Renewable integration', 'Critical infrastructure security'],
    clients: ['Regional Utilities', 'Energy Producers'],
    caseStudy: { metric: '100%', description: 'NERC CIP audit compliance' },
    href: '/industries/energy',
  },
  {
    id: 'transportation',
    name: 'Transportation & Logistics',
    icon: Truck,
    tagline: 'Visibility That Drives Profitability',
    description: 'Fuel costs rise while empty miles erode margins. We deploy AI route optimization that cuts costs, real-time tracking that customers demand, and predictive maintenance that keeps your fleet moving. This turns logistics into competitive advantage.',
    challenges: ['AI route optimization', 'Fleet visibility', 'Predictive maintenance', 'Carbon tracking & ESG'],
    clients: ['Fortune 500 Logistics Leaders'],
    caseStudy: { metric: '$30M', description: 'Annual fuel cost savings' },
    href: '/industries/transportation',
  },
];

export default function IndustriesPage() {
  return (
    <main className="min-h-screen">
      {/* Structured Data for SEO */}
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: '/' },
          { name: 'Industries', url: '/industries' },
        ]}
      />

      {/* Hero Section */}
      <section className="bg-[var(--aci-secondary)] pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <p className="text-[var(--aci-primary-light)] font-medium mb-4 tracking-wide uppercase">
              Industries We Serve
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Deep Expertise Across
              <span className="text-[var(--aci-primary-light)]"> Industries That Matter</span>
            </h1>
            <p className="text-xl text-gray-400 mb-8">
              We don't just understand technology, we understand your business. Our consultants bring
              industry-specific expertise to every engagement, speaking your language and solving
              your unique challenges.
            </p>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-4 gap-6 mt-12">
            <div className="bg-gray-800 rounded-xl p-6 text-center">
              <div className="text-4xl font-bold text-white mb-2">15+</div>
              <div className="text-gray-400">Industries Served</div>
            </div>
            <div className="bg-gray-800 rounded-xl p-6 text-center">
              <div className="text-4xl font-bold text-white mb-2">80+</div>
              <div className="text-gray-400">Enterprise Clients</div>
            </div>
            <div className="bg-gray-800 rounded-xl p-6 text-center">
              <div className="text-4xl font-bold text-white mb-2">98%</div>
              <div className="text-gray-400">Client Retention</div>
            </div>
            <div className="bg-gray-800 rounded-xl p-6 text-center">
              <div className="text-4xl font-bold text-white mb-2">$500M+</div>
              <div className="text-gray-400">Value Delivered</div>
            </div>
          </div>
        </div>
      </section>

      {/* Industries Grid */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {industries.map((industry, index) => {
              const Icon = industry.icon;
              const isEven = index % 2 === 0;

              return (
                <div
                  key={industry.id}
                  className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-shadow"
                >
                  <div className="flex flex-col lg:flex-row gap-8">
                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-14 h-14 bg-[var(--aci-primary)] rounded-xl flex items-center justify-center">
                          <Icon className="w-7 h-7 text-white" />
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold text-[var(--aci-secondary)]">
                            {industry.name}
                          </h2>
                          <p className="text-[var(--aci-primary)] font-medium">{industry.tagline}</p>
                        </div>
                      </div>

                      <p className="text-gray-600 mb-6">{industry.description}</p>

                      {/* Challenges */}
                      <div className="mb-6">
                        <h4 className="text-sm font-semibold text-gray-500 capitalize mb-3">
                          Challenges We Solve
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {industry.challenges.map((challenge) => (
                            <span
                              key={challenge}
                              className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                            >
                              {challenge}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Clients */}
                      <div className="mb-6">
                        <h4 className="text-sm font-semibold text-gray-500 capitalize mb-2">
                          Representative Clients
                        </h4>
                        <p className="text-gray-600 text-sm">{industry.clients.join(' • ')}</p>
                      </div>

                      <Link
                        href={industry.href}
                        className="inline-flex items-center gap-2 text-[var(--aci-primary)] font-semibold hover:gap-3 transition-all"
                      >
                        Learn More <ArrowRight className="w-5 h-5" />
                      </Link>
                    </div>

                    {/* Case Study Highlight */}
                    <div className="lg:w-72 flex-shrink-0">
                      <div className="bg-[var(--aci-secondary)] rounded-xl p-6 text-center">
                        <div className="text-4xl font-bold text-white mb-2">{industry.caseStudy.metric}</div>
                        <div className="text-gray-400 text-sm">{industry.caseStudy.description}</div>
                        <Link
                          href="/case-studies"
                          className="inline-flex items-center gap-1 text-[var(--aci-primary-light)] text-sm mt-4 hover:underline"
                        >
                          View Case Studies <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[var(--aci-primary)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Don't See Your Industry?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            We work with enterprises across many sectors. Let's discuss how our expertise
            can apply to your specific challenges.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button href="/contact?reason=architecture-call" variant="secondary" size="lg">
              Schedule Architecture Call
            </Button>
            <Button href="/services" variant="ghost" size="lg" className="text-white border-white hover:bg-white/10">
              View Our Services
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
