'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ExternalLink } from 'lucide-react';

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
          <h2 className="text-3xl md:text-4xl font-bold text-[#0A1628] mb-3">
            {headline}
          </h2>
          <p className="text-gray-600">{subheadline}</p>
        </div>

        {/* News Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {news.map((item) => (
            <article
              key={item.id}
              className="bg-white rounded-[6px] overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 group"
            >
              {/* Image */}
              {item.image_url && (
                <div className="relative h-40 bg-gray-100">
                  <Image
                    src={item.image_url}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              {/* Content */}
              <div className="p-5">
                <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                  <span className="font-medium text-[#0052CC]">{item.source}</span>
                  <span>|</span>
                  <span>{item.date}</span>
                </div>

                <h3 className="font-semibold text-[#0A1628] mb-2 group-hover:text-[#0052CC] transition-colors">
                  {item.title}
                </h3>

                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{item.excerpt}</p>

                {item.url && (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#0052CC] text-sm font-medium inline-flex items-center gap-1 hover:gap-2 transition-all"
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
