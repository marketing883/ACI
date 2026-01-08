'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ChevronLeft, ChevronRight, BookOpen, Quote } from 'lucide-react';

interface CaseStudyMetric {
  value: string;
  label: string;
  description?: string;
}

interface CaseStudy {
  id: string;
  slug: string;
  client_name: string;
  client_logo?: string;
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
  'SAP S/4HANA': { bg: 'bg-[#0070F2]/10', text: 'text-[#0070F2]', border: 'border-[#0070F2]/30' },
  'Python': { bg: 'bg-[#3776AB]/10', text: 'text-[#3776AB]', border: 'border-[#3776AB]/30' },
  'Azure DevOps': { bg: 'bg-[#0078D4]/10', text: 'text-[#0078D4]', border: 'border-[#0078D4]/30' },
  'Salesforce': { bg: 'bg-[#00A1E0]/10', text: 'text-[#00A1E0]', border: 'border-[#00A1E0]/30' },
  'Braze': { bg: 'bg-[#FF6B00]/10', text: 'text-[#FF6B00]', border: 'border-[#FF6B00]/30' },
  'AWS': { bg: 'bg-[#FF9900]/10', text: 'text-[#FF9900]', border: 'border-[#FF9900]/30' },
  'Databricks': { bg: 'bg-[#FF3621]/10', text: 'text-[#FF3621]', border: 'border-[#FF3621]/30' },
  'Snowflake': { bg: 'bg-[#29B5E8]/10', text: 'text-[#29B5E8]', border: 'border-[#29B5E8]/30' },
  'Informatica IICS': { bg: 'bg-[#FF4B00]/10', text: 'text-[#FF4B00]', border: 'border-[#FF4B00]/30' },
  'MDM': { bg: 'bg-[#6366F1]/10', text: 'text-[#6366F1]', border: 'border-[#6366F1]/30' },
  'Cloud Integration': { bg: 'bg-[#10B981]/10', text: 'text-[#10B981]', border: 'border-[#10B981]/30' },
};

function getTechStyle(tech: string) {
  return techColors[tech] || { bg: 'bg-[#C4FF61]/10', text: 'text-[#C4FF61]', border: 'border-[#C4FF61]/30' };
}

