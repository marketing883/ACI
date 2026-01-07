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
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  author_name: string;
  category: string;
  read_time_minutes: number;
  is_published: boolean;
  is_featured: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

// Mock data
const mockBlogPosts: BlogPost[] = [
  {
    id: '1',
    slug: 'building-enterprise-data-mesh-architecture',
    title: 'Building an Enterprise Data Mesh Architecture: A Practical Guide',
    excerpt: 'Learn how to implement a data mesh architecture that scales with your organization.',
    author_name: 'Jag Tangirala',
    category: 'Data Engineering',
    read_time_minutes: 12,
    is_published: true,
    is_featured: true,
    published_at: '2025-01-03T00:00:00Z',
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-03T00:00:00Z',
  },
  {
    id: '2',
    slug: 'ai-governance-enterprise-guide',
    title: 'AI Governance for the Enterprise: From Policy to Practice',
    excerpt: 'A comprehensive framework for implementing AI governance.',
    author_name: 'Sarah Chen',
    category: 'Applied AI & ML',
    read_time_minutes: 10,
    is_published: true,
    is_featured: true,
    published_at: '2024-12-18T00:00:00Z',
    created_at: '2024-12-15T00:00:00Z',
    updated_at: '2024-12-18T00:00:00Z',
  },
  {
    id: '3',
    slug: 'databricks-vs-snowflake-2025',
    title: 'Databricks vs Snowflake in 2025: Choosing the Right Platform',
    excerpt: 'An objective comparison of the two leading data platforms.',
    author_name: 'Michael Torres',
    category: 'Data Engineering',
    read_time_minutes: 15,
    is_published: true,
    is_featured: true,
    published_at: '2024-12-10T00:00:00Z',
    created_at: '2024-12-08T00:00:00Z',
    updated_at: '2024-12-10T00:00:00Z',
  },
  {
    id: '4',
    slug: 'mlops-best-practices-production',
    title: 'MLOps Best Practices: Taking Models from Notebook to Production',
    excerpt: 'A battle-tested playbook for deploying ML models in enterprise environments.',
    author_name: 'Sarah Chen',
    category: 'Applied AI & ML',
    read_time_minutes: 11,
    is_published: true,
    is_featured: false,
    published_at: '2024-11-28T00:00:00Z',
    created_at: '2024-11-25T00:00:00Z',
    updated_at: '2024-11-28T00:00:00Z',
  },
  {
    id: '5',
    slug: 'cloud-cost-optimization-draft',
    title: 'Cloud Cost Optimization Strategies [DRAFT]',
    excerpt: 'Work in progress article about cloud cost optimization.',
    author_name: 'James Wilson',
    category: 'Cloud Modernization',
    read_time_minutes: 8,
    is_published: false,
    is_featured: false,
    published_at: null,
    created_at: '2024-12-20T00:00:00Z',
    updated_at: '2024-12-22T00:00:00Z',
  },
];

export default function BlogAdmin() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [configured, setConfigured] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  useEffect(() => {
    const isConfigured = isSupabaseConfigured();
    setConfigured(isConfigured);

    if (isConfigured) {
      fetchPosts();
    } else {
      setPosts(mockBlogPosts);
      setLoading(false);
    }
  }, []);

  async function fetchPosts() {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('id, slug, title, excerpt, author_name, category, read_time_minutes, is_published, is_featured, published_at, created_at, updated_at')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  }

  async function togglePublished(id: string, currentStatus: boolean) {
    const newStatus = !currentStatus;
    const updates: { is_published: boolean; published_at?: string } = { is_published: newStatus };
    if (newStatus && !posts.find(p => p.id === id)?.published_at) {
      updates.published_at = new Date().toISOString();
    }

    if (!configured) {
      setPosts(posts.map(p =>
        p.id === id ? { ...p, ...updates } : p
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

  const filteredPosts = posts.filter((post) =>
    searchQuery === '' ||
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.author_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  function formatDate(dateString: string | null) {
    if (!dateString) return 'Not published';
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
          <h1 className="text-2xl font-bold text-gray-900">Blog Posts</h1>
          <p className="text-gray-600">Create and manage blog articles</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-[var(--aci-primary)] text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="w-5 h-5" />
          New Post
        </button>
      </div>

      {!configured && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-yellow-800">Demo Mode</p>
            <p className="text-sm text-yellow-700">
              Showing sample data. Configure Supabase to manage real blog posts.
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
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[var(--aci-primary)] focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Posts Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading...</div>
        ) : filteredPosts.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No posts found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Author
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
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
                {filteredPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900 line-clamp-1">{post.title}</p>
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {post.read_time_minutes} min read
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{post.author_name}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700">
                        {post.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            post.is_published
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {post.is_published ? 'Published' : 'Draft'}
                        </span>
                        {post.is_featured && (
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-700">
                            Featured
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {formatDate(post.published_at)}
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
                            <button className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                              <Edit2 className="w-4 h-4" />
                              Edit
                            </button>
                            <button
                              onClick={() => togglePublished(post.id, post.is_published)}
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
