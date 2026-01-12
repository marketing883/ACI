'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Search, Calendar, Clock, User } from 'lucide-react';
import Button from '@/components/ui/Button';

// Types
interface BlogPost {
  id?: string;
  slug: string;
  title: string;
  excerpt: string;
  author_name: string;
  author_title?: string;
  author_image_url?: string;
  category: string;
  tags: string[];
  featured_image_url?: string;
  read_time_minutes?: number;
  published_at?: string;
  created_at?: string;
  is_featured?: boolean;
  is_published?: boolean;
}

// Demo data - fallback when no real data
const demoBlogPosts: BlogPost[] = [
  {
    slug: 'building-enterprise-data-mesh-architecture',
    title: 'Building an Enterprise Data Mesh Architecture: A Practical Guide',
    excerpt: 'Learn how to implement a data mesh architecture that scales with your organization while maintaining data quality and governance.',
    author_name: 'Jag Tangirala',
    author_title: 'CEO & Founder',
    category: 'Data Engineering',
    tags: ['Data Mesh', 'Architecture', 'Data Governance', 'Enterprise'],
    featured_image_url: '/images/blog/data-mesh.jpg',
    read_time_minutes: 12,
    published_at: '2025-01-03',
    is_featured: true,
  },
  {
    slug: 'ai-governance-enterprise-guide',
    title: 'AI Governance for the Enterprise: From Policy to Practice',
    excerpt: 'A comprehensive framework for implementing AI governance that satisfies regulators while enabling innovation.',
    author_name: 'Sarah Chen',
    author_title: 'Head of AI Solutions',
    category: 'Applied AI & ML',
    tags: ['AI Governance', 'Enterprise AI', 'Compliance', 'ArqAI'],
    featured_image_url: '/images/blog/ai-governance.jpg',
    read_time_minutes: 10,
    published_at: '2024-12-18',
    is_featured: true,
  },
  {
    slug: 'databricks-vs-snowflake-2025',
    title: 'Databricks vs Snowflake in 2025: Choosing the Right Platform',
    excerpt: 'An objective comparison of the two leading data platforms, including real-world performance benchmarks and cost analysis.',
    author_name: 'Michael Torres',
    author_title: 'Principal Data Architect',
    category: 'Data Engineering',
    tags: ['Databricks', 'Snowflake', 'Data Platform', 'Comparison'],
    featured_image_url: '/images/blog/databricks-snowflake.jpg',
    read_time_minutes: 15,
    published_at: '2024-12-10',
    is_featured: true,
  },
  {
    slug: 'zero-trust-security-implementation',
    title: 'Implementing Zero Trust Security: Lessons from 50+ Enterprise Deployments',
    excerpt: 'Practical insights from deploying zero trust architectures across Fortune 500 companies.',
    author_name: 'David Park',
    author_title: 'Security Practice Lead',
    category: 'Cyber Security',
    tags: ['Zero Trust', 'Security', 'Enterprise', 'Architecture'],
    featured_image_url: '/images/blog/zero-trust.jpg',
    read_time_minutes: 8,
    published_at: '2024-12-05',
    is_featured: false,
  },
  {
    slug: 'mlops-best-practices-production',
    title: 'MLOps Best Practices: Taking Models from Notebook to Production',
    excerpt: 'A battle-tested playbook for deploying and monitoring ML models in enterprise production environments.',
    author_name: 'Sarah Chen',
    author_title: 'Head of AI Solutions',
    category: 'Applied AI & ML',
    tags: ['MLOps', 'Machine Learning', 'Production', 'DevOps'],
    featured_image_url: '/images/blog/mlops.jpg',
    read_time_minutes: 11,
    published_at: '2024-11-28',
    is_featured: false,
  },
  {
    slug: 'customer-data-platform-selection',
    title: 'How to Select a Customer Data Platform: A Decision Framework',
    excerpt: 'Cut through the CDP marketing noise with this practical framework for evaluating and selecting the right platform.',
    author_name: 'Amanda Rodriguez',
    author_title: 'MarTech Practice Lead',
    category: 'MarTech & CDP',
    tags: ['CDP', 'MarTech', 'Customer Data', 'Evaluation'],
    featured_image_url: '/images/blog/cdp-selection.jpg',
    read_time_minutes: 9,
    published_at: '2024-11-20',
    is_featured: false,
  },
];

