import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';
import { tapresumeContentHash } from './tapresume';

/**
 * Storage and apply logic for the TapResume publication channel.
 *
 * Spec: docs/integrations/TAPRESUME-CAREERS-CONTRACT-2026-08-30.md.
 * The projection lives in tapresume_publications; a derived row in jobs
 * makes the opening render through the existing careers pages. Event ids
 * land in tapresume_events BEFORE the apply (contract 3.3), and the exact
 * acknowledgement string is stored there so a duplicate delivery replays
 * the same bytes, applied_at included (contract 4).
 */

export interface TapResumeUpsertBody {
  organization_external_key: string;
  tapresume_role_id?: string;
  tapresume_requisition_id?: string;
  tapresume_publication_id: string;
  desired_version: number;
  desired_state: 'published' | 'unpublished';
  title: string;
  public_description?: string;
  department?: string;
  employment_type?: string;
  experience_level?: string;
  location?: string;
  work_mode?: string;
  skills?: string[];
  salary_display?: string;
  published_at?: string;
  closing_at?: string;
  application_url: string;
  content_hash: string;
  contract_version: string;
  [key: string]: unknown;
}

interface PublicationRow {
  tapresume_publication_id: string;
  aci_job_id: string | null;
  applied_version: number;
  applied_state: 'published' | 'unpublished';
  content_hash: string;
  application_url: string | null;
  public_url: string | null;
  page_state: 'pending' | 'ready';
  projection: Record<string, unknown>;
  applied_at: string;
}

interface EventRow {
  event_id: string;
  ack: string | null;
}

export function siteBase(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL || 'https://aciinfotech.com').replace(/\/$/, '');
}

/**
 * Service-role client, required. The anon fallback in getServerClient is
 * wrong here: RLS on the integration tables denies anon by design, and a
 * silent fallback would turn "misconfigured deployment" into confusing
 * empty reads. Throwing lets the route return a 5xx (transient on the
 * TapResume side) instead.
 */
export function tapresumeDb(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('supabase service credentials not configured');
  return createClient(url, key);
}

export async function getEvent(db: SupabaseClient, eventId: string): Promise<EventRow | null> {
  const { data, error } = await db
    .from('tapresume_events')
    .select('event_id, ack')
    .eq('event_id', eventId)
    .maybeSingle();
  if (error) throw new Error(`event read failed: ${error.message}`);
  return data;
}

/**
 * Insert the event id before applying (contract 3.3). Loses the race
 * gracefully: on conflict, re-read - if the winner already stored an ack,
 * the caller replays it.
 */
export async function claimEvent(
  db: SupabaseClient,
  eventId: string,
  publicationId: string,
  desiredVersion: number | null,
): Promise<EventRow | null> {
  const { error } = await db.from('tapresume_events').insert({
    event_id: eventId,
    tapresume_publication_id: publicationId,
    desired_version: desiredVersion,
  });
  if (error) {
    if (error.code === '23505') return getEvent(db, eventId); // raced: defer to the winner
    throw new Error(`event claim failed: ${error.message}`);
  }
  return null;
}

export async function storeAck(db: SupabaseClient, eventId: string, ackText: string): Promise<void> {
  const { error } = await db
    .from('tapresume_events')
    .update({ ack: ackText, applied_at: new Date().toISOString() })
    .eq('event_id', eventId);
  if (error) throw new Error(`ack store failed: ${error.message}`);
}

export async function getPublication(
  db: SupabaseClient,
  publicationId: string,
): Promise<PublicationRow | null> {
  const { data, error } = await db
    .from('tapresume_publications')
    .select(
      'tapresume_publication_id, aci_job_id, applied_version, applied_state, content_hash, application_url, public_url, page_state, projection, applied_at',
    )
    .eq('tapresume_publication_id', publicationId)
    .maybeSingle();
  if (error) throw new Error(`publication read failed: ${error.message}`);
  return data;
}

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/** ACI owns the slug (contract section 1): generated once, stable after. */
async function uniqueSlug(db: SupabaseClient, title: string, publicationId: string): Promise<string> {
  const base = slugify(title) || `opening-${publicationId.slice(0, 8)}`;
  const { data, error } = await db.from('jobs').select('id').eq('slug', base).maybeSingle();
  if (error) throw new Error(`slug check failed: ${error.message}`);
  if (!data) return base;
  return `${base}-${publicationId.slice(0, 8)}`;
}

export interface ApplyResult {
  aciJobId: string;
  publicUrl: string;
  appliedAt: string;
  contentHash: string;
  appliedState: 'published' | 'unpublished';
  pageState: 'pending' | 'ready';
}

/**
 * Apply one upsert at desired_version. Caller has already verified the
 * signature, validated the schema, recomputed the hash, and established
 * that desired_version is higher than anything applied.
 */
