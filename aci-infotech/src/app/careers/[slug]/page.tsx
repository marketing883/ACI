'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  MapPin,
  Clock,
  Briefcase,
  DollarSign,
  CheckCircle2,
  Send,
  Loader2,
  Building2,
  Calendar
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface Job {
  id: string;
  title: string;
  slug: string;
  department: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  nice_to_have: string[];
  location: string;
  location_type: string;
  employment_type: string;
  experience_level: string;
  skills: string[];
  salary_min: number | null;
  salary_max: number | null;
  show_salary: boolean;
  salary_currency: string;
  benefits: string[];
  published_at: string;
  closes_at: string | null;
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function JobDetailPage({ params }: PageProps) {
  const { slug } = use(params);
  const router = useRouter();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState('');

  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    linkedin_url: '',
    portfolio_url: '',
    current_company: '',
    current_title: '',
    years_experience: '',
    cover_letter: '',
    resume: null as File | null,
  });

  useEffect(() => {
    fetchJob();
  }, [slug]);

  async function fetchJob() {
    try {
      const response = await fetch(`/api/jobs/${slug}`);
      if (!response.ok) {
        if (response.status === 404) {
          setError('Job not found');
        } else if (response.status === 410) {
          setError('This position is no longer accepting applications');
        } else {
          setError('Failed to load job');
        }
        return;
      }
      const data = await response.json();
      setJob(data.job);
    } catch (err) {
      setError('Failed to load job');
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!job) return;

    setFormError('');
    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('job_id', job.id);
      formData.append('first_name', form.first_name);
      formData.append('last_name', form.last_name);
      formData.append('email', form.email);
      if (form.phone) formData.append('phone', form.phone);
      if (form.linkedin_url) formData.append('linkedin_url', form.linkedin_url);
      if (form.portfolio_url) formData.append('portfolio_url', form.portfolio_url);
      if (form.current_company) formData.append('current_company', form.current_company);
      if (form.current_title) formData.append('current_title', form.current_title);
      if (form.years_experience) formData.append('years_experience', form.years_experience);
      if (form.cover_letter) formData.append('cover_letter', form.cover_letter);
      if (form.resume) formData.append('resume', form.resume);
      formData.append('source', 'direct');

      const response = await fetch('/api/jobs/apply', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit application');
      }

      setSubmitted(true);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Failed to submit application');
    } finally {
      setSubmitting(false);
    }
  }

  function formatSalary(min: number | null, max: number | null, currency: string = 'USD'): string {
    if (!min && !max) return '';
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    });
    if (min && max) {
      return `${formatter.format(min)} - ${formatter.format(max)}`;
    }
    if (min) return `From ${formatter.format(min)}`;
    if (max) return `Up to ${formatter.format(max)}`;
    return '';
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Loader2 className="w-8 h-8 animate-spin text-[var(--aci-primary)] mx-auto" />
          <p className="text-gray-500 mt-4">Loading job details...</p>
        </div>
      </main>
    );
  }

  if (error || !job) {
    return (
      <main className="min-h-screen bg-gray-50 pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="bg-white p-8 rounded-xl shadow-sm">
            <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{error || 'Job Not Found'}</h1>
            <p className="text-gray-500 mb-6">
              This position may have been filled or removed.
            </p>
            <Link
              href="/careers"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--aci-primary)] text-white rounded-lg hover:bg-blue-700"
            >
              <ArrowLeft className="w-4 h-4" />
              View All Positions
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (submitted) {
    return (
      <main className="min-h-screen bg-gray-50 pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white p-8 rounded-xl shadow-sm text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Application Submitted!</h1>
            <p className="text-gray-600 mb-6">
              Thank you for applying to {job.title}. We've received your application and will be in touch soon.
            </p>
            <Link
              href="/careers"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--aci-primary)] text-white rounded-lg hover:bg-blue-700"
            >
              View More Positions
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-[var(--aci-secondary)] pt-32 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/careers"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            All Positions
          </Link>

          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm">
              {job.department}
            </span>
            <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm capitalize">
              {job.location_type}
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {job.title}
          </h1>

          <div className="flex flex-wrap gap-6 text-gray-400">
            <span className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              {job.location}
            </span>
            <span className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              {job.employment_type.charAt(0).toUpperCase() + job.employment_type.slice(1).replace('-', ' ')}
            </span>
            <span className="flex items-center gap-2">
              <Briefcase className="w-5 h-5" />
              {job.experience_level.charAt(0).toUpperCase() + job.experience_level.slice(1)} Level
            </span>
            {job.show_salary && job.salary_min && (
              <span className="flex items-center gap-2 text-green-400">
                <DollarSign className="w-5 h-5" />
                {formatSalary(job.salary_min, job.salary_max, job.salary_currency)}
              </span>
            )}
          </div>

          {job.closes_at && (
            <div className="mt-4 flex items-center gap-2 text-yellow-400 text-sm">
              <Calendar className="w-4 h-4" />
              Applications close: {new Date(job.closes_at).toLocaleDateString()}
            </div>
          )}
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h2 className="text-xl font-bold text-[var(--aci-secondary)] mb-4">About This Role</h2>
              <div className="prose prose-gray max-w-none">
                <ReactMarkdown>{job.description}</ReactMarkdown>
              </div>
            </div>

            {/* Responsibilities */}
            {job.responsibilities && job.responsibilities.length > 0 && (
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h2 className="text-xl font-bold text-[var(--aci-secondary)] mb-4">Responsibilities</h2>
                <ul className="space-y-3">
                  {job.responsibilities.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Requirements */}
            {job.requirements && job.requirements.length > 0 && (
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h2 className="text-xl font-bold text-[var(--aci-secondary)] mb-4">Requirements</h2>
                <ul className="space-y-3">
                  {job.requirements.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-[var(--aci-primary)] flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Nice to Have */}
            {job.nice_to_have && job.nice_to_have.length > 0 && (
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h2 className="text-xl font-bold text-[var(--aci-secondary)] mb-4">Nice to Have</h2>
                <ul className="space-y-3">
                  {job.nice_to_have.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="w-5 h-5 flex items-center justify-center text-gray-400 flex-shrink-0">+</span>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Skills */}
            {job.skills && job.skills.length > 0 && (
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h2 className="text-xl font-bold text-[var(--aci-secondary)] mb-4">Required Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Apply Card */}
            <div className="bg-white p-6 rounded-xl shadow-sm sticky top-24">
              <h3 className="text-lg font-bold text-[var(--aci-secondary)] mb-4">
                Apply for this position
              </h3>
              <button
                onClick={() => setShowForm(true)}
                className="w-full py-3 bg-[var(--aci-primary)] text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
              >
                <Send className="w-5 h-5" />
                Apply Now
              </button>

              {/* Benefits */}
              {job.benefits && job.benefits.length > 0 && (
                <div className="mt-6 pt-6 border-t">
                  <h4 className="text-sm font-medium text-gray-500 mb-3">Benefits</h4>
                  <ul className="space-y-2">
                    {job.benefits.slice(0, 5).map((benefit, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                        <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Company Info */}
              <div className="mt-6 pt-6 border-t">
                <div className="flex items-center gap-3 mb-3">
                  <Building2 className="w-5 h-5 text-gray-400" />
                  <span className="font-medium text-gray-700">ACI Infotech</span>
                </div>
                <p className="text-sm text-gray-500">
                  Enterprise technology consulting firm serving Fortune 500 clients globally.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Application Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Apply for {job.title}</h2>
              <button
                onClick={() => setShowForm(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-120px)] space-y-6">
              {formError && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                  {formError}
                </div>
              )}

              {/* Name */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.first_name}
                    onChange={(e) => setForm({ ...form, first_name: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.last_name}
                    onChange={(e) => setForm({ ...form, last_name: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Contact */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Links */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    LinkedIn URL
                  </label>
                  <input
                    type="url"
                    value={form.linkedin_url}
                    onChange={(e) => setForm({ ...form, linkedin_url: e.target.value })}
                    placeholder="https://linkedin.com/in/..."
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Portfolio URL
                  </label>
                  <input
                    type="url"
                    value={form.portfolio_url}
                    onChange={(e) => setForm({ ...form, portfolio_url: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Current Role */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current Company
                  </label>
                  <input
                    type="text"
                    value={form.current_company}
                    onChange={(e) => setForm({ ...form, current_company: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current Title
                  </label>
                  <input
                    type="text"
                    value={form.current_title}
                    onChange={(e) => setForm({ ...form, current_title: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Experience */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Years of Experience
                </label>
                <select
                  value={form.years_experience}
                  onChange={(e) => setForm({ ...form, years_experience: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select...</option>
                  <option value="0">Less than 1 year</option>
                  <option value="1">1-2 years</option>
                  <option value="3">3-5 years</option>
                  <option value="6">6-10 years</option>
                  <option value="10">10+ years</option>
                </select>
              </div>

              {/* Resume */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Resume
                </label>
                <input
                  type="file"
                  // Extension-only accept lists ("accept='.pdf,.doc,.docx'")
                  // are honored by Chrome/Firefox but Safari sometimes
                  // rejects valid files when the MIME is missing. List
                  // both the MIME and the extension so every engine
                  // accepts the same set of files.
                  accept="application/pdf,.pdf,application/msword,.doc,application/vnd.openxmlformats-officedocument.wordprocessingml.document,.docx"
                  onChange={(e) => setForm({ ...form, resume: e.target.files?.[0] || null })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">PDF or Word document, max 5MB</p>
              </div>

              {/* Cover Letter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cover Letter
                </label>
                <textarea
                  value={form.cover_letter}
                  onChange={(e) => setForm({ ...form, cover_letter: e.target.value })}
                  rows={4}
                  placeholder="Tell us why you're interested in this role..."
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Submit */}
              <div className="flex justify-end gap-4 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-6 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 bg-[var(--aci-primary)] text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Submit Application
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
