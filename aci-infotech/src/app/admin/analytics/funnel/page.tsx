'use client';

import { useEffect, useState } from 'react';
import { BarChart3, TrendingDown, RefreshCw, AlertTriangle, Info } from 'lucide-react';
import type { FunnelResponse, FunnelStage } from '@/app/api/admin/analytics/funnel/route';

type SinceKey = '24h' | '7d' | '30d';

const RANGE_OPTIONS: Array<{ key: SinceKey; label: string }> = [
  { key: '24h', label: 'Last 24 hours' },
  { key: '7d', label: 'Last 7 days' },
  { key: '30d', label: 'Last 30 days' },
];

function formatCount(n: number): string {
  return n.toLocaleString();
}

function formatPercent(r: number | null): string {
  if (r === null || !Number.isFinite(r)) return '—';
  return `${(r * 100).toFixed(1)}%`;
}

function stageWidthPercent(stage: FunnelStage): number {
  // Bar width is conversionFromTop so the visual proportion matches the
  // math. The top stage is fixed at 100%.
  if (stage.conversionFromTop === null) return 100;
  return Math.max(4, stage.conversionFromTop * 100);
}

export default function ConversionFunnelPage() {
  const [since, setSince] = useState<SinceKey>('7d');
  const [data, setData] = useState<FunnelResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshCounter, setRefreshCounter] = useState(0);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/admin/analytics/funnel?since=${since}`, {
          cache: 'no-store',
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = (await res.json()) as FunnelResponse;
        if (!cancelled) setData(json);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load funnel');
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

  const topStageEmpty = data && data.stages[0].count === 0;
  const allStagesEmpty = data && data.stages.every((s) => s.count === 0);

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Conversion Funnel</h1>
          </div>
          <p className="text-sm text-gray-500">
            How visitors move from arrival to qualified lead. Each stage shows
            the count, the conversion rate from the previous stage, and the
            overall conversion from the top.
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

      {/* Time range selector */}
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
          Failed to load funnel: {error}
        </div>
      )}

      {/* Coverage warning */}
      {data?.insight.coverageWarning && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-amber-900">
            <div className="font-medium mb-1">Tracking coverage note</div>
            <div className="text-amber-800">{data.insight.coverageWarning}</div>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!loading && allStagesEmpty && (
        <div className="p-12 bg-white rounded-2xl border border-gray-200 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <BarChart3 className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No activity in this window</h3>
          <p className="text-sm text-gray-500 max-w-md mx-auto">
            Either nothing happened in the selected time range, or the
            tracking pipeline is not firing. Confirm NEXT_PUBLIC_COPILOT_V2 is
            set and that the visitor-tracking script is loading.
          </p>
        </div>
      )}

      {/* Funnel — only render when we have data and top isn't zero */}
      {data && !allStagesEmpty && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
          <div className="space-y-3">
            {data.stages.map((stage, i) => (
              <FunnelRow
                key={stage.key}
                stage={stage}
                isTop={i === 0}
                topCount={data.stages[0].count}
              />
            ))}
          </div>
        </div>
      )}

      {/* Top-stage-zero edge case: stages below may have counts but we can't
          compute conversionFromTop. Call this out explicitly. */}
      {!loading && topStageEmpty && !allStagesEmpty && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-900">
            <div className="font-medium mb-1">Top stage is zero</div>
            <div className="text-blue-800">
              No tracked visitors in this window, but downstream stages have
              activity. Overall conversion rates cannot be computed until
              visitor tracking is capturing the top of funnel reliably.
            </div>
          </div>
        </div>
      )}

      {/* Biggest drop-off insight */}
      {data?.insight.biggestDropoff && !allStagesEmpty && (
        <div className="bg-white rounded-2xl border border-gray-200 p-5 flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center flex-shrink-0">
            <TrendingDown className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <div className="font-semibold text-gray-900 mb-1">Biggest drop-off</div>
            <div className="text-sm text-gray-600">
              <span className="font-medium text-gray-900">
                {data.insight.biggestDropoff.fromStage}
              </span>{' '}
              →{' '}
              <span className="font-medium text-gray-900">
                {data.insight.biggestDropoff.toStage}
              </span>
              . {formatPercent(data.insight.biggestDropoff.dropRate)} of the
              previous stage does not progress. Often the highest-leverage
              place to work on copy, UX, or qualification choreography.
            </div>
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

function FunnelRow({
  stage,
  isTop,
  topCount,
}: {
  stage: FunnelStage;
  isTop: boolean;
  topCount: number;
}) {
  const widthPct = stageWidthPercent(stage);
  // Color ramp: top is deep blue, bottom is lime. Gives an intuitive
  // "funnel narrowing" feel without relying on a chart library.
  const ramp = [
    'bg-blue-600',
    'bg-blue-500',
    'bg-sky-500',
    'bg-teal-500',
    'bg-emerald-500',
    'bg-lime-500',
  ];
  // Index the ramp by stage key so reordering doesn't shift colors.
  const KEY_INDEX: Record<string, number> = {
    visitors: 0,
    chat_opened: 1,
    engaged: 2,
    email_captured: 3,
    high_intent: 4,
    handoff: 5,
  };
  const colorClass = ramp[KEY_INDEX[stage.key] ?? 0];

  return (
    <div className="group">
      <div className="flex items-baseline justify-between mb-1.5">
        <div>
          <span className="text-sm font-semibold text-gray-900">{stage.label}</span>
          <span className="ml-2 text-sm text-gray-500">{formatCount(stage.count)}</span>
        </div>
        <div className="flex items-center gap-3 text-xs">
          {!isTop && (
            <>
              <span className="text-gray-400">
                from prev:{' '}
                <span className="font-medium text-gray-700">
                  {formatPercent(stage.conversionFromPrevious)}
                </span>
              </span>
              <span className="text-gray-400">
                of top:{' '}
                <span className="font-medium text-gray-700">
                  {formatPercent(stage.conversionFromTop)}
                </span>
              </span>
            </>
          )}
          {isTop && topCount > 0 && (
            <span className="text-gray-400">
              top of funnel (<span className="font-medium text-gray-700">100%</span>)
            </span>
          )}
        </div>
      </div>

      <div className="relative h-10 bg-gray-50 rounded-lg overflow-hidden">
        <div
          className={`h-full ${colorClass} transition-all duration-500 ease-out rounded-lg`}
          style={{ width: `${widthPct}%` }}
        />
      </div>

      <div className="mt-1 text-xs text-gray-400">{stage.description}</div>
    </div>
  );
}
