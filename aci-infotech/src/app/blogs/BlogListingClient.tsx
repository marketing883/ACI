'use client';

/**
 * Interactive blog listing UI. This is a client component for the search +
 * category filter + "load more" behaviour, but it is SEEDED FROM SERVER
 * PROPS (`initialPosts`) rather than fetching in useEffect. That is the
 * whole point of the SSR refactor: because the data arrives as props, Next
 * renders every post card, and its `<a href="/blogs/{slug}">`, into the
 * initial HTML, so crawlers see real links. The previous version fetched in
 * useEffect, so the server HTML had zero post links and ~344 posts were
 * orphaned. The numbered, crawlable pagination for the full archive lives in
 * the server page (`/blogs/page/[page]`); "Load More" here is a JS-only
 * convenience layered on page 1.
 */

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, Search } from 'lucide-react';
import { v4Display } from '@/components/v4/fonts';
import type { BlogListItem } from '@/lib/content/blog';

const categories = ['All', 'Data Engineering', 'Applied AI & ML', 'Cloud Modernization', 'MarTech & CDP', 'Cyber Security', 'Digital Transformation'];

/** Soft double shadow for white cards sitting on a white field. */
const CARD_SHADOW = 'shadow-[0_3px_9px_rgba(63,74,126,0.06),0_1px_29px_rgba(63,74,126,0.12)]';

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

interface Props {
  initialPosts: BlogListItem[];
  total: number;
  pageSize: number;
}

