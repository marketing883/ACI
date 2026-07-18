/**
 * Whitepaper detail — server component.
 *
 * The old client version fetched via /api in a useEffect, so the
 * server HTML was a spinner: no teaser content for crawlers, and
 * unknown slugs returned HTTP 200. The teaser (summary, takeaways,
 * table of contents) now renders on the server; the gated download
 * stays behind the lead form in a small client island.
 */

import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ArrowUpRight, FileText } from 'lucide-react';
import { getSiteUrl } from '@/lib/site-url';
import { v4Display, v4Sans } from '@/components/v4/fonts';
import { cardShadow, CheckBadge, glueWidow } from '@/components/v4/page/kit';
import { getWhitepaperDetail } from './whitepaper-detail';
import WhitepaperDownloadCta from './WhitepaperDownloadCta';

const siteUrl = getSiteUrl();

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function WhitepaperDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const whitepaper = await getWhitepaperDetail(slug);

  // Real 404 instead of the old 200 "Whitepaper Not Found" body.
  if (!whitepaper) {
    notFound();
  }

  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Report',
        '@id': `${siteUrl}/whitepapers/${slug}#report`,
        headline: whitepaper.title,
        description: whitepaper.description,
        url: `${siteUrl}/whitepapers/${slug}`,
        image: whitepaper.cover_image || undefined,
        datePublished: whitepaper.published_at || undefined,
        author: whitepaper.author_name
          ? {
              '@type': 'Person',
              name: whitepaper.author_name,
              ...(whitepaper.author_title ? { jobTitle: whitepaper.author_title } : {}),
              worksFor: { '@id': `${siteUrl}/#organization` },
            }
          : { '@id': `${siteUrl}/#organization` },
        publisher: { '@id': `${siteUrl}/#organization` },
        keywords: (whitepaper.tags || []).join(', '),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
          { '@type': 'ListItem', position: 2, name: 'Whitepapers', item: `${siteUrl}/whitepapers` },
          { '@type': 'ListItem', position: 3, name: whitepaper.title, item: `${siteUrl}/whitepapers/${slug}` },
        ],
      },
    ],
  };

  const metaChips = [
    whitepaper.category,
    `${whitepaper.read_time} read`,
    `${whitepaper.page_count || 25} pages`,
    whitepaper.published_at
      ? `Updated ${new Date(whitepaper.published_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`
      : null,
  ].filter((c): c is string => Boolean(c));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <main className={`min-h-screen bg-white text-black ${v4Sans}`}>
        {/* Header */}
        <section className="border-b border-gray-200 bg-white">
          <div className="mx-auto grid max-w-7xl gap-12 px-6 pb-16 pt-12 md:pt-16 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-7">
              <Link
                href="/whitepapers"
                className="group inline-flex items-center gap-1.5 text-sm font-semibold text-blue-700"
              >
                <span className="relative">
                  All whitepapers
                  <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-current transition-transform duration-300 ease-out group-hover:scale-x-100" />
                </span>
                <ArrowUpRight size={14} aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>

              <p className="mb-4 mt-10 text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
                / Whitepaper
              </p>
              <h1
                className={`text-3xl font-bold tracking-tight text-black sm:text-4xl lg:text-[44px] ${v4Display}`}
                style={{ lineHeight: 1.08 }}
              >
                {whitepaper.title}
              </h1>
              {whitepaper.description && (
                <p className="mt-5 max-w-xl text-base leading-relaxed text-gray-600 md:text-lg">
                  {glueWidow(whitepaper.description)}
                </p>
              )}

              <ul className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                {metaChips.map((chip) => (
                  <li key={chip} className="whitespace-nowrap">
                    {chip}
                  </li>
                ))}
              </ul>

              {whitepaper.key_takeaways && whitepaper.key_takeaways.length > 0 && (
                <ul className="mt-8 max-w-xl space-y-3">
                  {whitepaper.key_takeaways.slice(0, 3).map((takeaway, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckBadge />
                      <span className="text-[15px] leading-relaxed text-gray-700">{takeaway}</span>
                    </li>
                  ))}
                </ul>
              )}

              <div className="mt-9">
                <WhitepaperDownloadCta whitepaper={whitepaper} variant="hero" trackView />
              </div>
            </div>

            {/* Cover as a soft card */}
            <div className="lg:col-span-5">
              <div className={`overflow-hidden rounded-3xl bg-white ${cardShadow}`}>
                {whitepaper.cover_image ? (
                  <Image
                    src={whitepaper.cover_image}
                    alt={whitepaper.title}
                    width={500}
                    height={650}
                    className="h-auto w-full"
                  />
                ) : (
                  <div className="flex aspect-[3/4] items-center justify-center bg-[#0b1220] p-8 ring-1 ring-white/10">
                    <div className="text-center">
                      <FileText className="mx-auto mb-6 h-16 w-16 text-white/40" aria-hidden="true" />
                      <h3 className={`text-2xl font-semibold text-white ${v4Display}`}>{whitepaper.title}</h3>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Executive summary */}
        {whitepaper.executive_summary && (
          <section className="bg-white py-16 md:py-20">
            <div className="mx-auto max-w-[960px] px-6">
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">/ Executive summary</p>
              <h2
                className={`text-2xl font-bold tracking-tight text-black sm:text-3xl ${v4Display}`}
                style={{ lineHeight: 1.1 }}
              >
                What this paper covers
              </h2>
              <p className="mt-6 max-w-3xl text-[17px] leading-relaxed text-gray-800">
                {glueWidow(whitepaper.executive_summary)}
              </p>
            </div>
          </section>
        )}

        {/* Key takeaways */}
        {whitepaper.key_takeaways && whitepaper.key_takeaways.length > 0 && (
          <section className="bg-white pb-16 md:pb-20">
            <div className="mx-auto max-w-[960px] border-t border-gray-200 px-6 pt-16 md:pt-20">
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">/ Key takeaways</p>
              <h2
                className={`text-2xl font-bold tracking-tight text-black sm:text-3xl ${v4Display}`}
                style={{ lineHeight: 1.1 }}
              >
                What you keep after reading
              </h2>
              <ul className="mt-8 max-w-3xl space-y-4">
                {whitepaper.key_takeaways.map((takeaway, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckBadge />
                    <span className="text-[15px] leading-relaxed text-gray-700">{takeaway}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* What you'll learn */}
        {whitepaper.what_you_will_learn && whitepaper.what_you_will_learn.length > 0 && (
          <section className="bg-white pb-16 md:pb-20">
            <div className="mx-auto max-w-[960px] border-t border-gray-200 px-6 pt-16 md:pt-20">
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">/ Inside the paper</p>
              <h2
                className={`text-2xl font-bold tracking-tight text-black sm:text-3xl ${v4Display}`}
                style={{ lineHeight: 1.1 }}
              >
                What you&apos;ll learn
              </h2>
              <div className="mt-8 grid gap-5 md:grid-cols-2">
                {whitepaper.what_you_will_learn.map((item, index) => (
                  <div key={index} className={`flex items-start gap-4 rounded-2xl bg-white px-5 py-4 ${cardShadow}`}>
                    <span className={`text-sm font-semibold text-gray-300 ${v4Display}`}>
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <p className="text-[15px] leading-relaxed text-gray-700">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Who should read */}
        {whitepaper.who_should_read && whitepaper.who_should_read.length > 0 && (
          <section className="bg-white pb-16 md:pb-20">
            <div className="mx-auto max-w-[960px] border-t border-gray-200 px-6 pt-16 md:pt-20">
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">/ Audience</p>
              <h2
                className={`text-2xl font-bold tracking-tight text-black sm:text-3xl ${v4Display}`}
                style={{ lineHeight: 1.1 }}
              >
                Who should read this
              </h2>
              <ul className="mt-7 flex max-w-3xl flex-wrap gap-x-5 gap-y-2 text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                {whitepaper.who_should_read.map((audience, index) => (
                  <li key={index} className="whitespace-nowrap">
                    {audience}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* Table of contents */}
        {whitepaper.table_of_contents && whitepaper.table_of_contents.length > 0 && (
          <section className="bg-white pb-16 md:pb-20">
            <div className="mx-auto max-w-[960px] border-t border-gray-200 px-6 pt-16 md:pt-20">
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">/ Contents</p>
              <h2
                className={`text-2xl font-bold tracking-tight text-black sm:text-3xl ${v4Display}`}
                style={{ lineHeight: 1.1 }}
              >
                Table of contents
              </h2>
              <ol className="mt-8 max-w-3xl">
                {whitepaper.table_of_contents.map((chapter, index) => (
                  <li
                    key={index}
                    className="flex items-baseline gap-4 border-t border-gray-200 py-3.5 text-[15px] text-gray-700"
                  >
                    <span className={`text-sm font-semibold text-gray-300 ${v4Display}`}>
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span>{chapter}</span>
                  </li>
                ))}
              </ol>
            </div>
          </section>
        )}

        {/* Author (E-E-A-T) */}
        {whitepaper.author_name && (
          <section className="bg-white pb-16 md:pb-20">
            <div className="mx-auto max-w-[960px] px-6">
              <div className={`max-w-3xl rounded-2xl bg-white p-7 ${cardShadow}`}>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">/ About the author</p>
                <h3 className={`mt-3 text-xl font-semibold text-black ${v4Display}`}>{whitepaper.author_name}</h3>
                {whitepaper.author_title && (
                  <p className="mt-1 text-sm font-medium text-gray-500">{whitepaper.author_title}</p>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Closing CTA: dark stage, one gate button */}
        <section className="border-t border-gray-200 bg-white py-16 md:py-20">
          <div className="mx-auto max-w-7xl px-6">
            <div className="rounded-3xl bg-[#0b1220] px-8 py-14 text-center ring-1 ring-white/10 md:px-12 md:py-16">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/60">/ The full paper</p>
              <h2
                className={`mx-auto mt-4 max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl ${v4Display}`}
                style={{ lineHeight: 1.08 }}
              >
                Ready to put this to&nbsp;work?
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-white/75">
                Get the complete guide, written from 80+ enterprise&nbsp;implementations.
              </p>
              <div className="mt-8">
                <WhitepaperDownloadCta whitepaper={whitepaper} variant="footer" />
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
