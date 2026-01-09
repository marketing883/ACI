'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  Save,
  Sparkles,
  Loader2,
  Search,
  Settings,
  FileText,
  Check,
  TrendingUp,
  X,
  ChevronDown,
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
  ListOrdered,
  Eye,
  Edit3,
  Upload,
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

// Types
interface KeywordData {
  keyword: string;
  searchVolume: number;
  difficulty: number;
  difficultyLabel: 'Easy' | 'Medium' | 'Hard';
  cpc: number;
  trend: number;
  alternativeKeywords: { keyword: string; note: string }[];
  relatedKeywords: { keyword: string; volume: number }[];
  questionsAsked: string[];
  competitorArticles: { title: string; domain: string }[];
}

// Constants
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

const TARGET_AUDIENCES = [
  { id: 'c-suite', label: 'C-Suite Executives' },
  { id: 'it-decision', label: 'IT Decision Makers' },
  { id: 'compliance', label: 'Compliance & Risk Officers' },
  { id: 'operations', label: 'Operations Leaders' },
  { id: 'technical', label: 'Technical Practitioners' },
];

const CONTENT_LENGTHS = [
  { id: 'quick', label: 'Quick Read', words: '800-1,200 words', time: '~4-5 min', description: 'News updates, announcements, quick tips' },
  { id: 'standard', label: 'Standard Article', words: '1,500-2,000 words', time: '~7-9 min', description: 'How-to guides, feature explanations, comparisons' },
  { id: 'deep', label: 'Deep Dive', words: '2,500-3,500 words', time: '~12-15 min', description: 'Comprehensive guides, detailed tutorials, research pieces' },
  { id: 'pillar', label: 'Pillar Content', words: '4,000+ words', time: '~18+ min', description: 'Ultimate guides, cornerstone content, link magnets' },
];

const TONE_OPTIONS = [
  { id: 'authoritative', label: 'Authoritative & Trustworthy', description: 'Expert voice, backed by data, inspires confidence' },
  { id: 'approachable', label: 'Professional yet Approachable', description: 'Friendly expert tone, accessible language' },
  { id: 'thought-leadership', label: 'Thought Leadership', description: 'Visionary, forward-thinking, industry shaping' },
  { id: 'consultative', label: 'Consultative & Advisory', description: 'Problem-solving focused, practical recommendations' },
  { id: 'technical', label: 'Technical & Precise', description: 'Detailed, accurate, developer-focused' },
  { id: 'accessible', label: 'Technical but Accessible', description: 'Complex topics made simple' },
  { id: 'educational', label: 'Educational & Informative', description: 'Teaching-focused, step-by-step guidance' },
  { id: 'persuasive', label: 'Persuasive & Compelling', description: 'Benefits-focused, action-oriented' },
  { id: 'storytelling', label: 'Narrative & Storytelling', description: 'Case study style, engaging narratives' },
  { id: 'compliance', label: 'Compliance & Risk-Aware', description: 'Regulatory focus, risk mitigation' },
  { id: 'roi', label: 'ROI & Business Value', description: 'Numbers-driven, business case focused' },
  { id: 'innovation', label: 'Innovation-Forward', description: 'Cutting-edge, future-focused' },
];

const INCLUDE_OPTIONS = [
  { id: 'statistics', label: 'Statistics & Data' },
  { id: 'faq', label: 'FAQ Section' },
  { id: 'tips', label: 'Actionable Tips' },
  { id: 'case-studies', label: 'Case Studies' },
  { id: 'links', label: 'Internal Links' },
];

