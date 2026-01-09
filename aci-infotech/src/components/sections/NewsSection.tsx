'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ExternalLink, Download, X, Mail, Building2, User, Loader2, FileText } from 'lucide-react';

interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  image_url?: string;
  source: string;
  date: string;
  url?: string;
  cta_text?: string;
}

interface Whitepaper {
  id: string;
  slug: string;
  title: string;
  description: string;
  cover_image?: string;
  file_url?: string;
}

interface NewsSectionProps {
  headline?: string;
  subheadline?: string;
  news: NewsItem[];
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

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      setIsSubmitting(false);
      return;
    }

    // Check for work email
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

      // Redirect to thank you page with download token
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

// Featured Whitepaper Component
function FeaturedWhitepaper({
  whitepaper,
  onDownloadClick,
}: {
  whitepaper: Whitepaper | null;
  onDownloadClick: () => void;
}) {
  if (!whitepaper) {
    // Fallback placeholder whitepaper
    return (
      <div className="bg-gradient-to-br from-[var(--aci-secondary)] to-[#0a2540] rounded-xl p-6 h-full flex flex-col justify-between text-white">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-xs font-medium mb-4">
            <FileText className="w-4 h-4" />
            Featured Whitepaper
          </div>
          <h3 className="text-xl font-bold mb-3">
            Enterprise Data Strategy 2025
          </h3>
          <p className="text-gray-300 text-sm mb-4 line-clamp-3">
            A comprehensive guide to building resilient, AI-ready data platforms that scale with your business needs.
          </p>
        </div>

        <div>
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
    );
  }

  return (
    <div className="bg-gradient-to-br from-[var(--aci-secondary)] to-[#0a2540] rounded-xl overflow-hidden h-full flex flex-col">
      {/* Cover Image */}
      {whitepaper.cover_image && (
        <div className="relative h-48 bg-[#0a2540]">
          <Image
            src={whitepaper.cover_image}
            alt={whitepaper.title}
            fill
            className="object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[var(--aci-secondary)]" />
        </div>
      )}

      {/* Content */}
      <div className="p-6 flex flex-col flex-grow text-white">
        <div className="flex-grow">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-xs font-medium mb-4">
            <FileText className="w-4 h-4" />
            Featured Whitepaper
          </div>
          <h3 className="text-xl font-bold mb-3">
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

export default function NewsSection({
  headline = "In The News",
  subheadline = "Recent recognition and partnerships",
  news,
  showWhitepaper = true,
}: NewsSectionProps) {
  const [featuredWhitepaper, setFeaturedWhitepaper] = useState<Whitepaper | null>(null);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch latest whitepaper from API
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
          <h2 className="text-3xl md:text-4xl font-bold text-[#0A1628] mb-3 font-[var(--font-title)]">
            {headline}
          </h2>
          <p className="text-gray-600">{subheadline}</p>
        </div>

        {/* Main Grid - News + Whitepaper */}
        <div className={`grid gap-6 ${showWhitepaper ? 'lg:grid-cols-3' : 'lg:grid-cols-1'}`}>
          {/* News Column */}
          <div className={showWhitepaper ? 'lg:col-span-2' : ''}>
            <div className="flex flex-col gap-4">
              {news.slice(0, showWhitepaper ? 4 : news.length).map((item) => (
                <article
                  key={item.id}
                  className="bg-white rounded-[6px] overflow-hidden shadow-sm hover:shadow-lg transition-all duration-200 group flex flex-col sm:flex-row"
                >
                  {/* Image - Left side */}
                  <div className="relative w-full sm:w-48 md:w-56 h-40 sm:h-auto flex-shrink-0 bg-gradient-to-br from-[#0A1628] to-[#1a2d47]">
                    {item.image_url ? (
                      <Image
                        src={item.image_url}
                        alt={item.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-[#0052CC]/20 flex items-center justify-center">
                            <FileText className="w-6 h-6 text-[#0052CC]" />
                          </div>
                          <span className="text-xs text-gray-400 font-medium">{item.source}</span>
                        </div>
                      </div>
                    )}
                    {/* Source badge overlay */}
                    <div className="absolute top-3 left-3">
                      <span className="px-2 py-1 bg-white/90 backdrop-blur-sm text-[#0052CC] text-xs font-semibold rounded">
                        {item.source}
                      </span>
                    </div>
                  </div>

                  {/* Content - Right side */}
                  <div className="p-5 flex flex-col justify-center flex-1">
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                      <span>{item.date}</span>
                    </div>

                    <h3 className="font-semibold text-[#0A1628] mb-2 group-hover:text-[#0052CC] transition-colors line-clamp-2">
                      {item.title}
                    </h3>

                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.excerpt}</p>

                    {item.url && (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#0052CC] text-sm font-medium inline-flex items-center gap-1 hover:gap-2 transition-all w-fit"
                      >
                        {item.cta_text || 'Read More'}
                        <ExternalLink className="w-3 h-3" strokeWidth={1.5} />
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* Whitepaper Column */}
          {showWhitepaper && (
            <div className="lg:col-span-1">
              {isLoading ? (
                <div className="bg-gradient-to-br from-[var(--aci-secondary)] to-[#0a2540] rounded-xl p-6 h-full flex items-center justify-center">
                  <Loader2 className="w-8 h-8 text-white animate-spin" />
                </div>
              ) : (
                <FeaturedWhitepaper
                  whitepaper={displayWhitepaper}
                  onDownloadClick={() => setShowDownloadModal(true)}
                />
              )}
            </div>
          )}
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
