/**
 * Live takeover relay.
 *
 * POST /api/admin/copilot/takeover
 * Body: { sessionId, content }
 *
 * Inserts an admin message into chat_messages. The user-side ChatColumn
 * (Part 6 follow-up) polls / subscribes and renders admin-role messages
 * with a distinct banner-style bubble.
 */

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';
import { getUser } from '@/lib/supabase-server';
import { log } from '@/lib/copilot/logger';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const schema = z.object({
  sessionId: z.string().min(4).max(120),
  content: z.string().trim().min(1).max(4000),
});

export async function POST(request: Request) {
  const user = await getUser();
  if (!user) return NextResponse.json({ ok: false, reason: 'unauthorized' }, { status: 401 });

  let body: z.infer<typeof schema>;
  try {
    body = schema.parse(await request.json());
  } catch (err) {
    return NextResponse.json({ ok: false, reason: 'bad-request', detail: (err as Error).message }, { status: 400 });
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return NextResponse.json({ ok: false, reason: 'no-service-role' }, { status: 500 });
  const supabase = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });

  // Verify the session is currently claimed by SOME admin. We deliberately
  // do not require the same admin so a teammate can take over a stuck
  // session from another browser tab.
  const { data: sess } = await supabase
    .from('chat_sessions')
    .select('admin_claimed_by, admin_mode')
    .eq('session_id', body.sessionId)
    .maybeSingle();
  if (!sess?.admin_claimed_by) {
    return NextResponse.json({ ok: false, reason: 'session-not-claimed' }, { status: 409 });
  }

  const { error } = await supabase.from('chat_messages').insert({
    session_id: body.sessionId,
    role: 'admin',
    content: body.content,
  });
  if (error) {
    log.warn('init', error, { sessionId: body.sessionId, route: '/api/admin/copilot/takeover' });
    return NextResponse.json({ ok: false, reason: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
