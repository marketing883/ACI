'use client';

/**
 * Atheros analytics dashboard.
 * Top cards + simple ranked lists, refreshed on button click and on
 * Realtime session/message inserts.
 */
import { useCallback, useEffect, useState } from 'react';
import { subscribeAdminLive } from '@/lib/copilot/realtime';

interface Summary {
  sessions: number;
  messages: number;
  qualifiedLeads: number;
  handoffs: number;
  totalCostUsd: number;
  avgCostPerSession: number;
  avgCostPerLead: number;
  p50LatencyMs: number;
  p95LatencyMs: number;
  avgTurnsPerSession: number;
  conversionRate: number;
  errorRatePerSession: number;
}

interface AnalyticsResponse {
  ok: boolean;
  since: string;
  summary: Summary;
  topPages: Array<{ page: string; count: number }>;
  topModels: Array<{ model: string; count: number }>;
  topServices: Array<{ service: string; count: number }>;
}

const SINCE_OPTIONS: Array<['24h' | '7d' | '30d', string]> = [
  ['24h', 'Last 24h'],
  ['7d', 'Last 7d'],
  ['30d', 'Last 30d'],
];

function fmtCost(n: number): string {
  if (!Number.isFinite(n) || n === 0) return '$0';
  if (n < 0.01) return `$${n.toFixed(5)}`;
  if (n < 1) return `$${n.toFixed(3)}`;
  return `$${n.toFixed(2)}`;
}

function fmtPct(n: number): string {
  return `${(n * 100).toFixed(1)}%`;
}

