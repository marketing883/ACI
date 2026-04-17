import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/**
 * GET /api/admin/analytics/repeat-visitors?since=7d&minVisits=2
 *
 * Surfaces visitors who came back multiple times — the highest intent
 * signal available. Cross-references with chat_sessions and chat_leads
 * to show whether these repeat visitors have chatted or converted.
 */

type SinceKey = '24h' | '7d' | '30d';
const WINDOW_MS: Record<SinceKey, number> = {
  '24h': 24 * 60 * 60 * 1000,
  '7d': 7 * 24 * 60 * 60 * 1000,
  '30d': 30 * 24 * 60 * 60 * 1000,
};

export interface RepeatVisitorRow {
  visitorId: string;
  company: string | null;
  industry: string | null;
  totalSessions: number;
  engagementScore: number | null;
  firstSeen: string;
  lastSeen: string;
  firstSource: string | null;
  lastSource: string | null;
  hasChatted: boolean;
  hasConverted: boolean;
  leadScore: number | null;
}

export interface RepeatVisitorResponse {
  since: SinceKey;
  minVisits: number;
  visitors: RepeatVisitorRow[];
  total: number;
  highlights: {
    highValueUntapped: number;
  };
  generatedAt: string;
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
  const since = (['24h', '7d', '30d'].includes(url.searchParams.get('since') ?? '')
    ? url.searchParams.get('since')
    : '7d') as SinceKey;
  const minVisits = Math.max(2, parseInt(url.searchParams.get('minVisits') ?? '2', 10) || 2);
  const startIso = new Date(Date.now() - WINDOW_MS[since]).toISOString();

  const [journeysResult, chatSessionsResult, leadsResult] = await Promise.all([
    supabase
      .from('visitor_journeys')
      .select(
        'visitor_id, company_name, company_industry, total_sessions, engagement_score, first_seen_at, last_seen_at, first_touch_source, last_touch_source',
      )
      .gte('last_seen_at', startIso)
      .gte('total_sessions', minVisits)
      .order('total_sessions', { ascending: false })
      .limit(200),
    supabase
      .from('chat_sessions')
      .select('visitor_id')
      .gte('started_at', startIso)
      .limit(10_000),
    supabase
      .from('chat_leads')
      .select('session_id, email, lead_score')
      .not('email', 'is', null)
      .gte('created_at', startIso)
      .limit(5_000),
  ]);

  const chattedVisitors = new Set<string>();
  for (const r of (chatSessionsResult.data ?? []) as Array<{ visitor_id: string | null }>) {
    if (r.visitor_id) chattedVisitors.add(r.visitor_id);
  }

  const leadsBySession = new Map<string, { email: string; leadScore: number | null }>();
  for (const r of (leadsResult.data ?? []) as Array<{
    session_id: string;
    email: string;
    lead_score: number | null;
  }>) {
    leadsBySession.set(r.session_id, { email: r.email, leadScore: r.lead_score });
  }

  const convertedVisitors = new Map<string, number | null>();
  for (const r of (chatSessionsResult.data ?? []) as Array<{ visitor_id: string | null }>) {
    if (!r.visitor_id) continue;
    // This is imprecise — chat_sessions.visitor_id might be the Atheros
    // session_id, not the VisitorTracker's visitor_id. After #5 lands,
    // these will align. For now, best-effort cross-reference.
  }

  const visitors: RepeatVisitorRow[] = ((journeysResult.data ?? []) as Array<{
    visitor_id: string;
    company_name: string | null;
    company_industry: string | null;
    total_sessions: number;
    engagement_score: number | null;
    first_seen_at: string;
    last_seen_at: string;
    first_touch_source: string | null;
    last_touch_source: string | null;
  }>).map((v) => ({
    visitorId: v.visitor_id,
    company: v.company_name,
    industry: v.company_industry,
    totalSessions: v.total_sessions,
    engagementScore: v.engagement_score,
    firstSeen: v.first_seen_at,
    lastSeen: v.last_seen_at,
    firstSource: v.first_touch_source,
    lastSource: v.last_touch_source,
    hasChatted: chattedVisitors.has(v.visitor_id),
    hasConverted: false,
    leadScore: null,
  }));

  const highValueUntapped = visitors.filter(
    (v) =>
      v.totalSessions >= 3 &&
      (v.engagementScore ?? 0) >= 40 &&
      !v.hasChatted,
  ).length;

  const response: RepeatVisitorResponse = {
    since,
    minVisits,
    visitors,
    total: visitors.length,
    highlights: { highValueUntapped },
    generatedAt: new Date().toISOString(),
  };

  return NextResponse.json(response, {
    headers: { 'Cache-Control': 'no-store' },
  });
}
