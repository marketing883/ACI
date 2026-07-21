'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import {
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Calendar,
  MapPin,
  Gift,
  Glasses,
  Loader2,
  Shield,
  Bot,
  Cloud,
  Database,
  Workflow,
  Layers,
  Store,
  Landmark,
  Sparkles,
  Users,
  Clock,
  Download,
} from 'lucide-react';
import { trackFormSubmission, trackEvent } from '@/components/analytics/GoogleTagManager';
import { isWorkEmail } from '@/lib/lp-dropdown-options';

const EVENT_START = new Date('2026-07-31T09:00:00+05:30');

// Countdown to the event, rendered only after mount to avoid a
// hydration mismatch between server and client clocks.
function useCountdown(target: Date) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const update = () => setNow(new Date());
    const raf = requestAnimationFrame(update);
    const timer = setInterval(update, 1000);
    return () => {
      cancelAnimationFrame(raf);
      clearInterval(timer);
    };
  }, []);

  if (!now) return null;

  const diff = Math.max(0, target.getTime() - now.getTime());
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
  };
}

// Intersection observer hook for scroll animations
function useInView(threshold: number = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isInView };
}

// The two questions that make this form worth filling
const PAIN_POINT_OPTIONS = [
  'Scaling AI beyond pilots',
  'Proving ROI on AI spend',
  'Data quality and governance',
  'Cybersecurity and digital trust',
  'AI risk and compliance',
  'Legacy modernization',
  'Cloud cost control',
  'Something else',
];

const JOURNEY_STAGES = [
  { value: 'exploring', label: 'Exploring', desc: 'Evaluating, nothing live yet' },
  { value: 'piloting', label: 'Piloting', desc: 'A few POCs in flight' },
  { value: 'scaling', label: 'Scaling', desc: 'AI in production, growing it' },
  { value: 'optimizing', label: 'Optimizing', desc: 'Mature, tuning cost and risk' },
];

// Speakers from the event creative. Rajiv has no photo in the repo yet,
// so his card falls back to an initials avatar until one lands in
// /public/images/about-team/.
const SPEAKERS = [
  {
    name: 'Prakash Hingorani',
    title: 'Global Chief Revenue Officer',
    photo: '/images/about-team/Prakash.webp',
    initials: 'PH',
  },
  {
    name: 'Rajiv Kumar Pandey',
    title: 'VP, Global Presales and Delivery Solutions',
    photo: null,
    initials: 'RK',
  },
  {
    name: 'Amit Khare',
    title: 'AVP, Business, India and APAC',
    photo: '/images/about-team/Amit-K.webp',
    initials: 'AK',
  },
];

const CAPABILITIES = [
  { icon: Sparkles, title: 'Enterprise AI and GenAI' },
  { icon: Bot, title: 'AI Agents and Intelligent Automation' },
  { icon: Cloud, title: 'Cloud and Data Modernization' },
  { icon: Shield, title: 'Cybersecurity and Digital Trust' },
  { icon: Database, title: 'Data Engineering and Analytics' },
  { icon: Layers, title: 'Enterprise Applications' },
  { icon: Store, title: 'Retail and Banking Transformation' },
  { icon: Workflow, title: 'Industry AI Accelerators' },
];

const STORIES = [
  {
    key: 'cstore',
    tab: 'C-Store',
    icon: Store,
    title: 'AI-powered store intelligence',
    body: 'A leading convenience store chain now forecasts demand, cuts stock-outs, and personalizes offers with AI and real-time operational dashboards.',
    chips: ['Predictive Analytics', 'Inventory Optimization', 'Customer Insights', 'Real-time Reporting'],
  },
  {
    key: 'fashion',
    tab: 'Fashion',
    icon: Sparkles,
    title: 'Omnichannel customer experience',
    body: 'A global fashion retailer unified online and in-store journeys with AI-driven recommendations, merchandising analytics, and customer segmentation.',
    chips: ['Personalization Engine', 'Customer 360', 'Demand Forecasting', 'Omnichannel Analytics'],
  },
  {
    key: 'retail',
    tab: 'Retail',
    icon: Layers,
    title: 'Intelligent retail transformation',
    body: 'We wired cloud, AI, and data platforms into one stack, sharpening pricing, supply chain visibility, and executive decision-making.',
    chips: ['Retail Analytics', 'Supply Chain Intelligence', 'Pricing Optimization', 'Executive Dashboards'],
  },
  {
    key: 'bfsi',
    tab: 'Banking',
    icon: Landmark,
    title: 'Secure, intelligent banking',
    body: 'Financial institutions moved faster on fraud detection, risk analytics, compliance, and secure cloud modernization with our AI stack.',
    chips: ['Fraud Detection', 'Risk and Compliance', 'Intelligent Automation', 'AI Customer Service'],
  },
];

