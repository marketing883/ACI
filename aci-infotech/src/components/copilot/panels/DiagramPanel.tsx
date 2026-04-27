'use client';

import { Suspense } from 'react';
import { DIAGRAM_REGISTRY, isKnownDiagram } from '../diagrams/registry';
import PanelShell from './PanelShell';
import type { PanelProps } from './registry';

const LABELS: Record<string, string> = {
  lakehouse: 'Lakehouse architecture',
  'data-mesh': 'Data mesh topology',
  'unity-catalog': 'Unity Catalog governance plane',
  'cdp-flow': 'CDP ingest to activation flow',
  'mlops-lifecycle': 'MLOps lifecycle',
  'agentic-loop': 'Agentic AI loop',
  'zero-trust': 'Zero trust edges',
  'migration-waves': 'Cloud migration waves',
  'api-topology': 'API integration topology',
  'retail-realtime': 'Real-time retail pipeline',
  'healthcare-data': 'Healthcare data platform',
  'erp-consolidation': 'ERP consolidation',
  'predictive-ops': 'Predictive ops loop',
  observability: 'Observability pipeline',
  'engagement-model': 'ACI engagement model',
};

export default function DiagramPanel({ entityRef, rationale, highlight }: PanelProps) {
  if (!isKnownDiagram(entityRef)) {
    return (
      <PanelShell kicker="Diagram" title="Not in our diagram library">
        <p className="text-sm text-gray-600">
          I do not have a canonical diagram for that key. Try asking for
          lakehouse, data mesh, Unity Catalog, MLOps, or migration waves.
        </p>
      </PanelShell>
    );
  }
  const Diagram = DIAGRAM_REGISTRY[entityRef];
  return (
    <PanelShell
      kicker="Diagram"
      title={LABELS[entityRef] ?? entityRef}
      rationale={rationale}
    >
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
        <Suspense
          fallback={
            <div className="h-60 animate-pulse rounded-lg bg-gray-100" aria-hidden />
          }
        >
          <Diagram highlight={highlight} className="h-auto w-full" />
        </Suspense>
      </div>
    </PanelShell>
  );
}
