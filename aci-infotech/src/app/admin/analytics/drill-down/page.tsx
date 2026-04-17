'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, User, MessageSquare } from 'lucide-react';
import type {
  DrillDownResponse,
  DrillDownLead,
  DrillDownSession,
} from '@/app/api/admin/analytics/drill-down/route';

const fmtInt = (n: number) => n.toLocaleString();

function formatTimeAgo(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(ms / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function DrillDownPage() {
  const searchParams = useSearchParams();
  const type = searchParams.get('type') ?? 'leads';
  const since = searchParams.get('since') ?? '7d';
  const [data, setData] = useState<DrillDownResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      const params = new URLSearchParams(searchParams.toString());
      try {
        const res = await fetch(
          `/api/admin/analytics/drill-down?${params.toString()}`,
          { cache: 'no-store' },
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = (await res.json()) as DrillDownResponse;
        if (!cancelled) setData(json);
      } catch {
        // silently handle — empty state covers
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [searchParams]);

  const title =
    type === 'leads'
      ? `Leads: ${searchParams.get('band') ?? searchParams.get('intent') ?? searchParams.get('role') ?? 'all'}`
      : `Sessions: ${searchParams.get('stage') ?? 'all'}`;

  const backHref =
    type === 'leads'
      ? '/admin/analytics/lead-quality'
      : '/admin/analytics/funnel';

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Link
          href={backHref}
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-gray-900">{title}</h1>
          <p className="text-xs text-gray-500">
            {data ? `${fmtInt(data.total)} results` : 'Loading...'} · last {since}
          </p>
        </div>
      </div>

      {!loading && data?.total === 0 && (
        <div className="p-12 bg-white rounded-2xl border border-gray-200 text-center">
          <p className="text-sm text-gray-500">
            No matching {type} found in the selected window.
          </p>
        </div>
      )}

      {data?.leads && data.leads.length > 0 && (
        <LeadsTable leads={data.leads} />
      )}

      {data?.sessions && data.sessions.length > 0 && (
        <SessionsTable sessions={data.sessions} />
      )}
    </div>
  );
}

function LeadsTable({ leads }: { leads: DrillDownLead[] }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left px-4 py-3 font-semibold text-gray-700">Contact</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-700">Company</th>
              <th className="text-right px-4 py-3 font-semibold text-gray-700">Score</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-700">Intent</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-700">Role</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-700">Pain point</th>
              <th className="text-right px-4 py-3 font-semibold text-gray-700">When</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {leads.map((lead) => (
              <tr key={lead.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-3.5 h-3.5 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 text-sm">{lead.name || '\u2014'}</div>
                      <div className="text-xs text-gray-500">{lead.email || 'no email'}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-sm text-gray-900">{lead.company || '\u2014'}</div>
                  <div className="text-xs text-gray-500">{lead.industry || ''}</div>
                </td>
                <td className="text-right px-4 py-3">
                  {lead.lead_score !== null ? (
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-xs font-bold ${
                        lead.lead_score > 70
                          ? 'bg-rose-100 text-rose-700'
                          : lead.lead_score >= 40
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-sky-100 text-sky-700'
                      }`}
                    >
                      {lead.lead_score}
                    </span>
                  ) : (
                    <span className="text-gray-400">\u2014</span>
                  )}
                </td>
                <td className="px-4 py-3 text-xs text-gray-600">{lead.intent || '\u2014'}</td>
                <td className="px-4 py-3 text-xs text-gray-600">{lead.decision_role || '\u2014'}</td>
                <td className="px-4 py-3">
                  {lead.pain_point_category ? (
                    <div>
                      <div className="text-xs font-medium text-orange-700 bg-orange-50 px-2 py-0.5 rounded inline-block">{lead.pain_point_category}</div>
                    </div>
                  ) : lead.pain_point ? (
                    <div className="text-xs text-gray-500 italic truncate max-w-[200px]">{lead.pain_point}</div>
                  ) : (
                    <span className="text-gray-400 text-xs">\u2014</span>
                  )}
                </td>
                <td className="text-right px-4 py-3 text-xs text-gray-500">{formatTimeAgo(lead.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SessionsTable({ sessions }: { sessions: DrillDownSession[] }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left px-4 py-3 font-semibold text-gray-700">Session</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-700">Entry page</th>
              <th className="text-right px-4 py-3 font-semibold text-gray-700">Messages</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-700">Handoff</th>
              <th className="text-right px-4 py-3 font-semibold text-gray-700">Started</th>
              <th className="text-right px-4 py-3 font-semibold text-gray-700"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {sessions.map((s) => (
              <tr key={s.session_id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-gray-400" />
                    <span className="font-mono text-xs text-gray-700 truncate max-w-[160px]">
                      {s.session_id}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="font-mono text-xs text-gray-600">{s.page_entry || '/'}</span>
                </td>
                <td className="text-right px-4 py-3 tabular-nums text-gray-900">
                  {s.message_count > 0 ? fmtInt(s.message_count) : '\u2014'}
                </td>
                <td className="px-4 py-3 text-xs">
                  {s.handoff_at ? (
                    <span className="text-red-600 font-medium">
                      {s.handoff_reason || 'handed off'}
                    </span>
                  ) : (
                    <span className="text-gray-400">\u2014</span>
                  )}
                </td>
                <td className="text-right px-4 py-3 text-xs text-gray-500">
                  {formatTimeAgo(s.started_at)}
                </td>
                <td className="text-right px-4 py-3">
                  <Link
                    href={`/admin/copilot/sessions/${s.session_id}`}
                    className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800"
                  >
                    View <ExternalLink className="w-3 h-3" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
