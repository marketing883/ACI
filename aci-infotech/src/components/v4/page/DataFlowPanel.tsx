'use client';

import { useEffect, useRef } from 'react';
import '../hero/hero.css';

// Animated hero panel for the data-engineering page: scattered source
// nodes on the left, particle streams converging through a governance
// gate, then settling into three stacked lakehouse tiers. All geometry
// is computed, not asset-based: seeded PRNG for layout, cubic Beziers
// for flow paths, sinusoidal pulses for life. Pauses off-screen and
// renders a single static frame under prefers-reduced-motion.

const BLUE = '#1D4ED8';
const SKY = '#60A5FA';
const LIME = '#84CC16';

/** Deterministic PRNG so the layout is identical on every mount. */
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Particle = {
  sx: number; sy: number; // source (unit space)
  lane: number;           // 0..2 target tier
  ty: number;             // target y within lane
  speed: number;
  s: number;              // progress 0..1
};

const LANE_Y = [0.3, 0.5, 0.7];
const LANE_COLOR = [LIME, SKY, BLUE];
const GATE = { x: 0.46, y: 0.5 };

function bezier(p0x: number, p0y: number, p1x: number, p1y: number, p2x: number, p2y: number, p3x: number, p3y: number, t: number) {
  const u = 1 - t;
  const x = u * u * u * p0x + 3 * u * u * t * p1x + 3 * u * t * t * p2x + t * t * t * p3x;
  const y = u * u * u * p0y + 3 * u * u * t * p1y + 3 * u * t * t * p2y + t * t * t * p3y;
  return { x, y };
}

/** Path: source -> pinch at the gate -> fan out to a tier slot. */
function flowPoint(p: Particle, t: number) {
  return bezier(p.sx, p.sy, GATE.x - 0.16, p.sy * 0.4 + GATE.y * 0.6, GATE.x, GATE.y, 0.68, p.ty, t);
}

