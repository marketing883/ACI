'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence, useReducedMotion, type Variants } from 'framer-motion';
import { ArrowUpRight, X } from 'lucide-react';
import FadingVideo from './FadingVideo';
import HeroMegaNav from './HeroMegaNav';

const VIDEO = '/videos/v4-editorial.mp4';
const VIDEO_WEBM = '/videos/v4-editorial.webm';
const ACCENT = '#5E0ED7';
const EASE = [0.22, 1, 0.36, 1] as const;

const MOBILE_NAV = [
  { label: 'Services', href: '/services' },
  { label: 'Platforms', href: '/platforms' },
  { label: 'Industries', href: '/industries' },
  { label: 'Resources', href: '/playbooks' },
  { label: 'Company', href: '/about' },
];

type Mark =
  | { kind: 'logo'; src: string; alt: string; h: number }
  | { kind: 'badge'; src: string; alt: string; w: number };

type Slide = {
  eyebrow: string;
  headline: [string, string];
  desc: string;
  tags: string[];
  cta: { label: string; href: string };
  mark?: Mark;
  stat?: { value: string; label: string };
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
    mark: { kind: 'logo', src: '/images/Solution-Partners/databricks.png', alt: 'Databricks', h: 40 },
    stat: { value: '87%', label: 'Reduction in data processing time' },
  },
  {
    eyebrow: 'Platform Expertise',
    headline: ['Microsoft cloud.', 'AI-led operations.'],
    desc: 'Azure, Dynamics 365, and Power Platform, connected around measurable operations.',
    tags: ['Azure', 'Dynamics 365', 'Power Platform'],
    cta: { label: 'Explore Microsoft expertise', href: '/partners' },
    mark: { kind: 'logo', src: '/images/Solution-Partners/azure.png', alt: 'Microsoft Azure', h: 56 },
  },
  {
    eyebrow: 'Life at ACI',
    headline: ['People thrive here.', 'Teams move as one.'],
    desc: 'A place where people feel valued, supported, and free to do their best work.',
    tags: ['Belonging', 'Team spirit', 'Shared success'],
    cta: { label: 'Explore careers', href: '/careers' },
    mark: { kind: 'badge', src: '/images/certifications-awards/best-place-to-work.webp', alt: 'Great Place to Work Certified', w: 80 },
  },
];

const fadeDown: Variants = {
  hidden: { opacity: 0, y: -20 },
  show: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5, ease: EASE } }),
};

