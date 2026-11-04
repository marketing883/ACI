'use client';

// Success stories: a horizontal rail of tall glass cards on midnight. The
// rail scrolls with the trackpad, by drag-free swipe on touch, or with the
// arrow buttons. Each card's clip plays only while it is pointed at, and the
// headline metric counts up as the card enters the viewport. Metrics prefer
// the CMS value (getV4CaseStudyFacts) over the static fallback, the same way
// the current homepage does.

import { useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';
import { STORIES, SUCCESS_STORY_SLUGS, type StoryFacts } from '../v5/success-stories-data';
import { CountUp, Eyebrow, Grain, Reveal, SplitHeadline } from './motion';

export default function NHStories({ headingClass, facts }: { headingClass: string; facts?: StoryFacts }) {
  const rail = useRef<HTMLDivElement>(null);
  const nudge = (dir: 1 | -1) => {
    const el = rail.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>('[data-card]');
    el.scrollBy({ left: dir * ((card?.offsetWidth ?? 400) + 20), behavior: 'smooth' });
  };

  return (
    <section id="success-stories" className="relative overflow-hidden bg-[#0a1024] py-28 text-white md:py-36">
      <div aria-hidden="true" className="absolute -left-40 top-20 h-[500px] w-[500px] rounded-full bg-[#1d4ed8]/25 blur-[140px]" />
      <Grain />
      <div className="relative mx-auto max-w-7xl px-6">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div>
            <Eyebrow>Selected success stories</Eyebrow>
            <SplitHeadline
              lines={['Proof that runs', '*in production.*']}
              className={`mt-6 text-[clamp(2.4rem,5.4vw,4.8rem)] font-semibold leading-[1] tracking-[-0.035em] ${headingClass}`}
              accentClassName="nh-accent-gradient"
            />
          </div>
          <Reveal className="max-w-md">
            <p className="text-base leading-relaxed text-white/65">
              From lakehouse modernization and production AI to resilient platforms and automated
              operations, see what changes when engineering is tied to the&nbsp;outcome.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <button type="button" onClick={() => nudge(-1)} aria-label="Previous story" className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 transition-colors hover:bg-white hover:text-[#0a1024]">
                <ArrowLeft size={18} />
              </button>
              <button type="button" onClick={() => nudge(1)} aria-label="Next story" className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 transition-colors hover:bg-white hover:text-[#0a1024]">
                <ArrowRight size={18} />
              </button>
              <Link href="/case-studies" className="nh-btn ml-3 inline-flex items-center gap-1.5 text-sm font-semibold text-white/80 hover:text-white">
                Explore all success stories <ArrowUpRight size={15} />
              </Link>
            </div>
          </Reveal>
        </div>
      </div>

      <div
        ref={rail}
        className="nh-scroll-hide relative mt-14 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth px-6 pb-4 md:px-[max(1.5rem,calc((100vw-80rem)/2+1.5rem))]"
      >
        {STORIES.map((s, i) => {
          const fact = facts?.[SUCCESS_STORY_SLUGS[i]];
          const metric = fact?.metricValue ?? s.metric;
          const metricLabel = fact?.metricLabel ?? s.metricLabel;
          return (
            <Reveal key={s.id} delay={i * 0.06} className="shrink-0 snap-start">
              <Link
                data-card
                href={s.href}
                onMouseEnter={(e) => {
                  const v = e.currentTarget.querySelector('video');
                  v?.play().catch(() => {});
                }}
                onMouseLeave={(e) => {
                  const v = e.currentTarget.querySelector('video');
                  v?.pause();
                }}
                className="nh-btn nh-glow-card group relative flex h-[520px] text-white w-[82vw] max-w-[400px] flex-col overflow-hidden rounded-[26px] border border-white/10 bg-[#05070d] sm:w-[400px]"
              >
                <div className="relative h-[46%] overflow-hidden">
                  <video
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    aria-hidden="true"
                    className="absolute inset-0 h-full w-full scale-105 object-cover opacity-70 transition-all duration-[1.2s] group-hover:scale-100 group-hover:opacity-100"
                  >
                    <source src={`${s.webm}#t=0.5`} type="video/webm" />
                    <source src={`${s.video}#t=0.5`} type="video/mp4" />
                  </video>
                  <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_20%_0%,rgba(29,78,216,0.55),transparent_60%)] mix-blend-screen" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#05070d] to-transparent" />
                  <span className="absolute left-5 top-5 flex items-center gap-2 rounded-full border border-white/15 bg-[#05070d]/50 px-3 py-1 text-[11px] font-medium text-white/80 backdrop-blur-md">
                    <s.Icon size={13} />
                    {s.tab}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <div className={`text-5xl font-semibold tracking-tight text-white ${headingClass}`}>
                    <CountUp value={metric} />
                  </div>
                  <div className="mt-1 text-sm text-[#67e8f9]">{metricLabel}</div>
                  <div className="mt-5 text-[11px] uppercase tracking-[0.18em] text-white/45">{s.eyebrow}</div>
                  <h3 className={`[color:inherit] mt-2 text-xl font-semibold leading-snug ${headingClass}`}>{s.title}</h3>
                  <div className="mt-auto flex items-center justify-between pt-5">
                    <span className="flex flex-wrap gap-1.5">
                      {s.tags.slice(0, 3).map((t) => (
                        <span key={t.label} className="rounded-full border border-white/12 px-2.5 py-0.5 text-[11px] text-white/65">
                          {t.label}
                        </span>
                      ))}
                    </span>
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 transition-all duration-500 group-hover:rotate-45 group-hover:bg-white group-hover:text-[#05070d]">
                      <ArrowUpRight size={16} />
                    </span>
                  </div>
                </div>
                <span className="sr-only">{s.cta}</span>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
