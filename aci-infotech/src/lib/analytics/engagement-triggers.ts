// ============================================
// ENGAGEMENT TRIGGERS ENGINE
// Proactive bot engagement based on visitor behavior
// ============================================

import { EngagementTrigger, TriggerType, TriggerConditions } from './types';
import { getTracker } from './tracker';
import {
  getSessionId,
  isReturningVisitor,
  getSessionCount,
  getSessionDuration,
} from './visitor-id';

// ============================================
// TRIGGER EVENT
// ============================================

export interface TriggerEvent {
  trigger: EngagementTrigger;
  message: string;
  context: TriggerContext;
}

export interface TriggerContext {
  page_path: string;
  page_type: string;
  time_on_page_ms: number;
  scroll_depth: number;
  engagement_score: number;
  session_duration_seconds: number;
  is_returning: boolean;
  session_count: number;
  sections_viewed: string[];
  idle_seconds?: number;
}

// ============================================
// TRIGGER ENGINE
// ============================================

class EngagementTriggerEngine {
  private triggers: EngagementTrigger[] = [];
  private triggersLoaded: boolean = false;
  private firedTriggers: Set<string> = new Set();
  private triggerCooldowns: Map<string, number> = new Map();
  private pageEnterTime: number = Date.now();
  private currentPagePath: string = '';
  private currentPageType: string = '';
  private sectionsViewed: Set<string> = new Set();
  private sectionTimers: Map<string, number> = new Map();
  private idleStartTime: number | null = null;
  private checkInterval: ReturnType<typeof setInterval> | null = null;
  private enabled: boolean = true;
  private debug: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      this.setupEventListeners();
      this.loadTriggers();
    }
  }

  // ============================================
  // INITIALIZATION
  // ============================================

  private async loadTriggers(): Promise<void> {
    try {
      const response = await fetch('/api/analytics/triggers');
      if (response.ok) {
        const data = await response.json();
        this.triggers = data.triggers || [];
        this.triggersLoaded = true;
        this.log('Loaded triggers:', this.triggers.length);
      }
    } catch (error) {
      this.log('Failed to load triggers:', error);
      // Use default triggers
      this.triggers = this.getDefaultTriggers();
      this.triggersLoaded = true;
    }

    // Start periodic checks
    this.startPeriodicChecks();
  }

  private getDefaultTriggers(): EngagementTrigger[] {
    return [
      {
        id: 'default-exit-intent',
        name: 'Exit Intent',
        trigger_type: 'exit_intent',
        conditions: { delay_seconds: 3 },
        target_pages: ['*'],
        exclude_pages: ['/admin/*', '/lp/thank-you'],
        action_type: 'chat_proactive',
        action_config: {},
        message_template: 'Quick question before you go - is there anything I can help clarify?',
        message_variants: [],
        cooldown_minutes: 10,
        max_shows_per_session: 1,
        max_shows_per_visitor: 3,
        delay_seconds: 0,
        priority: 10,
        device_types: ['desktop', 'tablet', 'mobile'],
        visitor_types: ['new', 'returning'],
        is_active: true,
        impressions: 0,
        engagements: 0,
        conversions: 0,
      },
      {
        id: 'default-high-engagement',
        name: 'High Engagement',
        trigger_type: 'engagement_score',
        conditions: { min_score: 50 },
        target_pages: ['*'],
        exclude_pages: ['/admin/*', '/contact'],
        action_type: 'chat_proactive',
        action_config: {},
        message_template: "I notice you're exploring quite a bit. Would you like to discuss your specific needs?",
        message_variants: [],
        cooldown_minutes: 15,
        max_shows_per_session: 1,
        max_shows_per_visitor: 2,
        delay_seconds: 0,
        priority: 20,
        device_types: ['desktop', 'tablet', 'mobile'],
        visitor_types: ['new', 'returning'],
        is_active: true,
        impressions: 0,
        engagements: 0,
        conversions: 0,
      },
      {
        id: 'default-idle',
        name: 'Idle Engagement',
        trigger_type: 'idle',
        conditions: { idle_seconds: 45 },
        target_pages: ['/services/*', '/case-studies/*'],
        exclude_pages: [],
        action_type: 'chat_proactive',
        action_config: {},
        message_template: 'Taking it all in? I can help answer any questions you might have.',
        message_variants: [],
        cooldown_minutes: 5,
        max_shows_per_session: 2,
        max_shows_per_visitor: 5,
        delay_seconds: 0,
        priority: 30,
        device_types: ['desktop', 'tablet'],
        visitor_types: ['new', 'returning'],
        is_active: true,
        impressions: 0,
        engagements: 0,
        conversions: 0,
      },
      {
        id: 'default-return-visitor',
        name: 'Return Visitor',
        trigger_type: 'return_visitor',
        conditions: { min_sessions: 2 },
        target_pages: ['*'],
        exclude_pages: ['/admin/*'],
        action_type: 'chat_proactive',
        action_config: {},
        message_template: 'Welcome back! Ready to take the next step? I can help answer any remaining questions.',
        message_variants: [],
        cooldown_minutes: 60,
        max_shows_per_session: 1,
        max_shows_per_visitor: 2,
        delay_seconds: 5,
        priority: 25,
        device_types: ['desktop', 'tablet', 'mobile'],
        visitor_types: ['returning'],
        is_active: true,
        impressions: 0,
        engagements: 0,
        conversions: 0,
      },
    ];
  }

  private setupEventListeners(): void {
    // Listen for page views
    window.addEventListener('aci:page_view', ((e: CustomEvent) => {
      this.handlePageView(e.detail);
    }) as EventListener);

    // Listen for exit intent
    window.addEventListener('aci:exit_intent', ((e: CustomEvent) => {
      this.handleExitIntent(e.detail);
    }) as EventListener);

    // Listen for idle
    window.addEventListener('aci:idle', ((e: CustomEvent) => {
      this.handleIdle(e.detail);
    }) as EventListener);

    // Listen for section events
    window.addEventListener('aci:section_enter', ((e: CustomEvent) => {
      this.handleSectionEnter(e.detail);
    }) as EventListener);

    window.addEventListener('aci:section_exit', ((e: CustomEvent) => {
      this.handleSectionExit(e.detail);
    }) as EventListener);
  }

  private startPeriodicChecks(): void {
    // Check time-based triggers every 5 seconds
    this.checkInterval = setInterval(() => {
      this.checkTimeTriggers();
      this.checkEngagementTriggers();
    }, 5000);
  }

  // ============================================
  // EVENT HANDLERS
  // ============================================

  private handlePageView(detail: { page_path: string; page_type: string; is_returning: boolean }): void {
    this.pageEnterTime = Date.now();
    this.currentPagePath = detail.page_path;
    this.currentPageType = detail.page_type;
    this.sectionsViewed.clear();
    this.sectionTimers.clear();
    this.idleStartTime = null;

    // Check return visitor trigger
    if (detail.is_returning) {
      this.checkTrigger('return_visitor');
    }

    this.log('Page view:', detail.page_path);
  }

  private handleExitIntent(detail: {
    page_path: string;
    time_on_page_ms: number;
    scroll_depth: number;
    engagement_score: number;
  }): void {
    this.log('Exit intent detected');
    this.checkTrigger('exit_intent', detail);
  }

  private handleIdle(detail: {
    page_path: string;
    idle_start: number;
    time_on_page_ms: number;
    scroll_depth: number;
  }): void {
    this.idleStartTime = detail.idle_start;
    this.log('Idle started');
  }

  private handleSectionEnter(detail: { section_id: string; section_name: string }): void {
    this.sectionsViewed.add(detail.section_id);
    this.sectionTimers.set(detail.section_id, Date.now());
    this.log('Section entered:', detail.section_id);
  }

  private handleSectionExit(detail: { section_id: string; time_visible_ms: number }): void {
    this.sectionTimers.delete(detail.section_id);
  }

  // ============================================
  // TRIGGER CHECKS
  // ============================================

  private checkTimeTriggers(): void {
    if (!this.enabled || !this.triggersLoaded) return;

    const timeOnPage = Date.now() - this.pageEnterTime;

    // Check time_on_page triggers
    const timeOnPageTriggers = this.triggers.filter(
      (t) => t.trigger_type === 'time_on_page' && t.is_active
    );

    for (const trigger of timeOnPageTriggers) {
      const minSeconds = trigger.conditions.min_seconds || 60;
      if (timeOnPage >= minSeconds * 1000) {
        this.evaluateTrigger(trigger);
      }
    }

    // Check scroll_depth triggers
    const tracker = getTracker();
    const scrollDepth = tracker.getMaxScrollDepth();

    const scrollTriggers = this.triggers.filter(
      (t) => t.trigger_type === 'scroll_depth' && t.is_active
    );

    for (const trigger of scrollTriggers) {
      const depthPercent = trigger.conditions.depth_percent || 75;
      const timeAtDepth = trigger.conditions.time_at_depth_seconds || 5;

      if (scrollDepth >= depthPercent) {
        // Check if they've been at this depth for the required time
        // For simplicity, just check if scroll depth condition is met
        this.evaluateTrigger(trigger);
      }
    }

    // Check section_time triggers
    const sectionTriggers = this.triggers.filter(
      (t) => t.trigger_type === 'section_time' && t.is_active
    );

    for (const trigger of sectionTriggers) {
      const targetSection = trigger.conditions.section_id;
      const minSeconds = trigger.conditions.min_seconds || 20;

      if (targetSection && this.sectionTimers.has(targetSection)) {
        const sectionTime = Date.now() - (this.sectionTimers.get(targetSection) || 0);
        if (sectionTime >= minSeconds * 1000) {
          this.evaluateTrigger(trigger);
        }
      }
    }

    // Check idle triggers
    if (this.idleStartTime) {
      const idleTime = (Date.now() - this.idleStartTime) / 1000;

      const idleTriggers = this.triggers.filter(
        (t) => t.trigger_type === 'idle' && t.is_active
      );

      for (const trigger of idleTriggers) {
        const idleSeconds = trigger.conditions.idle_seconds || 30;
        if (idleTime >= idleSeconds) {
          this.evaluateTrigger(trigger);
        }
      }
    }
  }

  private checkEngagementTriggers(): void {
    if (!this.enabled || !this.triggersLoaded) return;

    const tracker = getTracker();
    const engagementScore = tracker.getEngagementScore();

    const engagementTriggers = this.triggers.filter(
      (t) => t.trigger_type === 'engagement_score' && t.is_active
    );

    for (const trigger of engagementTriggers) {
      const minScore = trigger.conditions.min_score || 50;
      const maxScore = trigger.conditions.max_score;

      if (engagementScore >= minScore && (!maxScore || engagementScore <= maxScore)) {
        this.evaluateTrigger(trigger);
      }
    }
  }

  private checkTrigger(type: TriggerType, context?: Record<string, unknown>): void {
    if (!this.enabled || !this.triggersLoaded) return;

    const triggers = this.triggers.filter((t) => t.trigger_type === type && t.is_active);

    for (const trigger of triggers) {
      this.evaluateTrigger(trigger, context);
    }
  }

  // ============================================
  // TRIGGER EVALUATION
  // ============================================

  private evaluateTrigger(trigger: EngagementTrigger, _context?: Record<string, unknown>): boolean {
    // Check if already fired
    if (this.firedTriggers.has(trigger.id)) {
      return false;
    }

    // Check cooldown
    const lastFired = this.triggerCooldowns.get(trigger.id);
    if (lastFired) {
      const cooldownMs = trigger.cooldown_minutes * 60 * 1000;
      if (Date.now() - lastFired < cooldownMs) {
        this.log('Trigger on cooldown:', trigger.name);
        return false;
      }
    }

    // Check max shows per session
    const sessionShows = parseInt(
      sessionStorage.getItem(`aci_trigger_${trigger.id}_shows`) || '0',
      10
    );
    if (sessionShows >= trigger.max_shows_per_session) {
      this.log('Max shows per session reached:', trigger.name);
      return false;
    }

    // Check max shows per visitor
    const visitorShows = parseInt(
      localStorage.getItem(`aci_trigger_${trigger.id}_shows`) || '0',
      10
    );
    if (visitorShows >= trigger.max_shows_per_visitor) {
      this.log('Max shows per visitor reached:', trigger.name);
      return false;
    }

    // Check target pages
    if (!this.matchesPage(trigger.target_pages, this.currentPagePath)) {
      return false;
    }

    // Check exclude pages
    if (this.matchesPage(trigger.exclude_pages, this.currentPagePath)) {
      return false;
    }

    // Check device type
    const deviceType = this.getDeviceType();
    if (!trigger.device_types.includes(deviceType)) {
      return false;
    }

    // Check visitor type
    const visitorType = isReturningVisitor() ? 'returning' : 'new';
    if (!trigger.visitor_types.includes(visitorType)) {
      return false;
    }

    // All checks passed - fire the trigger!
    this.fireTrigger(trigger);
    return true;
  }

  private matchesPage(patterns: string[], path: string): boolean {
    for (const pattern of patterns) {
      if (pattern === '*') return true;

      // Convert glob pattern to regex
      const regexPattern = pattern
        .replace(/\*/g, '.*')
        .replace(/\?/g, '.');

      const regex = new RegExp(`^${regexPattern}$`);
      if (regex.test(path)) return true;
    }
    return false;
  }

  private getDeviceType(): 'desktop' | 'mobile' | 'tablet' {
    if (typeof window === 'undefined') return 'desktop';

    const width = window.innerWidth;
    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
  }

  // ============================================
  // TRIGGER FIRING
  // ============================================

  private fireTrigger(trigger: EngagementTrigger): void {
    const tracker = getTracker();

    // Mark as fired
    this.firedTriggers.add(trigger.id);

    // Update cooldown
    this.triggerCooldowns.set(trigger.id, Date.now());

    // Update show counts
    const sessionShows = parseInt(
      sessionStorage.getItem(`aci_trigger_${trigger.id}_shows`) || '0',
      10
    );
    sessionStorage.setItem(`aci_trigger_${trigger.id}_shows`, (sessionShows + 1).toString());

    const visitorShows = parseInt(
      localStorage.getItem(`aci_trigger_${trigger.id}_shows`) || '0',
      10
    );
    localStorage.setItem(`aci_trigger_${trigger.id}_shows`, (visitorShows + 1).toString());

    // Personalize message
    const message = this.personalizeMessage(trigger.message_template);

    // Build context
    const context: TriggerContext = {
      page_path: this.currentPagePath,
      page_type: this.currentPageType,
      time_on_page_ms: Date.now() - this.pageEnterTime,
      scroll_depth: tracker.getMaxScrollDepth(),
      engagement_score: tracker.getEngagementScore(),
      session_duration_seconds: getSessionDuration(),
      is_returning: isReturningVisitor(),
      session_count: getSessionCount(),
      sections_viewed: Array.from(this.sectionsViewed),
      idle_seconds: this.idleStartTime ? (Date.now() - this.idleStartTime) / 1000 : undefined,
    };

    const triggerEvent: TriggerEvent = {
      trigger,
      message,
      context,
    };

    this.log('Firing trigger:', trigger.name, message);

    // Apply delay if specified
    if (trigger.delay_seconds > 0) {
      setTimeout(() => {
        this.dispatchTrigger(triggerEvent);
      }, trigger.delay_seconds * 1000);
    } else {
      this.dispatchTrigger(triggerEvent);
    }

    // Record trigger history
    this.recordTriggerHistory(trigger, context);
  }

  private dispatchTrigger(event: TriggerEvent): void {
    // Dispatch custom event for ChatWidget to listen to
    window.dispatchEvent(
      new CustomEvent('aci:engagement_trigger', {
        detail: event,
      })
    );
  }

  private personalizeMessage(template: string): string {
    let message = template;

    // Replace placeholders
    const replacements: Record<string, string> = {
      '{page_type}': this.currentPageType,
      '{page_path}': this.currentPagePath,
      '{time_on_page}': Math.floor((Date.now() - this.pageEnterTime) / 1000).toString(),
      '{sections_viewed}': Array.from(this.sectionsViewed).join(', '),
    };

    for (const [placeholder, value] of Object.entries(replacements)) {
      message = message.replace(new RegExp(placeholder, 'g'), value);
    }

    return message;
  }

  private async recordTriggerHistory(
    trigger: EngagementTrigger,
    context: TriggerContext
  ): Promise<void> {
    try {
      await fetch('/api/analytics/triggers/history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: getSessionId(),
          trigger_id: trigger.id,
          page_path: context.page_path,
          trigger_context: context,
        }),
      });
    } catch (error) {
      this.log('Failed to record trigger history:', error);
    }
  }

  // ============================================
  // PUBLIC API
  // ============================================

  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  setDebug(debug: boolean): void {
    this.debug = debug;
  }

  getTriggers(): EngagementTrigger[] {
    return this.triggers;
  }

  recordEngagement(triggerId: string): void {
    // Record that user engaged with the trigger (e.g., started chat)
    this.log('Trigger engagement recorded:', triggerId);

    fetch('/api/analytics/triggers/engagement', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        session_id: getSessionId(),
        trigger_id: triggerId,
        response: 'engaged',
      }),
    }).catch(() => {});
  }

  recordDismissal(triggerId: string): void {
    // Record that user dismissed the trigger
    this.log('Trigger dismissed:', triggerId);

    fetch('/api/analytics/triggers/engagement', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        session_id: getSessionId(),
        trigger_id: triggerId,
        response: 'dismissed',
      }),
    }).catch(() => {});
  }

  recordConversion(triggerId: string, conversionType: string): void {
    // Record that trigger led to a conversion
    this.log('Trigger conversion:', triggerId, conversionType);

    fetch('/api/analytics/triggers/conversion', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        session_id: getSessionId(),
        trigger_id: triggerId,
        conversion_type: conversionType,
      }),
    }).catch(() => {});
  }

  destroy(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
    }
  }

  private log(...args: unknown[]): void {
    if (this.debug) {
      console.log('[EngagementTriggers]', ...args);
    }
  }
}

// ============================================
// SINGLETON INSTANCE
// ============================================

let triggerEngineInstance: EngagementTriggerEngine | null = null;

export function getTriggerEngine(): EngagementTriggerEngine {
  if (!triggerEngineInstance) {
    triggerEngineInstance = new EngagementTriggerEngine();
  }
  return triggerEngineInstance;
}

export function initTriggerEngine(): void {
  getTriggerEngine();
}

export function destroyTriggerEngine(): void {
  if (triggerEngineInstance) {
    triggerEngineInstance.destroy();
    triggerEngineInstance = null;
  }
}

export { EngagementTriggerEngine };
