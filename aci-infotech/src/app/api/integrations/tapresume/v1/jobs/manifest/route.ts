import { NextRequest, NextResponse } from 'next/server';
import { verifyTapResumeRequest } from '@/lib/tapresume';
import { tapresumeDb } from '@/lib/tapresume-store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const PAGE_SIZE = 100;

/**
 * Daily reconciliation manifest (contract 2.1 route 4): every publication
 * we store, unpublished ones included, exactly once across the pages.
 *
 * The cursor is the last tapresume_publication_id of the previous page;
 * ordering by primary key makes the walk stable under concurrent upserts
 * (a publication updated mid-walk stays at the same key). Signed like
 * every route; the query string is not part of the signed path.
 */
export async function GET(request: NextRequest) {
  const auth = verifyTapResumeRequest(request, '');
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const cursor = request.nextUrl.searchParams.get('cursor');

  try {
    const db = tapresumeDb();
    let query = db
      .from('tapresume_publications')
      .select('tapresume_publication_id, applied_version, content_hash, page_state')
      .order('tapresume_publication_id', { ascending: true })
      .limit(PAGE_SIZE + 1);
    if (cursor) query = query.gt('tapresume_publication_id', cursor);

    const { data, error } = await query;
    if (error) throw new Error(error.message);

    const rows = data ?? [];
    const page = rows.slice(0, PAGE_SIZE);
    const nextCursor =
      rows.length > PAGE_SIZE ? page[page.length - 1].tapresume_publication_id : null;

    return NextResponse.json({ jobs: page, next_cursor: nextCursor });
  } catch (err) {
    console.error(
      `[tapresume] manifest failed corr=${auth.correlationId ?? '-'}:`,
      err instanceof Error ? err.message : err,
    );
    return NextResponse.json({ error: 'internal error' }, { status: 500 });
  }
}
