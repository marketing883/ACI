'use client';

import { useEffect, useState } from 'react';
import { useMemo } from 'react';
import {
  FileText,
  RefreshCw,
  Clock,
  MessageSquare,
  Mail,
  Eye,
  Search,
  ArrowUpDown,
  Download,
} from 'lucide-react';
import { downloadCSV } from '@/lib/admin/csv';
import type { ContentResponse } from '@/app/api/admin/analytics/content/route';

type SinceKey = '24h' | '7d' | '30d';
type SortKey = 'emailCaptures' | 'chatOpens' | 'views' | 'conversionRate' | 'chatOpenRate';

const RANGE_OPTIONS: Array<{ key: SinceKey; label: string }> = [
  { key: '24h', label: 'Last 24 hours' },
  { key: '7d', label: 'Last 7 days' },
  { key: '30d', label: 'Last 30 days' },
];

const fmtInt = (n: number) => n.toLocaleString();
const fmtPct = (r: number | null) =>
  r === null || !Number.isFinite(r) ? '\u2014' : `${(r * 100).toFixed(1)}%`;

export default function ContentPerformancePage() {
  const [since, setSince] = useState<SinceKey>('7d');
  const [data, setData] = useState<ContentResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshCounter, setRefreshCounter] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortKey>('emailCaptures');
  const [sortAsc, setSortAsc] = useState(false);

  const filteredAndSorted = useMemo(() => {
    if (!data) return [];
    let rows = data.pages;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      rows = rows.filter((r) => r.pagePath.toLowerCase().includes(q));
    }
    return rows.slice().sort((a, b) => {
      const valA = a[sortBy] ?? -Infinity;
      const valB = b[sortBy] ?? -Infinity;
      return sortAsc
        ? (valA as number) - (valB as number)
        : (valB as number) - (valA as number);
    });
  }, [data, searchQuery, sortBy, sortAsc]);

  const toggleSort = (key: SortKey) => {
    if (sortBy === key) {
      setSortAsc((prev) => !prev);
    } else {
      setSortBy(key);
      setSortAsc(false);
    }
  };

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `/api/admin/analytics/content?since=${since}`,
          { cache: 'no-store' },
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = (await res.json()) as ContentResponse;
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

  const empty = data && data.pages.length === 0;

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center">
              <FileText className="w-5 h-5 text-teal-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              Content Performance
            </h1>
          </div>
          <p className="text-sm text-gray-500">
            Which pages drive chat engagement and email capture. Ranked by
            conversions so the best-performing content is at the top.
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
        {data && data.pages.length > 0 && (
          <button
            type="button"
            onClick={() =>
              downloadCSV(
                filteredAndSorted.map((r) => ({
                  page: r.pagePath,
                  views: r.views,
                  chat_opens: r.chatOpens,
                  open_rate: r.chatOpenRate,
                  email_captures: r.emailCaptures,
                  conversion_rate: r.conversionRate,
                })),
                `content-perf-${since}`,
              )
            }
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
            aria-label="Export CSV"
          >
            <Download className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Time range */}
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

      {/* Summary cards */}
      {data && !empty && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard
            icon={<Eye className="w-5 h-5 text-blue-600" />}
            bg="bg-blue-50"
            label="Total page views"
            value={fmtInt(data.totalViews)}
          />
          <StatCard
            icon={<MessageSquare className="w-5 h-5 text-indigo-600" />}
            bg="bg-indigo-50"
            label="Chat opens"
            value={fmtInt(data.totalChatOpens)}
          />
          <StatCard
            icon={<Mail className="w-5 h-5 text-emerald-600" />}
            bg="bg-emerald-50"
            label="Email captures"
            value={fmtInt(data.totalEmailCaptures)}
          />
          <StatCard
            icon={<Clock className="w-5 h-5 text-amber-600" />}
            bg="bg-amber-50"
            label="Time to qualify (avg / p50 / p95)"
            value={
              data.avgTimeToQualifyMinutes !== null
                ? `${data.avgTimeToQualifyMinutes}m / ${data.p50TimeToQualifyMinutes ?? '\u2014'}m / ${data.p95TimeToQualifyMinutes ?? '\u2014'}m`
                : '\u2014'
            }
          />
        </div>
      )}

      {/* Empty state */}
      {!loading && empty && (
        <div className="p-12 bg-white rounded-2xl border border-gray-200 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No content data in this window
          </h3>
          <p className="text-sm text-gray-500 max-w-md mx-auto">
            Content performance requires page-view tracking (consent-gated)
            and at least one chat session to have started. Check the
            Conversion Funnel to verify the tracking pipeline is live.
          </p>
        </div>
      )}

      {/* Search bar + page table */}
      {data && !empty && (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          {/* Search */}
          <div className="px-5 py-3 border-b border-gray-100">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Filter pages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-5 py-3 font-semibold text-gray-700">
                    Page
                  </th>
                  <SortableHeader label="Views" sortKey="views" currentSort={sortBy} asc={sortAsc} onSort={toggleSort} />
                  <SortableHeader label="Chat opens" sortKey="chatOpens" currentSort={sortBy} asc={sortAsc} onSort={toggleSort} />
                  <SortableHeader label="Open rate" sortKey="chatOpenRate" currentSort={sortBy} asc={sortAsc} onSort={toggleSort} />
                  <SortableHeader label="Emails" sortKey="emailCaptures" currentSort={sortBy} asc={sortAsc} onSort={toggleSort} />
                  <SortableHeader label="Conversion" sortKey="conversionRate" currentSort={sortBy} asc={sortAsc} onSort={toggleSort} />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredAndSorted.map((row) => (
                  <tr
                    key={row.pagePath}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-5 py-3">
                      <span className="font-mono text-xs text-gray-600 break-all">
                        {row.pagePath}
                      </span>
                    </td>
                    <td className="text-right px-4 py-3 tabular-nums text-gray-900">
                      {fmtInt(row.views)}
                    </td>
                    <td className="text-right px-4 py-3 tabular-nums text-gray-900">
                      {fmtInt(row.chatOpens)}
                    </td>
                    <td className="text-right px-4 py-3 tabular-nums text-gray-500">
                      {fmtPct(row.chatOpenRate)}
                    </td>
                    <td className="text-right px-4 py-3 tabular-nums text-gray-900 font-medium">
                      {fmtInt(row.emailCaptures)}
                    </td>
                    <td className="text-right px-5 py-3">
                      <ConversionBadge rate={row.conversionRate} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredAndSorted.length === 0 && searchQuery && (
            <div className="px-5 py-8 text-center text-sm text-gray-400">
              No pages matching &ldquo;{searchQuery}&rdquo;
            </div>
          )}
          {data.pages.length >= 50 && (
            <div className="px-5 py-3 bg-gray-50 text-xs text-gray-400 border-t border-gray-100">
              Showing top 50 pages by email captures.
            </div>
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

function StatCard({
  icon,
  bg,
  label,
  value,
}: {
  icon: React.ReactNode;
  bg: string;
  label: string;
  value: string;
}) {
  return (
    <div className={`rounded-2xl border border-gray-200 ${bg} p-5`}>
      <div className="flex items-center gap-2 mb-3">{icon}</div>
      <div className="text-2xl font-bold text-gray-900 mb-0.5">{value}</div>
      <div className="text-xs text-gray-500">{label}</div>
    </div>
  );
}

function ConversionBadge({ rate }: { rate: number | null }) {
  if (rate === null || !Number.isFinite(rate)) {
    return <span className="text-gray-400 text-xs">{'\u2014'}</span>;
  }
  const pct = rate * 100;
  let bg = 'bg-gray-100 text-gray-600';
  if (pct >= 30) bg = 'bg-emerald-100 text-emerald-700';
  else if (pct >= 10) bg = 'bg-amber-100 text-amber-700';
  return (
    <span
      className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${bg}`}
    >
      {pct.toFixed(1)}%
    </span>
  );
}

function SortableHeader({
  label,
  sortKey,
  currentSort,
  asc,
  onSort,
}: {
  label: string;
  sortKey: SortKey;
  currentSort: SortKey;
  asc: boolean;
  onSort: (key: SortKey) => void;
}) {
  const active = currentSort === sortKey;
  return (
    <th className="text-right px-4 py-3 whitespace-nowrap">
      <button
        type="button"
        onClick={() => onSort(sortKey)}
        className={`inline-flex items-center gap-1 text-xs font-semibold transition-colors ${
          active ? 'text-blue-700' : 'text-gray-700 hover:text-gray-900'
        }`}
      >
        {label}
        <ArrowUpDown
          className={`w-3 h-3 ${active ? 'text-blue-500' : 'text-gray-300'}`}
          style={active && asc ? { transform: 'scaleY(-1)' } : undefined}
        />
      </button>
    </th>
  );
}
