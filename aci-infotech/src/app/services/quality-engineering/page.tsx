import { Metadata } from 'next';
import {
  ArrowRight,
  CheckCircle,
  PenLine,
  Code2,
  Rocket,
  Eye,
  Sparkles,
  ArrowDown,
  RotateCcw,
  X,
  Zap,
  Bot,
  GitBranch,
  Gauge,
  ShieldCheck,
  Activity,
} from 'lucide-react';
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

// The "Quality Loop" infographic. Four stages of delivery, each with
// what the stage produces and the specific AI augmentation that
// applies there. The loop-back arrow at the bottom is the whole
// point of the visual: quality is a continuous property of the
// system, not a late-stage gate.
const qualityLoopStages = [
  {
    label: 'Design',
    icon: PenLine,
    work: 'Risk models, test-first specs, acceptance criteria tied to code.',
    aiRole: 'agentic test generation from stories',
  },
  {
    label: 'Build',
    icon: Code2,
    work: 'In-sprint automation, unit and integration coverage, static analysis.',
    aiRole: 'self-healing suites, drift detection',
  },
  {
    label: 'Ship',
    icon: Rocket,
    work: 'CI gates, load validation, security scans on every pull request.',
    aiRole: 'flaky-test prediction, quarantine',
  },
  {
    label: 'Observe',
    icon: Eye,
    work: 'Production telemetry, SRE-adjacent quality, feedback into tests.',
    aiRole: 'coverage gap detection, defect clustering',
  },
] as const;

// Four concrete places AI earns its keep in QE. Resist the urge to
// abstract; each card describes a specific problem and a specific
// agent behaviour. No "AI-powered" filler.
const aiInLoop = [
  {
    id: 'test-generation',
    title: 'Test generation',
    body: 'Agents ingest user stories, code changes, and past defects, then generate the test cases humans miss. Coverage climbs without a proportional headcount climb.',
  },
  {
    id: 'self-healing',
    title: 'Self-healing suites',
    body: 'UI selectors drift, tests break, engineers lose the week fixing them. An agent watches the drift, updates selectors, and flags the ones it cannot resolve. Your team writes new tests instead of babysitting old ones.',
  },
  {
    id: 'flaky-prediction',
    title: 'Flaky-test prediction',
    body: 'Before a test becomes a chronic flake, a model sees the pattern and quarantines it. The pipeline stays trustworthy; engineers keep merging with confidence.',
  },
  {
    id: 'defect-clustering',
    title: 'Defect pattern analysis',
    body: 'Bugs cluster. An agent reads the defect log, groups by root cause, and tells you which class of bug to eliminate next. Root cause, not whack-a-mole.',
  },
] as const;

// "From QA to QE" — an explicit positioning shift so visitors don't
// read the rename as a cosmetic swap. Each side is a set of short,
// concrete lines that describe how the work actually happens today
// vs how it used to happen. Avoid abstractions; prefer the concrete.
const qaVsQe = {
  qa: [
    'Executed by a separate team after the build is done',
    'Manual test cases in a spreadsheet, regression sprints at the end',
    'Staff-augmentation shops billing by headcount',
    'Quality as a gate; releases held up or rolled back',
    'Tests as an artefact maintained by someone else',
  ],
  qe: [
    'Owned by the same team that writes the code',
    'Tests as code, versioned and reviewed in the same pull request',
    'Automation first; exploratory testing as the only manual step',
    'Quality as a property of the system, watched in production',
    'AI agents scaling the coverage humans cannot keep up with',
  ],
} as const;

