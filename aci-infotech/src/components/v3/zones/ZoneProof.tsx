'use client';

const partners = [
  'Databricks', 'Dynatrace', 'AWS', 'Azure',
  'SAP', 'Salesforce', 'ServiceNow', 'Braze',
];

export function ZoneProof() {
  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '0 2rem',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '2rem 3rem',
          justifyContent: 'center',
          alignItems: 'center',
          maxWidth: '48rem',
          marginBottom: '2rem',
        }}
      >
        {partners.map((p) => (
          <div
            key={p}
            style={{
              fontFamily: 'var(--v3-font-mono)',
              fontSize: '0.7rem',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--v3-text-muted)',
              transition: 'color 0.3s',
              cursor: 'default',
              pointerEvents: 'auto',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--v3-text)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--v3-text-muted)')}
          >
            {p}
          </div>
        ))}
      </div>

      <div
        style={{
          fontFamily: 'var(--v3-font-body)',
          fontSize: '0.8rem',
          color: 'var(--v3-text-muted)',
          letterSpacing: '0.05em',
        }}
      >
        Certified. Deployed. Operated.
      </div>
    </div>
  );
}
