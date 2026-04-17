import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/**
 * GET /api/admin/analytics/content?since=24h|7d|30d
 *
 * Content performance: which pages drive chat opens and email captures.
 * Merges three data sources by page path:
 *   1. page_views (total views per page_path)
 *   2. chat_sessions (count per page_entry — the page the visitor was on
 *      when Atheros opened)
 *   3. chat_leads (email captures per chat_session.session_id → grouped
 *      back to page_entry)
 *
 * Also computes time-to-qualify: avg minutes from chat_session.started_at
 * to the first chat_leads.created_at with email, across all sessions.
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

export interface ContentRow {
  pagePath: string;
  views: number;
  chatOpens: number;
  emailCaptures: number;
  chatOpenRate: number | null;
  conversionRate: number | null;
}

export interface ChannelRow {
  source: string;
  medium: string;
  visitors: number;
  topLandingPages: string[];
  chatOpens: number;
  emailCaptures: number;
  conversionRate: number | null;
}

export interface ContentResponse {
  since: SinceKey;
  rangeStart: string;
  rangeEnd: string;
  pages: ContentRow[];
  channels: ChannelRow[];
  avgTimeToQualifyMinutes: number | null;
  p50TimeToQualifyMinutes: number | null;
  p95TimeToQualifyMinutes: number | null;
  totalViews: number;
  totalChatOpens: number;
  totalEmailCaptures: number;
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

  // Fire all four queries in parallel.
  const [viewsResult, sessionsResult, leadsResult, utmResult] = await Promise.all([
    // 1. Page views in window, grouped client-side by page_path.
    supabase
      .from('page_views')
      .select('page_path')
      .gte('entered_at', startIso)
      .lte('entered_at', endIso)
      .limit(50_000),
    // 2. Chat sessions in window — we need page_entry + session_id + started_at.
    supabase
      .from('chat_sessions')
      .select('session_id, page_entry, started_at')
      .gte('started_at', startIso)
      .lte('started_at', endIso)
      .limit(10_000),
    // 3. Chat leads with email in window — we need session_id + created_at.
    supabase
      .from('chat_leads')
      .select('session_id, created_at')
      .not('email', 'is', null)
      .gte('created_at', startIso)
      .lte('created_at', endIso)
      .limit(10_000),
    // 4. Visitor sessions with UTM data for channel attribution.
    supabase
      .from('visitor_sessions')
      .select('utm_source, utm_medium, utm_campaign, entry_page_path')
      .gte('started_at', startIso)
      .lte('started_at', endIso)
      .limit(50_000),
  ]);

  // ----- Aggregate page views by path -----
  const viewsByPath = new Map<string, number>();
  for (const row of (viewsResult.data ?? []) as Array<{ page_path: string }>) {
    const p = row.page_path ?? '/';
    viewsByPath.set(p, (viewsByPath.get(p) ?? 0) + 1);
  }

  // ----- Aggregate chat opens by page_entry -----
  const chatOpensByPath = new Map<string, number>();
  const sessionEntryPage = new Map<string, string>();
  const sessionStartedAt = new Map<string, string>();
  for (const row of (sessionsResult.data ?? []) as Array<{
    session_id: string;
    page_entry: string | null;
    started_at: string;
  }>) {
    const p = row.page_entry ?? '/';
    chatOpensByPath.set(p, (chatOpensByPath.get(p) ?? 0) + 1);
    sessionEntryPage.set(row.session_id, p);
    sessionStartedAt.set(row.session_id, row.started_at);
  }

  // ----- Aggregate email captures by page_entry (via session_id) -----
  const emailsByPath = new Map<string, number>();
  const qualifyDeltas: number[] = [];
  for (const row of (leadsResult.data ?? []) as Array<{
    session_id: string;
    created_at: string;
  }>) {
    const entryPage = sessionEntryPage.get(row.session_id);
    if (entryPage) {
      emailsByPath.set(entryPage, (emailsByPath.get(entryPage) ?? 0) + 1);
    }
    const chatStarted = sessionStartedAt.get(row.session_id);
    if (chatStarted) {
      const deltaMs =
        new Date(row.created_at).getTime() - new Date(chatStarted).getTime();
      if (deltaMs > 0) qualifyDeltas.push(deltaMs);
    }
  }

  // ----- Merge all three aggregations into page rows -----
  const allPaths = new Set([
    ...viewsByPath.keys(),
    ...chatOpensByPath.keys(),
    ...emailsByPath.keys(),
  ]);
  const pages: ContentRow[] = [];
  let totalViews = 0;
  let totalChatOpens = 0;
  let totalEmailCaptures = 0;
  for (const pagePath of allPaths) {
    const views = viewsByPath.get(pagePath) ?? 0;
    const chatOpens = chatOpensByPath.get(pagePath) ?? 0;
    const emailCaptures = emailsByPath.get(pagePath) ?? 0;
    totalViews += views;
    totalChatOpens += chatOpens;
    totalEmailCaptures += emailCaptures;
    pages.push({
      pagePath,
      views,
      chatOpens,
      emailCaptures,
      chatOpenRate: views > 0 ? chatOpens / views : null,
      conversionRate: chatOpens > 0 ? emailCaptures / chatOpens : null,
    });
  }
  // Sort by email captures descending, then by chat opens.
  pages.sort(
    (a, b) =>
      b.emailCaptures - a.emailCaptures || b.chatOpens - a.chatOpens,
  );

  // ----- Time to qualify (avg + percentiles) -----
  const sortedDeltas = qualifyDeltas.slice().sort((a, b) => a - b);
  const percentile = (arr: number[], p: number): number | null => {
    if (arr.length === 0) return null;
    const idx = Math.ceil(arr.length * p) - 1;
    return Math.round(arr[Math.max(0, idx)] / 60_000);
  };
  const avgTimeToQualifyMinutes =
    sortedDeltas.length > 0
      ? Math.round(
          sortedDeltas.reduce((a, b) => a + b, 0) /
            sortedDeltas.length /
            60_000,
        )
      : null;
  const p50TimeToQualifyMinutes = percentile(sortedDeltas, 0.5);
  const p95TimeToQualifyMinutes = percentile(sortedDeltas, 0.95);

  // ----- Channel attribution (UTM) -----
  // Group visitor_sessions by (utm_source, utm_medium). For each channel,
  // collect the landing pages and cross-reference with the page-level
  // chat/email data we already computed above.
  const channelKey = (s: string | null, m: string | null) =>
    `${(s || 'direct').toLowerCase()}::${(m || 'none').toLowerCase()}`;

  const channelMap = new Map<
    string,
    { source: string; medium: string; visitors: number; landingPages: Map<string, number> }
  >();
  for (const row of (utmResult.data ?? []) as Array<{
    utm_source: string | null;
    utm_medium: string | null;
    entry_page_path: string | null;
  }>) {
    const src = row.utm_source?.trim() || 'direct';
    const med = row.utm_medium?.trim() || 'none';
    const key = channelKey(src, med);
    const entry = channelMap.get(key) ?? {
      source: src,
      medium: med,
      visitors: 0,
      landingPages: new Map<string, number>(),
    };
    entry.visitors += 1;
    const lp = row.entry_page_path ?? '/';
    entry.landingPages.set(lp, (entry.landingPages.get(lp) ?? 0) + 1);
    channelMap.set(key, entry);
  }

  const channels: ChannelRow[] = [...channelMap.values()]
    .map((ch) => {
      // Top 3 landing pages by visitor count.
      const topPages = [...ch.landingPages.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([p]) => p);
      // Sum chat opens + email captures across the channel's landing pages.
      let chChatOpens = 0;
      let chEmailCaptures = 0;
      for (const lp of ch.landingPages.keys()) {
        chChatOpens += chatOpensByPath.get(lp) ?? 0;
        chEmailCaptures += emailsByPath.get(lp) ?? 0;
      }
      return {
        source: ch.source,
        medium: ch.medium,
        visitors: ch.visitors,
        topLandingPages: topPages,
        chatOpens: chChatOpens,
        emailCaptures: chEmailCaptures,
        conversionRate:
          chChatOpens > 0 ? chEmailCaptures / chChatOpens : null,
      };
    })
    .filter((ch) => ch.source !== 'direct' || ch.visitors >= 3)
    .sort((a, b) => b.emailCaptures - a.emailCaptures || b.visitors - a.visitors)
    .slice(0, 20);

  const response: ContentResponse = {
    since,
    rangeStart: startIso,
    rangeEnd: endIso,
    pages: pages.slice(0, 50),
    channels,
    avgTimeToQualifyMinutes,
    p50TimeToQualifyMinutes,
    p95TimeToQualifyMinutes,
    totalViews,
    totalChatOpens,
    totalEmailCaptures,
    generatedAt: new Date().toISOString(),
  };

  return NextResponse.json(response, {
    headers: { 'Cache-Control': 'no-store' },
  });
}
