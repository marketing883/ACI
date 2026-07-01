import { cache } from 'react';
import { createClient } from '@supabase/supabase-js';

// Server-side fetch for the /whitepapers listing. Wrapped in React cache()
// so it dedupes within a request. Anon key, published-only, ordered
// newest-first. Selects only the columns the listing cards need (no heavy
// file/highlights columns). Returns [] on missing creds or error so the
// page renders its empty state instead of crashing.
//
// The set is small (~1-40 rows) so there is no pagination: the whole list is
// seeded into the client island as a prop, which is what puts every
// `<a href="/whitepapers/{slug}">` into the server-rendered HTML.

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Trimmed shape for listing/card rendering. Uses the live column set the
// whitepaper APIs already read (cover_image / description / category), which
// confirms these columns exist in the deployed table.
export interface WhitepaperListItem {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  cover_image: string | null;
  category: string | null;
  is_featured: boolean | null;
  created_at: string | null;
  published_at: string | null;
}

const LIST_COLUMNS =
  'id, slug, title, description, cover_image, category, is_featured, created_at, published_at';

export const getPublishedWhitepapers = cache(
  async (): Promise<WhitepaperListItem[]> => {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return [];
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    const { data, error } = await supabase
      .from('whitepapers')
      .select(LIST_COLUMNS)
      .eq('status', 'published')
      .order('created_at', { ascending: false });
    if (error || !data) return [];
    return data as unknown as WhitepaperListItem[];
  },
);
