import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/**
 * GET /api/admin/analytics/lead-quality?since=24h|7d|30d
 *
 * Reports lead quality across the selected window:
 *   - band counts (cold <40, warm 40-70, hot >70)
 *   - 10-bucket score histogram
 *   - cross-cut tables: by intent, by decision_role
 *
 * Leads without lead_score (intelligence hasn't run yet) are reported
 * separately as "pending" rather than silently counted as 0 — zero-score
 * and no-score-yet are semantically different.
 *
 * Uses service role key. Admin page is auth-gated by middleware.
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

export interface Band {
  count: number;
  /** 0..1 share of leadsWithScore (not total — pending leads excluded). */
  share: number;
  /** Average score inside the band, or null if the band is empty. */
  avgScore: number | null;
  /** Previous period count for WoW comparison. Null if no previous data. */
  previousCount: number | null;
  delta: number | null;
  deltaPercent: number | null;
}

export interface HistogramBucket {
  /** Label like "0-9", "10-19", … "90-100". */
  bucket: string;
  /** Inclusive lower bound. */
  from: number;
  /** Inclusive upper bound. */
  to: number;
  count: number;
}

export interface CrossCutRow {
  key: string;
  label: string;
  count: number;
  avgScore: number | null;
  /** Count inside each band for this row. */
  cold: number;
  warm: number;
  hot: number;
}

export interface LeadQualityResponse {
  since: SinceKey;
  rangeStart: string;
  rangeEnd: string;
  totalLeads: number;
  leadsWithScore: number;
  pendingIntelligence: number;
  bands: {
    cold: Band;
    warm: Band;
    hot: Band;
  };
  histogram: HistogramBucket[];
  byIntent: CrossCutRow[];
  byDecisionRole: CrossCutRow[];
  byIndustry: CrossCutRow[];
  byServiceInterest: CrossCutRow[];
  insight: {
    hotShare: number | null;
    message: string | null;
  };
  generatedAt: string;
}

const INTENT_ORDER = ['low', 'medium', 'high'] as const;
const INTENT_LABELS: Record<string, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
};

