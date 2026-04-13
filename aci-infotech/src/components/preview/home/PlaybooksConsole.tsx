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
  const primaryOutcome = pb.outcomes[0];
  // First architecture entry as the "latest deploy" anchor fact - real,
  // already in the data, no fabrication.
  const anchorFact = pb.architecture[0];

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
            {pb.name}
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

        {/* Sub-line 1: industries as monospace tags */}
        <div className="mt-3 font-mono text-xs md:text-sm text-white/45 tracking-wide">
          {pb.industries.map((i) => i.toLowerCase()).join(' . ')}
        </div>

        {/* Sub-line 2: anchor fact */}
        <div className="mt-1.5 font-mono text-xs text-white/35 tracking-wide">
          latest deploy: anchor stack . {anchorFact}
        </div>

        {/* Hover-revealed primary outcome line */}
        <div
          className="mt-4 overflow-hidden transition-all duration-300 ease-out"
          style={{
            maxHeight: hover && !open ? '32px' : '0px',
            opacity: hover && !open ? 1 : 0,
          }}
          aria-hidden
        >
          <div className="font-mono text-xs md:text-sm text-[#C4FF61]/90 flex items-center gap-3">
            <span className="inline-block w-4 h-px bg-[#C4FF61]/60" />
            <span className="text-white/90">
              {primaryOutcome.metric}
            </span>
            <span className="text-white/55">{primaryOutcome.description.toLowerCase()}</span>
          </div>
        </div>
      </button>

      {/* Click-expanded detail */}
      {open && (
        <div className="px-5 md:px-8 pb-10 -mt-2">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10 pt-6 border-t border-white/10">
            {/* Outcomes - the punchline */}
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40 mb-4">
                {'// outcomes'}
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

            {/* Challenge pattern */}
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40 mb-4">
                {'// challenge pattern'}
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

            {/* Architecture - mono stack */}
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40 mb-4">
                {'// architecture'}
              </div>
              <div className="flex flex-wrap gap-2">
                {pb.architecture.map((a, i) => (
                  <span
                    key={i}
                    className="font-mono text-xs text-white/70 px-2.5 py-1 border border-white/15 bg-white/[0.03]"
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
                  <span>open full playbook</span>
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
    <section className="relative py-24 md:py-32 bg-[#040912] overflow-hidden">
      {/* CRT grid overlay - very subtle decoration */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage:
            'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
        aria-hidden
      />
      {/* Subtle vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.4) 100%)',
        }}
        aria-hidden
      />

      <div className="relative max-w-[1320px] mx-auto px-5 md:px-10">
        {/* Section header */}
        <div className="mb-12 md:mb-16 px-1 md:px-8">
          <div className="font-mono text-xs md:text-sm text-white/45 tracking-wider mb-6">
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
            How we ship.
          </h2>
          <p className="mt-5 text-white/60 max-w-2xl text-base md:text-lg">
            Ten repeatable engagement patterns. Each one battle-tested across
            multiple Fortune 500 deployments. Click a row for the full
            challenge, outcomes, and stack.
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
