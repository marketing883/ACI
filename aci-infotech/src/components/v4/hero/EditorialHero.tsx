'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence, useReducedMotion, type Variants } from 'framer-motion';
import { ArrowUpRight, X } from 'lucide-react';
import FadingVideo from './FadingVideo';

const VIDEO = '/videos/v4-editorial.mp4';
const VIDEO_WEBM = '/videos/v4-editorial.webm';
const ACCENT = '#5E0ED7';
const EASE = [0.22, 1, 0.36, 1] as const;

const NAV = [
  { label: 'Services', href: '/services' },
  { label: 'Case Studies', href: '/case-studies' },
  { label: 'Blog', href: '/blogs' },
  { label: 'About', href: '/about' },
];

type Slide = {
  eyebrow: string;
  headline: [string, string];
  desc: string;
  tags: string[];
  cta: { label: string; href: string };
};

const SLIDES: Slide[] = [
  {
    eyebrow: 'Service Foundation',
    headline: ['Build the AI', 'foundation.'],
    desc: 'We engineer the data foundation, build the AI on top, and run it in production.',
    tags: ['Pipelines', 'Governance', 'AI-ready data'],
    cta: { label: 'Explore data engineering', href: '/services/data-engineering' },
  },
  {
    eyebrow: 'Case Study',
    headline: ['Databricks depth.', 'Production AI.'],
    desc: 'Lakehouse modernization, Delta pipelines, MLflow, governance, and real-time analytics.',
    tags: ['Delta Lake', 'MLflow', 'Workflows'],
    cta: { label: 'Read the case study', href: '/case-studies' },
  },
  {
    eyebrow: 'Platform Expertise',
    headline: ['Microsoft cloud.', 'AI-led operations.'],
    desc: 'Azure, Dynamics 365, and Power Platform, connected around measurable operations.',
    tags: ['Azure', 'Dynamics 365', 'Power Platform'],
    cta: { label: 'Explore Microsoft expertise', href: '/partners' },
  },
  {
    eyebrow: 'Life at ACI',
    headline: ['People thrive here.', 'Teams move as one.'],
    desc: 'A place where people feel valued, supported, and free to do their best work.',
    tags: ['Belonging', 'Team spirit', 'Shared success'],
    cta: { label: 'Explore careers', href: '/careers' },
  },
];

const fadeDown: Variants = {
  hidden: { opacity: 0, y: -20 },
  show: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5, ease: EASE } }),
};