function fmtMs(n: number): string {
  if (n === 0) return '—';
  if (n < 1000) return `${n}ms`;
  return `${(n / 1000).toFixed(2)}s`;
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsResponse | null>(null);
  const [since, setSince] = useState<'24h' | '7d' | '30d'>('24h');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setError(null);
    try {
      const res = await fetch(`/api/admin/copilot/analytics?since=${since}`, {
        cache: 'no-store',
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        setError(json.reason ?? `HTTP ${res.status}`);
        return;
      }
      setData(json as AnalyticsResponse);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [since]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    const off = subscribeAdminLive({
      onMessageInsert: () => refresh(),
      onSessionUpsert: () => refresh(),
    });
    return off;
  }, [refresh]);

  return (
    <div className="space-y-6 p-6">
      <header className="flex items-baseline justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Atheros Analytics</h1>
          <p className="mt-1 text-sm text-gray-600">
            Volume, conversion, cost, and latency. Refreshes automatically as new sessions land.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={since}
            onChange={(e) => setSince(e.target.value as typeof since)}
            className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm"
          >
            {SINCE_OPTIONS.map(([v, label]) => <option key={v} value={v}>{label}</option>)}
          </select>
          <button
            type="button"
            onClick={refresh}
            className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm hover:border-[var(--aci-primary,#0052CC)]"
          >
            Refresh
          </button>
        </div>
      </header>

      {error && <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}

      {loading && !data ? (
        <div className="rounded-xl border border-gray-200 bg-white p-6 text-center text-gray-400">Loading…</div>
      ) : data ? (
        <>
          <section className="grid grid-cols-2 gap-3 sm:grid-cols-4 xl:grid-cols-6">
            <Stat label="Sessions" value={data.summary.sessions} />
            <Stat label="Messages" value={data.summary.messages} />
            <Stat label="Qualified leads" value={data.summary.qualifiedLeads} />
            <Stat label="Handoffs" value={data.summary.handoffs} accent={data.summary.handoffs > 0} />
            <Stat label="Conversion" value={fmtPct(data.summary.conversionRate)} />
            <Stat label="Avg turns / session" value={data.summary.avgTurnsPerSession} />
            <Stat label="p50 latency" value={fmtMs(data.summary.p50LatencyMs)} />
            <Stat label="p95 latency" value={fmtMs(data.summary.p95LatencyMs)} />
            <Stat label="Total cost" value={fmtCost(data.summary.totalCostUsd)} />
            <Stat label="Cost / session" value={fmtCost(data.summary.avgCostPerSession)} />
            <Stat label="Cost / lead" value={fmtCost(data.summary.avgCostPerLead)} />
            <Stat label="Errors / session" value={data.summary.errorRatePerSession.toFixed(3)} accent={data.summary.errorRatePerSession > 0.5} />
          </section>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <RankedList title="Top pages" rows={data.topPages.map((r) => ({ label: r.page, value: r.count }))} />
            <RankedList title="Top models" rows={data.topModels.map((r) => ({ label: r.model, value: r.count }))} />
            <RankedList title="Top service interests" rows={data.topServices.map((r) => ({ label: r.service, value: r.count }))} />
          </div>

          <ContentGapFeed />
        </>
      ) : null}
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: string | number; accent?: boolean }) {
  return (
    <div className={`rounded-xl border bg-white p-4 ${accent ? 'border-amber-300 bg-amber-50' : 'border-gray-200'}`}>
      <div className="text-xs uppercase tracking-wide text-gray-500">{label}</div>
      <div className="mt-1 text-xl font-bold text-gray-900">{value}</div>
    </div>
  );
}

interface Gap {
  message_id: string;
  session_id: string;
  created_at: string;
  top_k: number;
  top_similarity: number;
  source_types: string[];
  user_question: string;
}

function ContentGapFeed() {
  const [gaps, setGaps] = useState<Gap[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setErr(null);
    try {
      const res = await fetch('/api/admin/copilot/content-gaps?since=7d&threshold=0.35&limit=40', {
        cache: 'no-store',
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        setErr(json.reason ?? `HTTP ${res.status}`);
        return;
      }
      setGaps(json.gaps as Gap[]);
    } catch (e) {
      setErr((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <div className="mb-3 flex items-baseline justify-between">
        <div>
          <h2 className="text-sm font-semibold text-gray-900">Content Gap feed</h2>
          <p className="text-xs text-gray-500">
            User questions where retrieval returned nothing or scored below 0.35. Last 7 days. Each one is a prompt for a new page, FAQ, or case study.
          </p>
        </div>
        <button
          type="button"
          onClick={refresh}
          className="rounded-lg border border-gray-300 px-2 py-1 text-xs hover:border-[var(--aci-primary,#0052CC)]"
        >
          Refresh
        </button>
      </div>
      {err ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700">{err}</div>
      ) : loading && gaps.length === 0 ? (
        <div className="text-center text-xs text-gray-400">Loading…</div>
      ) : gaps.length === 0 ? (
        <div className="text-center text-xs text-gray-400">
          No gaps in the last 7 days. Retrieval is covering every question.
        </div>
      ) : (
        <ul className="divide-y divide-gray-100 text-sm">
          {gaps.map((g) => (
            <li key={g.message_id} className="flex items-start justify-between gap-4 py-2">
              <div className="min-w-0 flex-1">
                <div className="truncate font-medium text-gray-900" title={g.user_question}>
                  {g.user_question.length > 120
                    ? `${g.user_question.slice(0, 120)}…`
                    : g.user_question}
                </div>
                <div className="mt-0.5 text-[11px] uppercase tracking-wide text-gray-500">
                  top-1 similarity {g.top_similarity.toFixed(2)} · {g.top_k} chunks ·{' '}
                  {new Date(g.created_at).toLocaleString()}
                </div>
              </div>
              <a
                href={`/admin/copilot/sessions/${encodeURIComponent(g.session_id)}`}
                className="shrink-0 text-xs font-semibold text-[var(--aci-primary,#0052CC)] hover:underline"
              >
                Replay →
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function RankedList({ title, rows }: { title: string; rows: Array<{ label: string; value: number }> }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">{title}</div>
      {rows.length === 0 ? (
        <div className="text-sm text-gray-400">No data yet.</div>
      ) : (
        <ul className="space-y-1 text-sm">
          {rows.map((r) => (
            <li key={r.label} className="flex items-center justify-between">
              <span className="truncate text-gray-700">{r.label}</span>
              <span className="ml-2 font-semibold text-gray-900">{r.value}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
