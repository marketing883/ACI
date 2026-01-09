'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Clock, Download, FileText, X, Mail, Building2, User, Loader2 } from 'lucide-react';
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
  description: string;
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

// Download Modal Component
function WhitepaperDownloadModal({
  isOpen,
  onClose,
  whitepaper,
}: {
  isOpen: boolean;
  onClose: () => void;
  whitepaper: Whitepaper | null;
}) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      setIsSubmitting(false);
      return;
    }

    const personalDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'aol.com', 'icloud.com'];
    const emailDomain = formData.email.split('@')[1]?.toLowerCase();
    if (personalDomains.includes(emailDomain)) {
      setError('Please use your work email address');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/whitepaper-leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          whitepaper_slug: whitepaper?.slug,
          whitepaper_title: whitepaper?.title,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit');
      }

      const data = await response.json();
      window.location.href = `/whitepapers/thank-you?token=${data.downloadToken}&whitepaper=${whitepaper?.slug}`;
    } catch {
      setError('Something went wrong. Please try again.');
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !whitepaper) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-white rounded-xl shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>

        <div className="p-6">
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-[var(--aci-primary)]/10 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Download className="w-6 h-6 text-[var(--aci-primary)]" />
            </div>
            <h3 className="text-xl font-bold text-[var(--aci-secondary)]">
              Download Whitepaper
            </h3>
            <p className="text-gray-600 text-sm mt-2">
              {whitepaper.title}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[var(--aci-primary)] focus:border-transparent"
                  placeholder="John Smith"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Work Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[var(--aci-primary)] focus:border-transparent"
                  placeholder="john@company.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  required
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[var(--aci-primary)] focus:border-transparent"
                  placeholder="Acme Corp"
                />
              </div>
            </div>

            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-[var(--aci-primary)] text-white font-semibold rounded-lg hover:bg-[var(--aci-primary-dark)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  Get Whitepaper
                </>
              )}
            </button>

            <p className="text-xs text-gray-500 text-center">
              By downloading, you agree to receive occasional updates from ACI Infotech.
              Unsubscribe anytime.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

// Featured Whitepaper Card Component
function FeaturedWhitepaperCard({
  whitepaper,
  onDownloadClick,
}: {
  whitepaper: Whitepaper;
  onDownloadClick: () => void;
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
          <p className="text-gray-300 text-sm line-clamp-3">
            {whitepaper.description}
          </p>
        </div>

        <div className="mt-6">
          <button
            onClick={onDownloadClick}
            className="w-full py-3 bg-white text-[var(--aci-secondary)] font-semibold rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
          >
            <Download className="w-5 h-5" />
            Download Free
          </button>
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
  viewAllUrl = "/blog",
  showWhitepaper = true,
}: BlogPreviewSectionProps) {
  const [featuredWhitepaper, setFeaturedWhitepaper] = useState<Whitepaper | null>(null);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
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
    description: 'A comprehensive guide to building resilient, AI-ready data platforms that scale with your business needs. Learn from 80+ enterprise deployments.',
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
                  href={`/blog/${post.slug}`}
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
                  onDownloadClick={() => setShowDownloadModal(true)}
                />
              )}
            </div>
          )}
        </div>

        {/* View All CTA */}
        <div className="text-center mt-12">
          <Button href={viewAllUrl} variant="secondary" size="lg">
            Read All Insights <ArrowRight className="w-4 h-4 ml-2" strokeWidth={1.5} />
          </Button>
        </div>
      </div>

      {/* Download Modal */}
      <WhitepaperDownloadModal
        isOpen={showDownloadModal}
        onClose={() => setShowDownloadModal(false)}
        whitepaper={displayWhitepaper}
      />
    </section>
  );
}
