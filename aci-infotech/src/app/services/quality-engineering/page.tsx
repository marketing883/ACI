import { Metadata } from 'next';
import RelatedLinks from '@/components/seo/RelatedLinks';
import { qualityEngineeringRelated } from '@/content/related-links';
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
  ProcessStrip,
  BridgeBand,
  FactsRow,
  PageFaq,
  cardShadow,
  CheckBadge,
  DecisionCircle,
  glueWidow,
} from '@/components/v4/page/kit';
import FlowScene from '@/components/v4/page/FlowScene';
import { FLOWS } from '@/components/v4/page/flow-configs';

export const revalidate = 3600;

// Canonical origin: always production, so staging builds can never
// self-canonicalize (see src/lib/site-url.ts).
const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  title: 'Quality Engineering Services',
  description:
    'Quality engineering as a discipline, not a test phase. In-sprint automation, agentic AI coverage, CI/CD quality gates, and observability-fed quality.',
  keywords:
    'quality engineering, QE services, AI-augmented testing, agentic test automation, continuous testing, shift-left quality, in-sprint automation, CI/CD quality gates, performance engineering, security testing',
  alternates: {
    canonical: `${siteUrl}/services/quality-engineering`,
  },
  // Per-page social card. Without this, every share and link preview
  // inherited the homepage's OpenGraph (title, image, and og:url all
  // pointing at /), mis-attributing all 21 service/platform pages.
  openGraph: {
    title: 'Quality Engineering Services | ACI Infotech',
    description: 'Quality engineering as a discipline, not a test phase. In-sprint automation, agentic AI coverage, CI/CD quality gates, and observability-fed quality.',
    url: `${siteUrl}/services/quality-engineering`,
    siteName: 'ACI Infotech',
    type: 'website',
    images: DEFAULT_OG_IMAGES,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Quality Engineering Services | ACI Infotech',
    description: 'Quality engineering as a discipline, not a test phase. In-sprint automation, agentic AI coverage, CI/CD quality gates, and observability-fed quality.',
    images: DEFAULT_TWITTER_IMAGES,
  },
};

/* ------------------------------- page copy ------------------------------- */

// "From QA to QE" — the page's signature asset. An explicit positioning
// shift so visitors don't read the rename as a cosmetic swap. Each side
// is a set of short, concrete lines that describe how the work actually
// happens today vs how it used to happen.
const QA_VS_QE: { qa: string; qe: string }[] = [
  {
    qa: 'Executed by a separate team after the build is done',
    qe: 'Owned by the same team that writes the code',
  },
  {
    qa: 'Manual test cases in a spreadsheet, regression sprints at the end',
    qe: 'Tests as code, versioned and reviewed in the same pull request',
  },
  {
    qa: 'Staff-augmentation shops billing by headcount',
    qe: 'Automation first; exploratory testing as the only manual step',
  },
  {
    qa: 'Quality as a gate; releases held up or rolled back',
    qe: 'Quality as a property of the system, watched in production',
  },
  {
    qa: 'Tests as an artefact maintained by someone else',
    qe: 'AI agents scaling the coverage humans cannot keep up with',
  },
];

// The "Quality Loop". Four stages of delivery, each with what the stage
// produces and the specific AI augmentation that applies there. The
// loop-back note at the end is the whole point: quality is a continuous
// property of the system, not a late-stage gate.
const QUALITY_LOOP = [
  {
    label: 'Design',
    work: 'Risk models, test-first specs, acceptance criteria tied to code.',
    aiRole: 'Agentic test generation from stories',
  },
  {
    label: 'Build',
    work: 'In-sprint automation, unit and integration coverage, static analysis.',
    aiRole: 'Self-healing suites, drift detection',
  },
  {
    label: 'Ship',
    work: 'CI gates, load validation, security scans on every pull request.',
    aiRole: 'Flaky-test prediction, quarantine',
  },
  {
    label: 'Observe',
    work: 'Production telemetry, SRE-adjacent quality, feedback into tests.',
    aiRole: 'Coverage gap detection, defect clustering',
  },
];

