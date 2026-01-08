'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, BookOpen, Quote } from 'lucide-react';

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

// Single Case Study Card Component
function CaseStudyCard({ study, isActive }: { study: CaseStudy; isActive: boolean }) {
  return (
    <div
      className={`
        absolute inset-0 flex items-center justify-center px-4 sm:px-6 lg:px-8
        transition-all duration-700 ease-out
        ${isActive ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full pointer-events-none'}
      `}
    >
      <div className="w-full max-w-4xl">
        <div className="bg-gray-900/80 backdrop-blur-md rounded-sm border border-gray-700/50 overflow-hidden shadow-2xl">
          {/* Card Header */}
          <div className="p-6 md:p-8 border-b border-gray-700/50">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
              <div className="flex items-center gap-4">
                {study.client_logo ? (
                  <div className="relative w-20 h-12 bg-white/10 rounded-sm p-2">
                    <Image
                      src={study.client_logo}
                      alt={study.client_name}
                      fill
                      className="object-contain brightness-0 invert opacity-90"
                    />
                  </div>
                ) : (
                  <span className="text-2xl font-bold text-white">{study.client_name}</span>
                )}
              </div>
              <span className="text-sm text-gray-400 bg-gray-800/50 px-3 py-1.5 rounded-sm self-start">
                {study.client_industry}
              </span>
            </div>

            {/* Playbook Badge */}
            {study.playbook_used && (
              <div className="flex items-center gap-2 mb-5 px-4 py-2.5 bg-[#0052CC]/15 border border-[#0052CC]/30 rounded-sm w-fit">
                <BookOpen className="w-4 h-4 text-[#3B82F6]" />
                <span className="text-sm text-[#3B82F6]">
                  Used: {study.playbook_used}
                  {study.playbook_count && (
                    <span className="text-gray-500"> ({study.playbook_count}x)</span>
                  )}
                </span>
              </div>
            )}

            {/* The Problem */}
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">The Problem</p>
              <p className="text-gray-300 text-lg leading-relaxed">
                {study.challenge}
              </p>
            </div>
          </div>

          {/* Results Section */}
          <div className="p-6 md:p-8">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-4">What Changed</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {study.metrics.slice(0, 4).map((metric, idx) => (
                <div key={idx} className="text-left">
                  <span className="text-xl md:text-2xl font-bold text-[#C4FF61] block leading-tight">
                    {metric.value}
                  </span>
                  <span className="text-sm text-gray-400">{metric.label}</span>
                </div>
              ))}
            </div>

            {/* Tech Stack */}
            <div className="mb-6">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">Stack</p>
              <div className="flex flex-wrap gap-2">
                {study.technologies.map((tech) => {
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
              <div className="mb-6 p-4 bg-gray-800/50 rounded-sm border-l-2 border-[#C4FF61]/50">
                <Quote className="w-5 h-5 text-[#C4FF61]/50 mb-2" />
                <p className="text-sm text-gray-400 italic leading-relaxed">
                  "{study.testimonial_quote}"
                </p>
              </div>
            )}

            {/* CTA Button */}
            <Link
              href={`/case-studies/${study.slug}`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#0052CC] text-white font-semibold rounded-sm hover:bg-[#003D99] hover:text-[#C4FF61] transition-all duration-200 group"
            >
              {study.cta_text || 'See the Full Story'}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" strokeWidth={2} />
            </Link>
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
  const [scrollProgress, setScrollProgress] = useState(0);

  const totalCards = caseStudies.length;

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const container = containerRef.current;
      const rect = container.getBoundingClientRect();
      const containerHeight = container.offsetHeight;
      const viewportHeight = window.innerHeight;

      // Calculate how far we've scrolled through the section
      // Start tracking when section enters viewport
      const scrollStart = -viewportHeight; // When bottom of section reaches top of viewport
      const scrollEnd = containerHeight - viewportHeight; // When we've scrolled through the entire section
      const scrollRange = scrollEnd - scrollStart;

      // Current scroll position relative to the section
      const currentScroll = -rect.top;

      // Progress from 0 to 1
      const progress = Math.max(0, Math.min(1, (currentScroll - scrollStart) / scrollRange));
      setScrollProgress(progress);

      // Calculate which card should be active
      // Divide progress into segments for each card
      const cardProgress = progress * totalCards;
      const newIndex = Math.min(Math.floor(cardProgress), totalCards - 1);
      setActiveIndex(newIndex);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, [totalCards]);

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
            alt=""
            fill
            className="object-cover"
            priority
          />
          {/* Blur overlay */}
          <div className="absolute inset-0 backdrop-blur-sm" />
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-[#0A1628]/85" />
        </div>

        {/* Constellation dots */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[
            { left: '5%', top: '10%', delay: '0s', duration: '3s' },
            { left: '15%', top: '80%', delay: '0.5s', duration: '4s' },
            { left: '25%', top: '30%', delay: '1s', duration: '3.5s' },
            { left: '35%', top: '60%', delay: '1.5s', duration: '4.5s' },
            { left: '45%', top: '15%', delay: '2s', duration: '3s' },
            { left: '55%', top: '85%', delay: '0.3s', duration: '4s' },
            { left: '65%', top: '45%', delay: '1.2s', duration: '3.8s' },
            { left: '75%', top: '70%', delay: '2.5s', duration: '4.2s' },
            { left: '85%', top: '25%', delay: '0.8s', duration: '3.3s' },
            { left: '95%', top: '55%', delay: '1.8s', duration: '4.8s' },
          ].map((dot, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white/10 rounded-full animate-pulse"
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
          <div className="text-center pt-16 pb-8 px-4">
            <p className="text-[#C4FF61] text-xs font-semibold uppercase tracking-[0.2em] mb-2">
              Case Studies
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              {headline}
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">{subheadline}</p>
          </div>

          {/* Cards Container */}
          <div className="flex-1 relative">
            {caseStudies.map((study, index) => (
              <CaseStudyCard
                key={study.id}
                study={study}
                isActive={index === activeIndex}
              />
            ))}
          </div>

          {/* Progress Indicators */}
          <div className="pb-8">
            {/* Dots */}
            <div className="flex justify-center gap-3 mb-4">
              {caseStudies.map((_, index) => (
                <div
                  key={index}
                  className={`transition-all duration-300 rounded-full ${
                    index === activeIndex
                      ? 'w-8 h-2 bg-[#C4FF61]'
                      : index < activeIndex
                      ? 'w-2 h-2 bg-[#C4FF61]/50'
                      : 'w-2 h-2 bg-gray-600'
                  }`}
                />
              ))}
            </div>

            {/* Progress Bar */}
            <div className="max-w-xs mx-auto px-4">
              <div className="h-0.5 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#C4FF61] transition-all duration-150 ease-out"
                  style={{ width: `${scrollProgress * 100}%` }}
                />
              </div>
            </div>

            {/* Scroll hint */}
            {activeIndex < totalCards - 1 && (
              <p className="text-center text-gray-500 text-sm mt-4 animate-pulse">
                Scroll to see more
              </p>
            )}
          </div>

          {/* Section Footer CTAs - Show after last card */}
          {activeIndex === totalCards - 1 && (
            <div className="absolute bottom-24 left-0 right-0 px-4">
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
          )}
        </div>
      </div>
    </div>
  );
}
