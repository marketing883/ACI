'use client';

/**
 * Real ResourcePanel: renders LP_CONTENT for the requested slug so
 * the right canvas shows substantive content from the actual landing
 * page, not a placeholder. Falls back gracefully when the slug is not
 * in the catalog.
 */

import { getLPContent } from '@/lib/lp-content';
import PanelShell from './PanelShell';
import type { PanelProps } from './registry';

export default function ResourcePanel({ entityRef }: PanelProps) {
  const lp = getLPContent(entityRef);
  if (!lp) {
    return (
      <PanelShell
        kicker="Resource"
        title="Not in our catalog"
      >
        <p className="text-sm text-gray-600">
          I could not find a deep-dive page for that slug. Try a service,
          platform, or diagram panel instead.
        </p>
      </PanelShell>
    );
  }
  return (
    <PanelShell
      kicker="Resource"
      title={lp.headline}
      rationale={lp.subheadline}
      secondaryHref={`/lp/${lp.slug}`}
      secondaryLabel={lp.ctoText ? lp.ctoText : 'Open the full page'}
    >
      {lp.stats && lp.stats.length > 0 && (
        <section className="mb-6">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
            Numbers
          </h3>
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {lp.stats.slice(0, 4).map((s) => (
              <li
                key={`${s.value}-${s.label}`}
                className="rounded-xl border border-gray-200 bg-gray-50 p-3"
              >
                <div className="text-2xl font-bold text-[color:var(--aci-primary,#0052CC)]">
                  {s.value}
                </div>
                <p className="mt-1 text-xs text-gray-600">{s.label}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {lp.painPoints && lp.painPoints.length > 0 && (
        <section className="mb-6">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
            {lp.painPointsHeadline || 'Where it tends to slip'}
          </h3>
          <ul className="space-y-2">
            {lp.painPoints.slice(0, 5).map((p) => (
              <li
                key={p.title}
                className="rounded-lg border border-gray-200 px-4 py-3 text-sm"
              >
                <div className="font-semibold text-[color:var(--aci-secondary,#0A1628)]">
                  {p.title}
                </div>
                <p className="mt-1 text-gray-700">{p.description}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {lp.processSteps && lp.processSteps.length > 0 && (
        <section className="mb-6">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
            {lp.solutionHeadline || 'How we run it'}
          </h3>
          <ol className="space-y-3">
            {lp.processSteps.slice(0, 5).map((p, idx) => (
              <li key={p.title} className="rounded-xl border border-gray-200 p-4">
                <div className="flex items-baseline gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[color:var(--aci-primary,#0052CC)] text-xs font-semibold text-white">
                    {p.step || String(idx + 1)}
                  </span>
                  <span className="font-semibold">{p.title}</span>
                </div>
                <p className="mt-2 text-sm text-gray-700">{p.description}</p>
              </li>
            ))}
          </ol>
        </section>
      )}

      {lp.benefits && lp.benefits.length > 0 && (
        <section className="mb-6">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
            {lp.benefitsHeadline || 'What you get'}
          </h3>
          <ul className="grid gap-3 sm:grid-cols-2">
            {lp.benefits.slice(0, 6).map((b) => (
              <li key={b.title} className="rounded-lg border border-gray-200 p-3">
                <div className="font-semibold">{b.title}</div>
                <p className="mt-1 text-sm text-gray-600">{b.description}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {lp.proofItems && lp.proofItems.length > 0 && (
        <section className="mb-6">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
            Proof
          </h3>
          <ul className="space-y-3">
            {lp.proofItems.slice(0, 3).map((p) => (
              <li key={p.headline} className="rounded-xl border border-gray-200 p-4">
                <div className="text-sm font-semibold text-[color:var(--aci-primary,#0052CC)]">
                  {p.industry ? `Fortune 500 ${p.industry} Client` : 'Enterprise Client'}
                </div>
                <div className="mt-1 font-semibold text-[color:var(--aci-secondary,#0A1628)]">
                  {p.headline}
                </div>
                <p className="mt-1 text-sm text-gray-700">{p.description}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {lp.faqs && lp.faqs.length > 0 && (
        <section>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
            Common questions
          </h3>
          <ul className="space-y-3">
            {lp.faqs.slice(0, 5).map((f) => (
              <li key={f.question} className="rounded-lg border border-gray-200 p-4">
                <div className="font-semibold text-[color:var(--aci-secondary,#0A1628)]">
                  {f.question}
                </div>
                <p className="mt-2 text-sm text-gray-700">{f.answer}</p>
              </li>
            ))}
          </ul>
        </section>
      )}
    </PanelShell>
  );
}
