/**
 * GET /api/admin/copilot/sessions
 *
 * List Atheros sessions for the admin live view. Reads from the
 * admin_live_conversations view (defined in the Part-6 migration)
 * which joins chat_sessions + chat_sessions_summary + chat_leads.
 *
 * Query params:
 *   limit:        max rows (default 50, max 200)
 *   activeOnly:   '1' filters last_message_at >= now() - 5 minutes
 *   handoffOnly:  '1' filters handoff_at IS NOT NULL
 *   search:       case-insensitive prefix on visitor_id / lead_email / lead_name
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

export async function GET(request: Request) {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ ok: false, reason: 'unauthorized' }, { status: 401 });
  }

  const url = new URL(request.url);
  const limit = Math.min(200, Number.parseInt(url.searchParams.get('limit') ?? '50', 10) || 50);
  const activeOnly = url.searchParams.get('activeOnly') === '1';
  const handoffOnly = url.searchParams.get('handoffOnly') === '1';
  const search = url.searchParams.get('search')?.trim() ?? '';

  const supabase = serviceRoleClient();
  if (!supabase) {
    return NextResponse.json({ ok: false, reason: 'no-service-role' }, { status: 500 });
  }

  try {
    let q = supabase
      .from('admin_live_conversations')
      .select('*')
      .order('last_message_at', { ascending: false, nullsFirst: false })
      .limit(limit);

    if (activeOnly) {
      const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
      q = q.gte('last_message_at', fiveMinAgo);
    }
    if (handoffOnly) {
      q = q.not('handoff_at', 'is', null);
    }
    if (search) {
      const pattern = `${search.replace(/[%_]/g, '')}%`;
      q = q.or(
        `visitor_id.ilike.${pattern},lead_email.ilike.${pattern},lead_name.ilike.${pattern},lead_company.ilike.${pattern}`,
      );
    }

    const { data, error } = await q;
    if (error) {
      log.warn('init', error, { route: '/api/admin/copilot/sessions' });
      return NextResponse.json({ ok: false, reason: error.message }, { status: 500 });
    }
    return NextResponse.json({ ok: true, sessions: data ?? [] });
  } catch (err) {
    log.error('init', err, { route: '/api/admin/copilot/sessions' });
    return NextResponse.json({ ok: false, reason: 'unexpected' }, { status: 500 });
  }
}
