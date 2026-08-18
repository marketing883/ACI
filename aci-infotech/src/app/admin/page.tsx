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
import { isSupabaseConfigured } from '@/lib/supabase';

interface DashboardStats {
  contacts: { total: number; new: number };
  chatLeads: { total: number; new: number };
  playbookLeads: { total: number; new: number };
  whitepaperLeads: { total: number; new: number };
  eventLeads: { total: number; new: number };
  caseStudies: { total: number; published: number };
  blogPosts: { total: number; published: number };
  whitepapers: { total: number; published: number };
  webinars: { total: number; upcoming: number };
  avgLeadScore: number | null;
}

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

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    contacts: { total: 0, new: 0 },
    chatLeads: { total: 0, new: 0 },
    playbookLeads: { total: 0, new: 0 },
    whitepaperLeads: { total: 0, new: 0 },
    eventLeads: { total: 0, new: 0 },
    caseStudies: { total: 0, published: 0 },
    blogPosts: { total: 0, published: 0 },
    whitepapers: { total: 0, published: 0 },
    webinars: { total: 0, upcoming: 0 },
    avgLeadScore: null,
  });
  const [recentLeads, setRecentLeads] = useState<RecentLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [configured, setConfigured] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

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
        eventLeads: { total: 64, new: 22 },
        caseStudies: { total: 12, published: 10 },
        blogPosts: { total: 24, published: 18 },
        whitepapers: { total: 8, published: 6 },
        webinars: { total: 4, upcoming: 2 },
        avgLeadScore: 78,
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
      // One service-role read for every card and the recent-leads feed.
      // Counting from the browser here used to hand back an anonymous
      // read: RLS denied most lead tables, the errors were swallowed into
      // 0, and this page disagreed with the list pages beside it.
      const res = await fetch('/api/admin/stats');
      const json = await res.json();

      // Take whatever counts came back, then report the failure. The route
      // answers a partial read with HTTP 500 *and* every count that did
      // succeed; throwing first discarded them and left this page on its
      // all-zero initial state. That is how two lead tables missing a
      // column blanked all seven cards while the list pages beside them
      // showed rows.
      if (json.stats) setStats(json.stats);
      if (json.recentLeads) setRecentLeads(json.recentLeads);

      if (!res.ok) throw new Error(json.error || 'Failed to load dashboard data');
      setLoadError(null);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoadError(error instanceof Error ? error.message : 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }

  // Summary cards data.
  //
  // No trend badges. Each card used to carry a hardcoded +12% / +8% / +5%
  // / +3, which meant the dashboard reported healthy growth over counts
  // that were reading 0 - and that is a large part of why this page looked
  // fine while it was broken. A real trend needs a prior-period count the
  // stats route does not compute yet.
  const summaryCards = [
    {
      title: 'Total Leads',
      value: stats.contacts.total + stats.chatLeads.total + stats.playbookLeads.total + stats.whitepaperLeads.total + stats.eventLeads.total,
      icon: Users,
    },
    {
      title: 'New This Week',
      value: stats.contacts.new + stats.chatLeads.new + stats.playbookLeads.new + stats.whitepaperLeads.new + stats.eventLeads.new,
      icon: Activity,
    },
    {
      title: 'Avg Lead Score',
      // A dash, not a number, when we hold no scores. Better an honest gap
      // than a plausible-looking average of nothing.
      value: stats.avgLeadScore ?? '—',
      icon: Target,
    },
    {
      title: 'Content Published',
      value: stats.caseStudies.published + stats.blogPosts.published,
      icon: FileText,
    },
  ];

  // Lead category cards with links
  const leadCards = [
    {
      title: 'Event Registrations',
      total: stats.eventLeads.total,
      new: stats.eventLeads.new,
      icon: Calendar,
      color: 'from-violet-500 to-violet-600',
      bgLight: 'bg-violet-50',
      textColor: 'text-violet-600',
      href: '/admin/event-leads',
    },
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
      total: stats.whitepapers.total,
      subtitle: `${stats.whitepapers.published} published`,
      icon: FileCheck,
      color: 'from-indigo-500 to-indigo-600',
      href: '/admin/whitepapers',
    },
    {
      title: 'Webinars',
      total: stats.webinars.total,
      subtitle: `${stats.webinars.upcoming} upcoming`,
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

  function getLeadTypeLabel(type: 'contact' | 'chat' | 'playbook' | 'whitepaper' | 'event') {
    const labels = {
      contact: { label: 'Contact', color: 'bg-blue-100 text-blue-700', icon: FileText },
      chat: { label: 'Chat', color: 'bg-violet-100 text-violet-700', icon: MessageSquare },
      playbook: { label: 'Playbook', color: 'bg-amber-100 text-amber-700', icon: BookOpen },
      whitepaper: { label: 'Whitepaper', color: 'bg-emerald-100 text-emerald-700', icon: Download },
      event: { label: 'Event', color: 'bg-fuchsia-100 text-fuchsia-700', icon: Calendar },
    };
    return labels[type];
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome back. Here’s what’s happening with your leads.</p>
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

      {loadError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3">
          <div className="p-2 bg-red-100 rounded-lg">
            <AlertCircle className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <p className="font-semibold text-red-900">Could not load lead data</p>
            <p className="text-sm text-red-700">
              {loadError}. The numbers below are not real. Check{' '}
              <Link href="/api/admin/health" className="underline">
                /api/admin/health
              </Link>{' '}
              to see which Supabase project and key the server is using.
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
              <div className="flex items-center mb-3">
                <div className="p-2.5 bg-gray-50 rounded-xl">
                  <Icon className="w-5 h-5 text-gray-600" />
                </div>
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
