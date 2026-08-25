'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { useReveal, useCountUp } from './reveal';
import './v5.css';

// The playbook vault as an editorial ledger. The section's thesis is
// the "hundredth mile" line in display type; the proof lives in the
// labeled index rows, whose multipliers count up on reveal. The old
// bento (and its 500+ card, which duplicated the hero stat) is gone.

const PATTERNS = [
  { runs: 47, name: 'Real-Time Inventory Platform', domain: 'Data' },
  { runs: 34, name: 'Multi-Source Data Integration', domain: 'Integration' },
  { runs: 28, name: 'Supply Chain Visibility', domain: 'Analytics' },
  { runs: 23, name: 'Post-Merger ERP Unification', domain: 'Integration' },
  { runs: 18, name: 'Agentic AI Deployment', domain: 'AI' },
];

const STACK = [
  'Databricks',
  'Snowflake',
  'Azure',
  'AWS',
  'Kubernetes',
  'Dynatrace',
  'SAP',
  'Salesforce',
  'ServiceNow',
  'Google Cloud',
  'Braze',
];

function LedgerRow({
  runs,
  name,
  domain,
  index,
  revealed,
  headingClass,
}: {
  runs: number;
  name: string;
  domain: string;
  index: number;
  revealed: boolean;
  headingClass: string;
}) {
  const count = useCountUp(runs, revealed, 1200 + index * 150);
  const delay = `${0.2 + index * 0.08}s`;
  return (
    <div className="relative">
      <span aria-hidden="true" className="v5-rule absolute inset-x-0 top-0 h-px bg-white/10" style={{ '--v5-d': delay } as React.CSSProperties} />
      <Link
        href="/playbooks"
        className="v5-rise group flex items-center gap-5 py-6 sm:gap-6 md:py-7"
        style={{ '--v5-d': delay } as React.CSSProperties}
      >
        <span className={`w-16 shrink-0 text-3xl font-semibold text-[#84CC16] sm:w-24 sm:text-4xl ${headingClass}`}>
          {count}&times;
        </span>
        <span className={`min-w-0 flex-1 text-xl font-semibold text-white transition-colors group-hover:text-[#60A5FA] sm:text-2xl md:text-[27px] ${headingClass}`}>
          {name}
        </span>
        <span className="hidden shrink-0 rounded-full border border-white/[0.14] bg-white/[0.07] px-3.5 py-1.5 text-xs text-white/75 sm:inline-block">
          {domain}
        </span>
        <ArrowUpRight size={18} className="shrink-0 text-white/60 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white" />
      </Link>
    </div>
  );
}

