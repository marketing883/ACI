import { Metadata } from 'next';
import { ArrowRight, CheckCircle, ChevronDown, Brain, Cpu, BarChart3, Bot, Shield, Sparkles } from 'lucide-react';
import Button from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'Applied AI & ML Services | ACI Infotech',
  description: 'From GenAI pilots to production ML. GenAI chatbots, forecasting engines, recommendation systems. With MLOps, governance, and SLAs. 50+ AI deployments.',
  keywords: 'AI consulting, machine learning services, GenAI implementation, MLOps, AI governance, enterprise AI',
};

const keyOutcomes = [
  'Ship models to production, not pilot purgatory',
  'GenAI chatbots with enterprise security',
  'MLOps pipelines with automated retraining',
  'AI governance that satisfies regulators',
];

const offerings = [
  {
    id: 'genai-solutions',
    title: 'GenAI & LLM Solutions',
    description: 'Enterprise chatbots, document processing, code generation powered by Azure OpenAI, AWS Bedrock, or private LLMs.',
    icon: Sparkles,
    technologies: ['Azure OpenAI', 'AWS Bedrock', 'Claude', 'LangChain'],
    outcomes: ['40% reduction in support tickets', 'Automated document processing', 'Enterprise security controls'],
  },
  {
    id: 'predictive-analytics',
    title: 'Predictive Analytics',
    description: 'Forecasting engines for demand, churn, and risk. ML models that run in production with continuous learning.',
    icon: BarChart3,
    technologies: ['Databricks ML', 'Python', 'TensorFlow', 'scikit-learn'],
    outcomes: ['30% improvement in forecast accuracy', 'Real-time predictions', 'Automated model refresh'],
  },
  {
    id: 'recommendation-systems',
    title: 'Recommendation Systems',
    description: 'Personalization engines for retail, media, and financial services. Real-time recommendations at scale.',
    icon: Brain,
    technologies: ['Spark MLlib', 'TensorFlow Recommenders', 'Feature Stores'],
    outcomes: ['25% increase in conversion', 'Real-time personalization', 'A/B testing built-in'],
  },
  {
    id: 'mlops',
    title: 'MLOps & Model Management',
    description: 'CI/CD for ML with automated testing, deployment, and monitoring. MLflow, Kubeflow, or custom platforms.',
    icon: Cpu,
    technologies: ['MLflow', 'Kubeflow', 'Databricks Mosaic AI', 'SageMaker'],
    outcomes: ['5x faster model deployment', 'Automated retraining', 'Version-controlled models'],
  },
  {
    id: 'ai-governance',
    title: 'AI Governance & ArqAI',
    description: 'Policy-as-code, bias monitoring, drift detection. EU AI Act, GDPR compliant from day one.',
    icon: Shield,
    technologies: ['ArqAI', 'MLflow Governance', 'Great Expectations'],
    outcomes: ['Audit-ready AI systems', 'Automated compliance checks', 'Bias monitoring'],
  },
  {
    id: 'intelligent-automation',
    title: 'Intelligent Process Automation',
    description: 'Document AI, intelligent OCR, and AI-powered workflows that augment human decision-making.',
    icon: Bot,
    technologies: ['Document AI', 'UiPath AI', 'Power Automate AI'],
    outcomes: ['80% reduction in manual processing', 'Human-in-the-loop where needed', 'Measurable ROI'],
  },
];

const caseStudies = [
  {
    slug: 'financial-forecasting',
    client: 'Fortune 500 Bank',
    industry: 'Financial Services',
    challenge: 'Forecasting models took weeks to retrain and deploy, missing market changes',
    results: [
      { metric: '30%', description: 'Improvement in forecast accuracy' },
      { metric: 'Daily', description: 'Automated model retraining' },
      { metric: '$5M', description: 'Annual cost savings' },
    ],
    technologies: ['Databricks ML', 'MLflow', 'Python'],
  },
  {
    slug: 'retail-personalization',
    client: 'National Retailer',
    industry: 'Retail',
    challenge: 'Generic recommendations driving customers to competitors',
    results: [
      { metric: '25%', description: 'Increase in conversion rate' },
      { metric: 'Real-time', description: 'Personalization at scale' },
      { metric: '15%', description: 'Lift in average order value' },
    ],
    technologies: ['TensorFlow', 'Spark', 'Redis'],
  },
  {
    slug: 'document-processing',
    client: 'Healthcare Provider',
    industry: 'Healthcare',
    challenge: 'Manual claims processing taking 72 hours average',
    results: [
      { metric: '4 hours', description: 'Reduced processing time' },
      { metric: '95%', description: 'Automated accuracy' },
      { metric: '80%', description: 'Reduction in manual work' },
    ],
    technologies: ['Document AI', 'Azure OpenAI', 'Python'],
  },
];

