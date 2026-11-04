'use client';

// Frontier AI with ArqAI Labs. A dark scene with its own visual identity:
// instead of a render, an orb drawn in CSS (layered conic light turning at
// two speeds behind frosted glass) that follows the pointer a little, with
// three capability satellites orbiting it.

import Image from 'next/image';
import Link from 'next/link';
import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';
import { ArrowUpRight, Bot, ShieldCheck, Workflow } from 'lucide-react';
import { Eyebrow, Grain, MagneticLink, Reveal, SplitHeadline } from './motion';

const PILLARS = [
  { Icon: Bot, title: 'Forward-deployed', body: 'Engineers embed in the problem and ship production agents for regulated operations.' },
  { Icon: ShieldCheck, title: 'Governed', body: 'Governance and an audit trail on every action the agent takes.' },
  { Icon: Workflow, title: 'Production AI', body: 'Copilots, agents, RAG systems, forecasting, and MLOps, moved from prototype to governed production.' },
];

export default function NHAgentic({ headingClass }: { headingClass: string }) {
  const reduce = useReducedMotion();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const ox = useSpring(mx, { stiffness: 50, damping: 18 });
  const oy = useSpring(my, { stiffness: 50, damping: 18 });

  return (
    <section
      id="ai"
      onMouseMove={(e) => {
        if (reduce) return;
        const r = e.currentTarget.getBoundingClientRect();
        mx.set(((e.clientX - r.left) / r.width - 0.5) * 40);
        my.set(((e.clientY - r.top) / r.height - 0.5) * 30);
      }}
      className="relative overflow-hidden bg-[#05070d] py-28 text-white md:py-40"
    >
      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(60%_60%_at_75%_45%,rgba(99,102,241,0.22),transparent_70%)]" />
      <Grain />

      <div className="relative mx-auto grid max-w-7xl items-center gap-16 px-6 lg:grid-cols-2">
        <div>
          <Eyebrow>AI and agentic AI</Eyebrow>
          <SplitHeadline
            lines={['Frontier AI, delivered', 'with *ArqAI Labs.*']}
            className={`mt-6 text-[clamp(2.4rem,5.4vw,4.8rem)] font-semibold leading-[1] tracking-[-0.035em] ${headingClass}`}
            accentClassName="nh-accent-gradient"
          />
          <Reveal delay={0.1}>
            <p className="mt-7 max-w-lg text-base leading-relaxed text-white/70 md:text-lg">
              Our strategic AI partner. Engineers embed in the problem and ship production agents for
              regulated operations, with governance and an audit trail on every&nbsp;action.
            </p>
          </Reveal>

          <ul className="mt-10 space-y-3">
            {PILLARS.map(({ Icon, title, body }, i) => (
              <Reveal as="li" key={title} delay={0.15 + i * 0.08}>
                <div className="group flex gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition-all duration-500 hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/[0.06]">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#6366f1]/40 to-[#22d3ee]/20 text-white ring-1 ring-white/15 transition-transform duration-500 group-hover:rotate-[-8deg] group-hover:scale-105">
                    <Icon size={20} />
                  </span>
                  <span>
                    <span className={`block text-lg font-semibold ${headingClass}`}>{title}</span>
                    <span className="mt-1 block text-sm leading-relaxed text-white/60">{body}</span>
                  </span>
                </div>
              </Reveal>
            ))}
          </ul>

          <Reveal delay={0.35} className="mt-10 flex flex-wrap items-center gap-3">
            <MagneticLink href="https://thearq.ai" external>
              Explore ArqAI Labs
            </MagneticLink>
            <MagneticLink href="/services/applied-ai-ml" variant="ghost">
              Applied AI at ACI
            </MagneticLink>
          </Reveal>
        </div>

        {/* Orb */}
        <div className="relative mx-auto aspect-square w-full max-w-[520px]">
          <motion.div style={{ x: ox, y: oy }} className="nh-float absolute inset-0">
            <div className="absolute inset-[8%] rounded-full bg-[conic-gradient(from_0deg,#1d4ed8,#6366f1,#22d3ee,#a3e635,#1d4ed8)] opacity-70 blur-3xl nh-orb-spin" />
            <div className="absolute inset-[16%] overflow-hidden rounded-full ring-1 ring-white/20 shadow-[inset_0_0_60px_rgba(255,255,255,0.12),0_0_120px_-20px_rgba(99,102,241,0.9)]">
              {/* swirling light, blurred into soft liquid bands */}
              <div className="absolute inset-[-30%] bg-[conic-gradient(from_90deg,#0a1024,#1d4ed8,#7c3aed,#22d3ee,#a3e635,#0a1024)] blur-[28px] nh-orb-spin-rev" />
              <div className="absolute inset-[-20%] bg-[conic-gradient(from_200deg,transparent,#3b82f6_20%,transparent_40%,#22d3ee_60%,transparent_80%)] opacity-70 mix-blend-screen blur-[18px] nh-orb-spin" />
              {/* depth: darker lower hemisphere */}
              <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_50%_115%,rgba(5,7,13,0.85),transparent_62%)]" />
              {/* glass: rim light and specular highlight */}
              <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_50%_50%,transparent_58%,rgba(255,255,255,0.22)_70%,transparent_72%)]" />
              <div className="absolute left-[18%] top-[12%] h-[26%] w-[38%] rotate-[-25deg] rounded-full bg-[radial-gradient(ellipse,rgba(255,255,255,0.75),transparent_70%)] blur-[6px]" />
              <div className="absolute bottom-[14%] right-[20%] h-[8%] w-[20%] rounded-full bg-white/30 blur-md" />
            </div>
            {/* orbit rings */}
            <div className="absolute inset-[4%] rounded-full border border-white/10" />
            <div className="absolute inset-[-4%] rounded-full border border-dashed border-white/10 nh-orb-spin" />
          </motion.div>

          {/* Satellites */}
          {[
            { label: 'Agents', cls: 'left-[2%] top-[18%]' },
            { label: 'Audit trail', cls: 'right-[0%] top-[42%]' },
            { label: 'Accelerators', cls: 'bottom-[10%] left-[14%]' },
          ].map((s, i) => (
            <Reveal key={s.label} delay={0.3 + i * 0.12} className={`absolute ${s.cls}`}>
              <span className="flex items-center gap-2 rounded-full border border-white/15 bg-[#05070d]/60 px-3.5 py-1.5 text-xs font-medium text-white/85 shadow-[0_10px_40px_-10px_rgba(99,102,241,0.8)] backdrop-blur-xl">
                <span className="h-1.5 w-1.5 rounded-full bg-[#a3e635] shadow-[0_0_8px_#a3e635]" />
                {s.label}
              </span>
            </Reveal>
          ))}

          <div className="absolute bottom-[-2%] right-[4%]">
            <Image src="/images/ArqAI-Labs-Logo-light.png" alt="ArqAI Labs" width={2439} height={858} style={{ width: 'auto' }} className="h-8 w-auto opacity-80" />
          </div>
        </div>
      </div>

      {/* Agentic playbook strip */}
      <Reveal className="relative mx-auto mt-20 max-w-7xl px-6">
        <Link
          href="/playbooks/agentic-ai-deployment"
          className="nh-btn group flex flex-col justify-between gap-4 rounded-2xl border text-white border-white/10 bg-gradient-to-r from-white/[0.06] to-white/[0.02] p-6 transition-colors hover:border-white/25 md:flex-row md:items-center md:p-8"
        >
          <span className="flex items-center gap-5">
            <span className={`text-4xl font-semibold tabular-nums text-[#a3e635] ${headingClass}`}>18×</span>
            <span>
              <span className="block text-xs uppercase tracking-[0.2em] text-white/45">Playbook · times run</span>
              <span className={`mt-1 block text-xl font-semibold ${headingClass}`}>Agentic AI Deployment</span>
            </span>
          </span>
          <span className="inline-flex items-center gap-2 text-sm font-semibold text-white/80 group-hover:text-white">
            Open the playbook
            <ArrowUpRight size={16} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </span>
        </Link>
      </Reveal>
    </section>
  );
}
