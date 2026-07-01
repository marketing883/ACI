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
import { FileText, ArrowRight } from 'lucide-react';
import Button from '@/components/ui/Button';
import type { WhitepaperListItem } from '@/lib/content/whitepaper';

const categories = ['All', 'Data Engineering', 'Applied AI', 'Cloud', 'MarTech', 'Healthcare'];

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
      {/* Category Filters */}
      <section className="py-6 bg-gray-50 sticky top-20 z-40 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-[var(--aci-primary)] text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
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
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                <FileText className="w-10 h-10 text-gray-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-700 mb-3">No Whitepapers Available</h2>
              <p className="text-gray-500 mb-6 max-w-md">
                We&apos;re working on publishing new resources. Check back soon for in-depth technical guides from our enterprise architects.
              </p>
              <Button href="/contact?reason=architecture-call" variant="primary">
                Schedule Architecture Call
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Latest Whitepapers Hero */}
      {latestWhitepapers.length > 0 && selectedCategory === 'All' && (
        <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-[var(--aci-secondary)] mb-3">Latest Resources</h2>
              <p className="text-gray-600">In-depth guides from our enterprise architects</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {latestWhitepapers.map((wp) => (
                <WhitepaperCard key={wp.id} whitepaper={wp} featured={wp.is_featured ?? undefined} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Whitepapers */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {(selectedCategory === 'All' && latestWhitepapers.length > 0 && remainingWhitepapers.length > 0) && (
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-[var(--aci-secondary)] mb-3">More Resources</h2>
              <p className="text-gray-600">Explore our complete library of technical guides</p>
            </div>
          )}

          {filteredWhitepapers.length === 0 && whitepapers.length > 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">No whitepapers found in this category.</p>
              <Button
                variant="secondary"
                className="mt-4"
                onClick={() => setSelectedCategory('All')}
              >
                View All
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {(selectedCategory === 'All' && latestWhitepapers.length > 0 ? remainingWhitepapers : filteredWhitepapers).map((wp) => (
                <WhitepaperCard key={wp.id} whitepaper={wp} featured={wp.is_featured ?? undefined} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

// Ebook-style Whitepaper Card Component
interface WhitepaperCardProps {
  whitepaper: WhitepaperListItem;
  featured?: boolean;
}

function WhitepaperCard({ whitepaper, featured }: WhitepaperCardProps) {
  return (
    <div className="group flex flex-col bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow">
      {/* Clickable Image - Links to Individual Page */}
      <Link href={`/whitepapers/${whitepaper.slug}`} className="relative aspect-[3/4] overflow-hidden">
        {whitepaper.cover_image ? (
          <Image
            src={whitepaper.cover_image}
            alt={whitepaper.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[var(--aci-secondary)] via-[#1a3a5c] to-[var(--aci-primary)] flex flex-col items-center justify-center p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-4">
              <FileText className="w-8 h-8 text-white/80" />
            </div>
            <h4 className="text-white font-bold text-lg leading-tight line-clamp-3">{whitepaper.title}</h4>
            <div className="mt-auto pt-4">
              <span className="text-white/60 text-sm">ACI Infotech</span>
            </div>
          </div>
        )}

        {/* Featured badge */}
        {featured && (
          <div className="absolute top-3 right-3">
            <span className="px-2 py-1 bg-amber-500 text-white text-xs font-bold rounded-md flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </span>
          </div>
        )}
      </Link>

      {/* Card Content - Always Visible */}
      <div className="p-4 flex flex-col flex-grow">
        {/* Category Badge */}
        <span className="text-xs font-medium text-[var(--aci-primary)] uppercase tracking-wide mb-2">
          {whitepaper.category}
        </span>

        {/* Title - Clickable, Links to Individual Page */}
        <Link href={`/whitepapers/${whitepaper.slug}`}>
          <h3 className="text-lg font-bold text-[var(--aci-secondary)] mb-2 line-clamp-2 hover:text-[var(--aci-primary)] transition-colors">
            {whitepaper.title}
          </h3>
        </Link>

        {/* Description (if available) */}
        {whitepaper.description && (
          <p className="text-sm text-gray-600 line-clamp-2 mb-4 flex-grow">
            {whitepaper.description}
          </p>
        )}

        {/* Text Link - Visible, Not Hover-Only */}
        <Link
          href={`/whitepapers/${whitepaper.slug}`}
          className="inline-flex items-center gap-1 text-sm font-medium text-[var(--aci-primary)] hover:underline mt-auto"
        >
          Learn More
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
