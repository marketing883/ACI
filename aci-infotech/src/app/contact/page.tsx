'use client';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle, Globe2, Building2, Star } from 'lucide-react';
import Button from '@/components/ui/Button';
import { trackFormSubmission, trackEvent } from '@/components/analytics/GoogleAnalytics';

// Office locations organized by region
const officeRegions = [
  {
    region: 'Americas',
    offices: [
      {
        name: 'Somerset, NJ',
        label: 'Global Headquarters',
        isHQ: true,
        company: 'ACI Infotech Inc',
        address: '220 Davidson Avenue, Suite 129',
        city: 'Somerset, New Jersey - 08873',
        country: 'United States',
      },
      {
        name: 'Atlanta, GA',
        label: 'East Coast Hub',
        company: 'ACI Infotech Inc',
        address: 'The Pinnacle Building, 3455 Peachtree Road North East',
        city: '5th Floor, Atlanta, Georgia 30326',
        country: 'United States',
      },
      {
        name: 'Texas',
        label: 'Central Region',
        company: 'ACI Infotech Inc',
        address: '1716 Briarcrest Drive, 3rd Floor',
        city: 'Bryan, Texas 77802',
        country: 'United States',
      },
    ],
  },
  {
    region: 'India',
    offices: [
      {
        name: 'Hyderabad',
        label: 'India Headquarters',
        company: 'ACI Global Business Services Pvt Ltd',
        address: 'Mindspace Raheja IT Park, 5th Floor, Bldg. No.9',
        city: 'Hitech City, Hyderabad 500081, Telangana',
        country: 'India',
      },
      {
        name: 'Noida',
        label: 'North India',
        company: 'ACI Global Business Services Pvt Ltd',
        address: 'Sector 63, Noida, D-108, D Block',
        city: 'Hazratpur Wajidpur, Uttar Pradesh 201301',
        country: 'India',
      },
      {
        name: 'Bengaluru',
        label: 'South India',
        company: 'ACI Global Business Services Pvt Ltd',
        address: 'ITI Layout, HSR Layout',
        city: 'Bengaluru, Karnataka 560102',
        country: 'India',
      },
    ],
  },
  {
    region: 'Middle East',
    offices: [
      {
        name: 'Ras Al-Khaimah',
        label: 'MENA Region',
        company: 'ACI Global FZ LLC',
        address: 'Ras Al Khaimah Economic Zone Authority',
        city: 'Al Mamourah Street - Ras Al-Khaimah',
        country: 'United Arab Emirates',
      },
    ],
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

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit form');
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
    } catch {
      setError('Something went wrong. Please try again or email us directly.');
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
                    <div className="font-medium text-[var(--aci-secondary)]">Phone (US)</div>
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

      {/* Global Offices Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
        {/* Decorative globe elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-10 w-64 h-64 bg-[var(--aci-primary)]/5 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-[var(--aci-primary)]/5 rounded-full blur-3xl" />
          {/* Dotted world map pattern */}
          <svg className="absolute inset-0 w-full h-full opacity-[0.03]" viewBox="0 0 1000 500">
            <pattern id="dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.5" fill="currentColor" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#dots)" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--aci-primary)]/10 rounded-full text-[var(--aci-primary)] font-medium text-sm mb-4">
              <Globe2 className="w-4 h-4" />
              Global Presence
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--aci-secondary)] mb-4">
              Our Offices Around the World
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              With offices across 3 continents, we deliver enterprise solutions with global expertise and local presence.
            </p>
          </div>

          {/* Stats Bar */}
          <div className="flex flex-wrap justify-center gap-8 mb-16">
            <div className="flex items-center gap-3 px-6 py-3 bg-white rounded-full shadow-sm">
              <div className="w-10 h-10 bg-[var(--aci-primary)] rounded-full flex items-center justify-center">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-[var(--aci-secondary)]">7</div>
                <div className="text-sm text-gray-500">Offices</div>
              </div>
            </div>
            <div className="flex items-center gap-3 px-6 py-3 bg-white rounded-full shadow-sm">
              <div className="w-10 h-10 bg-[var(--aci-primary)] rounded-full flex items-center justify-center">
                <Globe2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-[var(--aci-secondary)]">3</div>
                <div className="text-sm text-gray-500">Continents</div>
              </div>
            </div>
            <div className="flex items-center gap-3 px-6 py-3 bg-white rounded-full shadow-sm">
              <div className="w-10 h-10 bg-[var(--aci-primary)] rounded-full flex items-center justify-center">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-[var(--aci-secondary)]">24/7</div>
                <div className="text-sm text-gray-500">Support</div>
              </div>
            </div>
          </div>

          {/* Office Regions */}
          <div className="space-y-12">
            {officeRegions.map((region) => (
              <div key={region.region}>
                {/* Region Header */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
                  <h3 className="text-lg font-semibold text-[var(--aci-secondary)] px-4 py-2 bg-white rounded-full shadow-sm">
                    {region.region}
                  </h3>
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
                </div>

                {/* Office Cards */}
                <div className={`grid gap-6 ${
                  region.offices.length === 1
                    ? 'md:grid-cols-1 max-w-md mx-auto'
                    : region.offices.length === 2
                    ? 'md:grid-cols-2 max-w-3xl mx-auto'
                    : 'md:grid-cols-3'
                }`}>
                  {region.offices.map((office) => (
                    <div
                      key={office.name}
                      className={`relative bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all group ${
                        office.isHQ ? 'ring-2 ring-[var(--aci-primary)] ring-offset-2' : ''
                      }`}
                    >
                      {/* HQ Badge */}
                      {office.isHQ && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                          <div className="flex items-center gap-1 px-3 py-1 bg-[var(--aci-primary)] text-white text-xs font-semibold rounded-full">
                            <Star className="w-3 h-3" />
                            Headquarters
                          </div>
                        </div>
                      )}

                      {/* Location Pin Animation */}
                      <div className="absolute -top-2 -right-2 w-8 h-8">
                        <div className="absolute inset-0 bg-[var(--aci-primary)]/20 rounded-full animate-ping" />
                        <div className="absolute inset-1 bg-[var(--aci-primary)] rounded-full flex items-center justify-center">
                          <MapPin className="w-4 h-4 text-white" />
                        </div>
                      </div>

                      {/* Office Name */}
                      <h4 className="text-xl font-bold text-[var(--aci-primary)] mb-1">
                        {office.name}
                      </h4>
                      <p className="text-sm text-gray-500 mb-4">{office.label}</p>

                      {/* Company Name */}
                      <p className="font-semibold text-[var(--aci-secondary)] mb-3">
                        {office.company}
                      </p>

                      {/* Address */}
                      <div className="space-y-1 text-sm text-gray-600">
                        <p>{office.address}</p>
                        <p>{office.city}</p>
                        <p className="font-medium text-gray-700">{office.country}</p>
                      </div>

                      {/* Hover Effect Line */}
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[var(--aci-primary)] to-blue-400 rounded-b-2xl transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Connection Lines Visual */}
          <div className="mt-16 text-center">
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
            Prefer to Talk Now?
          </h2>
          <p className="text-lg text-blue-100 mb-6">
            Call us directly at{' '}
            <a href="tel:+16099362729" className="underline hover:no-underline font-semibold">
              +1 (609) 936-2729
            </a>
          </p>
          <p className="text-sm text-blue-200">
            Business hours: Monday–Friday, 9am–6pm EST | 24/7 support for existing clients
          </p>
        </div>
      </section>
    </>
  );
}
