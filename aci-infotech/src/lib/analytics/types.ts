// ============================================
// REAL-TIME ANALYTICS TYPE DEFINITIONS
// ============================================

// ============================================
// VISITOR & SESSION TYPES
// ============================================

export interface VisitorJourney {
  id: string;
  visitor_id: string;
  first_seen_at: string;
  last_seen_at: string;
  total_sessions: number;
  total_page_views: number;
  total_time_seconds: number;
  total_events: number;
  first_touch_source?: string;
  first_touch_medium?: string;
  first_touch_campaign?: string;
  first_touch_referrer?: string;
  last_touch_source?: string;
  last_touch_medium?: string;
  last_touch_campaign?: string;
  company_name?: string;
  company_domain?: string;
  company_industry?: string;
  company_size?: string;
  company_linkedin?: string;
  country?: string;
  region?: string;
  city?: string;
  lead_id?: string;
  contact_id?: string;
  converted_at?: string;
  engagement_score: number;
  predicted_lead_score: number;
  predicted_conversion_probability: number;
  intent_signals: IntentSignal[];
  is_bot: boolean;
  is_internal: boolean;
}

export interface VisitorSession {
  id: string;
  session_id: string;
  visitor_id: string;
  journey_id?: string;
  started_at: string;
  ended_at?: string;
  last_activity_at: string;
  is_active: boolean;
  entry_url?: string;
  entry_page_path?: string;
  exit_url?: string;
  exit_page_path?: string;
  referrer?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  user_agent?: string;
  device_type: 'desktop' | 'mobile' | 'tablet';
  browser?: string;
  browser_version?: string;
  os?: string;
  os_version?: string;
  screen_width?: number;
  screen_height?: number;
  viewport_width?: number;
  viewport_height?: number;
  timezone?: string;
  language?: string;
  ip_address?: string;
  country?: string;
  region?: string;
  city?: string;
  company_name?: string;
  company_domain?: string;
  company_industry?: string;
  company_size?: string;
  page_count: number;
  event_count: number;
  total_time_seconds: number;
  engagement_score: number;
  max_scroll_depth: number;
  lead_id?: string;
  contact_id?: string;
  identified_at?: string;
  converted: boolean;
  conversion_type?: string;
  is_bounce: boolean;
  is_bot: boolean;
}

export interface PageView {
  id: string;
  session_id: string;
  visitor_id: string;
  page_url: string;
  page_path: string;
  page_title?: string;
  page_type?: string;
  entered_at: string;
  exited_at?: string;
  time_on_page_ms: number;
  visible_time_ms: number;
  section_views: SectionView[];
  max_scroll_depth: number;
  scroll_velocity_avg?: number;
  click_count: number;
  interaction_count: number;
  exit_type?: 'navigation' | 'bounce' | 'conversion' | 'idle' | 'external';
  exit_to_url?: string;
}

export interface SectionView {
  section_id: string;
  section_name: string;
  time_visible_ms: number;
  scroll_depth_percent: number;
  interactions: SectionInteraction[];
}

export interface SectionInteraction {
  type: 'click' | 'hover' | 'focus';
  target: string;
  timestamp: string;
}

// ============================================
// EVENT TYPES
// ============================================

export type EventType =
  | 'page_view'
  | 'page_exit'
  | 'click'
  | 'scroll'
  | 'hover'
  | 'form_focus'
  | 'form_input'
  | 'form_submit'
  | 'video_play'
  | 'video_pause'
  | 'video_complete'
  | 'cta_interaction'
  | 'chat_open'
  | 'chat_message'
  | 'chat_close'
  | 'download'
  | 'section_enter'
  | 'section_exit'
  | 'idle_start'
  | 'idle_end'
  | 'exit_intent'
  | 'visibility_change'
  | 'rage_click'
  | 'error';

export type EventCategory =
  | 'navigation'
  | 'engagement'
  | 'conversion'
  | 'form'
  | 'media'
  | 'chat'
  | 'section'
  | 'behavior'
  | 'error';

export interface VisitorEvent {
  id?: string;
  session_id: string;
  visitor_id: string;
  page_view_id?: string;
  event_type: EventType;
  event_category: EventCategory;
  event_target?: string;
  event_value?: string;
  event_data?: Record<string, unknown>;
  page_x?: number;
  page_y?: number;
  viewport_x?: number;
  viewport_y?: number;
  element_x?: number;
  element_y?: number;
  page_path?: string;
  section_id?: string;
  scroll_depth?: number;
  timestamp: string;
}

// ============================================
// ENGAGEMENT TRIGGER TYPES
// ============================================

export type TriggerType =
  | 'idle'
  | 'exit_intent'
  | 'scroll_depth'
  | 'section_time'
  | 'engagement_score'
  | 'return_visitor'
  | 'page_sequence'
  | 'time_on_page';

export type TriggerActionType =
  | 'chat_proactive'
  | 'popup'
  | 'highlight_cta'
  | 'slide_in';

export interface TriggerConditions {
  idle_seconds?: number;
  min_page_views?: number;
  delay_seconds?: number;
  depth_percent?: number;
  time_at_depth_seconds?: number;
  section_id?: string;
  min_seconds?: number;
  min_score?: number;
  max_score?: number;
  min_sessions?: number;
  pages?: string[];
}

