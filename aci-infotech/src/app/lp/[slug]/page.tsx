/**
 * Landing page route — server component.
 *
 * Previously a client component whose top-level useSearchParams bailed
 * every LP out to a client-rendered spinner: no server HTML, no H1,
 * and even the robots directive only existed after JS ran. Now the
 * server resolves content and metadata; LPPageClient owns the
 * interactive layer (UTM capture, personalization, GTM, form flow)
 * and initializes from the same base content, so the full page copy
 * ships in the initial HTML.
 *
 * Robots policy: paid-only LPs stay noindexed. The slugs in
 * PROMOTED_LP_SLUGS (one per commercial intent) are indexable — they
 * are the only pages on the site targeting those bottom-funnel
 * queries. See src/lib/lp-promoted.ts.
 */

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getLPContent, LP_CONTENT } from '@/lib/lp-content';
import { isPromotedLP } from '@/lib/lp-promoted';
import { getSiteUrl } from '@/lib/site-url';
import LPPageClient from './LPPageClient';

const siteUrl = getSiteUrl();

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return Object.keys(LP_CONTENT).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const content = getLPContent(slug);
  if (!content) {
    return { title: 'Page Not Found', robots: { index: false, follow: false } };
  }
  const indexable = isPromotedLP(slug);
  return {
    // metaTitle strings already carry the brand; absolute avoids the
    // root template appending it a second time.
    title: { absolute: content.metaTitle },
    description: content.metaDescription,
    alternates: { canonical: `${siteUrl}/lp/${slug}` },
    robots: indexable
      ? { index: true, follow: true }
      : { index: false, follow: false },
    openGraph: {
      title: content.metaTitle,
      description: content.metaDescription,
      url: `${siteUrl}/lp/${slug}`,
      siteName: 'ACI Infotech',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: content.metaTitle,
      description: content.metaDescription,
    },
  };
}

export default async function LandingPage({ params }: PageProps) {
  const { slug } = await params;
  const content = getLPContent(slug);

  // Real 404 (the previous version returned a 200 "Page Not Found" body).
  if (!content) {
    notFound();
  }

  return <LPPageClient slug={slug} baseContent={content} />;
}
