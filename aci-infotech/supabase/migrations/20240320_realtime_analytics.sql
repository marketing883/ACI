-- ============================================
-- REAL-TIME ANALYTICS & ENGAGEMENT SYSTEM
-- Migration: 20240320_realtime_analytics.sql
-- ============================================

-- ============================================
-- 1. VISITOR JOURNEYS (Cross-session tracking)
-- ============================================
CREATE TABLE IF NOT EXISTS visitor_journeys (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  visitor_id TEXT UNIQUE NOT NULL,

  -- Timestamps
  first_seen_at TIMESTAMPTZ DEFAULT NOW(),
  last_seen_at TIMESTAMPTZ DEFAULT NOW(),

  -- Aggregate metrics
  total_sessions INTEGER DEFAULT 1,
  total_page_views INTEGER DEFAULT 0,
  total_time_seconds INTEGER DEFAULT 0,
  total_events INTEGER DEFAULT 0,

  -- First touch attribution
  first_touch_source TEXT,
  first_touch_medium TEXT,
  first_touch_campaign TEXT,
  first_touch_referrer TEXT,

  -- Last touch attribution (updated on each session)
  last_touch_source TEXT,
  last_touch_medium TEXT,
  last_touch_campaign TEXT,

  -- Visitor enrichment (from IP lookup)
  company_name TEXT,
  company_domain TEXT,
  company_industry TEXT,
  company_size TEXT,
  company_linkedin TEXT,

  -- Geographic
  country TEXT,
  region TEXT,
  city TEXT,

  -- Lead association
  lead_id UUID REFERENCES chat_leads(id) ON DELETE SET NULL,
  contact_id UUID REFERENCES contacts(id) ON DELETE SET NULL,
  converted_at TIMESTAMPTZ,

  -- Predictive scoring
  engagement_score INTEGER DEFAULT 0,
  predicted_lead_score INTEGER DEFAULT 0,
  predicted_conversion_probability DECIMAL(5,4) DEFAULT 0,
  intent_signals JSONB DEFAULT '[]'::jsonb,

  -- Flags
  is_bot BOOLEAN DEFAULT FALSE,
  is_internal BOOLEAN DEFAULT FALSE,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 2. VISITOR SESSIONS (Per-visit tracking)
-- ============================================
CREATE TABLE IF NOT EXISTS visitor_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT UNIQUE NOT NULL,
  visitor_id TEXT NOT NULL,
  journey_id UUID REFERENCES visitor_journeys(id) ON DELETE CASCADE,

  -- Session timing
  started_at TIMESTAMPTZ DEFAULT NOW(),
  ended_at TIMESTAMPTZ,
  last_activity_at TIMESTAMPTZ DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE,

  -- Entry/exit
  entry_url TEXT,
  entry_page_path TEXT,
  exit_url TEXT,
  exit_page_path TEXT,
  referrer TEXT,

  -- UTM parameters
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_content TEXT,
  utm_term TEXT,

  -- Device & browser
  user_agent TEXT,
  device_type TEXT, -- desktop, mobile, tablet
  browser TEXT,
  browser_version TEXT,
  os TEXT,
  os_version TEXT,
  screen_width INTEGER,
  screen_height INTEGER,
  viewport_width INTEGER,
  viewport_height INTEGER,
  timezone TEXT,
  language TEXT,

  -- Geographic (from IP)
  ip_address TEXT,
  country TEXT,
  region TEXT,
  city TEXT,

  -- Company enrichment
  company_name TEXT,
  company_domain TEXT,
  company_industry TEXT,
  company_size TEXT,

  -- Session metrics (updated in real-time)
  page_count INTEGER DEFAULT 0,
  event_count INTEGER DEFAULT 0,
  total_time_seconds INTEGER DEFAULT 0,
  engagement_score INTEGER DEFAULT 0,
  max_scroll_depth INTEGER DEFAULT 0,

  -- Conversion tracking
  lead_id UUID REFERENCES chat_leads(id) ON DELETE SET NULL,
  contact_id UUID REFERENCES contacts(id) ON DELETE SET NULL,
  identified_at TIMESTAMPTZ,
  converted BOOLEAN DEFAULT FALSE,
  conversion_type TEXT, -- chat, contact_form, download, etc.

  -- Flags
  is_bounce BOOLEAN DEFAULT FALSE,
  is_bot BOOLEAN DEFAULT FALSE,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 3. PAGE VIEWS (Detailed page tracking)
-- ============================================
CREATE TABLE IF NOT EXISTS page_views (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  visitor_id TEXT NOT NULL,

  -- Page info
  page_url TEXT NOT NULL,
  page_path TEXT NOT NULL,
  page_title TEXT,
  page_type TEXT, -- home, service, case-study, blog, contact, etc.

  -- Timing
  entered_at TIMESTAMPTZ DEFAULT NOW(),
  exited_at TIMESTAMPTZ,
  time_on_page_ms INTEGER DEFAULT 0,
  visible_time_ms INTEGER DEFAULT 0, -- Actual time page was visible (not background tab)

  -- Section-level data (JSONB array)
  section_views JSONB DEFAULT '[]'::jsonb,
  -- Format: [{section_id, section_name, time_visible_ms, scroll_depth_percent, interactions: [{type, target, timestamp}]}]

  -- Scroll tracking
  max_scroll_depth INTEGER DEFAULT 0,
  scroll_velocity_avg DECIMAL(8,2), -- pixels per second

  -- Engagement
  click_count INTEGER DEFAULT 0,
  interaction_count INTEGER DEFAULT 0,

  -- Exit behavior
  exit_type TEXT, -- navigation, bounce, conversion, idle, external
  exit_to_url TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 4. VISITOR EVENTS (Granular interactions)
-- ============================================
CREATE TABLE IF NOT EXISTS visitor_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  visitor_id TEXT NOT NULL,
  page_view_id UUID REFERENCES page_views(id) ON DELETE CASCADE,

  -- Event details
  event_type TEXT NOT NULL, -- click, scroll, hover, form_focus, form_submit, video_play, cta_interaction, chat_open, etc.
  event_category TEXT, -- navigation, engagement, conversion, form, media
  event_target TEXT, -- CSS selector or element description
  event_value TEXT, -- Additional context (e.g., button text, link href)
  event_data JSONB DEFAULT '{}'::jsonb,

  -- Position data (for heatmaps)
  page_x INTEGER,
  page_y INTEGER,
  viewport_x INTEGER,
  viewport_y INTEGER,
  element_x INTEGER, -- Position within target element
  element_y INTEGER,

  -- Context
  page_path TEXT,
  section_id TEXT,
  scroll_depth INTEGER,

  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 5. HEATMAP DATA (Pre-aggregated for performance)
-- ============================================
CREATE TABLE IF NOT EXISTS heatmap_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  page_path TEXT NOT NULL,
  date DATE NOT NULL,
  device_type TEXT NOT NULL DEFAULT 'desktop',

  -- Click heatmap (aggregated positions)
  click_points JSONB DEFAULT '[]'::jsonb,
  -- Format: [{x_percent, y_percent, count, element: {selector, text}}]

  -- Scroll heatmap (depth distribution)
  scroll_depths JSONB DEFAULT '[]'::jsonb,
  -- Format: [{depth_percent, visitor_count, avg_time_at_depth_ms}]

  -- Attention heatmap (time spent per section)
  section_attention JSONB DEFAULT '[]'::jsonb,
  -- Format: [{section_id, section_name, avg_time_ms, view_count, engagement_rate}]

  -- Movement patterns (mouse flow)
  movement_flow JSONB DEFAULT '[]'::jsonb,
  -- Format: [{from: {x, y}, to: {x, y}, count}]

  -- Stats
  total_views INTEGER DEFAULT 0,
  total_clicks INTEGER DEFAULT 0,
  avg_scroll_depth INTEGER DEFAULT 0,
  avg_time_on_page_ms INTEGER DEFAULT 0,
  bounce_rate DECIMAL(5,2) DEFAULT 0,

  UNIQUE(page_path, date, device_type),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 6. ENGAGEMENT TRIGGERS (Configuration)
-- ============================================
CREATE TABLE IF NOT EXISTS engagement_triggers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

  -- Trigger identity
  name TEXT NOT NULL,
  description TEXT,
  trigger_type TEXT NOT NULL, -- idle, exit_intent, scroll_depth, section_time, engagement_score, return_visitor, page_sequence, time_on_page

  -- Conditions (when to fire)
  conditions JSONB NOT NULL DEFAULT '{}'::jsonb,
  -- Examples:
  -- idle: {idle_seconds: 30, min_page_views: 2}
  -- exit_intent: {enabled: true, delay_seconds: 5}
  -- scroll_depth: {depth_percent: 75, time_at_depth_seconds: 10}
  -- section_time: {section_id: "pricing", min_seconds: 20}
  -- engagement_score: {min_score: 50, max_score: null}
  -- return_visitor: {min_sessions: 2}
  -- page_sequence: {pages: ["/services/*", "/case-studies/*"]}
  -- time_on_page: {min_seconds: 60}

  -- Target pages (where trigger is active)
  target_pages JSONB DEFAULT '["*"]'::jsonb, -- Array of path patterns
  exclude_pages JSONB DEFAULT '[]'::jsonb,

  -- Action (what to do when triggered)
  action_type TEXT NOT NULL DEFAULT 'chat_proactive', -- chat_proactive, popup, highlight_cta, slide_in
  action_config JSONB NOT NULL DEFAULT '{}'::jsonb,
  -- chat_proactive: {message: "...", cta_text: "Chat now", avatar: "..."}
  -- popup: {title: "...", body: "...", cta_text: "...", cta_url: "..."}

  -- Message personalization
  message_template TEXT NOT NULL,
  message_variants JSONB DEFAULT '[]'::jsonb, -- A/B test variants

  -- Timing & frequency
  cooldown_minutes INTEGER DEFAULT 30, -- Don't show again for X minutes
  max_shows_per_session INTEGER DEFAULT 1,
  max_shows_per_visitor INTEGER DEFAULT 3,
  delay_seconds INTEGER DEFAULT 0, -- Delay before showing after trigger

  -- Priority (lower = higher priority)
  priority INTEGER DEFAULT 100,

  -- Targeting
  device_types JSONB DEFAULT '["desktop", "tablet", "mobile"]'::jsonb,
  visitor_types JSONB DEFAULT '["new", "returning"]'::jsonb,

  -- Status
  is_active BOOLEAN DEFAULT TRUE,

  -- Analytics
  impressions INTEGER DEFAULT 0,
  engagements INTEGER DEFAULT 0, -- Clicked CTA, started chat, etc.
  conversions INTEGER DEFAULT 0, -- Led to lead capture

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 7. TRIGGER HISTORY (Track what was shown)
-- ============================================
CREATE TABLE IF NOT EXISTS trigger_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  visitor_id TEXT NOT NULL,
  trigger_id UUID NOT NULL REFERENCES engagement_triggers(id) ON DELETE CASCADE,

  -- Context when triggered
  page_path TEXT,
  trigger_context JSONB DEFAULT '{}'::jsonb, -- Conditions that matched

  -- Response
  shown_at TIMESTAMPTZ DEFAULT NOW(),
  response TEXT, -- engaged, dismissed, ignored
  responded_at TIMESTAMPTZ,

  -- Conversion tracking
  converted BOOLEAN DEFAULT FALSE,
  conversion_type TEXT,
  converted_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 8. SESSION RECORDINGS (Lightweight replay)
-- ============================================
CREATE TABLE IF NOT EXISTS session_recordings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  visitor_id TEXT NOT NULL,
  page_path TEXT NOT NULL,

  -- Timing
  started_at TIMESTAMPTZ DEFAULT NOW(),
  ended_at TIMESTAMPTZ,
  duration_ms INTEGER DEFAULT 0,

  -- Recording data (stored in chunks for large recordings)
  events_url TEXT, -- URL to stored events JSON (in Supabase Storage)
  events_count INTEGER DEFAULT 0,

  -- Initial state
  initial_dom_snapshot TEXT, -- Compressed HTML snapshot
  viewport_width INTEGER,
  viewport_height INTEGER,

  -- Flags
  has_conversion BOOLEAN DEFAULT FALSE,
  has_rage_clicks BOOLEAN DEFAULT FALSE, -- Rapid clicking in frustration
  has_errors BOOLEAN DEFAULT FALSE,

  -- Metrics for filtering
  max_scroll_depth INTEGER DEFAULT 0,
  click_count INTEGER DEFAULT 0,
  engagement_score INTEGER DEFAULT 0,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 9. REAL-TIME ANALYTICS AGGREGATES
-- ============================================
CREATE TABLE IF NOT EXISTS analytics_realtime (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

  -- Time bucket (1-minute granularity)
  bucket_timestamp TIMESTAMPTZ NOT NULL,

  -- Active metrics
  active_visitors INTEGER DEFAULT 0,
  active_sessions INTEGER DEFAULT 0,

  -- Page metrics
  page_views INTEGER DEFAULT 0,
  unique_visitors INTEGER DEFAULT 0,

  -- Engagement
  avg_engagement_score DECIMAL(5,2) DEFAULT 0,
  total_events INTEGER DEFAULT 0,

  -- Top pages (JSONB array)
  top_pages JSONB DEFAULT '[]'::jsonb,
  -- Format: [{path, title, views, avg_time_ms}]

  -- Traffic sources
  traffic_sources JSONB DEFAULT '[]'::jsonb,
  -- Format: [{source, medium, sessions}]

  -- Geographic
  countries JSONB DEFAULT '[]'::jsonb,
  -- Format: [{country, sessions}]

  -- Conversions
  conversions INTEGER DEFAULT 0,
  conversion_types JSONB DEFAULT '{}'::jsonb,

  UNIQUE(bucket_timestamp),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 10. INDEXES FOR PERFORMANCE
-- ============================================

-- Visitor journeys
CREATE INDEX IF NOT EXISTS idx_visitor_journeys_visitor_id ON visitor_journeys(visitor_id);
CREATE INDEX IF NOT EXISTS idx_visitor_journeys_last_seen ON visitor_journeys(last_seen_at DESC);
CREATE INDEX IF NOT EXISTS idx_visitor_journeys_company ON visitor_journeys(company_name) WHERE company_name IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_visitor_journeys_converted ON visitor_journeys(converted_at) WHERE converted_at IS NOT NULL;

-- Visitor sessions
CREATE INDEX IF NOT EXISTS idx_visitor_sessions_session_id ON visitor_sessions(session_id);
CREATE INDEX IF NOT EXISTS idx_visitor_sessions_visitor_id ON visitor_sessions(visitor_id);
CREATE INDEX IF NOT EXISTS idx_visitor_sessions_active ON visitor_sessions(is_active, last_activity_at DESC) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_visitor_sessions_started ON visitor_sessions(started_at DESC);
CREATE INDEX IF NOT EXISTS idx_visitor_sessions_company ON visitor_sessions(company_name) WHERE company_name IS NOT NULL;

-- Page views
CREATE INDEX IF NOT EXISTS idx_page_views_session ON page_views(session_id, entered_at DESC);
CREATE INDEX IF NOT EXISTS idx_page_views_visitor ON page_views(visitor_id, entered_at DESC);
CREATE INDEX IF NOT EXISTS idx_page_views_path ON page_views(page_path, entered_at DESC);
CREATE INDEX IF NOT EXISTS idx_page_views_entered ON page_views(entered_at DESC);

-- Visitor events
CREATE INDEX IF NOT EXISTS idx_visitor_events_session ON visitor_events(session_id, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_visitor_events_type ON visitor_events(event_type, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_visitor_events_page ON page_views(page_path);
CREATE INDEX IF NOT EXISTS idx_visitor_events_timestamp ON visitor_events(timestamp DESC);

-- Heatmap data
CREATE INDEX IF NOT EXISTS idx_heatmap_data_page ON heatmap_data(page_path, date DESC);

-- Trigger history
CREATE INDEX IF NOT EXISTS idx_trigger_history_session ON trigger_history(session_id);
CREATE INDEX IF NOT EXISTS idx_trigger_history_visitor ON trigger_history(visitor_id);
CREATE INDEX IF NOT EXISTS idx_trigger_history_trigger ON trigger_history(trigger_id);

-- Session recordings
CREATE INDEX IF NOT EXISTS idx_session_recordings_session ON session_recordings(session_id);
CREATE INDEX IF NOT EXISTS idx_session_recordings_visitor ON session_recordings(visitor_id);
CREATE INDEX IF NOT EXISTS idx_session_recordings_conversion ON session_recordings(has_conversion) WHERE has_conversion = TRUE;

-- Analytics realtime
CREATE INDEX IF NOT EXISTS idx_analytics_realtime_bucket ON analytics_realtime(bucket_timestamp DESC);

-- ============================================
-- 11. ENABLE SUPABASE REALTIME
-- ============================================

-- Enable realtime for live dashboard
ALTER PUBLICATION supabase_realtime ADD TABLE visitor_sessions;
ALTER PUBLICATION supabase_realtime ADD TABLE page_views;
ALTER PUBLICATION supabase_realtime ADD TABLE visitor_events;
ALTER PUBLICATION supabase_realtime ADD TABLE trigger_history;

-- ============================================
-- 12. ROW LEVEL SECURITY
-- ============================================

ALTER TABLE visitor_journeys ENABLE ROW LEVEL SECURITY;
ALTER TABLE visitor_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE visitor_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE heatmap_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE engagement_triggers ENABLE ROW LEVEL SECURITY;
ALTER TABLE trigger_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_recordings ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_realtime ENABLE ROW LEVEL SECURITY;

-- Policies: Anonymous users can INSERT events, authenticated users can read all
-- Visitor journeys
CREATE POLICY "visitor_journeys_insert_anon" ON visitor_journeys FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "visitor_journeys_update_anon" ON visitor_journeys FOR UPDATE TO anon USING (true);
CREATE POLICY "visitor_journeys_all_auth" ON visitor_journeys FOR ALL TO authenticated USING (true);

-- Visitor sessions
CREATE POLICY "visitor_sessions_insert_anon" ON visitor_sessions FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "visitor_sessions_update_anon" ON visitor_sessions FOR UPDATE TO anon USING (true);
CREATE POLICY "visitor_sessions_all_auth" ON visitor_sessions FOR ALL TO authenticated USING (true);

-- Page views
CREATE POLICY "page_views_insert_anon" ON page_views FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "page_views_update_anon" ON page_views FOR UPDATE TO anon USING (true);
CREATE POLICY "page_views_all_auth" ON page_views FOR ALL TO authenticated USING (true);

-- Visitor events
CREATE POLICY "visitor_events_insert_anon" ON visitor_events FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "visitor_events_all_auth" ON visitor_events FOR ALL TO authenticated USING (true);

-- Heatmap data
CREATE POLICY "heatmap_data_insert_anon" ON heatmap_data FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "heatmap_data_update_anon" ON heatmap_data FOR UPDATE TO anon USING (true);
CREATE POLICY "heatmap_data_all_auth" ON heatmap_data FOR ALL TO authenticated USING (true);

-- Engagement triggers (admin only)
CREATE POLICY "engagement_triggers_all_auth" ON engagement_triggers FOR ALL TO authenticated USING (true);
CREATE POLICY "engagement_triggers_select_anon" ON engagement_triggers FOR SELECT TO anon USING (is_active = true);

-- Trigger history
CREATE POLICY "trigger_history_insert_anon" ON trigger_history FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "trigger_history_update_anon" ON trigger_history FOR UPDATE TO anon USING (true);
CREATE POLICY "trigger_history_all_auth" ON trigger_history FOR ALL TO authenticated USING (true);

-- Session recordings
CREATE POLICY "session_recordings_insert_anon" ON session_recordings FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "session_recordings_update_anon" ON session_recordings FOR UPDATE TO anon USING (true);
CREATE POLICY "session_recordings_all_auth" ON session_recordings FOR ALL TO authenticated USING (true);

-- Analytics realtime
CREATE POLICY "analytics_realtime_insert_anon" ON analytics_realtime FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "analytics_realtime_update_anon" ON analytics_realtime FOR UPDATE TO anon USING (true);
CREATE POLICY "analytics_realtime_all_auth" ON analytics_realtime FOR ALL TO authenticated USING (true);

-- ============================================
-- 13. UPDATE TRIGGERS
-- ============================================

CREATE TRIGGER update_visitor_journeys_updated_at
  BEFORE UPDATE ON visitor_journeys
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_visitor_sessions_updated_at
  BEFORE UPDATE ON visitor_sessions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_heatmap_data_updated_at
  BEFORE UPDATE ON heatmap_data
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_engagement_triggers_updated_at
  BEFORE UPDATE ON engagement_triggers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 14. HELPER FUNCTIONS
-- ============================================

-- Function to mark inactive sessions
CREATE OR REPLACE FUNCTION mark_inactive_sessions()
RETURNS void AS $$
BEGIN
  UPDATE visitor_sessions
  SET
    is_active = FALSE,
    ended_at = last_activity_at
  WHERE
    is_active = TRUE
    AND last_activity_at < NOW() - INTERVAL '30 minutes';
END;
$$ LANGUAGE plpgsql;

-- Function to aggregate heatmap data daily
CREATE OR REPLACE FUNCTION aggregate_heatmap_data(target_date DATE)
RETURNS void AS $$
BEGIN
  -- Aggregate click events into heatmap_data
  INSERT INTO heatmap_data (page_path, date, device_type, click_points, total_views, total_clicks)
  SELECT
    pv.page_path,
    target_date,
    COALESCE(vs.device_type, 'desktop'),
    jsonb_agg(DISTINCT jsonb_build_object(
      'x_percent', ROUND((ve.page_x::numeric / vs.viewport_width) * 100, 1),
      'y_percent', ROUND((ve.page_y::numeric / vs.viewport_height) * 100, 1),
      'count', 1
    )) FILTER (WHERE ve.event_type = 'click'),
    COUNT(DISTINCT pv.id),
    COUNT(ve.id) FILTER (WHERE ve.event_type = 'click')
  FROM page_views pv
  LEFT JOIN visitor_events ve ON ve.page_view_id = pv.id
  LEFT JOIN visitor_sessions vs ON vs.session_id = pv.session_id
  WHERE pv.entered_at::date = target_date
  GROUP BY pv.page_path, COALESCE(vs.device_type, 'desktop')
  ON CONFLICT (page_path, date, device_type)
  DO UPDATE SET
    click_points = heatmap_data.click_points || EXCLUDED.click_points,
    total_views = EXCLUDED.total_views,
    total_clicks = EXCLUDED.total_clicks,
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- Function to cleanup old analytics data (retention policy)
CREATE OR REPLACE FUNCTION cleanup_old_analytics(retention_days INTEGER DEFAULT 90)
RETURNS void AS $$
BEGIN
  -- Delete old events
  DELETE FROM visitor_events
  WHERE timestamp < NOW() - (retention_days || ' days')::INTERVAL;

  -- Delete old page views
  DELETE FROM page_views
  WHERE entered_at < NOW() - (retention_days || ' days')::INTERVAL;

  -- Delete old trigger history
  DELETE FROM trigger_history
  WHERE created_at < NOW() - (retention_days || ' days')::INTERVAL;

  -- Delete old session recordings (keep converted ones longer)
  DELETE FROM session_recordings
  WHERE created_at < NOW() - (retention_days || ' days')::INTERVAL
    AND has_conversion = FALSE;

  -- Delete old sessions (keep journey summary)
  DELETE FROM visitor_sessions
  WHERE started_at < NOW() - (retention_days || ' days')::INTERVAL;

  -- Delete old realtime aggregates
  DELETE FROM analytics_realtime
  WHERE bucket_timestamp < NOW() - (retention_days || ' days')::INTERVAL;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 15. SEED DEFAULT ENGAGEMENT TRIGGERS
-- ============================================

INSERT INTO engagement_triggers (name, description, trigger_type, conditions, target_pages, action_type, message_template, priority)
VALUES
  (
    'Exit Intent - General',
    'Show proactive message when visitor appears to be leaving',
    'exit_intent',
    '{"delay_seconds": 5}'::jsonb,
    '["*"]'::jsonb,
    'chat_proactive',
    'Quick question before you go - is there anything I can help clarify?',
    10
  ),
  (
    'Exit Intent - Services',
    'Targeted message for service page exit intent',
    'exit_intent',
    '{"delay_seconds": 3}'::jsonb,
    '["/services/*"]'::jsonb,
    'chat_proactive',
    'Interested in learning more about how we can help? I''d be happy to answer any questions.',
    5
  ),
  (
    'High Engagement',
    'Engage visitors showing strong interest',
    'engagement_score',
    '{"min_score": 50}'::jsonb,
    '["*"]'::jsonb,
    'chat_proactive',
    'I notice you''re exploring our solutions. Would you like to discuss how we can help with your specific needs?',
    20
  ),
  (
    'Pricing Section Interest',
    'Engage visitors spending time on pricing',
    'section_time',
    '{"section_id": "pricing", "min_seconds": 20}'::jsonb,
    '["*"]'::jsonb,
    'chat_proactive',
    'Have questions about pricing or want a custom quote? I''m here to help.',
    15
  ),
  (
    'Case Study Deep Dive',
    'Engage visitors reading case studies',
    'time_on_page',
    '{"min_seconds": 90}'::jsonb,
    '["/case-studies/*"]'::jsonb,
    'chat_proactive',
    'Interested in similar results for your organization? Let''s discuss your goals.',
    25
  ),
  (
    'Return Visitor Welcome',
    'Welcome back returning visitors',
    'return_visitor',
    '{"min_sessions": 2}'::jsonb,
    '["*"]'::jsonb,
    'chat_proactive',
    'Welcome back! Ready to take the next step? I can help answer any remaining questions.',
    30
  ),
  (
    'Idle on Contact',
    'Help visitors stuck on contact form',
    'idle',
    '{"idle_seconds": 45, "min_page_views": 1}'::jsonb,
    '["/contact"]'::jsonb,
    'chat_proactive',
    'Need help with the form? I can assist or schedule a call for you directly.',
    8
  ),
  (
    'Deep Scroll Engagement',
    'Engage visitors who scroll deep',
    'scroll_depth',
    '{"depth_percent": 80, "time_at_depth_seconds": 5}'::jsonb,
    '["/services/*", "/case-studies/*", "/whitepapers/*"]'::jsonb,
    'chat_proactive',
    'You seem interested in the details. Want to discuss how this applies to your situation?',
    35
  )
ON CONFLICT DO NOTHING;

-- ============================================
-- MIGRATION COMPLETE
-- ============================================
