/**
 * Atheros structured logger. "Fail loud, never silent."
 *
 * Every catch block in the copilot namespace must route through this module
 * before returning a fallback. The ESLint rule in eslint.config.mjs rejects
 * bare `catch (_) {}` inside src/**\/copilot/** and src/app/api/chat/**.
 *
 * Responsibilities:
 *   1. Best-effort insert into public.chat_errors (never throws).
 *   2. Fire-and-forget analytics event via /api/analytics/events.
 *   3. console.error with stack in non-prod.
 *   4. Push to window.__copilotErrors so the dev-only ErrorToast can surface it.
 *
 * Works on server routes (service-role supabase), on the edge runtime, and
 * in the browser (where the DB write is skipped and we rely on the route
 * that receives the analytics event to persist).
 */

import { COPILOT_NAMESPACE } from './brand';

export type LogStage =
  | 'retrieve'
  | 'generate'
  | 'tool'
  | 'stream'
  | 'render'
  | 'panel'
  | 'pill'
  | 'indexer'
  | 'ratelimit'
  | 'health'
  | 'init'
  | 'other';

export type LogSeverity = 'info' | 'warn' | 'error' | 'fatal';

export interface LogContext {
  sessionId?: string;
  visitorId?: string;
  route?: string;
  model?: string;
  tool?: string;
  extra?: Record<string, unknown>;
}

interface CopilotErrorEvent {
  namespace: typeof COPILOT_NAMESPACE;
  stage: LogStage;
  severity: LogSeverity;
  message: string;
  stack?: string;
  context?: LogContext;
  createdAt: string;
}

const IS_SERVER = typeof window === 'undefined';
const IS_PROD = process.env.NODE_ENV === 'production';

/**
 * Resolve a supabase service-role client only when we're on the server
 * and have the necessary env. Lazy to keep the browser bundle clean.
 */
async function maybeWriteToDb(event: CopilotErrorEvent): Promise<void> {
  if (!IS_SERVER) return;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return;

  try {
    const res = await fetch(`${url}/rest/v1/chat_errors`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: key,
        Authorization: `Bearer ${key}`,
        Prefer: 'return=minimal',
      },
      body: JSON.stringify({
        session_id: event.context?.sessionId ?? null,
        stage: event.stage,
        severity: event.severity,
        message: event.message,
        stack: event.stack ?? null,
        context: event.context ?? {},
        fingerprint: computeFingerprint(event.stage, event.message),
      }),
      // Never block a user-facing request on telemetry.
      cache: 'no-store',
    });
    if (!res.ok && !IS_PROD) {
      console.warn(
        '[copilot/logger] chat_errors insert failed',
        res.status,
        await res.text().catch(() => ''),
      );
    }
  } catch (err) {
    // copilot-allow-silent-catch: logger self-failure, cannot recurse into log.*
    // Absolutely cannot throw from the logger. If telemetry is down, log
    // to console and move on. The user's request must not fail because
    // we could not record the error.
    if (!IS_PROD) {
      console.warn('[copilot/logger] chat_errors write failed', err);
    }
  }
}

/**
 * Fire-and-forget analytics event. Works on both client and server.
 * On the client, uses navigator.sendBeacon if available; on the server,
 * posts to the analytics sink.
 */
async function maybeEmitAnalytics(event: CopilotErrorEvent): Promise<void> {
  const payload = JSON.stringify({
    event_type: 'copilot_error',
    event_category: 'copilot',
    event_target: event.stage,
    event_value: event.severity,
    event_data: {
      namespace: event.namespace,
      message: event.message,
      context: event.context ?? {},
    },
  });

  if (!IS_SERVER && typeof navigator !== 'undefined' && navigator.sendBeacon) {
    try {
      const blob = new Blob([payload], { type: 'application/json' });
      navigator.sendBeacon('/api/analytics/events', blob);
      return;
    } catch (err) {
      // copilot-allow-silent-catch: logger self-failure on sendBeacon path
      if (!IS_PROD) {
        console.warn('[copilot/logger] sendBeacon failed', err);
      }
    }
  }

  try {
    // Build an absolute URL on the server so fetch works in the edge runtime.
    const base =
      (IS_SERVER && process.env.NEXT_PUBLIC_SITE_URL) ||
      (typeof window !== 'undefined' ? window.location.origin : '');
    const url = `${base}/api/analytics/events`;
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: payload,
      cache: 'no-store',
      keepalive: !IS_SERVER,
    });
  } catch (err) {
    // copilot-allow-silent-catch: logger self-failure on analytics emit
    if (!IS_PROD) {
      console.warn('[copilot/logger] analytics emit failed', err);
    }
  }
}

