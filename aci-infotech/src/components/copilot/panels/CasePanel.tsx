'use client';

import { services } from '@/data/services';
import { industries } from '@/data/industries';
import { platforms } from '@/data/platforms';
import type { CaseStudyStub } from '@/data/types';
import { displayClient } from '@/lib/content/anonymize';
import PanelShell from './PanelShell';
import type { PanelProps } from './registry';

function findCaseStudy(slug: string): CaseStudyStub | undefined {
  for (const s of Object.values(services)) {
    const hit = s.caseStudies.find((c) => c.slug === slug);
    if (hit) return hit;
  }
  for (const i of Object.values(industries)) {
    const hit = i.caseStudies.find((c) => c.slug === slug);
    if (hit) return hit;
  }
  for (const p of Object.values(platforms)) {
    const hit = p.caseStudies.find((c) => c.slug === slug);
    if (hit) return hit;
  }
  return undefined;
}

export default function CasePanel({ entityRef, rationale }: PanelProps) {
  const cs = findCaseStudy(entityRef);
  if (!cs) {
    return (
      <PanelShell kicker="Case study" title="Not in our catalog">
        <p className="text-sm text-gray-600">I could not find that case study.</p>
      </PanelShell>
    );
  }
  return (
    <PanelShell
      kicker="Case study"
      title={displayClient(cs)}
      rationale={rationale ?? cs.challenge}
    >
      <section className="mb-6">
        <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-500">
          Challenge
        </h3>
        <p className="text-sm text-gray-700">{cs.challenge}</p>
      </section>
      {cs.solution && (
        <section className="mb-6">
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-500">
            Approach
          </h3>
          <p className="text-sm text-gray-700">{cs.solution}</p>
        </section>
      )}
      {cs.results.length > 0 && (
        <section className="mb-6">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
            Outcomes
          </h3>
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {cs.results.map((r) => (
              <li
                key={r.metric + r.description}
                className="rounded-xl border border-gray-200 p-4"
              >
                <div className="text-2xl font-bold text-[color:var(--aci-primary,#0052CC)]">
                  {r.metric}
                </div>
                <p className="mt-1 text-xs text-gray-600">{r.description}</p>
              </li>
            ))}
          </ul>
        </section>
      )}
      {cs.technologies && cs.technologies.length > 0 && (
        <section>
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-500">
            Stack
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {cs.technologies.map((t) => (
              <span
                key={t}
                className="rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-700"
              >
                {t}
              </span>
            ))}
          </div>
        </section>
      )}
    </PanelShell>
  );
}
