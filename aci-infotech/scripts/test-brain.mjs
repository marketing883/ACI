#!/usr/bin/env node
/**
 * Smoke tests for the Atheros brain: prompt composition + tool Zod schemas.
 * Uses node:test via Node's built-in runner. Zero new dependencies.
 *
 * Run with:
 *   npx tsx scripts/test-brain.mjs --test
 */
import assert from 'node:assert/strict';
import test from 'node:test';

const prompt = await import('../src/lib/copilot/prompt.ts');
const tools = await import('../src/lib/copilot/tools.ts');

// ---------------------------------------------------------------------------
// prompt.ts
// ---------------------------------------------------------------------------

test('buildSystemPrompt: identity layer always present', () => {
  const out = prompt.buildSystemPrompt({
    pageContext: {},
    retrieved: [],
    leadState: {},
    turnIndex: 1,
  });
  assert.match(out, /Atheros/);
  assert.match(out, /ACI Infotech/);
  assert.match(out, /No em-dashes/);
});

test('buildSystemPrompt: retrieved chunks surface as citations', () => {
  const out = prompt.buildSystemPrompt({
    pageContext: { path: '/services/data-engineering', cluster: 'data-engineering' },
    retrieved: [
      {
        source_type: 'case_study',
        source_slug: 'hospitality-data-unification',
        title: 'Hospitality unification',
        text: 'Consolidated 40 systems.',
        metadata: {},
        similarity: 0.9,
      },
    ],
    leadState: {},
    turnIndex: 2,
  });
  assert.match(out, /\[case_study:hospitality-data-unification\]/);
  assert.match(out, /Consolidated 40 systems\./);
  assert.match(out, /PAGE CONTEXT/);
});

test('buildSystemPrompt: never re-ask captured lead fields', () => {
  const out = prompt.buildSystemPrompt({
    pageContext: {},
    retrieved: [],
    leadState: { name: 'Priya', email: 'priya@example.com', role: 'cio' },
    turnIndex: 3,
  });
  assert.match(out, /do not re-ask/);
  assert.match(out, /name: Priya/);
  assert.match(out, /email: priya@example.com/);
  assert.match(out, /role: cio/);
});

test('buildSystemPrompt: pacing tier changes by turn index', () => {
  const early = prompt.buildSystemPrompt({
    pageContext: {},
    retrieved: [],
    leadState: {},
    turnIndex: 1,
  });
  const deep = prompt.buildSystemPrompt({
    pageContext: {},
    retrieved: [],
    leadState: {},
    turnIndex: 10,
  });
  assert.match(early, /15 to 25 words/);
  assert.match(deep, /under 110 words/);
});

test('buildSystemPrompt: C-suite audience scope always present', () => {
  const out = prompt.buildSystemPrompt({
    pageContext: {},
    retrieved: [],
    leadState: {},
    turnIndex: 1,
  });
  assert.match(out, /CIO:/);
  assert.match(out, /CDO:/);
  assert.match(out, /CTO:/);
  assert.match(out, /CISO:/);
  assert.match(out, /CEO:/);
  assert.match(out, /CMO/);
});

test('splitThoughtFromReply: extracts leading thought line', () => {
  const { thought, reply } = prompt.splitThoughtFromReply(
    '~ mapping to Unity Catalog\nHere is a crisp answer.',
  );
  assert.equal(thought, 'mapping to Unity Catalog');
  assert.match(reply, /^Here is a crisp answer/);
});

test('splitThoughtFromReply: no thought leaves reply unchanged', () => {
  const { thought, reply } = prompt.splitThoughtFromReply(
    'No thought line here.',
  );
  assert.equal(thought, null);
  assert.equal(reply, 'No thought line here.');
});

// ---------------------------------------------------------------------------
// tools.ts
// ---------------------------------------------------------------------------

test('qualify_lead: rejects empty payload', () => {
  const res = tools.qualifyLeadSchema.safeParse({});
  assert.equal(res.success, false);
});

test('qualify_lead: accepts partial data', () => {
  const res = tools.qualifyLeadSchema.safeParse({
    name: 'Priya',
    email: 'priya@example.com',
    role: 'cio',
  });
  assert.equal(res.success, true);
});

test('qualify_lead: rejects invalid email', () => {
  const res = tools.qualifyLeadSchema.safeParse({ email: 'not-an-email' });
  assert.equal(res.success, false);
});

test('show_content_panel: requires slug-shaped entityRef', () => {
  const ok = tools.showContentPanelSchema.safeParse({
    panelType: 'case',
    entityRef: 'hospitality-data-unification',
  });
  assert.equal(ok.success, true);

  const bad = tools.showContentPanelSchema.safeParse({
    panelType: 'case',
    entityRef: 'Has Spaces',
  });
  assert.equal(bad.success, false);
});

test('offer_action_buttons: caps at 4 chips', () => {
  const tooMany = tools.offerActionButtonsSchema.safeParse({
    buttons: Array.from({ length: 5 }).map((_, i) => ({
      label: `one ${i}`,
      intent: 'explore',
      value: `v${i}`,
    })),
  });
  assert.equal(tooMany.success, false);
});

test('request_field: enum field names only', () => {
  const ok = tools.requestFieldSchema.safeParse({
    fieldName: 'email',
    placeholder: 'work email',
  });
  assert.equal(ok.success, true);

  const bad = tools.requestFieldSchema.safeParse({
    fieldName: 'ssn',
    placeholder: 'secret',
  });
  assert.equal(bad.success, false);
});

test('cite_source: rejects uppercase slug', () => {
  const bad = tools.citeSourceSchema.safeParse({
    sourceType: 'case_study',
    slug: 'Hospitality-Unification',
  });
  assert.equal(bad.success, false);
});

test('handoff_to_human: summary length enforced', () => {
  const tooShort = tools.handoffToHumanSchema.safeParse({
    reason: 'user-requested',
    summary: 'short',
  });
  assert.equal(tooShort.success, false);

  const ok = tools.handoffToHumanSchema.safeParse({
    reason: 'legal-or-security',
    summary: 'User asked about data residency under EU jurisdiction.',
  });
  assert.equal(ok.success, true);
});

test('TOOL_SPECS: exposes 7 tools, input_schema.type === object for each', () => {
  assert.equal(tools.TOOL_SPECS.length, 7);
  for (const t of tools.TOOL_SPECS) {
    assert.equal(t.inputSchema.type, 'object', `tool ${t.name} missing type=object`);
  }
});

test('anthropicTools(): returns one entry per spec with input_schema', () => {
  const out = tools.anthropicTools();
  assert.equal(out.length, tools.TOOL_SPECS.length);
  for (const a of out) {
    assert.ok(a.input_schema, `missing input_schema for ${a.name}`);
  }
});

test('openaiTools(): returns function-typed tool definitions', () => {
  const out = tools.openaiTools();
  for (const o of out) {
    assert.equal(o.type, 'function');
    assert.ok(o.function.name);
    assert.ok(o.function.parameters);
  }
});
