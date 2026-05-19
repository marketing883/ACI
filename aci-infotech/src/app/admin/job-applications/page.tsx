'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  Users,
  Mail,
  Phone,
  Briefcase,
  MapPin,
  Calendar,
  Star,
  FileText,
  ExternalLink,
  ChevronDown,
  X,
  Loader2,
  Trash2
} from 'lucide-react';

interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
}

interface Application {
  id: string;
  created_at: string;
  job_id: string;
  jobs: Job;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  location: string | null;
  linkedin_url: string | null;
  portfolio_url: string | null;
  current_company: string | null;
  current_title: string | null;
  years_experience: number | null;
  work_authorization: string | null;
  notice_period: string | null;
  salary_expectation: string | null;
  heard_from: string | null;
  resume_url: string | null;
  resume_filename: string | null;
  cover_letter: string | null;
  source: string;
  referral_name: string | null;
  status: string;
  status_notes: string | null;
  internal_notes: string | null;
  rating: number | null;
}

// Build a /api/admin/resume/<path> URL from the storage path we
// stored at application time. The route signs + redirects on click.
function resumeDownloadUrl(storagePath: string): string {
  const encoded = storagePath
    .split('/')
    .map(encodeURIComponent)
    .join('/');
  return `/api/admin/resume/${encoded}`;
}

const statusOptions = [
  { value: 'new', label: 'New', color: 'bg-blue-100 text-blue-700' },
  { value: 'reviewing', label: 'Reviewing', color: 'bg-yellow-100 text-yellow-700' },
  { value: 'interviewed', label: 'Interviewed', color: 'bg-purple-100 text-purple-700' },
  { value: 'offered', label: 'Offered', color: 'bg-green-100 text-green-700' },
  { value: 'hired', label: 'Hired', color: 'bg-green-200 text-green-800' },
  { value: 'rejected', label: 'Rejected', color: 'bg-red-100 text-red-700' },
];

