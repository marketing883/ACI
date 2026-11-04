'use client';

// The signature scene: four chapters (build, modernize, run, innovate)
// pinned to the viewport while the page scrolls through 400vh. Each
// chapter owns a Magnific environment and a colour; the backdrop
// cross-fades and slowly pushes in, the giant verb swaps with a masked
// rise, and a side index tracks progress. Proof cards carry real outcomes
// from the case studies and link to them.

import { useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { Grain } from './motion';
import { EASE } from './tokens';

type Proof = { value: string; label: string; href: string; cta: string };
type Chapter = {
  key: string;
  verb: string;
  eyebrow: string;
  headline: string;
  desc: string;
  image: string;
  tint: string;
  link: { label: string; href: string };
  proofs: Proof[];
};

const CHAPTERS: Chapter[] = [
  {
    key: 'build',
    verb: 'We build.',
    eyebrow: 'Data and platforms',
    headline: 'Move your data onto modern ground.',
    desc: 'Lakehouse migrations, real-time pipelines, governance and lineage, and self-service BI that people actually open.',
    image: '/images/new-home/chapter-build.jpg',
    tint: '#1d4ed8',
    link: { label: 'Explore data engineering', href: '/services/data-engineering' },
    proofs: [
      { value: 'Data Strategy and Architecture', label: 'Agile data strategy, architecture blueprinting, cloud data platforms, hubs and catalogs', href: '/services/advisory-strategy', cta: 'Explore advisory' },
      { value: 'Data Product Development', label: 'End-to-end product development by dedicated data engineering teams', href: '/services/data-engineering', cta: 'Explore data engineering' },
    ],
  },
  {
    key: 'modernize',
    verb: 'We modernize.',
    eyebrow: 'Cloud and modernization',
    headline: 'Legacy out, cloud in, nothing goes dark.',
    desc: 'Mainframe, Hadoop, Teradata, and Oracle estates re-architected for the cloud, cut over in parallel so the business never feels the switch.',
    image: '/images/new-home/chapter-modernize.jpg',
    tint: '#7c3aed',
    link: { label: 'Explore cloud modernization', href: '/services/cloud-modernization' },
    proofs: [
      { value: 'Data Stack Modernization', label: 'Architecture, cloud migration, warehouse and lake implementation, governance, DevOps', href: '/services/cloud-modernization', cta: 'Explore cloud modernization' },
      { value: '11 modernization accelerators', label: 'SAS, Synapse, Oracle, Tableau, Cognos, and more, onto modern platforms', href: '#accelerators', cta: 'See the accelerators' },
    ],
  },
  {
    key: 'run',
    verb: 'We run.',
    eyebrow: 'Run and operate',
    headline: 'Past the pilot, into production, for good.',
    desc: '24/7 operations, SRE and on-call, observability, and change management. Someone is awake whenever your estate is.',
    image: '/images/new-home/chapter-run.jpg',
    tint: '#0891b2',
    link: { label: 'Explore managed operations', href: '/services/managed-operations' },
    proofs: [
      { value: 'Managed Run and SRE', label: '24/7 NOC and SOC coverage, observability, on-call SRE, and change management', href: '/services/managed-operations', cta: 'Explore managed operations' },
      { value: 'Data Observability', label: 'Quality monitoring, end-to-end lineage, latency tracking, and root cause analysis', href: '#frameworks', cta: 'See the frameworks' },
    ],
  },
  {
    key: 'innovate',
    verb: 'We innovate.',
    eyebrow: 'Applied AI and GenAI',
    headline: 'From prototype to governed production.',
    desc: 'Turn early concepts into working solutions, quickly and cost-effectively: copilots, agents, RAG systems, forecasting, and MLOps that move into governed production.',
    image: '/images/new-home/chapter-innovate.jpg',
    tint: '#6366f1',
    link: { label: 'Explore applied AI', href: '/services/applied-ai-ml' },
    proofs: [
      { value: 'Generative AI and Agentic AI', label: 'AI consulting, GenAI integrations, product development, and AI transformation', href: '/services/applied-ai-ml', cta: 'Explore applied AI' },
      { value: 'MLOps', label: 'Automated ML pipelines, CI and CD for ML, continuous training, and model governance', href: '/services/applied-ai-ml', cta: 'See how models stay healthy' },
    ],
  },
];

export default function NHChapters({ headingClass }: { headingClass: string }) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const bar = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);
  const push = useTransform(scrollYProgress, [0, 1], [1.08, 1.2]);

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    const i = Math.min(CHAPTERS.length - 1, Math.max(0, Math.floor(v * CHAPTERS.length)));
    setActive((cur) => (cur === i ? cur : i));
  });

  const jump = (i: number) => {
    const el = ref.current;
    if (!el) return;
    const top = el.offsetTop + (el.offsetHeight - window.innerHeight) * ((i + 0.5) / CHAPTERS.length);
    window.scrollTo({ top, behavior: reduce ? 'auto' : 'smooth' });
  };

  const c = CHAPTERS[active];

  return (
    <section ref={ref} id="what-we-do" aria-label="What we do" className="relative bg-[#05070d] text-white" style={{ height: `${CHAPTERS.length * 100}vh` }}>
      {/* Every chapter in plain text for screen readers and crawlers; the
          pinned stage below only ever shows one of them. */}
      <div className="sr-only">
        {CHAPTERS.map((ch) => (
          <div key={ch.key}>
            <h3>{`${ch.verb} ${ch.headline}`}</h3>
            <p>{ch.desc}</p>
            <ul>
              {ch.proofs.map((p) => (
                <li key={p.cta}>
                  <a href={p.href}>{`${p.value}: ${p.label}`}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {/* Backdrops */}
        <motion.div style={{ scale: reduce ? 1 : push }} className="absolute inset-0">
          {CHAPTERS.map((ch, i) => (
            <motion.div
              key={ch.key}
              className="absolute inset-0"
              initial={false}
              animate={{ opacity: i === active ? 1 : 0 }}
              transition={{ duration: 1.1, ease: EASE }}
            >
              <Image src={ch.image} alt="" fill sizes="100vw" className="object-cover object-[70%_50%]" priority={i === 0} />
            </motion.div>
          ))}
        </motion.div>
        <motion.div
          aria-hidden="true"
          className="absolute inset-0"
          animate={{ background: `radial-gradient(80% 70% at 15% 60%, ${c.tint}55, transparent 60%)` }}
          transition={{ duration: 1.1, ease: EASE }}
        />
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-[#05070d] via-[#05070d]/70 to-[#05070d]/10" />
        <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#05070d] to-transparent" />
        <Grain />

        <div className="relative mx-auto flex h-full max-w-7xl flex-col justify-center px-6 pt-16">
          {/* Side index */}
          <nav aria-label="Chapters" className="absolute left-6 top-1/2 hidden -translate-y-1/2 xl:-left-4 xl:block 2xl:-left-16">
            <ol className="space-y-5">
              {CHAPTERS.map((ch, i) => (
                <li key={ch.key}>
                  <button
                    type="button"
                    onClick={() => jump(i)}
                    className={`group flex items-center gap-3 text-sm transition-colors ${i === active ? 'text-white' : 'text-white/40 hover:text-white/75'}`}
                    aria-current={i === active ? 'step' : undefined}
                  >
                    <span className={`h-px transition-all duration-500 ${i === active ? 'w-8 bg-[#22d3ee]' : 'w-4 bg-white/30 group-hover:w-6'}`} />
                    {ch.verb.replace('We ', '').replace('.', '')}
                  </button>
                </li>
              ))}
            </ol>
          </nav>

          <div className="xl:pl-28">
            <div className="flex items-center gap-4 text-xs font-semibold uppercase tracking-[0.22em] text-white/55">
              <span className="tabular-nums text-white">0{active + 1}</span>
              <span className="relative h-px w-24 overflow-hidden bg-white/20">
                <motion.span style={{ width: bar }} className="absolute inset-y-0 left-0 bg-[#22d3ee]" />
              </span>
              <span>0{CHAPTERS.length}</span>
              <span className="ml-2 hidden sm:inline">{c.eyebrow}</span>
            </div>

            <div className="mt-6 h-[clamp(3.4rem,12vw,11.5rem)] overflow-hidden">
              <AnimatePresence mode="wait" initial={false}>
                <motion.h2
                  key={c.key}
                  initial={reduce ? { opacity: 0 } : { y: '105%' }}
                  animate={reduce ? { opacity: 1 } : { y: '0%' }}
                  exit={reduce ? { opacity: 0 } : { y: '-105%' }}
                  transition={{ duration: 0.75, ease: EASE }}
                  className={`[color:inherit] whitespace-nowrap text-[clamp(2.6rem,10.5vw,10.5rem)] font-semibold leading-[1] tracking-[-0.045em] ${headingClass}`}
                >
                  {c.verb}
                </motion.h2>
              </AnimatePresence>
            </div>

            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={c.key}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.6, ease: EASE, delay: reduce ? 0 : 0.12 }}
              >
                <p className={`mt-5 max-w-2xl text-xl font-medium text-white md:text-3xl ${headingClass}`}>{c.headline}</p>
                <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/65 md:text-base">{c.desc}</p>

                <div className="mt-8 grid max-w-3xl gap-3 sm:grid-cols-2">
                  {c.proofs.map((p, i) => (
                    <Link
                      key={p.cta}
                      href={p.href}
                      className={`nh-btn nh-glow-card group rounded-2xl border text-white border-white/12 bg-white/[0.05] p-5 backdrop-blur-xl transition-colors hover:bg-white/[0.09] ${i > 0 ? 'hidden sm:block' : ''}`}
                      onMouseMove={(e) => {
                        const r = e.currentTarget.getBoundingClientRect();
                        e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`);
                        e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`);
                      }}
                    >
                      <div className={`text-lg font-semibold leading-snug tracking-tight md:text-xl ${headingClass}`}>{p.value}</div>
                      <div className="mt-2 text-sm leading-snug text-white/70">{p.label}</div>
                      <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-[#67e8f9]">
                        {p.cta}
                        <ArrowUpRight size={14} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                      </div>
                    </Link>
                  ))}
                </div>

                <Link href={c.link.href} className="nh-btn mt-7 inline-flex items-center gap-2 text-sm font-semibold text-white/85 hover:text-white">
                  <span className="relative">
                    {c.link.label}
                    <span className="absolute -bottom-1 left-0 h-px w-full bg-current opacity-40" />
                  </span>
                  <ArrowUpRight size={15} />
                </Link>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Mobile chapter dots */}
          <div className="absolute bottom-8 left-6 flex gap-2 xl:hidden" aria-hidden="true">
            {CHAPTERS.map((ch, i) => (
              <span key={ch.key} className={`h-1 rounded-full transition-all duration-500 ${i === active ? 'w-8 bg-[#22d3ee]' : 'w-2 bg-white/30'}`} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
