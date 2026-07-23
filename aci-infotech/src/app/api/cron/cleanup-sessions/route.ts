import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const CRON_SECRET = process.env.CRON_SECRET;

/**
 * Mark stale visitor sessions as inactive. Calls the Postgres function
 * mark_inactive_sessions() which sets is_active = FALSE for sessions
 * with last_activity_at older than 30 minutes.
 *
 * Scheduling runs in Supabase via pg_cron (see
 * supabase/migrations/20260416_schedule_session_cleanup.sql, every
 * 5 minutes). This endpoint is a manual fallback / smoke test only —
 * no external cron service needs to call it.
 *
 * GET /api/cron/cleanup-sessions
 * Header: Authorization: Bearer <CRON_SECRET>
 */
export async function GET(request: NextRequest) {
  try {
    if (CRON_SECRET) {
      const authHeader = request.headers.get('authorization');
      if (authHeader !== `Bearer ${CRON_SECRET}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !serviceKey) {
      return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const { error } = await supabase.rpc('mark_inactive_sessions');
    if (error) {
      console.error('cleanup-sessions: mark_inactive_sessions failed:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      ok: true,
      message: 'Stale sessions marked inactive',
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error('cleanup-sessions: unexpected error:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
