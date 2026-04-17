'use client';

import { useEffect, useState } from 'react';
import { Users, RefreshCw, Star, MessageSquare, Download } from 'lucide-react';
import { downloadCSV } from '@/lib/admin/csv';
import type { RepeatVisitorResponse } from '@/app/api/admin/analytics/repeat-visitors/route';

type SinceKey = '24h' | '7d' | '30d';

const RANGE_OPTIONS: Array<{ key: SinceKey; label: string }> = [
  { key: '24h', label: 'Last 24 hours' },
  { key: '7d', label: 'Last 7 days' },
  { key: '30d', label: 'Last 30 days' },
];

const fmtInt = (n: number) => n.toLocaleString();

function formatTimeAgo(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(ms / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function RepeatVisitorsPage() {
  const [since, setSince] = useState<SinceKey>('30d');
  const [data, setData] = useState<RepeatVisitorResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshCounter, setRefreshCounter] = useState(0);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/admin/analytics/repeat-visitors?since=${since}&minVisits=2`,
          { cache: 'no-store' },
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = (await res.json()) as RepeatVisitorResponse;
        if (!cancelled) setData(json);
      } catch {
        // empty state covers
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [since, refreshCounter]);

  const empty = data && data.total === 0;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
              <Users className="w-5 h-5 text-indigo-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Repeat Visitors</h1>
          </div>
          <p className="text-sm text-gray-500">
            Visitors who came back multiple times. Return visits are the
            strongest intent signal available — especially when combined
            with high engagement but no chat yet.
          </p>
        </div>
        <div className="flex items-center gap-1">
          {data && data.total > 0 && (
            <button
              type="button"
              onClick={() =>
                downloadCSV(
                  data.visitors.map((v) => ({
                    company: v.company,
                    industry: v.industry,
                    visits: v.totalSessions,
                    engagement: v.engagementScore,
                    first_seen: v.firstSeen,
                    last_seen: v.lastSeen,
                    first_source: v.firstSource,
                    chatted: v.hasChatted,
                  })),
                  `repeat-visitors-${since}`,
                )
              }
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
              aria-label="Export CSV"
            >
              <Download className="w-5 h-5" />
            </button>
          )}
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
      </div>

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

      {data && data.highlights.highValueUntapped > 0 && (
        <div className="mb-6 p-5 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
            <Star className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <div className="font-semibold text-amber-900 mb-1">
              {fmtInt(data.highlights.highValueUntapped)} high-value untapped visitor{data.highlights.highValueUntapped === 1 ? '' : 's'}
            </div>
            <div className="text-sm text-amber-800">
              Visited 3+ times with engagement score above 40, but never opened the chat.
              These are your warmest prospects who have not been engaged yet.
            </div>
          </div>
        </div>
      )}

      {!loading && empty && (
        <div className="p-12 bg-white rounded-2xl border border-gray-200 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No repeat visitors in this window</h3>
          <p className="text-sm text-gray-500 max-w-md mx-auto">
            Either the window is too short or visitor tracking (consent-gated)
            has not captured enough returning visitors yet.
          </p>
        </div>
      )}

      {data && !empty && (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-5 py-3 font-semibold text-gray-700">Visitor / Company</th>
                  <th className="text-right px-4 py-3 font-semibold text-gray-700">Visits</th>
                  <th className="text-right px-4 py-3 font-semibold text-gray-700">Engagement</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">Source</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">Status</th>
                  <th className="text-right px-5 py-3 font-semibold text-gray-700">Last seen</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data.visitors.map((v) => {
                  const isHighValue =
                    !v.isIsp &&
                    v.totalSessions >= 3 &&
                    (v.engagementScore ?? 0) >= 40 &&
                    !v.hasChatted;
                  return (
                    <tr
                      key={v.visitorId}
                      className={`hover:bg-gray-50 ${isHighValue ? 'bg-amber-50/40' : ''}`}
                    >
                      <td className="px-5 py-3">
                        <div className={`font-medium ${v.isIsp ? 'text-gray-400' : 'text-gray-900'}`}>
                          {v.isIsp ? (
                            <>
                              <span className="text-gray-400">{v.company}</span>
                              <span className="ml-1.5 inline-block px-1.5 py-0.5 text-[10px] font-semibold bg-gray-100 text-gray-500 rounded">ISP</span>
                            </>
                          ) : (
                            <>
                              {v.company || 'Unknown company'}
                              {isHighValue && (
                                <Star className="inline w-3.5 h-3.5 text-amber-500 ml-1.5 -mt-0.5" />
                              )}
                            </>
                          )}
                        </div>
                        <div className="text-xs text-gray-500">{v.isIsp ? '' : (v.industry || '')}</div>
                      </td>
                      <td className="text-right px-4 py-3 tabular-nums font-bold text-gray-900">
                        {v.totalSessions}
                      </td>
                      <td className="text-right px-4 py-3">
                        {v.engagementScore !== null ? (
                          <span
                            className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${
                              v.engagementScore >= 60
                                ? 'bg-emerald-100 text-emerald-700'
                                : v.engagementScore >= 30
                                  ? 'bg-amber-100 text-amber-700'
                                  : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            {v.engagementScore}
                          </span>
                        ) : (
                          <span className="text-gray-400">{'\u2014'}</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-xs text-gray-600">
                          {v.firstSource || 'direct'}
                          {v.lastSource && v.lastSource !== v.firstSource && (
                            <span className="text-gray-400"> / {v.lastSource}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {v.hasConverted ? (
                          <span className="inline-block px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
                            converted
                          </span>
                        ) : v.hasChatted ? (
                          <span className="inline-flex items-center gap-1 text-xs text-blue-600">
                            <MessageSquare className="w-3 h-3" /> chatted
                          </span>
                        ) : (
                          <span className="text-xs text-gray-400">no engagement</span>
                        )}
                      </td>
                      <td className="text-right px-5 py-3 text-xs text-gray-500">
                        {formatTimeAgo(v.lastSeen)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
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
