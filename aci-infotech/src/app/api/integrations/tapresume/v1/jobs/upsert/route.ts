import { NextRequest, NextResponse } from 'next/server';
import { verifyTapResumeRequest, tapresumeContentHash, TAPRESUME_CONTRACT_VERSION } from '@/lib/tapresume';
import {
  tapresumeDb,
  getEvent,
  claimEvent,
  storeAck,
  getPublication,
  applyUpsert,
  buildAckText,
  ackResponse,
  type TapResumeUpsertBody,
} from '@/lib/tapresume-store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * TapResume publication channel: create or update one opening projection.
 * Contract sections 4-7 of
 * docs/integrations/TAPRESUME-CAREERS-CONTRACT-2026-08-30.md.
 *
 * Order of operations is the contract's: signature, then schema, then
 * hash, then idempotency (event id claimed before apply), then version
 * ordering, then apply, then acknowledge. 422s carry field errors because
 * they are terminal on the TapResume side and someone will read them.
 */

interface FieldError {
  field: string;
  error: string;
}

function unprocessable(errors: FieldError[]): NextResponse {
  return NextResponse.json({ error: 'unprocessable', field_errors: errors }, { status: 422 });
}

function validateUpsert(body: Record<string, unknown>): FieldError[] {
  const errors: FieldError[] = [];
  const requireString = (field: string) => {
    if (typeof body[field] !== 'string' || (body[field] as string) === '') {
      errors.push({ field, error: 'required string' });
    }
  };
  requireString('organization_external_key');
  requireString('tapresume_publication_id');
  requireString('title');
  requireString('application_url');
  requireString('content_hash');
  if (body.contract_version !== TAPRESUME_CONTRACT_VERSION) {
    errors.push({ field: 'contract_version', error: `must be ${TAPRESUME_CONTRACT_VERSION}` });
  }
  if (typeof body.desired_version !== 'number' || !Number.isInteger(body.desired_version) || body.desired_version < 1) {
    errors.push({ field: 'desired_version', error: 'required positive integer' });
  }
  if (body.desired_state !== 'published' && body.desired_state !== 'unpublished') {
    errors.push({ field: 'desired_state', error: 'must be published or unpublished' });
  }
  if (body.skills !== undefined && (!Array.isArray(body.skills) || body.skills.some((s) => typeof s !== 'string'))) {
    errors.push({ field: 'skills', error: 'must be an array of strings' });
  }
  return errors;
}

export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const auth = verifyTapResumeRequest(request, rawBody);
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

  let body: Record<string, unknown>;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return unprocessable([{ field: '(body)', error: 'not valid JSON' }]);
  }
  if (typeof body !== 'object' || body === null || Array.isArray(body)) {
    return unprocessable([{ field: '(body)', error: 'must be a JSON object' }]);
  }

  const schemaErrors = validateUpsert(body);
  if (schemaErrors.length > 0) return unprocessable(schemaErrors);
  const upsert = body as unknown as TapResumeUpsertBody;

  // Contract 6: recompute, never trust. Mismatch is terminal by design -
  // it means the payload changed in flight or the sender's hasher drifted.
  const recomputed = tapresumeContentHash(body);
  if (recomputed !== upsert.content_hash) {
    return unprocessable([{ field: 'content_hash', error: 'does not match recomputed hash of body' }]);
  }

  const eventId = auth.eventId;
  if (!eventId) {
    return unprocessable([{ field: 'X-TapResume-Event-Id', error: 'header required' }]);
  }

  try {
    const db = tapresumeDb();

    // Idempotency (contract 4): a seen event id replays its stored ack
    // byte-for-byte. An event row without an ack is a crash between store
    // and apply - fall through and apply again; apply is idempotent.
    const seen = (await getEvent(db, eventId)) ?? (await claimEvent(db, eventId, upsert.tapresume_publication_id, upsert.desired_version));
    if (seen?.ack) return ackResponse(seen.ack);

    const current = await getPublication(db, upsert.tapresume_publication_id);

    // Version ordering (contract 4): never regress. A stale delivery gets
    // a 200 carrying the CURRENT applied state.
    if (current && current.applied_version >= upsert.desired_version) {
      const ackText = buildAckText({
        eventId,
        publicationId: upsert.tapresume_publication_id,
        appliedVersion: current.applied_version,
        appliedState: current.applied_state,
        contentHash: current.content_hash,
        aciJobId: current.aci_job_id ?? '',
        publicUrl: current.public_url ?? '',
        pageState: current.page_state,
        appliedAt: new Date(current.applied_at).toISOString(),
      });
      await storeAck(db, eventId, ackText);
      return ackResponse(ackText);
    }

    const applied = await applyUpsert(db, upsert, eventId, current);

    const ackText = buildAckText({
      eventId,
      publicationId: upsert.tapresume_publication_id,
      appliedVersion: upsert.desired_version,
      appliedState: applied.appliedState,
      contentHash: applied.contentHash,
      aciJobId: applied.aciJobId,
      publicUrl: applied.publicUrl,
      pageState: applied.pageState,
      appliedAt: applied.appliedAt,
    });
    await storeAck(db, eventId, ackText);
    return ackResponse(ackText);
  } catch (err) {
    // Anything down here is our side failing (database, config), which is
    // transient by the contract's taxonomy: 5xx keeps it on the retry
    // ladder instead of paging an operator with a terminal status.
    console.error(
      `[tapresume] upsert failed corr=${auth.correlationId ?? '-'} event=${eventId}:`,
      err instanceof Error ? err.message : err,
    );
    return NextResponse.json({ error: 'internal error' }, { status: 500 });
  }
}
