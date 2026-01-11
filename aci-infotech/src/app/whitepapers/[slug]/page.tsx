'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  Download,
  FileText,
  ArrowLeft,
  Clock,
  Calendar,
  CheckCircle2,
  BookOpen,
  BarChart3,
  Lightbulb,
  Target,
  Users,
  Shield,
  Loader2,
  Mail,
  Building2,
  User,
  X,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import { trackFormSubmission, trackContentView } from '@/components/analytics/GoogleAnalytics';

interface Whitepaper {
  id: string;
  slug: string;
  title: string;
  description: string;
  cover_image: string;
  file_url: string;
  category: string;
  tags: string[];
  read_time: string;
  page_count: number;
  published_at: string;
  // Teaser content
  key_takeaways: string[];
  what_you_will_learn: string[];
  who_should_read: string[];
  executive_summary: string;
  table_of_contents: string[];
}

// Fallback whitepaper data
const fallbackWhitepapers: Record<string, Whitepaper> = {
  'enterprise-data-strategy-2025': {
    id: '1',
    slug: 'enterprise-data-strategy-2025',
    title: 'Enterprise Data Strategy 2025',
    description: 'A comprehensive guide to building resilient, AI-ready data platforms that scale with your business needs. Learn from 80+ enterprise deployments across industries.',
    cover_image: '/images/whitepapers/data-strategy-cover.png',
    file_url: '/whitepapers/pdfs/enterprise-data-strategy-2025.pdf',
    category: 'Data & Analytics',
    tags: ['Data Strategy', 'Enterprise Architecture', 'AI Readiness'],
    read_time: '25 min',
    page_count: 42,
    published_at: '2024-12-15',
    executive_summary: 'In 2025, enterprises face unprecedented pressure to transform their data infrastructure. This whitepaper provides a battle-tested framework for building data platforms that not only meet today\'s demands but anticipate tomorrow\'s AI-driven requirements. Based on insights from 80+ enterprise deployments, we reveal the patterns that separate successful data transformations from costly failures.',
    key_takeaways: [
      'The 5-layer architecture that scales from startup to Fortune 500',
      'How to reduce data pipeline failures by 73% with proper observability',
      'Cost optimization strategies that saved clients $2.3M average annually',
      'The governance framework that satisfies both compliance and agility',
      'AI-readiness checklist: 12 capabilities your platform needs by 2025',
    ],
    what_you_will_learn: [
      'How to assess your current data maturity and identify gaps',
      'Architecture patterns for real-time and batch processing at scale',
      'Best practices for data mesh implementation in large organizations',
      'Strategies for breaking down data silos across business units',
      'ROI frameworks for justifying data platform investments',
    ],
    who_should_read: [
      'Chief Data Officers and Data Leaders',
      'Enterprise Architects planning modernization initiatives',
      'CIOs evaluating data platform investments',
      'Data Engineering leaders building scalable systems',
      'Business leaders seeking data-driven transformation',
    ],
    table_of_contents: [
      'Executive Summary',
      'The State of Enterprise Data in 2025',
      'Assessing Your Data Maturity',
      'The 5-Layer Architecture Framework',
      'Real-Time vs. Batch: Choosing the Right Approach',
      'Data Governance Without Bureaucracy',
      'Building AI-Ready Infrastructure',
      'Cost Optimization Strategies',
      'Case Studies: Lessons from the Field',
      'Implementation Roadmap',
      'Appendix: Technical Specifications',
    ],
  },
};

