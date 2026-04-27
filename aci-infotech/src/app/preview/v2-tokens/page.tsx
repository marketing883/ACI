'use client';

/**
 * v2 Aesthetic Teaser — not the homepage. Just a single page that shows
 * the new tokens in action so the direction can be judged before we
 * invest in the full component library and homepage composition.
 *
 * Route: /preview/v2-tokens
 *
 * This file is intentionally throwaway. The real homepage will use the
 * proper v2 component library (Phase 2) under src/components/v2/.
 */

import { ArrowRight } from 'lucide-react';
import ScrollReveal from '@/lib/motion/ScrollReveal';
import TextSplit from '@/lib/motion/TextSplit';
import AnimatedCounter from '@/lib/motion/AnimatedCounter';
import GradientMesh from '@/lib/motion/GradientMesh';

export default function V2TokensPreview() {
  return (
    <main
      className="v2-grain"
      style={{
        background: 'var(--v2-bg)',
        color: 'var(--v2-text-primary)',
        fontFamily: 'var(--font-sans)',
        minHeight: '100vh',
      }}
    >
      {/* ================ HERO TEASER ================ */}
      <section
        className="relative overflow-hidden"
        style={{
          paddingTop: 'var(--v2-section-py-lg)',
          paddingBottom: 'var(--v2-section-py-lg)',
          paddingLeft: 'var(--v2-container-px)',
          paddingRight: 'var(--v2-container-px)',
        }}
      >
        <GradientMesh variant="hero" animated />
        <div
          style={{
            maxWidth: 'var(--v2-container-max)',
            margin: '0 auto',
            position: 'relative',
          }}
        >
          <ScrollReveal direction="up">
            <div
              style={{
                color: 'var(--v2-accent)',
                fontSize: 'var(--v2-type-caption)',
                letterSpacing: 'var(--v2-tracking-eyebrow)',
                fontWeight: 600,
                textTransform: 'uppercase',
                marginBottom: '1.5rem',
              }}
            >
              ACI Infotech — v2 Aesthetic Preview
            </div>
          </ScrollReveal>

          <style>{`
            .v2-hero-h1 {
              font-family: var(--font-title);
              font-size: var(--v2-type-display);
              line-height: var(--v2-leading-tight);
              letter-spacing: var(--v2-tracking-tight);
              font-weight: 700;
              max-width: 900px;
              margin: 0;
            }
            .v2-hero-h1 > span:nth-of-type(2) {
              color: var(--v2-accent);
            }
          `}</style>
          <TextSplit
            text={'Enterprise systems,\nengineered to stay up.'}
            by="line"
            as="h1"
            className="v2-hero-h1"
          />

          <ScrollReveal direction="up" delay={0.3}>
            <p
              style={{
                color: 'var(--v2-text-secondary)',
                fontSize: 'var(--v2-type-body-lg)',
                lineHeight: 'var(--v2-leading-normal)',
                maxWidth: '560px',
                marginTop: '2rem',
              }}
            >
              Data platforms, cloud modernization, and managed operations for
              enterprises that cannot afford to guess. 280 engagements. Twenty
              years. One standard of delivery.
            </p>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.5}>
            <div
              style={{
                display: 'flex',
                gap: '0.75rem',
                marginTop: '2rem',
                flexWrap: 'wrap',
              }}
            >
              <PrimaryButton>Talk to an architect</PrimaryButton>
              <GhostButton>See how we work</GhostButton>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.7}>
            <p
              style={{
                color: 'var(--v2-text-muted)',
                fontSize: 'var(--v2-type-caption)',
                marginTop: '3rem',
                letterSpacing: '0.02em',
              }}
            >
              Dynatrace Partner &nbsp;·&nbsp; ISO 27001 &nbsp;·&nbsp; SOC 2
              &nbsp;·&nbsp; ServiceNow Certified
            </p>
          </ScrollReveal>
        </div>
      </section>

      <Divider />

      {/* ================ PALETTE STRIP ================ */}
      <Section label="Palette">
        <ScrollReveal>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
              gap: '0.75rem',
            }}
          >
            {[
              { name: 'bg', value: 'var(--v2-bg)', label: '#0A0A0A' },
              { name: 'surface-1', value: 'var(--v2-surface-1)', label: '#111111' },
              { name: 'surface-2', value: 'var(--v2-surface-2)', label: '#171717' },
              { name: 'surface-3', value: 'var(--v2-surface-3)', label: '#1F1F1F' },
              { name: 'text-primary', value: 'var(--v2-text-primary)', label: '#FAFAFA' },
              { name: 'text-secondary', value: 'var(--v2-text-secondary)', label: '#A1A1A1' },
              { name: 'text-muted', value: 'var(--v2-text-muted)', label: '#6B6B6B' },
              { name: 'accent', value: 'var(--v2-accent)', label: '#C4FF61' },
            ].map((sw) => (
              <Swatch key={sw.name} name={sw.name} color={sw.value} label={sw.label} />
            ))}
          </div>
        </ScrollReveal>
      </Section>

      <Divider />

      {/* ================ TYPOGRAPHY SCALE ================ */}
      <Section label="Typography">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <ScrollReveal>
            <TypeSample
              label="display"
              text="Enterprise systems."
              size="var(--v2-type-display)"
              weight={700}
              family="var(--font-title)"
              tracking="var(--v2-tracking-tight)"
              leading="var(--v2-leading-tight)"
            />
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <TypeSample
              label="h1"
              text="The decisions, documented."
              size="var(--v2-type-h1)"
              weight={700}
              family="var(--font-title)"
              tracking="var(--v2-tracking-tight)"
              leading="var(--v2-leading-snug)"
            />
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <TypeSample
              label="h2"
              text="Eight practices. One integrated stack."
              size="var(--v2-type-h2)"
              weight={600}
              family="var(--font-title)"
              tracking="var(--v2-tracking-normal)"
              leading="var(--v2-leading-snug)"
            />
          </ScrollReveal>
          <ScrollReveal delay={0.3}>
            <TypeSample
              label="body-lg"
              text="Data platforms, cloud modernization, and managed operations for enterprises that cannot afford to guess."
              size="var(--v2-type-body-lg)"
              weight={400}
              family="var(--font-sans)"
              tracking="0"
              leading="var(--v2-leading-normal)"
              color="var(--v2-text-secondary)"
            />
          </ScrollReveal>
        </div>
      </Section>

      <Divider />

      {/* ================ ANIMATED COUNTERS ================ */}
      <Section label="Motion — animated counters">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '2rem',
          }}
        >
          <CounterBlock value={280} suffix="+" label="Engagements delivered" />
          <CounterBlock value={25} suffix="+" label="Enterprise clients" />
          <CounterBlock value={99.5} suffix="%" decimals={1} label="Uptime held" />
          <CounterBlock value={20} label="Years of delivery" />
        </div>
      </Section>

      <Divider />

      {/* ================ BENTO TEASER ================ */}
      <Section label="Bento hint — one sample card">
        <ScrollReveal>
          <div
            style={{
              background: 'var(--v2-surface-2)',
              border: '1px solid var(--v2-border)',
              borderRadius: 'var(--v2-radius-lg)',
              padding: '2.5rem',
              maxWidth: '640px',
              position: 'relative',
              overflow: 'hidden',
              cursor: 'pointer',
              transition: 'background var(--v2-dur-base) var(--v2-ease), border-color var(--v2-dur-base) var(--v2-ease)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--v2-surface-3)';
              e.currentTarget.style.borderColor = 'var(--v2-border-strong)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'var(--v2-surface-2)';
              e.currentTarget.style.borderColor = 'var(--v2-border)';
            }}
          >
            <div
              style={{
                fontSize: 'var(--v2-type-caption)',
                color: 'var(--v2-text-muted)',
                letterSpacing: 'var(--v2-tracking-eyebrow)',
                textTransform: 'uppercase',
                fontWeight: 600,
                marginBottom: '1rem',
              }}
            >
              Data Engineering
            </div>
            <h3
              style={{
                fontFamily: 'var(--font-title)',
                fontSize: '1.75rem',
                lineHeight: 'var(--v2-leading-snug)',
                letterSpacing: 'var(--v2-tracking-normal)',
                margin: '0 0 1rem 0',
                color: 'var(--v2-text-primary)',
              }}
            >
              Lakehouses, pipelines, quality&nbsp;gates.
            </h3>
            <p
              style={{
                color: 'var(--v2-text-secondary)',
                fontSize: 'var(--v2-type-body)',
                lineHeight: 'var(--v2-leading-normal)',
                margin: 0,
              }}
            >
              Databricks and Snowflake lakehouse architectures. Airflow and dbt
              orchestration. Great Expectations quality gates. Pipelines that
              carry clinical trial data, financial close numbers, and real-time
              pricing without dropping a row.
            </p>
            <div
              style={{
                marginTop: '1.5rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.375rem',
                color: 'var(--v2-accent)',
                fontSize: 'var(--v2-type-body-sm)',
                fontWeight: 500,
              }}
            >
              See the practice
              <ArrowRight width="14" height="14" />
            </div>
          </div>
        </ScrollReveal>
      </Section>

      <Divider />

      {/* ================ QUIET FOOTER ================ */}
      <footer
        style={{
          padding: '3rem var(--v2-container-px)',
          textAlign: 'center',
          color: 'var(--v2-text-muted)',
          fontSize: 'var(--v2-type-body-sm)',
          borderTop: '1px solid var(--v2-border-subtle)',
        }}
      >
        This is a token preview. The full homepage lands in Phase 4.
      </footer>
    </main>
  );
}

