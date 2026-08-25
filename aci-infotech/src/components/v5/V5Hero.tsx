'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, Play } from 'lucide-react';
import V5Nav from './V5Nav';
import { useCountUp } from './reveal';

// v5 hero: one full-viewport office scene, copy rotating over it. The
// slides carry the same four stories as the v4 EditorialHero; only the
// stage changed. The accent phrase gets a filled highlight box that
// wipes in after its line lands.
//
// Footage: drop the graded office loop at public/videos/office-hero.webm
// and .mp4 (15-25s, ~1080p, under ~6MB, no audio). Until those files
// exist the painted scene below stands in; the <video> hides itself on
// error so a missing file never shows a broken player.

const VIDEO = '/videos/office-hero.mp4';
const VIDEO_WEBM = '/videos/office-hero.webm';
const ACCENT = '#1D4ED8';
const LIME = '#84CC16';
const EASE = [0.22, 1, 0.36, 1] as const;
const ROTATE_MS = 7000;

type Slide = {
  eyebrow: string;
  eyebrowLogo?: { src: string; w: number; h: number };
  /** Two headline lines; the *marked* phrase renders in the filled
   *  highlight box. */
  headline: [string, string];
  desc: string;
  tags: string[];
  cta: { label: string; href: string };
  mark?: { src: string; alt: string };
  stat?: { value: string; label: string };
};

const SLIDES: Slide[] = [
  {
    eyebrow: 'Service Foundation',
    headline: ['Build the AI foundation.', 'Run it *in production.*'],
    desc: 'ACI Infotech engineers the data foundation, builds the AI on top, and runs it in production. Most enterprise AI stalls before it gets there.',
    tags: ['Pipelines', 'Governance', 'AI-ready data'],
    cta: { label: 'Explore data engineering', href: '/services/data-engineering' },
  },
  {
    eyebrow: 'Case Study',
    headline: ['From Lakehouse', 'to *Live AI.*'],
    desc: 'Lakehouse modernization, Delta pipelines, MLflow, governance, and real-time analytics for teams that need Databricks to run in production.',
    tags: ['Delta Lake', 'MLflow', 'Workflows'],
    cta: { label: 'Read the case study', href: '/case-studies' },
    mark: { src: '/brand/databricks-color.svg', alt: 'Databricks' },
    stat: { value: '87%', label: 'Reduction in data processing time' },
  },
  {
    eyebrow: 'Platform Expertise',
    headline: ['The Whole Microsoft Stack.', '*AI-Led.*'],
    desc: 'Azure is strongest when it connects to the business stack. We bring Azure, Dynamics 365, Power Platform, and data engineering together around measurable operations.',
    tags: ['Azure', 'Dynamics 365', 'Power Platform'],
    cta: { label: 'Explore Microsoft expertise', href: '/partners' },
    mark: { src: '/images/Solution-Partners/azure.png', alt: 'Microsoft Azure' },
  },
  {
    eyebrow: 'ArqAI Labs',
    eyebrowLogo: { src: '/images/ArqAI-Labs-Logo-light.png', w: 2439, h: 858 },
    headline: ['Forward Deployed AI', 'Engineering *At Scale.*'],
    desc: 'Engineers embedded in the problem, not advising from outside. Delivered with our strategic partner ArqAI, whose accelerators come from years of doing this work.',
    tags: ['Forward-deployed', 'Accelerators', 'Production AI'],
    cta: { label: 'Explore ArqAI Labs', href: 'https://thearq.ai' },
  },
];

/** Headline line with the *marked* phrase in a filled box that wipes
 *  in left-to-right after the line itself has landed. */
function HighlightLine({ line, lineIndex }: { line: string; lineIndex: number }) {
  const reduce = useReducedMotion();
  return (
    <>
      {line.split(/\*([^*]+)\*/g).map((part, idx) =>
        idx % 2 === 1 ? (
          <span key={idx} className="relative inline-block whitespace-nowrap px-3 py-0 md:px-5">
            <motion.span
              aria-hidden="true"
              className="absolute inset-0 origin-left rounded-lg"
              style={{ background: ACCENT }}
              initial={reduce ? { scaleX: 1 } : { scaleX: 0 }}
              animate={{ scaleX: 1, transition: { delay: 0.85 + lineIndex * 0.12, duration: 0.45, ease: EASE } }}
            />
            <span className="relative">{part}</span>
          </span>
        ) : (
          <span key={idx}>{part}</span>
        ),
      )}
    </>
  );
}

