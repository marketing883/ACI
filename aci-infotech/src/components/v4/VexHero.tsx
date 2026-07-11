'use client';

import { useEffect, useState } from 'react';
import './vex-hero.css';

const VIDEO_SRC = '/videos/v4-hero-bg.mp4';

function prefersReduced() {
  return typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
}

// Fade a block in after `delay` ms over `duration` ms.
function FadeIn({
  delay = 0,
  duration = 1000,
  className,
  style,
  children,
}: {
  delay?: number;
  duration?: number;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setOn(true), prefersReduced() ? 0 : delay);
    return () => clearTimeout(t);
  }, [delay]);
  return (
    <div
      className={`transition-opacity ${className ?? ''}`}
      style={{ ...style, opacity: on ? 1 : 0, transitionDuration: `${duration}ms` }}
    >
      {children}
    </div>
  );
}

// Character-by-character entrance: each char slides in from the left and
// fades up, staggered per the spec's delay formula.
function AnimatedHeading({
  text,
  className,
  style,
}: {
  text: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    if (prefersReduced()) {
      const t = setTimeout(() => setOn(true), 0);
      return () => clearTimeout(t);
    }
    const r = requestAnimationFrame(() => setOn(true));
    return () => cancelAnimationFrame(r);
  }, []);

  const lines = text.split('\n');
  const charDelay = 30;
  const initial = 200;
  const dur = 500;

  return (
    <h1 className={className} style={style}>
      {lines.map((line, li) => (
        <span key={li} style={{ display: 'block' }}>
          {Array.from(line).map((ch, ci) => {
            const delay = initial + li * line.length * charDelay + ci * charDelay;
            return (
              <span
                key={ci}
                style={{
                  display: 'inline-block',
                  whiteSpace: 'pre',
                  opacity: on ? 1 : 0,
                  transform: on ? 'translateX(0)' : 'translateX(-18px)',
                  transition: `opacity ${dur}ms ease, transform ${dur}ms cubic-bezier(0.16,1,0.3,1)`,
                  transitionDelay: `${delay}ms`,
                }}
              >
                {ch === ' ' ? ' ' : ch}
              </span>
            );
          })}
        </span>
      ))}
    </h1>
  );
}

const NAV_LINKS = ['Story', 'Investing', 'Building', 'Advisory'];

export default function VexHero() {
  return (
    <div className="vex-root relative h-dvh w-full overflow-hidden bg-black text-white">
      {/* Raw background video, no overlay */}
      <video
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
      >
        <source src={VIDEO_SRC} type="video/mp4" />
      </video>

      <div className="relative z-10 flex h-full flex-col">
        {/* Navbar */}
        <div className="px-6 pt-6 md:px-12 lg:px-16">
          <div className="liquid-glass flex items-center justify-between rounded-xl px-4 py-2">
            <span className="text-2xl font-semibold tracking-tight">VEX</span>
            <nav className="hidden items-center gap-8 md:flex">
              {NAV_LINKS.map((l) => (
                <a key={l} href="#" className="text-sm text-white transition-colors hover:text-gray-300">
                  {l}
                </a>
              ))}
            </nav>
            <button className="rounded-lg bg-white px-6 py-2 text-sm font-medium text-black transition-colors hover:bg-gray-100">
              Start a Chat
            </button>
          </div>
        </div>

        {/* Hero content, pinned to the bottom */}
        <div className="flex flex-1 flex-col justify-end px-6 pb-12 md:px-12 lg:grid lg:grid-cols-2 lg:items-end lg:px-16 lg:pb-16">
          {/* Left */}
          <div>
            <AnimatedHeading
              text={'We Bring the Peace,\nYour Tech Stack Deserves.'}
              className="mb-4 text-4xl font-normal text-white md:text-5xl lg:text-6xl xl:text-7xl"
              style={{ letterSpacing: '-0.04em', color: '#fff' }}
            />
            <FadeIn delay={800} duration={1000}>
              <p className="mb-5 max-w-xl text-base text-gray-300 md:text-lg">
                We engineer the data foundation, build the AI on top, and run it in production.
                Most enterprise AI stalls before it gets there.
              </p>
            </FadeIn>
            <FadeIn delay={1200} duration={1000}>
              <div className="flex flex-wrap gap-4">
                <button className="rounded-lg bg-white px-8 py-3 font-medium text-black transition-colors hover:bg-gray-100">
                  Get Started
                </button>
                <button className="liquid-glass rounded-lg border border-white/20 px-8 py-3 font-medium text-white transition-colors hover:bg-white hover:text-black">
                  See Our Work
                </button>
              </div>
            </FadeIn>
          </div>

          {/* Right */}
          <div className="mt-8 flex items-end justify-start lg:mt-0 lg:justify-end">
            <FadeIn delay={1400} duration={1000}>
              <div className="liquid-glass rounded-xl border border-white/20 px-6 py-3">
                <span className="text-lg font-light md:text-xl lg:text-2xl">Investing. Building. Advisory.</span>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </div>
  );
}
