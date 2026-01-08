'use client';

import { useState, useEffect, useCallback } from 'react';
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
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState<'left' | 'right'>('right');

  const goToPrevious = useCallback(() => {
    if (isAnimating) return;
    setDirection('left');
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
      setIsAnimating(false);
    }, 200);
  }, [isAnimating, testimonials.length]);

  const goToNext = useCallback(() => {
    if (isAnimating) return;
    setDirection('right');
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
      setIsAnimating(false);
    }, 200);
  }, [isAnimating, testimonials.length]);

  // Auto-advance every 6 seconds
  useEffect(() => {
    const timer = setInterval(goToNext, 6000);
    return () => clearInterval(timer);
  }, [goToNext]);

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section className="relative py-14 md:py-16 overflow-hidden bg-gradient-to-b from-white via-gray-50/80 to-white">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #0052CC 1px, transparent 0)`,
            backgroundSize: '32px 32px',
          }}
        />
      </div>

      {/* Decorative accent lines */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#0052CC]/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#0052CC]/20 to-transparent" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header - Compact */}
        <div className="text-center mb-10">
          <p className="text-[#0052CC] text-xs font-semibold uppercase tracking-[0.2em] mb-2">
            Client Success
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-[#0A1628]">
            {headline}
          </h2>
        </div>

        {/* Main testimonial display */}
        <div className="relative flex items-center gap-4 md:gap-8">
          {/* Previous button */}
          {testimonials.length > 1 && (
            <button
              onClick={goToPrevious}
              className="hidden md:flex shrink-0 w-10 h-10 items-center justify-center rounded-sm border border-gray-200 bg-white hover:border-[#0052CC] hover:text-[#0052CC] text-gray-400 transition-all duration-200 shadow-sm hover:shadow-md"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-5 h-5" strokeWidth={1.5} />
            </button>
          )}

          {/* Testimonial Card */}
          <div
            className="flex-1 relative"
            style={{
              opacity: isAnimating ? 0 : 1,
              transform: isAnimating
                ? `translateX(${direction === 'right' ? '-20px' : '20px'})`
                : 'translateX(0)',
              transition: 'all 0.2s ease-out',
            }}
          >
            <div className="relative bg-white rounded-sm p-6 md:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.06)] border border-gray-100">
              {/* Quote icon - subtle accent */}
              <div className="absolute -top-3 left-6 md:left-8">
                <div className="w-8 h-8 bg-[#0052CC] rounded-sm flex items-center justify-center shadow-lg">
                  <Quote className="w-4 h-4 text-white" strokeWidth={2} />
                </div>
              </div>

              {/* Quote text */}
              <blockquote className="text-base md:text-lg text-[#0A1628]/80 leading-relaxed mt-4 mb-6 line-clamp-4">
                "{currentTestimonial.quote}"
              </blockquote>

              {/* Author info row */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center gap-3">
                  {/* Avatar */}
                  {currentTestimonial.photo_url ? (
                    <Image
                      src={currentTestimonial.photo_url}
                      alt={currentTestimonial.author}
                      width={40}
                      height={40}
                      className="rounded-sm object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gradient-to-br from-[#0052CC] to-[#003D99] rounded-sm flex items-center justify-center text-white text-sm font-semibold shadow-sm">
                      {currentTestimonial.author.charAt(0)}
                    </div>
                  )}

                  <div>
                    <p className="font-semibold text-sm text-[#0A1628]">
                      {currentTestimonial.author}
                    </p>
                    <p className="text-xs text-gray-500">
                      {currentTestimonial.role && `${currentTestimonial.role} · `}
                      {currentTestimonial.company}
                    </p>
                  </div>
                </div>

                {/* Company logo */}
                {currentTestimonial.company_logo && (
                  <div className="hidden sm:block pl-4 border-l border-gray-100">
                    <Image
                      src={currentTestimonial.company_logo}
                      alt={currentTestimonial.company}
                      width={80}
                      height={32}
                      className="object-contain opacity-40 grayscale hover:opacity-60 hover:grayscale-0 transition-all duration-300"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Next button */}
          {testimonials.length > 1 && (
            <button
              onClick={goToNext}
              className="hidden md:flex shrink-0 w-10 h-10 items-center justify-center rounded-sm border border-gray-200 bg-white hover:border-[#0052CC] hover:text-[#0052CC] text-gray-400 transition-all duration-200 shadow-sm hover:shadow-md"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-5 h-5" strokeWidth={1.5} />
            </button>
          )}
        </div>

        {/* Mobile navigation + Progress dots */}
        {testimonials.length > 1 && (
          <div className="flex items-center justify-center gap-6 mt-6">
            {/* Mobile prev */}
            <button
              onClick={goToPrevious}
              className="md:hidden w-8 h-8 flex items-center justify-center rounded-sm border border-gray-200 bg-white hover:border-[#0052CC] hover:text-[#0052CC] text-gray-400 transition-all duration-200"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-4 h-4" strokeWidth={1.5} />
            </button>

            {/* Progress indicator */}
            <div className="flex gap-1.5">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    if (index !== currentIndex && !isAnimating) {
                      setDirection(index > currentIndex ? 'right' : 'left');
                      setIsAnimating(true);
                      setTimeout(() => {
                        setCurrentIndex(index);
                        setIsAnimating(false);
                      }, 200);
                    }
                  }}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? 'w-6 bg-[#0052CC]'
                      : 'w-1.5 bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>

            {/* Mobile next */}
            <button
              onClick={goToNext}
              className="md:hidden w-8 h-8 flex items-center justify-center rounded-sm border border-gray-200 bg-white hover:border-[#0052CC] hover:text-[#0052CC] text-gray-400 transition-all duration-200"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-4 h-4" strokeWidth={1.5} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
