#!/usr/bin/env node
/**
 * Smoke tests for Atheros Part 4: panel + diagram modules import cleanly,
 * registries cover every declared type, entity index is consistent.
 *
 * We intentionally avoid full React render tests (would require a DOM
 * shim and React 19's Suspense boundaries). Instead we verify:
 *   1. Every panel and diagram module loads without throwing.
 *   2. Every PanelType has a registry entry and a default export.
 *   3. Every DiagramKey has a registry entry and a default export.
 *   4. ENTITY_INDEX panelType values are all in the PanelType set.
 */
import assert from 'node:assert/strict';
import test from 'node:test';

const panelsReg = await import('../src/components/copilot/panels/registry.ts');
const diagramsReg = await import('../src/components/copilot/diagrams/registry.ts');
const generated = await import('../src/lib/copilot/entityIndex.generated.ts');

// Because the registries use React.lazy, we cannot trigger the dynamic
// imports at node-test time without a React renderer. We instead import
// each target module directly.
const PANEL_FILES = [
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
];
const DIAGRAM_FILES = [
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
];

for (const name of PANEL_FILES) {
  test(`panel module loads: ${name}`, async () => {
    const mod = await import(`../src/components/copilot/panels/${name}.tsx`);
    assert.equal(typeof mod.default, 'function', `${name} default export must be a component`);
  });
}

for (const name of DIAGRAM_FILES) {
  test(`diagram module loads: ${name}`, async () => {
    const mod = await import(`../src/components/copilot/diagrams/${name}.tsx`);
    assert.equal(typeof mod.default, 'function', `${name} default export must be a component`);
  });
}

test('panel registry covers all declared PanelType keys', () => {
  const keys = Object.keys(panelsReg.PANEL_REGISTRY);
  assert.equal(keys.length, PANEL_FILES.length, 'registry key count mismatch');
  const expected = [
    'service',
    'industry',
    'platform',
    'case',
    'playbook',
    'diagram',
    'comparison',
    'timeline',
    'stats',
    'resource',
  ];
  for (const k of expected) {
    assert.ok(keys.includes(k), `missing panel registry entry: ${k}`);
  }
});

test('diagram registry lists every DIAGRAM_KEY', () => {
  const keys = diagramsReg.DIAGRAM_KEYS;
  assert.equal(keys.length, DIAGRAM_FILES.length, 'diagram key count mismatch');
  for (const k of keys) {
    assert.ok(k in diagramsReg.DIAGRAM_REGISTRY, `registry missing: ${k}`);
  }
});

test('entity index panelType values are all declared PanelType', () => {
  const validPanels = new Set(Object.keys(panelsReg.PANEL_REGISTRY));
  const entries = Object.entries(generated.ENTITY_INDEX);
  assert.ok(entries.length > 0, 'entity index is empty; regenerate it');
  for (const [slug, entry] of entries) {
    assert.ok(
      validPanels.has(entry.panelType),
      `entity ${slug} maps to unknown panelType ${entry.panelType}`,
    );
  }
});

test('entity index includes every diagram key', () => {
  for (const key of diagramsReg.DIAGRAM_KEYS) {
    assert.ok(key in generated.ENTITY_INDEX, `missing diagram in entity index: ${key}`);
    assert.equal(generated.ENTITY_INDEX[key].panelType, 'diagram');
  }
});

test('isKnownPanelType accepts all declared keys and rejects unknowns', () => {
  for (const k of Object.keys(panelsReg.PANEL_REGISTRY)) {
    assert.equal(panelsReg.isKnownPanelType(k), true, `should accept ${k}`);
  }
  assert.equal(panelsReg.isKnownPanelType('nope'), false);
});

test('resolveEntity returns undefined for unknown slug', () => {
  assert.equal(generated.resolveEntity('__definitely-missing__'), undefined);
});
