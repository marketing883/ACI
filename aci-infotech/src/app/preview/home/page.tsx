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
      <PartnersSection partners={partners} />
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
            Talk to people who&apos;ve actually deployed these systems.
          </h2>
          <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed drop-shadow-md">
            No sales teams. No junior consultants. Just senior practitioners
            who&apos;ve architected and deployed the infrastructure
            you&apos;re considering.
          </p>

          <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-6 sm:gap-10 mb-14">
            <div className="flex items-center gap-3 text-white">
              <span className="w-2.5 h-2.5 bg-[#C4FF61] rounded-full flex-shrink-0 shadow-lg shadow-[#C4FF61]/30" />
              <span className="text-base md:text-lg drop-shadow-md">
                30-minute technical conversations with architects
              </span>
            </div>
            <div className="flex items-center gap-3 text-white">
              <span className="w-2.5 h-2.5 bg-[#C4FF61] rounded-full flex-shrink-0 shadow-lg shadow-[#C4FF61]/30" />
              <span className="text-base md:text-lg drop-shadow-md">
                Architecture diagrams from live deployments
              </span>
            </div>
            <div className="flex items-center gap-3 text-white">
              <span className="w-2.5 h-2.5 bg-[#C4FF61] rounded-full flex-shrink-0 shadow-lg shadow-[#C4FF61]/30" />
              <span className="text-base md:text-lg drop-shadow-md">
                Honest answers about feasibility, timeline, and risk
              </span>
            </div>
          </div>

          <Link
            href="/contact?reason=home-final-cta-v2"
            className="group inline-flex items-center gap-2.5 px-9 py-4 bg-[#C4FF61] text-[#0A1628] text-lg font-semibold rounded-lg hover:-translate-y-0.5 transition-all duration-200"
          >
            <span>Start here</span>
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
