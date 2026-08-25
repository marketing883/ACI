'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { useReveal } from './reveal';
import './v5.css';

// Services as expanding columns (design Option B). One column is
// always open; it auto-advances every 6s until the pointer takes
// over, and hovering or tapping a collapsed spine expands it. Below
// md the columns stack as full-width cards with everything visible.

const ADVANCE_MS = 6000;

type Column = {
  num: string;
  eyebrow: string;
  name: string;
  stat: string;
  proof: string;
  chips: string[];
  logos: string;
  href: string;
  image: string;
};

const SERVICES: Column[] = [
  {
    num: '01',
    eyebrow: 'Move your data onto modern ground.',
    name: 'Data Engineering & Lakehouse',
    stat: '3 weeks → 4 hours',
    proof: 'Campaign analysis cut from 3 weeks to 4 hours. 94% adoption.',
    chips: ['Lakehouse migration', 'Real-time pipelines', 'Governance & lineage', 'Self-service BI'],
    logos: 'Databricks · Snowflake · Azure',
    href: '/services/data-engineering',
    image: '/images/v4/svc-data.jpg',
  },
  {
    num: '02',
    eyebrow: 'Build AI on a foundation that holds.',
    name: 'Applied AI & GenAI',
    stat: '90 days',
    proof: 'Prototype to production on a governed Azure lakehouse, 94% eval pass rate.',
    chips: ['Copilots & agents', 'RAG systems', 'Forecasting & ML', 'MLOps & evals'],
    logos: 'Anthropic · OpenAI · LangGraph',
    href: '/services/applied-ai-ml',
    image: '/images/v4/svc-ai.jpg',
  },
  {
    num: '03',
    eyebrow: 'Legacy out, cloud in, nothing goes dark.',
    name: 'Cloud Modernization',
    stat: '68% cost cut',
    proof: 'Mainframe-to-cloud cutovers run in parallel: zero downtime.',
    chips: ['Landing zones', 'Migrations & cutovers', 'FinOps', 'Kubernetes platforms'],
    logos: 'AWS · Azure · Google Cloud',
    href: '/services/cloud-modernization',
    image: '/images/v4/svc-cloud.jpg',
  },
  {
    num: '04',
    eyebrow: 'Past the pilot, into production, for good.',
    name: 'Managed Run & SRE',
    stat: '99.97% uptime',
    proof: 'Across a 72+ server estate, releases still moving.',
    chips: ['24/7 operations', 'SRE & on-call', 'Observability', 'Change management'],
    logos: 'Kubernetes · Dynatrace · ServiceNow',
    href: '/services/managed-operations',
    image: '/images/v4/svc-ops.jpg',
  },
];

const INTERACTIVE = {
  eyebrow: 'Marketing, run with engineering discipline.',
  name: 'ACI Interactive',
  desc: 'Our specialized division for marketing, MarTech, and CDP services. Strategy, customer data, and activation under one roof, with new products on the way.',
  chips: ['MarTech & CDP strategy', 'Customer data platforms', 'Journey orchestration', 'Marketing analytics'],
  logos: 'Salesforce · Braze',
  href: '/services/martech-cdp',
  cta: 'Explore ACI Interactive',
};

/** Expanded-panel body, shared between the desktop columns and the
 *  stacked mobile cards. */
function PanelBody({ col, headingClass, compact }: { col: Column; headingClass: string; compact?: boolean }) {
  return (
    <div className="flex flex-col gap-3.5">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#60A5FA]">/ {col.num}</p>
      <h3 className={`text-2xl font-semibold leading-tight text-white ${compact ? '' : 'lg:text-3xl'} ${headingClass}`}>{col.eyebrow}</h3>
      <p className={`text-lg font-medium text-white/85 ${headingClass}`}>{col.name}</p>
      <p className={`text-2xl font-semibold text-[#84CC16] ${compact ? '' : 'lg:text-[32px]'} ${headingClass}`}>{col.stat}</p>
      <p className="max-w-md text-sm leading-relaxed text-white/60">{col.proof}</p>
      <div className="flex flex-wrap gap-2">
        {col.chips.map((c) => (
          <span key={c} className="rounded-full border border-white/[0.14] bg-white/[0.07] px-3 py-1 text-xs text-white/75">
            {c}
          </span>
        ))}
      </div>
      <div className="mt-1 flex items-center gap-4">
        <span className="text-xs text-white/40">{col.logos}</span>
        <ArrowUpRight size={16} className="text-white transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </div>
    </div>
  );
}

