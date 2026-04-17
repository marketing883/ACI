import { NextRequest, NextResponse } from 'next/server';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

/**
 * GET /api/admin/analytics/funnel?since=24h|7d|30d
 *
 * Visitor → chat → engagement → lead → handoff funnel with period-over-
 * period comparison. Each stage reports absolute count, stage-to-stage
 * conversion, overall conversion from the top, AND the delta from the
 * previous period of equal duration so trends are visible.
 *
 * "Engaged" is defined as sessions with at least 2 user messages (the
 * visitor typed more than once — a sign of genuine conversation, not a
 * one-shot open-and-close). This is broader than the previous definition
 * (qualify_lead fired) and catches conversations where the model builds
 * rapport before capturing fields.
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
  conversionFromPrevious: number | null;
  conversionFromTop: number | null;
  previousCount: number | null;
  delta: number | null;
  deltaPercent: number | null;
}

export interface FunnelInsight {
  biggestDropoff: {
    fromStage: string;
    toStage: string;
    dropRate: number;
  } | null;
  coverageWarning: string | null;
  trendSummary: string | null;
}

export interface FunnelResponse {
  since: SinceKey;
  rangeStart: string;
  rangeEnd: string;
  previousRangeStart: string;
  previousRangeEnd: string;
  stages: FunnelStage[];
  insight: FunnelInsight;
  generatedAt: string;
}

// ---------------------------------------------------------------------------
// Stage counting — extracted so we can compute current + previous in one call
// ---------------------------------------------------------------------------

interface RawStageCounts {
  visitors: number;
  chatOpened: number;
  engaged: number;
  emailCaptured: number;
  highIntent: number;
  handoff: number;
}

async function computeStageCounts(
  supabase: SupabaseClient,
  startIso: string,
  endIso: string,
): Promise<RawStageCounts> {
  const [
    visitorsResult,
    chatOpenedResult,
    engagedRowsResult,
    emailCapturedResult,
    highIntentResult,
    handoffResult,
  ] = await Promise.all([
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
    // Engaged: sessions with >= 2 user messages. Broader than qualify_lead
    // — captures rapport-building conversations where qualifying fields
    // haven't surfaced yet but the visitor is genuinely engaged.
    supabase
      .from('chat_messages')
      .select('session_id')
      .eq('role', 'user')
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

  // Distinct visitor count.
  const visitors = (() => {
    if (!visitorsResult.data) return 0;
    const seen = new Set<string>();
    for (const r of visitorsResult.data as Array<{ visitor_id: string | null }>) {
      if (r.visitor_id) seen.add(r.visitor_id);
    }
    return seen.size;
  })();

  // Engaged: distinct sessions with >= 2 user messages.
  const engaged = (() => {
    if (!engagedRowsResult.data) return 0;
    const counts = new Map<string, number>();
    for (const r of engagedRowsResult.data as Array<{ session_id: string | null }>) {
      if (r.session_id) counts.set(r.session_id, (counts.get(r.session_id) ?? 0) + 1);
    }
    let n = 0;
    for (const c of counts.values()) if (c >= 2) n++;
    return n;
  })();

  return {
    visitors,
    chatOpened: chatOpenedResult.count ?? 0,
    engaged,
    emailCaptured: emailCapturedResult.count ?? 0,
    highIntent: highIntentResult.count ?? 0,
    handoff: handoffResult.count ?? 0,
  };
}

// ---------------------------------------------------------------------------
// Stage definition + conversion math
// ---------------------------------------------------------------------------

const STAGE_META: Array<{
  key: string;
  label: string;
  description: string;
  field: keyof RawStageCounts;
}> = [
  {
    key: 'visitors',
    label: 'Unique visitors',
    description:
      'Distinct visitors tracked in this window (consent-gated; undercount if visitors decline cookies).',
    field: 'visitors',
  },
  {
    key: 'chat_opened',
    label: 'Chat opened',
    description: 'Atheros sessions that started in this window.',
    field: 'chatOpened',
  },
  {
    key: 'engaged',
    label: 'Engaged in conversation',
    description:
      'Sessions where the visitor sent at least 2 messages (genuine back-and-forth, not a one-shot open).',
    field: 'engaged',
  },
  {
    key: 'email_captured',
    label: 'Email captured',
    description: 'Leads that shared an email address.',
    field: 'emailCaptured',
  },
  {
    key: 'high_intent',
    label: 'Qualified (high intent)',
    description: 'Leads with lead_score >= 70 or intent = high.',
    field: 'highIntent',
  },
  {
    key: 'handoff',
    label: 'Handed to a human',
    description: 'Sessions escalated via handoff_to_human.',
    field: 'handoff',
  },
];

function buildStages(
  current: RawStageCounts,
  previous: RawStageCounts | null,
): FunnelStage[] {
  const topCount = current[STAGE_META[0].field];
  return STAGE_META.map((meta, i) => {
    const count = current[meta.field];
    const prevStageCount = i > 0 ? current[STAGE_META[i - 1].field] : null;
    const conversionFromPrevious =
      prevStageCount === null
        ? null
        : prevStageCount === 0
          ? null
          : count / prevStageCount;
    const conversionFromTop =
      i === 0 ? null : topCount === 0 ? null : count / topCount;
    const previousCount = previous ? previous[meta.field] : null;
    const delta =
      previousCount !== null ? count - previousCount : null;
    const deltaPercent =
      previousCount !== null && previousCount > 0
        ? (count - previousCount) / previousCount
        : null;
    return {
      key: meta.key,
      label: meta.label,
      description: meta.description,
      count,
      conversionFromPrevious,
      conversionFromTop,
      previousCount,
      delta,
      deltaPercent,
    };
  });
}

// ---------------------------------------------------------------------------
// Route handler
// ---------------------------------------------------------------------------

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
  const windowMs = WINDOW_MS[since];
  const rangeEnd = new Date();
  const rangeStart = new Date(rangeEnd.getTime() - windowMs);
  const previousEnd = new Date(rangeStart.getTime());
  const previousStart = new Date(previousEnd.getTime() - windowMs);

  // Compute both periods. Sequential to stay within connection pool limits
  // (6 queries per call, so 12 total if parallel — borderline for default
  // Supabase pooling). Sequential adds ~200ms but is safer.
  const currentCounts = await computeStageCounts(
    supabase,
    rangeStart.toISOString(),
    rangeEnd.toISOString(),
  );
  const previousCounts = await computeStageCounts(
    supabase,
    previousStart.toISOString(),
    previousEnd.toISOString(),
  );

  const stages = buildStages(currentCounts, previousCounts);

  // Biggest drop-off.
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

  // Coverage warning.
  const coverageWarning =
    stages[0].count > 0 && stages[1].count > stages[0].count
      ? `Chat sessions (${stages[1].count}) exceed tracked visitors (${stages[0].count}). Visitor tracking is consent-gated and undercounting the top of funnel.`
      : null;

  // Trend summary: overall pipeline direction.
  const emailStage = stages.find((s) => s.key === 'email_captured');
  let trendSummary: string | null = null;
  if (emailStage?.deltaPercent !== null && emailStage?.deltaPercent !== undefined) {
    const pct = Math.abs(emailStage.deltaPercent * 100).toFixed(0);
    if (emailStage.deltaPercent > 0.05) {
      trendSummary = `Email captures are up ${pct}% compared to the previous ${since} window. Pipeline is growing.`;
    } else if (emailStage.deltaPercent < -0.05) {
      trendSummary = `Email captures are down ${pct}% compared to the previous ${since} window. Investigate content or chatbot changes.`;
    } else {
      trendSummary = `Email captures are flat compared to the previous ${since} window. Stable pipeline.`;
    }
  }

  const response: FunnelResponse = {
    since,
    rangeStart: rangeStart.toISOString(),
    rangeEnd: rangeEnd.toISOString(),
    previousRangeStart: previousStart.toISOString(),
    previousRangeEnd: previousEnd.toISOString(),
    stages,
    insight: { biggestDropoff, coverageWarning, trendSummary },
    generatedAt: new Date().toISOString(),
  };

  return NextResponse.json(response, {
    headers: { 'Cache-Control': 'no-store' },
  });
}
