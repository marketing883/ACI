'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ArrowRight, Instagram, Twitter, Globe } from 'lucide-react';
import FadingVideo from './FadingVideo';
import AciNav from './AciNav';
import './hero.css';

const VIDEO_1 = '/videos/v4-slide1.mp4';
const VIDEO_2 = '/videos/v4-hero-bg.mp4';
const SLIDES = 2;
const EASE = [0.16, 1, 0.3, 1] as const;
const layoutT = { layout: { duration: 0.8, ease: EASE } };

// crossfade for block contents during the morph
function Swap({ k, children }: { k: string; children: React.ReactNode }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={k}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.45, ease: EASE }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

export default function HeroDeck({ serifClass }: { serifClass: string }) {
  const [i, setI] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return;
    const t = setInterval(() => setI((n) => (n + 1) % SLIDES), 8000);
    return () => clearInterval(t);
  }, [reduce]);

  const asme = i === 0;

  return (
    <div className="hero-deck relative min-h-[100dvh] overflow-hidden bg-black text-white">
      {/* Video layers, both mounted, cross-faded by slide */}
      <div
        className="absolute inset-0 transition-opacity duration-700"
        style={{ opacity: asme ? 1 : 0 }}
      >
        <FadingVideo src={VIDEO_1} className="absolute inset-0 h-full w-full object-cover" offsetY={17} active={asme} />
      </div>
      <div
        className="absolute inset-0 transition-opacity duration-700"
        style={{ opacity: asme ? 0 : 1 }}
      >
        <FadingVideo src={VIDEO_2} className="absolute inset-0 h-full w-full object-cover" active={!asme} />
      </div>

      {/* Foreground */}
      <div className="relative z-10 flex min-h-[100dvh] flex-col">
        <AciNav />

        {/* Morphing content region */}
        <div className="relative flex-1">
          {/* HEADING */}
          <motion.div
            layout
            layoutId="hero-heading"
            transition={layoutT}
            className={
              asme
                ? 'absolute inset-x-0 top-[30%] flex justify-center px-6 text-center'
                : 'absolute bottom-[190px] left-0 px-6 md:px-12 lg:px-16'
            }
          >
            {asme ? (
              <Swap k="h-asme">
                <h1
                  className={`text-5xl tracking-tight text-white md:text-6xl lg:text-7xl ${serifClass}`}
                  style={{ whiteSpace: 'nowrap' }}
                >
                  Built for the curious
                </h1>
              </Swap>
            ) : (
              <Swap k="h-vex">
                <h1
                  className="text-4xl font-normal text-white md:text-5xl lg:text-6xl xl:text-7xl"
                  style={{ letterSpacing: '-0.04em', color: '#fff' }}
                >
                  We Bring the Peace,
                  <br />
                  Your Tech Stack Deserves.
                </h1>
              </Swap>
            )}
          </motion.div>

          {/* ACTION */}
          <motion.div
            layout
            layoutId="hero-action"
            transition={layoutT}
            className={
              asme
                ? 'absolute inset-x-0 top-[46%] mx-auto flex w-full max-w-xl flex-col items-center gap-4 px-6'
                : 'absolute bottom-[120px] left-0 px-6 md:px-12 lg:px-16'
            }
          >
            {asme ? (
              <Swap k="a-asme">
                <div className="w-full space-y-4">
                  <form
                    onSubmit={(e) => e.preventDefault()}
                    className="liquid-glass flex items-center gap-3 rounded-full py-2 pl-6 pr-2"
                  >
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="flex-1 bg-transparent text-base text-white placeholder:text-white/40 focus:outline-none"
                    />
                    <button
                      type="submit"
                      aria-label="Subscribe"
                      className="rounded-full bg-white p-3 text-black transition-transform hover:scale-105"
                    >
                      <ArrowRight size={20} />
                    </button>
                  </form>
                  <p className="px-4 text-sm leading-relaxed text-white">
                    Enterprise data and AI, engineered and run in production. One note and we will
                    show you what stops stalling.
                  </p>
                  <div className="flex justify-center">
                    <button className="liquid-glass rounded-full px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-white/5">
                      Read the manifesto
                    </button>
                  </div>
                </div>
              </Swap>
            ) : (
              <Swap k="a-vex">
                <div className="flex flex-wrap gap-4">
                  <Link href="/contact" className="rounded-lg bg-white px-8 py-3 font-medium text-black transition-colors hover:bg-gray-100">
                    Get Started
                  </Link>
                  <Link href="/case-studies" className="liquid-glass rounded-lg px-8 py-3 font-medium text-white transition-colors hover:bg-white hover:text-black">
                    See Our Work
                  </Link>
                </div>
              </Swap>
            )}
          </motion.div>

          {/* ACCESSORY */}
          <motion.div
            layout
            layoutId="hero-accessory"
            transition={layoutT}
            className={
              asme
                ? 'absolute inset-x-0 bottom-12 flex justify-center gap-4'
                : 'absolute bottom-[120px] right-0 px-6 md:px-12 lg:px-16'
            }
          >
            {asme ? (
              <Swap k="ac-asme">
                <div className="flex gap-4">
                  {[
                    { Icon: Instagram, label: 'Instagram' },
                    { Icon: Twitter, label: 'X' },
                    { Icon: Globe, label: 'Website' },
                  ].map(({ Icon, label }) => (
                    <button
                      key={label}
                      aria-label={label}
                      className="liquid-glass rounded-full p-4 text-white/80 transition-all hover:bg-white/5 hover:text-white"
                    >
                      <Icon size={20} />
                    </button>
                  ))}
                </div>
              </Swap>
            ) : (
              <Swap k="ac-vex">
                <div className="liquid-glass rounded-xl px-6 py-3">
                  <span className="text-lg font-light md:text-xl lg:text-2xl">Data. AI. In production.</span>
                </div>
              </Swap>
            )}
          </motion.div>
        </div>

        {/* Slide dots */}
        <div className="relative z-20 flex justify-center gap-2 pb-6">
          {Array.from({ length: SLIDES }).map((_, n) => (
            <button
              key={n}
              onClick={() => setI(n)}
              aria-label={`Slide ${n + 1}`}
              className="h-2 rounded-full transition-all"
              style={{
                width: n === i ? 26 : 8,
                background: n === i ? '#fff' : 'rgba(255,255,255,0.35)',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