/**
 * Compute a fingerprint that groups errors by root cause. We normalize
 * volatile parts of the message (UUIDs, timestamps, file paths, large
 * numbers) so identical-shape errors collapse into one fingerprint.
 * Plain djb2-style hash; not cryptographic, just stable.
 */
function computeFingerprint(stage: string, message: string): string {
  const normalized = message
    .replace(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi, '<uuid>')
    .replace(/\b\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z?\b/gi, '<ts>')
    .replace(/\b\d+(?:\.\d+)?(?:ms|s|kb|mb|usd)\b/gi, '<n>')
    .replace(/\bport \d+\b/gi, 'port <n>')
    .replace(/\b\d{3,}\b/g, '<n>')
    .replace(/\/[^\s]+\.(?:tsx?|mjs|cjs|json)\b/g, '<file>')
    .toLowerCase()
    .trim()
    .slice(0, 240);
  const seed = `${stage}:${normalized}`;
  let h = 5381;
  for (let i = 0; i < seed.length; i++) {
    h = ((h << 5) + h + seed.charCodeAt(i)) | 0;
  }
  return ((h >>> 0).toString(16) + Math.abs(h).toString(16)).slice(0, 16);
}

declare global {
  var __copilotErrors: CopilotErrorEvent[] | undefined;
}

function pushToDevBuffer(event: CopilotErrorEvent): void {
  if (IS_SERVER || IS_PROD) return;
  if (!globalThis.__copilotErrors) globalThis.__copilotErrors = [];
  globalThis.__copilotErrors.push(event);
  // Cap buffer so a hot error loop can't pin memory.
  if (globalThis.__copilotErrors.length > 100) {
    globalThis.__copilotErrors.splice(0, globalThis.__copilotErrors.length - 100);
  }
}

function normalizeError(err: unknown): { message: string; stack?: string } {
  if (err instanceof Error) {
    return { message: err.message, stack: err.stack };
  }
  if (typeof err === 'string') return { message: err };
  try {
    return { message: JSON.stringify(err) };
  } catch {
    // copilot-allow-silent-catch: normalization cannot recurse into log.*
    return { message: 'Unknown error (non-serializable)' };
  }
}

async function emit(
  severity: LogSeverity,
  stage: LogStage,
  err: unknown,
  context?: LogContext,
): Promise<void> {
  const { message, stack } = normalizeError(err);
  const event: CopilotErrorEvent = {
    namespace: COPILOT_NAMESPACE,
    stage,
    severity,
    message,
    stack,
    context,
    createdAt: new Date().toISOString(),
  };

  if (!IS_PROD) {
    const label = `[copilot/${stage}/${severity}]`;
    const detail = stack ?? '';
    if (severity === 'error' || severity === 'fatal') {
      console.error(label, message, detail, context ?? {});
    } else if (severity === 'warn') {
      console.warn(label, message, context ?? {});
    } else {
      console.info(label, message, context ?? {});
    }
  }

  pushToDevBuffer(event);
  // Fire telemetry in parallel; we do not await its settlement from callers.
  void Promise.all([maybeWriteToDb(event), maybeEmitAnalytics(event)]);
}

export const log = {
  info: (stage: LogStage, msg: string, ctx?: LogContext) =>
    void emit('info', stage, msg, ctx),
  warn: (stage: LogStage, err: unknown, ctx?: LogContext) =>
    void emit('warn', stage, err, ctx),
  error: (stage: LogStage, err: unknown, ctx?: LogContext) =>
    void emit('error', stage, err, ctx),
  fatal: (stage: LogStage, err: unknown, ctx?: LogContext) =>
    void emit('fatal', stage, err, ctx),
} as const;

/**
 * Test-only helper: synchronously retrieve the dev buffer. Used by unit
 * tests and by the ErrorToast component.
 */
export function getDevErrorBuffer(): readonly CopilotErrorEvent[] {
  if (IS_SERVER) return [];
  return globalThis.__copilotErrors ?? [];
}
