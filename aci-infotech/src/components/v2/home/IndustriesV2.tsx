'use client';

import { useState } from 'react';
import { Watermark } from '../craft/Watermark';
import { TextScramble } from '../craft/TextScramble';

const industries = [
  { name: 'Financial Services', detail: 'SOX reporting, post-acquisition consolidation, risk analytics.' },
  { name: 'Retail', detail: 'Real-time inventory, omnichannel CDPs, demand forecasting.' },
  { name: 'Healthcare', detail: 'HIPAA-compliant patient data, HL7/FHIR, claims automation.' },
  { name: 'Hospitality', detail: 'Multi-property POS, supply chain, guest intelligence.' },
  { name: 'Manufacturing', detail: 'IoT telemetry, predictive maintenance, MES integration.' },
  { name: 'Energy', detail: 'Grid data platforms, SCADA, NERC/FERC reporting.' },
  { name: 'Transportation', detail: 'Fleet analytics, route optimization, logistics visibility.' },
];

export function IndustriesV2() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <section
      style={{
        position: 'relative',
        background: 'var(--v2-bg, #050B1F)',
        padding: '6rem 1.5rem',
        overflow: 'hidden',
      }}
    >
      <Watermark text="INDUSTRIES" size="16vw" opacity={0.03} offsetY="40%" />

      <div
        style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: '1280px',
          margin: '0 auto',
        }}
      >
        <div style={{ marginBottom: '3rem' }}>
          <h2
            style={{
              fontFamily: 'var(--v2-font-display, "Funnel Display", sans-serif)',
              fontSize: 'clamp(2rem, 4vw, 2.75rem)',
              fontWeight: 700,
              color: 'var(--v2-text, #E8ECF5)',
              lineHeight: 1.15,
              letterSpacing: '-0.02em',
            }}
          >
            Industries where we know{' '}
            <em style={{ color: 'var(--v2-accent, #C6FF3D)', fontStyle: 'italic' }}>the audit.</em>
          </h2>
          <p
            style={{
              fontFamily: 'var(--v2-font-body, sans-serif)',
              fontSize: '1.05rem',
              color: 'var(--v2-text-secondary, #9AA7C2)',
              marginTop: '0.75rem',
              lineHeight: 1.6,
            }}
          >
            HIPAA, SOX, PCI-DSS, GDPR. We have shipped in all of them.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {industries.map((ind, i) => (
            <div
              key={ind.name}
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
              style={{
                display: 'flex',
                alignItems: 'baseline',
                justifyContent: 'space-between',
                gap: '2rem',
                padding: '1.25rem 0',
                borderBottom: '1px solid var(--v2-border, #142146)',
                cursor: 'default',
                transition: 'padding-left 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                paddingLeft: active === i ? '1rem' : '0',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem' }}>
                {active === i && (
                  <span
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: 'var(--v2-accent, #C6FF3D)',
                      flexShrink: 0,
                      marginTop: '0.4rem',
                    }}
                  />
                )}
                <TextScramble
                  text={ind.name}
                  style={{
                    fontFamily: 'var(--v2-font-display, "Funnel Display", sans-serif)',
                    fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
                    fontWeight: 700,
                    color: active === i
                      ? 'var(--v2-text, #E8ECF5)'
                      : 'var(--v2-text-muted, #6B7A99)',
                    transition: 'color 0.3s',
                    letterSpacing: '-0.02em',
                  }}
                />
              </div>
              <div
                style={{
                  fontFamily: 'var(--v2-font-body, sans-serif)',
                  fontSize: '0.9rem',
                  color: 'var(--v2-text-secondary, #9AA7C2)',
                  maxWidth: '24rem',
                  textAlign: 'right',
                  opacity: active === i ? 1 : 0,
                  transform: active === i ? 'translateX(0)' : 'translateX(10px)',
                  transition: 'opacity 0.3s, transform 0.3s',
                }}
              >
                {ind.detail}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
