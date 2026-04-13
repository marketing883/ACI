/**
 * GET /api/admin/copilot/content-gaps
 *
 * Returns the user prompts where retrieval returned nothing useful,
 * so the content team has a prioritized list of topics to write.
 * A "gap" is defined as:
 *   - retrieval_summary.topK === 0, OR
 *   - retrieval_summary.topSimilarity < threshold (default 0.35).
 *
 * Joined with the preceding user message so we surface the actual
 * question the visitor asked, not the assistant reply.
 *
 * Query params:
 *   since:     '24h' | '7d' | '30d' (default '7d')
 *   threshold: float 0..1 (default 0.35)
 *   limit:     max rows (default 50, max 200)
 */

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getUser } from '@/lib/supabase-server';
import { log } from '@/lib/copilot/logger';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

interface AssistantRow {
  message_id: string;
  session_id: string;
  created_at: string;
  retrieval_summary: {
    topK?: number;
    topSimilarity?: number;
    sourceTypes?: string[];
  } | null;
}

interface UserRow {
  session_id: string;
  content: string | null;
  created_at: string;
}

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
  if (!user) return NextResponse.json({ ok: false, reason: 'unauthorized' }, { status: 401 });
  const supabase = serviceRoleClient();
  if (!supabase) return NextResponse.json({ ok: false, reason: 'no-service-role' }, { status: 500 });

  const url = new URL(request.url);
  const since = url.searchParams.get('since') ?? '7d';
  const threshold = Number.parseFloat(url.searchParams.get('threshold') ?? '0.35') || 0.35;
  const limit = Math.min(200, Number.parseInt(url.searchParams.get('limit') ?? '50', 10) || 50);

  const sinceMs =
    since === '24h' ? 24 * 60 * 60 * 1000 :
    since === '30d' ? 30 * 24 * 60 * 60 * 1000 :
    7 * 24 * 60 * 60 * 1000;
  const sinceISO = new Date(Date.now() - sinceMs).toISOString();

  try {
    const { data: assistants, error: aErr } = await supabase
      .from('chat_messages')
      .select('message_id,session_id,created_at,retrieval_summary')
      .eq('role', 'assistant')
      .gte('created_at', sinceISO)
      .not('retrieval_summary', 'is', null)
      .order('created_at', { ascending: false })
      .limit(1000);
    if (aErr) {
      log.warn('init', aErr, { route: '/api/admin/copilot/content-gaps' });
      return NextResponse.json({ ok: false, reason: aErr.message }, { status: 500 });
    }

    // Filter assistant rows whose retrieval fell below the threshold.
    const gapRows: AssistantRow[] = (assistants ?? [])
      .filter((r) => {
        const rs = r.retrieval_summary as AssistantRow['retrieval_summary'];
        if (!rs) return false;
        const topK = typeof rs.topK === 'number' ? rs.topK : 0;
        const sim = typeof rs.topSimilarity === 'number' ? rs.topSimilarity : 0;
        return topK === 0 || sim < threshold;
      })
      .slice(0, limit) as AssistantRow[];

    if (gapRows.length === 0) return NextResponse.json({ ok: true, gaps: [] });

    // Find the immediately preceding user message in each session (the
    // question that triggered the weak retrieval). One query for the
    // whole batch; we'll match by (session_id, timestamp < assistant).
    const sessionIds = Array.from(new Set(gapRows.map((r) => r.session_id)));
    const { data: userMsgs, error: uErr } = await supabase
      .from('chat_messages')
      .select('session_id,content,created_at')
      .eq('role', 'user')
      .in('session_id', sessionIds)
      .gte('created_at', sinceISO)
      .order('created_at', { ascending: true })
      .limit(5000);
    if (uErr) {
      log.warn('init', uErr, { route: '/api/admin/copilot/content-gaps', extra: { phase: 'user-msgs' } });
    }

    const userMessages: UserRow[] = (userMsgs ?? []) as UserRow[];

    const bySession = new Map<string, UserRow[]>();
    for (const u of userMessages) {
      if (!bySession.has(u.session_id)) bySession.set(u.session_id, []);
      bySession.get(u.session_id)!.push(u);
    }

    const gaps = gapRows.map((r) => {
      const userTurns = bySession.get(r.session_id) ?? [];
      const precedingUser = [...userTurns]
        .reverse()
        .find((u) => u.created_at < r.created_at);
      const rs = r.retrieval_summary;
      return {
        message_id: r.message_id,
        session_id: r.session_id,
        created_at: r.created_at,
        top_k: rs?.topK ?? 0,
        top_similarity: rs?.topSimilarity ?? 0,
        source_types: rs?.sourceTypes ?? [],
        user_question: precedingUser?.content ?? '(unknown)',
      };
    });

    return NextResponse.json({ ok: true, gaps });
  } catch (err) {
    log.error('init', err, { route: '/api/admin/copilot/content-gaps' });
    return NextResponse.json({ ok: false, reason: 'unexpected' }, { status: 500 });
  }
}
