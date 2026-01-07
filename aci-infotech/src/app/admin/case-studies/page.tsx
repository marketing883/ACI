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
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

interface CaseStudy {
  id: string;
  slug: string;
  client_name: string;
  industry: string;
  service_category: string;
  headline: string;
  is_published: boolean;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

// Mock data
const mockCaseStudies: CaseStudy[] = [
  {
    id: '1',
    slug: 'msci-data-automation',
    client_name: 'MSCI',
    industry: 'Financial Services',
    service_category: 'Data Engineering',
    headline: 'Consolidating 40+ Finance Systems Post-Acquisition',
    is_published: true,
    is_featured: true,
    created_at: '2024-12-01T00:00:00Z',
    updated_at: '2024-12-15T00:00:00Z',
  },
  {
    id: '2',
    slug: 'racetrac-martech',
    client_name: 'RaceTrac',
    industry: 'Retail',
    service_category: 'MarTech & CDP',
    headline: 'Real-Time Customer Engagement Across 600+ Locations',
    is_published: true,
    is_featured: true,
    created_at: '2024-11-15T00:00:00Z',
    updated_at: '2024-12-10T00:00:00Z',
  },
  {
    id: '3',
    slug: 'sodexo-unified-data',
    client_name: 'Sodexo',
    industry: 'Hospitality',
    service_category: 'Data Engineering',
    headline: 'Unified Global Data Platform for 400K+ Employees',
    is_published: true,
    is_featured: true,
    created_at: '2024-11-01T00:00:00Z',
    updated_at: '2024-11-20T00:00:00Z',
  },
  {
    id: '4',
    slug: 'fortune-100-retailer-ai',
    client_name: 'Fortune 100 Retailer',
    industry: 'Retail',
    service_category: 'Applied AI & ML',
    headline: 'AI-Powered Demand Forecasting at Scale',
    is_published: true,
    is_featured: false,
    created_at: '2024-10-15T00:00:00Z',
    updated_at: '2024-10-20T00:00:00Z',
  },
  {
    id: '5',
    slug: 'healthcare-cloud-migration',
    client_name: 'Regional Healthcare System',
    industry: 'Healthcare',
    service_category: 'Cloud Modernization',
    headline: 'HIPAA-Compliant Cloud Migration for 15 Hospitals',
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
        .select('id, slug, client_name, industry, service_category, headline, is_published, is_featured, created_at, updated_at')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCaseStudies(data || []);
    } catch (error) {
      console.error('Error fetching case studies:', error);
    } finally {
      setLoading(false);
    }
  }

  async function togglePublished(id: string, currentStatus: boolean) {
    if (!configured) {
      setCaseStudies(caseStudies.map(cs =>
        cs.id === id ? { ...cs, is_published: !currentStatus } : cs
      ));
      return;
    }

    try {
      const { error } = await supabase
        .from('case_studies')
        .update({ is_published: !currentStatus })
        .eq('id', id);

      if (error) throw error;
      setCaseStudies(caseStudies.map(cs =>
        cs.id === id ? { ...cs, is_published: !currentStatus } : cs
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

  const filteredCaseStudies = caseStudies.filter((cs) =>
    searchQuery === '' ||
    cs.client_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cs.headline.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cs.industry.toLowerCase().includes(searchQuery.toLowerCase())
  );

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Case Studies</h1>
          <p className="text-gray-600">Manage client success stories</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-[var(--aci-primary)] text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="w-5 h-5" />
          Add Case Study
        </button>
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
          <div className="p-8 text-center text-gray-500">No case studies found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client / Headline
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Industry
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Service
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
                        <p className="text-sm text-gray-500 line-clamp-1">{cs.headline}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{cs.industry}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{cs.service_category}</td>
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
                            <button className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                              <Edit2 className="w-4 h-4" />
                              Edit
                            </button>
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
                            <button className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50">
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
    </div>
  );
}
