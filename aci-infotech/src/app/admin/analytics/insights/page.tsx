'use client';

import { useEffect, useState } from 'react';
import {
  Brain,
  RefreshCw,
  AlertCircle,
  Users,
  Cpu,
} from 'lucide-react';
import type {
  InsightsResponse,
  PainPointEntry,
  DecisionRoleEntry,
  ModelEntry,
  CorrelationInsight,
} from '@/app/api/admin/analytics/insights/route';

type SinceKey = '24h' | '7d' | '30d';

const RANGE_OPTIONS: Array<{ key: SinceKey; label: string }> = [
  { key: '24h', label: 'Last 24 hours' },
  { key: '7d', label: 'Last 7 days' },
  { key: '30d', label: 'Last 30 days' },
];

const fmtInt = (n: number) => n.toLocaleString();

export default function InsightsPage() {
  const [since, setSince] = useState<SinceKey>('30d');
  const [data, setData] = useState<InsightsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshCounter, setRefreshCounter] = useState(0);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `/api/admin/analytics/insights?since=${since}`,
          { cache: 'no-store' },
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = (await res.json()) as InsightsResponse;
        if (!cancelled) setData(json);
      } catch (err) {
        if (!cancelled)
          setError(err instanceof Error ? err.message : 'Failed to load');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [since, refreshCounter]);

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center">
              <Brain className="w-5 h-5 text-violet-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Lead Insights</h1>
          </div>
          <p className="text-sm text-gray-500">
            What visitors are struggling with, who they are, and how the AI
            models are performing. Pain points and decision roles populate as
            qualify_lead captures new fields over future conversations.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setRefreshCounter((n) => n + 1)}
          disabled={loading}
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors disabled:opacity-50"
          aria-label="Refresh"
        >
          <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Time range — default 30d for insights (want more data) */}
      <div className="flex gap-2 mb-6">
        {RANGE_OPTIONS.map((opt) => (
          <button
            key={opt.key}
            type="button"
            onClick={() => setSince(opt.key)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              since === opt.key
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
          Failed to load: {error}
        </div>
      )}

      {data && (
        <div className="space-y-6">
          {/* Section 1: Pain Points */}
          <PainPointsSection
            painPoints={data.painPoints}
            total={data.totalLeadsWithPainPoint}
          />

          {/* Section 2: Decision Role */}
          <DecisionRolesSection
            roles={data.decisionRoles}
            total={data.totalLeadsWithRole}
          />

          {/* Section 3: Model Performance */}
          <ModelPerformanceSection models={data.models} />

          {/* Section 4: Correlations */}
          {data.correlations.length > 0 && (
            <CorrelationsSection correlations={data.correlations} />
          )}
        </div>
      )}

      {data && !loading && (
        <div className="mt-4 text-xs text-gray-400 text-right">
          Generated {new Date(data.generatedAt).toLocaleString()}
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------- */
/* Pain Points                                                           */
/* -------------------------------------------------------------------- */

function PainPointsSection({
  painPoints,
  total,
}: {
  painPoints: PainPointEntry[];
  total: number;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-1">
        <AlertCircle className="w-5 h-5 text-orange-600" />
        <h2 className="text-lg font-semibold text-gray-900">
          What visitors are struggling with
        </h2>
      </div>
      <p className="text-xs text-gray-500 mb-4">
        Verbatim pain points captured by qualify_lead.painPoint.{' '}
        {total > 0 ? `${fmtInt(total)} leads with a pain point.` : ''}
      </p>

      {painPoints.length === 0 ? (
        <div className="py-8 text-center text-sm text-gray-400 italic">
          No pain points captured yet. This field populates as the chatbot
          detects concrete operational pains in conversation (slow closes,
          flaky tests, vendor onboarding friction, etc.).
        </div>
      ) : (
        <div className="space-y-2">
          {painPoints.map((pp, i) => {
            const maxCount = painPoints[0].count;
            const widthPct = Math.max(8, (pp.count / maxCount) * 100);
            return (
              <div key={i} className="flex items-center gap-3">
                <div className="flex-1">
                  <div className="relative h-8 bg-orange-50 rounded-lg overflow-hidden">
                    <div
                      className="h-full bg-orange-200 rounded-lg transition-all duration-500"
                      style={{ width: `${widthPct}%` }}
                    />
                    <div className="absolute inset-0 flex items-center px-3">
                      <span className="text-sm text-gray-800 truncate">
                        {pp.text}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="w-10 text-right text-sm font-semibold text-gray-700">
                  {pp.count}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------- */
/* Decision Role Distribution                                            */
/* -------------------------------------------------------------------- */

function DecisionRolesSection({
  roles,
  total,
}: {
  roles: DecisionRoleEntry[];
  total: number;
}) {
  const maxCount = Math.max(1, ...roles.map((r) => r.count));
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-1">
        <Users className="w-5 h-5 text-indigo-600" />
        <h2 className="text-lg font-semibold text-gray-900">
          Who are the leads?
        </h2>
      </div>
      <p className="text-xs text-gray-500 mb-4">
        Decision role captured via qualify_lead.decisionRole.{' '}
        {total > 0
          ? `${fmtInt(total)} leads classified.`
          : 'No classifications yet.'}
      </p>

      {roles.length === 0 ? (
        <div className="py-8 text-center text-sm text-gray-400 italic">
          No decisionRole captures yet. The model infers this when the
          conversation gives a clear signal (title, self-identification,
          etc.).
        </div>
      ) : (
        <div className="space-y-3">
          {roles.map((r) => {
            const widthPct = Math.max(8, (r.count / maxCount) * 100);
            const roleColor: Record<string, string> = {
              leading: 'bg-emerald-400',
              scoping: 'bg-sky-400',
              researching: 'bg-amber-400',
              unclear: 'bg-gray-300',
            };
            return (
              <div key={r.role}>
                <div className="flex items-baseline justify-between mb-1">
                  <span className="text-sm font-medium text-gray-900">
                    {r.label}
                  </span>
                  <span className="text-xs text-gray-500">
                    {fmtInt(r.count)} lead{r.count === 1 ? '' : 's'}
                    {r.avgScore !== null && (
                      <span className="ml-2 text-gray-400">
                        avg score{' '}
                        <span className="font-medium text-gray-700">
                          {r.avgScore}
                        </span>
                      </span>
                    )}
                  </span>
                </div>
                <div className="h-6 bg-gray-50 rounded-md overflow-hidden">
                  <div
                    className={`h-full ${roleColor[r.role] ?? 'bg-gray-300'} rounded-md transition-all duration-500`}
                    style={{ width: `${widthPct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------- */
/* Model Performance Comparison                                          */
/* -------------------------------------------------------------------- */

function ModelPerformanceSection({ models }: { models: ModelEntry[] }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-1">
        <Cpu className="w-5 h-5 text-cyan-600" />
        <h2 className="text-lg font-semibold text-gray-900">
          Model performance
        </h2>
      </div>
      <p className="text-xs text-gray-500 mb-4">
        Per-model stats including conversion rate: what percentage of sessions
        where this model was the primary responder led to an email capture.
      </p>

      {models.length === 0 ? (
        <div className="py-8 text-center text-sm text-gray-400 italic">
          No assistant messages recorded in this window.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 pr-4 font-semibold text-gray-700">
                  Model
                </th>
                <th className="text-right py-2 px-3 font-semibold text-gray-700">
                  Msgs
                </th>
                <th className="text-right py-2 px-3 font-semibold text-gray-700">
                  Sessions
                </th>
                <th className="text-right py-2 px-3 font-semibold text-gray-700">
                  Conversions
                </th>
                <th className="text-right py-2 px-3 font-semibold text-gray-700">
                  Conv. rate
                </th>
                <th className="text-right py-2 px-3 font-semibold text-gray-700">
                  Avg latency
                </th>
                <th className="text-right py-2 px-3 font-semibold text-gray-700">
                  Total cost
                </th>
                <th className="text-right py-2 pl-3 font-semibold text-gray-700">
                  $/msg
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {models.map((m) => (
                <tr key={m.model} className="hover:bg-gray-50">
                  <td className="py-2.5 pr-4">
                    <span className="font-mono text-xs text-gray-700">
                      {m.model}
                    </span>
                  </td>
                  <td className="text-right py-2.5 px-3 tabular-nums text-gray-900">
                    {fmtInt(m.messages)}
                  </td>
                  <td className="text-right py-2.5 px-3 tabular-nums text-gray-600">
                    {fmtInt(m.sessions)}
                  </td>
                  <td className="text-right py-2.5 px-3 tabular-nums text-gray-900 font-medium">
                    {fmtInt(m.conversions)}
                  </td>
                  <td className="text-right py-2.5 px-3">
                    {m.conversionRate !== null ? (
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${
                          m.conversionRate >= 0.2
                            ? 'bg-emerald-100 text-emerald-700'
                            : m.conversionRate >= 0.05
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {(m.conversionRate * 100).toFixed(1)}%
                      </span>
                    ) : (
                      <span className="text-gray-400">{'\u2014'}</span>
                    )}
                  </td>
                  <td className="text-right py-2.5 px-3 tabular-nums text-gray-600">
                    {m.avgLatencyMs !== null
                      ? `${fmtInt(m.avgLatencyMs)} ms`
                      : '\u2014'}
                  </td>
                  <td className="text-right py-2.5 px-3 tabular-nums text-gray-900">
                    ${m.totalCostUsd.toFixed(4)}
                  </td>
                  <td className="text-right py-2.5 pl-3 tabular-nums text-gray-500">
                    {m.avgCostPerMessage !== null
                      ? `$${m.avgCostPerMessage.toFixed(4)}`
                      : '\u2014'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------- */
/* Correlations                                                          */
/* -------------------------------------------------------------------- */

function CorrelationsSection({
  correlations,
}: {
  correlations: CorrelationInsight[];
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-4">
        <Brain className="w-5 h-5 text-violet-600" />
        <h2 className="text-lg font-semibold text-gray-900">
          Correlations
        </h2>
      </div>
      <div className="space-y-3">
        {correlations.map((c, i) => (
          <div
            key={i}
            className={`p-4 rounded-xl border ${
              c.positive
                ? 'bg-emerald-50 border-emerald-200'
                : 'bg-amber-50 border-amber-200'
            }`}
          >
            <div
              className={`text-sm font-semibold mb-1 ${
                c.positive ? 'text-emerald-800' : 'text-amber-800'
              }`}
            >
              {c.label}
            </div>
            <div
              className={`text-sm ${
                c.positive ? 'text-emerald-700' : 'text-amber-700'
              }`}
            >
              {c.description}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
