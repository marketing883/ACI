/**
 * Atheros panel router.
 *
 * Server-side deterministic panel selection. Replaces the old behavior
 * where the LLM chose which entity to render via a `show_content_panel`
 * tool call: in practice Haiku hallucinated slugs that did not exist in
 * our catalog (e.g. `dynamics-365-finance` instead of the real
 * `dynamics-365-finance-implementation`), and it frequently skipped
 * prose entirely when firing the tool.
 *
 * The router separates responsibilities cleanly:
 *   - This module picks the panel (validated against ENTITY_INDEX and
 *     the canonical service / industry / platform ids).
 *   - The model writes prose, with no panel tool to hide behind.
 *
 * Resolution priority (first hit wins):
 *   1. Explicit entity pinned by the URL (entityType + entitySlug).
 *   2. Platform signal detected in the query (augmentContextFromQuery).
 *   3. Service-cluster signal.
 *   4. Industry signal (only when no platform or service was named —
 *      "Dynamics 365 for manufacturing" should land on the platform,
 *      not the industry page).
 *   5. Top retrieval hit whose slug exists in ENTITY_INDEX OR matches
 *      a canonical service / industry / platform / diagram id.
 *   6. null — no panel this turn. The chat reply stands on its own.
 */

import type { PanelType } from '@/components/copilot/panels/registry';
import { isKnownPanelType } from '@/components/copilot/panels/registry';
import { ENTITY_INDEX } from './entityIndex.generated';
import { services } from '@/data/services';
import { industries } from '@/data/industries';
import { platforms } from '@/data/platforms';
import type { PageContext } from './retrieval';
import type { RetrievedChunk, ContentChunk } from '@/data/types';

export interface ResolvedPanel {
  panelType: PanelType;
  entityRef: string;
  /** Short human-readable reason the router chose this panel. */
  rationale: string;
}

function mapSourceTypeToPanelType(
  source: ContentChunk['source_type'],
): PanelType | null {
  switch (source) {
    case 'service':
      return 'service';
    case 'industry':
      return 'industry';
    case 'platform':
      return 'platform';
    case 'case_study':
      return 'case';
    case 'playbook':
      return 'playbook';
    case 'lp':
      return 'resource';
    default:
      return null;
  }
}

function mapEntityTypeToPanelType(
  entityType: ContentChunk['source_type'] | undefined,
): PanelType | null {
  if (!entityType) return null;
  return mapSourceTypeToPanelType(entityType);
}

/**
 * Validate that (panelType, entityRef) actually resolves to a real entry.
 * Returns the canonical entry when the slug is a known service, industry,
 * platform, or landing-page / case-study from ENTITY_INDEX. Prevents the
 * "Not in our catalog" empty state on hallucinated slugs.
 */
function isValidPanel(panelType: PanelType, entityRef: string): boolean {
  switch (panelType) {
    case 'service':
      return Object.prototype.hasOwnProperty.call(services, entityRef);
    case 'industry':
      return Object.prototype.hasOwnProperty.call(industries, entityRef);
    case 'platform':
      return Object.prototype.hasOwnProperty.call(platforms, entityRef);
    default:
      // Everything else (resource, case, playbook, diagram, comparison,
      // timeline, stats) is expected to be registered in ENTITY_INDEX.
      return ENTITY_INDEX[entityRef] !== undefined;
  }
}

export function pickPanelFromContext(
  ctx: PageContext,
  retrieved: RetrievedChunk[],
): ResolvedPanel | null {
  // 1. URL-pinned entity (e.g. visiting /platforms/databricks).
  if (ctx.entitySlug && ctx.entityType) {
    const panelType = mapEntityTypeToPanelType(ctx.entityType);
    if (panelType && isValidPanel(panelType, ctx.entitySlug)) {
      return {
        panelType,
        entityRef: ctx.entitySlug,
        rationale: 'url-entity',
      };
    }
  }

  // 2. Detected platform.
  if (ctx.platform && isValidPanel('platform', ctx.platform)) {
    return {
      panelType: 'platform',
      entityRef: ctx.platform,
      rationale: 'platform-signal',
    };
  }

  // 3. Detected service cluster.
  if (ctx.cluster && isValidPanel('service', ctx.cluster)) {
    return {
      panelType: 'service',
      entityRef: ctx.cluster,
      rationale: 'cluster-signal',
    };
  }

  // 4. Detected industry (last among signals so compound platform+industry
  // queries land on the platform).
  if (ctx.industry && typeof ctx.industry === 'string' && isValidPanel('industry', ctx.industry)) {
    return {
      panelType: 'industry',
      entityRef: ctx.industry,
      rationale: 'industry-signal',
    };
  }

  // 5. Top retrieval hit. Walk down the list until we find one whose slug
  // is validated. This avoids hallucinated slugs surfacing from stale
  // indexer data.
  for (const chunk of retrieved) {
    const panelType = mapSourceTypeToPanelType(chunk.source_type);
    if (!panelType || !isKnownPanelType(panelType)) continue;
    if (isValidPanel(panelType, chunk.source_slug)) {
      return {
        panelType,
        entityRef: chunk.source_slug,
        rationale: 'retrieval-top',
      };
    }
  }

  return null;
}
