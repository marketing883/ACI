'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowUpRight, Sparkles } from 'lucide-react';

const EASE = [0.22, 1, 0.36, 1] as const;
const ACCENT = '#5E0ED7';

const LOGOS: Record<string, string> = {
  databricks: '/images/Solution-Partners/databricks.png',
  snowflake: '/images/Solution-Partners/snowflake.svg',
  azure: '/images/Solution-Partners/azure.png',
  aws: '/images/Solution-Partners/aws.png',
  servicenow: '/images/Solution-Partners/servicenow.png',
  kubernetes: '/images/Solution-Partners/kubernetes.svg',
  dynatrace: '/images/Solution-Partners/dynatrace.png',
  salesforce: '/images/Solution-Partners/salesforce.png',
  braze: '/images/Solution-Partners/braze.png',
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
    proof: 'Model deployment time down 83% on a governed Azure lakehouse.',
    subs: ['Copilots & agents', 'RAG systems', 'Forecasting & ML', 'MLOps & evals'],
    logos: ['azure', 'aws', 'databricks'],
    bg: '/images/v4/svc-ai.jpg',
    href: '/services/applied-ai-ml',
  },
  {
    no: '/03',
    name: 'Cybersecurity',
    eyebrow: 'Security built in, not bolted on.',
    proof: 'MTTR under four hours, measured and enforced.',
    subs: ['Zero-trust architecture', 'Compliance readiness', 'Threat response', 'SOC operations'],
    logos: ['azure', 'servicenow', 'dynatrace'],
    bg: '/images/cyber-security.jpg',
    href: '/services/cyber-security',
  },
  {
    no: '/04',
    name: 'Managed Run & SRE',
    eyebrow: 'Past the pilot, into production, for good.',
    proof: '99.7% uptime across a 72+ server estate, releases still moving.',
    subs: ['24/7 operations', 'SRE & on-call', 'Observability', 'Change management'],
    logos: ['kubernetes', 'dynatrace', 'servicenow'],
    bg: '/images/v4/svc-ops.jpg',
    href: '/services/managed-operations',
  },
];

const INTERACTIVE = {
  no: '/05',
  name: 'ACI Interactive',
  eyebrow: 'Our product for the marketing engine.',
  desc: 'MarTech, CDP, and marketing strategy with automated ads management, run as one product.',
  subs: ['Customer data platform', 'Marketing strategy', 'Automated ads management', 'Journey orchestration'],
  logos: ['salesforce', 'braze'],
  href: '/aci-interactive',
};

