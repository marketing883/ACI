'use client';

import Image from 'next/image';
import { Quote } from 'lucide-react';

interface TestimonialCardProps {
  quote: string;
  author: string;
  role?: string;
  company: string;
  company_logo?: string;
  photo_url?: string;
  variant?: 'default' | 'featured' | 'compact';
  className?: string;
}

export default function TestimonialCard({
  quote,
  author,
  role,
  company,
  company_logo,
  photo_url,
  variant = 'default',
  className = '',
}: TestimonialCardProps) {
  if (variant === 'compact') {
    return (
      <div className={`p-4 bg-gray-50 rounded-lg ${className}`}>
        <p className="text-sm text-gray-600 italic mb-3">"{quote}"</p>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-[var(--aci-secondary)]">
            {author}
          </span>
          <span className="text-gray-400">-</span>
          <span className="text-sm text-gray-500">{company}</span>
        </div>
      </div>
    );
  }

  if (variant === 'featured') {
    return (
      <div className={`p-8 bg-white rounded-2xl shadow-lg ${className}`}>
        <Quote className="w-12 h-12 text-[var(--aci-primary)] opacity-20 mb-4" />

        <blockquote className="text-xl text-[var(--aci-secondary)] leading-relaxed mb-6">
          "{quote}"
        </blockquote>

        <div className="flex items-center gap-4">
          {photo_url ? (
            <Image
              src={photo_url}
              alt={author}
              width={56}
              height={56}
              className="rounded-full object-cover"
            />
          ) : (
            <div className="w-14 h-14 bg-[var(--aci-primary)] rounded-full flex items-center justify-center text-white text-xl font-bold">
              {author.charAt(0)}
            </div>
          )}

          <div className="flex-1">
            <p className="font-semibold text-[var(--aci-secondary)]">{author}</p>
            {role && <p className="text-sm text-gray-500">{role}</p>}
            <p className="text-sm text-gray-500">{company}</p>
          </div>

          {company_logo && (
            <Image
              src={company_logo}
              alt={company}
              width={100}
              height={40}
              className="object-contain opacity-60"
            />
          )}
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div className={`p-6 bg-white rounded-xl border border-gray-200 ${className}`}>
      <Quote className="w-8 h-8 text-[var(--aci-primary)] opacity-30 mb-4" />

      <blockquote className="text-gray-600 leading-relaxed mb-6">
        "{quote}"
      </blockquote>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {photo_url ? (
            <Image
              src={photo_url}
              alt={author}
              width={48}
              height={48}
              className="rounded-full object-cover"
            />
          ) : (
            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 font-bold">
              {author.charAt(0)}
            </div>
          )}

          <div>
            <p className="font-medium text-[var(--aci-secondary)]">{author}</p>
            <p className="text-sm text-gray-500">{company}</p>
          </div>
        </div>

        {company_logo && (
          <Image
            src={company_logo}
            alt={company}
            width={80}
            height={32}
            className="object-contain opacity-50"
          />
        )}
      </div>
    </div>
  );
}

// Testimonial Carousel/Grid Container
interface TestimonialGridProps {
  testimonials: TestimonialCardProps[];
  columns?: 1 | 2 | 3;
  variant?: 'default' | 'featured' | 'compact';
  className?: string;
}

export function TestimonialGrid({
  testimonials,
  columns = 3,
  variant = 'default',
  className = '',
}: TestimonialGridProps) {
  const columnStyles = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  };

  return (
    <div className={`grid ${columnStyles[columns]} gap-6 ${className}`}>
      {testimonials.map((testimonial, index) => (
        <TestimonialCard key={index} {...testimonial} variant={variant} />
      ))}
    </div>
  );
}
