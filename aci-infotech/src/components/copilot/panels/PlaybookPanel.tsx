'use client';

import PanelShell from './PanelShell';
import type { PanelProps } from './registry';

/**
 * PlaybookPanel renders an anonymized "N systems -> 1" style deployment
 * pattern. Data comes from the playbooks content surface (Supabase, Part 2).
 * Until the admin replay / panel catalog wires a full playbook API, this
 * panel is a data-free shell the Atheros model can still cite through
 * rationale + entityRef, falling back to a structured intro and linking
 * the user to the playbook library.
 */
export default function PlaybookPanel({ entityRef, rationale }: PanelProps) {
  const pretty = entityRef
    .split('-')
    .map((w) => (w[0] ? w[0].toUpperCase() + w.slice(1) : w))
    .join(' ');
  return (
    <PanelShell
      kicker="Playbook"
      title={pretty}
      rationale={rationale ?? 'A repeatable pattern ACI has shipped multiple times.'}
      secondaryHref={`/playbooks/${entityRef}`}
      secondaryLabel="Open the playbook"
    >
      <p className="text-sm text-gray-700">
        ACI playbooks describe a challenge pattern, the approach, and
        measurable outcomes from past deployments. This panel links to the
        full page where you can read the engagement shape and request a
        tailored walkthrough.
      </p>
    </PanelShell>
  );
}
