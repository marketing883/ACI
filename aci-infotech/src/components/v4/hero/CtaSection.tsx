'use client';

import Link from 'next/link';
import { ArrowUpRight, Coffee } from 'lucide-react';
import FadingVideo from './FadingVideo';
import { trackEvent } from '@/components/analytics/GoogleTagManager';

const VIDEO = '/videos/v4-editorial-signal.mp4';
const VIDEO_WEBM = '/videos/v4-editorial-signal.webm';

/**
 * Closing CTA — the hero's signal footage returns, centered, with a
 * single button floating in the middle of the stage. Same treatment as
 * the hero: a mild tone lift plus a radial feather so the sphere sits
 * on a uniformly white field with no visible video box.
 */
export default function CtaSection({
  label = "Let's Talk Over a Coffee",
  href = '/contact',
  secondaryLabel = 'Read a playbook first',
  secondaryHref = '/playbooks',
}: {
  label?: string;
  href?: string;
  /** Quieter second exit for visitors who aren't ready to book a call.
   *  Pass `null` to render the button on its own. */
  secondaryLabel?: string | null;
  secondaryHref?: string;
} = {}) {
  // Intent-aware CTA click: forward the href's own intent params so
  // GTM/GA4 see which practice the click was about.
  const track = (linkText: string, linkUrl: string, fallbackPosition: string) => {
    const qs = linkUrl.includes('?') ? linkUrl.slice(linkUrl.indexOf('?') + 1) : '';
    const params = Object.fromEntries(new URLSearchParams(qs));
    trackEvent('cta_click', {
      link_text: linkText,
      link_url: linkUrl,
      cta_position: params.source || fallbackPosition,
      ...(params.service ? { service: params.service } : {}),
      ...(params.platform ? { platform: params.platform } : {}),
      ...(params.industry ? { industry: params.industry } : {}),
      ...(params.topic ? { topic: params.topic } : {}),
      ...(params.reason ? { reason: params.reason } : {}),
      page_location: typeof window !== 'undefined' ? window.location.pathname : '',
    });
  };

  return (
    <section id="lets-talk" className="relative h-[52vh] min-h-[420px] w-full overflow-hidden border-t border-gray-200 bg-white md:h-[76vh] md:min-h-[520px]">
      <FadingVideo
        src={VIDEO}
        webmSrc={VIDEO_WEBM}
        className="absolute inset-0 h-full w-full object-contain"
        style={{
          filter: 'saturate(0.9) brightness(1.06) contrast(1.18)',
          WebkitMaskImage:
            'radial-gradient(ellipse 36% 66% at 50% 50%, #000 50%, rgba(0,0,0,0.55) 75%, transparent 98%)',
          maskImage:
            'radial-gradient(ellipse 36% 66% at 50% 50%, #000 50%, rgba(0,0,0,0.55) 75%, transparent 98%)',
        }}
      />

      {/* Stylized veil: strongest behind the button, easing out so the
          sphere reads as a backdrop instead of competing with the CTA. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-[5]"
        style={{
          background:
            'radial-gradient(ellipse 46% 60% at 50% 50%, rgba(255,255,255,0.82) 0%, rgba(255,255,255,0.55) 55%, rgba(238,242,255,0.28) 100%)',
        }}
      />

      <div className="relative z-10 flex h-full flex-col items-center justify-center gap-6 px-6">
        <Link
          href={href}
          onClick={() => track(label, href, 'cta-section')}
          className="group inline-flex items-center gap-3 rounded-full bg-[#1D4ED8] px-8 py-4 text-lg font-semibold text-white shadow-[0_20px_60px_-15px_rgba(29,78,216,0.55)] ring-1 ring-white/20 transition-all duration-300 hover:scale-[1.03] hover:bg-[#84CC16] hover:text-black hover:shadow-[0_20px_60px_-15px_rgba(132,204,22,0.55)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1D4ED8] sm:px-10 sm:py-5 sm:text-xl"
        >
          <Coffee size={22} className="transition-transform duration-300 group-hover:-rotate-6" aria-hidden="true" />
          {label}
        </Link>

        {/* Second exit, deliberately quiet. Booking a call is a big ask
            on a first visit; the playbooks read without a form. */}
        {secondaryLabel ? (
          <p className="text-center text-sm font-medium text-black/55 sm:text-base">
            Not ready for coffee?{' '}
            <Link
              href={secondaryHref}
              onClick={() => track(secondaryLabel, secondaryHref, 'cta-section-secondary')}
              className="group inline-flex items-center gap-1 font-semibold text-[#1D4ED8] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1D4ED8]"
            >
              <span className="relative">
                {secondaryLabel}
                <span className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-current transition-transform duration-300 ease-out group-hover:scale-x-100" />
              </span>
              <ArrowUpRight
                size={16}
                aria-hidden="true"
                className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>
          </p>
        ) : null}
      </div>
    </section>
  );
}
