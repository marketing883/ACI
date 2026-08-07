'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Search,
  Filter,
  Download,
  Trash2,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Mail,
  Phone,
  Building2,
  Briefcase,
  Calendar,
  Globe,
  Tag,
  CheckCircle,
  Clock,
  XCircle,
  Loader2,
} from 'lucide-react';

interface LPLead {
  id: string;
  created_at: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  company_name: string;
  job_title: string;
  looking_for: string;
  landing_page: string;
  service_cluster: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  industry_param?: string;
  role_param?: string;
  status: string;
  notes?: string;
}

const STATUS_OPTIONS = [
  { value: 'new', label: 'New', color: 'bg-blue-100 text-blue-800' },
  { value: 'contacted', label: 'Contacted', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'qualified', label: 'Qualified', color: 'bg-green-100 text-green-800' },
  { value: 'converted', label: 'Converted', color: 'bg-purple-100 text-purple-800' },
  { value: 'disqualified', label: 'Disqualified', color: 'bg-gray-100 text-gray-800' },
];

const SERVICE_CLUSTERS = [
  { value: '', label: 'All Services' },
  { value: 'data-engineering', label: 'Data Engineering' },
  { value: 'data-analytics', label: 'Data Analytics / Power BI' },
  { value: 'data-integration', label: 'Data Integration' },
  { value: 'data-observability', label: 'Data Observability' },
  { value: 'ai-ml', label: 'AI/ML Services' },
  { value: 'gen-ai', label: 'Generative AI' },
  { value: 'agentic-ai', label: 'Agentic AI' },
  { value: 'cloud-modernization', label: 'Cloud Modernization' },
  { value: 'dynamics-365', label: 'Dynamics 365' },
  { value: 'erp-transformation', label: 'ERP Transformation' },
];

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatServiceCluster(cluster: string) {
  return cluster
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export default function LPLeadsPage() {
  const [leads, setLeads] = useState<LPLead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [limit] = useState(20);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [serviceFilter, setServiceFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Selected lead for detail view
  const [selectedLead, setSelectedLead] = useState<LPLead | null>(null);

  // Fetch leads
  async function fetchLeads() {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        limit: limit.toString(),
        offset: (page * limit).toString(),
      });

      if (searchQuery) params.append('search', searchQuery);
      if (serviceFilter) params.append('service_cluster', serviceFilter);
      if (statusFilter) params.append('status', statusFilter);

      const response = await fetch(`/api/admin/lp-leads?${params}`);
      const data = await response.json();

      setLeads(data.leads || []);
      setTotal(data.total || 0);
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchLeads();
  }, [page, serviceFilter, statusFilter]);

  // Search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(0);
      fetchLeads();
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Update lead status
  async function updateLeadStatus(leadId: string, newStatus: string) {
    try {
      const response = await fetch('/api/admin/lp-leads', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: leadId, status: newStatus }),
      });

      if (response.ok) {
        setLeads((prev) =>
          prev.map((lead) =>
            lead.id === leadId ? { ...lead, status: newStatus } : lead
          )
        );
        if (selectedLead?.id === leadId) {
          setSelectedLead({ ...selectedLead, status: newStatus });
        }
      }
    } catch (error) {
      console.error('Error updating lead:', error);
    }
  }

  // Delete lead
  async function deleteLead(leadId: string) {
    if (!confirm('Are you sure you want to delete this lead?')) return;

    try {
      const response = await fetch(`/api/admin/lp-leads?id=${leadId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setLeads((prev) => prev.filter((lead) => lead.id !== leadId));
        if (selectedLead?.id === leadId) setSelectedLead(null);
        setTotal((prev) => prev - 1);
      }
    } catch (error) {
      console.error('Error deleting lead:', error);
    }
  }

  // Export to CSV
  function exportToCSV() {
    const headers = [
      'Date',
      'First Name',
      'Last Name',
      'Email',
      'Phone',
      'Company',
      'Job Title',
      'Looking For',
      'Service',
      'Landing Page',
      'UTM Source',
      'UTM Campaign',
      'Status',
    ];

    const rows = leads.map((lead) => [
      lead.created_at,
      lead.first_name,
      lead.last_name,
      lead.email,
      lead.phone || '',
      lead.company_name,
      lead.job_title,
      lead.looking_for,
      lead.service_cluster,
      lead.landing_page,
      lead.utm_source || '',
      lead.utm_campaign || '',
      lead.status,
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lp-leads-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Landing Page Leads</h1>
              <p className="text-gray-600 mt-1">
                {total} total leads from landing page campaigns
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={fetchLeads}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
                title="Refresh"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
              <button
                onClick={exportToCSV}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                <Download className="w-4 h-4" />
                Export CSV
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border p-4 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            {/* Search */}
            <div className="flex-1 min-w-[250px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name, email, or company..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Service Filter */}
            <div className="min-w-[200px]">
              <select
                value={serviceFilter}
                onChange={(e) => {
                  setServiceFilter(e.target.value);
                  setPage(0);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                {SERVICE_CLUSTERS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div className="min-w-[150px]">
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(0);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                <option value="">All Status</option>
                {STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Leads Table */}
          <div className="flex-1">
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                </div>
              ) : leads.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">No leads found</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Lead
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Company
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Service
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Source
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Status
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Date
                        </th>
                        <th className="px-4 py-3"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {leads.map((lead) => (
                        <tr
                          key={lead.id}
                          className={`hover:bg-gray-50 cursor-pointer ${
                            selectedLead?.id === lead.id ? 'bg-blue-50' : ''
                          }`}
                          onClick={() => setSelectedLead(lead)}
                        >
                          <td className="px-4 py-3">
                            <div>
                              <div className="font-medium text-gray-900">
                                {lead.first_name} {lead.last_name}
                              </div>
                              <div className="text-sm text-gray-500">{lead.email}</div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="text-sm text-gray-900">{lead.company_name}</div>
                            <div className="text-xs text-gray-500">{lead.job_title}</div>
                          </td>
                          <td className="px-4 py-3">
                            <span className="inline-flex px-2 py-1 text-xs font-medium bg-blue-50 text-blue-700 rounded">
                              {formatServiceCluster(lead.service_cluster)}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-500">
                            {lead.utm_source || 'Direct'}
                          </td>
                          <td className="px-4 py-3">
                            <select
                              value={lead.status}
                              onChange={(e) => {
                                e.stopPropagation();
                                updateLeadStatus(lead.id, e.target.value);
                              }}
                              onClick={(e) => e.stopPropagation()}
                              className={`text-xs font-medium px-2 py-1 rounded border-0 ${
                                STATUS_OPTIONS.find((s) => s.value === lead.status)?.color ||
                                'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {STATUS_OPTIONS.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-500">
                            {formatDate(lead.created_at)}
                          </td>
                          <td className="px-4 py-3">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteLead(lead.id);
                              }}
                              className="p-1 text-gray-400 hover:text-red-600"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-4 py-3 border-t">
                  <div className="text-sm text-gray-500">
                    Showing {page * limit + 1}-{Math.min((page + 1) * limit, total)} of {total}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setPage((p) => Math.max(0, p - 1))}
                      disabled={page === 0}
                      className="p-2 border rounded hover:bg-gray-50 disabled:opacity-50"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-sm text-gray-600">
                      Page {page + 1} of {totalPages}
                    </span>
                    <button
                      onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                      disabled={page >= totalPages - 1}
                      className="p-2 border rounded hover:bg-gray-50 disabled:opacity-50"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Lead Detail Panel */}
          {selectedLead && (
            <div className="w-96 bg-white rounded-xl shadow-sm border p-6 sticky top-6 h-fit">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {selectedLead.first_name} {selectedLead.last_name}
                  </h2>
                  <p className="text-sm text-gray-500">{selectedLead.job_title}</p>
                </div>
                <button
                  onClick={() => setSelectedLead(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Contact Info */}
                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <a
                      href={`mailto:${selectedLead.email}`}
                      className="text-blue-600 hover:underline"
                    >
                      {selectedLead.email}
                    </a>
                  </div>
                  {selectedLead.phone && (
                    <div className="flex items-center gap-3 text-sm">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <a href={`tel:${selectedLead.phone}`} className="text-gray-900">
                        {selectedLead.phone}
                      </a>
                    </div>
                  )}
                  <div className="flex items-center gap-3 text-sm">
                    <Building2 className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-900">{selectedLead.company_name}</span>
                  </div>
                </div>

                <hr />

                {/* Interest Details */}
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase">
                      Looking For
                    </label>
                    <p className="text-sm text-gray-900 mt-1">{selectedLead.looking_for}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase">
                      Service Cluster
                    </label>
                    <p className="text-sm text-gray-900 mt-1">
                      {formatServiceCluster(selectedLead.service_cluster)}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase">
                      Landing Page
                    </label>
                    <p className="text-sm text-gray-900 mt-1">
                      <Link
                        href={`/lp/${selectedLead.landing_page}`}
                        target="_blank"
                        className="text-blue-600 hover:underline inline-flex items-center gap-1"
                      >
                        /lp/{selectedLead.landing_page}
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </p>
                  </div>
                </div>

                <hr />

                {/* Attribution */}
                {(selectedLead.utm_source || selectedLead.utm_campaign) && (
                  <>
                    <div className="space-y-3">
                      <label className="text-xs font-medium text-gray-500 uppercase">
                        Campaign Attribution
                      </label>
                      {selectedLead.utm_source && (
                        <div className="flex items-center gap-2 text-sm">
                          <Globe className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">Source:</span>
                          <span className="text-gray-900">{selectedLead.utm_source}</span>
                        </div>
                      )}
                      {selectedLead.utm_medium && (
                        <div className="flex items-center gap-2 text-sm">
                          <Tag className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">Medium:</span>
                          <span className="text-gray-900">{selectedLead.utm_medium}</span>
                        </div>
                      )}
                      {selectedLead.utm_campaign && (
                        <div className="flex items-center gap-2 text-sm">
                          <Tag className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">Campaign:</span>
                          <span className="text-gray-900">{selectedLead.utm_campaign}</span>
                        </div>
                      )}
                    </div>
                    <hr />
                  </>
                )}

                {/* Personalization Params */}
                {(selectedLead.industry_param || selectedLead.role_param) && (
                  <>
                    <div className="space-y-3">
                      <label className="text-xs font-medium text-gray-500 uppercase">
                        Personalization
                      </label>
                      {selectedLead.industry_param && (
                        <div className="text-sm">
                          <span className="text-gray-600">Industry:</span>{' '}
                          <span className="text-gray-900 capitalize">
                            {selectedLead.industry_param}
                          </span>
                        </div>
                      )}
                      {selectedLead.role_param && (
                        <div className="text-sm">
                          <span className="text-gray-600">Role:</span>{' '}
                          <span className="text-gray-900 uppercase">{selectedLead.role_param}</span>
                        </div>
                      )}
                    </div>
                    <hr />
                  </>
                )}

                {/* Timestamps */}
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar className="w-4 h-4" />
                  <span>Submitted {formatDate(selectedLead.created_at)}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
