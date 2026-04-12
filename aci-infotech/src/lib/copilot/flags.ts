/**
 * Atheros feature flags and kill switch.
 *
 * These flags gate every v2 behavior. When the v2 brain and UI land in
 * later parts, they all check `isCopilotV2Active(visitorId)` before running.
 * With the flag off, the existing chat widget and /api/chat route behave
 * exactly like today.
 */

import { COPILOT_NAMESPACE } from './brand';

/** Read once at module load; safe to re-read since process.env is stable. */
function envFlag(key: string, defaultValue = false): boolean {
  const raw = process.env[key];
  if (raw === undefined) return defaultValue;
  const normalized = raw.trim().toLowerCase();
  return normalized === '1' || normalized === 'true' || normalized === 'yes';
}

function envInt(key: string, defaultValue: number, min = 0, max = 100): number {
  const raw = process.env[key];
  if (!raw) return defaultValue;
  const n = Number.parseInt(raw, 10);
  if (!Number.isFinite(n)) return defaultValue;
  return Math.max(min, Math.min(max, n));
}

/**
 * Master switch. When false, every v2 code path short-circuits. Public env
 * so the client bundle can read it too for conditional rendering.
 */
export const COPILOT_V2_ENABLED: boolean = envFlag('NEXT_PUBLIC_COPILOT_V2');

/**
 * Gradual-rollout bucket, 0 to 100. Visitors are hashed to a stable bucket;
 * only visitors whose bucket is strictly less than this value see v2.
 * 100 = everyone; 0 = nobody (equivalent to COPILOT_V2_ENABLED=false).
 */
export const COPILOT_V2_PERCENT: number = envInt(
  'NEXT_PUBLIC_COPILOT_V2_PERCENT',
  100,
  0,
  100,
);

/**
 * Server-only emergency stop. Setting `COPILOT_KILL=true` makes every v2
 * route return a safe fallback and emit a `kill_switch_active` event.
 * Never exposed to the client bundle.
 */
export const COPILOT_KILL_SWITCH: boolean = envFlag('COPILOT_KILL');

/** Gate the dev-only error toast (separate from the v2 rollout). */
export const COPILOT_DEV_ERRORS: boolean = envFlag(
  'NEXT_PUBLIC_COPILOT_DEV_ERRORS',
);

/**
 * Deterministic bucket 0..99 for a visitor id. Identical id -> identical
 * bucket across requests, processes, and regions. Uses FNV-1a for speed
 * and zero deps (no need for crypto on the client path).
 */
export function bucketForVisitor(visitorId: string | null | undefined): number {
  if (!visitorId) return 100; // no id -> treated as outside the bucket
  let hash = 0x811c9dc5;
  for (let i = 0; i < visitorId.length; i++) {
    hash ^= visitorId.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  // Convert to unsigned and modulo 100
  return (hash >>> 0) % 100;
}

/**
 * Single entry point used by routes, middleware, and the widget shim.
 * Returns true only if:
 *   - the master switch is on, AND
 *   - the kill switch is off, AND
 *   - the visitor's bucket is inside the percent window.
 */
export function isCopilotV2Active(visitorId: string | null | undefined): boolean {
  if (COPILOT_KILL_SWITCH) return false;
  if (!COPILOT_V2_ENABLED) return false;
  if (COPILOT_V2_PERCENT <= 0) return false;
  if (COPILOT_V2_PERCENT >= 100) return true;
  return bucketForVisitor(visitorId) < COPILOT_V2_PERCENT;
}

/**
 * Exported snapshot used by the /api/copilot/health endpoint and by the
 * admin dashboard summary row. Safe to serialize.
 */
export function getFlagSnapshot() {
  return {
    namespace: COPILOT_NAMESPACE,
    v2Enabled: COPILOT_V2_ENABLED,
    v2Percent: COPILOT_V2_PERCENT,
    killSwitch: COPILOT_KILL_SWITCH,
    devErrors: COPILOT_DEV_ERRORS,
  } as const;
}
