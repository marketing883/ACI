'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Sparkle, ArrowUpRight, ArrowRight } from 'lucide-react';
import './playbooks.css';

// ---------------------------------------------------------------------------
// Real playbook data (subset of src/components/sections/PlaybookVaultSection).
// 10 documented patterns, 500 total enterprise deployments.
// ---------------------------------------------------------------------------

const TOTAL_DEPLOYMENTS = 500;
const PATTERN_COUNT = 10;

// The vault index — breadth across categories.
const VAULT = [
  { d: 47, title: 'Real-Time Inventory Platform', cat: 'Data', slug: 'real-time-data-platform' },
  { d: 34, title: 'Multi-Source Data Integration', cat: 'Integration', slug: 'multi-source-integration' },
  { d: 28, title: 'Supply Chain Visibility', cat: 'Analytics', slug: 'supply-chain-visibility' },
  { d: 23, title: 'Post-Merger ERP Unification', cat: 'Integration', slug: 'post-acquisition-consolidation' },
  { d: 18, title: 'Agentic AI Deployment', cat: 'AI', slug: 'agentic-ai-deployment' },
];

// The flagship, featured in its own card.
const FLAGSHIP = {
  title: 'Mainframe-to-Cloud Migration',
  deployments: 52,
  slug: 'legacy-cloud-migration',
  blurb:
    'Aging Hadoop, Teradata, and Oracle estates re-architected for the cloud, with a parallel-run cutover so nothing goes dark.',
  outcomes: [
    { metric: '68%', label: 'Cost cut' },
    { metric: '10x', label: 'Speed gain' },
    { metric: '100%', label: 'Zero downtime' },
  ],
};

// Stack marquee — the platforms these playbooks actually run on.
const LOGO_PATH: Record<string, string> = {
  databricks: '/images/Solution-Partners/databricks.png',
  snowflake: '/images/Solution-Partners/snowflake.svg',
  azure: '/images/Solution-Partners/azure.png',
  aws: '/images/Solution-Partners/aws.png',
  kubernetes: '/images/Solution-Partners/kubernetes.svg',
  dynatrace: '/images/Solution-Partners/dynatrace.png',
  sap: '/images/Solution-Partners/sap.png',
  salesforce: '/images/Solution-Partners/salesforce.png',
  servicenow: '/images/Solution-Partners/servicenow.png',
  googlecloud: '/images/Solution-Partners/googlecloud.svg',
  googlebigquery: '/images/Solution-Partners/googlebigquery.svg',
  braze: '/images/Solution-Partners/braze.png',
};
const ROW1 = ['databricks', 'snowflake', 'azure', 'aws', 'kubernetes', 'dynatrace'];
const ROW2 = ['sap', 'salesforce', 'servicenow', 'googlecloud', 'googlebigquery', 'braze'];

