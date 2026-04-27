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
import { ArrowRight } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

interface Scene {
  /**
   * Headline is authored as a two-line tuple [topLine, bottomLine] so each
   * scene renders as exactly two lines, regardless of viewport width. This
   * lets us keep dramatic display sizing without relying on the browser to
   * guess good break points.
   */
  headline: [string, string];
  sub: string;
  /**
   * Per-scene CTA. Each slide points to the most relevant destination for
   * that message, so the hero functions as the site's primary wayfinding
   * layer instead of a single universal button.
   */
  cta: { label: string; href: string };
  /**
   * Subtle color wash layered over the dark scrim. Kept in a cool
   * brand-aligned family across all four scenes so the hero never drifts
   * into red/brown territory.
   */
  tint: string;
}

const SCENES: Scene[] = [
  {
    headline: ['We Build and Run', 'Enterprise Technology Systems.'],
    sub: 'Data, AI, cloud, and applications. For companies that need it done right the first\u00A0time.',
    cta: { label: 'What We Do', href: '/services' },
    tint: 'rgba(0, 82, 204, 0.22)', // aci primary blue
  },
  {
    headline: [
      'From Raw Data to Decisions',
      'That Actually Move the Business.',
    ],
    sub: 'We have done this for Fortune-scale operators across finance, retail, hospitality, and manufacturing. The infrastructure is proven. The outcomes are\u00A0documented.',
    cta: { label: 'See the Work', href: '/case-studies' },
    tint: 'rgba(13, 148, 136, 0.22)', // teal 600
  },
  {
    headline: ['Enterprise AI', 'That Ships to Production.'],
    sub: 'ArqAI is where we build and deploy AI for enterprises. From strategy to working systems, in production, at\u00A0scale.',
    cta: { label: 'See ArqAI', href: '#arqai' },
    tint: 'rgba(124, 58, 237, 0.22)', // violet 600, AI signal
  },
  {
    headline: ['Start With', 'Your Problem.'],
    sub: 'We have documented the architectures, the decisions, and the outcomes from our enterprise deployments. Find the one that looks like\u00A0yours.',
    cta: { label: 'See the Playbooks', href: '/playbooks' },
    tint: 'rgba(67, 56, 202, 0.22)', // indigo 700
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

// Headline gets the same stagger slot but with a top-down reveal.
// We used to drive the reveal with `clip-path: inset(...)` animated via
// framer-motion; iOS Safari is flaky animating clip-path on block-level
// elements (animation parser hiccups mid-reflow). `mask-image` with a
// linear gradient whose stops animate is supported everywhere we care
// about and avoids the WebKit foot-guns. The visual is identical: a
// wipe from top to bottom paired with a soft vertical rise.
const headlineVariants = {
  initial: {
    opacity: 0,
    y: 28,
    WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 0%, transparent 0%, transparent 100%)',
    maskImage: 'linear-gradient(to bottom, black 0%, black 0%, transparent 0%, transparent 100%)',
  },
  enter: {
    opacity: 1,
    y: 0,
    WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 100%, transparent 100%, transparent 100%)',
    maskImage: 'linear-gradient(to bottom, black 0%, black 100%, transparent 100%, transparent 100%)',
    transition: { duration: 1.0, ease: EASE_OUT },
  },
  exit: {
    opacity: 0,
    y: -20,
    WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 100%, transparent 100%, transparent 100%)',
    maskImage: 'linear-gradient(to bottom, black 0%, black 100%, transparent 100%, transparent 100%)',
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

      {/* Content. Tighter vertical padding keeps the CTA row inside the
          first viewport at typical desktop heights (900-1100px). */}
      {/* Asymmetric vertical padding: heavier top so the H1 has real
          breathing room below the fixed nav instead of crowding into
          it. The section is flex items-center, so padding is the
          lever that shifts the visible content block downward. */}
      <div className="relative z-10 w-full max-w-[1440px] mx-auto px-8 md:px-16 lg:px-[120px] pt-40 pb-24 md:pt-48 md:pb-28 lg:pt-56 lg:pb-32">
        {/* The content column spans the full padded width so the longest
            headline ("Senior architects only. No juniors on your dime.")
            still resolves to two lines. The sub + proof are constrained
            separately below so they don't stretch to full width. */}
        <div className="w-full">
          {/* Stage holds the active scene; AnimatePresence handles enter/exit.
              Reserved height is sized to hold a two-line headline plus the
              sub + proof, with no extra padding that would push the CTA
              below the fold. */}
          <div className="relative min-h-[300px] md:min-h-[340px] lg:min-h-[360px]">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={sceneIndex}
                variants={sceneVariants}
                initial="initial"
                animate="enter"
                exit="exit"
                className="absolute inset-0"
              >
                {/* H1 - clip-path mask wipes the couplet from bottom to top.
                    The two lines are authored in the scene data and rendered
                    as explicit block spans, so every scene reads as a clean
                    two-line couplet across every viewport. */}
                <motion.h1
                  variants={headlineVariants}
                  className="font-bold text-white font-[var(--font-title)] mb-6"
                  style={{
                    fontSize: 'clamp(36px, 5.2vw, 72px)',
                    lineHeight: 1.05,
                    letterSpacing: '-0.025em',
                    WebkitFontSmoothing: 'antialiased',
                  }}
                >
                  <span className="block">{active.headline[0]}</span>
                  <span className="block">{active.headline[1]}</span>
                </motion.h1>

                {/* Supporting sentence */}
                <motion.p
                  variants={lineVariants}
                  className="max-w-[640px] text-white/85"
                  style={{
                    fontSize: 'clamp(16px, 1.4vw, 20px)',
                    lineHeight: 1.5,
                    fontWeight: 400,
                  }}
                >
                  {active.sub}
                </motion.p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* CTA + scene indicators (sit outside the rotating stage so they
              hold steady while content above swaps). Tight top margin so
              the button is always visible inside the first viewport. */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mt-6 md:mt-8">
            <Link
              key={`cta-${sceneIndex}`}
              href={active.cta.href}
              onFocus={() => setPaused(true)}
              onBlur={() => {
                if (!pauseTimeoutRef.current) setPaused(false);
              }}
              className="group inline-flex items-center gap-2.5 px-8 py-4 bg-[#C4FF61] text-[#0A1628] text-lg font-semibold rounded-lg hover:-translate-y-0.5 transition-all duration-200"
            >
              <span>{active.cta.label}</span>
              <ArrowRight
                className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1"
                strokeWidth={2.25}
                aria-hidden
              />
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
