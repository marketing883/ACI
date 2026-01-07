'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import Button from '@/components/ui/Button';

interface CaseStudy {
  slug: string;
  client: string;
  logo_url?: string;
  industry: string;
  challenge: string;
  solution: string;
  results: {
    metric: string;
    description: string;
  }[];
  technologies: string[];
}

interface CaseStudiesSectionProps {
  headline?: string;
  subheadline?: string;
  studies: CaseStudy[];
  viewAllUrl?: string;
  viewAllText?: string;
}

export default function CaseStudiesSection({
  headline = "Here's What We Built. Here's What It Delivered.",
  subheadline = "Real projects. Real Fortune 500 clients. Real outcomes.",
  studies,
  viewAllUrl = "/case-studies",
  viewAllText = "See All Case Studies",
}: CaseStudiesSectionProps) {
  return (
    <section className="py-20 bg-[var(--aci-secondary)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {headline}
          </h2>
          <p className="text-lg text-gray-400">{subheadline}</p>
        </div>

        {/* Case Studies Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {studies.map((study) => (
            <Link
              key={study.slug}
              href={`/case-studies/${study.slug}`}
              className="group bg-gray-800 rounded-xl overflow-hidden hover:bg-gray-700 transition-colors"
            >
              {/* Header with logo */}
              <div className="p-6 border-b border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  {study.logo_url ? (
                    <Image
                      src={study.logo_url}
                      alt={study.client}
                      width={100}
                      height={40}
                      className="object-contain brightness-0 invert opacity-70"
                    />
                  ) : (
                    <span className="text-xl font-bold text-white">{study.client}</span>
                  )}
                  <span className="text-sm text-gray-400">{study.industry}</span>
                </div>
                <p className="text-gray-300 text-sm line-clamp-2">{study.challenge}</p>
              </div>

              {/* Results */}
              <div className="p-6">
                <div className="space-y-4 mb-6">
                  {study.results.slice(0, 3).map((result, index) => (
                    <div key={index} className="flex items-baseline gap-3">
                      <span className="text-2xl font-bold text-[var(--aci-primary-light)]">
                        {result.metric}
                      </span>
                      <span className="text-sm text-gray-400">{result.description}</span>
                    </div>
                  ))}
                </div>

                {/* Technologies */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {study.technologies.slice(0, 3).map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-1 bg-gray-700 rounded text-xs text-gray-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* CTA */}
                <span className="text-[var(--aci-primary-light)] text-sm font-medium inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                  Read Full Story <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* View All CTA */}
        <div className="text-center mt-12">
          <Button href={viewAllUrl} variant="secondary" size="lg">
            {viewAllText} <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
}
