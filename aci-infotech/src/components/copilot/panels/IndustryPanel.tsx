'use client';

import { industries } from '@/data/industries';
import type { IndustryId } from '@/data/types';
import { displayClient } from '@/lib/content/anonymize';
import PanelShell from './PanelShell';
import type { PanelProps } from './registry';

function isKnownIndustry(key: string): key is IndustryId {
  return key in industries;
}

export default function IndustryPanel({ entityRef, rationale }: PanelProps) {
  if (!isKnownIndustry(entityRef)) {
    return (
      <PanelShell kicker="Industry" title="Not in our catalog">
        <p className="text-sm text-gray-600">
          I could not find that industry in the ACI catalog.
        </p>
      </PanelShell>
    );
  }
  const ind = industries[entityRef];
  return (
    <PanelShell
      kicker="Industry"
      title={ind.title}
      rationale={rationale ?? ind.tagline}
      secondaryHref={`/industries/${ind.slug}`}
      secondaryLabel="See industry page"
    >
      {ind.useCases.length > 0 && (
        <section className="mb-8">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
            What shows up in {ind.title.split(' ')[0].toLowerCase()}
          </h3>
          <ul className="grid gap-3 md:grid-cols-2">
            {ind.useCases.slice(0, 6).map((u) => (
              <li
                key={u.title}
                className="rounded-xl border border-gray-200 p-4"
              >
                <div className="font-semibold">{u.title}</div>
                {u.description && (
                  <p className="mt-1 text-sm text-gray-600">{u.description}</p>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {ind.caseStudies.length > 0 && (
        <section>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
            Proof
          </h3>
          <ul className="space-y-3">
            {ind.caseStudies.slice(0, 3).map((cs) => (
              <li
                key={cs.slug}
                className="rounded-xl border border-gray-200 p-4"
              >
                <div className="text-sm font-semibold text-[color:var(--aci-primary,#0052CC)]">
                  {displayClient(cs)}
                </div>
                <p className="mt-1 text-sm text-gray-700">{cs.challenge}</p>
                <div className="mt-3 flex flex-wrap gap-3 text-xs text-gray-600">
                  {cs.results.slice(0, 3).map((r) => (
                    <span key={r.metric}>
                      <span className="font-semibold text-[color:var(--aci-secondary,#0A1628)]">
                        {r.metric}
                      </span>{' '}
                      {r.description}
                    </span>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}
    </PanelShell>
  );
}
