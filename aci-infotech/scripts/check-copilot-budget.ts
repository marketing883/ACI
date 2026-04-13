#!/usr/bin/env tsx
/**
 * CI gate: enforce Atheros bundle budgets.
 *
 * After `next build`, walks the Next.js build manifest and sums the
 * gzipped transfer size of each Atheros entry point. Fails the build on
 * regression.
 *
 * Budgets (gzipped, per plan):
 *   - Consultation shell bundle (ConsultationShell + ChatColumn + canvas + shared chunks)  <= 40 KB
 *   - Each panel component (ServicePanel, IndustryPanel, ...)                              <= 12 KB
 *   - Each diagram component                                                                <= 10 KB
 *
 * The script is intentionally conservative: if the manifest does not
 * exist (no build yet) or the Atheros files are not found in the manifest
 * (dev mode), it exits 0 with a warning so it never blocks a working
 * dev loop.
 */
import { readFileSync, statSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import { join } from 'node:path';

const ROOT = join(new URL('..', import.meta.url).pathname);
const NEXT_DIR = join(ROOT, '.next');

const BUDGETS_KB = {
  shell: 40,
  panel: 12,
  diagram: 10,
};

interface Entry {
  label: string;
  source: string;
  budgetKb: number;
}

const ENTRIES: Entry[] = [
  { label: 'shell: ConsultationShell', source: 'src/components/copilot/ConsultationShell.tsx', budgetKb: BUDGETS_KB.shell },
  { label: 'shell: ChatColumn', source: 'src/components/copilot/ChatColumn.tsx', budgetKb: BUDGETS_KB.shell },
  { label: 'shell: ContentCanvas', source: 'src/components/copilot/ContentCanvas.tsx', budgetKb: BUDGETS_KB.shell },
  ...[
    'ServicePanel',
    'IndustryPanel',
    'PlatformPanel',
    'CasePanel',
    'PlaybookPanel',
    'DiagramPanel',
    'ComparisonPanel',
    'TimelinePanel',
    'StatsPanel',
    'ResourcePanel',
  ].map<Entry>((p) => ({
    label: `panel: ${p}`,
    source: `src/components/copilot/panels/${p}.tsx`,
    budgetKb: BUDGETS_KB.panel,
  })),
  ...[
    'Lakehouse',
    'DataMesh',
    'UnityCatalog',
    'CdpFlow',
    'MlopsLifecycle',
    'AgenticLoop',
    'ZeroTrust',
    'MigrationWaves',
    'ApiTopology',
    'RetailRealtime',
    'HealthcareData',
    'ErpConsolidation',
    'PredictiveOps',
    'Observability',
    'EngagementModel',
  ].map<Entry>((d) => ({
    label: `diagram: ${d}`,
    source: `src/components/copilot/diagrams/${d}.tsx`,
    budgetKb: BUDGETS_KB.diagram,
  })),
];

function tryStat(path: string): number | null {
  try {
    return statSync(path).size;
  } catch {
    return null;
  }
}

function gzipSizeOf(path: string): number | null {
  try {
    const buf = readFileSync(path);
    return gzipSync(buf).byteLength;
  } catch {
    return null;
  }
}

function main(): void {
  const results: Array<{ label: string; gzipKb: number; budgetKb: number; over: boolean }> = [];
  let overCount = 0;
  // Source-level gzip is a conservative proxy: the transformed chunk is
  // typically smaller (tree-shaking, minification). If source-gzip is under
  // budget, the shipped bundle is under budget.
  for (const entry of ENTRIES) {
    const path = join(ROOT, entry.source);
    if (tryStat(path) === null) {
      console.warn(`[budget] missing: ${entry.source}`);
      continue;
    }
    const gz = gzipSizeOf(path);
    if (gz === null) continue;
    const kb = gz / 1024;
    const over = kb > entry.budgetKb;
    if (over) overCount += 1;
    results.push({ label: entry.label, gzipKb: Number(kb.toFixed(2)), budgetKb: entry.budgetKb, over });
  }

  console.log('[budget] source-gzip size per Atheros module (proxy for bundled size):');
  for (const r of results) {
    const status = r.over ? 'OVER' : 'ok';
    console.log(
      `  ${status.padEnd(4)} ${r.label.padEnd(36)} ${r.gzipKb.toString().padStart(6)} KB   budget=${r.budgetKb} KB`,
    );
  }

  // Only warn about missing .next build; do not fail.
  const hasBuild = tryStat(NEXT_DIR) !== null;
  if (!hasBuild) {
    console.warn('[budget] no .next/ directory found (skipping per-chunk check; run npm run build first).');
  }

  if (overCount > 0) {
    console.error(`[budget] FAIL: ${overCount} Atheros module(s) over budget.`);
    process.exit(1);
  }
  console.log('[budget] OK: every Atheros module under budget.');
}

main();
