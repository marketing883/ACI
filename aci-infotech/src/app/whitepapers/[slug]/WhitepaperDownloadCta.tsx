'use client';

// Gated-download island: button + lead-capture modal + view tracking.
// The rest of the whitepaper page is server-rendered.

import { useEffect, useState } from 'react';
import { Download, FileText, Mail, Building2, User, X } from 'lucide-react';
import Button from '@/components/ui/Button';
import { trackFormSubmission, trackContentView } from '@/components/analytics/GoogleTagManager';
import { trackWhitepaperDownloadConversion } from '@/components/analytics/LinkedInInsightTag';
import type { Whitepaper } from './whitepaper-detail';

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
          whitepaper_slug: whitepaper.slug,
          whitepaper_title: whitepaper.title,
        }),
      });

      if (!response.ok) throw new Error('Failed to submit');

      const data = await response.json();

      trackFormSubmission('whitepaper_download', 'whitepaper_detail_page', {
        whitepaper_slug: whitepaper.slug,
        whitepaper_title: whitepaper.title,
        company: formData.company,
      });

      // Track LinkedIn conversion for lead gen campaigns
      trackWhitepaperDownloadConversion();

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
            loading={isSubmitting}
            className="w-full"
            leftIcon={!isSubmitting ? <Download className="w-5 h-5" /> : undefined}
          >
            {isSubmitting ? 'Processing...' : 'Get Free Whitepaper'}
          </Button>

          <p className="text-xs text-center text-gray-500">
            We respect your privacy. Unsubscribe anytime.
          </p>
        </form>
      </div>
    </div>
  );
}

export default function WhitepaperDownloadCta({
  whitepaper,
  variant,
  trackView = false,
}: {
  whitepaper: Whitepaper;
  variant: 'hero' | 'footer';
  trackView?: boolean;
}) {
  const [open, setOpen] = useState(false);

  // Fires once per page for the island that owns view tracking.
  useEffect(() => {
    if (trackView) {
      trackContentView('whitepaper', whitepaper.slug, whitepaper.title, whitepaper.category);
    }
  }, [trackView, whitepaper.slug, whitepaper.title, whitepaper.category]);

  return (
    <>
      {variant === 'hero' ? (
        <Button
          onClick={() => setOpen(true)}
          size="lg"
          className="group"
          leftIcon={<Download className="w-5 h-5 group-hover:animate-bounce" />}
        >
          Download Free Whitepaper
        </Button>
      ) : (
        <Button
          onClick={() => setOpen(true)}
          variant="lime"
          size="lg"
          leftIcon={<Download className="w-5 h-5" />}
        >
          Get Your Free Copy
        </Button>
      )}
      <DownloadModal isOpen={open} onClose={() => setOpen(false)} whitepaper={whitepaper} />
    </>
  );
}
