/**
 * Bulk export for the admin Job Applications page.
 *
 * Excel cannot hold the resume files themselves, so this streams a ZIP:
 * applicants.xlsx plus a resumes/ folder, with every spreadsheet row
 * hyperlinked to its own file. Unzip and the links work.
 *
 * Streamed on purpose. One role here has 268 applicants and 262 resumes, a few
 * hundred MB, and buffering that in memory to build a zip would take the
 * process down. Entries are appended as each file arrives, so memory stays
 * flat regardless of how big the role gets.
 *
 * Respects whatever the page is filtered to (job, status), because an export
 * button that ignores the filter in front of you is a trap.
 *
 * Auth: middleware gates every /api/admin/* path. Service role is needed
 * regardless, since job_applications is RLS-locked and the resumes bucket is
 * private.
 */
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Readable } from 'node:stream';
import { buildApplicantArchive } from '@/lib/job-applicants-archive';
import { slugify, type ApplicationRow } from '@/lib/job-applicants-export';

// archiver and exceljs are Node libraries, and the stream plumbing below is
// Node stream based.
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
// Hundreds of sequential storage downloads take minutes, not seconds.
export const maxDuration = 600;

const PAGE_SIZE = 1000;

type ApplicationWithJob = ApplicationRow & {
  job_id: string;
  jobs?: { title?: string | null } | null;
};

export async function GET(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    return NextResponse.json({ error: 'Supabase is not configured' }, { status: 500 });
  }

  const supabase = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const jobId = request.nextUrl.searchParams.get('job_id');
  const status = request.nextUrl.searchParams.get('status');

  // Page through: PostgREST caps a single response at 1000 rows, and an
  // unfiltered export across every role will pass that.
  const applications: ApplicationWithJob[] = [];
  for (let from = 0; ; from += PAGE_SIZE) {
    let query = supabase
      .from('job_applications')
      .select('*, jobs:job_id (title)')
      .order('created_at', { ascending: true })
      .range(from, from + PAGE_SIZE - 1);
    if (jobId) query = query.eq('job_id', jobId);
    if (status) query = query.eq('status', status);

    const { data, error } = await query;
    if (error) {
      console.error('[Applicant export] query failed:', error);
      return NextResponse.json({ error: 'Failed to load applications' }, { status: 500 });
    }
    const page = (data ?? []) as ApplicationWithJob[];
    applications.push(...page);
    if (page.length < PAGE_SIZE) break;
  }

  if (!applications.length) {
    return NextResponse.json({ error: 'No applications match this filter' }, { status: 404 });
  }

  const jobTitle = jobId ? applications[0].jobs?.title ?? null : null;
  const baseName = `${jobTitle ? slugify(jobTitle) : 'all-applications'}-${new Date()
    .toISOString()
    .slice(0, 10)}`;

  const { stream, finished } = buildApplicantArchive({
    applications,
    baseName,
    sheetName: jobTitle ? jobTitle.trim().slice(0, 30) : 'Applicants',
    download: async (storagePath) => {
      const { data, error } = await supabase.storage.from('resumes').download(storagePath);
      if (error || !data) return { body: null, error: error?.message ?? 'download failed' };
      return { body: Buffer.from(await data.arrayBuffer()), error: null };
    },
  });

  finished
    .then(({ missing }) => {
      if (missing.length) {
        console.warn(`[Applicant export] ${missing.length} applicant(s) without a resume file`);
      }
    })
    .catch((err) => console.error('[Applicant export] failed mid-stream:', err));

  const webStream = Readable.toWeb(stream) as ReadableStream<Uint8Array>;

  return new Response(webStream, {
    headers: {
      'Content-Type': 'application/zip',
      'Content-Disposition': `attachment; filename="${baseName}.zip"`,
      // Nothing downstream should hold a copy of candidate PII.
      'Cache-Control': 'no-store, private',
    },
  });
}
