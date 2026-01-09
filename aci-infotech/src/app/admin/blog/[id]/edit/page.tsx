'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Save,
  Loader2,
  Sparkles,
  Search,
  TrendingUp,
  Eye,
  Image as ImageIcon,
  X,
  Bold,
  Italic,
  List,
  Heading,
  Link as LinkIcon,
  Code,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface SEOData {
  search_volume: number;
  cpc: number;
  competition: number;
  difficulty: number;
}

const categories = [
  'Data & Analytics',
  'AI & Machine Learning',
  'Cloud Infrastructure',
  'Digital Transformation',
  'Cybersecurity',
  'DevOps & Automation',
  'Enterprise Applications',
  'Industry Insights',
];

export default function EditBlogPage() {
  const router = useRouter();
  const params = useParams();
  const postId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState<string | null>(null);

  // Form state
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [featuredImage, setFeaturedImage] = useState('');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [status, setStatus] = useState<'draft' | 'published'>('draft');

  // SEO state
  const [targetKeyword, setTargetKeyword] = useState('');
  const [seoData, setSeoData] = useState<SEOData | null>(null);
  const [loadingSEO, setLoadingSEO] = useState(false);

  // Load post data
  useEffect(() => {
    async function loadPost() {
      try {
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('id', postId)
          .single();

        if (error) throw error;

        if (data) {
          setTitle(data.title || '');
          setSlug(data.slug || '');
          setExcerpt(data.excerpt || '');
          setContent(data.content || '');
          setCategory(data.category || '');
          setTags(data.tags?.join(', ') || '');
          setAuthorName(data.author_name || '');
          setFeaturedImage(data.featured_image || '');
          setMetaTitle(data.meta_title || '');
          setMetaDescription(data.meta_description || '');
          setStatus(data.status === 'published' ? 'published' : 'draft');
          setTargetKeyword(data.keywords?.[0] || '');
        }
      } catch (error) {
        console.error('Error loading post:', error);
        alert('Failed to load post');
      } finally {
        setLoading(false);
      }
    }

    loadPost();
  }, [postId]);

  // Fetch SEO data
  const fetchSEOData = async () => {
    if (!targetKeyword) return;

    setLoadingSEO(true);
    try {
      const response = await fetch(`/api/admin/seo?keyword=${encodeURIComponent(targetKeyword)}`);
      const data = await response.json();

      if (data.success && data.data) {
        setSeoData(data.data);
      }
    } catch (error) {
      console.error('Error fetching SEO data:', error);
    } finally {
      setLoadingSEO(false);
    }
  };

  // AI Generate content
  const generateContent = async (field: string) => {
    if (!title && field !== 'title') {
      alert('Please enter a title first');
      return;
    }

    setGenerating(field);
    try {
      const response = await fetch('/api/admin/content-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'blog',
          field: field === 'meta_title' ? 'title' : field,
          context: {
            title,
            category,
            keyword: targetKeyword,
            existingContent: field === 'content' ? excerpt : undefined,
          },
        }),
      });

      const data = await response.json();
      const generated = data.content || data.generated;
      if (generated) {
        switch (field) {
          case 'title':
            setTitle(generated);
            break;
          case 'excerpt':
            setExcerpt(generated);
            break;
          case 'content':
            setContent(generated);
            break;
          case 'meta_title':
            setMetaTitle(generated);
            break;
          case 'meta_description':
            setMetaDescription(generated);
            break;
        }
      }
    } catch (error) {
      console.error('Error generating content:', error);
    } finally {
      setGenerating(null);
    }
  };

  // Insert formatting
  const insertFormatting = (before: string, after: string = '') => {
    const textarea = document.querySelector('textarea[name="content"]') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = content.substring(start, end);
    const newContent = content.substring(0, start) + before + selected + after + content.substring(end);
    setContent(newContent);
  };

  // Save post
  const handleSave = async () => {
    if (!title || !slug) {
      alert('Title and slug are required');
      return;
    }

    setSaving(true);
    try {
      const postData = {
        title,
        slug,
        excerpt,
        content,
        category,
        tags: tags.split(',').map(t => t.trim()).filter(Boolean),
        author_name: authorName || 'ACI Infotech',
        featured_image: featuredImage || null,
        meta_title: metaTitle || title,
        meta_description: metaDescription || excerpt?.substring(0, 160),
        keywords: targetKeyword ? [targetKeyword] : null,
        status,
        published_at: status === 'published' ? new Date().toISOString() : null,
      };

      const { error } = await supabase
        .from('blog_posts')
        .update(postData)
        .eq('id', postId);

      if (error) throw error;

      router.push('/admin/blog');
    } catch (error) {
      console.error('Error saving post:', error);
      alert('Failed to save post');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/blog"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit Blog Post</h1>
            <p className="text-gray-500">Update your article</p>
          </div>
        </div>
        <div className="flex gap-3">
          {status === 'published' && (
            <Link
              href={`/blog/${slug}`}
              target="_blank"
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Eye className="w-4 h-4" />
              View Live
            </Link>
          )}
          <button
            onClick={() => { setStatus('draft'); handleSave(); }}
            disabled={saving}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            Save Draft
          </button>
          <button
            onClick={() => { setStatus('published'); handleSave(); }}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {status === 'published' ? 'Update' : 'Publish'}
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title & Slug */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-medium text-gray-700">Title *</label>
                  <button
                    onClick={() => generateContent('title')}
                    disabled={generating === 'title'}
                    className="w-7 h-7 flex items-center justify-center rounded-lg bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white shadow-sm disabled:opacity-50"
                    title="Generate with AI"
                  >
                    {generating === 'title' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL Slug *</label>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 text-sm">/blog/</span>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Excerpt */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">Excerpt</label>
              <button
                onClick={() => generateContent('excerpt')}
                disabled={generating === 'excerpt'}
                className="w-7 h-7 flex items-center justify-center rounded-lg bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white shadow-sm disabled:opacity-50"
                title="Generate with AI"
              >
                {generating === 'excerpt' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
              </button>
            </div>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="A brief summary of the article..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Content Editor */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">Content</label>
              <button
                onClick={() => generateContent('content')}
                disabled={generating === 'content'}
                className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white rounded-lg shadow-sm text-sm disabled:opacity-50"
                title="Generate with AI"
              >
                {generating === 'content' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                Generate Article
              </button>
            </div>

            {/* Formatting Toolbar */}
            <div className="flex gap-1 mb-2 p-2 bg-gray-50 rounded-lg border border-gray-200">
              <button onClick={() => insertFormatting('**', '**')} className="p-2 hover:bg-gray-200 rounded" title="Bold">
                <Bold className="w-4 h-4" />
              </button>
              <button onClick={() => insertFormatting('*', '*')} className="p-2 hover:bg-gray-200 rounded" title="Italic">
                <Italic className="w-4 h-4" />
              </button>
              <button onClick={() => insertFormatting('## ')} className="p-2 hover:bg-gray-200 rounded" title="Heading">
                <Heading className="w-4 h-4" />
              </button>
              <button onClick={() => insertFormatting('- ')} className="p-2 hover:bg-gray-200 rounded" title="List">
                <List className="w-4 h-4" />
              </button>
              <button onClick={() => insertFormatting('[', '](url)')} className="p-2 hover:bg-gray-200 rounded" title="Link">
                <LinkIcon className="w-4 h-4" />
              </button>
              <button onClick={() => insertFormatting('`', '`')} className="p-2 hover:bg-gray-200 rounded" title="Code">
                <Code className="w-4 h-4" />
              </button>
            </div>

            <textarea
              name="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your article content in Markdown or HTML..."
              rows={20}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* SEO Panel */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              SEO Analysis
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Target Keyword
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={targetKeyword}
                    onChange={(e) => setTargetKeyword(e.target.value)}
                    placeholder="e.g., data mesh architecture"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                  <button
                    onClick={fetchSEOData}
                    disabled={loadingSEO || !targetKeyword}
                    className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    {loadingSEO ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {seoData && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500">Search Volume</p>
                    <p className="font-bold text-lg">{seoData.search_volume.toLocaleString()}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500">Difficulty</p>
                    <p className="font-bold text-lg">{seoData.difficulty}/100</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500">CPC</p>
                    <p className="font-bold text-lg">${seoData.cpc.toFixed(2)}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500">Competition</p>
                    <p className="font-bold text-lg">{(seoData.competition * 100).toFixed(0)}%</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Featured Image */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold mb-4">Featured Image</h3>

            {featuredImage ? (
              <div className="relative">
                <img
                  src={featuredImage}
                  alt="Featured"
                  className="w-full h-32 object-cover rounded-lg"
                />
                <button
                  onClick={() => setFeaturedImage('')}
                  className="absolute top-2 right-2 p-1 bg-white rounded-full shadow"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <ImageIcon className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-500">No image set</p>
              </div>
            )}

            <input
              type="url"
              value={featuredImage}
              onChange={(e) => setFeaturedImage(e.target.value)}
              placeholder="Image URL"
              className="w-full mt-3 px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>

          {/* Post Settings */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold mb-4">Post Settings</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="tag1, tag2, tag3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
                <input
                  type="text"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="Author name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
            </div>
          </div>

          {/* SEO Settings */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold mb-4">SEO Settings</h3>

            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-medium text-gray-700">Meta Title</label>
                  <button
                    onClick={() => generateContent('meta_title')}
                    disabled={generating === 'meta_title'}
                    className="w-6 h-6 flex items-center justify-center rounded-lg bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white shadow-sm disabled:opacity-50"
                    title="Generate with AI"
                  >
                    {generating === 'meta_title' ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                  </button>
                </div>
                <input
                  type="text"
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                  placeholder={title}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">{(metaTitle || title).length}/60</p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-medium text-gray-700">Meta Description</label>
                  <button
                    onClick={() => generateContent('meta_description')}
                    disabled={generating === 'meta_description'}
                    className="w-6 h-6 flex items-center justify-center rounded-lg bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white shadow-sm disabled:opacity-50"
                    title="Generate with AI"
                  >
                    {generating === 'meta_description' ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                  </button>
                </div>
                <textarea
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  placeholder={excerpt?.substring(0, 160)}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">{(metaDescription || excerpt?.substring(0, 160) || '').length}/160</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
