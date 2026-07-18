'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowUpRight, Check, Loader2, Plus } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { v4Sans, v4Display } from '@/components/v4/fonts';

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

/** Soft double shadow shared with the v4 page kit. */
const CARD_SHADOW = 'shadow-[0_3px_9px_rgba(63,74,126,0.06),0_1px_29px_rgba(63,74,126,0.12)]';

/** Blue check badge, matching CheckBadge in src/components/v4/page/kit.tsx.
    Defined locally so this client page skips the server kit bundle. */
function CheckBadge() {
  return (
    <span
      aria-hidden="true"
      className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
      style={{ background: '#1D4ED8' }}
    >
      <Check size={12} strokeWidth={3} className="text-white" />
    </span>
  );
}

/** Animated-underline text link, the v4 house style. */
function TextLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="group inline-flex items-center gap-1.5 text-[15px] font-semibold text-blue-700"
    >
      <span className="relative">
        {children}
        <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-current transition-transform duration-300 ease-out group-hover:scale-x-100" />
      </span>
      <ArrowUpRight
        size={15}
        aria-hidden="true"
        className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
      />
    </Link>
  );
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
    location: '',
    linkedin_url: '',
    portfolio_url: '',
    current_company: '',
    current_title: '',
    years_experience: '',
    work_authorization: '',
    notice_period: '',
    salary_expectation: '',
    heard_from: '',
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
      formData.append('phone', form.phone);
      if (form.location) formData.append('location', form.location);
      if (form.linkedin_url) formData.append('linkedin_url', form.linkedin_url);
      if (form.portfolio_url) formData.append('portfolio_url', form.portfolio_url);
      if (form.current_company) formData.append('current_company', form.current_company);
      if (form.current_title) formData.append('current_title', form.current_title);
      if (form.years_experience) formData.append('years_experience', form.years_experience);
      if (form.work_authorization) formData.append('work_authorization', form.work_authorization);
      if (form.notice_period) formData.append('notice_period', form.notice_period);
      if (form.salary_expectation) formData.append('salary_expectation', form.salary_expectation);
      if (form.heard_from) formData.append('heard_from', form.heard_from);
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
      <main className={`min-h-screen bg-white pb-20 pt-20 text-black ${v4Sans}`}>
        <div className="mx-auto max-w-[840px] px-6 text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-[#1D4ED8]" />
          <p className="mt-4 text-gray-500">Loading job details...</p>
        </div>
      </main>
    );
  }

  if (error || !job) {
    return (
      <main className={`min-h-screen bg-white pb-24 pt-16 text-black ${v4Sans}`}>
        <div className="mx-auto max-w-[840px] px-6">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
            / Careers
          </p>
          <h1 className={`text-3xl font-bold tracking-tight sm:text-4xl ${v4Display}`}>
            {error || 'Job Not Found'}
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-gray-600">
            This position may have been filled or removed. The full list of
            open roles is one click&nbsp;away.
          </p>
          <div className="mt-8">
            <TextLink href="/careers">View all open roles</TextLink>
          </div>
        </div>
      </main>
    );
  }

  if (submitted) {
    return (
      <main className={`min-h-screen bg-white pb-24 pt-16 text-black ${v4Sans}`}>
        <div className="mx-auto max-w-[840px] px-6">
          <div className={`rounded-2xl bg-white p-8 md:p-10 ${CARD_SHADOW}`}>
            <span
              aria-hidden="true"
              className="flex h-12 w-12 items-center justify-center rounded-full"
              style={{ background: '#1D4ED8' }}
            >
              <Check size={22} strokeWidth={3} className="text-white" />
            </span>
            <h1 className={`mt-6 text-3xl font-bold tracking-tight sm:text-4xl ${v4Display}`}>
              Application submitted
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-gray-600">
              Thank you for applying to {job.title}. We&apos;ve received your
              application and will be in touch&nbsp;soon.
            </p>
            <div className="mt-8">
              <TextLink href="/careers">View more open roles</TextLink>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const employmentLabel =
    job.employment_type.charAt(0).toUpperCase() + job.employment_type.slice(1).replace('-', ' ');
  const experienceLabel =
    job.experience_level.charAt(0).toUpperCase() + job.experience_level.slice(1);
  const salaryLabel =
    job.show_salary && job.salary_min
      ? formatSalary(job.salary_min, job.salary_max, job.salary_currency)
      : '';

  // JobPosting structured data, built from the same fields the page
  // renders. Injected client-side alongside the content it describes.
  const jobPostingSchema = {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: job.title,
    description: job.description,
    datePosted: job.published_at,
    ...(job.closes_at ? { validThrough: job.closes_at } : {}),
    employmentType: job.employment_type.replace(/-/g, '_').toUpperCase(),
    hiringOrganization: {
      '@type': 'Organization',
      name: 'ACI Infotech',
      sameAs: 'https://aciinfotech.com',
    },
    jobLocation: {
      '@type': 'Place',
      address: { '@type': 'PostalAddress', addressLocality: job.location },
    },
    ...(job.location_type === 'remote' ? { jobLocationType: 'TELECOMMUTE' } : {}),
    ...(job.show_salary && job.salary_min
      ? {
          baseSalary: {
            '@type': 'MonetaryAmount',
            currency: job.salary_currency || 'USD',
            value: {
              '@type': 'QuantitativeValue',
              minValue: job.salary_min,
              ...(job.salary_max ? { maxValue: job.salary_max } : {}),
              unitText: 'YEAR',
            },
          },
        }
      : {}),
  };

  const applyButton = (
    <button
      type="button"
      onClick={() => setShowForm(true)}
      className="group inline-flex items-center gap-1.5 text-[15px] font-semibold text-blue-700"
    >
      <span className="relative">
        Apply for this role
        <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-current transition-transform duration-300 ease-out group-hover:scale-x-100" />
      </span>
      <ArrowUpRight
        size={15}
        aria-hidden="true"
        className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
      />
    </button>
  );

  return (
    <main className={`min-h-screen bg-white text-black ${v4Sans}`}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jobPostingSchema) }}
      />

      {/* Job header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-[840px] px-6 pb-10 pt-12 md:pt-16">
          <TextLink href="/careers">All open roles</TextLink>

          <p className="mb-4 mt-10 text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
            / {job.department} / {job.location_type}
          </p>
          <h1
            className={`text-3xl font-bold tracking-tight sm:text-4xl lg:text-[44px] ${v4Display}`}
            style={{ lineHeight: 1.08 }}
          >
            {job.title}
          </h1>

          <ul className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-[11px] font-semibold uppercase tracking-wide text-gray-500">
            <li className="whitespace-nowrap">{job.location}</li>
            <li className="whitespace-nowrap">{employmentLabel}</li>
            <li className="whitespace-nowrap">{experienceLabel} level</li>
            {salaryLabel ? <li className="whitespace-nowrap">{salaryLabel}</li> : null}
          </ul>

          {job.closes_at && (
            <p className="mt-4 text-sm text-gray-500">
              Applications close {new Date(job.closes_at).toLocaleDateString()}
            </p>
          )}

          <div className="mt-8">{applyButton}</div>
        </div>
      </header>

      {/* Job body */}
      <article className="bg-white py-12 md:py-16">
        <div className="mx-auto max-w-[720px] px-6">
          {/* Description */}
          <section>
            <h2 className={`text-2xl font-bold tracking-tight sm:text-3xl ${v4Display}`}>
              About this role
            </h2>
            <div className="mt-5 text-[17px] leading-relaxed text-gray-800">
              <ReactMarkdown
                components={{
                  h1: ({ children }) => (
                    <h3 className={`mt-8 text-xl font-semibold text-black ${v4Display}`}>{children}</h3>
                  ),
                  h2: ({ children }) => (
                    <h3 className={`mt-8 text-xl font-semibold text-black ${v4Display}`}>{children}</h3>
                  ),
                  h3: ({ children }) => (
                    <h4 className={`mt-6 text-lg font-semibold text-black ${v4Display}`}>{children}</h4>
                  ),
                  p: ({ children }) => <p className="mt-4 first:mt-0">{children}</p>,
                  ul: ({ children }) => <ul className="mt-4 list-disc space-y-2 pl-5">{children}</ul>,
                  ol: ({ children }) => <ol className="mt-4 list-decimal space-y-2 pl-5">{children}</ol>,
                  a: ({ href, children }) => (
                    <a href={href} className="font-semibold text-blue-700 underline underline-offset-2">
                      {children}
                    </a>
                  ),
                }}
              >
                {job.description}
              </ReactMarkdown>
            </div>
          </section>

          {/* Responsibilities */}
          {job.responsibilities && job.responsibilities.length > 0 && (
            <section className="mt-12 border-t border-gray-200 pt-10">
              <h2 className={`text-2xl font-bold tracking-tight sm:text-3xl ${v4Display}`}>
                Responsibilities
              </h2>
              <ul className="mt-6 space-y-3">
                {job.responsibilities.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckBadge />
                    <span className="text-[15px] leading-relaxed text-gray-800">{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Requirements */}
          {job.requirements && job.requirements.length > 0 && (
            <section className="mt-12 border-t border-gray-200 pt-10">
              <h2 className={`text-2xl font-bold tracking-tight sm:text-3xl ${v4Display}`}>
                Requirements
              </h2>
              <ul className="mt-6 space-y-3">
                {job.requirements.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckBadge />
                    <span className="text-[15px] leading-relaxed text-gray-800">{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Nice to have */}
          {job.nice_to_have && job.nice_to_have.length > 0 && (
            <section className="mt-12 border-t border-gray-200 pt-10">
              <h2 className={`text-2xl font-bold tracking-tight sm:text-3xl ${v4Display}`}>
                Nice to have
              </h2>
              <ul className="mt-6 space-y-3">
                {job.nice_to_have.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Plus
                      size={16}
                      strokeWidth={3}
                      aria-hidden="true"
                      className="mt-1 shrink-0 text-gray-400"
                    />
                    <span className="text-[15px] leading-relaxed text-gray-800">{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Skills */}
          {job.skills && job.skills.length > 0 && (
            <section className="mt-12 border-t border-gray-200 pt-10">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
                / Skills
              </p>
              <p className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                {job.skills.map((skill) => (
                  <span key={skill} className="whitespace-nowrap">
                    {skill}
                  </span>
                ))}
              </p>
            </section>
          )}

          {/* Benefits */}
          {job.benefits && job.benefits.length > 0 && (
            <section className="mt-12 border-t border-gray-200 pt-10">
              <h2 className={`text-2xl font-bold tracking-tight sm:text-3xl ${v4Display}`}>
                Benefits
              </h2>
              <ul className="mt-6 space-y-3">
                {job.benefits.slice(0, 5).map((benefit, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckBadge />
                    <span className="text-[15px] leading-relaxed text-gray-800">{benefit}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Apply band */}
          <section className={`mt-14 rounded-2xl bg-white p-7 md:p-8 ${CARD_SHADOW}`}>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
              / Apply
            </p>
            <h2 className={`mt-3 text-xl font-semibold text-black ${v4Display}`}>
              Ready when you&nbsp;are
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">
              ACI Infotech is an enterprise technology consulting firm serving
              Fortune 500 clients globally. The form takes a few&nbsp;minutes.
            </p>
            <div className="mt-5">{applyButton}</div>
          </section>
        </div>
      </article>

      {/* Application Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-2xl bg-white">
            <div className="flex items-center justify-between border-b border-gray-200 p-4 md:px-6">
              <h2 className={`text-lg font-semibold ${v4Display}`}>Apply for {job.title}</h2>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                aria-label="Close application form"
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-black"
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit} className="max-h-[calc(90vh-120px)] space-y-6 overflow-y-auto p-6">
              {formError && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
                  {formError}
                </div>
              )}

              {/* Name */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    First Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.first_name}
                    onChange={(e) => setForm({ ...form, first_name: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-700"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.last_name}
                    onChange={(e) => setForm({ ...form, last_name: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-700"
                  />
                </div>
              </div>

              {/* Contact */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-700"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-700"
                  />
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Location
                </label>
                <input
                  type="text"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  placeholder="City, Country (e.g., Bengaluru, India)"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-700"
                />
              </div>

              {/* Links */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    LinkedIn URL
                  </label>
                  <input
                    type="url"
                    value={form.linkedin_url}
                    onChange={(e) => setForm({ ...form, linkedin_url: e.target.value })}
                    placeholder="https://linkedin.com/in/..."
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-700"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Portfolio URL
                  </label>
                  <input
                    type="url"
                    value={form.portfolio_url}
                    onChange={(e) => setForm({ ...form, portfolio_url: e.target.value })}
                    placeholder="https://..."
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-700"
                  />
                </div>
              </div>

              {/* Current Role */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Current Company
                  </label>
                  <input
                    type="text"
                    value={form.current_company}
                    onChange={(e) => setForm({ ...form, current_company: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-700"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Current Title
                  </label>
                  <input
                    type="text"
                    value={form.current_title}
                    onChange={(e) => setForm({ ...form, current_title: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-700"
                  />
                </div>
              </div>

              {/* Experience */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Years of Experience
                </label>
                <select
                  value={form.years_experience}
                  onChange={(e) => setForm({ ...form, years_experience: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-700"
                >
                  <option value="">Select...</option>
                  <option value="0">Less than 1 year</option>
                  <option value="1">1-2 years</option>
                  <option value="3">3-5 years</option>
                  <option value="6">6-10 years</option>
                  <option value="10">10+ years</option>
                </select>
              </div>

              {/* Work authorization + notice period */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Work Authorization
                  </label>
                  <select
                    value={form.work_authorization}
                    onChange={(e) => setForm({ ...form, work_authorization: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-700"
                  >
                    <option value="">Select...</option>
                    <option value="Citizen / National">Citizen / National</option>
                    <option value="Permanent Resident">Permanent Resident</option>
                    <option value="Valid Work Visa">Valid Work Visa</option>
                    <option value="Require Sponsorship">Require Sponsorship</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Notice Period
                  </label>
                  <select
                    value={form.notice_period}
                    onChange={(e) => setForm({ ...form, notice_period: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-700"
                  >
                    <option value="">Select...</option>
                    <option value="Immediately available">Immediately available</option>
                    <option value="1-2 weeks">1-2 weeks</option>
                    <option value="1 month">1 month</option>
                    <option value="2 months">2 months</option>
                    <option value="3+ months">3+ months</option>
                  </select>
                </div>
              </div>

              {/* Salary expectation */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Salary Expectation
                </label>
                <input
                  type="text"
                  value={form.salary_expectation}
                  onChange={(e) => setForm({ ...form, salary_expectation: e.target.value })}
                  placeholder="e.g., $120,000 or ₹25 LPA"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-700"
                />
              </div>

              {/* Resume */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
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
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-700"
                />
                <p className="mt-1 text-xs text-gray-500">PDF or Word document, max 5MB</p>
              </div>

              {/* Cover Letter */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Cover Letter
                </label>
                <textarea
                  value={form.cover_letter}
                  onChange={(e) => setForm({ ...form, cover_letter: e.target.value })}
                  rows={4}
                  placeholder="Tell us why you're interested in this role..."
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-700"
                />
              </div>

              {/* How did you hear about us */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  How did you hear about us?
                </label>
                <select
                  value={form.heard_from}
                  onChange={(e) => setForm({ ...form, heard_from: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-700"
                >
                  <option value="">Select...</option>
                  <option value="LinkedIn">LinkedIn</option>
                  <option value="Job Board">Job Board (Indeed, Naukri, etc.)</option>
                  <option value="Company Website">Company Website</option>
                  <option value="Employee Referral">Employee Referral</option>
                  <option value="Search Engine">Search Engine</option>
                  <option value="Social Media">Social Media</option>
                  <option value="Event / Conference">Event / Conference</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Submit: the one filled button on the page, because it is a
                  functional form submit. */}
              <div className="flex items-center justify-end gap-6 border-t border-gray-200 pt-5">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="text-sm font-semibold text-gray-500 hover:text-black"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 rounded-full bg-[#1D4ED8] px-7 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Application'
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
