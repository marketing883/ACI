'use client';

import Link from 'next/link';
import { Reveal, CountUp } from './v4-motion';
import PipelineSVG from './PipelineSVG';

const STATS = [
  { value: '2006', label: 'Founded' },
  { value: '1,200+', label: 'Experts' },
  { value: '500+', label: 'Large enterprise projects' },
  { value: '11', label: 'Global delivery hubs' },
];

const PLATFORMS = [
  'Databricks',
  'Snowflake',
  'AWS',
  'Azure',
  'SAP',
  'ServiceNow',
  'Salesforce',
  'Google Cloud',
  'Braze',
  'Microsoft Dynamics',
];

export default function V4Hero() {
  return (
    <section style={{ padding: '148px 24px 0', position: 'relative', overflow: 'hidden' }}>
      {/* faint royal wash behind the headline */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          top: -240,
          right: -180,
          width: 640,
          height: 640,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(30,63,204,0.10), transparent 66%)',
          pointerEvents: 'none',
        }}
      />
      <div style={{ maxWidth: 1240, margin: '0 auto' }}>
        <Reveal tier="sm">
          <span
            className="v4-chip"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}
          >
            <span
              aria-hidden
              style={{
                width: 7,
                height: 7,
                borderRadius: 4,
                background: 'var(--v4-lime)',
                outline: '3px solid rgba(198,255,61,0.25)',
              }}
            />
            Trusted since 2006 &middot; 500+ enterprise projects
          </span>
        </Reveal>

        <Reveal tier="md" delay={0.08}>
          <h1 className="v4-h1" style={{ maxWidth: 900, margin: '26px 0 0' }}>
            AI that ships.
            <br />
            Systems that stay&nbsp;up.
          </h1>
        </Reveal>

        <Reveal tier="md" delay={0.16}>
          <p
            style={{
              maxWidth: 560,
              margin: '26px 0 0',
              font: '400 18px/1.6 var(--font-funnel-sans)',
              color: 'var(--v4-muted)',
            }}
          >
            We engineer data platforms and AI for Fortune 500 operations, then run
            them in production with SLAs. No pilots that die in the demo.
          </p>
        </Reveal>

        <Reveal tier="md" delay={0.24}>
          <div style={{ display: 'flex', gap: 14, marginTop: 36, flexWrap: 'wrap' }}>
            <Link href="/contact" className="v4-btn v4-btn--primary">
              Start a project
            </Link>
            <Link href="/case-studies" className="v4-btn v4-btn--ghost">
              See the work
            </Link>
          </div>
        </Reveal>

        {/* Signature: the running pipeline */}
        <Reveal tier="lg" delay={0.32}>
          <div
            style={{
              marginTop: 64,
              background: '#fff',
              border: '1px solid var(--v4-mist)',
              borderRadius: 20,
              padding: 'clamp(16px, 3vw, 36px)',
              boxShadow: '0 32px 64px -40px rgba(11,15,28,0.18)',
            }}
          >
            <PipelineSVG className="v4-pipeline-svg" />
          </div>
        </Reveal>

        {/* Approved stats, counting up on scroll */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: 24,
            padding: '48px 0 40px',
            borderBottom: '1px solid var(--v4-mist)',
          }}
        >
          {STATS.map((s, i) => (
            <Reveal key={s.label} tier="sm" delay={i * 0.07}>
              <div>
                <div
                  style={{
                    font: '600 clamp(1.9rem, 3vw, 2.6rem)/1.1 var(--font-funnel-display)',
                    letterSpacing: '-0.02em',
                  }}
                >
                  <CountUp value={s.value} />
                </div>
                <div
                  style={{
                    marginTop: 6,
                    font: '400 13.5px/1.4 var(--font-funnel-sans)',
                    color: 'var(--v4-muted)',
                  }}
                >
                  {s.label}
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Platform ticker */}
        <div className="v4-ticker" style={{ padding: '26px 0 34px' }} aria-hidden>
          {[0, 1].map((dup) => (
            <div className="v4-ticker-track" key={dup}>
              {PLATFORMS.map((p) => (
                <span
                  key={`${dup}-${p}`}
                  style={{
                    font: '500 14px/1 var(--font-jetbrains-mono)',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: 'var(--v4-muted)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {p}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
