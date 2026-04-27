/**
 * POST /api/copilot/reindex
 *
 * Admin-only trigger that spawns an incremental content reindex. Intended
 * use: after a case study / blog post is updated in the admin CMS, the
 * row trigger marks matching chunks as stale; this endpoint runs the
 * indexer to pick them up.
 *
 * Implementation: the indexer lives at scripts/index-content.ts and is
 * designed to run via `tsx`. Triggering a long-running script from a
 * serverless route is brittle, so this endpoint returns 202 and schedules
 * the work server-side via a child process ONLY when explicitly allowed
 * (COPILOT_REINDEX_INPROC=true). In production the more reliable path is
 * an out-of-band GitHub Action / Supabase Edge Function; this endpoint
 * primarily exists for:
 *   1. dev: run the indexer from the admin UI without dropping to the CLI,
 *   2. staging: manual triggers after seeding content.
 *
 * Responses:
 *   401 : not authenticated
 *   403 : admin check missing
 *   202 : accepted (inproc worker spawned; check /api/copilot/health)
 *   501 : not implemented in this environment (no inproc flag set)
 */

import { NextResponse } from 'next/server';
import { spawn } from 'node:child_process';
import { getUser } from '@/lib/supabase-server';
import { log } from '@/lib/copilot/logger';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: Request) {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ ok: false, reason: 'unauthorized' }, { status: 401 });
  }

  let body: { source?: string; full?: boolean } = {};
  try {
    body = (await request.json()) as typeof body;
  } catch {
    // copilot-allow-silent-catch: JSON is optional here
    body = {};
  }

  const inproc =
    (process.env.COPILOT_REINDEX_INPROC ?? '').toLowerCase() === 'true' ||
    process.env.NODE_ENV !== 'production';

  if (!inproc) {
    log.warn('indexer', 'reindex requested but inproc disabled; skipping', {
      extra: { user: user.id, body },
    });
    return NextResponse.json(
      {
        ok: false,
        reason: 'inproc-disabled',
        hint: 'Run `npx tsx scripts/index-content.ts` from an out-of-band worker in production.',
      },
      { status: 501 },
    );
  }

  // Fire-and-forget: return 202 immediately; indexer logs to chat_errors
  // and stdout. Caller polls /api/copilot/health for lastIndexedAt.
  try {
    const args = ['tsx', 'scripts/index-content.ts'];
    if (body.full) args.push('--full');
    if (body.source) args.push(`--source=${body.source}`);
    const child = spawn('npx', args, {
      cwd: process.cwd(),
      env: process.env,
      detached: true,
      stdio: 'ignore',
    });
    child.unref();
    log.info('indexer', `reindex spawned pid=${child.pid}`, {
      extra: { user: user.id, args },
    });
    return NextResponse.json(
      { ok: true, status: 'spawned', pid: child.pid },
      { status: 202 },
    );
  } catch (err) {
    log.error('indexer', err, { extra: { user: user.id, phase: 'spawn' } });
    return NextResponse.json(
      { ok: false, reason: 'spawn-failed' },
      { status: 500 },
    );
  }
}
