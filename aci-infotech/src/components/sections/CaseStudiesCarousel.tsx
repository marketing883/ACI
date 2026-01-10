'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, BookOpen, Quote, ChevronLeft, ChevronRight } from 'lucide-react';

interface CaseStudyMetric {
  value: string;
  label: string;
  description?: string;
}

interface CaseStudy {
  id: string;
  slug: string;
  title: string;
  client_industry: string;
  challenge: string;
  metrics: CaseStudyMetric[];
  technologies: string[];
  services?: string[];
  testimonial_quote?: string;
  playbook_used?: string;
  playbook_count?: number;
  cta_text?: string;
}

interface CaseStudiesCarouselProps {
  headline: string;
  subheadline: string;
  caseStudies: CaseStudy[];
}

// Tech logo colors mapping
const techColors: Record<string, { bg: string; text: string; border: string }> = {
  'SAP S/4HANA': { bg: 'bg-[#0070F2]/20', text: 'text-[#60A5FA]', border: 'border-[#0070F2]/40' },
  'Python': { bg: 'bg-[#3776AB]/20', text: 'text-[#60A5FA]', border: 'border-[#3776AB]/40' },
  'Azure DevOps': { bg: 'bg-[#0078D4]/20', text: 'text-[#60A5FA]', border: 'border-[#0078D4]/40' },
  'Salesforce': { bg: 'bg-[#00A1E0]/20', text: 'text-[#38BDF8]', border: 'border-[#00A1E0]/40' },
  'Braze': { bg: 'bg-[#FF6B00]/20', text: 'text-[#FB923C]', border: 'border-[#FF6B00]/40' },
  'AWS': { bg: 'bg-[#FF9900]/20', text: 'text-[#FBBF24]', border: 'border-[#FF9900]/40' },
  'Databricks': { bg: 'bg-[#FF3621]/20', text: 'text-[#F87171]', border: 'border-[#FF3621]/40' },
  'Snowflake': { bg: 'bg-[#29B5E8]/20', text: 'text-[#38BDF8]', border: 'border-[#29B5E8]/40' },
  'Informatica IICS': { bg: 'bg-[#FF4B00]/20', text: 'text-[#FB923C]', border: 'border-[#FF4B00]/40' },
  'MDM': { bg: 'bg-[#6366F1]/20', text: 'text-[#A5B4FC]', border: 'border-[#6366F1]/40' },
  'Cloud Integration': { bg: 'bg-[#10B981]/20', text: 'text-[#34D399]', border: 'border-[#10B981]/40' },
};

function getTechStyle(tech: string) {
  return techColors[tech] || { bg: 'bg-[#C4FF61]/15', text: 'text-[#C4FF61]', border: 'border-[#C4FF61]/30' };
}

