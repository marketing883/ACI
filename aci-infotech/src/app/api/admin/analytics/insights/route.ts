import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/**
 * GET /api/admin/analytics/insights?since=24h|7d|30d
 *
 * Three insight panels:
 *   1. Pain points: raw painPoint values from chat_leads, counted for
 *      frequency. Even without NLP clustering, the ranked list surfaces
 *      what visitors are actually struggling with.
 *   2. Decision-role distribution: leading / scoping / researching /
 *      unclear, with avg lead_score per bucket.
 *   3. Model performance: per-model message count, avg latency, total
 *      cost, avg cost per message.
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

export interface PainPointCluster {
  category: string;
  count: number;
  rawPoints: string[];
}

/** @deprecated use PainPointCluster */
export interface PainPointEntry {
  text: string;
  count: number;
}

export interface DecisionRoleEntry {
  role: string;
  label: string;
  count: number;
  avgScore: number | null;
}

export interface ModelEntry {
  model: string;
  messages: number;
  sessions: number;
  conversions: number;
  conversionRate: number | null;
  avgLatencyMs: number | null;
  totalCostUsd: number;
  avgCostPerMessage: number | null;
}

export interface CorrelationInsight {
  label: string;
  description: string;
  positive: boolean;
}

export interface InsightsResponse {
  since: SinceKey;
  painPointClusters: PainPointCluster[];
  uncategorizedPainPoints: string[];
  decisionRoles: DecisionRoleEntry[];
  models: ModelEntry[];
  correlations: CorrelationInsight[];
  totalLeadsWithPainPoint: number;
  totalLeadsWithRole: number;
  generatedAt: string;
}

