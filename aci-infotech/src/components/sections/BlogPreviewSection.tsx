'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Clock, Download, FileText, Loader2, CheckCircle2 } from 'lucide-react';
import Button from '@/components/ui/Button';

interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  category: string;
  featured_image?: string;
  read_time?: string;
}

interface Whitepaper {
  id: string;
  slug: string;
  title: string;
  excerpt?: string;
  description: string;
  highlights?: string[];
  cover_image?: string;
  file_url?: string;
}

interface BlogPreviewSectionProps {
  headline?: string;
  subheadline?: string;
  posts: BlogPost[];
  viewAllUrl?: string;
  showWhitepaper?: boolean;
}

// Featured Whitepaper Card Component
function FeaturedWhitepaperCard({
  whitepaper,
}: {
  whitepaper: Whitepaper;
}) {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="bg-gradient-to-br from-[var(--aci-secondary)] to-[#0a2540] rounded-xl overflow-hidden h-full flex flex-col">
      {/* Cover Image */}
      <div className="relative h-40 bg-[#0a2540]">
        {whitepaper.cover_image && !imageError ? (
          <Image
            src={whitepaper.cover_image}
            alt={whitepaper.title}
            fill
            className="object-cover opacity-80"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[var(--aci-primary)] to-blue-700">
            <FileText className="w-16 h-16 text-white/30" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[var(--aci-secondary)]" />
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex-grow">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-xs font-medium mb-4 text-white">
            <FileText className="w-4 h-4" />
            Featured Whitepaper
          </div>
          <h3 className="text-xl font-bold mb-3 text-white">
            {whitepaper.title}
          </h3>
          <p className="text-gray-300 text-sm mb-4">
            {whitepaper.excerpt || whitepaper.description?.substring(0, 120)}
          </p>

          {/* Key Takeaways */}
          {whitepaper.highlights && whitepaper.highlights.length > 0 && (
            <div className="space-y-2">
              {whitepaper.highlights.slice(0, 3).map((highlight, index) => (
                <div key={index} className="flex items-start gap-2 text-sm text-gray-300">
                  <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                  <span>{highlight}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-6">
          <Link
            href={`/whitepapers/${whitepaper.slug}`}
            className="w-full py-3 bg-[#0052CC] text-white font-semibold rounded-lg hover:text-[#C4FF61] transition-all duration-200 flex items-center justify-center gap-2"
          >
            <Download className="w-5 h-5" />
            Download Free
          </Link>
          <Link
            href="/whitepapers"
            className="block text-center text-gray-300 text-sm mt-3 hover:text-white transition-colors"
          >
            View all whitepapers →
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function BlogPreviewSection({
  headline = "Thoughts and Insights",
  subheadline = "Technical depth from engineers who've been there",
  posts,
  viewAllUrl = "/blogs",
  showWhitepaper = true,
}: BlogPreviewSectionProps) {
  const [featuredWhitepaper, setFeaturedWhitepaper] = useState<Whitepaper | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchWhitepaper = async () => {
      try {
        const response = await fetch('/api/whitepapers/featured');
        if (response.ok) {
          const data = await response.json();
          if (data.whitepaper) {
            setFeaturedWhitepaper(data.whitepaper);
          }
        }
      } catch (error) {
        console.error('Error fetching whitepaper:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (showWhitepaper) {
      fetchWhitepaper();
    } else {
      setIsLoading(false);
    }
  }, [showWhitepaper]);

  // Fallback whitepaper for development
  const displayWhitepaper = featuredWhitepaper || {
    id: 'default',
    slug: 'enterprise-data-strategy-2025',
    title: 'Enterprise Data Strategy 2025',
    excerpt: 'Build resilient, AI-ready data platforms that scale with your business needs.',
    description: 'A comprehensive guide to building resilient, AI-ready data platforms that scale with your business needs. Learn from 80+ enterprise deployments.',
    highlights: [
      'Framework for AI-powered data architecture',
      'Cost optimization strategies that drive 40% savings',
      'Real-world case studies from Fortune 500 implementations',
    ],
    cover_image: '/images/whitepapers/data-strategy-cover.jpg',
  };

  return (
    <section className="py-20 bg-[#FAFAFA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0A1628] mb-3">
            {headline}
          </h2>
          <p className="text-gray-600">{subheadline}</p>
        </div>

        {/* Main Grid - Blog Posts (2/3) + Whitepaper (1/3) */}
        <div className={`grid gap-8 ${showWhitepaper ? 'lg:grid-cols-3' : ''}`}>
          {/* Blog Posts Column - 2/3 */}
          <div className={showWhitepaper ? 'lg:col-span-2' : ''}>
            <div className="grid md:grid-cols-2 gap-6">
              {posts.slice(0, showWhitepaper ? 4 : posts.length).map((post) => (
                <Link
                  key={post.slug}
                  href={`/blogs/${post.slug}`}
                  className="group bg-white rounded-[6px] overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
                >
                  {/* Image */}
                  <div className="relative h-40 bg-gray-100">
                    {post.featured_image ? (
                      <Image
                        src={post.featured_image}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#0052CC] to-[#003D99]">
                        <span className="text-white text-4xl font-bold opacity-20">
                          {post.title.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-[#0052CC]">
                        {post.category}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="font-semibold text-[#0A1628] mb-2 group-hover:text-[#0052CC] transition-colors line-clamp-2">
                      {post.title}
                    </h3>

                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{post.excerpt}</p>

                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{post.date}</span>
                      {post.read_time && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" strokeWidth={1.5} />
                          {post.read_time}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Whitepaper Column - 1/3 */}
          {showWhitepaper && (
            <div className="lg:col-span-1">
              {isLoading ? (
                <div className="bg-gradient-to-br from-[var(--aci-secondary)] to-[#0a2540] rounded-xl p-6 h-full flex items-center justify-center min-h-[400px]">
                  <Loader2 className="w-8 h-8 text-white animate-spin" />
                </div>
              ) : (
                <FeaturedWhitepaperCard
                  whitepaper={displayWhitepaper}
                />
              )}
            </div>
          )}
        </div>

        {/* View All CTA */}
        <div className="text-center mt-12">
          <Button href={viewAllUrl} variant="secondary" size="lg" rightIcon={<ArrowRight className="w-4 h-4" strokeWidth={1.5} />}>
            Read All Insights
          </Button>
        </div>
      </div>

    </section>
  );
}
