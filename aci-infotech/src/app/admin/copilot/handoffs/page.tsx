'use client';

/**
 * Handoff inbox.
 *
 * Lists every session whose handoff_at is non-null. Lets an admin
 * claim a session (writes admin_claimed_by + admin_mode) and post
 * relay messages from the per-session replay page.
 */
import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { subscribeAdminLive } from '@/lib/copilot/realtime';

interface HandoffRow {
  session_id: string;
  handoff_at: string | null;
  handoff_reason: string | null;
  admin_claimed_by: string | null;
  admin_mode: string | null;
  lead_name: string | null;
  lead_email: string | null;
  lead_company: string | null;
  page_entry: string | null;
  message_count: number | null;
}

function fmtAgo(iso: string | null): string {
  if (!iso) return '—';
  const ms = Date.now() - new Date(iso).getTime();
  if (ms < 60_000) return `${Math.max(1, Math.floor(ms / 1000))}s ago`;
  if (ms < 3_600_000) return `${Math.floor(ms / 60_000)}m ago`;
  if (ms < 86_400_000) return `${Math.floor(ms / 3_600_000)}h ago`;
  return `${Math.floor(ms / 86_400_000)}d ago`;
}

export default function HandoffInbox() {
  const [rows, setRows] = useState<HandoffRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setError(null);
    try {
      const res = await fetch('/api/admin/copilot/handoffs', { cache: 'no-store' });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        setError(json.reason ?? `HTTP ${res.status}`);
        return;
      }
      setRows(json.sessions as HandoffRow[]);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    const off = subscribeAdminLive({ onSessionUpsert: () => refresh() });
    return off;
  }, [refresh]);

  const claim = async (sessionId: string, mode: 'relay' | 'copilot') => {
    setBusyId(sessionId);
    try {
      const res = await fetch('/api/admin/copilot/handoffs?action=claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, mode }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        setError(json.reason ?? `HTTP ${res.status}`);
        return;
      }
      await refresh();
    } finally {
      setBusyId(null);
    }
  };

  const release = async (sessionId: string) => {
    setBusyId(sessionId);
    try {
      const res = await fetch('/api/admin/copilot/handoffs?action=release', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        setError(json.reason ?? `HTTP ${res.status}`);
        return;
      }
      await refresh();
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <header>
        <h1 className="text-2xl font-bold text-gray-900">Handoff Inbox</h1>
        <p className="mt-1 text-sm text-gray-600">
          Sessions where Atheros escalated to a human. Claim one to take over the conversation in relay mode (you type) or copilot mode (you edit Atheros drafts).
        </p>
      </header>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
            <tr>
              <th className="px-4 py-2">Lead</th>
              <th className="px-4 py-2">Reason</th>
              <th className="px-4 py-2">Page</th>
              <th className="px-4 py-2">Requested</th>
              <th className="px-4 py-2 text-right">Messages</th>
              <th className="px-4 py-2">State</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading && rows.length === 0 ? (
              <tr><td colSpan={7} className="px-4 py-6 text-center text-gray-400">Loading…</td></tr>
            ) : rows.length === 0 ? (
              <tr><td colSpan={7} className="px-4 py-6 text-center text-gray-400">No handoffs yet.</td></tr>
            ) : (
              rows.map((r) => (
                <tr key={r.session_id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">{r.lead_name ?? r.session_id.slice(0, 12)}</div>
                    <div className="text-xs text-gray-500">{r.lead_email ?? r.lead_company ?? '—'}</div>
                  </td>
                  <td className="px-4 py-3 text-gray-700">{r.handoff_reason ?? '—'}</td>
                  <td className="px-4 py-3 text-gray-700">{r.page_entry ?? '—'}</td>
                  <td className="px-4 py-3 text-gray-700">{fmtAgo(r.handoff_at)}</td>
                  <td className="px-4 py-3 text-right text-gray-700">{r.message_count ?? 0}</td>
                  <td className="px-4 py-3">
                    {r.admin_claimed_by ? (
                      <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-800">
                        claimed · {r.admin_mode}
                      </span>
                    ) : (
                      <span className="rounded-full bg-rose-100 px-2 py-0.5 text-xs font-semibold text-rose-800">
                        unclaimed
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {r.admin_claimed_by ? (
                      <button
                        type="button"
                        disabled={busyId === r.session_id}
                        onClick={() => release(r.session_id)}
                        className="rounded-full border border-gray-300 px-3 py-1 text-xs font-semibold text-gray-700 hover:border-rose-300 hover:text-rose-700 disabled:opacity-50"
                      >
                        Release
                      </button>
                    ) : (
                      <button
                        type="button"
                        disabled={busyId === r.session_id}
                        onClick={() => claim(r.session_id, 'relay')}
                        className="rounded-full bg-[var(--aci-primary,#0052CC)] px-3 py-1 text-xs font-semibold text-white hover:bg-[var(--aci-primary-dark,#003D99)] disabled:opacity-50"
                      >
                        Take it (relay)
                      </button>
                    )}
                    <Link
                      href={`/admin/copilot/sessions/${encodeURIComponent(r.session_id)}`}
                      className="ml-3 text-xs font-semibold text-[var(--aci-primary,#0052CC)] hover:underline"
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
