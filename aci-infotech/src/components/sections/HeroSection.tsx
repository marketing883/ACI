'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';

function HeroStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex-shrink-0">
      <div
        className="font-bold text-white font-[var(--font-title)]"
        style={{
          fontSize: 'clamp(36px, 8vw, 120px)',
          letterSpacing: '-0.03em',
          lineHeight: 1,
        }}
      >
        {value}
      </div>
      <div
        className="mt-2 uppercase font-medium whitespace-nowrap"
        style={{
          fontSize: 'clamp(10px, 1.2vw, 14px)',
          letterSpacing: '0.05em',
          color: 'rgba(255, 255, 255, 0.7)',
        }}
      >
        {label}
      </div>
    </div>
  );
}

export default function HeroSection() {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [isMobile, setIsMobile] = useState(true); // Default true to skip video on SSR
  const videoRef = useRef<HTMLVideoElement>(null);

  // Detect mobile to skip video entirely (saves 5MB+ on mobile connections)
  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  // Manually trigger video play to handle browser autoplay policies
  const attemptVideoPlay = useCallback(async () => {
    if (videoRef.current) {
      try {
        await videoRef.current.play();
      } catch (err) {
        console.log('Video autoplay prevented, will play on interaction');
      }
    }
  }, []);

  useEffect(() => {
    if (isMobile) return;
    const timer = setTimeout(attemptVideoPlay, 100);
    return () => clearTimeout(timer);
  }, [attemptVideoPlay, isMobile]);

  const handleCanPlayThrough = () => {
    setVideoLoaded(true);
    attemptVideoPlay();
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-[#0A1628]">
      {/* Video Background - desktop only; mobile uses poster image */}
      <div className="absolute inset-0 z-0">
        {!isMobile && !videoError && (
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            preload="none"
            poster="/images/hero-poster.webp"
            onCanPlayThrough={handleCanPlayThrough}
            onLoadedData={() => setVideoLoaded(true)}
            onError={() => setVideoError(true)}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
              videoLoaded && !videoError ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <source src="/hero-bg-compressed.webm" type="video/webm" />
            <source src="/hero-bg-compressed.mp4" type="video/mp4" />
          </video>
        )}
        {/* Poster image for mobile / video fallback */}
        {(isMobile || !videoLoaded || videoError) && (
          <img
            src="/images/hero-poster.webp"
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A1628]/95 via-[#0A1628]/80 to-[#0A1628]/60" />
        {/* Fallback solid color beneath poster/video */}
        <div className="absolute inset-0 bg-[#0A1628] -z-10" />
      </div>

      {/* Geometric Accent - Right side */}
      <div
        className="absolute right-0 top-0 w-1/2 h-full z-[1] pointer-events-none hidden lg:block"
        style={{
          background: 'linear-gradient(135deg, transparent 0%, rgba(0, 82, 204, 0.15) 50%, transparent 100%)',
          clipPath: 'polygon(30% 0, 100% 0, 100% 100%, 0% 100%)',
        }}
      />

      {/* Content - LEFT ALIGNED */}
      <div className="relative z-10 w-full max-w-[1440px] mx-auto px-8 md:px-16 lg:px-[120px] py-32 lg:py-40">
        <div className="max-w-4xl">
          {/* Headline with Lime Accent Line */}
          <div className="flex items-start gap-6 mb-4">
            {/* Lime accent line */}
            <div
              className="hidden md:block flex-shrink-0 mt-4"
              style={{
                width: '4px',
                height: '170px',
                backgroundColor: '#C4FF61',
              }}
            />

            {/* Two-line headline with CSS-only staggered animation */}
            <div className="flex flex-col">
              {/* Line 1: Modernizing the */}
              <h1
                className="font-bold text-white font-[var(--font-title)] animate-[heroFadeUp_0.3s_ease-out_both]"
                style={{
                  fontSize: 'clamp(42px, 7vw, 84px)',
                  lineHeight: 1.1,
                  letterSpacing: '-0.02em',
                  WebkitFontSmoothing: 'antialiased',
                }}
              >
                Modernizing the
              </h1>

              {/* Line 2: Global Enterprise. - lime green */}
              <h1
                className="font-bold font-[var(--font-title)] animate-[heroFadeUp_0.3s_ease-out_0.1s_both]"
                style={{
                  fontSize: 'clamp(48px, 8vw, 96px)',
                  lineHeight: 1.1,
                  letterSpacing: '-0.02em',
                  WebkitFontSmoothing: 'antialiased',
                  color: '#C4FF61',
                }}
              >
                Global Enterprise.
              </h1>
            </div>
          </div>

          {/* Subheadline - 24px, 85% white with CSS fade animation */}
          <p
            className="mb-[50px] max-w-[680px] animate-[heroFadeIn_0.3s_ease-out_0.2s_both]"
            style={{
              fontSize: 'clamp(18px, 2vw, 24px)',
              fontWeight: 400,
              lineHeight: 1.5,
              color: 'rgba(255, 255, 255, 0.85)',
            }}
          >
            Data platforms. AI systems. Cloud architectures.
            <br />
            We stand behind what we build.
          </p>

          {/* Stats Row - Static values, no animation to avoid hydration flicker */}
          <div className="flex flex-nowrap gap-6 sm:gap-8 md:gap-16 lg:gap-24 mb-[50px]">
            <HeroStat value="$1B+" label="Value Delivered to Clients" />
            <HeroStat value="1,250+" label="Engineers Worldwide" />
            <HeroStat value="80+" label="Fortune 500 Clients Served" />
          </div>

          {/* Buttons - 50px gap from stats */}
          <div className="flex flex-col sm:flex-row gap-6">
            {/* Primary Button */}
            <Link
              href="/case-studies"
              className="group relative inline-flex items-center justify-center gap-3 px-9 py-4 bg-[#0052CC] text-white text-lg font-semibold rounded-lg hover:text-[#C4FF61] transition-all duration-200 cursor-pointer"
            >
              {/* Lime dot accent */}
              <span className="flex-shrink-0 w-1.5 h-1.5 bg-[#C4FF61] rounded-full" />
              Strategic Engagements
            </Link>

            {/* Secondary Button - Dark section */}
            <Link
              href="/about"
              className="inline-flex items-center justify-center px-9 py-4 bg-transparent text-white text-lg font-semibold rounded-lg border border-white hover:border-[#C4FF61] hover:text-[#C4FF61] transition-all duration-200 cursor-pointer"
            >
              Our 20-Year Legacy
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-2">
          <div className="w-1 h-3 bg-white/60 rounded-full" />
        </div>
      </div>
    </section>
  );
}
