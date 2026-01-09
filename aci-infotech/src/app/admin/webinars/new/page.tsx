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
  Plus,
  Trash2,
  Image as ImageIcon,
  X,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

const platforms = ['Zoom', 'Microsoft Teams', 'Webex', 'GoToWebinar', 'Other'];
const timezones = [
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'Europe/London',
  'Europe/Paris',
  'Asia/Dubai',
  'Asia/Singapore',
  'Asia/Tokyo',
];

interface Speaker {
  name: string;
  title: string;
  company: string;
}

export default function NewWebinarPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [timezone, setTimezone] = useState('America/New_York');
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [platform, setPlatform] = useState('');
  const [registrationUrl, setRegistrationUrl] = useState('');
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [topics, setTopics] = useState('');
  const [featuredImage, setFeaturedImage] = useState('');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');

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
          type: 'webinar',
          field,
          context: { title, topics, description },
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

  // Speaker management
  const addSpeaker = () => {
    setSpeakers([...speakers, { name: '', title: '', company: '' }]);
  };

  const updateSpeaker = (index: number, field: keyof Speaker, value: string) => {
    const updated = [...speakers];
    updated[index][field] = value;
    setSpeakers(updated);
  };

  const removeSpeaker = (index: number) => {
    setSpeakers(speakers.filter((_, i) => i !== index));
  };

  // Image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    setUploadingImage(true);
    try {
      const fileName = `webinars/${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
      const { error } = await supabase.storage
        .from('webinar-images')
        .upload(fileName, file, { upsert: true });

      if (error) throw error;

      const { data: urlData } = supabase.storage
        .from('webinar-images')
        .getPublicUrl(fileName);

      setFeaturedImage(urlData.publicUrl);
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  // Save webinar
  const handleSave = async (status: 'upcoming' | 'draft' = 'upcoming') => {
    if (!title || !slug) {
      alert('Title and slug are required');
      return;
    }

    setSaving(true);
    try {
      // Combine date and time
      let scheduledAt = null;
      if (scheduledDate && scheduledTime) {
        scheduledAt = new Date(`${scheduledDate}T${scheduledTime}`).toISOString();
      }

      const webinarData = {
        title,
        slug,
        description,
        scheduled_at: scheduledAt,
        timezone,
        duration_minutes: durationMinutes,
        platform,
        registration_url: registrationUrl || null,
        speakers: speakers.filter(s => s.name),
        topics: topics.split(',').map(t => t.trim()).filter(Boolean),
        featured_image: featuredImage || null,
        meta_title: metaTitle || title,
        meta_description: metaDescription || description?.substring(0, 160),
        status,
        is_recorded: false,
        recording_url: null,
      };

      const { error } = await supabase
        .from('webinars')
        .insert(webinarData);

      if (error) throw error;

      router.push('/admin/webinars');
    } catch (error) {
      console.error('Error saving webinar:', error);
      alert('Failed to save webinar');
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
            href="/admin/webinars"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">New Webinar</h1>
            <p className="text-gray-500">Announce an upcoming webinar</p>
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
            onClick={() => handleSave('upcoming')}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
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
                Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g., Building Enterprise AI: From Strategy to Scale"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                URL Slug *
              </label>
              <div className="flex items-center gap-2">
                <span className="text-gray-500">/resources/webinars/</span>
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
                placeholder="What will attendees learn from this webinar?"
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Topics (comma separated)
              </label>
              <input
                type="text"
                value={topics}
                onChange={(e) => setTopics(e.target.value)}
                placeholder="AI, Machine Learning, Enterprise Architecture"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Schedule */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">Schedule</h2>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <input
                type="date"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Time
              </label>
              <input
                type="time"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Timezone
              </label>
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {timezones.map((tz) => (
                  <option key={tz} value={tz}>{tz}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duration (minutes)
              </label>
              <input
                type="number"
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(parseInt(e.target.value) || 60)}
                min={15}
                max={180}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Platform & Registration */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">Platform & Registration</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Platform
              </label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select platform</option>
                {platforms.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Registration URL
              </label>
              <input
                type="url"
                value={registrationUrl}
                onChange={(e) => setRegistrationUrl(e.target.value)}
                placeholder="https://zoom.us/webinar/register/..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                External registration link from your webinar platform
              </p>
            </div>
          </div>
        </div>

        {/* Speakers */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Speakers</h2>
            <button
              onClick={addSpeaker}
              className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
            >
              <Plus className="w-4 h-4" />
              Add Speaker
            </button>
          </div>

          {speakers.length === 0 ? (
            <p className="text-gray-500 text-sm">No speakers added yet</p>
          ) : (
            <div className="space-y-4">
              {speakers.map((speaker, index) => (
                <div key={index} className="flex gap-4 items-start p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1 grid md:grid-cols-3 gap-3">
                    <input
                      type="text"
                      value={speaker.name}
                      onChange={(e) => updateSpeaker(index, 'name', e.target.value)}
                      placeholder="Name"
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <input
                      type="text"
                      value={speaker.title}
                      onChange={(e) => updateSpeaker(index, 'title', e.target.value)}
                      placeholder="Title"
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <input
                      type="text"
                      value={speaker.company}
                      onChange={(e) => updateSpeaker(index, 'company', e.target.value)}
                      placeholder="Company"
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <button
                    onClick={() => removeSpeaker(index)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Featured Image */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">Featured Image</h2>

          {featuredImage ? (
            <div className="relative">
              <img
                src={featuredImage}
                alt="Featured preview"
                className="w-full h-48 object-cover rounded-lg"
              />
              <button
                onClick={() => setFeaturedImage('')}
                className="absolute top-2 right-2 p-1 bg-white rounded-full shadow hover:bg-gray-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center gap-2 p-8 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors">
              {uploadingImage ? (
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
              ) : (
                <ImageIcon className="w-8 h-8 text-gray-400" />
              )}
              <span className="text-sm text-gray-600">
                {uploadingImage ? 'Uploading...' : 'Upload featured image'}
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                disabled={uploadingImage}
              />
            </label>
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