/* =======================================================
   Local helper components. These are NOT the final v2
   component library. That gets built in Phase 2 under
   src/components/v2/. These are throwaway for the teaser.
   ======================================================= */

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section
      style={{
        paddingTop: 'var(--v2-section-py)',
        paddingBottom: 'var(--v2-section-py)',
        paddingLeft: 'var(--v2-container-px)',
        paddingRight: 'var(--v2-container-px)',
      }}
    >
      <div style={{ maxWidth: 'var(--v2-container-max)', margin: '0 auto' }}>
        <div
          style={{
            fontSize: 'var(--v2-type-caption)',
            letterSpacing: 'var(--v2-tracking-eyebrow)',
            fontWeight: 600,
            textTransform: 'uppercase',
            color: 'var(--v2-text-muted)',
            marginBottom: '2rem',
          }}
        >
          {label}
        </div>
        {children}
      </div>
    </section>
  );
}

function Divider() {
  return (
    <div
      style={{
        height: 1,
        background: 'var(--v2-border-subtle)',
      }}
    />
  );
}

function Swatch({ name, color, label }: { name: string; color: string; label: string }) {
  return (
    <div
      style={{
        border: '1px solid var(--v2-border-subtle)',
        borderRadius: 'var(--v2-radius)',
        overflow: 'hidden',
      }}
    >
      <div style={{ background: color, height: 80 }} />
      <div
        style={{
          padding: '0.75rem 1rem',
          background: 'var(--v2-surface-1)',
        }}
      >
        <div
          style={{
            color: 'var(--v2-text-primary)',
            fontSize: 'var(--v2-type-body-sm)',
            fontWeight: 500,
          }}
        >
          --v2-{name}
        </div>
        <div
          style={{
            color: 'var(--v2-text-muted)',
            fontSize: 'var(--v2-type-caption)',
            marginTop: '0.125rem',
            fontFamily: 'monospace',
          }}
        >
          {label}
        </div>
      </div>
    </div>
  );
}

