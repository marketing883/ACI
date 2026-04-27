'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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
  const [isAnimating, setIsAnimating] = useState(false);

  const goToPrevious = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
      setIsAnimating(false);
    }, 300);
  }, [isAnimating, testimonials.length]);

  const goToNext = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
      setIsAnimating(false);
    }, 300);
  }, [isAnimating, testimonials.length]);

  // Auto-advance every 6 seconds
  useEffect(() => {
    const timer = setInterval(goToNext, 6000);
    return () => clearInterval(timer);
  }, [goToNext]);

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section className="relative py-16 md:py-20 overflow-hidden bg-white">
      {/* Large decorative quote marks - subtle background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <span
          className="absolute top-8 left-[5%] text-[200px] md:text-[300px] leading-none font-serif text-gray-100 select-none"
          style={{ fontFamily: 'Georgia, serif' }}
        >
          "
        </span>
        <span
          className="absolute bottom-0 right-[5%] text-[200px] md:text-[300px] leading-none font-serif text-gray-100 select-none rotate-180"
          style={{ fontFamily: 'Georgia, serif' }}
        >
          "
        </span>
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-[#0052CC] text-xs font-semibold uppercase tracking-[0.2em] mb-2">
            Client Success
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-[#0A1628]">
            {headline}
          </h2>
        </div>

        {/* Testimonial Content */}
        <div className="flex items-stretch gap-6 md:gap-10">
          {/* Lime green accent bar */}
          <div className="hidden sm:block w-1 bg-gradient-to-b from-[#C4FF61] via-[#C4FF61] to-[#C4FF61]/30 rounded-full flex-shrink-0" />

          {/* Quote content */}
          <div
            className="flex-1 min-w-0"
            style={{
              opacity: isAnimating ? 0 : 1,
              transform: isAnimating ? 'translateY(10px)' : 'translateY(0)',
              transition: 'all 0.3s ease-out',
            }}
          >
            {/* Quote text */}
            <blockquote className="text-lg md:text-xl lg:text-2xl text-[#0A1628] leading-relaxed mb-8 font-light">
              "{currentTestimonial.quote}"
            </blockquote>

            {/* Author info */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                {/* Avatar */}
                {currentTestimonial.photo_url ? (
                  <Image
                    src={currentTestimonial.photo_url}
                    alt={currentTestimonial.author}
                    width={48}
                    height={48}
                    className="rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 bg-[#0A1628] rounded-full flex items-center justify-center text-white text-lg font-semibold">
                    {currentTestimonial.author.charAt(0)}
                  </div>
                )}

                <div>
                  <p className="font-semibold text-[#0A1628]">
                    {currentTestimonial.author}
                  </p>
                  <p className="text-sm text-gray-500">
                    {currentTestimonial.role && `${currentTestimonial.role}, `}
                    {currentTestimonial.company}
                  </p>
                </div>
              </div>

              {/* Company logo */}
              {currentTestimonial.company_logo && (
                <div className="sm:pl-6 sm:border-l border-gray-200">
                  <Image
                    src={currentTestimonial.company_logo}
                    alt={currentTestimonial.company}
                    width={100}
                    height={40}
                    className="object-contain opacity-60 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-300"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Navigation */}
        {testimonials.length > 1 && (
          <div className="flex items-center justify-center gap-6 mt-10">
            {/* Previous button */}
            <button
              onClick={goToPrevious}
              className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 bg-white hover:border-[#C4FF61] hover:bg-[#C4FF61]/10 text-gray-400 hover:text-[#0A1628] transition-all duration-200"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-5 h-5" strokeWidth={1.5} />
            </button>

            {/* Progress dots */}
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    if (index !== currentIndex && !isAnimating) {
                      setIsAnimating(true);
                      setTimeout(() => {
                        setCurrentIndex(index);
                        setIsAnimating(false);
                      }, 300);
                    }
                  }}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? 'w-8 bg-[#C4FF61]'
                      : 'w-2 bg-gray-200 hover:bg-gray-300'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>

            {/* Next button */}
            <button
              onClick={goToNext}
              className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 bg-white hover:border-[#C4FF61] hover:bg-[#C4FF61]/10 text-gray-400 hover:text-[#0A1628] transition-all duration-200"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-5 h-5" strokeWidth={1.5} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