function DownloadModal({
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
    title: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !whitepaper) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/whitepaper-leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          whitepaperSlug: whitepaper.slug,
          whitepaperTitle: whitepaper.title,
        }),
      });

      if (!response.ok) throw new Error('Failed to submit');

      const data = await response.json();

      trackFormSubmission('whitepaper_download', 'whitepaper_detail_page', {
        whitepaper_slug: whitepaper.slug,
        whitepaper_title: whitepaper.title,
        company: formData.company,
      });

      window.location.href = `/whitepapers/thank-you?token=${data.downloadToken}&whitepaper=${whitepaper.slug}`;
    } catch {
      setError('Something went wrong. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full p-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-[var(--aci-primary)]/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-[var(--aci-primary)]" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">Download Whitepaper</h3>
          <p className="text-gray-600 mt-2">{whitepaper.title}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--aci-primary)]"
                placeholder="John Smith"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Work Email *</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--aci-primary)]"
                placeholder="john@company.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Company *</label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                required
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--aci-primary)]"
                placeholder="Acme Corporation"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--aci-primary)]"
              placeholder="VP of Engineering"
            />
          </div>

          {error && (
            <p className="text-red-600 text-sm">{error}</p>
          )}

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                Processing...
              </>
            ) : (
              <>
                <Download className="w-5 h-5 mr-2" />
                Get Free Whitepaper
              </>
            )}
          </Button>

          <p className="text-xs text-center text-gray-500">
            We respect your privacy. Unsubscribe anytime.
          </p>
        </form>
      </div>
    </div>
  );
}

