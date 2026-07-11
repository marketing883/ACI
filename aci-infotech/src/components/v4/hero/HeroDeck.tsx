'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ArrowRight, Instagram, Twitter, Globe } from 'lucide-react';
import FadingVideo from './FadingVideo';
import AciNav from './AciNav';
import './hero.css';

const VIDEO_1 = '/videos/v4-slide1.mp4';
const EASE = [0.16, 1, 0.3, 1] as const;

// The single scene stays put; only this message rotates while the video
// plays out. Placeholder copy — swap for the final four.
const MESSAGES = [
  {
    heading: 'Built for the curious',
    sub: 'Enterprise data and AI, engineered and run in production. One note and we will show you what stops stalling.',
  },
  {
    heading: 'Engineered to ship',
    sub: 'We wire the pipelines, unify the data, and put the models where the work actually happens.',
  },
  {
    heading: 'AI that holds up',
    sub: 'Not a demo. Systems that run in production, carry real load, and survive the audit.',
  },
  {
    heading: 'From pilot to production',
    sub: 'We take the proof of concept off the whiteboard and into the running business.',
  },
];

export default function HeroDeck({ serifClass }: { serifClass: string }) {
  const [i, setI] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return;
    const t = setInterval(() => setI((n) => (n + 1) % MESSAGES.length), 6000);
    return () => clearInterval(t);
  }, [reduce]);

  const msg = MESSAGES[i];

  return (
    <div className="hero-deck relative min-h-[100dvh] overflow-hidden bg-black text-white">
      {/* One background video, playing out under everything */}
      <FadingVideo src={VIDEO_1} className="absolute inset-0 h-full w-full object-cover" offsetY={17} />

      {/* Foreground */}
      <div className="relative z-10 flex min-h-[100dvh] flex-col">
        <AciNav />

        <div className="relative flex-1">
          {/* HEADING — rotates */}
          <div className="absolute inset-x-0 top-[30%] flex justify-center px-6 text-center">
            <AnimatePresence mode="wait">
              <motion.h1
                key={i}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.6, ease: EASE }}
                className={`text-5xl tracking-tight text-white md:text-6xl lg:text-7xl ${serifClass}`}
              >
                {msg.heading}
              </motion.h1>
            </AnimatePresence>
          </div>

          {/* ACTION — the email capture frame stays; only the sub line rotates */}
          <div className="absolute inset-x-0 top-[46%] mx-auto flex w-full max-w-xl flex-col items-center gap-4 px-6">
            <form
              onSubmit={(e) => e.preventDefault()}
              className="liquid-glass flex w-full items-center gap-3 rounded-full py-2 pl-6 pr-2"
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

            <div className="h-14 px-4">
              <AnimatePresence mode="wait">
                <motion.p
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, ease: EASE }}
                  className="text-center text-sm leading-relaxed text-white"
                >
                  {msg.sub}
                </motion.p>
              </AnimatePresence>
            </div>

            <button className="liquid-glass rounded-full px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-white/5">
              Read the manifesto
            </button>
          </div>

          {/* ACCESSORY — social icons, fixed */}
          <div className="absolute inset-x-0 bottom-12 flex justify-center gap-4">
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
        </div>

        {/* Message indicator */}
        <div className="relative z-20 flex justify-center gap-2 pb-6">
          {MESSAGES.map((_, n) => (
            <button
              key={n}
              onClick={() => setI(n)}
              aria-label={`Message ${n + 1}`}
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
