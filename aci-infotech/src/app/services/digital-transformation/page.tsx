import { Metadata } from 'next';
import { ArrowRight, CheckCircle, ChevronDown, Zap, Bot, FileText, Workflow, Settings, BarChart } from 'lucide-react';
import Button from '@/components/ui/Button';
import { ServiceSchema, FAQSchema, BreadcrumbSchema } from '@/components/seo/StructuredData';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://aciinfotech.com';

export const metadata: Metadata = {
  title: 'Digital Transformation Services | ACI Infotech',
  description: 'Intelligent process automation. ServiceNow workflows, RPA, document processing. Automate what humans shouldn\'t do manually. 40% reduction in manual processes.',
  keywords: 'digital transformation, RPA, ServiceNow, process automation, intelligent automation, enterprise automation',
  alternates: {
    canonical: `${siteUrl}/services/digital-transformation`,
  },
};

const keyOutcomes = [
  '40% reduction in manual processes',
  'Straight-through processing for routine tasks',
  'Human-in-the-loop where judgment matters',
  'Measurable ROI on automation investments',
];

const offerings = [
  {
    id: 'servicenow',
    title: 'ServiceNow Implementation',
    description: 'ITSM, HRSD, Customer Service Management, workflows that actually get used.',
    icon: Workflow,
    technologies: ['ServiceNow', 'ITSM', 'HRSD', 'CSM'],
    outcomes: ['50% faster ticket resolution', 'Self-service adoption', 'Unified service experience'],
  },
  {
    id: 'rpa',
    title: 'Robotic Process Automation',
    description: 'UiPath, Power Automate, Automation Anywhere, bots that free humans for higher-value work.',
    icon: Bot,
    technologies: ['UiPath', 'Power Automate', 'Automation Anywhere'],
    outcomes: ['80% reduction in manual work', '24/7 processing', 'Zero-error execution'],
  },
  {
    id: 'document-ai',
    title: 'Intelligent Document Processing',
    description: 'OCR, document classification, and data extraction at scale.',
    icon: FileText,
    technologies: ['Azure Document AI', 'AWS Textract', 'Google Document AI'],
    outcomes: ['95% extraction accuracy', 'Hours to seconds', 'Human review for exceptions'],
  },
  {
    id: 'workflow-automation',
    title: 'Workflow Automation',
    description: 'End-to-end process automation connecting systems, people, and decisions.',
    icon: Settings,
    technologies: ['Power Platform', 'Camunda', 'Nintex'],
    outcomes: ['Automated approvals', 'Process visibility', 'Compliance tracking'],
  },
  {
    id: 'process-mining',
    title: 'Process Mining & Discovery',
    description: 'Understand your actual processes before automating. Data-driven improvement.',
    icon: BarChart,
    technologies: ['Celonis', 'UiPath Process Mining', 'Power BI'],
    outcomes: ['Process visibility', 'Bottleneck identification', 'ROI prioritization'],
  },
  {
    id: 'integration',
    title: 'Integration & APIs',
    description: 'MuleSoft, Workato, and custom APIs that connect your systems.',
    icon: Zap,
    technologies: ['MuleSoft', 'Workato', 'Azure Logic Apps'],
    outcomes: ['Connected systems', 'Real-time data flow', 'API governance'],
  },
];

const caseStudies = [
  {
    slug: 'finance-automation',
    client: 'Fortune 500 Financial',
    industry: 'Financial Services',
    challenge: 'Manual accounts payable processing taking 5 days average',
    results: [
      { metric: '80%', description: 'Reduction in processing time' },
      { metric: '$2M', description: 'Annual savings' },
      { metric: '0.1%', description: 'Error rate' },
    ],
    technologies: ['UiPath', 'Azure Document AI', 'SAP'],
  },
  {
    slug: 'hr-transformation',
    client: 'Global Manufacturer',
    industry: 'Manufacturing',
    challenge: 'HR requests lost in email, no visibility on status',
    results: [
      { metric: '60%', description: 'Faster request resolution' },
      { metric: 'Self-service', description: 'Employee portal' },
      { metric: '90%', description: 'Employee satisfaction' },
    ],
    technologies: ['ServiceNow', 'HRSD', 'Integration Hub'],
  },
  {
    slug: 'customer-service',
    client: 'Insurance Provider',
    industry: 'Insurance',
    challenge: 'Claims processing backlog growing, customer complaints rising',
    results: [
      { metric: '50%', description: 'Faster claims processing' },
      { metric: '40%', description: 'Reduction in backlog' },
      { metric: '25%', description: 'Improvement in NPS' },
    ],
    technologies: ['ServiceNow CSM', 'Document AI', 'RPA'],
  },
];

