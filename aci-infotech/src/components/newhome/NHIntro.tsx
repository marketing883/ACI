'use client';

// Company introduction: a light porcelain scene after the dark hero. The
// positioning line lights up word by word as it scrolls through the
// viewport, then the company facts count up beside the global-network
// render. Every number here is one the site already publishes (footer
// stats row, about page).

import { useRef } from 'react';
import Image from 'next/image';
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { CountUp, Eyebrow, Reveal } from './motion';
import { DECK_STATS, FOOTPRINT, MISSION } from './deck-data';

const STATEMENT =
  'ACI Infotech partners with Fortune 1000 companies to turn complex data and AI ambitions into measurable business impact.';

const FACTS = DECK_STATS;

const CERTS = ['ISO 27001:2022', 'CMMI Level 3', 'Great Place to Work Certified', '5 Best Data Analytics Companies to Watch', 'GSA Contract Holder'];

function Word({ word, i, total, progress, still }: { word: string; i: number; total: number; progress: MotionValue<number>; still: boolean }) {
  const start = i / total;
  const opacity = useTransform(progress, [start, start + 1 / total], [0.14, 1]);
  return (
    <motion.span style={{ opacity: still ? 1 : opacity }} className="inline">
      {word}{' '}
    </motion.span>
  );
}

export default function NHIntro({ headingClass }: { headingClass: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 85%', 'end 45%'] });
  const words = STATEMENT.split(' ');
  // Keep the last two words together so the line never ends on a widow.
  const tail = words.splice(-2).join(' ');
  words.push(tail);

  const globe = useRef<HTMLDivElement>(null);
  const { scrollYProgress: gp } = useScroll({ target: globe, offset: ['start end', 'end start'] });
  const globeY = useTransform(gp, [0, 1], ['-8%', '8%']);
  const globeScale = useTransform(gp, [0, 0.5, 1], [1.12, 1.02, 1.1]);

  return (
    <section id="about" className="relative overflow-hidden bg-[#f4f6fb] py-28 text-[#0a1024] md:py-40">
      {/* soft cobalt wash in the corner */}
      <div aria-hidden="true" className="pointer-events-none absolute -right-40 -top-40 h-[600px] w-[600px] rounded-full bg-[#3b82f6]/15 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-6">
        <Eyebrow tone="light">Who we are</Eyebrow>
        <div ref={ref} className="relative mt-8">
          <p className={`max-w-5xl text-[clamp(1.9rem,4.4vw,3.9rem)] font-medium leading-[1.08] tracking-[-0.025em] ${headingClass}`}>
            {words.map((w, i) => (
              <Word key={i} word={w} i={i} total={words.length} progress={scrollYProgress} still={!!reduce} />
            ))}
          </p>
        </div>

        <div className="mt-20 grid items-center gap-12 lg:mt-28 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          <Reveal>
            <div ref={globe} className="relative aspect-[16/11] overflow-hidden rounded-[28px] bg-[#05070d] shadow-[0_40px_120px_-40px_rgba(10,16,36,0.55)]">
              <motion.div style={{ y: globeY, scale: globeScale }} className="absolute inset-0">
                <Image
                  src="/images/new-home/global-network.jpg"
                  alt="A glass globe with light arcs linking ACI delivery hubs across the Americas, Europe, the Middle East, and India"
                  fill
                  sizes="(min-width: 1024px) 55vw, 100vw"
                  className="object-cover object-[65%_50%]"
                />
              </motion.div>
              <div className="absolute inset-0 bg-gradient-to-r from-[#05070d]/85 via-[#05070d]/25 to-transparent" />
              <div className="absolute bottom-0 left-0 p-7 text-white md:p-9">
                <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/55">Headquarters</div>
                <div className={`mt-1 text-2xl font-semibold ${headingClass}`}>New Jersey, USA</div>
                <div className="mt-1 text-sm text-white/60">1,200+ engineers across 11 global delivery&nbsp;hubs</div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {['Americas', 'EMEA', 'India'].map((r) => (
                    <span key={r} className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs text-white/85 backdrop-blur-md">
                      {r}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>

          <div>
            <Reveal>
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#1d4ed8]">Mission and values</div>
                  <p className="mt-2 text-[15px] leading-relaxed text-[#0a1024]/70">{MISSION}</p>
                </div>
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#1d4ed8]">Global footprint</div>
                  <p className="mt-2 text-[15px] leading-relaxed text-[#0a1024]/70">{FOOTPRINT}</p>
                </div>
              </div>
            </Reveal>
            <dl className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-[#0a1024]/10 bg-[#0a1024]/10">
              {FACTS.map((f, i) => (
                <Reveal key={f.label} delay={i * 0.08} className="bg-white p-6 md:p-7">
                  <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-[#0a1024]/50">{f.label}</dt>
                  <dd className={`mt-2 text-4xl font-semibold tracking-tight text-[#0a1024] md:text-5xl ${headingClass}`}>
                    <CountUp value={f.value} />
                  </dd>
                  <dd className="mt-2 text-sm text-[#0a1024]/55">{f.note}</dd>
                </Reveal>
              ))}
            </dl>
            <Reveal delay={0.2}>
              <ul className="mt-6 flex flex-wrap gap-2" aria-label="Certifications">
                {CERTS.map((c) => (
                  <li key={c} className="rounded-full border border-[#0a1024]/10 bg-white px-3.5 py-1.5 text-xs font-medium text-[#0a1024]/70">
                    {c}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
