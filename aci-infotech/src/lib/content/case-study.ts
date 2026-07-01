import { cache } from 'react';
import { createClient } from '@supabase/supabase-js';

// Server-side fetch for the /case-studies listing. Wrapped in React cache()
// so it dedupes within a request. Anon key, published-only, ordered
// newest-first. Selects only the columns the listing cards need (no heavy
// challenge/solution/results body columns). Returns [] on missing creds or
// error so the page renders an empty state instead of crashing.
//
// The set is small (~29 rows) so there is no pagination: the whole list is
// seeded into the client island as a prop, which is what puts every
// `<a href="/case-studies/{slug}">` into the server-rendered HTML.

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// A single result row inside a case study's `metrics` JSONB array. Stored
// as either an array or a JSON string, so callers normalize with
// parseJsonField before mapping.
export interface CaseStudyMetric {
  label: string;
  value: string;
  description?: string;
}

// Trimmed shape for listing/card rendering. Mirrors the live column set the
// [slug] detail page and DynamicCaseStudiesSection already read
// (industry / services / metrics / technologies / featured_image_url), plus
// client_descriptor for the anonymized display name.
export interface CaseStudyListItem {
  id: string | null;
  slug: string;
  title: string | null;
  client_descriptor: string | null;
  industry: string | null;
  services: string[] | null;
  metrics: CaseStudyMetric[] | string | null;
  technologies: string[] | null;
  featured_image_url: string | null;
  is_featured: boolean | null;
  created_at: string | null;
  published_at: string | null;
}

const LIST_COLUMNS =
  'id, slug, title, client_descriptor, industry, services, metrics, technologies, featured_image_url, is_featured, created_at, published_at';

export const getPublishedCaseStudies = cache(
  async (): Promise<CaseStudyListItem[]> => {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return [];
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    const { data, error } = await supabase
      .from('case_studies')
      .select(LIST_COLUMNS)
      .eq('status', 'published')
      .order('created_at', { ascending: false });
    if (error || !data) return [];
    return data as unknown as CaseStudyListItem[];
  },
);
