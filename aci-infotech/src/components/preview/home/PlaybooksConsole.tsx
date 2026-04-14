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
    displayName:
      'Integrate a New Platform Without Disrupting What Already\u00A0Works.',
    promise:
      "When a new platform comes in, whether it's SAP, Salesforce, or a cloud-native stack, the real work is making it operate cleanly alongside the 20 to 50 systems already running your business. We handle the integration, data mapping, and cutover so the new platform delivers value from day one instead of creating a new layer of\u00A0complexity.",
    headlineOutcome: '$9.2M saved in year one. Zero disrupted closes.',
  },
  'multi-location': {
    displayName: 'Give Every Location Real-Time Operational\u00A0Visibility.',
    promise:
      'Multi-location businesses lose money when each site runs on its own data. We build a single live data layer across 300 to 1,000 locations so inventory, payments, and performance are visible in real time, not 24 hours\u00A0later.',
    headlineOutcome: '64% latency reduced. Zero cutover disruptions.',
  },
  'global-unification': {
    displayName: 'One Global Data Platform. No More Regional\u00A0Silos.',
    promise:
      'Global operations teams waste weeks reconciling regional data that was never designed to align. We unify it into one governed platform so leadership has a single, reliable view across every market they operate\u00A0in.',
    headlineOutcome: '50% faster decisions. Manual reconciliation eliminated entirely.',
  },
  'self-service-analytics': {
    displayName:
      'Self-Service Analytics for Business Teams, Without IT in the\u00A0Middle.',
    promise:
      'When every dashboard request goes through IT, the business slows down and the data team burns out. We deploy governed self-service analytics for 5,000 plus users with row-level security ensuring each person sees exactly what they should, nothing\u00A0more.',
    headlineOutcome: '88% reduction in IT analytics requests. 92% user satisfaction.',
  },
  'agentic-ai': {
    displayName:
      'Deploy AI Agents Into Live Workflows With Full\u00A0Governance.',
    promise:
      'AI agents only deliver value when they are connected to real workflows and accountable for every action. We deploy bounded agents with full API access, complete audit trails, and governance built in from day one, not added after something goes\u00A0wrong.',
    headlineOutcome: 'Operations run 40 to 60% faster. Full audit coverage.',
  },
  'ai-governance': {
    displayName:
      'Find Every AI Model in Your Environment Before Compliance\u00A0Does.',
    promise:
      'Most enterprises have more AI running across their systems and vendor products than their security team has documented. We conduct a full AI inventory, tier every risk, and produce audit-ready evidence before regulators or legal ask for\u00A0it.',
    headlineOutcome: '100% AI inventory visibility. 70% faster audit cycles.',
  },
  'healthcare-data': {
    displayName:
      'Unify Patient Data Across Jurisdictions Without Compliance\u00A0Risk.',
    promise:
      'Healthcare data crosses jurisdictions where compliance rules frequently conflict. We build a unified patient identity architecture that satisfies every applicable regulation with encryption and access controls as the foundation, not an\u00A0afterthought.',
    headlineOutcome: 'One patient identity. Duplicates down 58%. Zero violations.',
  },
  'supply-chain': {
    displayName:
      'See Supply Chain Problems Before They Become\u00A0Disruptions.',
    promise:
      'Supply chain disruptions are only expensive when you find out about them late. We integrate procurement, logistics, and IoT data into one live view so operations teams can see problems forming and respond before they become outages or\u00A0stockouts.',
    headlineOutcome: 'Disruption response time cut from days to hours. Stockouts down 73%.',
  },
  'cloud-migration': {
    displayName:
      'Modernize Legacy Systems Without Disrupting Daily\u00A0Operations.',
    promise:
      'Legacy infrastructure does not get replaced, it gets worked around, until it cannot be. We re-architect aging systems using parallel migration runs so users experience no disruption and the business sees lower operational costs from day\u00A0one.',
    headlineOutcome: 'Infrastructure cost cut 68%. 10x faster scale-up.',
  },
  'data-integration': {
    displayName:
      'Fix Data Quality Problems Before They Reach Your\u00A0Decisions.',
    promise:
      'Bad data does not announce itself. It shows up in board decks, forecasts, and decisions made on numbers nobody verified. We connect 20 to 40 source systems with self-healing pipelines and automated quality gates that catch problems at the source before they reach anyone\u00A0downstream.',
    headlineOutcome: 'Data quality incidents down 91%. Pipeline failures self-resolved before escalation.',
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
        {/* Top band: eyebrow + tally on the left, big display name sits
            underneath. The eyebrow ("Playbook 01") and the live tally
            read like a dashboard strip; the display name is the
            headline beneath it. */}
        <div className="flex items-start justify-between gap-6">
          <div className="flex-1 min-w-0">
            <div className="font-mono text-[10px] md:text-xs uppercase tracking-[0.22em] text-[#C4FF61]/80 mb-3">
              Playbook {pad2(index + 1)}
            </div>
            <span
              className="block text-white font-[var(--font-title)] font-medium"
              style={{ fontSize: 'clamp(20px, 2.4vw, 28px)', lineHeight: 1.2 }}
            >
              {displayName}
            </span>
          </div>
          {/* Live tally. Pulsing lime dot signals "active, still running".
              The big number anchors the unit, and the caption beneath
              puts it in context by pulling real industry breadth from
              the playbook data. */}
          <div className="text-right whitespace-nowrap leading-none pt-1">
            <div className="flex items-baseline justify-end gap-2">
              <span
                className="relative inline-flex h-2 w-2 rounded-full bg-[#C4FF61]"
                aria-hidden
              >
                <span className="absolute inset-0 rounded-full bg-[#C4FF61] opacity-60 animate-ping" />
              </span>
              <span
                className="font-[var(--font-title)] font-bold text-white"
                style={{ fontSize: 'clamp(28px, 3.2vw, 40px)', letterSpacing: '-0.03em' }}
              >
                {pb.deployments}
              </span>
              <span
                className="font-mono text-white/55"
                style={{ fontSize: 'clamp(11px, 1vw, 13px)' }}
              >
                live
              </span>
            </div>
            <div className="mt-2 font-mono text-[10px] md:text-xs uppercase tracking-[0.2em] text-white/55">
              across {pb.industries.length} industries
            </div>
          </div>
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

// Which of the source PLAYBOOKS show on the homepage console, in display
// order. These are the original PB-01, PB-03, PB-05, PB-07, PB-09
// indexes (1-based), i.e. every other playbook starting from the first.
// The homepage renumbers them Playbook 01 through Playbook 05 so the
// visitor is not confronted with a jumping sequence.
const HOMEPAGE_PLAYBOOK_INDEXES = [0, 2, 4, 6, 8] as const;

export default function PlaybooksConsole() {
  const homepagePlaybooks = HOMEPAGE_PLAYBOOK_INDEXES.map((i) => PLAYBOOKS[i]);

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
            leaves a widow word (see CLAUDE.md). The eyebrow count line
            was removed because we have many more than five playbooks in
            production; claiming "05 in production" here was misleading. */}
        <div className="mb-12 md:mb-16 px-1 md:px-8">
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
          {homepagePlaybooks.map((pb, i) => (
            <PlaybookRow key={pb.id} pb={pb} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
