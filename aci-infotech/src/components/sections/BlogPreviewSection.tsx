'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Clock } from 'lucide-react';
import Button from '@/components/ui/Button';

interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  category: string;
  featured_image?: string;
  read_time?: string;
}

interface BlogPreviewSectionProps {
  headline?: string;
  subheadline?: string;
  posts: BlogPost[];
  viewAllUrl?: string;
}

export default function BlogPreviewSection({
  headline = "Thoughts and Insights",
  subheadline = "Technical depth from engineers who've been there",
  posts,
  viewAllUrl = "/blog",
}: BlogPreviewSectionProps) {
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

        {/* Posts Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group bg-white rounded-[6px] overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
            >
              {/* Image */}
              <div className="relative h-48 bg-gray-100">
                {post.featured_image ? (
                  <Image
                    src={post.featured_image}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#0052CC] to-[#003D99]">
                    <span className="text-white text-4xl font-bold opacity-20">
                      {post.title.charAt(0)}
                    </span>
                  </div>
                )}
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-[#0052CC]">
                    {post.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="font-semibold text-lg text-[#0A1628] mb-2 group-hover:text-[#0052CC] transition-colors line-clamp-2">
                  {post.title}
                </h3>

                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{post.excerpt}</p>

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{post.date}</span>
                  {post.read_time && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" strokeWidth={1.5} />
                      {post.read_time}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View All CTA */}
        <div className="text-center mt-12">
          <Button href={viewAllUrl} variant="secondary" size="lg">
            Read All Insights <ArrowRight className="w-4 h-4 ml-2" strokeWidth={1.5} />
          </Button>
        </div>
      </div>
    </section>
  );
}
