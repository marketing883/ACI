'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import {
  CheckCircle2,
  ArrowRight,
  Clock,
  Users,
  Target,
  Zap,
  BarChart3,
  Workflow,
  Bot,
  Database,
  Send,
  Loader2,
  ChevronDown,
  AlertTriangle,
  TrendingUp,
  Shield,
  Lightbulb,
  Calendar,
  Award,
  Play,
} from 'lucide-react';
import { trackFormSubmission, trackEvent } from '@/components/analytics/GoogleAnalytics';

// Animated counter hook
function useCountUp(end: number, duration: number = 2000, start: boolean = false) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start) return;

    let startTime: number;
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [end, duration, start]);

  return count;
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

// Pain points data
const painPoints = [
  {
    icon: AlertTriangle,
    title: 'Disconnected Systems',
    description: 'Data trapped in silos. Manual copy-paste between apps. No single source of truth.',
  },
  {
    icon: Clock,
    title: 'Slow Decision Making',
    description: 'Reports take days. Dashboards are stale. Leaders fly blind on critical metrics.',
  },
  {
    icon: Workflow,
    title: 'Manual Processes',
    description: 'Approvals via email chains. Spreadsheet workflows. Human errors everywhere.',
  },
  {
    icon: TrendingUp,
    title: 'Scaling Bottlenecks',
    description: 'What worked for 50 people breaks at 500. Growth outpaces your systems.',
  },
];

// Session deliverables
const deliverables = [
  {
    number: '01',
    title: 'Current State Map',
    description: 'Visual diagram of your existing systems, data flows, and pain points',
    icon: Target,
  },
  {
    number: '02',
    title: '90-Day Roadmap',
    description: 'Prioritized implementation plan with milestones and quick wins',
    icon: Calendar,
  },
  {
    number: '03',
    title: 'Tech Recommendations',
    description: 'Which Dynamics 365 and Power Platform components fit your needs',
    icon: Lightbulb,
  },
  {
    number: '04',
    title: 'Budget Guidance',
    description: 'Realistic cost ranges and ROI projections for your specific case',
    icon: BarChart3,
  },
];

// Capabilities
const capabilities = [
  { icon: Database, title: 'Dynamics 365', desc: 'CRM, ERP, Sales, Service' },
  { icon: BarChart3, title: 'Power BI', desc: 'Dashboards & Analytics' },
  { icon: Zap, title: 'Power Apps', desc: 'Custom Business Apps' },
  { icon: Workflow, title: 'Power Automate', desc: 'Workflow Automation' },
  { icon: Bot, title: 'Copilot', desc: 'AI-Powered Assistance' },
  { icon: Shield, title: 'Dataverse', desc: 'Secure Data Platform' },
];

// Stats
const stats = [
  { value: 150, suffix: '+', label: 'Implementations' },
  { value: 98, suffix: '%', label: 'Client Satisfaction' },
  { value: 40, suffix: '%', label: 'Avg. Efficiency Gain' },
  { value: 12, suffix: '+', label: 'Years Experience' },
];

// FAQ
const faqs = [
  {
    question: 'What happens during the 30-minute session?',
    answer: 'We start by understanding your current challenges and goals. Then we map out your systems landscape, identify quick wins, and outline a realistic 90-day implementation path. You leave with a documented roadmap, not a sales pitch.',
  },
  {
    question: 'Is this really free? What\'s the catch?',
    answer: 'Yes, completely free. No obligation. We believe in earning trust through value. If we\'re a good fit, you\'ll want to work with us. If not, you still walk away with actionable insights.',
  },
  {
    question: 'Who will I be talking to?',
    answer: 'A senior solutions architect with 10+ years of Microsoft platform experience. Not a sales rep, not a junior consultant. Someone who can answer technical questions and provide real guidance.',
  },
  {
    question: 'What if we\'re not ready to implement yet?',
    answer: 'That\'s fine. The roadmap session helps you understand what\'s possible and plan ahead. Many clients use our roadmap for internal budget discussions or to evaluate build vs. buy decisions.',
  },
  {
    question: 'Do you work with companies our size?',
    answer: 'We work with organizations from 50 to 50,000 employees. The Power Platform scales beautifully, and our approach adapts to your complexity and budget.',
  },
];

export default function MSDynamicsRoadmapPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    role: '',
    challenge: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Scroll animation refs
  const statsRef = useInView(0.3);
  const painRef = useInView(0.2);
  const deliverRef = useInView(0.2);
  const capRef = useInView(0.2);

  // Animated counters
  const stat1 = useCountUp(stats[0].value, 2000, statsRef.isInView);
  const stat2 = useCountUp(stats[1].value, 2000, statsRef.isInView);
  const stat3 = useCountUp(stats[2].value, 2000, statsRef.isInView);
  const stat4 = useCountUp(stats[3].value, 2000, statsRef.isInView);
  const statValues = [stat1, stat2, stat3, stat4];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          company: formData.company,
          phone: formData.phone,
          reason: 'power-platform-roadmap',
          message: `Role: ${formData.role}\n\nChallenge/Goal: ${formData.challenge}`,
          source: 'lp_ms_dynamics_roadmap',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit form');
      }

      trackFormSubmission('roadmap_session', 'lp_ms_dynamics', {
        company: formData.company || 'Not provided',
      });

      trackEvent('lp_conversion', {
        landing_page: 'ms_dynamics_roadmap',
        form_location: 'hero',
      });

      setIsSubmitted(true);
    } catch {
      setError('Something went wrong. Please try again or call us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollToForm = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main className="overflow-hidden">
      {/* ============================================
          HERO SECTION
          ============================================ */}
      <section className="relative min-h-screen pt-20 pb-16 flex items-center">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0A1628] via-[#0f2744] to-[#0A1628]" />

        {/* Animated gradient orbs */}
        <div className="absolute top-20 left-10 w-96 h-96 bg-[#0078D4]/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-[#C4FF61]/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-[#0052CC]/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left: Value Proposition */}
            <div className="text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm text-white/90 mb-6 border border-white/10">
                <Award className="w-4 h-4 text-[#C4FF61]" />
                <span>Microsoft Solutions Partner</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Stop Guessing.
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C4FF61] to-[#00A4EF]">
                  Get a Roadmap.
                </span>
              </h1>

              <p className="text-xl text-gray-300 mb-8 leading-relaxed max-w-xl mx-auto lg:mx-0">
                Book a free 30-minute strategy session with our senior architects.
                Walk away with a clear 90-day implementation plan for Microsoft Dynamics & Power Platform.
              </p>

              {/* Trust indicators */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-6 text-gray-400 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#C4FF61]" />
                  <span>No sales pitch</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#C4FF61]" />
                  <span>Senior architects only</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#C4FF61]" />
                  <span>Actionable takeaways</span>
                </div>
              </div>
            </div>

            {/* Right: Form Card */}
            <div className="relative">
              {/* Glow effect behind card */}
              <div className="absolute -inset-4 bg-gradient-to-r from-[#0078D4]/30 to-[#C4FF61]/20 rounded-3xl blur-2xl" />

              <div className="relative bg-white rounded-2xl p-8 shadow-2xl">
                {isSubmitted ? (
                  <div className="text-center py-8">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle2 className="w-10 h-10 text-green-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                      You're All Set!
                    </h3>
                    <p className="text-gray-600 mb-2">
                      A senior architect will reach out within 24 hours to schedule your roadmap session.
                    </p>
                    <p className="text-sm text-gray-500">
                      Check your inbox for a confirmation email.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="text-center mb-6">
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        Book Your Free Session
                      </h2>
                      <p className="text-gray-600">
                        30 minutes. Zero obligation. Real insights.
                      </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                            Name *
                          </label>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0078D4] focus:border-transparent transition-all"
                            placeholder="John Doe"
                          />
                        </div>
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
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0078D4] focus:border-transparent transition-all"
                            placeholder="john@company.com"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                            Company *
                          </label>
                          <input
                            type="text"
                            id="company"
                            name="company"
                            value={formData.company}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0078D4] focus:border-transparent transition-all"
                            placeholder="Company Name"
                          />
                        </div>
                        <div>
                          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                            Phone
                          </label>
                          <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0078D4] focus:border-transparent transition-all"
                            placeholder="+1 (555) 000-0000"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                          Your Role *
                        </label>
                        <select
                          id="role"
                          name="role"
                          value={formData.role}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0078D4] focus:border-transparent transition-all bg-white"
                        >
                          <option value="">Select your role</option>
                          <option value="C-Level / Executive">C-Level / Executive</option>
                          <option value="VP / Director">VP / Director</option>
                          <option value="IT Manager">IT Manager</option>
                          <option value="Business Analyst">Business Analyst</option>
                          <option value="Developer / Architect">Developer / Architect</option>
                          <option value="Operations Manager">Operations Manager</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>

                      <div>
                        <label htmlFor="challenge" className="block text-sm font-medium text-gray-700 mb-1">
                          What's your biggest challenge? *
                        </label>
                        <textarea
                          id="challenge"
                          name="challenge"
                          value={formData.challenge}
                          onChange={handleChange}
                          required
                          rows={3}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0078D4] focus:border-transparent transition-all resize-none"
                          placeholder="e.g., We need to automate our approval workflows and get better visibility into sales pipeline..."
                        />
                      </div>

                      {error && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                          {error}
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-4 bg-[#0052CC] hover:bg-[#003d99] text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 group"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          <>
                            Book My Free Session
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                          </>
                        )}
                      </button>

                      <p className="text-xs text-gray-500 text-center">
                        By submitting, you agree to our Privacy Policy. We'll never spam you.
                      </p>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-8 h-8 text-white/50" />
        </div>
      </section>

      {/* ============================================
          PAIN POINTS SECTION
          ============================================ */}
      <section className="py-24 bg-gray-50 relative overflow-hidden">
        {/* Subtle pattern */}
        <div className="absolute inset-0 opacity-50">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, rgba(0,0,0,0.05) 1px, transparent 0)`,
              backgroundSize: '40px 40px',
            }}
          />
        </div>

        <div
          ref={painRef.ref}
          className={`relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-1000 ${
            painRef.isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Sound Familiar?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              These challenges cost enterprises millions in lost productivity and missed opportunities.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {painPoints.map((point, index) => (
              <div
                key={point.title}
                className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-[#0078D4]/20"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="w-14 h-14 bg-red-50 group-hover:bg-red-100 rounded-2xl flex items-center justify-center mb-4 transition-colors">
                  <point.icon className="w-7 h-7 text-red-500" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{point.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{point.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
          WHAT IF SECTION - Vision of Success
          ============================================ */}
      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Image */}
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-[#0078D4]/10 to-[#C4FF61]/10 rounded-3xl blur-2xl" />
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&q=80&auto=format"
                  alt="Team collaborating with modern technology"
                  width={800}
                  height={600}
                  className="w-full h-auto object-cover"
                />
                {/* Overlay with floating metrics */}
                <div className="absolute bottom-4 left-4 right-4 flex gap-3">
                  <div className="bg-white/95 backdrop-blur-sm rounded-xl px-4 py-3 shadow-lg">
                    <p className="text-2xl font-bold text-[#0078D4]">40%</p>
                    <p className="text-xs text-gray-600">Faster Decisions</p>
                  </div>
                  <div className="bg-white/95 backdrop-blur-sm rounded-xl px-4 py-3 shadow-lg">
                    <p className="text-2xl font-bold text-[#C4FF61]">60%</p>
                    <p className="text-xs text-gray-600">Less Manual Work</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Imagine If Your Systems
                <span className="text-[#0078D4]"> Actually Worked Together</span>
              </h2>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Single Source of Truth</h3>
                    <p className="text-gray-600">All your data unified in Dataverse. No more reconciling spreadsheets or hunting for the "right" version.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Real-Time Visibility</h3>
                    <p className="text-gray-600">Power BI dashboards that update automatically. Make decisions based on what's happening now, not last month.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Automated Workflows</h3>
                    <p className="text-gray-600">Approvals, notifications, and data sync that happen automatically. Your team focuses on high-value work.</p>
                  </div>
                </div>
              </div>

              <button
                onClick={scrollToForm}
                className="mt-8 inline-flex items-center gap-2 px-6 py-3 bg-[#0052CC] text-white font-semibold rounded-xl hover:bg-[#003d99] transition-colors group"
              >
                Get Your Roadmap
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          WHAT YOU GET - Deliverables
          ============================================ */}
      <section className="py-24 bg-[#0A1628] relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#0078D4]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#C4FF61]/5 rounded-full blur-3xl" />

        <div
          ref={deliverRef.ref}
          className={`relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-1000 ${
            deliverRef.isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              What You'll Walk Away With
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              This isn't a discovery call. It's a working session with tangible deliverables.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {deliverables.map((item, index) => (
              <div
                key={item.title}
                className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                {/* Number badge */}
                <div className="absolute -top-3 -left-3 w-10 h-10 bg-[#C4FF61] rounded-xl flex items-center justify-center">
                  <span className="text-[#0A1628] font-bold text-sm">{item.number}</span>
                </div>

                <div className="pt-4">
                  <div className="w-12 h-12 bg-[#0078D4]/20 rounded-xl flex items-center justify-center mb-4">
                    <item.icon className="w-6 h-6 text-[#0078D4]" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                  <p className="text-gray-400 text-sm">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
          HOW IT WORKS
          ============================================ */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Three simple steps to your implementation roadmap.
            </p>
          </div>

          <div className="relative">
            {/* Connection line */}
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#0078D4]/30 to-transparent -translate-y-1/2" />

            <div className="grid lg:grid-cols-3 gap-8">
              {[
                {
                  step: '1',
                  title: 'Book Your Session',
                  description: 'Fill out the form above. We\'ll send you calendar options within 24 hours.',
                  icon: Calendar,
                },
                {
                  step: '2',
                  title: 'Strategy Session',
                  description: '30 minutes with a senior architect. We map your systems, identify pain points, and discuss goals.',
                  icon: Users,
                },
                {
                  step: '3',
                  title: 'Get Your Roadmap',
                  description: 'Walk away with a documented 90-day plan, tech recommendations, and budget guidance.',
                  icon: Target,
                },
              ].map((item, index) => (
                <div key={item.step} className="relative text-center">
                  {/* Step circle */}
                  <div className="relative mx-auto mb-6">
                    <div className="w-20 h-20 bg-[#0078D4] rounded-full flex items-center justify-center mx-auto shadow-lg shadow-[#0078D4]/30">
                      <item.icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-[#C4FF61] rounded-full flex items-center justify-center font-bold text-[#0A1628]">
                      {item.step}
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          CAPABILITIES
          ============================================ */}
      <section className="py-24 bg-gray-50">
        <div
          ref={capRef.ref}
          className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-1000 ${
            capRef.isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              The Microsoft Power Platform
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              A unified ecosystem that grows with your business. We'll help you pick the right components.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {capabilities.map((cap, index) => (
              <div
                key={cap.title}
                className="group bg-white rounded-2xl p-6 text-center shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-[#0078D4]/30 hover:-translate-y-1"
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                <div className="w-14 h-14 bg-[#0078D4]/10 group-hover:bg-[#0078D4]/20 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-colors">
                  <cap.icon className="w-7 h-7 text-[#0078D4]" />
                </div>
                <h5 className="font-semibold text-gray-900 mb-1">{cap.title}</h5>
                <p className="text-xs text-gray-500">{cap.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
          STATS / SOCIAL PROOF
          ============================================ */}
      <section className="py-24 bg-white relative overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&q=80&auto=format"
            alt="Modern office"
            fill
            className="object-cover opacity-5"
          />
        </div>

        <div
          ref={statsRef.ref}
          className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Trusted by Enterprises
            </h2>
            <p className="text-xl text-gray-600">
              Numbers that speak to our track record.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={stat.label} className="text-center">
                <div className="text-5xl md:text-6xl font-bold text-[#0078D4] mb-2">
                  {statValues[index]}{stat.suffix}
                </div>
                <p className="text-gray-600 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ============================================
          FAQ SECTION
          ============================================ */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl border border-gray-200 overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between gap-4"
                >
                  <span className="font-semibold text-gray-900">{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${
                      openFaq === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openFaq === index ? 'max-h-96' : 'max-h-0'
                  }`}
                >
                  <p className="px-6 pb-5 text-gray-600">{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
          FINAL CTA
          ============================================ */}
      <section className="py-24 bg-gradient-to-br from-[#0052CC] to-[#0078D4] relative overflow-hidden">
        {/* Animated particles - fixed positions to avoid hydration mismatch */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-2 h-2 bg-white/20 rounded-full animate-pulse" style={{ left: '10%', top: '20%', animationDelay: '0s' }} />
          <div className="absolute w-2 h-2 bg-white/20 rounded-full animate-pulse" style={{ left: '25%', top: '60%', animationDelay: '0.5s' }} />
          <div className="absolute w-2 h-2 bg-white/20 rounded-full animate-pulse" style={{ left: '40%', top: '30%', animationDelay: '1s' }} />
          <div className="absolute w-2 h-2 bg-white/20 rounded-full animate-pulse" style={{ left: '55%', top: '70%', animationDelay: '1.5s' }} />
          <div className="absolute w-2 h-2 bg-white/20 rounded-full animate-pulse" style={{ left: '70%', top: '15%', animationDelay: '2s' }} />
          <div className="absolute w-2 h-2 bg-white/20 rounded-full animate-pulse" style={{ left: '85%', top: '45%', animationDelay: '2.5s' }} />
          <div className="absolute w-2 h-2 bg-white/20 rounded-full animate-pulse" style={{ left: '15%', top: '80%', animationDelay: '0.3s' }} />
          <div className="absolute w-2 h-2 bg-white/20 rounded-full animate-pulse" style={{ left: '30%', top: '10%', animationDelay: '0.8s' }} />
          <div className="absolute w-2 h-2 bg-white/20 rounded-full animate-pulse" style={{ left: '60%', top: '85%', animationDelay: '1.3s' }} />
          <div className="absolute w-2 h-2 bg-white/20 rounded-full animate-pulse" style={{ left: '75%', top: '55%', animationDelay: '1.8s' }} />
          <div className="absolute w-2 h-2 bg-white/20 rounded-full animate-pulse" style={{ left: '90%', top: '25%', animationDelay: '2.3s' }} />
          <div className="absolute w-2 h-2 bg-white/20 rounded-full animate-pulse" style={{ left: '5%', top: '50%', animationDelay: '0.7s' }} />
          <div className="absolute w-3 h-3 bg-white/10 rounded-full animate-pulse" style={{ left: '20%', top: '35%', animationDelay: '1.2s' }} />
          <div className="absolute w-3 h-3 bg-white/10 rounded-full animate-pulse" style={{ left: '50%', top: '90%', animationDelay: '1.7s' }} />
          <div className="absolute w-3 h-3 bg-white/10 rounded-full animate-pulse" style={{ left: '80%', top: '75%', animationDelay: '2.2s' }} />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Ready to Stop Guessing?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Book your free 30-minute roadmap session today.
            Walk away with a clear plan, not a sales pitch.
          </p>

          <button
            onClick={scrollToForm}
            className="inline-flex items-center gap-3 px-8 py-4 bg-[#C4FF61] text-[#0A1628] font-bold text-lg rounded-xl hover:bg-[#d4ff85] transition-all shadow-lg hover:shadow-xl group"
          >
            Book My Free Session
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </button>

          <p className="mt-6 text-blue-200 text-sm">
            No credit card required. No obligation. Just insights.
          </p>
        </div>
      </section>
    </main>
  );
}
