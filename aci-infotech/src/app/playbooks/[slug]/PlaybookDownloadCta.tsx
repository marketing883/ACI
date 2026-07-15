'use client';

import { useState } from 'react';
import { Download, CheckCircle2, Loader2, X, Mail, Building2, User } from 'lucide-react';
import { trackPlaybookAccessConversion } from '@/components/analytics/LinkedInInsightTag';

// Gated-download island: the only interactive part of the playbook page.
// Everything else server-renders so the content is in the initial HTML.
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
            <div className="w-12 h-12 bg-[#1890FF]/10 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Download className="w-6 h-6 text-[#1890FF]" />
            </div>
            <h3 className="text-xl font-bold text-[var(--aci-secondary)]">
              Download Playbook
            </h3>
            <p className="text-gray-600 text-sm mt-2">
              {playbookTitle}
            </p>
          </div>

          {success ? (
            <div className="text-center py-8">
              <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <p className="text-gray-600">Check your email for the download link!</p>
            </div>
          ) : (
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
                    Get Playbook PDF
                  </>
                )}
              </button>

              <p className="text-xs text-gray-500 text-center">
                By downloading, you agree to receive occasional updates from ACI Infotech.
                Unsubscribe anytime.
              </p>
            </form>
          )}
        </div>
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
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 px-6 py-3 bg-[#C4FF61] text-[#001529] font-bold rounded-lg hover:bg-[#d4ff81] transition-colors"
      >
        <Download className="w-5 h-5" />
        Download Playbook PDF
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
