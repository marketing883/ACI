'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import ParticleRings from './ParticleRings';
import './foldcraft.css';

export type FoldcraftStory = {
  metric: { value: string; label: string };
  title: string;
  quote?: string;
  role?: string;
  org?: string;
  href: string;
  logoSrc?: string;
  logoAlt?: string;
};

// Real, already-published, anonymized success story (from V3Next). Role +
// org descriptor only — no client name, per the site's anonymization rule.
const STORY: FoldcraftStory = {
  metric: { value: '87%', label: 'Reduction in processing time' },
  title: 'Lakehouse modernization across 500+ stores',
  quote:
    'They flawlessly delivered top-tier digital data on a milestone that mattered to us. Their dedication and expertise made them a genuine partner, not a vendor.',
  role: 'Director of Data and MarTech',
  org: 'A national convenience retailer',
  href: '/case-studies/databricks-modernization-ai-enablement-for-leading-c-store-chain',
};

const DEFAULT_HEADLINE = (
  <>
    Your <span className="text-[#60A5FA]">best data</span> is{' '}
    <br className="hidden sm:block" />
    sitting in the dark.
  </>
);

const DEFAULT_BODY =
  'Most enterprise AI doesn’t fail at the model. It fails in the deep, where the data is siloed, ungoverned, and out of reach. We go down, bring it up, and keep it running in the light.';

/**
 * "Surfacing" belief section — the point-of-view beat after the partner
 * marquee on the homepage, and the problem band on inner pages. The
 * underwater footage carries the metaphor (value rising out of the
 * dark). Props default to the homepage copy so existing callers keep
 * working; inner pages pass their own pill, headline, body, and story.
 */
export default function FoldcraftHero({
  geistClass,
  pill = 'Why Most AI Stalls',
  headline = DEFAULT_HEADLINE,
  body = DEFAULT_BODY,
  story = STORY,
}: {
  geistClass: string;
  pill?: string;
  headline?: React.ReactNode;
  body?: string;
  story?: FoldcraftStory;
}) {
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
        style={{ objectPosition: '70% center', transform: 'translateZ(0)' }}
      >
        <source src="/videos/foldcraft.webm" type="video/webm" />
        <source src="/videos/foldcraft.mp4" type="video/mp4" />
      </video>

      {/* Dust-particle rings floating with the fish */}
      <div className="pointer-events-none absolute right-[2%] top-1/2 h-[74%] w-[56%] -translate-y-1/2 opacity-90">
        <ParticleRings className="h-full w-full" />
      </div>

      {/* Content — centered, evenly spaced so it never crams on short
          viewports; the section grows a touch instead of squashing. */}
      <div className="relative z-10 flex min-h-screen flex-col justify-center gap-7 px-6 py-16 sm:gap-8 md:px-12 md:py-24 lg:px-16">
        <div className="max-w-3xl">
          <div className="fc-anim fc-d1 mb-6 sm:mb-7">
            <span className="inline-flex items-center rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-xs text-white/90 backdrop-blur-sm sm:text-sm">
              {pill}
            </span>
          </div>
          <h2 className="fc-anim fc-d2 text-4xl font-bold leading-[1.04] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-[64px]">
            {headline}
          </h2>
        </div>

        <p className="fc-anim fc-d3 max-w-2xl text-sm leading-relaxed text-white/65 sm:text-base md:text-lg">
          {body}
        </p>

        {/* Success story snapshot with client testimonial */}
        <Link
          href={story.href}
          className="fc-anim group block w-full max-w-2xl rounded-2xl border border-white/12 bg-[#0b1220]/70 p-7 transition-colors duration-300 hover:border-white/25 hover:bg-[#0b1220]/80 sm:p-8"
          style={{ animationDelay: '0.6s' }}
        >
          <div className="flex items-center justify-between gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={story.logoSrc ?? '/brand/databricks-color.svg'}
              alt={story.logoAlt ?? 'Databricks'}
              className="h-12 w-auto object-contain sm:h-14"
            />
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold leading-none text-[#84CC16] sm:text-5xl">
                {story.metric.value}
              </span>
              <span className="max-w-[110px] text-[11px] font-semibold uppercase leading-tight tracking-wide text-white/50">
                {story.metric.label}
              </span>
            </div>
          </div>

          <p className="mt-6 text-lg font-medium leading-snug text-white">{story.title}</p>

          {story.quote ? (
            <p className="mt-3 border-l-2 border-[#84CC16]/50 pl-5 text-base leading-relaxed text-white/85 sm:text-[17px]">
              &ldquo;{story.quote}&rdquo;
            </p>
          ) : null}

          <div className="mt-5 flex items-end justify-between gap-3 pl-5">
            <div className="text-xs">
              {story.role ? <span className="font-medium text-white/70">{story.role}</span> : null}
              {story.org ? <span className="text-white/40"> &middot; {story.org}</span> : null}
            </div>
            <span className="flex shrink-0 items-center gap-1 text-xs font-semibold text-[#84CC16]">
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
