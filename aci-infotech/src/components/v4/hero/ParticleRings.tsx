'use client';

import { useEffect, useRef } from 'react';

/**
 * Dust-particle concentric rings that echo the hero's rotating "atom".
 * Each ring is a tilted ellipse of shimmering dust; the rings rotate at
 * different speeds and the whole cluster slowly floats, so it drifts
 * with the fish in the scene. Additive blend gives it a soft glow on the
 * dark water. Renders a single static frame under reduced motion.
 */
export default function ParticleRings({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    if (!canvas || !parent) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let W = 0;
    let H = 0;
    let raf = 0;
    const start = performance.now();

    // Concentric rings — nested radii, each tilted to a different plane
    // so they cross like the atom's shells. Dense, fine-grained dust.
    const RINGS = [
      { r: 0.44, flat: 0.55, speed: 0.13, tilt: -0.35, count: 130 },
      { r: 0.62, flat: 0.30, speed: 0.11, tilt: -0.55, count: 170 },
      { r: 0.82, flat: 0.85, speed: -0.08, tilt: 0.65, count: 230 },
      { r: 1.0, flat: 0.42, speed: 0.06, tilt: 1.45, count: 270 },
    ];

    const resize = () => {
      const rect = parent.getBoundingClientRect();
      W = rect.width;
      H = rect.height;
      canvas.width = Math.max(1, Math.floor(W * dpr));
      canvas.height = Math.max(1, Math.floor(H * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(parent);

    const frame = (now: number) => {
      const t = (now - start) / 1000;
      ctx.clearRect(0, 0, W, H);
      const cx = W * 0.5;
      const cy = H * 0.5 + Math.sin(t * 0.3) * H * 0.03; // slow float
      const base = Math.min(W, H) * 0.42;
      ctx.globalCompositeOperation = 'lighter';
      ctx.shadowColor = 'rgba(140,225,255,0.9)';
      ctx.shadowBlur = 3;

      RINGS.forEach((ring, ri) => {
        const rot = t * ring.speed + ri * 1.7;
        const wobble = Math.sin(t * 0.12 + ri) * 0.25;
        const cosR = Math.cos(ring.tilt + wobble);
        const sinR = Math.sin(ring.tilt + wobble);
        const rx = base * ring.r;
        const ry = base * ring.r * ring.flat;
        for (let i = 0; i < ring.count; i++) {
          const a = (i / ring.count) * Math.PI * 2 + rot;
          const ex = Math.cos(a) * rx;
          const ey = Math.sin(a) * ry;
          const x = cx + ex * cosR - ey * sinR;
          const y = cy + ex * sinR + ey * cosR;
          const sh = 0.5 + 0.5 * Math.sin(t * 2 + i * 0.7 + ri * 2);
          const size = 0.35 + sh * 0.75; // finer grains
          const alpha = 0.2 + sh * 0.45; // brighter, more present
          // mostly cool light-shaft dust, an occasional cyan spark
          ctx.fillStyle = i % 7 === 0 ? `rgba(160,240,255,${alpha})` : `rgba(205,232,255,${alpha})`;
          ctx.beginPath();
          ctx.arc(x, y, size, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      ctx.globalCompositeOperation = 'source-over';
      if (!reduce && running) raf = requestAnimationFrame(frame);
    };

    // Only spin the animation loop while the section is on screen.
    let running = false;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !running) {
          running = true;
          if (!reduce) raf = requestAnimationFrame(frame);
          else frame(performance.now());
        } else if (!entry.isIntersecting) {
          running = false;
          cancelAnimationFrame(raf);
        }
      },
      { rootMargin: '150px 0px' },
    );
    io.observe(parent);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
