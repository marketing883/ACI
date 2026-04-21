'use client';

/**
 * HeroV2 — multi-layer parallax hero with a three-line display headline.
 * Middle word is italicized and has a lime underline bar drawn behind
 * the glyph via an absolutely positioned span.
 *
 * Parallax layers (mouse-driven):
 *   1. Grid mask (blue 80×80 grid, radial-faded) — moves 10%
 *   2. Node mesh (36 SVG circles + connecting lines) — moves 20%
 *   3. Lime glow orb — moves 15%
 *   4. Dust particles — moves 40%
 *
 * On prefers-reduced-motion: parallax disabled, headline fades in
 * line-by-line rather than scramble-decrypting.
 */

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Play } from 'lucide-react';

export default function HeroV2() {
  const reduced = useReducedMotion();
  const heroRef = useRef<HTMLElement>(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  // Track mouse position relative to hero center for parallax.
  useEffect(() => {
    if (reduced) return;
    const el = heroRef.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
      const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
      setMouse({ x, y });
    };
    el.addEventListener('mousemove', onMove);
    return () => el.removeEventListener('mousemove', onMove);
  }, [reduced]);

  // Generate static node positions once — same every render, no jitter.
  const nodes = useMemo(() => {
    const out: { x: number; y: number }[] = [];
    for (let r = 0; r < 6; r++) {
      for (let c = 0; c < 6; c++) {
        const seed = r * 6 + c;
        const jx = ((seed * 37) % 100) - 50;
        const jy = ((seed * 53) % 100) - 50;
        out.push({
          x: 100 + c * 260 + jx,
          y: 80 + r * 140 + jy,
        });
      }
    }
    return out;
  }, []);

  const p = (depth: number) => ({
    transform: reduced
      ? 'none'
      : `translate3d(${mouse.x * depth * -20}px, ${mouse.y * depth * -20}px, 0)`,
    transition: 'transform 400ms cubic-bezier(0.16, 1, 0.3, 1)',
  });

  return (
    <header
      ref={heroRef}
      id="hero"
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--v2-bg)',
        color: 'var(--v2-text-primary)',
        overflow: 'hidden',
        padding: '44px',
      }}
    >
      {/* ===== PARALLAX LAYERS ===== */}
      {/* Layer 1: grid */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'linear-gradient(rgba(27, 42, 88, 0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(27, 42, 88, 0.35) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
          maskImage: 'radial-gradient(ellipse 70% 60% at 30% 50%, black 0%, transparent 80%)',
          pointerEvents: 'none',
          ...p(0.5),
        }}
      />

      {/* Layer 2: node mesh */}
      <div aria-hidden style={{ position: 'absolute', inset: 0, opacity: 0.45, pointerEvents: 'none', ...p(1) }}>
        <svg
          viewBox="0 0 1600 900"
          preserveAspectRatio="xMidYMid slice"
          style={{ width: '100%', height: '100%' }}
        >
          {/* connecting lines */}
          {nodes.map((n, i) => {
            const next = nodes[i + 1];
            if (!next || (i + 1) % 6 === 0) return null;
            return (
              <line
                key={`l-${i}`}
                x1={n.x}
                y1={n.y}
                x2={next.x}
                y2={next.y}
                stroke="#1B2A58"
                strokeWidth="1"
              />
            );
          })}
          {/* nodes */}
          {nodes.map((n, i) => (
            <circle
              key={`n-${i}`}
              cx={n.x}
              cy={n.y}
              r={i % 7 === 0 ? 3 : 1.5}
              fill={i % 7 === 0 ? '#C6FF3D' : '#2A3F7A'}
            />
          ))}
        </svg>
      </div>

      {/* Layer 3: lime glow */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(600px 400px at 25% 45%, rgba(198, 255, 61, 0.14), transparent 60%)',
          pointerEvents: 'none',
          ...p(0.75),
        }}
      />

      {/* Layer 4: dust particles */}
      <div aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none', ...p(2) }}>
        {Array.from({ length: 40 }).map((_, i) => {
          const top = ((i * 37) % 100).toString() + '%';
          const left = ((i * 53) % 100).toString() + '%';
          return (
            <span
              key={i}
              style={{
                position: 'absolute',
                top,
                left,
                width: 2,
                height: 2,
                borderRadius: '50%',
                background: 'var(--v2-accent)',
                opacity: 0.35,
                animation: `v2-drift ${6 + (i % 5)}s ease-in-out ${i * 0.1}s infinite`,
              }}
            />
          );
        })}
      </div>

      <style>{`
        @keyframes v2-drift {
          0%, 100% { transform: translate(0, 0); opacity: 0.15; }
          50%      { transform: translate(8px, -12px); opacity: 0.5; }
        }
      `}</style>

      {/* ===== TOP BAR ===== */}
      <div
        style={{
          position: 'relative',
          zIndex: 4,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          color: 'var(--v2-text-muted)',
          fontFamily: 'var(--font-mono)',
          fontSize: 11,
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          marginBottom: 'auto',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: 'var(--v2-accent)',
              boxShadow: '0 0 10px var(--v2-accent)',
              animation: 'v2-hero-pulse 1.6s ease-in-out infinite',
            }}
          />
          <span>Production-grade engineering at enterprise scale</span>
        </div>
        <div>v2026.4 · NJ ↔ HYD ↔ BLR ↔ TOR</div>
      </div>

      <style>{`
        @keyframes v2-hero-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%      { opacity: 0.5; transform: scale(1.5); }
        }
      `}</style>

      {/* ===== MAIN CONTENT ===== */}
      <div style={{ position: 'relative', zIndex: 4, maxWidth: 1200, marginTop: 'auto' }}>
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 12,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'var(--v2-text-muted)',
            marginBottom: 20,
          }}
        >
          <span>/ 001</span>
          <span style={{ color: 'var(--v2-border-strong)', margin: '0 12px' }}>—</span>
          <span>DIGITAL ENGINEERING &amp; AI</span>
        </motion.div>

        {/* Headline */}
        <h1
          className="v2-hero-headline"
          aria-label="Engineering the signal in the noise."
          style={{
            fontFamily: 'var(--font-title)',
            fontSize: 'clamp(56px, 8.5vw, 140px)',
            fontWeight: 700,
            lineHeight: 0.92,
            letterSpacing: '-0.035em',
            margin: '0 0 30px 0',
            color: 'var(--v2-text-primary)',
          }}
        >
          <motion.span
            style={{ display: 'block' }}
            initial={{ opacity: 0, y: 24, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0)' }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            aria-hidden
          >
            Engineering
          </motion.span>
          <motion.span
            style={{ display: 'block' }}
            initial={{ opacity: 0, y: 24, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0)' }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
            aria-hidden
          >
            the{' '}
            <em
              style={{
                fontStyle: 'italic',
                fontWeight: 500,
                position: 'relative',
                display: 'inline-block',
              }}
            >
              <span style={{ position: 'relative', zIndex: 1 }}>signal</span>
              <span
                aria-hidden
                style={{
                  position: 'absolute',
                  left: -4,
                  right: -4,
                  bottom: '0.12em',
                  height: '0.16em',
                  background: 'var(--v2-accent)',
                  zIndex: 0,
                }}
              />
            </em>
          </motion.span>
          <motion.span
            style={{ display: 'block' }}
            initial={{ opacity: 0, y: 24, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0)' }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
            aria-hidden
          >
            in the noise.
          </motion.span>
        </h1>

        {/* Meta row: copy + ctas */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.6 }}
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '32px 64px',
            alignItems: 'flex-end',
            marginTop: 8,
          }}
        >
          <p
            style={{
              maxWidth: 460,
              color: 'var(--v2-text-secondary)',
              fontSize: 17,
              lineHeight: 1.55,
              margin: 0,
            }}
          >
            We build, ship and run <strong style={{ color: 'var(--v2-text-primary)', fontWeight: 500 }}>production-grade systems</strong> for Fortune 500
            operations. AI, cloud, data, and the unglamorous platform work that holds them
            together.
          </p>
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            <Link
              href="/contact?source=v2-hero"
              className="v2-btn-primary"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '18px 26px',
                background: 'var(--v2-accent)',
                color: 'var(--v2-text-inverted)',
                fontFamily: 'var(--font-sans)',
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: '0.02em',
                textTransform: 'uppercase',
                borderRadius: 2,
                textDecoration: 'none',
                transition: 'background 200ms var(--v2-ease), transform 200ms var(--v2-ease)',
              }}
            >
              <span>Start a project</span>
              <ArrowRight size={14} />
            </Link>
            <Link
              href="/case-studies"
              className="v2-btn-ghost"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '18px 26px',
                background: 'transparent',
                color: 'var(--v2-text-primary)',
                fontFamily: 'var(--font-sans)',
                fontSize: 13,
                fontWeight: 500,
                letterSpacing: '0.02em',
                textTransform: 'uppercase',
                borderRadius: 2,
                border: '1px solid var(--v2-border-strong)',
                textDecoration: 'none',
                transition: 'border-color 200ms var(--v2-ease), background 200ms var(--v2-ease)',
              }}
            >
              <Play size={12} fill="currentColor" />
              <span>Explore case studies</span>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* ===== HERO FOOT ===== */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.9 }}
        style={{
          position: 'relative',
          zIndex: 4,
          marginTop: 60,
          paddingTop: 16,
          borderTop: '1px dashed var(--v2-border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 16,
          flexWrap: 'wrap',
          fontFamily: 'var(--font-mono)',
          fontSize: 11,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: 'var(--v2-text-muted)',
        }}
      >
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {['SOC 2', 'ISO 27001', 'HIPAA', 'GDPR'].map((p) => (
            <span
              key={p}
              style={{
                padding: '8px 12px',
                border: '1px solid var(--v2-border-strong)',
                borderRadius: 2,
              }}
            >
              {p}
            </span>
          ))}
        </div>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: 'var(--v2-accent)',
              boxShadow: '0 0 8px var(--v2-accent)',
              display: 'inline-block',
            }}
          />
          ~1,600 engineers online · scroll ↓
        </span>
      </motion.div>
    </header>
  );
}
