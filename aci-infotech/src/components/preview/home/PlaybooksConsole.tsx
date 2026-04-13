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
    displayName: 'Land your acquisition cleanly.',
    promise: 'We collapse 30 to 50 inherited systems into one audited platform without breaking finance close.',
    headlineOutcome: '$9.2M saved in year one with zero close disruptions.',
  },
  'multi-location': {
    displayName: 'Run every location on live data.',
    promise: 'We turn 300 to 1000 stores, branches, or sites into a single real-time data plane that never takes payments offline.',
    headlineOutcome: 'Customer data lag down 64% with 99.97% payment uptime.',
  },
  'global-unification': {
    displayName: 'See your global business in one view.',
    promise: 'We unify regional silos across 40 plus countries so your executives stop waiting weeks for one number.',
    headlineOutcome: 'Decisions land 50% faster on a single global view.',
  },
  'self-service-analytics': {
    displayName: 'Give every team self-service answers.',
    promise: 'We hand 5,000 plus people governed dashboards with row-level security so IT stops being the queue.',
    headlineOutcome: 'IT requests cut 88%. Time-to-insight drops to 2 hours.',
  },
  'agentic-ai': {
    displayName: 'Put production agents to work.',
    promise: 'We wire bounded AI agents into your real workflows with full context, real APIs, and an audit trail.',
    headlineOutcome: 'Operations run 40 to 60% faster with 100% audit coverage.',
  },
  'ai-governance': {
    displayName: 'Get every AI model under control.',
    promise: 'We discover your shadow AI, tier the risk, and automate evidence so audits stop costing weeks.',
    headlineOutcome: 'Full AI visibility. Audits move 70% faster.',
  },
  'healthcare-data': {
    displayName: 'Move patient data across borders, safely.',
    promise: 'We build a unified patient identity that respects HIPAA, GDPR, and every regional rule in between.',
    headlineOutcome: 'One patient identity. Duplicates down 58%. Zero violations.',
  },
  'supply-chain': {
    displayName: 'See your supply chain end to end.',
    promise: 'We connect procurement, logistics, and IoT into one live view so disruptions become hours, not days.',
    headlineOutcome: 'Full E2E visibility. Costs cut 25%. Response time under 4 hours.',
  },
  'cloud-migration': {
    displayName: 'Get off legacy without breaking ops.',
    promise: 'We re-architect aging on-prem stacks for the cloud with parallel runs, so the migration is invisible to users.',
    headlineOutcome: 'Infrastructure cost cut 68%. 10x faster scale-up.',
  },
  'data-integration': {
    displayName: 'Make your data trustworthy at last.',
    promise: 'We connect 20 to 40 source systems with self-healing pipelines and quality gates that catch issues before users do.',
    headlineOutcome: '85% lift in data quality. 99.8% pipeline reliability.',
  },
};

type Status = 'scaled' | 'live' | 'iterating';

function statusFor(deployments: number): Status {
  if (deployments >= 30) return 'scaled';
  if (deployments >= 15) return 'live';
  return 'iterating';
}

function pad2(n: number) {
  return n.toString().padStart(2, '0');
}
function pad3(n: number) {
  return n.toString().padStart(3, '0');
}

const STATUS_STYLES: Record<Status, string> = {
  scaled: 'text-[#C4FF61] border-[#C4FF61]/40 bg-[#C4FF61]/[0.06]',
  live: 'text-cyan-300 border-cyan-300/40 bg-cyan-300/[0.05]',
  iterating: 'text-amber-300 border-amber-300/40 bg-amber-300/[0.05]',
};

function PlaybookRow({ pb, index }: { pb: PlaybookData; index: number }) {
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState(false);
  const status = statusFor(pb.deployments);
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
        {/* Top line: ID + name + count + status */}
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
          <span className="font-mono text-white/50 text-sm md:text-base">
            dep:{pad3(pb.deployments)}
          </span>
          <span
            className={`font-mono text-[11px] md:text-xs uppercase tracking-[0.18em] px-2.5 py-1 border ${STATUS_STYLES[status]}`}
          >
            {status}
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
  // Format date as YYYY-MM-DD using the build/render time. This matches the
  // austere "last updated" feel without depending on real DB metadata.
  const today = new Date().toISOString().slice(0, 10);
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
        {/* Section header */}
        <div className="mb-12 md:mb-16 px-1 md:px-8">
          <div className="font-mono text-xs md:text-sm text-white/55 tracking-wider mb-6">
            {`// ${total} playbooks . in production . last updated ${today}`}
          </div>
          <h2
            className="text-white font-[var(--font-title)] font-bold max-w-3xl"
            style={{
              fontSize: 'clamp(36px, 5.4vw, 64px)',
              lineHeight: 1.05,
              letterSpacing: '-0.025em',
            }}
          >
            Pick the move you need next.
          </h2>
          <p className="mt-5 text-white/75 max-w-2xl text-base md:text-lg leading-relaxed">
            Ten things we already know how to ship for you. Each one is a
            proven pattern, not a slide. Open a row to see what we will fix,
            what you will get, and the stack we will run on.
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
