import { Metadata } from 'next';
import RelatedLinks from '@/components/seo/RelatedLinks';
import { appliedAiRelated } from '@/content/related-links';
import ClusterPosts from '@/components/seo/ClusterPosts';
import { ServiceSchema, BreadcrumbSchema } from '@/components/seo/StructuredData';
import { DEFAULT_OG_IMAGES, DEFAULT_TWITTER_IMAGES } from '@/lib/seo/og';
import { getSiteUrl } from '@/lib/site-url';
import FoldcraftHero from '@/components/v4/hero/FoldcraftHero';
import CtaSection from '@/components/v4/hero/CtaSection';
import { v4Sans, v4Geist, v4Display } from '@/components/v4/fonts';
import {
  SectionHead,
  ServiceHero,
  OfferingList,
  ProofCards,
  ProcessStrip,
  BridgeBand,
  FactsRow,
  PageFaq,
} from '@/components/v4/page/kit';
import FlowScene from '@/components/v4/page/FlowScene';
import { FLOWS } from '@/components/v4/page/flow-configs';

export const revalidate = 3600;

// Canonical origin: always production, so staging builds can never
// self-canonicalize (see src/lib/site-url.ts).
const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  title: 'Applied AI & ML Services',
  description: 'From GenAI pilots to production ML. GenAI chatbots, forecasting engines, recommendation systems. With MLOps, governance, and SLAs. 50+ AI deployments.',
  keywords: 'AI consulting, machine learning services, GenAI implementation, MLOps, AI governance, enterprise AI',
  alternates: {
    canonical: `${siteUrl}/services/applied-ai-ml`,
  },
  // Per-page social card. Without this, every share and link preview
  // inherited the homepage's OpenGraph (title, image, and og:url all
  // pointing at /), mis-attributing all 21 service/platform pages.
  openGraph: {
    title: 'Applied AI & ML Services | ACI Infotech',
    description: 'From GenAI pilots to production ML. GenAI chatbots, forecasting engines, recommendation systems. With MLOps, governance, and SLAs. 50+ AI deployments.',
    url: `${siteUrl}/services/applied-ai-ml`,
    siteName: 'ACI Infotech',
    type: 'website',
    images: DEFAULT_OG_IMAGES,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Applied AI & ML Services | ACI Infotech',
    description: 'From GenAI pilots to production ML. GenAI chatbots, forecasting engines, recommendation systems. With MLOps, governance, and SLAs. 50+ AI deployments.',
    images: DEFAULT_TWITTER_IMAGES,
  },
};

/* ------------------------------- page copy ------------------------------- */

const OFFERINGS = [
  {
    title: 'GenAI and LLM solutions',
    body: 'Enterprise assistants, document processing, and code generation on Azure OpenAI, AWS Bedrock, Claude, or private LLMs in your own tenancy. Retrieval, guardrails, and evaluation gates come standard, because a chatbot without them is a liability with a chat window. Support assistants built this way have cut ticket volume by 20%.',
    chips: ['Azure OpenAI', 'AWS Bedrock', 'Claude', 'LangChain'],
  },
  {
    title: 'Predictive analytics',
    body: 'Forecasting engines for demand, churn, and risk that retrain themselves as the data moves. Predictions get served in production, in real time, not from a notebook someone remembers to run on Fridays.',
    chips: ['Databricks ML', 'Python', 'TensorFlow', 'scikit-learn'],
  },
  {
    title: 'Recommendation systems',
    body: 'Personalization engines for retail, media, and financial services, serving recommendations in real time with A/B testing built in. Clients have measured conversion lift of 15% once the engine went live.',
    chips: ['Spark MLlib', 'TensorFlow Recommenders', 'Feature stores'],
  },
  {
    title: 'MLOps and model management',
    body: 'CI/CD for models: automated testing, deployment, monitoring, and retraining on MLflow, Kubeflow, or SageMaker. Teams deploy model updates 2 to 3x faster, and drift gets caught by a pipeline instead of by an executive.',
    chips: ['MLflow', 'Kubeflow', 'Databricks Mosaic AI', 'SageMaker'],
  },
  {
    title: 'AI governance with ArqAI',
    body: 'ArqAI is our own governance platform: policy as code, bias monitoring, drift detection, and audit trails on every model. Systems ship aligned to the EU AI Act and GDPR from day one, so the compliance review is a formality instead of a rebuild.',
    chips: ['ArqAI', 'MLflow Governance', 'Great Expectations'],
  },
  {
    title: 'Intelligent process automation',
    body: 'Document AI, intelligent OCR, and workflows that keep a human in the loop where judgment matters. Clients have cut manual processing work by 35% while keeping people on the decisions that need them.',
    chips: ['Document AI', 'UiPath AI', 'Power Automate AI'],
  },
];

