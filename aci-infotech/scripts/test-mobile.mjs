#!/usr/bin/env node
/**
 * Tests for Atheros Part 5 mobile pill: state machine, pill copy, presenter.
 *
 * Run:
 *   npx tsx --test scripts/test-mobile.mjs
 */
import assert from 'node:assert/strict';
import test from 'node:test';

const sm = await import('../src/lib/copilot/pillStateMachine.ts');
const copy = await import('../src/lib/copilot/pillCopy.ts');
const presenter = await import('../src/lib/copilot/presenter.ts');

// ---------------------------------------------------------------------------
// state machine
// ---------------------------------------------------------------------------

test('state machine: pill -> converse on TAP_PILL', () => {
  const next = sm.transition({ kind: 'pill' }, { type: 'TAP_PILL' });
  assert.equal(next.kind, 'converse');
});

test('state machine: pill -> peek.proactive on PROACTIVE_TRIGGER', () => {
  const next = sm.transition({ kind: 'pill' }, { type: 'PROACTIVE_TRIGGER', text: 'hi' });
  assert.equal(next.kind, 'peek');
  if (next.kind === 'peek') assert.equal(next.variant, 'proactive');
});

test('state machine: converse -> peek.narration on NARRATION_AFTER_NAV', () => {
  const next = sm.transition({ kind: 'converse' }, { type: 'NARRATION_AFTER_NAV', text: 'ok' });
  assert.equal(next.kind, 'peek');
  if (next.kind === 'peek') assert.equal(next.variant, 'narration');
});

test('state machine: peek -> pill on DISMISS_PEEK', () => {
  const next = sm.transition(
    { kind: 'peek', variant: 'proactive', text: 'x' },
    { type: 'DISMISS_PEEK' },
  );
  assert.equal(next.kind, 'pill');
});

test('state machine: peek -> pill on PEEK_TIMEOUT', () => {
  const next = sm.transition(
    { kind: 'peek', variant: 'narration', text: 'x' },
    { type: 'PEEK_TIMEOUT' },
  );
  assert.equal(next.kind, 'pill');
});

test('state machine: peek -> converse on TAP_PEEK', () => {
  const next = sm.transition(
    { kind: 'peek', variant: 'proactive', text: 'x' },
    { type: 'TAP_PEEK' },
  );
  assert.equal(next.kind, 'converse');
});

test('state machine: converse -> pill on CLOSE_CONVERSE', () => {
  const next = sm.transition({ kind: 'converse' }, { type: 'CLOSE_CONVERSE' });
  assert.equal(next.kind, 'pill');
});

test('state machine: illegal transitions are no-ops', () => {
  const r1 = sm.transition({ kind: 'pill' }, { type: 'CLOSE_CONVERSE' });
  assert.equal(r1.kind, 'pill');
  const r2 = sm.transition({ kind: 'converse' }, { type: 'TAP_PILL' });
  assert.equal(r2.kind, 'converse');
  const r3 = sm.transition(
    { kind: 'peek', variant: 'proactive', text: '' },
    { type: 'TAP_PILL' },
  );
  assert.equal(r3.kind, 'peek');
});

test('shouldRaiseProactivePeek: requires dwell >= 8s', () => {
  const ok = sm.shouldRaiseProactivePeek({
    dwellSeconds: 9,
    maxScrollPct: 50,
    lastDismissAtMs: null,
    nowMs: Date.now(),
  });
  assert.equal(ok, true);
  const short = sm.shouldRaiseProactivePeek({
    dwellSeconds: 4,
    maxScrollPct: 50,
    lastDismissAtMs: null,
    nowMs: Date.now(),
  });
  assert.equal(short, false);
});

test('shouldRaiseProactivePeek: requires scroll >= 40%', () => {
  const ok = sm.shouldRaiseProactivePeek({
    dwellSeconds: 10,
    maxScrollPct: 41,
    lastDismissAtMs: null,
    nowMs: Date.now(),
  });
  assert.equal(ok, true);
  const lowScroll = sm.shouldRaiseProactivePeek({
    dwellSeconds: 10,
    maxScrollPct: 20,
    lastDismissAtMs: null,
    nowMs: Date.now(),
  });
  assert.equal(lowScroll, false);
});

