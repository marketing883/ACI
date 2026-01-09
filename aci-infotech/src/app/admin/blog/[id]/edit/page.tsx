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
  Edit3,
  Upload,
  Plus,
  Trash2,
  HelpCircle,
  User,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import SEOAssessment from '@/components/admin/SEOAssessment';

interface SEOData {
  search_volume: number;
  cpc: number;
  competition: number;
  difficulty: number;
}

interface FAQ {
  question: string;
  answer: string;
}

interface AuthorInfo {
  name: string;
  title: string;
  bio: string;
  avatar: string;
  linkedin: string;
  twitter: string;
}

const ARTICLE_TYPES = [
  { id: 'how-to', label: 'How-To Guide', description: 'Step-by-step instructions to accomplish a task', icon: '📋' },
  { id: 'listicle', label: 'Listicle', description: 'Numbered list of tips, tools, or best practices', icon: '📝' },
  { id: 'industry-analysis', label: 'Industry Analysis', description: 'In-depth market trends and insights', icon: '📊' },
  { id: 'thought-leadership', label: 'Thought Leadership', description: 'Expert perspectives and forward-thinking ideas', icon: '💡' },
  { id: 'case-study', label: 'Case Study', description: 'Real-world implementation story with results', icon: '🏆' },
  { id: 'comparison', label: 'Comparison/Versus', description: 'Side-by-side analysis of tools or approaches', icon: '⚖️' },
  { id: 'explainer', label: 'Explainer/What Is', description: 'Educational content explaining concepts', icon: '🎓' },
  { id: 'news-commentary', label: 'News & Commentary', description: 'Analysis of recent industry developments', icon: '📰' },
  { id: 'ultimate-guide', label: 'Ultimate Guide', description: 'Comprehensive resource on a topic', icon: '📚' },
  { id: 'interview', label: 'Interview/Q&A', description: 'Expert interview or Q&A format', icon: '🎤' },
];

