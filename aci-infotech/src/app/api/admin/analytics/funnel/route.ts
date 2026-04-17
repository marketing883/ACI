import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/**
 * GET /api/admin/analytics/funnel?since=24h|7d|30d
 *
 * Returns the visitor -> chat -> engagement -> lead -> handoff funnel for
 * the selected rolling window. Each stage reports absolute count, the
 * conversion rate from the previous stage, and the overall conversion
 * rate from the top.
 *
 * Data sources:
 *   visitors         -> visitor_sessions (distinct visitor_id in window)
 *   chat_opened      -> chat_sessions (distinct session_id in window)
 *   engaged          -> chat_messages (distinct session_id with tool_name=qualify_lead)
 *   email_captured   -> chat_leads (email IS NOT NULL, created_at in window)
 *   high_intent      -> chat_leads (lead_score >= 70 OR intent='high')
 *   handoff          -> chat_sessions (handoff_at in window)
 *
 * All queries use service-role key so RLS doesn't truncate the numbers.
 * The admin page is already auth-gated by middleware.
 */

type SinceKey = '24h' | '7d' | '30d';

const WINDOW_MS: Record<SinceKey, number> = {
  '24h': 24 * 60 * 60 * 1000,
  '7d': 7 * 24 * 60 * 60 * 1000,
  '30d': 30 * 24 * 60 * 60 * 1000,
};

function parseSince(raw: string | null): SinceKey {
  if (raw === '24h' || raw === '7d' || raw === '30d') return raw;
  return '7d';
}

export interface FunnelStage {
  key: string;
  label: string;
  count: number;
  description: string;
  /** Percentage of the previous stage that reached this stage. Null for the top. */
  conversionFromPrevious: number | null;
  /** Percentage of the top stage that reached this stage. Null for the top. */
  conversionFromTop: number | null;
}

export interface FunnelInsight {
  biggestDropoff: {
    fromStage: string;
    toStage: string;
    /** Drop rate, 0..1. 0.6 means 60% of the previous stage did NOT convert. */
    dropRate: number;
  } | null;
  /** Warning string when visitors < chat_opened (consent coverage is low). */
  coverageWarning: string | null;
}

export interface FunnelResponse {
  since: SinceKey;
  rangeStart: string;
  rangeEnd: string;
  stages: FunnelStage[];
  insight: FunnelInsight;
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
  const since = parseSince(url.searchParams.get('since'));
  const rangeEnd = new Date();
  const rangeStart = new Date(rangeEnd.getTime() - WINDOW_MS[since]);
  const startIso = rangeStart.toISOString();
  const endIso = rangeEnd.toISOString();

  // Fire all six count queries in parallel. Each is a single COUNT so the
  // total latency is bounded by the slowest query (typically < 200ms).
  const [
    visitorsResult,
    chatOpenedResult,
    engagedRowsResult,
    emailCapturedResult,
    highIntentResult,
    handoffResult,
  ] = await Promise.all([
    // visitor_sessions: distinct visitor_id in window. No easy distinct-
    // count in PostgREST — pull the ids and reduce client-side. Capped at
    // 50k for safety; above that we'd move this to a Postgres function.
    supabase
      .from('visitor_sessions')
      .select('visitor_id', { count: 'exact', head: false })
      .gte('started_at', startIso)
      .lte('started_at', endIso)
      .limit(50_000),
    supabase
      .from('chat_sessions')
      .select('session_id', { count: 'exact', head: true })
      .gte('started_at', startIso)
      .lte('started_at', endIso),
    // engaged: distinct session_ids with a qualify_lead tool call in range.
    supabase
      .from('chat_messages')
      .select('session_id', { count: 'exact', head: false })
      .eq('tool_name', 'qualify_lead')
      .gte('created_at', startIso)
      .lte('created_at', endIso)
      .limit(50_000),
    supabase
      .from('chat_leads')
      .select('id', { count: 'exact', head: true })
      .not('email', 'is', null)
      .gte('created_at', startIso)
      .lte('created_at', endIso),
    supabase
      .from('chat_leads')
      .select('id', { count: 'exact', head: true })
      .or('lead_score.gte.70,intent.eq.high')
      .gte('created_at', startIso)
      .lte('created_at', endIso),
    supabase
      .from('chat_sessions')
      .select('session_id', { count: 'exact', head: true })
      .not('handoff_at', 'is', null)
      .gte('handoff_at', startIso)
      .lte('handoff_at', endIso),
  ]);

