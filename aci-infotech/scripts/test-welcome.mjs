#!/usr/bin/env node
/**
 * Tests for src/lib/copilot/welcome.ts.
 * Run: npx tsx --test scripts/test-welcome.mjs
 */
import assert from 'node:assert/strict';
import test from 'node:test';

const welcome = await import('../src/lib/copilot/welcome.ts');

test('welcome: home route hand-authored', () => {
  const w = welcome.resolveWelcome('/');
  assert.match(w.text, /brought you here/i);
});

test('welcome: contact has form-friendly copy', () => {
  const w = welcome.resolveWelcome('/contact');
  assert.match(w.text, /form/i);
});

test('welcome: longest-prefix wins', () => {
  const w = welcome.resolveWelcome('/services/data-engineering');
  assert.match(w.text, /Data engineering/i);
});

test('welcome: dynamic composition for service without override', () => {
  // app-development has a hand-written override; pick a service that
  // exists in src/data/services.ts but check the dynamic path is used
  // when a path falls outside the override list. Use a sub-path that
  // does not match any override.
  const w = welcome.resolveWelcome('/services/quality-engineering');
  assert.match(w.text, /Quality Engineering/i);
  assert.match(w.text, /cycle time|pulled you in/);
});

test('welcome: dynamic composition for industry', () => {
  const w = welcome.resolveWelcome('/industries/financial-services');
  // Either hand-written or composed; both must mention Financial.
  assert.match(w.text, /Financial/i);
});

test('welcome: dynamic composition for platform', () => {
  const w = welcome.resolveWelcome('/platforms/databricks');
  assert.match(w.text, /Databricks/i);
});

test('welcome: case-study prefix returns translation prompt', () => {
  const w = welcome.resolveWelcome('/case-studies/example-slug');
  assert.match(w.text, /case study/i);
});

test('welcome: unknown path returns default fallback', () => {
  const w = welcome.resolveWelcome('/random-route-no-match');
  assert.match(w.text, /What brought you here/i);
});

test('welcome: null pathname returns default', () => {
  const w = welcome.resolveWelcome(null);
  assert.match(w.text, /What brought you here/i);
});

test('welcome: auditWelcome returns no voice violations', () => {
  const issues = welcome.auditWelcome();
  assert.equal(
    issues.length,
    0,
    `voice issues:\n${issues.map((i) => `${i.route}: ${i.issue}`).join('\n')}`,
  );
});
