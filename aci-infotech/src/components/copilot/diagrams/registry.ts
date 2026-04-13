/**
 * Canonical Atheros diagram keys. Part-3's show_content_panel tool call
 * uses these as `entityRef` when `panelType === 'diagram'`. Part-4's
 * DiagramPanel looks up the component in this registry via dynamic import.
 */
import { lazy, type LazyExoticComponent, type ComponentType } from 'react';

export type DiagramKey =
  | 'lakehouse'
  | 'data-mesh'
  | 'unity-catalog'
  | 'cdp-flow'
  | 'mlops-lifecycle'
  | 'agentic-loop'
  | 'zero-trust'
  | 'migration-waves'
  | 'api-topology'
  | 'retail-realtime'
  | 'healthcare-data'
  | 'erp-consolidation'
  | 'predictive-ops'
  | 'observability'
  | 'engagement-model';

export const DIAGRAM_KEYS: readonly DiagramKey[] = [
  'lakehouse',
  'data-mesh',
  'unity-catalog',
  'cdp-flow',
  'mlops-lifecycle',
  'agentic-loop',
  'zero-trust',
  'migration-waves',
  'api-topology',
  'retail-realtime',
  'healthcare-data',
  'erp-consolidation',
  'predictive-ops',
  'observability',
  'engagement-model',
];

export interface DiagramProps {
  highlight?: string;
  className?: string;
}

export const DIAGRAM_REGISTRY: Readonly<
  Record<DiagramKey, LazyExoticComponent<ComponentType<DiagramProps>>>
> = {
  'lakehouse': lazy(() => import('./Lakehouse')),
  'data-mesh': lazy(() => import('./DataMesh')),
  'unity-catalog': lazy(() => import('./UnityCatalog')),
  'cdp-flow': lazy(() => import('./CdpFlow')),
  'mlops-lifecycle': lazy(() => import('./MlopsLifecycle')),
  'agentic-loop': lazy(() => import('./AgenticLoop')),
  'zero-trust': lazy(() => import('./ZeroTrust')),
  'migration-waves': lazy(() => import('./MigrationWaves')),
  'api-topology': lazy(() => import('./ApiTopology')),
  'retail-realtime': lazy(() => import('./RetailRealtime')),
  'healthcare-data': lazy(() => import('./HealthcareData')),
  'erp-consolidation': lazy(() => import('./ErpConsolidation')),
  'predictive-ops': lazy(() => import('./PredictiveOps')),
  'observability': lazy(() => import('./Observability')),
  'engagement-model': lazy(() => import('./EngagementModel')),
};

export function isKnownDiagram(key: string): key is DiagramKey {
  return (DIAGRAM_KEYS as readonly string[]).includes(key);
}