export default function EditorialHero({
  headingClass,
  bodyClass,
}: {
  headingClass: string;
  bodyClass: string;
}) {
  const [i, setI] = useState(0);
  const [menu, setMenu] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return;
    const t = setInterval(() => setI((n) => (n + 1) % SLIDES.length), 7000);
    return () => clearInterval(t);
  }, [reduce]);

  const s = SLIDES[i];

  return (
    <section className={`relative min-h-[100dvh] overflow-hidden bg-black text-white ${bodyClass}`}>
      {/* Video on the right; full-bleed with a dark scrim on mobile */}
      <div className="absolute inset-0 md:left-[58%]">
        <FadingVideo src={VIDEO} webmSrc={VIDEO_WEBM} className="absolute inset-0 h-full w-full object-cover" />
      </div>
      {/* feather the video's left edge into the black content zone (desktop) */}
      <div
        className="absolute inset-0 hidden md:left-[50%] md:block"
        style={{ background: 'linear-gradient(to right, #000 0%, rgba(0,0,0,0.55) 22%, rgba(0,0,0,0) 55%)' }}
      />
      {/* mobile scrim so copy stays legible over the full-bleed video */}
      <div className="absolute inset-0 bg-black/70 md:hidden" />

      {/* Foreground */}
      <div className="relative z-20 flex min-h-[100dvh] flex-col">
        {/* NAV (transparent) */}
        <nav className="flex items-center justify-between px-5 pt-5 sm:px-8 md:px-12 md:pt-6">
          <motion.div custom={0} variants={fadeDown} initial="hidden" animate="show">
            <Link href="/" aria-label="ACI Infotech home" className="flex items-center">
              <Image src="/aci-infotech-logo-white.png" alt="ACI Infotech" width={116} height={32} priority />
            </Link>
          </motion.div>

          <div className="hidden items-center gap-9 md:flex">
            {NAV.map((l, n) => (
              <motion.div key={l.href} custom={n + 1} variants={fadeDown} initial="hidden" animate="show">
                <Link
                  href={l.href}
                  className="text-[13px] font-semibold uppercase tracking-widest text-white/75 transition-colors hover:text-white"
                >
                  {l.label}
                </Link>
              </motion.div>
            ))}
          </div>

          <motion.div custom={5} variants={fadeDown} initial="hidden" animate="show" className="flex items-center gap-4">
            <Link
              href="/contact"
              className="hidden rounded-full border border-white/25 px-5 py-2 text-[12px] font-semibold uppercase tracking-widest text-white transition-colors hover:bg-white hover:text-black sm:inline-block"
            >
              Start a project
            </Link>
            <button
              onClick={() => setMenu(true)}
              aria-label="Open menu"
              className="flex h-9 w-9 flex-col items-center justify-center gap-1 rounded-full bg-white/10 backdrop-blur-sm transition-colors hover:bg-white/20 md:hidden"
            >
              <span className="h-0.5 w-4 bg-white" />
              <span className="h-0.5 w-4 bg-white" />
              <span className="h-0.5 w-4 bg-white" />
            </button>
          </motion.div>
        </nav>

        {/* CONTENT (left) */}
        <div className="flex flex-1 flex-col justify-end px-5 pb-10 sm:px-8 md:px-12 md:pb-14">
          <AnimatePresence mode="wait">
            <motion.div
              key={i}
              exit={{ opacity: 0, y: -16, transition: { duration: 0.3, ease: EASE } }}
              className="max-w-full md:max-w-[56%]"
            >
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0, transition: { delay: 0.05, duration: 0.5, ease: EASE } }}
                className="mb-5 text-[11px] font-semibold uppercase tracking-[0.22em] sm:text-xs"
                style={{ color: ACCENT }}
              >
                <span className="text-white/40">/ </span>
                {s.eyebrow}
              </motion.p>

              <h1
                className={`font-semibold uppercase text-white ${headingClass}`}
                style={{ fontSize: 'clamp(1.9rem, 4.2vw, 3.8rem)', lineHeight: 0.98, letterSpacing: '-0.01em' }}
              >
                {s.headline.map((line, li) => (
                  <span key={li} className="block overflow-hidden">
                    <motion.span
                      className="block"
                      initial={{ y: '110%' }}
                      animate={{ y: 0, transition: { delay: 0.2 + li * 0.12, duration: 0.7, ease: EASE } }}
                    >
                      {line}
                    </motion.span>
                  </span>
                ))}
              </h1>

              <div className="mt-7 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                <div className="max-w-md">
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0, transition: { delay: 0.5, duration: 0.6, ease: EASE } }}
                    className="text-[11px] font-semibold uppercase leading-relaxed tracking-widest text-white/55 sm:text-xs"
                  >
                    {s.desc}
                  </motion.p>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0, transition: { delay: 0.62, duration: 0.6, ease: EASE } }}
                    className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[10px] font-semibold uppercase tracking-widest text-white/35"
                  >
                    {s.tags.map((t) => (
                      <span key={t}>
                        <span style={{ color: ACCENT }}>/</span> {t}
                      </span>
                    ))}
                  </motion.div>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0, transition: { delay: 0.72, duration: 0.6, ease: EASE } }}
                >
                  <Link
                    href={s.cta.href}
                    className="group inline-flex items-center gap-1.5 whitespace-nowrap text-base font-semibold uppercase tracking-widest transition-opacity hover:opacity-80 sm:text-lg"
                    style={{ color: ACCENT }}
                  >
                    {s.cta.label}
                    <ArrowUpRight size={20} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* rotation indicator */}
          <div className="mt-10 flex gap-2">
            {SLIDES.map((_, n) => (
              <button
                key={n}
                onClick={() => setI(n)}
                aria-label={`Slide ${n + 1}`}
                className="h-1.5 rounded-full transition-all"
                style={{
                  width: n === i ? 30 : 12,
                  background: n === i ? ACCENT : 'rgba(255,255,255,0.28)',
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {menu ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={`fixed inset-0 z-50 flex flex-col bg-black px-6 py-5 ${bodyClass}`}
          >
            <div className="flex items-center justify-between">
              <Image src="/aci-infotech-logo-white.png" alt="ACI Infotech" width={116} height={32} />
              <button
                onClick={() => setMenu(false)}
                aria-label="Close menu"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10"
              >
                <X size={18} className="text-white" />
              </button>
            </div>
            <div className="mt-16 flex flex-col gap-8">
              {NAV.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setMenu(false)}
                  className="text-3xl font-semibold uppercase tracking-widest text-white"
                >
                  {l.label}
                </Link>
              ))}
            </div>
            <Link
              href="/contact"
              onClick={() => setMenu(false)}
              className="mt-auto inline-flex items-center gap-1.5 text-xl font-semibold uppercase tracking-widest"
              style={{ color: ACCENT }}
            >
              Start a project
              <ArrowUpRight size={22} />
            </Link>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}