const DEFAULT_AUTHORS: AuthorInfo[] = [
  {
    name: 'ACI Team',
    title: 'Engineering Excellence',
    bio: 'The ACI Infotech team brings decades of combined experience in enterprise data engineering, AI/ML, and cloud architecture.',
    avatar: '/images/team/aci-team.png',
    linkedin: 'https://linkedin.com/company/aci-infotech',
    twitter: '',
  },
];

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
  const [featuredImage, setFeaturedImage] = useState('');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [status, setStatus] = useState<'draft' | 'published'>('draft');
  const [articleType, setArticleType] = useState('how-to');

  // Author info
  const [authorInfo, setAuthorInfo] = useState<AuthorInfo>(DEFAULT_AUTHORS[0]);
  const [showCustomAuthor, setShowCustomAuthor] = useState(false);

  // FAQs
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [generatingFaqs, setGeneratingFaqs] = useState(false);

  // SEO state
  const [targetKeyword, setTargetKeyword] = useState('');
  const [seoData, setSeoData] = useState<SEOData | null>(null);
  const [loadingSEO, setLoadingSEO] = useState(false);

  // UI state
  const [previewMode, setPreviewMode] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

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
          setFeaturedImage(data.featured_image || '');
          setMetaTitle(data.meta_title || '');
          setMetaDescription(data.meta_description || '');
          setStatus(data.status === 'published' ? 'published' : 'draft');
          setTargetKeyword(data.keywords?.[0] || '');
          setArticleType(data.article_type || 'how-to');
          setFaqs(data.faqs || []);

          // Load author info
          if (data.author_name || data.author_title || data.author_bio) {
            setAuthorInfo({
              name: data.author_name || DEFAULT_AUTHORS[0].name,
              title: data.author_title || DEFAULT_AUTHORS[0].title,
              bio: data.author_bio || DEFAULT_AUTHORS[0].bio,
              avatar: data.author_avatar || DEFAULT_AUTHORS[0].avatar,
              linkedin: data.author_linkedin || DEFAULT_AUTHORS[0].linkedin,
              twitter: data.author_twitter || DEFAULT_AUTHORS[0].twitter,
            });
            // Show custom author if any field differs from default
            const isCustom = data.author_name !== DEFAULT_AUTHORS[0].name ||
                            data.author_title !== DEFAULT_AUTHORS[0].title;
            setShowCustomAuthor(isCustom);
          }
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
          field,
          context: {
            title,
            category,
            keyword: targetKeyword,
            existingContent: field === 'content' ? excerpt : field === 'meta_description' ? excerpt : undefined,
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

  // FAQ Management
  const addFaq = () => {
    setFaqs([...faqs, { question: '', answer: '' }]);
  };

  const updateFaq = (index: number, field: 'question' | 'answer', value: string) => {
    const updated = [...faqs];
    updated[index][field] = value;
    setFaqs(updated);
  };

  const removeFaq = (index: number) => {
    setFaqs(faqs.filter((_, i) => i !== index));
  };

  const generateFaqs = async () => {
    if (!title && !content) {
      alert('Please add a title or content first');
      return;
    }

    setGeneratingFaqs(true);
    try {
      const response = await fetch('/api/admin/content-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'blog',
          field: 'faqs',
          context: {
            keyword: targetKeyword || title,
            title,
            content,
            category,
            articleType,
            existingFaqs: faqs,
          },
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const generated = data.faqs || data.content;
        if (Array.isArray(generated)) {
          setFaqs([...faqs, ...generated]);
        }
      }
    } catch (error) {
      console.error('Error generating FAQs:', error);
    } finally {
      setGeneratingFaqs(false);
    }
  };

  // Handle SEO Assessment AI Fix
  const handleSEOFix = async (fixType: string, currentContent: string): Promise<string | null> => {
    try {
      // Map fix types to content generation fields and actions
      let field = fixType;
      let context: Record<string, unknown> = {
        title,
        category,
        keyword: targetKeyword,
        existingContent: currentContent,
        articleType,
      };

      // Handle special fix types
      switch (fixType) {
        case 'headings':
          // Generate content outline with proper headings
          field = 'content';
          context.requirement = 'Add structured H2 subheadings to improve content organization';
          break;
        case 'lists':
          field = 'content';
          context.requirement = 'Add bulleted or numbered lists to make content more scannable';
          break;
        case 'definitions':
          field = 'content';
          context.requirement = 'Add clear definitions using "X is..." or "X means..." patterns';
          break;
        case 'statistics':
          field = 'content';
          context.requirement = 'Add relevant statistics, percentages, or quantitative data';
          break;
        case 'steps':
          field = 'content';
          context.requirement = 'Add step-by-step instructions with "Step 1:", "First,", "Next," patterns';
          break;
        case 'faqs':
          // Trigger FAQ generation
          await generateFaqs();
          return null;
      }

      const response = await fetch('/api/admin/content-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'blog',
          field,
          context,
        }),
      });

      const data = await response.json();
      const generated = data.content || data.generated;

      if (generated) {
        switch (fixType) {
          case 'title':
            setTitle(generated);
            break;
          case 'meta_description':
            setMetaDescription(generated);
            break;
          default:
            // For content improvements, append or enhance
            if (fixType === 'headings' || fixType === 'lists' || fixType === 'definitions' ||
                fixType === 'statistics' || fixType === 'steps') {
              // Append improvement suggestion to content
              setContent(content + '\n\n' + generated);
            }
        }
        return generated;
      }

      return null;
    } catch (error) {
      console.error('Error in SEO fix:', error);
      return null;
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

  // Render markdown to HTML preview
  const renderMarkdown = (text: string) => {
    if (!text) return '<p class="text-gray-400 italic">No content yet. Start writing or generate content with AI.</p>';

    return text.split('\n').map((line) => {
      // Headings
      if (line.startsWith('### ')) {
        return `<h3 class="text-lg font-semibold mt-6 mb-2 text-gray-900">${processInline(line.slice(4))}</h3>`;
      }
      if (line.startsWith('## ')) {
        return `<h2 class="text-xl font-bold mt-8 mb-3 text-gray-900">${processInline(line.slice(3))}</h2>`;
      }
      if (line.startsWith('# ')) {
        return `<h1 class="text-2xl font-bold mt-8 mb-4 text-gray-900">${processInline(line.slice(2))}</h1>`;
      }
      // Blockquote
      if (line.startsWith('> ')) {
        return `<blockquote class="border-l-4 border-blue-500 pl-4 my-4 text-gray-600 italic">${processInline(line.slice(2))}</blockquote>`;
      }
      // Unordered list
      if (line.startsWith('- ') || line.startsWith('* ')) {
        return `<li class="ml-6 list-disc text-gray-700">${processInline(line.slice(2))}</li>`;
      }
      // Ordered list
      if (/^\d+\.\s/.test(line)) {
        return `<li class="ml-6 list-decimal text-gray-700">${processInline(line.replace(/^\d+\.\s/, ''))}</li>`;
      }
      // Horizontal rule
      if (line.trim() === '---' || line.trim() === '***') {
        return '<hr class="my-8 border-gray-200" />';
      }
      // Empty line
      if (line.trim() === '') {
        return '<br />';
      }
      // Regular paragraph
      return `<p class="mb-4 text-gray-700 leading-relaxed">${processInline(line)}</p>`;
    }).join('');
  };

  // Process inline markdown (bold, italic, code, links)
  const processInline = (text: string) => {
    return text
      // Code (must be before bold/italic to avoid conflicts)
      .replace(/`([^`]+)`/g, '<code class="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono text-pink-600">$1</code>')
      // Bold
      .replace(/\*\*([^*]+)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>')
      // Italic
      .replace(/\*([^*]+)\*/g, '<em class="italic">$1</em>')
      // Links
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 hover:underline">$1</a>');
  };

  // Featured image upload handler
  const handleImageUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'blog-images');
      formData.append('bucket', 'ACI-web');

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Upload failed');
      }

      setFeaturedImage(result.url);
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  // Handle file input change
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  // Handle drag events
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
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
        id: postId,
        title,
        slug,
        excerpt,
        content,
        category,
        tags: tags.split(',').map(t => t.trim()).filter(Boolean),
        author_name: authorInfo.name || 'ACI Infotech',
        author_title: authorInfo.title,
        author_bio: authorInfo.bio,
        author_avatar: authorInfo.avatar,
        author_linkedin: authorInfo.linkedin,
        author_twitter: authorInfo.twitter,
        featured_image: featuredImage || null,
        meta_title: metaTitle || title,
        meta_description: metaDescription || excerpt?.substring(0, 160),
        keywords: targetKeyword ? [targetKeyword] : null,
        status,
        published_at: status === 'published' ? new Date().toISOString() : null,
        article_type: articleType,
        faqs: faqs.filter(f => f.question && f.answer),
        read_time_minutes: Math.ceil(content.split(/\s+/).length / 200),
      };

      // Use server-side API to bypass RLS
      const response = await fetch('/api/admin/blogs', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to save post');
      }

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
              <div className="flex items-center gap-3">
                {/* Write/Preview Toggle */}
                <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-lg">
                  <button
                    onClick={() => setPreviewMode(false)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                      !previewMode ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Edit3 className="w-4 h-4" />
                    Write
                  </button>
                  <button
                    onClick={() => setPreviewMode(true)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                      previewMode ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Eye className="w-4 h-4" />
                    Preview
                  </button>
                </div>
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
            </div>

            {!previewMode ? (
              <>
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
              </>
            ) : (
              /* Preview Mode */
              <div className="border border-gray-200 rounded-lg p-6 min-h-[500px] bg-white prose prose-sm max-w-none overflow-auto">
                <div dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }} />
              </div>
            )}
            <p className="text-xs text-gray-400 mt-1">
              ~{Math.ceil(content.split(/\s+/).filter(Boolean).length / 200)} min read ({content.split(/\s+/).filter(Boolean).length} words)
            </p>
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
                  className="absolute top-2 right-2 p-1 bg-white rounded-full shadow hover:bg-gray-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label
                className={`flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                  isDragging
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                {uploadingImage ? (
                  <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                ) : (
                  <Upload className="w-8 h-8 text-gray-400" />
                )}
                <span className="text-sm text-gray-600 text-center">
                  {uploadingImage ? 'Uploading...' : 'Drag & drop or click to upload'}
                </span>
                <span className="text-xs text-gray-400">PNG, JPG, GIF up to 10MB</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileInputChange}
                  className="hidden"
                  disabled={uploadingImage}
                />
              </label>
            )}

            {/* URL input option */}
            <div className="mt-3">
              <p className="text-xs text-gray-500 mb-1">Or paste image URL:</p>
              <input
                type="url"
                value={featuredImage}
                onChange={(e) => setFeaturedImage(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Article Type</label>
                <select
                  value={articleType}
                  onChange={(e) => setArticleType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                >
                  {ARTICLE_TYPES.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.icon} {type.label}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  {ARTICLE_TYPES.find(t => t.id === articleType)?.description}
                </p>
              </div>
            </div>
          </div>

          {/* Author Info */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold flex items-center gap-2">
                <User className="w-4 h-4" />
                Author
              </h3>
              <button
                onClick={() => setShowCustomAuthor(!showCustomAuthor)}
                className="text-sm text-blue-600 hover:underline"
              >
                {showCustomAuthor ? 'Use default' : 'Custom author'}
              </button>
            </div>

            {!showCustomAuthor ? (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                  {authorInfo.name.charAt(0)}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{authorInfo.name}</p>
                  <p className="text-sm text-gray-500">{authorInfo.title}</p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Name *</label>
                  <input
                    type="text"
                    value={authorInfo.name}
                    onChange={(e) => setAuthorInfo({ ...authorInfo, name: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg"
                    placeholder="Author name"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Title/Role</label>
                  <input
                    type="text"
                    value={authorInfo.title}
                    onChange={(e) => setAuthorInfo({ ...authorInfo, title: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg"
                    placeholder="e.g., Senior Data Architect"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Bio</label>
                  <textarea
                    value={authorInfo.bio}
                    onChange={(e) => setAuthorInfo({ ...authorInfo, bio: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg resize-none"
                    rows={3}
                    placeholder="Short author bio for E-E-A-T signals..."
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">LinkedIn</label>
                    <input
                      type="url"
                      value={authorInfo.linkedin}
                      onChange={(e) => setAuthorInfo({ ...authorInfo, linkedin: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg"
                      placeholder="LinkedIn URL"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Twitter/X</label>
                    <input
                      type="url"
                      value={authorInfo.twitter}
                      onChange={(e) => setAuthorInfo({ ...authorInfo, twitter: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg"
                      placeholder="Twitter URL"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Avatar URL</label>
                  <input
                    type="url"
                    value={authorInfo.avatar}
                    onChange={(e) => setAuthorInfo({ ...authorInfo, avatar: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg"
                    placeholder="Profile image URL"
                  />
                </div>
              </div>
            )}
            <p className="text-xs text-gray-500 mt-3">
              Author attribution improves E-E-A-T and AI citation likelihood.
            </p>
          </div>

          {/* FAQ Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold flex items-center gap-2">
                <HelpCircle className="w-4 h-4" />
                FAQ Section
              </h3>
              <button
                onClick={generateFaqs}
                disabled={generatingFaqs}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white rounded-lg shadow-sm disabled:opacity-50"
              >
                {generatingFaqs ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5" />
                )}
                Generate FAQs
              </button>
            </div>

            <p className="text-xs text-gray-500 mb-4">
              FAQ sections improve featured snippet eligibility and AEO performance.
            </p>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <label className="block text-xs font-medium text-gray-600">Question {index + 1}</label>
                    <button
                      onClick={() => removeFaq(index)}
                      className="p-1 text-gray-400 hover:text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <input
                    type="text"
                    value={faq.question}
                    onChange={(e) => updateFaq(index, 'question', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg mb-2"
                    placeholder="What is...? How do I...? Why should...?"
                  />
                  <label className="block text-xs font-medium text-gray-600 mb-1">Answer</label>
                  <textarea
                    value={faq.answer}
                    onChange={(e) => updateFaq(index, 'answer', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg resize-none"
                    rows={3}
                    placeholder="Provide a clear, concise answer (40-60 words ideal for snippets)..."
                  />
                </div>
              ))}

              <button
                onClick={addFaq}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-500 hover:text-blue-500 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add FAQ
              </button>
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

          {/* SEO/AEO/GEO Quality Assessment */}
          <SEOAssessment
            title={title}
            metaDescription={metaDescription || excerpt}
            content={content + '\n\n' + faqs.map(f => `Q: ${f.question}\nA: ${f.answer}`).join('\n\n')}
            slug={slug}
            category={category}
            tags={tags.split(',').map(t => t.trim()).filter(Boolean)}
            featuredImage={featuredImage}
            author={authorInfo.name}
            onAIFix={handleSEOFix}
          />
        </div>
      </div>
    </div>
  );
}
