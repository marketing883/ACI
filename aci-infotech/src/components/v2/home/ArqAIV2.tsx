'use client';

/**
 * ArqAIV2 — v2-styled feature block for the ArqAI platform.
 *
 * Ports the content from the v1 `ArqAISection` into the editorial v2
 * vocabulary: dark surface, lime italic emphasis, mono eyebrow,
 * Funnel Display, lucide feature icons in small lime-accent badges.
 * Two-zone layout (content left, product video right) preserved from
 * the v1 section because the video is a branded asset.
 */

import Image from 'next/image';
import { ArrowRight, Rocket, Workflow, Zap } from 'lucide-react';

const FEATURES = [
  {
    icon: Workflow,
    title: 'End-to-end AI delivery',
    description:
      'The full build — use case definition, model selection, deployment, and ongoing ops. Not advisory. Not a pilot. A working system in production.',
  },
  {
    icon: Zap,
    title: 'Products that accelerate delivery',
    description:
      'Purpose-built products shipped into every engagement so enterprises do not start from zero. Faster deployment, fewer integration risks, lower total cost.',
  },
  {
    icon: Rocket,
    title: 'From pilot to production',
    description:
      'Most enterprise AI gets stuck at proof of concept. ArqAI is built to get past that stage — into live environments, with real users and measurable outcomes.',
  },
];

export default function ArqAIV2({
  ctaUrl = 'https://www.thearq.ai',
}: {
  ctaUrl?: string;
}) {
  return (
    <section
      id="arqai"
      style={{
        background: 'var(--v2-bg)',
        paddingTop: 'var(--v2-section-py)',
        paddingBottom: 'var(--v2-section-py)',
        paddingLeft: 'var(--v2-container-px)',
        paddingRight: 'var(--v2-container-px)',
        borderTop: '1px solid var(--v2-border-subtle)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Ambient lime glow echoing other v2 sections */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse 60% 50% at 80% 20%, rgba(198,255,61,0.05), transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          maxWidth: 'var(--v2-container-max)',
          margin: '0 auto',
          position: 'relative',
        }}
      >
        <div
          className="arqai-v2-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
            gap: 64,
            alignItems: 'center',
          }}
        >
          <style>{`
            @media (max-width: 960px) {
              .arqai-v2-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
            }
          `}</style>

          {/* LEFT — content */}
          <div>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 11,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: 'var(--v2-text-muted)',
                marginBottom: 18,
              }}
            >
              / Introducing ArqAI
            </div>

            <div style={{ marginBottom: 22 }}>
              <Image
                src="/images/ArqAI-Logo-white.png"
                alt="ArqAI"
                width={717}
                height={253}
                style={{ height: 40, width: 'auto' }}
                priority={false}
              />
            </div>

            <h2
              style={{
                fontFamily: 'var(--font-title)',
                fontSize: 'clamp(30px, 4.2vw, 56px)',
                fontWeight: 700,
                lineHeight: 1.02,
                letterSpacing: '-0.02em',
                color: 'var(--v2-text-primary)',
                margin: 0,
                marginBottom: 18,
              }}
            >
              AI services.
              <br />
              <em
                style={{
                  fontStyle: 'italic',
                  fontWeight: 500,
                  color: 'var(--v2-accent)',
                }}
              >
                Built for production.
              </em>
            </h2>

            <p
              style={{
                color: 'var(--v2-text-secondary)',
                fontSize: 15,
                lineHeight: 1.6,
                margin: 0,
                marginBottom: 34,
                maxWidth: 520,
              }}
            >
              ArqAI is ACI&apos;s AI services vertical. It takes enterprises from
              AI strategy to working systems, with the products and the
              engineering capability to back it up.
            </p>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 22,
                marginBottom: 34,
              }}
            >
              {FEATURES.map((f) => {
                const Icon = f.icon;
                return (
                  <div
                    key={f.title}
                    style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}
                  >
                    <div
                      style={{
                        flexShrink: 0,
                        width: 40,
                        height: 40,
                        borderRadius: 4,
                        border: '1px solid var(--v2-border-strong)',
                        background: 'var(--v2-surface-2)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Icon
                        size={18}
                        strokeWidth={1.75}
                        style={{ color: 'var(--v2-accent)' }}
                      />
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div
                        style={{
                          fontFamily: 'var(--font-title)',
                          fontSize: 16,
                          fontWeight: 600,
                          letterSpacing: '-0.01em',
                          color: 'var(--v2-text-primary)',
                          marginBottom: 4,
                        }}
                      >
                        {f.title}
                      </div>
                      <div
                        style={{
                          fontSize: 13,
                          lineHeight: 1.55,
                          color: 'var(--v2-text-secondary)',
                        }}
                      >
                        {f.description}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <a
              href={ctaUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '14px 22px',
                background: 'var(--v2-accent)',
                color: 'var(--v2-text-inverted)',
                fontFamily: 'var(--font-sans)',
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                borderRadius: 2,
                textDecoration: 'none',
                transition: 'transform 200ms var(--v2-ease)',
              }}
            >
              See ArqAI
              <ArrowRight size={14} />
            </a>
          </div>

          {/* RIGHT — product video */}
          <div style={{ position: 'relative' }}>
            <div
              style={{
                position: 'relative',
                borderRadius: 6,
                overflow: 'hidden',
                border: '1px solid var(--v2-border-strong)',
                background: 'var(--v2-surface-2)',
                boxShadow: '0 24px 60px -12px rgba(0,0,0,0.55)',
              }}
            >
              <video
                autoPlay
                loop
                muted
                playsInline
                style={{ width: '100%', height: 'auto', display: 'block' }}
              >
                <source src="/video/ArqAI-foundry-v2.webm" type="video/webm" />
              </video>
            </div>
            <div
              aria-hidden
              style={{
                position: 'absolute',
                inset: -16,
                background: 'rgba(198,255,61,0.08)',
                borderRadius: 24,
                filter: 'blur(40px)',
                zIndex: -1,
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