export default function NewBlogPostPage() {
  const router = useRouter();

  // Wizard state
  const [currentStep, setCurrentStep] = useState(1);

  // Step 1: Keyword Research
  const [keyword, setKeyword] = useState('');
  const [isResearching, setIsResearching] = useState(false);
  const [keywordData, setKeywordData] = useState<KeywordData | null>(null);

  // Step 2: Content Settings
  const [selectedAudiences, setSelectedAudiences] = useState<string[]>(['c-suite', 'it-decision']);
  const [contentLength, setContentLength] = useState('standard');
  const [tone, setTone] = useState('authoritative');
  const [includes, setIncludes] = useState<string[]>(['statistics', 'tips', 'faq']);
  const [customAudience, setCustomAudience] = useState('');

  // Step 3 & Form state
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [author, setAuthor] = useState('ACI Team');
  const [featuredImage, setFeaturedImage] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');

  // UI state
  const [isSaving, setIsSaving] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatingField, setGeneratingField] = useState<string | null>(null);
  const [toneDropdownOpen, setToneDropdownOpen] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Research keyword
  async function researchKeyword() {
    if (!keyword.trim()) return;

    setIsResearching(true);
    try {
      const response = await fetch('/api/admin/keyword-research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyword: keyword.trim() }),
      });

      if (response.ok) {
        const data = await response.json();
        setKeywordData(data);
      }
    } catch (error) {
      console.error('Keyword research error:', error);
    } finally {
      setIsResearching(false);
    }
  }

  // Toggle audience selection
  function toggleAudience(id: string) {
    setSelectedAudiences(prev =>
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  }

  // Toggle include option
  function toggleInclude(id: string) {
    setIncludes(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  }

  // Generate with AI
  async function generateWithAI(field: 'title' | 'excerpt' | 'content' | 'outline' | 'meta_title' | 'meta_description') {
    setIsGenerating(true);
    setGeneratingField(field);

    try {
      const selectedTone = TONE_OPTIONS.find(t => t.id === tone);
      const selectedLength = CONTENT_LENGTHS.find(l => l.id === contentLength);

      const response = await fetch('/api/admin/content-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'blog',
          field,
          context: {
            keyword: keywordData?.keyword || keyword || title,
            title,
            category,
            existingContent: content,
            audience: selectedAudiences.map(id => TARGET_AUDIENCES.find(a => a.id === id)?.label).join(', '),
            tone: selectedTone?.label,
            length: selectedLength?.words,
            includes: includes.join(', '),
          },
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const generated = data.content || data.generated;

        switch (field) {
          case 'title':
            setTitle(generated);
            handleTitleChange(generated);
            break;
          case 'excerpt':
            setExcerpt(generated);
            break;
          case 'content':
          case 'outline':
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
      setIsGenerating(false);
      setGeneratingField(null);
    }
  }

  // Handle title change and auto-generate slug
  function handleTitleChange(value: string) {
    setTitle(value);
    const generatedSlug = value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    setSlug(generatedSlug);
  }

  // Tag management
  function addTag(tag: string) {
    const trimmedTag = tag.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
    }
    setTagInput('');
  }

  function removeTag(tagToRemove: string) {
    setTags(tags.filter(t => t !== tagToRemove));
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
      case 'bold': newText = `**${selectedText || 'bold text'}**`; break;
      case 'italic': newText = `*${selectedText || 'italic text'}*`; break;
      case 'h1': newText = `\n# ${selectedText || 'Heading 1'}\n`; break;
      case 'h2': newText = `\n## ${selectedText || 'Heading 2'}\n`; break;
      case 'h3': newText = `\n### ${selectedText || 'Heading 3'}\n`; break;
      case 'list': newText = `\n- ${selectedText || 'List item'}\n`; break;
      case 'ol': newText = `\n1. ${selectedText || 'List item'}\n`; break;
      case 'link': newText = `[${selectedText || 'link text'}](url)`; break;
      case 'quote': newText = `\n> ${selectedText || 'Quote'}\n`; break;
      case 'code': newText = `\`${selectedText || 'code'}\``; break;
    }

    const newContent = content.substring(0, start) + newText + content.substring(end);
    setContent(newContent);
  }

  // Render markdown to HTML preview
  function renderMarkdown(text: string) {
    if (!text) return '<p class="text-gray-400 italic">No content yet. Start writing or generate content with AI.</p>';

    return text.split('\n').map((line, index) => {
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
  }

  // Process inline markdown (bold, italic, code, links)
  function processInline(text: string) {
    return text
      // Code (must be before bold/italic to avoid conflicts)
      .replace(/`([^`]+)`/g, '<code class="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono text-pink-600">$1</code>')
      // Bold
      .replace(/\*\*([^*]+)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>')
      // Italic
      .replace(/\*([^*]+)\*/g, '<em class="italic">$1</em>')
      // Links
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 hover:underline">$1</a>');
  }

  // Featured image upload handler
  async function handleImageUpload(file: File) {
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
  }

  // Handle file input change
  function handleFileInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  }

  // Handle drag events
  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
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
        alert(publish ? 'Post published successfully!' : 'Draft saved successfully!');
        router.push('/admin/blog');
        return;
      }

      const postData = {
        title,
        slug,
        excerpt: excerpt || metaDescription,
        content,
        category,
        tags,
        author_name: author,
        featured_image: featuredImage || null,
        status: publish ? 'published' : 'draft',
        is_featured: isFeatured,
        published_at: publish ? new Date().toISOString() : null,
        read_time_minutes: Math.ceil(content.split(/\s+/).length / 200),
        meta_title: metaTitle || title,
        meta_description: metaDescription || excerpt,
      };

      // Use server-side API to bypass RLS
      const response = await fetch('/api/admin/blogs', {
        method: 'POST',
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
      setIsSaving(false);
    }
  }

  // Render step indicator
  const steps = [
    { num: 1, label: 'Research', icon: Search },
    { num: 2, label: 'Settings', icon: Settings },
    { num: 3, label: 'Generate', icon: Sparkles },
  ];

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/blog" className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">New Blog Post</h1>
            <p className="text-gray-600 text-sm">AI-powered content creation</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleSave(false)}
            disabled={isSaving || currentStep < 3}
            className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Save Draft
          </button>
          <button
            onClick={() => handleSave(true)}
            disabled={isSaving || currentStep < 3}
            className="flex items-center gap-2 px-4 py-2 bg-[var(--aci-primary)] text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Publish
          </button>
        </div>
      </div>

      {/* Step Progress */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="flex items-center justify-center gap-4">
          {steps.map((step, idx) => (
            <div key={step.num} className="flex items-center">
              <button
                onClick={() => step.num <= currentStep && setCurrentStep(step.num)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  currentStep === step.num
                    ? 'bg-[var(--aci-primary)] text-white'
                    : currentStep > step.num
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-400'
                }`}
              >
                {currentStep > step.num ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <step.icon className="w-4 h-4" />
                )}
                <span className="font-medium">{step.num}. {step.label}</span>
              </button>
              {idx < steps.length - 1 && (
                <ArrowRight className={`w-5 h-5 mx-2 ${currentStep > step.num ? 'text-green-500' : 'text-gray-300'}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step 1: Keyword Research */}
      {currentStep === 1 && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-2 mb-6">
            <Search className="w-5 h-5 text-gray-500" />
            <h2 className="text-lg font-semibold">Step 1: Keyword Research</h2>
          </div>

          <div className="mb-4">
            <label className="block text-sm text-gray-600 mb-2">Enter your topic or target keyword</label>
            <div className="flex gap-3">
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && researchKeyword()}
                placeholder="e.g., enterprise ai governance"
                className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[var(--aci-primary)] focus:border-transparent"
              />
              <button
                onClick={researchKeyword}
                disabled={isResearching || !keyword.trim()}
                className="flex items-center gap-2 px-6 py-3 bg-[var(--aci-primary)] text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {isResearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                Research
              </button>
            </div>
          </div>

          {keywordData && (
            <div className="space-y-6 mt-6">
              {/* SEO Metrics */}
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs text-gray-500 mb-1">Search Volume</p>
                  <p className="text-2xl font-bold text-gray-900">{keywordData.searchVolume.toLocaleString()}<span className="text-sm font-normal text-gray-500">/mo</span></p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs text-gray-500 mb-1">Difficulty</p>
                  <p className="text-2xl font-bold text-gray-900">
                    <span className="text-lg">{keywordData.difficulty}</span>
                    <span className={`text-sm font-medium ml-2 ${
                      keywordData.difficultyLabel === 'Easy' ? 'text-green-600' :
                      keywordData.difficultyLabel === 'Medium' ? 'text-yellow-600' : 'text-red-600'
                    }`}>{keywordData.difficultyLabel}</span>
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs text-gray-500 mb-1">CPC</p>
                  <p className="text-2xl font-bold text-gray-900">${keywordData.cpc.toFixed(2)}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs text-gray-500 mb-1">Trend</p>
                  <p className={`text-2xl font-bold flex items-center gap-1 ${keywordData.trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    <TrendingUp className={`w-5 h-5 ${keywordData.trend < 0 ? 'rotate-180' : ''}`} />
                    {keywordData.trend >= 0 ? '+' : ''}{keywordData.trend}%
                  </p>
                </div>
              </div>

              {/* Alternative Keywords */}
              <div className="bg-purple-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  <h4 className="font-medium text-purple-900">Alternative Keywords</h4>
                </div>
                {keywordData.alternativeKeywords.map((alt, idx) => (
                  <div key={idx} className="flex items-center justify-between py-2 border-b border-purple-100 last:border-0">
                    <div>
                      <p className="font-medium text-gray-900">{alt.keyword}</p>
                      <p className="text-sm text-gray-500">{alt.note}</p>
                    </div>
                    <button
                      onClick={() => setKeyword(alt.keyword)}
                      className="px-3 py-1 text-sm bg-white text-purple-600 rounded border border-purple-200 hover:bg-purple-100"
                    >
                      Use This
                    </button>
                  </div>
                ))}
              </div>

              {/* Related Keywords */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Related Keywords</h4>
                <div className="space-y-2">
                  {keywordData.relatedKeywords.map((rel, idx) => (
                    <button
                      key={idx}
                      onClick={() => setKeyword(rel.keyword)}
                      className="flex items-center justify-between w-full p-2 text-left hover:bg-gray-50 rounded-lg"
                    >
                      <span className="text-gray-700">{rel.keyword}</span>
                      <span className="text-sm text-gray-400">({rel.volume})</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Questions People Ask */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Questions People Ask</h4>
                <ul className="space-y-2">
                  {keywordData.questionsAsked.map((q, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-gray-700">
                      <span className="text-gray-400">•</span>
                      {q}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Competitor Articles */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Top Competitor Articles</h4>
                <div className="space-y-3">
                  {keywordData.competitorArticles.map((article, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <span className="font-bold text-gray-400">{idx + 1}.</span>
                      <div>
                        <p className="font-medium text-gray-900">{article.title}</p>
                        <p className="text-sm text-gray-500">{article.domain}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t">
            <button
              onClick={() => { setCurrentStep(2); }}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Skip research and continue without SEO data →
            </button>
            <button
              onClick={() => setCurrentStep(2)}
              disabled={!keywordData && !keyword}
              className="flex items-center gap-2 px-6 py-3 bg-[var(--aci-primary)] text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              Continue with "{keywordData?.keyword || keyword}"
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Content Settings */}
      {currentStep === 2 && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-2 mb-6">
            <Settings className="w-5 h-5 text-gray-500" />
            <h2 className="text-lg font-semibold">Step 2: Content Settings</h2>
          </div>

          {/* Target Audience */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">Target Audience</label>
            <div className="flex flex-wrap gap-2">
              {TARGET_AUDIENCES.map((audience) => (
                <button
                  key={audience.id}
                  onClick={() => toggleAudience(audience.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedAudiences.includes(audience.id)
                      ? 'bg-[var(--aci-primary)] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {audience.label}
                </button>
              ))}
            </div>
            <button className="mt-2 text-sm text-purple-600 hover:text-purple-700">
              + Add custom audience
            </button>
          </div>

          {/* Content Length */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">Content Length</label>
            <div className="space-y-2">
              {CONTENT_LENGTHS.map((length) => (
                <label
                  key={length.id}
                  className={`flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                    contentLength === length.id
                      ? 'border-[var(--aci-primary)] bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="contentLength"
                    value={length.id}
                    checked={contentLength === length.id}
                    onChange={() => setContentLength(length.id)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">{length.label}</span>
                      <span className="text-sm text-gray-500">{length.words}</span>
                      <span className="text-sm text-gray-400">{length.time}</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{length.description}</p>
                  </div>
                </label>
              ))}
            </div>
            <p className="mt-2 text-xs text-purple-600">
              SEO: Sweet spot for most keywords, good depth without overwhelming.
            </p>
          </div>

          {/* Tone & Voice */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">Tone & Voice</label>
            <div className="relative">
              <button
                onClick={() => setToneDropdownOpen(!toneDropdownOpen)}
                className="w-full flex items-center justify-between px-4 py-3 border border-gray-200 rounded-lg text-left hover:border-gray-300"
              >
                <span className="font-medium">{TONE_OPTIONS.find(t => t.id === tone)?.label}</span>
                <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${toneDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {toneDropdownOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto">
                  {TONE_OPTIONS.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => { setTone(option.id); setToneDropdownOpen(false); }}
                      className={`w-full px-4 py-3 text-left hover:bg-gray-50 ${tone === option.id ? 'bg-blue-50' : ''}`}
                    >
                      <p className="font-medium text-gray-900">{option.label}</p>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <p className="mt-2 text-sm text-gray-500">
              {TONE_OPTIONS.find(t => t.id === tone)?.description}
            </p>
          </div>

          {/* Include in Content */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">Include in Content</label>
            <div className="grid grid-cols-2 gap-3">
              {INCLUDE_OPTIONS.map((option) => (
                <label
                  key={option.id}
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={includes.includes(option.id)}
                    onChange={() => toggleInclude(option.id)}
                    className="w-4 h-4 rounded border-gray-300 text-[var(--aci-primary)] focus:ring-[var(--aci-primary)]"
                  />
                  <span className="text-gray-700">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t">
            <button
              onClick={() => setCurrentStep(1)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Research
            </button>
            <button
              onClick={() => setCurrentStep(3)}
              className="flex items-center gap-2 px-6 py-3 bg-[var(--aci-primary)] text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Continue to Generate
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Generate & Edit */}
      {currentStep === 3 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Generate Actions */}
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-purple-600" />
                <h2 className="text-lg font-semibold">Step 3: Generate Content</h2>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Tip: Generate an outline first to review structure before full content.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => generateWithAI('outline')}
                  disabled={isGenerating}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 border-2 border-gray-300 rounded-lg hover:border-gray-400 transition-colors disabled:opacity-50"
                >
                  {generatingField === 'outline' ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <ListOrdered className="w-4 h-4" />
                  )}
                  Outline First
                </button>
                <button
                  onClick={() => generateWithAI('content')}
                  disabled={isGenerating}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-colors disabled:opacity-50"
                >
                  {generatingField === 'content' ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4" />
                  )}
                  Full Article
                </button>
              </div>
            </div>

            {/* Title */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-3">
                <label className="font-semibold text-gray-900">Title</label>
                <button
                  onClick={() => generateWithAI('title')}
                  disabled={isGenerating}
                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white shadow-sm disabled:opacity-50"
                  title="Generate with AI"
                >
                  {generatingField === 'title' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
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
                  className="text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded focus:ring-1 focus:ring-[var(--aci-primary)]"
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
                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white shadow-sm disabled:opacity-50"
                  title="Generate with AI"
                >
                  {generatingField === 'excerpt' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                </button>
              </div>
              <textarea
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="Brief summary for search results..."
                rows={3}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[var(--aci-primary)] focus:border-transparent resize-none"
              />
              <p className="text-xs text-gray-400 mt-1">{excerpt.length}/160 characters</p>
            </div>

            {/* Content Editor */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-3">
                <label className="font-semibold text-gray-900">Content</label>
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
              </div>

              {!previewMode ? (
                <>
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
                    <button onClick={() => insertFormatting('ol')} className="p-2 hover:bg-gray-200 rounded" title="Numbered List">
                      <ListOrdered className="w-4 h-4" />
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
                    <span key={tag} className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-sm rounded">
                      {tag}
                      <button onClick={() => removeTag(tag)} className="hover:text-blue-900">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag(tagInput))}
                  placeholder="Add tag..."
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[var(--aci-primary)]"
                />
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

              {/* Featured */}
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

            {/* SEO Settings */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">SEO Settings</h3>

              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">Meta Title</label>
                  <button
                    onClick={() => generateWithAI('meta_title')}
                    disabled={isGenerating}
                    className="w-7 h-7 flex items-center justify-center rounded-lg bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white shadow-sm disabled:opacity-50"
                    title="Generate with AI"
                  >
                    {generatingField === 'meta_title' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <input
                  type="text"
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                  placeholder={title || 'SEO optimized title...'}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[var(--aci-primary)]"
                />
                <p className="text-xs text-gray-400 mt-1">{(metaTitle || title).length}/60</p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">Meta Description</label>
                  <button
                    onClick={() => generateWithAI('meta_description')}
                    disabled={isGenerating}
                    className="w-7 h-7 flex items-center justify-center rounded-lg bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white shadow-sm disabled:opacity-50"
                    title="Generate with AI"
                  >
                    {generatingField === 'meta_description' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <textarea
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  placeholder={excerpt || 'SEO optimized description...'}
                  rows={3}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[var(--aci-primary)] resize-none"
                />
                <p className="text-xs text-gray-400 mt-1">{(metaDescription || excerpt).length}/160</p>
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
                  type="text"
                  value={featuredImage}
                  onChange={(e) => setFeaturedImage(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[var(--aci-primary)]"
                />
              </div>
            </div>

            {/* Back Button */}
            <button
              onClick={() => setCurrentStep(2)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 w-full justify-center py-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Settings
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
