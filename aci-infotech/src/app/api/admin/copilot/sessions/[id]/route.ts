/**
 * GET /api/admin/copilot/sessions/[id]
 *
 * Full per-session detail for the replay viewer. Returns the session
 * row, all messages (chronological), and the joined chat_leads row +
 * intelligence report when one exists. Errors for the session are
 * loaded separately so the panel can render even when the session
 * has no errors yet.
 */

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
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

export async function GET(
  _request: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ ok: false, reason: 'unauthorized' }, { status: 401 });
  }
  const { id } = await ctx.params;
  if (!id) {
    return NextResponse.json({ ok: false, reason: 'missing-id' }, { status: 400 });
  }

  const supabase = serviceRoleClient();
  if (!supabase) {
    return NextResponse.json({ ok: false, reason: 'no-service-role' }, { status: 500 });
  }

  try {
    const [sessionRes, messagesRes, leadRes, errorsRes] = await Promise.all([
      supabase
        .from('admin_live_conversations')
        .select('*')
        .eq('session_id', id)
        .maybeSingle(),
      supabase
        .from('chat_messages')
        .select('*')
        .eq('session_id', id)
        .order('created_at', { ascending: true })
        .limit(500),
      supabase.from('chat_leads').select('*').eq('session_id', id).maybeSingle(),
      supabase
        .from('chat_errors')
        .select('*')
        .eq('session_id', id)
        .order('created_at', { ascending: false })
        .limit(50),
    ]);

    if (sessionRes.error) {
      log.warn('init', sessionRes.error, {
        sessionId: id,
        extra: { phase: 'session.fetch' },
      });
    }
    if (messagesRes.error) {
      log.warn('init', messagesRes.error, {
        sessionId: id,
        extra: { phase: 'messages.fetch' },
      });
    }

    return NextResponse.json({
      ok: true,
      session: sessionRes.data ?? null,
      messages: messagesRes.data ?? [],
      lead: leadRes.data ?? null,
      errors: errorsRes.data ?? [],
    });
  } catch (err) {
    log.error('init', err, {
      sessionId: id,
      route: '/api/admin/copilot/sessions/[id]',
    });
    return NextResponse.json({ ok: false, reason: 'unexpected' }, { status: 500 });
  }
}