export default function CaseStudiesCarousel({
  headline,
  subheadline,
  caseStudies,
}: CaseStudiesCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollState = useCallback(() => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);

      // Calculate active index based on scroll position
      const cardWidth = scrollRef.current.children[0]?.clientWidth || 400;
      const gap = 24; // gap-6 = 24px
      const newIndex = Math.round(scrollLeft / (cardWidth + gap));
      setActiveIndex(Math.min(newIndex, caseStudies.length - 1));
    }
  }, [caseStudies.length]);

  useEffect(() => {
    const scrollEl = scrollRef.current;
    if (scrollEl) {
      scrollEl.addEventListener('scroll', updateScrollState);
      updateScrollState();
      return () => scrollEl.removeEventListener('scroll', updateScrollState);
    }
  }, [updateScrollState]);

  const scrollToIndex = (index: number) => {
    if (scrollRef.current && scrollRef.current.children[0]) {
      const cardWidth = (scrollRef.current.children[0] as HTMLElement).clientWidth;
      const gap = 24;
      scrollRef.current.scrollTo({
        left: index * (cardWidth + gap),
        behavior: 'smooth',
      });
    }
  };

  const scrollLeft = () => {
    if (activeIndex > 0) {
      scrollToIndex(activeIndex - 1);
    }
  };

  const scrollRight = () => {
    if (activeIndex < caseStudies.length - 1) {
      scrollToIndex(activeIndex + 1);
    }
  };

  return (
    <section className="relative py-20 bg-[#0A1628] overflow-hidden">
      {/* Subtle grid background */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(to right, #fff 1px, transparent 1px),
              linear-gradient(to bottom, #fff 1px, transparent 1px)
            `,
            backgroundSize: '48px 48px',
          }}
        />
      </div>

      {/* Animated constellation dots */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/10 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      <div className="relative max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-[#C4FF61] text-xs font-semibold uppercase tracking-[0.2em] mb-2">
            Case Studies
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            {headline}
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">{subheadline}</p>
        </div>

        {/* Navigation Arrows */}
        <div className="hidden md:flex justify-end gap-2 mb-6 pr-4">
          <button
            onClick={scrollLeft}
            disabled={!canScrollLeft}
            className={`p-2 rounded-sm border-2 transition-all duration-200 ${
              canScrollLeft
                ? 'border-[#C4FF61]/50 text-[#C4FF61] hover:bg-[#C4FF61]/10 hover:border-[#C4FF61]'
                : 'border-gray-700 text-gray-600 cursor-not-allowed'
            }`}
            aria-label="Previous case study"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={scrollRight}
            disabled={!canScrollRight}
            className={`p-2 rounded-sm border-2 transition-all duration-200 ${
              canScrollRight
                ? 'border-[#C4FF61]/50 text-[#C4FF61] hover:bg-[#C4FF61]/10 hover:border-[#C4FF61]'
                : 'border-gray-700 text-gray-600 cursor-not-allowed'
            }`}
            aria-label="Next case study"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Carousel Container */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {caseStudies.map((study, index) => (
            <div
              key={study.id}
              className="flex-shrink-0 w-[340px] md:w-[400px] lg:w-[440px] snap-start"
            >
              <div className="h-full bg-gray-800/50 backdrop-blur-sm rounded-sm border border-gray-700/50 overflow-hidden hover:border-[#C4FF61]/30 transition-all duration-300 group">
                {/* Card Header */}
                <div className="p-6 border-b border-gray-700/50">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {study.client_logo ? (
                        <div className="relative w-16 h-10 bg-white/5 rounded-sm p-1">
                          <Image
                            src={study.client_logo}
                            alt={study.client_name}
                            fill
                            className="object-contain brightness-0 invert opacity-90"
                          />
                        </div>
                      ) : (
                        <span className="text-xl font-bold text-white">{study.client_name}</span>
                      )}
                    </div>
                    <span className="text-xs text-gray-400 bg-gray-700/50 px-2 py-1 rounded-sm">
                      {study.client_industry}
                    </span>
                  </div>

                  {/* Playbook Badge */}
                  {study.playbook_used && (
                    <div className="flex items-center gap-2 mb-4 px-3 py-2 bg-[#0052CC]/10 border border-[#0052CC]/30 rounded-sm">
                      <BookOpen className="w-4 h-4 text-[#0052CC]" />
                      <span className="text-xs text-[#3B82F6]">
                        Used: {study.playbook_used}
                        {study.playbook_count && (
                          <span className="text-gray-500"> ({study.playbook_count}x)</span>
                        )}
                      </span>
                    </div>
                  )}

                  {/* The Problem */}
                  <div className="mb-2">
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">The Problem</p>
                    <p className="text-gray-300 text-sm leading-relaxed line-clamp-3">
                      {study.challenge}
                    </p>
                  </div>
                </div>

                {/* Results Section */}
                <div className="p-6">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">What Changed</p>
                  <div className="grid grid-cols-2 gap-3 mb-5">
                    {study.metrics.slice(0, 4).map((metric, idx) => (
                      <div key={idx} className="text-left">
                        <span className="text-lg md:text-xl font-bold text-[#C4FF61] block leading-tight">
                          {metric.value}
                        </span>
                        <span className="text-xs text-gray-400">{metric.label}</span>
                      </div>
                    ))}
                  </div>

                  {/* Tech Stack - Larger, Colorful */}
                  <div className="mb-5">
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Stack</p>
                    <div className="flex flex-wrap gap-2">
                      {study.technologies.slice(0, 4).map((tech) => {
                        const style = getTechStyle(tech);
                        return (
                          <span
                            key={tech}
                            className={`px-3 py-1.5 ${style.bg} ${style.text} border ${style.border} rounded-sm text-sm font-medium`}
                          >
                            {tech}
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  {/* Mini Quote Snippet */}
                  {study.testimonial_quote && (
                    <div className="mb-5 p-3 bg-gray-700/30 rounded-sm border-l-2 border-[#C4FF61]/50">
                      <Quote className="w-4 h-4 text-[#C4FF61]/50 mb-1" />
                      <p className="text-xs text-gray-400 italic line-clamp-2">
                        "{study.testimonial_quote}"
                      </p>
                    </div>
                  )}

                  {/* CTA Button */}
                  <Link
                    href={`/case-studies/${study.slug}`}
                    className="inline-flex items-center gap-2 text-[#C4FF61] text-sm font-semibold group-hover:gap-3 transition-all duration-200"
                  >
                    {study.cta_text || 'See the Full Story'}
                    <ArrowRight className="w-4 h-4" strokeWidth={2} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Scroll Indicators (Dots) */}
        <div className="flex justify-center gap-2 mt-8">
          {caseStudies.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollToIndex(index)}
              className={`transition-all duration-300 rounded-full ${
                index === activeIndex
                  ? 'w-8 h-2 bg-[#C4FF61]'
                  : 'w-2 h-2 bg-gray-600 hover:bg-gray-500'
              }`}
              aria-label={`Go to case study ${index + 1}`}
            />
          ))}
        </div>

        {/* Section Footer CTAs */}
        <div className="mt-12 pt-8 border-t border-gray-700/50">
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
            <p className="text-gray-400 text-center md:text-left">
              Can't find your exact scenario?
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#0052CC] text-white font-semibold rounded-sm hover:bg-[#003D99] hover:text-[#C4FF61] transition-all duration-200"
              >
                Talk to an Architect
              </Link>
              <Link
                href="/case-studies"
                className="inline-flex items-center gap-2 px-6 py-3 border-2 border-gray-600 text-white font-semibold rounded-sm hover:border-[#C4FF61] hover:text-[#C4FF61] transition-all duration-200 group"
              >
                See All Stories
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Hide scrollbar CSS */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}
