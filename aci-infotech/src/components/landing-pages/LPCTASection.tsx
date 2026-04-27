'use client';

import { ArrowRight } from 'lucide-react';

interface LPCTASectionProps {
  headline?: string;
  subheadline?: string;
  ctoText: string;
  ctoSecondaryText?: string;
  onCTAClick?: () => void;
}

export default function LPCTASection({
  headline = "Ready to Get Started?",
  subheadline = "Take the first step toward transforming your business.",
  ctoText,
  ctoSecondaryText,
  onCTAClick,
}: LPCTASectionProps) {
  const handleClick = () => {
    // Scroll to form
    const formElement = document.getElementById('lead-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    onCTAClick?.();
  };

  return (
    <section className="py-16 lg:py-24 bg-gradient-to-br from-[#0066FF] to-[#0044AA] relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`,
            backgroundSize: '32px 32px',
          }}
        />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">{headline}</h2>
        <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">{subheadline}</p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={handleClick}
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#0066FF] font-semibold rounded-lg hover:bg-gray-100 transition-colors shadow-lg shadow-black/20"
          >
            {ctoText}
            <ArrowRight className="w-5 h-5" />
          </button>

          {ctoSecondaryText && (
            <button
              onClick={handleClick}
              className="inline-flex items-center gap-2 px-8 py-4 bg-transparent text-white font-semibold rounded-lg border-2 border-white/30 hover:bg-white/10 transition-colors"
            >
              {ctoSecondaryText}
            </button>
          )}
        </div>

        {/* Trust Indicators */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-blue-100 text-sm">
          <span className="flex items-center gap-2">
            <svg className="w-5 h-5 text-green-300" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            No obligation
          </span>
          <span className="flex items-center gap-2">
            <svg className="w-5 h-5 text-green-300" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            Response within 24 hours
          </span>
          <span className="flex items-center gap-2">
            <svg className="w-5 h-5 text-green-300" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            Certified experts
          </span>
        </div>
      </div>
    </section>
  );
}
