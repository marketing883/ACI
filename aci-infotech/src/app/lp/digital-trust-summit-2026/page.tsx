'use client';

import { useState, useEffect, useRef, Fragment } from 'react';
import Image from 'next/image';
import { Bricolage_Grotesque } from 'next/font/google';
import {
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  ArrowUpRight,
  ChevronRight,
  Calendar,
  MapPin,
  Gift,
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
  Clock,
  Download,
  Trophy,
} from 'lucide-react';
import { trackFormSubmission, trackEvent } from '@/components/analytics/GoogleTagManager';
import { isWorkEmail } from '@/lib/lp-dropdown-options';

// Characterful display face for headlines; body copy stays on the site stack.
const display = Bricolage_Grotesque({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

const EVENT_START = new Date('2026-07-31T09:00:00+05:30');
const EASE = 'cubic-bezier(0.25,0.1,0.25,1)';

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

// Live Bengaluru clock for the navbar, mount-gated like the countdown.
function useBengaluruTime() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const update = () =>
      setTime(
        new Date().toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
          timeZone: 'Asia/Kolkata',
        })
      );
    const raf = requestAnimationFrame(update);
    const timer = setInterval(update, 1000);
    return () => {
      cancelAnimationFrame(raf);
      clearInterval(timer);
    };
  }, []);

  return time;
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

    // Never let content stay invisible if the observer misfires.
    const fallback = setTimeout(() => setIsInView(true), 2500);

    return () => {
      observer.disconnect();
      clearTimeout(fallback);
    };
  }, [threshold]);

  return { ref, isInView };
}

// Rolling-text CTA: label duplicated in a clipped column, slides -50% on
// hover; the arrow chip rotates from -45deg to 0.
function RollButton({
  label,
  onClick,
  type = 'button',
  variant = 'lime',
  disabled = false,
  className = '',
}: {
  label: string;
  onClick?: () => void;
  type?: 'button' | 'submit';
  variant?: 'lime' | 'ink' | 'white';
  disabled?: boolean;
  className?: string;
}) {
  const shell =
    variant === 'lime'
      ? 'bg-[#C4FF61] text-[#0A1628] hover:bg-[#d2ff85]'
      : variant === 'ink'
        ? 'bg-[#0A1628] text-white hover:bg-[#132139]'
        : 'bg-white text-[#0A1628] hover:bg-gray-100';
  const chip =
    variant === 'lime'
      ? 'bg-[#0A1628] text-[#C4FF61]'
      : variant === 'ink'
        ? 'bg-[#C4FF61] text-[#0A1628]'
        : 'bg-[#0A1628] text-white';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`group inline-flex items-center gap-3 rounded-full pl-6 pr-2 py-2 text-sm font-semibold transition-colors duration-500 disabled:opacity-50 ${shell} ${className}`}
      style={{ transitionTimingFunction: EASE }}
    >
      <span className="flex h-[20px] flex-col overflow-hidden">
        <span
          className="transition-transform duration-500 group-hover:-translate-y-full"
          style={{ transitionTimingFunction: EASE }}
        >
          {label}
        </span>
        <span
          aria-hidden
          className="transition-transform duration-500 group-hover:-translate-y-full"
          style={{ transitionTimingFunction: EASE }}
        >
          {label}
        </span>
      </span>
      <span
        className={`flex h-8 w-8 items-center justify-center rounded-full transition-transform duration-500 group-hover:rotate-45 ${chip}`}
        style={{ transitionTimingFunction: EASE }}
      >
        <ArrowUpRight className="h-4 w-4 rotate-45 transition-transform duration-500" style={{ transitionTimingFunction: EASE }} />
      </span>
    </button>
  );
}

