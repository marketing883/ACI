// NOTE: Case Studies section is intentionally omitted on this page until sales
// supplies a client proof point. When available, add a `caseStudies` array and
// drop in a Case Studies section before the Process section — same pattern
// used on /services/data-engineering and /services/app-development.

import { Metadata } from 'next';
import { ArrowRight, CheckCircle, ChevronDown, Bug, Gauge, ShieldCheck, Zap, GitBranch, Brain, Activity, FileCheck, TrendingUp, Users } from 'lucide-react';
import Button from '@/components/ui/Button';
import { ServiceSchema, FAQSchema, BreadcrumbSchema } from '@/components/seo/StructuredData';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://aciinfotech.com';

export const metadata: Metadata = {
  title: 'QA & Testing Services | ACI Infotech',
  description: 'Production engineering discipline, not standalone testing. Automated test frameworks, CI/CD-integrated QA, AI-driven test coverage, performance and security testing as part of engineering delivery.',
  keywords: 'qa testing services, automated testing, CI/CD testing, AI driven test coverage, performance testing, security testing, test automation consulting',
  alternates: {
    canonical: `${siteUrl}/services/qa-testing`,
  },
};

// Service data
const keyOutcomes = [
  'Production-grade quality from day one, not a late-stage gate',
  'Shift-left testing embedded in delivery, not bolted on',
  'AI-driven test coverage that finds defects faster',
  'Zero regressions from releases — because testing runs continuously',
];

const offerings = [
  {
    id: 'automated-test-frameworks',
    title: 'Automated Test Frameworks',
    description: 'End-to-end, integration, and unit test frameworks built into your codebase. Not a spreadsheet of manual test cases — executable tests that run on every commit.',
    icon: Zap,
    technologies: ['Playwright', 'Cypress', 'Jest', 'Pytest', 'Selenium'],
    outcomes: ['90%+ automation coverage', 'Tests run in <10 minutes', 'Zero flaky tests policy'],
  },
  {
    id: 'cicd-integrated-qa',
    title: 'CI/CD-Integrated QA',
    description: 'Testing gates built into your deployment pipeline. Every pull request runs the full suite before merge — every merge hits production with confidence.',
    icon: GitBranch,
    technologies: ['GitHub Actions', 'GitLab CI', 'Jenkins', 'CircleCI', 'ArgoCD'],
    outcomes: ['Automated quality gates', 'Block bad merges at source', 'Deployment confidence'],
  },
  {
    id: 'ai-test-coverage',
    title: 'AI-Driven Test Coverage',
    description: 'ML-based test generation, self-healing test suites, and defect prediction. We use AI to find the test cases you haven\'t thought of yet.',
    icon: Brain,
    technologies: ['Mabl', 'Testim', 'Applitools', 'Custom ML Models'],
    outcomes: ['Test coverage up 3x', 'Self-healing UI tests', 'Predictive defect analysis'],
  },
  {
    id: 'defect-analytics',
    title: 'Defect Analytics & Root Cause',
    description: 'Track, analyze, and eliminate defect patterns. We don\'t just find bugs — we find the systemic causes and fix them at the root.',
    icon: Bug,
    technologies: ['Jira', 'SonarQube', 'Datadog', 'Custom Dashboards'],
    outcomes: ['60% reduction in repeat defects', 'Root cause analysis', 'Quality trend reporting'],
  },
  {
    id: 'performance-testing',
    title: 'Performance & Load Testing',
    description: 'Stress test your applications before production does. Load testing, performance benchmarking, and capacity planning integrated into delivery.',
    icon: Gauge,
    technologies: ['JMeter', 'k6', 'Locust', 'Gatling', 'BlazeMeter'],
    outcomes: ['Validated scale targets', 'Performance SLA baseline', 'No surprise outages'],
  },
  {
    id: 'security-testing',
    title: 'Security Testing',
    description: 'SAST, DAST, dependency scanning, and penetration testing as part of engineering delivery — not a separate audit at the end.',
    icon: ShieldCheck,
    technologies: ['OWASP ZAP', 'Snyk', 'Checkmarx', 'Burp Suite'],
    outcomes: ['Vulnerabilities caught pre-prod', 'Continuous security scanning', 'Compliance-ready audits'],
  },
];

