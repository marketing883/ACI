'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Save,
  Eye,
  Sparkles,
  Loader2,
  Search,
  Image as ImageIcon,
  Bold,
  Italic,
  List,
  Link as LinkIcon,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  Code,
  X,
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

const CATEGORIES = [
  'Data Engineering',
  'Applied AI & ML',
  'Cloud Modernization',
  'MarTech & CDP',
  'Digital Transformation',
  'Cyber Security',
  'Industry Insights',
  'Technology Trends',
];

const SUGGESTED_TAGS = [
  'Databricks', 'Snowflake', 'AWS', 'Azure', 'AI', 'Machine Learning',
  'Data Lakehouse', 'ETL', 'Cloud Migration', 'Kubernetes', 'DevOps',
  'CDP', 'Marketing Automation', 'Digital Transformation', 'GenAI',
];

export default function NewBlogPostPage() {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatingField, setGeneratingField] = useState<string | null>(null);

  // Form state
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [author, setAuthor] = useState('ACI Team');
  const [featuredImage, setFeaturedImage] = useState('');
  const [isPublished, setIsPublished] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);

  // Keyword research
  const [keyword, setKeyword] = useState('');
  const [keywordResults, setKeywordResults] = useState<{
    searchVolume?: number;
    difficulty?: string;
    relatedKeywords?: string[];
  } | null>(null);

  // Auto-generate slug from title
  function handleTitleChange(value: string) {
    setTitle(value);
    const generatedSlug = value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    setSlug(generatedSlug);
  }

  // Add tag
  function addTag(tag: string) {
    const trimmedTag = tag.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
    }
    setTagInput('');
  }

  // Remove tag
  function removeTag(tagToRemove: string) {
    setTags(tags.filter(t => t !== tagToRemove));
  }

  // Generate content with AI
  async function generateWithAI(field: 'title' | 'excerpt' | 'content' | 'outline') {
    if (!keyword && !title) {
      alert('Please enter a keyword or title first');
      return;
    }

    setIsGenerating(true);
    setGeneratingField(field);

    try {
      const response = await fetch('/api/admin/content-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'blog',
          field,
          context: {
            keyword: keyword || title,
            title,
            category,
            existingContent: content,
          },
        }),
      });

      if (response.ok) {
        const data = await response.json();
        switch (field) {
          case 'title':
            setTitle(data.generated);
            handleTitleChange(data.generated);
            break;
          case 'excerpt':
            setExcerpt(data.generated);
            break;
          case 'content':
            setContent(data.generated);
            break;
          case 'outline':
            setContent(data.generated);
            break;
        }
      }
    } catch (error) {
      console.error('Error generating content:', error);
    } finally {
      setIsGenerating(false);
      setGeneratingField(null);
    }
  }

  // Keyword research (mock for now - would integrate DataforSEO)
  async function researchKeyword() {
    if (!keyword) return;

    // Mock results - would integrate with DataforSEO API
    setKeywordResults({
      searchVolume: Math.floor(Math.random() * 10000) + 1000,
      difficulty: ['Easy', 'Medium', 'Hard'][Math.floor(Math.random() * 3)],
      relatedKeywords: [
        `${keyword} best practices`,
        `${keyword} guide`,
        `${keyword} tutorial`,
        `enterprise ${keyword}`,
        `${keyword} 2025`,
      ],
    });
  }

  // Save post
  async function handleSave(publish: boolean = false) {
    if (!title || !slug || !content) {
      alert('Please fill in title, slug, and content');
      return;
    }

    setIsSaving(true);

    try {
      if (!isSupabaseConfigured()) {
        // Demo mode - just show success
        console.log('Saving post (demo mode):', { title, slug, content, category, tags });
        alert(publish ? 'Post published successfully!' : 'Draft saved successfully!');
        router.push('/admin/blog');
        return;
      }

      const postData = {
        title,
        slug,
        excerpt,
        content,
        category,
        tags,
        author_name: author,
        featured_image: featuredImage || null,
        is_published: publish,
        is_featured: isFeatured,
        published_at: publish ? new Date().toISOString() : null,
        read_time_minutes: Math.ceil(content.split(/\s+/).length / 200),
      };

      const { error } = await supabase
        .from('blog_posts')
        .insert(postData);

      if (error) throw error;

      router.push('/admin/blog');
    } catch (error) {
      console.error('Error saving post:', error);
      alert('Failed to save post');
    } finally {
      setIsSaving(false);
    }
  }

  // Insert formatting
  function insertFormatting(format: string) {
    const textarea = document.getElementById('content-editor') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);

    let newText = '';
    switch (format) {
      case 'bold':
        newText = `**${selectedText || 'bold text'}**`;
        break;
      case 'italic':
        newText = `*${selectedText || 'italic text'}*`;
        break;
      case 'h1':
        newText = `\n# ${selectedText || 'Heading 1'}\n`;
        break;
      case 'h2':
        newText = `\n## ${selectedText || 'Heading 2'}\n`;
        break;
      case 'h3':
        newText = `\n### ${selectedText || 'Heading 3'}\n`;
        break;
      case 'list':
        newText = `\n- ${selectedText || 'List item'}\n`;
        break;
      case 'link':
        newText = `[${selectedText || 'link text'}](url)`;
        break;
      case 'quote':
        newText = `\n> ${selectedText || 'Quote'}\n`;
        break;
      case 'code':
        newText = `\`${selectedText || 'code'}\``;
        break;
    }

    const newContent = content.substring(0, start) + newText + content.substring(end);
    setContent(newContent);
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/blog" className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">New Blog Post</h1>
            <p className="text-gray-600">Create a new article with AI assistance</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleSave(false)}
            disabled={isSaving}
            className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Save Draft
          </button>
          <button
            onClick={() => handleSave(true)}
            disabled={isSaving}
            className="flex items-center gap-2 px-4 py-2 bg-[var(--aci-primary)] text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Publish
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Editor */}
        <div className="lg:col-span-2 space-y-6">
          {/* Keyword Research */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Search className="w-5 h-5 text-gray-400" />
              Step 1: Keyword Research
            </h2>
            <div className="flex gap-3">
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Enter topic or target keyword..."
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[var(--aci-primary)] focus:border-transparent"
              />
              <button
                onClick={researchKeyword}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Research
              </button>
            </div>

            {keywordResults && (
              <div className="mt-4 p-4 bg-purple-50 rounded-lg">
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <p className="text-xs text-purple-600 font-medium">Search Volume</p>
                    <p className="text-lg font-bold text-purple-900">{keywordResults.searchVolume?.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-purple-600 font-medium">Difficulty</p>
                    <p className="text-lg font-bold text-purple-900">{keywordResults.difficulty}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-purple-600 font-medium mb-2">Related Keywords</p>
                  <div className="flex flex-wrap gap-2">
                    {keywordResults.relatedKeywords?.map((kw) => (
                      <button
                        key={kw}
                        onClick={() => setKeyword(kw)}
                        className="text-xs px-2 py-1 bg-white rounded border border-purple-200 text-purple-700 hover:bg-purple-100"
                      >
                        {kw}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Title */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-3">
              <label className="font-semibold text-gray-900">Title</label>
              <button
                onClick={() => generateWithAI('title')}
                disabled={isGenerating}
                className="flex items-center gap-1 text-sm text-purple-600 hover:text-purple-700"
              >
                {generatingField === 'title' ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
                Generate with AI
              </button>
            </div>
            <input
              type="text"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Enter post title..."
              className="w-full px-4 py-3 text-xl border border-gray-200 rounded-lg focus:ring-2 focus:ring-[var(--aci-primary)] focus:border-transparent"
            />
            <div className="mt-2">
              <label className="text-xs text-gray-500">Slug: </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded border-none focus:ring-1 focus:ring-[var(--aci-primary)]"
              />
            </div>
          </div>

          {/* Excerpt */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-3">
              <label className="font-semibold text-gray-900">Excerpt / Meta Description</label>
              <button
                onClick={() => generateWithAI('excerpt')}
                disabled={isGenerating}
                className="flex items-center gap-1 text-sm text-purple-600 hover:text-purple-700"
              >
                {generatingField === 'excerpt' ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
                Generate with AI
              </button>
            </div>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Brief summary for search results and social sharing..."
              rows={3}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[var(--aci-primary)] focus:border-transparent resize-none"
            />
            <p className="text-xs text-gray-400 mt-1">{excerpt.length}/160 characters</p>
          </div>

          {/* Content Editor */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-3">
              <label className="font-semibold text-gray-900">Content</label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => generateWithAI('outline')}
                  disabled={isGenerating}
                  className="flex items-center gap-1 text-sm text-purple-600 hover:text-purple-700"
                >
                  {generatingField === 'outline' ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4" />
                  )}
                  Generate Outline
                </button>
                <button
                  onClick={() => generateWithAI('content')}
                  disabled={isGenerating}
                  className="flex items-center gap-1 text-sm px-3 py-1 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  {generatingField === 'content' ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4" />
                  )}
                  Generate Full Article
                </button>
              </div>
            </div>

            {/* Formatting Toolbar */}
            <div className="flex items-center gap-1 p-2 bg-gray-50 rounded-t-lg border border-b-0 border-gray-200">
              <button onClick={() => insertFormatting('bold')} className="p-2 hover:bg-gray-200 rounded" title="Bold">
                <Bold className="w-4 h-4" />
              </button>
              <button onClick={() => insertFormatting('italic')} className="p-2 hover:bg-gray-200 rounded" title="Italic">
                <Italic className="w-4 h-4" />
              </button>
              <div className="w-px h-6 bg-gray-300 mx-1" />
              <button onClick={() => insertFormatting('h1')} className="p-2 hover:bg-gray-200 rounded" title="Heading 1">
                <Heading1 className="w-4 h-4" />
              </button>
              <button onClick={() => insertFormatting('h2')} className="p-2 hover:bg-gray-200 rounded" title="Heading 2">
                <Heading2 className="w-4 h-4" />
              </button>
              <button onClick={() => insertFormatting('h3')} className="p-2 hover:bg-gray-200 rounded" title="Heading 3">
                <Heading3 className="w-4 h-4" />
              </button>
              <div className="w-px h-6 bg-gray-300 mx-1" />
              <button onClick={() => insertFormatting('list')} className="p-2 hover:bg-gray-200 rounded" title="List">
                <List className="w-4 h-4" />
              </button>
              <button onClick={() => insertFormatting('link')} className="p-2 hover:bg-gray-200 rounded" title="Link">
                <LinkIcon className="w-4 h-4" />
              </button>
              <button onClick={() => insertFormatting('quote')} className="p-2 hover:bg-gray-200 rounded" title="Quote">
                <Quote className="w-4 h-4" />
              </button>
              <button onClick={() => insertFormatting('code')} className="p-2 hover:bg-gray-200 rounded" title="Code">
                <Code className="w-4 h-4" />
              </button>
            </div>

            <textarea
              id="content-editor"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your article content in Markdown..."
              rows={20}
              className="w-full px-4 py-3 border border-gray-200 rounded-b-lg focus:ring-2 focus:ring-[var(--aci-primary)] focus:border-transparent font-mono text-sm resize-none"
            />
            <p className="text-xs text-gray-400 mt-1">
              ~{Math.ceil(content.split(/\s+/).filter(Boolean).length / 200)} min read ({content.split(/\s+/).filter(Boolean).length} words)
            </p>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Post Settings */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Post Settings</h3>

            {/* Category */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[var(--aci-primary)]"
              >
                <option value="">Select category</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Tags */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-sm rounded"
                  >
                    {tag}
                    <button onClick={() => removeTag(tag)} className="hover:text-blue-900">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag(tagInput))}
                  placeholder="Add tag..."
                  className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[var(--aci-primary)]"
                />
                <button
                  onClick={() => addTag(tagInput)}
                  className="px-3 py-2 text-sm bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Add
                </button>
              </div>
              <div className="mt-2 flex flex-wrap gap-1">
                {SUGGESTED_TAGS.filter(t => !tags.includes(t)).slice(0, 6).map((tag) => (
                  <button
                    key={tag}
                    onClick={() => addTag(tag)}
                    className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded hover:bg-gray-200"
                  >
                    + {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Author */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Author</label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[var(--aci-primary)]"
              />
            </div>

            {/* Options */}
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-[var(--aci-primary)] focus:ring-[var(--aci-primary)]"
                />
                <span className="text-sm text-gray-700">Featured post</span>
              </label>
            </div>
          </div>

          {/* Featured Image */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Featured Image</h3>
            {featuredImage ? (
              <div className="relative">
                <img src={featuredImage} alt="Featured" className="w-full h-40 object-cover rounded-lg" />
                <button
                  onClick={() => setFeaturedImage('')}
                  className="absolute top-2 right-2 p-1 bg-white rounded-full shadow"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center">
                <ImageIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500 mb-2">Upload or drag image</p>
                <input
                  type="text"
                  value={featuredImage}
                  onChange={(e) => setFeaturedImage(e.target.value)}
                  placeholder="Or paste image URL..."
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[var(--aci-primary)]"
                />
              </div>
            )}
          </div>

          {/* Preview Link */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <button
              className="flex items-center justify-center gap-2 w-full px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Eye className="w-4 h-4" />
              Preview Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
