'use client';

import { useEffect, useRef } from 'react';
import '../hero/hero.css';

// Animated hero visual for service pages, config-driven so every
// service gets its own honest metaphor on shared machinery: labeled
// source nodes on the left, particle streams converging through a
// rotating dust-particle sphere at the center (the "work" the service
// does), then settling into three labeled output tiers. Everything is
// computed, not asset-based: seeded PRNG for layout, cubic Beziers for
// flow paths, a fibonacci lattice for the sphere. Pauses off-screen and
// renders a single static frame under prefers-reduced-motion.

export type FlowLogo = {
  src: string;
  alt: string;
  /** Text shown beside icon-only marks (Snowflake, Kubernetes). */
  label?: string;
  /** Rendered height in px. Padded PNGs need more than tight SVGs. */
  px?: number;
};

export type FlowSceneConfig = {
  seed: number;
  ariaLabel: string;
  /** Group title above the source column, e.g. "Sources". */
  sourcesTitle: string;
  /** Labeled source nodes, top to bottom. 4 to 6 reads best. */
  sources: string[];
  /** Name of the sphere: the thing this service actually does. */
  centerTitle: string;
  centerSub?: string;
  /** The three output tiers, top to bottom: what the client gets. */
  outputs: [string, string, string];
  /** 'deflect' bounces red threats off the core (security),
      'loopback' sends red defects back to the source (QE). */
  behavior?: 'sort' | 'deflect' | 'loopback';
  /** Legend line for the red particles, shown top right. */
  legend?: string;
  /** Real partner logos, rendered on white chips so they stay legible
      on the dark panel. */
  logos?: FlowLogo[];
  stat?: { title: string; sub: string };
  caption: string;
};

const LANE_Y = [0.26, 0.46, 0.66];
const LANE_COLORS = ['#84CC16', '#60A5FA', '#1D4ED8'];
const RED = '#F87171';
const GATE = { x: 0.46, y: 0.52 };
const SPHERE_R = 0.14; // of panel height
const DUST_COUNT = 240;
const GOLDEN = Math.PI * (3 - Math.sqrt(5));

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

/** Shared by canvas and DOM overlay so dots and labels always agree. */
function sourcePositions(n: number) {
  return Array.from({ length: n }, (_, i) => ({
    x: 0.085 + (i % 2) * 0.016,
    y: n === 1 ? 0.55 : 0.3 + (i * 0.55) / (n - 1),
  }));
}

function bezier(p0x: number, p0y: number, p1x: number, p1y: number, p2x: number, p2y: number, p3x: number, p3y: number, t: number) {
  const u = 1 - t;
  const x = u * u * u * p0x + 3 * u * u * t * p1x + 3 * u * t * t * p2x + t * t * t * p3x;
  const y = u * u * u * p0y + 3 * u * u * t * p1y + 3 * u * t * t * p2y + t * t * t * p3y;
  return { x, y };
}

type Particle = {
  sx: number; sy: number; // source (unit space)
  lane: number;           // 0..2 target tier
  ty: number;             // target y within lane
  speed: number;
  s: number;              // progress 0..1
  red: boolean;           // threat or defect, per behavior
  back: boolean;          // loopback: currently travelling home
  side: 1 | -1;           // deflect direction
};

/** Path: source -> pinch through the sphere -> fan out to a tier. */
function flowPoint(p: Particle, t: number) {
  return bezier(p.sx, p.sy, GATE.x - 0.16, p.sy * 0.4 + GATE.y * 0.6, GATE.x, GATE.y, 0.7, p.ty, t);
}

const DEFLECT_AT = 0.44;

/** Position in unit space for any particle at path progress s,
    including the deflected bounce regime for red threats. */
function posAt(p: Particle, s: number, deflecting: boolean) {
  if (!deflecting || s <= DEFLECT_AT) return flowPoint(p, Math.max(0, Math.min(1, s)));
  const e = Math.min(1, (s - DEFLECT_AT) / 0.22);
  const base = flowPoint(p, DEFLECT_AT);
  return { x: base.x - 0.06 * e, y: base.y + p.side * 0.2 * e };
}