const DECISION_ROLE_ORDER = [
  'leading',
  'scoping',
  'researching',
  'unclear',
] as const;
const DECISION_ROLE_LABELS: Record<string, string> = {
  leading: 'Leading the decision',
  scoping: 'Scoping for someone else',
  researching: 'Researching',
  unclear: 'Unclear',
};

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

  // Pull every lead in range with the columns we need. Bounded at 10k —
  // if a single window exceeds that we'd move to aggregated RPCs.
  const { data, error } = await supabase
    .from('chat_leads')
    .select('id, lead_score, intent, decision_role, industry, service_interest, created_at')
    .gte('created_at', startIso)
    .lte('created_at', endIso)
    .limit(10_000);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  const rows = (data ?? []) as Array<{
    id: string;
    lead_score: number | null;
    intent: string | null;
    decision_role: string | null;
    industry: string | null;
    service_interest: string | null;
    created_at: string;
  }>;

  const totalLeads = rows.length;
  const scoredRows = rows.filter(
    (r) => typeof r.lead_score === 'number' && Number.isFinite(r.lead_score),
  );
  const leadsWithScore = scoredRows.length;
  const pendingIntelligence = totalLeads - leadsWithScore;

  // Band computation (cold <40, warm 40-70 inclusive, hot >70). Matches
  // formatLeadTemperature in src/lib/copilot/prompt.ts.
  const bandKey = (score: number): 'cold' | 'warm' | 'hot' => {
    if (score < 40) return 'cold';
    if (score <= 70) return 'warm';
    return 'hot';
  };

  const bandBuckets: Record<'cold' | 'warm' | 'hot', number[]> = {
    cold: [],
    warm: [],
    hot: [],
  };
  for (const r of scoredRows) {
    bandBuckets[bandKey(r.lead_score as number)].push(r.lead_score as number);
  }

  const avg = (xs: number[]): number | null =>
    xs.length === 0 ? null : Math.round(xs.reduce((a, b) => a + b, 0) / xs.length);
  const share = (n: number): number =>
    leadsWithScore === 0 ? 0 : n / leadsWithScore;

  // Previous-period bands for WoW comparison.
  const prevEnd = new Date(rangeStart.getTime());
  const prevStart = new Date(prevEnd.getTime() - WINDOW_MS[since]);
  const { data: prevData } = await supabase
    .from('chat_leads')
    .select('lead_score')
    .gte('created_at', prevStart.toISOString())
    .lte('created_at', prevEnd.toISOString())
    .not('lead_score', 'is', null)
    .limit(10_000);
  const prevBandCounts: Record<'cold' | 'warm' | 'hot', number> = {
    cold: 0,
    warm: 0,
    hot: 0,
  };
  for (const r of (prevData ?? []) as Array<{ lead_score: number }>) {
    prevBandCounts[bandKey(r.lead_score)] += 1;
  }
  const hasPrevData = (prevData ?? []).length > 0;

  const makeBand = (bk: 'cold' | 'warm' | 'hot'): Band => {
    const count = bandBuckets[bk].length;
    const pc = hasPrevData ? prevBandCounts[bk] : null;
    return {
      count,
      share: share(count),
      avgScore: avg(bandBuckets[bk]),
      previousCount: pc,
      delta: pc !== null ? count - pc : null,
      deltaPercent: pc !== null && pc > 0 ? (count - pc) / pc : null,
    };
  };
  const bands = {
    cold: makeBand('cold'),
    warm: makeBand('warm'),
    hot: makeBand('hot'),
  };

  // Histogram: 10 buckets of 10. Last bucket includes 100 (90-100 inclusive).
  const histogram: HistogramBucket[] = [];
  for (let i = 0; i < 10; i++) {
    const from = i * 10;
    const to = i === 9 ? 100 : i * 10 + 9;
    histogram.push({ bucket: `${from}-${to}`, from, to, count: 0 });
  }
  for (const r of scoredRows) {
    const s = r.lead_score as number;
    const idx = Math.min(9, Math.max(0, Math.floor(s / 10)));
    histogram[idx].count += 1;
  }

  // Cross-cuts: bucket by a column value, compute count + avgScore + band split.
  const crossCut = (
    keyFn: (row: (typeof rows)[number]) => string | null,
    order: readonly string[],
    labels: Record<string, string>,
  ): CrossCutRow[] => {
    const groups = new Map<string, Array<(typeof rows)[number]>>();
    for (const r of rows) {
      const key = keyFn(r);
      if (!key) continue;
      const list = groups.get(key) ?? [];
      list.push(r);
      groups.set(key, list);
    }
    const result: CrossCutRow[] = [];
    for (const key of order) {
      const bucket = groups.get(key);
      if (!bucket || bucket.length === 0) continue;
      const scored = bucket.filter((r) => typeof r.lead_score === 'number');
      const scores = scored.map((r) => r.lead_score as number);
      const cold = scores.filter((s) => s < 40).length;
      const warm = scores.filter((s) => s >= 40 && s <= 70).length;
      const hot = scores.filter((s) => s > 70).length;
      result.push({
        key,
        label: labels[key] ?? key,
        count: bucket.length,
        avgScore: avg(scores),
        cold,
        warm,
        hot,
      });
    }
    return result;
  };

  // Dynamic cross-cut: discovers keys from data, sorts by count, caps
  // at maxRows. Used for industry + service_interest where the values
  // are free-form strings, not fixed enums.
  const crossCutDynamic = (
    keyFn: (row: (typeof rows)[number]) => string | null,
    maxRows = 10,
  ): CrossCutRow[] => {
    const groups = new Map<string, Array<(typeof rows)[number]>>();
    for (const r of rows) {
      const key = keyFn(r)?.trim();
      if (!key) continue;
      const list = groups.get(key) ?? [];
      list.push(r);
      groups.set(key, list);
    }
    const result: CrossCutRow[] = [];
    for (const [key, bucket] of groups.entries()) {
      const scored = bucket.filter((r) => typeof r.lead_score === 'number');
      const scores = scored.map((r) => r.lead_score as number);
      result.push({
        key,
        label: key,
        count: bucket.length,
        avgScore: avg(scores),
        cold: scores.filter((s) => s < 40).length,
        warm: scores.filter((s) => s >= 40 && s <= 70).length,
        hot: scores.filter((s) => s > 70).length,
      });
    }
    return result.sort((a, b) => b.count - a.count).slice(0, maxRows);
  };

  const byIntent = crossCut((r) => r.intent, INTENT_ORDER, INTENT_LABELS);
  const byDecisionRole = crossCut(
    (r) => r.decision_role,
    DECISION_ROLE_ORDER,
    DECISION_ROLE_LABELS,
  );
  const byIndustry = crossCutDynamic((r) => r.industry);
  const byServiceInterest = crossCutDynamic((r) => r.service_interest);

  // Insight: hot share interpretation. No hard benchmarks — just describe.
  const hotShare = leadsWithScore > 0 ? bands.hot.share : null;
  let insightMsg: string | null = null;
  if (hotShare !== null && leadsWithScore >= 5) {
    if (hotShare >= 0.25) {
      insightMsg = `${(hotShare * 100).toFixed(0)}% of scored leads are hot — a healthy top-of-pipeline mix. Prioritize handoffs.`;
    } else if (hotShare >= 0.1) {
      insightMsg = `${(hotShare * 100).toFixed(0)}% hot is a typical spread. The warm band (40-70) is usually where nurture sequences pay back.`;
    } else {
      insightMsg = `Only ${(hotShare * 100).toFixed(0)}% hot. Either the top of funnel is thin or qualification is too cautious — inspect the engaged-to-email drop-off.`;
    }
  }

  const response: LeadQualityResponse = {
    since,
    rangeStart: startIso,
    rangeEnd: endIso,
    totalLeads,
    leadsWithScore,
    pendingIntelligence,
    bands,
    histogram,
    byIntent,
    byDecisionRole,
    byIndustry,
    byServiceInterest,
    insight: { hotShare, message: insightMsg },
    generatedAt: new Date().toISOString(),
  };

  return NextResponse.json(response, {
    headers: { 'Cache-Control': 'no-store' },
  });
}
