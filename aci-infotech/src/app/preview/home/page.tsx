/**
 * /preview/home - reimagined homepage candidate.
 *
 * Live / is intentionally untouched. Once this preview is signed off,
 * its contents move into src/app/page.tsx in a separate commit.
 *
 * Structural change vs live:
 *   - Hero: scene-rotating HeroRotator (video bg + cross-fading scenes).
 *   - Playbooks: PlaybooksConsole (Palantir/Sentry austere-technical view).
 *   - Case Studies: CaseStudiesKineticSection (Figma-style per-study identities).
 *   - Testimonials: dropped (may surface as a /testimonials page later).
 *   - Final CTA: copy + button rewritten to "Start here" so every
 *     primary CTA on the page reads the same.
 *
 * Below-fold sections (WhatWeBuild, Partners, News, ArqAI, Blog) are
 * the live components, reused unchanged.
 */

export const revalidate = 60;

import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import {
  DynamicBlogSection,
  DynamicNewsSection,
} from '@/components/sections';

import HeroRotator from '@/components/preview/home/HeroRotator';
import PlaybooksConsole from '@/components/preview/home/PlaybooksConsole';
import CaseStudiesKineticSection from '@/components/preview/home/CaseStudiesKineticSection';

const WhatWeBuildSection = dynamic(
  () => import('@/components/sections/WhatWeBuildSection'),
);
const PartnersSection = dynamic(
  () => import('@/components/sections/PartnersSection'),
);
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

export default function PreviewHomePage() {
  return (
    <>
      <HeroRotator />
      <PlaybooksConsole />
      <WhatWeBuildSection />
      <CaseStudiesKineticSection />
      <PartnersSection
        headline="The Platforms We Build On"
        partners={partners}
      />
      <DynamicNewsSection
        headline="In The News"
        subheadline="Recent recognition and partnerships"
      />
      {/* id anchor so the hero "See ArqAI" CTA scrolls here. */}
      <div id="arqai" className="scroll-mt-24">
        <ArqAISection />
      </div>
      <DynamicBlogSection
        headline="Thoughts and Insights"
        subheadline="Technical depth from engineers who've been there"
        limit={4}
      />

      {/* Final CTA - kept structurally identical to live, but the primary
          button now reads "Start here" so the whole page speaks one
          consistent voice. */}
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
            {"Let's Turn Your Toughest Problems Into\u00A0Production."}
          </h2>
          <p className="text-xl md:text-2xl text-white/90 mb-14 max-w-3xl mx-auto leading-relaxed drop-shadow-md">
            {'Whatever you are building, modernizing, or fixing, we have the people and the track record to get it into production and keep it\u00A0running.'}
          </p>

          <Link
            href="/contact?reason=home-final-cta-v2"
            className="group inline-flex items-center gap-2.5 px-9 py-4 bg-[#C4FF61] text-[#0A1628] text-lg font-semibold rounded-lg hover:-translate-y-0.5 transition-all duration-200"
          >
            <span>Let&apos;s Get Started</span>
            <ArrowRight
              className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1"
              strokeWidth={2.25}
              aria-hidden
            />
          </Link>
        </div>
      </section>
    </>
  );
}
