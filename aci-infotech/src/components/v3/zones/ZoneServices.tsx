'use client';

import { useState } from 'react';

const services = [
  {
    name: 'DATA ENGINEERING',
    description: 'Databricks, Snowflake, dbt, Kafka. Lakehouse architectures and real-time pipelines for financial close, clinical trials, and real-time pricing.',
  },
  {
    name: 'APPLIED AI & ML',
    description: 'SageMaker, Azure ML, LangChain. Forecast models, NLP pipelines, and RAG systems deployed to production, not just notebooks.',
  },
  {
    name: 'CLOUD MODERNIZATION',
    description: 'Terraform, Kubernetes, CI/CD. Multi-cloud migrations off Teradata, on-prem Hadoop, and legacy mainframes.',
  },
  {
    name: 'MARTECH & CDP',
    description: 'Braze, Salesforce, Segment. Journey orchestration and CDP unification so marketing runs on real-time signals.',
  },
  {
    name: 'DIGITAL TRANSFORMATION',
    description: 'ServiceNow, Dynamics 365, UiPath. The workflows your team currently runs in spreadsheets and email, automated.',
  },
  {
    name: 'APP DEVELOPMENT',
    description: 'Next.js, React, Node, .NET. Front-ends, APIs, and backends deployed on Kubernetes with 99.5% uptime SLAs.',
  },
  {
    name: 'QUALITY ENGINEERING',
    description: 'Playwright, Cypress, k6. Shift-left CI pipelines that catch regressions before they reach staging.',
  },
  {
    name: 'CYBER SECURITY',
    description: 'Splunk, CrowdStrike, Sentinel. DevSecOps, compliance, and 24/7 SOC coverage. Security built in, not bolted on.',
  },
];

export function ZoneServices() {
  const [active, setActive] = useState(0);

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
      {/* Service list */}
      <div style={{ flex: '0 0 320px' }}>
        {services.map((s, i) => (
          <div
            key={s.name}
            onMouseEnter={() => setActive(i)}
            style={{
              fontFamily: 'var(--v3-font-mono)',
              fontSize: '0.75rem',
              letterSpacing: '0.08em',
              padding: '0.6rem 0',
              color: i === active ? 'var(--v3-text)' : 'var(--v3-text-muted)',
              cursor: 'pointer',
              transition: 'color 0.3s',
              borderLeft: i === active ? '2px solid var(--v3-lime)' : '2px solid transparent',
              paddingLeft: '1rem',
              pointerEvents: 'auto',
            }}
          >
            {i === active ? '→ ' : '  '}{s.name}
          </div>
        ))}
      </div>

      {/* Active service detail */}
      <div style={{ flex: 1, maxWidth: '32rem' }}>
        <h3
          style={{
            fontFamily: 'var(--v3-font-display)',
            fontSize: 'clamp(1.25rem, 2.5vw, 2rem)',
            fontWeight: 700,
            color: 'var(--v3-text)',
            lineHeight: 1.2,
            letterSpacing: '-0.02em',
            marginBottom: '1rem',
          }}
        >
          {services[active].name.charAt(0) + services[active].name.slice(1).toLowerCase()}
        </h3>
        <p
          style={{
            fontFamily: 'var(--v3-font-body)',
            fontSize: '1rem',
            lineHeight: 1.7,
            color: 'var(--v3-text-secondary)',
          }}
        >
          {services[active].description}
        </p>
      </div>
    </div>
  );
}