/** Text link with a growing underline + arrow nudge on hover. */
function ArrowLink({
  href,
  children,
  className,
  style,
  arrowSize = 20,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  arrowSize?: number;
  onClick?: () => void;
}) {
  return (
    <Link href={href} onClick={onClick} className={`group inline-flex items-center gap-1.5 ${className ?? ''}`} style={style}>
      <span className="relative">
        {children}
        <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-current transition-transform duration-300 ease-out group-hover:scale-x-100" />
      </span>
      <ArrowUpRight size={arrowSize} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
    </Link>
  );
}

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
    <section className={`relative min-h-[100dvh] overflow-hidden bg-[#f3f3f3] text-black ${bodyClass}`}>
      {/* Reduced, vertically-centered video sitting on the right */}
      <div className="pointer-events-none absolute right-0 top-[15%] h-[40%] w-[82%] sm:w-[64%] md:top-1/2 md:h-[66%] md:w-[50%] md:-translate-y-1/2">
        <FadingVideo src={VIDEO} webmSrc={VIDEO_WEBM} mirror className="absolute inset-0 h-full w-full object-contain" />
      </div>

      {/* Foreground */}
      <div className="relative z-20 flex min-h-[100dvh] flex-col">
        {/* NAV (transparent) */}
        <nav className="relative flex items-center justify-between px-5 pt-5 sm:px-8 md:px-12 md:pt-6">
          <motion.div custom={0} variants={fadeDown} initial="hidden" animate="show">
            <Link href="/" aria-label="ACI Infotech home" className="flex items-center">
              <Image src="/aci-infotech-logo.png" alt="ACI Infotech" width={200} height={64} priority className="h-12 w-auto md:h-14" />
            </Link>
          </motion.div>

          <motion.div custom={2} variants={fadeDown} initial="hidden" animate="show">
            <HeroMegaNav headingClass={headingClass} />
          </motion.div>

          <motion.div custom={5} variants={fadeDown} initial="hidden" animate="show" className="flex items-center gap-4">
            <ArrowLink
              href="/contact"
              arrowSize={16}
              className="hidden text-sm font-semibold capitalize tracking-wide text-black sm:inline-flex"
            >
              Start a project
            </ArrowLink>
            <button
              onClick={() => setMenu(true)}
              aria-label="Open menu"
              className="flex h-9 w-9 flex-col items-center justify-center gap-1 md:hidden"
            >
              <span className="h-0.5 w-5 bg-black" />
              <span className="h-0.5 w-5 bg-black" />
              <span className="h-0.5 w-5 bg-black" />
            </button>
          </motion.div>
        </nav>

        {/* CONTENT (left) — vertically centered */}
        <div className="flex flex-1 flex-col justify-center px-5 sm:px-8 md:px-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={i}
              exit={{ opacity: 0, y: -16, transition: { duration: 0.3, ease: EASE } }}
              className="max-w-full md:max-w-[58%]"
            >
              {/* brand mark / credential */}
              {s.mark ? (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } }}
                  className="mb-7 flex items-center gap-6"
                >
                  {s.mark.kind === 'badge' ? (
                    <Image src={s.mark.src} alt={s.mark.alt} width={s.mark.w} height={108} className="h-20 w-auto" />
                  ) : (
                    <Image
                      src={s.mark.src}
                      alt={s.mark.alt}
                      width={200}
                      height={106}
                      className="w-auto object-contain"
                      style={{ height: `${s.mark.h}px` }}
                    />
                  )}
                  {s.stat ? (
                    <>
                      <span className="h-12 w-px bg-black/15" />
                      <div className="flex items-baseline gap-3">
                        <span className={`text-5xl font-bold leading-none ${headingClass}`} style={{ color: ACCENT }}>
                          {s.stat.value}
                        </span>
                        <span className="max-w-[150px] text-[12px] font-semibold uppercase leading-tight tracking-wide text-black/55">
                          {s.stat.label}
                        </span>
                      </div>
                    </>
                  ) : null}
                </motion.div>
              ) : null}

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0, transition: { delay: 0.05, duration: 0.5, ease: EASE } }}
                className="mb-5 text-sm font-semibold capitalize tracking-[0.18em] sm:text-[15px]"
                style={{ color: ACCENT }}
              >
                <span className="text-black/35">/ </span>
                {s.eyebrow}
              </motion.p>

              <h1
                className={`font-semibold capitalize text-black ${headingClass}`}
                style={{ fontSize: 'clamp(2.2rem, 4.9vw, 4.4rem)', lineHeight: 1.0, letterSpacing: '-0.015em' }}
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
                    className="text-base font-medium leading-relaxed tracking-wide text-black/60 sm:text-lg"
                  >
                    {s.desc}
                  </motion.p>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0, transition: { delay: 0.62, duration: 0.6, ease: EASE } }}
                    className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-sm font-semibold capitalize tracking-wide text-black/45"
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
                  <ArrowLink
                    href={s.cta.href}
                    className="whitespace-nowrap text-xl font-semibold capitalize tracking-wide sm:text-2xl"
                    style={{ color: ACCENT }}
                  >
                    {s.cta.label}
                  </ArrowLink>
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* rotation indicator pinned to the bottom */}
        <div className="px-5 pb-10 sm:px-8 md:px-12 md:pb-12">
          <div className="flex gap-2">
            {SLIDES.map((_, n) => (
              <button
                key={n}
                onClick={() => setI(n)}
                aria-label={`Slide ${n + 1}`}
                className="h-1.5 rounded-full transition-all"
                style={{
                  width: n === i ? 30 : 12,
                  background: n === i ? ACCENT : 'rgba(0,0,0,0.2)',
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
            className={`fixed inset-0 z-50 flex flex-col bg-white px-6 py-5 text-black ${bodyClass}`}
          >
            <div className="flex items-center justify-between">
              <Image src="/aci-infotech-logo.png" alt="ACI Infotech" width={150} height={42} className="h-10 w-auto" />
              <button
                onClick={() => setMenu(false)}
                aria-label="Close menu"
                className="flex h-9 w-9 items-center justify-center"
              >
                <X size={22} className="text-black" />
              </button>
            </div>
            <div className="mt-14 flex flex-col gap-7">
              {MOBILE_NAV.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setMenu(false)}
                  className="text-3xl font-semibold capitalize tracking-wide text-black"
                >
                  {l.label}
                </Link>
              ))}
              <a
                href="https://thearq.ai"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMenu(false)}
                className="inline-flex items-center gap-2 text-3xl font-semibold capitalize tracking-wide"
                style={{ color: ACCENT }}
              >
                ArqAI Labs
                <ArrowUpRight size={26} />
              </a>
            </div>
            <ArrowLink
              href="/contact"
              onClick={() => setMenu(false)}
              arrowSize={22}
              className="mt-auto text-xl font-semibold capitalize tracking-wide"
              style={{ color: ACCENT }}
            >
              Start a project
            </ArrowLink>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}