function ArrowLink({ href, children }: { href: string; children: React.ReactNode }) {
  const inner = (
    <>
      <span className="relative">
        {children}
        <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-current transition-transform duration-300 ease-out group-hover:scale-x-100" />
      </span>
      <ArrowUpRight size={18} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
    </>
  );
  if (href.startsWith('http')) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-1.5 text-base font-semibold text-white sm:text-lg">
        {inner}
      </a>
    );
  }
  return (
    <Link href={href} className="group inline-flex items-center gap-1.5 text-base font-semibold text-white sm:text-lg">
      {inner}
    </Link>
  );
}

/** Painted office-at-dusk stand-in, shown under (and until) the real
 *  footage. Warm desk-lamp and cool monitor bokeh over a blue-graded
 *  gradient, matching the approved design sample. */
function PaintedScene() {
  return (
    <div aria-hidden="true" className="absolute inset-0" style={{ background: 'linear-gradient(105deg, #0a0f16 0%, #0f1826 40%, #16233a 72%, #20304c 100%)' }}>
      <div className="absolute -right-32 -top-40 h-[620px] w-[760px]" style={{ background: 'radial-gradient(closest-side, rgba(96,144,210,0.34), rgba(96,144,210,0) 70%)', filter: 'blur(10px)' }} />
      <div className="absolute right-[16%] top-[26%] h-24 w-24 rounded-full" style={{ background: 'rgba(226,178,110,0.3)', filter: 'blur(22px)' }} />
      <div className="absolute right-[34%] top-[42%] h-14 w-14 rounded-full" style={{ background: 'rgba(150,190,240,0.28)', filter: 'blur(16px)' }} />
      <div className="absolute right-[8%] top-[52%] h-[70px] w-[70px] rounded-full" style={{ background: 'rgba(226,178,110,0.22)', filter: 'blur(20px)' }} />
      <div className="absolute bottom-24 right-[4%] h-44 w-[420px]" style={{ background: 'linear-gradient(180deg, rgba(20,30,48,0) 0%, rgba(6,10,18,0.85) 80%)', filter: 'blur(6px)' }} />
      <div className="absolute bottom-48 right-[10%] h-24 w-36 rounded-lg" style={{ background: 'rgba(120,160,215,0.13)', boxShadow: '0 0 34px rgba(120,160,215,0.2)', filter: 'blur(2px)' }} />
      <div className="absolute bottom-44 right-[26%] h-20 w-28 rounded-lg" style={{ background: 'rgba(226,178,110,0.1)', filter: 'blur(3px)' }} />
    </div>
  );
}

