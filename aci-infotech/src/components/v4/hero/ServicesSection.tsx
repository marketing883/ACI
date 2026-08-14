'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowUpRight, Sparkles } from 'lucide-react';

const EASE = [0.22, 1, 0.36, 1] as const;
const ACCENT = '#84CC16';

const LOGOS: Record<string, string> = {
  databricks: '/images/Solution-Partners/databricks.png',
  snowflake: '/images/Solution-Partners/snowflake.svg',
  azure: '/images/Solution-Partners/azure.png',
  aws: '/images/Solution-Partners/aws.png',
  googlecloud: '/images/Solution-Partners/googlecloud.svg',
  servicenow: '/images/Solution-Partners/servicenow.png',
  kubernetes: '/images/Solution-Partners/kubernetes.svg',
  dynatrace: '/images/Solution-Partners/dynatrace.png',
  salesforce: '/images/Solution-Partners/salesforce.png',
  braze: '/images/Solution-Partners/braze.png',
  anthropic: '/brand/anthropic-wordmark.svg',
  openai: '/brand/openai-wordmark.svg',
  langgraph: '/brand/langgraph-wordmark.svg',
};

// Proper names for alt text — the map keys are file ids, not labels.
const LOGO_ALT: Record<string, string> = {
  databricks: 'Databricks',
  snowflake: 'Snowflake',
  azure: 'Microsoft Azure',
  aws: 'Amazon Web Services',
  googlecloud: 'Google Cloud',
  servicenow: 'ServiceNow',
  kubernetes: 'Kubernetes',
  dynatrace: 'Dynatrace',
  salesforce: 'Salesforce',
  braze: 'Braze',
  anthropic: 'Anthropic',
  openai: 'OpenAI',
  langgraph: 'LangGraph',
};

type Service = {
  no: string;
  name: string;
  eyebrow: string;
  proof: string;
  subs: string[];
  logos: string[];
  bg: string;
  href: string;
};

// Service name carries the big type; the outcome line is the eyebrow.
const SERVICES: Service[] = [
  {
    no: '/01',
    name: 'Data Engineering & Lakehouse',
    eyebrow: 'Move your data onto modern ground.',
    proof: 'Campaign analysis cut from 3 weeks to 4 hours. 94% adoption.',
    subs: ['Lakehouse migration', 'Real-time pipelines', 'Governance & lineage', 'Self-service BI'],
    logos: ['databricks', 'snowflake', 'azure'],
    bg: '/images/v4/svc-data.jpg',
    href: '/services/data-engineering',
  },
  {
    no: '/02',
    name: 'Applied AI & GenAI',
    eyebrow: 'Build AI on a foundation that holds.',
    proof: 'Prototype to production in 90 days on a governed Azure lakehouse, 94% eval pass rate.',
    subs: ['Copilots & agents', 'RAG systems', 'Forecasting & ML', 'MLOps & evals'],
    logos: ['anthropic', 'openai', 'langgraph'],
    bg: '/images/v4/svc-ai.jpg',
    href: '/services/applied-ai-ml',
  },
  {
    no: '/03',
    name: 'Cloud Modernization',
    eyebrow: 'Legacy out, cloud in, nothing goes dark.',
    proof: 'Mainframe-to-cloud cutovers run in parallel: 68% cost cut, zero downtime.',
    subs: ['Landing zones', 'Migrations & cutovers', 'FinOps', 'Kubernetes platforms'],
    logos: ['aws', 'azure', 'googlecloud'],
    bg: '/images/v4/svc-cloud.jpg',
    href: '/services/cloud-modernization',
  },
  {
    no: '/04',
    name: 'Managed Run & SRE',
    eyebrow: 'Past the pilot, into production, for good.',
    proof: '99.97% uptime across a 72+ server estate, releases still moving.',
    subs: ['24/7 operations', 'SRE & on-call', 'Observability', 'Change management'],
    logos: ['kubernetes', 'dynatrace', 'servicenow'],
    bg: '/images/v4/svc-ops.jpg',
    href: '/services/managed-operations',
  },
];

// ACI Interactive is a specialized division of ACI Infotech, not a
// product: marketing, MarTech, and CDP services under one name, with
// products planned to launch under it later.
const INTERACTIVE = {
  no: '/05',
  name: 'ACI Interactive',
  eyebrow: 'Marketing, run with engineering discipline.',
  desc: 'Our specialized division for marketing, MarTech, and CDP services. Strategy, customer data, and activation under one roof, with new products on the way.',
  subs: ['MarTech & CDP strategy', 'Customer data platforms', 'Journey orchestration', 'Marketing analytics'],
  logos: ['salesforce', 'braze'],
  href: '/services/martech-cdp',
};

