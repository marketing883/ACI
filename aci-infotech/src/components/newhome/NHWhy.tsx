'use client';

// Why ACI: four differentiators, each backed by something the site already
// documents, then the playbook vault as a live ledger whose bars fill to
// each pattern's run count as it scrolls in.

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { CountUp, Eyebrow, Grain, Reveal, SplitHeadline } from './motion';
import { EASE } from './tokens';

const REASONS = [
  { value: '20 years', title: 'Two decades of delivery', body: 'Founded in 2006. Two decades of enterprise delivery experience, with a forward-looking approach to AI innovation.' },
  { value: '48 hours', title: 'A written plan, fast', body: 'Advisory engagements produce a written plan within 48 hours, and a build pod can be shipping within two weeks.' },
  { value: 'One team', title: 'Built and run by the same people', body: 'Five practices, one delivery team, on the hook after go-live. Someone is awake whenever your estate is.' },
  { value: '500+', title: 'Documented in playbooks', body: 'Every engagement leaves a blueprint, so most projects start from the hundredth mile, not the first.' },
];

const LEDGER = [
  { runs: 47, name: 'Real-Time Inventory Platform', domain: 'Data', href: '/playbooks/real-time-data-platform' },
  { runs: 34, name: 'Multi-Source Data Integration', domain: 'Integration', href: '/playbooks/multi-source-integration' },
  { runs: 28, name: 'Supply Chain Visibility', domain: 'Analytics', href: '/playbooks/supply-chain-visibility' },
  { runs: 23, name: 'Post-Merger ERP Unification', domain: 'Integration', href: '/playbooks/post-acquisition-consolidation' },
  { runs: 18, name: 'Agentic AI Deployment', domain: 'AI', href: '/playbooks/agentic-ai-deployment' },
];

export default function NHWhy({ headingClass }: { headingClass: string }) {
  const reduce = useReducedMotion();
  const max = LEDGER[0].runs;
  return (
    <section id="why-aci" className="relative overflow-hidden bg-[#05070d] py-28 text-white md:py-36">
      <div aria-hidden="true" className="absolute right-[-10%] top-[-10%] h-[600px] w-[600px] rounded-full bg-[#22d3ee]/10 blur-[150px]" />
      <Grain />
      <div className="relative mx-auto max-w-7xl px-6">
        <Eyebrow>Why ACI</Eyebrow>
        <SplitHeadline
          lines={['Engineering tied', 'to the *outcome.*']}
          className={`mt-6 text-[clamp(2.4rem,5.4vw,4.8rem)] font-semibold leading-[1] tracking-[-0.035em] ${headingClass}`}
          accentClassName="nh-accent-gradient"
        />

        <div className="mt-16 grid gap-px overflow-hidden rounded-[26px] border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
          {REASONS.map((r, i) => (
            <Reveal key={r.title} delay={i * 0.08} className="group relative bg-[#05070d] p-7 transition-colors duration-500 hover:bg-[#0a1024] md:p-8">
              <div className={`text-4xl font-semibold tracking-tight md:text-5xl ${headingClass}`}>
                {/^\d/.test(r.value) ? <CountUp value={r.value} /> : r.value}
              </div>
              <div className={`mt-6 text-lg font-semibold ${headingClass}`}>{r.title}</div>
              <p className="mt-2 text-sm leading-relaxed text-white/60">{r.body}</p>
              <span aria-hidden="true" className="absolute inset-x-7 bottom-0 h-px origin-left scale-x-0 bg-gradient-to-r from-[#3b82f6] to-[#22d3ee] transition-transform duration-700 group-hover:scale-x-100" />
            </Reveal>
          ))}
        </div>

        {/* Playbook ledger */}
        <div className="mt-20 grid gap-10 lg:grid-cols-[0.9fr_1.4fr]">
          <Reveal>
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-white/45">The playbook vault</div>
            <h3 className={`[color:inherit] mt-4 text-3xl font-semibold leading-tight md:text-4xl ${headingClass}`}>
              Patterns we&rsquo;ve run&nbsp;before.
            </h3>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/60">
              Every engagement leaves a blueprint. These are the ones we reach for again and again.
              Documented, measured, and ready to point at your&nbsp;problem.
            </p>
            <Link href="/playbooks" className="nh-btn mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-[#67e8f9]">
              Browse all playbooks <ArrowUpRight size={15} />
            </Link>
          </Reveal>

          <ol className="divide-y divide-white/10 border-y border-white/10">
            {LEDGER.map((row, i) => (
              <li key={row.name}>
                <Link href={row.href} className="nh-btn group grid grid-cols-[4.5rem_1fr_auto] items-center gap-4 py-5">
                  <span className={`text-2xl font-semibold tabular-nums text-[#a3e635] ${headingClass}`}>{row.runs}×</span>
                  <span>
                    <span className="block text-base font-medium text-white transition-transform duration-500 group-hover:translate-x-1.5 md:text-lg">{row.name}</span>
                    <span className="mt-2 block h-1 overflow-hidden rounded-full bg-white/10">
                      <motion.span
                        className="block h-full rounded-full bg-gradient-to-r from-[#1d4ed8] to-[#22d3ee]"
                        initial={reduce ? false : { width: 0 }}
                        whileInView={{ width: `${(row.runs / max) * 100}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.3, ease: EASE, delay: 0.1 + i * 0.1 }}
                        style={reduce ? { width: `${(row.runs / max) * 100}%` } : undefined}
                      />
                    </span>
                  </span>
                  <span className="flex items-center gap-3 text-xs uppercase tracking-[0.16em] text-white/45">
                    <span className="hidden sm:inline">{row.domain}</span>
                    <ArrowUpRight size={16} className="text-white/50 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white" />
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
