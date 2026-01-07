'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Button from '@/components/ui/Button';

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
    <div ref={ref} className="text-6xl md:text-7xl lg:text-8xl font-bold text-white font-[var(--font-title)]">
      {count.toLocaleString()}{suffix}
    </div>
  );
}

export default function HeroSection() {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

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
    // Try to play video after component mounts
    const timer = setTimeout(attemptVideoPlay, 100);
    return () => clearTimeout(timer);
  }, [attemptVideoPlay]);

  // Handle video can play through
  const handleCanPlayThrough = () => {
    setVideoLoaded(true);
    attemptVideoPlay();
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        {!videoError && (
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            onCanPlayThrough={handleCanPlayThrough}
            onLoadedData={() => setVideoLoaded(true)}
            onError={() => setVideoError(true)}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
              videoLoaded && !videoError ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ willChange: 'opacity' }}
          >
            <source src="/hero-video.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )}
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
        {/* Fallback gradient while video loads or on error */}
        <div
          className={`absolute inset-0 bg-gradient-to-br from-[var(--aci-secondary)] to-[#1a2a4a] transition-opacity duration-1000 ${
            videoLoaded && !videoError ? 'opacity-0' : 'opacity-100'
          }`}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 lg:py-40">
        <div className="text-center max-w-5xl mx-auto">
          {/* Eyebrow */}
          <p className="text-[#84cc16] font-semibold mb-6 tracking-wide uppercase text-sm md:text-base">
            Engineers Who Stay
          </p>

          {/* H1 - Much larger */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white mb-8 leading-tight font-[var(--font-title)]">
            Production-Grade Engineering at Enterprise Scale
          </h1>

          {/* Subtext - Smaller */}
          <p className="text-base md:text-lg text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            We build data platforms, AI systems, and cloud architectures that run Fortune 500 operations.
            Senior architects lead every project. We ship production code with SLAs.
          </p>

          {/* Animated Stats - Very Big Numbers */}
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 lg:gap-24 mb-14">
            <div className="text-center">
              <AnimatedCounter end={19} duration={1500} />
              <div className="text-sm text-gray-400 mt-2 uppercase tracking-wider">Years Building Enterprise Systems</div>
            </div>
            <div className="text-center">
              <AnimatedCounter end={80} suffix="+" duration={1800} />
              <div className="text-sm text-gray-400 mt-2 uppercase tracking-wider">Fortune 500 Clients</div>
            </div>
            <div className="text-center">
              <AnimatedCounter end={1250} suffix="+" duration={2200} />
              <div className="text-sm text-gray-400 mt-2 uppercase tracking-wider">Engineers Worldwide</div>
            </div>
          </div>

          {/* CTA Buttons - Call to Outcome style */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              href="/case-studies"
              variant="secondary"
              size="lg"
              className="group bg-white text-[var(--aci-secondary)] hover:bg-white hover:text-[#84cc16] border-0 font-semibold text-base px-8 py-4 transition-colors"
            >
              See Our Success Stories
            </Button>
            <Button
              href="/contact"
              variant="ghost"
              size="lg"
              className="text-white border-2 border-white/50 hover:bg-white/10 hover:border-white font-semibold text-base px-8 py-4"
            >
              Start Your Transformation
            </Button>
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
