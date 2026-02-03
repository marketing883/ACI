'use client';

import { useEffect, useState } from 'react';
import LPForm from './LPForm';
import { VisitorContext, getUrgencyMessage } from '@/lib/lp-personalization';

interface LPHeroProps {
  headline: string;
  subheadline: string;
  ctoText: string;
  landingPage: string;
  serviceCluster: string;
  certifications?: string[];
  context?: VisitorContext;
  utmParams?: {
    utmSource?: string;
    utmMedium?: string;
    utmCampaign?: string;
    utmContent?: string;
    utmTerm?: string;
  };
  urlParams?: {
    industryParam?: string;
    roleParam?: string;
  };
  onFormSuccess?: (data: { firstName: string; serviceCluster: string; lookingFor: string }) => void;
}

export default function LPHero({
  headline,
  subheadline,
  ctoText,
  landingPage,
  serviceCluster,
  certifications = [],
  context,
  utmParams,
  urlParams,
  onFormSuccess,
}: LPHeroProps) {
  const [urgencyMessage, setUrgencyMessage] = useState<string | null>(null);

  useEffect(() => {
    if (context) {
      const message = getUrgencyMessage(context);
      setUrgencyMessage(message);
    }
  }, [context]);

  return (
    <section className="relative bg-gradient-to-br from-[#0A1628] via-[#0F2847] to-[#0A1628] pt-24 pb-16 lg:pb-24 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      {/* Gradient Orbs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Content */}
          <div className="text-center lg:text-left">
            {/* Urgency Badge */}
            {urgencyMessage && (
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/20 border border-amber-500/30 rounded-full text-amber-300 text-sm font-medium mb-6">
                <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
                {urgencyMessage}
              </div>
            )}

            {/* Headline */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              {headline}
            </h1>

            {/* Subheadline */}
            <p className="text-xl text-gray-300 mb-8 max-w-xl lg:max-w-none">
              {subheadline}
            </p>

            {/* Trust Badges */}
            {certifications.length > 0 && (
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-8">
                {certifications.slice(0, 4).map((cert, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-full text-sm text-gray-300"
                  >
                    <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {cert}
                  </div>
                ))}
              </div>
            )}

            {/* Mobile Form CTA (shown on mobile, hidden on desktop) */}
            <div className="lg:hidden">
              <a
                href="#lead-form"
                className="inline-flex items-center justify-center w-full py-4 px-8 bg-[#0066FF] hover:bg-[#0052CC] text-white font-semibold rounded-lg transition-colors shadow-lg shadow-blue-500/25"
              >
                {ctoText}
              </a>
            </div>
          </div>

          {/* Right: Form */}
          <div id="lead-form" className="lg:pl-8">
            <div className="bg-white rounded-2xl shadow-2xl p-8">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{ctoText}</h2>
                <p className="text-gray-600">Fill out the form and we'll be in touch within 24 hours.</p>
              </div>

              <LPForm
                landingPage={landingPage}
                serviceCluster={serviceCluster}
                ctoText={ctoText}
                utmParams={utmParams}
                urlParams={urlParams}
                onSuccess={onFormSuccess}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