export default function ServicesSection({ headingClass }: { headingClass: string }) {
  // Only fetch a bar's hover image once the visitor points at it.
  const [warm, setWarm] = useState<Set<number>>(new Set());
  const warmUp = (i: number) => setWarm((w) => (w.has(i) ? w : new Set(w).add(i)));

  return (
    <section id="capabilities" className="border-t border-gray-200 bg-white text-black">
      <div className="mx-auto max-w-7xl px-6 pb-20 pt-16 md:pt-20">
        {/* Section head */}
        <div className="mb-10 max-w-3xl md:mb-12">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
            / What we build
          </p>
          <h2 className={`text-4xl font-bold tracking-tight text-black sm:text-5xl md:text-6xl lg:text-[64px] ${headingClass}`} style={{ lineHeight: 1.04 }}>
            From raw data to <span className="text-[#1D4ED8]">working&nbsp;AI.</span>
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-gray-600 md:text-base">
            We build the data foundation, put the AI on top of it, and stay on to run both once they
            are live.
          </p>
        </div>

        {/* Service bars */}
        <ul className="m-0 list-none border-t border-black p-0">
          {SERVICES.map((c, idx) => (
            <motion.li
              key={c.no}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.55, delay: idx * 0.06, ease: EASE }}
              className="border-b border-gray-200"
            >
              <Link
                href={c.href}
                onPointerEnter={() => warmUp(idx)}
                onFocus={() => warmUp(idx)}
                className="group relative isolate grid grid-cols-[2.5rem_minmax(0,1fr)_2rem] items-center gap-x-4 gap-y-4 overflow-hidden px-2 py-6 no-underline md:grid-cols-[3.5rem_minmax(0,1.15fr)_minmax(0,1fr)_2rem] md:gap-6 md:px-3 md:py-7"
              >
                {/* Hover takeover: full-color image under a stylized dark overlay */}
                <span aria-hidden="true" className="absolute inset-0 z-0 opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100 group-focus-visible:opacity-100">
                  <span
                    className="absolute inset-0 scale-[1.04] bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-100"
                    style={{ backgroundImage: warm.has(idx) ? `url(${c.bg})` : undefined }}
                  />
                  <span
                    className="absolute inset-0"
                    style={{
                      background:
                        'linear-gradient(100deg, rgba(4,7,15,0.93) 0%, rgba(4,7,15,0.78) 42%, rgba(11,23,58,0.55) 74%, rgba(29,78,216,0.35) 100%)',
                    }}
                  />
                </span>

                {/* Number */}
                <span className="relative z-10 self-start pt-1 text-xs font-semibold tracking-[0.08em] text-gray-400 transition-colors duration-300 group-hover:text-white/60">
                  {c.no}
                </span>

                {/* Message block */}
                <span className="relative z-10 flex flex-col gap-2">
                  <span className="text-[13px] font-semibold tracking-wide text-blue-700 transition-colors duration-300 group-hover:text-[#A3E635]">
                    {c.eyebrow}
                  </span>
                  <span
                    className={`font-semibold text-black transition-colors duration-300 group-hover:text-white ${headingClass}`}
                    style={{ fontSize: 'clamp(1.4rem, 2.4vw, 2.15rem)', lineHeight: 1.06, letterSpacing: '-0.02em' }}
                  >
                    {c.name}
                  </span>
                  <span className="mt-0.5 max-w-md border-l-2 border-blue-700 pl-3 text-[13px] leading-relaxed text-gray-600 transition-colors duration-300 group-hover:border-[#A3E635] group-hover:text-white/85">
                    {c.proof}
                  </span>
                </span>

                {/* Capabilities + platforms */}
                <span className="relative z-10 col-start-2 flex flex-col gap-4 md:col-start-auto">
                  <span className="flex flex-wrap gap-2">
                    {c.subs.map((sub) => (
                      <span
                        key={sub}
                        className="whitespace-nowrap rounded-full border border-gray-300 px-3 py-1 text-[12px] font-medium text-gray-700 transition-colors duration-300 group-hover:border-white/40 group-hover:text-white lg:px-3.5 lg:py-1.5 lg:text-[13px]"
                      >
                        {sub}
                      </span>
                    ))}
                  </span>
                  <span className="flex flex-wrap items-center gap-x-6 gap-y-3 lg:gap-x-8">
                    {c.logos.map((id) => (
                      <Image
                        key={id}
                        src={LOGOS[id]}
                        alt={LOGO_ALT[id] ?? id}
                        width={200}
                        height={58}
                        className="h-9 w-auto object-contain opacity-70 grayscale transition-all duration-300 group-hover:opacity-90 group-hover:brightness-0 group-hover:invert lg:h-12"
                      />
                    ))}
                  </span>
                </span>

                {/* Arrow */}
                <span
                  aria-hidden="true"
                  className="relative z-10 justify-self-end text-black transition-all duration-300 group-hover:translate-x-1 group-hover:text-white"
                >
                  <ArrowUpRight size={22} />
                </span>
              </Link>
            </motion.li>
          ))}
        </ul>

        {/* ACI Interactive — the division bar, deliberately its own thing */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.55, delay: 0.1, ease: EASE }}
          className="mt-6"
        >
          <Link
            href={INTERACTIVE.href}
            prefetch={false}
            className="group relative block overflow-hidden rounded-2xl text-white no-underline"
            style={{
              background: 'linear-gradient(115deg, #060b1c 0%, #0f2350 45%, #1b3aa0 80%, #1D4ED8 100%)',
            }}
          >
            {/* soft glow that follows the hover */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full opacity-40 blur-3xl transition-opacity duration-500 group-hover:opacity-70"
              style={{ background: ACCENT }}
            />
            <span className="relative z-10 grid grid-cols-[2.5rem_minmax(0,1fr)_2rem] items-center gap-x-4 gap-y-4 px-2 py-6 md:grid-cols-[3.5rem_minmax(0,1.15fr)_minmax(0,1fr)_2rem] md:gap-6 md:px-5 md:py-7">
              <span className="self-start pt-1 text-xs font-semibold tracking-[0.08em] text-white/40">
                {INTERACTIVE.no}
              </span>

              <span className="flex flex-col gap-2">
                <span className="flex items-center gap-2.5">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#84CC16] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.14em] text-black">
                    <Sparkles size={11} aria-hidden="true" />
                    Specialized Division
                  </span>
                  <span className="text-[13px] font-semibold tracking-wide text-[#A3E635]">
                    {INTERACTIVE.eyebrow}
                  </span>
                </span>
                <span
                  className={`font-semibold text-white ${headingClass}`}
                  style={{ fontSize: 'clamp(1.5rem, 2.6vw, 2.3rem)', lineHeight: 1.05, letterSpacing: '-0.02em' }}
                >
                  {INTERACTIVE.name}
                </span>
                <span className="max-w-md text-[14px] leading-relaxed text-white/75">
                  {INTERACTIVE.desc}
                </span>
              </span>

              <span className="col-start-2 flex flex-col gap-4 md:col-start-auto">
                <span className="flex flex-wrap gap-2">
                  {INTERACTIVE.subs.map((sub) => (
                    <span
                      key={sub}
                      className="whitespace-nowrap rounded-full border border-white/25 bg-white/5 px-3 py-1 text-[12px] font-medium text-white lg:px-3.5 lg:py-1.5 lg:text-[13px]"
                    >
                      {sub}
                    </span>
                  ))}
                </span>
                <span className="flex flex-wrap items-center gap-x-6 gap-y-3 lg:gap-x-8">
                  {INTERACTIVE.logos.map((id) => (
                    <Image
                      key={id}
                      src={LOGOS[id]}
                      alt={LOGO_ALT[id] ?? id}
                      width={200}
                      height={58}
                      className="h-9 w-auto object-contain opacity-80 lg:h-12"
                      style={{ filter: 'brightness(0) invert(1)' }}
                    />
                  ))}
                  <span className="inline-flex items-center gap-1 text-[14px] font-semibold text-white">
                    Explore ACI Interactive
                    <ArrowUpRight size={15} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </span>
                </span>
              </span>

              <span aria-hidden="true" className="justify-self-end text-white transition-transform duration-300 group-hover:translate-x-1">
                <ArrowUpRight size={22} />
              </span>
            </span>
          </Link>
        </motion.div>

        <div className="mt-8">
          <Link
            href="/services"
            className="group inline-flex items-center gap-1.5 text-sm font-semibold text-black transition-colors hover:text-blue-700"
          >
            <span className="relative">
              See all capabilities
              <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-current transition-transform duration-300 ease-out group-hover:scale-x-100" />
            </span>
            <ArrowUpRight size={15} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