export default function WhitepaperDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [whitepaper, setWhitepaper] = useState<Whitepaper | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDownloadModal, setShowDownloadModal] = useState(false);

  useEffect(() => {
    async function fetchWhitepaper() {
      try {
        const response = await fetch(`/api/whitepapers/${slug}`);
        if (response.ok) {
          const data = await response.json();
          if (data.whitepaper) {
            // Merge with fallback data for teaser content
            const fallback = fallbackWhitepapers[slug];
            setWhitepaper({
              ...fallback,
              ...data.whitepaper,
              key_takeaways: data.whitepaper.key_takeaways || fallback?.key_takeaways || [],
              what_you_will_learn: data.whitepaper.what_you_will_learn || fallback?.what_you_will_learn || [],
              who_should_read: data.whitepaper.who_should_read || fallback?.who_should_read || [],
              executive_summary: data.whitepaper.executive_summary || fallback?.executive_summary || '',
              table_of_contents: data.whitepaper.table_of_contents || fallback?.table_of_contents || [],
            });

            trackContentView('whitepaper', slug, data.whitepaper.title, data.whitepaper.category);
          } else if (fallbackWhitepapers[slug]) {
            setWhitepaper(fallbackWhitepapers[slug]);
          }
        } else if (fallbackWhitepapers[slug]) {
          setWhitepaper(fallbackWhitepapers[slug]);
        }
      } catch {
        if (fallbackWhitepapers[slug]) {
          setWhitepaper(fallbackWhitepapers[slug]);
        }
      } finally {
        setLoading(false);
      }
    }

    if (slug) {
      fetchWhitepaper();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--aci-primary)]" />
      </div>
    );
  }

  if (!whitepaper) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8">
        <FileText className="w-16 h-16 text-gray-300 mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Whitepaper Not Found</h1>
        <p className="text-gray-600 mb-6">The whitepaper you&apos;re looking for doesn&apos;t exist.</p>
        <Link href="/whitepapers" className="text-[var(--aci-primary)] hover:underline">
          Browse all whitepapers
        </Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[var(--aci-secondary)] to-[#0a2540] pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/whitepapers"
            className="inline-flex items-center gap-2 text-blue-300 hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            All Whitepapers
          </Link>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-[var(--aci-primary)] text-white text-sm font-medium rounded-full">
                  {whitepaper.category}
                </span>
                <span className="text-blue-200 text-sm flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {whitepaper.read_time} read
                </span>
              </div>

              <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">
                {whitepaper.title}
              </h1>

              {/* Short intro line */}
              <p className="text-xl text-blue-100 mb-6">
                {whitepaper.description?.split('.')[0]?.trim() || 'Essential insights for enterprise leaders'}.
              </p>

              {/* 3 Key highlights */}
              {whitepaper.key_takeaways && whitepaper.key_takeaways.length > 0 && (
                <ul className="space-y-2 mb-8">
                  {whitepaper.key_takeaways.slice(0, 3).map((takeaway, index) => (
                    <li key={index} className="flex items-start gap-2 text-blue-100">
                      <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                      <span>{takeaway}</span>
                    </li>
                  ))}
                </ul>
              )}

              <div className="flex flex-wrap gap-4 mb-8">
                <div className="flex items-center gap-2 text-blue-200">
                  <BookOpen className="w-5 h-5" />
                  <span>{whitepaper.page_count || 42} pages</span>
                </div>
                <div className="flex items-center gap-2 text-blue-200">
                  <Calendar className="w-5 h-5" />
                  <span>Updated {new Date(whitepaper.published_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                </div>
              </div>

              <Button
                onClick={() => setShowDownloadModal(true)}
                size="lg"
                className="group"
              >
                <Download className="w-5 h-5 mr-2 group-hover:animate-bounce" />
                Download Free Whitepaper
              </Button>
            </div>

            {/* Cover Image */}
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden transform lg:rotate-2 hover:rotate-0 transition-transform duration-300">
                {whitepaper.cover_image ? (
                  <Image
                    src={whitepaper.cover_image}
                    alt={whitepaper.title}
                    width={500}
                    height={650}
                    className="w-full h-auto"
                  />
                ) : (
                  <div className="aspect-[3/4] bg-gradient-to-br from-[var(--aci-primary)] to-blue-700 flex items-center justify-center p-8">
                    <div className="text-center text-white">
                      <FileText className="w-24 h-24 mx-auto mb-6 opacity-50" />
                      <h3 className="text-2xl font-bold">{whitepaper.title}</h3>
                    </div>
                  </div>
                )}
              </div>
              {/* Decorative elements */}
              <div className="absolute -bottom-4 -right-4 w-full h-full bg-[var(--aci-primary)]/20 rounded-2xl -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* Executive Summary */}
      {whitepaper.executive_summary && (
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-[var(--aci-primary)]/10 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-[var(--aci-primary)]" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Executive Summary</h2>
            </div>
            <p className="text-lg text-gray-600 leading-relaxed">
              {whitepaper.executive_summary}
            </p>
          </div>
        </section>
      )}

      {/* Key Takeaways */}
      {whitepaper.key_takeaways && whitepaper.key_takeaways.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Lightbulb className="w-5 h-5 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Key Takeaways</h2>
            </div>
            <div className="space-y-4">
              {whitepaper.key_takeaways.map((takeaway, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-sm"
                >
                  <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                  <p className="text-gray-700">{takeaway}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* What You'll Learn */}
      {whitepaper.what_you_will_learn && whitepaper.what_you_will_learn.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">What You&apos;ll Learn</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {whitepaper.what_you_will_learn.map((item, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl"
                >
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">
                    {index + 1}
                  </div>
                  <p className="text-gray-700">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Who Should Read */}
      {whitepaper.who_should_read && whitepaper.who_should_read.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Who Should Read This</h2>
            </div>
            <div className="flex flex-wrap gap-3">
              {whitepaper.who_should_read.map((audience, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-white border border-gray-200 rounded-full text-gray-700 shadow-sm"
                >
                  {audience}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Table of Contents */}
      {whitepaper.table_of_contents && whitepaper.table_of_contents.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-orange-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Table of Contents</h2>
            </div>
            <div className="bg-gray-50 rounded-2xl p-6">
              <ol className="space-y-3">
                {whitepaper.table_of_contents.map((chapter, index) => (
                  <li
                    key={index}
                    className="flex items-center gap-4 text-gray-700"
                  >
                    <span className="w-8 h-8 bg-white border border-gray-200 rounded-lg flex items-center justify-center text-sm font-medium text-gray-500">
                      {index + 1}
                    </span>
                    <span>{chapter}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-[var(--aci-primary)] to-blue-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Transform Your Data Strategy?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Download this comprehensive guide and learn from 80+ enterprise implementations.
          </p>
          <Button
            onClick={() => setShowDownloadModal(true)}
            variant="secondary"
            size="lg"
            className="bg-white text-[var(--aci-primary)] hover:bg-gray-100"
          >
            <Download className="w-5 h-5 mr-2" />
            Get Your Free Copy
          </Button>
        </div>
      </section>

      {/* Download Modal */}
      <DownloadModal
        isOpen={showDownloadModal}
        onClose={() => setShowDownloadModal(false)}
        whitepaper={whitepaper}
      />
    </main>
  );
}
