'use client';

import PanelShell from './PanelShell';
import type { PanelProps } from './registry';

export default function ResourcePanel({ entityRef, rationale }: PanelProps) {
  const pretty = entityRef
    .split('-')
    .map((w) => (w[0] ? w[0].toUpperCase() + w.slice(1) : w))
    .join(' ');
  return (
    <PanelShell
      kicker="Resource"
      title={pretty}
      rationale={rationale ?? 'A deeper read on this topic from the ACI library.'}
      secondaryHref={`/lp/${entityRef}`}
      secondaryLabel="Open the page"
    >
      <p className="text-sm text-gray-700">
        Atheros is pointing you to a landing-page-level deep dive. The page
        carries the full pattern, pain points, stats, and FAQ. Ask me to
        summarize a specific angle if you do not want to leave the chat.
      </p>
    </PanelShell>
  );
}
