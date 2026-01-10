'use client';

import Image from 'next/image';
import { ExternalLink, FileText } from 'lucide-react';

interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  image_url?: string;
  source: string;
  date: string;
  url?: string;
  cta_text?: string;
}

interface NewsSectionProps {
  headline?: string;
  subheadline?: string;
  news: NewsItem[];
}

export default function NewsSection({
  headline = "In The News",
  subheadline = "Recent recognition and partnerships",
  news,
}: NewsSectionProps) {
  return (
    <section className="py-20 bg-[#FAFAFA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0A1628] mb-3 font-[var(--font-title)]">
            {headline}
          </h2>
          <p className="text-gray-600">{subheadline}</p>
        </div>

        {/* 2x2 News Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {news.slice(0, 4).map((item) => (
            <article
              key={item.id}
              className="bg-white rounded-[6px] overflow-hidden shadow-sm hover:shadow-lg transition-all duration-200 group flex flex-col sm:flex-row"
            >
              {/* Image - Left side */}
              <div className="relative w-full sm:w-48 md:w-56 h-40 sm:h-auto flex-shrink-0 bg-gradient-to-br from-[#0A1628] to-[#1a2d47]">
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
                {/* Source badge overlay */}
                <div className="absolute top-3 left-3">
                  <span className="px-2 py-1 bg-white/90 backdrop-blur-sm text-[#0052CC] text-xs font-semibold rounded">
                    {item.source}
                  </span>
                </div>
              </div>

              {/* Content - Right side */}
              <div className="p-5 flex flex-col justify-center flex-1">
                <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                  <span>{item.date}</span>
                </div>

                <h3 className="font-semibold text-[#0A1628] mb-2 group-hover:text-[#0052CC] transition-colors line-clamp-2">
                  {item.title}
                </h3>

                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.excerpt}</p>

                {item.url && (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#0052CC] text-sm font-medium inline-flex items-center gap-1 hover:gap-2 transition-all w-fit"
                  >
                    {item.cta_text || 'Read More'}
                    <ExternalLink className="w-3 h-3" strokeWidth={1.5} />
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
