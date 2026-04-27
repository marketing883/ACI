/**
 * Errors admin API.
 *   GET                                    -> grouped + filtered list
 *   POST?action=silence  { fingerprint, hours, reason? }
 *   POST?action=unsilence { fingerprint }
 */
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';
import { getUser } from '@/lib/supabase-server';
import { log } from '@/lib/copilot/logger';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

function serviceRoleClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

interface ErrorRow {
  id: string;
  fingerprint: string | null;
  stage: string;
  severity: string;
  message: string;
  session_id: string | null;
  created_at: string;
  context: Record<string, unknown> | null;
}

interface SilenceRow {
  fingerprint: string;
  silenced_until: string;
  reason: string | null;
}

export async function GET(request: Request) {
  const user = await getUser();
  if (!user) return NextResponse.json({ ok: false, reason: 'unauthorized' }, { status: 401 });
  const supabase = serviceRoleClient();
  if (!supabase) return NextResponse.json({ ok: false, reason: 'no-service-role' }, { status: 500 });

  const url = new URL(request.url);
  const since = url.searchParams.get('since') ?? '24h';
  const stage = url.searchParams.get('stage');
  const severity = url.searchParams.get('severity');
  const includeSilenced = url.searchParams.get('includeSilenced') === '1';

  const sinceMs =
    since === '24h' ? 24 * 60 * 60 * 1000 :
    since === '7d'  ? 7 * 24 * 60 * 60 * 1000 :
    since === '1h'  ? 60 * 60 * 1000 :
    24 * 60 * 60 * 1000;
  const sinceISO = new Date(Date.now() - sinceMs).toISOString();

  let q = supabase
    .from('chat_errors')
    .select('id,fingerprint,stage,severity,message,session_id,created_at,context')
    .gte('created_at', sinceISO)
    .order('created_at', { ascending: false })
    .limit(1000);
  if (stage) q = q.eq('stage', stage);
  if (severity) q = q.eq('severity', severity);

  const { data: rawErrors, error } = await q;
  if (error) {
    log.warn('init', error, { route: '/api/admin/copilot/errors' });
    return NextResponse.json({ ok: false, reason: error.message }, { status: 500 });
  }

  const { data: silences } = await supabase
    .from('chat_error_silences')
    .select('fingerprint,silenced_until,reason')
    .gt('silenced_until', new Date().toISOString());
  const silentMap = new Map<string, SilenceRow>();
  for (const s of (silences ?? []) as SilenceRow[]) {
    silentMap.set(s.fingerprint, s);
  }

  // Group by fingerprint.
  const groups = new Map<
    string,
    {
      fingerprint: string;
      stage: string;
      severity: string;
      sample_message: string;
      count: number;
      first_seen: string;
      last_seen: string;
      sessions: Set<string>;
      silenced_until: string | null;
      silence_reason: string | null;
    }
  >();
  for (const r of (rawErrors ?? []) as ErrorRow[]) {
    const fp = r.fingerprint ?? `nofp:${r.stage}:${r.severity}`;
    let g = groups.get(fp);
    if (!g) {
      const silence = silentMap.get(fp);
      if (silence && !includeSilenced) continue;
      g = {
        fingerprint: fp,
        stage: r.stage,
        severity: r.severity,
        sample_message: r.message,
        count: 0,
        first_seen: r.created_at,
        last_seen: r.created_at,
        sessions: new Set(),
        silenced_until: silence?.silenced_until ?? null,
        silence_reason: silence?.reason ?? null,
      };
      groups.set(fp, g);
    }
    g.count += 1;
    if (r.created_at < g.first_seen) g.first_seen = r.created_at;
    if (r.created_at > g.last_seen) g.last_seen = r.created_at;
    if (r.session_id) g.sessions.add(r.session_id);
  }

  const out = Array.from(groups.values())
    .map((g) => ({ ...g, sessions: Array.from(g.sessions).slice(0, 5) }))
    .sort((a, b) => b.count - a.count);

  return NextResponse.json({ ok: true, groups: out });
}

const silenceSchema = z.object({
  fingerprint: z.string().min(4).max(40),
  hours: z.number().int().min(1).max(168).default(24),
  reason: z.string().trim().max(200).optional(),
});

const unsilenceSchema = z.object({ fingerprint: z.string().min(4).max(40) });

export async function POST(request: Request) {
  const user = await getUser();
  if (!user) return NextResponse.json({ ok: false, reason: 'unauthorized' }, { status: 401 });
  const supabase = serviceRoleClient();
  if (!supabase) return NextResponse.json({ ok: false, reason: 'no-service-role' }, { status: 500 });

  const action = new URL(request.url).searchParams.get('action');
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return NextResponse.json({ ok: false, reason: 'bad-request' }, { status: 400 });
  }

  if (action === 'silence') {
    const parsed = silenceSchema.safeParse(raw);
    if (!parsed.success) return NextResponse.json({ ok: false, reason: 'bad-request' }, { status: 400 });
    const until = new Date(Date.now() + parsed.data.hours * 60 * 60 * 1000).toISOString();
    const { error } = await supabase.from('chat_error_silences').insert({
      fingerprint: parsed.data.fingerprint,
      silenced_until: until,
      silenced_by: user.id,
      reason: parsed.data.reason ?? null,
    });
    if (error) {
      log.warn('init', error, { extra: { phase: 'silence' } });
      return NextResponse.json({ ok: false, reason: error.message }, { status: 500 });
    }
    return NextResponse.json({ ok: true, silenced_until: until });
  }

  if (action === 'unsilence') {
    const parsed = unsilenceSchema.safeParse(raw);
    if (!parsed.success) return NextResponse.json({ ok: false, reason: 'bad-request' }, { status: 400 });
    const { error } = await supabase
      .from('chat_error_silences')
      .delete()
      .eq('fingerprint', parsed.data.fingerprint);
    if (error) {
      log.warn('init', error, { extra: { phase: 'unsilence' } });
      return NextResponse.json({ ok: false, reason: error.message }, { status: 500 });
    }
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ ok: false, reason: 'unknown-action' }, { status: 400 });
}
