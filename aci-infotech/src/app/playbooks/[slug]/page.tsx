/**
 * Playbook detail — server component.
 *
 * This page used to be a client component that injected its content in
 * a useEffect: the server HTML for every valid playbook was the
 * "Playbook Not Found" branch, unknown slugs returned HTTP 200
 * (soft-404s), and all ten URLs shared the root layout's title. The
 * content is a static object, so it now renders on the server, unknown
 * slugs return a real 404, and every playbook gets its own metadata
 * and Article + BreadcrumbList structured data.
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import { getSiteUrl } from '@/lib/site-url';
import { playbooksData } from './playbooks-data';
import PlaybookDownloadCta from './PlaybookDownloadCta';

const siteUrl = getSiteUrl();

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return Object.keys(playbooksData).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const playbook = playbooksData[slug];
  if (!playbook) {
    return { title: 'Playbook Not Found' };
  }
  return {
    // The root template appends "| ACI Infotech" exactly once.
    title: `${playbook.fullTitle} Playbook`,
    description: playbook.description,
    alternates: { canonical: `${siteUrl}/playbooks/${slug}` },
    openGraph: {
      title: `${playbook.fullTitle} Playbook | ACI Infotech`,
      description: playbook.description,
      url: `${siteUrl}/playbooks/${slug}`,
      siteName: 'ACI Infotech',
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${playbook.fullTitle} Playbook | ACI Infotech`,
      description: playbook.description,
    },
  };
}

export default async function PlaybookPage({ params }: PageProps) {
  const { slug } = await params;
  const playbook = playbooksData[slug];

  // Real 404 for unknown slugs — this page previously served the
  // "not found" body with HTTP 200, a crawlable soft-404 per bad URL.
  if (!playbook) {
    notFound();
  }

  const relatedPlaybooks = playbook.relatedPlaybooks
    ?.map((s) => playbooksData[s])
    .filter(Boolean) || [];

  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        '@id': `${siteUrl}/playbooks/${slug}#article`,
        headline: `${playbook.fullTitle} Playbook`,
        description: playbook.description,
        url: `${siteUrl}/playbooks/${slug}`,
        author: { '@id': `${siteUrl}/#organization` },
        publisher: { '@id': `${siteUrl}/#organization` },
        articleSection: playbook.category,
        keywords: [...playbook.technologies, ...playbook.industries].join(', '),
        mainEntityOfPage: `${siteUrl}/playbooks/${slug}`,
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
          { '@type': 'ListItem', position: 2, name: 'Playbooks', item: `${siteUrl}/playbooks` },
          { '@type': 'ListItem', position: 3, name: playbook.fullTitle, item: `${siteUrl}/playbooks/${slug}` },
        ],
      },
    ],
  };

  return (
    <main className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* Hero Section */}
      <section className="bg-[#001529] pt-32 pb-20 relative overflow-hidden">
        {/* Blueprint grid background */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(rgba(24,144,255,0.06) 1px, transparent 1px),
              linear-gradient(90deg, rgba(24,144,255,0.06) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px',
          }}
        />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <Link
            href="/playbooks"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Playbooks
          </Link>

          <div className="flex items-center gap-4 mb-6">
            <span className="px-3 py-1 bg-[#1890FF]/20 text-[#1890FF] text-sm font-medium rounded">
              {playbook.category}
            </span>
            <span className="text-[#C4FF61] font-mono font-bold">
              {playbook.deployments}x deployed
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {playbook.displayTitle}
          </h1>
          <p className="text-xl text-gray-400 mb-6">
            {playbook.fullTitle}
          </p>
          <p className="text-gray-500">
            {playbook.description}
          </p>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 pt-8 border-t border-gray-700">
            <div>
              <div className="text-sm text-gray-400 mb-1">Deployments</div>
              <div className="text-xl font-semibold text-white">{playbook.deployments}x</div>
            </div>
            <div>
              <div className="text-sm text-gray-400 mb-1">Timeline</div>
              <div className="text-xl font-semibold text-white">{playbook.timeline}</div>
            </div>
            <div>
              <div className="text-sm text-gray-400 mb-1">Team Size</div>
              <div className="text-xl font-semibold text-white">{playbook.teamSize}</div>
            </div>
            <div>
              <div className="text-sm text-gray-400 mb-1">Category</div>
              <div className="text-xl font-semibold text-white">{playbook.category}</div>
            </div>
          </div>

          {/* Download CTA (client island; only interactive piece) */}
          {playbook.downloadAvailable && (
            <div className="mt-8">
              <PlaybookDownloadCta
                playbookTitle={playbook.fullTitle}
                playbookSlug={playbook.slug}
              />
            </div>
          )}
        </div>
      </section>

      {/* Key Outcomes */}
      <section className="py-16 bg-[var(--aci-primary)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-white text-lg font-medium mb-8">Typical Outcomes Achieved</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {playbook.outcomes.map((outcome, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">{outcome.metric}</div>
                <div className="text-blue-100">{outcome.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Overview */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[var(--aci-secondary)] mb-6">Overview</h2>
          <p className="text-lg text-gray-600 leading-relaxed">{playbook.overview}</p>
        </div>
      </section>

      {/* Challenge Pattern */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <span className="text-2xl">🎯</span>
            </div>
            <h2 className="text-3xl font-bold text-[var(--aci-secondary)]">Challenge Pattern</h2>
          </div>
          <p className="text-lg text-gray-600 mb-8">
            This playbook addresses organizations facing these common challenges:
          </p>
          <ul className="space-y-4">
            {playbook.challengePattern.map((point, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-sm font-medium">
                  {index + 1}
                </span>
                <span className="text-gray-700">{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Solution Approach */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <span className="text-2xl">💡</span>
            </div>
            <h2 className="text-3xl font-bold text-[var(--aci-secondary)]">Solution Approach</h2>
          </div>
          <ul className="space-y-4 mb-8">
            {playbook.solutionApproach.map((point, index) => (
              <li key={index} className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Key Learnings */}
      <section className="py-20 bg-[#001529]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-[#1890FF]/20 rounded-xl flex items-center justify-center">
              <span className="text-2xl">📚</span>
            </div>
            <h2 className="text-3xl font-bold text-white">Key Learnings</h2>
          </div>
          <p className="text-gray-400 mb-8">
            Hard-won insights from {playbook.deployments} deployments:
          </p>
          <div className="space-y-4">
            {playbook.keyLearnings.map((learning, index) => (
              <div
                key={index}
                className="p-4 bg-white/5 border border-[#1890FF]/30 rounded-lg"
              >
                <p className="text-white">{learning}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technologies */}
      <section className="py-16 bg-white border-y">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-bold text-[var(--aci-secondary)] mb-6">Technologies Used</h2>
          <div className="flex flex-wrap gap-3">
            {playbook.technologies.map((tech) => (
              <span
                key={tech}
                className="px-4 py-2 bg-gray-100 rounded-lg text-gray-700 font-medium"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Industries */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-bold text-[var(--aci-secondary)] mb-6">Industries Served</h2>
          <div className="flex flex-wrap gap-3">
            {playbook.industries.map((industry) => (
              <span
                key={industry}
                className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700"
              >
                {industry}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Detailed Results */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <span className="text-2xl">📊</span>
            </div>
            <h2 className="text-3xl font-bold text-[var(--aci-secondary)]">Results & Impact</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {playbook.outcomes.map((result, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-xl">
                <div className="text-3xl font-bold text-[var(--aci-primary)] mb-2">{result.metric}</div>
                <div className="font-semibold text-[var(--aci-secondary)] mb-2">{result.description}</div>
                <p className="text-sm text-gray-500">{result.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Related Playbooks */}
      {relatedPlaybooks.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-[var(--aci-secondary)] mb-8">Related Playbooks</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {relatedPlaybooks.map((related) => (
                <Link
                  key={related.slug}
                  href={`/playbooks/${related.slug}`}
                  className="group bg-white rounded-xl p-6 hover:shadow-lg transition-all border border-gray-100"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <span className="px-2 py-1 bg-[#1890FF]/10 text-[#1890FF] text-xs font-medium rounded">
                      {related.category}
                    </span>
                    <span className="text-[#C4FF61] text-sm font-mono bg-[#001529] px-2 py-1 rounded">
                      {related.deployments}x
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-[var(--aci-secondary)] group-hover:text-[var(--aci-primary)] transition-colors mb-2">
                    {related.displayTitle}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">{related.fullTitle}</p>
                  <span className="text-[var(--aci-primary)] text-sm font-medium inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                    View Playbook <ArrowRight className="w-4 h-4" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-[var(--aci-primary)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Implement This Playbook?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Talk to an architect who has deployed this pattern {playbook.deployments} times.
          </p>
          <Button href={`/contact?playbook=${playbook.id}`} variant="lime" size="lg">
            Talk to the Architect
          </Button>
        </div>
      </section>
    </main>
  );
}
