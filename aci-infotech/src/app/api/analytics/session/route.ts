import { NextRequest, NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase';
import { headers } from 'next/headers';

interface SessionInitData {
  visitor_id: string;
  session_id: string;
  device_type: 'desktop' | 'mobile' | 'tablet';
  browser?: string;
  browser_version?: string;
  os?: string;
  os_version?: string;
  viewport_width?: number;
  viewport_height?: number;
  screen_width?: number;
  screen_height?: number;
  timezone?: string;
  language?: string;
  referrer?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  is_returning: boolean;
  session_count: number;
  user_agent?: string;
}

export async function POST(request: NextRequest) {
  try {
    const supabase = getServiceSupabase();
    const data: SessionInitData = await request.json();

    // Get IP address
    const headersList = await headers();
    const forwardedFor = headersList.get('x-forwarded-for');
    const realIp = headersList.get('x-real-ip');
    const ip = forwardedFor?.split(',')[0] || realIp || 'unknown';

    // Check if visitor journey exists
    const { data: existingJourney } = await supabase
      .from('visitor_journeys')
      .select('id, total_sessions, engagement_score')
      .eq('visitor_id', data.visitor_id)
      .single();

    let journeyId: string;

    if (existingJourney) {
      // Update existing journey
      journeyId = existingJourney.id;

      await supabase
        .from('visitor_journeys')
        .update({
          last_seen_at: new Date().toISOString(),
          total_sessions: (existingJourney.total_sessions || 0) + 1,
          last_touch_source: data.utm_source || null,
          last_touch_medium: data.utm_medium || null,
          last_touch_campaign: data.utm_campaign || null,
        })
        .eq('id', journeyId);
    } else {
      // Create new journey
      const { data: newJourney, error: journeyError } = await supabase
        .from('visitor_journeys')
        .insert({
          visitor_id: data.visitor_id,
          first_touch_source: data.utm_source || null,
          first_touch_medium: data.utm_medium || null,
          first_touch_campaign: data.utm_campaign || null,
          first_touch_referrer: data.referrer || null,
          last_touch_source: data.utm_source || null,
          last_touch_medium: data.utm_medium || null,
          last_touch_campaign: data.utm_campaign || null,
          country: null, // Will be enriched
          region: null,
          city: null,
        })
        .select('id')
        .single();

      if (journeyError) {
        console.error('[Session] Journey creation error:', journeyError);
      }

      journeyId = newJourney?.id;
    }

    // Create session
    const { error: sessionError } = await supabase.from('visitor_sessions').insert({
      session_id: data.session_id,
      visitor_id: data.visitor_id,
      journey_id: journeyId,
      entry_url: typeof window !== 'undefined' ? window.location.href : null,
      entry_page_path: typeof window !== 'undefined' ? window.location.pathname : null,
      referrer: data.referrer || null,
      utm_source: data.utm_source || null,
      utm_medium: data.utm_medium || null,
      utm_campaign: data.utm_campaign || null,
      utm_content: data.utm_content || null,
      utm_term: data.utm_term || null,
      user_agent: data.user_agent || null,
      device_type: data.device_type,
      browser: data.browser || null,
      browser_version: data.browser_version || null,
      os: data.os || null,
      os_version: data.os_version || null,
      screen_width: data.screen_width || null,
      screen_height: data.screen_height || null,
      viewport_width: data.viewport_width || null,
      viewport_height: data.viewport_height || null,
      timezone: data.timezone || null,
      language: data.language || null,
      ip_address: ip,
      is_active: true,
    });

    if (sessionError) {
      console.error('[Session] Session creation error:', sessionError);
      return NextResponse.json(
        { error: 'Failed to create session' },
        { status: 500 }
      );
    }

    // Enrich visitor data asynchronously (IP to company lookup)
    enrichVisitor(data.visitor_id, journeyId, ip).catch(console.error);

    return NextResponse.json({
      success: true,
      journey_id: journeyId,
      is_returning: data.is_returning,
    });
  } catch (error) {
    console.error('[Session] Error:', error);
    return NextResponse.json(
      { error: 'Failed to initialize session' },
      { status: 500 }
    );
  }
}

// Heartbeat endpoint to keep session alive
export async function PATCH(request: NextRequest) {
  try {
    const supabase = getServiceSupabase();
    const { session_id, engagement_score, page_count, total_time_seconds } =
      await request.json();

    if (!session_id) {
      return NextResponse.json({ error: 'session_id required' }, { status: 400 });
    }

    await supabase
      .from('visitor_sessions')
      .update({
        last_activity_at: new Date().toISOString(),
        engagement_score: engagement_score || 0,
        page_count: page_count || 0,
        total_time_seconds: total_time_seconds || 0,
      })
      .eq('session_id', session_id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Session Heartbeat] Error:', error);
    return NextResponse.json(
      { error: 'Failed to update session' },
      { status: 500 }
    );
  }
}

/**
 * Enrich visitor with company data from IP
 * Uses free IP-API service (or can be swapped for Clearbit, etc.)
 */
async function enrichVisitor(
  visitorId: string,
  journeyId: string,
  ip: string
): Promise<void> {
  // Skip localhost/private IPs
  if (ip === 'unknown' || ip === '127.0.0.1' || ip.startsWith('192.168.') || ip.startsWith('10.')) {
    return;
  }

  try {
    const supabase = getServiceSupabase();
    // Use ip-api.com free service (1000 requests/day)
    const response = await fetch(`http://ip-api.com/json/${ip}?fields=status,country,regionName,city,org,isp`);

    if (!response.ok) return;

    const data = await response.json();

    if (data.status !== 'success') return;

    // Extract company name from org/isp
    let companyName = data.org || data.isp || null;

    // Clean up company name (remove ISP prefixes, etc.)
    if (companyName) {
      companyName = companyName
        .replace(/^AS\d+\s+/i, '') // Remove AS number prefix
        .replace(/,?\s*(Inc|LLC|Ltd|Corp|Corporation|Limited|GmbH|AG|SA|SAS|BV)\.?$/i, '') // Remove suffixes
        .trim();
    }

    // Update journey with location data
    await supabase
      .from('visitor_journeys')
      .update({
        country: data.country || null,
        region: data.regionName || null,
        city: data.city || null,
        company_name: companyName,
      })
      .eq('id', journeyId);

    // Update current session with location
    await supabase
      .from('visitor_sessions')
      .update({
        country: data.country || null,
        region: data.regionName || null,
        city: data.city || null,
        company_name: companyName,
      })
      .eq('visitor_id', visitorId)
      .order('started_at', { ascending: false })
      .limit(1);
  } catch (error) {
    console.error('[Enrich] Error:', error);
  }
}
