import { NextRequest, NextResponse } from 'next/server';
import { verifyTapResumeRequest } from '@/lib/tapresume';
import { tapresumeDb, getPublication } from '@/lib/tapresume-store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface RouteParams {
  params: Promise<{ tapresumePublicationId: string }>;
}

/**
 * Single-publication read (contract 2.1 route 3). TapResume polls this
 * after a timeout that may have followed a receiver commit, and while
 * waiting for page_state to reach "ready" before calling a publication
 * live. Returns the stored projection plus our applied metadata.
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  const auth = verifyTapResumeRequest(request, '');
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const { tapresumePublicationId } = await params;

  try {
    const db = tapresumeDb();
    const publication = await getPublication(db, tapresumePublicationId);
    if (!publication) {
      return NextResponse.json({ error: 'unknown publication' }, { status: 404 });
    }

    return NextResponse.json({
      tapresume_publication_id: publication.tapresume_publication_id,
      applied_version: publication.applied_version,
      applied_state: publication.applied_state,
      content_hash: publication.content_hash,
      aci_job_id: publication.aci_job_id,
      public_url: publication.public_url,
      page_state: publication.page_state,
      applied_at: new Date(publication.applied_at).toISOString(),
      projection: publication.projection,
    });
  } catch (err) {
    console.error(
      `[tapresume] job read failed corr=${auth.correlationId ?? '-'}:`,
      err instanceof Error ? err.message : err,
    );
    return NextResponse.json({ error: 'internal error' }, { status: 500 });
  }
}
