'use client';

/**
 * Atheros error log dashboard.
 * Groups by fingerprint with silence support, real-time refresh.
 */
import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { subscribeAdminLive } from '@/lib/copilot/realtime';

interface ErrorGroup {
  fingerprint: string;
  stage: string;
  severity: string;
  sample_message: string;
  count: number;
  first_seen: string;
  last_seen: string;
  sessions: string[];
  silenced_until: string | null;
  silence_reason: string | null;
}

const STAGES = ['', 'retrieve', 'generate', 'tool', 'stream', 'render', 'panel', 'pill', 'indexer', 'ratelimit', 'health', 'init', 'other'];
const SEVERITIES = ['', 'warn', 'error', 'fatal', 'info'];
const SINCE = ['1h', '24h', '7d'];

function fmtAgo(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  if (ms < 60_000) return `${Math.max(1, Math.floor(ms / 1000))}s ago`;
  if (ms < 3_600_000) return `${Math.floor(ms / 60_000)}m ago`;
  if (ms < 86_400_000) return `${Math.floor(ms / 3_600_000)}h ago`;
  return `${Math.floor(ms / 86_400_000)}d ago`;
}

const SEVERITY_BADGE: Record<string, string> = {
  fatal: 'bg-red-200 text-red-900',
  error: 'bg-red-100 text-red-800',
  warn: 'bg-amber-100 text-amber-800',
  info: 'bg-sky-100 text-sky-800',
};

export default function ErrorsPage() {
  const [groups, setGroups] = useState<ErrorGroup[]>([]);
  const [stage, setStage] = useState('');
  const [severity, setSeverity] = useState('');
  const [since, setSince] = useState('24h');
  const [includeSilenced, setIncludeSilenced] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setError(null);
    const params = new URLSearchParams();
    if (stage) params.set('stage', stage);
    if (severity) params.set('severity', severity);
    if (since) params.set('since', since);
    if (includeSilenced) params.set('includeSilenced', '1');
    try {
      const res = await fetch(`/api/admin/copilot/errors?${params.toString()}`, {
        cache: 'no-store',
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        setError(json.reason ?? `HTTP ${res.status}`);
        return;
      }
      setGroups(json.groups as ErrorGroup[]);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [stage, severity, since, includeSilenced]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    const off = subscribeAdminLive({ onErrorInsert: () => refresh() });
    return off;
  }, [refresh]);

  const silence = async (fingerprint: string, hours = 24) => {
    const reason = prompt('Silence reason (optional)?') ?? undefined;
    const res = await fetch('/api/admin/copilot/errors?action=silence', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fingerprint, hours, reason }),
    });
    if (!res.ok) {
      setError((await res.text()) || 'silence failed');
      return;
    }
    refresh();
  };

  const unsilence = async (fingerprint: string) => {
    const res = await fetch('/api/admin/copilot/errors?action=unsilence', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fingerprint }),
    });
    if (!res.ok) {
      setError((await res.text()) || 'unsilence failed');
      return;
    }
    refresh();
  };

  return (
    <div className="space-y-6 p-6">
      <header>
        <h1 className="text-2xl font-bold text-gray-900">Chat Error Log</h1>
        <p className="mt-1 text-sm text-gray-600">
          Every log.* call from the Atheros stack groups here by fingerprint. Silence noisy ones for up to a week.
        </p>
      </header>

      <div className="flex flex-wrap items-center gap-3 text-sm">
        <select value={stage} onChange={(e) => setStage(e.target.value)} className="rounded-lg border border-gray-300 px-3 py-1.5">
          {STAGES.map((s) => <option key={s || 'all'} value={s}>{s || 'all stages'}</option>)}
        </select>
        <select value={severity} onChange={(e) => setSeverity(e.target.value)} className="rounded-lg border border-gray-300 px-3 py-1.5">
          {SEVERITIES.map((s) => <option key={s || 'all'} value={s}>{s || 'all severity'}</option>)}
        </select>
        <select value={since} onChange={(e) => setSince(e.target.value)} className="rounded-lg border border-gray-300 px-3 py-1.5">
          {SINCE.map((s) => <option key={s} value={s}>last {s}</option>)}
        </select>
        <label className="flex items-center gap-2 text-gray-700">
          <input type="checkbox" checked={includeSilenced} onChange={(e) => setIncludeSilenced(e.target.checked)} />
          Include silenced
        </label>
        <button type="button" onClick={refresh} className="ml-auto rounded-lg border border-gray-300 px-3 py-1.5 hover:border-[var(--aci-primary,#0052CC)]">
          Refresh
        </button>
      </div>

      {error && <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
            <tr>
              <th className="px-4 py-2">Fingerprint</th>
              <th className="px-4 py-2">Stage</th>
              <th className="px-4 py-2">Severity</th>
              <th className="px-4 py-2">Sample message</th>
              <th className="px-4 py-2 text-right">Count</th>
              <th className="px-4 py-2">Last seen</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading && groups.length === 0 ? (
              <tr><td colSpan={7} className="px-4 py-6 text-center text-gray-400">Loading…</td></tr>
            ) : groups.length === 0 ? (
              <tr><td colSpan={7} className="px-4 py-6 text-center text-gray-400">No errors in the selected window.</td></tr>
            ) : (
              groups.map((g) => (
                <tr key={g.fingerprint} className={`hover:bg-gray-50 ${g.silenced_until ? 'opacity-60' : ''}`}>
                  <td className="px-4 py-3 font-mono text-xs">{g.fingerprint}</td>
                  <td className="px-4 py-3">{g.stage}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${SEVERITY_BADGE[g.severity] ?? 'bg-gray-100 text-gray-700'}`}>
                      {g.severity}
                    </span>
                  </td>
                  <td className="max-w-md truncate px-4 py-3 text-gray-700" title={g.sample_message}>
                    {g.sample_message}
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-gray-900">{g.count}</td>
                  <td className="px-4 py-3 text-gray-700">{fmtAgo(g.last_seen)}</td>
                  <td className="px-4 py-3 text-right">
                    {g.sessions.length > 0 && (
                      <Link
                        href={`/admin/copilot/sessions/${encodeURIComponent(g.sessions[0])}`}
                        className="mr-3 text-xs font-semibold text-[var(--aci-primary,#0052CC)] hover:underline"
                      >
                        Jump to session →
                      </Link>
                    )}
                    {g.silenced_until ? (
                      <button
                        type="button"
                        onClick={() => unsilence(g.fingerprint)}
                        className="rounded-full border border-gray-300 px-3 py-1 text-xs font-semibold text-gray-700 hover:border-emerald-300 hover:text-emerald-700"
                      >
                        Unsilence
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => silence(g.fingerprint, 24)}
                        className="rounded-full border border-gray-300 px-3 py-1 text-xs font-semibold text-gray-700 hover:border-amber-300 hover:text-amber-700"
                      >
                        Silence 24h
                      </button>
                    )}
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
