'use client';

/**
 * Atheros per-session replay.
 *
 * Two columns. Left: chronological transcript with thoughts, status
 * narrations, tool calls, and inline panel/chip/field reproductions.
 * Right: lead intelligence, session metadata, errors. Refreshes via
 * the Realtime channel so live sessions update as the user types.
 */

import { useCallback, useEffect, useMemo, useState, use as usePromise } from 'react';
import Link from 'next/link';
import { subscribeAdminLive } from '@/lib/copilot/realtime';

interface MessageRow {
  message_id: string;
  session_id: string;
  role: 'user' | 'assistant' | 'tool' | 'admin' | 'system';
  content: string | null;
  tool_name: string | null;
  tool_args: unknown;
  tool_result: unknown;
  model: string | null;
  input_tokens: number | null;
  output_tokens: number | null;
  latency_ms: number | null;
  cost_usd: string | number | null;
  thoughts: string[] | null;
  status_events: Array<{ at: number; text: string }> | null;
  stream_incomplete: boolean | null;
  created_at: string;
}

interface SessionDetail {
  ok: boolean;
  session: Record<string, unknown> | null;
  messages: MessageRow[];
  lead: Record<string, unknown> | null;
  errors: Array<Record<string, unknown>>;
}

function fmtCost(c: MessageRow['cost_usd']) {
  const n = typeof c === 'string' ? Number.parseFloat(c) : c ?? 0;
  if (!Number.isFinite(n) || n === 0) return '—';
  if (n < 0.01) return `$${n.toFixed(5)}`;
  if (n < 1) return `$${n.toFixed(3)}`;
  return `$${n.toFixed(2)}`;
}

function fmtJson(v: unknown): string {
  if (v === null || v === undefined) return '';
  try {
    return JSON.stringify(v, null, 2);
  } catch {
    return String(v);
  }
}

