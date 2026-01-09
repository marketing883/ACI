'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Download, CheckCircle2, ArrowRight, Loader2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import { trackDownload, trackEvent } from '@/components/analytics/GoogleAnalytics';

interface WhitepaperInfo {
  title: string;
  description: string;
}

function ThankYouContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const whitepaperSlug = searchParams.get('whitepaper');

  const [isValidToken, setIsValidToken] = useState<boolean | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [hasDownloaded, setHasDownloaded] = useState(false);
  const [whitepaper, setWhitepaper] = useState<WhitepaperInfo | null>(null);

  useEffect(() => {
    // Verify token and fetch whitepaper info
    const verifyAndFetch = async () => {
      if (!token) {
        setIsValidToken(false);
        return;
      }

      try {
        // Verify token
        const tokenResponse = await fetch(`/api/whitepaper-leads/verify?token=${token}`);
        const tokenData = await tokenResponse.json();
        setIsValidToken(tokenData.valid);

        // Fetch whitepaper info
        if (whitepaperSlug) {
          const wpResponse = await fetch(`/api/whitepapers/${whitepaperSlug}`);
          if (wpResponse.ok) {
            const wpData = await wpResponse.json();
            if (wpData.whitepaper) {
              setWhitepaper({
                title: wpData.whitepaper.title,
                description: wpData.whitepaper.description,
              });
            }
          }
        }
      } catch {
        setIsValidToken(false);
      }
    };

    verifyAndFetch();
  }, [token, whitepaperSlug]);

  const handleDownload = async () => {
    if (!token || !whitepaperSlug) return;

    setIsDownloading(true);

    try {
      // Mark token as used and get download URL
      const response = await fetch('/api/whitepaper-leads/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, whitepaperSlug }),
      });

      if (!response.ok) {
        throw new Error('Download failed');
      }

      const data = await response.json();

      // Track successful download
      trackDownload(
        `${whitepaperSlug}.pdf`,
        'whitepaper',
        data.title || whitepaper?.title || whitepaperSlug
      );

      trackEvent('whitepaper_downloaded', {
        whitepaper_slug: whitepaperSlug,
        whitepaper_title: data.title || whitepaper?.title || 'Unknown',
      });

      // Trigger download
      if (data.downloadUrl) {
        window.open(data.downloadUrl, '_blank');
      } else {
        // Fallback: download placeholder
        const link = document.createElement('a');
        link.href = `/whitepapers/pdfs/${whitepaperSlug}.pdf`;
        link.download = `${whitepaperSlug}.pdf`;
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

  if (!isValidToken) {
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
              Please request a new download from the whitepapers page.
            </p>
            <Button href="/whitepapers" variant="primary">
              Browse Whitepapers
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
              Your whitepaper is ready for download.
            </p>

            {/* Whitepaper Info */}
            {whitepaper && (
              <div className="bg-gray-50 rounded-xl p-6 mb-8">
                <p className="text-sm text-gray-500 mb-2">You're downloading:</p>
                <h2 className="text-xl font-bold text-[var(--aci-secondary)] mb-1">
                  {whitepaper.title}
                </h2>
                <p className="text-gray-600 text-sm">{whitepaper.description}</p>
              </div>
            )}

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
                    Download Whitepaper
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
                href="/contact?reason=architecture-call"
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
              >
                <div>
                  <p className="font-semibold text-[var(--aci-secondary)]">Schedule an Architecture Call</p>
                  <p className="text-sm text-gray-500">Discuss your specific challenges</p>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-[var(--aci-primary)] transition-colors" />
              </Link>

              <Link
                href="/whitepapers"
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
              >
                <div>
                  <p className="font-semibold text-[var(--aci-secondary)]">Browse More Resources</p>
                  <p className="text-sm text-gray-500">Explore our full library</p>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-[var(--aci-primary)] transition-colors" />
              </Link>

              <Link
                href="/playbooks"
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
              >
                <div>
                  <p className="font-semibold text-[var(--aci-secondary)]">View Playbooks</p>
                  <p className="text-sm text-gray-500">Proven architecture patterns</p>
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
