'use client';

import { useState } from 'react';

export type SinceKey = '24h' | '7d' | '30d' | 'custom';

export interface DateRange {
  since: SinceKey;
  /** ISO string start — only set when since === 'custom'. */
  startDate?: string;
  /** ISO string end — only set when since === 'custom'. */
  endDate?: string;
}

const PRESET_OPTIONS: Array<{ key: SinceKey; label: string }> = [
  { key: '24h', label: '24 hours' },
  { key: '7d', label: '7 days' },
  { key: '30d', label: '30 days' },
  { key: 'custom', label: 'Custom' },
];

/**
 * Shared date-range selector for all analytics pages. Presets (24h, 7d,
 * 30d) plus a custom option that shows two date inputs. Calls onChange
 * whenever the range changes.
 */
export default function DateRangeSelector({
  value,
  onChange,
}: {
  value: DateRange;
  onChange: (range: DateRange) => void;
}) {
  const [customStart, setCustomStart] = useState(() => {
    if (value.startDate) return value.startDate.slice(0, 10);
    const d = new Date();
    d.setDate(d.getDate() - 7);
    return d.toISOString().slice(0, 10);
  });
  const [customEnd, setCustomEnd] = useState(() => {
    if (value.endDate) return value.endDate.slice(0, 10);
    return new Date().toISOString().slice(0, 10);
  });

  return (
    <div className="flex flex-wrap items-center gap-2">
      {PRESET_OPTIONS.map((opt) => (
        <button
          key={opt.key}
          type="button"
          onClick={() => {
            if (opt.key === 'custom') {
              onChange({
                since: 'custom',
                startDate: new Date(customStart).toISOString(),
                endDate: new Date(customEnd + 'T23:59:59').toISOString(),
              });
            } else {
              onChange({ since: opt.key });
            }
          }}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            value.since === opt.key
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          {opt.label}
        </button>
      ))}
      {value.since === 'custom' && (
        <div className="flex items-center gap-2 ml-2">
          <input
            type="date"
            value={customStart}
            onChange={(e) => {
              setCustomStart(e.target.value);
              onChange({
                since: 'custom',
                startDate: new Date(e.target.value).toISOString(),
                endDate: new Date(customEnd + 'T23:59:59').toISOString(),
              });
            }}
            className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span className="text-gray-400 text-sm">to</span>
          <input
            type="date"
            value={customEnd}
            onChange={(e) => {
              setCustomEnd(e.target.value);
              onChange({
                since: 'custom',
                startDate: new Date(customStart).toISOString(),
                endDate: new Date(e.target.value + 'T23:59:59').toISOString(),
              });
            }}
            className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      )}
    </div>
  );
}

/**
 * Build URL search params from a DateRange. APIs accept either
 * ?since=7d or ?startDate=ISO&endDate=ISO.
 */
export function dateRangeToParams(range: DateRange): URLSearchParams {
  const params = new URLSearchParams();
  if (range.since === 'custom' && range.startDate && range.endDate) {
    params.set('startDate', range.startDate);
    params.set('endDate', range.endDate);
  } else {
    params.set('since', range.since === 'custom' ? '7d' : range.since);
  }
  return params;
}