test('shouldRaiseProactivePeek: respects 1-minute dismiss cooldown', () => {
  const now = 1_000_000;
  const justDismissed = sm.shouldRaiseProactivePeek({
    dwellSeconds: 10,
    maxScrollPct: 60,
    lastDismissAtMs: now - 30_000,
    nowMs: now,
  });
  assert.equal(justDismissed, false);
  const coolDown = sm.shouldRaiseProactivePeek({
    dwellSeconds: 10,
    maxScrollPct: 60,
    lastDismissAtMs: now - 61_000,
    nowMs: now,
  });
  assert.equal(coolDown, true);
});

// ---------------------------------------------------------------------------
// pill copy
// ---------------------------------------------------------------------------

test('pill copy: exact route match wins', () => {
  const c = copy.resolvePillCopy('/contact');
  assert.match(c.idle, /while you fill the form/);
});

test('pill copy: longest-prefix match wins over shorter', () => {
  const c = copy.resolvePillCopy('/services/data-engineering');
  assert.match(c.idle, /Unity Catalog/);
});

test('pill copy: falls back to default on unknown path', () => {
  const c = copy.resolvePillCopy('/no-such-route-anywhere');
  assert.equal(c.idle, 'Ask Atheros');
});

test('pill copy: auditPillCopy returns no voice-rule violations', () => {
  const issues = copy.auditPillCopy();
  assert.equal(issues.length, 0, `voice issues:\n${issues.map((i) => `${i.route}: ${i.issue}`).join('\n')}`);
});

// ---------------------------------------------------------------------------
// presenter
// ---------------------------------------------------------------------------

test('presenter: isRouteAllowed blocks /contact and /admin', () => {
  assert.equal(presenter.isRouteAllowed('/services/data-engineering'), true);
  assert.equal(presenter.isRouteAllowed('/contact'), false);
  assert.equal(presenter.isRouteAllowed('/admin/copilot/live'), false);
});

test('presenter: throttles to <= 1 autonav per 30s per session', () => {
  presenter.__resetPresenterForTests();
  const calls = [];
  const dispatched = [];
  const ctx = {
    sessionId: 's1',
    currentPath: '/services/data-engineering',
    targetPath: '/industries/hospitality',
    narration: 'Hospitality overview',
    navigate: (href) => calls.push(href),
    dispatch: (e) => dispatched.push(e),
  };
  const first = presenter.presentWithAutoNav(ctx);
  assert.equal(first, true);
  const second = presenter.presentWithAutoNav({ ...ctx, targetPath: '/industries/retail' });
  assert.equal(second, false);
  assert.equal(calls.length, 1);
});

test('presenter: short-circuits when currentPath == targetPath', () => {
  presenter.__resetPresenterForTests();
  const calls = [];
  const events = [];
  const ok = presenter.presentWithAutoNav({
    sessionId: 's2',
    currentPath: '/services/data-engineering',
    targetPath: '/services/data-engineering',
    narration: 'Already here',
    navigate: (href) => calls.push(href),
    dispatch: (e) => events.push(e),
  });
  assert.equal(ok, true);
  assert.equal(calls.length, 0);
  assert.equal(events[0]?.type, 'NARRATION_AFTER_NAV');
});

test('presenter: blocks nav to /contact even when target is /contact', () => {
  presenter.__resetPresenterForTests();
  const calls = [];
  const ok = presenter.presentWithAutoNav({
    sessionId: 's3',
    currentPath: '/services/data-engineering',
    targetPath: '/contact',
    narration: 'x',
    navigate: (href) => calls.push(href),
    dispatch: () => undefined,
  });
  assert.equal(ok, false);
  assert.equal(calls.length, 0);
});
