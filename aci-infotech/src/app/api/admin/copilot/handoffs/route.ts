/**
 * Handoff inbox API.
 *
 *   GET /api/admin/copilot/handoffs       -> list pending handoffs
 *   POST /api/admin/copilot/handoffs/claim -> claim a session (writes
 *                                              admin_claimed_by + admin_mode)
 *   POST /api/admin/copilot/handoffs/release -> release an active claim
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

export async function GET() {
  const user = await getUser();
  if (!user) return NextResponse.json({ ok: false, reason: 'unauthorized' }, { status: 401 });
  const supabase = serviceRoleClient();
  if (!supabase) return NextResponse.json({ ok: false, reason: 'no-service-role' }, { status: 500 });

  const { data, error } = await supabase
    .from('admin_live_conversations')
    .select('*')
    .not('handoff_at', 'is', null)
    .order('handoff_at', { ascending: false })
    .limit(100);
  if (error) {
    log.warn('init', error, { route: '/api/admin/copilot/handoffs' });
    return NextResponse.json({ ok: false, reason: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true, sessions: data ?? [] });
}

const claimSchema = z.object({
  sessionId: z.string().min(4).max(120),
  mode: z.enum(['relay', 'copilot']).default('relay'),
});

const releaseSchema = z.object({ sessionId: z.string().min(4).max(120) });

export async function POST(request: Request) {
  const user = await getUser();
  if (!user) return NextResponse.json({ ok: false, reason: 'unauthorized' }, { status: 401 });
  const supabase = serviceRoleClient();
  if (!supabase) return NextResponse.json({ ok: false, reason: 'no-service-role' }, { status: 500 });

  const url = new URL(request.url);
  const action = url.searchParams.get('action');
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return NextResponse.json({ ok: false, reason: 'bad-request' }, { status: 400 });
  }

  if (action === 'claim') {
    const parsed = claimSchema.safeParse(raw);
    if (!parsed.success) return NextResponse.json({ ok: false, reason: 'bad-request' }, { status: 400 });
    const { error } = await supabase
      .from('chat_sessions')
      .update({ admin_claimed_by: user.id, admin_mode: parsed.data.mode })
      .eq('session_id', parsed.data.sessionId);
    if (error) {
      log.warn('init', error, { sessionId: parsed.data.sessionId, route: '/api/admin/copilot/handoffs?action=claim' });
      return NextResponse.json({ ok: false, reason: error.message }, { status: 500 });
    }
    // Drop a banner message into the chat so the visitor sees the change.
    await supabase.from('chat_messages').insert({
      session_id: parsed.data.sessionId,
      role: 'admin',
      content: 'A real person from ACI just joined this conversation.',
    });
    return NextResponse.json({ ok: true });
  }

  if (action === 'release') {
    const parsed = releaseSchema.safeParse(raw);
    if (!parsed.success) return NextResponse.json({ ok: false, reason: 'bad-request' }, { status: 400 });
    const { error } = await supabase
      .from('chat_sessions')
      .update({ admin_claimed_by: null, admin_mode: null })
      .eq('session_id', parsed.data.sessionId);
    if (error) {
      log.warn('init', error, { sessionId: parsed.data.sessionId, route: '/api/admin/copilot/handoffs?action=release' });
      return NextResponse.json({ ok: false, reason: error.message }, { status: 500 });
    }
    await supabase.from('chat_messages').insert({
      session_id: parsed.data.sessionId,
      role: 'admin',
      content: 'Handing it back to Atheros from here.',
    });
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ ok: false, reason: 'unknown-action' }, { status: 400 });
}