const DECISION_ROWS: { need: string; pick: 'genai' | 'ml' | 'both' }[] = [
  { need: 'Documents, copilots, and conversational agents', pick: 'genai' },
  { need: 'Search and summarization over your own content', pick: 'genai' },
  { need: 'Forecasting, scoring, and optimization', pick: 'ml' },
  { need: 'Fraud, churn, and risk models with hard accuracy targets', pick: 'ml' },
  { need: 'Most enterprise estates, honestly', pick: 'both' },
];

const PROOF = [
  {
    eyebrow: 'Fortune 500 Retail and Commercial Bank',
    metric: '30%',
    metricLabel: 'Improvement in forecast accuracy',
    summary: 'Forecasting engines rebuilt on Databricks ML with daily automated retraining, replacing a cycle that took weeks and missed market moves. Worth $5M a year.',
    href: '/case-studies?service=applied-ai-ml',
    linkLabel: 'Browse the AI case studies',
  },
  {
    eyebrow: 'National Healthcare Provider',
    metric: '4h',
    metricLabel: 'Claims processing, down from 72',
    summary: 'Document AI reading claims with 88% automated accuracy, cutting manual processing 35%. Humans now handle the edge cases, not the pile.',
    href: '/case-studies?industry=healthcare',
    linkLabel: 'See the healthcare stories',
  },
  {
    eyebrow: 'Global Financial Services Firm',
    metric: '90d',
    metricLabel: 'From prototype to production',
    summary: 'Azure Data Lake, Databricks, AKS, and Synapse wired into one governed foundation, so models move from notebook to production in 90 days.',
    href: '/case-studies/driving-enterprise-data-transformation-with-aci-s-azure-lakehouse',
    linkLabel: 'Read the Azure Lakehouse story',
  },
];

const PROCESS = [
  {
    title: 'Scope',
    timeframe: 'Weeks 1 to 2',
    body: 'One use case, chosen for value and data availability, not for the demo it would make at a board meeting.',
  },
  {
    title: 'Ground',
    timeframe: 'Weeks 2 to 5',
    body: 'Data readiness, retrieval design, and the governance model. If the data is not ready, we say so now, not in week ten.',
  },
  {
    title: 'Build',
    timeframe: 'Weeks 4 to 10',
    body: 'Model, pipeline, and guardrails shipped in increments, with evaluation gates before anything faces a user.',
  },
  {
    title: 'Prove',
    timeframe: 'Weeks 8 to 14',
    body: 'Evals against agreed thresholds, bias checks, and human sign-off. Production access is earned, not assumed.',
  },
  {
    title: 'Run',
    body: 'Monitoring, drift detection, and retraining under SLA with our managed team, or handed to yours with runbooks.',
  },
];

const FACTS = [
  {
    label: 'Delivery',
    line: 'The architects who scope your model are the ones who ship it. Nobody hands your project to a bench.',
  },
  {
    label: 'Governance',
    line: 'ArqAI, our own governance platform: policy as code, bias monitoring, and audit trails aligned to the EU AI Act and GDPR.',
  },
  {
    label: 'Scale',
    line: 'Founded 2006. 1,200+ engineers across 11 global delivery hubs. 50+ AI models in production.',
  },
  {
    label: 'Operations',
    line: 'ISO 27001 certified, with production models monitored 24/7 under published SLAs.',
  },
];