const DRAW_STEPS = [
  {
    number: '01',
    title: 'Register on this page',
    desc: 'Two minutes, two steps. That puts you in the draw pool.',
  },
  {
    number: '02',
    title: 'Visit our booth on 31 July',
    desc: 'Say hello to the team. That activates your entry.',
  },
  {
    number: '03',
    title: 'Win at the live draw',
    desc: 'One winner, picked live at the event. On the spot prizes run all day.',
  },
];

// .ics file so the date survives the CXO calendar
const ICS_CONTENT = [
  'BEGIN:VCALENDAR',
  'VERSION:2.0',
  'PRODID:-//ACI Infotech//AION 2026//EN',
  'BEGIN:VEVENT',
  'UID:aion2026-digital-trust-summit@aciinfotech.com',
  'DTSTAMP:20260721T000000Z',
  'DTSTART:20260731T033000Z',
  'DTEND:20260731T123000Z',
  'SUMMARY:National Digital Trust Summit - AION 2026 (ACI Infotech)',
  'LOCATION:Taj Yeshwantpur\\, Bengaluru',
  'DESCRIPTION:Meet ACI Infotech at AION 2026. Visit the booth to activate your lucky draw entry.',
  'END:VEVENT',
  'END:VCALENDAR',
].join('\r\n');

const ICS_HREF = `data:text/calendar;charset=utf-8,${encodeURIComponent(ICS_CONTENT)}`;

