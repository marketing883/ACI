'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Users,
  FileText,
  BookOpen,
  Download,
  TrendingUp,
  ArrowRight,
  Clock,
  AlertCircle,
  FileCheck,
  MessageSquare,
  Video,
  BarChart3,
  Activity,
  Sparkles,
  Target,
  Calendar,
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

interface DashboardStats {
  contacts: { total: number; new: number };
  chatLeads: { total: number; new: number };
  playbookLeads: { total: number; new: number };
  whitepaperLeads: { total: number; new: number };
  caseStudies: { total: number; published: number };
  blogPosts: { total: number; published: number };
}

interface RecentLead {
  id: string;
  name: string;
  email: string;
  company?: string;
  type: 'contact' | 'chat' | 'playbook' | 'whitepaper';
  source?: string;
  created_at: string;
  status: string;
  lead_score?: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    contacts: { total: 0, new: 0 },
    chatLeads: { total: 0, new: 0 },
    playbookLeads: { total: 0, new: 0 },
    whitepaperLeads: { total: 0, new: 0 },
    caseStudies: { total: 0, published: 0 },
    blogPosts: { total: 0, published: 0 },
  });
  const [recentLeads, setRecentLeads] = useState<RecentLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [configured, setConfigured] = useState(false);

  useEffect(() => {
    const isConfigured = isSupabaseConfigured();
    setConfigured(isConfigured);

    if (isConfigured) {
      fetchDashboardData();
    } else {
      // Use mock data when Supabase is not configured
      setStats({
        contacts: { total: 47, new: 12 },
        chatLeads: { total: 23, new: 8 },
        playbookLeads: { total: 28, new: 8 },
        whitepaperLeads: { total: 35, new: 5 },
        caseStudies: { total: 12, published: 10 },
        blogPosts: { total: 24, published: 18 },
      });
      setRecentLeads([
        {
          id: '1',
          name: 'John Smith',
          email: 'john@acmecorp.com',
          company: 'Acme Corp',
          type: 'contact',
          source: 'Architecture Call',
          created_at: new Date().toISOString(),
          status: 'new',
          lead_score: 85,
        },
        {
          id: '2',
          name: 'Sarah Chen',
          email: 'schen@techcorp.com',
          company: 'TechCorp Industries',
          type: 'chat',
          source: 'Databricks',
          created_at: new Date(Date.now() - 3600000).toISOString(),
          status: 'new',
          lead_score: 92,
        },
        {
          id: '3',
          name: 'Sarah Johnson',
          email: 'sarah@techstartup.io',
          company: 'TechStartup',
          type: 'playbook',
          source: 'Hadoop → Cloud',
          created_at: new Date(Date.now() - 86400000).toISOString(),
          status: 'new',
        },
        {
          id: '4',
          name: 'Michael Chen',
          email: 'mchen@enterprise.com',
          company: 'Enterprise Co',
          type: 'whitepaper',
          source: 'AI Governance Playbook',
          created_at: new Date(Date.now() - 172800000).toISOString(),
          status: 'new',
        },
        {
          id: '5',
          name: 'Emily Davis',
          email: 'emily@retailcorp.com',
          company: 'RetailCorp',
          type: 'chat',
          source: 'MarTech',
          created_at: new Date(Date.now() - 259200000).toISOString(),
          status: 'contacted',
          lead_score: 78,
        },
      ]);
      setLoading(false);
    }
  }, []);

  async function fetchDashboardData() {
    try {
      // Helper to safely query with fallback for missing columns
      const safeCount = async (table: string, filter?: { column: string; value: unknown }) => {
        try {
          let query = supabase.from(table).select('*', { count: 'exact', head: true });
          if (filter) {
            query = query.eq(filter.column, filter.value);
          }
          const { count, error } = await query;
          if (error) return 0;
          return count || 0;
        } catch {
          return 0;
        }
      };

      // Fetch contacts stats
      const totalContacts = await safeCount('contacts');
      const newContacts = await safeCount('contacts', { column: 'status', value: 'new' });

      // Fetch chat leads stats
      const totalChatLeads = await safeCount('chat_leads');
      const newChatLeads = await safeCount('chat_leads', { column: 'status', value: 'new' });

      // Fetch playbook leads stats
      const totalPlaybookLeads = await safeCount('playbook_leads');
      const newPlaybookLeads = await safeCount('playbook_leads', { column: 'status', value: 'new' });

      // Fetch whitepaper leads stats
      const totalWhitepaperLeads = await safeCount('whitepaper_leads');
      const newWhitepaperLeads = await safeCount('whitepaper_leads', { column: 'status', value: 'new' });

      // Fetch case studies stats (uses status column)
      const totalCaseStudies = await safeCount('case_studies');
      const publishedCaseStudies = await safeCount('case_studies', { column: 'status', value: 'published' });

      // Fetch blog stats (uses published_at not null for published)
      const totalBlog = await safeCount('blog_posts');
      // For published blogs, count those with published_at not null
      let publishedBlog = 0;
      try {
        const { count, error } = await supabase
          .from('blog_posts')
          .select('*', { count: 'exact', head: true })
          .not('published_at', 'is', null);
        if (!error && count !== null) publishedBlog = count;
      } catch {
        // Ignore errors
      }

      setStats({
        contacts: { total: totalContacts, new: newContacts },
        chatLeads: { total: totalChatLeads, new: newChatLeads },
        playbookLeads: { total: totalPlaybookLeads, new: newPlaybookLeads },
        whitepaperLeads: { total: totalWhitepaperLeads, new: newWhitepaperLeads },
        caseStudies: { total: totalCaseStudies, published: publishedCaseStudies },
        blogPosts: { total: totalBlog, published: publishedBlog },
      });

      // Fetch recent leads from all sources
      const { data: contacts } = await supabase
        .from('contacts')
        .select('id, name, email, company, inquiry_type, created_at, status, intelligence')
        .order('created_at', { ascending: false })
        .limit(3);

      const { data: chatLeads } = await supabase
        .from('chat_leads')
        .select('id, name, email, company, service_interest, created_at, status, lead_score, intelligence')
        .order('created_at', { ascending: false })
        .limit(3);

      const { data: playbookLeads } = await supabase
        .from('playbook_leads')
        .select('id, name, email, company, playbook_title, created_at, status')
        .order('created_at', { ascending: false })
        .limit(2);

      const { data: whitepaperLeads } = await supabase
        .from('whitepaper_leads')
        .select('id, name, email, company, whitepaper_title, created_at, status')
        .order('created_at', { ascending: false })
        .limit(2);

      // Combine and sort all leads
      const allLeads: RecentLead[] = [
        ...(contacts || []).map((c: Record<string, unknown>) => ({
          id: c.id as string,
          name: c.name as string,
          email: c.email as string,
          company: c.company as string | undefined,
          created_at: c.created_at as string,
          status: c.status as string,
          type: 'contact' as const,
          source: c.inquiry_type as string,
          lead_score: (c.intelligence as Record<string, unknown>)?.leadScore as number | undefined,
        })),
        ...(chatLeads || []).map((c: Record<string, unknown>) => ({
          id: c.id as string,
          name: c.name as string,
          email: c.email as string,
          company: c.company as string | undefined,
          created_at: c.created_at as string,
          status: c.status as string,
          type: 'chat' as const,
          source: c.service_interest as string,
          lead_score: ((c.intelligence as Record<string, unknown>)?.leadScore || c.lead_score) as number | undefined,
        })),
        ...(playbookLeads || []).map((p: Record<string, unknown>) => ({
          id: p.id as string,
          name: p.name as string,
          email: p.email as string,
          company: p.company as string | undefined,
          created_at: p.created_at as string,
          status: p.status as string,
          type: 'playbook' as const,
          source: p.playbook_title as string,
        })),
        ...(whitepaperLeads || []).map((w: Record<string, unknown>) => ({
          id: w.id as string,
          name: w.name as string,
          email: w.email as string,
          company: w.company as string | undefined,
          created_at: w.created_at as string,
          status: w.status as string,
          type: 'whitepaper' as const,
          source: w.whitepaper_title as string,
        })),
      ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 6);

      setRecentLeads(allLeads);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }

  // Summary cards data
  const summaryCards = [
    {
      title: 'Total Leads',
      value: stats.contacts.total + stats.chatLeads.total + stats.playbookLeads.total + stats.whitepaperLeads.total,
      change: '+12%',
      changeType: 'positive',
      icon: Users,
    },
    {
      title: 'New This Week',
      value: stats.contacts.new + stats.chatLeads.new + stats.playbookLeads.new + stats.whitepaperLeads.new,
      change: '+8%',
      changeType: 'positive',
      icon: Activity,
    },
    {
      title: 'Avg Lead Score',
      value: '78',
      change: '+5%',
      changeType: 'positive',
      icon: Target,
    },
    {
      title: 'Content Published',
      value: stats.caseStudies.published + stats.blogPosts.published,
      change: '+3',
      changeType: 'neutral',
      icon: FileText,
    },
  ];

  // Lead category cards with links
  const leadCards = [
    {
      title: 'Contact Form',
      total: stats.contacts.total,
      new: stats.contacts.new,
      icon: FileText,
      color: 'from-blue-500 to-blue-600',
      bgLight: 'bg-blue-50',
      textColor: 'text-blue-600',
      href: '/admin/contacts',
    },
    {
      title: 'Chat Leads',
      total: stats.chatLeads.total,
      new: stats.chatLeads.new,
      icon: MessageSquare,
      color: 'from-violet-500 to-violet-600',
      bgLight: 'bg-violet-50',
      textColor: 'text-violet-600',
      href: '/admin/chat-leads',
    },
    {
      title: 'Playbook Downloads',
      total: stats.playbookLeads.total,
      new: stats.playbookLeads.new,
      icon: BookOpen,
      color: 'from-amber-500 to-amber-600',
      bgLight: 'bg-amber-50',
      textColor: 'text-amber-600',
      href: '/admin/playbook-leads',
    },
    {
      title: 'Whitepaper Downloads',
      total: stats.whitepaperLeads.total,
      new: stats.whitepaperLeads.new,
      icon: Download,
      color: 'from-emerald-500 to-emerald-600',
      bgLight: 'bg-emerald-50',
      textColor: 'text-emerald-600',
      href: '/admin/whitepaper-leads',
    },
  ];

  // Content cards
  const contentCards = [
    {
      title: 'Case Studies',
      total: stats.caseStudies.total,
      subtitle: `${stats.caseStudies.published} published`,
      icon: FileText,
      color: 'from-orange-500 to-orange-600',
      href: '/admin/case-studies',
    },
    {
      title: 'Blog Posts',
      total: stats.blogPosts.total,
      subtitle: `${stats.blogPosts.published} published`,
      icon: BookOpen,
      color: 'from-teal-500 to-teal-600',
      href: '/admin/blog',
    },
    {
      title: 'Whitepapers',
      total: 8,
      subtitle: '6 published',
      icon: FileCheck,
      color: 'from-indigo-500 to-indigo-600',
      href: '/admin/whitepapers',
    },
    {
      title: 'Webinars',
      total: 4,
      subtitle: '2 upcoming',
      icon: Video,
      color: 'from-pink-500 to-pink-600',
      href: '/admin/webinars',
    },
  ];

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  }

  function getLeadTypeLabel(type: 'contact' | 'chat' | 'playbook' | 'whitepaper') {
    const labels = {
      contact: { label: 'Contact', color: 'bg-blue-100 text-blue-700', icon: FileText },
      chat: { label: 'Chat', color: 'bg-violet-100 text-violet-700', icon: MessageSquare },
      playbook: { label: 'Playbook', color: 'bg-amber-100 text-amber-700', icon: BookOpen },
      whitepaper: { label: 'Whitepaper', color: 'bg-emerald-100 text-emerald-700', icon: Download },
    };
    return labels[type];
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome back. Here's what's happening with your leads.</p>
      </div>

      {!configured && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3">
          <div className="p-2 bg-amber-100 rounded-lg">
            <AlertCircle className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <p className="font-semibold text-amber-900">Demo Mode Active</p>
            <p className="text-sm text-amber-700">
              Showing sample data. Configure Supabase to connect to your database.
            </p>
          </div>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.title} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2.5 bg-gray-50 rounded-xl">
                  <Icon className="w-5 h-5 text-gray-600" />
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                  card.changeType === 'positive' ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-50 text-gray-600'
                }`}>
                  {card.change}
                </span>
              </div>
              <p className="text-3xl font-bold text-gray-900">
                {loading ? '...' : card.value.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500 mt-1">{card.title}</p>
            </div>
          );
        })}
      </div>

      {/* Atheros Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Atheros</h2>
          <Link
            href="/admin/copilot/live"
            className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
          >
            Live conversations <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/admin/copilot/live"
            className="block bg-white border border-gray-200 rounded-xl p-4 hover:border-[var(--aci-primary,#0052CC)] hover:shadow-sm transition"
          >
            <div className="text-xs uppercase tracking-wide text-gray-500">Live</div>
            <div className="mt-1 text-2xl font-bold text-gray-900">Conversations</div>
            <div className="mt-1 text-xs text-gray-500">
              Real-time feed, search, filters, replay drill-down.
            </div>
          </Link>
          <Link
            href="/admin/copilot/handoffs"
            className="block bg-white border border-gray-200 rounded-xl p-4 hover:border-[var(--aci-primary,#0052CC)] hover:shadow-sm transition"
          >
            <div className="text-xs uppercase tracking-wide text-gray-500">Handoffs</div>
            <div className="mt-1 text-2xl font-bold text-gray-900">Inbox</div>
            <div className="mt-1 text-xs text-gray-500">
              Take over when Atheros escalates. (Phase B)
            </div>
          </Link>
          <Link
            href="/admin/copilot/outcome-copy"
            className="block bg-white border border-gray-200 rounded-xl p-4 hover:border-[var(--aci-primary,#0052CC)] hover:shadow-sm transition"
          >
            <div className="text-xs uppercase tracking-wide text-gray-500">Outcome copy</div>
            <div className="mt-1 text-2xl font-bold text-gray-900">Overrides</div>
            <div className="mt-1 text-xs text-gray-500">
              Edit pill, peek, and CTA copy without a deploy. (Phase B)
            </div>
          </Link>
          <Link
            href="/admin/copilot/analytics"
            className="block bg-white border border-gray-200 rounded-xl p-4 hover:border-[var(--aci-primary,#0052CC)] hover:shadow-sm transition"
          >
            <div className="text-xs uppercase tracking-wide text-gray-500">Analytics</div>
            <div className="mt-1 text-2xl font-bold text-gray-900">Coming</div>
            <div className="mt-1 text-xs text-gray-500">
              Cost, latency, content gaps. (Phase C)
            </div>
          </Link>
        </div>
      </div>

      {/* Lead Categories Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Lead Sources</h2>
          <Link href="/admin/contacts" className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {leadCards.map((card) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.title}
                href={card.href}
                className="group bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200 transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 bg-gradient-to-br ${card.color} rounded-xl shadow-sm`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  {card.new > 0 && (
                    <span className={`px-2.5 py-1 ${card.bgLight} ${card.textColor} text-xs font-semibold rounded-full`}>
                      {card.new} new
                    </span>
                  )}
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-0.5">
                  {loading ? '...' : card.total.toLocaleString()}
                </div>
                <div className="text-sm text-gray-500">{card.title}</div>
                <div className="mt-3 text-sm text-blue-600 font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  View details <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid lg:grid-cols-5 gap-6">
        {/* Recent Leads - Takes up 3 columns */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Sparkles className="w-4 h-4 text-blue-600" />
              </div>
              <h2 className="font-semibold text-gray-900">Recent Leads</h2>
            </div>
            <span className="text-xs text-gray-400">AI-scored</span>
          </div>
          <div className="divide-y divide-gray-50">
            {loading ? (
              <div className="p-8 text-center text-gray-400">Loading...</div>
            ) : recentLeads.length === 0 ? (
              <div className="p-8 text-center text-gray-400">No leads yet</div>
            ) : (
              recentLeads.map((lead) => {
                const typeInfo = getLeadTypeLabel(lead.type);
                const TypeIcon = typeInfo.icon;
                return (
                  <div key={`${lead.type}-${lead.id}`} className="px-6 py-4 hover:bg-gray-50/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${typeInfo.color}`}>
                        <TypeIcon className="w-4 h-4" />
                      </div>
                      <div className="flex-grow min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className="font-medium text-gray-900 truncate">{lead.name || 'Unknown'}</p>
                          {lead.status === 'new' && (
                            <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 truncate">{lead.email}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        {lead.lead_score && (
                          <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl text-sm font-bold ${
                            lead.lead_score >= 80 ? 'bg-emerald-50 text-emerald-600' :
                            lead.lead_score >= 60 ? 'bg-amber-50 text-amber-600' :
                            'bg-gray-50 text-gray-600'
                          }`}>
                            {lead.lead_score}
                          </div>
                        )}
                        <p className="text-xs text-gray-400 mt-1">{formatDate(lead.created_at)}</p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
          <div className="px-6 py-3 border-t border-gray-100 bg-gray-50/50">
            <Link
              href="/admin/contacts"
              className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center justify-center gap-1"
            >
              View all leads <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Content Stats - Takes up 2 columns */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <h2 className="text-lg font-semibold text-gray-900">Content</h2>
          </div>
          {contentCards.map((card) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.title}
                href={card.href}
                className="group flex items-center gap-4 bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200 transition-all"
              >
                <div className={`p-3 bg-gradient-to-br ${card.color} rounded-xl shadow-sm`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-grow">
                  <div className="text-lg font-bold text-gray-900">
                    {loading ? '...' : card.total}
                  </div>
                  <div className="text-sm text-gray-500">{card.title}</div>
                </div>
                <div className="text-right">
                  <span className="text-xs text-gray-400">{card.subtitle}</span>
                  <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-blue-500 transition-colors mt-1 ml-auto" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