// Four concrete places AI earns its keep in QE. Each card describes a
// specific problem and a specific agent behaviour. No "AI-powered" filler.
const AI_IN_LOOP = [
  {
    title: 'Test generation',
    body: 'Agents ingest user stories, code changes, and past defects, then generate the test cases humans miss. Coverage climbs without a proportional headcount climb.',
  },
  {
    title: 'Self-healing suites',
    body: 'UI selectors drift, tests break, engineers lose the week fixing them. An agent watches the drift, updates selectors, and flags the ones it cannot resolve. Your team writes new tests instead of babysitting old ones.',
  },
  {
    title: 'Flaky-test prediction',
    body: 'Before a test becomes a chronic flake, a model sees the pattern and quarantines it. The pipeline stays trustworthy; engineers keep merging with confidence.',
  },
  {
    title: 'Defect pattern analysis',
    body: 'Bugs cluster. An agent reads the defect log, groups by root cause, and tells you which class of bug to eliminate next. Root cause, not whack-a-mole.',
  },
];

// Six capabilities, delivered as part of engineering, not separate from
// it. The strongest outcome from each is folded into the body; the tools
// are starting points, not mandates.
const CAPABILITIES = [
  {
    title: 'In-sprint test automation',
    body: 'End-to-end, integration, and unit suites written the same sprint the feature lands. Executable tests on every commit, finished in under ten minutes, with a zero flaky-test policy.',
    chips: ['Playwright', 'Cypress', 'Jest', 'Pytest', 'Selenium'],
  },
  {
    title: 'Agentic AI test coverage',
    body: 'Autonomous agents that generate, execute, and maintain suites. Reads user stories, code, and past defects to find cases your team did not think of. Coverage up 3x, selectors that heal themselves.',
    chips: ['Mabl', 'Testim', 'Applitools', 'Custom agents'],
  },
  {
    title: 'CI/CD quality gates',
    body: 'Tests wired into pull request checks, deploy stages, and post-deploy smoke. Bad merges blocked at source; every merge hits production with confidence.',
    chips: ['GitHub Actions', 'GitLab CI', 'Jenkins', 'CircleCI', 'ArgoCD'],
  },
  {
    title: 'Performance and load engineering',
    body: 'Real-scale validation before production finds it for you. Load testing, performance benchmarking, capacity planning, all part of delivery. Validated scale targets, no surprise outages.',
    chips: ['k6', 'JMeter', 'Gatling', 'Locust', 'BlazeMeter'],
  },
  {
    title: 'Security testing as engineering',
    body: 'SAST, DAST, dependency scanning, and penetration testing in the pipeline. A continuous discipline, not a late-stage audit, with vulnerabilities caught before production.',
    chips: ['OWASP ZAP', 'Snyk', 'Checkmarx', 'Burp Suite'],
  },
  {
    title: 'Observability-fed quality',
    body: 'Production telemetry loops back into test strategy. Coverage gaps get detected from real traffic; flakiness quarantined before it breaks trust in CI. Quality trends, not hunches.',
    chips: ['Datadog', 'SonarQube', 'Grafana', 'Custom dashboards'],
  },
];

// Differentiators: why our QE is different from a staff-augmentation QA
// vendor. Claim, expansion, and a proof line that tells the visitor what
// the claim actually looks like.
const DIFFERENTIATORS = [
  {
    title: 'Engineering discipline, not a testing vendor',
    description:
      'QE is engineering work. We staff it with engineers, not with QA-coded staff augmentation. Tests land in your repo and get reviewed like any other pull request.',
    proof: 'Tests live in your repo, versioned like code',
  },
  {
    title: 'Embedded in delivery, not parallel to it',
    description:
      'One team, one sprint cadence, one shared quality goal. Our engineers write, review, and maintain alongside yours. No separate testing phase that slows everything down.',
    proof: 'One team, one cadence, shared ownership',
  },
  {
    title: 'Automated from sprint one, not sprint thirty',
    description:
      'The cheapest time to instrument is now. We do not retrofit automation after the fact; coverage starts with the first feature, not when tech debt catches up.',
    proof: '90%+ automation as a default, not a nice-to-have',
  },
  {
    title: 'Accountable through production',
    description:
      'Tests are a living contract. We keep them true as the app evolves, on an SLA. No "handed over at go-live" and then silence.',
    proof: '24/7 ownership of test infrastructure',
  },
];