const differentiators = [
  {
    title: 'QA as Engineering Discipline',
    description: "We don't treat QA as a gate at the end of delivery. It's embedded in the engineering process — automated, continuous, and owned by the delivery team.",
    proof: 'Testing is code, versioned and maintained',
  },
  {
    title: 'Embedded in Delivery Teams',
    description: 'Our QA engineers work alongside developers in the same sprints, not in a separate testing phase that slows everything down.',
    proof: 'One team, one cadence, one goal',
  },
  {
    title: 'Automated From Day One',
    description: "We don't retrofit automation after the fact. Test automation starts in sprint one — not sprint thirty when the tech debt catches up.",
    proof: '90%+ automation coverage standard',
  },
  {
    title: 'Production-Scale Testing',
    description: "We test at the scale your application actually runs at, not a toy environment with 10 fake users. Real data volumes, real load, real confidence.",
    proof: 'Load-tested to 10x expected peak',
  },
];

const beyondDelivery = [
  {
    title: 'Production Operations',
    description: '24/7 monitoring of test infrastructure, alerting on flaky tests, and continuous maintenance of automated suites as the application evolves.',
    icon: Activity,
  },
  {
    title: 'SLA-Backed Support',
    description: 'Contractual response times for test failures in CI/CD, defined escalation paths, and accountable ownership of quality gates.',
    icon: FileCheck,
  },
  {
    title: 'Continuous Optimization',
    description: 'Test suite performance tuning, coverage gap analysis, and defect trend monitoring — so quality improves over time, not degrades.',
    icon: TrendingUp,
  },
  {
    title: 'Evolution as Partners',
    description: "As your application changes, so does the test strategy. We stay with you for the long arc — evolving coverage, not just maintaining it.",
    icon: Users,
  },
];

const faqs = [
  {
    question: 'How is this different from traditional QA outsourcing?',
    answer: "We're not a staff-augmentation QA shop. We don't supply bodies to execute manual test cases. We build automated test infrastructure as part of engineering delivery, with the same production rigor as the rest of the system. If you need manual testing, regression testing, UAT support, or T&M QA staffing, we can refer you to a better-fit partner.",
  },
  {
    question: 'What tools and frameworks do you use?',
    answer: 'We default to Playwright for E2E, Jest/Pytest for unit and integration, JMeter or k6 for performance, and OWASP tooling for security. But we meet you where you are — if your team uses Cypress or Selenium, we work with what you have rather than forcing a stack change.',
  },
  {
    question: 'Do you do manual testing?',
    answer: "Not as a standalone service. Some exploratory testing is always part of a healthy QA practice, but we're not a manual regression shop. Our focus is automated, continuous, engineering-integrated quality — because that's what actually holds up at enterprise scale.",
  },
  {
    question: 'How do you integrate with our CI/CD pipeline?',
    answer: "We plug into whatever you're running — GitHub Actions, GitLab CI, Jenkins, CircleCI, Azure DevOps. Quality gates get wired into pull request checks, deployment stages, and post-deploy smoke tests. Test results flow back into your existing tools so there's no context switching.",
  },
];

