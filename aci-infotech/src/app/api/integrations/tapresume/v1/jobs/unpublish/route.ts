import { NextRequest, NextResponse } from 'next/server';
import {
  verifyTapResumeRequest,
  tapresumeContentHash,
  TAPRESUME_CONTRACT_VERSION,
  isUuid,
} from '@/lib/tapresume';
import {
  tapresumeDb,
  getEvent,
  claimEvent,
  storeAck,
  getPublication,
  applyUnpublish,
  buildAckText,
  ackResponse,
} from '@/lib/tapresume-store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * TapResume publication channel: remove one opening from the public
 * surface (contract 7.1). The projection row stays - the manifest must
 * keep listing unpublished publications - only the jobs row closes.
 *
 * A 404 for a publication we have never seen is allowed by the contract
 * and treated as already-unpublished by the sender; it is idempotent on
 * redelivery because the lookup fails the same way each time.
 */
export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const auth = verifyTapResumeRequest(request, rawBody);
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

  let body: Record<string, unknown>;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return NextResponse.json(
      { error: 'unprocessable', field_errors: [{ field: '(body)', error: 'not valid JSON' }] },
      { status: 422 },
    );
  }

  const errors: { field: string; error: string }[] = [];
  if (typeof body.tapresume_publication_id !== 'string' || body.tapresume_publication_id === '') {
    errors.push({ field: 'tapresume_publication_id', error: 'required string' });
  } else if (!isUuid(body.tapresume_publication_id)) {
    // Terminal by nature, so 422 rather than a 500 the retry ladder would
    // chase six times before dead-lettering.
    errors.push({ field: 'tapresume_publication_id', error: 'must be a uuid' });
  }
  if (typeof body.desired_version !== 'number' || !Number.isInteger(body.desired_version) || body.desired_version < 1) {
    errors.push({ field: 'desired_version', error: 'required positive integer' });
  }
  if (typeof body.content_hash !== 'string' || body.content_hash === '') {
    errors.push({ field: 'content_hash', error: 'required string' });
  }
  if (body.contract_version !== TAPRESUME_CONTRACT_VERSION) {
    errors.push({ field: 'contract_version', error: `must be ${TAPRESUME_CONTRACT_VERSION}` });
  }
  if (errors.length > 0) {
    return NextResponse.json({ error: 'unprocessable', field_errors: errors }, { status: 422 });
  }

  const recomputed = tapresumeContentHash(body);
  if (recomputed !== body.content_hash) {
    return NextResponse.json(
      {
        error: 'unprocessable',
        field_errors: [{ field: 'content_hash', error: 'does not match recomputed hash of body' }],
      },
      { status: 422 },
    );
  }

  const eventId = auth.eventId;
  if (!eventId) {
    return NextResponse.json(
      { error: 'unprocessable', field_errors: [{ field: 'X-TapResume-Event-Id', error: 'header required' }] },
      { status: 422 },
    );
  }

  const publicationId = body.tapresume_publication_id as string;
  const desiredVersion = body.desired_version as number;

  try {
    const db = tapresumeDb();

    const seen = (await getEvent(db, eventId)) ?? (await claimEvent(db, eventId, publicationId, desiredVersion));
    if (seen?.ack) return ackResponse(seen.ack);

    const publication = await getPublication(db, publicationId);
    if (!publication) {
      return NextResponse.json({ error: 'unknown publication' }, { status: 404 });
    }

    // Never regress (contract 4); a stale unpublish acknowledges current
    // state, whatever it is.
    if (publication.applied_version >= desiredVersion) {
      const ackText = buildAckText({
        eventId,
        publicationId,
        appliedVersion: publication.applied_version,
        appliedState: publication.applied_state,
        contentHash: publication.content_hash,
        aciJobId: publication.aci_job_id ?? '',
        publicUrl: publication.public_url ?? '',
        pageState: publication.page_state,
        appliedAt: new Date(publication.applied_at).toISOString(),
      });
      await storeAck(db, eventId, ackText);
      return ackResponse(ackText);
    }

    const applied = await applyUnpublish(db, publication, desiredVersion, eventId, recomputed);

    const ackText = buildAckText({
      eventId,
      publicationId,
      appliedVersion: desiredVersion,
      appliedState: 'unpublished',
      contentHash: applied.contentHash,
      aciJobId: applied.aciJobId,
      publicUrl: applied.publicUrl,
      pageState: applied.pageState,
      appliedAt: applied.appliedAt,
    });
    await storeAck(db, eventId, ackText);
    return ackResponse(ackText);
  } catch (err) {
    console.error(
      `[tapresume] unpublish failed corr=${auth.correlationId ?? '-'} event=${eventId}:`,
      err instanceof Error ? err.message : err,
    );
    return NextResponse.json({ error: 'internal error' }, { status: 500 });
  }
}
