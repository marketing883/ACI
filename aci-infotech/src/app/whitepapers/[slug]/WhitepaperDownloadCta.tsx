'use client';

// Gated-download island: button + lead-capture modal + view tracking.
// The rest of the whitepaper page is server-rendered.

import { useEffect, useState } from 'react';
import { ArrowUpRight, Download, FileText, Loader2, X } from 'lucide-react';
import { v4Display } from '@/components/v4/fonts';
import { trackFormSubmission, trackContentView } from '@/components/analytics/GoogleTagManager';
import { trackWhitepaperDownloadConversion } from '@/components/analytics/LinkedInInsightTag';
import type { Whitepaper } from './whitepaper-detail';

// Hairline input, v4 grammar: gray-200 border, blue focus ring.
const INPUT_CLASS =
  'w-full rounded-xl border border-gray-200 px-4 py-3 text-[15px] text-black placeholder:text-gray-400 focus:border-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-700';

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
      <div className="relative w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 rounded-full p-2 text-gray-500 hover:bg-gray-100"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mb-6">
          <FileText className="h-7 w-7 text-blue-700" aria-hidden="true" />
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">/ Whitepaper</p>
          <h3 className={`mt-2 text-xl font-semibold text-black ${v4Display}`}>{whitepaper.title}</h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Full Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={INPUT_CLASS}
              placeholder="John Smith"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Work Email *</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className={INPUT_CLASS}
              placeholder="john@company.com"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Company *</label>
            <input
              type="text"
              required
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              className={INPUT_CLASS}
              placeholder="Acme Corporation"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Job Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className={INPUT_CLASS}
              placeholder="VP of Engineering"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}

          {/* The one allowed button: a functional form submit, styled
              like the CtaSection button. */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-[#1D4ED8] px-8 py-4 text-base font-semibold text-white shadow-[0_20px_60px_-15px_rgba(29,78,216,0.55)] ring-1 ring-white/20 transition-all duration-300 hover:bg-[#84CC16] hover:text-black disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
                Processing
              </>
            ) : (
              <>
                <Download className="h-5 w-5" aria-hidden="true" />
                Get the Whitepaper
              </>
            )}
          </button>

          <p className="text-center text-xs text-gray-500">
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
        // Text link, v4 grammar: underline on hover, no pill.
        <button
          onClick={() => setOpen(true)}
          className="group inline-flex items-center gap-1.5 text-[15px] font-semibold text-blue-700"
        >
          <span className="relative">
            Download the whitepaper
            <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-current transition-transform duration-300 ease-out group-hover:scale-x-100" />
          </span>
          <ArrowUpRight size={16} aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </button>
      ) : (
        // Closing-CTA button: same treatment as the sitewide CtaSection
        // button, but it opens the gate form instead of navigating.
        <button
          onClick={() => setOpen(true)}
          className="group inline-flex items-center gap-3 rounded-full bg-[#1D4ED8] px-8 py-4 text-lg font-semibold text-white shadow-[0_20px_60px_-15px_rgba(29,78,216,0.55)] ring-1 ring-white/20 transition-all duration-300 hover:scale-[1.03] hover:bg-[#84CC16] hover:text-black hover:shadow-[0_20px_60px_-15px_rgba(132,204,22,0.55)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1D4ED8]"
        >
          <Download size={20} aria-hidden="true" className="transition-transform duration-300 group-hover:-rotate-6" />
          Get Your Copy
        </button>
      )}
      <DownloadModal isOpen={open} onClose={() => setOpen(false)} whitepaper={whitepaper} />
    </>
  );
}
