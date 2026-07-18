'use client';

/**
 * Interactive whitepapers listing UI. This is a client component for the
 * category filter, but it is SEEDED FROM SERVER PROPS (`initialItems`)
 * rather than fetching in useEffect. That is the point of the SSR refactor:
 * because the data arrives as props, Next renders every whitepaper card -
 * and its `<a href="/whitepapers/{slug}">` - into the initial HTML, so
 * crawlers see real links. The previous version fetched
 * `/api/admin/whitepapers` in useEffect, so the server HTML had zero
 * whitepaper links and every detail page was orphaned. The per-whitepaper
 * gated download flow lives on the /whitepapers/{slug} detail page.
 */

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, FileText } from 'lucide-react';
import { v4Display } from '@/components/v4/fonts';
import type { WhitepaperListItem } from '@/lib/content/whitepaper';

const categories = ['All', 'Data Engineering', 'Applied AI', 'Cloud', 'MarTech', 'Healthcare'];

/** Soft double shadow for white cards sitting on a white field. */
const CARD_SHADOW = 'shadow-[0_3px_9px_rgba(63,74,126,0.06),0_1px_29px_rgba(63,74,126,0.12)]';

interface Props {
  initialItems: WhitepaperListItem[];
}

export default function WhitepapersClient({ initialItems }: Props) {
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Data comes from server props, so cards (and their links) are in the
  // initial HTML. Order (created_at DESC) is set by the server query.
  const whitepapers = initialItems;

  // Filter whitepapers - maintain chronological order from the server query
  const filteredWhitepapers = whitepapers.filter((wp) => {
    return selectedCategory === 'All' || wp.category === selectedCategory;
  });

  // Latest whitepapers for hero section (first 3 by created_at DESC)
  const latestWhitepapers = filteredWhitepapers.slice(0, 3);
  // Remaining whitepapers for grid
  const remainingWhitepapers = filteredWhitepapers.slice(3);

  return (
    <>
      {/* Category filter: text tabs with hairline underlines, no pills */}
      <section className="sticky top-20 z-40 border-b border-gray-200 bg-white/95 backdrop-blur">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`border-b pb-1 text-sm transition-colors duration-200 ${
                  selectedCategory === category
                    ? 'border-blue-700 font-semibold text-blue-700'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-black'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Empty State - No whitepapers in database */}
      {whitepapers.length === 0 && (
        <section className="bg-white">
          <div className="mx-auto max-w-7xl px-6 py-20">
            <div className="flex flex-col items-center justify-center text-center">
              <FileText className="mb-6 h-10 w-10 text-gray-300" />
              <h2 className={`mb-3 text-2xl font-bold tracking-tight text-black ${v4Display}`}>
                No whitepapers available yet
              </h2>
              <p className="mb-6 max-w-md text-gray-500">
                New resources are on the way. Check back soon for in-depth
                technical guides from our enterprise&nbsp;architects.
              </p>
              <Link
                href="/contact?reason=architecture-call"
                className="group inline-flex items-center gap-1 text-sm font-semibold text-blue-700 hover:underline"
              >
                Schedule an architecture call
                <ArrowUpRight size={15} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Latest Whitepapers */}
      {latestWhitepapers.length > 0 && selectedCategory === 'All' && (
        <section className="bg-white">
          <div className="mx-auto max-w-7xl px-6 py-14 md:py-16">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">/ Latest</p>
            <h2 className={`text-2xl font-bold tracking-tight sm:text-3xl ${v4Display}`}>
              Latest resources
            </h2>
            <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {latestWhitepapers.map((wp) => (
                <WhitepaperCard key={wp.id} whitepaper={wp} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Whitepapers */}
      <section className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-14 md:py-16">
          {(selectedCategory === 'All' && latestWhitepapers.length > 0 && remainingWhitepapers.length > 0) && (
            <>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">/ Library</p>
              <h2 className={`mb-10 text-2xl font-bold tracking-tight sm:text-3xl ${v4Display}`}>
                More resources
              </h2>
            </>
          )}

          {filteredWhitepapers.length === 0 && whitepapers.length > 0 ? (
            <div className="py-16 text-center">
              <p className="text-lg text-gray-500">No whitepapers found in this category.</p>
              <button
                onClick={() => setSelectedCategory('All')}
                className="group mt-4 inline-flex items-center gap-1 text-sm font-semibold text-blue-700 hover:underline"
              >
                View all whitepapers
                <ArrowUpRight size={15} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {(selectedCategory === 'All' && latestWhitepapers.length > 0 ? remainingWhitepapers : filteredWhitepapers).map((wp) => (
                <WhitepaperCard key={wp.id} whitepaper={wp} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

// Whitepaper card: white soft-shadow card with the cover as the visual,
// a WHITEPAPER eyebrow, title, abstract snippet, and an arrow text link.
interface WhitepaperCardProps {
  whitepaper: WhitepaperListItem;
}

function WhitepaperCard({ whitepaper }: WhitepaperCardProps) {
  return (
    <div className={`group flex flex-col overflow-hidden rounded-2xl bg-white transition-transform duration-300 hover:-translate-y-1 ${CARD_SHADOW}`}>
      {/* Cover - links to the detail page */}
      <Link href={`/whitepapers/${whitepaper.slug}`} className="relative block aspect-[3/4] overflow-hidden">
        {whitepaper.cover_image ? (
          <Image
            src={whitepaper.cover_image}
            alt={whitepaper.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full w-full flex-col bg-[#0b1220] p-8 ring-1 ring-inset ring-white/10">
            <FileText className="h-7 w-7 text-white/40" />
            <div className="flex-1" />
            <h4 className={`line-clamp-4 text-xl font-bold leading-snug text-white ${v4Display}`}>
              {whitepaper.title}
            </h4>
            <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/50">
              ACI Infotech
            </p>
          </div>
        )}
      </Link>

      {/* Card content */}
      <div className="flex flex-1 flex-col p-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-blue-700">
          Whitepaper{whitepaper.category ? ` / ${whitepaper.category}` : ''}
        </p>

        <Link href={`/whitepapers/${whitepaper.slug}`}>
          <h3 className={`mt-3 line-clamp-2 text-lg font-bold leading-snug text-black transition-colors hover:text-[#1D4ED8] ${v4Display}`}>
            {whitepaper.title}
          </h3>
        </Link>

        {whitepaper.description && (
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-gray-600">
            {whitepaper.description}
          </p>
        )}

        <div className="flex-1" />

        <Link
          href={`/whitepapers/${whitepaper.slug}`}
          className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-blue-700 hover:underline"
        >
          Read the whitepaper
          <ArrowUpRight size={15} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </div>
    </div>
  );
}
