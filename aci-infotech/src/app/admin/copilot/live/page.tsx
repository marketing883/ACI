'use client';

/**
 * Atheros admin live view.
 *
 * Two-pane layout. Left: filterable list of recent sessions, populated
 * from /api/admin/copilot/sessions and refreshed via Supabase Realtime
 * on session/message inserts. Right: link to the per-session replay
 * page when a row is selected.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { subscribeAdminLive } from '@/lib/copilot/realtime';

interface SessionRow {
  session_id: string;
  visitor_id: string | null;
  started_at: string;
  ended_at: string | null;
  page_entry: string | null;
  flag_bucket: number | null;
  device_class: string | null;
  handoff_at: string | null;
  handoff_reason: string | null;
  admin_claimed_by: string | null;
  admin_mode: string | null;
  lead_id: string | null;
  lead_name: string | null;
  lead_email: string | null;
  lead_company: string | null;
  lead_job_title: string | null;
  lead_service_interest: string | null;
  lead_score: number | null;
  lead_status: string | null;
  message_count: number | null;
  total_input_tokens: number | null;
  total_output_tokens: number | null;
  total_cost_usd: string | number | null;
  last_message_at: string | null;
  last_model: string | null;
}

function fmtCost(c: SessionRow['total_cost_usd']) {
  const n = typeof c === 'string' ? Number.parseFloat(c) : c ?? 0;
  if (!Number.isFinite(n) || n === 0) return '$0';
  if (n < 0.01) return `$${n.toFixed(5)}`;
  if (n < 1) return `$${n.toFixed(3)}`;
  return `$${n.toFixed(2)}`;
}

function fmtAgo(iso: string | null): string {
  if (!iso) return '—';
  const ms = Date.now() - new Date(iso).getTime();
  if (ms < 60_000) return `${Math.max(1, Math.floor(ms / 1000))}s ago`;
  if (ms < 3_600_000) return `${Math.floor(ms / 60_000)}m ago`;
  if (ms < 86_400_000) return `${Math.floor(ms / 3_600_000)}h ago`;
  return `${Math.floor(ms / 86_400_000)}d ago`;
}

export default function AtherosLivePage() {
  const [rows, setRows] = useState<SessionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeOnly, setActiveOnly] = useState(false);
  const [handoffOnly, setHandoffOnly] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchRows = useCallback(async () => {
    setError(null);
    const params = new URLSearchParams();
    params.set('limit', '100');
    if (activeOnly) params.set('activeOnly', '1');
    if (handoffOnly) params.set('handoffOnly', '1');
    if (search.trim()) params.set('search', search.trim());
    try {
      const res = await fetch(`/api/admin/copilot/sessions?${params.toString()}`, {
        cache: 'no-store',
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        setError(json.reason ?? `HTTP ${res.status}`);
        return;
      }
      setRows(json.sessions as SessionRow[]);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [activeOnly, handoffOnly, search]);

  useEffect(() => {
    if (debounce.current) clearTimeout(debounce.current);
    debounce.current = setTimeout(fetchRows, 250);
    return () => {
      if (debounce.current) clearTimeout(debounce.current);
    };
  }, [fetchRows]);

  // Realtime: refresh the list when a new session or message lands.
  useEffect(() => {
    const off = subscribeAdminLive({
      onSessionUpsert: () => fetchRows(),
      onMessageInsert: () => fetchRows(),
    });
    return off;
  }, [fetchRows]);

  const stats = useMemo(() => {
    const totalCost = rows.reduce(
      (sum, r) =>
        sum + (typeof r.total_cost_usd === 'string' ? Number.parseFloat(r.total_cost_usd) || 0 : r.total_cost_usd ?? 0),
      0,
    );
    const handoffs = rows.filter((r) => r.handoff_at).length;
    const qualified = rows.filter((r) => r.lead_id).length;
    return { totalCost, handoffs, qualified };
  }, [rows]);

  return (
    <div className="space-y-6 p-6">
      <header>
        <h1 className="text-2xl font-bold text-gray-900">Live Conversations</h1>
        <p className="mt-1 text-sm text-gray-600">
          Real-time feed of every Atheros session. Filters and search are live.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
        <StatCard label="Sessions" value={rows.length} />
        <StatCard label="With lead" value={stats.qualified} />
        <StatCard label="Handoffs pending" value={stats.handoffs} accent={stats.handoffs > 0} />
        <StatCard label="Cost (this view)" value={fmtCost(stats.totalCost)} />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <input
          type="search"
          placeholder="Search visitor / email / name / company"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-72 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[var(--aci-primary,#0052CC)] focus:outline-none"
        />
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={activeOnly}
            onChange={(e) => setActiveOnly(e.target.checked)}
          />
          Active in last 5 min
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={handoffOnly}
            onChange={(e) => setHandoffOnly(e.target.checked)}
          />
          Handoff only
        </label>
        <button
          type="button"
          onClick={fetchRows}
          className="ml-auto rounded-lg border border-gray-300 px-3 py-1.5 text-sm hover:border-[var(--aci-primary,#0052CC)]"
        >
          Refresh
        </button>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
            <tr>
              <th className="px-4 py-2">Lead / Visitor</th>
              <th className="px-4 py-2">Page</th>
              <th className="px-4 py-2">Last activity</th>
              <th className="px-4 py-2 text-right">Turns</th>
              <th className="px-4 py-2 text-right">Score</th>
              <th className="px-4 py-2 text-right">Cost</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading && rows.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-6 text-center text-gray-400">
                  Loading…
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-6 text-center text-gray-400">
                  No sessions match.
                </td>
              </tr>
            ) : (
              rows.map((r) => (
                <tr key={r.session_id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">
                      {r.lead_name ?? r.visitor_id ?? r.session_id.slice(0, 12)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {r.lead_email ?? r.lead_company ?? '—'}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-700">{r.page_entry ?? '—'}</td>
                  <td className="px-4 py-3 text-gray-700">{fmtAgo(r.last_message_at ?? r.started_at)}</td>
                  <td className="px-4 py-3 text-right text-gray-700">{r.message_count ?? 0}</td>
                  <td className="px-4 py-3 text-right">
                    {r.lead_score != null ? (
                      <span className="rounded-full bg-[var(--aci-primary,#0052CC)]/10 px-2 py-0.5 text-xs font-semibold text-[var(--aci-primary,#0052CC)]">
                        {r.lead_score}
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right text-gray-700">{fmtCost(r.total_cost_usd)}</td>
                  <td className="px-4 py-3">
                    {r.handoff_at ? (
                      <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-800">
                        handoff
                      </span>
                    ) : r.lead_id ? (
                      <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-800">
                        {r.lead_status ?? 'qualified'}
                      </span>
                    ) : (
                      <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                        active
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/copilot/sessions/${encodeURIComponent(r.session_id)}`}
                      className="text-xs font-semibold text-[var(--aci-primary,#0052CC)] hover:underline"
                    >
                      Open →
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatCard({ label, value, accent }: { label: string; value: string | number; accent?: boolean }) {
  return (
    <div
      className={`rounded-xl border bg-white p-4 ${accent ? 'border-amber-300 bg-amber-50' : 'border-gray-200'}`}
    >
      <div className="text-xs uppercase tracking-wide text-gray-500">{label}</div>
      <div className="mt-1 text-2xl font-bold text-gray-900">{value}</div>
    </div>
  );
}