const differentiators = [
  {
    title: 'Process-First Approach',
    description: "We understand your processes before automating. Process mining and discovery first, then targeted automation.",
    proof: 'Data-driven automation decisions',
  },
  {
    title: 'Human-in-the-Loop',
    description: "We automate routine tasks and keep humans where judgment matters. Not automation for automation's sake.",
    proof: 'Balanced automation approach',
  },
  {
    title: 'Measurable ROI',
    description: 'Every automation project has clear metrics. We track time saved, errors reduced, and dollars returned.',
    proof: 'Average 300% ROI in year one',
  },
  {
    title: 'Enterprise-Grade Quality',
    description: 'Same engineering rigor we apply to data platforms. Automated testing, monitoring, and support.',
    proof: 'Production-grade automation',
  },
];

const faqs = [
  {
    question: 'Where should we start with automation?',
    answer: 'Start with process discovery. We help you identify high-volume, repetitive processes with clear ROI. Typical quick wins: accounts payable, employee onboarding, report generation.',
  },
  {
    question: 'How long does an RPA implementation take?',
    answer: '4-8 weeks for initial bot deployment. Enterprise-wide programs take 6-12 months. We recommend starting small, proving value, then scaling.',
  },
  {
    question: 'What about change management?',
    answer: "Automation changes how people work. We include change management in every project, communication, training, and support to ensure adoption.",
  },
  {
    question: 'How do you measure automation ROI?',
    answer: 'We track hours saved, error rates reduced, and cycle times improved. Every project has a business case with measurable outcomes that we track post-implementation.',
  },
];

export default function DigitalTransformationPage() {
  return (
    <>
      {/* Structured Data for SEO/AEO */}
      <ServiceSchema
        name="Digital Transformation Services"
        description="Intelligent process automation. ServiceNow workflows, RPA, document processing. Automate what humans shouldn't do manually."
        url="/services/digital-transformation"
        serviceType="Digital Transformation Consulting"
      />
      <FAQSchema faqs={faqs} />
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: '/' },
          { name: 'Services', url: '/services' },
          { name: 'Digital Transformation', url: '/services/digital-transformation' },
        ]}
      />

      {/* Hero Section */}
      <section className="py-20 lg:py-28 bg-gradient-to-br from-[var(--aci-secondary)] to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-[var(--aci-primary-light)] font-semibold text-sm uppercase tracking-wide">
                Digital Transformation
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-white mt-3 mb-6">
                Intelligent Process Automation
              </h1>
              <p className="text-lg text-gray-300 mb-8">
                ServiceNow workflows, RPA, document processing. Automate what humans shouldn't do manually.
                We free your people for higher-value work while bots handle the routine.
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
                ServiceNow Partner | UiPath Certified | 300%+ average ROI
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button href="/contact?service=digital-transformation" variant="primary" size="lg">
                  Talk to an Automation Architect
                </Button>
                <Button
                  href="/case-studies?service=digital-transformation"
                  variant="ghost"
                  size="lg"
                  className="text-white border-white hover:bg-white/10"
                >
                  See Automation Projects
                </Button>
              </div>
            </div>

            {/* Visual */}
            <div className="relative hidden lg:block">
              <div className="bg-gray-800 rounded-2xl p-8 shadow-2xl">
                <div className="text-sm text-gray-400 mb-4">Automation Architecture</div>
                <div className="space-y-4">
                  <div className="bg-gray-700 rounded-lg p-4 text-center">
                    <div className="text-gray-300 font-medium">Manual Processes</div>
                    <div className="text-xs text-gray-400 mt-1">Emails • Spreadsheets • Paper</div>
                  </div>
                  <div className="text-center text-gray-500">↓ Discovery & Analysis</div>
                  <div className="bg-[var(--aci-primary)]/30 rounded-lg p-4 text-center">
                    <div className="text-white font-bold">Automation Platform</div>
                    <div className="text-xs text-gray-300 mt-1">RPA • Workflows • Document AI</div>
                  </div>
                  <div className="text-center text-gray-500">↓</div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-green-900/30 rounded-lg p-3 text-center text-xs text-green-300">Automated</div>
                    <div className="bg-blue-900/30 rounded-lg p-3 text-center text-xs text-blue-300">Human Review</div>
                  </div>
                </div>
              </div>
              <div className="absolute -inset-4 bg-yellow-500/10 rounded-3xl blur-3xl -z-10"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Service Offerings */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--aci-secondary)] mb-4">Automation Services</h2>
            <p className="text-lg text-gray-600">From process discovery to production automation</p>
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
                    {offering.technologies.map((tech) => (
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
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Automation Projects We've Built</h2>
            <p className="text-lg text-gray-400">Real transformations. Measurable outcomes.</p>
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
            <Button href="/case-studies?service=digital-transformation" variant="secondary" size="lg">
              See All Automation Case Studies <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Why Choose ACI */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--aci-secondary)] mb-4">Why Choose ACI for Automation</h2>
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
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--aci-secondary)] mb-4">Common Questions About Automation</h2>
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
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Automate Your Processes?</h2>
          <p className="text-lg text-blue-100 mb-8">
            Talk to an automation architect about your process challenges.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button href="/contact?service=digital-transformation" variant="secondary" size="lg">Talk to an Automation Architect</Button>
            <Button href="/case-studies?service=digital-transformation" variant="ghost" size="lg" className="text-white border-white hover:bg-white/10">
              See Automation Case Studies
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