const FAQS = [
  {
    question: 'What does a production GenAI implementation require?',
    answer: 'More than a prompt and an API key. You need governed data for retrieval, a RAG or agent design that fits the job, evaluation before launch, and guardrails and monitoring after. The model is the easy part.',
  },
  {
    question: 'How long does an AI project take?',
    answer: 'A scoped use case with data in reasonable shape reaches production in 8 to 14 weeks. Complex ML systems with custom models run 6 to 12 months. If the data is not ready, that work comes first, and we will say so plainly rather than paper over it.',
  },
  {
    question: 'How do you handle AI governance and compliance?',
    answer: 'Through ArqAI, our purpose-built governance platform: policy as code, automated bias monitoring, drift detection, and audit trails. Systems ship aligned to the EU AI Act, GDPR, and your industry rules from day one, not retrofitted before an audit.',
  },
  {
    question: 'Can we use private LLMs for sensitive data?',
    answer: 'Yes. We deploy private LLMs in your own environment, on Azure OpenAI, AWS Bedrock, or on-prem, with full data residency controls. Your data never leaves your tenancy.',
  },
  {
    question: 'What about model drift and retraining?',
    answer: 'Every model ships with drift detection and a retraining pipeline. Most refresh daily or weekly depending on data velocity, and you watch performance on live dashboards instead of taking our word for it.',
  },
  {
    question: 'How do you pick the first AI use case?',
    answer: 'We look for a job with clear value, available data, and room to be wrong sometimes. Chasing the flashiest use case first is how pilots die. Better to ship one that pays for itself and earns the next.',
  },
  {
    question: 'Who owns model risk and governance?',
    answer: 'We build the controls in: model registry, versioning, audit trails, and policy checks, with clear ownership on your side. Regulated buyers have to show their work, and bolting that on afterward never goes well.',
  },
];

/* --------------------- decision artifact (page-local) --------------------- */