export default function ServicesSection({ headingClass }: { headingClass: string }) {
  return (
    <section id="capabilities" className="border-t border-gray-200 bg-white text-black">
      <div className="mx-auto max-w-7xl px-6 pb-20 pt-16 md:pt-20">
        {/* Section head */}
        <div className="mb-10 max-w-3xl md:mb-12">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
            / What we build
          </p>
          <h2 className={`text-4xl font-normal tracking-tight sm:text-5xl ${headingClass}`} style={{ lineHeight: 1.05 }}>
            From raw data to AI in production.
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
                className="group relative isolate grid grid-cols-[2.5rem_minmax(0,1fr)_2rem] items-center gap-x-4 gap-y-4 overflow-hidden px-2 py-6 no-underline md:grid-cols-[3.5rem_minmax(0,1.15fr)_minmax(0,1fr)_2rem] md:gap-6 md:px-3 md:py-7"
              >
                {/* Hover takeover: full-color image under a stylized dark overlay */}
                <span aria-hidden="true" className="absolute inset-0 z-0 opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100 group-focus-visible:opacity-100">
                  <span
                    className="absolute inset-0 scale-[1.04] bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-100"
                    style={{ backgroundImage: `url(${c.bg})` }}
                  />
                  <span
                    className="absolute inset-0"
                    style={{
                      background:
                        'linear-gradient(100deg, rgba(4,7,15,0.93) 0%, rgba(4,7,15,0.78) 42%, rgba(23,16,62,0.55) 74%, rgba(23,16,62,0.35) 100%)',
                    }}
                  />
                </span>

                {/* Number */}
                <span className="relative z-10 self-start pt-1 text-xs font-semibold tracking-[0.08em] text-gray-400 transition-colors duration-300 group-hover:text-white/60">
                  {c.no}
                </span>

                {/* Message block */}
                <span className="relative z-10 flex flex-col gap-2">
                  <span className="text-[13px] font-semibold tracking-wide text-blue-700 transition-colors duration-300 group-hover:text-sky-300">
                    {c.eyebrow}
                  </span>
                  <span
                    className={`font-semibold text-black transition-colors duration-300 group-hover:text-white ${headingClass}`}
                    style={{ fontSize: 'clamp(1.4rem, 2.4vw, 2.15rem)', lineHeight: 1.06, letterSpacing: '-0.02em' }}
                  >
                    {c.name}
                  </span>
                  <span className="mt-0.5 max-w-md border-l-2 border-blue-700 pl-3 text-[13px] leading-relaxed text-gray-600 transition-colors duration-300 group-hover:border-sky-300 group-hover:text-white/85">
                    {c.proof}
                  </span>
                </span>

                {/* Capabilities + platforms */}
                <span className="relative z-10 col-start-2 flex flex-col gap-4 md:col-start-auto">
                  <span className="flex flex-wrap gap-2">
                    {c.subs.map((sub) => (
                      <span
                        key={sub}
                        className="whitespace-nowrap rounded-full border border-gray-300 px-2.5 py-1 text-[11px] font-medium text-gray-700 transition-colors duration-300 group-hover:border-white/40 group-hover:text-white"
                      >
                        {sub}
                      </span>
                    ))}
                  </span>
                  <span className="flex items-center gap-7">
                    {c.logos.map((id) => (
                      <Image
                        key={id}
                        src={LOGOS[id]}
                        alt={id}
                        width={150}
                        height={44}
                        className="h-9 w-auto object-contain opacity-60 grayscale transition-all duration-300 group-hover:opacity-90 group-hover:brightness-0 group-hover:invert"
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

        {/* ACI Interactive — the product bar, deliberately its own thing */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.55, delay: 0.1, ease: EASE }}
          className="mt-6"
        >
          <Link
            href={INTERACTIVE.href}
            className="group relative block overflow-hidden rounded-2xl text-white no-underline"
            style={{
              background: 'linear-gradient(115deg, #0b0618 0%, #1d0f45 45%, #3b1290 80%, #5E0ED7 100%)',
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
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.14em] text-white backdrop-blur-sm">
                    <Sparkles size={11} aria-hidden="true" />
                    Product
                  </span>
                  <span className="text-[13px] font-semibold tracking-wide text-purple-200">
                    {INTERACTIVE.eyebrow}
                  </span>
                </span>
                <span
                  className={`font-semibold text-white ${headingClass}`}
                  style={{ fontSize: 'clamp(1.5rem, 2.6vw, 2.3rem)', lineHeight: 1.05, letterSpacing: '-0.02em' }}
                >
                  {INTERACTIVE.name}
                </span>
                <span className="max-w-md text-[13px] leading-relaxed text-white/70">
                  {INTERACTIVE.desc}
                </span>
              </span>

              <span className="col-start-2 flex flex-col gap-4 md:col-start-auto">
                <span className="flex flex-wrap gap-2">
                  {INTERACTIVE.subs.map((sub) => (
                    <span
                      key={sub}
                      className="whitespace-nowrap rounded-full border border-white/25 bg-white/5 px-2.5 py-1 text-[11px] font-medium text-white"
                    >
                      {sub}
                    </span>
                  ))}
                </span>
                <span className="flex items-center gap-7">
                  {INTERACTIVE.logos.map((id) => (
                    <Image
                      key={id}
                      src={LOGOS[id]}
                      alt={id}
                      width={150}
                      height={44}
                      className="h-9 w-auto object-contain opacity-80"
                      style={{ filter: 'brightness(0) invert(1)' }}
                    />
                  ))}
                  <span className="inline-flex items-center gap-1 text-[13px] font-semibold text-white">
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
