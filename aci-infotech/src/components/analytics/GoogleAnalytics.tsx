'use client';

import Script from 'next/script';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, Suspense } from 'react';

// GA4 Measurement ID
const GA_MEASUREMENT_ID = 'G-145NLC9TW3';

// Declare gtag on window
declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[];
  }
}

// Helper function to send GA4 events
export function gtag(...args: unknown[]) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag(...args);
  }
}

// Track page views
export function trackPageView(url: string, title?: string) {
  gtag('event', 'page_view', {
    page_path: url,
    page_title: title || document.title,
    page_location: window.location.href,
  });
}

// Track custom events
export function trackEvent(
  eventName: string,
  parameters?: Record<string, string | number | boolean>
) {
  gtag('event', eventName, parameters);
}

// Track content views (blog, whitepaper, case study, etc.)
export function trackContentView(
  contentType: 'blog_post' | 'whitepaper' | 'case_study' | 'webinar' | 'playbook',
  contentId: string,
  contentTitle: string,
  category?: string
) {
  gtag('event', 'view_item', {
    content_type: contentType,
    content_id: contentId,
    content_title: contentTitle,
    content_category: category || 'uncategorized',
  });
}

// Track downloads
export function trackDownload(
  fileName: string,
  contentType: string,
  contentTitle: string
) {
  gtag('event', 'file_download', {
    file_name: fileName,
    content_type: contentType,
    content_title: contentTitle,
    file_extension: fileName.split('.').pop() || 'unknown',
  });
}

// Track form submissions
export function trackFormSubmission(
  formName: string,
  formLocation: string,
  additionalData?: Record<string, string>
) {
  gtag('event', 'generate_lead', {
    form_name: formName,
    form_location: formLocation,
    ...additionalData,
  });
}

// Track CTA clicks
export function trackCTAClick(
  ctaText: string,
  ctaLocation: string,
  destination?: string
) {
  gtag('event', 'cta_click', {
    cta_text: ctaText,
    cta_location: ctaLocation,
    cta_destination: destination || 'unknown',
  });
}

// Track engagement milestones
export function trackEngagement(
  engagementType: 'scroll_depth' | 'time_on_page' | 'video_progress',
  value: number,
  pageType?: string
) {
  gtag('event', `${engagementType}_milestone`, {
    engagement_type: engagementType,
    engagement_value: value,
    page_type: pageType || 'general',
  });
}

// Track search
export function trackSearch(searchTerm: string, searchLocation: string) {
  gtag('event', 'search', {
    search_term: searchTerm,
    search_location: searchLocation,
  });
}

// Page view tracker component
function PageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (pathname) {
      const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');
      trackPageView(url);

      // Track content type based on URL pattern
      if (pathname.startsWith('/blog/') && pathname.split('/').length > 2) {
        const slug = pathname.split('/').pop();
        if (slug) trackContentView('blog_post', slug, document.title, 'blog');
      } else if (pathname.startsWith('/whitepapers/') && pathname.split('/').length > 2) {
        const slug = pathname.split('/').pop();
        if (slug && slug !== 'thank-you') trackContentView('whitepaper', slug, document.title, 'whitepaper');
      } else if (pathname.startsWith('/case-studies/') && pathname.split('/').length > 2) {
        const slug = pathname.split('/').pop();
        if (slug) trackContentView('case_study', slug, document.title, 'case-study');
      } else if (pathname.startsWith('/webinars/') && pathname.split('/').length > 2) {
        const slug = pathname.split('/').pop();
        if (slug) trackContentView('webinar', slug, document.title, 'webinar');
      } else if (pathname.startsWith('/playbooks/') && pathname.split('/').length > 2) {
        const slug = pathname.split('/').pop();
        if (slug) trackContentView('playbook', slug, document.title, 'playbook');
      }
    }
  }, [pathname, searchParams]);

  return null;
}

// Scroll depth tracker
function ScrollDepthTracker() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const milestones = [25, 50, 75, 90, 100];
    const reachedMilestones = new Set<number>();

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = docHeight > 0 ? Math.round((scrollTop / docHeight) * 100) : 0;

      milestones.forEach((milestone) => {
        if (scrollPercent >= milestone && !reachedMilestones.has(milestone)) {
          reachedMilestones.add(milestone);
          trackEngagement('scroll_depth', milestone, getPageType());
        }
      });
    };

    // Debounce scroll handler
    let ticking = false;
    const scrollListener = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', scrollListener, { passive: true });
    return () => window.removeEventListener('scroll', scrollListener);
  }, []);

  return null;
}

// Time on page tracker
function TimeOnPageTracker() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const timeThresholds = [30, 60, 120, 300]; // seconds
    const reachedThresholds = new Set<number>();
    let startTime = Date.now();

    const interval = setInterval(() => {
      const timeSpent = Math.floor((Date.now() - startTime) / 1000);

      timeThresholds.forEach((threshold) => {
        if (timeSpent >= threshold && !reachedThresholds.has(threshold)) {
          reachedThresholds.add(threshold);
          trackEngagement('time_on_page', threshold, getPageType());
        }
      });
    }, 5000); // Check every 5 seconds

    // Reset on visibility change
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        startTime = Date.now();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return null;
}

// Helper to determine page type from URL
function getPageType(): string {
  if (typeof window === 'undefined') return 'unknown';

  const pathname = window.location.pathname;

  if (pathname === '/') return 'homepage';
  if (pathname.startsWith('/blog')) return 'blog';
  if (pathname.startsWith('/whitepapers')) return 'whitepaper';
  if (pathname.startsWith('/case-studies')) return 'case-study';
  if (pathname.startsWith('/webinars')) return 'webinar';
  if (pathname.startsWith('/playbooks')) return 'playbook';
  if (pathname.startsWith('/services')) return 'services';
  if (pathname.startsWith('/contact')) return 'contact';
  if (pathname.startsWith('/admin')) return 'admin';

  return 'other';
}

// CTA click tracker - attaches to document
function CTAClickTracker() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a, button');

      if (!link) return;

      // Track CTA buttons
      if (
        link.classList.contains('btn-primary') ||
        link.classList.contains('btn-secondary') ||
        link.getAttribute('data-track-cta')
      ) {
        const ctaText = link.textContent?.trim() || 'Unknown CTA';
        const href = link.getAttribute('href') || '';
        const location = getPageType();

        trackCTAClick(ctaText, location, href);
      }

      // Track external links
      if (link.tagName === 'A') {
        const href = link.getAttribute('href') || '';
        if (href.startsWith('http') && !href.includes(window.location.hostname)) {
          trackEvent('outbound_link', {
            link_url: href,
            link_text: link.textContent?.trim() || 'Unknown',
            page_location: window.location.pathname,
          });
        }
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  return null;
}

// Main GoogleAnalytics component
export default function GoogleAnalytics() {
  return (
    <>
      {/* GA4 base script */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', '${GA_MEASUREMENT_ID}', {
            page_path: window.location.pathname,
            send_page_view: true,
            cookie_flags: 'SameSite=None;Secure',
            // Enhanced measurement settings
            enhanced_measurement: {
              scrolls: true,
              outbound_clicks: true,
              site_search: true,
              video_engagement: true,
              file_downloads: true
            }
          });
        `}
      </Script>

      {/* Enhanced tracking components */}
      <Suspense fallback={null}>
        <PageViewTracker />
      </Suspense>
      <ScrollDepthTracker />
      <TimeOnPageTracker />
      <CTAClickTracker />
    </>
  );
}
