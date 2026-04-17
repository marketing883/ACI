import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/**
 * GET /api/admin/analytics/drill-down?type=leads|sessions&filter=...&since=7d
 *
 * Returns a filtered list of leads or sessions for drill-down from any
 * analytics page. Accepts filter combos:
 *
 * type=leads:
 *   band=cold|warm|hot  (filter by lead_score range)
 *   intent=low|medium|high
 *   role=leading|scoping|researching|unclear
 *
 * type=sessions:
 *   stage=chat_opened|engaged|handoff  (funnel stages)
 *
 * Returns up to 100 rows, sorted by created_at DESC.
 */

type SinceKey = '24h' | '7d' | '30d';
const WINDOW_MS: Record<SinceKey, number> = {
  '24h': 24 * 60 * 60 * 1000,
  '7d': 7 * 24 * 60 * 60 * 1000,
  '30d': 30 * 24 * 60 * 60 * 1000,
};

export interface DrillDownLead {
  id: string;
  email: string | null;
  name: string | null;
  company: string | null;
  job_title: string | null;
  industry: string | null;
  service_interest: string | null;
  lead_score: number | null;
  intent: string | null;
  decision_role: string | null;
  pain_point: string | null;
  pain_point_category: string | null;
  created_at: string;
}

export interface DrillDownSession {
  session_id: string;
  page_entry: string | null;
  started_at: string;
  handoff_at: string | null;
  handoff_reason: string | null;
  message_count: number;
}

export interface DrillDownResponse {
  type: 'leads' | 'sessions';
  filter: string;
  since: SinceKey;
  leads?: DrillDownLead[];
  sessions?: DrillDownSession[];
  total: number;
}

export async function GET(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 });
  }
  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const url = new URL(request.url);
  const type = url.searchParams.get('type') as 'leads' | 'sessions' | null;
  const since = (['24h', '7d', '30d'].includes(url.searchParams.get('since') ?? '')
    ? url.searchParams.get('since')
    : '7d') as SinceKey;
  const startIso = new Date(Date.now() - WINDOW_MS[since]).toISOString();

  if (type === 'leads') {
    const band = url.searchParams.get('band');
    const intent = url.searchParams.get('intent');
    const role = url.searchParams.get('role');

    let query = supabase
      .from('chat_leads')
      .select(
        'id, email, name, company, job_title, industry, service_interest, lead_score, intent, decision_role, pain_point, pain_point_category, created_at',
      )
      .gte('created_at', startIso)
      .order('created_at', { ascending: false })
      .limit(100);

    if (band === 'cold') query = query.lt('lead_score', 40);
    else if (band === 'warm') query = query.gte('lead_score', 40).lte('lead_score', 70);
    else if (band === 'hot') query = query.gt('lead_score', 70);

    if (intent) query = query.eq('intent', intent);
    if (role) query = query.eq('decision_role', role);

    const { data, error } = await query;
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const filterDesc = [
      band && `band=${band}`,
      intent && `intent=${intent}`,
      role && `role=${role}`,
    ]
      .filter(Boolean)
      .join(', ') || 'all';

    return NextResponse.json({
      type: 'leads',
      filter: filterDesc,
      since,
      leads: data ?? [],
      total: (data ?? []).length,
    } satisfies DrillDownResponse);
  }

  if (type === 'sessions') {
    const stage = url.searchParams.get('stage');

    if (stage === 'engaged') {
      // Sessions with >= 2 user messages.
      const { data: msgData } = await supabase
        .from('chat_messages')
        .select('session_id')
        .eq('role', 'user')
        .gte('created_at', startIso)
        .limit(50_000);
      const counts = new Map<string, number>();
      for (const r of (msgData ?? []) as Array<{ session_id: string }>) {
        counts.set(r.session_id, (counts.get(r.session_id) ?? 0) + 1);
      }
      const engagedIds = [...counts.entries()]
        .filter(([, c]) => c >= 2)
        .map(([sid]) => sid);

      // Fetch those sessions.
      const { data: sessions } = await supabase
        .from('chat_sessions')
        .select('session_id, page_entry, started_at, handoff_at, handoff_reason')
        .in('session_id', engagedIds.slice(0, 100))
        .order('started_at', { ascending: false });

      const result: DrillDownSession[] = ((sessions ?? []) as Array<{
        session_id: string;
        page_entry: string | null;
        started_at: string;
        handoff_at: string | null;
        handoff_reason: string | null;
      }>).map((s) => ({
        ...s,
        message_count: counts.get(s.session_id) ?? 0,
      }));

      return NextResponse.json({
        type: 'sessions',
        filter: 'engaged',
        since,
        sessions: result,
        total: result.length,
      } satisfies DrillDownResponse);
    }

    // Generic session stage: chat_opened, handoff, etc.
    let query = supabase
      .from('chat_sessions')
      .select('session_id, page_entry, started_at, handoff_at, handoff_reason')
      .gte('started_at', startIso)
      .order('started_at', { ascending: false })
      .limit(100);

    if (stage === 'handoff') {
      query = query.not('handoff_at', 'is', null);
    }

    const { data, error } = await query;
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const sessions: DrillDownSession[] = ((data ?? []) as Array<{
      session_id: string;
      page_entry: string | null;
      started_at: string;
      handoff_at: string | null;
      handoff_reason: string | null;
    }>).map((s) => ({ ...s, message_count: 0 }));

    return NextResponse.json({
      type: 'sessions',
      filter: stage || 'all',
      since,
      sessions,
      total: sessions.length,
    } satisfies DrillDownResponse);
  }

  return NextResponse.json({ error: 'type must be leads or sessions' }, { status: 400 });
}
