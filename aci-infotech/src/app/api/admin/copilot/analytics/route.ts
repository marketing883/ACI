/**
 * Atheros analytics summary.
 *
 * GET /api/admin/copilot/analytics?since=24h|7d|30d
 * Returns aggregated counts + cost + latency stats for the dashboard.
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

interface MessageRow {
  cost_usd: string | number | null;
  latency_ms: number | null;
  model: string | null;
  session_id: string;
  role: string;
  created_at: string;
}

interface SessionRow {
  session_id: string;
  started_at: string;
  page_entry: string | null;
  handoff_at: string | null;
}

interface LeadRow {
  session_id: string;
  email: string | null;
  service_interest: string | null;
}

interface ErrorRow {
  severity: string;
}

function p(arr: number[], pct: number): number {
  if (arr.length === 0) return 0;
  const sorted = [...arr].sort((a, b) => a - b);
  const idx = Math.min(sorted.length - 1, Math.floor((pct / 100) * sorted.length));
  return sorted[idx];
}

export async function GET(request: Request) {
  const user = await getUser();
  if (!user) return NextResponse.json({ ok: false, reason: 'unauthorized' }, { status: 401 });
  const supabase = serviceRoleClient();
  if (!supabase) return NextResponse.json({ ok: false, reason: 'no-service-role' }, { status: 500 });

  const since = new URL(request.url).searchParams.get('since') ?? '24h';
  const sinceMs =
    since === '24h' ? 24 * 60 * 60 * 1000 :
    since === '7d'  ? 7 * 24 * 60 * 60 * 1000 :
    since === '30d' ? 30 * 24 * 60 * 60 * 1000 :
    24 * 60 * 60 * 1000;
  const sinceISO = new Date(Date.now() - sinceMs).toISOString();

  try {
    const [messagesRes, sessionsRes, leadsRes, errorsRes] = await Promise.all([
      supabase
        .from('chat_messages')
        .select('cost_usd,latency_ms,model,session_id,role,created_at')
        .gte('created_at', sinceISO)
        .limit(50000),
      supabase
        .from('chat_sessions')
        .select('session_id,started_at,page_entry,handoff_at')
        .gte('started_at', sinceISO)
        .limit(10000),
      supabase
        .from('chat_leads')
        .select('session_id,email,service_interest')
        .gte('created_at', sinceISO)
        .limit(5000),
      supabase
        .from('chat_errors')
        .select('severity')
        .gte('created_at', sinceISO)
        .limit(20000),
    ]);

    if (messagesRes.error) log.warn('init', messagesRes.error, { route: '/api/admin/copilot/analytics' });

    const messages = (messagesRes.data ?? []) as MessageRow[];
    const sessions = (sessionsRes.data ?? []) as SessionRow[];
    const leads = (leadsRes.data ?? []) as LeadRow[];
    const errors = (errorsRes.data ?? []) as ErrorRow[];

    const totalCost = messages.reduce(
      (s, m) =>
        s + (typeof m.cost_usd === 'string' ? Number.parseFloat(m.cost_usd) || 0 : m.cost_usd ?? 0),
      0,
    );

    const assistantLatencies = messages
      .filter((m) => m.role === 'assistant' && typeof m.latency_ms === 'number')
      .map((m) => m.latency_ms as number);
    const sessionCount = sessions.length;
    const handoffs = sessions.filter((s) => s.handoff_at).length;
    const qualified = leads.filter((l) => !!l.email).length;
    const messageCount = messages.length;
    const errorRate = sessionCount > 0 ? errors.length / sessionCount : 0;

    // Top pages: by session start.
    const pageCounts = new Map<string, number>();
    for (const s of sessions) {
      const p = s.page_entry ?? 'unknown';
      pageCounts.set(p, (pageCounts.get(p) ?? 0) + 1);
    }
    const topPages = Array.from(pageCounts.entries())
      .map(([page, count]) => ({ page, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Top models used.
    const modelCounts = new Map<string, number>();
    for (const m of messages) {
      const key = m.model ?? 'unknown';
      modelCounts.set(key, (modelCounts.get(key) ?? 0) + 1);
    }
    const topModels = Array.from(modelCounts.entries())
      .map(([model, count]) => ({ model, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);

    // Service interests.
    const serviceCounts = new Map<string, number>();
    for (const l of leads) {
      const key = l.service_interest ?? 'unspecified';
      serviceCounts.set(key, (serviceCounts.get(key) ?? 0) + 1);
    }
    const topServices = Array.from(serviceCounts.entries())
      .map(([service, count]) => ({ service, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    return NextResponse.json({
      ok: true,
      since,
      summary: {
        sessions: sessionCount,
        messages: messageCount,
        qualifiedLeads: qualified,
        handoffs,
        totalCostUsd: Number(totalCost.toFixed(4)),
        avgCostPerSession: sessionCount > 0 ? Number((totalCost / sessionCount).toFixed(5)) : 0,
        avgCostPerLead: qualified > 0 ? Number((totalCost / qualified).toFixed(4)) : 0,
        p50LatencyMs: p(assistantLatencies, 50),
        p95LatencyMs: p(assistantLatencies, 95),
        avgTurnsPerSession:
          sessionCount > 0
            ? Number((messages.filter((m) => m.role === 'user').length / sessionCount).toFixed(2))
            : 0,
        conversionRate:
          sessionCount > 0 ? Number((qualified / sessionCount).toFixed(3)) : 0,
        errorRatePerSession: Number(errorRate.toFixed(3)),
      },
      topPages,
      topModels,
      topServices,
    });
  } catch (err) {
    log.error('init', err, { route: '/api/admin/copilot/analytics' });
    return NextResponse.json({ ok: false, reason: 'unexpected' }, { status: 500 });
  }
}
