'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Search, Calendar, Clock, User } from 'lucide-react';
import Button from '@/components/ui/Button';

// Blog data - in production, fetch from Supabase
const allBlogPosts = [
  {
    slug: 'building-enterprise-data-mesh-architecture',
    title: 'Building an Enterprise Data Mesh Architecture: A Practical Guide',
    excerpt: 'Learn how to implement a data mesh architecture that scales with your organization while maintaining data quality and governance.',
    author: 'Jag Tangirala',
    author_title: 'CEO & Founder',
    author_image: '/images/team/jag-tangirala.jpg',
    category: 'Data Engineering',
    tags: ['Data Mesh', 'Architecture', 'Data Governance', 'Enterprise'],
    featured_image: '/images/blog/data-mesh.jpg',
    read_time: '12 min read',
    date: '2025-01-03',
    is_featured: true,
  },
  {
    slug: 'ai-governance-enterprise-guide',
    title: 'AI Governance for the Enterprise: From Policy to Practice',
    excerpt: 'A comprehensive framework for implementing AI governance that satisfies regulators while enabling innovation.',
    author: 'Sarah Chen',
    author_title: 'Head of AI Solutions',
    author_image: '/images/team/sarah-chen.jpg',
    category: 'Applied AI & ML',
    tags: ['AI Governance', 'Enterprise AI', 'Compliance', 'ArqAI'],
    featured_image: '/images/blog/ai-governance.jpg',
    read_time: '10 min read',
    date: '2024-12-18',
    is_featured: true,
  },
  {
    slug: 'databricks-vs-snowflake-2025',
    title: 'Databricks vs Snowflake in 2025: Choosing the Right Platform',
    excerpt: 'An objective comparison of the two leading data platforms, including real-world performance benchmarks and cost analysis.',
    author: 'Michael Torres',
    author_title: 'Principal Data Architect',
    author_image: '/images/team/michael-torres.jpg',
    category: 'Data Engineering',
    tags: ['Databricks', 'Snowflake', 'Data Platform', 'Comparison'],
    featured_image: '/images/blog/databricks-snowflake.jpg',
    read_time: '15 min read',
    date: '2024-12-10',
    is_featured: true,
  },
  {
    slug: 'zero-trust-security-implementation',
    title: 'Implementing Zero Trust Security: Lessons from 50+ Enterprise Deployments',
    excerpt: 'Practical insights from deploying zero trust architectures across Fortune 500 companies.',
    author: 'David Park',
    author_title: 'Security Practice Lead',
    author_image: '/images/team/david-park.jpg',
    category: 'Cyber Security',
    tags: ['Zero Trust', 'Security', 'Enterprise', 'Architecture'],
    featured_image: '/images/blog/zero-trust.jpg',
    read_time: '8 min read',
    date: '2024-12-05',
    is_featured: false,
  },
  {
    slug: 'mlops-best-practices-production',
    title: 'MLOps Best Practices: Taking Models from Notebook to Production',
    excerpt: 'A battle-tested playbook for deploying and monitoring ML models in enterprise production environments.',
    author: 'Sarah Chen',
    author_title: 'Head of AI Solutions',
    author_image: '/images/team/sarah-chen.jpg',
    category: 'Applied AI & ML',
    tags: ['MLOps', 'Machine Learning', 'Production', 'DevOps'],
    featured_image: '/images/blog/mlops.jpg',
    read_time: '11 min read',
    date: '2024-11-28',
    is_featured: false,
  },
  {
    slug: 'customer-data-platform-selection',
    title: 'How to Select a Customer Data Platform: A Decision Framework',
    excerpt: 'Cut through the CDP marketing noise with this practical framework for evaluating and selecting the right platform.',
    author: 'Amanda Rodriguez',
    author_title: 'MarTech Practice Lead',
    author_image: '/images/team/amanda-rodriguez.jpg',
    category: 'MarTech & CDP',
    tags: ['CDP', 'MarTech', 'Customer Data', 'Evaluation'],
    featured_image: '/images/blog/cdp-selection.jpg',
    read_time: '9 min read',
    date: '2024-11-20',
    is_featured: false,
  },
  {
    slug: 'cloud-cost-optimization-strategies',
    title: '10 Cloud Cost Optimization Strategies That Actually Work',
    excerpt: 'Move beyond FinOps buzzwords with these proven strategies that have saved our clients over $50M in cloud costs.',
    author: 'James Wilson',
    author_title: 'Cloud Practice Lead',
    author_image: '/images/team/james-wilson.jpg',
    category: 'Cloud Modernization',
    tags: ['Cloud', 'Cost Optimization', 'FinOps', 'AWS', 'Azure'],
    featured_image: '/images/blog/cloud-costs.jpg',
    read_time: '7 min read',
    date: '2024-11-15',
    is_featured: false,
  },
  {
    slug: 'real-time-analytics-architecture',
    title: 'Building Real-Time Analytics: Architecture Patterns for Sub-Second Insights',
    excerpt: 'Design patterns and technology choices for building real-time analytics systems that handle millions of events per second.',
    author: 'Michael Torres',
    author_title: 'Principal Data Architect',
    author_image: '/images/team/michael-torres.jpg',
    category: 'Data Engineering',
    tags: ['Real-Time', 'Analytics', 'Streaming', 'Kafka'],
    featured_image: '/images/blog/realtime-analytics.jpg',
    read_time: '14 min read',
    date: '2024-11-08',
    is_featured: false,
  },
  {
    slug: 'llm-enterprise-integration',
    title: 'Integrating LLMs into Enterprise Workflows: A Practical Approach',
    excerpt: 'How to effectively integrate large language models into your enterprise applications without compromising security.',
    author: 'Sarah Chen',
    author_title: 'Head of AI Solutions',
    author_image: '/images/team/sarah-chen.jpg',
    category: 'Applied AI & ML',
    tags: ['LLM', 'Enterprise AI', 'Integration', 'GenAI'],
    featured_image: '/images/blog/llm-enterprise.jpg',
    read_time: '13 min read',
    date: '2024-11-01',
    is_featured: false,
  },
  {
    slug: 'data-quality-automation',
    title: 'Automating Data Quality: From Reactive Fixes to Proactive Prevention',
    excerpt: 'How to build automated data quality systems that catch issues before they impact business decisions.',
    author: 'Michael Torres',
    author_title: 'Principal Data Architect',
    author_image: '/images/team/michael-torres.jpg',
    category: 'Data Engineering',
    tags: ['Data Quality', 'Automation', 'Data Governance', 'Testing'],
    featured_image: '/images/blog/data-quality.jpg',
    read_time: '10 min read',
    date: '2024-10-25',
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

  const filteredPosts = allBlogPosts.filter((post) => {
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    const matchesSearch = searchQuery === '' ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const featuredPosts = filteredPosts.filter(p => p.is_featured);
  const regularPosts = filteredPosts.filter(p => !p.is_featured);

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
      <section className="bg-gray-50 py-6 sticky top-20 z-40 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[var(--aci-primary)] focus:border-transparent"
              />
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? 'bg-[var(--aci-primary)] text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      {featuredPosts.length > 0 && selectedCategory === 'All' && searchQuery === '' && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-[var(--aci-secondary)] mb-8">Featured Articles</h2>
            <div className="grid lg:grid-cols-3 gap-8">
              {featuredPosts.slice(0, 3).map((post, index) => (
                <FeaturedPostCard key={post.slug} post={post} large={index === 0} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Posts */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {(selectedCategory === 'All' && searchQuery === '' && featuredPosts.length > 0) && (
            <h2 className="text-2xl font-bold text-[var(--aci-secondary)] mb-8">Latest Articles</h2>
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
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {(selectedCategory === 'All' && searchQuery === '' && featuredPosts.length > 0 ? regularPosts : filteredPosts).map((post) => (
                <BlogPostCard key={post.slug} post={post} />
              ))}
            </div>
          )}
        </div>
      </section>

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
interface FeaturedPostCardProps {
  post: typeof allBlogPosts[0];
  large?: boolean;
}

function FeaturedPostCard({ post, large }: FeaturedPostCardProps) {
  if (large) {
    return (
      <Link
        href={`/blog/${post.slug}`}
        className="group lg:col-span-2 lg:row-span-2 bg-[var(--aci-secondary)] rounded-2xl overflow-hidden relative"
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10" />
        <div className="aspect-[16/9] lg:aspect-auto lg:h-full bg-gray-800">
          {/* Placeholder for image */}
          <div className="w-full h-full bg-gradient-to-br from-[var(--aci-primary)] to-[var(--aci-secondary)]" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
          <div className="flex items-center gap-4 mb-4">
            <span className="px-3 py-1 bg-[var(--aci-primary)] text-white text-sm font-medium rounded">
              {post.category}
            </span>
            <span className="text-gray-300 text-sm">{formatDate(post.date)}</span>
          </div>
          <h3 className="text-2xl lg:text-3xl font-bold text-white mb-4 group-hover:text-[var(--aci-primary-light)] transition-colors">
            {post.title}
          </h3>
          <p className="text-gray-300 mb-4 line-clamp-2">{post.excerpt}</p>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[var(--aci-primary)] rounded-full flex items-center justify-center text-white font-bold">
              {post.author.charAt(0)}
            </div>
            <div>
              <div className="text-white font-medium">{post.author}</div>
              <div className="text-gray-400 text-sm">{post.read_time}</div>
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
      <div className="aspect-video bg-gradient-to-br from-gray-200 to-gray-300 relative">
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
          <span>{post.author}</span>
          <span>{post.read_time}</span>
        </div>
      </div>
    </Link>
  );
}

// Regular Blog Post Card
interface BlogPostCardProps {
  post: typeof allBlogPosts[0];
}

function BlogPostCard({ post }: BlogPostCardProps) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all hover:-translate-y-1"
    >
      {/* Image placeholder */}
      <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 relative">
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
            {formatDate(post.date)}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {post.read_time}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-[var(--aci-secondary)] mb-2 group-hover:text-[var(--aci-primary)] transition-colors line-clamp-2">
          {post.title}
        </h3>

        {/* Excerpt */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{post.excerpt}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
              {tag}
            </span>
          ))}
        </div>

        {/* Author */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[var(--aci-primary)] rounded-full flex items-center justify-center text-white text-sm font-bold">
              {post.author.charAt(0)}
            </div>
            <span className="text-sm text-gray-700">{post.author}</span>
          </div>
          <span className="text-[var(--aci-primary)] text-sm font-medium inline-flex items-center gap-1 group-hover:gap-2 transition-all">
            Read <ArrowRight className="w-4 h-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}
