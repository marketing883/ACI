import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { isWorkEmail } from '@/lib/lp-dropdown-options';
import { sendEventLeadNotificationEmail, sendEventThankYouEmail } from '@/lib/email';
import { insertEventLead } from '@/lib/event-leads-db';

const EVENT_SLUG = 'digital-trust-summit-2026';
const EVENT_NAME = 'National Digital Trust Summit, AION 2026';
const EVENT_DATE_LINE = 'Friday, 31 July 2026';
const EVENT_VENUE_LINE = 'Taj Yeshwantpur, Bengaluru';

const VALID_JOURNEY_STAGES = ['exploring', 'piloting', 'scaling', 'optimizing'];

// Server-side Supabase client with service role key
function getServiceSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    return null;
  }

  return createClient(url, serviceKey);
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    const {
      fullName,
      email,
      phone,
      companyName,
      jobTitle,
      painPoints,
      painPointOther,
      journeyStage,
      teamChallenges,
      reportingChallenges,
      aiMlExploration,
      aiAdoptionChallenge,
      wantsExpertMeeting,
      utmSource,
      utmMedium,
      utmCampaign,
      utmContent,
      utmTerm,
    } = data;

    if (!fullName || !email || !companyName || !jobTitle) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (!Array.isArray(painPoints) || painPoints.length === 0) {
      return NextResponse.json(
        { error: 'Pick at least one challenge' },
        { status: 400 }
      );
    }

    if (!journeyStage || !VALID_JOURNEY_STAGES.includes(journeyStage)) {
      return NextResponse.json(
        { error: 'Pick your AI journey stage' },
        { status: 400 }
      );
    }

    if (!email.includes('@') || !email.includes('.')) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    if (!isWorkEmail(email)) {
      return NextResponse.json(
        { error: 'Please use your work email address' },
        { status: 400 }
      );
    }

    const leadData = {
      event_slug: EVENT_SLUG,
      full_name: String(fullName).trim(),
      email: String(email).toLowerCase().trim(),
      phone: phone ? String(phone).trim() : null,
      company_name: String(companyName).trim(),
      job_title: String(jobTitle).trim(),
      pain_points: painPoints.map((p: unknown) => String(p)).slice(0, 12),
      pain_point_other: painPointOther ? String(painPointOther).slice(0, 500) : null,
      journey_stage: journeyStage,
      team_challenges: teamChallenges ? String(teamChallenges).trim().slice(0, 500) : null,
      reporting_challenges: reportingChallenges ? String(reportingChallenges).trim().slice(0, 500) : null,
      ai_ml_exploration: aiMlExploration ? String(aiMlExploration).trim().slice(0, 500) : null,
      ai_adoption_challenge: aiAdoptionChallenge ? String(aiAdoptionChallenge).trim().slice(0, 500) : null,
      wants_expert_meeting: Boolean(wantsExpertMeeting),
      utm_source: utmSource || null,
      utm_medium: utmMedium || null,
      utm_campaign: utmCampaign || null,
      utm_content: utmContent || null,
      utm_term: utmTerm || null,
      status: 'new',
    };

    const forwardedFor = request.headers.get('x-forwarded-for');
    const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : 'unknown';
    const userAgent = request.headers.get('user-agent') || null;
    const referrer = request.headers.get('referer') || null;

    const supabase = getServiceSupabase();
    let leadId: string | null = null;
    let alreadyRegistered = false;
    // A registration that never reached the table is invisible to the
    // admin dashboard, so say so in the response and shout in the logs.
    let persisted = false;

    if (supabase) {
      const result = await insertEventLead(supabase, {
        ...leadData,
        ip_address: ip,
        user_agent: userAgent,
        referrer: referrer,
      });

      if (result.dropped.length) {
        console.error(
          `[Event Lead] event_leads is missing ${result.dropped.join(', ')} - saved without them. ` +
            'Run the pending supabase/migrations against this project.'
        );
      }

      if (result.duplicate) {
        // Same email already in the draw pool. That is a success from the
        // visitor's point of view, and the row is already on the dashboard.
        alreadyRegistered = true;
        persisted = true;
        console.log('[Event Lead] Duplicate entry for:', leadData.email);
      } else if (result.error) {
        console.error('[Event Lead] NOT SAVED - registration exists only in the notification email:', {
          email: leadData.email,
          error: result.error,
        });
      } else {
        leadId = result.id;
        persisted = true;
        console.log('[Event Lead] Saved to database:', leadId);
      }
    } else {
      console.error(
        '[Event Lead] NOT SAVED - Supabase is not configured on this deployment ' +
          '(NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY)'
      );
      console.log('[Event Lead] Data:', leadData);
    }

    if (!alreadyRegistered) {
      // Send notification email to sales team (async, don't block response)
      sendEventLeadNotificationEmail({
        fullName: leadData.full_name,
        email: leadData.email,
        phone: leadData.phone || undefined,
        companyName: leadData.company_name,
        jobTitle: leadData.job_title,
        painPoints: leadData.pain_points,
        painPointOther: leadData.pain_point_other || undefined,
        journeyStage: leadData.journey_stage,
        teamChallenges: leadData.team_challenges || undefined,
        reportingChallenges: leadData.reporting_challenges || undefined,
        aiMlExploration: leadData.ai_ml_exploration || undefined,
        aiAdoptionChallenge: leadData.ai_adoption_challenge || undefined,
        wantsExpertMeeting: leadData.wants_expert_meeting,
        eventName: EVENT_NAME,
        utmSource: utmSource || undefined,
        utmCampaign: utmCampaign || undefined,
      })
        .then((sent) => {
          // These senders report failure by returning false, and every caller
          // used to throw that away. That is how the AION 2026 notifications
          // went missing without a trace in the logs.
          if (!sent) {
            console.error(
              '[Event Lead] NOTIFICATION NOT SENT - nobody has been told about this ' +
                `registration: ${leadData.email}. Check RESEND_API_KEY and ADMIN_EMAIL. ` +
                'A send that succeeds here can still be quarantined by the recipient; ' +
                'check last_event in Resend.'
            );
          }
        })
        .catch((err) => {
          console.error('[Event Lead] Failed to send admin notification:', err);
        });

      // Confirm the draw entry to the attendee (async, don't block response)
      sendEventThankYouEmail({
        fullName: leadData.full_name,
        email: leadData.email,
        eventName: EVENT_NAME,
        eventDateLine: EVENT_DATE_LINE,
        eventVenueLine: EVENT_VENUE_LINE,
      }).catch((err) => {
        console.error('[Event Lead] Failed to send thank you email:', err);
      });
    }

    return NextResponse.json({
      success: true,
      leadId,
      alreadyRegistered,
      persisted,
    });
  } catch (error) {
    console.error('Event lead submit error:', error);
    return NextResponse.json(
      { error: 'Failed to submit form' },
      { status: 500 }
    );
  }
}
