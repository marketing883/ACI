'use client';

import { useState, useEffect } from 'react';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { JOB_TITLE_OPTIONS, getLookingForOptions, isWorkEmail } from '@/lib/lp-dropdown-options';

interface LPFormProps {
  landingPage: string;
  serviceCluster: string;
  ctoText: string;
  onSuccess?: (data: { firstName: string; serviceCluster: string; lookingFor: string }) => void;
  utmParams?: {
    utmSource?: string;
    utmMedium?: string;
    utmCampaign?: string;
    utmContent?: string;
    utmTerm?: string;
  };
  urlParams?: {
    industryParam?: string;
    roleParam?: string;
  };
  compact?: boolean;
}

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

export default function LPForm({
  landingPage,
  serviceCluster,
  ctoText,
  onSuccess,
  utmParams = {},
  urlParams = {},
  compact = false,
}: LPFormProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    companyName: '',
    jobTitle: '',
    lookingFor: '',
  });

  const [status, setStatus] = useState<FormStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [emailError, setEmailError] = useState('');

  const lookingForOptions = getLookingForOptions(serviceCluster);

  // Validate email on blur
  const validateEmail = (email: string) => {
    if (!email) {
      setEmailError('');
      return;
    }

    if (!email.includes('@') || !email.includes('.')) {
      setEmailError('Please enter a valid email address');
      return;
    }

    if (!isWorkEmail(email)) {
      setEmailError('Please use your work email address');
      return;
    }

    setEmailError('');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === 'email') {
      setEmailError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate email before submission
    if (!isWorkEmail(formData.email)) {
      setEmailError('Please use your work email address');
      return;
    }

    setStatus('submitting');
    setErrorMessage('');

    try {
      const response = await fetch('/api/lp/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          landingPage,
          serviceCluster,
          ...utmParams,
          ...urlParams,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Submission failed');
      }

      setStatus('success');

      if (onSuccess) {
        onSuccess({
          firstName: formData.firstName,
          serviceCluster,
          lookingFor: formData.lookingFor,
        });
      }
    } catch (error) {
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Something went wrong. Please try again.');
    }
  };

  // Success state
  if (status === 'success') {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Thank You, {formData.firstName}!</h3>
        <p className="text-gray-600">
          We've received your request. A specialist will reach out within 24 business hours.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={`space-y-${compact ? '3' : '4'}`}>
      {/* Name Row */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
            First Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
            placeholder="John"
          />
        </div>
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
            Last Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
            placeholder="Doe"
          />
        </div>
      </div>

      {/* Work Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Work Email <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          onBlur={(e) => validateEmail(e.target.value)}
          required
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow ${
            emailError ? 'border-red-500 bg-red-50' : 'border-gray-300'
          }`}
          placeholder="john.doe@company.com"
        />
        {emailError && (
          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {emailError}
          </p>
        )}
      </div>

      {/* Phone (Optional) */}
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
          Phone <span className="text-gray-400">(optional)</span>
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
          placeholder="+1 (555) 123-4567"
        />
      </div>

      {/* Company Name */}
      <div>
        <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">
          Company Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="companyName"
          name="companyName"
          value={formData.companyName}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
          placeholder="Acme Corporation"
        />
      </div>

      {/* Job Title Dropdown */}
      <div>
        <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700 mb-1">
          Job Title <span className="text-red-500">*</span>
        </label>
        <select
          id="jobTitle"
          name="jobTitle"
          value={formData.jobTitle}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow bg-white"
        >
          <option value="">Select your role</option>
          {JOB_TITLE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Looking For Dropdown */}
      <div>
        <label htmlFor="lookingFor" className="block text-sm font-medium text-gray-700 mb-1">
          What are you looking for? <span className="text-red-500">*</span>
        </label>
        <select
          id="lookingFor"
          name="lookingFor"
          value={formData.lookingFor}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow bg-white"
        >
          <option value="">Select an option</option>
          {lookingForOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Error Message */}
      {status === 'error' && errorMessage && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{errorMessage}</p>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={status === 'submitting' || !!emailError}
        className="w-full py-4 px-6 bg-[#0066FF] hover:bg-[#0052CC] disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25"
      >
        {status === 'submitting' ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Submitting...
          </>
        ) : (
          ctoText
        )}
      </button>

      {/* Trust Text */}
      <p className="text-xs text-center text-gray-500">
        Your information is secure and will never be shared. By submitting, you agree to our{' '}
        <a href="/privacy-policy" className="text-blue-600 hover:underline">
          Privacy Policy
        </a>
        .
      </p>
    </form>
  );
}
