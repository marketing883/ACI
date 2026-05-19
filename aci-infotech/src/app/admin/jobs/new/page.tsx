'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Eye } from 'lucide-react';

const departments = [
  'Data Engineering',
  'AI & ML',
  'Cloud',
  'MarTech',
  'Cybersecurity',
  'Digital Transformation',
];

const locationTypes = [
  { value: 'remote', label: 'Remote' },
  { value: 'hybrid', label: 'Hybrid' },
  { value: 'onsite', label: 'On-site' },
];

const employmentTypes = [
  { value: 'full-time', label: 'Full-time' },
  { value: 'part-time', label: 'Part-time' },
  { value: 'contract', label: 'Contract' },
];

const experienceLevels = [
  { value: 'entry', label: 'Entry Level' },
  { value: 'mid', label: 'Mid Level' },
  { value: 'senior', label: 'Senior' },
  { value: 'lead', label: 'Lead / Principal' },
  { value: 'executive', label: 'Executive' },
];

const defaultBenefits = [
  'Competitive salary and equity',
  'Health, dental, and vision insurance',
  '401(k) with company match',
  'Flexible PTO policy',
  'Remote work options',
  'Professional development budget',
  'Home office stipend',
  'Wellness programs',
];

export default function NewJobPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    title: '',
    department: departments[0],
    description: '',
    responsibilities: [''],
    requirements: [''],
    nice_to_have: [''],
    city: '',
    state_region: '',
    country: '',
    location_type: 'hybrid',
    employment_type: 'full-time',
    salary_min: '',
    salary_max: '',
    show_salary: false,
    experience_level: 'mid',
    skills: [''],
    benefits: defaultBenefits,
    meta_title: '',
    meta_description: '',
    status: 'draft',
    closes_at: '',
    notification_emails: '',
  });

  function updateArrayField(field: string, index: number, value: string) {
    setForm(prev => ({
      ...prev,
      [field]: (prev[field as keyof typeof prev] as string[]).map((item, i) =>
        i === index ? value : item
      ),
    }));
  }

  function addArrayItem(field: string) {
    setForm(prev => ({
      ...prev,
      [field]: [...(prev[field as keyof typeof prev] as string[]), ''],
    }));
  }

  function removeArrayItem(field: string, index: number) {
    setForm(prev => ({
      ...prev,
      [field]: (prev[field as keyof typeof prev] as string[]).filter((_, i) => i !== index),
    }));
  }

  async function handleSubmit(publishStatus: 'draft' | 'published') {
    setError('');
    setSaving(true);

    try {
      const payload = {
        ...form,
        status: publishStatus,
        responsibilities: form.responsibilities.filter(r => r.trim()),
        requirements: form.requirements.filter(r => r.trim()),
        nice_to_have: form.nice_to_have.filter(r => r.trim()),
        skills: form.skills.filter(s => s.trim()),
        benefits: form.benefits.filter(b => b.trim()),
        salary_min: form.salary_min ? parseInt(form.salary_min) : null,
        salary_max: form.salary_max ? parseInt(form.salary_max) : null,
      };

      const response = await fetch('/api/admin/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create job');
      }

      router.push('/admin/jobs');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create job');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/jobs"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">New Job</h1>
            <p className="text-gray-500">Create a new job listing</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleSubmit('draft')}
            disabled={saving || !form.title || !form.city || !form.country}
            className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            Save Draft
          </button>
          <button
            onClick={() => handleSubmit('published')}
            disabled={saving || !form.title || !form.city || !form.country || !form.description}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <Eye className="w-4 h-4" />
            Publish
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="col-span-2 space-y-6">
          {/* Basic Info */}
          <div className="bg-white p-6 rounded-lg border space-y-4">
            <h5 className="text-sm font-semibold text-gray-900">Basic Information</h5>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Job Title *
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g., Senior Data Engineer - Databricks"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Department *
                </label>
                <select
                  value={form.department}
                  onChange={(e) => setForm({ ...form, department: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Experience Level
                </label>
                <select
                  value={form.experience_level}
                  onChange={(e) => setForm({ ...form, experience_level: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  {experienceLevels.map(level => (
                    <option key={level.value} value={level.value}>{level.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={6}
                placeholder="Describe the role, team, and what makes this opportunity exciting..."
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">Supports Markdown formatting</p>
            </div>
          </div>

          {/* Responsibilities */}
          <div className="bg-white p-6 rounded-lg border space-y-4">
            <h5 className="text-sm font-semibold text-gray-900">Responsibilities</h5>
            {form.responsibilities.map((item, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => updateArrayField('responsibilities', index, e.target.value)}
                  placeholder="Add a responsibility..."
                  className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                {form.responsibilities.length > 1 && (
                  <button
                    onClick={() => removeArrayItem('responsibilities', index)}
                    className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={() => addArrayItem('responsibilities')}
              className="text-blue-600 text-sm hover:underline"
            >
              + Add responsibility
            </button>
          </div>

          {/* Requirements */}
          <div className="bg-white p-6 rounded-lg border space-y-4">
            <h5 className="text-sm font-semibold text-gray-900">Requirements</h5>
            {form.requirements.map((item, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => updateArrayField('requirements', index, e.target.value)}
                  placeholder="Add a requirement..."
                  className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                {form.requirements.length > 1 && (
                  <button
                    onClick={() => removeArrayItem('requirements', index)}
                    className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={() => addArrayItem('requirements')}
              className="text-blue-600 text-sm hover:underline"
            >
              + Add requirement
            </button>
          </div>

          {/* Nice to Have */}
          <div className="bg-white p-6 rounded-lg border space-y-4">
            <h5 className="text-sm font-semibold text-gray-900">Nice to Have (Optional)</h5>
            {form.nice_to_have.map((item, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => updateArrayField('nice_to_have', index, e.target.value)}
                  placeholder="Add a nice-to-have qualification..."
                  className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                {form.nice_to_have.length > 1 && (
                  <button
                    onClick={() => removeArrayItem('nice_to_have', index)}
                    className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={() => addArrayItem('nice_to_have')}
              className="text-blue-600 text-sm hover:underline"
            >
              + Add nice-to-have
            </button>
          </div>

          {/* Skills */}
          <div className="bg-white p-6 rounded-lg border space-y-4">
            <h5 className="text-sm font-semibold text-gray-900">Required Skills / Technologies</h5>
            <div className="flex flex-wrap gap-2">
              {form.skills.map((skill, index) => (
                <div key={index} className="flex items-center gap-1 bg-gray-100 rounded-full px-3 py-1">
                  <input
                    type="text"
                    value={skill}
                    onChange={(e) => updateArrayField('skills', index, e.target.value)}
                    placeholder="Skill"
                    className="bg-transparent border-none focus:outline-none text-sm w-24"
                  />
                  <button
                    onClick={() => removeArrayItem('skills', index)}
                    className="text-gray-400 hover:text-red-600"
                  >
                    ×
                  </button>
                </div>
              ))}
              <button
                onClick={() => addArrayItem('skills')}
                className="px-3 py-1 border border-dashed rounded-full text-sm text-gray-500 hover:border-blue-500 hover:text-blue-500"
              >
                + Add skill
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Location */}
          <div className="bg-white p-6 rounded-lg border space-y-4">
            <h5 className="text-sm font-semibold text-gray-900">Location</h5>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City *
              </label>
              <input
                type="text"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                placeholder="e.g., Atlanta or Bengaluru"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                State / Region
              </label>
              <input
                type="text"
                value={form.state_region}
                onChange={(e) => setForm({ ...form, state_region: e.target.value })}
                placeholder="e.g., GA or Karnataka"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">Optional — leave blank if it doesn&apos;t apply.</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Country *
              </label>
              <input
                type="text"
                value={form.country}
                onChange={(e) => setForm({ ...form, country: e.target.value })}
                placeholder="e.g., USA or India"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Work Type
              </label>
              <div className="space-y-2">
                {locationTypes.map(type => (
                  <label key={type.value} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="location_type"
                      value={type.value}
                      checked={form.location_type === type.value}
                      onChange={(e) => setForm({ ...form, location_type: e.target.value })}
                      className="text-blue-600"
                    />
                    <span className="text-sm">{type.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Employment Type
              </label>
              <select
                value={form.employment_type}
                onChange={(e) => setForm({ ...form, employment_type: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                {employmentTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Compensation */}
          <div className="bg-white p-6 rounded-lg border space-y-4">
            <h5 className="text-sm font-semibold text-gray-900">Compensation</h5>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Min</label>
                <input
                  type="number"
                  value={form.salary_min}
                  onChange={(e) => setForm({ ...form, salary_min: e.target.value })}
                  placeholder="100000"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max</label>
                <input
                  type="number"
                  value={form.salary_max}
                  onChange={(e) => setForm({ ...form, salary_max: e.target.value })}
                  placeholder="150000"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.show_salary}
                onChange={(e) => setForm({ ...form, show_salary: e.target.checked })}
                className="text-blue-600 rounded"
              />
              <span className="text-sm text-gray-700">Show salary on job posting</span>
            </label>
          </div>

          {/* Benefits */}
          <div className="bg-white p-6 rounded-lg border space-y-4">
            <h5 className="text-sm font-semibold text-gray-900">Benefits</h5>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {form.benefits.map((benefit, index) => (
                <label key={index} className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    checked={true}
                    onChange={() => removeArrayItem('benefits', index)}
                    className="mt-1 text-blue-600 rounded"
                  />
                  <span className="text-sm text-gray-700">{benefit}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Settings */}
          <div className="bg-white p-6 rounded-lg border space-y-4">
            <h5 className="text-sm font-semibold text-gray-900">Settings</h5>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Application Deadline (Optional)
              </label>
              <input
                type="date"
                value={form.closes_at}
                onChange={(e) => setForm({ ...form, closes_at: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notification Email(s)
              </label>
              <input
                type="text"
                value={form.notification_emails}
                onChange={(e) => setForm({ ...form, notification_emails: e.target.value })}
                placeholder="rmg.india@aciinfotech.com"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Comma-separate multiple addresses. Leave blank to send to the default RMG inbox.
              </p>
            </div>
          </div>

          {/* SEO */}
          <div className="bg-white p-6 rounded-lg border space-y-4">
            <h5 className="text-sm font-semibold text-gray-900">SEO</h5>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Meta Title
              </label>
              <input
                type="text"
                value={form.meta_title}
                onChange={(e) => setForm({ ...form, meta_title: e.target.value })}
                placeholder="Leave empty to use job title"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Meta Description
              </label>
              <textarea
                value={form.meta_description}
                onChange={(e) => setForm({ ...form, meta_description: e.target.value })}
                rows={3}
                placeholder="Leave empty to use job description"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
