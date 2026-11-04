'use client';

// Accelerator portfolio: the 11 modernization offers as migration paths on
// a bright porcelain scene with Magnific glass ribbons. Each path is a
// from-pill and a to-pill joined by a track that a beam of light runs
// along once the row scrolls in, and again on hover; hovering also opens
// the accelerator's one-line description. The intro column stays put on
// desktop while the paths scroll past it.

import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { CountUp, Eyebrow, MagneticLink, Reveal } from './motion';
import { ACCELERATORS, INNOVATION } from './deck-data';
import { EASE } from './tokens';

export default function NHAccelerators({ headingClass }: { headingClass: string }) {
  const reduce = useReducedMotion();
  return (
    <section id="accelerators" className="relative bg-[#f4f6fb] py-28 text-[#0a1024] md:py-36">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-90">
        <Image src="/images/new-home/accelerators-ribbon.jpg" alt="" fill sizes="100vw" className="object-cover object-right" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#f4f6fb] via-[#f4f6fb]/85 to-[#f4f6fb]/30" />
      </div>

      <div className="relative mx-auto grid max-w-7xl gap-14 px-6 lg:grid-cols-[0.85fr_1.35fr]">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <Eyebrow tone="light">Key solutions and accelerators</Eyebrow>
          <h2 className={`[color:inherit] mt-6 text-[clamp(2.4rem,4.8vw,4.4rem)] font-semibold leading-[1.02] tracking-[-0.035em] ${headingClass}`}>
            <span className="nh-accent-ink">11</span> modernization offers, ready to&nbsp;run.
          </h2>
          <Reveal>
            <p className="mt-6 max-w-md text-base leading-relaxed text-[#0a1024]/65">{INNOVATION}</p>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-[#0a1024]/55">
              Legacy reporting and analytics estates move onto modern, governed platforms with the logic, layouts,
              and calculations preserved.
            </p>
            <div className="mt-8">
              <MagneticLink href="/contact" variant="light">
                Talk to an architect
              </MagneticLink>
            </div>
          </Reveal>
        </div>

        <ol className="space-y-3">
          {ACCELERATORS.map((a, i) => (
            <motion.li
              key={`${a.from}-${a.to}`}
              initial={reduce ? false : { opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '0px 0px -8% 0px' }}
              transition={{ duration: 0.8, ease: EASE, delay: (i % 3) * 0.06 }}
              className="group rounded-2xl border border-[#0a1024]/8 bg-white/80 p-4 shadow-[0_1px_0_rgba(10,16,36,0.04)] backdrop-blur-md transition-all duration-500 hover:-translate-y-0.5 hover:border-[#1d4ed8]/30 hover:bg-white hover:shadow-[0_24px_60px_-30px_rgba(29,78,216,0.45)] md:p-5"
            >
              <div className="flex items-center gap-3 md:gap-4">
                <span className="w-[6.5rem] shrink-0 rounded-full border border-[#0a1024]/12 bg-[#f4f6fb] px-3 py-1.5 text-center text-xs font-semibold text-[#0a1024]/70 sm:w-32 sm:text-sm">
                  {a.from}
                </span>
                {/* migration track with a travelling beam */}
                <span className="relative h-px flex-1 bg-[#0a1024]/12">
                  <motion.span
                    className="absolute -top-[1.5px] h-1 w-16 rounded-full bg-gradient-to-r from-transparent via-[#3b82f6] to-[#22d3ee] shadow-[0_0_12px_#3b82f6]"
                    initial={reduce ? false : { left: '-10%', opacity: 0 }}
                    whileInView={reduce ? undefined : { left: ['-10%', '100%'], opacity: [0, 1, 0] }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.6, ease: 'easeInOut', delay: 0.3 + (i % 4) * 0.15 }}
                  />
                  <span className="absolute -top-[1.5px] left-0 h-1 w-16 -translate-x-full rounded-full bg-gradient-to-r from-transparent via-[#3b82f6] to-[#22d3ee] opacity-0 shadow-[0_0_12px_#3b82f6] group-hover:animate-[nh-beam_1.2s_ease-in-out]" />
                  <ArrowUpRight size={14} className="absolute -right-1 -top-[7px] rotate-45 text-[#0a1024]/35 transition-colors group-hover:text-[#1d4ed8]" />
                </span>
                <span className="w-[6.5rem] shrink-0 rounded-full bg-[#0a1024] px-3 py-1.5 text-center text-xs font-semibold text-white transition-colors duration-500 group-hover:bg-[#1d4ed8] sm:w-32 sm:text-sm">
                  {a.to}
                </span>
                <span className={`w-16 shrink-0 text-right text-xl font-semibold tabular-nums text-[#1d4ed8] md:text-2xl ${headingClass}`}>
                  ↑<CountUp value={a.gain} />
                </span>
              </div>
              <p className="grid grid-rows-[0fr] text-sm leading-relaxed text-[#0a1024]/60 transition-all duration-500 group-hover:grid-rows-[1fr] group-hover:pt-3 max-lg:grid-rows-[1fr] max-lg:pt-3">
                <span className="overflow-hidden">{a.desc}</span>
              </p>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
