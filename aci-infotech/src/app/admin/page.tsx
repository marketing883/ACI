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
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

interface DashboardStats {
  contacts: { total: number; new: number };
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
  type: 'contact' | 'playbook' | 'whitepaper';
  source?: string;
  created_at: string;
  status: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    contacts: { total: 0, new: 0 },
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
        },
        {
          id: '2',
          name: 'Sarah Johnson',
          email: 'sarah@techstartup.io',
          company: 'TechStartup',
          type: 'playbook',
          source: 'Hadoop → Cloud',
          created_at: new Date(Date.now() - 86400000).toISOString(),
          status: 'new',
        },
        {
          id: '3',
          name: 'Michael Chen',
          email: 'mchen@enterprise.com',
          company: 'Enterprise Co',
          type: 'whitepaper',
          source: 'AI Governance Playbook',
          created_at: new Date(Date.now() - 172800000).toISOString(),
          status: 'new',
        },
        {
          id: '4',
          name: 'Emily Davis',
          email: 'emily@retailcorp.com',
          company: 'RetailCorp',
          type: 'playbook',
          source: '600 Stores, Real-Time',
          created_at: new Date(Date.now() - 259200000).toISOString(),
          status: 'contacted',
        },
        {
          id: '5',
          name: 'David Lee',
          email: 'dlee@healthcare.com',
          company: 'HealthCare Inc',
          type: 'whitepaper',
          source: 'Healthcare Data Compliance',
          created_at: new Date(Date.now() - 345600000).toISOString(),
          status: 'new',
        },
      ]);
      setLoading(false);
    }
  }, []);

  async function fetchDashboardData() {
    try {
      // Fetch contacts stats
      const { count: totalContacts } = await supabase
        .from('contacts')
        .select('*', { count: 'exact', head: true });

      const { count: newContacts } = await supabase
        .from('contacts')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'new');

      // Fetch playbook leads stats
      const { count: totalPlaybookLeads } = await supabase
        .from('playbook_leads')
        .select('*', { count: 'exact', head: true });

      const { count: newPlaybookLeads } = await supabase
        .from('playbook_leads')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'new');

      // Fetch whitepaper leads stats
      const { count: totalWhitepaperLeads } = await supabase
        .from('whitepaper_leads')
        .select('*', { count: 'exact', head: true });

      const { count: newWhitepaperLeads } = await supabase
        .from('whitepaper_leads')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'new');

      // Fetch case studies stats
      const { count: totalCaseStudies } = await supabase
        .from('case_studies')
        .select('*', { count: 'exact', head: true });

      const { count: publishedCaseStudies } = await supabase
        .from('case_studies')
        .select('*', { count: 'exact', head: true })
        .eq('is_published', true);

      // Fetch blog stats
      const { count: totalBlog } = await supabase
        .from('blog_posts')
        .select('*', { count: 'exact', head: true });

      const { count: publishedBlog } = await supabase
        .from('blog_posts')
        .select('*', { count: 'exact', head: true })
        .eq('is_published', true);

      setStats({
        contacts: { total: totalContacts || 0, new: newContacts || 0 },
        playbookLeads: { total: totalPlaybookLeads || 0, new: newPlaybookLeads || 0 },
        whitepaperLeads: { total: totalWhitepaperLeads || 0, new: newWhitepaperLeads || 0 },
        caseStudies: { total: totalCaseStudies || 0, published: publishedCaseStudies || 0 },
        blogPosts: { total: totalBlog || 0, published: publishedBlog || 0 },
      });

      // Fetch recent leads from all sources
      const { data: contacts } = await supabase
        .from('contacts')
        .select('id, name, email, company, inquiry_type, created_at, status')
        .order('created_at', { ascending: false })
        .limit(3);

      const { data: playbookLeads } = await supabase
        .from('playbook_leads')
        .select('id, name, email, company, playbook_title, created_at, status')
        .order('created_at', { ascending: false })
        .limit(3);

      const { data: whitepaperLeads } = await supabase
        .from('whitepaper_leads')
        .select('id, name, email, company, whitepaper_title, created_at, status')
        .order('created_at', { ascending: false })
        .limit(3);

      // Combine and sort all leads
      const allLeads: RecentLead[] = [
        ...(contacts || []).map(c => ({
          ...c,
          type: 'contact' as const,
          source: c.inquiry_type,
        })),
        ...(playbookLeads || []).map(p => ({
          ...p,
          type: 'playbook' as const,
          source: p.playbook_title,
        })),
        ...(whitepaperLeads || []).map(w => ({
          ...w,
          type: 'whitepaper' as const,
          source: w.whitepaper_title,
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

  // Lead category cards with links
  const leadCards = [
    {
      title: 'Contact Submissions',
      total: stats.contacts.total,
      new: stats.contacts.new,
      icon: Users,
      color: 'bg-blue-500',
      bgLight: 'bg-blue-50',
      textColor: 'text-blue-600',
      href: '/admin/contacts',
    },
    {
      title: 'Playbook Downloads',
      total: stats.playbookLeads.total,
      new: stats.playbookLeads.new,
      icon: BookOpen,
      color: 'bg-purple-500',
      bgLight: 'bg-purple-50',
      textColor: 'text-purple-600',
      href: '/admin/playbook-leads',
    },
    {
      title: 'Whitepaper Downloads',
      total: stats.whitepaperLeads.total,
      new: stats.whitepaperLeads.new,
      icon: Download,
      color: 'bg-green-500',
      bgLight: 'bg-green-50',
      textColor: 'text-green-600',
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
      color: 'bg-orange-500',
      href: '/admin/case-studies',
    },
    {
      title: 'Blog Posts',
      total: stats.blogPosts.total,
      subtitle: `${stats.blogPosts.published} published`,
      icon: FileCheck,
      color: 'bg-teal-500',
      href: '/admin/blog',
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

  function getLeadTypeLabel(type: 'contact' | 'playbook' | 'whitepaper') {
    const labels = {
      contact: { label: 'Contact', color: 'bg-blue-100 text-blue-700' },
      playbook: { label: 'Playbook', color: 'bg-purple-100 text-purple-700' },
      whitepaper: { label: 'Whitepaper', color: 'bg-green-100 text-green-700' },
    };
    return labels[type];
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome to the ACI Infotech admin panel</p>
      </div>

      {!configured && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-yellow-800">Supabase Not Configured</p>
            <p className="text-sm text-yellow-700">
              Showing demo data. Configure Supabase credentials in .env.local to connect to your database.
            </p>
          </div>
        </div>
      )}

      {/* Lead Categories Section */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Lead Categories</h2>
        <div className="grid sm:grid-cols-3 gap-6">
          {leadCards.map((card) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.title}
                href={card.href}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg ${card.color}`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  {card.new > 0 && (
                    <span className={`px-3 py-1 ${card.bgLight} ${card.textColor} text-sm font-medium rounded-full`}>
                      {card.new} new
                    </span>
                  )}
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {loading ? '...' : card.total.toLocaleString()}
                </div>
                <div className="text-sm text-gray-500">{card.title}</div>
                <div className="mt-3 text-sm text-[var(--aci-primary)] font-medium flex items-center gap-1">
                  View all <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Content Stats */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Content</h2>
        <div className="grid sm:grid-cols-2 gap-6">
          {contentCards.map((card) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.title}
                href={card.href}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow flex items-center gap-6"
              >
                <div className={`p-3 rounded-lg ${card.color}`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-grow">
                  <div className="text-2xl font-bold text-gray-900">
                    {loading ? '...' : card.total}
                  </div>
                  <div className="text-sm text-gray-500">{card.title}</div>
                  <div className="text-xs text-gray-400">{card.subtitle}</div>
                </div>
                <TrendingUp className="w-5 h-5 text-green-500" />
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Leads */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="font-semibold text-gray-900">Recent Leads (All Sources)</h2>
        </div>
        <div className="divide-y">
          {loading ? (
            <div className="p-6 text-center text-gray-500">Loading...</div>
          ) : recentLeads.length === 0 ? (
            <div className="p-6 text-center text-gray-500">No leads yet</div>
          ) : (
            recentLeads.map((lead) => {
              const typeInfo = getLeadTypeLabel(lead.type);
              return (
                <div key={`${lead.type}-${lead.id}`} className="p-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-grow">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-gray-900">{lead.name}</p>
                        <span className={`px-2 py-0.5 text-xs font-medium rounded ${typeInfo.color}`}>
                          {typeInfo.label}
                        </span>
                        {lead.status === 'new' && (
                          <span className="px-2 py-0.5 text-xs font-medium rounded bg-red-100 text-red-700">
                            New
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">{lead.email}</p>
                      {lead.company && (
                        <p className="text-xs text-gray-400">{lead.company}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        <Clock className="w-3 h-3" />
                        {formatDate(lead.created_at)}
                      </div>
                      {lead.source && (
                        <p className="text-xs text-gray-500 mt-1 max-w-[150px] truncate">
                          {lead.source}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
        <div className="p-4 border-t bg-gray-50 flex gap-4 justify-center">
          <Link
            href="/admin/contacts"
            className="text-sm text-[var(--aci-primary)] hover:underline"
          >
            View Contact Submissions
          </Link>
          <span className="text-gray-300">|</span>
          <Link
            href="/admin/playbook-leads"
            className="text-sm text-[var(--aci-primary)] hover:underline"
          >
            View Playbook Leads
          </Link>
          <span className="text-gray-300">|</span>
          <Link
            href="/admin/whitepaper-leads"
            className="text-sm text-[var(--aci-primary)] hover:underline"
          >
            View Whitepaper Leads
          </Link>
        </div>
      </div>
    </div>
  );
}
