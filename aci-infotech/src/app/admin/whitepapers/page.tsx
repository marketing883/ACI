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
  Download,
  FileText,
  Filter,
  X,
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

interface Whitepaper {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  status: string;
  download_count: number;
  file_url: string | null;
  cover_image: string | null;
  requires_registration: boolean;
  published_at: string | null;
  created_at: string;
}

export default function WhitepapersAdmin() {
  const [whitepapers, setWhitepapers] = useState<Whitepaper[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [configured, setConfigured] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [deleteModal, setDeleteModal] = useState<Whitepaper | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const isConfigured = isSupabaseConfigured();
    setConfigured(isConfigured);

    if (isConfigured) {
      fetchWhitepapers();
    } else {
      setWhitepapers([]);
      setLoading(false);
    }
  }, []);

  async function fetchWhitepapers() {
    try {
      const { data, error } = await supabase
        .from('whitepapers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setWhitepapers(data || []);
    } catch (error) {
      console.error('Error fetching whitepapers:', error);
    } finally {
      setLoading(false);
    }
  }

  async function togglePublished(id: string, currentStatus: string) {
    const newStatus = currentStatus === 'published' ? 'draft' : 'published';
    const updates: { status: string; published_at?: string } = { status: newStatus };
    if (newStatus === 'published') {
      updates.published_at = new Date().toISOString();
    }

    try {
      const { error } = await supabase
        .from('whitepapers')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      setWhitepapers(whitepapers.map(w => w.id === id ? { ...w, ...updates } : w));
    } catch (error) {
      console.error('Error updating whitepaper:', error);
    }
    setActiveMenu(null);
  }

  async function deleteWhitepaper(whitepaper: Whitepaper) {
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('whitepapers')
        .delete()
        .eq('id', whitepaper.id);

      if (error) throw error;
      setWhitepapers(whitepapers.filter(w => w.id !== whitepaper.id));
      setDeleteModal(null);
    } catch (error) {
      console.error('Error deleting whitepaper:', error);
      alert('Failed to delete whitepaper');
    } finally {
      setIsDeleting(false);
    }
  }

  const filteredWhitepapers = whitepapers.filter((wp) => {
    const matchesSearch = searchQuery === '' ||
      wp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      wp.description?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || wp.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  function formatDate(dateString: string | null) {
    if (!dateString) return 'Not published';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }

  const stats = {
    total: whitepapers.length,
    published: whitepapers.filter(w => w.status === 'published').length,
    draft: whitepapers.filter(w => w.status === 'draft').length,
    totalDownloads: whitepapers.reduce((sum, w) => sum + (w.download_count || 0), 0),
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Whitepapers</h1>
          <p className="text-gray-600">Manage downloadable resources</p>
        </div>
        <Link
          href="/admin/whitepapers/new"
          className="flex items-center gap-2 px-4 py-2 bg-[var(--aci-primary)] text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          New Whitepaper
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
          <p className="text-sm text-gray-500">Drafts</p>
          <p className="text-2xl font-bold text-yellow-600">{stats.draft}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <p className="text-sm text-gray-500">Total Downloads</p>
          <p className="text-2xl font-bold text-blue-600">{stats.totalDownloads}</p>
        </div>
      </div>

      {!configured && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-yellow-800">Configure Supabase</p>
            <p className="text-sm text-yellow-700">
              Add Supabase credentials to manage whitepapers.
            </p>
          </div>
        </div>
      )}

      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow-sm mb-6">
        <div className="p-4 flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search whitepapers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[var(--aci-primary)] focus:border-transparent"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-9 pr-8 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[var(--aci-primary)] focus:border-transparent appearance-none bg-white"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>
      </div>

      {/* Whitepapers Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading...</div>
        ) : filteredWhitepapers.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            {whitepapers.length === 0 ? (
              <div>
                <FileText className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                <p className="mb-4">No whitepapers yet</p>
                <Link
                  href="/admin/whitepapers/new"
                  className="text-blue-600 hover:underline"
                >
                  Create your first whitepaper
                </Link>
              </div>
            ) : (
              'No whitepapers match your search'
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Downloads
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Published
                  </th>
                  <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredWhitepapers.map((wp) => (
                  <tr key={wp.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <FileText className="w-8 h-8 text-red-500" />
                        <div>
                          <p className="font-medium text-gray-900 line-clamp-1">{wp.title}</p>
                          <p className="text-sm text-gray-500 line-clamp-1">{wp.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {wp.category && (
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-700">
                          {wp.category}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            wp.status === 'published'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}
                        >
                          {wp.status === 'published' ? 'Published' : 'Draft'}
                        </span>
                        {wp.requires_registration && (
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700">
                            Gated
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-gray-600">
                        <Download className="w-4 h-4" />
                        {wp.download_count || 0}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {formatDate(wp.published_at)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="relative">
                        <button
                          onClick={() => setActiveMenu(activeMenu === wp.id ? null : wp.id)}
                          className="p-2 hover:bg-gray-100 rounded-lg"
                        >
                          <MoreVertical className="w-5 h-5 text-gray-400" />
                        </button>
                        {activeMenu === wp.id && (
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-10">
                            {wp.status === 'published' && (
                              <Link
                                href={`/resources/whitepapers/${wp.slug}`}
                                target="_blank"
                                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                              >
                                <Eye className="w-4 h-4" />
                                View Live
                              </Link>
                            )}
                            <Link
                              href={`/admin/whitepapers/${wp.id}/edit`}
                              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                            >
                              <Edit2 className="w-4 h-4" />
                              Edit
                            </Link>
                            <button
                              onClick={() => togglePublished(wp.id, wp.status)}
                              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                            >
                              {wp.status === 'published' ? (
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
                              onClick={() => {
                                setDeleteModal(wp);
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
              <h3 className="text-lg font-semibold text-gray-900">Delete Whitepaper</h3>
              <button
                onClick={() => setDeleteModal(null)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-gray-600 mb-2">
              Are you sure you want to delete this whitepaper?
            </p>
            <p className="font-medium text-gray-900 mb-4 p-3 bg-gray-50 rounded-lg">
              {deleteModal.title}
            </p>
            <p className="text-sm text-red-600 mb-6">
              This action cannot be undone. Download history will be preserved.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteModal(null)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteWhitepaper(deleteModal)}
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