export default function BlogListingClient({ initialPosts, total, pageSize }: Props) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [blogPosts, setBlogPosts] = useState<BlogListItem[]>(initialPosts);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(initialPosts.length < total);

  // Load more posts (JS-only convenience; crawlers use /blogs/page/[n]).
  async function loadMorePosts() {
    if (isLoadingMore || !hasMore) return;
    setIsLoadingMore(true);
    try {
      const response = await fetch(`/api/admin/blogs?published=true&limit=${pageSize}&offset=${blogPosts.length}`);
      const result = await response.json();
      if (result.posts && result.posts.length > 0) {
        setBlogPosts(prev => [...prev, ...result.posts]);
        setHasMore(result.hasMore ?? false);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error loading more posts:', error);
    } finally {
      setIsLoadingMore(false);
    }
  }

  const filteredPosts = blogPosts.filter((post) => {
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    const q = searchQuery.toLowerCase();
    const matchesSearch = searchQuery === '' ||
      post.title.toLowerCase().includes(q) ||
      (post.excerpt?.toLowerCase().includes(q) ?? false) ||
      (post.tags?.some(tag => tag.toLowerCase().includes(q)) ?? false);
    return matchesCategory && matchesSearch;
  });

  const unfiltered = selectedCategory === 'All' && searchQuery === '';
  const latestPosts = filteredPosts.slice(0, 3);
  const remainingPosts = filteredPosts.slice(3);

  return (
    <>
      {/* Filters: hairline search + text tabs, no pills */}
      <section className="sticky top-20 z-40 border-b border-gray-200 bg-white/95 backdrop-blur">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:w-80">
              <Search className="absolute left-0 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search articles by title, topic, or tag..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border-0 border-b border-gray-200 bg-transparent py-2 pl-7 pr-2 text-sm text-black placeholder:text-gray-400 focus:border-blue-700 focus:outline-none focus:ring-0"
              />
            </div>
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
        </div>
      </section>

      {/* Latest Posts */}
      {latestPosts.length > 0 && unfiltered && (
        <section className="bg-white">
          <div className="mx-auto max-w-7xl px-6 py-14 md:py-16">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">/ Latest</p>
            <h2 className={`text-2xl font-bold tracking-tight sm:text-3xl ${v4Display}`}>
              Latest articles
            </h2>
            <div className="mt-10 grid auto-rows-[minmax(280px,auto)] gap-5 lg:grid-cols-3">
              {latestPosts.map((post, index) => (
                <FeaturedPostCard key={post.slug} post={post} large={index === 0} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Posts */}
      <section className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-14 md:py-16">
          {unfiltered && latestPosts.length > 0 && remainingPosts.length > 0 && (
            <>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">/ Archive</p>
              <h2 className={`mb-10 text-2xl font-bold tracking-tight sm:text-3xl ${v4Display}`}>
                More articles
              </h2>
            </>
          )}

          {filteredPosts.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-lg text-gray-500">No articles found matching your criteria.</p>
              <button
                onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
                className="group mt-4 inline-flex items-center gap-1 text-sm font-semibold text-blue-700 hover:underline"
              >
                Clear the filters
                <ArrowUpRight size={15} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>
            </div>
          ) : (
            <>
              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {(unfiltered && latestPosts.length > 0 ? remainingPosts : filteredPosts).map((post) => (
                  <BlogPostCard key={post.slug} post={post} />
                ))}
              </div>

              {hasMore && unfiltered && (
                <div className="mt-12 text-center">
                  <p className="mb-4 text-sm text-gray-500">
                    Showing {blogPosts.length} of {total} articles
                  </p>
                  <button
                    onClick={loadMorePosts}
                    disabled={isLoadingMore}
                    className="group inline-flex items-center gap-1 text-sm font-semibold text-blue-700 hover:underline disabled:text-gray-400 disabled:no-underline"
                  >
                    {isLoadingMore ? 'Loading...' : 'Load more articles'}
                    <ArrowUpRight size={15} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
}

interface PostCardProps {
  post: BlogListItem;
  large?: boolean;
}

function FeaturedPostCard({ post, large }: PostCardProps) {
  const readTime = post.read_time_minutes ? `${post.read_time_minutes} min read` : '5 min read';
  const dateStr = post.published_at || post.created_at || new Date().toISOString();

  if (large) {
    return (
      <Link
        href={`/blogs/${post.slug}`}
        className={`group flex flex-col overflow-hidden rounded-2xl bg-white transition-transform duration-300 hover:-translate-y-1 lg:col-span-2 lg:row-span-2 ${CARD_SHADOW}`}
      >
        <div className="relative min-h-[240px] flex-1">
          {post.featured_image_url ? (
            <Image
              src={post.featured_image_url}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              sizes="(max-width: 1024px) 100vw, 66vw"
            />
          ) : (
            <div className="h-full w-full bg-gray-100" />
          )}
        </div>
        <div className="p-7 lg:p-8">
          {post.category && (
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-blue-700">
              {post.category}
            </p>
          )}
          <h3 className={`mt-3 text-2xl font-bold leading-snug text-black transition-colors group-hover:text-[#1D4ED8] lg:text-3xl ${v4Display}`}>
            {post.title}
          </h3>
          {post.excerpt && (
            <p className="mt-3 line-clamp-2 text-[15px] leading-relaxed text-gray-600">{post.excerpt}</p>
          )}
          <div className="mt-5 flex items-center justify-between">
            <span className="text-xs text-gray-500">
              {formatDate(dateStr)} &middot; {readTime}
            </span>
            <span className="inline-flex items-center gap-1 text-sm font-semibold text-blue-700">
              Read the article
              <ArrowUpRight size={15} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </span>
          </div>
        </div>
      </Link>
    );
  }

  return <BlogPostCard post={post} />;
}

function BlogPostCard({ post }: PostCardProps) {
  const readTime = post.read_time_minutes ? `${post.read_time_minutes} min read` : '5 min read';
  const dateStr = post.published_at || post.created_at || new Date().toISOString();

  return (
    <Link
      href={`/blogs/${post.slug}`}
      className={`group flex flex-col overflow-hidden rounded-2xl bg-white transition-transform duration-300 hover:-translate-y-1 ${CARD_SHADOW}`}
    >
      <div className="relative aspect-video">
        {post.featured_image_url ? (
          <Image
            src={post.featured_image_url}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="h-full w-full bg-gray-100" />
        )}
      </div>
      <div className="flex flex-1 flex-col p-6">
        {post.category && (
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-blue-700">
            {post.category}
          </p>
        )}
        <h3 className={`mt-3 line-clamp-2 text-lg font-bold leading-snug text-black transition-colors group-hover:text-[#1D4ED8] ${v4Display}`}>
          {post.title}
        </h3>
        {post.excerpt && (
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-gray-600">{post.excerpt}</p>
        )}
        <div className="flex-1" />
        <div className="mt-5 flex items-center justify-between border-t border-gray-200 pt-4">
          <span className="text-xs text-gray-500">
            {formatDate(dateStr)} &middot; {readTime}
          </span>
          <span className="inline-flex items-center gap-1 text-sm font-semibold text-blue-700">
            Read
            <ArrowUpRight size={14} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
