'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Users,
  FileText,
  BookOpen,
  Mail,
  TrendingUp,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

interface DashboardStats {
  contacts: { total: number; new: number };
  caseStudies: { total: number; published: number };
  blogPosts: { total: number; published: number };
  subscribers: { total: number; active: number };
}

interface RecentContact {
  id: string;
  name: string;
  email: string;
  inquiry_type: string;
  created_at: string;
  status: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    contacts: { total: 0, new: 0 },
    caseStudies: { total: 0, published: 0 },
    blogPosts: { total: 0, published: 0 },
    subscribers: { total: 0, active: 0 },
  });
  const [recentContacts, setRecentContacts] = useState<RecentContact[]>([]);
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
        caseStudies: { total: 12, published: 10 },
        blogPosts: { total: 24, published: 18 },
        subscribers: { total: 1250, active: 1180 },
      });
      setRecentContacts([
        {
          id: '1',
          name: 'John Smith',
          email: 'john@acmecorp.com',
          inquiry_type: 'architecture-call',
          created_at: new Date().toISOString(),
          status: 'new',
        },
        {
          id: '2',
          name: 'Sarah Johnson',
          email: 'sarah@techstartup.io',
          inquiry_type: 'project-inquiry',
          created_at: new Date(Date.now() - 86400000).toISOString(),
          status: 'contacted',
        },
        {
          id: '3',
          name: 'Michael Chen',
          email: 'mchen@enterprise.com',
          inquiry_type: 'partnership',
          created_at: new Date(Date.now() - 172800000).toISOString(),
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

      // Fetch recent contacts
      const { data: contacts } = await supabase
        .from('contacts')
        .select('id, name, email, inquiry_type, created_at, status')
        .order('created_at', { ascending: false })
        .limit(5);

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

      // Fetch subscriber stats
      const { count: totalSubscribers } = await supabase
        .from('newsletter_subscribers')
        .select('*', { count: 'exact', head: true });

      const { count: activeSubscribers } = await supabase
        .from('newsletter_subscribers')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');

      setStats({
        contacts: { total: totalContacts || 0, new: newContacts || 0 },
        caseStudies: { total: totalCaseStudies || 0, published: publishedCaseStudies || 0 },
        blogPosts: { total: totalBlog || 0, published: publishedBlog || 0 },
        subscribers: { total: totalSubscribers || 0, active: activeSubscribers || 0 },
      });

      setRecentContacts(contacts || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }

  const statCards = [
    {
      title: 'Contact Submissions',
      total: stats.contacts.total,
      subtitle: `${stats.contacts.new} new`,
      icon: Users,
      color: 'bg-blue-500',
      href: '/admin/contacts',
    },
    {
      title: 'Case Studies',
      total: stats.caseStudies.total,
      subtitle: `${stats.caseStudies.published} published`,
      icon: FileText,
      color: 'bg-green-500',
      href: '/admin/case-studies',
    },
    {
      title: 'Blog Posts',
      total: stats.blogPosts.total,
      subtitle: `${stats.blogPosts.published} published`,
      icon: BookOpen,
      color: 'bg-purple-500',
      href: '/admin/blog',
    },
    {
      title: 'Subscribers',
      total: stats.subscribers.total,
      subtitle: `${stats.subscribers.active} active`,
      icon: Mail,
      color: 'bg-orange-500',
      href: '/admin/subscribers',
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

  function formatInquiryType(type: string) {
    const types: Record<string, string> = {
      'architecture-call': 'Architecture Call',
      'project-inquiry': 'Project Inquiry',
      'partnership': 'Partnership',
      'careers': 'Careers',
      'general': 'General',
    };
    return types[type] || type;
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

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.title}
              href={card.href}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${card.color}`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {loading ? '...' : card.total.toLocaleString()}
              </div>
              <div className="text-sm text-gray-500">{card.title}</div>
              <div className="text-xs text-gray-400 mt-1">{card.subtitle}</div>
            </Link>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Recent Contacts */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="font-semibold text-gray-900">Recent Contact Submissions</h2>
            <Link
              href="/admin/contacts"
              className="text-sm text-[var(--aci-primary)] hover:underline flex items-center gap-1"
            >
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="divide-y">
            {loading ? (
              <div className="p-6 text-center text-gray-500">Loading...</div>
            ) : recentContacts.length === 0 ? (
              <div className="p-6 text-center text-gray-500">No contacts yet</div>
            ) : (
              recentContacts.map((contact) => (
                <div key={contact.id} className="p-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{contact.name}</p>
                      <p className="text-sm text-gray-500">{contact.email}</p>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        contact.status === 'new'
                          ? 'bg-blue-100 text-blue-700'
                          : contact.status === 'contacted'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-green-100 text-green-700'
                      }`}
                    >
                      {contact.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDate(contact.created_at)}
                    </span>
                    <span>{formatInquiryType(contact.inquiry_type)}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6 border-b">
            <h2 className="font-semibold text-gray-900">Quick Actions</h2>
          </div>
          <div className="p-6 space-y-4">
            <Link
              href="/admin/blog?action=new"
              className="flex items-center gap-4 p-4 rounded-lg border border-gray-200 hover:border-[var(--aci-primary)] hover:bg-blue-50 transition-colors"
            >
              <div className="p-3 bg-purple-100 rounded-lg">
                <BookOpen className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Create Blog Post</p>
                <p className="text-sm text-gray-500">Write a new article for the blog</p>
              </div>
            </Link>
            <Link
              href="/admin/case-studies?action=new"
              className="flex items-center gap-4 p-4 rounded-lg border border-gray-200 hover:border-[var(--aci-primary)] hover:bg-blue-50 transition-colors"
            >
              <div className="p-3 bg-green-100 rounded-lg">
                <FileText className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Add Case Study</p>
                <p className="text-sm text-gray-500">Document a new client success story</p>
              </div>
            </Link>
            <Link
              href="/admin/contacts?status=new"
              className="flex items-center gap-4 p-4 rounded-lg border border-gray-200 hover:border-[var(--aci-primary)] hover:bg-blue-50 transition-colors"
            >
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Review New Leads</p>
                <p className="text-sm text-gray-500">
                  {stats.contacts.new} new submissions to review
                </p>
              </div>
            </Link>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-4 rounded-lg border border-gray-200 hover:border-[var(--aci-primary)] hover:bg-blue-50 transition-colors"
            >
              <div className="p-3 bg-gray-100 rounded-lg">
                <CheckCircle2 className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">View Live Site</p>
                <p className="text-sm text-gray-500">Open the public website</p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
