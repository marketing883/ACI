'use client';

import { useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { initTracker, getTracker, destroyTracker } from '@/lib/analytics/tracker';
import { initTriggerEngine, destroyTriggerEngine } from '@/lib/analytics/engagement-triggers';

interface VisitorTrackerProps {
  debug?: boolean;
}

/**
 * VisitorTracker - Initialize real-time analytics tracking
 *
 * Add this component to your root layout to enable tracking:
 *
 * <VisitorTracker debug={process.env.NODE_ENV === 'development'} />
 */
export function VisitorTracker({ debug = false }: VisitorTrackerProps) {
  const pathname = usePathname();

  // Initialize tracker on mount
  useEffect(() => {
    // Skip tracking on admin pages
    if (pathname?.startsWith('/admin')) {
      return;
    }

    // Initialize the tracker
    initTracker({ debug }).catch((error) => {
      if (debug) {
        console.error('[VisitorTracker] Failed to initialize:', error);
      }
    });

    // Initialize engagement triggers
    initTriggerEngine();

    // Cleanup on unmount
    return () => {
      destroyTracker();
      destroyTriggerEngine();
    };
  }, [debug]); // Only run once on mount

  // Track page views on route change
  useEffect(() => {
    if (!pathname || pathname.startsWith('/admin')) {
      return;
    }

    const tracker = getTracker();
    tracker.trackPageView();
  }, [pathname]);

  return null;
}

/**
 * Hook for accessing tracker functionality in components
 */
export function useTracker() {
  const trackChatOpen = useCallback(() => {
    const tracker = getTracker();
    tracker.trackChatOpen();
  }, []);

  const trackChatMessage = useCallback((isUser: boolean) => {
    const tracker = getTracker();
    tracker.trackChatMessage(isUser);
  }, []);

  const trackChatClose = useCallback(() => {
    const tracker = getTracker();
    tracker.trackChatClose();
  }, []);

  const trackDownload = useCallback((fileName: string, fileType: string) => {
    const tracker = getTracker();
    tracker.trackDownload(fileName, fileType);
  }, []);

  const trackCTAClick = useCallback(
    (ctaText: string, ctaLocation: string, destination?: string) => {
      const tracker = getTracker();
      tracker.trackCTAClick(ctaText, ctaLocation, destination);
    },
    []
  );

  const trackError = useCallback(
    (error: Error | string, context?: Record<string, unknown>) => {
      const tracker = getTracker();
      tracker.trackError(error, context);
    },
    []
  );

  const getEngagementScore = useCallback(() => {
    const tracker = getTracker();
    return tracker.getEngagementScore();
  }, []);

  const getSessionDuration = useCallback(() => {
    const tracker = getTracker();
    return tracker.getSessionDuration();
  }, []);

  const flush = useCallback(() => {
    const tracker = getTracker();
    tracker.flush();
  }, []);

  return {
    trackChatOpen,
    trackChatMessage,
    trackChatClose,
    trackDownload,
    trackCTAClick,
    trackError,
    getEngagementScore,
    getSessionDuration,
    flush,
  };
}

export default VisitorTracker;
