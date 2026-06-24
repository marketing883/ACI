'use client';

/**
 * Client-only, resilient wrapper for the 3D hero visual.
 * - Lazy-loads the WebGL scene (no SSR).
 * - Always paints the gradient fallback behind it, so the slot looks
 *   intentional before/while the canvas mounts, on reduced-motion, and
 *   if WebGL is unavailable (DataNetwork self-guards and renders
 *   nothing, leaving the gradient visible).
 */

import dynamic from 'next/dynamic';
import { useReducedMotion } from 'framer-motion';
import s from './v3.module.css';

const DataNetwork = dynamic(() => import('./DataNetwork'), { ssr: false });

export default function HeroVisual() {
  const reduced = useReducedMotion();

  return (
    <div className={s.heroVisual}>
      <div className={s.heroCanvasFallback} aria-hidden />
      <div className={s.heroCanvasHolder}>
        <DataNetwork reduced={!!reduced} />
      </div>
    </div>
  );
}
