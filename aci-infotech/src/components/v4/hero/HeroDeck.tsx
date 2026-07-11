'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import FadingVideo from './FadingVideo';
import AciNav from './AciNav';
import './hero.css';

const VIDEO_1 = '/videos/v4-slide1.mp4';
const EASE = [0.16, 1, 0.3, 1] as const;

type Mark =
  | { type: 'label'; value: string }
  | { type: 'logo'; src: string; alt: string; w: number; h: number }
  | { type: 'badge'; src: string; alt: string; w: number; h: number };

type Message = {
  headline: [string, string];
  body: string;
  card: {
    eyebrow: string;
    mark: Mark;
    title: string;
    stat?: { value: string; label: string };
    desc: string;
    tags: string[];
  };
  cta: { label: string; href: string };
};

const MESSAGES: Message[] = [
  {
    headline: ['Build the AI foundation.', 'Run it in production.'],
    body: 'We engineer the data foundation, build the AI on top, and run it in production. Most enterprise AI stalls before it gets there.',
    card: {
      eyebrow: 'Service Foundation',
      mark: { type: 'label', value: 'Data Engineering' },
      title: 'Data Engineering Services',
      desc: 'Lakehouse architecture, real-time pipelines, data quality, migration, governance, and the operating layer AI depends on.',
      tags: ['Pipelines', 'Governance', 'AI-ready data'],
    },
    cta: { label: 'Explore data engineering', href: '/services/data-engineering' },
  },
  {
    headline: ['Databricks depth.', 'Production AI.'],
    body: 'Lakehouse modernization, Delta pipelines, MLflow, governance, and real-time analytics for teams that need Databricks to run in production.',
    card: {
      eyebrow: 'Case Study',
      mark: { type: 'logo', src: '/images/Solution-Partners/databricks.png', alt: 'Databricks', w: 132, h: 34 },
      title: 'Databricks modernization for a leading C-store chain',
      stat: { value: '87%', label: 'Reduction in data processing time' },
      desc: 'Modernized the retail data estate so analytics could move from delayed processing to operational speed.',
      tags: ['Delta Lake', 'MLflow', 'Workflows'],
    },
    cta: { label: 'Read Databricks case study', href: '/case-studies' },
  },
  {
    headline: ['Microsoft cloud.', 'AI-led operations.'],
    body: 'Azure is strongest when it connects to the business stack. We bring Azure, Dynamics 365, Power Platform, and data engineering together around measurable operations.',
    card: {
      eyebrow: 'Platform Expertise',
      mark: { type: 'logo', src: '/images/Solution-Partners/azure.png', alt: 'Microsoft Azure', w: 120, h: 34 },
      title: 'Microsoft Azure Cloud Solutions',
      desc: 'Azure, Microsoft 365, Dynamics 365, Power Platform, data engineering, and AI connected around business workflows.',
      tags: ['Azure', 'Dynamics 365', 'Power Platform'],
    },
    cta: { label: 'Explore Microsoft expertise', href: '/partners' },
  },
  {
    headline: ['People thrive here.', 'Teams move as one.'],
    body: 'ACI is a place where people feel valued, supported, and happy to do their best work. Across teams and regions, we collaborate openly, celebrate one another, and move forward together.',
    card: {
      eyebrow: 'Life at ACI',
      mark: { type: 'badge', src: '/images/certifications-awards/best-place-to-work.webp', alt: 'Great Place to Work Certified', w: 72, h: 96 },
      title: 'A culture built on belonging.',
      desc: 'A cohesive, welcoming environment where people enjoy the work, grow with one another, and share in every success.',
      tags: ['Belonging', 'Team spirit', 'Shared success'],
    },
    cta: { label: 'Explore careers', href: '/careers' },
  },
];

function Mark({ mark }: { mark: Mark }) {
  if (mark.type === 'label') {
    return (
      <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">
        {mark.value}
      </span>
    );
  }
  if (mark.type === 'badge') {
    return <Image src={mark.src} alt={mark.alt} width={mark.w} height={mark.h} className="h-auto w-[56px]" />;
  }
  // logo — rendered mono-white to sit on the dark card
  return (
    <Image
      src={mark.src}
      alt={mark.alt}
      width={mark.w}
      height={mark.h}
      className="h-auto w-[112px] object-contain opacity-90"
      style={{ filter: 'brightness(0) invert(1)' }}
    />
  );
}

