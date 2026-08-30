import { createHmac, createHash, timingSafeEqual } from 'node:crypto';
import type { NextRequest } from 'next/server';

/**
 * TapResume careers integration: request verification and content hashing.
 *
 * Normative spec: docs/integrations/TAPRESUME-CAREERS-CONTRACT-2026-08-30.md
 * (wire contract 2026-08-29). The byte layouts here are the contract's,
 * verified against its section 9 and 10 fixtures by
 * scripts/test-tapresume-receiver.mjs --fixtures.
 *
 * Error discipline (contract section 8): 401 and 422 are TERMINAL on the
 * TapResume side and page an operator. Anything transient - including a
 * missing secret, which is a deployment problem, not a caller problem -
 * must surface as a 5xx so the retry ladder absorbs it.
 */

export const TAPRESUME_CONTRACT_VERSION = '2026-08-29';

/** Contract 3.3: reject bodies over 256KB before parsing. */
export const TAPRESUME_BODY_CAP_BYTES = 256 * 1024;

/** Timestamps older or newer than this are a 401 (contract 3.3). */
const TIMESTAMP_WINDOW_SECONDS = 300;

const SIGNATURE_HEADER_RE = /^v=([^,]+),t=([^,]+),s=([0-9a-f]{64})$/;

export type TapResumeVerification =
  | { ok: true; correlationId: string | null; eventId: string | null }
  | { ok: false; status: number; error: string };

/**
 * Active signing secrets. Two may verify at once so rotation has no
 * downtime window (contract 3.3): install the incoming secret as _NEXT,
 * wait for TapResume to switch, then promote it and drop the old one.
 */
function activeSecrets(): string[] {
  return [
    process.env.TAPRESUME_SIGNING_SECRET,
    process.env.TAPRESUME_SIGNING_SECRET_NEXT,
  ].filter((s): s is string => !!s && s.trim() !== '');
}

/**
 * contract 6: sha256 hex of the body with content_hash and contract_version
 * removed and top-level keys sorted ascending; compact JSON.
 */
export function tapresumeContentHash(body: Record<string, unknown>): string {
  const copy: Record<string, unknown> = { ...body };
  delete copy.content_hash;
  delete copy.contract_version;
  const sorted: Record<string, unknown> = {};
  for (const k of Object.keys(copy).sort()) sorted[k] = copy[k];
  return createHash('sha256').update(JSON.stringify(sorted), 'utf8').digest('hex');
}

/**
 * Publication ids are uuids on the wire, and the column is `uuid`. Postgres
 * raises 22P02 on a comparison against anything that is not one, which the
 * route then reports as a 500 - and a 500 means "transient" to TapResume, so
 * a permanently malformed id would retry six times and dead-letter, paging
 * an operator over an input that can never succeed. Check the shape first
 * and answer with something terminal and truthful instead.
 */
export function isUuid(value: unknown): value is string {
  return (
    typeof value === 'string' &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)
  );
}

/** contract 3.1: the five newline-joined parts. Exposed for the test runner. */
export function tapresumeSignedString(
  timestamp: string,
  method: string,
  path: string,
  rawBody: string,
): string {
  return [TAPRESUME_CONTRACT_VERSION, timestamp, method.toUpperCase(), path, rawBody].join('\n');
}

export function tapresumeSign(secret: string, signedString: string): string {
  return createHmac('sha256', secret).update(signedString, 'utf8').digest('hex');
}

/**
 * In-memory rate limit for the integration identity (contract 3.3). Best
 * effort per process; nginx in front is the real backstop. 240 requests a
 * minute is far above any legitimate delivery or reconciliation rate.
 */
const RATE_WINDOW_MS = 60_000;
const RATE_MAX = 240;
let rateWindowStart = 0;
let rateCount = 0;

function rateLimited(): boolean {
  const now = Date.now();
  if (now - rateWindowStart > RATE_WINDOW_MS) {
    rateWindowStart = now;
    rateCount = 0;
  }
  rateCount += 1;
  return rateCount > RATE_MAX;
}

