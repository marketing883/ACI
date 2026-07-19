'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ArrowUpRight, Check, X } from 'lucide-react';
import { trackFormSubmission, trackEvent } from '@/components/analytics/GoogleTagManager';
import { trackContactFormConversion } from '@/components/analytics/LinkedInInsightTag';
import { isWorkEmail } from '@/lib/email-validation';
import { captureAttribution, type Attribution } from '@/lib/analytics/attribution';
import {
  parseContactIntent,
  intentLabel,
  intentServiceInterest,
  intentToRecord,
  type ContactIntent,
} from '@/lib/contact-intent';
import {
  STAGE_OPTIONS,
  focusOptionsFor,
  isProjectReason,
  stageLabel,
} from '@/lib/contact-questions';
import GlobalOfficesBand from '@/components/contact/GlobalOfficesBand';
import { v4Sans, v4Display } from '@/components/v4/fonts';

const ATHEROS_SESSION_KEY = 'atheros_session_id';

const REASON_OPTIONS = [
  { value: 'project-inquiry', label: 'A project' },
  { value: 'architecture-call', label: 'An architecture discussion' },
  { value: 'partnership', label: 'A partnership' },
  { value: 'careers', label: 'Careers' },
  { value: 'general', label: 'A general question' },
];

/** Real, published proof per intent. Slugs and metrics only from live
    case studies; nothing invented. */
const PROOF_BY_KEY: Record<string, { metric?: string; metricLabel?: string; title: string; href: string }> = {
  'service:data-engineering': { metric: '30%', metricLabel: 'reduction in data latency', title: 'A governed lakehouse across 600+ retail locations.', href: '/case-studies/databricks-modernization-ai-enablement-for-leading-c-store-chain' },
  'service:applied-ai-ml': { metric: '4h', metricLabel: 'claims processing, down from 72', title: 'AI document automation for a national healthcare provider.', href: '/case-studies/healthcare-eligibility-verification-automation-aci-yesbot' },
  'service:cloud-modernization': { metric: '90d', metricLabel: 'from prototype to production', title: 'An Azure lakehouse for a global financial services firm.', href: '/case-studies/driving-enterprise-data-transformation-with-aci-s-azure-lakehouse' },
  'service:martech-cdp': { metric: '2.5x', metricLabel: 'email engagement', title: 'Salesforce and Braze on a governed identity spine.', href: '/case-studies/databricks-modernization-ai-enablement-for-leading-c-store-chain' },
  'service:digital-transformation': { metric: '0.1%', metricLabel: 'error rate after automation', title: 'Contract lifecycle automated end to end.', href: '/case-studies/accelerating-contract-performance-through-intelligent-automation' },
  'service:quality-engineering': { metric: '99.97%', metricLabel: 'uptime across 72+ servers', title: 'Automated DevOps and monitoring for a tech enterprise.', href: '/case-studies/optimizing-enterprise-it-operations-with-automated-devops-and-monitoring' },
  'service:managed-operations': { metric: '99.97%', metricLabel: 'uptime across 72+ servers', title: 'Operations run under published SLAs.', href: '/case-studies/optimizing-enterprise-it-operations-with-automated-devops-and-monitoring' },
  'platform:databricks': { metric: '30%', metricLabel: 'reduction in data latency', title: 'A governed Databricks lakehouse across 600+ locations.', href: '/case-studies/databricks-modernization-ai-enablement-for-leading-c-store-chain' },
  'platform:salesforce': { metric: '2.5x', metricLabel: 'email engagement', title: 'Salesforce activated on a governed identity spine.', href: '/case-studies/databricks-modernization-ai-enablement-for-leading-c-store-chain' },
  'platform:braze': { metric: '2.5x', metricLabel: 'email engagement', title: 'Braze wired to the data platform, journeys in real time.', href: '/case-studies/databricks-modernization-ai-enablement-for-leading-c-store-chain' },
  'platform:sap': { title: 'Finance reporting consolidated on an SAP transformation.', href: '/case-studies/modernizes-finance-reporting-with-sap-transformation' },
  'industry:healthcare': { metric: '4h', metricLabel: 'claims processing, down from 72', title: 'Eligibility verification automated with AI.', href: '/case-studies/healthcare-eligibility-verification-automation-aci-yesbot' },
  'industry:retail': { metric: '30%', metricLabel: 'reduction in data latency', title: 'Real-time retail data across 600+ locations.', href: '/case-studies/databricks-modernization-ai-enablement-for-leading-c-store-chain' },
  'industry:financial-services': { metric: '90d', metricLabel: 'from prototype to production', title: 'A governed Azure data foundation for a financial firm.', href: '/case-studies/driving-enterprise-data-transformation-with-aci-s-azure-lakehouse' },
  'industry:hospitality': { metric: '53', metricLabel: 'countries on one platform', title: 'One data platform for 400,000 employees.', href: '/case-studies/global-food-facilities-data-intelligence' },
};