// Six capabilities, delivered as part of engineering, not separate
// from it. Each card stays short: one-line description, three
// concrete outcomes, the tools we most often reach for. The tools
// are starting points; the section below tells the visitor we meet
// them on whatever stack they already run.
const capabilities = [
  {
    id: 'in-sprint-automation',
    title: 'In-sprint test automation',
    icon: Zap,
    description:
      'End-to-end, integration, and unit suites written the same sprint the feature lands. Executable tests on every commit, not a spreadsheet of manual steps.',
    outcomes: ['90%+ automation as a default', 'Tests run in under 10 minutes', 'Zero flaky-test policy'],
    stack: ['Playwright', 'Cypress', 'Jest', 'Pytest', 'Selenium'],
  },
  {
    id: 'agentic-ai-coverage',
    title: 'Agentic AI test coverage',
    icon: Bot,
    description:
      'Autonomous agents that generate, execute, and maintain suites. Reads user stories, code, and past defects to find cases your team did not think of.',
    outcomes: ['Coverage up 3x', 'Self-healing UI selectors', 'Predictive defect analysis'],
    stack: ['Mabl', 'Testim', 'Applitools', 'Custom agents'],
  },
  {
    id: 'cicd-quality-gates',
    title: 'CI/CD quality gates',
    icon: GitBranch,
    description:
      'Tests wired into pull request checks, deploy stages, and post-deploy smoke. Bad merges blocked at source; every merge hits production with confidence.',
    outcomes: ['Automated quality gates', 'Bad merges blocked at source', 'Deployment confidence'],
    stack: ['GitHub Actions', 'GitLab CI', 'Jenkins', 'CircleCI', 'ArgoCD'],
  },
  {
    id: 'performance-engineering',
    title: 'Performance and load engineering',
    icon: Gauge,
    description:
      'Real-scale validation before production finds it for you. Load testing, performance benchmarking, capacity planning, all part of delivery.',
    outcomes: ['Validated scale targets', 'Performance SLA baselines', 'No surprise outages'],
    stack: ['k6', 'JMeter', 'Gatling', 'Locust', 'BlazeMeter'],
  },
  {
    id: 'security-as-engineering',
    title: 'Security testing as engineering',
    icon: ShieldCheck,
    description:
      'SAST, DAST, dependency scanning, and penetration testing in the pipeline. A continuous discipline, not a late-stage audit.',
    outcomes: ['Vulnerabilities caught pre-prod', 'Continuous security scanning', 'Compliance-ready audits'],
    stack: ['OWASP ZAP', 'Snyk', 'Checkmarx', 'Burp Suite'],
  },
  {
    id: 'observability-fed-quality',
    title: 'Observability-fed quality',
    icon: Activity,
    description:
      'Production telemetry loops back into test strategy. Coverage gaps get detected from real traffic; flakiness quarantined before it breaks trust in CI.',
    outcomes: ['Coverage driven by real traffic', 'Flaky tests quarantined fast', 'Quality trends, not hunches'],
    stack: ['Datadog', 'SonarQube', 'Grafana', 'Custom dashboards'],
  },
] as const;

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

            {/* Right column: Quality Loop. Four delivery stages as
                stacked cards, each annotated with the AI role that
                applies there. The loop-back arrow is the point of
                the visual. */}
            <div className="relative hidden lg:block">
              <div className="bg-gray-900/80 rounded-2xl p-6 shadow-2xl border border-gray-700/60 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-5">
                  <div className="text-[11px] font-mono uppercase tracking-[0.18em] text-gray-500">
                    the quality loop
                  </div>
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-[var(--aci-lime)]/10 px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider text-[var(--aci-lime)] ring-1 ring-[var(--aci-lime)]/30">
                    <Sparkles className="w-3 h-3" />
                    ai-augmented
                  </div>
                </div>

                <div className="space-y-2">
                  {qualityLoopStages.map((stage, idx) => {
                    const StageIcon = stage.icon;
                    const isLast = idx === qualityLoopStages.length - 1;
                    return (
                      <div key={stage.label}>
                        <div className="rounded-xl border border-gray-700/60 bg-gray-800/60 p-3.5">
                          <div className="flex items-center gap-2.5 mb-1.5">
                            <StageIcon className="w-4 h-4 text-[var(--aci-primary-light)]" />
                            <div className="text-sm font-semibold text-white tracking-wide">
                              {stage.label}
                            </div>
                          </div>
                          <p className="text-xs leading-snug text-gray-400 mb-2.5">
                            {stage.work}
                          </p>
                          <div className="inline-flex items-center gap-1.5 rounded-md bg-[var(--aci-lime)]/10 px-2 py-0.5 text-[10px] font-mono text-[var(--aci-lime)]/90 ring-1 ring-[var(--aci-lime)]/20">
                            <Sparkles className="w-2.5 h-2.5" />
                            ai: {stage.aiRole}
                          </div>
                        </div>
                        {!isLast && (
                          <div className="flex justify-center py-0.5">
                            <ArrowDown className="w-3.5 h-3.5 text-gray-600" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Loop back to Design */}
                <div className="mt-3 flex items-center justify-center gap-2 rounded-lg border border-dashed border-gray-700/60 bg-gray-800/30 py-2">
                  <RotateCcw className="w-3.5 h-3.5 text-gray-500" />
                  <span className="text-[11px] font-mono text-gray-500">
                    feedback into the next design cycle
                  </span>
                </div>
              </div>
              <div className="absolute -inset-4 bg-[var(--aci-primary)]/10 rounded-3xl blur-3xl -z-10"></div>
            </div>
          </div>
        </div>
      </section>

      {/* From QA to QE — positioning shift */}
      <section className="py-20 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <div className="text-[11px] font-mono uppercase tracking-[0.18em] text-[var(--aci-primary)] mb-3">
              the shift
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--aci-secondary)] mb-4 leading-tight">
              From QA to QE.
            </h2>
            <p className="text-lg text-gray-600">
              We rebranded because the work changed. The old framing stopped
              describing what we actually do.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* QA, the old way */}
            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-7">
              <div className="flex items-center gap-2 mb-5">
                <div className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-gray-200 text-gray-500">
                  <X className="w-4 h-4" />
                </div>
                <div className="text-[11px] font-mono uppercase tracking-[0.16em] text-gray-500">
                  qa, the old way
                </div>
              </div>
              <ul className="space-y-3">
                {qaVsQe.qa.map((line) => (
                  <li
                    key={line}
                    className="flex items-start gap-3 text-gray-600 text-sm leading-relaxed"
                  >
                    <span className="mt-2 w-1 h-1 rounded-full bg-gray-400 flex-shrink-0" />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* QE, the way we do it */}
            <div className="rounded-2xl border border-[var(--aci-primary)]/25 bg-gradient-to-br from-[var(--aci-primary)]/[0.04] to-[var(--aci-primary)]/[0.08] p-7">
              <div className="flex items-center gap-2 mb-5">
                <div className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[var(--aci-primary)]/15 text-[var(--aci-primary)]">
                  <CheckCircle className="w-4 h-4" />
                </div>
                <div className="text-[11px] font-mono uppercase tracking-[0.16em] text-[var(--aci-primary)]">
                  qe, the way we do it
                </div>
              </div>
              <ul className="space-y-3">
                {qaVsQe.qe.map((line) => (
                  <li
                    key={line}
                    className="flex items-start gap-3 text-[var(--aci-secondary)] text-sm leading-relaxed"
                  >
                    <CheckCircle className="w-4 h-4 text-[var(--aci-primary)] flex-shrink-0 mt-0.5" />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <p className="mt-10 text-sm text-gray-500 italic max-w-3xl">
            Same engineering discipline, sharper name. Visitors who came
            looking for QA find it here; what we actually ship is QE.
          </p>
        </div>
      </section>

      {/* Capabilities grid */}
      <section className="py-20 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-14">
            <div className="text-[11px] font-mono uppercase tracking-[0.18em] text-[var(--aci-primary)] mb-3">
              what we actually ship
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--aci-secondary)] mb-4 leading-tight">
              Six capabilities, delivered as part of engineering.
            </h2>
            <p className="text-lg text-gray-600">
              Not as a separate phase, not by a different team, not on a
              different contract. Part of how the system is built.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {capabilities.map((cap) => {
              const Icon = cap.icon;
              return (
                <div
                  key={cap.id}
                  className="bg-white p-7 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 flex flex-col"
                >
                  <div className="inline-flex items-center justify-center w-11 h-11 rounded-lg bg-[var(--aci-primary)]/10 text-[var(--aci-primary)] mb-4">
                    <Icon className="w-5 h-5" />
                  </div>

                  <h3 className="text-lg font-semibold text-[var(--aci-secondary)] mb-2 leading-snug">
                    {cap.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-5 leading-relaxed flex-grow">
                    {cap.description}
                  </p>

                  <div className="mb-5">
                    <div className="text-[10px] font-mono uppercase tracking-wider text-gray-500 mb-2">
                      outcomes
                    </div>
                    <ul className="space-y-1.5">
                      {cap.outcomes.map((o) => (
                        <li
                          key={o}
                          className="flex items-start gap-2 text-xs text-gray-700"
                        >
                          <CheckCircle className="w-3 h-3 text-[var(--aci-primary)] flex-shrink-0 mt-0.5" />
                          <span>{o}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-4 border-t border-gray-100">
                    {cap.stack.slice(0, 4).map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-0.5 bg-gray-100 rounded text-[11px] text-gray-600 font-mono"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <p className="mt-10 text-sm text-gray-500 max-w-3xl">
            Default stacks above. We meet you where you are; if your team
            runs a different toolchain we plug into that rather than
            forcing a swap.
          </p>
        </div>
      </section>

      {/* Where AI Actually Enters the Loop */}
      <section className="py-20 lg:py-24 bg-[var(--aci-secondary)] text-white relative overflow-hidden">
        {/* subtle grid decoration */}
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none" aria-hidden>
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)',
              backgroundSize: '48px 48px',
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-3xl mb-14">
            <div className="text-[11px] font-mono uppercase tracking-[0.18em] text-[var(--aci-lime)] mb-3">
              {'// agentic ai'}
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
              Where AI actually enters the loop.
            </h2>
            <p className="text-lg text-gray-300">
              Not a buzzword section. Four places agents earn their keep,
              with the specific work they do and the problem they solve.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            {aiInLoop.map((block, idx) => (
              <div
                key={block.id}
                className="rounded-xl border border-gray-700/60 bg-gray-900/40 p-6 hover:bg-gray-900/70 transition-colors backdrop-blur-sm"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 inline-flex items-center justify-center w-10 h-10 rounded-lg bg-[var(--aci-lime)]/10 text-[var(--aci-lime)] ring-1 ring-[var(--aci-lime)]/25">
                    <span className="font-mono text-sm">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-3.5 h-3.5 text-[var(--aci-lime)]" />
                      <h3 className="text-lg font-semibold text-white">
                        {block.title}
                      </h3>
                    </div>
                    <p className="text-sm text-gray-300 leading-relaxed">
                      {block.body}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-10 text-sm text-gray-400 italic max-w-3xl">
            Practical order: self-healing in the first month, coverage gap
            detection shortly after, generation from stories and defect
            clustering once the baseline suite is stable.
          </p>
        </div>
      </section>
    </>
  );
}
