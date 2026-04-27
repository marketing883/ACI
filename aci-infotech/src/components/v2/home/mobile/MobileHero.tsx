/**
 * MobileHero — phone-only hero. Static markup, CSS-only animation.
 * No video, no parallax, no framer-motion, no JS work on the main
 * thread. Designed to land LCP on the H1 in well under a second.
 *
 * Layout: full-bleed dark background with a single subtle radial
 * lime glow at top-right. Brand mark, two-line headline, one-line
 * subhead. No CTAs in the hero itself — the conversion surface lives
 * later, in the dedicated CTA section. Senior buyers landing here
 * are scanning to confirm they're at the right firm; the CTAs at the
 * bottom of the page (and in the nav menu) catch them when they're
 * ready to move.
 */

export default function MobileHero() {
  return (
    <header className="m-hero">
      <div className="m-hero__glow" aria-hidden />

      <div className="m-hero__brand">
        <span className="m-hero__brand-dot" aria-hidden />
        ACI Infotech
      </div>

      <h1 className="m-hero__h1">
        Enterprise technology.
        <br />
        <em className="m-hero__h1-em">Delivered.</em>
      </h1>

      <p className="m-hero__sub">
        Data &amp; AI, cloud, and managed operations for Fortune 500
        teams. We build them, ship them, and run&nbsp;them.
      </p>

      <style>{`
        .m-hero {
          position: relative;
          padding: 64px 24px 56px;
          background: var(--v2-bg);
          color: var(--v2-text-primary);
          overflow: hidden;
          isolation: isolate;
        }
        .m-hero__glow {
          position: absolute;
          top: -120px;
          right: -120px;
          width: 320px;
          height: 320px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(198,255,61,0.18), transparent 70%);
          z-index: 0;
          pointer-events: none;
        }
        .m-hero__brand {
          position: relative;
          z-index: 1;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--v2-text-muted);
          margin-bottom: 28px;
          animation: m-fadeUp 600ms ease-out 50ms both;
        }
        .m-hero__brand-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--v2-accent);
          box-shadow: 0 0 8px var(--v2-accent);
        }
        .m-hero__h1 {
          position: relative;
          z-index: 1;
          font-family: var(--font-title);
          font-size: clamp(40px, 11vw, 56px);
          line-height: 0.96;
          letter-spacing: -0.035em;
          font-weight: 700;
          margin: 0 0 20px;
          color: var(--v2-text-primary);
          animation: m-fadeUp 700ms cubic-bezier(0.16, 1, 0.3, 1) 120ms both;
        }
        .m-hero__h1-em {
          color: var(--v2-accent);
          font-style: italic;
          font-weight: 500;
        }
        .m-hero__sub {
          position: relative;
          z-index: 1;
          margin: 0;
          font-family: var(--font-sans);
          font-size: 16px;
          line-height: 1.55;
          color: var(--v2-text-secondary);
          max-width: 32ch;
          animation: m-fadeUp 700ms cubic-bezier(0.16, 1, 0.3, 1) 220ms both;
        }
        @keyframes m-fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .m-hero__brand,
          .m-hero__h1,
          .m-hero__sub {
            animation: none;
          }
        }
      `}</style>
    </header>
  );
}
