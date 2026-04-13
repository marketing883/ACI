#!/usr/bin/env node
/**
 * Smoke tests for pure-function pieces of src/lib/copilot/retrieval.ts.
 * Uses node --test via Node's built-in runner. Zero new dependencies.
 *
 * Run with:
 *   npx tsx --test scripts/test-retrieval.mjs
 * Or (preferred, since the module under test is TS):
 *   npx tsx scripts/test-retrieval.mjs
 *
 * We cover the pure functions that do not touch the network:
 *   - structuredLookup: path -> entity mapping, cluster pinning, dedup
 *   - formatForPrompt: citation-friendly XML-ish wrapping, slug tags
 *
 * Semantic/hybrid paths are validated against a live Supabase instance in
 * the Part-2 exit gate manual checks, not here. Adding a mocked DB would
 * require a test runner dependency; this project ships with none by choice.
 */
import assert from 'node:assert/strict';
import test from 'node:test';

// Register tsx to resolve TS paths (@/ alias) and transpile on the fly.
// Requires: `npx tsx scripts/test-retrieval.mjs`.
const retrieval = await import('../src/lib/copilot/retrieval.ts');

test('structuredLookup: service path', () => {
  const out = retrieval.structuredLookup({ path: '/services/data-engineering' });
  assert.equal(out.length, 1);
  assert.equal(out[0].source_type, 'service');
  assert.equal(out[0].source_slug, 'data-engineering');
  assert.equal(out[0].reason, 'path');
});

test('structuredLookup: industry path', () => {
  const out = retrieval.structuredLookup({ path: '/industries/hospitality' });
  assert.equal(out[0].source_type, 'industry');
  assert.equal(out[0].source_slug, 'hospitality');
});

test('structuredLookup: platform path', () => {
  const out = retrieval.structuredLookup({ path: '/platforms/databricks' });
  assert.equal(out[0].source_type, 'platform');
  assert.equal(out[0].source_slug, 'databricks');
});

test('structuredLookup: LP path', () => {
  const out = retrieval.structuredLookup({ path: '/lp/databricks-migration' });
  assert.equal(out[0].source_type, 'lp');
  assert.equal(out[0].source_slug, 'databricks-migration');
});

test('structuredLookup: case study path', () => {
  const out = retrieval.structuredLookup({ path: '/case-studies/hospitality-data-unification' });
  assert.equal(out[0].source_type, 'case_study');
  assert.equal(out[0].source_slug, 'hospitality-data-unification');
});

test('structuredLookup: explicit entity wins over path', () => {
  const out = retrieval.structuredLookup({
    path: '/services/data-engineering',
    entitySlug: 'hospitality-data-unification',
    entityType: 'case_study',
  });
  // entity takes precedence; path would otherwise add a service entry,
  // but the explicit entity fires first and skips the path branch.
  assert.equal(out.length, 1);
  assert.equal(out[0].source_type, 'case_study');
  assert.equal(out[0].source_slug, 'hospitality-data-unification');
  assert.equal(out[0].reason, 'explicit-entity');
});

test('structuredLookup: cluster + platform add layered pins', () => {
  const out = retrieval.structuredLookup({
    path: '/lp/databricks-migration',
    cluster: 'data-engineering',
    platform: 'databricks',
  });
  const keys = out.map((o) => `${o.source_type}:${o.source_slug}`);
  assert.ok(keys.includes('lp:databricks-migration'));
  assert.ok(keys.includes('service:data-engineering'));
  assert.ok(keys.includes('platform:databricks'));
});

test('structuredLookup: dedupes duplicate pins', () => {
  const out = retrieval.structuredLookup({
    entitySlug: 'data-engineering',
    entityType: 'service',
    cluster: 'data-engineering',
  });
  const keys = out.map((o) => `${o.source_type}:${o.source_slug}`);
  const uniqueKeys = new Set(keys);
  assert.equal(keys.length, uniqueKeys.size);
});

test('structuredLookup: unknown path yields empty', () => {
  const out = retrieval.structuredLookup({ path: '/about' });
  assert.deepEqual(out, []);
});

test('formatForPrompt: empty input returns empty string', () => {
  assert.equal(retrieval.formatForPrompt([]), '');
});

test('formatForPrompt: emits tagged blocks with slug citations', () => {
  const out = retrieval.formatForPrompt([
    {
      id: 'x',
      source_type: 'case_study',
      source_slug: 'hospitality-data-unification',
      title: 'Data unification for hospitality',
      section_path: 'results',
      text: 'Consolidated 40 systems to 1.',
      metadata: { industry: 'Hospitality' },
      similarity: 0.87,
    },
  ]);
  assert.match(out, /<atheros-context>/);
  assert.match(out, /\[case_study:hospitality-data-unification\]/);
  assert.match(out, /Consolidated 40 systems to 1\./);
  assert.match(out, /<\/atheros-context>/);
});