const differentiators = [
  {
    title: 'Production, Not Pilots',
    description: "50+ AI models in production across Fortune 500 clients. We ship models that run 24/7 with SLAs.",
    proof: '50+ models in production',
  },
  {
    title: 'ArqAI Governance Platform',
    description: 'Our own AI governance platform for enterprises scaling AI responsibly. Policy-as-code, bias monitoring, audit trails.',
    proof: 'EU AI Act compliant out of box',
  },
  {
    title: 'MLOps from Day One',
    description: 'Every model ships with CI/CD, monitoring, and automated retraining. No model drift surprises.',
    proof: 'Zero production model failures',
  },
  {
    title: 'Enterprise Security',
    description: 'Private LLM deployments, data residency controls, and SOC 2 compliant architectures.',
    proof: 'ISO 27001 certified',
  },
];

const faqs = [
  {
    question: 'How do you handle AI governance and compliance?',
    answer: 'We use ArqAI, our purpose-built AI governance platform, to implement policy-as-code, automated bias monitoring, and audit trails. This ensures compliance with EU AI Act, GDPR, and industry-specific regulations from day one.',
  },
  {
    question: 'Can we use private LLMs for sensitive data?',
    answer: 'Yes. We deploy private LLMs on your infrastructure (Azure OpenAI, AWS Bedrock, or on-prem) with full data residency controls. Your data never leaves your environment.',
  },
  {
    question: 'What about model drift and retraining?',
    answer: 'Every model includes automated drift detection and retraining pipelines. Most models refresh daily or weekly depending on your data velocity. You see performance metrics in real-time dashboards.',
  },
  {
    question: 'How long does a typical AI project take?',
    answer: '3-6 months for most AI implementations. GenAI chatbots can be faster (8-12 weeks). Complex ML systems with custom models take 6-12 months.',
  },
];

export default function AppliedAIMLPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="py-20 lg:py-28 bg-gradient-to-br from-[var(--aci-secondary)] to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-[var(--aci-primary-light)] font-semibold text-sm uppercase tracking-wide">
                Applied AI & ML
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-white mt-3 mb-6">
                From GenAI Pilots to Production ML
              </h1>
              <p className="text-lg text-gray-300 mb-8">
                GenAI chatbots, forecasting engines, recommendation systems. With MLOps, governance, and SLAs.
                We ship models to production, not pilot purgatory. Every AI system includes monitoring, retraining pipelines, and ArqAI governance.
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
                50+ AI models in production | ArqAI governance platform
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button href="/contact?service=applied-ai-ml" variant="primary" size="lg">
                  Talk to an AI Architect
                </Button>
                <Button
                  href="/case-studies?service=applied-ai-ml"
                  variant="ghost"
                  size="lg"
                  className="text-white border-white hover:bg-white/10"
                >
                  See AI Projects
                </Button>
              </div>
            </div>

            {/* Visual */}
            <div className="relative hidden lg:block">
              <div className="bg-gray-800 rounded-2xl p-8 shadow-2xl">
                <div className="text-sm text-gray-400 mb-4">AI/ML Architecture</div>
                <div className="space-y-4">
                  <div className="bg-purple-900/30 rounded-lg p-4 text-center">
                    <div className="text-purple-300 font-medium">Data Sources</div>
                    <div className="text-xs text-gray-400 mt-1">Structured • Unstructured • Real-time</div>
                  </div>
                  <div className="text-center text-gray-500">↓</div>
                  <div className="bg-[var(--aci-primary)]/30 rounded-lg p-4 text-center">
                    <div className="text-white font-bold">ML Platform</div>
                    <div className="text-xs text-gray-300 mt-1">Feature Store • Model Training • Serving</div>
                  </div>
                  <div className="text-center text-gray-500">↓</div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-green-900/30 rounded-lg p-3 text-center text-xs text-green-300">
                      Predictions
                    </div>
                    <div className="bg-blue-900/30 rounded-lg p-3 text-center text-xs text-blue-300">
                      GenAI
                    </div>
                  </div>
                  <div className="bg-yellow-900/30 rounded-lg p-3 text-center">
                    <div className="text-yellow-300 text-sm">ArqAI Governance</div>
                  </div>
                </div>
              </div>
              <div className="absolute -inset-4 bg-purple-500/10 rounded-3xl blur-3xl -z-10"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Service Offerings */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--aci-secondary)] mb-4">
              AI & ML Services
            </h2>
            <p className="text-lg text-gray-600">
              From GenAI to custom ML, all with production-grade governance
            </p>
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
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">AI Projects We've Built</h2>
            <p className="text-lg text-gray-400">Real AI implementations. Real business outcomes.</p>
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
            <Button href="/case-studies?service=applied-ai-ml" variant="secondary" size="lg">
              See All AI Case Studies <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Why Choose ACI */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--aci-secondary)] mb-4">Why Choose ACI for AI & ML</h2>
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
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--aci-secondary)] mb-4">Common Questions About AI & ML</h2>
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
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Ship AI to Production?</h2>
          <p className="text-lg text-blue-100 mb-8">
            Talk to an AI architect about your specific use case. No sales pitch—just an engineering conversation about what's actually possible.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button href="/contact?service=applied-ai-ml" variant="secondary" size="lg">Talk to an AI Architect</Button>
            <Button href="/case-studies?service=applied-ai-ml" variant="ghost" size="lg" className="text-white border-white hover:bg-white/10">
              See AI Case Studies
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