function JobApplicationsContent() {
  const searchParams = useSearchParams();
  const jobIdFilter = searchParams.get('job_id');

  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ status: '', job_id: jobIdFilter || '' });
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [statusNotes, setStatusNotes] = useState('');
  const [internalNotes, setInternalNotes] = useState('');
  const [notesSaving, setNotesSaving] = useState(false);

  useEffect(() => {
    if (selectedApp) {
      setStatusNotes(selectedApp.status_notes ?? '');
      setInternalNotes(selectedApp.internal_notes ?? '');
    }
  }, [selectedApp]);

  async function saveNotes(
    id: string,
    patch: { status_notes?: string | null; internal_notes?: string | null },
  ) {
    setNotesSaving(true);
    try {
      const response = await fetch(`/api/admin/job-applications/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patch),
      });
      if (response.ok) {
        setApplications((apps) =>
          apps.map((app) => (app.id === id ? { ...app, ...patch } : app)),
        );
        if (selectedApp?.id === id) {
          setSelectedApp({ ...selectedApp, ...patch });
        }
      }
    } catch (error) {
      console.error('Failed to save notes:', error);
    } finally {
      setNotesSaving(false);
    }
  }

  useEffect(() => {
    fetchApplications();
  }, [filter]);

  async function fetchApplications() {
    try {
      const params = new URLSearchParams();
      if (filter.status) params.append('status', filter.status);
      if (filter.job_id) params.append('job_id', filter.job_id);

      const response = await fetch(`/api/admin/job-applications?${params}`);
      const data = await response.json();
      setApplications(data.applications || []);
    } catch (error) {
      console.error('Failed to fetch applications:', error);
    } finally {
      setLoading(false);
    }
  }

  async function updateApplicationStatus(id: string, status: string) {
    setUpdating(true);
    try {
      const response = await fetch(`/api/admin/job-applications/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        setApplications(apps =>
          apps.map(app => (app.id === id ? { ...app, status } : app))
        );
        if (selectedApp?.id === id) {
          setSelectedApp({ ...selectedApp, status });
        }
      }
    } catch (error) {
      console.error('Failed to update status:', error);
    } finally {
      setUpdating(false);
    }
  }

  async function updateApplicationRating(id: string, rating: number) {
    try {
      const response = await fetch(`/api/admin/job-applications/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating }),
      });

      if (response.ok) {
        setApplications(apps =>
          apps.map(app => (app.id === id ? { ...app, rating } : app))
        );
        if (selectedApp?.id === id) {
          setSelectedApp({ ...selectedApp, rating });
        }
      }
    } catch (error) {
      console.error('Failed to update rating:', error);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this application? This cannot be undone.')) {
      return;
    }

    setDeleting(id);
    try {
      const response = await fetch(`/api/admin/job-applications/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setApplications(apps => apps.filter(app => app.id !== id));
        if (selectedApp?.id === id) {
          setSelectedApp(null);
        }
      }
    } catch (error) {
      console.error('Failed to delete application:', error);
    } finally {
      setDeleting(null);
    }
  }

  const stats = {
    total: applications.length,
    new: applications.filter(a => a.status === 'new').length,
    reviewing: applications.filter(a => a.status === 'reviewing').length,
    interviewed: applications.filter(a => a.status === 'interviewed').length,
  };

  const getStatusColor = (status: string) => {
    return statusOptions.find(s => s.value === status)?.color || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Job Applications</h1>
          <p className="text-gray-500">Review and manage candidate applications</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              <p className="text-sm text-gray-500">Total Applications</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Mail className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.new}</p>
              <p className="text-sm text-gray-500">New</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <FileText className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.reviewing}</p>
              <p className="text-sm text-gray-500">In Review</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Calendar className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.interviewed}</p>
              <p className="text-sm text-gray-500">Interviewed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4 bg-white p-4 rounded-lg border">
        <select
          value={filter.status}
          onChange={(e) => setFilter({ ...filter, status: e.target.value })}
          className="px-3 py-2 border rounded-lg text-sm"
        >
          <option value="">All Status</option>
          {statusOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        {filter.job_id && (
          <button
            onClick={() => setFilter({ ...filter, job_id: '' })}
            className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm"
          >
            Filtered by job
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Applications Table */}
      <div className="bg-white rounded-lg border overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading applications...</div>
        ) : applications.length === 0 ? (
          <div className="p-8 text-center">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No applications found</p>
          </div>
        ) : (
          // Wrap the table in a horizontal-scroll container. The admin
          // layout can render narrower than the six-column table on
          // mobile Safari, where an unwrapped table blows the viewport
          // and breaks position:sticky ancestors.
          <div className="overflow-x-auto">
          <table className="w-full min-w-[720px]">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Candidate</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Position</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Status</th>
                <th className="text-center px-4 py-3 text-sm font-medium text-gray-500">Rating</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Applied</th>
                <th className="text-right px-4 py-3 text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {applications.map((app) => (
                <tr key={app.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4">
                    <div>
                      <p className="font-medium text-gray-900">
                        {app.first_name} {app.last_name}
                      </p>
                      <p className="text-sm text-gray-500">{app.email}</p>
                      {app.current_title && app.current_company && (
                        <p className="text-xs text-gray-400 mt-1">
                          {app.current_title} at {app.current_company}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div>
                      <Link
                        href={`/admin/jobs/${app.job_id}/edit`}
                        className="font-medium text-gray-900 hover:text-blue-600"
                      >
                        {app.jobs?.title || 'Unknown Position'}
                      </Link>
                      <p className="text-sm text-gray-500">{app.jobs?.department}</p>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="relative">
                      <select
                        value={app.status}
                        onChange={(e) => updateApplicationStatus(app.id, e.target.value)}
                        disabled={updating}
                        className={`appearance-none px-3 py-1 pr-8 rounded-full text-xs font-medium cursor-pointer ${getStatusColor(app.status)}`}
                      >
                        {statusOptions.map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none" />
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => updateApplicationRating(app.id, star)}
                          className={`p-0.5 ${
                            app.rating && star <= app.rating
                              ? 'text-yellow-400'
                              : 'text-gray-300 hover:text-yellow-400'
                          }`}
                        >
                          <Star className="w-4 h-4 fill-current" />
                        </button>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-500">
                    {new Date(app.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setSelectedApp(app)}
                        className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-lg"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleDelete(app.id)}
                        disabled={deleting === app.id}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-50"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        )}
      </div>

      {/* Application Detail Modal */}
      {selectedApp && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Application Details</h2>
              <button
                onClick={() => setSelectedApp(null)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)] space-y-6">
              {/* Candidate Info */}
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {selectedApp.first_name} {selectedApp.last_name}
                </h3>
                <p className="text-gray-500">{selectedApp.jobs?.title}</p>
              </div>

              {/* Contact */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail className="w-4 h-4" />
                  <a href={`mailto:${selectedApp.email}`} className="hover:text-blue-600">
                    {selectedApp.email}
                  </a>
                </div>
                {selectedApp.phone && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="w-4 h-4" />
                    <a href={`tel:${selectedApp.phone}`} className="hover:text-blue-600">
                      {selectedApp.phone}
                    </a>
                  </div>
                )}
                {selectedApp.linkedin_url && (
                  <a
                    href={selectedApp.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-blue-600 hover:underline"
                  >
                    <ExternalLink className="w-4 h-4" />
                    LinkedIn Profile
                  </a>
                )}
                {selectedApp.portfolio_url && (
                  <a
                    href={selectedApp.portfolio_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-blue-600 hover:underline"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Portfolio
                  </a>
                )}
              </div>

              {/* Current Role */}
              {(selectedApp.current_title || selectedApp.current_company) && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Current Position</h4>
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-gray-400" />
                    <span>
                      {selectedApp.current_title}
                      {selectedApp.current_company && ` at ${selectedApp.current_company}`}
                    </span>
                  </div>
                  {selectedApp.years_experience && (
                    <p className="text-sm text-gray-500 mt-1">
                      {selectedApp.years_experience} years of experience
                    </p>
                  )}
                </div>
              )}

              {/* Logistics: location, work auth, notice, salary, channel */}
              {(selectedApp.location ||
                selectedApp.work_authorization ||
                selectedApp.notice_period ||
                selectedApp.salary_expectation ||
                selectedApp.heard_from) && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-500 mb-3">Details</h4>
                  <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    {selectedApp.location && (
                      <>
                        <dt className="text-gray-500">Location</dt>
                        <dd className="text-gray-900">{selectedApp.location}</dd>
                      </>
                    )}
                    {selectedApp.work_authorization && (
                      <>
                        <dt className="text-gray-500">Work authorization</dt>
                        <dd className="text-gray-900">{selectedApp.work_authorization}</dd>
                      </>
                    )}
                    {selectedApp.notice_period && (
                      <>
                        <dt className="text-gray-500">Notice period</dt>
                        <dd className="text-gray-900">{selectedApp.notice_period}</dd>
                      </>
                    )}
                    {selectedApp.salary_expectation && (
                      <>
                        <dt className="text-gray-500">Salary expectation</dt>
                        <dd className="text-gray-900">{selectedApp.salary_expectation}</dd>
                      </>
                    )}
                    {selectedApp.heard_from && (
                      <>
                        <dt className="text-gray-500">Heard about us via</dt>
                        <dd className="text-gray-900">{selectedApp.heard_from}</dd>
                      </>
                    )}
                  </dl>
                </div>
              )}

              {/* Resume - now backed by the /api/admin/resume/[...path]
                  signed-URL redirector so the file actually opens. */}
              {selectedApp.resume_url && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Resume</h4>
                  <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                    <FileText className="w-5 h-5 text-gray-400" />
                    <span className="flex-1 truncate">
                      {selectedApp.resume_filename || selectedApp.resume_url.split('/').pop()}
                    </span>
                    <a
                      href={resumeDownloadUrl(selectedApp.resume_url)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                    >
                      View
                    </a>
                    <a
                      href={resumeDownloadUrl(selectedApp.resume_url)}
                      download={selectedApp.resume_filename ?? undefined}
                      className="px-3 py-1.5 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
                    >
                      Download
                    </a>
                  </div>
                </div>
              )}

              {/* Cover Letter */}
              {selectedApp.cover_letter && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Cover Letter</h4>
                  <div className="p-4 bg-gray-50 rounded-lg whitespace-pre-wrap text-gray-700">
                    {selectedApp.cover_letter}
                  </div>
                </div>
              )}

              {/* Status & Rating */}
              <div className="flex items-center justify-between pt-4 border-t">
                <div>
                  <label className="text-sm font-medium text-gray-500 block mb-2">Status</label>
                  <select
                    value={selectedApp.status}
                    onChange={(e) => updateApplicationStatus(selectedApp.id, e.target.value)}
                    className={`px-4 py-2 rounded-lg font-medium ${getStatusColor(selectedApp.status)}`}
                  >
                    {statusOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 block mb-2">Rating</label>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => updateApplicationRating(selectedApp.id, star)}
                        className={`p-1 ${
                          selectedApp.rating && star <= selectedApp.rating
                            ? 'text-yellow-400'
                            : 'text-gray-300 hover:text-yellow-400'
                        }`}
                      >
                        <Star className="w-6 h-6 fill-current" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Status notes - reason/context for the current status,
                  visible to everyone on the hiring team. */}
              <div>
                <label className="text-sm font-medium text-gray-500 block mb-2">
                  Status notes
                </label>
                <textarea
                  value={statusNotes}
                  onChange={(e) => setStatusNotes(e.target.value)}
                  onBlur={() => {
                    if ((selectedApp.status_notes ?? '') !== statusNotes) {
                      saveNotes(selectedApp.id, { status_notes: statusNotes || null });
                    }
                  }}
                  placeholder="Reason for the current status, next-step summary, interview feedback shared with the team..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Internal notes - private notes not intended to be shared. */}
              <div>
                <label className="text-sm font-medium text-gray-500 block mb-2">
                  Internal notes
                </label>
                <textarea
                  value={internalNotes}
                  onChange={(e) => setInternalNotes(e.target.value)}
                  onBlur={() => {
                    if ((selectedApp.internal_notes ?? '') !== internalNotes) {
                      saveNotes(selectedApp.id, {
                        internal_notes: internalNotes || null,
                      });
                    }
                  }}
                  placeholder="Private thoughts, red flags, salary expectations, anything not for external eyes..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {notesSaving && (
                  <p className="text-xs text-gray-400 mt-1">Saving...</p>
                )}
              </div>

              {/* Meta */}
              <div className="text-xs text-gray-400 pt-4 border-t space-y-1">
                <p>Applied: {new Date(selectedApp.created_at).toLocaleString()}</p>
                <p>Source: {selectedApp.source || 'Direct'}</p>
                {selectedApp.referral_name && (
                  <p>Referred by: {selectedApp.referral_name}</p>
                )}
              </div>

              {/* Delete Button */}
              <div className="pt-4 border-t">
                <button
                  onClick={() => handleDelete(selectedApp.id)}
                  disabled={deleting === selectedApp.id}
                  className="flex items-center gap-2 px-4 py-2 text-red-600 border border-red-200 rounded-lg hover:bg-red-50 disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Application
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Wrapper component with Suspense for useSearchParams
export default function JobApplicationsPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    }>
      <JobApplicationsContent />
    </Suspense>
  );
}
