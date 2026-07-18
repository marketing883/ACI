'use client';

import { useState } from 'react';
import { ArrowUpRight, CheckCircle2, Download, Loader2, X } from 'lucide-react';
import { v4Display } from '@/components/v4/fonts';
import { trackPlaybookAccessConversion } from '@/components/analytics/LinkedInInsightTag';

// Gated-download island: the only interactive part of the playbook page.
// Everything else server-renders so the content is in the initial HTML.

// Hairline input, v4 grammar: gray-200 border, blue focus ring.
const INPUT_CLASS =
  'w-full rounded-xl border border-gray-200 px-4 py-3 text-[15px] text-black placeholder:text-gray-400 focus:border-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-700';

// Download Modal Component
function DownloadModal({
  isOpen,
  onClose,
  playbookTitle,
  playbookSlug,
}: {
  isOpen: boolean;
  onClose: () => void;
  playbookTitle: string;
  playbookSlug: string;
}) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success] = useState(false);

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

    // Check for work email (basic check)
    const personalDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'aol.com', 'icloud.com'];
    const emailDomain = formData.email.split('@')[1]?.toLowerCase();
    if (personalDomains.includes(emailDomain)) {
      setError('Please use your work email address');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/playbook-leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          playbook_slug: playbookSlug,
          playbook_title: playbookTitle,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit');
      }

      const data = await response.json();

      // Track LinkedIn conversion for lead gen campaigns
      trackPlaybookAccessConversion();

      // Redirect to thank you page with download token
      window.location.href = `/playbooks/thank-you?token=${data.downloadToken}&playbook=${playbookSlug}`;
    } catch {
      setError('Something went wrong. Please try again.');
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="relative w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 rounded-full p-2 text-gray-500 hover:bg-gray-100"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mb-6">
          <Download className="h-7 w-7 text-blue-700" aria-hidden="true" />
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">/ Playbook</p>
          <h3 className={`mt-2 text-xl font-semibold text-black ${v4Display}`}>{playbookTitle}</h3>
        </div>

        {success ? (
          <div className="py-8 text-center">
            <CheckCircle2 className="mx-auto mb-4 h-14 w-14 text-[#84CC16]" aria-hidden="true" />
            <p className="text-gray-600">Check your email for the download link.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Full Name</label>
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
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Work Email</label>
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
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Company</label>
              <input
                type="text"
                required
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className={INPUT_CLASS}
                placeholder="Acme Corp"
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
                  Get the Playbook PDF
                </>
              )}
            </button>

            <p className="text-center text-xs text-gray-500">
              By downloading, you agree to receive occasional updates from ACI Infotech.
              Unsubscribe anytime.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

export default function PlaybookDownloadCta({
  playbookTitle,
  playbookSlug,
}: {
  playbookTitle: string;
  playbookSlug: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      {/* Text link, v4 grammar: underline on hover, no pill. */}
      <button
        onClick={() => setOpen(true)}
        className="group inline-flex items-center gap-1.5 text-[15px] font-semibold text-blue-700"
      >
        <span className="relative">
          Download the playbook PDF
          <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-current transition-transform duration-300 ease-out group-hover:scale-x-100" />
        </span>
        <ArrowUpRight size={16} aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </button>
      <DownloadModal
        isOpen={open}
        onClose={() => setOpen(false)}
        playbookTitle={playbookTitle}
        playbookSlug={playbookSlug}
      />
    </>
  );
}
