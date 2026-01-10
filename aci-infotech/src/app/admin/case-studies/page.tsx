'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  MoreVertical,
  AlertCircle,
  X,
  FileText,
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

interface CaseStudy {
  id: string;
  slug: string;
  title: string;
  client_name: string;
  client_industry: string;
  services: string[];
  is_published: boolean;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

// Mock data for demo mode
const mockCaseStudies: CaseStudy[] = [
  {
    id: '1',
    slug: 'msci-data-automation',
    title: 'Consolidating 40+ Finance Systems Post-Acquisition',
    client_name: 'MSCI',
    client_industry: 'Financial Services',
    services: ['Data Engineering'],
    is_published: true,
    is_featured: true,
    created_at: '2024-12-01T00:00:00Z',
    updated_at: '2024-12-15T00:00:00Z',
  },
  {
    id: '2',
    slug: 'racetrac-martech',
    title: 'Real-Time Customer Engagement Across 600+ Locations',
    client_name: 'RaceTrac',
    client_industry: 'Retail',
    services: ['MarTech & CDP'],
    is_published: true,
    is_featured: true,
    created_at: '2024-11-15T00:00:00Z',
    updated_at: '2024-12-10T00:00:00Z',
  },
  {
    id: '3',
    slug: 'sodexo-unified-data',
    title: 'Unified Global Data Platform for 400K+ Employees',
    client_name: 'Sodexo',
    client_industry: 'Hospitality',
    services: ['Data Engineering'],
    is_published: true,
    is_featured: true,
    created_at: '2024-11-01T00:00:00Z',
    updated_at: '2024-11-20T00:00:00Z',
  },
  {
    id: '4',
    slug: 'fortune-100-retailer-ai',
    title: 'AI-Powered Demand Forecasting at Scale',
    client_name: 'Fortune 100 Retailer',
    client_industry: 'Retail',
    services: ['Applied AI & ML'],
    is_published: true,
    is_featured: false,
    created_at: '2024-10-15T00:00:00Z',
    updated_at: '2024-10-20T00:00:00Z',
  },
  {
    id: '5',
    slug: 'healthcare-cloud-migration',
    title: 'HIPAA-Compliant Cloud Migration for 15 Hospitals',
    client_name: 'Regional Healthcare System',
    client_industry: 'Healthcare',
    services: ['Cloud Modernization'],
    is_published: false,
    is_featured: false,
    created_at: '2024-10-01T00:00:00Z',
    updated_at: '2024-10-05T00:00:00Z',
  },
];

export default function CaseStudiesAdmin() {
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [configured, setConfigured] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [deleteModal, setDeleteModal] = useState<CaseStudy | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const isConfigured = isSupabaseConfigured();
    setConfigured(isConfigured);

    if (isConfigured) {
      fetchCaseStudies();
    } else {
      setCaseStudies(mockCaseStudies);
      setLoading(false);
    }
  }, []);

  async function fetchCaseStudies() {
    try {
      const { data, error } = await supabase
        .from('case_studies')
        .select('id, slug, title, client_name, client_industry, services, is_published, is_featured, created_at, updated_at')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCaseStudies(data || []);
    } catch (error) {
      console.error('Error fetching case studies:', error);
    } finally {
      setLoading(false);
    }
  }

  async function togglePublished(id: string, currentlyPublished: boolean) {
    const newIsPublished = !currentlyPublished;

    if (!configured) {
      setCaseStudies(caseStudies.map(cs =>
        cs.id === id ? { ...cs, is_published: newIsPublished } : cs
      ));
      setActiveMenu(null);
      return;
    }

    try {
      const { error } = await supabase
        .from('case_studies')
        .update({
          is_published: newIsPublished,
          published_at: newIsPublished ? new Date().toISOString() : null
        })
        .eq('id', id);

      if (error) throw error;
      setCaseStudies(caseStudies.map(cs =>
        cs.id === id ? { ...cs, is_published: newIsPublished } : cs
      ));
    } catch (error) {
      console.error('Error updating case study:', error);
    }
    setActiveMenu(null);
  }

  async function toggleFeatured(id: string, currentStatus: boolean) {
    if (!configured) {
      setCaseStudies(caseStudies.map(cs =>
        cs.id === id ? { ...cs, is_featured: !currentStatus } : cs
      ));
      setActiveMenu(null);
      return;
    }

    try {
      const { error } = await supabase
        .from('case_studies')
        .update({ is_featured: !currentStatus })
        .eq('id', id);

      if (error) throw error;
      setCaseStudies(caseStudies.map(cs =>
        cs.id === id ? { ...cs, is_featured: !currentStatus } : cs
      ));
    } catch (error) {
      console.error('Error updating case study:', error);
    }
    setActiveMenu(null);
  }

  async function deleteCaseStudy(caseStudy: CaseStudy) {
    if (!configured) {
      setCaseStudies(caseStudies.filter(cs => cs.id !== caseStudy.id));
      setDeleteModal(null);
      return;
    }

    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('case_studies')
        .delete()
        .eq('id', caseStudy.id);

      if (error) throw error;
      setCaseStudies(caseStudies.filter(cs => cs.id !== caseStudy.id));
      setDeleteModal(null);
    } catch (error) {
      console.error('Error deleting case study:', error);
      alert('Failed to delete case study');
    } finally {
      setIsDeleting(false);
    }
  }

  const filteredCaseStudies = caseStudies.filter((cs) =>
    searchQuery === '' ||
    cs.client_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cs.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cs.client_industry?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }

  const stats = {
    total: caseStudies.length,
    published: caseStudies.filter(cs => cs.is_published).length,
    draft: caseStudies.filter(cs => !cs.is_published).length,
    featured: caseStudies.filter(cs => cs.is_featured).length,
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Case Studies</h1>
          <p className="text-gray-600">Manage client success stories</p>
        </div>
        <Link
          href="/admin/case-studies/new"
          className="flex items-center gap-2 px-4 py-2 bg-[var(--aci-primary)] text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Case Study
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm p-4">
          <p className="text-sm text-gray-500">Total</p>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <p className="text-sm text-gray-500">Published</p>
          <p className="text-2xl font-bold text-green-600">{stats.published}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <p className="text-sm text-gray-500">Draft</p>
          <p className="text-2xl font-bold text-gray-600">{stats.draft}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <p className="text-sm text-gray-500">Featured</p>
          <p className="text-2xl font-bold text-yellow-600">{stats.featured}</p>
        </div>
      </div>

      {!configured && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-yellow-800">Demo Mode</p>
            <p className="text-sm text-yellow-700">
              Showing sample data. Configure Supabase to manage real case studies.
            </p>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm mb-6">
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search case studies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[var(--aci-primary)] focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Case Studies Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading...</div>
        ) : filteredCaseStudies.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            {caseStudies.length === 0 ? (
              <div>
                <FileText className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                <p className="mb-4">No case studies yet</p>
                <Link
                  href="/admin/case-studies/new"
                  className="text-blue-600 hover:underline"
                >
                  Create your first case study
                </Link>
              </div>
            ) : (
              'No case studies match your search'
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client / Title
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Industry
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Services
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Updated
                  </th>
                  <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredCaseStudies.map((cs) => (
                  <tr key={cs.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{cs.client_name}</p>
                        <p className="text-sm text-gray-500 line-clamp-1">{cs.title}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{cs.client_industry || '-'}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {cs.services?.length > 0 ? cs.services.slice(0, 2).join(', ') : '-'}
                      {cs.services?.length > 2 && ` +${cs.services.length - 2}`}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            cs.is_published
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {cs.is_published ? 'Published' : 'Draft'}
                        </span>
                        {cs.is_featured && (
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-700">
                            Featured
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {formatDate(cs.updated_at)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="relative">
                        <button
                          onClick={() => setActiveMenu(activeMenu === cs.id ? null : cs.id)}
                          className="p-2 hover:bg-gray-100 rounded-lg"
                        >
                          <MoreVertical className="w-5 h-5 text-gray-400" />
                        </button>
                        {activeMenu === cs.id && (
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-10">
                            <Link
                              href={`/case-studies/${cs.slug}`}
                              target="_blank"
                              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                            >
                              <Eye className="w-4 h-4" />
                              View Live
                            </Link>
                            <Link
                              href={`/admin/case-studies/${cs.id}/edit`}
                              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                            >
                              <Edit2 className="w-4 h-4" />
                              Edit
                            </Link>
                            <button
                              onClick={() => togglePublished(cs.id, cs.is_published)}
                              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                            >
                              {cs.is_published ? (
                                <>
                                  <EyeOff className="w-4 h-4" />
                                  Unpublish
                                </>
                              ) : (
                                <>
                                  <Eye className="w-4 h-4" />
                                  Publish
                                </>
                              )}
                            </button>
                            <button
                              onClick={() => toggleFeatured(cs.id, cs.is_featured)}
                              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                            >
                              {cs.is_featured ? 'Remove Featured' : 'Mark Featured'}
                            </button>
                            <button
                              onClick={() => {
                                setDeleteModal(cs);
                                setActiveMenu(null);
                              }}
                              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Delete Case Study</h3>
              <button
                onClick={() => setDeleteModal(null)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-gray-600 mb-2">
              Are you sure you want to delete this case study?
            </p>
            <p className="font-medium text-gray-900 mb-4 p-3 bg-gray-50 rounded-lg">
              {deleteModal.client_name}: {deleteModal.title}
            </p>
            <p className="text-sm text-red-600 mb-6">
              This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteModal(null)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteCaseStudy(deleteModal)}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
