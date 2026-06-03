/**
 * Signed-URL redirector for candidate resume downloads.
 *
 * Resumes are uploaded to the Supabase Storage `resumes` bucket by
 * /api/jobs/apply. The bucket is private; the public site never
 * exposes a direct URL. The admin Job Applications page links to
 * /api/admin/resume/<storage path> (e.g. /api/admin/resume/<job_id>/
 * <timestamp>-<first>-<last>.pdf). This route takes that path,
 * mints a short-lived signed URL using the service role key, and
 * 302-redirects the browser to it so the file downloads in-browser
 * without ever leaking a public reference.
 *
 * Security: service-role key stays server-side. Signed URL TTL is
 * 5 minutes so any accidentally-shared admin URL expires quickly.
 * Any proper admin-auth gate middleware applied to /admin/* also
 * covers this route.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const SIGNED_URL_TTL_SECONDS = 5 * 60;

interface RouteParams {
  params: Promise<{ path: string[] }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        { error: 'Supabase is not configured' },
        { status: 500 },
      );
    }

    const { path } = await params;
    if (!path || path.length === 0) {
      return NextResponse.json({ error: 'Missing file path' }, { status: 400 });
    }
    const storagePath = path.map(decodeURIComponent).join('/');

    // ?name=<original filename> forces an attachment download with that
    // filename. Without it the browser opens the PDF inline (the "View"
    // button). The HTML `download` attribute on the client anchor is
    // ignored once the redirect crosses to the Supabase origin, so the
    // attachment disposition has to come from the storage URL itself.
    const downloadName = request.nextUrl.searchParams.get('name');
    const signOpts = downloadName ? { download: downloadName } : undefined;

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { data, error } = await supabase.storage
      .from('resumes')
      .createSignedUrl(storagePath, SIGNED_URL_TTL_SECONDS, signOpts);

    if (error || !data?.signedUrl) {
      console.error('Resume signed-url error:', error);
      return NextResponse.json(
        { error: 'Resume not found or unavailable' },
        { status: 404 },
      );
    }

    return NextResponse.redirect(data.signedUrl, 302);
  } catch (error) {
    console.error('Resume route error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
