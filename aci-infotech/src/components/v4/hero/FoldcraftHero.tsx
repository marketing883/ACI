'use client';

import { ArrowRight } from 'lucide-react';
import './foldcraft.css';

/**
 * Fullscreen video-hero section (Foldcraft spec). Nav/menu intentionally
 * omitted — this is a content section on the v4 page, not a standalone
 * page, so the persistent ACI nav above serves navigation. Content and
 * treatment (placeholder here) will be finalized later.
 */
export default function FoldcraftHero({ geistClass }: { geistClass: string }) {
  return (
    <section className={`foldcraft relative h-screen w-full overflow-hidden bg-black ${geistClass}`}>
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="absolute inset-0 h-full w-full object-cover"
        style={{ objectPosition: '70% center' }}
      >
        <source src="/videos/foldcraft.webm" type="video/webm" />
        <source src="/videos/foldcraft.mp4" type="video/mp4" />
      </video>

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col justify-between px-6 pb-10 pt-12 sm:pb-12 sm:pt-16 md:px-12 md:pb-16 md:pt-20 lg:px-16">
        {/* Top */}
        <div className="max-w-3xl">
          <div className="fc-anim fc-d1 mb-4 sm:mb-6">
            <span className="inline-flex items-center rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-xs text-white/90 backdrop-blur-sm sm:text-sm">
              Brand &amp; Visual Storytelling
            </span>
          </div>
          <h1 className="fc-anim fc-d2 text-3xl font-medium leading-[1.1] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
            Shaping visual
            <br />
            narratives,
            <br />
            one pixel at a time.
          </h1>
        </div>

        {/* Bottom */}
        <div>
          <p className="fc-anim fc-d3 mb-5 max-w-sm text-sm leading-relaxed text-white/60 sm:mb-6 sm:max-w-lg sm:text-base md:text-lg">
            Turning vision into reality through craft, motion, and an endless pursuit of beauty.
          </p>
          <button className="fc-anim fc-d4 inline-flex items-center gap-2 rounded-lg bg-white px-5 py-2.5 text-sm font-medium text-black transition-transform hover:scale-105 sm:px-6 sm:py-3">
            Explore Work
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}
