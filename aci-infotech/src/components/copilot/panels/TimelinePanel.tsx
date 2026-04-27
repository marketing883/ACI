'use client';

import { services } from '@/data/services';
import type { ServiceClusterId } from '@/data/types';
import PanelShell from './PanelShell';
import type { PanelProps } from './registry';

const DEFAULT_PHASES = [
  { number: 1, title: 'Discovery & architecture', duration: 'Weeks 1 to 4', description: 'Assess landscape, agree on outcomes, design target architecture.' },
  { number: 2, title: 'Foundation', duration: 'Weeks 5 to 12', description: 'Platform, security, governance. The layer everything else sits on.' },
  { number: 3, title: 'Build & iterate', duration: 'Months 4 to 8', description: 'Ship the first product, instrument it, iterate with measured outcomes.' },
  { number: 4, title: 'Operate', duration: 'Ongoing', description: 'SLA, observability, and continuous improvement. Boring and stable by design.' },
];

function isServiceId(key: string): key is ServiceClusterId {
  return key in services;
}

export default function TimelinePanel({ entityRef, rationale }: PanelProps) {
  const phases = isServiceId(entityRef) && services[entityRef].processPhases.length > 0
    ? services[entityRef].processPhases
    : DEFAULT_PHASES;
  const title = isServiceId(entityRef)
    ? `${services[entityRef].title} — engagement phases`
    : 'ACI engagement phases';
  return (
    <PanelShell
      kicker="Timeline"
      title={title}
      rationale={rationale ?? 'How an engagement typically sequences, tuned to your pace.'}
    >
      <ol className="space-y-4">
        {phases.map((p, i) => (
          <li key={p.title} className="relative rounded-xl border border-gray-200 p-4">
            <div className="flex items-baseline justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[color:var(--aci-primary,#0052CC)] text-xs font-semibold text-white">
                  {p.number ?? i + 1}
                </span>
                <span className="font-semibold">{p.title}</span>
              </div>
              {p.duration && (
                <span className="text-xs text-gray-500">{p.duration}</span>
              )}
            </div>
            <p className="mt-2 text-sm text-gray-700">{p.description}</p>
          </li>
        ))}
      </ol>
    </PanelShell>
  );
}