export default function V5Hero({ headingClass }: { headingClass: string }) {
  const [i, setI] = useState(0);
  const [videoOk, setVideoOk] = useState(true);
  const reduce = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (reduce) return;
    const t = setInterval(() => setI((n) => (n + 1) % SLIDES.length), ROTATE_MS);
    return () => clearInterval(t);
  }, [reduce]);

  const projects = useCountUp(500, true, 1400);
  const since = useCountUp(2006, true, 1400);

  const s = SLIDES[i];

  return (
    <section className="relative min-h-[100dvh] overflow-hidden bg-[#0a0f16] text-white">
      {/* Stage: painted scene under the (optional) office loop. */}
      <PaintedScene />
      {videoOk ? (
        <video
          ref={videoRef}
          muted
          loop
          playsInline
          autoPlay
          preload="metadata"
          aria-hidden="true"
          onError={() => setVideoOk(false)}
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src={VIDEO_WEBM} type="video/webm" />
          <source src={VIDEO} type="video/mp4" />
        </video>
      ) : null}

      {/* Left-heavy scrim + top/bottom veils for copy and rail legibility. */}
      <div aria-hidden="true" className="absolute inset-0" style={{ background: 'linear-gradient(90deg, rgba(4,7,13,0.94) 0%, rgba(4,7,13,0.72) 42%, rgba(4,7,13,0.28) 70%, rgba(4,7,13,0.05) 100%)' }} />
      <div aria-hidden="true" className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(4,7,13,0.45) 0%, rgba(4,7,13,0) 22%, rgba(4,7,13,0) 70%, rgba(4,7,13,0.55) 100%)' }} />

      <V5Nav />

      {/* Copy block: the only thing that rotates. */}
      <div className="relative z-20 flex min-h-[100dvh] flex-col pt-24 md:pt-28">
        <div className="flex flex-1 flex-col justify-center px-5 pb-40 sm:px-8 md:px-12 md:pb-44">
          <AnimatePresence mode="wait">
            <motion.div
              key={i}
              exit={{ opacity: 0, y: -16, transition: { duration: 0.3, ease: EASE } }}
              className="max-w-full md:max-w-[62%]"
            >
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0, transition: { delay: 0.05, duration: 0.5, ease: EASE } }}
                className="mb-6 flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.16em] text-white/85"
              >
                <span className="text-white/40">/</span>
                {s.eyebrowLogo ? (
                  <Image src={s.eyebrowLogo.src} alt={s.eyebrow} width={s.eyebrowLogo.w} height={s.eyebrowLogo.h} className="h-5 w-auto object-contain" />
                ) : (
                  s.eyebrow
                )}
                {s.mark ? (
                  <span className="ml-3 inline-flex items-center gap-2 rounded-full border border-white/20 px-3 py-1 normal-case tracking-normal">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={s.mark.src} alt={s.mark.alt} className="h-4 w-auto object-contain" />
                    {s.stat ? (
                      <span className="text-xs text-white/70">
                        <span className="font-bold text-[#A3E635]">{s.stat.value}</span> {s.stat.label}
                      </span>
                    ) : null}
                  </span>
                ) : null}
              </motion.p>

              <h1
                className={`font-semibold text-white ${headingClass}`}
                style={{ fontSize: 'clamp(2.1rem, 5.4vw, 5rem)', lineHeight: 1.08, letterSpacing: '-0.01em' }}
              >
                {s.headline.map((line, li) => (
                  <span key={li} className="block overflow-hidden pb-1">
                    <motion.span
                      className="block"
                      initial={reduce ? { y: 0 } : { y: '110%' }}
                      animate={{ y: 0, transition: { delay: 0.2 + li * 0.12, duration: 0.7, ease: EASE } }}
                    >
                      <HighlightLine line={line} lineIndex={li} />
                    </motion.span>
                  </span>
                ))}
              </h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0, transition: { delay: 0.5, duration: 0.6, ease: EASE } }}
                className="mt-7 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg"
              >
                {s.desc}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0, transition: { delay: 0.62, duration: 0.6, ease: EASE } }}
                className="mt-5 flex flex-wrap gap-x-5 gap-y-1 text-[13px] font-semibold uppercase tracking-wide text-white/55"
              >
                {s.tags.map((t) => (
                  <span key={t}>
                    <span style={{ color: LIME }}>/</span> {t}
                  </span>
                ))}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0, transition: { delay: 0.72, duration: 0.6, ease: EASE } }}
                className="mt-8"
              >
                <ArrowLink href={s.cta.href}>{s.cta.label}</ArrowLink>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom rail: stats left, pills right. Never rotates. */}
        <div className="absolute inset-x-0 bottom-0 z-20 px-5 pb-9 sm:px-8 md:px-12 md:pb-11">
          <div className="flex items-end justify-between gap-6">
            <div className="flex gap-10 sm:gap-14">
              <div>
                <div className={`text-3xl font-semibold text-white sm:text-4xl ${headingClass}`}>{projects}+</div>
                <div className="mt-1 text-xs text-white/55 sm:text-[13px]">Enterprise projects</div>
              </div>
              <div>
                <div className={`text-3xl font-semibold text-white sm:text-4xl ${headingClass}`}>Since {since}</div>
                <div className="mt-1 text-xs text-white/55 sm:text-[13px]">Engineering in production</div>
              </div>
            </div>
            <div className="flex flex-col items-end gap-4">
              {!videoOk ? (
                <span className="hidden items-center gap-2 rounded-full border border-white/20 px-3.5 py-1.5 text-xs text-white/60 md:inline-flex">
                  <Play size={10} className="fill-white/60 text-white/60" />
                  Office scene loop, footage placeholder
                </span>
              ) : null}
              <div className="flex items-center gap-2">
                {SLIDES.map((_, n) => (
                  <button
                    key={n}
                    onClick={() => setI(n)}
                    aria-label={`Slide ${n + 1}`}
                    className="h-2 rounded-full transition-all"
                    style={{ width: n === i ? 30 : 8, background: n === i ? ACCENT : 'rgba(255,255,255,0.4)' }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Non-active slides, server-rendered for crawlers (the animated
          block only mounts the active slide). */}
      <div hidden>
        {SLIDES.map((sl, idx) =>
          idx === i ? null : (
            <div key={sl.eyebrow}>
              <p>{sl.eyebrow}</p>
              <p>{sl.headline.join(' ').replace(/\*/g, '')}</p>
              <p>{sl.desc}</p>
              {sl.stat ? (
                <p>
                  {sl.stat.value} {sl.stat.label}
                </p>
              ) : null}
            </div>
          ),
        )}
      </div>
    </section>
  );
}