/** ACI Interactive expanded body. */
function InteractiveBody({ headingClass, compact }: { headingClass: string; compact?: boolean }) {
  return (
    <div className="flex flex-col gap-3.5">
      <span className="w-fit rounded-full bg-[#A3E635] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-[#0a0b10]">
        Specialized Division
      </span>
      <h3 className={`text-2xl font-semibold text-white ${compact ? '' : 'lg:text-3xl'} ${headingClass}`}>{INTERACTIVE.name}</h3>
      <p className={`text-lg font-medium text-white/90 ${headingClass}`}>{INTERACTIVE.eyebrow}</p>
      <p className="max-w-md text-sm leading-relaxed text-white/70">{INTERACTIVE.desc}</p>
      <div className="flex flex-wrap gap-2">
        {INTERACTIVE.chips.map((c) => (
          <span key={c} className="rounded-full border border-white/[0.16] bg-white/10 px-3 py-1 text-xs text-white/80">
            {c}
          </span>
        ))}
      </div>
      <div className="mt-1 flex items-center gap-4">
        <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-white">
          {INTERACTIVE.cta}
          <ArrowUpRight size={15} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </span>
        <span className="text-xs text-white/50">{INTERACTIVE.logos}</span>
      </div>
    </div>
  );
}

export default function ServicesColumns({ headingClass }: { headingClass: string }) {
  const { ref, revealed } = useReveal<HTMLElement>(0.12);
  const [active, setActive] = useState(0);
  const [engaged, setEngaged] = useState(false);
  const total = SERVICES.length + 1; // + ACI Interactive

  // Auto-advance until the pointer takes over, and only once revealed.
  useEffect(() => {
    if (!revealed || engaged) return;
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const t = setInterval(() => setActive((n) => (n + 1) % total), ADVANCE_MS);
    return () => clearInterval(t);
  }, [revealed, engaged, total]);

  const colClass =
    'v5-col v5-rise group relative hidden min-w-0 cursor-pointer overflow-hidden rounded-2xl text-left md:block';

  const colStyle = (i: number): React.CSSProperties =>
    ({
      flexGrow: active === i ? 3.2 : 1,
      flexBasis: 0,
      '--v5-d': `${0.1 + i * 0.08}s`,
    }) as React.CSSProperties;

  return (
    <section
      id="services"
      ref={ref}
      className={`border-t border-white/[0.08] bg-[#07080d] text-white ${revealed ? 'is-revealed' : ''}`}
    >
      <div className="mx-auto max-w-7xl px-6 pb-24 pt-20 md:pt-24">
        {/* Header */}
        <div className="mb-11 flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <p className="v5-rise mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-[#60A5FA]" style={{ '--v5-d': '0s' } as React.CSSProperties}>
              / What we build
            </p>
            <h2 className={`v5-rise text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl ${headingClass}`} style={{ lineHeight: 1.06, '--v5-d': '0.05s' } as React.CSSProperties}>
              From raw data to
              <br />
              <span className="text-[#60A5FA]">AI in production.</span>
            </h2>
            <p className="v5-rise mt-4 max-w-xl text-sm leading-relaxed text-white/60 md:text-base" style={{ '--v5-d': '0.1s' } as React.CSSProperties}>
              We build the data foundation, put the AI on top of it, and stay on to run both once
              they are live.
            </p>
          </div>
          <Link href="/services" className="v5-rise group inline-flex items-center gap-1.5 text-sm font-semibold text-white" style={{ '--v5-d': '0.12s' } as React.CSSProperties}>
            <span className="relative">
              See all capabilities
              <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-current transition-transform duration-300 ease-out group-hover:scale-x-100" />
            </span>
            <ArrowUpRight size={15} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Desktop: expanding columns */}
        <div className="hidden gap-3.5 md:flex md:h-[620px]" onMouseLeave={() => setEngaged(false)}>
          {SERVICES.map((col, i) => {
            const open = active === i;
            return (
              <Link
                key={col.num}
                href={col.href}
                className={colClass}
                style={colStyle(i)}
                onMouseEnter={() => {
                  setEngaged(true);
                  setActive(i);
                }}
                onFocus={() => {
                  setEngaged(true);
                  setActive(i);
                }}
              >
                <Image src={col.image} alt="" fill sizes="(max-width: 1280px) 50vw, 640px" className={`object-cover transition-opacity duration-500 ${open ? 'opacity-35' : 'opacity-[0.14]'}`} />
                <span aria-hidden="true" className="absolute inset-0" style={{ background: open ? 'linear-gradient(180deg, rgba(6,9,16,0.2) 0%, rgba(6,9,16,0.93) 78%)' : 'rgba(6,9,16,0.55)' }} />

                {/* Collapsed spine */}
                <span className={`absolute inset-0 flex flex-col items-center justify-between py-6 transition-opacity duration-300 ${open ? 'pointer-events-none opacity-0' : 'opacity-100'}`}>
                  <span className="self-start pl-6 text-[13px] font-semibold tracking-[0.14em] text-white/50">/ {col.num}</span>
                  <span className={`whitespace-nowrap text-xl font-semibold text-white/85 ${headingClass}`} style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
                    {col.name}
                  </span>
                  <span />
                </span>

                {/* Open panel */}
                <span className={`absolute inset-x-0 bottom-0 block p-8 transition-opacity delay-150 duration-300 ${open ? 'opacity-100' : 'pointer-events-none opacity-0'}`}>
                  <PanelBody col={col} headingClass={headingClass} />
                </span>
              </Link>
            );
          })}

          {/* ACI Interactive column */}
          <Link
            href={INTERACTIVE.href}
            className={colClass}
            style={{ ...colStyle(SERVICES.length), background: 'linear-gradient(200deg, #0b173a 0%, #1D4ED8 160%)' }}
            onMouseEnter={() => {
              setEngaged(true);
              setActive(SERVICES.length);
            }}
            onFocus={() => {
              setEngaged(true);
              setActive(SERVICES.length);
            }}
          >
            <span aria-hidden="true" className="absolute -right-10 -top-12 h-52 w-52" style={{ background: 'radial-gradient(closest-side, rgba(163,230,53,0.35), rgba(163,230,53,0))', filter: 'blur(30px)' }} />
            <span className={`absolute inset-0 flex flex-col items-center justify-between py-6 transition-opacity duration-300 ${active === SERVICES.length ? 'pointer-events-none opacity-0' : 'opacity-100'}`}>
              <span className="self-start pl-6">
                <span className="rounded-full bg-[#A3E635] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-[#0a0b10]">Division</span>
              </span>
              <span className={`whitespace-nowrap text-xl font-semibold text-white ${headingClass}`} style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
                ACI Interactive
              </span>
              <span />
            </span>
            <span className={`absolute inset-x-0 bottom-0 block p-8 transition-opacity delay-150 duration-300 ${active === SERVICES.length ? 'opacity-100' : 'pointer-events-none opacity-0'}`}>
              <InteractiveBody headingClass={headingClass} />
            </span>
          </Link>
        </div>

        {/* Mobile: stacked cards, everything visible. */}
        <div className="flex flex-col gap-4 md:hidden">
          {SERVICES.map((col, i) => (
            <Link
              key={col.num}
              href={col.href}
              className="v5-rise group relative overflow-hidden rounded-2xl border border-white/10"
              style={{ '--v5-d': `${0.1 + i * 0.08}s` } as React.CSSProperties}
            >
              <Image src={col.image} alt="" fill sizes="100vw" className="object-cover opacity-20" />
              <span aria-hidden="true" className="absolute inset-0 bg-[#06090f]/70" />
              <span className="relative block p-6">
                <PanelBody col={col} headingClass={headingClass} compact />
              </span>
            </Link>
          ))}
          <Link
            href={INTERACTIVE.href}
            className="v5-rise group relative overflow-hidden rounded-2xl"
            style={{ background: 'linear-gradient(200deg, #0b173a 0%, #1D4ED8 160%)', '--v5-d': '0.42s' } as React.CSSProperties}
          >
            <span className="relative block p-6">
              <InteractiveBody headingClass={headingClass} compact />
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