export async function applyUpsert(
  db: SupabaseClient,
  body: TapResumeUpsertBody,
  eventId: string,
  existing: PublicationRow | null,
): Promise<ApplyResult> {
  const appliedAt = new Date().toISOString();
  const recomputedHash = tapresumeContentHash(body);
  const publishing = body.desired_state === 'published';

  const jobFields = {
    title: body.title,
    department: body.department ?? '',
    description: body.public_description ?? '',
    location: body.location ?? '',
    location_type: body.work_mode ?? '',
    employment_type: body.employment_type ?? '',
    experience_level: body.experience_level ?? '',
    skills: Array.isArray(body.skills) ? body.skills : [],
    salary_display: body.salary_display ?? null,
    application_url: body.application_url,
    published_at: body.published_at ?? appliedAt,
    closes_at: body.closing_at ?? null,
    status: publishing ? 'published' : 'closed',
    managed_by: 'tapresume',
  };

  let aciJobId = existing?.aci_job_id ?? null;
  let slug: string;

  if (aciJobId) {
    const { data, error } = await db
      .from('jobs')
      .update(jobFields)
      .eq('id', aciJobId)
      .select('id, slug')
      .maybeSingle();
    if (error) throw new Error(`job update failed: ${error.message}`);
    if (data) {
      slug = data.slug;
    } else {
      // The mapped job row vanished (deleted by hand despite the managed
      // label). Recreate rather than fail the delivery.
      aciJobId = null;
      slug = '';
    }
  } else {
    slug = '';
  }

  if (!aciJobId) {
    slug = await uniqueSlug(db, body.title, body.tapresume_publication_id);
    const { data, error } = await db
      .from('jobs')
      .insert({
        ...jobFields,
        slug,
        responsibilities: [],
        requirements: [],
        nice_to_have: [],
        benefits: [],
      })
      .select('id, slug')
      .single();
    if (error) throw new Error(`job insert failed: ${error.message}`);
    aciJobId = data.id;
    slug = data.slug;
  }

  const publicUrl = `${siteBase()}/careers/${slug}`;

  const { error: pubError } = await db.from('tapresume_publications').upsert(
    {
      tapresume_publication_id: body.tapresume_publication_id,
      aci_job_id: aciJobId,
      organization_external_key: body.organization_external_key,
      tapresume_role_id: body.tapresume_role_id ?? null,
      tapresume_requisition_id: body.tapresume_requisition_id ?? null,
      applied_version: body.desired_version,
      applied_state: body.desired_state,
      content_hash: recomputedHash,
      last_event_id: eventId,
      application_url: body.application_url,
      public_url: publicUrl,
      page_state: 'ready',
      projection: body,
      applied_at: appliedAt,
      synced_at: appliedAt,
    },
    { onConflict: 'tapresume_publication_id' },
  );
  if (pubError) throw new Error(`publication upsert failed: ${pubError.message}`);

  // The careers pages fetch from /api/jobs client-side, so the projection
  // is live the moment the rows above commit; these revalidations cover
  // any server-rendered surface that might cache job data later. Because
  // both commits have succeeded by here, page_state is 'ready' (contract
  // section 7): there is no async regeneration left to wait for.
  revalidatePath('/careers');
  revalidatePath(`/careers/${slug}`);

  return {
    aciJobId: aciJobId as string,
    publicUrl,
    appliedAt,
    contentHash: recomputedHash,
    appliedState: body.desired_state,
    pageState: 'ready',
  };
}

/** Apply an unpublish: the job leaves the public surface, the projection stays. */
export async function applyUnpublish(
  db: SupabaseClient,
  publication: PublicationRow,
  desiredVersion: number,
  eventId: string,
  recomputedHash: string,
): Promise<ApplyResult> {
  const appliedAt = new Date().toISOString();

  if (publication.aci_job_id) {
    const { error } = await db
      .from('jobs')
      .update({ status: 'closed' })
      .eq('id', publication.aci_job_id);
    if (error) throw new Error(`job close failed: ${error.message}`);
  }

  const { error: pubError } = await db
    .from('tapresume_publications')
    .update({
      applied_version: desiredVersion,
      applied_state: 'unpublished',
      content_hash: recomputedHash,
      last_event_id: eventId,
      page_state: 'ready',
      applied_at: appliedAt,
      synced_at: appliedAt,
    })
    .eq('tapresume_publication_id', publication.tapresume_publication_id);
  if (pubError) throw new Error(`publication update failed: ${pubError.message}`);

  revalidatePath('/careers');

  return {
    aciJobId: publication.aci_job_id ?? '',
    publicUrl: publication.public_url ?? '',
    appliedAt,
    contentHash: recomputedHash,
    appliedState: 'unpublished',
    pageState: 'ready',
  };
}

/**
 * The acknowledgement (contract section 7), serialized once. The exact
 * string is stored and replayed for duplicates, so build it in one place
 * and never re-serialize.
 */
export function buildAckText(fields: {
  eventId: string;
  publicationId: string;
  appliedVersion: number;
  appliedState: 'published' | 'unpublished';
  contentHash: string;
  aciJobId: string;
  publicUrl: string;
  pageState: 'pending' | 'ready';
  appliedAt: string;
}): string {
  return JSON.stringify({
    event_id: fields.eventId,
    tapresume_publication_id: fields.publicationId,
    applied_version: fields.appliedVersion,
    applied_state: fields.appliedState,
    content_hash: fields.contentHash,
    aci_job_id: fields.aciJobId,
    public_url: fields.publicUrl,
    page_state: fields.pageState,
    applied_at: fields.appliedAt,
  });
}

export function ackResponse(ackText: string, status = 200): Response {
  return new Response(ackText, {
    status,
    headers: { 'content-type': 'application/json' },
  });
}
