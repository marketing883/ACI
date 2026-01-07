'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Button from '@/components/ui/Button';
import { CheckCircle, Mail } from 'lucide-react';

// Validation schema
const newsletterSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type NewsletterFormData = z.infer<typeof newsletterSchema>;

interface NewsletterFormProps {
  variant?: 'inline' | 'stacked';
  placeholder?: string;
  buttonText?: string;
  successMessage?: string;
  className?: string;
}

export default function NewsletterForm({
  variant = 'inline',
  placeholder = 'Enter your email',
  buttonText = 'Subscribe',
  successMessage = 'Thanks for subscribing!',
  className = '',
}: NewsletterFormProps) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NewsletterFormData>({
    resolver: zodResolver(newsletterSchema),
  });

  const onSubmit = async (data: NewsletterFormData) => {
    setStatus('loading');

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to subscribe');
      }

      setStatus('success');
      reset();
    } catch (error) {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className={`flex items-center gap-2 text-green-600 ${className}`}>
        <CheckCircle className="w-5 h-5" />
        <span className="text-sm font-medium">{successMessage}</span>
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <form onSubmit={handleSubmit(onSubmit)} className={`${className}`}>
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="email"
              placeholder={placeholder}
              className={`
                w-full pl-10 pr-4 py-3
                bg-white border rounded-lg
                text-[var(--aci-secondary)] text-base
                placeholder:text-gray-400
                transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-[var(--aci-primary)] focus:border-transparent
                ${errors.email ? 'border-red-500' : 'border-gray-300'}
              `}
              {...register('email')}
            />
          </div>
          <Button
            type="submit"
            variant="primary"
            loading={status === 'loading'}
          >
            {buttonText}
          </Button>
        </div>
        {errors.email && (
          <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
        )}
        {status === 'error' && (
          <p className="text-sm text-red-600 mt-1">Something went wrong. Please try again.</p>
        )}
      </form>
    );
  }

  // Stacked variant
  return (
    <form onSubmit={handleSubmit(onSubmit)} className={`space-y-3 ${className}`}>
      <div className="relative">
        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="email"
          placeholder={placeholder}
          className={`
            w-full pl-10 pr-4 py-3
            bg-white border rounded-lg
            text-[var(--aci-secondary)] text-base
            placeholder:text-gray-400
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-[var(--aci-primary)] focus:border-transparent
            ${errors.email ? 'border-red-500' : 'border-gray-300'}
          `}
          {...register('email')}
        />
      </div>

      {errors.email && (
        <p className="text-sm text-red-600">{errors.email.message}</p>
      )}

      {status === 'error' && (
        <p className="text-sm text-red-600">Something went wrong. Please try again.</p>
      )}

      <Button
        type="submit"
        variant="primary"
        fullWidth
        loading={status === 'loading'}
      >
        {buttonText}
      </Button>
    </form>
  );
}
