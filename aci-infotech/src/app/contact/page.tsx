'use client';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Mail, Clock, Send, CheckCircle, Globe2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import { trackFormSubmission, trackEvent } from '@/components/analytics/GoogleTagManager';
import InteractiveGlobe from '@/components/contact/InteractiveGlobe';
import { isWorkEmail } from '@/lib/email-validation';

const contactReasons = [
  { value: 'architecture-call', label: 'Schedule Architecture Discussion' },
  { value: 'project-inquiry', label: 'Project Inquiry' },
  { value: 'partnership', label: 'Partnership Opportunity' },
  { value: 'careers', label: 'Career Inquiry' },
  { value: 'general', label: 'General Inquiry' },
];

function ContactForm() {
  const searchParams = useSearchParams();
  const initialType = searchParams.get('type') || searchParams.get('reason') || 'general';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    reason: initialType,
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // Validate work email before submitting
    if (!isWorkEmail(formData.email)) {
      setError('Please use your work email. Personal emails (Gmail, Yahoo, etc.) are not accepted.');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit form');
      }

      // Track successful contact form submission
      trackFormSubmission('contact_form', 'contact_page', {
        contact_reason: formData.reason,
        company: formData.company || 'Not provided',
      });

      trackEvent('contact_form_submitted', {
        form_location: 'contact_page',
        inquiry_type: formData.reason,
        has_company: formData.company ? 'yes' : 'no',
        has_phone: formData.phone ? 'yes' : 'no',
      });

      setIsSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again or email us directly.');
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isSubmitted) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-8 h-8 text-green-500" />
        </div>
        <h3 className="text-2xl font-bold text-[var(--aci-secondary)] mb-3">
          Thank You!
        </h3>
        <p className="text-gray-600 mb-6">
          We've received your message. A senior architect will be in touch within 24 business hours.
        </p>
        <Button
          variant="secondary"
          onClick={() => {
            setIsSubmitted(false);
            setFormData({
              name: '',
              email: '',
              company: '',
              phone: '',
              reason: 'general',
              message: '',
            });
          }}
        >
          Send Another Message
        </Button>
      </div>
    );
  }

  return (
    <>
      <h2 className="text-2xl font-bold text-[var(--aci-secondary)] mb-6">
        Send Us a Message
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--aci-primary)] focus:border-transparent"
              placeholder="John Doe"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Work Email *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--aci-primary)] focus:border-transparent"
              placeholder="john@company.com"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
              Company
            </label>
            <input
              type="text"
              id="company"
              name="company"
              value={formData.company}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--aci-primary)] focus:border-transparent"
              placeholder="Company Name"
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
              Phone
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--aci-primary)] focus:border-transparent"
              placeholder="+1 (555) 123-4567"
            />
          </div>
        </div>

        <div>
          <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-2">
            What can we help you with? *
          </label>
          <select
            id="reason"
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--aci-primary)] focus:border-transparent bg-white"
          >
            {contactReasons.map((reason) => (
              <option key={reason.value} value={reason.value}>
                {reason.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
            Tell us about your project or challenge *
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            rows={5}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--aci-primary)] focus:border-transparent resize-none"
            placeholder="Describe your project, timeline, and any specific requirements..."
          />
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {error}
          </div>
        )}

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full md:w-auto"
          disabled={isSubmitting}
          rightIcon={!isSubmitting ? <Send className="w-4 h-4" /> : undefined}
        >
          {isSubmitting ? 'Sending...' : 'Send Message'}
        </Button>
      </form>
    </>
  );
}

export default function ContactPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-[var(--aci-secondary)] to-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Let's Talk About Your Challenge
            </h1>
            <p className="text-lg text-gray-300">
              Talk to a senior architect about your specific needs. No sales pitch, just an
              engineering conversation about what's actually possible.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form & Info Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact Info */}
            <div className="lg:col-span-1">
              <h2 className="text-2xl font-bold text-[var(--aci-secondary)] mb-6">
                Get In Touch
              </h2>

              <div className="space-y-6 mb-8">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[var(--aci-primary)]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-[var(--aci-primary)]" />
                  </div>
                  <div>
                    <div className="font-medium text-[var(--aci-secondary)]">Email</div>
                    <a href="mailto:insights@aciinfotech.com" className="text-gray-600 hover:text-[var(--aci-primary)]">
                      insights@aciinfotech.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[var(--aci-primary)]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-[var(--aci-primary)]" />
                  </div>
                  <div>
                    <div className="font-medium text-[var(--aci-secondary)]">Response Time</div>
                    <p className="text-gray-600">
                      Typically within 24 business hours
                    </p>
                  </div>
                </div>
              </div>

              {/* Trust Signals */}
              <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="font-semibold text-[var(--aci-secondary)] mb-4">What to Expect</h3>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    Talk to senior architects, not sales reps
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    30-minute technical discussion
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    We'll tell you if we're not the right fit
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    No pressure, no obligation
                  </li>
                </ul>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-gray-50 p-8 rounded-xl">
                <Suspense fallback={<div className="animate-pulse h-96 bg-gray-200 rounded-lg"></div>}>
                  <ContactForm />
                </Suspense>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Global Offices Section - Interactive Globe */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-10 w-64 h-64 bg-[var(--aci-primary)]/5 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-[var(--aci-primary)]/5 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* Section Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--aci-primary)]/10 rounded-full text-[var(--aci-primary)] font-medium text-sm mb-4">
              <Globe2 className="w-4 h-4" />
              Global Presence
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--aci-secondary)] mb-4">
              Our Offices Around the World
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              With offices across 4 regions, we deliver enterprise solutions with global expertise and local presence.
            </p>
          </div>

          {/* Interactive Globe */}
          <InteractiveGlobe />

          {/* Connection Lines Visual */}
          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--aci-secondary)] text-white rounded-full">
              <Globe2 className="w-5 h-5" />
              <span className="font-medium">Connected Globally, Delivering Locally</span>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 bg-[var(--aci-primary)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-blue-100 mb-6">
            Email us at{' '}
            <a href="mailto:insights@aciinfotech.com" className="underline hover:no-underline font-semibold">
              insights@aciinfotech.com
            </a>
          </p>
          <p className="text-sm text-blue-200">
            We typically respond within 24 business hours | 24/7 support for existing clients
          </p>
        </div>
      </section>
    </>
  );
}