// Beyond delivery. The operational side of QE; the work that keeps the
// suite honest as the system around it changes.
const BEYOND_DELIVERY = [
  {
    label: 'Production operations',
    line: '24/7 monitoring of test infrastructure, alerts on flaky suites, continuous maintenance as the application evolves.',
  },
  {
    label: 'SLA-backed support',
    line: 'Contractual response times for CI failures, defined escalation paths, accountable ownership of quality gates.',
  },
  {
    label: 'Continuous optimisation',
    line: 'Test suite performance tuning, coverage gap analysis, defect trend monitoring. Quality improves over time, not degrades.',
  },
  {
    label: 'Evolution as partners',
    line: 'As your application changes, the test strategy changes with it. We stay on the long arc, evolving coverage rather than maintaining it in place.',
  },
];

const FAQS = [
  {
    question: 'How is Quality Engineering different from QA and testing?',
    answer:
      'QA ran at the end, by a separate team, against a spreadsheet of manual cases. QE runs throughout delivery, owned by the same engineers who write the code, with automated suites and AI agents maintaining coverage. Same engineers, same repo, same accountability.',
  },
  {
    question: 'Do you do manual regression testing?',
    answer:
      'Not as a standalone service. A short exploratory pass is part of any healthy QE practice, but we are not a manual regression shop. If that is what you need, we will tell you upfront and point you at a better-fit partner.',
  },
  {
    question: 'What stack do you default to?',
    answer:
      'Playwright for end-to-end, Jest or Pytest for unit and integration, k6 or JMeter for performance, OWASP tooling for security. We meet you where you are; if your team runs Cypress or Selenium we plug into that rather than forcing a swap.',
  },
  {
    question: 'How does agentic AI fit in practically?',
    answer:
      'Month one: self-healing UI selectors so your team stops babysitting drift. Month two or three: coverage gap detection from production traffic. Once the baseline suite is stable, agentic generation from user stories and defect clustering. Not all of it on day one.',
  },
  {
    question: 'How do you plug into our CI/CD pipeline?',
    answer:
      'Whatever you run. GitHub Actions, GitLab CI, Jenkins, CircleCI, Azure DevOps. Quality gates wire into pull request checks, deploy stages, and post-deploy smoke. Results flow back into your existing tools; no context switching.',
  },
];

/* --------------------------------- page ---------------------------------- */

