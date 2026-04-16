import { Metadata } from 'next';
import { ArrowRight, CheckCircle } from 'lucide-react';
import Button from '@/components/ui/Button';
import { ServiceSchema, FAQSchema, BreadcrumbSchema } from '@/components/seo/StructuredData';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://aciinfotech.com';

export const metadata: Metadata = {
  title: 'Quality Engineering Services | ACI Infotech',
  description:
    'Quality as an engineering discipline, not a test phase. AI-augmented, continuous, and owned by the team that ships. In-sprint automation, agentic coverage, CI/CD gates, production observability.',
  keywords:
    'quality engineering, QE services, AI-augmented testing, agentic test automation, continuous testing, shift-left quality, in-sprint automation, CI/CD quality gates, performance engineering, security testing',
  alternates: {
    canonical: `${siteUrl}/services/quality-engineering`,
  },
};

// Hero copy kept short so the H1 never widows and the sub-head reads
// as two clean lines at the preview desktop width.
const heroKeyOutcomes = [
  'Tests that run on every commit, not once at release',
  'AI agents that generate, maintain, and self-heal suites',
  'Production telemetry feeding test strategy, not guesswork',
  'Zero regressions as a default, not a promise',
];

// Placeholder FAQs used only for the FAQSchema structured data in this
// first pass. Full FAQ UI ships in a later sub-task and will replace
// this array with the final copy.
const faqsForSchema = [
  {
    question: 'How is Quality Engineering different from QA and testing?',
    answer:
      'QA ran at the end, by a separate team, against a spreadsheet of manual cases. QE runs throughout delivery, owned by the same engineers who write the code, with automated suites and AI agents maintaining coverage.',
  },
];

export default function QualityEngineeringPage() {
  return (
    <>
      <ServiceSchema
        name="Quality Engineering Services"
        description="Quality as an engineering discipline, not a test phase. AI-augmented, continuous, and owned by the team that ships."
        url="/services/quality-engineering"
        serviceType="Quality Engineering Consulting"
      />
      <FAQSchema faqs={faqsForSchema} />
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: '/' },
          { name: 'Services', url: '/services' },
          { name: 'Quality Engineering', url: '/services/quality-engineering' },
        ]}
      />

      {/* Hero Section */}
      <section className="py-20 lg:py-28 bg-gradient-to-br from-[var(--aci-secondary)] to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left column: copy */}
            <div>
              <span className="text-[var(--aci-primary-light)] font-semibold text-sm uppercase tracking-wide">
                Quality Engineering
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mt-3 mb-6 leading-tight">
                Quality, engineered in.
              </h1>
              <p className="text-lg text-gray-300 mb-8 max-w-xl">
                Quality as an engineering discipline, not a test phase.
                AI-augmented, continuous, and owned by the team that ships.
              </p>

              <ul className="space-y-3 mb-8">
                {heroKeyOutcomes.map((outcome) => (
                  <li key={outcome} className="flex items-start gap-3 text-gray-300">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span>{outcome}</span>
                  </li>
                ))}
              </ul>

              <p className="text-sm text-[var(--aci-primary-light)] mb-8">
                In-sprint automation | Agentic AI | Observability-fed
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  href="/contact?service=quality-engineering"
                  variant="primary"
                  size="lg"
                >
                  Talk to a QE engineer
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button
                  href="/services"
                  variant="ghost"
                  size="lg"
                  className="text-white border-white hover:bg-white/10"
                >
                  See all services
                </Button>
              </div>
            </div>

            {/* Right column: Quality Loop infographic. Built in a
                follow-up sub-task so the page scaffold can land
                first for review. */}
            <div className="relative hidden lg:block">
              <div className="bg-gray-800/80 rounded-2xl p-8 shadow-2xl border border-gray-700/50 min-h-[460px] flex items-center justify-center">
                <div className="text-sm text-gray-500 font-mono">
                  Quality Loop infographic (next sub-task)
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