function Label({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.2em] text-white/60 ${className}`}
    >
      <Sparkle className="h-3.5 w-3.5 text-[#A3E635]" strokeWidth={1.5} aria-hidden="true" />
      {children}
    </span>
  );
}

function LogoTile({ id }: { id: string }) {
  return (
    <span className="pb-glass flex h-16 w-16 shrink-0 items-center justify-center rounded-xl md:h-[72px] md:w-[72px]">
      <Image
        src={LOGO_PATH[id]}
        alt={id}
        width={120}
        height={40}
        className="h-7 w-auto object-contain opacity-75 md:h-8"
        style={{ filter: 'brightness(0) invert(1)' }}
      />
    </span>
  );
}

export default function PlaybooksSection({ headingClass }: { headingClass: string }) {
  const sectionRef = useRef<HTMLElement>(null);
  const [revealed, setRevealed] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setRevealed(true);
        io.disconnect();

        if (reduce) {
          setCount(TOTAL_DEPLOYMENTS);
          return;
        }
        const start = performance.now();
        const dur = 1600;
        let raf = 0;
        const tick = (now: number) => {
          const p = Math.min((now - start) / dur, 1);
          const eased = 1 - Math.pow(1 - p, 4);
          setCount(Math.round(eased * TOTAL_DEPLOYMENTS));
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
      },
      { threshold: 0.15, rootMargin: '0px 0px -80px 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const cardBase = `relative h-full overflow-hidden rounded-2xl ${revealed ? 'pb-rise' : 'opacity-0'}`;
  const styleI = (i: number) => ({ ['--pb-i' as string]: String(i) }) as React.CSSProperties;

  return (
    <section
      ref={sectionRef}
      id="playbooks"
      className="pb-section relative overflow-hidden bg-[#0a0b10] text-white"
    >
      {/* ambient brand glows, painted once (no blur filter on scroll) */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div
          className="absolute -left-32 top-10 h-96 w-96 rounded-full opacity-40"
          style={{ background: 'radial-gradient(circle, rgba(29,78,216,0.35) 0%, transparent 68%)' }}
        />
        <div
          className="absolute -right-24 bottom-0 h-96 w-96 rounded-full opacity-30"
          style={{ background: 'radial-gradient(circle, rgba(132,204,22,0.22) 0%, transparent 68%)' }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-16 sm:px-6 md:px-10 md:py-20 lg:px-14">
        {/* Header */}
        <div className="mb-10 flex flex-col gap-6 md:mb-12 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-[#60A5FA]">
              / The playbook vault
            </p>
            <h2
              className={`text-5xl font-bold tracking-tight text-white sm:text-6xl lg:text-[64px] ${headingClass}`}
              style={{ lineHeight: 1.04 }}
            >
              <span className="text-[#60A5FA]">Patterns</span> we&apos;ve run&nbsp;before.
            </h2>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-white/65 md:text-lg">
              Every engagement leaves a blueprint. These are the ones we reach for again and again.
              Documented, measured, and ready to point at your problem.
            </p>
          </div>
          <Link
            href="/playbooks"
            className="pb-glass pb-glass-blur group inline-flex shrink-0 items-center gap-2 self-start rounded-full px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-white/[0.06] sm:px-7 sm:py-3.5 md:self-auto"
          >
            Browse all playbooks
            <ArrowUpRight
              size={18}
              className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </Link>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 lg:grid-cols-3 lg:grid-rows-2 lg:min-h-[700px]">
          {/* A — Vault index (tall) */}
          <div
            className={`${cardBase} pb-noise md:row-span-2 lg:row-span-2`}
            style={{ ...styleI(0), background: 'linear-gradient(160deg, #0d1526 0%, #0a0f1c 55%, #0b0d14 100%)' }}
          >
            <div className="pb-glass absolute inset-0 rounded-2xl" aria-hidden="true" />
            <div className="relative flex h-full flex-col p-7 md:p-8">
              <div className="flex items-center justify-between">
                <Label>Playbook vault</Label>
                <span className="text-[13px] font-medium text-white/45">{PATTERN_COUNT} patterns</span>
              </div>

              <p className="mt-6 max-w-sm text-lg leading-relaxed text-white/75">
                Blueprints from real engagements. Pick the one that fits, and we start from the
                hundredth mile, not the first.
              </p>

              <ul className="mt-6 flex flex-1 flex-col justify-between">
                {VAULT.map((p) => (
                  <li key={p.slug}>
                    <Link
                      href={`/playbooks/${p.slug}`}
                      className="group grid grid-cols-[3.25rem_1fr_auto] items-center gap-3 border-t border-white/10 py-[18px] transition-colors hover:bg-white/[0.03]"
                    >
                      <span className="font-mono text-lg font-semibold text-[#A3E635]">{p.d}×</span>
                      <span className="min-w-0">
                        <span className="block text-[17px] font-medium leading-snug text-white/90 transition-colors group-hover:text-white">
                          {p.title}
                        </span>
                        <span className="text-[13px] uppercase tracking-wide text-white/45">{p.cat}</span>
                      </span>
                      <ArrowUpRight
                        size={19}
                        className="text-white/30 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#A3E635]"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* B — Big number */}
          <div
            className={`${cardBase} pb-noise`}
            style={{ ...styleI(1), background: 'linear-gradient(150deg, #14275e 0%, #0f1c44 50%, #0b1020 100%)' }}
          >
            <div className="pb-glass absolute inset-0 rounded-2xl" aria-hidden="true" />
            <div className="relative flex h-full flex-col justify-between gap-6 p-7 md:p-8">
              <Label>Deployed</Label>
              <div>
                <div
                  className={`font-semibold leading-none tracking-tight text-[#A3E635] ${headingClass}`}
                  style={{ fontSize: 'clamp(3.2rem, 7vw, 5.5rem)' }}
                >
                  {count}
                  <span className="text-[#84CC16]">+</span>
                </div>
                <p className="mt-3 text-lg text-white/85 md:text-xl">Enterprise deployments, all documented.</p>
                <p className="text-[15px] text-white/50">across {PATTERN_COUNT} architecture patterns</p>
              </div>
            </div>
          </div>

          {/* C — Stack marquee */}
          <div
            className={`${cardBase} bg-[#0c0e15]`}
            style={styleI(2)}
          >
            <div className="pb-glass absolute inset-0 rounded-2xl" aria-hidden="true" />
            <div className="relative flex h-full min-h-[220px] flex-col justify-between gap-6 p-7 md:p-8">
              <div className="flex items-center justify-between">
                <Label>Runs on</Label>
                <span className="text-[13px] font-medium text-white/45">the stack we know cold</span>
              </div>
              <div className="flex flex-col gap-3">
                <div className="overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
                  <div className="pb-marquee-left flex w-max gap-3">
                    {[...ROW1, ...ROW1].map((id, i) => (
                      <LogoTile key={`r1-${id}-${i}`} id={id} />
                    ))}
                  </div>
                </div>
                <div className="overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
                  <div className="pb-marquee-right flex w-max gap-3">
                    {[...ROW2, ...ROW2].map((id, i) => (
                      <LogoTile key={`r2-${id}-${i}`} id={id} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* D — Flagship playbook */}
          <Link
            href={`/playbooks/${FLAGSHIP.slug}`}
            className={`${cardBase} group block bg-[#0c0e15] transition-colors hover:bg-[#0e1119]`}
            style={styleI(3)}
          >
            <div className="pb-glass absolute inset-0 rounded-2xl" aria-hidden="true" />
            <div className="relative flex h-full flex-col justify-between gap-5 p-7 md:p-8">
              <div className="flex items-center justify-between">
                <Label>Flagship playbook</Label>
                <span className="rounded-full border border-[#A3E635]/30 bg-[#84CC16]/10 px-3 py-1 font-mono text-sm font-semibold text-[#A3E635]">
                  {FLAGSHIP.deployments}× deployed
                </span>
              </div>
              <div>
                <p className={`text-2xl font-bold leading-snug text-white ${headingClass}`}>
                  {FLAGSHIP.title}
                </p>
                <p className="mt-3 max-w-md text-base leading-relaxed text-white/70">{FLAGSHIP.blurb}</p>
              </div>
              <div className="flex items-end justify-between gap-4">
                <div className="flex gap-6">
                  {FLAGSHIP.outcomes.map((o) => (
                    <div key={o.label}>
                      <div className={`text-[32px] font-bold leading-none text-white ${headingClass}`}>{o.metric}</div>
                      <div className="mt-1.5 text-[13px] uppercase tracking-wide text-white/50">{o.label}</div>
                    </div>
                  ))}
                </div>
                <span className="flex shrink-0 items-center gap-1 text-sm font-semibold text-[#A3E635]">
                  Explore
                  <ArrowRight
                    size={15}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </span>
              </div>
            </div>
          </Link>

          {/* E — CTA */}
          <Link
            href="/contact"
            className={`${cardBase} pb-noise group block transition-transform`}
            style={{ ...styleI(4), background: 'linear-gradient(140deg, #1D4ED8 0%, #163fb0 45%, #0f2a72 100%)' }}
          >
            <div className="pb-glass absolute inset-0 rounded-2xl" aria-hidden="true" />
            <div className="relative flex h-full flex-col justify-between gap-6 p-7 md:p-8">
              <div className="flex items-start justify-between">
                <Label className="text-white/70">Bring us a pattern</Label>
                <span className="pb-glass flex h-10 w-10 items-center justify-center rounded-full text-white transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
                  <ArrowUpRight size={18} />
                </span>
              </div>
              <div>
                <p className={`text-2xl font-bold leading-snug text-white ${headingClass}`}>
                  Can&apos;t find your scenario?
                </p>
                <p className="mt-3 max-w-xs text-lg leading-relaxed text-white/85">
                  We&apos;ve run a hundred more than these. Bring the mess. We&apos;ll bring the blueprint.
                </p>
              </div>
              <span className="text-base font-semibold text-[#A3E635]">Talk to an architect</span>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
