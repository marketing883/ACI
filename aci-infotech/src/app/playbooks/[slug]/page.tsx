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
import { ArrowUpRight } from 'lucide-react';
import { getSiteUrl } from '@/lib/site-url';
import CtaSection from '@/components/v4/hero/CtaSection';
import { v4Display, v4Sans } from '@/components/v4/fonts';
import { cardShadow, CheckBadge } from '@/components/v4/page/kit';
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

/** Slash-label section head for the article-width sections. */
function PlaybookSectionHead({ kicker, title }: { kicker: string; title: string }) {
  return (
    <div>
      <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">/ {kicker}</p>
      <h2
        className={`text-2xl font-bold tracking-tight text-black sm:text-3xl ${v4Display}`}
        style={{ lineHeight: 1.1 }}
      >
        {title}
      </h2>
    </div>
  );
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

  const heroChips = [
    `${playbook.deployments}x deployed`,
    playbook.category,
    playbook.timeline,
    playbook.teamSize,
  ];

  return (
    <main className={`min-h-screen bg-white text-black ${v4Sans}`}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* Hero */}
      <section className="bg-white">
        <div className="mx-auto max-w-[960px] px-6 pt-12 md:pt-16">
          <Link
            href="/playbooks"
            className="group inline-flex items-center gap-1.5 text-sm font-semibold text-blue-700"
          >
            <span className="relative">
              All playbooks
              <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-current transition-transform duration-300 ease-out group-hover:scale-x-100" />
            </span>
            <ArrowUpRight size={14} aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>

          <p className="mb-4 mt-10 text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
            / {playbook.category} playbook
          </p>
          <h1
            className={`text-3xl font-bold tracking-tight text-black sm:text-4xl lg:text-[44px] ${v4Display}`}
            style={{ lineHeight: 1.08 }}
          >
            {playbook.displayTitle}
          </h1>
          <p className={`mt-4 text-lg font-semibold text-gray-700 ${v4Display}`}>{playbook.fullTitle}</p>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-gray-600 md:text-lg">
            {playbook.description}
          </p>

          <ul className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-[11px] font-semibold uppercase tracking-wide text-gray-500">
            {heroChips.map((chip) => (
              <li key={chip} className="whitespace-nowrap">
                {chip}
              </li>
            ))}
          </ul>

          {/* Download CTA (client island; only interactive piece) */}
          {playbook.downloadAvailable && (
            <div className="mt-9">
              <PlaybookDownloadCta
                playbookTitle={playbook.fullTitle}
                playbookSlug={playbook.slug}
              />
            </div>
          )}
        </div>
      </section>

      {/* Outcomes band right after the hero */}
      <section className="bg-white">
        <div className="mx-auto max-w-[960px] px-6 pt-12">
          <div className="rounded-3xl bg-[#0b1220] p-8 ring-1 ring-white/10 md:p-10">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/60">/ Typical outcomes</p>
            <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4">
              {playbook.outcomes.map((outcome, index) => (
                <div key={index}>
                  <p className={`text-4xl font-bold leading-none text-[#84CC16] lg:text-5xl ${v4Display}`}>
                    {outcome.metric}
                  </p>
                  <p className="mt-3 text-[11px] font-semibold uppercase leading-snug tracking-[0.16em] text-white/60">
                    {outcome.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Overview */}
      <section className="bg-white pt-16 md:pt-20">
        <div className="mx-auto max-w-[960px] border-t border-gray-200 px-6 pt-16 md:pt-20">
          <PlaybookSectionHead kicker="Overview" title="What this playbook is for" />
          <p className="mt-6 max-w-3xl text-[17px] leading-relaxed text-gray-800">{playbook.overview}</p>
        </div>
      </section>

      {/* Challenge pattern */}
      <section className="bg-white pt-16 md:pt-20">
        <div className="mx-auto max-w-[960px] border-t border-gray-200 px-6 pt-16 md:pt-20">
          <PlaybookSectionHead kicker="Challenge pattern" title="When this playbook applies" />
          <p className="mt-6 max-w-3xl text-[17px] leading-relaxed text-gray-800">
            This playbook fits organizations facing these common challenges:
          </p>
          <ul className="mt-8 max-w-3xl space-y-4">
            {playbook.challengePattern.map((point, index) => (
              <li key={index} className="flex items-baseline gap-4 border-t border-gray-200 pt-4">
                <span className={`text-sm font-semibold text-gray-300 ${v4Display}`}>
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="text-[15px] leading-relaxed text-gray-700">{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Solution approach */}
      <section className="bg-white pt-16 md:pt-20">
        <div className="mx-auto max-w-[960px] border-t border-gray-200 px-6 pt-16 md:pt-20">
          <PlaybookSectionHead kicker="Solution approach" title="How the pattern runs" />
          <ul className="mt-8 max-w-3xl space-y-4">
            {playbook.solutionApproach.map((point, index) => (
              <li key={index} className="flex items-start gap-3">
                <CheckBadge />
                <span className="text-[15px] leading-relaxed text-gray-700">{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Key learnings: dark proof surface */}
      <section className="bg-white pt-16 md:pt-20">
        <div className="mx-auto max-w-[960px] px-6">
          <div className="rounded-3xl bg-[#0b1220] p-8 ring-1 ring-white/10 md:p-10">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/60">/ Key learnings</p>
            <h2
              className={`mt-4 text-2xl font-bold tracking-tight text-white sm:text-3xl ${v4Display}`}
              style={{ lineHeight: 1.1 }}
            >
              Hard-won lessons from {playbook.deployments}&nbsp;deployments
            </h2>
            <div className="mt-8 space-y-4">
              {playbook.keyLearnings.map((learning, index) => (
                <div key={index} className="flex items-baseline gap-4 rounded-2xl bg-white/5 p-5 ring-1 ring-white/10">
                  <span className={`text-sm font-semibold text-[#84CC16] ${v4Display}`}>
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <p className="text-[15px] leading-relaxed text-white/85">{learning}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stack and industries */}
      <section className="bg-white pt-16 md:pt-20">
        <div className="mx-auto max-w-[960px] border-t border-gray-200 px-6 pt-16 md:pt-20">
          <div className="grid gap-12 md:grid-cols-2">
            <div>
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">/ Stack</p>
              <ul className="flex flex-wrap gap-x-5 gap-y-2 text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                {playbook.technologies.map((tech) => (
                  <li key={tech} className="whitespace-nowrap">
                    {tech}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">/ Industries served</p>
              <ul className="flex flex-wrap gap-x-5 gap-y-2 text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                {playbook.industries.map((industry) => (
                  <li key={industry} className="whitespace-nowrap">
                    {industry}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed results */}
      <section className="bg-white pt-16 md:pt-20">
        <div className="mx-auto max-w-[960px] border-t border-gray-200 px-6 pt-16 md:pt-20">
          <PlaybookSectionHead kicker="Results" title="What the pattern delivers" />
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {playbook.outcomes.map((result, index) => (
              <div key={index} className={`rounded-2xl bg-white p-7 ${cardShadow}`}>
                <p className={`text-4xl font-bold leading-none text-[#1D4ED8] ${v4Display}`}>{result.metric}</p>
                <p className={`mt-4 text-lg font-semibold text-black ${v4Display}`}>{result.description}</p>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">{result.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Related playbooks */}
      {relatedPlaybooks.length > 0 && (
        <section className="bg-white pt-16 md:pt-20">
          <div className="mx-auto max-w-7xl border-t border-gray-200 px-6 pb-16 pt-16 md:pb-20 md:pt-20">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">/ More patterns</p>
            <h2
              className={`text-3xl font-bold tracking-tight text-black sm:text-4xl ${v4Display}`}
              style={{ lineHeight: 1.08 }}
            >
              Related playbooks
            </h2>
            <div className="mt-10 grid gap-5 md:grid-cols-2">
              {relatedPlaybooks.map((related) => (
                <Link
                  key={related.slug}
                  href={`/playbooks/${related.slug}`}
                  className={`group flex flex-col rounded-2xl bg-white p-7 transition-shadow duration-300 hover:shadow-[0_6px_18px_rgba(63,74,126,0.1),0_2px_40px_rgba(63,74,126,0.16)] ${cardShadow}`}
                >
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-500">
                    {related.category} / {related.deployments}x deployed
                  </p>
                  <h3 className={`mt-4 text-xl font-semibold text-black md:text-2xl ${v4Display}`}>
                    {related.displayTitle}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-gray-600">{related.fullTitle}</p>
                  <span className="mt-6 flex items-center gap-1 text-sm font-semibold text-blue-700">
                    View the playbook
                    <ArrowUpRight size={15} aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {relatedPlaybooks.length === 0 && <div className="pt-16 md:pt-20" />}

      {/* Closing CTA: video stage, one button, nothing else */}
      <CtaSection
        label="Let's Walk Through This Playbook"
        href={`/contact?playbook=${playbook.id}`}
      />
    </main>
  );
}
