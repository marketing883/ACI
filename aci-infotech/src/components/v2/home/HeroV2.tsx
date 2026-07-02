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

import { useEffect, useMemo, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import StackChip from './StackChip';
import { MagneticButton } from '../craft/MagneticButton';

export default function HeroV2() {
  const reduced = useReducedMotion();
  const heroRef = useRef<HTMLElement>(null);
  // Each parallax layer keeps its own ref so the mousemove handler can
  // mutate transform directly without a React re-render. setState() per
  // mousemove (the previous approach) reconciled the entire hero subtree
  // — including all 18 dust particles and 36 SVG nodes — every frame.
  const layerGridRef = useRef<HTMLDivElement>(null);
  const layerNodesRef = useRef<HTMLDivElement>(null);
  const layerGlowRef = useRef<HTMLDivElement>(null);
  const layerDustRef = useRef<HTMLDivElement>(null);

  // Track mouse position relative to hero center for parallax.
  useEffect(() => {
    if (reduced) return;
    const el = heroRef.current;
    if (!el) return;
    const layers: { el: HTMLDivElement | null; depth: number }[] = [
      { el: layerGridRef.current, depth: 0.5 },
      { el: layerNodesRef.current, depth: 1 },
      { el: layerGlowRef.current, depth: 0.75 },
      { el: layerDustRef.current, depth: 2 },
    ];
    let rafId = 0;
    let pending = false;
    let lastX = 0;
    let lastY = 0;
    const apply = () => {
      pending = false;
      for (const { el: layerEl, depth } of layers) {
        if (!layerEl) continue;
        layerEl.style.transform = `translate3d(${lastX * depth * -20}px, ${lastY * depth * -20}px, 0)`;
      }
    };
    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      lastX = (e.clientX - rect.left - rect.width / 2) / rect.width;
      lastY = (e.clientY - rect.top - rect.height / 2) / rect.height;
      if (pending) return;
      pending = true;
      rafId = requestAnimationFrame(apply);
    };
    el.addEventListener('mousemove', onMove, { passive: true });
    return () => {
      el.removeEventListener('mousemove', onMove);
      if (rafId) cancelAnimationFrame(rafId);
    };
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

  // Static style shared by every parallax layer. The actual transform
  // is mutated on each layer's element by the mousemove handler above
  // (or stays 'none' under prefers-reduced-motion). CSS transition
  // smooths between successive imperative updates.
  const parallaxBase: React.CSSProperties = {
    transition: 'transform 400ms cubic-bezier(0.16, 1, 0.3, 1)',
    willChange: 'transform',
    backfaceVisibility: 'hidden',
  };

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
        preload="none"
        aria-hidden
        className="v2-hero-video"
        // 1×1 inline SVG matching --v2-bg. Paints instantly so the
        // hero rect doesn't sit empty (or default white in some
        // browsers) for the few hundred ms before the video decodes
        // its first frame. Improves LCP and removes the white flash
        // on slow connections. Final composite is identical: the
        // video lands on top, opacity:0.5 + grayscale + the navy
        // gradient overlay.
        poster="data:image/svg+xml;utf8,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%201%201'%3E%3Crect%20width='1'%20height='1'%20fill='%23050B1F'/%3E%3C/svg%3E"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: 0,
          opacity: 0.5,
          filter: 'grayscale(0.3) brightness(0.8) contrast(1.1)',
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
            'linear-gradient(135deg, rgba(5, 11, 31, 0.4) 0%, rgba(5, 11, 31, 0.65) 60%, rgba(5, 11, 31, 0.8) 100%)',
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
        ref={layerGridRef}
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
          ...parallaxBase,
        }}
      />

      {/* Layer 2: node mesh */}
      <div ref={layerNodesRef} aria-hidden style={{ position: 'absolute', inset: 0, opacity: 0.45, pointerEvents: 'none', zIndex: 2, ...parallaxBase }}>
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
        ref={layerGlowRef}
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(600px 400px at 25% 45%, rgba(198, 255, 61, 0.14), transparent 60%)',
          pointerEvents: 'none',
          zIndex: 2,
          ...parallaxBase,
        }}
      />

      {/* Layer 4: dust particles */}
      <div ref={layerDustRef} aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 2, ...parallaxBase }}>
        {Array.from({ length: 18 }).map((_, i) => {
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
        /* Hero intro choreography. Plain CSS so the H1 (LCP candidate)
           paints on the very first frame instead of waiting for
           framer-motion to hydrate and run an opacity:0 → 1 animation.
           Line 1 of the headline has no animation at all — it must be
           visible immediately for LCP to land on it. The remaining
           lines/rows keep the staggered rise the design called for. */
        @keyframes v2-hero-rise {
          from { opacity: 0; transform: translate3d(0, 24px, 0); filter: blur(6px); }
          to   { opacity: 1; transform: translate3d(0, 0, 0); filter: blur(0); }
        }
        @keyframes v2-hero-fade {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .v2-hero-rise, .v2-hero-fade {
          animation-duration: 700ms;
          animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
          animation-fill-mode: both;
        }
        .v2-hero-rise { animation-name: v2-hero-rise; }
        .v2-hero-fade { animation-name: v2-hero-fade; }
        @media (prefers-reduced-motion: reduce) {
          .v2-hero-rise, .v2-hero-fade {
            animation: none;
            opacity: 1;
            transform: none;
            filter: none;
          }
        }
      `}</style>

      {/* spacer pushes hero content to the bottom half of the viewport */}
      <div style={{ flex: 1 }} aria-hidden />

      {/* ===== MAIN CONTENT ===== */}
      <div style={{ position: 'relative', zIndex: 4, maxWidth: 1200, marginTop: 'auto' }}>
        {/* Headline */}
        <h1
          className="v2-hero-headline"
          aria-label="Enterprise technology. Delivered."
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
          {/* Line 1 is the LCP candidate — no animation, paints on the
              very first frame so Chrome scores LCP off the SSR'd HTML
              instead of waiting for hydration + an opacity tween. */}
          <span style={{ display: 'block' }} aria-hidden>
            Enterprise technology.
          </span>
          <span
            style={{ display: 'block', animationDelay: '150ms' }}
            className="v2-hero-rise"
            aria-hidden
          >
            <em
              style={{
                fontStyle: 'italic',
                fontWeight: 500,
                color: 'var(--v2-accent)',
              }}
            >
              Delivered.
            </em>
          </span>
        </h1>

        {/* Meta row: copy + ctas */}
        <div
          className="v2-hero-rise"
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '32px 64px',
            alignItems: 'flex-end',
            marginTop: 8,
            animationDelay: '500ms',
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
            Data and AI, cloud, and managed operations for Fortune 500
            teams. 500+ systems in&nbsp;production.
          </p>
          <p
            style={{
              maxWidth: 500,
              color: 'var(--v2-text-primary)',
              fontSize: 17,
              lineHeight: 1.55,
              margin: '12px 0 0 0',
              fontWeight: 500,
            }}
          >
            We build them, we ship them, we run&nbsp;them.
          </p>
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'center' }}>
            <MagneticButton
              href="/contact?source=v2-hero"
              className="v2-btn-primary"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                flexDirection: 'row',
                gap: 8,
                padding: '16px 26px',
                background: 'var(--v2-accent)',
                color: 'var(--v2-text-inverted)',
                fontFamily: 'var(--font-sans)',
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: '0.02em',
                textTransform: 'uppercase',
                borderRadius: 2,
                textDecoration: 'none',
                transition: 'background 200ms var(--v2-ease)',
              }}
            >
              <span>Get in Touch</span>
              <ArrowRight size={14} />
            </MagneticButton>
          </div>
        </div>
      </div>

      {/* ===== HERO FOOT =====
          Platform partner strip: small mono eyebrow on the left, the
          chips the firm is certified on filling the rest of the row,
          subtle scroll cue pinned to the right. Compliance badges
          (SOC 2, ISO 27001, HIPAA) and the year-anniversary numbers
          live in the certifications marquee further down the page,
          so this strip focuses purely on ecosystem depth — the
          fastest trust signal for enterprise buyers. */}
      <div
        className="v2-hero-foot v2-hero-fade"
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
          animationDelay: '800ms',
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
      </div>
    </header>
  );
}
