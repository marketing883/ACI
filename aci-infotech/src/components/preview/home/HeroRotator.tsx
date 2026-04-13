'use client';

/**
 * HeroRotator - reimagined homepage hero for /preview/home.
 *
 * Apple x Palantir aesthetic notes:
 *   - Apple: long ease curves, masked text reveal on the headline, staggered
 *     entrance per element (eyebrow -> headline -> sub -> proof), dramatic
 *     pacing, intentional silence.
 *   - Palantir: monospace eyebrow + proof line, hairline accents, restrained
 *     single accent (lime), no decoration noise.
 *
 * Mechanics:
 *   - Background video stays mounted; per-scene tint cross-fades (1200ms).
 *   - Active scene rendered through framer-motion AnimatePresence so exit
 *     and entrance both animate. Children stagger via variants.
 *   - H1 uses a masked clip-path reveal that wipes from bottom to top.
 *   - Scene cadence: 6500ms per scene + 900ms transition ~= ~7.4s rhythm.
 *   - Pauses on pointer enter and on focus of CTA / scene dots.
 *   - Reduced motion: scene 1 frozen, no auto-advance, no clip wipe; dots
 *     still allow manual navigation.
 *   - H1 max-width: 66% so the headline naturally breaks to two lines.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

interface Scene {
  eyebrow: string;
  headline: string;
  sub: string;
  proof: string;
  tint: string;
}

const SCENES: Scene[] = [
  {
    eyebrow: '// scope',
    headline: 'We modernize the Global Enterprise.',
    sub: "Data, AI, and cloud transformation for the world's largest operators.",
    proof: '$1B+ delivered across 80+ Fortune 500 clients',
    tint: 'rgba(0, 82, 204, 0.22)',
  },
  {
    eyebrow: '// who shows up',
    headline: 'Senior architects only. No juniors on your dime.',
    sub: 'Every engagement is led by a 10+ year practitioner. Nothing is delegated down.',
    proof: 'Avg. 14 years per engagement lead',
    tint: 'rgba(217, 119, 6, 0.24)',
  },
  {
    eyebrow: '// how we deliver',
    headline: 'Ten playbooks. Hundreds of deployments.',
    sub: 'Post-acquisition integration, multi-location rollouts, global data platforms, and seven more.',
    proof: '10 playbooks . in production',
    tint: 'rgba(13, 148, 136, 0.22)',
  },
  {
    eyebrow: '// after go-live',
    headline: 'We answer the 2am call.',
    sub: '24/7 operations with documented SLAs. The call lands here, not with a junior on a shared inbox.',
    proof: 'Operations across 14 time zones',
    tint: 'rgba(185, 28, 28, 0.22)',
  },
];

const SCENE_DURATION_MS = 6500;
const TRANSITION_MS = 900;
const PAUSE_AFTER_INTERACTION_MS = 20_000;

// Apple's signature ease (close to .designSpring): heavy out, quick start.
const EASE_OUT = [0.16, 1, 0.3, 1] as const;
const EASE_IN = [0.7, 0, 0.84, 0] as const;

// Stagger pattern for the four content lines within an active scene.
const sceneVariants = {
  enter: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
  exit: { transition: { staggerChildren: 0.04, staggerDirection: -1 } },
};

const lineVariants = {
  initial: { opacity: 0, y: 24 },
  enter: {
    opacity: 1,
    y: 0,
    transition: { duration: TRANSITION_MS / 1000, ease: EASE_OUT },
  },
  exit: {
    opacity: 0,
    y: -16,
    transition: { duration: 0.4, ease: EASE_IN },
  },
};

// Headline gets the same stagger slot but with a masked clip wipe layered on.
const headlineVariants = {
  initial: { opacity: 0, y: 28, clipPath: 'inset(100% 0% 0% 0%)' },
  enter: {
    opacity: 1,
    y: 0,
    clipPath: 'inset(0% 0% 0% 0%)',
    transition: { duration: 1.0, ease: EASE_OUT },
  },
  exit: {
    opacity: 0,
    y: -20,
    clipPath: 'inset(0% 0% 0% 0%)',
    transition: { duration: 0.45, ease: EASE_IN },
  },
};

export default function HeroRotator() {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [isMobile, setIsMobile] = useState(true);
  const [sceneIndex, setSceneIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const pauseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reduced = useReducedMotion() ?? false;

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMobile(window.innerWidth < 768);
  }, []);

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
    if (paused || reduced) return;
    const timer = setTimeout(() => {
      setSceneIndex((i) => (i + 1) % SCENES.length);
    }, SCENE_DURATION_MS);
    return () => clearTimeout(timer);
  }, [sceneIndex, paused, reduced]);

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

  const active = SCENES[sceneIndex];

  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden bg-[#0A1628]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => {
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
        {/* Base dark scrim - always on for legibility */}
        <div className="absolute inset-0 bg-[#0A1628]/[0.72]" />
        {/* Per-scene color tint, slow cross-fade */}
        {SCENES.map((s, i) => (
          <div
            key={`tint-${i}`}
            className="absolute inset-0 transition-opacity duration-[1200ms] ease-out"
            style={{
              backgroundColor: s.tint,
              opacity: i === sceneIndex ? 1 : 0,
            }}
          />
        ))}
        {/* Faint top-to-bottom gradient anchors the headline area */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/30" />
      </div>

      {/* Content - asymmetric, left-anchored, right third intentionally empty */}
      <div className="relative z-10 w-full max-w-[1440px] mx-auto px-8 md:px-16 lg:px-[120px] py-32 lg:py-40">
        {/* Content column. The wider 78% clamp lets the display headline
            break to two lines reliably across desktop widths; text-balance
            hints the browser toward a natural 2-line wrap. */}
        <div className="lg:max-w-[78%]">
          {/* Stage holds the active scene; AnimatePresence handles enter/exit. */}
          <div className="relative min-h-[420px] md:min-h-[480px] lg:min-h-[520px]">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={sceneIndex}
                variants={sceneVariants}
                initial="initial"
                animate="enter"
                exit="exit"
                className="absolute inset-0"
              >
                {/* Eyebrow */}
                <motion.div
                  variants={lineVariants}
                  className="font-mono uppercase tracking-[0.18em] text-[#C4FF61]/90 mb-6"
                  style={{ fontSize: 'clamp(11px, 1vw, 13px)' }}
                >
                  {active.eyebrow}
                </motion.div>

                {/* H1 - clip-path mask wipes the line from bottom to top.
                    text-wrap: balance lets the browser distribute words
                    across lines so the headline reads as a clean couplet
                    instead of an orphaned third line. */}
                <motion.h1
                  variants={headlineVariants}
                  className="font-bold text-white font-[var(--font-title)] mb-6"
                  style={{
                    fontSize: 'clamp(40px, 6vw, 84px)',
                    lineHeight: 1.05,
                    letterSpacing: '-0.025em',
                    textWrap: 'balance',
                    WebkitFontSmoothing: 'antialiased',
                  }}
                >
                  {active.headline}
                </motion.h1>

                {/* Supporting sentence */}
                <motion.p
                  variants={lineVariants}
                  className="max-w-[640px] mb-8 text-white/85"
                  style={{
                    fontSize: 'clamp(17px, 1.6vw, 22px)',
                    lineHeight: 1.5,
                    fontWeight: 400,
                  }}
                >
                  {active.sub}
                </motion.p>

                {/* Proof point with lead hairline */}
                <motion.div
                  variants={lineVariants}
                  className="flex items-center gap-4"
                >
                  <span className="block w-10 h-px bg-[#C4FF61]" />
                  <span
                    className="font-mono text-white/75"
                    style={{ fontSize: 'clamp(12px, 1.1vw, 14px)', letterSpacing: '0.02em' }}
                  >
                    {active.proof}
                  </span>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* CTA + scene indicators (sit outside the rotating stage so they
              hold steady while content above swaps). */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mt-2">
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

            {/* Scene indicator dots; the active dot grows into a pill and
                hosts a thin progress bar that drains over the scene's life. */}
            <div
              role="tablist"
              aria-label="Hero scene"
              className="flex items-center gap-3 pl-1 sm:pl-6 sm:border-l sm:border-white/15"
            >
              {SCENES.map((_, i) => {
                const isActive = i === sceneIndex;
                return (
                  <button
                    key={i}
                    role="tab"
                    aria-selected={isActive}
                    aria-label={`Show scene ${i + 1} of ${SCENES.length}`}
                    onClick={() => {
                      setSceneIndex(i);
                      pauseTemporarily();
                    }}
                    onFocus={() => setPaused(true)}
                    className="relative h-2 rounded-full overflow-hidden transition-all duration-300"
                    style={{
                      width: isActive ? 44 : 8,
                      backgroundColor: isActive
                        ? 'rgba(196, 255, 97, 0.25)'
                        : 'rgba(255, 255, 255, 0.35)',
                    }}
                  >
                    {isActive && !reduced && !paused && (
                      <motion.span
                        key={`fill-${sceneIndex}`}
                        className="absolute inset-y-0 left-0 bg-[#C4FF61]"
                        initial={{ width: '0%' }}
                        animate={{ width: '100%' }}
                        transition={{ duration: SCENE_DURATION_MS / 1000, ease: 'linear' }}
                      />
                    )}
                    {isActive && (reduced || paused) && (
                      <span className="absolute inset-y-0 left-0 right-0 bg-[#C4FF61]" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Subtle scroll cue */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-2">
          <div className="w-1 h-3 bg-white/60 rounded-full" />
        </div>
      </div>
    </section>
  );
}
