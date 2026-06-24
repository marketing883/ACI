'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import { motion, useScroll, useSpring } from 'framer-motion';
import s from './v3.module.css';
import V3Nav from './V3Nav';
import V3Hero from './V3Hero';
import V3Proof from './V3Proof';
import V3Wedge from './V3Wedge';
import V3Industries from './V3Industries';
import V3CTA from './V3CTA';
import V3Footer from './V3Footer';

export default function V3Home() {
  // Lenis smooth scroll, gated off for reduced-motion and mobile so we
  // never fight native momentum scrolling on touch devices. Same
  // approach the live v2 site uses (SmoothScroll.tsx).
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isTouch = window.matchMedia('(max-width: 768px)').matches;
    if (prefersReduced || isTouch) return;

    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);
    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.3 });

  return (
    <div className={s.root}>
      <motion.div className={s.progress} style={{ scaleX }} aria-hidden />
      <V3Nav />
      <main>
        <V3Hero />
        <V3Proof />
        <V3Wedge />
        <V3Industries />
        <V3CTA />
      </main>
      <V3Footer />
    </div>
  );
}
