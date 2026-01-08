'use client';

import { useEffect, useState } from 'react';
import {
  Search,
  Filter,
  Mail,
  Building2,
  Clock,
  Download,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  Users,
  Loader2,
  ExternalLink,
  FileText,
  Eye,
  Tag,
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

interface WhitepaperLead {
  id: string;
  created_at: string;
  name: string;
  email: string;
  company: string | null;
  job_title: string | null;
  whitepaper_slug: string;
  whitepaper_title: string;
  download_token: string;
  token_used: boolean;
  token_expiry: string;
  downloaded_at: string | null;
  source: string | null;
}

// Mock data for demo
const mockLeads: WhitepaperLead[] = [
  {
    id: '1',
    created_at: new Date().toISOString(),
    name: 'Jennifer Martinez',
    email: 'jmartinez@datacorp.com',
    company: 'DataCorp International',
    job_title: 'Head of Data Strategy',
    whitepaper_slug: 'enterprise-data-strategy-2025',
    whitepaper_title: 'Enterprise Data Strategy 2025',
    download_token: 'abc123',
    token_used: true,
    token_expiry: new Date(Date.now() + 86400000).toISOString(),
    downloaded_at: new Date().toISOString(),
    source: 'homepage',
  },
  {
    id: '2',
    created_at: new Date(Date.now() - 86400000).toISOString(),
    name: 'Robert Kim',
    email: 'rkim@aiventures.com',
    company: 'AI Ventures',
    job_title: 'Chief AI Officer',
    whitepaper_slug: 'ai-governance-playbook',
    whitepaper_title: 'AI Governance Playbook',
    download_token: 'def456',
    token_used: false,
    token_expiry: new Date(Date.now() + 86400000).toISOString(),
    downloaded_at: null,
    source: 'whitepapers-page',
  },
  {
    id: '3',
    created_at: new Date(Date.now() - 172800000).toISOString(),
    name: 'Lisa Anderson',
    email: 'landerson@cloudmigrate.io',
    company: 'CloudMigrate Solutions',
    job_title: 'VP of Engineering',
    whitepaper_slug: 'cloud-migration-blueprint',
    whitepaper_title: 'Cloud Migration Blueprint',
    download_token: 'ghi789',
    token_used: true,
    token_expiry: new Date(Date.now() - 86400000).toISOString(),
    downloaded_at: new Date(Date.now() - 172000000).toISOString(),
    source: 'whitepapers-page',
  },
  {
    id: '4',
    created_at: new Date(Date.now() - 259200000).toISOString(),
    name: 'Michael Brown',
    email: 'mbrown@retailtech.com',
    company: 'RetailTech Group',
    job_title: 'Director of Marketing Technology',
    whitepaper_slug: 'martech-cdp-guide',
    whitepaper_title: 'MarTech & CDP Implementation Guide',
    download_token: 'jkl012',
    token_used: true,
    token_expiry: new Date(Date.now() + 86400000).toISOString(),
    downloaded_at: new Date(Date.now() - 250000000).toISOString(),
    source: 'homepage',
  },
];

const whitepaperNames: Record<string, string> = {
  'enterprise-data-strategy-2025': 'Enterprise Data Strategy 2025',
  'ai-governance-playbook': 'AI Governance Playbook',
  'cloud-migration-blueprint': 'Cloud Migration Blueprint',
  'martech-cdp-guide': 'MarTech & CDP Implementation Guide',
  'data-mesh-implementation': 'Data Mesh Implementation Guide',
  'real-time-analytics': 'Real-Time Analytics Architecture',
};

const sourceLabels: Record<string, string> = {
  'homepage': 'Homepage',
  'whitepapers-page': 'Whitepapers Page',
  'blog': 'Blog Post',
  'email': 'Email Campaign',
};

export default function WhitepaperLeadsPage() {
  const [leads, setLeads] = useState<WhitepaperLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [whitepaperFilter, setWhitepaperFilter] = useState('all');
  const [downloadedFilter, setDownloadedFilter] = useState('all');
  const [configured, setConfigured] = useState(false);

  useEffect(() => {
    const isConfigured = isSupabaseConfigured();
    setConfigured(isConfigured);

    if (isConfigured) {
      fetchLeads();
    } else {
      setLeads(mockLeads);
      setLoading(false);
    }
  }, []);

  async function fetchLeads() {
    try {
      const { data, error } = await supabase
        .from('whitepaper_leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLeads(data || []);
    } catch (error) {
      console.error('Error fetching leads:', error);
      setLeads(mockLeads);
    } finally {
      setLoading(false);
    }
  }

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      searchQuery === '' ||
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.company?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesWhitepaper = whitepaperFilter === 'all' || lead.whitepaper_slug === whitepaperFilter;
    const matchesDownloaded =
      downloadedFilter === 'all' ||
      (downloadedFilter === 'downloaded' && lead.token_used) ||
      (downloadedFilter === 'pending' && !lead.token_used);
    return matchesSearch && matchesWhitepaper && matchesDownloaded;
  });

  // Stats
  const stats = {
    total: leads.length,
    downloaded: leads.filter(l => l.token_used).length,
    pending: leads.filter(l => !l.token_used).length,
    thisWeek: leads.filter(l => {
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      return new Date(l.created_at) >= weekAgo;
    }).length,
  };

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  // Get unique whitepapers from leads
  const uniqueWhitepapers = Array.from(new Set(leads.map(l => l.whitepaper_slug)));

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Whitepaper Downloads</h1>
        <p className="text-gray-600">Track and manage whitepaper download leads</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              <p className="text-sm text-gray-500">Total Leads</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Download className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.downloaded}</p>
              <p className="text-sm text-gray-500">Downloaded</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
              <p className="text-sm text-gray-500">Pending</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <FileCheck className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.thisWeek}</p>
              <p className="text-sm text-gray-500">This Week</p>
            </div>
          </div>
        </div>
      </div>

      {!configured && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-yellow-800">Demo Mode</p>
            <p className="text-sm text-yellow-700">
              Showing sample data. Configure Supabase to manage real leads.
            </p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm mb-6">
        <div className="p-4 flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, or company..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[var(--aci-primary)] focus:border-transparent"
            />
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={whitepaperFilter}
                onChange={(e) => setWhitepaperFilter(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[var(--aci-primary)]"
              >
                <option value="all">All Whitepapers</option>
                {uniqueWhitepapers.map(slug => (
                  <option key={slug} value={slug}>
                    {whitepaperNames[slug] || slug}
                  </option>
                ))}
              </select>
            </div>
            <select
              value={downloadedFilter}
              onChange={(e) => setDownloadedFilter(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[var(--aci-primary)]"
            >
              <option value="all">All Status</option>
              <option value="downloaded">Downloaded</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500">Loading leads...</p>
          </div>
        ) : filteredLeads.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No leads found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Lead Info
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Whitepaper
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Source
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{lead.name}</p>
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {lead.email}
                        </p>
                        {lead.company && (
                          <p className="text-sm text-gray-500 flex items-center gap-1">
                            <Building2 className="w-3 h-3" />
                            {lead.company}
                            {lead.job_title && ` • ${lead.job_title}`}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-900">
                          {whitepaperNames[lead.whitepaper_slug] || lead.whitepaper_title || lead.whitepaper_slug}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {lead.token_used ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                          <CheckCircle2 className="w-3 h-3" />
                          Downloaded
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-700 rounded-full">
                          <Clock className="w-3 h-3" />
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {lead.source && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                          <Tag className="w-3 h-3" />
                          {sourceLabels[lead.source] || lead.source}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500">
                        <p>{formatDate(lead.created_at)}</p>
                        {lead.downloaded_at && (
                          <p className="text-xs text-green-600">
                            Downloaded: {formatDate(lead.downloaded_at)}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <a
                          href={`mailto:${lead.email}`}
                          className="p-2 text-gray-400 hover:text-[var(--aci-primary)] rounded-lg hover:bg-gray-100"
                          title="Send Email"
                        >
                          <Mail className="w-4 h-4" />
                        </a>
                        <a
                          href={`/whitepapers`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-gray-400 hover:text-[var(--aci-primary)] rounded-lg hover:bg-gray-100"
                          title="View Whitepapers"
                        >
                          <Eye className="w-4 h-4" />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Export Button */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={() => {
            const csv = [
              ['Name', 'Email', 'Company', 'Job Title', 'Whitepaper', 'Downloaded', 'Source', 'Date'].join(','),
              ...filteredLeads.map(l => [
                l.name,
                l.email,
                l.company || '',
                l.job_title || '',
                whitepaperNames[l.whitepaper_slug] || l.whitepaper_slug,
                l.token_used ? 'Yes' : 'No',
                l.source || '',
                new Date(l.created_at).toISOString(),
              ].map(v => `"${v}"`).join(','))
            ].join('\n');
            const blob = new Blob([csv], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `whitepaper-leads-${new Date().toISOString().split('T')[0]}.csv`;
            a.click();
          }}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
          Export CSV
        </button>
      </div>
    </div>
  );
}
