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
  avgLatencyMs: number | null;
  totalCostUsd: number;
  avgCostPerMessage: number | null;
}

export interface InsightsResponse {
  since: SinceKey;
  painPoints: PainPointEntry[];
  decisionRoles: DecisionRoleEntry[];
  models: ModelEntry[];
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

  const [leadsResult, messagesResult] = await Promise.all([
    supabase
      .from('chat_leads')
      .select('pain_point, decision_role, lead_score')
      .gte('created_at', startIso)
      .lte('created_at', endIso)
      .limit(10_000),
    supabase
      .from('chat_messages')
      .select('model, latency_ms, cost_usd')
      .eq('role', 'assistant')
      .gte('created_at', startIso)
      .lte('created_at', endIso)
      .limit(50_000),
  ]);

  const leads = (leadsResult.data ?? []) as Array<{
    pain_point: string | null;
    decision_role: string | null;
    lead_score: number | null;
  }>;
  const messages = (messagesResult.data ?? []) as Array<{
    model: string | null;
    latency_ms: number | null;
    cost_usd: number | null;
  }>;

  // --- Pain points: frequency-count unique values ---
  const painMap = new Map<string, number>();
  for (const r of leads) {
    const pp = r.pain_point?.trim();
    if (!pp) continue;
    const lower = pp.toLowerCase();
    painMap.set(lower, (painMap.get(lower) ?? 0) + 1);
  }
  const painPoints: PainPointEntry[] = [...painMap.entries()]
    .map(([text, count]) => ({ text, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 30);
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

  // --- Model performance ---
  const modelMap = new Map<
    string,
    { count: number; latencies: number[]; cost: number }
  >();
  for (const m of messages) {
    const name = m.model ?? 'unknown';
    const entry = modelMap.get(name) ?? { count: 0, latencies: [], cost: 0 };
    entry.count += 1;
    if (typeof m.latency_ms === 'number' && m.latency_ms > 0)
      entry.latencies.push(m.latency_ms);
    if (typeof m.cost_usd === 'number') entry.cost += m.cost_usd;
    modelMap.set(name, entry);
  }
  const models: ModelEntry[] = [...modelMap.entries()]
    .map(([model, e]) => ({
      model,
      messages: e.count,
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
    }))
    .sort((a, b) => b.messages - a.messages);

  const response: InsightsResponse = {
    since,
    painPoints,
    decisionRoles,
    models,
    totalLeadsWithPainPoint,
    totalLeadsWithRole,
    generatedAt: new Date().toISOString(),
  };

  return NextResponse.json(response, {
    headers: { 'Cache-Control': 'no-store' },
  });
}