export default function DataFlowPanel() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const rand = mulberry32(20260718);

    // Source nodes: two loose columns, jittered.
    const sources = Array.from({ length: 14 }, (_, i) => ({
      x: 0.07 + (i % 2) * 0.09 + rand() * 0.05,
      y: 0.12 + (Math.floor(i / 2) / 6.4) * 0.76 + rand() * 0.04,
      phase: rand() * Math.PI * 2,
    }));

    const particles: Particle[] = Array.from({ length: 110 }, () => {
      const src = sources[Math.floor(rand() * sources.length)];
      const lane = Math.floor(rand() * 3);
      return {
        sx: src.x,
        sy: src.y,
        lane,
        ty: LANE_Y[lane] + (rand() - 0.5) * 0.07,
        speed: 0.0018 + rand() * 0.0033,
        s: rand(), // stagger starts along the path
      };
    });

    let w = 0;
    let h = 0;
    let raf = 0;
    let running = true;
    let dashOffset = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = wrap.clientWidth;
      h = wrap.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const drawGrid = () => {
      const pitch = 26;
      ctx.fillStyle = 'rgba(255,255,255,0.05)';
      for (let gx = pitch; gx < w; gx += pitch) {
        for (let gy = pitch; gy < h; gy += pitch) {
          // radial vignette: fade dots toward the edges
          const dx = gx / w - 0.5;
          const dy = gy / h - 0.5;
          const fade = Math.max(0, 1 - (dx * dx + dy * dy) * 3.2);
          if (fade <= 0.05) continue;
          ctx.globalAlpha = fade * 0.6;
          ctx.fillRect(gx, gy, 1.5, 1.5);
        }
      }
      ctx.globalAlpha = 1;
    };

    const drawTiers = (t: number) => {
      // Three isometric slabs, top tier lime, stacked right of center.
      const cx = 0.8 * w;
      const slabW = 0.24 * w;
      const slabH = 0.05 * h;
      const skew = 0.045 * w;
      LANE_Y.forEach((ly, i) => {
        const cy = ly * h;
        const lift = Math.sin(t * 0.0009 + i * 1.3) * 2;
        ctx.save();
        ctx.translate(cx, cy + lift);
        // top face
        ctx.beginPath();
        ctx.moveTo(-slabW / 2 + skew, -slabH / 2);
        ctx.lineTo(slabW / 2 + skew, -slabH / 2);
        ctx.lineTo(slabW / 2 - skew, slabH / 2);
        ctx.lineTo(-slabW / 2 - skew, slabH / 2);
        ctx.closePath();
        ctx.fillStyle = `${LANE_COLOR[i]}26`;
        ctx.strokeStyle = `${LANE_COLOR[i]}99`;
        ctx.lineWidth = 1.2;
        ctx.fill();
        ctx.stroke();
        // front edge
        ctx.beginPath();
        ctx.moveTo(-slabW / 2 - skew, slabH / 2);
        ctx.lineTo(slabW / 2 - skew, slabH / 2);
        ctx.lineTo(slabW / 2 - skew, slabH / 2 + 7);
        ctx.lineTo(-slabW / 2 - skew, slabH / 2 + 7);
        ctx.closePath();
        ctx.fillStyle = `${LANE_COLOR[i]}14`;
        ctx.fill();
        ctx.restore();
      });
    };

    const drawGate = () => {
      const gx = GATE.x * w;
      const gy = GATE.y * h;
      ctx.save();
      ctx.strokeStyle = 'rgba(255,255,255,0.35)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 5]);
      ctx.lineDashOffset = -dashOffset;
      ctx.beginPath();
      ctx.arc(gx, gy, 17, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.beginPath();
      ctx.arc(gx, gy, 3, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,255,0.55)';
      ctx.fill();
      ctx.restore();
    };

    const frame = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      drawGrid();
      drawTiers(t);

      // faint guide pipes, one per tier
      LANE_Y.forEach((ly, i) => {
        ctx.beginPath();
        for (let s = 0; s <= 1.001; s += 0.05) {
          const pt = bezier(0.14, 0.5, GATE.x - 0.16, 0.5, GATE.x, GATE.y, 0.68, ly, s);
          if (s === 0) ctx.moveTo(pt.x * w, pt.y * h);
          else ctx.lineTo(pt.x * w, pt.y * h);
        }
        ctx.strokeStyle = `${LANE_COLOR[i]}1f`;
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      // source nodes pulse
      sources.forEach((src) => {
        const r = 2.4 + Math.sin(t * 0.002 + src.phase) * 0.9;
        ctx.beginPath();
        ctx.arc(src.x * w, src.y * h, r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,255,255,0.55)';
        ctx.fill();
      });

      // particles with short trails
      particles.forEach((p) => {
        const head = flowPoint(p, p.s);
        const tail = flowPoint(p, Math.max(0, p.s - 0.045));
        ctx.beginPath();
        ctx.moveTo(tail.x * w, tail.y * h);
        ctx.lineTo(head.x * w, head.y * h);
        ctx.strokeStyle = `${LANE_COLOR[p.lane]}b3`;
        ctx.lineWidth = 1.6;
        ctx.stroke();
        p.s += p.speed;
        if (p.s >= 1) {
          const src = sources[Math.floor(Math.random() * sources.length)];
          p.sx = src.x;
          p.sy = src.y;
          p.s = 0;
        }
      });

      drawGate();
      dashOffset += 0.25;
    };

    resize();
    if (reduce) {
      // Single legible frame: mid-flight particles, no animation loop.
      frame(0);
    } else {
      const loop = (t: number) => {
        if (running) frame(t);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    }

    const io = new IntersectionObserver(([entry]) => {
      running = entry.isIntersecting;
    });
    io.observe(wrap);
    window.addEventListener('resize', resize);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      aria-label="Animated depiction of data flowing from scattered source systems through a governance gate into a three-tier lakehouse"
      className="relative h-full min-h-[440px] overflow-hidden rounded-3xl"
      style={{ background: 'radial-gradient(120% 120% at 20% 0%, #0e1526 0%, #080b14 55%, #05070d 100%)' }}
    >
      <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0" />

      {/* Liquid-glass chips: the certifications, pinned to the picture */}
      <div className="absolute left-5 top-5 flex flex-col gap-2.5">
        <span className="liquid-glass inline-flex items-center rounded-full px-4 py-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/databricks-color.svg" alt="Databricks" className="h-5 w-auto" />
        </span>
        <span className="liquid-glass inline-flex items-center gap-2 rounded-full px-4 py-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/Solution-Partners/snowflake.svg" alt="Snowflake" className="h-5 w-auto" />
          <span className="text-xs font-semibold text-white/85">Snowflake</span>
        </span>
      </div>

      {/* Tier caption, bottom right */}
      <p className="absolute bottom-5 right-6 font-mono text-[11px] tracking-wide text-white/40">
        raw &rarr; governed &rarr; served
      </p>

      {/* Stat card, bottom left. Positioned by a wrapper because
          .liquid-glass sets position: relative on itself. */}
      <div className="absolute bottom-5 left-5">
        <div className="liquid-glass rounded-2xl px-5 py-3.5">
          <p className="text-sm font-semibold text-white">40+ lakehouse implementations</p>
          <p className="mt-0.5 text-xs text-white/60">Certified on both platforms. Run in production.</p>
        </div>
      </div>
    </div>
  );
}
