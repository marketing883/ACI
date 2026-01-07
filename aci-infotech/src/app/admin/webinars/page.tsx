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
  Calendar,
  Video,
  Users,
  Filter,
  X,
  ExternalLink,
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

interface Webinar {
  id: string;
  slug: string;
  title: string;
  description: string;
  scheduled_at: string;
  duration_minutes: number;
  platform: string;
  status: string;
  registration_url: string | null;
  recording_url: string | null;
  speakers: { name: string; title: string }[];
  featured_image: string | null;
  created_at: string;
}

export default function WebinarsAdmin() {
  const [webinars, setWebinars] = useState<Webinar[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [configured, setConfigured] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [deleteModal, setDeleteModal] = useState<Webinar | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const isConfigured = isSupabaseConfigured();
    setConfigured(isConfigured);

    if (isConfigured) {
      fetchWebinars();
    } else {
      setWebinars([]);
      setLoading(false);
    }
  }, []);

  async function fetchWebinars() {
    try {
      const { data, error } = await supabase
        .from('webinars')
        .select('*')
        .order('scheduled_at', { ascending: false });

      if (error) throw error;
      setWebinars(data || []);
    } catch (error) {
      console.error('Error fetching webinars:', error);
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(id: string, newStatus: string) {
    try {
      const { error } = await supabase
        .from('webinars')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;
      setWebinars(webinars.map(w => w.id === id ? { ...w, status: newStatus } : w));
    } catch (error) {
      console.error('Error updating webinar:', error);
    }
    setActiveMenu(null);
  }

  async function deleteWebinar(webinar: Webinar) {
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('webinars')
        .delete()
        .eq('id', webinar.id);

      if (error) throw error;
      setWebinars(webinars.filter(w => w.id !== webinar.id));
      setDeleteModal(null);
    } catch (error) {
      console.error('Error deleting webinar:', error);
      alert('Failed to delete webinar');
    } finally {
      setIsDeleting(false);
    }
  }

  const filteredWebinars = webinars.filter((webinar) => {
    const matchesSearch = searchQuery === '' ||
      webinar.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      webinar.description?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || webinar.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  function formatDate(dateString: string | null) {
    if (!dateString) return 'TBD';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  }

  function getStatusColor(status: string) {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-100 text-blue-700';
      case 'live':
        return 'bg-red-100 text-red-700';
      case 'completed':
        return 'bg-green-100 text-green-700';
      case 'cancelled':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-yellow-100 text-yellow-700';
    }
  }

  const stats = {
    total: webinars.length,
    upcoming: webinars.filter(w => w.status === 'upcoming').length,
    completed: webinars.filter(w => w.status === 'completed').length,
    cancelled: webinars.filter(w => w.status === 'cancelled').length,
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Webinars</h1>
          <p className="text-gray-600">Manage webinar announcements and recordings</p>
        </div>
        <Link
          href="/admin/webinars/new"
          className="flex items-center gap-2 px-4 py-2 bg-[var(--aci-primary)] text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          New Webinar
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm p-4">
          <p className="text-sm text-gray-500">Total</p>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <p className="text-sm text-gray-500">Upcoming</p>
          <p className="text-2xl font-bold text-blue-600">{stats.upcoming}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <p className="text-sm text-gray-500">Completed</p>
          <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <p className="text-sm text-gray-500">Cancelled</p>
          <p className="text-2xl font-bold text-gray-600">{stats.cancelled}</p>
        </div>
      </div>

      {!configured && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-yellow-800">Configure Supabase</p>
            <p className="text-sm text-yellow-700">
              Add Supabase credentials to manage webinars.
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
              placeholder="Search webinars..."
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
              <option value="upcoming">Upcoming</option>
              <option value="live">Live</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Webinars Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading...</div>
        ) : filteredWebinars.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            {webinars.length === 0 ? (
              <div>
                <Video className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                <p className="mb-4">No webinars yet</p>
                <Link
                  href="/admin/webinars/new"
                  className="text-blue-600 hover:underline"
                >
                  Create your first webinar
                </Link>
              </div>
            ) : (
              'No webinars match your search'
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Webinar
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Platform
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Speakers
                  </th>
                  <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredWebinars.map((webinar) => (
                  <tr key={webinar.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Video className="w-8 h-8 text-blue-500" />
                        <div>
                          <p className="font-medium text-gray-900 line-clamp-1">{webinar.title}</p>
                          <p className="text-sm text-gray-500">
                            {webinar.duration_minutes} min
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        {formatDate(webinar.scheduled_at)}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {webinar.platform || 'TBD'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(webinar.status)}`}>
                        {webinar.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Users className="w-4 h-4" />
                        {webinar.speakers?.length || 0}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="relative">
                        <button
                          onClick={() => setActiveMenu(activeMenu === webinar.id ? null : webinar.id)}
                          className="p-2 hover:bg-gray-100 rounded-lg"
                        >
                          <MoreVertical className="w-5 h-5 text-gray-400" />
                        </button>
                        {activeMenu === webinar.id && (
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-10">
                            {webinar.status === 'upcoming' && webinar.registration_url && (
                              <a
                                href={webinar.registration_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                              >
                                <ExternalLink className="w-4 h-4" />
                                Registration Page
                              </a>
                            )}
                            {webinar.recording_url && (
                              <a
                                href={webinar.recording_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                              >
                                <Video className="w-4 h-4" />
                                View Recording
                              </a>
                            )}
                            <Link
                              href={`/admin/webinars/${webinar.id}/edit`}
                              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                            >
                              <Edit2 className="w-4 h-4" />
                              Edit
                            </Link>
                            {webinar.status === 'upcoming' && (
                              <button
                                onClick={() => updateStatus(webinar.id, 'cancelled')}
                                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                              >
                                <EyeOff className="w-4 h-4" />
                                Cancel
                              </button>
                            )}
                            {webinar.status === 'upcoming' && (
                              <button
                                onClick={() => updateStatus(webinar.id, 'completed')}
                                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                              >
                                <Eye className="w-4 h-4" />
                                Mark Completed
                              </button>
                            )}
                            <button
                              onClick={() => {
                                setDeleteModal(webinar);
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
              <h3 className="text-lg font-semibold text-gray-900">Delete Webinar</h3>
              <button
                onClick={() => setDeleteModal(null)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-gray-600 mb-2">
              Are you sure you want to delete this webinar?
            </p>
            <p className="font-medium text-gray-900 mb-4 p-3 bg-gray-50 rounded-lg">
              {deleteModal.title}
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
                onClick={() => deleteWebinar(deleteModal)}
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
