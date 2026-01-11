'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Save,
  Loader2,
  Upload,
  Sparkles,
  Image as ImageIcon,
  X,
  Plus,
  Trash2,
} from 'lucide-react';
import SEOAssessment from '@/components/admin/SEOAssessment';

const industries = [
  'Financial Services',
  'Healthcare',
  'Retail',
  'Manufacturing',
  'Technology',
  'Energy & Utilities',
  'Telecommunications',
  'Transportation & Logistics',
  'Government',
  'Education',
  'Hospitality',
  'Media & Entertainment',
];

const services = [
  'Data Engineering',
  'Applied AI & ML',
  'Cloud Modernization',
  'MarTech & CDP',
  'Enterprise Integration',
  'Analytics & BI',
  'DevOps & Platform',
  'Data Governance',
];

const companySizes = [
  '1-50 employees',
  '51-200 employees',
  '201-500 employees',
  '501-1000 employees',
  '1001-5000 employees',
  '5000+ employees',
  'Fortune 500',
  'Fortune 100',
];

interface Metric {
  label: string;
  value: string;
  description?: string;
}

export default function NewCaseStudyPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [draggingImage, setDraggingImage] = useState(false);
  const [draggingLogo, setDraggingLogo] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientLogo, setClientLogo] = useState('');
  const [clientIndustry, setClientIndustry] = useState('');
  const [clientSize, setClientSize] = useState('');
  const [clientLocation, setClientLocation] = useState('');
  const [challenge, setChallenge] = useState('');
  const [solution, setSolution] = useState('');
  const [results, setResults] = useState('');
  const [metrics, setMetrics] = useState<Metric[]>([
    { label: '', value: '', description: '' },
  ]);
  const [technologies, setTechnologies] = useState('');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [testimonialQuote, setTestimonialQuote] = useState('');
  const [testimonialAuthor, setTestimonialAuthor] = useState('');
  const [testimonialTitle, setTestimonialTitle] = useState('');
  const [featuredImage, setFeaturedImage] = useState('');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [status, setStatus] = useState<'draft' | 'published'>('draft');
  const [isFeatured, setIsFeatured] = useState(false);

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
    if (!slug || slug === generateSlug(title)) {
      setSlug(generateSlug(value));
    }
  };

  // AI Generate content
  const generateContent = async (field: string) => {
    if (!title || !clientName) {
      alert('Please enter a title and client name first');
      return;
    }

    setGenerating(field);
    try {
      const response = await fetch('/api/admin/content-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'case_study',
          field,
          context: {
            title,
            clientName,
            industry: clientIndustry,
            technologies: technologies.split(',').map(t => t.trim()),
            existingContent: `${challenge}\n\n${solution}\n\n${results}`,
            existingMetrics: metrics.filter(m => m.label && m.value),
          },
        }),
      });

      const data = await response.json();

      // Handle metrics as JSON array
      if (field === 'metrics' && data.metrics) {
        setMetrics(data.metrics);
        return;
      }

      const generated = data.content || data.generated;
      if (generated) {
        switch (field) {
          case 'excerpt':
            setExcerpt(generated);
            break;
          case 'challenge':
            setChallenge(generated);
            break;
          case 'solution':
            setSolution(generated);
            break;
          case 'results':
            setResults(generated);
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

  // AI Fix SEO issue
  const fixSeoIssue = async (issue: string, currentValue: string, targetField: 'meta_title' | 'meta_description') => {
    setGenerating(`seo_fix_${targetField}`);
    try {
      const response = await fetch('/api/admin/content-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'case_study',
          field: 'seo_fix',
          context: {
            title,
            clientName,
            industry: clientIndustry,
            technologies: technologies.split(',').map(t => t.trim()),
            seoIssue: issue,
            currentValue,
            existingContent: `${challenge}\n\n${solution}\n\n${results}`,
          },
        }),
      });

      const data = await response.json();
      const fixed = data.content || data.generated;
      if (fixed) {
        if (targetField === 'meta_title') {
          setMetaTitle(fixed);
        } else {
          setMetaDescription(fixed);
        }
      }
    } catch (error) {
      console.error('Error fixing SEO:', error);
    } finally {
      setGenerating(null);
    }
  };

  // Image upload handlers using server-side API with optimization
  const uploadImage = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('bucket', 'ACI-web');
      formData.append('folder', 'case-studies');

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Failed to upload image');
      }

      setFeaturedImage(result.url);
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadImage(file);
  };

  const handleImageDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDraggingImage(false);
    const file = e.dataTransfer.files?.[0];
    if (file) uploadImage(file);
  };

  const uploadLogo = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    setUploadingLogo(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('bucket', 'ACI-web');
      formData.append('folder', 'logos');

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Failed to upload logo');
      }

      setClientLogo(result.url);
    } catch (error) {
      console.error('Error uploading logo:', error);
      alert('Failed to upload logo');
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadLogo(file);
  };

  const handleLogoDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDraggingLogo(false);
    const file = e.dataTransfer.files?.[0];
    if (file) uploadLogo(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  // Metrics management
  const addMetric = () => {
    setMetrics([...metrics, { label: '', value: '', description: '' }]);
  };

  const updateMetric = (index: number, field: keyof Metric, value: string) => {
    const newMetrics = [...metrics];
    newMetrics[index][field] = value;
    setMetrics(newMetrics);
  };

  const removeMetric = (index: number) => {
    setMetrics(metrics.filter((_, i) => i !== index));
  };

  // Services toggle
  const toggleService = (service: string) => {
    setSelectedServices(
      selectedServices.includes(service)
        ? selectedServices.filter((s) => s !== service)
        : [...selectedServices, service]
    );
  };

  // Save case study - accepts explicit saveStatus to avoid React async state issues
  const handleSave = async (saveStatus: 'draft' | 'published') => {
    if (!title || !slug || !clientName) {
      alert('Title, slug, and client name are required');
      return;
    }

    setStatus(saveStatus);
    setSaving(true);

    const isPublishing = saveStatus === 'published';

    try {
      const caseStudyData = {
        title,
        slug,
        excerpt,
        client_name: clientName,
        client_logo: clientLogo || null,
        industry: clientIndustry,
        client_size: clientSize,
        client_location: clientLocation,
        challenge,
        solution,
        results,
        metrics: metrics.filter((m) => m.label && m.value),
        technologies: technologies.split(',').map((t) => t.trim()).filter(Boolean),
        services: selectedServices,
        testimonial_quote: testimonialQuote || null,
        testimonial_author: testimonialAuthor || null,
        testimonial_title: testimonialTitle || null,
        featured_image_url: featuredImage || null,
        gallery_images: [],
        seo_title: metaTitle || title,
        seo_description: metaDescription || excerpt?.substring(0, 160),
        status: isPublishing ? 'published' : 'draft',
        is_featured: isFeatured,
        published_at: isPublishing ? new Date().toISOString() : null,
      };

      // Use server-side API to bypass RLS
      const response = await fetch('/api/admin/case-studies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(caseStudyData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to save case study');
      }

      router.push('/admin/case-studies');
    } catch (error) {
      console.error('Error saving case study:', error);
      alert('Failed to save case study');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/case-studies"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">New Case Study</h1>
            <p className="text-gray-500">Create a client success story</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => handleSave('draft')}
            disabled={saving}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            Save Draft
          </button>
          <button
            onClick={() => handleSave('published')}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Publish
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
                Case Study Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g., Consolidating 40+ Finance Systems Post-Acquisition"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                URL Slug *
              </label>
              <div className="flex items-center gap-2">
                <span className="text-gray-500">/case-studies/</span>
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
                  Short Excerpt
                </label>
                <button
                  onClick={() => generateContent('excerpt')}
                  disabled={generating === 'excerpt'}
                  className="w-7 h-7 flex items-center justify-center rounded-lg bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white shadow-sm disabled:opacity-50"
                  title="Generate with AI"
                >
                  {generating === 'excerpt' ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Sparkles className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
              <textarea
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="A brief summary of the case study..."
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="featured"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="featured" className="text-sm text-gray-700">
                Feature this case study on the homepage
              </label>
            </div>
          </div>
        </div>

        {/* Client Information */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">Client Information</h2>

          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Client Name *
                </label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="e.g., MSCI or Fortune 500 Retailer"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Industry
                </label>
                <select
                  value={clientIndustry}
                  onChange={(e) => setClientIndustry(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select industry</option>
                  {industries.map((ind) => (
                    <option key={ind} value={ind}>
                      {ind}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Size
                </label>
                <select
                  value={clientSize}
                  onChange={(e) => setClientSize(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select size</option>
                  {companySizes.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={clientLocation}
                  onChange={(e) => setClientLocation(e.target.value)}
                  placeholder="e.g., New York, NY"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Client Logo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Client Logo
              </label>
              {clientLogo ? (
                <div className="flex items-center gap-4">
                  <img
                    src={clientLogo}
                    alt="Client logo"
                    className="h-16 w-auto object-contain bg-gray-50 rounded p-2"
                  />
                  <button
                    onClick={() => setClientLogo('')}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div
                  onDrop={handleLogoDrop}
                  onDragOver={handleDragOver}
                  onDragEnter={() => setDraggingLogo(true)}
                  onDragLeave={() => setDraggingLogo(false)}
                  className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                    draggingLogo
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <label className="flex flex-col items-center gap-2 cursor-pointer">
                    {uploadingLogo ? (
                      <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                    ) : (
                      <Upload className="w-8 h-8 text-gray-400" />
                    )}
                    <span className="text-sm text-gray-600">
                      {uploadingLogo ? 'Uploading...' : 'Drop logo here or click to upload'}
                    </span>
                    <span className="text-xs text-gray-400">
                      PNG, JPG, SVG up to 2MB
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                      disabled={uploadingLogo}
                    />
                  </label>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Story Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">The Story</h2>

          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-gray-700">
                  The Challenge
                </label>
                <button
                  onClick={() => generateContent('challenge')}
                  disabled={generating === 'challenge'}
                  className="w-7 h-7 flex items-center justify-center rounded-lg bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white shadow-sm disabled:opacity-50"
                  title="Generate with AI"
                >
                  {generating === 'challenge' ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Sparkles className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
              <textarea
                value={challenge}
                onChange={(e) => setChallenge(e.target.value)}
                placeholder="Describe the client's challenges and pain points..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-gray-700">
                  The Solution
                </label>
                <button
                  onClick={() => generateContent('solution')}
                  disabled={generating === 'solution'}
                  className="w-7 h-7 flex items-center justify-center rounded-lg bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white shadow-sm disabled:opacity-50"
                  title="Generate with AI"
                >
                  {generating === 'solution' ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Sparkles className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
              <textarea
                value={solution}
                onChange={(e) => setSolution(e.target.value)}
                placeholder="Describe the solution implemented..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-gray-700">
                  The Results
                </label>
                <button
                  onClick={() => generateContent('results')}
                  disabled={generating === 'results'}
                  className="w-7 h-7 flex items-center justify-center rounded-lg bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white shadow-sm disabled:opacity-50"
                  title="Generate with AI"
                >
                  {generating === 'results' ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Sparkles className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
              <textarea
                value={results}
                onChange={(e) => setResults(e.target.value)}
                placeholder="Describe the outcomes and impact..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-semibold">Key Metrics</h2>
              <button
                onClick={() => generateContent('metrics')}
                disabled={generating === 'metrics'}
                className="w-7 h-7 flex items-center justify-center rounded-lg bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white shadow-sm disabled:opacity-50"
                title="Generate metrics with AI"
              >
                {generating === 'metrics' ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
            <button
              onClick={addMetric}
              className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
            >
              <Plus className="w-4 h-4" />
              Add Metric
            </button>
          </div>

          <div className="space-y-4">
            {metrics.map((metric, index) => (
              <div key={index} className="flex gap-3 items-start">
                <div className="flex-1 grid md:grid-cols-3 gap-3">
                  <input
                    type="text"
                    value={metric.value}
                    onChange={(e) => updateMetric(index, 'value', e.target.value)}
                    placeholder="e.g., 40%"
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    value={metric.label}
                    onChange={(e) => updateMetric(index, 'label', e.target.value)}
                    placeholder="e.g., Cost Reduction"
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    value={metric.description || ''}
                    onChange={(e) =>
                      updateMetric(index, 'description', e.target.value)
                    }
                    placeholder="Description (optional)"
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                {metrics.length > 1 && (
                  <button
                    onClick={() => removeMetric(index)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Services & Technologies */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">Services & Technologies</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Services Provided
              </label>
              <div className="flex flex-wrap gap-2">
                {services.map((service) => (
                  <button
                    key={service}
                    onClick={() => toggleService(service)}
                    className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                      selectedServices.includes(service)
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {service}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Technologies Used
              </label>
              <input
                type="text"
                value={technologies}
                onChange={(e) => setTechnologies(e.target.value)}
                placeholder="Snowflake, dbt, Airflow, AWS (comma separated)"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Testimonial */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">Client Testimonial</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quote
              </label>
              <textarea
                value={testimonialQuote}
                onChange={(e) => setTestimonialQuote(e.target.value)}
                placeholder="What the client said about working with ACI..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Author Name
                </label>
                <input
                  type="text"
                  value={testimonialAuthor}
                  onChange={(e) => setTestimonialAuthor(e.target.value)}
                  placeholder="John Smith"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Author Title
                </label>
                <input
                  type="text"
                  value={testimonialTitle}
                  onChange={(e) => setTestimonialTitle(e.target.value)}
                  placeholder="VP of Engineering"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Featured Image */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">Featured Image</h2>

          {featuredImage ? (
            <div className="relative">
              <img
                src={featuredImage}
                alt="Featured preview"
                className="w-full h-64 object-cover rounded-lg"
              />
              <button
                onClick={() => setFeaturedImage('')}
                className="absolute top-2 right-2 p-1 bg-white rounded-full shadow hover:bg-gray-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div
              onDrop={handleImageDrop}
              onDragOver={handleDragOver}
              onDragEnter={() => setDraggingImage(true)}
              onDragLeave={() => setDraggingImage(false)}
              className={`border-2 border-dashed rounded-lg transition-colors ${
                draggingImage
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50'
              }`}
            >
              <label className="flex flex-col items-center justify-center gap-2 p-8 cursor-pointer">
                {uploadingImage ? (
                  <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                ) : (
                  <ImageIcon className="w-8 h-8 text-gray-400" />
                )}
                <span className="text-sm text-gray-600">
                  {uploadingImage ? 'Uploading...' : 'Drop image here or click to upload'}
                </span>
                <span className="text-xs text-gray-400">
                  Recommended: 1200x630px
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={uploadingImage}
                />
              </label>
            </div>
          )}
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
                placeholder={
                  excerpt?.substring(0, 160) || 'Description for search engines'
                }
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                {metaDescription.length || excerpt?.substring(0, 160).length || 0}
                /160 characters
              </p>
            </div>
          </div>
        </div>

        {/* SEO/AEO/GEO Quality Assessment */}
        <SEOAssessment
          title={title}
          metaDescription={metaDescription || excerpt}
          content={`${challenge}\n\n${solution}\n\n${results}`}
          slug={slug}
          category={clientIndustry}
          featuredImage={featuredImage}
          author={clientName}
          onAIFix={async (fixType, currentValue) => {
            // Handle title and meta_description fixes
            if (fixType === 'title' || fixType === 'meta_description') {
              const targetField = fixType === 'title' ? 'meta_title' : 'meta_description';
              const issueDesc = fixType === 'title'
                ? `Title length issue: current title is "${currentValue}" (${currentValue.length} chars). Need 50-60 characters.`
                : `Meta description issue: current value is "${currentValue}" (${currentValue.length} chars). Need 150-160 characters.`;
              await fixSeoIssue(issueDesc, currentValue, targetField);
            }
            return null;
          }}
        />
      </div>
    </div>
  );
}
