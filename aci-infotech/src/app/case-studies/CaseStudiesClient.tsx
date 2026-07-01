'use client';

/**
 * Interactive case-studies listing UI. This is a client component for the
 * search + industry/service filters, but it is SEEDED FROM SERVER PROPS
 * (`initialItems`) rather than fetching in useEffect. That is the point of
 * the SSR refactor: because the data arrives as props, Next renders every
 * case-study card - and its `<a href="/case-studies/{slug}">` - into the
 * initial HTML, so crawlers see real links. The previous version fetched
 * `/api/admin/case-studies` in useEffect, so the server HTML had zero
 * case-study links and every detail page was orphaned.
 *
 * The DB -> card transform (metrics JSONB -> results, services[0] -> service)
 * that used to run after the fetch now runs once, up front, on the props.
 */

import { useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Filter, Search } from 'lucide-react';
import Button from '@/components/ui/Button';
import { displayClient } from '@/lib/content/anonymize';
import type {
  CaseStudyListItem,
  CaseStudyMetric,
} from '@/lib/content/case-study';

interface CaseStudyResult {
  metric: string;
  description: string;
}

// Card-shaped case study. `client_descriptor` is carried through so
// displayClient() can render the anonymized name; a raw client_name is
// never introduced here.
interface CaseStudyCard {
  slug: string;
  client_descriptor: string | null;
  featured_image?: string;
  industry: string;
  service: string;
  headline: string;
  results: CaseStudyResult[];
  technologies: string[];
  is_featured?: boolean;
}

const industries = ['All', 'Financial Services', 'Retail', 'Healthcare', 'Hospitality', 'Manufacturing', 'Insurance', 'Energy', 'Transportation', 'Technology'];
const services = ['All', 'Data Engineering', 'Applied AI & ML', 'Cloud Modernization', 'MarTech & CDP', 'Digital Transformation', 'Cyber Security'];

// Parse JSON fields that might be stored as strings (metrics JSONB).
function parseJsonField<T>(value: T | string | null | undefined, fallback: T): T {
  if (!value) return fallback;
  if (typeof value === 'string') {
    try {
      return JSON.parse(value) as T;
    } catch {
      return fallback;
    }
  }
  return value as T;
}

// Transform a DB listing row into the card shape the grid renders. Mirrors
// the transform that previously ran on the API response.
function toCard(study: CaseStudyListItem): CaseStudyCard {
  const servicesArray = Array.isArray(study.services) ? study.services : [];

  const metricsArray = parseJsonField<CaseStudyMetric[]>(study.metrics, []);
  const results = metricsArray.map((m) => ({
    metric: m.value,
    description: m.label + (m.description ? ` - ${m.description}` : ''),
  }));

  return {
    slug: study.slug,
    client_descriptor: study.client_descriptor,
    featured_image: study.featured_image_url ?? undefined,
    industry: study.industry || 'Technology',
    service: servicesArray[0] || 'Data Engineering',
    headline: study.title || 'Enterprise Transformation',
    results:
      results.length > 0
        ? results
        : [{ metric: 'Significant', description: 'Business impact achieved' }],
    technologies: Array.isArray(study.technologies) ? study.technologies : [],
    is_featured: study.is_featured ?? undefined,
  };
}

interface Props {
  initialItems: CaseStudyListItem[];
}