export default function AtherosSessionReplay({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = usePromise(params);
  const [data, setData] = useState<SessionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDetail = useCallback(async () => {
    setError(null);
    try {
      const res = await fetch(`/api/admin/copilot/sessions/${encodeURIComponent(id)}`, {
        cache: 'no-store',
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        setError(json.reason ?? `HTTP ${res.status}`);
        return;
      }
      setData(json as SessionDetail);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  // Live updates while watching a running session.
  useEffect(() => {
    const off = subscribeAdminLive({
      onMessageInsert: (row) => {
        if ((row as { session_id?: string }).session_id === id) fetchDetail();
      },
      onSessionUpsert: (row) => {
        if ((row as { session_id?: string }).session_id === id) fetchDetail();
      },
    });
    return off;
  }, [id, fetchDetail]);

  const intelligence = useMemo<Record<string, unknown> | null>(() => {
    const lead = data?.lead;
    if (!lead) return null;
    const intel = (lead as { intelligence?: unknown }).intelligence;
    if (!intel || typeof intel !== 'object') return null;
    return intel as Record<string, unknown>;
  }, [data]);

  return (
    <div className="grid h-[calc(100vh-4rem)] grid-cols-[minmax(0,1fr)_minmax(0,420px)] gap-0 overflow-hidden">
      <section className="flex min-h-0 flex-col border-r border-gray-200 bg-white">
        <header className="border-b border-gray-200 px-6 py-4">
          <div className="flex items-baseline justify-between gap-4">
            <div>
              <Link
                href="/admin/copilot/live"
                className="text-xs text-[var(--aci-primary,#0052CC)] hover:underline"
              >
                ← All conversations
              </Link>
              <h1 className="mt-1 text-lg font-bold text-gray-900">
                Session {id.slice(0, 12)}…
              </h1>
            </div>
            <button
              type="button"
              onClick={fetchDetail}
              className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm hover:border-[var(--aci-primary,#0052CC)]"
            >
              Refresh
            </button>
          </div>
        </header>
        {data?.session && (data.session as Record<string, unknown>).admin_claimed_by ? (
          <RelayComposer sessionId={id} onSent={fetchDetail} />
        ) : null}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {loading && !data ? (
            <div className="text-center text-gray-400">Loading…</div>
          ) : error ? (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          ) : (data?.messages ?? []).length === 0 ? (
            <div className="text-center text-gray-400">No messages yet.</div>
          ) : (
            <ol className="space-y-4">
              {data!.messages.map((m) => (
                <Bubble key={m.message_id} m={m} />
              ))}
            </ol>
          )}
        </div>
      </section>

      <aside className="flex min-h-0 flex-col bg-gray-50">
        <div className="border-b border-gray-200 px-5 py-4">
          <div className="text-xs uppercase tracking-wide text-gray-500">Lead</div>
          {data?.lead ? (
            <LeadCard lead={data.lead} />
          ) : (
            <div className="mt-1 text-sm text-gray-400">No lead captured yet.</div>
          )}
        </div>
        <div className="border-b border-gray-200 px-5 py-4">
          <div className="text-xs uppercase tracking-wide text-gray-500">Session</div>
          {data?.session ? (
            <SessionMeta session={data.session} />
          ) : (
            <div className="mt-1 text-sm text-gray-400">No session metadata.</div>
          )}
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4">
          <div className="text-xs uppercase tracking-wide text-gray-500">Intelligence</div>
          {intelligence ? (
            <IntelligenceCard intel={intelligence} />
          ) : (
            <div className="mt-2 text-sm text-gray-400">
              Intelligence runs in the background once an email is captured. It will appear here automatically.
            </div>
          )}

          {data?.errors && data.errors.length > 0 && (
            <>
              <div className="mt-6 text-xs uppercase tracking-wide text-gray-500">
                Errors ({data.errors.length})
              </div>
              <ul className="mt-2 space-y-2">
                {data.errors.map((e, i) => (
                  <li key={i} className="rounded-lg border border-amber-200 bg-amber-50 p-2 text-xs">
                    <div className="font-semibold text-amber-800">
                      {(e.severity as string) ?? 'error'} · {(e.stage as string) ?? '—'}
                    </div>
                    <div className="mt-1 text-amber-900">{(e.message as string) ?? '—'}</div>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </aside>
    </div>
  );
}

function RelayComposer({ sessionId, onSent }: { sessionId: string; onSent: () => void }) {
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        if (!text.trim() || busy) return;
        setBusy(true);
        setErr(null);
        try {
          const res = await fetch('/api/admin/copilot/takeover', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sessionId, content: text.trim() }),
          });
          const json = await res.json();
          if (!res.ok || !json.ok) {
            setErr(json.reason ?? `HTTP ${res.status}`);
            return;
          }
          setText('');
          onSent();
        } finally {
          setBusy(false);
        }
      }}
      className="flex items-end gap-2 border-b border-amber-200 bg-amber-50 px-6 py-3"
    >
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={1}
        placeholder="You are in relay mode. Type a message to the visitor."
        className="flex-1 resize-none rounded-lg border border-amber-300 bg-white px-3 py-2 text-sm focus:border-amber-500 focus:outline-none"
      />
      <button
        type="submit"
        disabled={!text.trim() || busy}
        className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-700 disabled:opacity-50"
      >
        {busy ? 'Sending…' : 'Send'}
      </button>
      {err && <span className="ml-2 text-xs text-red-700">{err}</span>}
    </form>
  );
}

function Bubble({ m }: { m: MessageRow }) {
  if (m.role === 'tool') {
    return (
      <li className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-3 text-xs text-gray-700">
        <div className="font-semibold uppercase tracking-wide text-gray-500">
          tool · {m.tool_name ?? '?'}
        </div>
        {m.tool_args ? (
          <pre className="mt-2 overflow-x-auto whitespace-pre-wrap break-words font-mono text-[11px] text-gray-700">
            {fmtJson(m.tool_args)}
          </pre>
        ) : null}
      </li>
    );
  }
  return (
    <li className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
      <div className="max-w-[80%] space-y-1">
        {m.thoughts && m.thoughts.length > 0 && (
          <div className="text-[11px] italic text-gray-500">
            ~ {m.thoughts.join(' · ')}
          </div>
        )}
        <div
          className={`rounded-2xl px-3.5 py-2 text-sm leading-relaxed ${
            m.role === 'user'
              ? 'bg-[var(--aci-primary,#0052CC)] text-white'
              : m.role === 'admin'
                ? 'bg-amber-100 text-amber-900'
                : 'bg-gray-100 text-gray-900'
          }`}
        >
          {m.content}
        </div>
        {(m.model || m.cost_usd != null) && m.role === 'assistant' && (
          <div className="text-[10px] uppercase tracking-wider text-gray-400">
            {m.model ?? ''} {m.latency_ms != null ? `· ${m.latency_ms}ms` : ''} · {fmtCost(m.cost_usd)}
            {m.stream_incomplete ? ' · incomplete' : ''}
          </div>
        )}
      </div>
    </li>
  );
}

function LeadCard({ lead }: { lead: Record<string, unknown> }) {
  const allFields: Array<[string, string]> = [
    ['Name', (lead.name as string) ?? ''],
    ['Email', (lead.email as string) ?? ''],
    ['Company', (lead.company as string) ?? ''],
    ['Website', (lead.website as string) ?? ''],
    ['Phone', (lead.phone as string) ?? ''],
    ['Title', (lead.job_title as string) ?? ''],
    ['Service', (lead.service_interest as string) ?? ''],
    ['Budget', (lead.budget as string) ?? ''],
    ['Urgency', (lead.priority as string) ?? ''],
    ['Intent', (lead.intent as string) ?? ''],
    ['Score', String(lead.lead_score ?? '')],
    ['Status', (lead.status as string) ?? ''],
  ];
  const fields = allFields.filter(([, v]) => v && v.length > 0);
  return (
    <dl className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
      {fields.map(([k, v]) => (
        <span key={k} className="contents">
          <dt className="text-gray-500">{k}</dt>
          <dd className="text-gray-900">{v}</dd>
        </span>
      ))}
    </dl>
  );
}

function SessionMeta({ session }: { session: Record<string, unknown> }) {
  const rows: Array<[string, string]> = [
    ['Started', formatTs(session.started_at as string | null)],
    ['Last activity', formatTs(session.last_message_at as string | null)],
    ['Page entered', (session.page_entry as string) ?? '—'],
    ['Messages', String(session.message_count ?? 0)],
    ['Tokens', `${session.total_input_tokens ?? 0} in / ${session.total_output_tokens ?? 0} out`],
    ['Cost', fmtCost(session.total_cost_usd as string | number | null)],
    ['Handoff', session.handoff_at ? `${(session.handoff_reason as string) ?? 'requested'}` : '—'],
  ];
  return (
    <dl className="mt-2 grid grid-cols-[120px_1fr] gap-x-3 gap-y-1 text-sm">
      {rows.map(([k, v]) => (
        <span key={k} className="contents">
          <dt className="text-gray-500">{k}</dt>
          <dd className="text-gray-900">{v}</dd>
        </span>
      ))}
    </dl>
  );
}

function formatTs(iso: string | null): string {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

function IntelligenceCard({ intel }: { intel: Record<string, unknown> }) {
  const score = (intel.leadScore as number | undefined) ?? null;
  const person = intel.person as Record<string, unknown> | undefined;
  const company = intel.company as Record<string, unknown> | undefined;
  const opportunity = intel.opportunity as Record<string, unknown> | undefined;
  const engagement = intel.engagement as Record<string, unknown> | undefined;
  const signals = intel.signals as Record<string, unknown> | undefined;
  return (
    <div className="mt-2 space-y-3 text-sm">
      {score != null && (
        <div className="flex items-center gap-2">
          <span className="text-xs uppercase tracking-wide text-gray-500">Score</span>
          <span className="rounded-full bg-[var(--aci-primary,#0052CC)]/10 px-2 py-0.5 text-sm font-bold text-[var(--aci-primary,#0052CC)]">
            {score}
          </span>
        </div>
      )}
      {person?.summary ? <Section label="Person" body={String(person.summary)} /> : null}
      {company?.summary ? <Section label="Company" body={String(company.summary)} /> : null}
      {opportunity?.painPoints && Array.isArray(opportunity.painPoints) ? (
        <Section
          label="Pain points"
          body={(opportunity.painPoints as unknown[]).join(' · ')}
        />
      ) : null}
      {engagement?.talkingPoints && Array.isArray(engagement.talkingPoints) ? (
        <Section
          label="Talking points"
          body={(engagement.talkingPoints as unknown[]).join(' · ')}
        />
      ) : null}
      {signals ? (
        <div className="grid grid-cols-2 gap-2 text-xs text-gray-700">
          {(['intent', 'urgency', 'budget', 'timeline'] as const).map((k) => (
            <div key={k} className="rounded-md border border-gray-200 bg-white p-2">
              <div className="uppercase tracking-wide text-gray-500">{k}</div>
              <div className="text-sm font-semibold text-gray-900">{String(signals[k] ?? '—')}</div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function Section({ label, body }: { label: string; body: string }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wide text-gray-500">{label}</div>
      <p className="mt-0.5 text-sm text-gray-800">{body}</p>
    </div>
  );
}
