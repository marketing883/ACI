'use client';

import { services } from '@/data/services';
import { industries } from '@/data/industries';
import { platforms } from '@/data/platforms';
import type { CaseStudyStub } from '@/data/types';
import PanelShell from './PanelShell';
import type { PanelProps } from './registry';

function collectStats(entityRef: string): Array<{ metric: string; description: string; source: string }> {
  const out: Array<{ metric: string; description: string; source: string }> = [];
  const pick = (cs: CaseStudyStub, source: string) => {
    for (const r of cs.results) {
      if (r.metric && r.description) out.push({ metric: r.metric, description: r.description, source });
    }
  };
  if (entityRef in services) {
    for (const cs of services[entityRef as keyof typeof services].caseStudies) pick(cs, services[entityRef as keyof typeof services].title);
  } else if (entityRef in industries) {
    for (const cs of industries[entityRef as keyof typeof industries].caseStudies) pick(cs, industries[entityRef as keyof typeof industries].title);
  } else if (entityRef in platforms) {
    for (const cs of platforms[entityRef as keyof typeof platforms].caseStudies) pick(cs, platforms[entityRef as keyof typeof platforms].title);
  }
  return out.slice(0, 6);
}

export default function StatsPanel({ entityRef, rationale }: PanelProps) {
  const stats = collectStats(entityRef);
  if (stats.length === 0) {
    return (
      <PanelShell kicker="Proof" title="No metrics pinned for this entity">
        <p className="text-sm text-gray-600">
          I can pull proof metrics from a service, industry, or platform slug
          once it is in the content index.
        </p>
      </PanelShell>
    );
  }
  return (
    <PanelShell
      kicker="Proof"
      title="Numbers from live engagements"
      rationale={rationale ?? 'Pulled from anonymized case studies in the ACI content index.'}
    >
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {stats.map((s, i) => (
          <li key={i} className="rounded-xl border border-gray-200 p-4">
            <div className="text-3xl font-bold text-[color:var(--aci-primary,#0052CC)]">
              {s.metric}
            </div>
            <p className="mt-1 text-sm text-gray-700">{s.description}</p>
            <p className="mt-2 text-xs text-gray-500">from {s.source}</p>
          </li>
        ))}
      </ul>
    </PanelShell>
  );
}