// Section eyebrow: a lime-dotted pill label, the section wayfinding
// device. No step number, just the label.
function SectionBadge({ label, dark = false }: { label: string; dark?: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-2.5 rounded-full border px-4 py-1.5 text-[13px] font-medium ${
        dark ? 'border-white/20 text-white/80' : 'border-gray-300 text-gray-700'
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${dark ? 'bg-[#C4FF61]' : 'bg-[#0052CC]'}`} aria-hidden />
      {label}
    </span>
  );
}

// Starburst mark for the association badge (compass/star shape).
function Starburst({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className={className} fill="currentColor" aria-hidden>
      <path d="m19.6 66.5 19.7-11 .3-1-.3-.5h-1l-3.3-.2-11.2-.3L14 53l-9.5-.5-2.4-.5L0 49l.2-1.5 2-1.3 2.9.2 6.3.5 9.5.6 6.9.4L38 49.1h1.6l.2-.7-.5-.4-.4-.4L29 41l-10.6-7-5.6-4.1-3-2-1.5-2-.6-4.2 2.7-3 3.7.3.9.2 3.7 2.9 8 6.1L37 36l1.5 1.2.6-.4.1-.3-.7-1.1L33 25l-6-10.4-2.7-4.3-.7-2.6c-.3-1-.4-2-.4-3l3-4.2L28 0l4.2.6L33.8 2l2.6 6 4.1 9.3L47 29.9l2 3.8 1 3.4.3 1h.7v-.5l.5-7.2 1-8.7 1-11.2.3-3.2 1.6-3.8 3-2L61 2.6l2 2.9-.3 1.8-1.1 7.7L59 27.1l-1.5 8.2h.9l1-1.1 4.1-5.4 6.9-8.6 3-3.5L77 13l2.3-1.8h4.3l3.1 4.7-1.4 4.9-4.4 5.6-3.7 4.7-5.3 7.1-3.2 5.7.3.4h.7l12-2.6 6.4-1.1 7.6-1.3 3.5 1.6.4 1.6-1.4 3.4-8.2 2-9.6 2-14.3 3.3-.2.1.2.3 6.4.6 2.8.2h6.8l12.6 1 3.3 2 1.9 2.7-.3 2-5.1 2.6-6.8-1.6-16-3.8-5.4-1.3h-.8v.4l4.6 4.5 8.3 7.5L89 80.1l.5 2.4-1.3 2-1.4-.2-9.2-7-3.6-3-8-6.8h-.5v.7l1.8 2.7 9.8 14.7.5 4.5-.7 1.4-2.6 1-2.7-.6-5.8-8-6-9-4.7-8.2-.5.4-2.9 30.2-1.3 1.5-3 1.2-2.5-2-1.4-3 1.4-6.2 1.6-8 1.3-6.4 1.2-7.9.7-2.6v-.2H49L43 72l-9 12.3-7.2 7.6-1.7.7-3-1.5.3-2.8L24 86l10-12.8 6-7.9 4-4.6-.1-.5h-.3L17.2 77.4l-4.7.6-2-2 .2-3 1-1 8-5.5Z" />
    </svg>
  );
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

// Capabilities as a trust-wrapped stack, echoing the homepage
// "What We Build" architecture but lighter: three tiers of nodes, all
// held inside the Cybersecurity and Digital Trust frame.
const CAPABILITY_TIERS = [
  {
    label: 'Foundation',
    items: [
      { icon: Cloud, title: 'Cloud and Data Modernization', desc: 'Re-architected cloud, not lift and shift.' },
      { icon: Database, title: 'Data Engineering and Analytics', desc: 'Governed pipelines that feed the AI.' },
      { icon: Layers, title: 'Enterprise Applications', desc: 'SAP, Oracle, and Dynamics, wired to run.' },
    ],
  },
  {
    label: 'Intelligence',
    items: [
      { icon: Sparkles, title: 'Enterprise AI and GenAI', desc: 'GenAI copilots, live in production.' },
      { icon: Bot, title: 'AI Agents and Automation', desc: 'Agents that clear the busywork.' },
    ],
  },
  {
    label: 'Industry',
    items: [
      { icon: Store, title: 'Retail and Banking', desc: 'Stacks built for shelves and vaults.' },
      { icon: Workflow, title: 'Industry AI Accelerators', desc: 'Pre-built starts that save months.' },
    ],
  },
];

const STORIES = [
  {
    key: 'cstore',
    tab: 'C-Store',
    icon: Store,
    image: '/images/v4/case-retail.jpg',
    title: 'AI-powered store intelligence',
    body: 'A leading convenience store chain now forecasts demand, cuts stock-outs, and personalizes offers with AI and real-time operational dashboards.',
    chips: ['Predictive Analytics', 'Inventory Optimization', 'Customer Insights', 'Real-time Reporting'],
  },
  {
    key: 'fashion',
    tab: 'Fashion',
    icon: Sparkles,
    image: '/images/v4/ind-retail.jpg',
    title: 'Omnichannel customer experience',
    body: 'A global fashion retailer unified online and in-store journeys with AI-driven recommendations, merchandising analytics, and customer segmentation.',
    chips: ['Personalization Engine', 'Customer 360', 'Demand Forecasting', 'Omnichannel Analytics'],
  },
  {
    key: 'retail',
    tab: 'Retail',
    icon: Layers,
    image: '/images/preview-bg/case-retail.jpg',
    title: 'Intelligent retail transformation',
    body: 'We wired cloud, AI, and data platforms into one stack, sharpening pricing, supply chain visibility, and executive decision-making.',
    chips: ['Retail Analytics', 'Supply Chain Intelligence', 'Pricing Optimization', 'Executive Dashboards'],
  },
  {
    key: 'bfsi',
    tab: 'Banking',
    icon: Landmark,
    image: '/images/v4/case-finance.jpg',
    title: 'Secure, intelligent banking',
    body: 'Financial institutions moved faster on fraud detection, risk analytics, compliance, and secure cloud modernization with our AI stack.',
    chips: ['Fraud Detection', 'Risk and Compliance', 'Intelligent Automation', 'AI Customer Service'],
  },
];

const DRAW_STEPS = [
  { number: '01', title: 'Register on this page', desc: 'Two minutes, two steps. That puts you in the draw pool.' },
  { number: '02', title: 'Visit our booth on 31 July', desc: 'Say hello to the team. That activates your entry.' },
  { number: '03', title: 'Win at the live draw', desc: 'One winner, picked live. On the spot prizes run all day.' },
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

// SVG grain overlay, stays subtle on top of the hero video.
const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E\")";

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
  const bengaluruTime = useBengaluruTime();

  const expertsRef = useInView(0.2);
  const capRef = useInView(0.2);

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
    'w-full px-4 py-3 border border-gray-200 rounded-xl text-[15px] focus:ring-2 focus:ring-[#0052CC] focus:border-transparent transition-all bg-white';

  return (
    <main className={`overflow-hidden bg-[#0A1628] ${display.className}`}>
      {/* ============================================
          HERO: full-bleed wave video, pill nav,
          bottom-anchored headline, form card right
          ============================================ */}
      <section id="register" className="relative flex min-h-screen flex-col">
        {/* Background video + stylized overlay */}
        <div className="absolute inset-0 overflow-hidden">
          <video
            className="h-full w-full object-cover"
            src="/videos/aion-2026/hero-wave.mp4"
            autoPlay
            muted
            loop
            playsInline
            aria-hidden
          />
          {/* Brand tint + legibility gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#0A1628]/80 via-[#0A1628]/45 to-[#0A1628]/95" />
          <div className="absolute inset-0 bg-[#0052CC]/20 mix-blend-overlay" />
          {/* Film grain */}
          <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: GRAIN }} />
        </div>

        {/* Pill navbar: both brand marks, prominent, no CTA button */}
        <div className="relative z-20 mx-auto w-full max-w-[1440px] p-3 sm:p-4">
          <nav className="flex items-center justify-between rounded-full bg-white px-5 py-3 shadow-[0_2px_16px_rgba(0,0,0,0.25)] sm:px-6">
            <div className="flex items-center gap-3 sm:gap-5">
              <Image
                src="/aci-infotech-logo.png"
                alt="ACI Infotech"
                width={130}
                height={35}
                className="h-7 w-auto sm:h-8"
                priority
              />
              <span className="h-7 w-px bg-gray-200 sm:h-8" aria-hidden />
              <Image
                src="/images/ArqAI-Logo-no-tagline.png"
                alt="ArqAI"
                width={120}
                height={42}
                className="h-6 w-auto sm:h-7"
                priority
              />
            </div>
            <div className="flex items-center gap-4">
              <span className="hidden items-center gap-2 text-[12px] text-gray-500 xl:flex">
                <Starburst className="h-4 w-4 text-[#0052CC]" />
                In association with CXO Elite Forum and National Cyber Security Standards
              </span>
              <span className="hidden h-6 w-px bg-gray-200 xl:block" aria-hidden />
              <span className="hidden items-center gap-1.5 text-[13px] text-gray-600 md:flex">
                <Clock className="h-3.5 w-3.5" aria-hidden />
                <span className="tabular-nums">{bengaluruTime ?? '--:--'}</span> in Bengaluru
              </span>
            </div>
          </nav>
        </div>

        {/* Hero body */}
        <div className="relative z-10 mx-auto flex w-full max-w-[1440px] flex-1 flex-col justify-end gap-10 px-5 pb-12 pt-8 sm:px-8 lg:flex-row lg:items-end lg:justify-between lg:gap-16 lg:px-12 lg:pb-16">
          {/* Left: bottom-anchored pitch */}
          <div className="max-w-2xl">
            <p className="mb-5 flex items-center gap-2 text-[13px] tracking-wide text-white/80 sm:mb-7">
              <Shield className="h-4 w-4 text-[#C4FF61]" aria-hidden />
              National Digital Trust Summit, AION 2026
            </p>
            <h1
              className="font-medium leading-[1.05] tracking-[-0.03em] text-white"
              style={{ fontSize: 'clamp(2.4rem, 6vw, 4.6rem)' }}
            >
              AI, data and
              <br />
              <span className="text-[#C4FF61]">digital trust.</span>
              <br />
              One room. One day.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-white/75 sm:text-lg">
              Meet the ACI Infotech team in Bengaluru. Talk AI risk, cyber resilience, and
              data security with the people who build this for a&nbsp;living.
            </p>

            {/* Date / venue chips */}
            <div className="mt-7 flex flex-wrap gap-3">
              <span className="flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-[2px]">
                <Calendar className="h-4 w-4 text-[#C4FF61]" aria-hidden />
                Friday, 31 July 2026
              </span>
              <span className="flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-[2px]">
                <MapPin className="h-4 w-4 text-[#C4FF61]" aria-hidden />
                Taj Yeshwantpur, Bengaluru
              </span>
            </div>

            {/* Prize hook: the reason to register, right where we ask.
                The glasses ride into the hero so nobody has to scroll to
                find out what is in it for them. */}
            <div className="mt-8 flex max-w-md items-center gap-4 rounded-3xl border border-white/12 bg-white/[0.06] p-3 pr-6 backdrop-blur-[2px]">
              <div className="relative shrink-0">
                <div className="absolute inset-0 rounded-full bg-[#C4FF61]/25 blur-2xl" aria-hidden />
                <Image
                  src="/images/events/rayban-meta-glasses.png"
                  alt="Ray-Ban Meta smart glasses, the grand prize"
                  width={320}
                  height={160}
                  className="relative w-[140px] animate-[float_7s_ease-in-out_infinite] drop-shadow-[0_16px_28px_rgba(0,0,0,0.5)] sm:w-[160px]"
                />
              </div>
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#C4FF61] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#0A1628]">
                  <Trophy className="h-3 w-3" aria-hidden />
                  Register to win
                </span>
                <p className="mt-2 font-semibold leading-snug text-white">
                  Ray-Ban Meta smart&nbsp;glasses
                </p>
                <p className="mt-0.5 text-[13px] leading-snug text-white/60">
                  One winner, drawn live at our&nbsp;booth.
                </p>
              </div>
            </div>

            {/* Countdown strip */}
            <div className="mt-8 h-16">
              {countdown && (
                <div className="flex items-center gap-5 sm:gap-7">
                  {[
                    { value: countdown.days, label: 'days' },
                    { value: countdown.hours, label: 'hrs' },
                    { value: countdown.minutes, label: 'min' },
                    { value: countdown.seconds, label: 'sec' },
                  ].map((unit, i) => (
                    <div key={unit.label} className="flex items-baseline gap-1.5">
                      <span className={`text-3xl font-semibold tabular-nums sm:text-4xl ${i === 0 ? 'text-[#C4FF61]' : 'text-white'}`}>
                        {String(unit.value).padStart(2, '0')}
                      </span>
                      <span className="text-[11px] uppercase tracking-widest text-white/50">{unit.label}</span>
                    </div>
                  ))}
                  <span className="hidden text-[13px] text-white/50 sm:block">to the live draw</span>
                </div>
              )}
            </div>
          </div>

          {/* Right: the form card */}
          <div className="relative w-full max-w-md shrink-0 lg:w-[420px]">
            <div className="rounded-[28px] bg-white p-6 shadow-[0_24px_80px_rgba(0,0,0,0.45)] sm:p-7">
              {isSubmitted ? (
                <div className="py-6 text-center">
                  <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#C4FF61]">
                    <CheckCircle2 className="h-10 w-10 text-[#0A1628]" aria-hidden />
                  </div>
                  <h3 className="text-2xl font-semibold tracking-tight text-gray-900">
                    {alreadyRegistered ? 'You were already in the draw.' : 'You are in the draw.'}
                  </h3>
                  <p className="mt-3 text-gray-600">
                    See you at the booth on 31 July. The winner is picked live at the event,
                    so be in the room.
                  </p>
                  <p className="mb-6 mt-2 text-sm text-gray-500">
                    A confirmation email is on its way to your inbox.
                  </p>
                  <a
                    href={ICS_HREF}
                    download="aion-2026-aci-infotech.ics"
                    className="inline-flex items-center gap-2 rounded-full bg-[#0A1628] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#132139]"
                  >
                    <Download className="h-4 w-4" aria-hidden />
                    Add 31 July to my calendar
                  </a>
                </div>
              ) : (
                <>
                  <div className="mb-5">
                    <h2 className="text-[22px] font-semibold leading-snug tracking-tight text-gray-900">
                      Register and enter the draw
                    </h2>
                    <p className="mt-1 text-[14px] text-gray-500">
                      Two quick steps. Done in under two minutes.
                    </p>
                    <div className="mt-4 flex items-center gap-2">
                      <div className={`h-1 w-14 rounded-full ${step === 1 ? 'bg-[#0052CC]' : 'bg-[#C4FF61]'}`} />
                      <div className={`h-1 w-14 rounded-full ${step === 2 ? 'bg-[#0052CC]' : 'bg-gray-200'}`} />
                      <span className="ml-auto text-[12px] font-medium text-gray-400">Step {step} of 2</span>
                    </div>
                  </div>

                  {step === 1 ? (
                    <form onSubmit={handleContinue} className="space-y-3.5">
                      <div>
                        <label htmlFor="fullName" className="mb-1 block text-[13px] font-medium text-gray-700">
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

                      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                        <div>
                          <label htmlFor="email" className="mb-1 block text-[13px] font-medium text-gray-700">
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
                          <label htmlFor="phone" className="mb-1 block text-[13px] font-medium text-gray-700">
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

                      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                        <div>
                          <label htmlFor="companyName" className="mb-1 block text-[13px] font-medium text-gray-700">
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
                          <label htmlFor="jobTitle" className="mb-1 block text-[13px] font-medium text-gray-700">
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
                        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                          {error}
                        </div>
                      )}

                      <button
                        type="submit"
                        className="group flex w-full items-center justify-center gap-2 rounded-full bg-[#0052CC] py-3.5 text-sm font-semibold text-white transition-colors duration-500 hover:bg-[#003d99]"
                        style={{ transitionTimingFunction: EASE }}
                      >
                        Continue
                        <ArrowRight
                          className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1"
                          style={{ transitionTimingFunction: EASE }}
                          aria-hidden
                        />
                      </button>

                      <p className="text-center text-xs text-gray-500">
                        Your details stay with ACI Infotech. No spam.
                      </p>
                    </form>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <p className="mb-2 block text-[13px] font-medium text-gray-700">
                          What is eating your roadmap right now? * <span className="font-normal text-gray-400">(pick any)</span>
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {PAIN_POINT_OPTIONS.map((option) => {
                            const selected = painPoints.includes(option);
                            return (
                              <button
                                key={option}
                                type="button"
                                onClick={() => togglePainPoint(option)}
                                className={`rounded-full border px-3 py-1.5 text-[13px] font-medium transition-all duration-300 ${
                                  selected
                                    ? 'border-[#0A1628] bg-[#0A1628] text-[#C4FF61]'
                                    : 'border-gray-300 bg-white text-gray-700 hover:border-[#0A1628]'
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
                        <p className="mb-2 block text-[13px] font-medium text-gray-700">
                          Where are you on the AI journey? *
                        </p>
                        <div className="grid grid-cols-2 gap-2">
                          {JOURNEY_STAGES.map((stage) => (
                            <button
                              key={stage.value}
                              type="button"
                              onClick={() => setJourneyStage(stage.value)}
                              className={`rounded-xl border p-3 text-left transition-all duration-300 ${
                                journeyStage === stage.value
                                  ? 'border-[#0A1628] bg-[#0A1628]'
                                  : 'border-gray-200 bg-white hover:border-[#0A1628]'
                              }`}
                            >
                              <span className={`block text-sm font-semibold ${journeyStage === stage.value ? 'text-[#C4FF61]' : 'text-gray-900'}`}>
                                {stage.label}
                              </span>
                              <span className={`mt-0.5 block text-xs ${journeyStage === stage.value ? 'text-white/70' : 'text-gray-500'}`}>
                                {stage.desc}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>

                      <label className="flex cursor-pointer items-start gap-3 rounded-xl bg-gray-50 p-3">
                        <input
                          type="checkbox"
                          checked={wantsExpertMeeting}
                          onChange={(e) => setWantsExpertMeeting(e.target.checked)}
                          className="mt-0.5 h-4 w-4 accent-[#0052CC]"
                        />
                        <span className="text-sm text-gray-700">
                          Book me a 1:1 with an ACI leader at the event
                        </span>
                      </label>

                      {error && (
                        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                          {error}
                        </div>
                      )}

                      <div className="flex gap-2.5">
                        <button
                          type="button"
                          onClick={() => setStep(1)}
                          className="rounded-full border border-gray-200 px-4 text-gray-600 transition-colors hover:bg-gray-50"
                          aria-label="Back to step 1"
                        >
                          <ArrowLeft className="h-4 w-4" aria-hidden />
                        </button>
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="group flex flex-1 items-center justify-center gap-2 rounded-full bg-[#0052CC] py-3.5 text-sm font-semibold text-white transition-colors duration-500 hover:bg-[#003d99] disabled:opacity-50"
                          style={{ transitionTimingFunction: EASE }}
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                              Submitting...
                            </>
                          ) : (
                            <>
                              Count me in
                              <ArrowRight
                                className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1"
                                style={{ transitionTimingFunction: EASE }}
                                aria-hidden
                              />
                            </>
                          )}
                        </button>
                      </div>

                      <p className="text-center text-xs leading-relaxed text-gray-500">
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
      </section>

      {/* ============================================
          LUCKY DRAW: promo film as background,
          glasses floating over the copy
          ============================================ */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <video
            className="h-full w-full object-cover"
            src="/videos/aion-2026/draw-promo.mp4"
            autoPlay
            muted
            loop
            playsInline
            aria-hidden
          />
          {/* Heavy ink overlay so the film reads as texture, not content */}
          <div className="absolute inset-0 bg-[#0A1628]/90" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A1628] via-[#0A1628]/60 to-[#0A1628]/30" />
          <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: GRAIN }} />
        </div>

        <div className="relative mx-auto max-w-[1440px] px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
          <SectionBadge label="The lucky draw" dark />

          <div className="mt-8 grid items-center gap-12 lg:grid-cols-2 lg:gap-8">
            <div>
              <h2
                className="font-medium leading-[1.08] tracking-[-0.03em] text-white"
                style={{ fontSize: 'clamp(2rem, 4.4vw, 3.6rem)' }}
              >
                One of you walks out wearing
                <span className="text-[#C4FF61]"> Ray-Ban Meta smart&nbsp;glasses</span>
              </h2>
              <p className="mt-5 max-w-lg text-lg leading-relaxed text-white/70">
                Plus on the spot prizes through the day. Here is how it works, in the time
                it takes to read three lines.
              </p>

              <div className="mt-10 space-y-4">
                {DRAW_STEPS.map((s) => (
                  <div
                    key={s.number}
                    className="flex items-start gap-5 rounded-2xl border border-white/10 bg-white/5 p-5 transition-colors duration-300 hover:border-[#C4FF61]/40"
                  >
                    <span className="text-2xl font-semibold text-[#C4FF61]/60">{s.number}</span>
                    <div>
                      <h3 className="font-semibold text-white">{s.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-white/60">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-10">
                <RollButton label="Enter the draw" variant="lime" onClick={scrollToForm} />
              </div>
            </div>

            {/* The prize, floating */}
            <div className="relative flex items-center justify-center lg:justify-end">
              <div className="absolute h-72 w-72 rounded-full bg-[#C4FF61]/15 blur-[100px] sm:h-96 sm:w-96" aria-hidden />
              <div className="animate-[float_7s_ease-in-out_infinite]">
                <Image
                  src="/images/events/rayban-meta-glasses.png"
                  alt="Ray-Ban Meta smart glasses"
                  width={880}
                  height={440}
                  className="relative w-full max-w-xl drop-shadow-[0_40px_60px_rgba(0,0,0,0.6)]"
                />
              </div>
              <span className="absolute -bottom-2 right-0 rounded-full border border-[#C4FF61]/30 bg-[#0A1628]/80 px-4 py-2 text-[12px] font-medium uppercase tracking-widest text-[#C4FF61] sm:bottom-4">
                The grand prize
              </span>
            </div>
          </div>
        </div>

      </section>

      {/* ============================================
          EXPERTS
          ============================================ */}
      <section className="bg-[#F4F5F3] py-20 lg:py-28" ref={expertsRef.ref}>
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
          <SectionBadge label="Meet the team on the floor" />
          <div className="mt-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <h2
              className="max-w-2xl font-medium leading-[1.1] tracking-[-0.02em] text-gray-900"
              style={{ fontSize: 'clamp(1.7rem, 3.4vw, 3rem)' }}
            >
              The people running our session on AI risk, cyber resilience, and data&nbsp;security.
            </h2>
            <p className="max-w-sm text-[15px] leading-relaxed text-gray-600">
              Bring your hardest problem. They collect those. Ask for a 1:1 in the form and
              we will fix a slot before the event.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-3 lg:mt-16">
            {SPEAKERS.map((speaker, i) => (
              <div
                key={speaker.name}
                className={`group transition-all duration-700 ${
                  expertsRef.isInView ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                }`}
                style={{ transitionDelay: `${i * 150}ms`, transitionTimingFunction: EASE }}
              >
                <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-[#0A1628]">
                  {speaker.photo ? (
                    <Image
                      src={speaker.photo}
                      alt={speaker.name}
                      fill
                      className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.04]"
                      style={{ transitionTimingFunction: EASE }}
                      sizes="(max-width: 640px) 100vw, 33vw"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#0A1628] to-[#13315c]">
                      <span className="text-6xl font-semibold text-[#C4FF61]">{speaker.initials}</span>
                    </div>
                  )}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0A1628]/90 to-transparent p-5 pt-14">
                    <h3 className="text-lg font-semibold text-white">{speaker.name}</h3>
                    <p className="mt-0.5 text-[13px] text-white/70">{speaker.title}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
          CAPABILITIES
          ============================================ */}
      <section className="bg-white py-20 lg:py-28" ref={capRef.ref}>
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
          <SectionBadge label="What we can talk about at the booth" />
          <h2
            className="mt-8 max-w-3xl font-medium leading-[1.1] tracking-[-0.02em] text-gray-900"
            style={{ fontSize: 'clamp(1.7rem, 3.4vw, 3rem)' }}
          >
            Eight things we build for enterprises every day. Pick one, or bring your&nbsp;own.
          </h2>

          {/* Trust-wrapped stack: the homepage "What We Build" architecture,
              lighter. Foundation feeds intelligence feeds industry, and the
              Cybersecurity and Digital Trust frame holds all of it, which is
              the whole point of the summit. */}
          <div className="mt-12 overflow-hidden rounded-[28px] border border-[#0052CC]/20 bg-gradient-to-b from-[#0052CC]/[0.035] to-transparent">
            {/* Wrapper header: the trust frame */}
            <div className="flex flex-col gap-3 border-b border-[#0052CC]/12 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#0052CC]">
                  <Shield className="h-5 w-5 text-[#C4FF61]" aria-hidden />
                </span>
                <div>
                  <h3 className="text-[15px] font-semibold text-[#0A1628]">Cybersecurity and Digital Trust</h3>
                  <p className="text-[13px] text-gray-500">Wraps every layer we build</p>
                </div>
              </div>
              <span className="w-fit rounded-full border border-[#0052CC]/25 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#0052CC]">
                SOC 2 and ISO 27001, from day one
              </span>
            </div>

            {/* Tiers, left to right, with flow arrows between them */}
            <div className="flex flex-col gap-5 p-5 sm:p-6 lg:flex-row lg:items-stretch lg:gap-3">
              {CAPABILITY_TIERS.map((tier, ti) => {
                const startIndex = CAPABILITY_TIERS
                  .slice(0, ti)
                  .reduce((sum, t) => sum + t.items.length, 0);
                return (
                  <Fragment key={tier.label}>
                    <div className="flex-1">
                      <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-400">
                        {tier.label}
                      </p>
                      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                        {tier.items.map((cap, i) => (
                          <div
                            key={cap.title}
                            className={`group flex items-start gap-3 rounded-2xl border border-[#0052CC]/15 bg-white p-4 transition-all duration-500 hover:border-[#0052CC] hover:shadow-[0_10px_28px_rgba(0,82,204,0.14)] ${
                              capRef.isInView ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                            }`}
                            style={{ transitionDelay: `${(startIndex + i) * 70}ms`, transitionTimingFunction: EASE }}
                          >
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#0052CC]/90 transition-colors duration-500 group-hover:bg-[#0A1628]">
                              <cap.icon className="h-[18px] w-[18px] text-[#C4FF61]" aria-hidden />
                            </span>
                            <div>
                              <h4 className="text-[14px] font-semibold leading-tight text-[#0A1628]">{cap.title}</h4>
                              <p className="mt-1 text-[12.5px] leading-snug text-gray-500">{cap.desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    {ti < CAPABILITY_TIERS.length - 1 && (
                      <div className="hidden shrink-0 items-center justify-center pt-8 lg:flex" aria-hidden>
                        <ChevronRight className="h-5 w-5 text-[#0052CC]/40" />
                      </div>
                    )}
                  </Fragment>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          SUCCESS STORIES
          ============================================ */}
      <section className="bg-[#F4F5F3] py-20 lg:py-28">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
          <SectionBadge label="Work we can show you" />
          <div className="mt-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <h2
              className="font-medium leading-[1.1] tracking-[-0.02em] text-gray-900"
              style={{ fontSize: 'clamp(1.7rem, 3.4vw, 3rem)' }}
            >
              Four industries, four transformations.
            </h2>
            {/* Refined segmented control: pills live in a single track,
                each with its sector glyph, the active one filled ink. */}
            <div className="flex flex-wrap gap-1 rounded-full border border-gray-200 bg-white p-1.5">
              {STORIES.map((story, i) => {
                const TabIcon = story.icon;
                const active = activeStory === i;
                return (
                  <button
                    key={story.key}
                    onClick={() => setActiveStory(i)}
                    aria-pressed={active}
                    className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300 ${
                      active
                        ? 'bg-[#0A1628] text-[#C4FF61] shadow-[0_4px_14px_rgba(10,22,40,0.2)]'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <TabIcon className={`h-4 w-4 ${active ? 'text-[#C4FF61]' : 'text-[#0052CC]'}`} aria-hidden />
                    {story.tab}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Featured card: the sector image is the background, held under a
              stylized ink overlay so the story stays legible. Cards crossfade
              as the pills switch. */}
          <div className="relative mt-10 min-h-[520px] overflow-hidden rounded-[28px] bg-[#0A1628] shadow-[0_24px_70px_rgba(10,22,40,0.22)] sm:min-h-[480px]">
            {STORIES.map((story, i) => {
              const StoryIcon = story.icon;
              const active = activeStory === i;
              return (
                <div
                  key={story.key}
                  aria-hidden={!active}
                  className={`absolute inset-0 transition-opacity duration-700 ${
                    active ? 'opacity-100' : 'pointer-events-none opacity-0'
                  }`}
                  style={{ transitionTimingFunction: EASE }}
                >
                  <Image
                    src={story.image}
                    alt=""
                    fill
                    className={`object-cover transition-transform duration-[1200ms] ${active ? 'scale-100' : 'scale-105'}`}
                    style={{ transitionTimingFunction: EASE }}
                    sizes="(max-width: 1024px) 100vw, 1200px"
                  />
                  {/* Stylized overlay: ink from the left for copy legibility,
                      ink from the bottom, a brand tint, and grain. */}
                  <div className="absolute inset-0 bg-gradient-to-r from-[#0A1628] via-[#0A1628]/85 to-[#0A1628]/35" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A1628] via-[#0A1628]/20 to-transparent" />
                  <div className="absolute inset-0 bg-[#0052CC]/15 mix-blend-overlay" />
                  <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: GRAIN }} />

                  <div className="relative flex h-full max-w-2xl flex-col justify-end gap-5 p-8 sm:p-12">
                    <div className="flex items-center gap-3">
                      <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/15 bg-white/10 backdrop-blur-sm">
                        <StoryIcon className="h-6 w-6 text-[#C4FF61]" aria-hidden />
                      </span>
                      <span className="rounded-full border border-white/20 bg-[#0A1628]/40 px-3.5 py-1.5 text-[12px] font-semibold uppercase tracking-wider text-white/85 backdrop-blur-sm">
                        {story.tab}
                      </span>
                    </div>
                    <h3
                      className="font-semibold tracking-tight text-white"
                      style={{ fontSize: 'clamp(1.6rem, 3vw, 2.4rem)' }}
                    >
                      {story.title}
                    </h3>
                    <p className="max-w-xl text-[15px] leading-relaxed text-white/75 sm:text-base">{story.body}</p>
                    <div className="flex flex-wrap gap-2">
                      {story.chips.map((chip) => (
                        <span
                          key={chip}
                          className="rounded-full border border-white/15 bg-white/[0.08] px-3.5 py-1.5 text-[13px] font-medium text-white/85 backdrop-blur-sm"
                        >
                          {chip}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* About strip folded into the same section rhythm */}
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div className="rounded-[28px] bg-white p-8 shadow-[0_2px_24px_rgba(10,22,40,0.06)]">
              <h3 className="text-lg font-semibold tracking-tight text-gray-900">ACI Infotech</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-gray-600">
                A global digital transformation and technology consulting company. We modernize
                enterprise operations with AI, cloud, data, cybersecurity, automation, and
                enterprise platforms, from strategy through managed&nbsp;services.
              </p>
            </div>
            <div className="rounded-[28px] bg-[#0A1628] p-8">
              <Image
                src="/images/arqai/arq-ai-logo-white.svg"
                alt="ArqAI"
                width={110}
                height={36}
                className="h-8 w-auto"
              />
              <p className="mt-3 text-[15px] leading-relaxed text-white/70">
                Our enterprise AI platform. GenAI, intelligent agents, predictive analytics,
                and secure AI, built for organizations that need outcomes without cutting
                corners on trust. See it live at the&nbsp;booth.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          FINAL CTA
          ============================================ */}
      <section className="relative overflow-hidden bg-[#0A1628] py-24 lg:py-32">
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-[#0052CC]/30 blur-[120px]" aria-hidden />
        <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-[#C4FF61]/10 blur-[120px]" aria-hidden />
        <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: GRAIN }} />

        <div className="relative mx-auto max-w-[1440px] px-5 text-center sm:px-8 lg:px-12">
          <div className="mx-auto mb-8 flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/5 py-2 pl-3 pr-4">
            <Starburst className="h-5 w-5 text-[#C4FF61]" />
            <span className="text-[13px] font-medium text-white/80">AION 2026</span>
            <span className="rounded bg-[#C4FF61] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#0A1628]">
              31 July
            </span>
          </div>

          <h2
            className="mx-auto max-w-3xl font-medium leading-[1.08] tracking-[-0.03em] text-white"
            style={{ fontSize: 'clamp(2rem, 5vw, 4rem)' }}
          >
            Bengaluru. One day.
            <br />
            <span className="text-[#C4FF61]">Be&nbsp;there.</span>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-white/70">
            Register now, meet the team at Taj Yeshwantpur, and give those Ray-Ban Meta
            smart glasses a reason to leave with&nbsp;you.
          </p>

          <div className="mt-10 flex justify-center">
            <RollButton label="Register and enter the draw" variant="lime" onClick={scrollToForm} />
          </div>

          <p className="mt-6 text-sm text-white/40">
            Free to register. Two minutes. One pair of very smart glasses.
          </p>
        </div>
      </section>

      {/* Mini footer (LP routes carry no global chrome) */}
      <footer className="border-t border-white/5 bg-[#0A1628] py-8">
        <div className="mx-auto flex max-w-[1440px] flex-col items-center justify-between gap-4 px-5 sm:flex-row sm:px-8 lg:px-12">
          <Image
            src="/aci-infotech-logo-white.png"
            alt="ACI Infotech"
            width={130}
            height={34}
            className="h-7 w-auto"
          />
          <div className="flex items-center gap-6 text-sm text-white/50">
            <a href="/privacy-policy" className="transition-colors hover:text-white">Privacy Policy</a>
            <span>© 2026 ACI Infotech</span>
          </div>
        </div>
      </footer>

      {/* Sticky mobile CTA */}
      {!isSubmitted && (
        <div className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-[#0A1628]/95 p-3 backdrop-blur-sm lg:hidden">
          <button
            onClick={scrollToForm}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-[#C4FF61] py-3.5 font-semibold text-[#0A1628]"
          >
            <Gift className="h-5 w-5" aria-hidden />
            Register and enter the lucky draw
          </button>
        </div>
      )}
    </main>
  );
}
