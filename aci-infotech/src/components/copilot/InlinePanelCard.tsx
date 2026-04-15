'use client';

/**
 * InlinePanelCard - renders a `show_content_panel` tool call as a
 * small unfurl card inside the chat thread instead of navigating
 * away. Designed for the mobile surface where auto-nav would
 * unmount the chat mid-stream and kill the conversation.
 *
 * The card always shows:
 *   - a type chip (PLATFORM / SERVICE / INDUSTRY / CASE STUDY / RESOURCE)
 *   - a humanized title derived from the slug
 *   - the model's `rationale` as a one-line description (optional)
 *   - an "Open [title] ->" CTA that invokes onOpen
 *
 * Panels without a target path (playbook / diagram / comparison /
 * timeline / stats) render as read-only cards with no CTA, so the
 * visitor has context in-thread but is not pushed off the page.
 */

import { ArrowUpRight } from 'lucide-react';
import type { ShowContentPanelArgs } from '@/lib/copilot/tools';

interface InlinePanelCardProps {
  panel: ShowContentPanelArgs;
  /**
   * Called when the visitor explicitly taps the "Open" CTA. When
   * omitted (or when the panel has no navigable target), the card
   * renders without a CTA.
   */
  onOpen?: (panel: ShowContentPanelArgs) => void;
}

/**
 * Map a panel's panelType+entityRef to a public route, if one exists.
 * Mirrors the mapping in MobilePill#panelTargetPath; duplicated here
 * so this component is self-contained and can be used from both
 * mobile (inline card) and any other surface.
 */
function panelRoute(panel: ShowContentPanelArgs): string | null {
  const s = panel.entityRef;
  switch (panel.panelType) {
    case 'service':
      return `/services/${s}`;
    case 'industry':
      return `/industries/${s}`;
    case 'platform':
      return `/platforms/${s}`;
    case 'case':
      return `/case-studies/${s}`;
    case 'resource':
      return `/lp/${s}`;
    default:
      return null;
  }
}

const TYPE_LABELS: Record<ShowContentPanelArgs['panelType'], string> = {
  service: 'SERVICE',
  industry: 'INDUSTRY',
  platform: 'PLATFORM',
  case: 'CASE STUDY',
  playbook: 'PLAYBOOK',
  resource: 'RESOURCE',
  diagram: 'DIAGRAM',
  comparison: 'COMPARISON',
  timeline: 'TIMELINE',
  stats: 'STATS',
};

function humanizeSlug(slug: string): string {
  return slug
    .split('-')
    .map((w) => (w[0] ? w[0].toUpperCase() + w.slice(1) : w))
    .join(' ')
    .replace(/\bAi\b/g, 'AI')
    .replace(/\bMl\b/g, 'ML')
    .replace(/\bAws\b/g, 'AWS')
    .replace(/\bSap\b/g, 'SAP')
    .replace(/\bApi\b/g, 'API')
    .replace(/\bErp\b/g, 'ERP')
    .replace(/\bCrm\b/g, 'CRM')
    .replace(/\bCdp\b/g, 'CDP')
    .replace(/\bIot\b/g, 'IoT')
    .replace(/\bSaas\b/g, 'SaaS');
}

export default function InlinePanelCard({ panel, onOpen }: InlinePanelCardProps) {
  const target = panelRoute(panel);
  const title = humanizeSlug(panel.entityRef);
  const label = TYPE_LABELS[panel.panelType];
  const hasCta = Boolean(target && onOpen);

  return (
    <button
      type="button"
      onClick={hasCta ? () => onOpen?.(panel) : undefined}
      disabled={!hasCta}
      aria-label={hasCta ? `Open ${title}` : `${label}: ${title}`}
      className={`group mt-2 block w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-left transition-colors ${
        hasCta
          ? 'hover:border-[color:var(--aci-primary,#0052CC)]/40 hover:bg-[color:var(--aci-primary,#0052CC)]/5 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[color:var(--aci-primary,#0052CC)]/40'
          : 'cursor-default'
      }`}
    >
      <div className="flex items-start gap-2">
        <div className="min-w-0 flex-1">
          <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-gray-500">
            {label}
          </div>
          <div className="mt-0.5 text-sm font-semibold text-gray-900">
            {title}
          </div>
          {panel.rationale ? (
            <div className="mt-0.5 text-xs leading-snug text-gray-600">
              {panel.rationale}
            </div>
          ) : null}
        </div>
        {hasCta ? (
          <div className="flex items-center gap-1 whitespace-nowrap pt-0.5 text-xs font-medium text-[color:var(--aci-primary,#0052CC)] group-hover:underline">
            Open
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
          </div>
        ) : null}
      </div>
    </button>
  );
}
