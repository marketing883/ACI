'use client';

/**
 * PlaybooksConsole - Palantir/Sentry austere-technical view of the
 * 10 production playbooks. Reads PLAYBOOKS from PlaybookVaultSection so
 * we keep a single source of truth.
 *
 * Aesthetic anchors:
 *   - Near-black background, subtle CRT grid overlay.
 *   - Monospace for IDs, counts, status chips, industries, timestamps.
 *   - Editorial sans for playbook names.
 *   - One restrained accent (lime) used surgically.
 *   - Zero icons except the link arrow.
 *
 * Interaction:
 *   - Hover: left accent bar + a one-line "primary outcome" fades in.
 *   - Click: row expands in-place with full challenge / outcomes /
 *     architecture detail. Re-click collapses. No modal.
 */

import { useState } from 'react';
import Link from 'next/link';
import { PLAYBOOKS, type PlaybookData } from '@/components/sections/PlaybookVaultSection';

/**
 * Action-oriented copy overrides for the homepage console.
 *
 * The PLAYBOOKS source lives in PlaybookVaultSection and is shared with the
 * live home and the /playbooks page. We keep that data untouched and instead
 * map a per-playbook marketing layer here (display name + 1-line "what we
 * will do for you" + the headline outcome line shown on hover).
 *
 * Voice rules: short sentences, no em-dashes, plain English with one or two
 * relevant buzzwords. Every line is phrased as something we will do for the
 * visitor, not something we have already done for someone else.
 */
type PlaybookCopy = {
  /** Display name shown in the row title. Replaces PlaybookData.name. */
  displayName: string;
  /** Single line under the row title. Plain English. No em-dashes. */
  promise: string;
  /** Headline outcome line shown on row hover. Already formatted, ready to render. */
  headlineOutcome: string;
};

const PLAYBOOK_COPY: Record<string, PlaybookCopy> = {
  'post-acquisition': {
    displayName: 'Turn your acquisition into one company.',
    promise: 'We stitch 30 to 50 inherited systems into one audited platform. Finance close stops looking like a hostage situation.',
    headlineOutcome: '$9.2M saved in year one. Zero disrupted closes.',
  },
  'multi-location': {
    displayName: 'Every location on the same page.',
    promise: 'We turn 300 to 1000 branches into one live data plane. Payments never flinch, not during the cutover, not at 11pm on a Friday.',
    headlineOutcome: 'Customer data lag down 64%. Payment uptime 99.97%.',
  },
  'global-unification': {
    displayName: 'Forty countries. One view. No more spreadsheets of spreadsheets.',
    promise: 'We unify regional silos across 40+ countries so your execs stop waiting three weeks for a single number.',
    headlineOutcome: 'Decisions land 50% faster. Executive reporting in days, not weeks.',
  },
  'self-service-analytics': {
    displayName: 'Get IT out of the chart-request business.',
    promise: 'We give 5,000+ people governed dashboards they can actually use, with row-level security baked in so nobody sees what they should not.',
    headlineOutcome: 'IT requests cut 88%. Time-to-insight down to 2 hours.',
  },
  'agentic-ai': {
    displayName: 'Put AI agents to work. Keep them on a leash.',
    promise: 'We wire bounded agents into real workflows with full context, real APIs, and an audit trail. No free-range LLMs.',
    headlineOutcome: 'Operations run 40 to 60% faster. Full audit coverage.',
  },
  'ai-governance': {
    displayName: 'Find your shadow AI before legal does.',
    promise: 'We inventory every model in use, including the ones hiding inside vendor products, tier the risk, and automate the audit evidence.',
    headlineOutcome: 'Full AI visibility. Audit cycles down 70%.',
  },
  'healthcare-data': {
    displayName: 'Move patient data across borders without losing sleep.',
    promise: 'We build one patient identity that respects HIPAA, GDPR, and every local rule in between. Encryption is baseline, not a feature.',
    headlineOutcome: 'One patient identity. Duplicates down 58%. Zero violations.',
  },
  'supply-chain': {
    displayName: 'See your supply chain before it breaks.',
    promise: 'We stitch procurement, logistics, and IoT into one live view. Disruptions become hours to act on, not days to discover.',
    headlineOutcome: 'End-to-end visibility. Costs down 25%. Response under 4 hours.',
  },
  'cloud-migration': {
    displayName: 'Get off legacy. Keep your users blissfully unaware.',
    promise: 'We re-architect aging on-prem stacks for the cloud with parallel runs. Nobody notices the migration. The bill just drops.',
    headlineOutcome: 'Infrastructure cost cut 68%. 10x faster scale-up.',
  },
  'data-integration': {
    displayName: 'Make your data trustworthy. Finally.',
    promise: 'We connect 20 to 40 source systems with self-healing pipelines and quality gates that catch bad data before your users do.',
    headlineOutcome: 'Data quality up 85%. Pipeline reliability 99.8%.',
  },
};

