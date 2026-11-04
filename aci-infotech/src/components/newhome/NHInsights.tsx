'use client';

// Insights and thought leadership on porcelain: one large featured story
// with a slow image push, three insight cards whose images wipe in, and the
// latest whitepaper as a cobalt download card. Same CMS wiring and
// fallbacks as the current homepage (V5Insights).

import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, Download } from 'lucide-react';
import { Eyebrow, Reveal, SplitHeadline } from './motion';
import type { V5InsightsProps } from '../v5/V5Insights';

const FEATURED = {
  title: 'Expanded strategic partnership with Databricks across North America',
  excerpt: 'A deeper alliance to bring lakehouse modernization and production AI to more enterprises, faster.',
  href: '/news',
  img: '/images/v4/why-visual.jpg',
};
const INSIGHTS = [
  { title: 'Building an Enterprise Data Mesh Architecture', href: '/blogs/enterprise-data-mesh-architecture', image: '/images/v4/svc-data.jpg' },
  { title: 'AI Governance for the Enterprise: From Policy to Practice', href: '/blogs/ai-governance-enterprise', image: '/images/v4/svc-ai.jpg' },
  { title: 'Databricks vs Snowflake: Choosing the Right Platform', href: '/blogs/databricks-vs-snowflake', image: '/images/v4/why-visual.jpg' },
];
const DOWNLOAD = {
  title: 'Retail Technology Benchmark Report 2026',
  blurb: 'Technology adoption across 120+ retail enterprises, with frameworks you can act on.',
  href: '/whitepapers/retail-technology-benchmark-report-2026',
};

export default function NHInsights({ headingClass, news, insights, download }: V5InsightsProps) {
  const featured = news ? { title: news.title, excerpt: news.excerpt ?? '', href: news.href, img: news.image ?? FEATURED.img } : FEATURED;
  const list = insights && insights.length > 0 ? insights.map((it) => ({ ...it, image: it.image ?? '/images/v4/svc-data.jpg' })) : INSIGHTS;
  const dl = download ? { title: download.title, blurb: download.blurb ?? '', href: download.href } : DOWNLOAD;
  const external = featured.href.startsWith('http');

  return (
    <section id="insights" className="relative bg-[#f4f6fb] py-28 text-[#0a1024] md:py-36">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <Eyebrow tone="light">Insights</Eyebrow>
            <SplitHeadline
              lines={['Field notes from', '*the work.*']}
              className={`mt-6 text-[clamp(2.2rem,5vw,4.4rem)] font-semibold leading-[1.02] tracking-[-0.035em] ${headingClass}`}
              accentClassName="nh-accent-ink"
            />
          </div>
          <Reveal>
            <Link href="/blogs" className="nh-btn inline-flex items-center gap-1.5 text-sm font-semibold text-[#1d4ed8]">
              See everything <ArrowUpRight size={15} />
            </Link>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-5 lg:grid-cols-[1.35fr_1fr]">
          <Reveal>
            <Link
              href={featured.href}
              {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              className="nh-btn group relative flex h-full min-h-[460px] flex-col justify-end overflow-hidden rounded-[26px] bg-[#05070d] p-8 text-white"
            >
              <Image src={featured.img} alt="" fill sizes="(min-width: 1024px) 55vw, 100vw" className="object-cover opacity-80 transition-transform duration-[1.6s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#05070d] via-[#05070d]/50 to-transparent" />
              <div className="relative">
                <span className="rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] backdrop-blur-md">News</span>
                <h3 className={`[color:inherit] mt-5 max-w-xl text-2xl font-semibold leading-tight md:text-4xl ${headingClass}`}>{featured.title}</h3>
                {featured.excerpt ? <p className="mt-3 max-w-lg text-sm leading-relaxed text-white/70">{featured.excerpt}</p> : null}
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold">
                  Read the announcement
                  <ArrowUpRight size={16} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>
          </Reveal>

          <div className="flex flex-col gap-5">
            {list.slice(0, 3).map((it, i) => (
              <Reveal key={it.href} delay={i * 0.08}>
                <Link href={it.href} className="nh-btn group flex items-center gap-5 rounded-2xl border text-[#0a1024] border-[#0a1024]/8 bg-white p-3 pr-5 transition-all duration-500 hover:-translate-y-0.5 hover:shadow-[0_24px_50px_-28px_rgba(10,16,36,0.5)]">
                  <span className="relative h-24 w-28 shrink-0 overflow-hidden rounded-xl">
                    <Image src={it.image} alt="" fill sizes="112px" className="object-cover transition-transform duration-700 group-hover:scale-110" />
                  </span>
                  <span className="flex-1">
                    <span className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-[#1d4ed8]">Insight</span>
                    <span className={`mt-1 block text-base font-semibold leading-snug ${headingClass}`}>{it.title}</span>
                  </span>
                  <ArrowUpRight size={18} className="shrink-0 text-[#0a1024]/35 transition-all duration-300 group-hover:rotate-45 group-hover:text-[#1d4ed8]" />
                </Link>
              </Reveal>
            ))}
            <Reveal delay={0.25}>
              <Link href={dl.href} className="nh-btn group relative block overflow-hidden rounded-2xl bg-[#1d4ed8] p-6 text-white">
                <span aria-hidden="true" className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#22d3ee]/40 blur-2xl transition-transform duration-700 group-hover:scale-150" />
                <span className="relative flex items-start justify-between gap-4">
                  <span>
                    <span className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-white/70">Whitepaper · PDF</span>
                    <span className={`mt-1 block text-lg font-semibold leading-snug ${headingClass}`}>{dl.title}</span>
                    {dl.blurb ? <span className="mt-2 block text-sm text-white/75">{dl.blurb}</span> : null}
                  </span>
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-[#1d4ed8] transition-transform duration-500 group-hover:translate-y-0.5">
                    <Download size={17} />
                  </span>
                </span>
              </Link>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