const ROLE_LABELS: Record<string, string> = {
  leading: 'Leading the decision',
  scoping: 'Scoping for someone else',
  researching: 'Researching / IC',
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

  const [leadsResult, messagesResult, leadsWithSessionResult] = await Promise.all([
    supabase
      .from('chat_leads')
      .select('pain_point, pain_point_category, decision_role, lead_score')
      .gte('created_at', startIso)
      .lte('created_at', endIso)
      .limit(10_000),
    supabase
      .from('chat_messages')
      .select('session_id, model, latency_ms, cost_usd')
      .eq('role', 'assistant')
      .gte('created_at', startIso)
      .lte('created_at', endIso)
      .limit(50_000),
    // For correlation + model-to-conversion: need session_id + email + pain_point.
    supabase
      .from('chat_leads')
      .select('session_id, email, pain_point')
      .gte('created_at', startIso)
      .lte('created_at', endIso)
      .limit(10_000),
  ]);

  const leads = (leadsResult.data ?? []) as Array<{
    pain_point: string | null;
    pain_point_category: string | null;
    decision_role: string | null;
    lead_score: number | null;
  }>;
  const messages = (messagesResult.data ?? []) as Array<{
    session_id: string | null;
    model: string | null;
    latency_ms: number | null;
    cost_usd: number | null;
  }>;
  const leadsWithSession = (leadsWithSessionResult.data ?? []) as Array<{
    session_id: string | null;
    email: string | null;
    pain_point: string | null;
  }>;

  // Build lookup: session_id -> has email (converted)
  const convertedSessions = new Set<string>();
  for (const r of leadsWithSession) {
    if (r.session_id && r.email?.trim()) convertedSessions.add(r.session_id);
  }

  // --- Pain points: cluster by LLM-generated category ---
  const clusterMap = new Map<string, string[]>();
  const uncategorized: string[] = [];
  for (const r of leads) {
    const pp = r.pain_point?.trim();
    if (!pp) continue;
    const cat = r.pain_point_category?.trim();
    if (cat) {
      const list = clusterMap.get(cat) ?? [];
      list.push(pp);
      clusterMap.set(cat, list);
    } else {
      uncategorized.push(pp);
    }
  }
  const painPointClusters: PainPointCluster[] = [...clusterMap.entries()]
    .map(([category, rawPoints]) => ({
      category,
      count: rawPoints.length,
      rawPoints: rawPoints.slice(0, 10),
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 20);
  const uncategorizedPainPoints = uncategorized.slice(0, 20);
  const totalLeadsWithPainPoint = leads.filter((r) => r.pain_point?.trim()).length;

  // --- Decision role distribution ---
  const roleMap = new Map<string, { scores: number[]; count: number }>();
  for (const r of leads) {
    const dr = r.decision_role?.trim();
    if (!dr) continue;
    const entry = roleMap.get(dr) ?? { scores: [], count: 0 };
    entry.count += 1;
    if (typeof r.lead_score === 'number') entry.scores.push(r.lead_score);
    roleMap.set(dr, entry);
  }
  const roleOrder = ['leading', 'scoping', 'researching', 'unclear'];
  const decisionRoles: DecisionRoleEntry[] = roleOrder
    .filter((k) => roleMap.has(k))
    .map((k) => {
      const entry = roleMap.get(k)!;
      const avg =
        entry.scores.length > 0
          ? Math.round(
              entry.scores.reduce((a, b) => a + b, 0) / entry.scores.length,
            )
          : null;
      return { role: k, label: ROLE_LABELS[k] ?? k, count: entry.count, avgScore: avg };
    });
  const totalLeadsWithRole = leads.filter((r) => r.decision_role?.trim()).length;

  // --- Model performance + conversion ---
  // Step 1: for each session, pick the model of the first assistant message.
  const sessionFirstModel = new Map<string, string>();
  const modelMap = new Map<
    string,
    { count: number; sessions: Set<string>; latencies: number[]; cost: number }
  >();
  for (const m of messages) {
    const name = m.model ?? 'unknown';
    const sid = m.session_id ?? '';
    // Track first model per session.
    if (sid && !sessionFirstModel.has(sid)) {
      sessionFirstModel.set(sid, name);
    }
    const entry = modelMap.get(name) ?? {
      count: 0,
      sessions: new Set<string>(),
      latencies: [],
      cost: 0,
    };
    entry.count += 1;
    if (sid) entry.sessions.add(sid);
    if (typeof m.latency_ms === 'number' && m.latency_ms > 0)
      entry.latencies.push(m.latency_ms);
    if (typeof m.cost_usd === 'number') entry.cost += m.cost_usd;
    modelMap.set(name, entry);
  }
  const models: ModelEntry[] = [...modelMap.entries()]
    .map(([model, e]) => {
      // Sessions where this model was the PRIMARY (first) model.
      const primarySessions = [...sessionFirstModel.entries()]
        .filter(([, m]) => m === model)
        .map(([sid]) => sid);
      const conversions = primarySessions.filter((sid) =>
        convertedSessions.has(sid),
      ).length;
      return {
        model,
        messages: e.count,
        sessions: primarySessions.length,
        conversions,
        conversionRate:
          primarySessions.length > 0
            ? conversions / primarySessions.length
            : null,
      avgLatencyMs:
        e.latencies.length > 0
          ? Math.round(
              e.latencies.reduce((a, b) => a + b, 0) / e.latencies.length,
            )
          : null,
      totalCostUsd: Math.round(e.cost * 10000) / 10000,
      avgCostPerMessage:
        e.count > 0
          ? Math.round((e.cost / e.count) * 10000) / 10000
          : null,
      };
    })
    .sort((a, b) => b.messages - a.messages);

  // --- Correlation insights ---
  // Simple A/B comparisons that surface whether a captured field
  // correlates with higher conversion. Computed from leadsWithSession.
  const correlations: CorrelationInsight[] = [];
  if (leadsWithSession.length >= 5) {
    const withPain = leadsWithSession.filter((r) => r.pain_point?.trim());
    const withoutPain = leadsWithSession.filter((r) => !r.pain_point?.trim());
    const convRate = (arr: typeof leadsWithSession) => {
      if (arr.length === 0) return 0;
      return arr.filter((r) => r.email?.trim()).length / arr.length;
    };
    const painConv = convRate(withPain);
    const noPainConv = convRate(withoutPain);
    if (withPain.length >= 2 && withoutPain.length >= 2 && noPainConv > 0) {
      const ratio = painConv / noPainConv;
      if (ratio > 1.2 || ratio < 0.8) {
        correlations.push({
          label: 'Pain point effect on conversion',
          description:
            ratio > 1
              ? `Sessions where a pain point was captured convert at ${(painConv * 100).toFixed(0)}% vs ${(noPainConv * 100).toFixed(0)}% without (${ratio.toFixed(1)}x). Surfacing pain correlates with email capture.`
              : `Sessions with a pain point convert at ${(painConv * 100).toFixed(0)}% vs ${(noPainConv * 100).toFixed(0)}% without. Pain capture does not appear to boost conversion in this window.`,
          positive: ratio > 1,
        });
      }
    }
  }

  const response: InsightsResponse = {
    since,
    painPointClusters,
    uncategorizedPainPoints,
    decisionRoles,
    models,
    correlations,
    totalLeadsWithPainPoint,
    totalLeadsWithRole,
    generatedAt: new Date().toISOString(),
  };

  return NextResponse.json(response, {
    headers: { 'Cache-Control': 'no-store' },
  });
}
