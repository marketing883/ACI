'use client';

// Data & AI offerings: a horizontal gallery pinned to the viewport. On
// desktop the page's vertical scroll drives the track sideways through an
// intro panel and seven offering panels; each panel's Magnific still is
// unmasked by a widening circle as it nears the centre and tilts toward
// the pointer. Below lg the track becomes a native swipe carousel with
// snap points, which is kinder on touch screens than a scroll hijack.

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from 'framer-motion';
import { ArrowUpRight, Check } from 'lucide-react';
import NetworkField from './NetworkField';
import { Eyebrow, Grain } from './motion';
import { OFFERINGS, type Offering } from './deck-data';

function Panel({ o, i, progress, headingClass }: { o: Offering; i: number; progress?: MotionValue<number>; headingClass: string }) {
  const reduce = useReducedMotion();
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 120, damping: 16 });
  const sry = useSpring(ry, { stiffness: 120, damping: 16 });

  // Circle mask opens as this panel approaches the middle of the track.
  const centre = (i + 1) / (OFFERINGS.length + 1);
  const fallback = useMotionValue(1);
  const p = progress ?? fallback;
  const clip = useTransform(p, [centre - 0.22, centre - 0.04], ['circle(18% at 50% 55%)', 'circle(75% at 50% 55%)']);
  const imgScale = useTransform(p, [centre - 0.22, centre + 0.1], [1.25, 1.02]);

  return (
    <article
      className="nh-btn group relative flex h-full w-[86vw] shrink-0 snap-center flex-col overflow-hidden rounded-[30px] border border-white/10 bg-[#070a14] sm:w-[520px] lg:w-[min(1080px,78vw)] lg:flex-row"
      onMouseMove={(e) => {
        if (reduce) return;
        const r = e.currentTarget.getBoundingClientRect();
        ry.set(((e.clientX - r.left) / r.width - 0.5) * 6);
        rx.set(-((e.clientY - r.top) / r.height - 0.5) * 6);
      }}
      onMouseLeave={() => {
        rx.set(0);
        ry.set(0);
      }}
    >
      <div className="relative h-[44%] shrink-0 overflow-hidden lg:h-full lg:w-[44%]" style={{ perspective: 900 }}>
        <motion.div style={{ clipPath: progress && !reduce ? clip : undefined, rotateX: srx, rotateY: sry }} className="absolute inset-0">
          <motion.div style={{ scale: progress && !reduce ? imgScale : 1 }} className="absolute inset-0">
            <Image src={o.image} alt="" fill sizes="(min-width: 1024px) 40vw, 86vw" className="object-cover" />
          </motion.div>
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#070a14] via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-[#070a14]" />
        <span className={`absolute left-6 top-5 text-[5.5rem] font-semibold leading-none tracking-tighter text-white/10 lg:text-[8rem] ${headingClass}`}>
          0{i + 1}
        </span>
      </div>

      <div className="relative flex flex-1 flex-col p-6 md:p-9">
        <h3 className={`[color:inherit] text-2xl font-semibold leading-tight tracking-[-0.02em] text-white md:text-[2.1rem] ${headingClass}`}>{o.title}</h3>
        <p className="mt-3 max-w-lg text-sm leading-relaxed text-white/65 md:text-base">{o.tagline}</p>

        <div className="mt-6 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#67e8f9]">Service offerings</div>
        <ul className="mt-3 flex flex-wrap gap-2">
          {o.offerings.map((s, k) => (
            <li
              key={s}
              className="rounded-full border border-white/12 bg-white/[0.04] px-3 py-1.5 text-xs text-white/80 transition-all duration-500 group-hover:border-white/25"
              style={{ transitionDelay: `${k * 30}ms` }}
            >
              {s}
            </li>
          ))}
        </ul>

        <div className="mt-6 hidden text-[11px] font-semibold uppercase tracking-[0.2em] text-white/45 sm:block">Value and benefits</div>
        <ul className="mt-3 hidden space-y-2 sm:block">
          {o.value.slice(0, 4).map((v) => (
            <li key={v} className="flex items-start gap-2.5 text-sm text-white/70">
              <Check size={15} className="mt-0.5 shrink-0 text-[#a3e635]" />
              {v}
            </li>
          ))}
        </ul>

        <Link href={o.href} className="nh-btn mt-auto inline-flex w-fit items-center gap-2 pt-6 text-sm font-semibold text-white">
          <span className="relative">
            Explore
            <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-50 bg-current transition-transform duration-500 group-hover:scale-x-100" />
          </span>
          <ArrowUpRight size={15} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </Link>
      </div>
    </article>
  );
}

