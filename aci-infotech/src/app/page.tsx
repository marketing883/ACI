import Link from 'next/link';
import { ArrowRight, Database, Brain, Cloud, Users, Shield, Zap } from 'lucide-react';
import Button from '@/components/ui/Button';
import { StatsGrid } from '@/components/ui/StatDisplay';

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-50 to-white py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            {/* Eyebrow */}
            <p className="text-[var(--aci-primary)] font-semibold mb-4">
              Engineers Who Stay
            </p>

            {/* Headline */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[var(--aci-secondary)] mb-6 font-[var(--font-title)]">
              Production-Grade Engineering at Enterprise Scale
            </h1>

            {/* Subheadline */}
            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              We build data platforms, AI systems, and cloud architectures that run Fortune 500 operations.
              Senior architects lead every project. We ship production code with SLAs.
              We answer the 2am call.
            </p>

            {/* Stats Row */}
            <div className="flex flex-wrap justify-center gap-8 md:gap-16 mb-10">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-[var(--aci-primary)]">19</div>
                <div className="text-sm text-gray-500">Years Building Enterprise Systems</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-[var(--aci-primary)]">80+</div>
                <div className="text-sm text-gray-500">Fortune 500 Clients</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-[var(--aci-primary)]">1,250+</div>
                <div className="text-sm text-gray-500">Engineers Worldwide</div>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button href="/case-studies" variant="primary" size="lg">
                See Our Case Studies
              </Button>
              <Button href="/contact" variant="secondary" size="lg">
                Talk to an Architect
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Why We're Different Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--aci-secondary)] mb-4">
              Why We're Different
            </h2>
            <p className="text-lg text-gray-600">
              Most firms build and leave. We build, deploy, and stand behind it.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-lg transition-shadow">
              <div className="text-4xl font-bold text-[var(--aci-primary)] mb-2">70%</div>
              <div className="text-sm text-gray-500 mb-4">Senior architects with 10+ years</div>
              <h3 className="text-xl font-semibold text-[var(--aci-secondary)] mb-3">
                Engineers Who've Been on the Call
              </h3>
              <p className="text-gray-600">
                Your project lead has 15-20 years enterprise experience and has built this specific
                system 10+ times. Not junior analysts learning on your time.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-lg transition-shadow">
              <div className="text-4xl font-bold text-[var(--aci-primary)] mb-2">100%</div>
              <div className="text-sm text-gray-500 mb-4">Production deployments with SLAs</div>
              <h3 className="text-xl font-semibold text-[var(--aci-secondary)] mb-3">
                Production Code, Not PowerPoints
              </h3>
              <p className="text-gray-600">
                We ship working systems with SLAs. Databricks lakehouses. Salesforce CDP integrations.
                AWS cloud architectures. Every line designed for production scale.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-lg transition-shadow">
              <div className="text-4xl font-bold text-[var(--aci-primary)] mb-2">80+</div>
              <div className="text-sm text-gray-500 mb-4">Fortune 500 clients</div>
              <h3 className="text-xl font-semibold text-[var(--aci-secondary)] mb-3">
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
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--aci-secondary)] mb-4">
              What We Build
            </h2>
            <p className="text-lg text-gray-600">
              Enterprise systems that run 24/7, backed by SLAs
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Data Engineering */}
            <Link href="/services/data-engineering" className="group">
              <div className="bg-gray-50 p-6 rounded-xl hover:shadow-lg transition-all hover:-translate-y-1">
                <Database className="w-10 h-10 text-[var(--aci-primary)] mb-4" />
                <h3 className="text-xl font-semibold text-[var(--aci-secondary)] mb-2 group-hover:text-[var(--aci-primary)]">
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

            {/* AI & ML */}
            <Link href="/services/applied-ai-ml" className="group">
              <div className="bg-gray-50 p-6 rounded-xl hover:shadow-lg transition-all hover:-translate-y-1">
                <Brain className="w-10 h-10 text-[var(--aci-primary)] mb-4" />
                <h3 className="text-xl font-semibold text-[var(--aci-secondary)] mb-2 group-hover:text-[var(--aci-primary)]">
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

            {/* Cloud */}
            <Link href="/services/cloud-modernization" className="group">
              <div className="bg-gray-50 p-6 rounded-xl hover:shadow-lg transition-all hover:-translate-y-1">
                <Cloud className="w-10 h-10 text-[var(--aci-primary)] mb-4" />
                <h3 className="text-xl font-semibold text-[var(--aci-secondary)] mb-2 group-hover:text-[var(--aci-primary)]">
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

            {/* MarTech */}
            <Link href="/services/martech-cdp" className="group">
              <div className="bg-gray-50 p-6 rounded-xl hover:shadow-lg transition-all hover:-translate-y-1">
                <Users className="w-10 h-10 text-[var(--aci-primary)] mb-4" />
                <h3 className="text-xl font-semibold text-[var(--aci-secondary)] mb-2 group-hover:text-[var(--aci-primary)]">
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

            {/* Digital Transformation */}
            <Link href="/services/digital-transformation" className="group">
              <div className="bg-gray-50 p-6 rounded-xl hover:shadow-lg transition-all hover:-translate-y-1">
                <Zap className="w-10 h-10 text-[var(--aci-primary)] mb-4" />
                <h3 className="text-xl font-semibold text-[var(--aci-secondary)] mb-2 group-hover:text-[var(--aci-primary)]">
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

            {/* Cyber Security */}
            <Link href="/services/cyber-security" className="group">
              <div className="bg-gray-50 p-6 rounded-xl hover:shadow-lg transition-all hover:-translate-y-1">
                <Shield className="w-10 h-10 text-[var(--aci-primary)] mb-4" />
                <h3 className="text-xl font-semibold text-[var(--aci-secondary)] mb-2 group-hover:text-[var(--aci-primary)]">
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

      {/* CTA Section */}
      <section className="py-20 bg-[var(--aci-primary)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
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
              Schedule Architecture Call
            </Button>
            <Button
              href="/case-studies"
              variant="ghost"
              size="lg"
              className="text-white border-white hover:bg-white/10"
            >
              See Our Case Studies
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
