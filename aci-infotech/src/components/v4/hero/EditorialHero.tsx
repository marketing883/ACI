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
    mark: { kind: 'logo', src: '/images/Solution-Partners/databricks.png', alt: 'Databricks', h: 30 },
    stat: { value: '87%', label: 'Reduction in data processing time' },
  },
  {
    eyebrow: 'Platform Expertise',
    headline: ['Microsoft cloud.', 'AI-led operations.'],
    desc: 'Azure, Dynamics 365, and Power Platform, connected around measurable operations.',
    tags: ['Azure', 'Dynamics 365', 'Power Platform'],
    cta: { label: 'Explore Microsoft expertise', href: '/partners' },
    mark: { kind: 'logo', src: '/images/Solution-Partners/azure.png', alt: 'Microsoft Azure', h: 44 },
  },
  {
    eyebrow: 'Life at ACI',
    headline: ['People thrive here.', 'Teams move as one.'],
    desc: 'A place where people feel valued, supported, and free to do their best work.',
    tags: ['Belonging', 'Team spirit', 'Shared success'],
    cta: { label: 'Explore careers', href: '/careers' },
    mark: { kind: 'badge', src: '/images/certifications-awards/best-place-to-work.webp', alt: 'Great Place to Work Certified', w: 64 },
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
    <section className={`relative min-h-[100dvh] overflow-hidden bg-white text-black ${bodyClass}`}>
      {/* Full-bleed video, mirrored so the subject sits on the right */}
      <FadingVideo src={VIDEO} webmSrc={VIDEO_WEBM} mirror className="absolute inset-0 h-full w-full object-cover" />
      {/* keep the left legible for dark text without washing out the video */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(100deg, rgba(255,255,255,0.82) 0%, rgba(255,255,255,0.5) 26%, rgba(255,255,255,0.12) 48%, rgba(255,255,255,0) 66%)',
        }}
      />

      {/* Foreground */}
      <div className="relative z-20 flex min-h-[100dvh] flex-col">
        {/* NAV (transparent) */}
        <nav className="flex items-center justify-between px-5 pt-5 sm:px-8 md:px-12 md:pt-6">
          <motion.div custom={0} variants={fadeDown} initial="hidden" animate="show">
            <Link href="/" aria-label="ACI Infotech home" className="flex items-center">
              <Image src="/aci-infotech-logo.png" alt="ACI Infotech" width={122} height={34} priority />
            </Link>
          </motion.div>

          <div className="hidden items-center gap-9 md:flex">
            {NAV.map((l, n) => (
              <motion.div key={l.href} custom={n + 1} variants={fadeDown} initial="hidden" animate="show">
                <Link
                  href={l.href}
                  className="group relative text-[13px] font-semibold uppercase tracking-widest text-black/70 transition-colors hover:text-black"
                >
                  <span className="relative">
                    {l.label}
                    <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-current transition-transform duration-300 ease-out group-hover:scale-x-100" />
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>

          <motion.div custom={5} variants={fadeDown} initial="hidden" animate="show" className="flex items-center gap-4">
            <ArrowLink
              href="/contact"
              arrowSize={16}
              className="hidden text-[12px] font-semibold uppercase tracking-widest text-black sm:inline-flex"
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

        {/* CONTENT (left) */}
        <div className="flex flex-1 flex-col justify-end px-5 pb-10 sm:px-8 md:px-12 md:pb-14">
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
                  className="mb-6 flex items-center gap-5"
                >
                  {s.mark.kind === 'badge' ? (
                    <Image src={s.mark.src} alt={s.mark.alt} width={s.mark.w} height={86} className="h-16 w-auto" />
                  ) : (
                    <Image
                      src={s.mark.src}
                      alt={s.mark.alt}
                      width={146}
                      height={77}
                      className="w-auto object-contain"
                      style={{ height: `${s.mark.h}px` }}
                    />
                  )}
                  {s.stat ? (
                    <>
                      <span className="h-9 w-px bg-black/15" />
                      <div className="flex items-baseline gap-2.5">
                        <span className={`text-4xl font-bold leading-none ${headingClass}`} style={{ color: ACCENT }}>
                          {s.stat.value}
                        </span>
                        <span className="max-w-[130px] text-[10px] font-semibold uppercase leading-tight tracking-wide text-black/50">
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
                className="mb-5 text-[11px] font-semibold uppercase tracking-[0.22em] sm:text-xs"
                style={{ color: ACCENT }}
              >
                <span className="text-black/35">/ </span>
                {s.eyebrow}
              </motion.p>

              <h1
                className={`font-semibold uppercase text-black ${headingClass}`}
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
                    className="text-[11px] font-semibold uppercase leading-relaxed tracking-widest text-black/55 sm:text-xs"
                  >
                    {s.desc}
                  </motion.p>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0, transition: { delay: 0.62, duration: 0.6, ease: EASE } }}
                    className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[10px] font-semibold uppercase tracking-widest text-black/40"
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
                    className="whitespace-nowrap text-base font-semibold uppercase tracking-widest sm:text-lg"
                    style={{ color: ACCENT }}
                  >
                    {s.cta.label}
                  </ArrowLink>
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
              <Image src="/aci-infotech-logo.png" alt="ACI Infotech" width={122} height={34} />
              <button
                onClick={() => setMenu(false)}
                aria-label="Close menu"
                className="flex h-9 w-9 items-center justify-center"
              >
                <X size={22} className="text-black" />
              </button>
            </div>
            <div className="mt-16 flex flex-col gap-8">
              {NAV.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setMenu(false)}
                  className="text-3xl font-semibold uppercase tracking-widest text-black"
                >
                  {l.label}
                </Link>
              ))}
            </div>
            <ArrowLink
              href="/contact"
              onClick={() => setMenu(false)}
              arrowSize={22}
              className="mt-auto text-xl font-semibold uppercase tracking-widest"
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
