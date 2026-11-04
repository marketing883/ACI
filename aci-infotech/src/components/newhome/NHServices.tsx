'use client';

// Services: an editorial index on porcelain. Each practice is a large row;
// pointing at one (or focusing it) swaps the preview panel beside it with
// that practice's image, summary, and stack, with a clip-path image reveal.
// On small screens every row opens in place instead.

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, Plus } from 'lucide-react';
import { Eyebrow, MagneticLink, Reveal, SplitHeadline } from './motion';
import { EASE } from './tokens';

const PRACTICES = [
  {
    name: 'Data Engineering & Analytics',
    summary: 'Modern data platforms on Databricks, Snowflake, and cloud-native architectures: lakehouse migration, real-time pipelines, governance and lineage, and the analytics and BI that run on top of them.',
    chips: ['Lakehouse migration', 'Real-time pipelines', 'Analytics & BI', 'Governance & lineage'],
    stack: 'Databricks · Snowflake · Azure',
    href: '/services/data-engineering',
    image: '/images/v4/svc-data.jpg',
  },
  {
    name: 'Applied AI & GenAI',
    summary: 'Copilots, agents, RAG systems, forecasting, and MLOps that move from prototype to governed production.',
    chips: ['Copilots & agents', 'RAG systems', 'Forecasting & ML', 'MLOps & evals'],
    stack: 'Anthropic · OpenAI · LangGraph',
    href: '/services/applied-ai-ml',
    image: '/images/v4/svc-ai.jpg',
  },
  {
    name: 'Cloud Modernization',
    summary: 'Landing zones, FinOps, Kubernetes platforms, and mainframe-to-cloud cutovers run in parallel so nothing goes dark.',
    chips: ['Landing zones', 'Migrations & cutovers', 'FinOps', 'Kubernetes platforms'],
    stack: 'AWS · Azure · Google Cloud',
    href: '/services/cloud-modernization',
    image: '/images/v4/svc-cloud.jpg',
  },
  {
    name: 'Managed Run & SRE',
    summary: '24/7 NOC and SOC coverage, observability, on-call SRE, and change management for production estates.',
    chips: ['24/7 operations', 'SRE & on-call', 'Observability', 'Change management'],
    stack: 'Kubernetes · Dynatrace · ServiceNow',
    href: '/services/managed-operations',
    image: '/images/v4/svc-ops.jpg',
  },
  {
    name: 'Cybersecurity',
    summary: 'Zero-trust architecture, cloud security posture, compliance readiness, threat response, and 24/7 SOC operations.',
    chips: ['Zero-trust architecture', 'SOC operations', 'Compliance readiness', 'Threat response'],
    stack: 'Microsoft Sentinel · CrowdStrike · Okta',
    href: '/services/cyber-security',
    image: '/images/v4/hero-atmosphere.jpg',
  },
];

const MORE = [
  { label: 'ACI Interactive: MarTech & CDP', href: '/services/martech-cdp' },
  { label: 'App Development', href: '/services/app-development' },
  { label: 'Quality Engineering', href: '/services/quality-engineering' },
  { label: 'Advisory & Strategy', href: '/services/advisory-strategy' },
  { label: 'GCC & Captive Centers', href: '/services/gcc' },
];

