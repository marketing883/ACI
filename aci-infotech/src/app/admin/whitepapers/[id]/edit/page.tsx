'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Save,
  Loader2,
  Upload,
  Sparkles,
  FileText,
  Image as ImageIcon,
  X,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

const categories = [
  'Data & Analytics',
  'AI & Machine Learning',
  'Cloud Infrastructure',
  'Digital Transformation',
  'Cybersecurity',
  'DevOps & Automation',
  'Enterprise Applications',
];

interface WhitepaperData {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  tags: string[];
  file_url: string | null;
  cover_image: string | null;
  requires_registration: boolean;
  featured: boolean;
  meta_title: string;
  meta_description: string;
  status: string;
}

export default function EditWhitepaperPage() {
  const router = useRouter();
  const params = useParams();
  const whitepapershipId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState<string | null>(null);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [requiresRegistration, setRequiresRegistration] = useState(true);
  const [featured, setFeatured] = useState(false);
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [status, setStatus] = useState<'draft' | 'published'>('draft');

  useEffect(() => {
    fetchWhitepaper();
  }, [whitepapershipId]);

  async function fetchWhitepaper() {
    try {
      const { data, error } = await supabase
        .from('whitepapers')
        .select('*')
        .eq('id', whitepapershipId)
        .single();

      if (error) throw error;

      if (data) {
        setTitle(data.title || '');
        setSlug(data.slug || '');
        setDescription(data.description || '');
        setCategory(data.category || '');
        setTags(data.tags?.join(', ') || '');
        setFileUrl(data.file_url || '');
        setCoverImage(data.cover_image || '');
        setRequiresRegistration(data.requires_registration ?? true);
        setFeatured(data.featured ?? false);
        setMetaTitle(data.meta_title || '');
        setMetaDescription(data.meta_description || '');
        setStatus(data.status || 'draft');
      }
    } catch (error) {
      console.error('Error fetching whitepaper:', error);
      alert('Failed to load whitepaper');
    } finally {
      setLoading(false);
    }
  }

  // Auto-generate slug from title
  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  };

  const handleTitleChange = (value: string) => {
    setTitle(value);
  };

  // AI Generate content
  const generateContent = async (field: 'description' | 'meta_title' | 'meta_description') => {
    if (!title) {
      alert('Please enter a title first');
      return;
    }

    setGenerating(field);
    try {
      const response = await fetch('/api/admin/content-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'whitepaper',
          field,
          context: { title, category, description },
        }),
      });

      const data = await response.json();
      const generated = data.content || data.generated;
      if (generated) {
        switch (field) {
          case 'description':
            setDescription(generated);
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

  // File upload handlers - using server-side API to bypass RLS
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      alert('Please upload a PDF file');
      return;
    }

    setUploadingFile(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'whitepapers');
      formData.append('bucket', 'ACI-web');

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Upload failed');
      }

      setFileUrl(result.url);
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Failed to upload file');
    } finally {
      setUploadingFile(false);
    }
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    setUploadingCover(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'whitepaper-covers');
      formData.append('bucket', 'ACI-web');

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Upload failed');
      }

      setCoverImage(result.url);
    } catch (error) {
      console.error('Error uploading cover:', error);
      alert('Failed to upload cover image');
    } finally {
      setUploadingCover(false);
    }
  };

  // Save whitepaper
  const handleSave = async (newStatus?: 'draft' | 'published') => {
    if (!title || !slug) {
      alert('Title and slug are required');
      return;
    }

    const finalStatus = newStatus || status;
    setSaving(true);

    try {
      const whitepaperData: Record<string, unknown> = {
        id: whitepapershipId,
        title,
        slug,
        description,
        category,
        tags: tags.split(',').map(t => t.trim()).filter(Boolean),
        file_url: fileUrl || null,
        cover_image: coverImage || null,
        requires_registration: requiresRegistration,
        featured,
        meta_title: metaTitle || title,
        meta_description: metaDescription || description?.substring(0, 160),
        status: finalStatus,
      };

      // If publishing and not already published, set published_at
      if (finalStatus === 'published' && status !== 'published') {
        whitepaperData.published_at = new Date().toISOString();
      }

      // Use server-side API to bypass RLS
      const response = await fetch('/api/admin/whitepapers', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(whitepaperData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to update whitepaper');
      }

      router.push('/admin/whitepapers');
    } catch (error) {
      console.error('Error saving whitepaper:', error);
      alert('Failed to save whitepaper');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/whitepapers"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit Whitepaper</h1>
            <p className="text-gray-500">Update whitepaper details</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => handleSave('draft')}
            disabled={saving}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            Save as Draft
          </button>
          <button
            onClick={() => handleSave('published')}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {status === 'published' ? 'Update' : 'Publish'}
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Basic Info */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">Basic Information</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g., The Complete Guide to Enterprise Data Mesh"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                URL Slug *
              </label>
              <div className="flex items-center gap-2">
                <span className="text-gray-500">/resources/whitepapers/</span>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <button
                  onClick={() => generateContent('description')}
                  disabled={generating === 'description'}
                  className="w-7 h-7 flex items-center justify-center rounded-lg bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white shadow-sm disabled:opacity-50"
                  title="Generate with AI"
                >
                  {generating === 'description' ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Sparkles className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="A compelling description of what readers will learn..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tags
                </label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="data, analytics, guide (comma separated)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        {/* File Upload */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">Files</h2>

          <div className="grid md:grid-cols-2 gap-6">
            {/* PDF Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                PDF File
              </label>
              {fileUrl ? (
                <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <FileText className="w-8 h-8 text-green-600" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-green-800 truncate">
                      File uploaded
                    </p>
                    <a
                      href={fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-green-600 hover:underline"
                    >
                      View PDF
                    </a>
                  </div>
                  <button
                    onClick={() => setFileUrl('')}
                    className="p-1 hover:bg-green-100 rounded"
                  >
                    <X className="w-4 h-4 text-green-600" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors">
                  {uploadingFile ? (
                    <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                  ) : (
                    <Upload className="w-8 h-8 text-gray-400" />
                  )}
                  <span className="text-sm text-gray-600">
                    {uploadingFile ? 'Uploading...' : 'Upload PDF file'}
                  </span>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileUpload}
                    className="hidden"
                    disabled={uploadingFile}
                  />
                </label>
              )}
            </div>

            {/* Cover Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cover Image
              </label>
              {coverImage ? (
                <div className="relative">
                  <img
                    src={coverImage}
                    alt="Cover preview"
                    className="w-full h-40 object-cover rounded-lg"
                  />
                  <button
                    onClick={() => setCoverImage('')}
                    className="absolute top-2 right-2 p-1 bg-white rounded-full shadow hover:bg-gray-100"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors">
                  {uploadingCover ? (
                    <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                  ) : (
                    <ImageIcon className="w-8 h-8 text-gray-400" />
                  )}
                  <span className="text-sm text-gray-600">
                    {uploadingCover ? 'Uploading...' : 'Upload cover image'}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCoverUpload}
                    className="hidden"
                    disabled={uploadingCover}
                  />
                </label>
              )}
            </div>
          </div>
        </div>

        {/* Lead Capture Settings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">Lead Capture</h2>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={requiresRegistration}
              onChange={(e) => setRequiresRegistration(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <div>
              <span className="font-medium text-gray-900">Require registration to download</span>
              <p className="text-sm text-gray-500">
                Users must provide their email before downloading (recommended for lead generation)
              </p>
            </div>
          </label>
        </div>

        {/* Display Settings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">Display Settings</h2>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <div>
              <span className="font-medium text-gray-900">Feature on Homepage</span>
              <p className="text-sm text-gray-500">
                Display this whitepaper in the Insights section on the homepage. Only one whitepaper can be featured at a time.
              </p>
            </div>
          </label>
        </div>

        {/* SEO */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">SEO Settings</h2>

          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-gray-700">
                  Meta Title
                </label>
                <button
                  onClick={() => generateContent('meta_title')}
                  disabled={generating === 'meta_title'}
                  className="w-7 h-7 flex items-center justify-center rounded-lg bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white shadow-sm disabled:opacity-50"
                  title="Generate with AI"
                >
                  {generating === 'meta_title' ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Sparkles className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
              <input
                type="text"
                value={metaTitle}
                onChange={(e) => setMetaTitle(e.target.value)}
                placeholder={title || 'Page title for search engines'}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                {metaTitle.length || title.length}/60 characters
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-gray-700">
                  Meta Description
                </label>
                <button
                  onClick={() => generateContent('meta_description')}
                  disabled={generating === 'meta_description'}
                  className="w-7 h-7 flex items-center justify-center rounded-lg bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white shadow-sm disabled:opacity-50"
                  title="Generate with AI"
                >
                  {generating === 'meta_description' ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Sparkles className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
              <textarea
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                placeholder={description?.substring(0, 160) || 'Description for search engines'}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                {metaDescription.length || description?.substring(0, 160).length || 0}/160 characters
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
