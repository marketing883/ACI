import { Metadata } from 'next';
import { createClient } from '@supabase/supabase-js';
import { ArrowUpRight } from 'lucide-react';
import { v4Sans, v4Display } from '@/components/v4/fonts';

// Revalidate every 60 seconds for fresh content
export const revalidate = 60;

export const metadata: Metadata = {
  title: 'News & Press',
  description: 'Latest news, press releases, and media coverage about ACI Infotech - enterprise data engineering, AI, and cloud transformation.',
  alternates: { canonical: 'https://aciinfotech.com/news' },
};

interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  source: string;
  external_url: string;
  link_text: string;
  published_at: string;
}

// Anon key, published-only, newest first: the same public read pattern
// as src/lib/content/case-study.ts. The service-role key stays out of
// this page's path entirely; published news rows are public content.
async function getNews(): Promise<NewsItem[]> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return [];
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  const { data, error } = await supabase
    .from('news')
    .select('id, title, excerpt, source, external_url, link_text, published_at')
    .eq('status', 'published')
    .order('published_at', { ascending: false });

  if (error) {
    console.error('Error fetching news:', error);
    return [];
  }

  return data || [];
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

export default async function NewsPage() {
  const news = await getNews();

  return (
    <main className={`min-h-screen bg-white text-black ${v4Sans}`}>
      {/* Header */}
      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 pb-14 pt-12 md:pt-16">
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
            / News
          </p>
          <h1
            className={`max-w-3xl text-3xl font-bold tracking-tight sm:text-4xl lg:text-[44px] ${v4Display}`}
            style={{ lineHeight: 1.06 }}
          >
            ACI Infotech, in the{' '}
            <span style={{ color: '#1D4ED8' }}>press</span>
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-gray-700 md:text-lg">
            Announcements and coverage, straight from the outlets that
            published them. Every link below opens the original&nbsp;story.
          </p>
        </div>
      </section>

      {/* News rows */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-14 md:py-16">
          {news.length === 0 ? (
            <p className="max-w-xl text-base leading-relaxed text-gray-600">
              Press mentions land here as they publish. Check back&nbsp;soon.
            </p>
          ) : (
            <ul>
              {news.map((item) => (
                <li key={item.id} className="border-b border-gray-200 first:border-t">
                  <a
                    href={item.external_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group grid gap-x-8 gap-y-2 py-7 md:grid-cols-12"
                  >
                    <div className="flex items-baseline gap-4 md:col-span-3 md:flex-col md:gap-1.5">
                      <p className="font-mono text-xs text-gray-500">
                        {formatDate(item.published_at)}
                      </p>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-blue-700">
                        {item.source}
                      </p>
                    </div>

                    <div className="md:col-span-9">
                      <h2
                        className={`max-w-3xl text-xl font-semibold text-black transition-colors group-hover:text-blue-700 md:text-2xl ${v4Display}`}
                        style={{ lineHeight: 1.2 }}
                      >
                        {item.title}
                      </h2>
                      {item.excerpt ? (
                        <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-gray-600">
                          {item.excerpt}
                        </p>
                      ) : null}
                      <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-blue-700">
                        {item.link_text || 'Read the story'}
                        <ArrowUpRight
                          size={15}
                          aria-hidden="true"
                          className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        />
                      </span>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </main>
  );
}
