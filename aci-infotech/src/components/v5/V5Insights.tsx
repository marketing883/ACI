'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowUpRight, Download, FileText } from 'lucide-react';

// v5 Signals section: the v4 InsightsSection restyled for the dark
// page. Same CMS wiring and fallbacks; the whitepaper card inverts to
// white so the download offer stays the loudest object in the column.

const EASE = [0.22, 1, 0.36, 1] as const;

const FEATURED = {
  cat: 'News',
  title: 'Expanded strategic partnership with Databricks across North America',
  excerpt:
    'A deeper alliance to bring lakehouse modernization and production AI to more enterprises, faster.',
  href: '/news',
  img: '/images/v4/why-visual.jpg',
};

const INSIGHTS = [
  { cat: 'Insight', title: 'Building an Enterprise Data Mesh Architecture', href: '/blogs/enterprise-data-mesh-architecture', image: '/images/v4/svc-data.jpg' },
  { cat: 'Insight', title: 'AI Governance for the Enterprise: From Policy to Practice', href: '/blogs/ai-governance-enterprise', image: '/images/v4/svc-ai.jpg' },
  { cat: 'Insight', title: 'Databricks vs Snowflake: Choosing the Right Platform', href: '/blogs/databricks-vs-snowflake', image: '/images/v4/why-visual.jpg' },
];

const DOWNLOAD = {
  title: 'Retail Technology Benchmark Report 2026',
  meta: 'Whitepaper · PDF',
  blurb: 'Technology adoption across 120+ retail enterprises, with frameworks you can act on.',
  href: '/whitepapers/retail-technology-benchmark-report-2026',
};

export interface V5InsightsProps {
  headingClass: string;
  news?: { title: string; excerpt: string | null; href: string; image: string | null } | null;
  insights?: { title: string; href: string; image: string | null }[];
  download?: { title: string; blurb: string | null; href: string } | null;
}

export default function V5Insights({ headingClass, news, insights, download }: V5InsightsProps) {
  const featured = news
    ? { cat: 'News', title: news.title, excerpt: news.excerpt ?? '', href: news.href, img: news.image ?? FEATURED.img }
    : FEATURED;
  const list = insights && insights.length > 0 ? insights.map((it) => ({ cat: 'Insight', ...it })) : INSIGHTS;
  const dl = download
    ? { title: download.title, meta: 'Whitepaper · PDF', blurb: download.blurb ?? '', href: download.href }
    : DOWNLOAD;
  const featuredExternal = featured.href.startsWith('http');

  return (
    <section id="insights" className="border-t border-white/[0.08] bg-[#0a0b10] text-white">
      <div className="mx-auto max-w-7xl px-6 pb-20 pt-16 md:pt-20">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6 md:mb-12">
          <div className="max-w-2xl">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-[#60A5FA]">/ Signals</p>
            <h2 className={`text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-[64px] ${headingClass}`} style={{ lineHeight: 1.04 }}>
              Field notes from <span className="text-[#60A5FA]">the work</span>.
            </h2>
          </div>
          <Link href="/blogs" className="group inline-flex items-center gap-1.5 text-sm font-semibold text-white transition-colors hover:text-[#60A5FA]">
            <span className="relative">
              See everything
              <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-current transition-transform duration-300 ease-out group-hover:scale-x-100" />
            </span>
            <ArrowUpRight size={15} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div className="grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-12">
          {/* Featured news */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.55, ease: EASE }}
            className="min-w-0 lg:col-span-7"
          >
            <Link
              href={featured.href}
              target={featuredExternal ? '_blank' : undefined}
              rel={featuredExternal ? 'noopener noreferrer' : undefined}
              className="group block overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] no-underline transition-colors hover:border-white/20"
            >
              <div className="relative aspect-[16/9] w-full overflow-hidden">
                <Image
                  src={featured.img}
                  alt=""
                  fill
                  sizes="(max-width: 1024px) 100vw, 640px"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <span className="absolute left-4 top-4 rounded-full bg-[#1D4ED8] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white">
                  {featured.cat}
                </span>
              </div>
              <div className="p-6">
                <h3 className={`text-2xl font-semibold leading-snug text-white ${headingClass}`}>{featured.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/60">{featured.excerpt}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-white transition-colors group-hover:text-[#60A5FA]">
                  Read the announcement
                  <ArrowUpRight size={15} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>
          </motion.div>

          {/* Right column: insights list + inverted download card */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.55, delay: 0.08, ease: EASE }}
            className="flex min-w-0 flex-col gap-4 lg:col-span-5"
          >
            <div className="overflow-hidden rounded-2xl border border-white/10">
              {list.map((it, i) => (
                <Link
                  key={it.href}
                  href={it.href}
                  className={`group relative isolate flex items-start justify-between gap-4 p-5 no-underline transition-colors hover:bg-white/[0.04] ${
                    i > 0 ? 'border-t border-white/10' : ''
                  }`}
                >
                  {it.image ? (
                    <span aria-hidden="true" className="absolute inset-0 -z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <Image src={it.image} alt="" fill sizes="480px" className="object-cover" />
                      <span className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/70 to-black/45" />
                    </span>
                  ) : null}
                  <span className="min-w-0">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#60A5FA] transition-colors duration-300 group-hover:text-[#A3E635]">
                      {it.cat}
                    </span>
                    <span className={`mt-1 block text-base font-semibold leading-snug text-white ${headingClass}`}>{it.title}</span>
                  </span>
                  <ArrowUpRight size={16} className="mt-0.5 shrink-0 text-white/40 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white" />
                </Link>
              ))}
            </div>

            {/* Downloadable, inverted to white so it pops on the dark page. */}
            <Link
              href={dl.href}
              className="group flex items-center gap-4 rounded-2xl bg-white p-5 text-black no-underline transition-colors hover:bg-gray-100"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-black/[0.06]">
                <FileText size={22} aria-hidden="true" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-gray-500">{dl.meta}</span>
                <span className={`mt-0.5 block truncate text-base font-semibold ${headingClass}`}>{dl.title}</span>
                <span className="mt-0.5 line-clamp-2 block text-xs leading-snug text-gray-500">{dl.blurb}</span>
              </span>
              <Download size={20} className="shrink-0 text-gray-500 transition-transform duration-300 group-hover:translate-y-0.5" aria-hidden="true" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