const categories = ['All', 'Data Engineering', 'Applied AI & ML', 'Cloud Modernization', 'MarTech & CDP', 'Cyber Security', 'Digital Transformation'];

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isRealData, setIsRealData] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [total, setTotal] = useState(0);

  const POSTS_PER_PAGE = 12;

  // Fetch blogs from database
  useEffect(() => {
    async function fetchBlogs() {
      setIsLoading(true);

      try {
        // Use API endpoint that bypasses RLS with pagination
        const response = await fetch(`/api/admin/blogs?published=true&limit=${POSTS_PER_PAGE}&offset=0`);
        const result = await response.json();

        if (result.error) {
          console.error('Error fetching blogs:', result.error);
          setBlogPosts(demoBlogPosts);
          setIsRealData(false);
        } else if (result.posts && result.posts.length > 0) {
          setBlogPosts(result.posts);
          setIsRealData(true);
          setHasMore(result.hasMore || false);
          setTotal(result.total || result.posts.length);
        } else if (result.demo) {
          // Demo mode
          setBlogPosts(demoBlogPosts);
          setIsRealData(false);
        } else {
          // No data in database, use demo
          setBlogPosts(demoBlogPosts);
          setIsRealData(false);
        }
      } catch (error) {
        console.error('Error fetching blogs:', error);
        setBlogPosts(demoBlogPosts);
        setIsRealData(false);
      }

      setIsLoading(false);
    }

    fetchBlogs();
  }, []);

  // Load more posts
  async function loadMorePosts() {
    if (isLoadingMore || !hasMore) return;

    setIsLoadingMore(true);
    try {
      const response = await fetch(`/api/admin/blogs?published=true&limit=${POSTS_PER_PAGE}&offset=${blogPosts.length}`);
      const result = await response.json();

      if (result.posts && result.posts.length > 0) {
        setBlogPosts(prev => [...prev, ...result.posts]);
        setHasMore(result.hasMore || false);
      }
    } catch (error) {
      console.error('Error loading more posts:', error);
    } finally {
      setIsLoadingMore(false);
    }
  }

  // Filter posts based on category and search - maintain published_at DESC order from API
  const filteredPosts = blogPosts.filter((post) => {
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    const matchesSearch = searchQuery === '' ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Latest posts for hero section (first 3 posts by published_at DESC)
  const latestPosts = filteredPosts.slice(0, 3);
  // Remaining posts for grid
  const remainingPosts = filteredPosts.slice(3);

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-[var(--aci-secondary)] pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <p className="text-[var(--aci-primary-light)] font-medium mb-4 tracking-wide uppercase">
              Insights & Thought Leadership
            </p>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Enterprise Technology Blog
            </h1>
            <p className="text-xl text-gray-400">
              Deep dives into data engineering, AI/ML, cloud architecture, and enterprise technology trends from our team of practitioners.
            </p>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="bg-white py-6 sticky top-20 z-40 border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
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

            {/* Category Filters */}
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

      {/* Loading State */}
      {isLoading && (
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--aci-primary)]"></div>
            </div>
          </div>
        </section>
      )}

      {/* Latest Posts Hero - Shows 3 most recent articles prominently */}
      {!isLoading && latestPosts.length > 0 && selectedCategory === 'All' && searchQuery === '' && (
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
      {!isLoading && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {(selectedCategory === 'All' && searchQuery === '' && latestPosts.length > 0 && remainingPosts.length > 0) && (
              <h2 className="text-2xl font-bold text-[var(--aci-secondary)] mb-8">More Articles</h2>
            )}

            {filteredPosts.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-gray-500 text-lg">No articles found matching your criteria.</p>
                <Button
                  variant="secondary"
                  className="mt-4"
                  onClick={() => {
                    setSelectedCategory('All');
                    setSearchQuery('');
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            ) : (
              <>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {(selectedCategory === 'All' && searchQuery === '' && latestPosts.length > 0 ? remainingPosts : filteredPosts).map((post) => (
                    <BlogPostCard key={post.slug} post={post} />
                  ))}
                </div>

                {/* Load More Button */}
                {hasMore && isRealData && selectedCategory === 'All' && searchQuery === '' && (
                  <div className="mt-12 text-center">
                    <p className="text-sm text-gray-500 mb-4">
                      Showing {blogPosts.length} of {total} articles
                    </p>
                    <Button
                      variant="secondary"
                      onClick={loadMorePosts}
                      disabled={isLoadingMore}
                    >
                      {isLoadingMore ? 'Loading...' : 'Load More Articles'}
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      )}

      {/* Newsletter CTA */}
      <section className="py-20 bg-[var(--aci-secondary)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Stay Ahead of Enterprise Tech Trends
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            Join 5,000+ technology leaders who receive our weekly insights on data, AI, and digital transformation.
          </p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:ring-2 focus:ring-[var(--aci-primary)]"
            />
            <Button type="submit" variant="primary" size="lg">
              Subscribe
            </Button>
          </form>
          <p className="text-sm text-gray-500 mt-4">
            No spam. Unsubscribe anytime.
          </p>
        </div>
      </section>
    </main>
  );
}

// Featured Post Card (larger for first item)
interface PostCardProps {
  post: BlogPost;
  large?: boolean;
}

function FeaturedPostCard({ post, large }: PostCardProps) {
  const readTime = post.read_time_minutes ? `${post.read_time_minutes} min read` : '5 min read';
  const dateStr = post.published_at || post.created_at || new Date().toISOString();

  if (large) {
    return (
      <Link
        href={`/blog/${post.slug}`}
        className="group lg:col-span-2 lg:row-span-2 bg-[var(--aci-secondary)] rounded-2xl overflow-hidden relative min-h-[400px] lg:min-h-[580px]"
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent z-10" />
        <div className="absolute inset-0">
          {post.featured_image_url ? (
            <Image
              src={post.featured_image_url}
              alt={post.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 1024px) 100vw, 66vw"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[var(--aci-primary)] to-[var(--aci-secondary)]" />
          )}
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
          <div className="flex items-center gap-4 mb-4">
            <span className="px-3 py-1.5 bg-[var(--aci-primary)] text-white text-sm font-medium rounded-full">
              {post.category}
            </span>
            <span className="text-gray-300 text-sm">{formatDate(dateStr)}</span>
          </div>
          <h3 className="text-2xl lg:text-3xl font-bold text-white mb-4 group-hover:text-[var(--aci-primary-light)] transition-colors">
            {post.title}
          </h3>
          <p className="text-gray-300 mb-4 line-clamp-2">{post.excerpt}</p>
          <div className="flex items-center gap-3">
            {post.author_image_url ? (
              <Image
                src={post.author_image_url}
                alt={post.author_name}
                width={40}
                height={40}
                className="rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 bg-[var(--aci-primary)] rounded-full flex items-center justify-center text-white font-bold">
                {post.author_name.charAt(0)}
              </div>
            )}
            <div>
              <div className="text-white font-medium">{post.author_name}</div>
              <div className="text-gray-400 text-sm">{readTime}</div>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all"
    >
      <div className="aspect-video relative">
        {post.featured_image_url ? (
          <Image
            src={post.featured_image_url}
            alt={post.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300" />
        )}
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-[var(--aci-primary)] text-white text-xs font-medium rounded">
            {post.category}
          </span>
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-lg font-bold text-[var(--aci-secondary)] mb-2 group-hover:text-[var(--aci-primary)] transition-colors line-clamp-2">
          {post.title}
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{post.excerpt}</p>
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>{post.author_name}</span>
          <span>{readTime}</span>
        </div>
      </div>
    </Link>
  );
}

// Regular Blog Post Card
function BlogPostCard({ post }: PostCardProps) {
  const readTime = post.read_time_minutes ? `${post.read_time_minutes} min read` : '5 min read';
  const dateStr = post.published_at || post.created_at || new Date().toISOString();

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all hover:-translate-y-1"
    >
      {/* Image */}
      <div className="aspect-video relative">
        {post.featured_image_url ? (
          <Image
            src={post.featured_image_url}
            alt={post.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200" />
        )}
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-[var(--aci-primary)] text-white text-xs font-medium rounded">
            {post.category}
          </span>
        </div>
      </div>

      <div className="p-6">
        {/* Meta */}
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
          <span className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            {formatDate(dateStr)}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {readTime}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-[var(--aci-secondary)] mb-2 group-hover:text-[var(--aci-primary)] transition-colors line-clamp-2">
          {post.title}
        </h3>

        {/* Excerpt */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{post.excerpt}</p>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Author */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-3">
            {post.author_image_url ? (
              <Image
                src={post.author_image_url}
                alt={post.author_name}
                width={32}
                height={32}
                className="rounded-full object-cover"
              />
            ) : (
              <div className="w-8 h-8 bg-[var(--aci-primary)] rounded-full flex items-center justify-center text-white text-sm font-bold">
                {post.author_name.charAt(0)}
              </div>
            )}
            <span className="text-sm text-gray-700">{post.author_name}</span>
          </div>
          <span className="text-[var(--aci-primary)] text-sm font-medium inline-flex items-center gap-1 group-hover:gap-2 transition-all">
            Read <ArrowRight className="w-4 h-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}
