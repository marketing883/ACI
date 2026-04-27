'use client';

const playbooks = [
  'Databricks Lakehouse for Financial Close',
  'Post-Acquisition ERP Consolidation',
  'Real-Time Inventory on Kafka + Snowflake',
  'NOC Stand-Up with SolarWinds + Datadog',
];

export function ZoneLab() {
  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        padding: '0 3rem',
        maxWidth: '36rem',
      }}
    >
      <div
        style={{
          fontFamily: 'var(--v3-font-mono)',
          fontSize: '0.65rem',
          letterSpacing: '0.15em',
          color: 'var(--v3-lime)',
          marginBottom: '1.5rem',
        }}
      >
        // PLAYBOOKS →
      </div>

      <h2
        style={{
          fontFamily: 'var(--v3-font-display)',
          fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
          fontWeight: 700,
          color: 'var(--v3-text)',
          lineHeight: 1.2,
          letterSpacing: '-0.02em',
          marginBottom: '0.75rem',
        }}
      >
        The architecture decisions, documented.
      </h2>

      <p
        style={{
          fontFamily: 'var(--v3-font-body)',
          fontSize: '1rem',
          color: 'var(--v3-text-secondary)',
          lineHeight: 1.6,
          marginBottom: '2rem',
        }}
      >
        Real deployments, real trade-offs.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {playbooks.map((p) => (
          <a
            key={p}
            href="/playbooks"
            style={{
              fontFamily: 'var(--v3-font-mono)',
              fontSize: '0.75rem',
              letterSpacing: '0.05em',
              color: 'var(--v3-text-secondary)',
              textDecoration: 'none',
              transition: 'color 0.3s',
              pointerEvents: 'auto',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--v3-lime)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--v3-text-secondary)')}
          >
            → {p}
          </a>
        ))}
      </div>
    </div>
  );
}