/**
 * Verify one inbound TapResume request. Call before doing anything else,
 * on every route including the GETs (rawBody '' there - zero bytes).
 *
 * A failed signature, stale timestamp, or unknown contract version is a
 * 401 with no detail beyond the status (contract 3.3). A missing secret on
 * our side is a 503, never a 401: it is our misconfiguration, and a 401
 * would page TapResume's operator for something only we can fix.
 */
export function verifyTapResumeRequest(
  request: NextRequest,
  rawBody: string,
): TapResumeVerification {
  const correlationId = request.headers.get('x-correlation-id');
  const eventId = request.headers.get('x-tapresume-event-id');

  // HTTPS only. Behind nginx the original scheme arrives in
  // X-Forwarded-Proto; a plaintext hit either carries http there or - if
  // someone reaches the Node port directly - no header and an http URL.
  const proto =
    request.headers.get('x-forwarded-proto') ?? new URL(request.url).protocol.replace(':', '');
  if (proto !== 'https' && process.env.TAPRESUME_DEV_ALLOW_HTTP !== '1') {
    return { ok: false, status: 401, error: 'unauthorized' };
  }

  if (rateLimited()) {
    return { ok: false, status: 429, error: 'rate limited' };
  }

  if (Buffer.byteLength(rawBody, 'utf8') > TAPRESUME_BODY_CAP_BYTES) {
    return { ok: false, status: 413, error: 'body exceeds 256KB cap' };
  }

  if (request.headers.get('x-tapresume-contract-version') !== TAPRESUME_CONTRACT_VERSION) {
    return { ok: false, status: 401, error: 'unauthorized' };
  }

  const timestamp = request.headers.get('x-tapresume-timestamp');
  if (!timestamp) return { ok: false, status: 401, error: 'unauthorized' };
  const ts = Date.parse(timestamp);
  if (Number.isNaN(ts)) return { ok: false, status: 401, error: 'unauthorized' };
  if (Math.abs(Date.now() - ts) > TIMESTAMP_WINDOW_SECONDS * 1000) {
    return { ok: false, status: 401, error: 'unauthorized' };
  }

  const sigHeader = request.headers.get('x-tapresume-signature');
  const parsed = sigHeader ? SIGNATURE_HEADER_RE.exec(sigHeader) : null;
  if (!parsed) return { ok: false, status: 401, error: 'unauthorized' };
  const [, headerVersion, headerTimestamp, presentedHex] = parsed;
  // The v and t inside the signature header must agree with the standalone
  // headers they duplicate; a mismatch means something rewrote one of them.
  if (headerVersion !== TAPRESUME_CONTRACT_VERSION || headerTimestamp !== timestamp) {
    return { ok: false, status: 401, error: 'unauthorized' };
  }

  const secrets = activeSecrets();
  if (secrets.length === 0) {
    // Our misconfiguration. 503 keeps it on the retry ladder instead of
    // paging TapResume's operator with a terminal 401.
    return { ok: false, status: 503, error: 'receiver not configured' };
  }

  const signed = tapresumeSignedString(
    timestamp,
    request.method,
    request.nextUrl.pathname,
    rawBody,
  );
  const presented = Buffer.from(presentedHex, 'hex');
  let match = false;
  for (const secret of secrets) {
    const expected = createHmac('sha256', secret).update(signed, 'utf8').digest();
    // Same-length buffers always (sha256), so timingSafeEqual applies
    // directly; no early exit on the first differing byte.
    if (presented.length === expected.length && timingSafeEqual(presented, expected)) {
      match = true;
      // Keep checking the remaining secret so timing does not reveal
      // which of the two matched.
    }
  }
  if (!match) return { ok: false, status: 401, error: 'unauthorized' };

  return { ok: true, correlationId, eventId };
}

/** True when either signing secret is configured; routes 503 otherwise. */
export function tapresumeConfigured(): boolean {
  return activeSecrets().length > 0;
}
