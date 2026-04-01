import { createClient } from '@supabase/supabase-js';
import { unstable_noStore as noStore } from 'next/cache';
import NewsSection from './NewsSection';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

interface NewsItemDB {
  id: string;
  title: string;
  excerpt: string;
  source: string;
  external_url: string;
  link_text: string;
  image_url: string | null;
  published_at: string;
  is_featured: boolean;
  status: string;
}

async function getFeaturedNews(limit: number = 4): Promise<NewsItemDB[]> {
  noStore();

  if (!supabaseUrl || !supabaseServiceKey) {
    return [];
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    global: {
      fetch: (url, options = {}) => fetch(url, { ...options, cache: 'no-store' })
    }
  });

  const { data, error } = await supabase
    .from('news')
    .select('*')
    .eq('status', 'published')
    .eq('is_featured', true)
    .order('published_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching featured news:', error);
    return [];
  }

  return data || [];
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });
}

interface DynamicNewsSectionProps {
  headline?: string;
  subheadline?: string;
  limit?: number;
}

// Fallback news items when database is unavailable
const fallbackNews = [
  {
    id: 'salesforce-agentforce',
    title: 'ACI Infotech Accelerates Growth with Exclusive Salesforce-Agentforce Partnership',
    excerpt: "Partnership with Salesforce's Agentforce platform positions ACI as a trusted innovation partner for Fortune 500 companies.",
    image_url: '/images/news/PR-newswire-new.jpg',
    source: 'PR Newswire',
    date: 'June 2025',
    url: 'https://www.prnewswire.com/news-releases/aci-infotech-accelerates-growth-with-exclusive-salesforceagentforce-partnership-and-bold-vision-for-the-future-302486563.html',
    cta_text: 'Read Full Story',
  },
  {
    id: 'jag-kanumuri-ai',
    title: 'Jag Kanumuri: Helping Enterprises Turn AI from Ambition into Advantage',
    excerpt: 'Outlook India profiles ACI Infotech CEO Jag Kanumuri on pioneering AI-native enterprises.',
    image_url: '/images/news/outlook-new.jpg',
    source: 'Outlook India',
    date: 'May 2025',
    url: 'https://www.outlookindia.com/hub4business/jag-kanumuri-helping-enterprises-turn-ai-from-ambition-into-advantage',
    cta_text: 'Read Interview',
  },
];

export default async function DynamicNewsSection({
  headline = "In The News",
  subheadline = "Recent recognition and partnerships",
  limit = 4,
}: DynamicNewsSectionProps) {
  const dbNews = await getFeaturedNews(limit);

  // Transform DB format to NewsSection component format
  const news = dbNews.map((item: NewsItemDB) => ({
    id: item.id,
    title: item.title,
    excerpt: item.excerpt,
    image_url: item.image_url || undefined,
    source: item.source,
    date: formatDate(item.published_at),
    url: item.external_url,
    cta_text: item.link_text || 'Read Full Story',
  }));

  return (
    <NewsSection
      headline={headline}
      subheadline={subheadline}
      news={news.length > 0 ? news : fallbackNews}
    />
  );
}