// Enhanced Case Study Card Component - Compact layout to fit viewport
function CaseStudyCard({
  study,
  isActive,
  index
}: {
  study: CaseStudy;
  isActive: boolean;
  index: number;
}) {
  return (
    <div
      className="flex-shrink-0 flex items-center justify-center px-4 sm:px-6 lg:px-8 snap-center"
      style={{
        width: '100vw',
        scrollSnapAlign: 'center',
      }}
    >
      <div
        className={`w-full max-w-4xl transition-all duration-500 ease-out ${
          isActive
            ? 'scale-100 opacity-100'
            : 'scale-[0.92] opacity-60'
        }`}
      >
        {/* Card Container with enhanced glassmorphism */}
        <div
          className={`relative overflow-hidden rounded-2xl transition-all duration-500 ${
            isActive ? 'shadow-2xl shadow-[#0052CC]/20' : 'shadow-xl'
          }`}
          style={{
            background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(15, 23, 42, 0.85) 100%)',
            backdropFilter: 'blur(20px)',
            border: isActive ? '1px solid rgba(196, 255, 97, 0.3)' : '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          {/* Animated glow effect for active card */}
          {isActive && (
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'radial-gradient(ellipse at 50% 0%, rgba(0, 82, 204, 0.15) 0%, transparent 60%)',
              }}
            />
          )}

          {/* Card Header - Compact */}
          <div className="relative px-5 py-4 md:px-6 md:py-5 border-b border-white/10">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                {/* Industry Badge + Title in same row on larger screens */}
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-white/5 border border-white/10 rounded-full">
                    <span className="w-1.5 h-1.5 bg-[#C4FF61] rounded-full" />
                    <span className="text-[10px] text-gray-400 uppercase tracking-wider font-medium">
                      {study.client_industry}
                    </span>
                  </div>
                  {study.playbook_used && (
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-[#0052CC]/15 border border-[#0052CC]/30 rounded-full">
                      <BookOpen className="w-3 h-3 text-[#60A5FA]" strokeWidth={1.5} />
                      <span className="text-[10px] text-[#60A5FA] font-medium">
                        {study.playbook_used}
                      </span>
                    </div>
                  )}
                </div>

                {/* Title */}
                <h3 className="text-xl md:text-2xl font-bold text-white leading-tight">
                  {study.title}
                </h3>
              </div>

              {/* Card Number */}
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-[#0052CC]/20 border border-[#0052CC]/30 flex items-center justify-center">
                <span className="text-base font-bold text-[#C4FF61]">
                  {String(index + 1).padStart(2, '0')}
                </span>
              </div>
            </div>
          </div>

          {/* Main Content - Compact Grid */}
          <div className="px-5 py-4 md:px-6 md:py-5">
            {/* Challenge Section - Compact */}
            <div className="mb-4">
              <p className="text-[10px] text-[#C4FF61] uppercase tracking-[0.15em] font-semibold mb-1.5 flex items-center gap-2">
                <span className="w-3 h-px bg-[#C4FF61]" />
                The Challenge
              </p>
              <p className="text-gray-300 text-sm leading-relaxed line-clamp-2">
                {study.challenge}
              </p>
            </div>

            {/* Metrics - Compact Hero Display */}
            <div className="mb-4">
              <p className="text-[10px] text-[#C4FF61] uppercase tracking-[0.15em] font-semibold mb-2 flex items-center gap-2">
                <span className="w-3 h-px bg-[#C4FF61]" />
                Results Delivered
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {study.metrics.slice(0, 4).map((metric, idx) => (
                  <div
                    key={idx}
                    className="relative p-3 rounded-lg bg-gradient-to-br from-white/5 to-transparent border border-white/10 group hover:border-[#C4FF61]/30 transition-all duration-300"
                  >
                    {/* Metric Value */}
                    <span className="text-xl md:text-2xl font-bold text-[#C4FF61] block leading-none mb-0.5">
                      {metric.value}
                    </span>
                    {/* Metric Label */}
                    <span className="text-[10px] text-gray-400 leading-tight block">
                      {metric.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tech Stack - Compact */}
            <div className="mb-4">
              <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-2">Technology Stack</p>
              <div className="flex flex-wrap gap-1.5">
                {study.technologies.slice(0, 5).map((tech) => {
                  const style = getTechStyle(tech);
                  return (
                    <span
                      key={tech}
                      className={`px-2 py-1 ${style.bg} ${style.text} border ${style.border} rounded text-[10px] font-medium`}
                    >
                      {tech}
                    </span>
                  );
                })}
                {study.technologies.length > 5 && (
                  <span className="px-2 py-1 bg-white/5 text-gray-400 border border-white/10 rounded text-[10px]">
                    +{study.technologies.length - 5} more
                  </span>
                )}
              </div>
            </div>

            {/* Testimonial + CTA Row - Compact */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-white/10">
              {/* Testimonial - Truncated */}
              {study.testimonial_quote && (
                <div className="flex-1 max-w-md">
                  <div className="relative pl-4">
                    <Quote className="absolute left-0 top-0 w-4 h-4 text-[#C4FF61]/40" strokeWidth={1.5} />
                    <p className="text-xs text-gray-400 italic leading-relaxed line-clamp-2">
                      "{study.testimonial_quote}"
                    </p>
                  </div>
                </div>
              )}

              {/* CTA Button */}
              <Link
                href={`/case-studies/${study.slug}`}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#0052CC] text-white text-sm font-semibold rounded-lg hover:text-[#C4FF61] transition-all duration-200 cursor-pointer group flex-shrink-0"
              >
                <span className="w-1.5 h-1.5 bg-[#C4FF61] rounded-full" />
                {study.cta_text || 'See Full Story'}
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" strokeWidth={2} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CaseStudiesCarousel({
  headline,
  subheadline,
  caseStudies,
}: CaseStudiesCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const isScrolling = useRef(false);

  const totalCards = caseStudies.length;

  // Handle horizontal scroll with native scroll-snap
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    const handleScroll = () => {
      if (isScrolling.current) return;

      const scrollLeft = scrollContainer.scrollLeft;
      const cardWidth = scrollContainer.offsetWidth;
      const newIndex = Math.round(scrollLeft / cardWidth);

      if (newIndex !== activeIndex && newIndex >= 0 && newIndex < totalCards) {
        setActiveIndex(newIndex);
      }
    };

    scrollContainer.addEventListener('scroll', handleScroll, { passive: true });
    return () => scrollContainer.removeEventListener('scroll', handleScroll);
  }, [activeIndex, totalCards]);

  // Navigate to specific card with smooth scroll
  const navigateToCard = useCallback((index: number) => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    isScrolling.current = true;
    const cardWidth = scrollContainer.offsetWidth;

    scrollContainer.scrollTo({
      left: index * cardWidth,
      behavior: 'smooth'
    });

    setActiveIndex(index);

    // Reset scrolling flag after animation
    setTimeout(() => {
      isScrolling.current = false;
    }, 500);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' && activeIndex > 0) {
        navigateToCard(activeIndex - 1);
      } else if (e.key === 'ArrowRight' && activeIndex < totalCards - 1) {
        navigateToCard(activeIndex + 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex, totalCards, navigateToCard]);

  // Touch/drag support for better mobile experience
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    touchEndX.current = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX.current;
    const threshold = 50;

    if (diff > threshold && activeIndex < totalCards - 1) {
      navigateToCard(activeIndex + 1);
    } else if (diff < -threshold && activeIndex > 0) {
      navigateToCard(activeIndex - 1);
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative py-12 md:py-16 lg:py-20"
    >
      {/* Background Image with enhanced overlay */}
      <div className="absolute inset-0">
        <Image
          src="/images/case-studies-bg.jpg"
          alt="ACI Infotech enterprise data transformation case studies background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 backdrop-blur-[3px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A1628]/90 via-[#0A1628]/80 to-[#0A1628]/90" />
      </div>

      {/* Ambient glow effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-30"
          style={{
            background: 'radial-gradient(circle, rgba(0, 82, 204, 0.4) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full opacity-20"
          style={{
            background: 'radial-gradient(circle, rgba(196, 255, 97, 0.3) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
      </div>

      {/* Content Container */}
      <div className="relative">
        {/* Header */}
        <div className="text-center pb-8 px-4">
          <p className="text-[#C4FF61] text-xs font-semibold uppercase tracking-[0.25em] mb-2">
            Success Stories
          </p>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3">
            {headline}
          </h2>
          <p className="text-sm md:text-base text-gray-400 max-w-2xl mx-auto">{subheadline}</p>
        </div>

        {/* Cards Carousel with native scroll-snap */}
        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto scrollbar-hide"
          style={{
            scrollSnapType: 'x mandatory',
            scrollBehavior: 'smooth',
            WebkitOverflowScrolling: 'touch',
            msOverflowStyle: 'none',
            scrollbarWidth: 'none',
          }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {caseStudies.map((study, index) => (
            <CaseStudyCard
              key={study.id}
              study={study}
              isActive={index === activeIndex}
              index={index}
            />
          ))}
        </div>

        {/* Navigation Controls */}
        <div className="pt-6 px-4">
          {/* Arrow Navigation */}
          <div className="flex items-center justify-center gap-4 mb-4">
            <button
              onClick={() => navigateToCard(Math.max(0, activeIndex - 1))}
              disabled={activeIndex === 0}
              className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-200 cursor-pointer ${
                activeIndex === 0
                  ? 'border-gray-700 text-gray-600 cursor-not-allowed'
                  : 'border-white/30 text-white hover:border-[#C4FF61] hover:text-[#C4FF61] hover:bg-white/5'
              }`}
              aria-label="Previous case study"
            >
              <ChevronLeft className="w-5 h-5" strokeWidth={1.5} />
            </button>

            {/* Clickable Dots */}
            <div className="flex items-center gap-2">
              {caseStudies.map((_, index) => (
                <button
                  key={index}
                  onClick={() => navigateToCard(index)}
                  className={`transition-all duration-300 rounded-full cursor-pointer ${
                    index === activeIndex
                      ? 'w-8 h-2 bg-[#C4FF61]'
                      : 'w-2 h-2 bg-gray-600 hover:bg-gray-500'
                  }`}
                  aria-label={`Go to case study ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={() => navigateToCard(Math.min(totalCards - 1, activeIndex + 1))}
              disabled={activeIndex === totalCards - 1}
              className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-200 cursor-pointer ${
                activeIndex === totalCards - 1
                  ? 'border-gray-700 text-gray-600 cursor-not-allowed'
                  : 'border-white/30 text-white hover:border-[#C4FF61] hover:text-[#C4FF61] hover:bg-white/5'
              }`}
              aria-label="Next case study"
            >
              <ChevronRight className="w-5 h-5" strokeWidth={1.5} />
            </button>
          </div>

          {/* Card Counter */}
          <div className="text-center mb-4">
            <span className="text-sm text-gray-500">
              <span className="text-[#C4FF61] font-semibold">{String(activeIndex + 1).padStart(2, '0')}</span>
              <span className="mx-2">/</span>
              <span>{String(totalCards).padStart(2, '0')}</span>
            </span>
          </div>

          {/* Footer CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6">
            <p className="text-gray-400 text-sm">
              Can&apos;t find your exact scenario?
            </p>
            <div className="flex gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#0052CC] text-white text-sm font-semibold rounded-lg hover:text-[#C4FF61] transition-all duration-200 cursor-pointer"
              >
                Talk to an Architect
              </Link>
              <Link
                href="/case-studies"
                className="inline-flex items-center gap-2 px-4 py-2 bg-transparent border border-white text-white text-sm font-semibold rounded-lg hover:border-[#C4FF61] hover:text-[#C4FF61] transition-all duration-200 cursor-pointer group"
              >
                See All Stories
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