function pad2(n: number) {
  return n.toString().padStart(2, '0');
}

function PlaybookRow({ pb, index }: { pb: PlaybookData; index: number }) {
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState(false);
  // Copy override is the source for the row's display name, promise line,
  // and hover-revealed outcome. Fall back to the structured data only if the
  // override is missing for an unknown id.
  const copy = PLAYBOOK_COPY[pb.id];
  const displayName = copy?.displayName ?? pb.name;
  const promise = copy?.promise;
  const headlineOutcome = copy?.headlineOutcome;

  return (
    <div
      className="group relative"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {/* Left accent bar - animates in on hover */}
      <div
        className="absolute left-0 top-0 bottom-0 w-px bg-[#C4FF61] origin-top transition-transform duration-300 ease-out"
        style={{ transform: hover || open ? 'scaleY(1)' : 'scaleY(0)' }}
        aria-hidden
      />

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="w-full text-left py-7 md:py-8 px-5 md:px-8 cursor-pointer focus:outline-none focus:bg-white/[0.02]"
      >
        {/* Top line: ID + name + deployment count phrase. Status chip
            dropped - it was abstract labeling without clear meaning. The
            count phrase on the right tells the visitor exactly what they
            need to know: this play has been shipped this many times. */}
        <div className="flex items-baseline gap-4 md:gap-6 flex-wrap">
          <span className="font-mono text-[#C4FF61]/90 text-sm md:text-base tracking-wider">
            PB-{pad2(index + 1)}
          </span>
          <span
            className="text-white font-[var(--font-title)] font-medium flex-1 min-w-[280px]"
            style={{ fontSize: 'clamp(20px, 2.4vw, 28px)', lineHeight: 1.2 }}
          >
            {displayName}
          </span>
          {/* Right-side count. Two-line so the big number carries the
              weight and the qualifier sits small and dry beneath it.
              Reads like a tally mark, not a product spec. */}
          <span className="text-right whitespace-nowrap leading-none">
            <span
              className="block font-[var(--font-title)] font-bold text-white"
              style={{ fontSize: 'clamp(22px, 2.4vw, 30px)', letterSpacing: '-0.02em' }}
            >
              {pb.deployments}x
            </span>
            <span className="mt-1 block font-mono text-[10px] md:text-xs uppercase tracking-[0.2em] text-white/55">
              and counting
            </span>
          </span>
        </div>

        {/* Promise line: action-oriented sentence describing what we will
            do for the visitor, in plain English. */}
        {promise && (
          <p className="mt-3 text-white/75 text-base md:text-lg max-w-3xl leading-relaxed">
            {promise}
          </p>
        )}

        {/* Industries: small monospace tag list */}
        <div className="mt-4 font-mono text-xs md:text-sm text-white/45 tracking-wide">
          {pb.industries.map((i) => i.toLowerCase()).join(' . ')}
        </div>

        {/* Hover-revealed headline outcome */}
        <div
          className="mt-4 overflow-hidden transition-all duration-300 ease-out"
          style={{
            maxHeight: hover && !open ? '32px' : '0px',
            opacity: hover && !open ? 1 : 0,
          }}
          aria-hidden
        >
          {headlineOutcome && (
            <div className="font-mono text-xs md:text-sm flex items-center gap-3">
              <span className="inline-block w-4 h-px bg-[#C4FF61]/60" />
              <span className="text-[#C4FF61]/90">{headlineOutcome}</span>
            </div>
          )}
        </div>
      </button>

      {/* Click-expanded detail */}
      {open && (
        <div className="px-5 md:px-8 pb-10 -mt-2">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10 pt-6 border-t border-white/10">
            {/* What you get - the punchline outcomes */}
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#C4FF61]/80 mb-4">
                {'// what you get'}
              </div>
              <div className="space-y-4">
                {pb.outcomes.map((o, i) => (
                  <div key={i}>
                    <div
                      className="font-bold text-white font-[var(--font-title)]"
                      style={{ fontSize: 'clamp(28px, 3vw, 40px)', lineHeight: 1, letterSpacing: '-0.02em' }}
                    >
                      {o.metric}
                    </div>
                    <div className="font-mono text-xs text-white/55 mt-1.5">
                      {o.description.toLowerCase()}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* What we fix - the recurring pattern we walk into */}
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#C4FF61]/80 mb-4">
                {'// what we fix'}
              </div>
              <ul className="space-y-2.5">
                {pb.challengePattern.map((c, i) => (
                  <li key={i} className="text-white/75 text-sm flex gap-3">
                    <span className="font-mono text-[#C4FF61]/60 flex-shrink-0">
                      {pad2(i + 1)}
                    </span>
                    <span className="leading-relaxed">{c}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* What we run on - the proven stack */}
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#C4FF61]/80 mb-4">
                {'// what we run on'}
              </div>
              <div className="flex flex-wrap gap-2">
                {pb.architecture.map((a, i) => (
                  <span
                    key={i}
                    className="font-mono text-xs text-white/80 px-2.5 py-1 border border-white/20 bg-white/[0.05]"
                  >
                    {a}
                  </span>
                ))}
              </div>

              {/* Link out */}
              <div className="mt-8">
                <Link
                  href={`/playbooks/${pb.slug}`}
                  className="group/link inline-flex items-center gap-2 font-mono text-xs md:text-sm text-[#C4FF61] hover:text-[#C4FF61]/80 transition-colors"
                >
                  <span>see the full playbook</span>
                  <span className="transition-transform duration-200 group-hover/link:translate-x-1">
                    -&gt;
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hairline divider */}
      <div className="h-px bg-white/[0.06]" />
    </div>
  );
}

export default function PlaybooksConsole() {
  const total = pad2(PLAYBOOKS.length);

  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      {/* Background photo + dark scrim. The image lives in /public/images
          and is loaded as a CSS background so it can fill bleed without
          us hand-rolling an Image component layer here. */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: 'url(/images/playbook-section-bg.jpg)' }}
        aria-hidden
      />
      {/* Heavy dark scrim so monospace details and outcome metrics stay legible
          on top of the photographic background. */}
      <div className="absolute inset-0 bg-[#040912]/[0.86]" aria-hidden />
      {/* Subtle vignette to keep visual focus toward the rows */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.55) 100%)',
        }}
        aria-hidden
      />

      <div className="relative max-w-[1320px] mx-auto px-5 md:px-10">
        {/* Section header. Copy authored so the wrapped last line never
            leaves a widow word (see CLAUDE.md). */}
        <div className="mb-12 md:mb-16 px-1 md:px-8">
          <div className="font-mono text-xs md:text-sm text-white/55 tracking-wider mb-6">
            {`// ${total} playbooks . in production`}
          </div>
          {/* Non-breaking space between the final two words so the last
              line of the wrapped headline is never a single orphan word
              (widow rule, see CLAUDE.md). */}
          <h2
            className="text-white font-[var(--font-title)] font-bold max-w-3xl"
            style={{
              fontSize: 'clamp(36px, 5.4vw, 64px)',
              lineHeight: 1.05,
              letterSpacing: '-0.025em',
            }}
          >
            {"See What's Possible for Your\u00A0Organization"}
          </h2>
          <p className="mt-5 text-white/75 max-w-2xl text-base md:text-lg leading-relaxed">
            {'Every pattern below has been deployed at enterprise scale. Real problems, real environments, real\u00A0outcomes.'}
          </p>
        </div>

        {/* Console rows */}
        <div className="border-t border-white/[0.06]">
          {PLAYBOOKS.map((pb, i) => (
            <PlaybookRow key={pb.id} pb={pb} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
