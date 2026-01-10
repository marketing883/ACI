'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Download, CheckCircle2, ArrowRight, Loader2 } from 'lucide-react';
import Button from '@/components/ui/Button';

// Playbook data for display
const playbookInfo: Record<string, { title: string; displayTitle: string }> = {
  'post-acquisition-consolidation': {
    title: 'Post-Acquisition System Consolidation',
    displayTitle: 'Post-M&A System Consolidation',
  },
  'real-time-data-platform': {
    title: 'Multi-Location Real-Time Data Platform',
    displayTitle: 'Multi-Location Real-Time Data',
  },
  'global-data-unification': {
    title: 'Global Data Unification',
    displayTitle: 'Global Operations Data Unification',
  },
  'self-service-analytics': {
    title: 'Enterprise Self-Service Analytics',
    displayTitle: 'Enterprise Self-Service Analytics',
  },
  'healthcare-data-platform': {
    title: 'Multi-Jurisdiction Healthcare Data',
    displayTitle: 'Multi-Jurisdiction Healthcare Data',
  },
  'supply-chain-visibility': {
    title: 'Supply Chain Visibility',
    displayTitle: 'End-to-End Supply Chain Visibility',
  },
  'legacy-cloud-migration': {
    title: 'Legacy to Cloud Migration',
    displayTitle: 'Legacy System Cloud Migration',
  },
  'multi-source-integration': {
    title: 'Multi-Source Data Integration',
    displayTitle: 'Multi-Source Data Integration',
  },
};

function ThankYouContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const playbookSlug = searchParams.get('playbook');

  const [isValidToken, setIsValidToken] = useState<boolean | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [hasDownloaded, setHasDownloaded] = useState(false);

  const playbook = playbookSlug ? playbookInfo[playbookSlug] : null;

  useEffect(() => {
    // Verify token
    const verifyToken = async () => {
      if (!token) {
        setIsValidToken(false);
        return;
      }

      try {
        const response = await fetch(`/api/playbook-leads/verify?token=${token}`);
        const data = await response.json();
        setIsValidToken(data.valid);
      } catch {
        setIsValidToken(false);
      }
    };

    verifyToken();
  }, [token]);

  const handleDownload = async () => {
    if (!token || !playbookSlug) return;

    setIsDownloading(true);

    try {
      // Mark token as used and get download URL
      const response = await fetch('/api/playbook-leads/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, playbookSlug }),
      });

      if (!response.ok) {
        throw new Error('Download failed');
      }

      const data = await response.json();

      // Trigger download
      if (data.downloadUrl) {
        window.open(data.downloadUrl, '_blank');
      } else {
        // Fallback: download placeholder
        const link = document.createElement('a');
        link.href = `/playbooks/pdfs/${playbookSlug}.pdf`;
        link.download = `${playbookSlug}-playbook.pdf`;
        link.click();
      }

      setHasDownloaded(true);
    } catch (error) {
      console.error('Download error:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  if (isValidToken === null) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--aci-primary)]" />
      </div>
    );
  }

  if (!isValidToken || !playbook) {
    return (
      <main className="min-h-screen bg-gray-50">
        <section className="pt-32 pb-20">
          <div className="max-w-lg mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">⚠️</span>
            </div>
            <h1 className="text-3xl font-bold text-[var(--aci-secondary)] mb-4">
              Invalid or Expired Link
            </h1>
            <p className="text-gray-600 mb-8">
              This download link is invalid or has already been used.
              Please request a new download from the playbook page.
            </p>
            <Button href="/playbooks" variant="primary">
              Browse Playbooks
            </Button>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="pt-32 pb-20">
        <div className="max-w-lg mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            {/* Success Icon */}
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>

            <h1 className="text-3xl font-bold text-[var(--aci-secondary)] mb-2">
              Thank You!
            </h1>
            <p className="text-gray-600 mb-8">
              Your playbook is ready for download.
            </p>

            {/* Playbook Info */}
            <div className="bg-gray-50 rounded-xl p-6 mb-8">
              <p className="text-sm text-gray-500 mb-2">You're downloading:</p>
              <h2 className="text-xl font-bold text-[var(--aci-secondary)] mb-1">
                {playbook.displayTitle}
              </h2>
              <p className="text-gray-600">{playbook.title}</p>
            </div>

            {/* Download Button */}
            {!hasDownloaded ? (
              <button
                onClick={handleDownload}
                disabled={isDownloading}
                className="w-full py-4 bg-[var(--aci-primary)] text-white font-bold rounded-lg hover:bg-[var(--aci-primary-dark)] transition-colors disabled:opacity-50 flex items-center justify-center gap-2 text-lg"
              >
                {isDownloading ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    Preparing Download...
                  </>
                ) : (
                  <>
                    <Download className="w-6 h-6" />
                    Download Playbook PDF
                  </>
                )}
              </button>
            ) : (
              <div className="w-full py-4 bg-green-100 text-green-700 font-bold rounded-lg flex items-center justify-center gap-2">
                <CheckCircle2 className="w-6 h-6" />
                Download Started
              </div>
            )}

            <p className="text-xs text-gray-500 mt-4">
              This is a one-time download link.
            </p>
          </div>

          {/* Next Steps */}
          <div className="mt-8 bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-lg font-bold text-[var(--aci-secondary)] mb-4">
              What's Next?
            </h3>
            <div className="space-y-4">
              <Link
                href={`/contact?playbook=${playbookSlug}`}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
              >
                <div>
                  <p className="font-semibold text-[var(--aci-secondary)]">Talk to an Architect</p>
                  <p className="text-sm text-gray-500">Discuss how to apply this playbook</p>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-[var(--aci-primary)] transition-colors" />
              </Link>

              <Link
                href="/playbooks"
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
              >
                <div>
                  <p className="font-semibold text-[var(--aci-secondary)]">Browse More Playbooks</p>
                  <p className="text-sm text-gray-500">Explore our full library</p>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-[var(--aci-primary)] transition-colors" />
              </Link>

              <Link
                href="/case-studies"
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
              >
                <div>
                  <p className="font-semibold text-[var(--aci-secondary)]">View Case Studies</p>
                  <p className="text-sm text-gray-500">See real implementation results</p>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-[var(--aci-primary)] transition-colors" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default function ThankYouPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--aci-primary)]" />
      </div>
    }>
      <ThankYouContent />
    </Suspense>
  );
}
