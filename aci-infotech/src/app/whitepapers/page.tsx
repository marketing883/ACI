'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Download, FileText, X, Mail, Building2, User, Loader2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import { trackFormSubmission, trackEvent, trackCTAClick } from '@/components/analytics/GoogleAnalytics';

// Types for whitepapers
interface Whitepaper {
  id: string;
  slug: string;
  title: string;
  description: string;
  cover_image?: string;
  category: string;
  pages?: number;
  is_featured?: boolean;
  featured?: boolean;
  is_published?: boolean;
  topics?: string[];
  pdf_url?: string;
}

// Demo whitepaper data - used as fallback
const demoWhitepapers: Whitepaper[] = [
  {
    id: '1',
    slug: 'enterprise-data-strategy-2025',
    title: 'Enterprise Data Strategy 2025',
    description: 'A comprehensive guide to building resilient, AI-ready data platforms that scale with your business needs. Learn from 80+ enterprise deployments across industries.',
    cover_image: '/images/whitepapers/data-strategy-cover.jpg',
    category: 'Data Engineering',
    pages: 42,
    featured: true,
    topics: ['Data Architecture', 'AI Readiness', 'Cloud Strategy', 'Data Governance'],
  },
  {
    id: '2',
    slug: 'ai-governance-playbook',
    title: 'AI Governance Playbook',
    description: 'How to scale AI responsibly with policy-as-code, model observability, and automated compliance. Includes EU AI Act and GDPR guidance.',
    cover_image: '/images/whitepapers/ai-governance-cover.jpg',
    category: 'Applied AI',
    pages: 36,
    featured: true,
    topics: ['AI Governance', 'Compliance', 'MLOps', 'Risk Management'],
  },
  {
    id: '3',
    slug: 'cloud-migration-blueprint',
    title: 'Cloud Migration Blueprint',
    description: 'Zero-downtime migration strategies for legacy Hadoop, Teradata, and Oracle platforms. Includes cost optimization frameworks.',
    cover_image: '/images/whitepapers/cloud-migration-cover.jpg',
    category: 'Cloud',
    pages: 48,
    featured: false,
    topics: ['Cloud Migration', 'Cost Optimization', 'AWS', 'Azure', 'GCP'],
  },
  {
    id: '4',
    slug: 'martech-cdp-guide',
    title: 'MarTech & CDP Implementation Guide',
    description: 'Building unified customer experiences across channels. Implementation patterns for Salesforce, Adobe, and Braze.',
    cover_image: '/images/whitepapers/martech-cover.jpg',
    category: 'MarTech',
    pages: 32,
    featured: false,
    topics: ['CDP', 'Customer 360', 'Personalization', 'Marketing Automation'],
  },
  {
    id: '5',
    slug: 'real-time-analytics-architecture',
    title: 'Real-Time Analytics Architecture',
    description: 'Building sub-second analytics for multi-location enterprises. Kafka, Databricks, and modern streaming patterns.',
    cover_image: '/images/whitepapers/realtime-cover.jpg',
    category: 'Data Engineering',
    pages: 38,
    featured: false,
    topics: ['Streaming', 'Real-Time', 'Kafka', 'Databricks'],
  },
  {
    id: '6',
    slug: 'healthcare-data-compliance',
    title: 'Healthcare Data Compliance Guide',
    description: 'Multi-jurisdiction healthcare data platforms. HIPAA, GDPR, and international compliance frameworks.',
    cover_image: '/images/whitepapers/healthcare-cover.jpg',
    category: 'Healthcare',
    pages: 44,
    featured: false,
    topics: ['HIPAA', 'GDPR', 'Patient Data', 'Compliance'],
  },
];

const categories = ['All', 'Data Engineering', 'Applied AI', 'Cloud', 'MarTech', 'Healthcare'];

// Download Modal Component
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

      // Track successful form submission
      trackFormSubmission('whitepaper_download', 'whitepapers_page', {
        whitepaper_slug: whitepaper?.slug || '',
        whitepaper_title: whitepaper?.title || '',
        company: formData.company,
      });

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

