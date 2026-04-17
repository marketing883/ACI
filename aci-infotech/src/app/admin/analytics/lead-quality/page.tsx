'use client';

import { useEffect, useState } from 'react';
import {
  Target,
  RefreshCw,
  TrendingUp,
  Thermometer,
  Hourglass,
  ArrowUpRight,
  ArrowDownRight,
  Building2,
  Briefcase,
  Download,
} from 'lucide-react';
import { downloadCSV } from '@/lib/admin/csv';
import type {
  LeadQualityResponse,
  CrossCutRow,
  HistogramBucket,
  Band,
} from '@/app/api/admin/analytics/lead-quality/route';

type SinceKey = '24h' | '7d' | '30d';

const RANGE_OPTIONS: Array<{ key: SinceKey; label: string }> = [
  { key: '24h', label: 'Last 24 hours' },
  { key: '7d', label: 'Last 7 days' },
  { key: '30d', label: 'Last 30 days' },
];

const formatInt = (n: number) => n.toLocaleString();
const formatPct = (r: number) => `${(r * 100).toFixed(1)}%`;

export default function LeadQualityPage() {
  const [since, setSince] = useState<SinceKey>('7d');
  const [data, setData] = useState<LeadQualityResponse | null>(null);
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
          `/api/admin/analytics/lead-quality?since=${since}`,
          { cache: 'no-store' },
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = (await res.json()) as LeadQualityResponse;
        if (!cancelled) setData(json);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [since, refreshCounter]);

  const empty = data && data.totalLeads === 0;

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
              <Target className="w-5 h-5 text-purple-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Lead Quality</h1>
          </div>
          <p className="text-sm text-gray-500">
            Score distribution across captured leads, plus cross-cuts by
            intent and decision role. Cold = score below 40, warm = 40 to 70,
            hot = above 70 — matches the LEAD TEMPERATURE band the chatbot
            gets in its system prompt.
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
        {data && data.leadsWithScore > 0 && (
          <button
            type="button"
            onClick={() => {
              const rows = [
                { band: 'cold', count: data.bands.cold.count, share: data.bands.cold.share, avgScore: data.bands.cold.avgScore, previousCount: data.bands.cold.previousCount, delta: data.bands.cold.delta },
                { band: 'warm', count: data.bands.warm.count, share: data.bands.warm.share, avgScore: data.bands.warm.avgScore, previousCount: data.bands.warm.previousCount, delta: data.bands.warm.delta },
                { band: 'hot', count: data.bands.hot.count, share: data.bands.hot.share, avgScore: data.bands.hot.avgScore, previousCount: data.bands.hot.previousCount, delta: data.bands.hot.delta },
              ];
              downloadCSV(rows, `lead-quality-${since}`);
            }}
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

      {/* Empty state */}
      {!loading && empty && (
        <div className="p-12 bg-white rounded-2xl border border-gray-200 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <Target className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No leads captured in this window
          </h3>
          <p className="text-sm text-gray-500 max-w-md mx-auto">
            Lead quality dashboards populate once qualify_lead has fired
            during a conversation. Check the Conversion Funnel to see where
            visitors are dropping off.
          </p>
        </div>
      )}

      {data && !empty && (
        <>
          {/* Pending intelligence callout (when many leads still lack scores) */}
          {data.pendingIntelligence > 0 && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-start gap-3">
              <Hourglass className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-900">
                <div className="font-medium mb-1">
                  {formatInt(data.pendingIntelligence)} of{' '}
                  {formatInt(data.totalLeads)} leads still pending intelligence
                </div>
                <div className="text-blue-800">
                  Lead scores are computed by generateIntelligence in the
                  background after a fresh email capture. Leads without a score
                  yet are excluded from the bands and histogram below.
                </div>
              </div>
            </div>
          )}

          {/* Band summary cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <BandCard
              label="Cold"
              hint="score < 40"
              band={data.bands.cold}
              total={data.leadsWithScore}
              accent="sky"
            />
            <BandCard
              label="Warm"
              hint="score 40 to 70"
              band={data.bands.warm}
              total={data.leadsWithScore}
              accent="amber"
            />
            <BandCard
              label="Hot"
              hint="score > 70"
              band={data.bands.hot}
              total={data.leadsWithScore}
              accent="rose"
            />
          </div>

          {/* Insight */}
          {data.insight.message && (
            <div className="mb-6 p-5 bg-white rounded-2xl border border-gray-200 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <div className="font-semibold text-gray-900 mb-1">Read</div>
                <div className="text-sm text-gray-600">{data.insight.message}</div>
              </div>
            </div>
          )}

          {/* Histogram */}
          <div className="mb-6 bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Thermometer className="w-5 h-5 text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-900">
                Score distribution
              </h2>
            </div>
            <Histogram buckets={data.histogram} />
          </div>

          {/* Cross-cuts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <CrossCutTable
              title="By intent"
              subtitle="Model's self-assessed confidence. Should correlate with AI score."
              rows={data.byIntent}
              emptyLabel="No leads have an intent signal yet."
            />
            <CrossCutTable
              title="By decision role"
              subtitle="Leading, scoping, researching, or unclear. Captured via qualify_lead.decisionRole."
              rows={data.byDecisionRole}
              emptyLabel="No decisionRole captures yet. Watch this once leads surface the signal."
            />
            <CrossCutTable
              title="By industry"
              icon={<Building2 className="w-4 h-4 text-gray-400" />}
              subtitle="Which industries produce the highest-quality leads?"
              rows={data.byIndustry}
              emptyLabel="No industry data captured yet."
            />
            <CrossCutTable
              title="By service interest"
              icon={<Briefcase className="w-4 h-4 text-gray-400" />}
              subtitle="Which services attract the strongest leads?"
              rows={data.byServiceInterest}
              emptyLabel="No service interest captured yet."
            />
          </div>
        </>
      )}

      {data && !loading && (
        <div className="mt-4 text-xs text-gray-400 text-right">
          Generated {new Date(data.generatedAt).toLocaleString()}
        </div>
      )}
    </div>
  );
}

function BandCard({
  label,
  hint,
  band,
  total,
  accent,
}: {
  label: string;
  hint: string;
  band: Band;
  total: number;
  accent: 'sky' | 'amber' | 'rose';
}) {
  const accents: Record<typeof accent, { bg: string; dot: string; text: string }> = {
    sky: { bg: 'bg-sky-50', dot: 'bg-sky-500', text: 'text-sky-700' },
    amber: { bg: 'bg-amber-50', dot: 'bg-amber-500', text: 'text-amber-700' },
    rose: { bg: 'bg-rose-50', dot: 'bg-rose-500', text: 'text-rose-700' },
  };
  const a = accents[accent];
  return (
    <div className={`rounded-2xl border border-gray-200 ${a.bg} p-5`}>
      <div className="flex items-center gap-2 mb-3">
        <span className={`w-2 h-2 rounded-full ${a.dot}`} />
        <span className={`text-sm font-semibold ${a.text}`}>{label}</span>
        <span className="text-xs text-gray-500">{hint}</span>
      </div>
      <div className="flex items-center gap-2 mb-1">
        <span className="text-3xl font-bold text-gray-900">{formatInt(band.count)}</span>
        {band.delta !== null && band.delta !== 0 && (
          <span
            className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[11px] font-semibold ${
              band.delta > 0
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-red-100 text-red-700'
            }`}
          >
            {band.delta > 0 ? (
              <ArrowUpRight className="w-3 h-3" />
            ) : (
              <ArrowDownRight className="w-3 h-3" />
            )}
            {band.deltaPercent !== null && Number.isFinite(band.deltaPercent)
              ? `${Math.abs(band.deltaPercent * 100).toFixed(0)}%`
              : formatInt(Math.abs(band.delta))}
          </span>
        )}
      </div>
      <div className="text-sm text-gray-500">
        {total > 0 ? formatPct(band.share) : '\u2014'} of scored
        {band.avgScore !== null && (
          <span className="ml-2 text-gray-400">
            · avg score{' '}
            <span className="text-gray-700 font-medium">{band.avgScore}</span>
          </span>
        )}
      </div>
    </div>
  );
}

function Histogram({ buckets }: { buckets: HistogramBucket[] }) {
  const max = Math.max(1, ...buckets.map((b) => b.count));
  return (
    <div className="flex items-end gap-2 h-48">
      {buckets.map((b) => {
        const heightPct = (b.count / max) * 100;
        // Color ramp mirrors the funnel: cold -> hot.
        const color =
          b.to < 40
            ? 'bg-sky-400'
            : b.from > 70
              ? 'bg-rose-400'
              : 'bg-amber-400';
        return (
          <div key={b.bucket} className="flex-1 flex flex-col items-center gap-2">
            <div className="flex-1 w-full flex items-end">
              <div
                className={`w-full ${color} rounded-t-md transition-all duration-500`}
                style={{ height: b.count === 0 ? '2px' : `${Math.max(4, heightPct)}%` }}
                title={`${b.count} lead${b.count === 1 ? '' : 's'}`}
              />
            </div>
            <div className="text-[10px] font-mono text-gray-400">{b.bucket}</div>
            <div className="text-xs font-medium text-gray-700">{b.count}</div>
          </div>
        );
      })}
    </div>
  );
}

function CrossCutTable({
  title,
  subtitle,
  rows,
  emptyLabel,
  icon,
}: {
  title: string;
  subtitle: string;
  rows: CrossCutRow[];
  emptyLabel: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5">
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-1">
          {icon}
          <h2 className="text-base font-semibold text-gray-900">{title}</h2>
        </div>
        <p className="text-xs text-gray-500">{subtitle}</p>
      </div>
      {rows.length === 0 ? (
        <div className="text-sm text-gray-400 italic py-6 text-center">
          {emptyLabel}
        </div>
      ) : (
        <div className="space-y-3">
          {rows.map((row) => (
            <div key={row.key} className="flex items-center gap-4">
              <div className="w-40 flex-shrink-0">
                <div className="text-sm font-medium text-gray-900">{row.label}</div>
                <div className="text-xs text-gray-400">
                  {formatInt(row.count)} lead{row.count === 1 ? '' : 's'}
                  {row.avgScore !== null && ` · avg ${row.avgScore}`}
                </div>
              </div>
              <BandSplitBar cold={row.cold} warm={row.warm} hot={row.hot} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function BandSplitBar({
  cold,
  warm,
  hot,
}: {
  cold: number;
  warm: number;
  hot: number;
}) {
  const total = cold + warm + hot;
  if (total === 0) {
    return (
      <div className="flex-1 h-6 bg-gray-50 rounded-md flex items-center justify-center text-xs text-gray-400">
        no scored leads
      </div>
    );
  }
  const segs = [
    { n: cold, className: 'bg-sky-400' },
    { n: warm, className: 'bg-amber-400' },
    { n: hot, className: 'bg-rose-400' },
  ];
  return (
    <div className="flex-1 flex h-6 rounded-md overflow-hidden bg-gray-50">
      {segs.map((s, i) =>
        s.n === 0 ? null : (
          <div
            key={i}
            className={`${s.className} flex items-center justify-center text-[10px] font-semibold text-white`}
            style={{ width: `${(s.n / total) * 100}%` }}
            title={`${s.n}`}
          >
            {s.n >= Math.max(1, total * 0.08) ? s.n : ''}
          </div>
        ),
      )}
    </div>
  );
}
