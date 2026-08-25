'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { useReveal, useCountUp } from './reveal';
import './v5.css';

// v5 "why most AI stalls" beat. Same copy and story card as the v4
// FoldcraftHero, with the underwater fish loop as the stage, but the
// entrance is scroll-triggered (v4 animated on page load, which had
// already played by the time anyone scrolled here) and a rotating
// circular text badge floats in the dark mid-water.

const STORY = {
  metric: { value: 87, suffix: '%', label: 'Reduction in processing time' },
  title: 'Lakehouse modernization across 500+ stores',
  quote:
    'They flawlessly delivered top-tier digital data on a milestone that mattered to us. Their dedication and expertise made them a genuine partner, not a vendor.',
  role: 'Director of Data and MarTech',
  org: 'A national convenience retailer',
  href: '/case-studies/databricks-modernization-ai-enablement-for-leading-c-store-chain',
};

const BODY =
  'Most enterprise AI doesn’t fail at the model. It fails in the deep, where the data is siloed, ungoverned, and out of reach. We go down, bring it up, and keep it running in the light.';

/** Circular "Engineered / Deployed / Run in Production" text ring,
 *  always turning. Decorative only. */
function RotatingBadge() {
  return (
    <svg viewBox="0 0 200 200" className="v5-badge-spin h-40 w-40 md:h-48 md:w-48" aria-hidden="true">
      <defs>
        <path id="v5-badge-circle" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" />
      </defs>
      <circle cx="100" cy="100" r="78" fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth="1" />
      <text fill="rgba(255,255,255,0.62)" fontSize="13" letterSpacing="4" fontWeight="600">
        <textPath href="#v5-badge-circle">ENGINEERED &#183; DEPLOYED &#183; RUN IN PRODUCTION &#183;&#160;</textPath>
      </text>
    </svg>
  );
}

export default function V5Foldcraft({ headingClass }: { headingClass: string }) {
  const { ref, revealed } = useReveal<HTMLElement>(0.2);
  const videoRef = useRef<HTMLVideoElement>(null);
  const metric = useCountUp(STORY.metric.value, revealed);

  // Lazy-load + only play the loop while near the viewport.
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
    <section
      ref={ref}
      className={`relative min-h-screen w-full overflow-hidden bg-[#01050b] ${revealed ? 'is-revealed' : ''}`}
    >
      <video
        ref={videoRef}
        muted
        loop
        playsInline
        preload="none"
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover"
        style={{ objectPosition: '70% center', transform: 'translateZ(0)' }}
      >
        <source src="/videos/foldcraft.webm" type="video/webm" />
        <source src="/videos/foldcraft.mp4" type="video/mp4" />
      </video>

      {/* Left-heavy veil keeps the copy readable; the fish own the right. */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{ background: 'linear-gradient(90deg, rgba(1,5,11,0.9) 0%, rgba(1,5,11,0.55) 42%, rgba(1,5,11,0.12) 72%, rgba(1,5,11,0.05) 100%)' }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-36"
        style={{ background: 'linear-gradient(180deg, rgba(1,5,11,0) 0%, rgba(1,5,11,0.7) 100%)' }}
      />

      <div className="relative z-10 grid min-h-screen items-center gap-10 px-6 py-16 md:grid-cols-[minmax(0,1fr)_auto] md:px-12 md:py-24 lg:px-16">
        <div className="flex max-w-3xl flex-col items-start gap-7">
          <span className="v5-rise inline-flex items-center rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-xs uppercase tracking-[0.12em] text-white/90 backdrop-blur-sm sm:text-[13px]" style={{ '--v5-d': '0.05s' } as React.CSSProperties}>
            Why Most AI Stalls
          </span>

          <h2
            className={`v5-rise text-4xl font-semibold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-[52px] ${headingClass}`}
            style={{ '--v5-d': '0.15s' } as React.CSSProperties}
          >
            Your <span className="text-[#60A5FA]">best data</span> is <br className="hidden sm:block" />
            sitting in the dark.
          </h2>

          <p className="v5-rise max-w-2xl text-sm leading-relaxed text-white/70 sm:text-base md:text-lg" style={{ '--v5-d': '0.3s' } as React.CSSProperties}>
            {BODY}
          </p>

          <Link
            href={STORY.href}
            className="v5-rise group block w-full max-w-2xl rounded-2xl border border-white/[0.12] bg-[#0b1220]/70 p-7 transition-colors duration-300 hover:border-white/25 hover:bg-[#0b1220]/80 sm:p-8"
            style={{ '--v5-d': '0.45s' } as React.CSSProperties}
          >
            <div className="flex items-center justify-between gap-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/brand/databricks-color.svg" alt="Databricks" className="h-12 w-auto object-contain sm:h-14" />
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold leading-none text-[#84CC16] sm:text-5xl">
                  {metric}
                  {STORY.metric.suffix}
                </span>
                <span className="max-w-[110px] text-[11px] font-semibold uppercase leading-tight tracking-wide text-white/50">
                  {STORY.metric.label}
                </span>
              </div>
            </div>

            <p className="mt-6 text-lg font-medium leading-snug text-white">{STORY.title}</p>

            <p className="mt-3 border-l-2 border-[#84CC16]/50 pl-5 text-base leading-relaxed text-white/85 sm:text-[17px]">
              &ldquo;{STORY.quote}&rdquo;
            </p>

            <div className="mt-5 flex items-end justify-between gap-3 pl-5">
              <div className="text-xs">
                <span className="font-medium text-white/70">{STORY.role}</span>
                <span className="text-white/40"> &middot; {STORY.org}</span>
              </div>
              <span className="flex shrink-0 items-center gap-1 text-xs font-semibold text-[#84CC16]">
                Read the case study
                <ArrowUpRight size={14} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </div>
          </Link>
        </div>

        {/* Badge sits in the dark water between the copy and the fish. */}
        <div className="hidden items-end pb-8 pr-6 md:flex lg:pr-16">
          <RotatingBadge />
        </div>
      </div>
    </section>
  );
}
