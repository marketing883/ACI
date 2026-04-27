/**
 * Atheros panel registry.
 *
 * Part-3's show_content_panel tool call names a `panelType` and an
 * `entityRef` (slug). Part-4's ContentCanvas resolves the type here
 * and lazy-loads the component. Panels are all `"use client"` and
 * read from src/data/*.
 */
import { lazy, type LazyExoticComponent, type ComponentType } from 'react';

export type PanelType =
  | 'service'
  | 'industry'
  | 'platform'
  | 'case'
  | 'playbook'
  | 'diagram'
  | 'comparison'
  | 'timeline'
  | 'stats'
  | 'resource';

export interface PanelProps {
  entityRef: string;
  highlight?: string;
  rationale?: string;
}

export const PANEL_REGISTRY: Readonly<
  Record<PanelType, LazyExoticComponent<ComponentType<PanelProps>>>
> = {
  service: lazy(() => import('./ServicePanel')),
  industry: lazy(() => import('./IndustryPanel')),
  platform: lazy(() => import('./PlatformPanel')),
  case: lazy(() => import('./CasePanel')),
  playbook: lazy(() => import('./PlaybookPanel')),
  diagram: lazy(() => import('./DiagramPanel')),
  comparison: lazy(() => import('./ComparisonPanel')),
  timeline: lazy(() => import('./TimelinePanel')),
  stats: lazy(() => import('./StatsPanel')),
  resource: lazy(() => import('./ResourcePanel')),
};

export function isKnownPanelType(key: string): key is PanelType {
  return key in PANEL_REGISTRY;
}
