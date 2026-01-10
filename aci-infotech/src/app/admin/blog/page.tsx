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
  Clock,
  Upload,
  Filter,
  X,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt?: string | null;
  author_name?: string | null;
  category?: string | null;
  is_published?: boolean;
  read_time_minutes?: number | null;
  published_at?: string | null;
  created_at?: string;
  updated_at?: string;
  featured_image_url?: string | null;
  // Allow any additional fields from the table
  [key: string]: unknown;
}

type SortColumn = 'title' | 'author_name' | 'category' | 'status' | 'published_at';
type SortDirection = 'asc' | 'desc';

export default function BlogAdmin() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [configured, setConfigured] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [deleteModal, setDeleteModal] = useState<BlogPost | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [sortColumn, setSortColumn] = useState<SortColumn>('published_at');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  useEffect(() => {
    const isConfigured = isSupabaseConfigured();
    setConfigured(isConfigured);

    if (isConfigured) {
      fetchPosts();
    } else {
      setPosts([]);
      setLoading(false);
    }
  }, []);

  async function fetchPosts() {
    try {
      // Use * to select all available columns - works with any table structure
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  }

  async function togglePublished(id: string, currentlyPublished: boolean) {
    const newIsPublished = !currentlyPublished;
    const updates: { is_published: boolean; published_at?: string | null } = { is_published: newIsPublished };
    if (newIsPublished) {
      updates.published_at = new Date().toISOString();
    }

    if (!configured) {
      setPosts(posts.map(p =>
        p.id === id ? { ...p, is_published: newIsPublished, published_at: updates.published_at || p.published_at } : p
      ));
      setActiveMenu(null);
      return;
    }

    try {
      const { error } = await supabase
        .from('blog_posts')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      setPosts(posts.map(p => p.id === id ? { ...p, ...updates } : p));
    } catch (error) {
      console.error('Error updating post:', error);
    }
    setActiveMenu(null);
  }

  async function deletePost(post: BlogPost) {
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', post.id);

      if (error) throw error;
      setPosts(posts.filter(p => p.id !== post.id));
      setDeleteModal(null);
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post');
    } finally {
      setIsDeleting(false);
    }
  }

  // Handle column sort click
  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  // Get sort icon for column header
  const getSortIcon = (column: SortColumn) => {
    if (sortColumn !== column) {
      return <ChevronsUpDown className="w-4 h-4 text-gray-400" />;
    }
    return sortDirection === 'asc'
      ? <ChevronUp className="w-4 h-4 text-[var(--aci-primary)]" />
      : <ChevronDown className="w-4 h-4 text-[var(--aci-primary)]" />;
  };

  const filteredPosts = posts
    .filter((post) => {
      const matchesSearch = searchQuery === '' ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.author_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.category?.toLowerCase().includes(searchQuery.toLowerCase());

      const postStatus = post.is_published ? 'published' : 'draft';
      const matchesStatus = statusFilter === 'all' || postStatus === statusFilter;

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      const aValue = a[sortColumn];
      const bValue = b[sortColumn];

      // Handle null/undefined values
      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return sortDirection === 'asc' ? 1 : -1;
      if (bValue == null) return sortDirection === 'asc' ? -1 : 1;

      // Compare based on type
      if (sortColumn === 'published_at') {
        const aDate = new Date(aValue as string).getTime();
        const bDate = new Date(bValue as string).getTime();
        return sortDirection === 'asc' ? aDate - bDate : bDate - aDate;
      }

      // String comparison for other columns
      const aStr = String(aValue).toLowerCase();
      const bStr = String(bValue).toLowerCase();
      const comparison = aStr.localeCompare(bStr);
      return sortDirection === 'asc' ? comparison : -comparison;
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
    total: posts.length,
    published: posts.filter(p => p.is_published).length,
    draft: posts.filter(p => !p.is_published).length,
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Blog Posts</h1>
          <p className="text-gray-600">Create and manage blog articles</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/blog/import"
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Upload className="w-5 h-5" />
            Import
          </Link>
          <Link
            href="/admin/blog/new"
            className="flex items-center gap-2 px-4 py-2 bg-[var(--aci-primary)] text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            New Post
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm p-4">
          <p className="text-sm text-gray-500">Total Posts</p>
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
      </div>

      {!configured && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-yellow-800">Configure Supabase</p>
            <p className="text-sm text-yellow-700">
              Add Supabase credentials to manage blog posts. Use the Import feature to bring in existing content.
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
              placeholder="Search posts..."
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

      {/* Posts Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading...</div>
        ) : filteredPosts.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            {posts.length === 0 ? (
              <div>
                <p className="mb-4">No posts yet</p>
                <Link
                  href="/admin/blog/import"
                  className="text-blue-600 hover:underline"
                >
                  Import existing blog posts
                </Link>
              </div>
            ) : (
              'No posts match your search'
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th
                    onClick={() => handleSort('title')}
                    className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none"
                  >
                    <span className="flex items-center gap-1">
                      Title
                      {getSortIcon('title')}
                    </span>
                  </th>
                  <th
                    onClick={() => handleSort('author_name')}
                    className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none"
                  >
                    <span className="flex items-center gap-1">
                      Author
                      {getSortIcon('author_name')}
                    </span>
                  </th>
                  <th
                    onClick={() => handleSort('category')}
                    className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none"
                  >
                    <span className="flex items-center gap-1">
                      Category
                      {getSortIcon('category')}
                    </span>
                  </th>
                  <th
                    onClick={() => handleSort('status')}
                    className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none"
                  >
                    <span className="flex items-center gap-1">
                      Status
                      {getSortIcon('status')}
                    </span>
                  </th>
                  <th
                    onClick={() => handleSort('published_at')}
                    className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none"
                  >
                    <span className="flex items-center gap-1">
                      Published
                      {getSortIcon('published_at')}
                    </span>
                  </th>
                  <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900 line-clamp-1">{post.title}</p>
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {post.read_time_minutes || 5} min read
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{post.author_name || 'Unknown'}</td>
                    <td className="px-6 py-4">
                      {post.category && (
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700">
                          {post.category}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          post.is_published
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {post.is_published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {formatDate(post.published_at ?? null)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="relative">
                        <button
                          onClick={() => setActiveMenu(activeMenu === post.id ? null : post.id)}
                          className="p-2 hover:bg-gray-100 rounded-lg"
                        >
                          <MoreVertical className="w-5 h-5 text-gray-400" />
                        </button>
                        {activeMenu === post.id && (
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-10">
                            {post.is_published && (
                              <Link
                                href={`/blog/${post.slug}`}
                                target="_blank"
                                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                              >
                                <Eye className="w-4 h-4" />
                                View Live
                              </Link>
                            )}
                            <Link
                              href={`/admin/blog/${post.id}/edit`}
                              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                            >
                              <Edit2 className="w-4 h-4" />
                              Edit
                            </Link>
                            <button
                              onClick={() => togglePublished(post.id, post.is_published ?? false)}
                              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                            >
                              {post.is_published ? (
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
                                setDeleteModal(post);
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
              <h3 className="text-lg font-semibold text-gray-900">Delete Blog Post</h3>
              <button
                onClick={() => setDeleteModal(null)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-gray-600 mb-2">
              Are you sure you want to delete this post?
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
                onClick={() => deletePost(deleteModal)}
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