export default function QATestingPage() {
  return (
    <>
      {/* Structured Data for SEO/AEO */}
      <ServiceSchema
        name="QA & Testing Services"
        description="Production engineering discipline, not standalone testing. Automated test frameworks, CI/CD-integrated QA, AI-driven test coverage, performance and security testing."
        url="/services/qa-testing"
        serviceType="QA and Testing Consulting"
      />
      <FAQSchema faqs={faqs} />
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: '/' },
          { name: 'Services', url: '/services' },
          { name: 'QA & Testing', url: '/services/qa-testing' },
        ]}
      />

      {/* Hero Section */}
      <section className="py-20 lg:py-28 bg-gradient-to-br from-[var(--aci-secondary)] to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-[var(--aci-primary-light)] font-semibold text-sm uppercase tracking-wide">
                QA & Testing
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-white mt-3 mb-6">
                Ship Fast. Break Nothing.
              </h1>
              <p className="text-lg text-gray-300 mb-8">
                QA as production engineering discipline — not a standalone testing service.
                Automated frameworks, CI/CD-integrated quality gates, and AI-driven test coverage,
                all embedded in how we deliver. This is how we make sure what we build actually holds up at enterprise scale.
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
                Automated from day one | CI/CD-integrated | AI-driven coverage
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button href="/contact?service=qa-testing" variant="primary" size="lg">
                  Talk to a QA Engineer
                </Button>
                <Button
                  href="/services"
                  variant="ghost"
                  size="lg"
                  className="text-white border-white hover:bg-white/10"
                >
                  See All Services
                </Button>
              </div>
            </div>

            {/* Visual - Testing Pipeline Diagram */}
            <div className="relative hidden lg:block">
              <div className="bg-gray-800 rounded-2xl p-8 shadow-2xl">
                <div className="text-sm text-gray-400 mb-4">Quality Pipeline</div>
                <div className="space-y-4">
                  {/* Code layer */}
                  <div className="flex gap-2">
                    {['Commit', 'PR', 'Merge'].map((src) => (
                      <div key={src} className="flex-1 bg-gray-700 rounded-lg p-3 text-center text-xs text-gray-300">
                        {src}
                      </div>
                    ))}
                  </div>
                  <div className="text-center text-gray-500">↓</div>
                  {/* Test layers */}
                  <div className="bg-[var(--aci-primary)]/20 rounded-lg p-4 text-center">
                    <div className="text-[var(--aci-primary-light)] font-medium">Automated Test Gates</div>
                    <div className="text-xs text-gray-400 mt-1">Unit • Integration • E2E • Security • Performance</div>
                  </div>
                  <div className="text-center text-gray-500">↓</div>
                  {/* Deployment */}
                  <div className="bg-[var(--aci-primary)]/30 rounded-lg p-4 text-center">
                    <div className="text-white font-bold">CI/CD Deployment</div>
                    <div className="text-xs text-gray-300 mt-1">Automated, gated, monitored</div>
                  </div>
                  <div className="text-center text-gray-500">↓</div>
                  {/* Production */}
                  <div className="flex gap-2">
                    {['Smoke Tests', 'Monitoring', 'Alerting'].map((dest) => (
                      <div key={dest} className="flex-1 bg-green-900/30 rounded-lg p-3 text-center text-xs text-green-300">
                        {dest}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="absolute -inset-4 bg-[var(--aci-primary)]/10 rounded-3xl blur-3xl -z-10"></div>
            </div>
          </div>
        </div>
      </section>

      {/* What We Test */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--aci-secondary)] mb-6">
              How We Actually Do QA
            </h2>
            <div className="space-y-4 text-gray-600">
              <p>
                QA, the way we do it, is an engineering discipline — not a late-stage gate,
                not a separate department, not a list of manual test cases executed by contractors.
                It's automated test infrastructure built into the same codebase as the application,
                maintained by the same engineers, and run on every commit.
              </p>
              <p>
                We don't do regression testing as a standalone service. We don't do UAT support.
                We don't staff a QA team on a T&M basis to execute your spreadsheet of test cases.
                Those things have their place — but they're not what ACI does, and we'll tell you that upfront.
              </p>
              <p className="font-semibold text-[var(--aci-secondary)]">
                What we do is make sure that what we build — or what you already run — actually holds up in production.
                At scale. Under load. Through releases. That's the discipline we bring.
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
              QA & Testing Services
            </h2>
            <p className="text-lg text-gray-600">
              Six core offerings, each delivered as part of engineering — not separate from it
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

      {/* Beyond Delivery — Managed Services */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--aci-secondary)] mb-4">
              Beyond Delivery
            </h2>
            <p className="text-lg text-gray-600">
              Quality isn't a one-time project. We stay with you to maintain, evolve,
              and optimize quality infrastructure as your application grows.
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
              Why Choose ACI for QA & Testing
            </h2>
            <p className="text-lg text-gray-600">
              What makes us different from traditional QA vendors
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
              Common Questions About QA & Testing
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
            Ready to Ship Fast Without Breaking Things?
          </h2>
          <p className="text-lg text-blue-100 mb-8">
            Schedule a 30-minute technical call with one of our QA engineers.
            No sales pitch — just a conversation about your quality challenges and how to solve them.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <span className="text-blue-200 text-sm">Talk to senior engineers, not sales reps</span>
            <span className="text-blue-300">|</span>
            <span className="text-blue-200 text-sm">30-minute technical discussion</span>
            <span className="text-blue-300">|</span>
            <span className="text-blue-200 text-sm">We'll tell you if we're not the right fit</span>
          </div>

          <Button href="/contact?service=qa-testing" variant="lime" size="lg">
            Talk to a QA Engineer
          </Button>
        </div>
      </section>
    </>
  );
}