// One-off variation on the kit's DecisionPanel: same gray band and table
// grammar, but the two columns are approaches (GenAI vs classic ML), not
// partner logos, so it is built inline instead of extending the kit.
function AiApproachPanel() {
  const Dot = ({ on }: { on: boolean }) => (
    <span
      aria-hidden="true"
      className="mx-auto block h-3 w-3 rounded-full"
      style={{ background: on ? '#1D4ED8' : 'rgba(0,0,0,0.08)' }}
    />
  );
  return (
    <section className="border-t border-gray-200 bg-gray-50">
      <div className="mx-auto max-w-5xl px-6 py-16 md:py-20">
        <h2
          className={`text-3xl font-bold tracking-tight text-black sm:text-4xl ${v4Display}`}
          style={{ lineHeight: 1.08 }}
        >
          GenAI or traditional&nbsp;ML?
        </h2>
        <p className="mt-5 max-w-3xl text-base leading-relaxed text-gray-600 md:text-lg">
          Usually the wrong question. GenAI earns its keep on language: documents, copilots, agents that read and write. Classic ML still wins on numbers: forecasting, scoring, optimization, anywhere you need a measurable error rate. Most estates need both, running on one MLOps spine so governance is built once instead of twice. We build either, and we will tell you which fits before writing a line of code.
        </p>

        <div className="mt-9 overflow-x-auto">
          <table className="w-full min-w-[560px] border-collapse text-left text-sm">
            <thead>
              <tr>
                <th className="w-1/2 border-b border-gray-200 pb-4 text-xs font-semibold uppercase tracking-wide text-gray-400">
                  The job at hand
                </th>
                <th className={`border-b border-gray-200 pb-4 text-center text-sm font-semibold text-black ${v4Display}`}>
                  GenAI
                </th>
                <th className={`border-b border-gray-200 pb-4 text-center text-sm font-semibold text-black ${v4Display}`}>
                  Classic ML
                </th>
              </tr>
            </thead>
            <tbody>
              {DECISION_ROWS.map((row) => (
                <tr key={row.need}>
                  <td className="border-b border-gray-200 py-4 pr-6 font-medium text-gray-800">{row.need}</td>
                  <td className="border-b border-gray-200 py-4">
                    <Dot on={row.pick === 'genai' || row.pick === 'both'} />
                  </td>
                  <td className="border-b border-gray-200 py-4">
                    <Dot on={row.pick === 'ml' || row.pick === 'both'} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-5 text-sm text-gray-500">
          Both dots lit means both, under one MLOps spine and one governance layer.
        </p>
      </div>
    </section>
  );
}

/* --------------------------------- page ---------------------------------- */

export default function AppliedAIMLPage() {
  return (
    <div className={`bg-white text-black ${v4Sans}`}>
      <ServiceSchema
        name="Applied AI & ML Services"
        description="From GenAI pilots to production ML. GenAI chatbots, forecasting engines, recommendation systems with MLOps, governance, and SLAs."
        url="/services/applied-ai-ml"
        serviceType="AI & Machine Learning Consulting"
      />
      {/* FAQPage JSON-LD comes from PageFaq below — one per page. */}
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: '/' },
          { name: 'Services', url: '/services' },
          { name: 'Applied AI & ML', url: '/services/applied-ai-ml' },
        ]}
      />

      <ServiceHero
        kicker="Applied AI & ML"
        title={
          <>
            Applied AI &amp; ML: From GenAI Pilots{' '}
            <span style={{ color: '#1D4ED8' }}>to&nbsp;Production</span>
          </>
        }
        lede="ACI Infotech takes AI from pilot to production: GenAI assistants, forecasting engines, and recommendation systems that run around the clock with SLAs. Every model ships with MLOps pipelines, monitoring, and ArqAI governance, so it keeps working after launch and holds up when an auditor asks how it decides."
        chips={[
          '50+ AI models in production',
          'ArqAI governance platform',
          'MLOps on every model',
          'ISO 27001',
        ]}
        primary={{ label: 'Talk to an AI architect', href: '/contact?service=applied-ai-ml' }}
        secondary={{ label: 'See the AI case studies', href: '/case-studies?service=applied-ai-ml' }}
        visual={<FlowScene config={FLOWS['applied-ai-ml']} />}
      />

      {/* Problem band: where pilots go to die */}
      <FoldcraftHero
        geistClass={v4Geist}
        pill="Why pilots stall"
        headline={
          <>
            The demo impressed everyone.{' '}
            <br className="hidden sm:block" />
            Then it met <span className="text-[#60A5FA]">production.</span>
          </>
        }
        body="Most GenAI pilots never make it out of the sandbox. Not because the model is weak, but because nobody built the unglamorous part: evaluation gates, guardrails, drift monitoring, and an answer for the auditor who asks why the model said what it said. We build that part first, which is why our models are still running a year later."
        story={{
          metric: { value: '30%', label: 'Improvement in forecast accuracy' },
          title: 'Forecasting engines retrained daily at a Fortune 500 bank',
          role: 'Financial Services',
          org: 'A Fortune 500 retail and commercial bank',
          href: '/case-studies?service=applied-ai-ml',
          logoSrc: '/brand/databricks-color.svg',
          logoAlt: 'Databricks',
        }}
      />

      {/* What we build */}
      <section className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <SectionHead
            kicker="What we build"
            title={
              <>
                Production AI. <span style={{ color: '#1D4ED8' }}>Six ways&nbsp;in.</span>
              </>
            }
          />
          <OfferingList items={OFFERINGS} />
        </div>
      </section>

      {/* Decision artifact: GenAI vs classic ML */}
      <AiApproachPanel />

      {/* Proof */}
      <section className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <SectionHead
            kicker="Results"
            title={
              <>
                Shipped, governed, <span style={{ color: '#1D4ED8' }}>still&nbsp;running.</span>
              </>
            }
          />
          <ProofCards cards={PROOF} />
        </div>
      </section>

      {/* Process */}
      <section className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <SectionHead kicker="How an engagement runs" title="Five phases. No mystery." />
          <ProcessStrip steps={PROCESS} />
        </div>
      </section>

      {/* Bridge to managed operations */}
      <BridgeBand
        title="Launch is when the model starts aging."
        body="Data shifts, prompts rot, and last quarter's accurate model quietly becomes this quarter's wrong one. Our managed operations team watches production models around the clock: drift detection, retraining pipelines, and P1 response in fifteen minutes when something misbehaves at 2am."
        link={{ label: 'Managed Operations', href: '/services/managed-operations' }}
      />

      {/* Why ACI */}
      <section className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <SectionHead kicker="Why ACI" title="Why enterprises pick us for AI" />
          <FactsRow facts={FACTS} />
        </div>
      </section>

      <PageFaq
        kicker="Questions"
        title={
          <>
            AI questions,
            <br />
            <span style={{ color: '#1D4ED8' }}>answered straight.</span>
          </>
        }
        sub="The questions we hear most before an AI engagement. Anything else belongs in a conversation."
        faqs={FAQS}
      />

      <ClusterPosts keywords={['genai', 'machine learning', 'artificial intelligence', 'mlops', 'ai/ml', 'llm', 'rag', 'predictive']} />

      <RelatedLinks items={appliedAiRelated} />

      {/* Closing CTA: video stage, one button, nothing else */}
      <CtaSection label="Let's get your AI into production" />
    </div>
  );
}
