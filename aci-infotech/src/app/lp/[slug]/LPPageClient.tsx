'use client';

/**
 * Client body of a landing page. The server page (page.tsx) resolves
 * the slug, metadata, and robots policy; this component owns the
 * interactive layer: UTM capture, visitor personalization, GTM events,
 * and the form-success redirect.
 *
 * It initializes state from the server-provided base content, so the
 * server-rendered HTML carries the full page copy (the previous
 * implementation used useSearchParams at the top of the tree, which
 * bailed the whole page out to a client-side spinner). URL params are
 * read from window.location in an effect — personalization is a
 * post-hydration enhancement for paid traffic, invisible to crawlers.
 */

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import LPLayout from '@/components/landing-pages/LPLayout';
import LPHero from '@/components/landing-pages/LPHero';
import LPPainPoints from '@/components/landing-pages/LPPainPoints';
import LPStats from '@/components/landing-pages/LPStats';
import LPSolution from '@/components/landing-pages/LPSolution';
import LPBenefits from '@/components/landing-pages/LPBenefits';
import LPProof from '@/components/landing-pages/LPProof';
import LPFAQ from '@/components/landing-pages/LPFAQ';
import LPCTASection from '@/components/landing-pages/LPCTASection';
import { getPersonalizedContent, LPContent } from '@/lib/lp-content';
import {
  buildVisitorContext,
  updateVisitorHistory,
  personalizeHeadline,
  VisitorContext,
} from '@/lib/lp-personalization';

interface UtmParams {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
}

export default function LPPageClient({
  slug,
  baseContent,
}: {
  slug: string;
  baseContent: LPContent;
}) {
  const router = useRouter();

  // Server HTML renders the base content; paid-traffic personalization
  // swaps in after hydration when ?ind= / ?role= / ?pain= are present.
  const [content, setContent] = useState<LPContent>(baseContent);
  const [context, setContext] = useState<VisitorContext | null>(null);
  const [utmParams, setUtmParams] = useState<UtmParams>({});

  // Deliberate setState-in-effect: URL params and document.referrer are
  // browser-only, and reading them post-mount (instead of useSearchParams)
  // is exactly what keeps this page server-renderable. The extra render
  // only happens for visitors arriving with personalization params.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const search = new URLSearchParams(window.location.search);
    const utm: UtmParams = {
      utmSource: search.get('utm_source') || undefined,
      utmMedium: search.get('utm_medium') || undefined,
      utmCampaign: search.get('utm_campaign') || undefined,
      utmContent: search.get('utm_content') || undefined,
      utmTerm: search.get('utm_term') || undefined,
    };
    setUtmParams(utm);

    const industryParam = search.get('ind') || search.get('industry') || undefined;
    const roleParam = search.get('role') || undefined;
    const painParam = search.get('pain') || undefined;
    if (industryParam || roleParam || painParam) {
      const personalized = getPersonalizedContent(slug, industryParam, roleParam, painParam);
      if (personalized) setContent(personalized);
    }

    // Build visitor context
    setContext(buildVisitorContext(document.referrer, window.location.href));

    // Track page view
    updateVisitorHistory(`/lp/${slug}`);

    // Push GTM event
    const dataLayer = (window as unknown as { dataLayer?: unknown[] }).dataLayer;
    if (dataLayer) {
      dataLayer.push({
        event: 'lp_page_view',
        lp_slug: slug,
        lp_service_cluster: baseContent.serviceCluster,
        utm_source: utm.utmSource,
        utm_campaign: utm.utmCampaign,
      });
    }
  }, [slug, baseContent.serviceCluster]);
  /* eslint-enable react-hooks/set-state-in-effect */

  // Handle form success
  const handleFormSuccess = (data: { firstName: string; serviceCluster: string; lookingFor: string }) => {
    const dataLayer = (window as unknown as { dataLayer?: unknown[] }).dataLayer;
    if (dataLayer) {
      dataLayer.push({
        event: 'lp_form_submit',
        lp_slug: slug,
        lp_service_cluster: data.serviceCluster,
        lp_looking_for: data.lookingFor,
      });
    }

    const thankYouParams = new URLSearchParams({
      name: data.firstName,
      service: data.serviceCluster,
      interest: data.lookingFor,
    });
    router.push(`/lp/thank-you?${thankYouParams.toString()}`);
  };

  // Personalize headline if context available
  const personalizedHeadline = context
    ? personalizeHeadline(
        content.headline,
        context,
        content.industryVariants
          ? Object.fromEntries(
              Object.entries(content.industryVariants).map(([k, v]) => [k, v.headline || content.headline])
            )
          : undefined,
        content.roleVariants
          ? Object.fromEntries(
              Object.entries(content.roleVariants).map(([k, v]) => [k, v.headline || content.headline])
            )
          : undefined
      )
    : content.headline;

  return (
    <LPLayout>
      {/* Hero Section */}
      <LPHero
        headline={personalizedHeadline}
        subheadline={content.subheadline}
        ctoText={content.ctoText}
        landingPage={slug}
        serviceCluster={content.serviceCluster}
        certifications={content.certifications}
        context={context || undefined}
        utmParams={utmParams}
        urlParams={{}}
        onFormSuccess={handleFormSuccess}
      />

      {/* Pain Points */}
      <LPPainPoints headline={content.painPointsHeadline} painPoints={content.painPoints} />

      {/* Stats */}
      <LPStats stats={content.stats} />

      {/* Solution / Process */}
      <LPSolution
        headline={content.solutionHeadline}
        description={content.solutionDescription}
        processSteps={content.processSteps}
      />

      {/* Benefits */}
      <LPBenefits headline={content.benefitsHeadline} benefits={content.benefits} />

      {/* Proof / Case Studies */}
      <LPProof proofItems={content.proofItems} />

      {/* FAQ */}
      <LPFAQ faqs={content.faqs} />

      {/* Final CTA */}
      <LPCTASection
        headline="Ready to Modernize How You Operate?"
        subheadline="Get your personalized assessment and roadmap from our certified experts."
        ctoText={content.ctoText}
        ctoSecondaryText={content.ctoSecondaryText}
      />
    </LPLayout>
  );
}
