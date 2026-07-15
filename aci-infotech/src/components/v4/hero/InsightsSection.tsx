'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowUpRight, Download, FileText } from 'lucide-react';

const EASE = [0.22, 1, 0.36, 1] as const;

// Editorial fallbacks, used only when the CMS fetch comes back empty
// (missing credentials in local dev, or a transient network failure).
const FEATURED = {
  cat: 'News',
  title: 'Expanded strategic partnership with Databricks across North America',
  excerpt:
    'A deeper alliance to bring lakehouse modernization and production AI to more enterprises, faster.',
  href: '/news',
  img: '/images/v4/why-visual.jpg',
};

const INSIGHTS = [
  { cat: 'Insight', title: 'Building an Enterprise Data Mesh Architecture', href: '/blogs/enterprise-data-mesh-architecture' },
  { cat: 'Insight', title: 'AI Governance for the Enterprise: From Policy to Practice', href: '/blogs/ai-governance-enterprise' },
  { cat: 'Insight', title: 'Databricks vs Snowflake: Choosing the Right Platform', href: '/blogs/databricks-vs-snowflake' },
];

const DOWNLOAD = {
  title: 'Retail Technology Benchmark Report 2026',
  meta: 'Whitepaper · PDF',
  blurb: 'Technology adoption across 120+ retail enterprises, with frameworks you can act on.',
  href: '/whitepapers/retail-technology-benchmark-report-2026',
};

export interface InsightsSectionProps {
  headingClass: string;
  /** Latest published news item, fetched server-side from the CMS. */
  news?: { title: string; excerpt: string | null; href: string; image: string | null } | null;
  /** Latest published blog posts, fetched server-side from the CMS. */
  insights?: { title: string; href: string }[];
  /** Latest published whitepaper, fetched server-side from the CMS. */
  download?: { title: string; blurb: string | null; href: string } | null;
}

export default function InsightsSection({ headingClass, news, insights, download }: InsightsSectionProps) {
  const featured = news
    ? {
        cat: 'News',
        title: news.title,
        excerpt: news.excerpt ?? '',
        href: news.href,
        img: news.image ?? FEATURED.img,
      }
    : FEATURED;
  const list =
    insights && insights.length > 0
      ? insights.map((it) => ({ cat: 'Insight', ...it }))
      : INSIGHTS;
  const dl = download
    ? { title: download.title, meta: 'Whitepaper · PDF', blurb: download.blurb ?? '', href: download.href }
    : DOWNLOAD;
  const featuredExternal = featured.href.startsWith('http');
  return (
    <section id="insights" className="border-t border-gray-200 bg-white text-black">
      <div className="mx-auto max-w-7xl px-6 pb-20 pt-16 md:pt-20">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6 md:mb-12">
          <div className="max-w-2xl">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">/ Signals</p>
            <h2 className={`text-5xl font-bold tracking-tight text-black sm:text-6xl lg:text-[64px] ${headingClass}`} style={{ lineHeight: 1.04 }}>
              Field notes from <span className="text-[#1D4ED8]">the work</span>.
            </h2>
          </div>
          <Link
            href="/blogs"
            className="group inline-flex items-center gap-1.5 text-sm font-semibold text-black transition-colors hover:text-blue-700"
          >
            <span className="relative">
              See everything
              <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-current transition-transform duration-300 ease-out group-hover:scale-x-100" />
            </span>
            <ArrowUpRight size={15} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-12">
          {/* Featured news */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.55, ease: EASE }}
            className="lg:col-span-7"
          >
            <Link
              href={featured.href}
              target={featuredExternal ? '_blank' : undefined}
              rel={featuredExternal ? 'noopener noreferrer' : undefined}
              className="group block overflow-hidden rounded-2xl border border-gray-200 no-underline transition-shadow hover:shadow-xl"
            >
              <div className="relative aspect-[16/9] w-full overflow-hidden">
                <Image
                  src={featured.img}
                  alt=""
                  fill
                  sizes="(max-width: 1024px) 100vw, 640px"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-blue-700 backdrop-blur-sm">
                  {featured.cat}
                </span>
              </div>
              <div className="p-6">
                <h3 className={`text-2xl font-semibold leading-snug text-black ${headingClass}`}>{featured.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">{featured.excerpt}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-black transition-colors group-hover:text-blue-700">
                  Read the announcement
                  <ArrowUpRight size={15} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>
          </motion.div>

          {/* Right column: insights list + download */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.55, delay: 0.08, ease: EASE }}
            className="flex flex-col gap-4 lg:col-span-5"
          >
            <div className="rounded-2xl border border-gray-200">
              {list.map((it, i) => (
                <Link
                  key={it.href}
                  href={it.href}
                  className={`group flex items-start justify-between gap-4 p-5 no-underline transition-colors hover:bg-gray-50 ${
                    i > 0 ? 'border-t border-gray-200' : ''
                  }`}
                >
                  <span>
                    <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-blue-700">{it.cat}</span>
                    <span className={`mt-1 block text-base font-semibold leading-snug text-black ${headingClass}`}>
                      {it.title}
                    </span>
                  </span>
                  <ArrowUpRight
                    size={16}
                    className="mt-0.5 shrink-0 text-gray-400 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-blue-700"
                  />
                </Link>
              ))}
            </div>

            {/* Downloadable — distinct treatment */}
            <Link
              href={dl.href}
              className="group flex items-center gap-4 rounded-2xl bg-black p-5 text-white no-underline transition-colors hover:bg-gray-900"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10">
                <FileText size={22} aria-hidden="true" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/50">{dl.meta}</span>
                <span className={`mt-0.5 block truncate text-base font-semibold ${headingClass}`}>{dl.title}</span>
                <span className="mt-0.5 block text-xs leading-snug text-white/60">{dl.blurb}</span>
              </span>
              <Download size={20} className="shrink-0 text-white/70 transition-transform duration-300 group-hover:translate-y-0.5" aria-hidden="true" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
