'use client';

import { useState } from 'react';

const caseStudies = [
  {
    industry: 'FINANCIAL SERVICES',
    headline: 'Post-acquisition data consolidation across twelve regional ERPs.',
    metrics: [
      { value: '$45M', label: 'Value delivered' },
      { value: '12 ERPs', label: 'Unified' },
      { value: 'SOX', label: 'Compliant' },
    ],
    stack: ['Databricks', 'SAP S/4HANA', 'Azure Synapse', 'dbt'],
  },
  {
    industry: 'HEALTHCARE',
    headline: 'HIPAA-compliant patient data platform serving 2.4M records.',
    metrics: [
      { value: '68%', label: 'Cost reduction' },
      { value: '2.4M', label: 'Patient records' },
      { value: 'HIPAA', label: 'Compliant' },
    ],
    stack: ['Azure', 'Snowflake', 'HL7/FHIR', 'Great Expectations'],
  },
  {
    industry: 'RETAIL',
    headline: 'Real-time inventory visibility across 600+ locations.',
    metrics: [
      { value: '600+', label: 'Locations' },
      { value: '42%', label: 'Faster insight' },
      { value: '99.9%', label: 'Uptime' },
    ],
    stack: ['Kafka', 'Snowflake', 'Braze', 'Segment'],
  },
  {
    industry: 'HOSPITALITY',
    headline: 'Global POS unification across 55 countries.',
    metrics: [
      { value: '55', label: 'Countries' },
      { value: '9→3 days', label: 'Monthly close' },
      { value: '$12M', label: 'Annual savings' },
    ],
    stack: ['Databricks', 'SAP', 'Terraform', 'Kubernetes'],
  },
];

const categories = ['DATA PLATFORMS', 'CLOUD MIGRATIONS', 'MANAGED OPERATIONS', 'AI & AUTOMATION', 'SECURITY'];

export function ZoneWork() {
  const [activeIndex, setActiveIndex] = useState(0);
  const study = caseStudies[activeIndex];

  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        padding: '0 3rem',
        alignItems: 'center',
        gap: '4rem',
      }}
    >
      {/* Left sidebar */}
      <div style={{ flex: '0 0 220px' }}>
        <div
          style={{
            fontFamily: 'var(--v3-font-mono)',
            fontSize: '0.65rem',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'var(--v3-lime)',
            marginBottom: '1.5rem',
          }}
        >
          Selected Work
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {categories.map((cat) => (
            <div
              key={cat}
              style={{
                fontFamily: 'var(--v3-font-mono)',
                fontSize: '0.7rem',
                letterSpacing: '0.08em',
                color: 'var(--v3-text-muted)',
                cursor: 'pointer',
                transition: 'color 0.3s',
                pointerEvents: 'auto',
              }}
            >
              → {cat}
            </div>
          ))}
        </div>
      </div>

      {/* Case study content */}
      <div style={{ flex: 1, maxWidth: '40rem' }}>
        <div
          style={{
            fontFamily: 'var(--v3-font-mono)',
            fontSize: '0.65rem',
            letterSpacing: '0.15em',
            color: 'var(--v3-lime)',
            marginBottom: '1rem',
          }}
        >
          {study.industry}
        </div>

        <h2
          style={{
            fontFamily: 'var(--v3-font-display)',
            fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
            fontWeight: 700,
            color: 'var(--v3-text)',
            lineHeight: 1.15,
            letterSpacing: '-0.02em',
            marginBottom: '2rem',
          }}
        >
          {study.headline}
        </h2>

        <div
          style={{
            display: 'flex',
            gap: '3rem',
            marginBottom: '2rem',
          }}
        >
          {study.metrics.map((m) => (
            <div key={m.label}>
              <div
                style={{
                  fontFamily: 'var(--v3-font-mono)',
                  fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
                  fontWeight: 700,
                  color: 'var(--v3-lime)',
                  lineHeight: 1.1,
                }}
              >
                {m.value}
              </div>
              <div
                style={{
                  fontFamily: 'var(--v3-font-body)',
                  fontSize: '0.7rem',
                  color: 'var(--v3-text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  marginTop: '0.25rem',
                }}
              >
                {m.label}
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {study.stack.map((tech) => (
            <span
              key={tech}
              style={{
                fontFamily: 'var(--v3-font-mono)',
                fontSize: '0.65rem',
                color: 'var(--v3-text-secondary)',
                letterSpacing: '0.05em',
              }}
            >
              {tech}{study.stack.indexOf(tech) < study.stack.length - 1 ? ' · ' : ''}
            </span>
          ))}
        </div>

        {/* Navigation dots */}
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '2rem', pointerEvents: 'auto' }}>
          {caseStudies.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              style={{
                width: i === activeIndex ? '2rem' : '0.5rem',
                height: '0.5rem',
                borderRadius: '9999px',
                border: 'none',
                background: i === activeIndex ? 'var(--v3-lime)' : 'var(--v3-text-muted)',
                cursor: 'pointer',
                transition: 'all 0.3s',
                padding: 0,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