export default function WhitepapersPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [downloadWhitepaper, setDownloadWhitepaper] = useState<Whitepaper | null>(null);
  const [whitepapers, setWhitepapers] = useState<Whitepaper[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRealData, setIsRealData] = useState(false);

  // Fetch whitepapers from database
  useEffect(() => {
    async function fetchWhitepapers() {
      setIsLoading(true);

      try {
        const response = await fetch('/api/admin/whitepapers?published=true');
        const result = await response.json();

        if (result.error) {
          console.error('Error fetching whitepapers:', result.error);
          setWhitepapers(demoWhitepapers);
          setIsRealData(false);
        } else if (result.whitepapers && result.whitepapers.length > 0) {
          setWhitepapers(result.whitepapers);
          setIsRealData(true);
        } else if (result.demo) {
          setWhitepapers(demoWhitepapers);
          setIsRealData(false);
        } else {
          setWhitepapers(demoWhitepapers);
          setIsRealData(false);
        }
      } catch (error) {
        console.error('Error fetching whitepapers:', error);
        setWhitepapers(demoWhitepapers);
        setIsRealData(false);
      }

      setIsLoading(false);
    }

    fetchWhitepapers();
  }, []);

  const filteredWhitepapers = whitepapers.filter((wp) => {
    return selectedCategory === 'All' || wp.category === selectedCategory;
  });

  const featuredWhitepapers = filteredWhitepapers.filter(wp => wp.is_featured || wp.featured);
  const otherWhitepapers = filteredWhitepapers.filter(wp => !wp.is_featured && !wp.featured);

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-[var(--aci-secondary)] pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <p className="text-[var(--aci-primary-light)] font-medium mb-4 tracking-wide uppercase">
              Resource Library
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Whitepapers & Guides
            </h1>
            <p className="text-xl text-gray-400 mb-8">
              Deep-dive resources from architects who have deployed these solutions at scale.
              Technical depth without the vendor fluff.
            </p>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-8 mt-12">
              <div className="text-center">
                <div className="text-4xl font-bold text-white">{isLoading ? '...' : whitepapers.length || demoWhitepapers.length}</div>
                <div className="text-gray-400">Whitepapers</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-white">200+</div>
                <div className="text-gray-400">Pages of Content</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-white">80+</div>
                <div className="text-gray-400">Enterprise Insights</div>
              </div>
            </div>
          </div>
        </div>
      </section>

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

      {/* Loading State */}
      {isLoading && (
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center justify-center">
              <Loader2 className="w-12 h-12 text-[var(--aci-primary)] animate-spin mb-4" />
              <p className="text-gray-500">Loading whitepapers...</p>
            </div>
          </div>
        </section>
      )}

      {/* Featured Whitepapers */}
      {!isLoading && featuredWhitepapers.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-[var(--aci-secondary)] mb-8">Featured Resources</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {featuredWhitepapers.map((wp) => (
                <div
                  key={wp.id}
                  className="bg-gradient-to-br from-[var(--aci-secondary)] to-[#0a2540] rounded-xl overflow-hidden flex flex-col md:flex-row"
                >
                  {/* Cover Image */}
                  <div className="relative w-full md:w-48 h-48 md:h-auto flex-shrink-0 bg-[#0a2540]">
                    {wp.cover_image ? (
                      <Image
                        src={wp.cover_image}
                        alt={wp.title}
                        fill
                        className="object-cover opacity-60"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <FileText className="w-16 h-16 text-white/30" />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6 flex flex-col flex-grow text-white">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-2 py-1 bg-white/10 rounded text-xs font-medium">
                        {wp.category}
                      </span>
                      <span className="text-white/60 text-xs">{wp.pages} pages</span>
                    </div>
                    <h3 className="text-xl font-bold mb-2">{wp.title}</h3>
                    <p className="text-gray-300 text-sm mb-4 flex-grow">{wp.description}</p>
                    <button
                      onClick={() => setDownloadWhitepaper(wp)}
                      className="w-full py-3 bg-white text-[var(--aci-secondary)] font-semibold rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
                    >
                      <Download className="w-5 h-5" />
                      Download Free
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Whitepapers */}
      {!isLoading && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {featuredWhitepapers.length > 0 && otherWhitepapers.length > 0 && (
              <h2 className="text-2xl font-bold text-[var(--aci-secondary)] mb-8">More Resources</h2>
            )}

            {filteredWhitepapers.length === 0 ? (
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
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {(featuredWhitepapers.length > 0 ? otherWhitepapers : filteredWhitepapers).map((wp) => (
                <div
                  key={wp.id}
                  className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all border border-gray-100"
                >
                  {/* Cover */}
                  <div className="relative h-40 bg-gray-100">
                    {wp.cover_image ? (
                      <Image
                        src={wp.cover_image}
                        alt={wp.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full bg-gradient-to-br from-[var(--aci-secondary)] to-[#0a2540]">
                        <FileText className="w-12 h-12 text-white/30" />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-2 py-1 bg-[var(--aci-primary)]/10 text-[var(--aci-primary)] rounded text-xs font-medium">
                        {wp.category}
                      </span>
                      <span className="text-gray-400 text-xs">{wp.pages} pages</span>
                    </div>
                    <h3 className="text-lg font-bold text-[var(--aci-secondary)] mb-2">{wp.title}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{wp.description}</p>

                    {/* Topics */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {wp.topics?.slice(0, 3).map((topic) => (
                        <span
                          key={topic}
                          className="px-2 py-0.5 bg-gray-100 rounded text-xs text-gray-600"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>

                    <button
                      onClick={() => setDownloadWhitepaper(wp)}
                      className="w-full py-2.5 bg-[var(--aci-primary)] text-white font-semibold rounded-lg hover:bg-[var(--aci-primary-dark)] transition-colors flex items-center justify-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-[var(--aci-primary)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Need Custom Research?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Our architects can provide tailored analysis and recommendations for your specific challenges.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button href="/contact?reason=architecture-call" variant="secondary" size="lg">
              Schedule Architecture Call
            </Button>
            <Button href="/playbooks" variant="ghost" size="lg" className="text-white border-white hover:bg-white/10">
              Browse Playbooks
            </Button>
          </div>
        </div>
      </section>

      {/* Download Modal */}
      <DownloadModal
        isOpen={!!downloadWhitepaper}
        onClose={() => setDownloadWhitepaper(null)}
        whitepaper={downloadWhitepaper}
      />
    </main>
  );
}