function Card({ card, headingClass }: { card: Message['card']; headingClass: string }) {
  return (
    <div className="max-w-2xl rounded-xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-md sm:p-6">
      <div className="flex items-start gap-5">
        <div className="flex w-24 shrink-0 items-center justify-start pt-1 sm:w-28">
          <Mark mark={card.mark} />
        </div>
        <div className="min-w-0 flex-1 border-l border-white/10 pl-5 sm:pl-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-sky-400">
            {card.eyebrow}
          </p>
          <h3 className={`mt-1.5 text-lg font-semibold leading-snug text-white ${headingClass}`}>
            {card.title}
          </h3>

          {card.stat ? (
            <div className="mt-3 flex items-center gap-5">
              <div className="shrink-0">
                <div className={`text-4xl font-bold leading-none text-white ${headingClass}`}>
                  {card.stat.value}
                </div>
                <div className="mt-1 max-w-[120px] text-[10px] font-medium uppercase tracking-wide text-white/45">
                  {card.stat.label}
                </div>
              </div>
              <p className="text-sm leading-relaxed text-white/60">{card.desc}</p>
            </div>
          ) : (
            <p className="mt-2 text-sm leading-relaxed text-white/60">{card.desc}</p>
          )}

          <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-white/40">
            {card.tags.map((t) => (
              <span key={t}>
                <span className="text-white/25">/</span> {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HeroDeck({ headingClass }: { headingClass: string }) {
  const [i, setI] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return;
    const t = setInterval(() => setI((n) => (n + 1) % MESSAGES.length), 7000);
    return () => clearInterval(t);
  }, [reduce]);

  const m = MESSAGES[i];

  return (
    <div className="hero-deck relative min-h-[100dvh] overflow-hidden bg-black text-white">
      {/* Background video, playing out under a heavy scrim */}
      <FadingVideo src={VIDEO_1} className="absolute inset-0 h-full w-full object-cover" offsetY={17} />
      <div className="absolute inset-0 bg-gradient-to-r from-black/92 via-black/78 to-black/45" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/20" />

      {/* Foreground */}
      <div className="relative z-10 flex min-h-[100dvh] flex-col">
        <AciNav />

        <div className="flex flex-1 items-center">
          <div className="mx-auto w-full max-w-6xl px-6 md:px-10 lg:px-12">
            <AnimatePresence mode="wait">
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -18 }}
                transition={{ duration: 0.6, ease: EASE }}
                className="max-w-3xl"
              >
                <h1 className={`hero-headline text-[2.6rem] font-bold leading-[1.02] tracking-tight sm:text-6xl lg:text-[4.25rem] ${headingClass}`}>
                  {m.headline[0]}
                  <br />
                  {m.headline[1]}
                </h1>

                <p className="mt-5 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg">
                  {m.body}
                </p>

                <div className="mt-8">
                  <Card card={m.card} headingClass={headingClass} />
                </div>

                <div className="mt-8">
                  <Link
                    href={m.cta.href}
                    className="group inline-flex items-center gap-2.5 rounded-lg bg-[#1e5eff] px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#1e5eff]/20 transition-colors hover:bg-[#1a52e0]"
                  >
                    {m.cta.label}
                    <ArrowRight size={18} className="transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Message indicator */}
        <div className="relative z-20 mx-auto w-full max-w-6xl px-6 pb-8 md:px-10 lg:px-12">
          <div className="flex gap-2">
            {MESSAGES.map((_, n) => (
              <button
                key={n}
                onClick={() => setI(n)}
                aria-label={`Message ${n + 1}`}
                className="h-1.5 rounded-full transition-all"
                style={{
                  width: n === i ? 30 : 12,
                  background: n === i ? '#fff' : 'rgba(255,255,255,0.3)',
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