export default function VaultLedger({ headingClass }: { headingClass: string }) {
  const { ref, revealed } = useReveal<HTMLElement>(0.08);

  return (
    <section
      id="playbooks"
      ref={ref}
      className={`relative overflow-hidden bg-[#0a0b10] text-white ${revealed ? 'is-revealed' : ''}`}
    >
      {/* Ambient glows, as on the v4 vault. */}
      <div aria-hidden="true" className="absolute -left-36 top-28 h-[560px] w-[560px]" style={{ background: 'radial-gradient(closest-side, rgba(29,78,216,0.2), rgba(29,78,216,0))', filter: 'blur(40px)' }} />
      <div aria-hidden="true" className="absolute -bottom-20 -right-24 h-[480px] w-[480px]" style={{ background: 'radial-gradient(closest-side, rgba(132,204,22,0.09), rgba(132,204,22,0))', filter: 'blur(50px)' }} />

      <div className="relative z-10 mx-auto max-w-7xl px-6 pb-24 pt-20 md:pt-24">
        {/* Header */}
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <p className="v5-rise mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-[#60A5FA]" style={{ '--v5-d': '0s' } as React.CSSProperties}>
              / The playbook vault
            </p>
            <h2 className={`v5-rise text-4xl font-bold tracking-tight text-white sm:text-5xl ${headingClass}`} style={{ lineHeight: 1.08, '--v5-d': '0.05s' } as React.CSSProperties}>
              <span className="text-[#60A5FA]">Patterns</span> we&rsquo;ve run&nbsp;before.
            </h2>
            <p className="v5-rise mt-4 max-w-xl text-sm leading-relaxed text-white/60 md:text-base" style={{ '--v5-d': '0.1s' } as React.CSSProperties}>
              Every engagement leaves a blueprint. These are the ones we reach for again and again.
              Documented, measured, and ready to point at your problem.
            </p>
          </div>
          <Link href="/playbooks" className="v5-rise group inline-flex items-center gap-1.5 text-sm font-semibold text-white/85 transition-colors hover:text-white" style={{ '--v5-d': '0.12s' } as React.CSSProperties}>
            <span className="relative">
              Browse all playbooks
              <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-current transition-transform duration-300 ease-out group-hover:scale-x-100" />
            </span>
            <ArrowUpRight size={16} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Thesis */}
        <p
          className={`v5-rise mb-12 max-w-4xl text-3xl font-medium leading-snug text-white/90 sm:text-4xl md:text-[44px] ${headingClass}`}
          style={{ lineHeight: 1.22, '--v5-d': '0.15s' } as React.CSSProperties}
        >
          Pick the one that fits, and we start from{' '}
          <span className="text-[#84CC16]">the hundredth mile,</span> not the&nbsp;first.
        </p>

        {/* Ledger */}
        <div className="v5-rise mb-3 flex items-center gap-5 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/40 sm:gap-6" style={{ '--v5-d': '0.18s' } as React.CSSProperties}>
          <span className="w-16 shrink-0 sm:w-24">Times run</span>
          <span className="flex-1">Pattern</span>
          <span className="hidden sm:inline">Domain</span>
          <span className="ml-2 rounded-full border border-white/[0.14] bg-white/[0.07] px-3 py-1 normal-case tracking-normal text-white/75">
            10 patterns
          </span>
        </div>
        <div className="relative">
          {PATTERNS.map((p, i) => (
            <LedgerRow key={p.name} {...p} index={i} revealed={revealed} headingClass={headingClass} />
          ))}
          <span aria-hidden="true" className="v5-rule absolute inset-x-0 bottom-0 h-px bg-white/10" style={{ '--v5-d': '0.6s' } as React.CSSProperties} />
        </div>

        {/* Flagship band */}
        <div className="v5-clip-x relative mt-14 overflow-hidden rounded-2xl border border-white/[0.11] bg-white/[0.03]" style={{ '--v5-d': '0.35s' } as React.CSSProperties}>
          <div aria-hidden="true" className="absolute inset-y-0 right-0 hidden w-[46%] md:block">
            <Image src="/images/v4/svc-cloud.jpg" alt="" fill sizes="640px" className="object-cover opacity-[0.16]" />
            <span className="absolute inset-0" style={{ background: 'linear-gradient(90deg, #101218 0%, rgba(16,18,24,0.2) 60%)' }} />
          </div>
          <div className="relative z-10 flex flex-col gap-8 p-8 md:flex-row md:items-center md:gap-14 md:p-11">
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-white/50">Flagship playbook</p>
              <h3 className={`mt-3 text-2xl font-semibold text-white sm:text-3xl ${headingClass}`}>Mainframe-to-Cloud Migration</h3>
              <p className="mt-3 max-w-lg text-sm leading-relaxed text-white/60 md:text-[15px]">
                Aging Hadoop, Teradata, and Oracle estates re-architected for the cloud, with a
                parallel-run cutover so nothing goes dark.
              </p>
              <Link href="/playbooks" className="group mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-white">
                <span className="relative">
                  Explore
                  <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-current transition-transform duration-300 ease-out group-hover:scale-x-100" />
                </span>
                <ArrowUpRight size={15} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            </div>
            <div className="flex shrink-0 gap-9 sm:gap-11">
              {[
                { v: '68%', l: 'Cost cut' },
                { v: '10x', l: 'Speed gain' },
                { v: '100%', l: 'Zero downtime' },
              ].map((o) => (
                <div key={o.l}>
                  <div className={`text-3xl font-semibold text-[#84CC16] sm:text-4xl ${headingClass}`}>{o.v}</div>
                  <div className="mt-1 text-xs text-white/55 sm:text-[13px]">{o.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Runs-on caption line */}
        <div className="v5-rise mt-10 flex flex-wrap items-baseline gap-x-5 gap-y-2" style={{ '--v5-d': '0.45s' } as React.CSSProperties}>
          <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/45">Runs on</span>
          <span className="text-xs text-white/30">the stack we know cold</span>
          {STACK.map((name) => (
            <span key={name} className="text-xs font-semibold uppercase tracking-[0.06em] text-white/40">
              {name}
            </span>
          ))}
        </div>

        {/* Closer */}
        <div className="relative mt-10 pt-10">
          <span aria-hidden="true" className="v5-rule absolute inset-x-0 top-0 h-px bg-white/10" style={{ '--v5-d': '0.5s' } as React.CSSProperties} />
          <div className="v5-rise flex flex-wrap items-center justify-between gap-6" style={{ '--v5-d': '0.55s' } as React.CSSProperties}>
            <div>
              <h3 className={`text-2xl font-semibold text-white sm:text-[28px] ${headingClass}`}>Can&rsquo;t find your scenario?</h3>
              <p className="mt-2 text-sm text-white/55 md:text-[15px]">
                We&rsquo;ve run a hundred more than these. Bring the mess. We&rsquo;ll bring the blueprint.
              </p>
            </div>
            <Link href="/contact" className="group inline-flex shrink-0 items-center gap-1.5 text-[15px] font-semibold text-white">
              <span className="relative">
                Talk to an architect
                <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-current transition-transform duration-300 ease-out group-hover:scale-x-100" />
              </span>
              <ArrowUpRight size={16} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