const DEFAULT_PROOF = { metric: '500+', metricLabel: 'enterprise projects since 2006', title: 'The case studies carry the details.', href: '/case-studies' };

function proofFor(intent: ContactIntent) {
  const keys = [
    intent.service && `service:${intent.service}`,
    intent.platform && `platform:${intent.platform}`,
    intent.industry && `industry:${intent.industry}`,
  ].filter(Boolean) as string[];
  for (const k of keys) if (PROOF_BY_KEY[k]) return PROOF_BY_KEY[k];
  // Cross-fill: cloud platforms share the migration story.
  if (intent.platform && ['aws', 'azure', 'gcp'].includes(intent.platform)) {
    return PROOF_BY_KEY['service:cloud-modernization'];
  }
  return DEFAULT_PROOF;
}

/** The headline, written from where the visitor clicked. Plain words,
    no job titles, the form does the talking. */
function headlineFor(intent: ContactIntent, label: string | null | undefined) {
  if (label && intent.service) {
    return (
      <>
        Tell us about your <span style={{ color: '#1D4ED8' }}>{label}&nbsp;work.</span>
      </>
    );
  }
  if (label && intent.platform) {
    return (
      <>
        Tell us about your <span style={{ color: '#1D4ED8' }}>{label}&nbsp;plans.</span>
      </>
    );
  }
  if (label && intent.industry) {
    return (
      <>
        Tell us what you&apos;re building in <span style={{ color: '#1D4ED8' }}>{label}.</span>
      </>
    );
  }
  return (
    <>
      Tell us what you&apos;re <span style={{ color: '#1D4ED8' }}>working&nbsp;on.</span>
    </>
  );
}

interface ChatContext {
  name: string | null;
  email: string | null;
  company: string | null;
  industry: string | null;
  serviceInterest: string | null;
  painPoint: string | null;
}

