// ============================================
// REAL-TIME ANALYTICS TRACKER
// Core tracking engine for visitor behavior
// ============================================

import {
  VisitorEvent,
  TrackerConfig,
  DEFAULT_TRACKER_CONFIG,
  SectionView,
  EventType,
  EventCategory,
} from './types';
import { EventBatcher, debounce, rafThrottle } from './event-batcher';
import {
  generateVisitorId,
  getSessionId,
  updateLastActivity,
  getDeviceType,
  getViewportDimensions,
  getVisitorContext,
  shouldDisableTracking,
  incrementSessionCount,
  isReturningVisitor,
  getSessionDuration,
} from './visitor-id';

// ============================================
// TRACKER CLASS
// ============================================

class RealtimeTracker {
  private config: TrackerConfig;
  private batcher: EventBatcher;
  private visitorId: string = '';
  private sessionId: string = '';
  private currentPageViewId: string | null = null;
  private currentPagePath: string = '';
  private pageEnterTime: number = 0;
  private visibleTime: number = 0;
  private visibilityStartTime: number = 0;
  private isPageVisible: boolean = true;
  private maxScrollDepth: number = 0;
  private scrollPositions: number[] = [];
  private lastScrollTime: number = 0;
  private sectionViews: Map<string, SectionView> = new Map();
  private activeSections: Set<string> = new Set();
  private idleTimeout: ReturnType<typeof setTimeout> | null = null;
  private isIdle: boolean = false;
  private clickCount: number = 0;
  private lastClickTime: number = 0;
  private lastClickPosition: { x: number; y: number } | null = null;
  private sessionInitialized: boolean = false;
  private observers: IntersectionObserver[] = [];
  private cleanup: (() => void)[] = [];

  constructor(config: Partial<TrackerConfig> = {}) {
    this.config = { ...DEFAULT_TRACKER_CONFIG, ...config };

    // Initialize batcher
    this.batcher = new EventBatcher(
      async (events) => {
        await this.sendEvents(events);
      },
      {
        maxBatchSize: this.config.batchSize,
        flushInterval: this.config.batchInterval,
        debug: this.config.debug,
      }
    );
  }

  // ============================================
  // INITIALIZATION
  // ============================================

  async init(): Promise<void> {
    if (typeof window === 'undefined') return;
    if (shouldDisableTracking() && this.config.respectDoNotTrack) {
      this.log('Tracking disabled by user preference');
      return;
    }

    // Initialize visitor and session IDs
    this.visitorId = generateVisitorId();
    this.sessionId = getSessionId();

    this.log('Initializing tracker', { visitorId: this.visitorId, sessionId: this.sessionId });

    // Check if this is a new session
    const isNewSession = !sessionStorage.getItem('aci_session_initialized');
    if (isNewSession) {
      sessionStorage.setItem('aci_session_initialized', 'true');
      incrementSessionCount();
      await this.initializeSession();
    }

    this.sessionInitialized = true;

    // Set up event listeners
    this.setupEventListeners();

    // Track initial page view
    this.trackPageView();
  }

