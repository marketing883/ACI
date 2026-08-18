import { NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase';

// Dashboard counts and the recent-leads feed, read with the service-role
// key so Row Level Security does not silently empty them.
//
// The dashboard used to count these tables from the browser with the anon
// singleton in src/lib/supabase.ts. That client carries no session (login
// uses the cookie-backed client in src/lib/supabase-browser.ts), so every
// read was anonymous: RLS denied playbook_leads, whitepaper_leads and
// newsletter_subscribers, the errors were swallowed into 0, and the
// dashboard disagreed with the list pages next to it. Commit 714f21f moved
// the list pages onto service-role routes and left the dashboard behind.
//
// Auth is enforced upstream by src/middleware.ts on every /api/admin/*
// path. This route is not on the PUBLIC_READ_ADMIN_PATHS allowlist.

export const dynamic = 'force-dynamic';

function configured(): boolean {
  return !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

// "New" means created in the last seven days, on every table. It used to
// mean status = 'new', which is a triage state, not a date: it never
// expires on its own, so the "New This Week" card only went down when
// somebody worked a lead by hand. Worse, playbook_leads and
// whitepaper_leads have no status column at all (supabase/schema.sql:234
// and :264 - they track a download with token_used, and the STEP 2
// backfill block skips them on purpose), so those two counts failed with
// 42703 on every load and took the whole response down with them.
const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

const EMPTY_STATS = {
  contacts: { total: 0, new: 0 },
  chatLeads: { total: 0, new: 0 },
  playbookLeads: { total: 0, new: 0 },
  whitepaperLeads: { total: 0, new: 0 },
  eventLeads: { total: 0, new: 0 },
  caseStudies: { total: 0, published: 0 },
  blogPosts: { total: 0, published: 0 },
  whitepapers: { total: 0, published: 0 },
  webinars: { total: 0, upcoming: 0 },
  avgLeadScore: null as number | null,
};

interface RecentLead {
  id: string;
  name: string;
  email: string;
  company?: string;
  type: 'contact' | 'chat' | 'playbook' | 'whitepaper' | 'event';
  source?: string;
  created_at: string;
  status: string;
  lead_score?: number;
}

type Row = Record<string, unknown>;

export async function GET() {
  try {
    if (!configured()) {
      return NextResponse.json({ stats: EMPTY_STATS, recentLeads: [], demo: true });
    }

    const supabase = getServiceSupabase();
    const errors: string[] = [];

    // Counts a table, recording rather than swallowing failures. A table
    // that cannot be read must not look like a table with no rows.
    const count = async (table: string, filter?: { column: string; value: unknown }) => {
      let query = supabase.from(table).select('*', { count: 'exact', head: true });
      if (filter) query = query.eq(filter.column, filter.value);
      const { count: n, error } = await query;
      if (error) {
        errors.push(`${table}: ${error.message}`);
        return 0;
      }
      return n ?? 0;
    };

    // Rows created inside the window. Every lead table has created_at, so
    // this works the same everywhere and does not depend on a triage
    // column that only some of them carry.
    const countSince = async (table: string, iso: string) => {
      const { count: n, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true })
        .gte('created_at', iso);
      if (error) {
        errors.push(`${table}: ${error.message}`);
        return 0;
      }
      return n ?? 0;
    };

    const recent = async (table: string, columns: string, limit: number): Promise<Row[]> => {
      const { data, error } = await supabase
        .from(table)
        .select(columns)
        .order('created_at', { ascending: false })
        .limit(limit);
      if (error) {
        errors.push(`${table}: ${error.message}`);
        return [];
      }
      return (data as unknown as Row[]) || [];
    };

    // Mean of every lead score we actually hold. The card used to print a
    // hardcoded '78', which is how it kept showing a healthy number while
    // every real count beside it read 0. Null when we hold none - the
    // dashboard renders a dash rather than inventing a score.
    //
    // Capped at the 1000 newest rows per table: this is a summary tile, not
    // a report, and it should not get slower as the pipeline grows.
    const avgLeadScore = async (): Promise<number | null> => {
      const pull = async (table: string, columns: string) => {
        const { data, error } = await supabase
          .from(table)
          .select(columns)
          .order('created_at', { ascending: false })
          .limit(1000);
        if (error) {
          errors.push(`${table}: ${error.message}`);
          return [];
        }
        return (data as unknown as Row[]) || [];
      };

      const [chat, contactRows] = await Promise.all([
        pull('chat_leads', 'lead_score, intelligence, created_at'),
        pull('contacts', 'intelligence, created_at'),
      ]);

      const scores = [...chat, ...contactRows]
        .map((r) => ((r.intelligence as Row | null)?.leadScore ?? r.lead_score) as unknown)
        .filter((s): s is number => typeof s === 'number' && Number.isFinite(s));

      if (scores.length === 0) return null;
      return Math.round(scores.reduce((sum, s) => sum + s, 0) / scores.length);
    };

    const publishedBlogCount = async () => {
      const { count: n, error } = await supabase
        .from('blog_posts')
        .select('*', { count: 'exact', head: true })
        .not('published_at', 'is', null);
      if (error) {
        errors.push(`blog_posts: ${error.message}`);
        return 0;
      }
      return n ?? 0;
    };

    const weekAgo = new Date(Date.now() - WEEK_MS).toISOString();

    const [
      totalContacts,
      newContacts,
      totalChatLeads,
      newChatLeads,
      totalPlaybookLeads,
      newPlaybookLeads,
      totalWhitepaperLeads,
      newWhitepaperLeads,
      totalEventLeads,
      newEventLeads,
      totalCaseStudies,
      publishedCaseStudies,
      totalBlog,
      publishedBlog,
      totalWhitepapers,
      publishedWhitepapers,
      totalWebinars,
      upcomingWebinars,
      leadScore,
    ] = await Promise.all([
      count('contacts'),
      countSince('contacts', weekAgo),
      count('chat_leads'),
      countSince('chat_leads', weekAgo),
      count('playbook_leads'),
      countSince('playbook_leads', weekAgo),
      count('whitepaper_leads'),
      countSince('whitepaper_leads', weekAgo),
      count('event_leads'),
      countSince('event_leads', weekAgo),
      count('case_studies'),
      count('case_studies', { column: 'status', value: 'published' }),
      count('blog_posts'),
      publishedBlogCount(),
      count('whitepapers'),
      count('whitepapers', { column: 'status', value: 'published' }),
      count('webinars'),
      count('webinars', { column: 'status', value: 'upcoming' }),
      avgLeadScore(),
    ]);

    const [contacts, chatLeads, playbookLeads, whitepaperLeads, eventLeads] = await Promise.all([
      recent('contacts', 'id, name, email, company, inquiry_type, created_at, status, intelligence', 3),
      recent(
        'chat_leads',
        'id, name, email, company, service_interest, created_at, status, lead_score, intelligence',
        3,
      ),
      // token_used, not status: these two tables record a download, not a
      // triage state, and have no status column to select.
      recent(
        'playbook_leads',
        'id, name, email, company, playbook_title, created_at, token_used',
        2,
      ),
      recent(
        'whitepaper_leads',
        'id, name, email, company, whitepaper_title, created_at, token_used',
        2,
      ),
      recent('event_leads', 'id, full_name, email, company_name, created_at, status', 3),
    ]);

    const recentLeads: RecentLead[] = [
      ...contacts.map((c) => ({
        id: c.id as string,
        name: c.name as string,
        email: c.email as string,
        company: c.company as string | undefined,
        created_at: c.created_at as string,
        status: c.status as string,
        type: 'contact' as const,
        source: c.inquiry_type as string,
        lead_score: (c.intelligence as Row | null)?.leadScore as number | undefined,
      })),
      ...chatLeads.map((c) => ({
        id: c.id as string,
        name: c.name as string,
        email: c.email as string,
        company: c.company as string | undefined,
        created_at: c.created_at as string,
        status: c.status as string,
        type: 'chat' as const,
        source: c.service_interest as string,
        lead_score: ((c.intelligence as Row | null)?.leadScore || c.lead_score) as
          | number
          | undefined,
      })),
      ...playbookLeads.map((p) => ({
        id: p.id as string,
        name: p.name as string,
        email: p.email as string,
        company: p.company as string | undefined,
        created_at: p.created_at as string,
        status: p.token_used ? 'downloaded' : 'new',
        type: 'playbook' as const,
        source: p.playbook_title as string,
      })),
      ...whitepaperLeads.map((w) => ({
        id: w.id as string,
        name: w.name as string,
        email: w.email as string,
        company: w.company as string | undefined,
        created_at: w.created_at as string,
        status: w.token_used ? 'downloaded' : 'new',
        type: 'whitepaper' as const,
        source: w.whitepaper_title as string,
      })),
      ...eventLeads.map((e) => ({
        id: e.id as string,
        name: e.full_name as string,
        email: e.email as string,
        company: e.company_name as string | undefined,
        created_at: e.created_at as string,
        status: e.status as string,
        type: 'event' as const,
        source: 'AION 2026',
      })),
    ]
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 6);

    const stats = {
      contacts: { total: totalContacts, new: newContacts },
      chatLeads: { total: totalChatLeads, new: newChatLeads },
      playbookLeads: { total: totalPlaybookLeads, new: newPlaybookLeads },
      whitepaperLeads: { total: totalWhitepaperLeads, new: newWhitepaperLeads },
      eventLeads: { total: totalEventLeads, new: newEventLeads },
      caseStudies: { total: totalCaseStudies, published: publishedCaseStudies },
      blogPosts: { total: totalBlog, published: publishedBlog },
      whitepapers: { total: totalWhitepapers, published: publishedWhitepapers },
      webinars: { total: totalWebinars, upcoming: upcomingWebinars },
      avgLeadScore: leadScore,
    };

    // A partial read is worse than a visible failure: the dashboard would
    // under-report leads and look like a quiet week. The counts that did
    // come back ship with the error so the page can show them - it is the
    // caller's job not to throw them away.
    if (errors.length > 0) {
      console.error('Admin stats read errors:', errors);
      return NextResponse.json(
        {
          error: errors.join('; '),
          stats,
          recentLeads,
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      stats,
      recentLeads,
    });
  } catch (error) {
    console.error('Admin stats GET error:', error);
    return NextResponse.json(
      { error: 'Failed to load dashboard stats', stats: EMPTY_STATS, recentLeads: [] },
      { status: 500 },
    );
  }
}
