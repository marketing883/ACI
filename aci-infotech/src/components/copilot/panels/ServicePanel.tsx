'use client';

import { services } from '@/data/services';
import type { ServiceClusterId } from '@/data/types';
import { displayClient } from '@/lib/content/anonymize';
import PanelShell from './PanelShell';
import type { PanelProps } from './registry';

function isKnownService(key: string): key is ServiceClusterId {
  return key in services;
}

export default function ServicePanel({ entityRef, rationale }: PanelProps) {
  if (!isKnownService(entityRef)) {
    return (
      <PanelShell kicker="Service" title="Not in our catalog">
        <p className="text-sm text-gray-600">
          I could not find that service in the ACI catalog. Try asking about
          data engineering, applied AI, cloud modernization, MarTech and CDP,
          or cyber security.
        </p>
      </PanelShell>
    );
  }
  const s = services[entityRef];
  return (
    <PanelShell
      kicker="Service"
      title={s.title}
      rationale={rationale ?? s.tagline}
      secondaryHref={`/services/${s.slug}`}
      secondaryLabel="See full service"
    >
      {s.keyOutcomes.length > 0 && (
        <section className="mb-8">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
            Outcomes
          </h3>
          <ul className="grid gap-2 md:grid-cols-2">
            {s.keyOutcomes.map((o) => (
              <li
                key={o}
                className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm"
              >
                {o}
              </li>
            ))}
          </ul>
        </section>
      )}

      {s.offerings.length > 0 && (
        <section className="mb-8">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
            What we build
          </h3>
          <ul className="space-y-3">
            {s.offerings.slice(0, 6).map((o) => (
              <li
                key={o.id}
                className="rounded-xl border border-gray-200 p-4 transition hover:border-[color:var(--aci-primary,#0052CC)]"
              >
                <div className="font-semibold">{o.title}</div>
                <p className="mt-1 text-sm text-gray-600">{o.description}</p>
                {o.technologies && o.technologies.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {o.technologies.slice(0, 6).map((t) => (
                      <span
                        key={t}
                        className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-700"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {s.caseStudies.length > 0 && (
        <section>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
            Proof
          </h3>
          <ul className="space-y-3">
            {s.caseStudies.slice(0, 3).map((cs) => (
              <li
                key={cs.slug}
                className="rounded-xl border border-gray-200 p-4"
              >
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
