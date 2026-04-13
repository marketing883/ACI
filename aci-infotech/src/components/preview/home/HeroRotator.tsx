'use client';

/**
 * HeroRotator - reimagined homepage hero for /preview/home.
 *
 * Structural break from live HeroSection:
 *   - No static H1 + 2x2 proof-chip grid.
 *   - Instead: 4 scenes that rotate as a unit (eyebrow + H1 + sub + proof
 *     + overlay tint all swap together).
 *   - Asymmetric left-anchored composition; right third breathes.
 *   - Single persistent CTA across all scenes ("Start here").
 *
 * Rotation: 7s per scene, 600ms cross-fade (opacity + 4px translate-y).
 * Pauses on pointer hover and when the CTA/dots take focus. Clicking a
 * dot jumps to that scene and pauses rotation for 20s before resuming.
 * prefers-reduced-motion: freezes on scene 1; dots still work manually.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';

interface Scene {
  eyebrow: string;
  headline: string;
  sub: string;
  proof: string;
  tint: string; // CSS color with alpha for the scene overlay wash.
}

const SCENES: Scene[] = [
  {
    eyebrow: '// scope',
    headline: 'We modernize the Global Enterprise.',
    sub: "Data, AI, and cloud transformation for the world's largest operators.",
    proof: '$1B+ delivered across 80+ Fortune 500 clients',
    tint: 'rgba(0, 82, 204, 0.22)', // aci-primary blue
  },
  {
    eyebrow: '// who shows up',
    headline: 'Senior architects only. No juniors on your dime.',
    sub: 'Every engagement is led by a 10+ year practitioner. Nothing is delegated down.',
    proof: 'Avg. 14 years per engagement lead',
    tint: 'rgba(217, 119, 6, 0.24)', // warm amber
  },
  {
    eyebrow: '// how we deliver',
    headline: 'Ten playbooks. Hundreds of deployments.',
    sub: 'Post-acquisition integration, multi-location rollouts, global data platforms, and seven more.',
    proof: '10 playbooks . in production',
    tint: 'rgba(13, 148, 136, 0.22)', // deep teal
  },
  {
    eyebrow: '// after go-live',
    headline: 'We answer the 2am call.',
    sub: '24/7 operations with documented SLAs. The call lands here, not with a junior on a shared inbox.',
    proof: 'Operations across 14 time zones',
    tint: 'rgba(185, 28, 28, 0.22)', // restrained crimson
  },
];

const SCENE_DURATION_MS = 7000;
const PAUSE_AFTER_INTERACTION_MS = 20_000;

export default function HeroRotator() {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [isMobile, setIsMobile] = useState(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [sceneIndex, setSceneIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const pauseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Detect mobile + reduced motion on mount. Window-dependent reads have to
  // happen post-mount to keep SSR consistent, so the setState calls inside
  // this effect are intentional.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMobile(window.innerWidth < 768);
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  // Attempt video autoplay on desktop.
  const attemptVideoPlay = useCallback(async () => {
    if (videoRef.current) {
      try {
        await videoRef.current.play();
      } catch {
        // autoplay blocked; will play on interaction.
      }
    }
  }, []);

  useEffect(() => {
    if (isMobile) return;
    const timer = setTimeout(attemptVideoPlay, 100);
    return () => clearTimeout(timer);
  }, [attemptVideoPlay, isMobile]);

  // Auto-advance scenes unless paused or reduced-motion.
  useEffect(() => {
    if (paused || prefersReducedMotion) return;
    const timer = setTimeout(() => {
      setSceneIndex((i) => (i + 1) % SCENES.length);
    }, SCENE_DURATION_MS);
    return () => clearTimeout(timer);
  }, [sceneIndex, paused, prefersReducedMotion]);

  // Pause rotation for a window after the user interacts (click a dot).
  const pauseTemporarily = useCallback(() => {
    setPaused(true);
    if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
    pauseTimeoutRef.current = setTimeout(() => setPaused(false), PAUSE_AFTER_INTERACTION_MS);
  }, []);

  useEffect(() => {
    return () => {
      if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
    };
  }, []);

  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden bg-[#0A1628]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => {
        // Only resume if no manual-interaction pause is active.
        if (!pauseTimeoutRef.current) setPaused(false);
      }}
    >
      {/* Background video (desktop) or poster (mobile / fallback) */}
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
            onCanPlayThrough={() => {
              setVideoLoaded(true);
              attemptVideoPlay();
            }}
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
        {(isMobile || !videoLoaded || videoError) && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src="/images/hero-poster.webp"
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        {/* Base dark scrim - always on */}
        <div className="absolute inset-0 bg-[#0A1628]/[0.72]" />
        {/* Per-scene color tint, cross-fades with the scene */}
        {SCENES.map((s, i) => (
          <div
            key={`tint-${i}`}
            className="absolute inset-0 transition-opacity duration-[600ms] ease-out"
            style={{
              backgroundColor: s.tint,
              opacity: i === sceneIndex ? 1 : 0,
            }}
          />
        ))}
        {/* Fallback solid color beneath everything */}
        <div className="absolute inset-0 bg-[#0A1628] -z-10" />
      </div>

      {/* Content - asymmetric, left-anchored, right third intentionally empty */}
      <div className="relative z-10 w-full max-w-[1440px] mx-auto px-8 md:px-16 lg:px-[120px] py-32 lg:py-40">
        <div className="lg:max-w-[60%]">
          {/* Stacked scenes - only the active one is visible; cross-fade between */}
          <div className="relative min-h-[380px] md:min-h-[440px] lg:min-h-[480px]">
            {SCENES.map((s, i) => {
              const active = i === sceneIndex;
              return (
                <div
                  key={i}
                  aria-hidden={!active}
                  className={`${
                    active ? 'relative' : 'absolute inset-0 pointer-events-none'
                  } transition-all duration-[600ms] ease-out`}
                  style={{
                    opacity: active ? 1 : 0,
                    transform: active ? 'translateY(0)' : 'translateY(4px)',
                  }}
                >
                  {/* Eyebrow - small-caps monospace */}
                  <div
                    className="font-mono uppercase tracking-[0.18em] text-[#C4FF61]/90 mb-6"
                    style={{ fontSize: 'clamp(11px, 1vw, 13px)' }}
                  >
                    {s.eyebrow}
                  </div>

                  {/* H1 - huge display */}
                  <h1
                    className="font-bold text-white font-[var(--font-title)] mb-6"
                    style={{
                      fontSize: 'clamp(42px, 7vw, 96px)',
                      lineHeight: 1.05,
                      letterSpacing: '-0.025em',
                      WebkitFontSmoothing: 'antialiased',
                    }}
                  >
                    {s.headline}
                  </h1>

                  {/* Supporting sentence */}
                  <p
                    className="max-w-[640px] mb-8 text-white/85"
                    style={{
                      fontSize: 'clamp(17px, 1.6vw, 22px)',
                      lineHeight: 1.5,
                      fontWeight: 400,
                    }}
                  >
                    {s.sub}
                  </p>

                  {/* Proof point - with lead hairline */}
                  <div className="flex items-center gap-4 mb-10">
                    <span className="block w-10 h-px bg-[#C4FF61]" />
                    <span
                      className="font-mono text-white/75"
                      style={{ fontSize: 'clamp(12px, 1.1vw, 14px)', letterSpacing: '0.02em' }}
                    >
                      {s.proof}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Single persistent CTA - tracks the active scene via query param */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <Link
              href={`/contact?reason=home-hero-v2&scene=${sceneIndex + 1}`}
              onFocus={() => setPaused(true)}
              onBlur={() => {
                if (!pauseTimeoutRef.current) setPaused(false);
              }}
              className="group inline-flex items-center gap-3 px-8 py-4 bg-[#C4FF61] text-[#0A1628] text-lg font-semibold rounded-lg hover:-translate-y-0.5 transition-all duration-200"
            >
              <span className="flex-shrink-0 w-1.5 h-1.5 bg-[#0A1628] rounded-full" />
              Start here
              <span className="ml-1 transition-transform duration-200 group-hover:translate-x-1">
                -&gt;
              </span>
            </Link>

            {/* Scene indicator dots */}
            <div
              role="tablist"
              aria-label="Hero scene"
              className="flex items-center gap-3 pl-1 sm:pl-6 sm:border-l sm:border-white/15"
            >
              {SCENES.map((_, i) => {
                const active = i === sceneIndex;
                return (
                  <button
                    key={i}
                    role="tab"
                    aria-selected={active}
                    aria-label={`Show scene ${i + 1} of ${SCENES.length}`}
                    onClick={() => {
                      setSceneIndex(i);
                      pauseTemporarily();
                    }}
                    onFocus={() => setPaused(true)}
                    className="group relative h-2 rounded-full transition-all duration-200"
                    style={{
                      width: active ? 28 : 8,
                      backgroundColor: active
                        ? '#C4FF61'
                        : 'rgba(255, 255, 255, 0.35)',
                    }}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Subtle scroll indicator, matches live hero's pacing cue */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-2">
          <div className="w-1 h-3 bg-white/60 rounded-full" />
        </div>
      </div>
    </section>
  );
}
