'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  CheckCircle2,
  Award,
  Zap,
  TrendingUp,
  Target,
  Calendar,
  Clock,
  Users,
  BarChart3,
  Workflow,
  Bot,
  Database,
  Send,
  Loader2,
  ArrowRight,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import { trackFormSubmission, trackEvent } from '@/components/analytics/GoogleAnalytics';

const capabilities = [
  {
    icon: Bot,
    title: 'Microsoft Copilot',
    items: ['Copilot for Dynamics 365', 'Copilot Studio', 'Copilot for Power Platform', 'Custom AI Agents'],
  },
  {
    icon: Database,
    title: 'Dynamics 365 AI ERP',
    items: ['Finance & Supply Chain', 'Business Central', 'Customer Insights', 'Intelligent Order Management'],
  },
  {
    icon: TrendingUp,
    title: 'Dynamics 365 CRM',
    items: ['Sales', 'Customer Service', 'Field Service', 'Marketing'],
  },
  {
    icon: BarChart3,
    title: 'Microsoft Fabric',
    items: ['Unified Data Platform', 'Real-time Analytics', 'Data Warehouse', 'Power BI Integration'],
  },
  {
    icon: Zap,
    title: 'Power Platform',
    items: ['Power Apps', 'Power Automate', 'Power Pages', 'Power Virtual Agents'],
  },
  {
    icon: Workflow,
    title: 'Integration & AI',
    items: ['Azure OpenAI Service', 'Dataverse', 'Azure Integration Services', 'Custom Connectors'],
  },
];

const sessionDeliverables = [
  {
    title: 'Current State Assessment',
    description: 'We map your existing systems, AI readiness, and process gaps',
  },
  {
    title: '90-Day Implementation Roadmap',
    description: 'A prioritized action plan with Copilot quick wins and milestones',
  },
  {
    title: 'Technology Recommendations',
    description: 'Which Dynamics 365, Copilot, and Fabric components fit your needs',
  },
  {
    title: 'Budget Guidance',
    description: 'Realistic cost ranges including AI licensing considerations',
  },
];

const trustPoints = [
  'Talk to senior architects, not sales reps',
  'Leave with actionable next steps',
  'No pressure, no obligation',
  'We\'ll tell you if we\'re not the right fit',
];

