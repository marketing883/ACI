'use client';

import { platforms } from '@/data/platforms';
import type { PlatformId } from '@/data/types';
import { displayClient } from '@/lib/content/anonymize';
import PanelShell from './PanelShell';
import type { PanelProps } from './registry';

function isKnownPlatform(key: string): key is PlatformId {
  return key in platforms;
}

export default function PlatformPanel({ entityRef, rationale }: PanelProps) {
  if (!isKnownPlatform(entityRef)) {
    return (
      <PanelShell kicker="Platform" title="Not in our catalog">
        <p className="text-sm text-gray-600">
          I could not find that platform in the ACI catalog.
        </p>
      </PanelShell>
    );
  }
  const p = platforms[entityRef];
  return (
    <PanelShell
      kicker="Platform"
      title={p.title}
      rationale={rationale ?? p.tagline}
      secondaryHref={`/platforms/${p.slug}`}
      secondaryLabel="See platform page"
    >
      {p.capabilities.length > 0 && (
        <section className="mb-8">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
            What we build on {p.title.split(' ')[0]}
          </h3>
          <ul className="space-y-3">
            {p.capabilities.slice(0, 6).map((c) => (
              <li
                key={c.title}
                className="rounded-xl border border-gray-200 p-4"
              >
                <div className="font-semibold">{c.title}</div>
                {c.description && (
                  <p className="mt-1 text-sm text-gray-600">{c.description}</p>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {p.caseStudies.length > 0 && (
        <section>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
            Proof
          </h3>
          <ul className="space-y-3">
            {p.caseStudies.slice(0, 3).map((cs) => (
              <li key={cs.slug} className="rounded-xl border border-gray-200 p-4">
                <div className="text-sm font-semibold text-[color:var(--aci-primary,#0052CC)]">
                  {displayClient(cs)}
                </div>
                <p className="mt-1 text-sm text-gray-700">{cs.challenge}</p>
                <div className="mt-3 flex flex-wrap gap-3 text-xs text-gray-600">
                  {cs.results.slice(0, 3).map((r, idx) => (
                    <span key={`${cs.slug}-${idx}`}>
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
