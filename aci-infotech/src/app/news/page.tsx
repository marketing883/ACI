import { Metadata } from 'next';
import { createClient } from '@supabase/supabase-js';
import Image from 'next/image';
import Link from 'next/link';
import { ExternalLink, FileText, ArrowLeft } from 'lucide-react';

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
  image_url: string | null;
  published_at: string;
  is_featured: boolean;
}

async function getNews(): Promise<NewsItem[]> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return [];
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data, error } = await supabase
    .from('news')
    .select('*')
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
    <main className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#0A1628] via-[#0f2744] to-[#0A1628] pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-blue-300 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            News & Press
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl">
            Latest news, press releases, and media coverage about ACI Infotech
          </p>
        </div>
      </section>

      {/* News Grid */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {news.length === 0 ? (
            <div className="text-center py-16">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-gray-700 mb-2">No News Yet</h2>
              <p className="text-gray-500">Check back soon for the latest updates.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {news.map((item) => (
                <article
                  key={item.id}
                  className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-200 group flex flex-col sm:flex-row"
                >
                  {/* Image */}
                  <div className="relative w-full sm:w-56 h-48 sm:h-auto flex-shrink-0 bg-gradient-to-br from-[#0A1628] to-[#1a2d47]">
                    {item.image_url ? (
                      <Image
                        src={item.image_url}
                        alt={item.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-[#0052CC]/20 flex items-center justify-center">
                            <FileText className="w-6 h-6 text-[#0052CC]" />
                          </div>
                          <span className="text-xs text-gray-400 font-medium">{item.source}</span>
                        </div>
                      </div>
                    )}
                    {/* Source badge */}
                    <div className="absolute top-3 left-3">
                      <span className="px-2 py-1 bg-white/90 backdrop-blur-sm text-[#0052CC] text-xs font-semibold rounded">
                        {item.source}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex flex-col justify-center flex-1">
                    <div className="text-xs text-gray-500 mb-2">
                      {formatDate(item.published_at)}
                    </div>

                    <h2 className="text-lg font-semibold text-[#0A1628] mb-2 group-hover:text-[#0052CC] transition-colors line-clamp-2">
                      {item.title}
                    </h2>

                    <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                      {item.excerpt}
                    </p>

                    <a
                      href={item.external_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#0052CC] text-sm font-medium inline-flex items-center gap-1.5 hover:gap-2.5 transition-all w-fit"
                    >
                      {item.link_text || 'Read Full Story'}
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