  // Reduce visitor_sessions rows to a distinct visitor count.
  const visitorsCount = (() => {
    if (!visitorsResult.data) return 0;
    const seen = new Set<string>();
    for (const row of visitorsResult.data as Array<{ visitor_id: string | null }>) {
      if (row.visitor_id) seen.add(row.visitor_id);
    }
    return seen.size;
  })();

  // Reduce engaged rows to distinct session_ids.
  const engagedCount = (() => {
    if (!engagedRowsResult.data) return 0;
    const seen = new Set<string>();
    for (const row of engagedRowsResult.data as Array<{ session_id: string | null }>) {
      if (row.session_id) seen.add(row.session_id);
    }
    return seen.size;
  })();

  const stageDefs: Array<{ key: string; label: string; description: string; count: number }> = [
    {
      key: 'visitors',
      label: 'Unique visitors',
      description: 'Distinct visitors tracked in this window (consent-gated; undercount if visitors decline cookies).',
      count: visitorsCount,
    },
    {
      key: 'chat_opened',
      label: 'Chat opened',
      description: 'Atheros sessions that started in this window.',
      count: chatOpenedResult.count ?? 0,
    },
    {
      key: 'engaged',
      label: 'Engaged in conversation',
      description: 'Sessions where the model fired qualify_lead at least once (real signal was shared).',
      count: engagedCount,
    },
    {
      key: 'email_captured',
      label: 'Email captured',
      description: 'Leads that shared an email address.',
      count: emailCapturedResult.count ?? 0,
    },
    {
      key: 'high_intent',
      label: 'Qualified (high intent)',
      description: 'Leads with lead_score ≥ 70 or intent = high.',
      count: highIntentResult.count ?? 0,
    },
    {
      key: 'handoff',
      label: 'Handed to a human',
      description: 'Sessions escalated via handoff_to_human.',
      count: handoffResult.count ?? 0,
    },
  ];

  // Compute conversion rates.
  const topCount = stageDefs[0].count;
  const stages: FunnelStage[] = stageDefs.map((s, i) => {
    const prev = i > 0 ? stageDefs[i - 1].count : null;
    const conversionFromPrevious =
      prev === null ? null : prev === 0 ? null : s.count / prev;
    const conversionFromTop =
      i === 0 ? null : topCount === 0 ? null : s.count / topCount;
    return {
      key: s.key,
      label: s.label,
      description: s.description,
      count: s.count,
      conversionFromPrevious,
      conversionFromTop,
    };
  });

  // Biggest drop-off (stage-to-stage with the largest relative drop).
  let biggestDropoff: FunnelInsight['biggestDropoff'] = null;
  for (let i = 1; i < stages.length; i++) {
    const prev = stages[i - 1];
    const cur = stages[i];
    if (prev.count === 0) continue;
    const dropRate = 1 - cur.count / prev.count;
    if (!biggestDropoff || dropRate > biggestDropoff.dropRate) {
      biggestDropoff = {
        fromStage: prev.label,
        toStage: cur.label,
        dropRate,
      };
    }
  }

  const coverageWarning =
    stages[0].count > 0 && stages[1].count > stages[0].count
      ? `Chat sessions (${stages[1].count}) exceed tracked visitors (${stages[0].count}) — visitor tracking is consent-gated and is undercounting the top of funnel. Consider enabling anonymous page-view tracking.`
      : null;

  const response: FunnelResponse = {
    since,
    rangeStart: startIso,
    rangeEnd: endIso,
    stages,
    insight: { biggestDropoff, coverageWarning },
    generatedAt: new Date().toISOString(),
  };

  return NextResponse.json(response, {
    headers: { 'Cache-Control': 'no-store' },
  });
}
