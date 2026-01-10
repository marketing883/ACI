'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';

interface CounterProps {
  end: number;
  suffix?: string;
  duration?: number;
}

function AnimatedCounter({ end, suffix = '', duration = 2000 }: CounterProps) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);

      // Easing function for smooth deceleration
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeOutQuart * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [isVisible, end, duration]);

  return (
    <div
      ref={ref}
      className="font-bold text-white font-[var(--font-title)]"
      style={{
        fontSize: 'clamp(72px, 10vw, 120px)',
        letterSpacing: '-0.03em',
        lineHeight: 1,
      }}
    >
      {count.toLocaleString()}{suffix}
    </div>
  );
}

export default function HeroSection() {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [animationStarted, setAnimationStarted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Trigger animations on mount
  useEffect(() => {
    const timer = setTimeout(() => setAnimationStarted(true), 100);
    return () => clearTimeout(timer);
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
    const timer = setTimeout(attemptVideoPlay, 100);
    return () => clearTimeout(timer);
  }, [attemptVideoPlay]);

  const handleCanPlayThrough = () => {
    setVideoLoaded(true);
    attemptVideoPlay();
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-[#0A1628]">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        {!videoError && (
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            onCanPlayThrough={handleCanPlayThrough}
            onLoadedData={() => setVideoLoaded(true)}
            onError={() => setVideoError(true)}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
              videoLoaded && !videoError ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <source src="/GettyImages-1394448388.webm" type="video/webm" />
            <source src="/GettyImages-1394448388.mp4" type="video/mp4" />
          </video>
        )}
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A1628]/95 via-[#0A1628]/80 to-[#0A1628]/60" />
        {/* Fallback */}
        <div
          className={`absolute inset-0 bg-[#0A1628] transition-opacity duration-1000 ${
            videoLoaded && !videoError ? 'opacity-0' : 'opacity-100'
          }`}
        />
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
                height: '100px',
                backgroundColor: '#C4FF61',
              }}
            />

            {/* Two-line headline with staggered animation */}
            <div className="flex flex-col">
              {/* Line 1: We're BUILT Different - 84px */}
              <h1
                className="font-bold text-white font-[var(--font-title)]"
                style={{
                  fontSize: 'clamp(42px, 7vw, 84px)',
                  lineHeight: 1.1,
                  letterSpacing: '-0.02em',
                  WebkitFontSmoothing: 'antialiased',
                  opacity: animationStarted ? 1 : 0,
                  transform: animationStarted ? 'translateY(0)' : 'translateY(20px)',
                  transition: 'opacity 200ms ease-out, transform 200ms ease-out',
                }}
              >
                We're <span style={{ color: '#C4FF61' }}>BUILT</span> Different
              </h1>

              {/* Line 2: We BUILD Different - 96px */}
              <h1
                className="font-bold text-white font-[var(--font-title)]"
                style={{
                  fontSize: 'clamp(48px, 8vw, 96px)',
                  lineHeight: 1.1,
                  letterSpacing: '-0.02em',
                  WebkitFontSmoothing: 'antialiased',
                  opacity: animationStarted ? 1 : 0,
                  transform: animationStarted ? 'translateY(0)' : 'translateY(20px)',
                  transition: 'opacity 200ms ease-out 100ms, transform 200ms ease-out 100ms',
                }}
              >
                We <span style={{ color: '#C4FF61' }}>BUILD Different</span>
              </h1>
            </div>
          </div>

          {/* Subheadline - 24px, 85% white with fade animation */}
          <p
            className="mb-[50px] max-w-[680px]"
            style={{
              fontSize: 'clamp(18px, 2vw, 24px)',
              fontWeight: 400,
              lineHeight: 1.5,
              color: 'rgba(255, 255, 255, 0.85)',
              opacity: animationStarted ? 1 : 0,
              transition: 'opacity 200ms ease-out 300ms',
            }}
          >
            Data platforms. AI systems. Cloud architectures.
            <br />
            We stand behind what we build.
          </p>

          {/* Stats Row */}
          <div className="flex flex-wrap gap-12 md:gap-16 lg:gap-24 mb-[50px]">
            <div>
              <AnimatedCounter end={80} suffix="+" duration={1500} />
              <div
                className="mt-2 uppercase font-medium"
                style={{
                  fontSize: '14px',
                  letterSpacing: '0.05em',
                  color: 'rgba(255, 255, 255, 0.7)',
                }}
              >
                Fortune 500 Clients
              </div>
            </div>
            <div>
              <AnimatedCounter end={1250} suffix="+" duration={2000} />
              <div
                className="mt-2 uppercase font-medium"
                style={{
                  fontSize: '14px',
                  letterSpacing: '0.05em',
                  color: 'rgba(255, 255, 255, 0.7)',
                }}
              >
                Engineers Worldwide
              </div>
            </div>
            <div>
              <AnimatedCounter end={19} duration={1800} />
              <div
                className="mt-2 uppercase font-medium"
                style={{
                  fontSize: '14px',
                  letterSpacing: '0.05em',
                  color: 'rgba(255, 255, 255, 0.7)',
                }}
              >
                Years in Production
              </div>
            </div>
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
              See How We Work
            </Link>

            {/* Secondary Button - Dark section */}
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-9 py-4 bg-transparent text-white text-lg font-semibold rounded-lg border border-white hover:border-[#C4FF61] hover:text-[#C4FF61] transition-all duration-200 cursor-pointer"
            >
              Talk to an Architect
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
