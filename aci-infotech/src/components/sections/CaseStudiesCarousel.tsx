'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, BookOpen, Quote } from 'lucide-react';

// Note: Image import kept for background image usage

interface CaseStudyMetric {
  value: string;
  label: string;
  description?: string;
}

interface CaseStudy {
  id: string;
  slug: string;
  title: string; // Short, impactful headline for the case study
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

// Compact Case Study Card Component
function CaseStudyCard({ study }: { study: CaseStudy }) {
  return (
    <div className="w-screen flex-shrink-0 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-3xl">
        <div className="bg-gray-900/70 backdrop-blur-md rounded-sm border border-gray-700/50 overflow-hidden shadow-2xl">
          {/* Card Header - Compact */}
          <div className="p-4 md:p-5 border-b border-gray-700/50">
            <div className="flex items-center justify-between gap-4 mb-3">
              <h3 className="text-xl md:text-2xl font-bold text-white leading-tight">
                {study.title}
              </h3>
              <span className="text-xs text-gray-400 bg-gray-800/50 px-2 py-1 rounded-sm flex-shrink-0">
                {study.client_industry}
              </span>
            </div>

            {/* Playbook Badge - Compact */}
            {study.playbook_used && (
              <div className="flex items-center gap-2 mb-3 px-3 py-1.5 bg-[#0052CC]/15 border border-[#0052CC]/30 rounded-sm w-fit">
                <BookOpen className="w-3.5 h-3.5 text-[#3B82F6]" />
                <span className="text-xs text-[#3B82F6]">
                  Used: {study.playbook_used}
                  {study.playbook_count && (
                    <span className="text-gray-500"> ({study.playbook_count}x)</span>
                  )}
                </span>
              </div>
            )}

            {/* The Problem - Compact */}
            <div>
              <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">The Problem</p>
              <p className="text-gray-300 text-sm leading-relaxed">
                {study.challenge}
              </p>
            </div>
          </div>

          {/* Results Section - Compact */}
          <div className="p-4 md:p-5">
            <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-2">What Changed</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              {study.metrics.slice(0, 4).map((metric, idx) => (
                <div key={idx} className="text-left">
                  <span className="text-base md:text-lg font-bold text-[#C4FF61] block leading-tight">
                    {metric.value}
                  </span>
                  <span className="text-xs text-gray-400">{metric.label}</span>
                </div>
              ))}
            </div>

            {/* Tech Stack - Compact */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="text-[10px] text-gray-500 uppercase tracking-wider">Stack:</span>
              {study.technologies.map((tech) => {
                const style = getTechStyle(tech);
                return (
                  <span
                    key={tech}
                    className={`px-2 py-1 ${style.bg} ${style.text} border ${style.border} rounded-sm text-xs font-medium`}
                  >
                    {tech}
                  </span>
                );
              })}
            </div>

            {/* Mini Quote + CTA Row */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
              {study.testimonial_quote && (
                <div className="flex-1 flex items-start gap-2 max-w-md">
                  <Quote className="w-4 h-4 text-[#C4FF61]/50 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-gray-400 italic line-clamp-2">
                    "{study.testimonial_quote}"
                  </p>
                </div>
              )}
              <Link
                href={`/case-studies/${study.slug}`}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#0052CC] text-white text-sm font-semibold rounded-lg hover:text-[#C4FF61] transition-all duration-200 cursor-pointer group flex-shrink-0"
              >
                {study.cta_text || 'See the System'}
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
  const [scrollProgress, setScrollProgress] = useState(0);

  const totalCards = caseStudies.length;

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const container = containerRef.current;
      const rect = container.getBoundingClientRect();
      const containerHeight = container.offsetHeight;
      const viewportHeight = window.innerHeight;

      // Calculate scroll progress through this section
      // Progress = 0 when section top hits viewport top
      // Progress = 1 when section bottom hits viewport bottom
      const scrollableDistance = containerHeight - viewportHeight;
      const scrolled = -rect.top;

      const progress = Math.max(0, Math.min(1, scrolled / scrollableDistance));
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Calculate horizontal offset based on scroll progress
  // At progress 0, show card 0 (translateX = 0)
  // At progress 1, show last card (translateX = -(totalCards-1) * 100vw)
  const translateX = -scrollProgress * (totalCards - 1) * 100;

  // Calculate which card is currently most visible (for indicators)
  const activeIndex = Math.round(scrollProgress * (totalCards - 1));

  return (
    <div
      ref={containerRef}
      className="relative"
      style={{ height: `${totalCards * 100}vh` }}
    >
      {/* Sticky Container */}
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Background Image with Blur and Dark Overlay */}
        <div className="absolute inset-0">
          <Image
            src="/images/case-studies-bg.jpg"
            alt="ACI Infotech enterprise data transformation case studies background"
            fill
            className="object-cover"
            priority
          />
          {/* Blur overlay */}
          <div className="absolute inset-0 backdrop-blur-[2px]" />
          {/* Dark overlay - reduced opacity for more image visibility */}
          <div className="absolute inset-0 bg-[#0A1628]/70" />
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
              className="absolute w-1 h-1 bg-white/20 rounded-full animate-pulse"
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
          {/* Header - Compact */}
          <div className="text-center pt-8 pb-4 px-4">
            <p className="text-[#C4FF61] text-xs font-semibold uppercase tracking-[0.2em] mb-1">
              Case Studies
            </p>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2">
              {headline}
            </h2>
            <p className="text-sm md:text-base text-gray-400 max-w-2xl mx-auto">{subheadline}</p>
          </div>

          {/* Cards Strip - Horizontal scroll linked to vertical scroll */}
          <div className="flex-1 flex items-center overflow-hidden">
            <div
              className="flex"
              style={{
                transform: `translateX(${translateX}vw)`,
                width: `${totalCards * 100}vw`,
              }}
            >
              {caseStudies.map((study) => (
                <CaseStudyCard key={study.id} study={study} />
              ))}
            </div>
          </div>

          {/* Progress Indicators + Footer */}
          <div className="pb-6 px-4">
            {/* Dots */}
            <div className="flex justify-center gap-2 mb-3">
              {caseStudies.map((_, index) => (
                <div
                  key={index}
                  className={`transition-all duration-200 rounded-full ${
                    index === activeIndex
                      ? 'w-6 h-1.5 bg-[#C4FF61]'
                      : index < activeIndex
                      ? 'w-1.5 h-1.5 bg-[#C4FF61]/50'
                      : 'w-1.5 h-1.5 bg-gray-600'
                  }`}
                />
              ))}
            </div>

            {/* Progress Bar */}
            <div className="max-w-[200px] mx-auto mb-4">
              <div className="h-0.5 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#C4FF61]"
                  style={{ width: `${scrollProgress * 100}%` }}
                />
              </div>
            </div>

            {/* Footer CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6">
              <p className="text-gray-400 text-sm">
                Can't find your exact scenario?
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
    </div>
  );
}