function TypeSample({
  label,
  text,
  size,
  weight,
  family,
  tracking,
  leading,
  color,
}: {
  label: string;
  text: string;
  size: string;
  weight: number;
  family: string;
  tracking: string;
  leading: string;
  color?: string;
}) {
  return (
    <div>
      <div
        style={{
          fontSize: 'var(--v2-type-caption)',
          letterSpacing: 'var(--v2-tracking-eyebrow)',
          textTransform: 'uppercase',
          color: 'var(--v2-text-muted)',
          marginBottom: '0.5rem',
          fontFamily: 'monospace',
          fontWeight: 500,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: family,
          fontSize: size,
          fontWeight: weight,
          lineHeight: leading,
          letterSpacing: tracking,
          color: color ?? 'var(--v2-text-primary)',
          margin: 0,
        }}
      >
        {text}
      </div>
    </div>
  );
}

function CounterBlock({
  value,
  suffix,
  decimals,
  label,
}: {
  value: number;
  suffix?: string;
  decimals?: number;
  label: string;
}) {
  return (
    <div>
      <div
        style={{
          height: 2,
          width: 32,
          background: 'var(--v2-accent)',
          marginBottom: '1rem',
        }}
      />
      <div
        style={{
          fontFamily: 'var(--font-title)',
          fontSize: 'var(--v2-type-h1)',
          lineHeight: 1,
          letterSpacing: 'var(--v2-tracking-tight)',
          fontWeight: 700,
          color: 'var(--v2-text-primary)',
        }}
      >
        <AnimatedCounter target={value} suffix={suffix} decimals={decimals} />
      </div>
      <div
        style={{
          color: 'var(--v2-text-secondary)',
          fontSize: 'var(--v2-type-body-sm)',
          marginTop: '0.75rem',
        }}
      >
        {label}
      </div>
    </div>
  );
}

function PrimaryButton({ children }: { children: React.ReactNode }) {
  return (
    <button
      type="button"
      style={{
        background: 'var(--v2-accent)',
        color: 'var(--v2-text-inverted)',
        fontFamily: 'var(--font-sans)',
        fontSize: 'var(--v2-type-body)',
        fontWeight: 600,
        padding: '0.875rem 1.5rem',
        borderRadius: 'var(--v2-radius)',
        border: 'none',
        cursor: 'pointer',
        transition: 'background var(--v2-dur-fast) var(--v2-ease), transform var(--v2-dur-fast) var(--v2-ease)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'var(--v2-accent-dim)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'var(--v2-accent)';
      }}
    >
      {children}
    </button>
  );
}

function GhostButton({ children }: { children: React.ReactNode }) {
  return (
    <button
      type="button"
      style={{
        background: 'transparent',
        color: 'var(--v2-text-primary)',
        fontFamily: 'var(--font-sans)',
        fontSize: 'var(--v2-type-body)',
        fontWeight: 500,
        padding: '0.875rem 1.5rem',
        borderRadius: 'var(--v2-radius)',
        border: '1px solid var(--v2-border)',
        cursor: 'pointer',
        transition: 'border-color var(--v2-dur-fast) var(--v2-ease), background var(--v2-dur-fast) var(--v2-ease)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--v2-border-strong)';
        e.currentTarget.style.background = 'var(--v2-surface-1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--v2-border)';
        e.currentTarget.style.background = 'transparent';
      }}
    >
      {children}
    </button>
  );
}