export default function QualityEngineeringPage() {
  return (
    <div className={`bg-white text-black ${v4Sans}`}>
      <ServiceSchema
        name="Quality Engineering Services"
        description="Quality as an engineering discipline, not a test phase. AI-augmented, continuous, and owned by the team that ships."
        url="/services/quality-engineering"
        serviceType="Quality Engineering Consulting"
      />
      {/* FAQPage JSON-LD comes from PageFaq below — one per page. */}
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: '/' },
          { name: 'Services', url: '/services' },
          { name: 'Quality Engineering', url: '/services/quality-engineering' },
        ]}
      />

      <ServiceHero
        kicker="Quality Engineering"
        title={
          <>
            Quality engineering, built into{' '}
            <span style={{ color: '#1D4ED8' }}>every&nbsp;release.</span>
          </>
        }
        lede="Quality as an engineering discipline, not a test phase. Tests run on every commit, AI agents generate and heal the suites, and production telemetry feeds the strategy instead of guesswork. Continuous, AI-augmented, and owned by the team that ships."
        chips={[
          'In-sprint automation',
          'Agentic AI coverage',
          'CI/CD quality gates',
          'Observability-fed',
        ]}
        primary={{ label: 'Talk to a quality engineer', href: '/contact?service=quality-engineering&source=hero' }}
        secondary={{ label: 'See the case studies', href: '/case-studies' }}
        visual={<FlowScene config={FLOWS['quality-engineering']} />}
      />

      {/* Problem band: the release gate nobody trusts */}
      <FoldcraftHero
        geistClass={v4Geist}
        image="/images/v4/case-manufacturing.jpg"
        pill="Quality at commit speed"
        headline={
          <>
            A gate everyone trusts{' '}
            <br className="hidden sm:block" />
            <span className="text-[#60A5FA]">moves at commit&nbsp;speed.</span>
          </>
        }
        body="Move the checks into the sprint, the pipeline, and production telemetry and they run on every commit: automated suites in CI, AI agents growing the coverage, and a release train that leaves on schedule. The gate becomes a green light."
        story={{
          metric: { value: '99.97%', label: 'Uptime across 72+ servers' },
          title: 'CI/CD, monitoring, and quality gates automated across a complex estate',
          href: '/case-studies/optimizing-enterprise-it-operations-with-automated-devops-and-monitoring',
          logoSrc: '/brand/aci-infotech-logo-white.png',
          logoAlt: 'ACI Infotech',
        }}
      />

      {/* Signature: From QA to QE comparison table */}
      <section className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <SectionHead
            kicker="The shift"
            title={
              <>
                From QA <span style={{ color: '#1D4ED8' }}>to&nbsp;QE.</span>
              </>
            }
            sub="We rebranded because the work changed. The old framing stopped describing what we actually do."
          />

          {/* Two-column decision grammar: the old way in muted cards, the
              way we do it with check badges, circle window in between. */}
          <div className="mt-12 flex flex-col gap-8 lg:grid lg:grid-cols-[1fr_auto_1fr] lg:items-start lg:gap-10">
            <div className="order-first flex justify-center lg:order-none lg:col-start-2 lg:row-start-1 lg:self-center">
              <DecisionCircle />
            </div>

            <div className="flex flex-col gap-4 lg:col-start-1 lg:row-start-1">
              <div className={`flex items-center justify-center rounded-2xl bg-white px-6 py-6 ${cardShadow}`}>
                <span className={`text-center text-xl font-semibold text-gray-400 ${v4Display}`}>
                  QA, the old way
                </span>
              </div>
              {QA_VS_QE.map((row) => (
                <div key={row.qa} className={`rounded-2xl bg-white px-5 py-4 ${cardShadow}`}>
                  <p className="text-[15px] leading-snug text-gray-500">{glueWidow(row.qa)}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-4 lg:col-start-3 lg:row-start-1">
              <div className={`flex items-center justify-center rounded-2xl bg-white px-6 py-6 ${cardShadow}`}>
                <span className={`text-center text-xl font-semibold text-black ${v4Display}`}>
                  QE, the way we do it
                </span>
              </div>
              {QA_VS_QE.map((row) => (
                <div key={row.qe} className={`flex items-start gap-3 rounded-2xl bg-white px-5 py-4 ${cardShadow}`}>
                  <CheckBadge />
                  <p className="text-[15px] font-medium leading-snug text-gray-800">{glueWidow(row.qe)}</p>
                </div>
              ))}
            </div>
          </div>

          <p className="mt-8 max-w-3xl text-sm leading-relaxed text-gray-500">
            Same engineering discipline, sharper name. Visitors who came looking
            for QA find it here; what we actually ship is QE.
          </p>
        </div>
      </section>

      {/* Signature: the Quality Loop */}
      <section className="border-t border-gray-200 bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <SectionHead
            kicker="The quality loop"
            title={
              <>
                A loop, <span style={{ color: '#1D4ED8' }}>not a gate.</span>
              </>
            }
            sub="Four stages of delivery, each with the work it produces and the specific AI augmentation that applies there."
          />

          <ProcessStrip
            steps={QUALITY_LOOP.map((stage) => ({
              title: stage.label,
              timeframe: `AI: ${stage.aiRole}`,
              body: stage.work,
            }))}
          />

          <p className="mt-10 border-t border-gray-200 pt-6 text-sm font-medium text-gray-500">
            Then the loop closes: production feedback flows into the next design
            cycle, and coverage follows the system instead of chasing it.
          </p>
        </div>
      </section>

      {/* What AI does on the team */}
      <section className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <SectionHead
            kicker="AI on the team"
            title={
              <>
                What AI does <span style={{ color: '#1D4ED8' }}>on the&nbsp;team.</span>
              </>
            }
            sub="Four jobs that buy back engineer hours from test maintenance, flake chasing, and defect triage."
          />

          <div className="mt-12 grid gap-x-14 md:grid-cols-2">
            {AI_IN_LOOP.map((block, i) => (
              <div key={block.title} className="border-t border-gray-200 py-8">
                <div className="flex items-baseline gap-4">
                  <span className={`text-sm font-semibold text-gray-300 ${v4Display}`}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className={`text-xl font-semibold text-black md:text-2xl ${v4Display}`}>
                    {block.title}
                  </h3>
                </div>
                <p className="mt-3 text-[15px] leading-relaxed text-gray-600">{block.body}</p>
              </div>
            ))}
          </div>

          <p className="mt-8 max-w-3xl text-sm leading-relaxed text-gray-500">
            Practical order: self-healing in the first month, coverage gap
            detection shortly after, generation from stories and defect
            clustering once the baseline suite is stable.
          </p>
        </div>
      </section>

      {/* Capabilities */}
      <section className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <SectionHead
            kicker="What we actually ship"
            title={
              <>
                Six capabilities, delivered{' '}
                <span style={{ color: '#1D4ED8' }}>as part of&nbsp;engineering.</span>
              </>
            }
            sub="Not as a separate phase, not by a different team, not on a different contract. Part of how the system is built."
          />
          <OfferingList items={CAPABILITIES} />
          <p className="mt-8 max-w-3xl text-sm leading-relaxed text-gray-500">
            Default stacks above. We meet you where you are; if your team runs a
            different toolchain we plug into that rather than forcing a swap.
          </p>
        </div>
      </section>

      {/* Differentiators */}
      <section className="border-t border-gray-200 bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <SectionHead
            kicker="Why ACI"
            title="What we do differently"
            sub="Four ways we work, and what each one actually looks like in your repo."
          />
          <div className="mt-12 grid gap-x-14 md:grid-cols-2">
            {DIFFERENTIATORS.map((diff) => (
              <div key={diff.title} className="border-t border-gray-200 py-8">
                <h3 className={`text-xl font-semibold text-black md:text-2xl ${v4Display}`}>
                  {diff.title}
                </h3>
                <p className="mt-3 text-[15px] leading-relaxed text-gray-600">{diff.description}</p>
                <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-blue-700">
                  {diff.proof}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Beyond delivery */}
      <section className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <SectionHead
            kicker="Beyond delivery"
            title="Quality is not a one-time project"
            sub="We stay to maintain, evolve, and optimise quality infrastructure as the application grows. We run what we build."
          />
          <FactsRow facts={BEYOND_DELIVERY} />
        </div>
      </section>

      {/* The one-sprint offer, kept from the original closing CTA */}
      <BridgeBand
        title="Fewer flakes. Faster releases. One sprint to see."
        body="Pick your worst-flaking area. We wire in a self-healing suite for one sprint and you see the cycle-time shift in two weeks. Go quarter by quarter after that."
        link={{ label: 'Start with one sprint', href: '/contact?service=quality-engineering' }}
      />

      <PageFaq
        kicker="Questions"
        title={
          <>
            QE questions,
            <br />
            <span style={{ color: '#1D4ED8' }}>answered straight.</span>
          </>
        }
        sub="The questions we hear most before a quality engagement. Anything else belongs in a conversation."
        faqs={FAQS}
      />

      <ClusterPosts keywords={['quality engineering', 'testing', 'test automation', 'qa', 'ci/cd']} />

      <RelatedLinks items={qualityEngineeringRelated} />

      {/* Closing CTA: video stage, one button, nothing else */}
      <CtaSection label="Let's raise the quality bar" href="/contact?service=quality-engineering&source=cta-section" />
    </div>
  );
}