export default function NHServices({ headingClass }: { headingClass: string }) {
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState<number | null>(0);
  const reduce = useReducedMotion();
  const p = PRACTICES[active];

  return (
    <section id="services" className="relative bg-[#f4f6fb] py-28 text-[#0a1024] md:py-36">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div>
            <Eyebrow tone="light">Services</Eyebrow>
            <SplitHeadline
              lines={['Build it, run it,', '*keep it secure.*']}
              className={`mt-6 text-[clamp(2.4rem,5.4vw,4.8rem)] font-semibold leading-[1] tracking-[-0.035em] ${headingClass}`}
              accentClassName="nh-accent-ink"
            />
          </div>
          <Reveal className="max-w-md">
            <p className="text-base leading-relaxed text-[#0a1024]/65">
              Data and analytics, applied AI, cloud modernization, managed operations, and cybersecurity.
              Five practices, one delivery team, on the hook after&nbsp;go-live.
            </p>
            <div className="mt-6">
              <MagneticLink href="/services" variant="light">
                See all capabilities
              </MagneticLink>
            </div>
          </Reveal>
        </div>

        <div className="mt-16 grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-14">
          {/* Index */}
          <ol className="border-t border-[#0a1024]/10">
            {PRACTICES.map((s, i) => {
              const isActive = i === active;
              const isOpen = open === i;
              return (
                <li key={s.name} className="border-b border-[#0a1024]/10">
                  {/* Desktop row */}
                  <Link
                    href={s.href}
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    className="nh-btn group hidden items-center gap-6 py-7 lg:flex"
                  >
                    <span className={`w-8 text-sm tabular-nums transition-colors ${isActive ? 'text-[#1d4ed8]' : 'text-[#0a1024]/35'}`}>0{i + 1}</span>
                    <span
                      className={`flex-1 text-[clamp(1.5rem,2.4vw,2.25rem)] font-semibold tracking-[-0.02em] transition-all duration-500 ${headingClass} ${
                        isActive ? 'translate-x-2 text-[#0a1024]' : 'text-[#0a1024]/45'
                      }`}
                    >
                      {s.name}
                    </span>
                    <span className={`hidden text-xs font-medium uppercase tracking-[0.14em] transition-colors xl:inline ${isActive ? 'text-[#1d4ed8]' : 'text-[#0a1024]/35'}`}>{s.stack}</span>
                    <span
                      className={`flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-500 ${
                        isActive ? 'rotate-0 border-[#1d4ed8] bg-[#1d4ed8] text-white' : '-rotate-45 border-[#0a1024]/15 text-[#0a1024]/40'
                      }`}
                    >
                      <ArrowUpRight size={16} />
                    </span>
                  </Link>

                  {/* Mobile accordion */}
                  <div className="lg:hidden">
                    <button
                      type="button"
                      onClick={() => setOpen(isOpen ? null : i)}
                      aria-expanded={isOpen}
                      className="flex w-full items-center gap-4 py-6 text-left"
                    >
                      <span className="w-7 text-sm tabular-nums text-[#1d4ed8]">0{i + 1}</span>
                      <span className={`flex-1 text-xl font-semibold tracking-tight ${headingClass}`}>{s.name}</span>
                      <Plus size={18} className={`shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`} />
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.45, ease: EASE }}
                          className="overflow-hidden"
                        >
                          <div className="pb-7">
                            <div className="relative aspect-[16/9] overflow-hidden rounded-2xl">
                              <Image src={s.image} alt="" fill sizes="100vw" className="object-cover" />
                            </div>
                            <p className="mt-4 text-sm leading-relaxed text-[#0a1024]/70">{s.summary}</p>
                            <p className="mt-3 text-xs font-semibold uppercase tracking-[0.14em] text-[#1d4ed8]">{s.stack}</p>
                            <Link href={s.href} className="nh-btn mt-4 inline-flex items-center gap-1.5 text-sm font-semibold">
                              Explore <ArrowUpRight size={15} />
                            </Link>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </li>
              );
            })}
          </ol>

          {/* Preview panel (desktop) */}
          <div className="hidden lg:block">
            <div className="sticky top-28 overflow-hidden rounded-[28px] bg-[#05070d] text-white shadow-[0_40px_120px_-40px_rgba(10,16,36,0.6)]">
              <div className="relative aspect-[4/3] overflow-hidden">
                <AnimatePresence initial={false}>
                  <motion.div
                    key={p.image}
                    className="absolute inset-0"
                    initial={reduce ? { opacity: 0 } : { clipPath: 'inset(0 0 100% 0)', scale: 1.12 }}
                    animate={reduce ? { opacity: 1 } : { clipPath: 'inset(0 0 0% 0)', scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.9, ease: EASE }}
                  >
                    <Image src={p.image} alt="" fill sizes="45vw" className="object-cover" />
                  </motion.div>
                </AnimatePresence>
                <div className="absolute inset-0 bg-gradient-to-t from-[#05070d] via-[#05070d]/20 to-transparent" />
                <div className="absolute bottom-5 left-6 right-6">
                  <AnimatePresence mode="wait">
                    <motion.div key={p.name} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4, ease: EASE }}>
                      <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#67e8f9]">0{active + 1} / 0{PRACTICES.length}</div>
                      <div className={`mt-1 text-3xl font-semibold leading-tight tracking-tight ${headingClass}`}>{p.name}</div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
              <AnimatePresence mode="wait">
                <motion.div key={p.name} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }} className="p-6">
                  <p className="text-sm leading-relaxed text-white/70">{p.summary}</p>
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {p.chips.map((c) => (
                      <li key={c} className="rounded-full border border-white/15 bg-white/[0.05] px-3 py-1 text-xs text-white/80">
                        {c}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-5 text-xs uppercase tracking-[0.18em] text-white/40">{p.stack}</div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        <Reveal className="mt-12 flex flex-wrap items-center gap-2">
          <span className="mr-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#0a1024]/45">Also</span>
          {MORE.map((m) => (
            <Link
              key={m.href}
              href={m.href}
              className="nh-btn rounded-full border border-[#0a1024]/12 bg-white px-4 py-2 text-sm text-[#0a1024]/75 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#1d4ed8] hover:text-[#1d4ed8] hover:shadow-[0_10px_30px_-12px_rgba(29,78,216,0.5)]"
            >
              {m.label}
            </Link>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
