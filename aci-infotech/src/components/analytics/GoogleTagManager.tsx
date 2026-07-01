'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, Suspense } from 'react';

// Declare dataLayer on window
declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
  }
}

// Helper function to push events to dataLayer (GTM reads this)
export function pushToDataLayer(event: string, data?: Record<string, unknown>) {
  if (typeof window !== 'undefined') {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event,
      ...data,
    });
  }
}

// Track page views
export function trackPageView(url: string, title?: string) {
  pushToDataLayer('page_view', {
    page_path: url,
    page_title: title || (typeof document !== 'undefined' ? document.title : ''),
    page_location: typeof window !== 'undefined' ? window.location.href : '',
  });
}

// Track custom events
export function trackEvent(
  eventName: string,
  parameters?: Record<string, string | number | boolean>
) {
  pushToDataLayer(eventName, parameters);
}

// Track content views (blog, whitepaper, case study, etc.)
export function trackContentView(
  contentType: 'blog_post' | 'whitepaper' | 'case_study' | 'webinar' | 'playbook',
  contentId: string,
  contentTitle: string,
  category?: string
) {
  pushToDataLayer('view_item', {
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
  pushToDataLayer('file_download', {
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
  pushToDataLayer('generate_lead', {
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
  pushToDataLayer('cta_click', {
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
  pushToDataLayer(`${engagementType}_milestone`, {
    engagement_type: engagementType,
    engagement_value: value,
    page_type: pageType || 'general',
  });
}

// Track search
export function trackSearch(searchTerm: string, searchLocation: string) {
  pushToDataLayer('search', {
    search_term: searchTerm,
    search_location: searchLocation,
  });
}

// Track service page interest - key for B2B targeting
export function trackServiceInterest(serviceName: string, serviceCategory: string) {
  pushToDataLayer('service_interest', {
    service_name: serviceName,
    service_category: serviceCategory,
  });

  // Set user property for audience building
  pushToDataLayer('set_user_properties', {
    interested_service: serviceName,
    last_service_viewed: serviceName,
  });
}

// Track high-value page views (contact, pricing intent)
export function trackHighIntentPage(pageName: string) {
  pushToDataLayer('high_intent_page_view', {
    page_name: pageName,
    timestamp: new Date().toISOString(),
  });
}

// Service name mapping for cleaner tracking
const SERVICE_MAPPING: Record<string, { name: string; category: string }> = {
  'data-engineering': { name: 'Data Engineering', category: 'Data & Analytics' },
  'applied-ai-ml': { name: 'Applied AI & ML', category: 'AI & Automation' },
  'cloud-modernization': { name: 'Cloud Modernization', category: 'Infrastructure' },
  'martech-cdp': { name: 'MarTech & CDP', category: 'Marketing Technology' },
  'enterprise-integration': { name: 'Enterprise Integration', category: 'Integration' },
  'security-compliance': { name: 'Security & Compliance', category: 'Security' },
};

// Page view tracker component
function PageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (pathname) {
      const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');
      trackPageView(url);

      // Track content type based on URL pattern
      if (pathname.startsWith('/blogs/') && pathname.split('/').length > 2) {
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

      // Track service page interest - crucial for B2B audience building
      if (pathname.startsWith('/services/')) {
        const serviceSlug = pathname.split('/').pop();
        if (serviceSlug && SERVICE_MAPPING[serviceSlug]) {
          const service = SERVICE_MAPPING[serviceSlug];
          trackServiceInterest(service.name, service.category);
        }
      }

      // Track high-intent pages
      if (pathname === '/contact') {
        trackHighIntentPage('contact');
      }
    }
  }, [pathname, searchParams]);

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

// Engagement scoring tracker - identifies high-value prospects
function EngagementScoreTracker() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Initialize or get existing engagement score from session
    const STORAGE_KEY = 'aci_engagement_score';
    const PAGES_KEY = 'aci_pages_viewed';

    let score = parseInt(sessionStorage.getItem(STORAGE_KEY) || '0', 10);
    const pagesViewed = JSON.parse(sessionStorage.getItem(PAGES_KEY) || '[]');
    const currentPage = window.location.pathname;

    // Don't count admin pages
    if (currentPage.startsWith('/admin')) return;

    // Score based on page type (only if not already viewed this session)
    if (!pagesViewed.includes(currentPage)) {
      pagesViewed.push(currentPage);
      sessionStorage.setItem(PAGES_KEY, JSON.stringify(pagesViewed));

      // Scoring logic
      if (currentPage === '/contact') score += 20;
      else if (currentPage.startsWith('/services/')) score += 10;
      else if (currentPage.startsWith('/case-studies/')) score += 8;
      else if (currentPage.startsWith('/whitepapers/')) score += 8;
      else if (currentPage.startsWith('/playbooks/')) score += 5;
      else if (currentPage.startsWith('/blogs/')) score += 3;
      else if (currentPage === '/') score += 1;
      else score += 2;

      sessionStorage.setItem(STORAGE_KEY, score.toString());
    }

    // Set engagement level as user property
    let engagementLevel = 'low';
    if (score >= 50) engagementLevel = 'high';
    else if (score >= 25) engagementLevel = 'medium';

    pushToDataLayer('set_user_properties', {
      engagement_score: score,
      engagement_level: engagementLevel,
      pages_viewed_count: pagesViewed.length,
    });

    // Track milestone events for audience triggers
    const milestones = [25, 50, 75, 100];
    const reachedMilestones = JSON.parse(sessionStorage.getItem('aci_score_milestones') || '[]');

    milestones.forEach(milestone => {
      if (score >= milestone && !reachedMilestones.includes(milestone)) {
        reachedMilestones.push(milestone);
        sessionStorage.setItem('aci_score_milestones', JSON.stringify(reachedMilestones));

        pushToDataLayer('engagement_milestone', {
          milestone_value: milestone,
          engagement_level: engagementLevel,
          pages_viewed: pagesViewed.length,
        });
      }
    });

    // Track "qualified visitor" - high engagement without conversion
    if (score >= 40 && pagesViewed.length >= 3) {
      const qualified = sessionStorage.getItem('aci_qualified_tracked');
      if (!qualified) {
        sessionStorage.setItem('aci_qualified_tracked', 'true');
        pushToDataLayer('qualified_visitor', {
          engagement_score: score,
          pages_viewed: pagesViewed.length,
          services_viewed: pagesViewed.filter((p: string) => p.startsWith('/services/')).length,
        });
      }
    }
  }, []);

  return null;
}

// Enhanced tracking components. The GTM container itself is installed
// server-side in the document <head> (see src/app/layout.tsx +
// GTM_BOOTSTRAP_SCRIPT) so it is present in the initial HTML and Tag
// Assistant can find it. This component only mounts the client-side
// trackers that push events into the already-initialised dataLayer.
export default function GoogleTagManager() {
  return (
    <>
      <Suspense fallback={null}>
        <PageViewTracker />
      </Suspense>
      <ScrollDepthTracker />
      <TimeOnPageTracker />
      <CTAClickTracker />
      <EngagementScoreTracker />
    </>
  );
}
