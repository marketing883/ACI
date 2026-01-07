'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';

interface Testimonial {
  quote: string;
  author: string;
  role?: string;
  company: string;
  company_logo?: string;
  photo_url?: string;
}

interface TestimonialsSectionProps {
  headline?: string;
  testimonials: Testimonial[];
}

export default function TestimonialsSection({
  headline = "What Fortune 500 Leaders Say",
  testimonials,
}: TestimonialsSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--aci-secondary)]">
            {headline}
          </h2>
        </div>

        {/* Testimonial Card */}
        <div className="relative">
          <div className="bg-gray-50 rounded-2xl p-8 md:p-12">
            <Quote className="w-12 h-12 text-[var(--aci-primary)] opacity-20 mb-6" />

            <blockquote className="text-xl md:text-2xl text-[var(--aci-secondary)] leading-relaxed mb-8">
              "{currentTestimonial.quote}"
            </blockquote>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {currentTestimonial.photo_url ? (
                  <Image
                    src={currentTestimonial.photo_url}
                    alt={currentTestimonial.author}
                    width={56}
                    height={56}
                    className="rounded-full object-cover"
                  />
                ) : (
                  <div className="w-14 h-14 bg-[var(--aci-primary)] rounded-full flex items-center justify-center text-white text-xl font-bold">
                    {currentTestimonial.author.charAt(0)}
                  </div>
                )}

                <div>
                  <p className="font-semibold text-[var(--aci-secondary)]">
                    {currentTestimonial.author}
                  </p>
                  {currentTestimonial.role && (
                    <p className="text-sm text-gray-500">{currentTestimonial.role}</p>
                  )}
                  <p className="text-sm text-gray-500">{currentTestimonial.company}</p>
                </div>
              </div>

              {currentTestimonial.company_logo && (
                <Image
                  src={currentTestimonial.company_logo}
                  alt={currentTestimonial.company}
                  width={100}
                  height={40}
                  className="object-contain opacity-50"
                />
              )}
            </div>
          </div>

          {/* Navigation */}
          {testimonials.length > 1 && (
            <div className="flex items-center justify-center gap-4 mt-8">
              <button
                onClick={goToPrevious}
                className="p-2 rounded-full border border-gray-300 hover:border-[var(--aci-primary)] hover:text-[var(--aci-primary)] transition-colors"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {/* Dots */}
              <div className="flex gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentIndex
                        ? 'bg-[var(--aci-primary)]'
                        : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={goToNext}
                className="p-2 rounded-full border border-gray-300 hover:border-[var(--aci-primary)] hover:text-[var(--aci-primary)] transition-colors"
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