  private async initializeSession(): Promise<void> {
    const context = getVisitorContext();

    try {
      const response = await fetch('/api/analytics/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(context),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.journey_id) {
          sessionStorage.setItem('aci_journey_id', data.journey_id);
        }
        this.log('Session initialized', data);
      }
    } catch (error) {
      this.log('Failed to initialize session', error);
    }
  }

  // ============================================
  // EVENT LISTENERS
  // ============================================

  private setupEventListeners(): void {
    // Click tracking
    if (this.config.trackClicks) {
      const clickHandler = this.handleClick.bind(this);
      document.addEventListener('click', clickHandler, { capture: true, passive: true });
      this.cleanup.push(() => document.removeEventListener('click', clickHandler, { capture: true }));
    }

    // Scroll tracking
    if (this.config.trackScroll) {
      const scrollHandler = rafThrottle(this.handleScroll.bind(this));
      window.addEventListener('scroll', scrollHandler, { passive: true });
      this.cleanup.push(() => window.removeEventListener('scroll', scrollHandler));
    }

    // Visibility change
    const visibilityHandler = this.handleVisibilityChange.bind(this);
    document.addEventListener('visibilitychange', visibilityHandler);
    this.cleanup.push(() => document.removeEventListener('visibilitychange', visibilityHandler));

    // Exit intent (mouse leaving viewport)
    if (this.config.trackExitIntent) {
      const exitIntentHandler = this.handleExitIntent.bind(this);
      document.addEventListener('mouseout', exitIntentHandler);
      this.cleanup.push(() => document.removeEventListener('mouseout', exitIntentHandler));
    }

    // Idle detection
    if (this.config.trackIdleTime) {
      const activityHandler = debounce(this.handleActivity.bind(this), 1000);
      ['mousemove', 'keydown', 'scroll', 'touchstart'].forEach((event) => {
        document.addEventListener(event, activityHandler, { passive: true });
        this.cleanup.push(() => document.removeEventListener(event, activityHandler));
      });
      this.resetIdleTimer();
    }

    // Form tracking
    if (this.config.trackForms) {
      const focusHandler = this.handleFormFocus.bind(this);
      const submitHandler = this.handleFormSubmit.bind(this);
      document.addEventListener('focusin', focusHandler, { passive: true });
      document.addEventListener('submit', submitHandler, { capture: true });
      this.cleanup.push(() => {
        document.removeEventListener('focusin', focusHandler);
        document.removeEventListener('submit', submitHandler, { capture: true });
      });
    }

    // Section tracking
    if (this.config.trackSections) {
      this.setupSectionObserver();
    }

    // Window resize
    const resizeHandler = debounce(() => {
      this.trackEvent({
        event_type: 'visibility_change',
        event_category: 'behavior',
        event_data: {
          viewport: getViewportDimensions(),
          action: 'resize',
        },
      });
    }, 500);
    window.addEventListener('resize', resizeHandler, { passive: true });
    this.cleanup.push(() => window.removeEventListener('resize', resizeHandler));
  }

  // ============================================
  // SECTION OBSERVER
  // ============================================

  private setupSectionObserver(): void {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const sectionId = entry.target.getAttribute('data-track-section');
          const sectionName = entry.target.getAttribute('data-section-name') || sectionId || 'unknown';

          if (!sectionId) return;

          if (entry.isIntersecting) {
            this.sectionEntered(sectionId, sectionName, entry.intersectionRatio);
          } else if (this.activeSections.has(sectionId)) {
            this.sectionExited(sectionId);
          }
        });
      },
      {
        threshold: [0, 0.25, 0.5, 0.75, 1.0],
        rootMargin: '0px',
      }
    );

    // Observe all sections
    document.querySelectorAll('[data-track-section]').forEach((section) => {
      observer.observe(section);
    });

    this.observers.push(observer);
    this.cleanup.push(() => observer.disconnect());
  }

  private sectionEntered(sectionId: string, sectionName: string, ratio: number): void {
    if (this.activeSections.has(sectionId)) return;

    this.activeSections.add(sectionId);

    // Initialize or get section view data
    if (!this.sectionViews.has(sectionId)) {
      this.sectionViews.set(sectionId, {
        section_id: sectionId,
        section_name: sectionName,
        time_visible_ms: 0,
        scroll_depth_percent: Math.round(ratio * 100),
        interactions: [],
      });
    }

    // Store enter time
    (this.sectionViews.get(sectionId) as SectionView & { enterTime?: number }).enterTime = Date.now();

    this.trackEvent({
      event_type: 'section_enter',
      event_category: 'section',
      section_id: sectionId,
      event_data: {
        section_name: sectionName,
        intersection_ratio: ratio,
      },
    });

    this.log('Section entered:', sectionId);
  }

  private sectionExited(sectionId: string): void {
    if (!this.activeSections.has(sectionId)) return;

    this.activeSections.delete(sectionId);

    const sectionView = this.sectionViews.get(sectionId) as SectionView & { enterTime?: number };
    if (sectionView && sectionView.enterTime) {
      sectionView.time_visible_ms += Date.now() - sectionView.enterTime;
      delete sectionView.enterTime;

      this.trackEvent({
        event_type: 'section_exit',
        event_category: 'section',
        section_id: sectionId,
        event_data: {
          section_name: sectionView.section_name,
          time_visible_ms: sectionView.time_visible_ms,
        },
      });

      this.log('Section exited:', sectionId, 'Time:', sectionView.time_visible_ms);
    }
  }

  // ============================================
  // EVENT HANDLERS
  // ============================================

  private handleClick(e: MouseEvent): void {
    const target = e.target as HTMLElement;
    const now = Date.now();

    // Update click count
    this.clickCount++;

    // Detect rage clicks (rapid clicking in same area)
    if (
      this.lastClickTime &&
      now - this.lastClickTime < 500 &&
      this.lastClickPosition
    ) {
      const distance = Math.sqrt(
        Math.pow(e.clientX - this.lastClickPosition.x, 2) +
          Math.pow(e.clientY - this.lastClickPosition.y, 2)
      );

      if (distance < 50 && this.clickCount > 3) {
        this.trackEvent({
          event_type: 'rage_click',
          event_category: 'behavior',
          event_target: this.getElementSelector(target),
          page_x: e.pageX,
          page_y: e.pageY,
          viewport_x: e.clientX,
          viewport_y: e.clientY,
          event_data: {
            click_count: this.clickCount,
            element_text: target.textContent?.substring(0, 50),
          },
        });
      }
    } else {
      this.clickCount = 1;
    }

    this.lastClickTime = now;
    this.lastClickPosition = { x: e.clientX, y: e.clientY };

    // Track the click
    const clickable = target.closest('a, button, [role="button"], input[type="submit"]');
    const section = target.closest('[data-track-section]');

    this.trackEvent({
      event_type: 'click',
      event_category: clickable ? 'engagement' : 'behavior',
      event_target: this.getElementSelector(target),
      event_value: clickable?.textContent?.trim().substring(0, 100) || undefined,
      page_x: e.pageX,
      page_y: e.pageY,
      viewport_x: e.clientX,
      viewport_y: e.clientY,
      section_id: section?.getAttribute('data-track-section') || undefined,
      scroll_depth: this.getCurrentScrollDepth(),
      event_data: {
        href: (clickable as HTMLAnchorElement)?.href || undefined,
        element_tag: target.tagName.toLowerCase(),
      },
    });

    updateLastActivity();
  }

  private handleScroll(): void {
    const depth = this.getCurrentScrollDepth();
    const now = Date.now();

    // Update max scroll depth
    if (depth > this.maxScrollDepth) {
      this.maxScrollDepth = depth;

      // Track scroll milestones
      const milestones = [25, 50, 75, 90, 100];
      for (const milestone of milestones) {
        if (depth >= milestone && !this.scrollPositions.includes(milestone)) {
          this.scrollPositions.push(milestone);

          this.trackEvent({
            event_type: 'scroll',
            event_category: 'engagement',
            scroll_depth: milestone,
            event_data: {
              milestone: true,
              time_to_reach_ms: now - this.pageEnterTime,
            },
          });
        }
      }
    }

    this.lastScrollTime = now;
    updateLastActivity();
  }

  private handleVisibilityChange(): void {
    const isVisible = document.visibilityState === 'visible';

    if (isVisible && !this.isPageVisible) {
      // Page became visible
      this.visibilityStartTime = Date.now();
      this.isPageVisible = true;

      this.trackEvent({
        event_type: 'visibility_change',
        event_category: 'behavior',
        event_data: { visible: true },
      });
    } else if (!isVisible && this.isPageVisible) {
      // Page became hidden
      this.visibleTime += Date.now() - this.visibilityStartTime;
      this.isPageVisible = false;

      this.trackEvent({
        event_type: 'visibility_change',
        event_category: 'behavior',
        event_data: { visible: false, visible_time_ms: this.visibleTime },
      });
    }
  }

  private handleExitIntent(e: MouseEvent): void {
    // Only trigger when mouse leaves through the top of the viewport
    if (
      e.clientY <= 0 &&
      e.relatedTarget === null &&
      (e.target as HTMLElement).nodeName !== 'SELECT'
    ) {
      // Dispatch custom event for engagement triggers
      window.dispatchEvent(
        new CustomEvent('aci:exit_intent', {
          detail: {
            page_path: this.currentPagePath,
            time_on_page_ms: Date.now() - this.pageEnterTime,
            scroll_depth: this.maxScrollDepth,
            engagement_score: this.calculatePageEngagementScore(),
          },
        })
      );

      this.trackEvent({
        event_type: 'exit_intent',
        event_category: 'behavior',
        viewport_x: e.clientX,
        viewport_y: e.clientY,
        scroll_depth: this.maxScrollDepth,
        event_data: {
          time_on_page_ms: Date.now() - this.pageEnterTime,
          visible_time_ms: this.visibleTime,
        },
      });
    }
  }

  private handleActivity(): void {
    updateLastActivity();

    if (this.isIdle) {
      this.isIdle = false;

      this.trackEvent({
        event_type: 'idle_end',
        event_category: 'behavior',
        event_data: {
          idle_duration_ms: Date.now() - (parseInt(sessionStorage.getItem('aci_idle_start') || '0', 10) || Date.now()),
        },
      });
    }

    this.resetIdleTimer();
  }

  private resetIdleTimer(): void {
    if (this.idleTimeout) {
      clearTimeout(this.idleTimeout);
    }

    this.idleTimeout = setTimeout(() => {
      this.isIdle = true;
      sessionStorage.setItem('aci_idle_start', Date.now().toString());

      // Dispatch idle event for engagement triggers
      window.dispatchEvent(
        new CustomEvent('aci:idle', {
          detail: {
            page_path: this.currentPagePath,
            idle_start: Date.now(),
            time_on_page_ms: Date.now() - this.pageEnterTime,
            scroll_depth: this.maxScrollDepth,
          },
        })
      );

      this.trackEvent({
        event_type: 'idle_start',
        event_category: 'behavior',
        scroll_depth: this.maxScrollDepth,
        event_data: {
          time_on_page_ms: Date.now() - this.pageEnterTime,
        },
      });
    }, 30000); // 30 seconds of inactivity
  }

  private handleFormFocus(e: FocusEvent): void {
    const target = e.target as HTMLElement;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT') {
      const form = target.closest('form');

      this.trackEvent({
        event_type: 'form_focus',
        event_category: 'form',
        event_target: this.getElementSelector(target),
        event_data: {
          field_name: (target as HTMLInputElement).name || undefined,
          field_type: (target as HTMLInputElement).type || target.tagName.toLowerCase(),
          form_id: form?.id || undefined,
          form_name: form?.getAttribute('name') || undefined,
        },
      });
    }
  }

  private handleFormSubmit(e: Event): void {
    const form = e.target as HTMLFormElement;

    this.trackEvent({
      event_type: 'form_submit',
      event_category: 'conversion',
      event_target: this.getElementSelector(form),
      event_data: {
        form_id: form.id || undefined,
        form_name: form.getAttribute('name') || undefined,
        form_action: form.action || undefined,
      },
    });
  }

  // ============================================
  // PAGE VIEW TRACKING
  // ============================================

  trackPageView(): void {
    // End previous page view if exists
    if (this.currentPageViewId) {
      this.endPageView();
    }

    const now = Date.now();
    this.currentPageViewId = `pv_${now}_${Math.random().toString(36).substring(2, 8)}`;
    this.currentPagePath = window.location.pathname;
    this.pageEnterTime = now;
    this.visibilityStartTime = now;
    this.visibleTime = 0;
    this.isPageVisible = true;
    this.maxScrollDepth = 0;
    this.scrollPositions = [];
    this.clickCount = 0;
    this.sectionViews.clear();
    this.activeSections.clear();

    // Determine page type
    const pageType = this.getPageType(this.currentPagePath);

    this.trackEvent({
      event_type: 'page_view',
      event_category: 'navigation',
      event_data: {
        page_url: window.location.href,
        page_path: this.currentPagePath,
        page_title: document.title,
        page_type: pageType,
        referrer: document.referrer || undefined,
        page_view_id: this.currentPageViewId,
      },
    });

    // Re-setup section observer for new page
    if (this.config.trackSections) {
      // Disconnect old observers
      this.observers.forEach((obs) => obs.disconnect());
      this.observers = [];

      // Setup new observer after DOM settles
      setTimeout(() => {
        this.setupSectionObserver();
      }, 100);
    }

    // Dispatch event for engagement triggers
    window.dispatchEvent(
      new CustomEvent('aci:page_view', {
        detail: {
          page_path: this.currentPagePath,
          page_type: pageType,
          is_returning: isReturningVisitor(),
        },
      })
    );

    this.log('Page view:', this.currentPagePath);
  }

  private endPageView(): void {
    if (!this.currentPageViewId) return;

    // Calculate final visible time
    if (this.isPageVisible) {
      this.visibleTime += Date.now() - this.visibilityStartTime;
    }

    // Finalize active sections
    this.activeSections.forEach((sectionId) => {
      this.sectionExited(sectionId);
    });

    // Track page exit
    this.trackEvent({
      event_type: 'page_exit',
      event_category: 'navigation',
      scroll_depth: this.maxScrollDepth,
      event_data: {
        page_view_id: this.currentPageViewId,
        page_path: this.currentPagePath,
        time_on_page_ms: Date.now() - this.pageEnterTime,
        visible_time_ms: this.visibleTime,
        max_scroll_depth: this.maxScrollDepth,
        click_count: this.clickCount,
        sections: Array.from(this.sectionViews.values()),
        exit_to: window.location.pathname,
      },
    });

    this.currentPageViewId = null;
  }

  // ============================================
  // EVENT TRACKING
  // ============================================

  trackEvent(eventData: Partial<VisitorEvent>): void {
    if (!this.sessionInitialized) return;

    const event: VisitorEvent = {
      session_id: this.sessionId,
      visitor_id: this.visitorId,
      page_view_id: this.currentPageViewId || undefined,
      event_type: eventData.event_type as EventType,
      event_category: eventData.event_category as EventCategory,
      event_target: eventData.event_target,
      event_value: eventData.event_value,
      event_data: eventData.event_data,
      page_x: eventData.page_x,
      page_y: eventData.page_y,
      viewport_x: eventData.viewport_x,
      viewport_y: eventData.viewport_y,
      element_x: eventData.element_x,
      element_y: eventData.element_y,
      page_path: eventData.page_path || this.currentPagePath,
      section_id: eventData.section_id,
      scroll_depth: eventData.scroll_depth ?? this.maxScrollDepth,
      timestamp: new Date().toISOString(),
    };

    this.batcher.enqueue(event);
  }

  // ============================================
  // CUSTOM EVENT TRACKING
  // ============================================

  trackChatOpen(): void {
    this.trackEvent({
      event_type: 'chat_open',
      event_category: 'chat',
      event_data: {
        time_on_page_ms: Date.now() - this.pageEnterTime,
        scroll_depth: this.maxScrollDepth,
      },
    });
  }

  trackChatMessage(isUser: boolean): void {
    this.trackEvent({
      event_type: 'chat_message',
      event_category: 'chat',
      event_data: {
        is_user_message: isUser,
      },
    });
  }

  trackChatClose(): void {
    this.trackEvent({
      event_type: 'chat_close',
      event_category: 'chat',
    });
  }

  trackDownload(fileName: string, fileType: string): void {
    this.trackEvent({
      event_type: 'download',
      event_category: 'conversion',
      event_value: fileName,
      event_data: {
        file_name: fileName,
        file_type: fileType,
      },
    });
  }

  trackCTAClick(ctaText: string, ctaLocation: string, destination?: string): void {
    this.trackEvent({
      event_type: 'cta_interaction',
      event_category: 'engagement',
      event_value: ctaText,
      event_data: {
        cta_text: ctaText,
        cta_location: ctaLocation,
        destination,
      },
    });
  }

  trackError(error: Error | string, context?: Record<string, unknown>): void {
    this.trackEvent({
      event_type: 'error',
      event_category: 'error',
      event_data: {
        error_message: typeof error === 'string' ? error : error.message,
        error_stack: typeof error === 'string' ? undefined : error.stack,
        ...context,
      },
    });
  }

  // ============================================
  // HELPERS
  // ============================================

  private getCurrentScrollDepth(): number {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    return docHeight > 0 ? Math.round((scrollTop / docHeight) * 100) : 0;
  }

  private getElementSelector(element: HTMLElement): string {
    const parts: string[] = [];
    let current: HTMLElement | null = element;

    while (current && current !== document.body) {
      let selector = current.tagName.toLowerCase();

      if (current.id) {
        selector += `#${current.id}`;
        parts.unshift(selector);
        break;
      }

      if (current.className && typeof current.className === 'string') {
        const classes = current.className.trim().split(/\s+/).slice(0, 2);
        if (classes.length) {
          selector += `.${classes.join('.')}`;
        }
      }

      parts.unshift(selector);
      current = current.parentElement;

      if (parts.length > 4) break;
    }

    return parts.join(' > ');
  }

  private getPageType(path: string): string {
    if (path === '/') return 'home';
    if (path.startsWith('/services/')) return 'service';
    if (path.startsWith('/case-studies/')) return 'case-study';
    if (path.startsWith('/blogs/')) return 'blog';
    if (path.startsWith('/whitepapers/')) return 'whitepaper';
    if (path.startsWith('/playbooks/')) return 'playbook';
    if (path.startsWith('/webinars/')) return 'webinar';
    if (path === '/contact') return 'contact';
    if (path === '/about') return 'about';
    if (path.startsWith('/industries/')) return 'industry';
    if (path.startsWith('/platforms/')) return 'platform';
    if (path.startsWith('/lp/')) return 'landing-page';
    if (path.startsWith('/admin/')) return 'admin';
    return 'other';
  }

  private calculatePageEngagementScore(): number {
    let score = 0;

    // Time on page (max 30 points)
    const timeOnPage = (Date.now() - this.pageEnterTime) / 1000;
    score += Math.min(30, Math.floor(timeOnPage / 10) * 5);

    // Scroll depth (max 25 points)
    score += Math.floor(this.maxScrollDepth / 4);

    // Sections viewed (max 20 points)
    score += Math.min(20, this.sectionViews.size * 5);

    // Clicks (max 15 points)
    score += Math.min(15, this.clickCount * 3);

    // Visible time ratio (max 10 points)
    const totalTime = Date.now() - this.pageEnterTime;
    const visibleRatio = totalTime > 0 ? this.visibleTime / totalTime : 0;
    score += Math.floor(visibleRatio * 10);

    return Math.min(100, score);
  }

  private async sendEvents(events: VisitorEvent[]): Promise<void> {
    const response = await fetch(this.config.apiEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ events }),
    });

    if (!response.ok) {
      throw new Error(`Failed to send events: ${response.status}`);
    }
  }

  private log(...args: unknown[]): void {
    if (this.config.debug) {
      console.log('[RealtimeTracker]', ...args);
    }
  }

  // ============================================
  // PUBLIC API
  // ============================================

  getVisitorId(): string {
    return this.visitorId;
  }

  getSessionId(): string {
    return this.sessionId;
  }

  getSessionDuration(): number {
    return getSessionDuration();
  }

  getEngagementScore(): number {
    return this.calculatePageEngagementScore();
  }

  getMaxScrollDepth(): number {
    return this.maxScrollDepth;
  }

  getSectionViews(): SectionView[] {
    return Array.from(this.sectionViews.values());
  }

  flush(): void {
    this.batcher.flush();
  }

  destroy(): void {
    this.endPageView();
    this.cleanup.forEach((fn) => fn());
    this.cleanup = [];
    this.observers.forEach((obs) => obs.disconnect());
    this.observers = [];
    this.batcher.destroy();
    if (this.idleTimeout) clearTimeout(this.idleTimeout);
  }
}

// ============================================
// SINGLETON INSTANCE
// ============================================

let trackerInstance: RealtimeTracker | null = null;

export function getTracker(config?: Partial<TrackerConfig>): RealtimeTracker {
  if (!trackerInstance) {
    trackerInstance = new RealtimeTracker(config);
  }
  return trackerInstance;
}

export function initTracker(config?: Partial<TrackerConfig>): Promise<void> {
  const tracker = getTracker(config);
  return tracker.init();
}

export function destroyTracker(): void {
  if (trackerInstance) {
    trackerInstance.destroy();
    trackerInstance = null;
  }
}

export { RealtimeTracker };
