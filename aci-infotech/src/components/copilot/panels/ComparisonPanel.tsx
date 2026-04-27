'use client';

import PanelShell from './PanelShell';
import type { PanelProps } from './registry';

interface ComparisonPreset {
  title: string;
  rationale: string;
  columns: string[];
  rows: Array<{ label: string; values: string[] }>;
}

const PRESETS: Record<string, ComparisonPreset> = {
  'databricks-vs-snowflake': {
    title: 'Databricks vs Snowflake for a lakehouse',
    rationale:
      'Tradeoffs at a glance. Both are production-ready; pick by workload mix and existing stack.',
    columns: ['Dimension', 'Databricks', 'Snowflake'],
    rows: [
      {
        label: 'Workload sweet spot',
        values: ['Data engineering, ML, streaming', 'SQL analytics, BI, semi-structured'],
      },
      {
        label: 'Storage engine',
        values: ['Delta Lake on object store', 'Managed columnar, micro-partitions'],
      },
      {
        label: 'Governance',
        values: ['Unity Catalog', 'Horizon / Snowflake Native'],
      },
      {
        label: 'Developer mode',
        values: ['Notebooks + Spark, Python-first', 'SQL-first, Snowpark for code'],
      },
      {
        label: 'When we pick it',
        values: ['Large pipelines, MLOps, open formats', 'SQL-heavy analytics, fast onboarding'],
      },
    ],
  },
  'cdp-build-vs-buy': {
    title: 'CDP: build vs buy',
    rationale:
      'When to buy a platform and when to assemble from existing pieces.',
    columns: ['Dimension', 'Buy (Segment / mParticle / Braze)', 'Build on data warehouse'],
    rows: [
      { label: 'Time to first activation', values: ['Weeks', 'Months'] },
      { label: 'Identity resolution', values: ['Built-in graph', 'Custom rules on warehouse'] },
      { label: 'Data ownership', values: ['Vendor copy', 'First-party, stays with you'] },
      { label: 'Customization ceiling', values: ['Medium', 'High'] },
      { label: 'Best for', values: ['Fast-moving marketing orgs', 'Mature data teams'] },
    ],
  },
};

export default function ComparisonPanel({ entityRef, rationale }: PanelProps) {
  const preset = PRESETS[entityRef];
  if (!preset) {
    return (
      <PanelShell kicker="Comparison" title="Comparison not found">
        <p className="text-sm text-gray-600">
          I do not have a canonical comparison for {entityRef}. Ask about
          &ldquo;Databricks vs Snowflake&rdquo; or &ldquo;CDP build vs buy&rdquo;.
        </p>
      </PanelShell>
    );
  }
  return (
    <PanelShell
      kicker="Comparison"
      title={preset.title}
      rationale={rationale ?? preset.rationale}
    >
      <div className="overflow-x-auto">
        <table className="w-full table-fixed border-collapse text-sm">
          <thead>
            <tr>
              {preset.columns.map((c, i) => (
                <th
                  key={c}
                  className={`border-b border-gray-200 py-2 text-left font-semibold ${
                    i === 0 ? 'text-gray-500' : 'text-gray-900'
                  }`}
                >
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {preset.rows.map((r) => (
              <tr key={r.label}>
                <td className="border-b border-gray-100 py-3 pr-4 align-top font-medium text-gray-500">
                  {r.label}
                </td>
                {r.values.map((v, i) => (
                  <td key={i} className="border-b border-gray-100 py-3 pr-4 align-top text-gray-800">
                    {v}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PanelShell>
  );
}
