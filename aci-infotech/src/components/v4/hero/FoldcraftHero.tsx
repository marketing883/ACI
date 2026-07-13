'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import ParticleRings from './ParticleRings';
import './foldcraft.css';

// Real, already-published, anonymized success story (from V3Next). Role +
// org descriptor only — no client name, per the site's anonymization rule.
const STORY = {
  metric: { value: '87%', label: 'Reduction in processing time' },
  title: 'Lakehouse modernization across 500+ stores',
  quote:
    'They flawlessly delivered top-tier digital data on a milestone that mattered to us. Their dedication and expertise made them a genuine partner, not a vendor.',
  role: 'Director of Data and MarTech',
  org: 'A national convenience retailer',
  href: '/case-studies/databricks-modernization-ai-enablement-for-leading-c-store-chain',
};

/**
 * "Surfacing" belief section — the point-of-view beat after the partner
 * marquee. The underwater footage carries the metaphor (value rising out
 * of the dark) and a dust-particle ring cluster floats among the fish,
 * echoing the hero's rotating atom. Client logos come later.
 */
export default function FoldcraftHero({ geistClass }: { geistClass: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Lazy-load + only play while on screen.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const io = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? v.play().catch(() => {}) : v.pause()),
      { rootMargin: '300px 0px' },
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  return (
    <section className={`foldcraft relative min-h-screen w-full overflow-hidden bg-black ${geistClass}`}>
      <video
        ref={videoRef}
        muted
        loop
        playsInline
        preload="none"
        className="absolute inset-0 h-full w-full object-cover"
        style={{ objectPosition: '70% center' }}
      >
        <source src="/videos/foldcraft.webm" type="video/webm" />
        <source src="/videos/foldcraft.mp4" type="video/mp4" />
      </video>

      {/* Dust-particle rings floating with the fish */}
      <div className="pointer-events-none absolute right-[2%] top-1/2 h-[74%] w-[56%] -translate-y-1/2 mix-blend-screen opacity-100">
        <ParticleRings className="h-full w-full" />
      </div>

      {/* Content — centered, evenly spaced so it never crams on short
          viewports; the section grows a touch instead of squashing. */}
      <div className="relative z-10 flex min-h-screen flex-col justify-center gap-7 px-6 py-16 sm:gap-8 md:px-12 md:py-24 lg:px-16">
        <div className="max-w-3xl">
          <div className="fc-anim fc-d1 mb-6 sm:mb-7">
            <span className="inline-flex items-center rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-xs text-white/90 backdrop-blur-sm sm:text-sm">
              Why Most AI Stalls
            </span>
          </div>
          <h2 className="fc-anim fc-d2 text-4xl font-medium leading-[1.05] tracking-tight text-white sm:text-5xl md:text-[3.5rem]">
            Your best data is
            <br />
            sitting in the dark.
          </h2>
        </div>

        <p className="fc-anim fc-d3 max-w-2xl text-sm leading-relaxed text-white/65 sm:text-base md:text-lg">
          Most enterprise AI doesn&apos;t fail at the model. It fails in the deep, where the data is
          siloed, ungoverned, and out of reach. We go down, bring it up, and keep it running in the
          light.
        </p>

        {/* Success story snapshot with client testimonial */}
        <Link
          href={STORY.href}
          className="fc-anim group block w-full max-w-2xl rounded-2xl border border-white/12 bg-white/[0.05] p-7 backdrop-blur-md transition-colors duration-300 hover:border-white/25 hover:bg-white/[0.08] sm:p-8"
          style={{ animationDelay: '0.6s' }}
        >
          <div className="flex items-center justify-between gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/brand/databricks-color.svg"
              alt="Databricks"
              className="h-[34px] w-auto object-contain"
            />
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold leading-none text-cyan-300 sm:text-5xl">
                {STORY.metric.value}
              </span>
              <span className="max-w-[110px] text-[11px] font-semibold uppercase leading-tight tracking-wide text-white/50">
                {STORY.metric.label}
              </span>
            </div>
          </div>

          <p className="mt-6 text-lg font-medium leading-snug text-white">{STORY.title}</p>

          <p className="mt-3 border-l-2 border-cyan-400/40 pl-5 text-base leading-relaxed text-white/85 sm:text-[17px]">
            &ldquo;{STORY.quote}&rdquo;
          </p>

          <div className="mt-5 flex items-end justify-between gap-3 pl-5">
            <div className="text-xs">
              <span className="font-medium text-white/70">{STORY.role}</span>
              <span className="text-white/40"> &middot; {STORY.org}</span>
            </div>
            <span className="flex shrink-0 items-center gap-1 text-xs font-semibold text-cyan-300">
              Read the case study
              <ArrowUpRight
                size={14}
                className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </span>
          </div>
        </Link>

      </div>
    </section>
  );
}
