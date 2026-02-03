'use client';

import { useEffect, useState, Suspense } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
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
import { Loader2 } from 'lucide-react';

function LandingPageContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const [content, setContent] = useState<LPContent | null>(null);
  const [context, setContext] = useState<VisitorContext | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Parse URL and UTM parameters
  const utmParams = {
    utmSource: searchParams.get('utm_source') || undefined,
    utmMedium: searchParams.get('utm_medium') || undefined,
    utmCampaign: searchParams.get('utm_campaign') || undefined,
    utmContent: searchParams.get('utm_content') || undefined,
    utmTerm: searchParams.get('utm_term') || undefined,
  };

  const urlParams = {
    industryParam: searchParams.get('ind') || searchParams.get('industry') || undefined,
    roleParam: searchParams.get('role') || undefined,
  };

  useEffect(() => {
    if (!slug) return;

    // Build visitor context
    const visitorContext = buildVisitorContext(
      typeof document !== 'undefined' ? document.referrer : undefined,
      typeof window !== 'undefined' ? window.location.href : undefined
    );
    setContext(visitorContext);

    // Get personalized content
    const lpContent = getPersonalizedContent(slug, urlParams.industryParam, urlParams.roleParam);

    if (!lpContent) {
      // Redirect to 404 if LP doesn't exist
      router.push('/404');
      return;
    }

    setContent(lpContent);
    setIsLoading(false);

    // Track page view
    updateVisitorHistory(`/lp/${slug}`);

    // Push GTM event
    if (typeof window !== 'undefined' && (window as unknown as { dataLayer?: unknown[] }).dataLayer) {
      (window as unknown as { dataLayer: unknown[] }).dataLayer.push({
        event: 'lp_page_view',
        lp_slug: slug,
        lp_service_cluster: lpContent.serviceCluster,
        utm_source: utmParams.utmSource,
        utm_campaign: utmParams.utmCampaign,
      });
    }
  }, [slug, urlParams.industryParam, urlParams.roleParam]);

  // Handle form success
  const handleFormSuccess = (data: { firstName: string; serviceCluster: string; lookingFor: string }) => {
    // Push conversion event to GTM
    if (typeof window !== 'undefined' && (window as unknown as { dataLayer?: unknown[] }).dataLayer) {
      (window as unknown as { dataLayer: unknown[] }).dataLayer.push({
        event: 'lp_form_submit',
        lp_slug: slug,
        lp_service_cluster: data.serviceCluster,
        lp_looking_for: data.lookingFor,
      });
    }

    // Redirect to thank you page with context
    const thankYouParams = new URLSearchParams({
      name: data.firstName,
      service: data.serviceCluster,
      interest: data.lookingFor,
    });
    router.push(`/lp/thank-you?${thankYouParams.toString()}`);
  };

  // Loading state
  if (isLoading || !content) {
    return (
      <LPLayout>
        <div className="min-h-screen flex items-center justify-center bg-[#0A1628]">
          <Loader2 className="w-12 h-12 text-white animate-spin" />
        </div>
      </LPLayout>
    );
  }

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
      {/* SEO Meta Tags */}
      <title>{content.metaTitle}</title>
      <meta name="description" content={content.metaDescription} />
      <meta name="robots" content="noindex, nofollow" />

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
        urlParams={urlParams}
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
        headline="Ready to Transform Your Business?"
        subheadline="Get your personalized assessment and roadmap from our certified experts."
        ctoText={content.ctoText}
        ctoSecondaryText={content.ctoSecondaryText}
      />
    </LPLayout>
  );
}

function LoadingFallback() {
  return (
    <LPLayout>
      <div className="min-h-screen flex items-center justify-center bg-[#0A1628]">
        <Loader2 className="w-12 h-12 text-white animate-spin" />
      </div>
    </LPLayout>
  );
}

export default function LandingPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <LandingPageContent />
    </Suspense>
  );
}
