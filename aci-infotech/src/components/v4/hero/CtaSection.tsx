'use client';

import Link from 'next/link';
import { Coffee } from 'lucide-react';
import FadingVideo from './FadingVideo';

const VIDEO = '/videos/v4-editorial-signal.mp4';
const VIDEO_WEBM = '/videos/v4-editorial-signal.webm';

/**
 * Closing CTA — the hero's signal footage returns, centered, with a
 * single button floating in the middle of the stage. Same treatment as
 * the hero: a mild tone lift plus a radial feather so the sphere sits
 * on a uniformly white field with no visible video box.
 */
export default function CtaSection() {
  return (
    <section id="lets-talk" className="relative h-[76vh] min-h-[520px] w-full overflow-hidden border-t border-gray-200 bg-white">
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

      <div className="relative z-10 flex h-full items-center justify-center px-6">
        <Link
          href="/contact"
          className="group inline-flex items-center gap-3 rounded-full bg-black px-8 py-4 text-lg font-semibold text-white shadow-[0_20px_60px_-15px_rgba(0,0,0,0.6)] ring-1 ring-white/10 transition-all duration-300 hover:scale-[1.03] hover:bg-black/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white sm:px-10 sm:py-5 sm:text-xl"
        >
          <Coffee size={22} className="transition-transform duration-300 group-hover:-rotate-6" aria-hidden="true" />
          Let&apos;s Talk Over a Coffee
        </Link>
      </div>
    </section>
  );
}
