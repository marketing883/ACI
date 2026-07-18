// Server-side whitepaper detail: shared type, editorial fallback, and
// the CMS fetch. Extracted from the old client page so the detail route
// can render its teaser on the server.

import { cache } from 'react';
import { supabase } from '@/lib/supabase';

export interface Whitepaper {
  id: string;
  slug: string;
  title: string;
  description: string;
  cover_image: string;
  file_url: string;
  category: string;
  tags: string[];
  read_time: string;
  page_count: number;
  published_at: string | null;
  // Author E-E-A-T (rendered + emitted as Person schema when present)
  author_name?: string | null;
  author_title?: string | null;
  // Teaser content
  key_takeaways: string[];
  what_you_will_learn: string[];
  who_should_read: string[];
  executive_summary: string;
  table_of_contents: string[];
}

// Fallback whitepaper data
export const fallbackWhitepapers: Record<string, Whitepaper> = {
  'retail-technology-benchmark-report-2026': {
    id: '1',
    slug: 'retail-technology-benchmark-report-2026',
    title: 'Retail Technology Benchmark Report 2026',
    description: 'Retail executives face unprecedented pressure to modernize technology stacks while maintaining operational efficiency and customer satisfaction.',
    cover_image: '/images/whitepapers/retail-benchmark-cover.jpg',
    file_url: '/whitepapers/pdfs/retail-technology-benchmark-report-2026.pdf',
    category: 'Retail & Technology',
    tags: ['Retail', 'Digital Transformation', 'Technology Benchmark'],
    read_time: '15 min',
    page_count: 25,
    published_at: '2026-02-16',
    executive_summary: 'Retail executives face unprecedented pressure to modernize technology stacks while maintaining operational efficiency and customer satisfaction. This benchmark report provides actionable insights from 120+ retail enterprises across multiple verticals.',
    key_takeaways: [
      'Identify technology gaps costing your organization revenue and efficiency',
      'Access proven frameworks that reduce deployment risks by 40%',
      'Benchmark data from 120+ retail enterprises across multiple verticals',
      'Implementation strategies from leading retail digital transformations',
      'ROI frameworks for technology investment prioritization',
    ],
    what_you_will_learn: [
      'Current state of retail technology adoption across verticals',
      'Key technology gaps impacting revenue and efficiency',
      'Proven deployment frameworks reducing implementation risks',
      'Best practices from successful retail transformations',
      'Strategic roadmap for technology modernization',
    ],
    who_should_read: [
      'Retail CIOs and Technology Leaders',
      'Digital Transformation Officers',
      'Operations and Supply Chain Executives',
      'Store Operations and Omnichannel Leaders',
      'Technology Investment Decision Makers',
    ],
    table_of_contents: [
      'Executive Summary',
      'The State of Retail Technology in 2026',
      'Benchmark Methodology and Participants',
      'Technology Adoption Patterns',
      'Identifying Critical Technology Gaps',
      'Risk Reduction Frameworks',
      'Implementation Best Practices',
      'Case Studies: Success Stories',
      'Strategic Recommendations',
      'Implementation Roadmap',
      'Appendix: Detailed Benchmarks',
    ],
  },
};

/**
 * Fetch a published whitepaper server-side and merge it with the
 * editorial fallback (which carries the teaser fields the CMS may not
 * populate). Returns null when neither source knows the slug.
 */
export const getWhitepaperDetail = cache(async (slug: string): Promise<Whitepaper | null> => {
  const fallback = fallbackWhitepapers[slug];
  try {
    const { data, error } = await supabase
      .from('whitepapers')
      .select('id, slug, title, excerpt, description, highlights, cover_image, file_url, category, tags, published_at, author_name, author_title')
      .eq('slug', slug)
      .eq('status', 'published')
      .single();

    if (error || !data) return fallback ?? null;

    const row = data as Record<string, unknown> & { highlights?: string[] };
    return {
      ...fallback,
      ...row,
      key_takeaways: (row.highlights as string[]) || fallback?.key_takeaways || [],
      what_you_will_learn: fallback?.what_you_will_learn || [],
      who_should_read: fallback?.who_should_read || [],
      executive_summary: fallback?.executive_summary || (row.description as string) || '',
      table_of_contents: fallback?.table_of_contents || [],
    } as Whitepaper;
  } catch {
    return fallback ?? null;
  }
});