export interface EngagementTrigger {
  id: string;
  name: string;
  description?: string;
  trigger_type: TriggerType;
  conditions: TriggerConditions;
  target_pages: string[];
  exclude_pages: string[];
  action_type: TriggerActionType;
  action_config: Record<string, unknown>;
  message_template: string;
  message_variants: string[];
  cooldown_minutes: number;
  max_shows_per_session: number;
  max_shows_per_visitor: number;
  delay_seconds: number;
  priority: number;
  device_types: ('desktop' | 'mobile' | 'tablet')[];
  visitor_types: ('new' | 'returning')[];
  is_active: boolean;
  impressions: number;
  engagements: number;
  conversions: number;
}

export interface TriggerHistory {
  id: string;
  session_id: string;
  visitor_id: string;
  trigger_id: string;
  page_path?: string;
  trigger_context: Record<string, unknown>;
  shown_at: string;
  response?: 'engaged' | 'dismissed' | 'ignored';
  responded_at?: string;
  converted: boolean;
  conversion_type?: string;
  converted_at?: string;
}

// ============================================
// HEATMAP TYPES
// ============================================

export interface ClickPoint {
  x_percent: number;
  y_percent: number;
  count: number;
  element?: {
    selector: string;
    text?: string;
  };
}

export interface ScrollDepthData {
  depth_percent: number;
  visitor_count: number;
  avg_time_at_depth_ms: number;
}

export interface SectionAttention {
  section_id: string;
  section_name: string;
  avg_time_ms: number;
  view_count: number;
  engagement_rate: number;
}

export interface HeatmapData {
  id: string;
  page_path: string;
  date: string;
  device_type: 'desktop' | 'mobile' | 'tablet';
  click_points: ClickPoint[];
  scroll_depths: ScrollDepthData[];
  section_attention: SectionAttention[];
  movement_flow: { from: { x: number; y: number }; to: { x: number; y: number }; count: number }[];
  total_views: number;
  total_clicks: number;
  avg_scroll_depth: number;
  avg_time_on_page_ms: number;
  bounce_rate: number;
}

// ============================================
// SESSION RECORDING TYPES
// ============================================

export interface SessionRecording {
  id: string;
  session_id: string;
  visitor_id: string;
  page_path: string;
  started_at: string;
  ended_at?: string;
  duration_ms: number;
  events_url?: string;
  events_count: number;
  initial_dom_snapshot?: string;
  viewport_width?: number;
  viewport_height?: number;
  has_conversion: boolean;
  has_rage_clicks: boolean;
  has_errors: boolean;
  max_scroll_depth: number;
  click_count: number;
  engagement_score: number;
}

// ============================================
// INTENT SIGNAL TYPES
// ============================================

export interface IntentSignal {
  signal_type: 'pricing_view' | 'case_study_read' | 'whitepaper_download' | 'return_visit' | 'high_engagement' | 'contact_page' | 'demo_interest' | 'competitor_comparison';
  strength: 'low' | 'medium' | 'high';
  detected_at: string;
  context?: Record<string, unknown>;
}

// ============================================
// REAL-TIME DASHBOARD TYPES
// ============================================

export interface RealtimeMetrics {
  active_visitors: number;
  active_sessions: number;
  page_views_last_hour: number;
  unique_visitors_last_hour: number;
  avg_engagement_score: number;
  conversions_today: number;
  top_pages: { path: string; title: string; views: number; avg_time_ms: number }[];
  traffic_sources: { source: string; medium: string; sessions: number }[];
  countries: { country: string; sessions: number }[];
  device_breakdown: { device: string; sessions: number }[];
}

export interface ActiveVisitor {
  session_id: string;
  visitor_id: string;
  current_page: string;
  page_title?: string;
  time_on_site_seconds: number;
  page_count: number;
  engagement_score: number;
  device_type: 'desktop' | 'mobile' | 'tablet';
  country?: string;
  company_name?: string;
  is_returning: boolean;
  last_activity: string;
}

// ============================================
// TRACKER CONFIG
// ============================================

export interface TrackerConfig {
  // API endpoint for sending events
  apiEndpoint: string;

  // Batching settings
  batchSize: number;
  batchInterval: number; // ms

  // Session settings
  sessionTimeout: number; // minutes

  // Tracking settings
  trackClicks: boolean;
  trackScroll: boolean;
  trackMouseMovement: boolean;
  trackSections: boolean;
  trackForms: boolean;
  trackExitIntent: boolean;
  trackIdleTime: boolean;

  // Performance settings
  scrollDebounceMs: number;
  mouseDebounceMs: number;

  // Privacy settings
  anonymizeIp: boolean;
  respectDoNotTrack: boolean;
  requireConsent: boolean;

  // Debug
  debug: boolean;
}

export const DEFAULT_TRACKER_CONFIG: TrackerConfig = {
  apiEndpoint: '/api/analytics/events',
  batchSize: 20,
  batchInterval: 3000,
  sessionTimeout: 30,
  trackClicks: true,
  trackScroll: true,
  trackMouseMovement: false,
  trackSections: true,
  trackForms: true,
  trackExitIntent: true,
  trackIdleTime: true,
  scrollDebounceMs: 100,
  mouseDebounceMs: 50,
  anonymizeIp: false,
  respectDoNotTrack: true,
  requireConsent: false,
  debug: false,
};
