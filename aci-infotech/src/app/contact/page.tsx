'use client';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle } from 'lucide-react';
import Button from '@/components/ui/Button';

const offices = [
  {
    name: 'US Headquarters',
    address: '100 Overlook Center, 2nd Floor',
    city: 'Princeton, NJ 08540',
    country: 'United States',
    phone: '+1 (609) 936-2729',
    email: 'info@aciinfotech.com',
  },
  {
    name: 'India Office',
    address: 'Plot No. 14, Software Units Layout',
    city: 'Hyderabad, Telangana 500081',
    country: 'India',
    phone: '+91 40 2311 5566',
    email: 'india@aciinfotech.com',
  },
];

const contactReasons = [
  { value: 'architecture-call', label: 'Schedule Architecture Discussion' },
  { value: 'project-inquiry', label: 'Project Inquiry' },
  { value: 'partnership', label: 'Partnership Opportunity' },
  { value: 'careers', label: 'Career Inquiry' },
  { value: 'general', label: 'General Inquiry' },
];

function ContactForm() {
  const searchParams = useSearchParams();
  const initialType = searchParams.get('type') || 'general';

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

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit form');
      }

      setIsSubmitted(true);
    } catch {
      setError('Something went wrong. Please try again or email us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

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
        >
          {isSubmitting ? (
            'Sending...'
          ) : (
            <>
              Send Message <Send className="w-4 h-4 ml-2" />
            </>
          )}
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
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Let's Talk About Your Challenge
            </h1>
            <p className="text-lg text-gray-300">
              Talk to a senior architect about your specific needs. No sales pitch—just an
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
                    <a href="mailto:info@aciinfotech.com" className="text-gray-600 hover:text-[var(--aci-primary)]">
                      info@aciinfotech.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[var(--aci-primary)]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-[var(--aci-primary)]" />
                  </div>
                  <div>
                    <div className="font-medium text-[var(--aci-secondary)]">Phone</div>
                    <a href="tel:+16099362729" className="text-gray-600 hover:text-[var(--aci-primary)]">
                      +1 (609) 936-2729
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

      {/* Office Locations */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-[var(--aci-secondary)] mb-3">
              Our Offices
            </h2>
            <p className="text-gray-600">
              Global delivery with local presence
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {offices.map((office) => (
              <div
                key={office.name}
                className="bg-white p-8 rounded-xl shadow-sm"
              >
                <h3 className="text-xl font-semibold text-[var(--aci-secondary)] mb-4">
                  {office.name}
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-[var(--aci-primary)] flex-shrink-0 mt-0.5" />
                    <div className="text-gray-600">
                      <p>{office.address}</p>
                      <p>{office.city}</p>
                      <p>{office.country}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-[var(--aci-primary)]" />
                    <a href={`tel:${office.phone.replace(/\s/g, '')}`} className="text-gray-600 hover:text-[var(--aci-primary)]">
                      {office.phone}
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-[var(--aci-primary)]" />
                    <a href={`mailto:${office.email}`} className="text-gray-600 hover:text-[var(--aci-primary)]">
                      {office.email}
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 bg-[var(--aci-primary)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Prefer to Talk Now?
          </h2>
          <p className="text-lg text-blue-100 mb-6">
            Call us directly at{' '}
            <a href="tel:+16099362729" className="underline hover:no-underline">
              +1 (609) 936-2729
            </a>
          </p>
          <p className="text-sm text-blue-200">
            Business hours: Monday–Friday, 9am–6pm EST
          </p>
        </div>
      </section>
    </>
  );
}
