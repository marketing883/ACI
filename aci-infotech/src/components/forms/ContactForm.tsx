'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Button from '@/components/ui/Button';
import FormField from './FormField';
import { CheckCircle, AlertCircle } from 'lucide-react';

// Validation schema
const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  company: z.string().min(2, 'Company name must be at least 2 characters'),
  role: z.string().optional(),
  inquiry_type: z.string().min(1, 'Please select an inquiry type'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  phone: z.string().optional(),
});

type ContactFormData = z.infer<typeof contactSchema>;

interface ContactFormProps {
  onSuccess?: () => void;
  redirectUrl?: string;
  className?: string;
}

const INQUIRY_TYPES = [
  { value: 'data-engineering', label: 'Data Engineering' },
  { value: 'ai-ml', label: 'Applied AI & ML' },
  { value: 'cloud', label: 'Cloud Modernization' },
  { value: 'martech', label: 'MarTech & CDP' },
  { value: 'digital-transformation', label: 'Digital Transformation' },
  { value: 'cyber-security', label: 'Cyber Security' },
  { value: 'general', label: 'General Inquiry' },
  { value: 'partnership', label: 'Partnership' },
  { value: 'careers', label: 'Careers' },
];

export default function ContactForm({
  onSuccess,
  redirectUrl,
  className = '',
}: ContactFormProps) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      inquiry_type: '',
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    setStatus('loading');
    setErrorMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to submit form');
      }

      setStatus('success');
      reset();

      if (onSuccess) {
        onSuccess();
      }

      if (redirectUrl) {
        window.location.href = redirectUrl;
      }
    } catch (error) {
      setStatus('error');
      setErrorMessage('Something went wrong. Please try again or email us directly.');
    }
  };

  if (status === 'success') {
    return (
      <div className={`p-8 bg-green-50 rounded-[6px] text-center ${className}`}>
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" strokeWidth={1.5} />
        <h3 className="text-xl font-semibold text-[#0A1628] mb-2">
          Thank You!
        </h3>
        <p className="text-gray-600">
          We've received your message and will get back to you within 24 hours.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={`space-y-6 ${className}`}>
      {status === 'error' && (
        <div className="p-4 bg-red-50 rounded-[6px] flex items-center gap-3 text-red-700">
          <AlertCircle className="w-5 h-5 flex-shrink-0" strokeWidth={1.5} />
          <p className="text-sm">{errorMessage}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          label="Full Name"
          name="name"
          type="text"
          placeholder="John Smith"
          required
          error={errors.name?.message}
          registration={register('name')}
        />

        <FormField
          label="Work Email"
          name="email"
          type="email"
          placeholder="john@company.com"
          required
          error={errors.email?.message}
          registration={register('email')}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          label="Company"
          name="company"
          type="text"
          placeholder="Acme Corp"
          required
          error={errors.company?.message}
          registration={register('company')}
        />

        <FormField
          label="Role / Title"
          name="role"
          type="text"
          placeholder="CTO, VP Engineering, etc."
          error={errors.role?.message}
          registration={register('role')}
        />
      </div>

      <FormField
        label="What can we help you with?"
        name="inquiry_type"
        type="select"
        options={INQUIRY_TYPES}
        placeholder="Select an area..."
        required
        error={errors.inquiry_type?.message}
        registration={register('inquiry_type')}
      />

      <FormField
        label="Tell us about your project or challenge"
        name="message"
        type="textarea"
        placeholder="Describe your current situation, goals, and timeline..."
        rows={5}
        required
        error={errors.message?.message}
        registration={register('message')}
      />

      <FormField
        label="Phone (Optional)"
        name="phone"
        type="tel"
        placeholder="+1 (555) 123-4567"
        error={errors.phone?.message}
        registration={register('phone')}
      />

      <div className="pt-4">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          loading={status === 'loading'}
        >
          Send Message
        </Button>

        <p className="text-sm text-gray-500 mt-4 text-center">
          We typically respond within 24 hours. For urgent matters, call us at{' '}
          <a href="tel:+17324167900" className="text-[#0052CC] hover:underline">
            +1 (732) 416-7900
          </a>
        </p>
      </div>
    </form>
  );
}
