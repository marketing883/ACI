'use client';

/**
 * Interactive blog listing UI. This is a client component for the search +
 * category filter + "load more" behaviour, but it is SEEDED FROM SERVER
 * PROPS (`initialPosts`) rather than fetching in useEffect. That is the
 * whole point of the SSR refactor: because the data arrives as props, Next
 * renders every post card — and its `<a href="/blogs/{slug}">` — into the
 * initial HTML, so crawlers see real links. The previous version fetched in
 * useEffect, so the server HTML had zero post links and ~344 posts were
 * orphaned. The numbered, crawlable pagination for the full archive lives in
 * the server page (`/blogs/page/[page]`); "Load More" here is a JS-only
 * convenience layered on page 1.
 */

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Search, Calendar, Clock } from 'lucide-react';
import Button from '@/components/ui/Button';
import type { BlogListItem } from '@/lib/content/blog';

const categories = ['All', 'Data Engineering', 'Applied AI & ML', 'Cloud Modernization', 'MarTech & CDP', 'Cyber Security', 'Digital Transformation'];

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
      {/* Filters */}
      <section className="bg-white py-6 sticky top-20 z-40 border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search articles by title, topic, or tag..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border-0 rounded-full focus:ring-2 focus:ring-[var(--aci-primary)] focus:bg-white transition-all"
              />
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
                    selectedCategory === category
                      ? 'bg-gradient-to-r from-[var(--aci-primary)] to-blue-600 text-white shadow-lg shadow-blue-500/25 scale-105'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900 hover:scale-105'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Latest Posts Hero */}
      {latestPosts.length > 0 && unfiltered && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-[var(--aci-secondary)] mb-8">Latest Articles</h2>
            <div className="grid lg:grid-cols-3 gap-6 auto-rows-[minmax(280px,auto)]">
              {latestPosts.map((post, index) => (
                <FeaturedPostCard key={post.slug} post={post} large={index === 0} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Posts */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {unfiltered && latestPosts.length > 0 && remainingPosts.length > 0 && (
            <h2 className="text-2xl font-bold text-[var(--aci-secondary)] mb-8">More Articles</h2>
          )}

          {filteredPosts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">No articles found matching your criteria.</p>
              <Button
                variant="secondary"
                className="mt-4"
                onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {(unfiltered && latestPosts.length > 0 ? remainingPosts : filteredPosts).map((post) => (
                  <BlogPostCard key={post.slug} post={post} />
                ))}
              </div>

              {hasMore && unfiltered && (
                <div className="mt-12 text-center">
                  <p className="text-sm text-gray-500 mb-4">
                    Showing {blogPosts.length} of {total} articles
                  </p>
                  <Button variant="secondary" onClick={loadMorePosts} disabled={isLoadingMore}>
                    {isLoadingMore ? 'Loading...' : 'Load More Articles'}
                  </Button>
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
  const author = post.author_name || 'ACI Infotech';

  if (large) {
    return (
      <Link
        href={`/blogs/${post.slug}`}
        className="group lg:col-span-2 lg:row-span-2 bg-[var(--aci-secondary)] rounded-2xl overflow-hidden relative min-h-[400px] lg:min-h-[580px]"
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent z-10" />
        <div className="absolute inset-0">
          {post.featured_image_url ? (
            <Image src={post.featured_image_url} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 1024px) 100vw, 66vw" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[var(--aci-primary)] to-[var(--aci-secondary)]" />
          )}
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
          <div className="flex items-center gap-4 mb-4">
            {post.category && (
              <span className="px-3 py-1.5 bg-[var(--aci-primary)] text-white text-sm font-medium rounded-full">{post.category}</span>
            )}
            <span className="text-gray-300 text-sm">{formatDate(dateStr)}</span>
          </div>
          <h3 className="text-2xl lg:text-3xl font-bold text-white mb-4 group-hover:text-[var(--aci-primary-light)] transition-colors">{post.title}</h3>
          <p className="text-gray-300 mb-4 line-clamp-2">{post.excerpt}</p>
          <div className="flex items-center gap-3">
            {post.author_image_url ? (
              <Image src={post.author_image_url} alt={author} width={40} height={40} className="rounded-full object-cover" />
            ) : (
              <div className="w-10 h-10 bg-[var(--aci-primary)] rounded-full flex items-center justify-center text-white font-bold">{author.charAt(0)}</div>
            )}
            <div>
              <div className="text-white font-medium">{author}</div>
              <div className="text-gray-400 text-sm">{readTime}</div>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/blogs/${post.slug}`} className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all">
      <div className="aspect-video relative">
        {post.featured_image_url ? (
          <Image src={post.featured_image_url} alt={post.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300" />
        )}
        {post.category && (
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 bg-[var(--aci-primary)] text-white text-xs font-medium rounded">{post.category}</span>
          </div>
        )}
      </div>
      <div className="p-6">
        <h3 className="text-lg font-bold text-[var(--aci-secondary)] mb-2 group-hover:text-[var(--aci-primary)] transition-colors line-clamp-2">{post.title}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{post.excerpt}</p>
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>{author}</span>
          <span>{readTime}</span>
        </div>
      </div>
    </Link>
  );
}

function BlogPostCard({ post }: PostCardProps) {
  const readTime = post.read_time_minutes ? `${post.read_time_minutes} min read` : '5 min read';
  const dateStr = post.published_at || post.created_at || new Date().toISOString();
  const author = post.author_name || 'ACI Infotech';

  return (
    <Link href={`/blogs/${post.slug}`} className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all hover:-translate-y-1">
      <div className="aspect-video relative">
        {post.featured_image_url ? (
          <Image src={post.featured_image_url} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200" />
        )}
        {post.category && (
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 bg-[var(--aci-primary)] text-white text-xs font-medium rounded">{post.category}</span>
          </div>
        )}
      </div>
      <div className="p-6">
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
          <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{formatDate(dateStr)}</span>
          <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{readTime}</span>
        </div>
        <h3 className="text-lg font-bold text-[var(--aci-secondary)] mb-2 group-hover:text-[var(--aci-primary)] transition-colors line-clamp-2">{post.title}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{post.excerpt}</p>
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">{tag}</span>
            ))}
          </div>
        )}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-3">
            {post.author_image_url ? (
              <Image src={post.author_image_url} alt={author} width={32} height={32} className="rounded-full object-cover" />
            ) : (
              <div className="w-8 h-8 bg-[var(--aci-primary)] rounded-full flex items-center justify-center text-white text-sm font-bold">{author.charAt(0)}</div>
            )}
            <span className="text-sm text-gray-700">{author}</span>
          </div>
          <span className="text-[var(--aci-primary)] text-sm font-medium inline-flex items-center gap-1 group-hover:gap-2 transition-all">
            Read <ArrowRight className="w-4 h-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}
