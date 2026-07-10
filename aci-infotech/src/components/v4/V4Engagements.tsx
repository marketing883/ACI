'use client';

import Link from 'next/link';
import { Reveal } from './v4-motion';

// Replaces the template's pricing tiers. Enterprise deals are scoped,
// not listed, so these are engagement models with a conversation CTA
// instead of a dollar figure.
const MODELS = [
  {
    name: 'Project Delivery',
    tag: 'Fixed scope',
    blurb: 'A defined build with a defined end: migration, platform, model, or application. Scoped, staffed, shipped.',
    features: [
      'Senior architect leads from day one',
      'Baseline metrics agreed before work starts',
      'Weekly working software, not status decks',
      'Results measured and documented at close',
    ],
    highlight: false,
  },
  {
    name: 'Managed Operations',
    tag: 'Run + improve',
    blurb: 'We take over the platform you have, or the one we built, and run it under SLAs while improving it.',
    features: [
      'Uptime targets with on-call rotations',
      'Observability, alerting, and monthly reviews',
      'Audit evidence for SOC 2, ISO 27001, HIPAA',
      'Continuous cost and performance tuning',
    ],
    highlight: true,
  },
  {
    name: 'Global Capability Center',
    tag: 'Build-operate-transfer',
    blurb: 'Your own captive delivery center, stood up and run like a first-party team, transferred when you are ready.',
    features: [
      'Hiring, facilities, and operations handled',
      'Your processes, your tools, your culture',
      'Scale from a pod to a full center',
      'Transfer on your timeline, not ours',
    ],
    highlight: false,
  },
];

export default function V4Engagements() {
  return (
    <section style={{ padding: '48px 24px 96px' }}>
      <div style={{ maxWidth: 1240, margin: '0 auto' }}>
        <Reveal tier="sm">
          <span className="v4-eyebrow">How we engage</span>
        </Reveal>
        <Reveal tier="md">
          <h2 className="v4-h2" style={{ maxWidth: 620, marginTop: 14 }}>
            Three ways to work with us.
          </h2>
        </Reveal>
        <Reveal tier="sm" delay={0.1}>
          <p style={{ maxWidth: 560, margin: '18px 0 0', font: '400 16px/1.6 var(--font-funnel-sans)', color: 'var(--v4-muted)' }}>
            Enterprise work gets scoped, not price-tagged. Tell us the problem and
            we will come back with a plan and a number.
          </p>
        </Reveal>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 20,
            marginTop: 48,
            alignItems: 'stretch',
          }}
        >
          {MODELS.map((m, i) => (
            <Reveal key={m.name} tier="md" delay={i * 0.08}>
              <div
                className="v4-card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 18,
                  height: '100%',
                  borderRadius: 20,
                  padding: '30px 28px',
                  background: m.highlight ? 'var(--v4-royal)' : '#fff',
                  border: m.highlight ? '1px solid var(--v4-royal)' : '1px solid var(--v4-mist)',
                  color: m.highlight ? '#fff' : 'var(--v4-ink)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                  <h3 style={{ margin: 0, font: '600 21px/1.2 var(--font-funnel-display)' }}>{m.name}</h3>
                  <span
                    className={m.highlight ? undefined : 'v4-chip'}
                    style={
                      m.highlight
                        ? {
                            font: '500 11.5px/1 var(--font-jetbrains-mono)',
                            padding: '5px 10px',
                            borderRadius: 999,
                            background: 'var(--v4-lime)',
                            color: 'var(--v4-ink)',
                            whiteSpace: 'nowrap',
                          }
                        : undefined
                    }
                  >
                    {m.tag}
                  </span>
                </div>
                <p
                  style={{
                    margin: 0,
                    font: '400 14.5px/1.6 var(--font-funnel-sans)',
                    color: m.highlight ? 'rgba(255,255,255,0.82)' : 'var(--v4-muted)',
                  }}
                >
                  {m.blurb}
                </p>
                <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'grid', gap: 12, flex: 1 }}>
                  {m.features.map((f) => (
                    <li key={f} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                      <svg width="14" height="14" viewBox="0 0 15 15" fill="none" style={{ flexShrink: 0, marginTop: 4 }}>
                        <path
                          d="M2.5 8.2 6 11.5l6.5-8"
                          stroke={m.highlight ? 'var(--v4-lime)' : 'var(--v4-royal)'}
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span
                        style={{
                          font: '400 14px/1.5 var(--font-funnel-sans)',
                          color: m.highlight ? 'rgba(255,255,255,0.92)' : 'var(--v4-ink)',
                        }}
                      >
                        {f}
                      </span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/contact?reason=architecture-call"
                  className={`v4-btn ${m.highlight ? 'v4-btn--onDark' : 'v4-btn--ghost'}`}
                  style={{ justifyContent: 'center' }}
                >
                  Talk to an architect
                </Link>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