export default function DigitalTrustSummitPage() {
  const [step, setStep] = useState<1 | 2>(1);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    companyName: '',
    jobTitle: '',
  });
  const [painPoints, setPainPoints] = useState<string[]>([]);
  const [painPointOther, setPainPointOther] = useState('');
  const [journeyStage, setJourneyStage] = useState('');
  const [wantsExpertMeeting, setWantsExpertMeeting] = useState(false);
  const [utm, setUtm] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeStory, setActiveStory] = useState(0);

  const countdown = useCountdown(EVENT_START);

  const expertsRef = useInView(0.2);
  const capRef = useInView(0.2);
  const storyRef = useInView(0.2);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const captured: Record<string, string> = {};
    for (const key of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term']) {
      const value = params.get(key);
      if (value) captured[key] = value;
    }
    setUtm(captured);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const togglePainPoint = (option: string) => {
    setPainPoints((prev) =>
      prev.includes(option) ? prev.filter((p) => p !== option) : [...prev, option]
    );
  };

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isWorkEmail(formData.email)) {
      setError('Please use your work email address.');
      return;
    }

    trackEvent('lp_form_step', {
      landing_page: 'digital_trust_summit_2026',
      step: 1,
    });
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (painPoints.length === 0) {
      setError('Pick at least one challenge. That is what powers the draw.');
      return;
    }
    if (!journeyStage) {
      setError('Tell us where you are on the AI journey.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/event-leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          painPoints,
          painPointOther: painPoints.includes('Something else') ? painPointOther : '',
          journeyStage,
          wantsExpertMeeting,
          utmSource: utm.utm_source,
          utmMedium: utm.utm_medium,
          utmCampaign: utm.utm_campaign,
          utmContent: utm.utm_content,
          utmTerm: utm.utm_term,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit form');
      }

      trackFormSubmission('event_registration', 'lp_digital_trust_summit_2026', {
        company: formData.companyName || 'Not provided',
      });
      trackEvent('lp_conversion', {
        landing_page: 'digital_trust_summit_2026',
        form_location: 'hero',
      });

      setAlreadyRegistered(Boolean(result.alreadyRegistered));
      setIsSubmitted(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Something went wrong. Please try again or write to us at info@aciinfotech.com.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollToForm = () => {
    document.getElementById('register')?.scrollIntoView({ behavior: 'smooth' });
  };

  const inputClass =
    'w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0052CC] focus:border-transparent transition-all';

  return (
    <main className="overflow-hidden">
      {/* ============================================
          HERO + FORM (the whole point of the page)
          ============================================ */}
      <section id="register" className="relative min-h-screen pt-16 pb-24 flex items-center">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0A1628] via-[#0f2744] to-[#0A1628]" />
        <div className="absolute top-20 left-10 w-96 h-96 bg-[#0078D4]/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-[#C4FF61]/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-[#0052CC]/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          {/* Co-brand strip */}
          <div className="flex flex-wrap items-center justify-center lg:justify-between gap-4 py-6 mb-8 border-b border-white/10">
            <Image
              src="/aci-infotech-logo-white.png"
              alt="ACI Infotech"
              width={150}
              height={40}
              className="h-8 w-auto"
              priority
            />
            <div className="flex items-center gap-4 text-white/70 text-xs sm:text-sm">
              <span>In association with CXO Elite Forum</span>
              <span className="hidden sm:inline text-white/30">|</span>
              <span className="hidden sm:inline">National Cyber Security Standards</span>
            </div>
            <Image
              src="/images/arqai/arq-ai-logo-white.svg"
              alt="ArqAI"
              width={100}
              height={32}
              className="h-7 w-auto"
            />
          </div>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            {/* Left: the pitch */}
            <div className="text-center lg:text-left lg:pt-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm text-white/90 mb-6 border border-white/10">
                <Shield className="w-4 h-4 text-[#C4FF61]" />
                <span>National Digital Trust Summit, AION 2026</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                AI, Data and
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C4FF61] to-[#00A4EF]">
                  Digital Trust.
                </span>
                <br />
                One room. One day.
              </h1>

              <p className="text-xl text-gray-300 mb-8 leading-relaxed max-w-xl mx-auto lg:mx-0">
                Meet the ACI Infotech team in Bengaluru. Talk AI risk, cyber resilience,
                and data security with people who build this for a living. Register below
                and you are in the lucky draw for Ray-Ban Meta smart&nbsp;glasses.
              </p>

              {/* Date / venue chips */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-3 mb-8">
                <div className="flex items-center gap-2 px-4 py-2.5 bg-white/10 rounded-xl border border-white/10 text-white">
                  <Calendar className="w-5 h-5 text-[#C4FF61]" />
                  <span className="font-semibold">Friday, 31 July 2026</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2.5 bg-white/10 rounded-xl border border-white/10 text-white">
                  <MapPin className="w-5 h-5 text-[#C4FF61]" />
                  <span className="font-semibold">Taj Yeshwantpur, Bengaluru</span>
                </div>
              </div>

              {/* Countdown */}
              <div className="mb-8 h-20">
                {countdown && (
                  <div className="inline-flex gap-3">
                    {[
                      { value: countdown.days, label: 'Days' },
                      { value: countdown.hours, label: 'Hours' },
                      { value: countdown.minutes, label: 'Mins' },
                      { value: countdown.seconds, label: 'Secs' },
                    ].map((unit) => (
                      <div
                        key={unit.label}
                        className="w-16 sm:w-20 py-3 bg-white/5 border border-white/10 rounded-xl text-center"
                      >
                        <div className="text-2xl sm:text-3xl font-bold text-[#C4FF61] tabular-nums">
                          {String(unit.value).padStart(2, '0')}
                        </div>
                        <div className="text-[11px] uppercase tracking-wider text-white/60">{unit.label}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Trust indicators */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-6 text-gray-400 text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-[#C4FF61]" />
                  <span>Two minute form</span>
                </div>
                <div className="flex items-center gap-2">
                  <Gift className="w-5 h-5 text-[#C4FF61]" />
                  <span>Lucky draw entry included</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#C4FF61]" />
                  <span>1:1 with our leaders</span>
                </div>
              </div>
            </div>

            {/* Right: the form */}
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-[#0078D4]/30 to-[#C4FF61]/20 rounded-3xl blur-2xl" />

              <div className="relative bg-white rounded-2xl p-6 sm:p-8 shadow-2xl">
                {isSubmitted ? (
                  <div className="text-center py-8">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle2 className="w-10 h-10 text-green-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                      {alreadyRegistered ? 'You were already in the draw.' : 'You are in the draw.'}
                    </h3>
                    <p className="text-gray-600 mb-2">
                      See you at the booth on 31 July. The winner is picked live at the event,
                      so be in the room.
                    </p>
                    <p className="text-sm text-gray-500 mb-6">
                      A confirmation email is on its way to your inbox.
                    </p>
                    <a
                      href={ICS_HREF}
                      download="aion-2026-aci-infotech.ics"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-[#0A1628] text-white font-semibold rounded-xl hover:bg-[#0f2744] transition-all"
                    >
                      <Download className="w-5 h-5" />
                      Add 31 July to my calendar
                    </a>
                  </div>
                ) : (
                  <>
                    <div className="text-center mb-6">
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        Register and enter the draw
                      </h2>
                      <p className="text-gray-600">
                        Two quick steps. Done in under two minutes.
                      </p>
                      {/* Step indicator */}
                      <div className="flex items-center justify-center gap-2 mt-4">
                        <div className={`h-1.5 w-16 rounded-full ${step === 1 ? 'bg-[#0052CC]' : 'bg-[#C4FF61]'}`} />
                        <div className={`h-1.5 w-16 rounded-full ${step === 2 ? 'bg-[#0052CC]' : 'bg-gray-200'}`} />
                      </div>
                    </div>

                    {step === 1 ? (
                      <form onSubmit={handleContinue} className="space-y-4">
                        <div>
                          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                            Full Name *
                          </label>
                          <input
                            type="text"
                            id="fullName"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            required
                            className={inputClass}
                            placeholder="Your name"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                              Work Email *
                            </label>
                            <input
                              type="email"
                              id="email"
                              name="email"
                              value={formData.email}
                              onChange={handleChange}
                              required
                              className={inputClass}
                              placeholder="you@company.com"
                            />
                          </div>
                          <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                              Mobile *
                            </label>
                            <input
                              type="tel"
                              id="phone"
                              name="phone"
                              value={formData.phone}
                              onChange={handleChange}
                              required
                              className={inputClass}
                              placeholder="+91 98xxx xxxxx"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">
                              Company *
                            </label>
                            <input
                              type="text"
                              id="companyName"
                              name="companyName"
                              value={formData.companyName}
                              onChange={handleChange}
                              required
                              className={inputClass}
                              placeholder="Company name"
                            />
                          </div>
                          <div>
                            <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700 mb-1">
                              Designation *
                            </label>
                            <input
                              type="text"
                              id="jobTitle"
                              name="jobTitle"
                              value={formData.jobTitle}
                              onChange={handleChange}
                              required
                              className={inputClass}
                              placeholder="CIO, CISO, VP Engineering..."
                            />
                          </div>
                        </div>

                        {error && (
                          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                            {error}
                          </div>
                        )}

                        <button
                          type="submit"
                          className="w-full py-4 bg-[#0052CC] hover:bg-[#003d99] text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2 group"
                        >
                          Continue
                          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>

                        <p className="text-xs text-gray-500 text-center">
                          Your details stay with ACI Infotech. No spam.
                        </p>
                      </form>
                    ) : (
                      <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                          <p className="block text-sm font-medium text-gray-700 mb-2">
                            What is eating your roadmap right now? * <span className="font-normal text-gray-400">(pick any)</span>
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {PAIN_POINT_OPTIONS.map((option) => {
                              const selected = painPoints.includes(option);
                              return (
                                <button
                                  key={option}
                                  type="button"
                                  onClick={() => togglePainPoint(option)}
                                  className={`px-3.5 py-2 rounded-full text-sm font-medium border transition-all ${
                                    selected
                                      ? 'bg-[#0052CC] text-white border-[#0052CC]'
                                      : 'bg-white text-gray-700 border-gray-300 hover:border-[#0052CC]'
                                  }`}
                                >
                                  {option}
                                </button>
                              );
                            })}
                          </div>
                          {painPoints.includes('Something else') && (
                            <input
                              type="text"
                              value={painPointOther}
                              onChange={(e) => setPainPointOther(e.target.value)}
                              className={`${inputClass} mt-3`}
                              placeholder="Tell us in a line"
                              maxLength={200}
                            />
                          )}
                        </div>

                        <div>
                          <p className="block text-sm font-medium text-gray-700 mb-2">
                            Where are you on the AI journey? *
                          </p>
                          <div className="grid grid-cols-2 gap-2">
                            {JOURNEY_STAGES.map((stage) => (
                              <button
                                key={stage.value}
                                type="button"
                                onClick={() => setJourneyStage(stage.value)}
                                className={`p-3 rounded-xl border text-left transition-all ${
                                  journeyStage === stage.value
                                    ? 'bg-[#0052CC]/5 border-[#0052CC] ring-1 ring-[#0052CC]'
                                    : 'bg-white border-gray-200 hover:border-[#0052CC]'
                                }`}
                              >
                                <span className="block text-sm font-semibold text-gray-900">{stage.label}</span>
                                <span className="block text-xs text-gray-500 mt-0.5">{stage.desc}</span>
                              </button>
                            ))}
                          </div>
                        </div>

                        <label className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer">
                          <input
                            type="checkbox"
                            checked={wantsExpertMeeting}
                            onChange={(e) => setWantsExpertMeeting(e.target.checked)}
                            className="mt-0.5 w-4 h-4 accent-[#0052CC]"
                          />
                          <span className="text-sm text-gray-700">
                            Book me a 1:1 with an ACI leader at the event
                          </span>
                        </label>

                        {error && (
                          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                            {error}
                          </div>
                        )}

                        <div className="flex gap-3">
                          <button
                            type="button"
                            onClick={() => setStep(1)}
                            className="px-4 py-4 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition-all"
                            aria-label="Back to step 1"
                          >
                            <ArrowLeft className="w-5 h-5" />
                          </button>
                          <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 py-4 bg-[#0052CC] hover:bg-[#003d99] text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 group"
                          >
                            {isSubmitting ? (
                              <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Submitting...
                              </>
                            ) : (
                              <>
                                Count me in
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                              </>
                            )}
                          </button>
                        </div>

                        <p className="text-xs text-gray-500 text-center">
                          By registering you agree to our{' '}
                          <a href="/privacy-policy" className="underline hover:text-gray-700">Privacy Policy</a>{' '}
                          and to hear from us about the event. Draw winner must be present at the venue.
                        </p>
                      </form>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          PRIZE / LUCKY DRAW
          ============================================ */}
      <section className="py-24 bg-[#0A1628] relative overflow-hidden border-t border-white/5">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#C4FF61]/10 rounded-full blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#C4FF61]/10 rounded-full text-sm text-[#C4FF61] mb-6 border border-[#C4FF61]/20">
              <Glasses className="w-4 h-4" />
              <span>The Lucky Draw</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              One of you walks out wearing
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C4FF61] to-[#00A4EF]">
                Ray-Ban Meta smart glasses
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Plus on the spot prizes through the day. Here is how it works,
              in the time it takes to read three lines.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {DRAW_STEPS.map((s) => (
              <div
                key={s.number}
                className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center hover:bg-white/10 transition-all"
              >
                <div className="text-4xl font-bold text-[#C4FF61]/40 mb-4">{s.number}</div>
                <h3 className="text-lg font-semibold text-white mb-2">{s.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button
              onClick={scrollToForm}
              className="inline-flex items-center gap-3 px-8 py-4 bg-[#C4FF61] text-[#0A1628] font-bold text-lg rounded-xl hover:bg-[#d4ff85] transition-all shadow-lg group"
            >
              Enter the draw
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* ============================================
          MEET OUR EXPERTS
          ============================================ */}
      <section className="py-24 bg-white" ref={expertsRef.ref}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Meet the team on the floor
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              These are the people running our session on AI risks, cyber resilience,
              and data security. Bring your hardest problem. They collect&nbsp;those.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {SPEAKERS.map((speaker, i) => (
              <div
                key={speaker.name}
                className={`text-center transition-all duration-700 ${
                  expertsRef.isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${i * 150}ms` }}
              >
                <div className="relative w-40 h-40 mx-auto mb-5 rounded-2xl overflow-hidden bg-gradient-to-br from-[#C4FF61] to-[#8fd94a]">
                  {speaker.photo ? (
                    <Image
                      src={speaker.photo}
                      alt={speaker.name}
                      fill
                      className="object-cover object-top"
                      sizes="160px"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-4xl font-bold text-[#0A1628]">{speaker.initials}</span>
                    </div>
                  )}
                </div>
                <h3 className="text-lg font-bold text-gray-900">{speaker.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{speaker.title}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button
              onClick={scrollToForm}
              className="inline-flex items-center gap-2 px-6 py-3 border-2 border-[#0052CC] text-[#0052CC] font-semibold rounded-xl hover:bg-[#0052CC] hover:text-white transition-all"
            >
              Book a 1:1 at the event
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* ============================================
          WHY MEET ACI AT AION 2026
          ============================================ */}
      <section className="py-24 bg-gray-50" ref={capRef.ref}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What we can talk about at the booth
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Eight things we build for enterprises every day. Pick one,
              or bring your own.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {CAPABILITIES.map((cap, i) => (
              <div
                key={cap.title}
                className={`bg-white rounded-2xl p-6 border border-gray-100 hover:border-[#0052CC]/30 hover:shadow-lg transition-all duration-500 ${
                  capRef.isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                }`}
                style={{ transitionDelay: `${i * 75}ms` }}
              >
                <cap.icon className="w-8 h-8 text-[#0052CC] mb-4" />
                <h3 className="font-semibold text-gray-900 text-sm sm:text-base">{cap.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
          INDUSTRY SUCCESS STORIES
          ============================================ */}
      <section className="py-24 bg-white" ref={storyRef.ref}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Work we can show you
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Four industries, four transformations. Ask the team for the
              full story at the booth.
            </p>
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {STORIES.map((story, i) => (
              <button
                key={story.key}
                onClick={() => setActiveStory(i)}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
                  activeStory === i
                    ? 'bg-[#0A1628] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {story.tab}
              </button>
            ))}
          </div>

          {/* Active story card */}
          <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-100 rounded-3xl p-8 sm:p-12 shadow-sm">
            {(() => {
              const story = STORIES[activeStory];
              const StoryIcon = story.icon;
              return (
                <div className="flex flex-col sm:flex-row gap-8 items-start">
                  <div className="w-16 h-16 rounded-2xl bg-[#0052CC]/10 flex items-center justify-center shrink-0">
                    <StoryIcon className="w-8 h-8 text-[#0052CC]" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">{story.title}</h3>
                    <p className="text-gray-600 leading-relaxed mb-6">{story.body}</p>
                    <div className="flex flex-wrap gap-2">
                      {story.chips.map((chip) => (
                        <span
                          key={chip}
                          className="px-3 py-1.5 bg-[#0052CC]/5 text-[#0052CC] text-sm font-medium rounded-full"
                        >
                          {chip}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      </section>

      {/* ============================================
          ABOUT ACI + ARQAI
          ============================================ */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl p-8 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-3">ACI Infotech</h3>
              <p className="text-gray-600 leading-relaxed">
                A global digital transformation and technology consulting company.
                We modernize enterprise operations with AI, cloud, data, cybersecurity,
                automation, and enterprise platforms, from strategy through
                managed&nbsp;services.
              </p>
            </div>
            <div className="bg-[#0A1628] rounded-2xl p-8">
              <div className="mb-3">
                <Image
                  src="/images/arqai/arq-ai-logo-white.svg"
                  alt="ArqAI"
                  width={110}
                  height={36}
                  className="h-8 w-auto"
                />
              </div>
              <p className="text-gray-300 leading-relaxed">
                Our enterprise AI platform. GenAI, intelligent agents, predictive
                analytics, and secure AI, built for organizations that need outcomes
                without cutting corners on trust. See it live at the&nbsp;booth.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          FINAL CTA
          ============================================ */}
      <section className="py-24 bg-gradient-to-br from-[#0052CC] to-[#0078D4] relative overflow-hidden">
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            31 July. Bengaluru. Be&nbsp;there.
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Register now, meet the team at Taj Yeshwantpur, and give those
            Ray-Ban Meta smart glasses a reason to leave with&nbsp;you.
          </p>

          <button
            onClick={scrollToForm}
            className="inline-flex items-center gap-3 px-8 py-4 bg-[#C4FF61] text-[#0A1628] font-bold text-lg rounded-xl hover:bg-[#d4ff85] transition-all shadow-lg hover:shadow-xl group"
          >
            Register and enter the draw
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </button>

          <p className="mt-6 text-blue-200 text-sm">
            Free to register. Two minutes. One pair of very smart glasses.
          </p>
        </div>
      </section>

      {/* Mini footer (LP routes carry no global chrome) */}
      <footer className="py-8 bg-[#0A1628] border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Image
            src="/aci-infotech-logo-white.png"
            alt="ACI Infotech"
            width={130}
            height={34}
            className="h-7 w-auto"
          />
          <div className="flex items-center gap-6 text-sm text-white/50">
            <a href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</a>
            <span>© 2026 ACI Infotech</span>
          </div>
        </div>
      </footer>

      {/* Sticky mobile CTA */}
      {!isSubmitted && (
        <div className="fixed bottom-0 inset-x-0 z-50 p-3 bg-[#0A1628]/95 backdrop-blur-sm border-t border-white/10 lg:hidden">
          <button
            onClick={scrollToForm}
            className="w-full py-3.5 bg-[#C4FF61] text-[#0A1628] font-bold rounded-xl flex items-center justify-center gap-2"
          >
            <Gift className="w-5 h-5" />
            Register and enter the lucky draw
          </button>
        </div>
      )}
    </main>
  );
}
