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
import { ArrowUpRight, Search } from 'lucide-react';
import { displayClient } from '@/lib/content/anonymize';
import { v4Display } from '@/components/v4/fonts';
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

/** Industry keyword -> on-brand backdrop, for rows without an image.
    Mirrors the mapping CmsProofCards uses on the v4 service pages. */
const INDUSTRY_IMAGES: [string, string][] = [
  ['retail', '/images/v4/case-retail.jpg'],
  ['consumer', '/images/v4/case-retail.jpg'],
  ['financ', '/images/v4/case-finance.jpg'],
  ['insur', '/images/v4/case-finance.jpg'],
  ['bank', '/images/v4/case-finance.jpg'],
  ['health', '/images/v4/case-healthcare.jpg'],
  ['manufactur', '/images/v4/case-manufacturing.jpg'],
  ['transport', '/images/v4/case-transport.jpg'],
  ['logistic', '/images/v4/case-transport.jpg'],
  ['energy', '/images/v4/case-energy.jpg'],
  ['utilit', '/images/v4/case-energy.jpg'],
  ['hospitality', '/images/v4/case-retail.jpg'],
  ['food', '/images/v4/case-retail.jpg'],
  ['technology', '/images/v4/svc-ops.jpg'],
];

function industryImage(industry: string): string | undefined {
  const needle = industry.toLowerCase();
  if (!needle) return undefined;
  return INDUSTRY_IMAGES.find(([key]) => needle.includes(key))?.[1];
}

/** Glue the final two words with a non-breaking space so no width can
    strand a widow. */
function glueWidow(s: string) {
  return s.replace(/ (\S+)$/, ' $1');
}

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
      {/* Filters: hairline inputs, no pills */}
      <section className="sticky top-20 z-40 border-b border-gray-200 bg-white/95 backdrop-blur">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            {/* Search */}
            <div className="relative w-full md:w-80">
              <Search className="absolute left-0 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by client, technology..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border-0 border-b border-gray-200 bg-transparent py-2 pl-7 pr-2 text-sm text-black placeholder:text-gray-400 focus:border-blue-700 focus:outline-none focus:ring-0"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
              <select
                value={selectedIndustry}
                onChange={(e) => setSelectedIndustry(e.target.value)}
                className="border-0 border-b border-gray-200 bg-transparent py-2 pr-6 text-sm text-gray-700 focus:border-blue-700 focus:outline-none focus:ring-0"
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
                className="border-0 border-b border-gray-200 bg-transparent py-2 pr-6 text-sm text-gray-700 focus:border-blue-700 focus:outline-none focus:ring-0"
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
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-14 md:py-16">
          {filteredStudies.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-lg text-gray-500">No case studies found matching your criteria.</p>
              <button
                onClick={() => {
                  setSelectedIndustry('All');
                  setSelectedService('All');
                  setSearchQuery('');
                }}
                className="group mt-4 inline-flex items-center gap-1 text-sm font-semibold text-blue-700 hover:underline"
              >
                Clear the filters
                <ArrowUpRight size={15} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {filteredStudies.map((study) => (
                <CaseStudyCard key={study.slug} study={study} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

// Case Study Card Component: dark v4 card with the study's own featured
// image (or an on-brand industry backdrop) dimmed under a gradient veil.
interface CaseStudyCardProps {
  study: CaseStudyCard;
}

function CaseStudyCard({ study }: CaseStudyCardProps) {
  const backdrop = study.featured_image ?? industryImage(study.industry);
  // Skip the "Significant" placeholder the transform injects for rows
  // without real metrics; only real numbers earn the lime treatment.
  const metric = study.results.find((r) => r.metric !== 'Significant');

  return (
    <Link
      href={`/case-studies/${study.slug}`}
      className="group relative flex min-h-[420px] flex-col overflow-hidden rounded-3xl bg-[#0b1220] p-8 ring-1 ring-white/10 transition-all duration-300 hover:ring-white/25"
    >
      {backdrop ? (
        <Image
          src={backdrop}
          alt=""
          aria-hidden="true"
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
          className="object-cover opacity-35 transition-transform duration-500 group-hover:scale-[1.03]"
        />
      ) : null}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{ background: 'linear-gradient(180deg, rgba(11,18,32,0.55) 0%, rgba(11,18,32,0.88) 62%, rgba(11,18,32,0.96) 100%)' }}
      />

      <div className="relative flex flex-1 flex-col">
        {/* Client descriptor eyebrow */}
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/60">
          {displayClient(study)}
        </p>
        <p className="mt-1 text-[11px] uppercase tracking-[0.16em] text-white/40">
          {study.industry} &middot; {study.service}
        </p>

        <h3 className={`mt-5 text-2xl font-bold leading-snug text-white ${v4Display}`}>
          {glueWidow(study.headline)}
        </h3>

        <div className="flex-1" />

        {metric ? (
          <div className="mt-6">
            <span className={`text-5xl font-bold leading-none text-[#84CC16] ${v4Display}`}>
              {metric.metric}
            </span>
            <p className="mt-2 line-clamp-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/60">
              {metric.description}
            </p>
          </div>
        ) : null}

        {study.technologies.length > 0 && (
          <p className="mt-5 text-xs text-white/50">
            {study.technologies.slice(0, 4).join(' · ')}
          </p>
        )}

        <span className="mt-6 flex items-center gap-1 text-sm font-semibold text-[#84CC16]">
          Read the case study
          <ArrowUpRight size={15} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>
    </Link>
  );
}
