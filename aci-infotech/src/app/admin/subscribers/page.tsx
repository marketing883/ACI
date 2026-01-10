'use client';

import { useEffect, useState } from 'react';
import {
  Search,
  Download,
  Mail,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Clock,
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

interface Subscriber {
  id: string;
  email: string;
  source: string;
  status: 'active' | 'unsubscribed' | 'bounced';
  created_at: string;
  unsubscribed_at: string | null;
}

// Mock data
const mockSubscribers: Subscriber[] = [
  {
    id: '1',
    email: 'john.smith@acmecorp.com',
    source: 'website_footer',
    status: 'active',
    created_at: '2024-12-15T10:30:00Z',
    unsubscribed_at: null,
  },
  {
    id: '2',
    email: 'sarah.j@techstartup.io',
    source: 'blog_post',
    status: 'active',
    created_at: '2024-12-14T14:20:00Z',
    unsubscribed_at: null,
  },
  {
    id: '3',
    email: 'mike.chen@enterprise.com',
    source: 'website_footer',
    status: 'active',
    created_at: '2024-12-13T09:15:00Z',
    unsubscribed_at: null,
  },
  {
    id: '4',
    email: 'emily.d@retailco.com',
    source: 'case_study_download',
    status: 'unsubscribed',
    created_at: '2024-12-10T16:45:00Z',
    unsubscribed_at: '2024-12-20T11:00:00Z',
  },
  {
    id: '5',
    email: 'david.w@fintech.com',
    source: 'webinar_registration',
    status: 'bounced',
    created_at: '2024-12-08T11:30:00Z',
    unsubscribed_at: null,
  },
  {
    id: '6',
    email: 'anna.martinez@healthsys.org',
    source: 'website_footer',
    status: 'active',
    created_at: '2024-12-07T08:20:00Z',
    unsubscribed_at: null,
  },
  {
    id: '7',
    email: 'robert.lee@manufacturing.com',
    source: 'blog_post',
    status: 'active',
    created_at: '2024-12-05T15:10:00Z',
    unsubscribed_at: null,
  },
  {
    id: '8',
    email: 'jennifer.white@insurance.com',
    source: 'website_footer',
    status: 'active',
    created_at: '2024-12-03T12:00:00Z',
    unsubscribed_at: null,
  },
];

const statusConfig = {
  active: { icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-100', label: 'Active' },
  unsubscribed: { icon: XCircle, color: 'text-gray-600', bg: 'bg-gray-100', label: 'Unsubscribed' },
  bounced: { icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-100', label: 'Bounced' },
};

const sourceLabels: Record<string, string> = {
  website_footer: 'Website Footer',
  blog_post: 'Blog Post',
  case_study_download: 'Case Study Download',
  webinar_registration: 'Webinar',
  contact_form: 'Contact Form',
};

export default function SubscribersPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [configured, setConfigured] = useState(false);

  useEffect(() => {
    const isConfigured = isSupabaseConfigured();
    setConfigured(isConfigured);

    if (isConfigured) {
      fetchSubscribers();
    } else {
      setSubscribers(mockSubscribers);
      setLoading(false);
    }
  }, []);

  async function fetchSubscribers() {
    try {
      const { data, error } = await supabase
        .from('newsletter_subscribers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSubscribers(data || []);
    } catch (error) {
      console.error('Error fetching subscribers:', error);
    } finally {
      setLoading(false);
    }
  }

  const filteredSubscribers = subscribers.filter((sub) => {
    const matchesSearch = searchQuery === '' ||
      sub.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || sub.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: subscribers.length,
    active: subscribers.filter(s => s.status === 'active').length,
    unsubscribed: subscribers.filter(s => s.status === 'unsubscribed').length,
    bounced: subscribers.filter(s => s.status === 'bounced').length,
  };

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }

  function exportCSV() {
    const headers = ['Email', 'Status', 'Source', 'Subscribed Date'];
    const rows = filteredSubscribers.map(s => [
      s.email,
      s.status,
      sourceLabels[s.source] || s.source,
      formatDate(s.created_at),
    ]);

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `subscribers-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Newsletter Subscribers</h1>
          <p className="text-gray-600">Manage your email subscriber list</p>
        </div>
        <button
          onClick={exportCSV}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Download className="w-5 h-5" />
          Export CSV
        </button>
      </div>

      {!configured && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-yellow-800">Demo Mode</p>
            <p className="text-sm text-yellow-700">
              Showing sample data. Configure Supabase to manage real subscribers.
            </p>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Mail className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              <p className="text-sm text-gray-500">Total</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
              <p className="text-sm text-gray-500">Active</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 rounded-lg">
              <XCircle className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.unsubscribed}</p>
              <p className="text-sm text-gray-500">Unsubscribed</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.bounced}</p>
              <p className="text-sm text-gray-500">Bounced</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm mb-6">
        <div className="p-4 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[var(--aci-primary)] focus:border-transparent"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[var(--aci-primary)]"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="unsubscribed">Unsubscribed</option>
            <option value="bounced">Bounced</option>
          </select>
        </div>
      </div>

      {/* Subscribers Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading...</div>
        ) : filteredSubscribers.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No subscribers found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Source
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subscribed
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredSubscribers.map((sub) => {
                  const status = statusConfig[sub.status];
                  const StatusIcon = status.icon;
                  return (
                    <tr key={sub.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-900">{sub.email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${status.bg} ${status.color}`}>
                          <StatusIcon className="w-3 h-3" />
                          {status.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {sourceLabels[sub.source] || sub.source}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {formatDate(sub.created_at)}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination placeholder */}
      <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
        <span>Showing {filteredSubscribers.length} of {subscribers.length} subscribers</span>
      </div>
    </div>
  );
}
