/**
 * /v1 — verbatim preservation of the current production homepage.
 *
 * This route always renders the v1 HomePage regardless of whether
 * the build is staging or production. During the v2 migration it
 * serves as a side-by-side reference (staging's `/` renders v2,
 * `/v1` renders v1) so QA can compare without deploying twice.
 *
 * On production builds, `/v1` is just a mirror of `/` — Google sees
 * `/` as canonical via the metadata block below, so `/v1` stays
 * indexable-but-deprioritized.
 */

import type { Metadata } from 'next';

// ISR: Revalidate every 60 seconds for fast cached responses
// Blog/case study sections use unstable_noStore() internally for fresh data
export const revalidate = 60;

import dynamic from 'next/dynamic';
import Image from 'next/image';
import Button from '@/components/ui/Button';
import {
  HeroSection,
  DynamicCaseStudiesSection,
  DynamicBlogSection,
  DynamicNewsSection,
} from '@/components/sections';
import { getSiteUrl } from '@/lib/site-url';

// Lazy-load below-fold client sections to reduce initial JS bundle
const PlaybookVaultSection = dynamic(() => import('@/components/sections/PlaybookVaultSection'));
const WhatWeBuildSection = dynamic(() => import('@/components/sections/WhatWeBuildSection'));
const PartnersSection = dynamic(() => import('@/components/sections/PartnersSection'));
const ArqAISection = dynamic(() => import('@/components/sections/ArqAISection'));

const partners = [
  { name: 'Databricks', logo_url: '/images/Solution-Partners/databricks.png' },
  { name: 'Dynatrace', logo_url: '/images/Solution-Partners/dynatrace.png' },
  { name: 'Salesforce', logo_url: '/images/Solution-Partners/salesforce.png' },
  { name: 'AWS', logo_url: '/images/Solution-Partners/aws.png' },
  { name: 'Microsoft Azure', logo_url: '/images/Solution-Partners/azure.png' },
  { name: 'SAP', logo_url: '/images/Solution-Partners/sap.png' },
  { name: 'ServiceNow', logo_url: '/images/Solution-Partners/servicenow.png' },
  { name: 'Braze', logo_url: '/images/Solution-Partners/braze.png' },
];

// Canonical origin: always production, so staging builds can never
// self-canonicalize (see src/lib/site-url.ts).
const siteUrl = getSiteUrl();

// Internal comparison route only. Noindexed: this is a near-duplicate
// of the homepage, and its previous self-referencing canonical was
// splitting homepage ranking signals.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
  alternates: {
    canonical: siteUrl,
  },
};

export default function V1HomePage() {
  return (
    <>
      {/* Hero Section with Video Background */}
      <HeroSection />

      {/* Playbook Vault Section */}
      <PlaybookVaultSection />

      {/* What We Build - System Architecture Diagram */}
      <WhatWeBuildSection />

      {/* Case Studies Section - Dynamic from CMS */}
      <DynamicCaseStudiesSection
        headline="Here's What We Built. Here's What It Delivered."
        subheadline="Real projects. Real Fortune 500 clients. Real outcomes."
      />

      {/* Partners Section */}
      <PartnersSection partners={partners} />

      {/* News Section - Dynamic from CMS */}
      <DynamicNewsSection
        headline="In The News"
        subheadline="Recent recognition and partnerships"
      />

      {/* ArqAI Platform Section */}
      <ArqAISection />

      {/* Blog Preview Section - Dynamic from Database */}
      <DynamicBlogSection
        headline="Thoughts and Insights"
        subheadline="Technical depth from engineers who've been there"
        limit={4}
      />

      {/* Final CTA Section */}
      <section className="relative py-28 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/aci-cta-home-bg.jpg"
            alt=""
            fill
            quality={75}
            loading="lazy"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0A1628]/70 via-[#0A1628]/80 to-[#0A1628]/70" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8 font-[var(--font-title)] drop-shadow-lg">
            Talk to People Who&apos;ve Actually Deployed These Systems.
          </h2>
          <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed drop-shadow-md">
            No sales teams. No junior consultants. Just senior practitioners who&apos;ve architected and deployed the infrastructure you&apos;re considering.
          </p>

          <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-6 sm:gap-10 mb-14">
            <div className="flex items-center gap-3 text-white">
              <span className="w-2.5 h-2.5 bg-[#C4FF61] rounded-full flex-shrink-0 shadow-lg shadow-[#C4FF61]/30" />
              <span className="text-base md:text-lg drop-shadow-md">30-minute technical conversations with architects</span>
            </div>
            <div className="flex items-center gap-3 text-white">
              <span className="w-2.5 h-2.5 bg-[#C4FF61] rounded-full flex-shrink-0 shadow-lg shadow-[#C4FF61]/30" />
              <span className="text-base md:text-lg drop-shadow-md">Architecture diagrams from live deployments</span>
            </div>
            <div className="flex items-center gap-3 text-white">
              <span className="w-2.5 h-2.5 bg-[#C4FF61] rounded-full flex-shrink-0 shadow-lg shadow-[#C4FF61]/30" />
              <span className="text-base md:text-lg drop-shadow-md">Honest answers about feasibility, timeline, and risk</span>
            </div>
          </div>

          <Button href="/contact" variant="lime" size="lg">
            Schedule a Discussion
          </Button>
        </div>
      </section>
    </>
  );
}
