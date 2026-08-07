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

const EMPTY_STATS = {
  contacts: { total: 0, new: 0 },
  chatLeads: { total: 0, new: 0 },
  playbookLeads: { total: 0, new: 0 },
  whitepaperLeads: { total: 0, new: 0 },
  eventLeads: { total: 0, new: 0 },
  caseStudies: { total: 0, published: 0 },
  blogPosts: { total: 0, published: 0 },
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
    ] = await Promise.all([
      count('contacts'),
      count('contacts', { column: 'status', value: 'new' }),
      count('chat_leads'),
      count('chat_leads', { column: 'status', value: 'new' }),
      count('playbook_leads'),
      count('playbook_leads', { column: 'status', value: 'new' }),
      count('whitepaper_leads'),
      count('whitepaper_leads', { column: 'status', value: 'new' }),
      count('event_leads'),
      count('event_leads', { column: 'status', value: 'new' }),
      count('case_studies'),
      count('case_studies', { column: 'status', value: 'published' }),
      count('blog_posts'),
      publishedBlogCount(),
    ]);

    const [contacts, chatLeads, playbookLeads, whitepaperLeads, eventLeads] = await Promise.all([
      recent('contacts', 'id, name, email, company, inquiry_type, created_at, status, intelligence', 3),
      recent(
        'chat_leads',
        'id, name, email, company, service_interest, created_at, status, lead_score, intelligence',
        3,
      ),
      recent('playbook_leads', 'id, name, email, company, playbook_title, created_at, status', 2),
      recent('whitepaper_leads', 'id, name, email, company, whitepaper_title, created_at, status', 2),
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
        status: p.status as string,
        type: 'playbook' as const,
        source: p.playbook_title as string,
      })),
      ...whitepaperLeads.map((w) => ({
        id: w.id as string,
        name: w.name as string,
        email: w.email as string,
        company: w.company as string | undefined,
        created_at: w.created_at as string,
        status: w.status as string,
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

    // A partial read is worse than a visible failure: the dashboard would
    // under-report leads and look like a quiet week.
    if (errors.length > 0) {
      console.error('Admin stats read errors:', errors);
      return NextResponse.json(
        {
          error: errors.join('; '),
          stats: {
            contacts: { total: totalContacts, new: newContacts },
            chatLeads: { total: totalChatLeads, new: newChatLeads },
            playbookLeads: { total: totalPlaybookLeads, new: newPlaybookLeads },
            whitepaperLeads: { total: totalWhitepaperLeads, new: newWhitepaperLeads },
            eventLeads: { total: totalEventLeads, new: newEventLeads },
            caseStudies: { total: totalCaseStudies, published: publishedCaseStudies },
            blogPosts: { total: totalBlog, published: publishedBlog },
          },
          recentLeads,
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      stats: {
        contacts: { total: totalContacts, new: newContacts },
        chatLeads: { total: totalChatLeads, new: newChatLeads },
        playbookLeads: { total: totalPlaybookLeads, new: newPlaybookLeads },
        whitepaperLeads: { total: totalWhitepaperLeads, new: newWhitepaperLeads },
        eventLeads: { total: totalEventLeads, new: newEventLeads },
        caseStudies: { total: totalCaseStudies, published: publishedCaseStudies },
        blogPosts: { total: totalBlog, published: publishedBlog },
      },
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
