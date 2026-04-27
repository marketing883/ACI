'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, Edit, Trash2, Eye, Newspaper, ExternalLink, Star, StarOff } from 'lucide-react';

interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  source: string;
  external_url: string;
  link_text: string;
  image_url: string | null;
  published_at: string;
  status: string;
  is_featured: boolean;
  created_at: string;
}

const statusColors: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-700',
  published: 'bg-green-100 text-green-700',
  archived: 'bg-red-100 text-red-700',
};

export default function AdminNewsPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ status: '' });
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    fetchNews();
  }, [filter]);

  async function fetchNews() {
    try {
      const params = new URLSearchParams();
      if (filter.status) params.append('status', filter.status);

      const response = await fetch(`/api/admin/news?${params}`);
      const data = await response.json();
      setNews(data.news || []);
    } catch (error) {
      console.error('Failed to fetch news:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this news item?')) {
      return;
    }

    setDeleting(id);
    try {
      const response = await fetch(`/api/admin/news/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setNews(news.filter(n => n.id !== id));
      }
    } catch (error) {
      console.error('Failed to delete news:', error);
    } finally {
      setDeleting(null);
    }
  }

  async function toggleFeatured(id: string, currentValue: boolean) {
    try {
      const response = await fetch(`/api/admin/news/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_featured: !currentValue }),
      });
      if (response.ok) {
        setNews(news.map(n => n.id === id ? { ...n, is_featured: !currentValue } : n));
      }
    } catch (error) {
      console.error('Failed to toggle featured:', error);
    }
  }

  const stats = {
    total: news.length,
    published: news.filter(n => n.status === 'published').length,
    draft: news.filter(n => n.status === 'draft').length,
    featured: news.filter(n => n.is_featured).length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">News & Press</h1>
          <p className="text-gray-500">Manage news items and press releases</p>
        </div>
        <Link
          href="/admin/news/new"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add News
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Newspaper className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              <p className="text-sm text-gray-500">Total</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Eye className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.published}</p>
              <p className="text-sm text-gray-500">Published</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 rounded-lg">
              <Edit className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.draft}</p>
              <p className="text-sm text-gray-500">Drafts</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Star className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.featured}</p>
              <p className="text-sm text-gray-500">Featured</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4 bg-white p-4 rounded-lg border">
        <select
          value={filter.status}
          onChange={(e) => setFilter({ ...filter, status: e.target.value })}
          className="px-3 py-2 border rounded-lg text-sm"
        >
          <option value="">All Status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      {/* News Table */}
      <div className="bg-white rounded-lg border overflow-x-auto">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading news...</div>
        ) : news.length === 0 ? (
          <div className="p-8 text-center">
            <Newspaper className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">No news items found</p>
            <Link
              href="/admin/news/new"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" />
              Add your first news item
            </Link>
          </div>
        ) : (
          <table className="w-full min-w-[900px]">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500 w-[350px]">News</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500 w-[120px]">Source</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500 w-[100px]">Status</th>
                <th className="text-center px-4 py-3 text-sm font-medium text-gray-500 w-[80px]">Featured</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500 w-[100px]">Date</th>
                <th className="text-right px-4 py-3 text-sm font-medium text-gray-500 w-[120px]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {news.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 max-w-[350px]">
                    <div className="flex items-center gap-3">
                      {item.image_url ? (
                        <div className="relative w-12 h-10 rounded overflow-hidden flex-shrink-0">
                          <Image
                            src={item.image_url}
                            alt={item.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-12 h-10 rounded bg-gray-100 flex items-center justify-center flex-shrink-0">
                          <Newspaper className="w-4 h-4 text-gray-400" />
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-gray-900 truncate text-sm">{item.title}</p>
                        <p className="text-xs text-gray-500 truncate">{item.excerpt}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-600 truncate max-w-[120px]">{item.source}</td>
                  <td className="px-4 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${statusColors[item.status]}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <button
                      onClick={() => toggleFeatured(item.id, item.is_featured)}
                      className={`p-1 rounded ${item.is_featured ? 'text-yellow-500' : 'text-gray-300 hover:text-yellow-500'}`}
                      title={item.is_featured ? 'Remove from featured' : 'Add to featured'}
                    >
                      {item.is_featured ? (
                        <Star className="w-5 h-5 fill-current" />
                      ) : (
                        <StarOff className="w-5 h-5" />
                      )}
                    </button>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-500">
                    {new Date(item.published_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <a
                        href={item.external_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                        title="View External"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                      <Link
                        href={`/admin/news/${item.id}/edit`}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(item.id)}
                        disabled={deleting === item.id}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-50"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
