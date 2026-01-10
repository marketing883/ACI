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

// Enhanced Case Study Card Component
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
      className="flex-shrink-0 flex items-center justify-center px-4 sm:px-6 lg:px-8"
      style={{ width: '100vw' }}
    >
      <div
        className="w-full max-w-4xl"
        style={{
          transform: isActive ? 'scale(1) translateY(0)' : 'scale(0.92) translateY(6px)',
          opacity: isActive ? 1 : 0.5,
          transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Card Container */}
        <div
          className="relative overflow-hidden rounded-2xl"
          style={{
            background: isActive
              ? 'linear-gradient(135deg, rgba(15, 23, 42, 0.98) 0%, rgba(10, 22, 40, 0.95) 100%)'
              : 'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(15, 23, 42, 0.8) 100%)',
            backdropFilter: 'blur(20px)',
            border: isActive ? '2px solid rgba(196, 255, 97, 0.5)' : '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: isActive
              ? '0 25px 60px -12px rgba(0, 82, 204, 0.35), 0 0 40px rgba(196, 255, 97, 0.1)'
              : '0 10px 40px -15px rgba(0, 0, 0, 0.4)',
            transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          {/* Animated glow effect for active card */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at 50% 0%, rgba(0, 82, 204, 0.2) 0%, transparent 60%)',
              opacity: isActive ? 1 : 0,
              transition: 'opacity 0.6s ease-out',
            }}
          />

          {/* Card Header */}
          <div className="relative px-5 py-4 md:px-6 md:py-4 border-b border-white/10">
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                {/* Industry Badge + Playbook */}
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

          {/* Main Content */}
          <div className="px-5 py-4 md:px-6">
            {/* Challenge Section */}
            <div className="mb-4">
              <p className="text-[10px] text-[#C4FF61] uppercase tracking-[0.15em] font-semibold mb-1.5 flex items-center gap-2">
                <span className="w-3 h-px bg-[#C4FF61]" />
                The Challenge
              </p>
              <p className="text-gray-300 text-sm leading-relaxed line-clamp-2">
                {study.challenge}
              </p>
            </div>

            {/* Metrics Grid */}
            <div className="mb-4">
              <p className="text-[10px] text-[#C4FF61] uppercase tracking-[0.15em] font-semibold mb-2 flex items-center gap-2">
                <span className="w-3 h-px bg-[#C4FF61]" />
                Results Delivered
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {study.metrics.slice(0, 4).map((metric, idx) => (
                  <div
                    key={idx}
                    className="relative p-3 rounded-lg bg-gradient-to-br from-white/5 to-transparent border border-white/10"
                  >
                    <span className="text-xl md:text-2xl font-bold text-[#C4FF61] block leading-none">
                      {metric.value}
                    </span>
                    <span className="text-[10px] text-gray-400 leading-tight block mt-1">
                      {metric.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tech Stack */}
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
                    +{study.technologies.length - 5}
                  </span>
                )}
              </div>
            </div>

            {/* Testimonial + CTA Row */}
            <div className="flex items-center justify-between gap-4 pt-3 border-t border-white/10">
              {/* Testimonial */}
              {study.testimonial_quote && (
                <div className="flex-1 min-w-0">
                  <div className="relative pl-4">
                    <Quote className="absolute left-0 top-0 w-4 h-4 text-[#C4FF61]/40" strokeWidth={1.5} />
                    <p className="text-xs text-gray-400 italic leading-relaxed line-clamp-2">
                      &quot;{study.testimonial_quote}&quot;
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
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" strokeWidth={2} />
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
  const [activeIndex, setActiveIndex] = useState(0);
  const [displayProgress, setDisplayProgress] = useState(0);
  const targetProgressRef = useRef(0);
  const isSnappingRef = useRef(false);
  const snapTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const totalCards = caseStudies.length;

  // Smooth interpolation using requestAnimationFrame
  const lerp = (start: number, end: number, factor: number) => {
    return start + (end - start) * factor;
  };

  // Animation loop - runs continuously while there's movement
  useEffect(() => {
    let rafId: number | null = null;

    const animate = () => {
      const diff = Math.abs(targetProgressRef.current - displayProgress);

      if (diff > 0.0001) {
        // Use different smoothing factors for snapping vs free scrolling
        const smoothingFactor = isSnappingRef.current ? 0.08 : 0.12;
        const newProgress = lerp(displayProgress, targetProgressRef.current, smoothingFactor);
        setDisplayProgress(newProgress);
      }

      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);

    return () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [displayProgress]);

  // Calculate snapped position for a card
  const getSnappedProgress = useCallback((rawProgress: number) => {
    if (totalCards <= 1) return 0;
    const cardWidth = 1 / (totalCards - 1);
    const nearestCard = Math.round(rawProgress / cardWidth);
    return Math.max(0, Math.min(1, nearestCard * cardWidth));
  }, [totalCards]);

  // Handle vertical scroll
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const container = containerRef.current;
      const rect = container.getBoundingClientRect();
      const containerHeight = container.offsetHeight;
      const viewportHeight = window.innerHeight;

      const scrollableDistance = containerHeight - viewportHeight;
      const scrolled = -rect.top;

      const rawProgress = Math.max(0, Math.min(1, scrolled / scrollableDistance));

      // Update target progress
      targetProgressRef.current = rawProgress;
      isSnappingRef.current = false;

      // Calculate active card - must align with translateX calculation
      // translateX = -progress * (totalCards - 1) * 100vw
      // So at progress 0.5 with 3 cards, translateX = -100vw (card index 1)
      const newActiveIndex = Math.min(
        totalCards - 1,
        Math.max(0, Math.round(rawProgress * (totalCards - 1)))
      );
      setActiveIndex(newActiveIndex);

      // Clear existing snap timeout
      if (snapTimeoutRef.current) {
        clearTimeout(snapTimeoutRef.current);
      }

      // Snap to nearest card after scroll stops
      snapTimeoutRef.current = setTimeout(() => {
        isSnappingRef.current = true;
        targetProgressRef.current = getSnappedProgress(rawProgress);
      }, 150);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (snapTimeoutRef.current) {
        clearTimeout(snapTimeoutRef.current);
      }
    };
  }, [totalCards, getSnappedProgress]);

  // Navigate to specific card
  const navigateToCard = useCallback((index: number) => {
    if (!containerRef.current) return;

    const containerHeight = containerRef.current.offsetHeight;
    const viewportHeight = window.innerHeight;
    const scrollableDistance = containerHeight - viewportHeight;

    const targetProgress = totalCards > 1 ? index / (totalCards - 1) : 0;
    const targetScroll = containerRef.current.offsetTop + (targetProgress * scrollableDistance);

    window.scrollTo({
      top: targetScroll,
      behavior: 'smooth'
    });
  }, [totalCards]);

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

  // Calculate horizontal offset with smooth interpolation
  const translateX = totalCards > 1 ? -displayProgress * (totalCards - 1) * 100 : 0;

  return (
    <div
      ref={containerRef}
      className="relative"
      style={{ height: `${Math.max(totalCards * 100, 200)}vh` }}
    >
      {/* Sticky Container */}
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Background Image with enhanced overlay */}
        <div className="absolute inset-0">
          <Image
            src="/images/case-studies-bg.jpg"
            alt="ACI Infotech enterprise data transformation case studies background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 backdrop-blur-[2px]" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0A1628]/85 via-[#0A1628]/75 to-[#0A1628]/85" />
        </div>

        {/* Ambient glow effects */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full opacity-25"
            style={{
              background: 'radial-gradient(circle, rgba(0, 82, 204, 0.5) 0%, transparent 70%)',
              filter: 'blur(80px)',
              transform: `translate(${displayProgress * 100}px, 0)`,
              transition: 'transform 0.3s ease-out',
            }}
          />
          <div
            className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full opacity-20"
            style={{
              background: 'radial-gradient(circle, rgba(196, 255, 97, 0.4) 0%, transparent 70%)',
              filter: 'blur(60px)',
              transform: `translate(${-displayProgress * 80}px, 0)`,
              transition: 'transform 0.3s ease-out',
            }}
          />
        </div>

        {/* Constellation dots */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[
            { left: '5%', top: '10%', delay: '0s', duration: '3s' },
            { left: '15%', top: '80%', delay: '0.5s', duration: '4s' },
            { left: '25%', top: '30%', delay: '1s', duration: '3.5s' },
            { left: '55%', top: '85%', delay: '0.3s', duration: '4s' },
            { left: '85%', top: '25%', delay: '0.8s', duration: '3.3s' },
            { left: '95%', top: '55%', delay: '1.8s', duration: '4.8s' },
          ].map((dot, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white/30 rounded-full animate-pulse"
              style={{
                left: dot.left,
                top: dot.top,
                animationDelay: dot.delay,
                animationDuration: dot.duration,
              }}
            />
          ))}
        </div>

        {/* Content Container */}
        <div className="relative h-full flex flex-col">
          {/* Header */}
          <div className="text-center pt-6 pb-3 px-4 flex-shrink-0">
            <p className="text-[#C4FF61] text-xs font-semibold uppercase tracking-[0.25em] mb-2">
              Success Stories
            </p>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2">
              {headline}
            </h2>
            <p className="text-sm md:text-base text-gray-400 max-w-2xl mx-auto">{subheadline}</p>
          </div>

          {/* Cards Strip with smooth transition */}
          <div className="flex-1 flex items-center overflow-hidden min-h-0">
            <div
              className="flex will-change-transform"
              style={{
                transform: `translateX(${translateX}vw)`,
                width: `${totalCards * 100}vw`,
              }}
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
          </div>

          {/* Navigation Controls - Minimal */}
          <div className="pb-4 px-4 flex-shrink-0">
            {/* Thin Progress Bar */}
            <div className="max-w-sm mx-auto mb-3">
              <div className="h-[2px] bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#0052CC] to-[#C4FF61] rounded-full"
                  style={{
                    width: `${((displayProgress * (totalCards - 1)) + 1) / totalCards * 100}%`,
                    transition: 'width 0.1s ease-out',
                  }}
                />
              </div>
            </div>

            {/* Arrow Navigation + Dots only */}
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => navigateToCard(Math.max(0, activeIndex - 1))}
                disabled={activeIndex === 0}
                className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all duration-300 cursor-pointer ${
                  activeIndex === 0
                    ? 'border-gray-700 text-gray-600 cursor-not-allowed'
                    : 'border-white/30 text-white hover:border-[#C4FF61] hover:text-[#C4FF61]'
                }`}
                aria-label="Previous case study"
              >
                <ChevronLeft className="w-5 h-5" strokeWidth={1.5} />
              </button>

              {/* Dots only */}
              <div className="flex items-center gap-2">
                {caseStudies.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => navigateToCard(index)}
                    className={`transition-all duration-500 rounded-full cursor-pointer ${
                      index === activeIndex
                        ? 'w-8 h-2 bg-[#C4FF61]'
                        : 'w-2 h-2 bg-gray-600 hover:bg-gray-400'
                    }`}
                    aria-label={`Go to case study ${index + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={() => navigateToCard(Math.min(totalCards - 1, activeIndex + 1))}
                disabled={activeIndex === totalCards - 1}
                className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all duration-300 cursor-pointer ${
                  activeIndex === totalCards - 1
                    ? 'border-gray-700 text-gray-600 cursor-not-allowed'
                    : 'border-white/30 text-white hover:border-[#C4FF61] hover:text-[#C4FF61]'
                }`}
                aria-label="Next case study"
              >
                <ChevronRight className="w-5 h-5" strokeWidth={1.5} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
