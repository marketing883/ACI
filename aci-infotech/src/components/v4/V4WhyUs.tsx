'use client';

import { Reveal, FillBar } from './v4-motion';

const REASONS = [
  {
    title: 'Senior engineers on every build',
    body: 'Architects with a decade of production scars lead the work. Nobody learns on your dime.',
  },
  {
    title: 'We run what we ship',
    body: 'Uptime targets, on-call rotations, monitored releases. The handoff is to our own ops team, not to a PDF.',
  },
  {
    title: 'Outcomes get audited',
    body: 'Every engagement starts with baseline metrics and closes with measured results. The number is the deliverable.',
  },
  {
    title: 'One partner, full stack',
    body: 'Data platform, AI, cloud, and operations under one roof. One throat to choke, as the CIOs say.',
  },
];

// Decorative telemetry rows under the ops video. These are part of the
// stylized dashboard visual (system readouts), NOT corporate proof
// points; the only company-wide stats on the site are the four approved
// figures rendered in the hero.
const MIX = [
  { label: 'Pipeline throughput', pct: 84 },
  { label: 'Model serving', pct: 97 },
  { label: 'Alert coverage', pct: 91 },
];

export default function V4WhyUs() {
  return (
    <section style={{ padding: '48px 24px 96px' }}>
      <div
        style={{
          maxWidth: 1240,
          margin: '0 auto',
          background: 'var(--v4-ink)',
          borderRadius: 28,
          padding: 'clamp(32px, 5vw, 72px)',
          color: '#fff',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* royal glow in the dark panel */}
        <div
          aria-hidden
          style={{
            position: 'absolute',
            bottom: -260,
            left: -160,
            width: 620,
            height: 620,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(30,63,204,0.35), transparent 65%)',
            pointerEvents: 'none',
          }}
        />
        <div style={{ position: 'relative' }}>
          <Reveal tier="sm">
            <span className="v4-eyebrow v4-eyebrow--onDark">Why ACI</span>
          </Reveal>
          <Reveal tier="md">
            <h2 className="v4-h2" style={{ maxWidth: 640, marginTop: 14, color: '#fff' }}>
              Built like an engineering firm, because it is one.
            </h2>
          </Reveal>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: 48,
              marginTop: 56,
              alignItems: 'start',
            }}
          >
            {/* left: reasons */}
            <div style={{ display: 'grid', gap: 8 }}>
              {REASONS.map((r, i) => (
                <Reveal key={r.title} tier="sm" delay={i * 0.07}>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '44px 1fr',
                      gap: 16,
                      padding: '20px 0',
                      borderBottom:
                        i < REASONS.length - 1 ? '1px solid rgba(255,255,255,0.10)' : 'none',
                    }}
                  >
                    <span
                      aria-hidden
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 10,
                        display: 'grid',
                        placeItems: 'center',
                        background: 'rgba(30,63,204,0.35)',
                        border: '1px solid rgba(255,255,255,0.14)',
                      }}
                    >
                      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                        <path
                          d="M2.5 8.2 6 11.5l6.5-8"
                          stroke="var(--v4-lime)"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                    <div>
                      <h3 style={{ margin: 0, font: '600 17.5px/1.3 var(--font-funnel-display)' }}>
                        {r.title}
                      </h3>
                      <p
                        style={{
                          margin: '8px 0 0',
                          font: '400 14.5px/1.6 var(--font-funnel-sans)',
                          color: 'var(--v4-muted-dark)',
                        }}
                      >
                        {r.body}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>

            {/* right: live ops visual + delivery mix bars */}
            <Reveal tier="lg" delay={0.1}>
              <div
                style={{
                  borderRadius: 20,
                  overflow: 'hidden',
                  border: '1px solid rgba(255,255,255,0.12)',
                  background: 'var(--v4-ink-soft)',
                }}
              >
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  poster="/images/v4/why-visual.jpg"
                  style={{ display: 'block', width: '100%', aspectRatio: '16/9', objectFit: 'cover' }}
                  aria-label="Looping visual of a monitored production operations dashboard"
                >
                  <source src="/videos/v4/ops-loop.webm" type="video/webm" />
                  <source src="/videos/v4/ops-loop.mp4" type="video/mp4" />
                </video>
                <div style={{ padding: '24px 24px 28px', display: 'grid', gap: 18 }}>
                  {MIX.map((m, i) => (
                    <div key={m.label}>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          marginBottom: 8,
                          font: '500 12px/1 var(--font-jetbrains-mono)',
                          letterSpacing: '0.06em',
                          textTransform: 'uppercase',
                          color: 'var(--v4-muted-dark)',
                        }}
                      >
                        <span>{m.label}</span>
                        <span style={{ color: 'var(--v4-lime)' }}>{m.pct}%</span>
                      </div>
                      <FillBar
                        percent={m.pct}
                        color="var(--v4-lime)"
                        track="rgba(255,255,255,0.10)"
                        height={5}
                        delay={i * 0.12}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