export default function FlowScene({ config }: { config: FlowSceneConfig }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  const behavior = config.behavior ?? 'sort';

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const rand = mulberry32(config.seed);
    const sources = sourcePositions(config.sources.length).map((pos) => ({
      ...pos,
      phase: rand() * Math.PI * 2,
    }));

    // Dust sphere: fibonacci lattice, jittered so it reads as dust
    // rather than a wireframe globe.
    const dust = Array.from({ length: DUST_COUNT }, (_, i) => ({
      yu: 1 - (2 * (i + 0.5)) / DUST_COUNT,
      theta: i * GOLDEN,
      jitter: 0.8 + rand() * 0.28,
      size: 0.7 + rand() * 0.9,
      phase: rand() * Math.PI * 2,
      tint: i % 7 === 0,
    }));

    const redRatio = behavior === 'deflect' ? 0.28 : behavior === 'loopback' ? 0.22 : 0;

    const spawn = (p: Particle, fresh: boolean) => {
      const src = sources[Math.floor(rand() * sources.length)];
      const lane = Math.floor(rand() * 3);
      p.sx = src.x;
      p.sy = src.y;
      p.lane = lane;
      p.ty = LANE_Y[lane] + (rand() - 0.5) * 0.06;
      p.speed = 0.0018 + rand() * 0.0031;
      p.s = fresh ? rand() : 0;
      p.red = rand() < redRatio;
      p.back = false;
      p.side = rand() < 0.5 ? -1 : 1;
    };

    const particles: Particle[] = Array.from({ length: 90 }, () => {
      const p = { sx: 0, sy: 0, lane: 0, ty: 0, speed: 0, s: 0, red: false, back: false, side: 1 as const };
      spawn(p, true);
      return p;
    });

    let w = 0;
    let h = 0;
    let raf = 0;
    let running = true;

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
      const cx = 0.785 * w;
      const slabW = 0.23 * w;
      const slabH = 0.05 * h;
      const skew = 0.04 * w;
      LANE_Y.forEach((ly, i) => {
        const cy = ly * h;
        const lift = Math.sin(t * 0.0009 + i * 1.3) * 2;
        ctx.save();
        ctx.translate(cx, cy + lift);
        ctx.beginPath();
        ctx.moveTo(-slabW / 2 + skew, -slabH / 2);
        ctx.lineTo(slabW / 2 + skew, -slabH / 2);
        ctx.lineTo(slabW / 2 - skew, slabH / 2);
        ctx.lineTo(-slabW / 2 - skew, slabH / 2);
        ctx.closePath();
        ctx.fillStyle = `${LANE_COLORS[i]}26`;
        ctx.strokeStyle = `${LANE_COLORS[i]}99`;
        ctx.lineWidth = 1.2;
        ctx.fill();
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(-slabW / 2 - skew, slabH / 2);
        ctx.lineTo(slabW / 2 - skew, slabH / 2);
        ctx.lineTo(slabW / 2 - skew, slabH / 2 + 7);
        ctx.lineTo(-slabW / 2 - skew, slabH / 2 + 7);
        ctx.closePath();
        ctx.fillStyle = `${LANE_COLORS[i]}14`;
        ctx.fill();
        ctx.restore();
      });
    };

    const drawSphere = (t: number) => {
      const cx = GATE.x * w;
      const cy = GATE.y * h;
      const R = SPHERE_R * h;

      // soft halo behind the dust
      const halo = ctx.createRadialGradient(cx, cy, 0, cx, cy, R * 1.5);
      halo.addColorStop(0, 'rgba(96,165,250,0.12)');
      halo.addColorStop(1, 'rgba(96,165,250,0)');
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(cx, cy, R * 1.5, 0, Math.PI * 2);
      ctx.fill();

      const rot = t * 0.00035;
      dust.forEach((d) => {
        const r = Math.sqrt(Math.max(0, 1 - d.yu * d.yu));
        const th = d.theta + rot;
        const x3 = Math.cos(th) * r * d.jitter;
        const z3 = Math.sin(th) * r * d.jitter;
        const px = cx + x3 * R;
        const py = cy + d.yu * d.jitter * R * 0.96;
        const depth = (z3 + 1) / 2; // 0 back, 1 front
        const flicker = 0.75 + 0.25 * Math.sin(t * 0.002 + d.phase);
        const a = (0.1 + 0.42 * depth) * flicker;
        ctx.fillStyle = d.tint ? `rgba(96,165,250,${a})` : `rgba(255,255,255,${a})`;
        ctx.fillRect(px, py, d.size, d.size);
      });
    };

    const frame = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      drawGrid();
      drawTiers(t);

      // faint guide pipes, one per tier
      LANE_Y.forEach((ly, i) => {
        ctx.beginPath();
        for (let s = 0; s <= 1.001; s += 0.05) {
          const pt = bezier(0.12, 0.56, GATE.x - 0.16, 0.55, GATE.x, GATE.y, 0.7, ly, s);
          if (s === 0) ctx.moveTo(pt.x * w, pt.y * h);
          else ctx.lineTo(pt.x * w, pt.y * h);
        }
        ctx.strokeStyle = `${LANE_COLORS[i]}1f`;
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      drawSphere(t);

      // source nodes pulse under their labels
      sources.forEach((src) => {
        const r = 2.4 + Math.sin(t * 0.002 + src.phase) * 0.9;
        ctx.beginPath();
        ctx.arc(src.x * w, src.y * h, r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,255,255,0.6)';
        ctx.fill();
      });

      const cx = GATE.x * w;
      const cy = GATE.y * h;
      const R = SPHERE_R * h;

      particles.forEach((p) => {
        const deflecting = behavior === 'deflect' && p.red;
        const head = posAt(p, p.s, deflecting);
        const tail = posAt(p, p.s - 0.045, deflecting);

        const dx = head.x * w - cx;
        const dy = head.y * h - cy;
        const inSphere = dx * dx + dy * dy < R * R;

        let color = LANE_COLORS[p.lane];
        let alpha = inSphere ? 0.95 : 0.7;
        if (p.red && (behavior === 'deflect' || p.back)) {
          color = RED;
          alpha = 0.85;
        }
        if (deflecting && p.s > DEFLECT_AT) {
          alpha = 0.85 * (1 - Math.min(1, (p.s - DEFLECT_AT) / 0.22));
        }

        ctx.beginPath();
        ctx.moveTo(tail.x * w, tail.y * h);
        ctx.lineTo(head.x * w, head.y * h);
        ctx.strokeStyle = color;
        ctx.globalAlpha = alpha;
        ctx.lineWidth = inSphere ? 2.2 : 1.6;
        ctx.stroke();
        ctx.globalAlpha = 1;

        // advance
        if (behavior === 'loopback' && p.red) {
          if (!p.back) {
            p.s += p.speed;
            if (p.s >= 0.55) p.back = true;
          } else {
            p.s -= p.speed * 1.5;
            if (p.s <= 0.03) spawn(p, false);
          }
        } else if (deflecting) {
          p.s += p.speed;
          if (p.s >= DEFLECT_AT + 0.22) spawn(p, false);
        } else {
          p.s += p.speed;
          if (p.s >= 1) spawn(p, false);
        }
      });
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
  }, [config, behavior]);

  const srcPositions = sourcePositions(config.sources.length);

  return (
    <div
      ref={wrapRef}
      role="img"
      aria-label={config.ariaLabel}
      className="relative h-full min-h-[500px] overflow-hidden rounded-3xl"
      style={{ background: 'radial-gradient(120% 120% at 20% 0%, #0e1526 0%, #080b14 55%, #05070d 100%)' }}
    >
      <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0" />

      {/* Markings: every element of the picture is named, so a visitor
          can read the metaphor without guessing. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        {/* source column */}
        <span
          className="absolute font-mono text-[9px] font-semibold uppercase tracking-[0.2em] text-white/35"
          style={{ left: '7%', top: '25%' }}
        >
          {config.sourcesTitle}
        </span>
        {config.sources.map((label, i) => (
          <span
            key={label}
            className="absolute -translate-y-1/2 whitespace-nowrap font-mono text-[10px] tracking-wide text-white/60"
            style={{ left: `calc(${(srcPositions[i].x + 0.02) * 100}% + 6px)`, top: `${srcPositions[i].y * 100}%` }}
          >
            {label}
          </span>
        ))}

        {/* center: what the sphere is */}
        <div
          className="absolute -translate-x-1/2 text-center"
          style={{ left: `${GATE.x * 100}%`, top: '68.5%' }}
        >
          <p className="whitespace-nowrap font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-white/85">
            {config.centerTitle}
          </p>
          {config.centerSub ? (
            <p className="mt-0.5 whitespace-nowrap font-mono text-[9px] tracking-wide text-white/45">{config.centerSub}</p>
          ) : null}
        </div>

        {/* output tiers: what the client gets */}
        {config.outputs.map((label, i) => (
          <span
            key={label}
            className="absolute -translate-x-1/2 whitespace-nowrap font-mono text-[10px] font-semibold uppercase tracking-[0.12em]"
            style={{ left: '78.5%', top: `${(LANE_Y[i] - 0.078) * 100}%`, color: LANE_COLORS[i] }}
          >
            {label}
          </span>
        ))}

        {/* legend for red particles, when the behavior has them */}
        {config.legend ? (
          <span className="absolute right-5 top-5 flex items-center gap-1.5 font-mono text-[10px] tracking-wide text-white/50">
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: RED }} />
            {config.legend}
          </span>
        ) : null}

        {/* flow caption */}
        <p className="absolute bottom-4 left-5 font-mono text-[11px] tracking-wide text-white/40">{config.caption}</p>
      </div>

      {/* Real partner logos on white chips: legible at a glance on the
          dark panel, no recoloring of anyone's brand. */}
      {config.logos?.length ? (
        <div className="absolute left-5 top-5 flex max-w-[70%] flex-wrap gap-2">
          {config.logos.map((logo) => (
            <span key={logo.alt} className="flex items-center gap-2 rounded-full bg-white/95 px-4 py-2 shadow-[0_8px_24px_rgba(0,0,0,0.45)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={logo.src} alt={logo.alt} className="w-auto" style={{ height: logo.px ?? 22 }} />
              {logo.label ? <span className="text-xs font-semibold text-gray-900">{logo.label}</span> : null}
            </span>
          ))}
        </div>
      ) : null}

      {/* Stat card, bottom right. Positioned by a wrapper because
          .liquid-glass sets position: relative on itself. */}
      {config.stat ? (
        <div className="absolute bottom-4 right-4 max-w-[46%]">
          <div className="liquid-glass rounded-2xl px-5 py-3.5">
            <p className="text-sm font-semibold text-white">{config.stat.title}</p>
            <p className="mt-0.5 text-xs text-white/60">{config.stat.sub}</p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
