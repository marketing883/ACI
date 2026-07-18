/**
 * Whitepaper detail — server component.
 *
 * The old client version fetched via /api in a useEffect, so the
 * server HTML was a spinner: no teaser content for crawlers, and
 * unknown slugs returned HTTP 200. The teaser (summary, takeaways,
 * table of contents) now renders on the server; the gated download
 * stays behind the lead form in a small client island.
 */

import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import {
  FileText,
  ArrowLeft,
  Clock,
  Calendar,
  CheckCircle2,
  BookOpen,
  BarChart3,
  Lightbulb,
  Target,
  Users,
  Shield,
} from 'lucide-react';
import { getSiteUrl } from '@/lib/site-url';
import { getWhitepaperDetail } from './whitepaper-detail';
import WhitepaperDownloadCta from './WhitepaperDownloadCta';

const siteUrl = getSiteUrl();

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function WhitepaperDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const whitepaper = await getWhitepaperDetail(slug);

  // Real 404 instead of the old 200 "Whitepaper Not Found" body.
  if (!whitepaper) {
    notFound();
  }

  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Report',
        '@id': `${siteUrl}/whitepapers/${slug}#report`,
        headline: whitepaper.title,
        description: whitepaper.description,
        url: `${siteUrl}/whitepapers/${slug}`,
        image: whitepaper.cover_image || undefined,
        datePublished: whitepaper.published_at || undefined,
        author: whitepaper.author_name
          ? {
              '@type': 'Person',
              name: whitepaper.author_name,
              ...(whitepaper.author_title ? { jobTitle: whitepaper.author_title } : {}),
              worksFor: { '@id': `${siteUrl}/#organization` },
            }
          : { '@id': `${siteUrl}/#organization` },
        publisher: { '@id': `${siteUrl}/#organization` },
        keywords: (whitepaper.tags || []).join(', '),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
          { '@type': 'ListItem', position: 2, name: 'Whitepapers', item: `${siteUrl}/whitepapers` },
          { '@type': 'ListItem', position: 3, name: whitepaper.title, item: `${siteUrl}/whitepapers/${slug}` },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[var(--aci-secondary)] to-[#0a2540] pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/whitepapers"
            className="inline-flex items-center gap-2 text-blue-300 hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            All Whitepapers
          </Link>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-[var(--aci-primary)] text-white text-sm font-medium rounded-full">
                  {whitepaper.category}
                </span>
                <span className="text-blue-200 text-sm flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {whitepaper.read_time} read
                </span>
              </div>

              <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">
                {whitepaper.title}
              </h1>

              {/* Short intro line */}
              <p className="text-xl text-blue-100 mb-6">
                {whitepaper.description?.split('.')[0]?.trim() || 'Essential insights for enterprise leaders'}.
              </p>

              {/* 3 Key highlights */}
              {whitepaper.key_takeaways && whitepaper.key_takeaways.length > 0 && (
                <ul className="space-y-2 mb-8">
                  {whitepaper.key_takeaways.slice(0, 3).map((takeaway, index) => (
                    <li key={index} className="flex items-start gap-2 text-blue-100">
                      <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                      <span>{takeaway}</span>
                    </li>
                  ))}
                </ul>
              )}

              <div className="flex flex-wrap gap-4 mb-8">
                <div className="flex items-center gap-2 text-blue-200">
                  <BookOpen className="w-5 h-5" />
                  <span>{whitepaper.page_count || 25} pages</span>
                </div>
                {whitepaper.published_at ? (
                  <div className="flex items-center gap-2 text-blue-200">
                    <Calendar className="w-5 h-5" />
                    <span>Updated {new Date(whitepaper.published_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                  </div>
                ) : null}
                {whitepaper.author_name ? (
                  <div className="flex items-center gap-2 text-blue-200">
                    <span>
                      By {whitepaper.author_name}
                      {whitepaper.author_title ? `, ${whitepaper.author_title}` : ''}
                    </span>
                  </div>
                ) : null}
              </div>

              <WhitepaperDownloadCta whitepaper={whitepaper} variant="hero" trackView />
            </div>

            {/* Cover Image */}
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden transform lg:rotate-2 hover:rotate-0 transition-transform duration-300">
                {whitepaper.cover_image ? (
                  <Image
                    src={whitepaper.cover_image}
                    alt={whitepaper.title}
                    width={500}
                    height={650}
                    className="w-full h-auto"
                  />
                ) : (
                  <div className="aspect-[3/4] bg-gradient-to-br from-[var(--aci-primary)] to-blue-700 flex items-center justify-center p-8">
                    <div className="text-center text-white">
                      <FileText className="w-24 h-24 mx-auto mb-6 opacity-50" />
                      <h3 className="text-2xl font-bold">{whitepaper.title}</h3>
                    </div>
                  </div>
                )}
              </div>
              {/* Decorative elements */}
              <div className="absolute -bottom-4 -right-4 w-full h-full bg-[var(--aci-primary)]/20 rounded-2xl -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* Executive Summary */}
      {whitepaper.executive_summary && (
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-[var(--aci-primary)]/10 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-[var(--aci-primary)]" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Executive Summary</h2>
            </div>
            <p className="text-lg text-gray-600 leading-relaxed">
              {whitepaper.executive_summary}
            </p>
          </div>
        </section>
      )}

      {/* Key Takeaways */}
      {whitepaper.key_takeaways && whitepaper.key_takeaways.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Lightbulb className="w-5 h-5 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Key Takeaways</h2>
            </div>
            <div className="space-y-4">
              {whitepaper.key_takeaways.map((takeaway, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-sm"
                >
                  <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                  <p className="text-gray-700">{takeaway}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* What You'll Learn */}
      {whitepaper.what_you_will_learn && whitepaper.what_you_will_learn.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">What You&apos;ll Learn</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {whitepaper.what_you_will_learn.map((item, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl"
                >
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">
                    {index + 1}
                  </div>
                  <p className="text-gray-700">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Who Should Read */}
      {whitepaper.who_should_read && whitepaper.who_should_read.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Who Should Read This</h2>
            </div>
            <div className="flex flex-wrap gap-3">
              {whitepaper.who_should_read.map((audience, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-white border border-gray-200 rounded-full text-gray-700 shadow-sm"
                >
                  {audience}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Table of Contents */}
      {whitepaper.table_of_contents && whitepaper.table_of_contents.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-orange-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Table of Contents</h2>
            </div>
            <div className="bg-gray-50 rounded-2xl p-6">
              <ol className="space-y-3">
                {whitepaper.table_of_contents.map((chapter, index) => (
                  <li
                    key={index}
                    className="flex items-center gap-4 text-gray-700"
                  >
                    <span className="w-8 h-8 bg-white border border-gray-200 rounded-lg flex items-center justify-center text-sm font-medium text-gray-500">
                      {index + 1}
                    </span>
                    <span>{chapter}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-[var(--aci-primary)] to-blue-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Put This to Work?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Download this comprehensive guide and learn from 80+ enterprise implementations.
          </p>
          <WhitepaperDownloadCta whitepaper={whitepaper} variant="footer" />
        </div>
      </section>

    </main>
    </>
  );
}
