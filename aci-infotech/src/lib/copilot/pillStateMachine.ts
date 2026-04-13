/**
 * Atheros mobile pill state machine.
 *
 * Three surfaces, one of which has two variants:
 *
 *   pill             - slim liquid-glass pill at the bottom; ambient.
 *   converse         - 85vh bottom sheet with the chat transcript.
 *   peek.proactive   - the "we noticed you scrolled" one-liner above the pill.
 *   peek.narration   - the post-autonav guide ("now on the consolidation playbook.").
 *
 * Legal transitions (all other transitions are rejected):
 *   pill -> converse          (tap pill)
 *   pill -> peek.proactive    (dwell + scroll trigger)
 *   pill -> peek.narration    (presenter raises it after autonav completes)
 *   peek.proactive -> pill    (dismiss, timeout, scroll-away)
 *   peek.proactive -> converse (tap peek)
 *   peek.narration -> pill    (dismiss, 15s timeout)
 *   peek.narration -> converse (tap peek)
 *   converse -> pill          (swipe-down, X, Esc)
 *   converse -> peek.narration (presenter raises it after autonav completes)
 */

export type PillState =
  | { kind: 'pill' }
  | { kind: 'converse' }
  | { kind: 'peek'; variant: 'proactive' | 'narration'; text: string };

export type PillEvent =
  | { type: 'TAP_PILL' }
  | { type: 'TAP_PEEK' }
  | { type: 'DISMISS_PEEK' }
  | { type: 'PEEK_TIMEOUT' }
  | { type: 'CLOSE_CONVERSE' }
  | { type: 'PROACTIVE_TRIGGER'; text: string }
  | { type: 'NARRATION_AFTER_NAV'; text: string };

export const INITIAL_STATE: PillState = { kind: 'pill' };

export function transition(state: PillState, event: PillEvent): PillState {
  switch (event.type) {
    case 'TAP_PILL':
      if (state.kind === 'pill') return { kind: 'converse' };
      return state;
    case 'TAP_PEEK':
      if (state.kind === 'peek') return { kind: 'converse' };
      return state;
    case 'DISMISS_PEEK':
    case 'PEEK_TIMEOUT':
      if (state.kind === 'peek') return { kind: 'pill' };
      return state;
    case 'CLOSE_CONVERSE':
      if (state.kind === 'converse') return { kind: 'pill' };
      return state;
    case 'PROACTIVE_TRIGGER':
      if (state.kind === 'pill')
        return { kind: 'peek', variant: 'proactive', text: event.text };
      return state;
    case 'NARRATION_AFTER_NAV':
      // Valid from pill OR converse (presenter collapses converse before raising peek).
      if (state.kind === 'pill' || state.kind === 'converse')
        return { kind: 'peek', variant: 'narration', text: event.text };
      return state;
  }
}

/**
 * Proactive-peek trigger conditions as per the Part-5 v3 plan:
 *   - 8+ seconds dwell on the current page,
 *   - scroll depth >= 40% at any point,
 *   - user has not dismissed a peek in the last 1 minute (stored in
 *     localStorage under the key returned here).
 * This function returns whether all three conditions are met given the
 * inputs the caller tracks.
 */
export interface ProactiveInputs {
  dwellSeconds: number;
  maxScrollPct: number;
  lastDismissAtMs: number | null;
  nowMs: number;
}

export const PROACTIVE_COOLDOWN_MS = 60_000; // 1 minute
export const PROACTIVE_MIN_DWELL_S = 8;
export const PROACTIVE_MIN_SCROLL_PCT = 40;
export const PROACTIVE_DISMISS_KEY = 'atheros_peek_dismissed_at';

export function shouldRaiseProactivePeek(inputs: ProactiveInputs): boolean {
  if (inputs.dwellSeconds < PROACTIVE_MIN_DWELL_S) return false;
  if (inputs.maxScrollPct < PROACTIVE_MIN_SCROLL_PCT) return false;
  if (inputs.lastDismissAtMs !== null) {
    const since = inputs.nowMs - inputs.lastDismissAtMs;
    if (since < PROACTIVE_COOLDOWN_MS) return false;
  }
  return true;
}

/** Narration peek duration, cancel-on-interaction. */
export const NARRATION_PEEK_MS = 15_000;