export default function MicrosoftDynamicsPage() {
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
          ...formData,
          reason: 'power-platform-roadmap',
          message: `Role: ${formData.role}\n\nChallenge/Interest: ${formData.challenge}`,
          source: 'microsoft-dynamics-landing-page',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit form');
      }

      trackFormSubmission('roadmap_session', 'microsoft_dynamics_page', {
        company: formData.company || 'Not provided',
      });

      trackEvent('roadmap_session_requested', {
        form_location: 'microsoft_dynamics_landing',
        has_company: formData.company ? 'yes' : 'no',
      });

      setIsSubmitted(true);
    } catch {
      setError('Something went wrong. Please try again or email us directly at info@aciinfotech.com');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#0078D4] to-[#002050] pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/platforms"
            className="inline-flex items-center gap-2 text-blue-200 hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            All Platforms
          </Link>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Value Proposition */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-14 h-14 bg-white/10 backdrop-blur rounded-xl flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none">
                    <rect x="1" y="1" width="10" height="10" fill="#F25022" />
                    <rect x="13" y="1" width="10" height="10" fill="#7FBA00" />
                    <rect x="1" y="13" width="10" height="10" fill="#00A4EF" />
                    <rect x="13" y="13" width="10" height="10" fill="#FFB900" />
                  </svg>
                </div>
                <span className="px-3 py-1 bg-white/10 backdrop-blur text-white text-sm font-medium rounded-full flex items-center gap-1">
                  <Award className="w-4 h-4" />
                  Microsoft Partner
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                Microsoft Dynamics,<br />
                <span className="text-[#00A4EF]">Copilot & Power Platform</span>
              </h1>

              <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                Accelerate with AI. Get a clear roadmap for Dynamics 365, Copilot, and Power Platform
                in a 30-minute strategy session with our senior architects.
              </p>

              <div className="flex items-center gap-4 text-blue-200">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span>30 Minutes</span>
                </div>
                <div className="w-1 h-1 bg-blue-300 rounded-full" />
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  <span>Senior Architects</span>
                </div>
                <div className="w-1 h-1 bg-blue-300 rounded-full" />
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  <span>Actionable Plan</span>
                </div>
              </div>
            </div>

            {/* Right: Lead Form */}
            <div className="bg-white rounded-2xl p-8 shadow-2xl">
              {isSubmitted ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-8 h-8 text-green-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-[var(--aci-secondary)] mb-3">
                    You're All Set!
                  </h3>
                  <p className="text-gray-600 mb-2">
                    A senior architect will reach out within 24 business hours to schedule your roadmap session.
                  </p>
                  <p className="text-sm text-gray-500">
                    Check your inbox for a confirmation email.
                  </p>
                </div>
              ) : (
                <>
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-[var(--aci-secondary)] mb-2">
                      Book Your Roadmap Session
                    </h2>
                    <p className="text-gray-600">
                      30 minutes. Zero sales pitch. Walk away with a plan.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
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
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0078D4] focus:border-transparent"
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
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0078D4] focus:border-transparent"
                          placeholder="john@company.com"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
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
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0078D4] focus:border-transparent"
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
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0078D4] focus:border-transparent"
                          placeholder="+1 (555) 123-4567"
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0078D4] focus:border-transparent bg-white"
                      >
                        <option value="">Select your role</option>
                        <option value="C-Level / Executive">C-Level / Executive</option>
                        <option value="VP / Director">VP / Director</option>
                        <option value="IT Manager">IT Manager</option>
                        <option value="Business Analyst">Business Analyst</option>
                        <option value="Developer / Architect">Developer / Architect</option>
                        <option value="Operations">Operations</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="challenge" className="block text-sm font-medium text-gray-700 mb-1">
                        What's your primary challenge or goal? *
                      </label>
                      <textarea
                        id="challenge"
                        name="challenge"
                        value={formData.challenge}
                        onChange={handleChange}
                        required
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0078D4] focus:border-transparent resize-none"
                        placeholder="e.g., We need to automate our approval workflows and get better visibility into sales pipeline..."
                      />
                    </div>

                    {error && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                        {error}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 bg-[#0078D4] hover:bg-[#106EBE] text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          Book My Roadmap Session
                          <ArrowRight className="w-5 h-5" />
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
      </section>

      {/* What You'll Get */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[var(--aci-secondary)] mb-4">
              What You'll Walk Away With
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              This isn't a discovery call. It's a working session where you leave with a concrete plan.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {sessionDeliverables.map((item, index) => (
              <div
                key={item.title}
                className="bg-gray-50 rounded-xl p-6 border-l-4 border-[#0078D4]"
              >
                <div className="w-8 h-8 bg-[#0078D4] text-white rounded-full flex items-center justify-center font-bold mb-4">
                  {index + 1}
                </div>
                <h3 className="font-semibold text-[var(--aci-secondary)] mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Capabilities Overview */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[var(--aci-secondary)] mb-4">
              Our Microsoft Practice
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              End-to-end implementation across Dynamics 365, Copilot, Fabric, and the entire Microsoft AI-powered business ecosystem.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {capabilities.map((cap) => (
              <div key={cap.title} className="bg-white rounded-xl p-6 shadow-sm">
                <div className="w-12 h-12 bg-[#0078D4]/10 rounded-xl flex items-center justify-center mb-4">
                  <cap.icon className="w-6 h-6 text-[#0078D4]" />
                </div>
                <h3 className="font-semibold text-[var(--aci-secondary)] mb-3">{cap.title}</h3>
                <ul className="space-y-2">
                  {cap.items.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-2xl font-bold text-[var(--aci-secondary)] mb-4">
                  What to Expect
                </h2>
                <ul className="space-y-3">
                  {trustPoints.map((point) => (
                    <li key={point} className="flex items-center gap-3 text-gray-700">
                      <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm mb-4">
                  <Calendar className="w-5 h-5 text-[#0078D4]" />
                  <span className="font-medium text-[var(--aci-secondary)]">30-Minute Session</span>
                </div>
                <p className="text-gray-600 mb-6">
                  Schedule at your convenience. We'll send calendar options after you submit the form.
                </p>
                <Button
                  href="#"
                  variant="primary"
                  size="lg"
                  onClick={(e) => {
                    e?.preventDefault();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  Book Your Session
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 bg-[#0078D4]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Build Your Roadmap?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            30 minutes with a senior architect. Walk away with a 90-day implementation plan.
          </p>
          <Button
            href="#"
            variant="secondary"
            size="lg"
            onClick={(e) => {
              e?.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            Book Your Free Roadmap Session
          </Button>
        </div>
      </section>
    </main>
  );
}