function ContactExperience() {
  const searchParams = useSearchParams();
  const [intent, setIntent] = useState<ContactIntent>(() => parseContactIntent(searchParams));
  const label = intentLabel(intent);
  const proof = proofFor(intent);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    job_title: '',
    phone: '',
    reason: intent.reason ?? 'project-inquiry',
    message: '',
  });
  const [stage, setStage] = useState<string | null>(null);
  const [focus, setFocus] = useState<string[]>([]);
  const [chatContext, setChatContext] = useState<ChatContext | null>(null);
  const [chatApplied, setChatApplied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const attributionRef = useRef<Attribution>({});
  const formStarted = useRef(false);
  const loadedAt = useRef(Date.now());
  const sessionIdRef = useRef<string | null>(null);

  // The conditional block: stage + focus only make sense for project
  // work. Careers, partnership, and general questions skip both.
  const focusOptions = focusOptionsFor(intent, formData.reason);
  const showProjectQuestions = isProjectReason(formData.reason);
  // Structured answers stand in for the essay: once a stage is picked,
  // the message becomes optional.
  const structuredAnswered = showProjectQuestions && stage !== null;

  useEffect(() => {
    attributionRef.current = captureAttribution();
  }, []);

  // Ask the server what Atheros already knows about this visitor's own
  // session. Absent a session or context, this stays silent.
  useEffect(() => {
    let cancelled = false;
    try {
      const sessionId = window.localStorage.getItem(ATHEROS_SESSION_KEY);
      if (!sessionId) return;
      sessionIdRef.current = sessionId;
      fetch('/api/contact/context', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId }),
      })
        .then((r) => (r.ok ? r.json() : null))
        .then((data) => {
          if (!cancelled && data?.context) {
            setChatContext(data.context);
            trackEvent('contact_context_found', { source: 'atheros_chat' });
          }
        })
        .catch(() => {});
    } catch {
      // localStorage unavailable: nothing to do
    }
    return () => {
      cancelled = true;
    };
  }, []);

  const markStarted = () => {
    if (!formStarted.current) {
      formStarted.current = true;
      trackEvent('form_start', { form_location: 'contact_page', ...intentToRecord(intent) });
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    markStarted();
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleFocus = (option: string) => {
    markStarted();
    setFocus((prev) =>
      prev.includes(option) ? prev.filter((f) => f !== option) : [...prev, option],
    );
  };

  const pickStage = (value: string) => {
    markStarted();
    setStage(value);
    trackEvent('contact_stage_selected', { stage: value, ...intentToRecord(intent) });
  };

  const applyChatContext = () => {
    if (!chatContext) return;
    setFormData((prev) => ({
      ...prev,
      name: prev.name || chatContext.name || '',
      email: prev.email || chatContext.email || '',
      company: prev.company || chatContext.company || '',
      message:
        prev.message ||
        (chatContext.painPoint ? `From my chat with Atheros: ${chatContext.painPoint}` : ''),
    }));
    setChatApplied(true);
    trackEvent('contact_context_applied', { source: 'atheros_chat' });
  };

  const clearIntent = () => {
    setIntent({});
    setStage(null);
    setFocus([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    if (!isWorkEmail(formData.email)) {
      setError('Please use your work email. Personal emails (Gmail, Yahoo, etc.) are not accepted.');
      setIsSubmitting(false);
      return;
    }

    const honeypot = (document.getElementById('company_website') as HTMLInputElement | null)?.value ?? '';
    const intentRecord = intentToRecord(intent);
    const serviceInterest = intentServiceInterest(intent);

    // The structured answers can stand in for the message. The record
    // still gets a readable summary either way.
    const structuredSummary = [
      stage ? `Stage: ${stageLabel(stage)}.` : '',
      focus.length ? `Focus: ${focus.join(', ')}.` : '',
    ]
      .filter(Boolean)
      .join(' ');
    const message = formData.message.trim() || structuredSummary || 'No message left.';

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          message,
          ...attributionRef.current,
          intent: intentRecord,
          job_title: formData.job_title,
          stage,
          focus_areas: focus,
          service_interest: serviceInterest,
          atheros_session_id: sessionIdRef.current,
          source: intent.source ? `cta:${intent.source}` : 'website_contact_form',
          _honeypot: honeypot,
          _formLoadTime: loadedAt.current,
          _submitTime: Date.now(),
        }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Failed to submit form');

      trackFormSubmission('contact_form', 'contact_page', {
        contact_reason: formData.reason,
        company: formData.company || 'Not provided',
        ...intentRecord,
      });
      trackEvent('contact_form_submitted', {
        form_location: 'contact_page',
        inquiry_type: formData.reason,
        has_company: formData.company ? 'yes' : 'no',
        has_phone: formData.phone ? 'yes' : 'no',
        has_job_title: formData.job_title ? 'yes' : 'no',
        stage: stage ?? 'not_answered',
        focus_count: focus.length,
        chat_context: chatApplied ? 'applied' : chatContext ? 'available' : 'none',
        ...intentRecord,
        ...attributionRef.current,
      });
      trackContactFormConversion();
      setIsSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again or email us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    'w-full border-0 border-b border-gray-300 bg-transparent px-0 py-3 text-[15px] text-black outline-none transition-colors focus:border-[#1D4ED8] placeholder:text-gray-400';
  const labelClass = 'mb-1 block text-xs font-semibold uppercase tracking-[0.14em] text-gray-500';

  if (isSubmitted) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-24 text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#1D4ED8]">
          <Check size={26} className="text-white" strokeWidth={3} />
        </span>
        <h2 className={`mt-8 text-3xl font-bold tracking-tight text-black sm:text-4xl ${v4Display}`}>
          On its way.
        </h2>
        <p className="mt-4 text-base leading-relaxed text-gray-600">
          A real person reads it{label ? ` knowing it is about ${label}` : ''} and replies within
          24 business hours. If it moves faster than that, even better.
        </p>
        <Link
          href="/case-studies"
          className="group mt-8 inline-flex items-center gap-1.5 text-[15px] font-semibold text-blue-700"
        >
          <span className="relative">
            Read the case studies while you wait
            <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-current transition-transform duration-300 ease-out group-hover:scale-x-100" />
          </span>
          <ArrowUpRight size={16} aria-hidden="true" />
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="mx-auto max-w-7xl px-6 pb-20 pt-10 md:pt-14">
        {/* Compact header: one line, then the form takes over */}
        <div className="max-w-3xl">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">/ Contact</p>
          <h1
            className={`text-3xl font-bold tracking-tight text-black sm:text-4xl lg:text-[42px] ${v4Display}`}
            style={{ lineHeight: 1.08 }}
          >
            {headlineFor(intent, label)}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-gray-600">
            Short form, real reply within 24 business hours.
          </p>

          {/* Intent + chat context chips: visible, honest, removable */}
          <div className="mt-5 flex flex-wrap items-center gap-3">
            {label ? (
              <span className="inline-flex items-center gap-2 rounded-full border border-gray-300 px-4 py-1.5 text-xs font-semibold text-gray-700">
                From: {label}
                <button
                  type="button"
                  onClick={clearIntent}
                  aria-label="Clear this topic"
                  className="text-gray-400 transition-colors hover:text-black"
                >
                  <X size={13} />
                </button>
              </span>
            ) : null}
            {chatContext && !chatApplied ? (
              <button
                type="button"
                onClick={applyChatContext}
                className="group inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700"
              >
                <span className="relative">
                  Atheros already has some of this. Fill it in for me.
                  <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-current transition-transform duration-300 ease-out group-hover:scale-x-100" />
                </span>
              </button>
            ) : null}
            {chatApplied ? (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500">
                <Check size={13} className="text-[#1D4ED8]" /> Filled from your chat
              </span>
            ) : null}
          </div>
        </div>

        <div className="mt-10 grid gap-14 lg:grid-cols-12">
          {/* Form */}
          <div className="lg:col-span-7">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Honeypot: hidden from humans, irresistible to bots */}
              <div className="absolute -left-[9999px] top-auto" aria-hidden="true">
                <label htmlFor="company_website">Company website</label>
                <input type="text" id="company_website" name="company_website" tabIndex={-1} autoComplete="off" />
              </div>

              <div className="grid gap-8 md:grid-cols-2">
                <div>
                  <label htmlFor="name" className={labelClass}>Full name *</label>
                  <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required autoComplete="name" className={inputClass} placeholder="Your name" />
                </div>
                <div>
                  <label htmlFor="email" className={labelClass}>Work email *</label>
                  <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required autoComplete="email" className={inputClass} placeholder="you@company.com" />
                </div>
              </div>

              <div className="grid gap-8 md:grid-cols-2">
                <div>
                  <label htmlFor="company" className={labelClass}>Company *</label>
                  <input type="text" id="company" name="company" value={formData.company} onChange={handleChange} required autoComplete="organization" className={inputClass} placeholder="Company name" />
                </div>
                <div>
                  <label htmlFor="job_title" className={labelClass}>Job title *</label>
                  <input type="text" id="job_title" name="job_title" value={formData.job_title} onChange={handleChange} required autoComplete="organization-title" className={inputClass} placeholder="What you do there" />
                </div>
              </div>

              <div className="grid gap-8 md:grid-cols-2">
                <div>
                  <label htmlFor="phone" className={labelClass}>Phone</label>
                  <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} autoComplete="tel" className={inputClass} placeholder="+1 (555) 123-4567" />
                </div>
                {/* When the CTA already told us the topic, don't ask again.
                    The chip up top shows it, and clearing it brings this back. */}
                {!label ? (
                  <div>
                    <label htmlFor="reason" className={labelClass}>This is about *</label>
                    <select id="reason" name="reason" value={formData.reason} onChange={handleChange} required className={`${inputClass} appearance-none bg-white`}>
                      {REASON_OPTIONS.map((r) => (
                        <option key={r.value} value={r.value}>{r.label}</option>
                      ))}
                    </select>
                  </div>
                ) : null}
              </div>

              {/* The smart part: one stage question plus a short focus
                  checklist, shown only for project work. */}
              {showProjectQuestions ? (
                <fieldset>
                  <legend className={labelClass}>Where are you in this?</legend>
                  <div className="mt-2 flex flex-wrap gap-2.5">
                    {STAGE_OPTIONS.map((s) => (
                      <button
                        key={s.value}
                        type="button"
                        onClick={() => pickStage(s.value)}
                        aria-pressed={stage === s.value}
                        className={`rounded-full border px-4 py-2 text-[13px] font-medium transition-colors duration-200 ${
                          stage === s.value
                            ? 'border-[#1D4ED8] bg-[#1D4ED8] text-white'
                            : 'border-gray-300 text-gray-700 hover:border-gray-500'
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </fieldset>
              ) : null}

              {showProjectQuestions && focusOptions ? (
                <fieldset>
                  <legend className={labelClass}>What matters most? Pick any.</legend>
                  <div className="mt-2 flex flex-wrap gap-2.5">
                    {focusOptions.map((option) => {
                      const checked = focus.includes(option);
                      return (
                        <button
                          key={option}
                          type="button"
                          onClick={() => toggleFocus(option)}
                          aria-pressed={checked}
                          className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-[13px] font-medium transition-colors duration-200 ${
                            checked
                              ? 'border-[#1D4ED8] bg-blue-50 text-[#1D4ED8]'
                              : 'border-gray-300 text-gray-700 hover:border-gray-500'
                          }`}
                        >
                          {checked ? <Check size={13} strokeWidth={3} /> : null}
                          {option}
                        </button>
                      );
                    })}
                  </div>
                </fieldset>
              ) : null}

              <div>
                <label htmlFor="message" className={labelClass}>
                  {structuredAnswered ? 'Anything else we should know?' : 'The situation *'}
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required={!structuredAnswered}
                  rows={structuredAnswered ? 3 : 5}
                  className={`${inputClass} resize-none`}
                  placeholder={
                    structuredAnswered
                      ? 'Optional. Timelines, constraints, systems involved.'
                      : label
                        ? `Where does the ${label} work stand today, and what do you want running?`
                        : 'What are you building, what is in the way, and when does it need to work?'
                  }
                />
              </div>

              {error ? (
                <p className="border-l-2 border-red-400 pl-4 text-sm text-red-600">{error}</p>
              ) : null}

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 rounded-full bg-[#1D4ED8] px-8 py-3.5 text-[15px] font-semibold text-white transition-colors duration-300 hover:bg-black disabled:opacity-60"
              >
                {isSubmitting ? 'Sending...' : 'Send it'}
                <ArrowUpRight size={16} aria-hidden="true" />
              </button>
            </form>
          </div>

          {/* Context rail: proof relevant to the intent, then the facts */}
          <aside className="lg:col-span-5">
            <Link
              href={proof.href}
              className="group block overflow-hidden rounded-3xl bg-[#0b1220] p-8 ring-1 ring-white/10 transition-all duration-300 hover:ring-white/25"
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/60">
                {label ? `Relevant work: ${label}` : 'The work speaks first'}
              </p>
              {proof.metric ? (
                <p className={`mt-5 text-5xl font-bold leading-none text-[#84CC16] ${v4Display}`}>{proof.metric}</p>
              ) : null}
              {proof.metricLabel ? (
                <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/60">{proof.metricLabel}</p>
              ) : null}
              <p className="mt-4 text-sm leading-relaxed text-white/80">{proof.title}</p>
              <span className="mt-5 inline-flex items-center gap-1 text-xs font-semibold text-[#84CC16]">
                Read the case study
                <ArrowUpRight size={14} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </Link>

            <div className="mt-8 space-y-4 border-t border-gray-200 pt-8">
              {[
                'Read by the team that would do the work',
                'A 30-minute technical conversation, on your stack',
                'A straight answer if we are the wrong fit',
              ].map((line) => (
                <p key={line} className="flex items-start gap-3 text-sm leading-relaxed text-gray-700">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#1D4ED8]">
                    <Check size={12} strokeWidth={3} className="text-white" />
                  </span>
                  {line}
                </p>
              ))}
            </div>

            {/* NAP: keep the visible entity facts search engines cross-check */}
            <div className="mt-8 border-t border-gray-200 pt-8 text-sm leading-relaxed text-gray-600">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">Headquarters</p>
              <p className="mt-2">
                220 Davidson Ave, 2nd Floor, Suite 209
                <br />
                Somerset, NJ 08873, United States
              </p>
              <p className="mt-4">
                <a href="mailto:insights@aciinfotech.com" className="font-semibold text-blue-700">insights@aciinfotech.com</a>
              </p>
              <p className="mt-4 text-xs text-gray-500">Replies within 24 business hours. 24/7 support for existing clients.</p>
            </div>
          </aside>
        </div>
      </div>

      {/* All 11 offices on the map */}
      <GlobalOfficesBand />
    </>
  );
}

export default function ContactPage() {
  return (
    <div className={`bg-white text-black ${v4Sans}`}>
      <Suspense fallback={<div className="mx-auto h-96 max-w-7xl animate-pulse px-6 py-16" />}>
        <ContactExperience />
      </Suspense>
    </div>
  );
}