export default function CaseStudiesClient({ initialItems }: Props) {
  const [selectedIndustry, setSelectedIndustry] = useState('All');
  const [selectedService, setSelectedService] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Transform once from props. The order (created_at DESC) comes from the
  // server query, so we preserve it here.
  const caseStudies = useMemo(() => initialItems.map(toCard), [initialItems]);

  const filteredStudies = caseStudies.filter((study) => {
    const matchesIndustry = selectedIndustry === 'All' || study.industry === selectedIndustry;
    const matchesService = selectedService === 'All' || study.service === selectedService;
    const q = searchQuery.toLowerCase();
    const matchesSearch = searchQuery === '' ||
      displayClient(study).toLowerCase().includes(q) ||
      study.headline.toLowerCase().includes(q) ||
      study.technologies?.some((tech) => tech.toLowerCase().includes(q));
    return matchesIndustry && matchesService && matchesSearch;
  });

  return (
    <>
      {/* Filters Section */}
      <section className="bg-gray-50 py-6 sticky top-20 z-40 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by client, technology..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[var(--aci-primary)] focus:border-transparent"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">Filters:</span>
              </div>

              <select
                value={selectedIndustry}
                onChange={(e) => setSelectedIndustry(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[var(--aci-primary)] focus:border-transparent"
              >
                {industries.map((industry) => (
                  <option key={industry} value={industry}>
                    {industry === 'All' ? 'All Industries' : industry}
                  </option>
                ))}
              </select>

              <select
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[var(--aci-primary)] focus:border-transparent"
              >
                {services.map((service) => (
                  <option key={service} value={service}>
                    {service === 'All' ? 'All Services' : service}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* All Case Studies */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredStudies.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">No case studies found matching your criteria.</p>
              <Button
                variant="secondary"
                className="mt-4"
                onClick={() => {
                  setSelectedIndustry('All');
                  setSelectedService('All');
                  setSearchQuery('');
                }}
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-8">
              {filteredStudies.map((study) => (
                <CaseStudyCard key={study.slug} study={study} featured={study.is_featured} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

// Case Study Card Component
interface CaseStudyCardProps {
  study: CaseStudyCard;
  featured?: boolean;
}

function CaseStudyCard({ study, featured }: CaseStudyCardProps) {
  return (
    <Link
      href={`/case-studies/${study.slug}`}
      className="group relative block rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
    >
      {/* Background Image with Gradient Overlay */}
      <div className="absolute inset-0">
        {study.featured_image ? (
          <Image
            src={study.featured_image}
            alt={study.headline}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[var(--aci-secondary)] via-[#1a3a5c] to-[#0a2540]" />
        )}
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--aci-secondary)] via-[var(--aci-secondary)]/80 to-transparent" />
      </div>

      {/* Glass Card Content */}
      <div className="relative min-h-[480px] flex flex-col justify-end p-8">
        {/* Top badges */}
        <div className="absolute top-5 left-5 right-5 flex items-center justify-between">
          <div className="flex gap-2">
            <span className="px-3 py-1.5 bg-white/10 backdrop-blur-md text-white text-xs font-medium rounded-full border border-white/20">
              {study.industry}
            </span>
            <span className="px-3 py-1.5 bg-[var(--aci-primary)]/80 backdrop-blur-md text-white text-xs font-medium rounded-full">
              {study.service}
            </span>
          </div>
          {featured && (
            <span className="px-3 py-1.5 bg-amber-500/90 backdrop-blur-md text-white text-xs font-bold rounded-full flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              Featured
            </span>
          )}
        </div>

        {/* Client Name */}
        <div className="mb-3">
          <span className="text-white/80 text-sm font-semibold uppercase tracking-wider">
            {displayClient(study)}
          </span>
        </div>

        {/* Headline */}
        <h3 className="text-2xl font-bold text-white mb-5 group-hover:text-[var(--aci-primary-light)] transition-colors">
          {study.headline}
        </h3>

        {/* Results - Glass Panel */}
        {study.results && study.results.length > 0 && (
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-5 mb-5 border border-white/10">
            <div className="grid grid-cols-3 gap-4">
              {study.results.slice(0, 3).map((result, index) => (
                <div key={index} className="text-center">
                  <div className="text-xl font-bold text-[var(--aci-primary-light)]">
                    {result.metric}
                  </div>
                  <div className="text-xs text-white/70 leading-snug mt-1">
                    {result.description}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Technologies */}
        <div className="flex flex-wrap gap-2 mb-4">
          {study.technologies?.slice(0, 4).map((tech) => (
            <span
              key={tech}
              className="px-2.5 py-1 bg-white/5 backdrop-blur-sm rounded-md text-xs text-white/70 border border-white/10"
            >
              {tech}
            </span>
          ))}
          {(study.technologies?.length || 0) > 4 && (
            <span className="px-2.5 py-1 text-xs text-white/40">
              +{(study.technologies?.length || 0) - 4}
            </span>
          )}
        </div>

        {/* CTA */}
        <div className="flex items-center gap-2 text-white font-medium group-hover:text-[var(--aci-primary-light)] transition-colors">
          <span className="text-sm">Read Case Study</span>
          <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
}
