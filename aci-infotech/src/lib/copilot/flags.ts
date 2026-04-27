/**
 * Atheros feature flags and kill switch.
 *
 * These flags gate every v2 behavior. When the v2 brain and UI land in
 * later parts, they all check `isCopilotV2Active(visitorId)` before running.
 * With the flag off, the existing chat widget and /api/chat route behave
 * exactly like today.
 *
 * IMPORTANT (Next.js / Turbopack inlining):
 *   `process.env.NEXT_PUBLIC_*` is substituted at compile time ONLY when
 *   accessed via static dot notation in source. Bracket access through a
 *   helper (`process.env[key]`) is NOT inlined and returns `undefined`
 *   on the client. The exported NEXT_PUBLIC_* flags below therefore go
 *   through static reads + a pure `parseFlag` / `parseInt100` helper.
 *   Server-only `COPILOT_KILL` keeps the dynamic helper because it is
 *   never bundled to the client.
 */

import { COPILOT_NAMESPACE } from './brand';

/** Pure parser. Takes the raw value (which Next.js inlined for us). */
function parseFlag(raw: string | undefined, defaultValue = false): boolean {
  if (raw === undefined || raw === null) return defaultValue;
  const n = String(raw).trim().toLowerCase();
  return n === '1' || n === 'true' || n === 'yes';
}

function parseInt100(raw: string | undefined, defaultValue: number): number {
  if (!raw) return defaultValue;
  const n = Number.parseInt(raw, 10);
  if (!Number.isFinite(n)) return defaultValue;
  return Math.max(0, Math.min(100, n));
}

/** Server-only dynamic-key helper. Only safe for non-NEXT_PUBLIC vars. */
function envFlag(key: string, defaultValue = false): boolean {
  return parseFlag(process.env[key], defaultValue);
}

/**
 * Master switch. When false, every v2 code path short-circuits.
 * STATIC dot-notation read so Turbopack inlines this into the client bundle.
 */
export const COPILOT_V2_ENABLED: boolean = parseFlag(
  process.env.NEXT_PUBLIC_COPILOT_V2,
);

/**
 * Gradual-rollout bucket, 0 to 100. Visitors are hashed to a stable bucket;
 * only visitors whose bucket is strictly less than this value see v2.
 * 100 = everyone; 0 = nobody (equivalent to COPILOT_V2_ENABLED=false).
 * STATIC dot-notation read so Turbopack inlines this.
 */
export const COPILOT_V2_PERCENT: number = parseInt100(
  process.env.NEXT_PUBLIC_COPILOT_V2_PERCENT,
  100,
);

/**
 * Server-only emergency stop. Setting `COPILOT_KILL=true` makes every v2
 * route return a safe fallback and emit a `kill_switch_active` event.
 * Never exposed to the client bundle, so dynamic-key access is fine here.
 */
export const COPILOT_KILL_SWITCH: boolean = envFlag('COPILOT_KILL');

/**
 * Gate the dev-only error toast (separate from the v2 rollout).
 * STATIC dot-notation read for the client bundle.
 */
export const COPILOT_DEV_ERRORS: boolean = parseFlag(
  process.env.NEXT_PUBLIC_COPILOT_DEV_ERRORS,
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
