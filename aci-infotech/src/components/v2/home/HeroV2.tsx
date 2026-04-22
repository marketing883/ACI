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
import StackChip from './StackChip';

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
      {/* ===== AMBIENT VIDEO LAYER =====
          Stylized dark-premium treatment: heavy grayscale + dim +
          slight blur so the clip reads as atmospheric motion rather
          than a featured video. Sits at the bottom of the stack
          with a navy overlay on top; the parallax grid, node mesh,
          and glow layers then render above. Desktop only — mobile
          skips the video (static parallax is enough) to save the
          1.2MB asset on metered connections. */}
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden
        className="v2-hero-video"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: 0,
          opacity: 0.6,
          filter: 'grayscale(0.35) brightness(0.85) contrast(1.05)',
          pointerEvents: 'none',
        }}
      >
        <source src="/hero-bg-compressed.webm" type="video/webm" />
        <source src="/hero-bg-compressed.mp4" type="video/mp4" />
      </video>
      {/* Navy overlay: lighter than before so the video reads more
          clearly while text stays legible over the darker corner. */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          pointerEvents: 'none',
          background:
            'linear-gradient(135deg, rgba(5, 11, 31, 0.35) 0%, rgba(5, 11, 31, 0.62) 60%, rgba(5, 11, 31, 0.78) 100%)',
        }}
      />

      <style>{`
        @media (max-width: 767px) {
          .v2-hero-video { display: none; }
        }
      `}</style>

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
          zIndex: 2,
          ...p(0.5),
        }}
      />

      {/* Layer 2: node mesh */}
      <div aria-hidden style={{ position: 'absolute', inset: 0, opacity: 0.45, pointerEvents: 'none', zIndex: 2, ...p(1) }}>
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
          zIndex: 2,
          ...p(0.75),
        }}
      />

      {/* Layer 4: dust particles */}
      <div aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 2, ...p(2) }}>
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

      {/* spacer pushes hero content to the bottom half of the viewport */}
      <div style={{ flex: 1 }} aria-hidden />

      {/* ===== MAIN CONTENT ===== */}
      <div style={{ position: 'relative', zIndex: 4, maxWidth: 1200, marginTop: 'auto' }}>
        {/* Headline */}
        <h1
          className="v2-hero-headline"
          aria-label="We engineer the systems enterprises run on."
          style={{
            fontFamily: 'var(--font-title)',
            fontSize: 'clamp(44px, 6.5vw, 104px)',
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
            We engineer
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
                color: 'var(--v2-accent)',
              }}
            >
              systems
            </em>
          </motion.span>
          <motion.span
            style={{ display: 'block' }}
            initial={{ opacity: 0, y: 24, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0)' }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
            aria-hidden
          >
            enterprises run on.
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
              maxWidth: 500,
              color: 'var(--v2-text-secondary)',
              fontSize: 17,
              lineHeight: 1.55,
              margin: 0,
            }}
          >
            Data platforms. Cloud architectures. AI systems. Managed
            operations.{' '}
            <strong style={{ color: 'var(--v2-text-primary)', fontWeight: 500 }}>
              280+ engagements
            </strong>{' '}
            across financial services, healthcare, retail, and manufacturing.
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

      {/* ===== HERO FOOT =====
          Platform partner strip: small mono eyebrow on the left, the
          chips the firm is certified on filling the rest of the row,
          subtle scroll cue pinned to the right. Compliance badges
          (SOC 2, ISO 27001, HIPAA) and the year-anniversary numbers
          live in the certifications marquee further down the page,
          so this strip focuses purely on ecosystem depth — the
          fastest trust signal for enterprise buyers. */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.9 }}
        className="v2-hero-foot"
        style={{
          position: 'relative',
          zIndex: 4,
          marginTop: 60,
          paddingTop: 18,
          borderTop: '1px dashed var(--v2-border)',
          display: 'flex',
          alignItems: 'center',
          gap: 20,
          flexWrap: 'wrap',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'var(--v2-text-muted)',
            flexShrink: 0,
          }}
        >
          / Certified partner across
        </span>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 8,
            flex: 1,
            minWidth: 0,
          }}
        >
          {[
            'Databricks',
            'Snowflake',
            'AWS',
            'Azure',
            'Google Cloud',
            'SAP',
            'ServiceNow',
            'Microsoft Dynamics 365',
            'Salesforce',
          ].map((label) => (
            <StackChip key={label} label={label} compact />
          ))}
        </div>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'var(--v2-text-muted)',
            marginLeft: 'auto',
            flexShrink: 0,
          }}
        >
          <span
            aria-hidden
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: 'var(--v2-accent)',
              boxShadow: '0 0 8px var(--v2-accent)',
              display: 'inline-block',
            }}
          />
          Scroll ↓
        </span>
      </motion.div>
    </header>
  );
}