function Intro({ headingClass }: { headingClass: string }) {
  return (
    <div className="flex w-[86vw] shrink-0 snap-start flex-col justify-center pr-6 sm:w-[460px] lg:w-[34vw] lg:min-w-[420px]">
      <Eyebrow>Data and AI capabilities</Eyebrow>
      <h2 className={`[color:inherit] mt-6 text-[clamp(2.4rem,4.6vw,4.6rem)] font-semibold leading-[1] tracking-[-0.035em] ${headingClass}`}>
        Seven ways we turn data into <span className="nh-accent-gradient">decisions.</span>
      </h2>
      <p className="mt-6 max-w-md text-base leading-relaxed text-white/65">
        From strategy and architecture to models running in production. Every offering is delivered by the
        same engineering&nbsp;team.
      </p>
      <div className="mt-8 hidden items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-white/45 lg:flex">
        <span className="h-px w-10 bg-white/30" /> Scroll to explore
      </div>
    </div>
  );
}

export default function NHOfferings({ headingClass }: { headingClass: string }) {
  const ref = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [distance, setDistance] = useState(0);
  const [desktop, setDesktop] = useState(false);

  useEffect(() => {
    const measure = () => {
      const lg = window.matchMedia('(min-width: 1024px)').matches;
      setDesktop(lg);
      if (track.current) setDistance(Math.max(0, track.current.scrollWidth - window.innerWidth));
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -distance]);
  const bar = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);
  const pinned = desktop && !reduce;

  return (
    <section
      ref={ref}
      id="capabilities"
      className="relative bg-[#05070d] text-white"
      style={{ height: pinned ? `calc(100vh + ${distance}px)` : undefined }}
    >
      <div className={pinned ? 'sticky top-0 h-screen overflow-hidden' : 'relative overflow-hidden py-24'}>
        <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(70%_60%_at_20%_30%,rgba(29,78,216,0.28),transparent_70%),radial-gradient(50%_50%_at_90%_80%,rgba(124,58,237,0.18),transparent_70%)]" />
        <NetworkField className="opacity-60" density={0.00006} maxNodes={80} />
        <Grain />

        <motion.div
          ref={track}
          style={pinned ? { x } : undefined}
          className={`relative flex h-full items-center gap-6 px-6 md:px-[max(1.5rem,calc((100vw-80rem)/2+1.5rem))] ${
            pinned ? 'py-16' : 'nh-scroll-hide snap-x snap-mandatory overflow-x-auto pb-4'
          }`}
        >
          <Intro headingClass={headingClass} />
          {OFFERINGS.map((o, i) => (
            <div key={o.key} className={pinned ? 'h-[min(640px,78vh)]' : 'h-[640px]'}>
              <Panel o={o} i={i} progress={pinned ? scrollYProgress : undefined} headingClass={headingClass} />
            </div>
          ))}
          <div className="w-6 shrink-0 lg:w-[10vw]" aria-hidden="true" />
        </motion.div>

        {pinned ? (
          <div className="absolute bottom-8 left-1/2 flex w-[min(420px,60vw)] -translate-x-1/2 items-center gap-4 text-xs tabular-nums text-white/50">
            <span>01</span>
            <span className="relative h-px flex-1 bg-white/15">
              <motion.span style={{ width: bar }} className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#3b82f6] to-[#22d3ee]" />
            </span>
            <span>0{OFFERINGS.length}</span>
          </div>
        ) : null}
      </div>
    </section>
  );
}
