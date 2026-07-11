'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import ParticleRings from './ParticleRings';
import './foldcraft.css';

// Real, already-published, anonymized success story (from V3Next). Role +
// org descriptor only — no client name, per the site's anonymization rule.
const STORY = {
  metric: { value: '$4.2M', label: 'Saved annually' },
  title: 'Real-time across 500+ stores',
  quote:
    'They flawlessly delivered top-tier digital data on a milestone that mattered to us. Their dedication and expertise made them a genuine partner, not a vendor.',
  role: 'Director of Data and MarTech',
  org: 'A national convenience retailer',
};

/**
 * "Surfacing" belief section — the point-of-view beat after the partner
 * marquee. The underwater footage carries the metaphor (value rising out
 * of the dark) and a dust-particle ring cluster floats among the fish,
 * echoing the hero's rotating atom. Client logos come later.
 */
export default function FoldcraftHero({ geistClass }: { geistClass: string }) {
  return (
    <section className={`foldcraft relative h-screen w-full overflow-hidden bg-black ${geistClass}`}>
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="absolute inset-0 h-full w-full object-cover"
        style={{ objectPosition: '70% center' }}
      >
        <source src="/videos/foldcraft.webm" type="video/webm" />
        <source src="/videos/foldcraft.mp4" type="video/mp4" />
      </video>

      {/* Dust-particle rings floating with the fish */}
      <div className="pointer-events-none absolute right-[2%] top-1/2 h-[74%] w-[56%] -translate-y-1/2 mix-blend-screen opacity-80">
        <ParticleRings className="h-full w-full" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col justify-between px-6 pb-10 pt-12 sm:pb-12 sm:pt-16 md:px-12 md:pb-16 md:pt-20 lg:px-16">
        {/* Top */}
        <div className="max-w-2xl">
          <div className="fc-anim fc-d1 mb-5 sm:mb-6">
            <span className="inline-flex items-center rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-xs text-white/90 backdrop-blur-sm sm:text-sm">
              Why Most AI Stalls
            </span>
          </div>
          <h2 className="fc-anim fc-d2 text-3xl font-medium leading-[1.08] tracking-tight text-white sm:text-4xl md:text-5xl">
            Your best data is
            <br />
            sitting in the dark.
          </h2>
        </div>

        {/* Middle — success story snapshot with client testimonial */}
        <div
          className="fc-anim group w-full max-w-md rounded-2xl border border-white/12 bg-white/[0.05] p-6 backdrop-blur-md transition-colors duration-300 hover:border-white/25"
          style={{ animationDelay: '0.5s' }}
        >
          <div className="flex items-center justify-between">
            <Image
              src="/images/Solution-Partners/databricks.png"
              alt="Databricks"
              width={120}
              height={30}
              className="h-5 w-auto object-contain opacity-85"
              style={{ filter: 'brightness(0) invert(1)' }}
            />
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-semibold text-cyan-300">{STORY.metric.value}</span>
              <span className="text-[10px] font-semibold uppercase tracking-wide text-white/50">
                {STORY.metric.label}
              </span>
            </div>
          </div>

          <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-cyan-300/70">
            {STORY.title}
          </p>

          <p className="mt-3 border-l-2 border-cyan-400/40 pl-4 text-[15px] leading-relaxed text-white/85">
            &ldquo;{STORY.quote}&rdquo;
          </p>

          <div className="mt-4 pl-4 text-xs">
            <span className="font-medium text-white/70">{STORY.role}</span>
            <span className="text-white/40"> &middot; {STORY.org}</span>
          </div>
        </div>

        {/* Bottom */}
        <div>
          <p className="fc-anim fc-d3 mb-6 max-w-xl text-sm leading-relaxed text-white/65 sm:text-base md:text-lg">
            Most enterprise AI doesn&apos;t fail at the model. It fails in the deep, where the data is
            siloed, ungoverned, and out of reach. We go down, bring it up, and keep it running in the
            light.
          </p>
          <Link
            href="/services"
            className="fc-anim fc-d4 group inline-flex items-center gap-2 text-base font-medium text-white sm:text-lg"
          >
            <span className="relative">
              See how we do it
              <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-current transition-transform duration-300 ease-out group-hover:scale-x-100" />
            </span>
            <ArrowUpRight size={18} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
