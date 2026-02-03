import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { isWorkEmail } from '@/lib/lp-dropdown-options';
import { sendLeadNotificationEmail, sendThankYouEmail } from '@/lib/email';
import { LP_CONTENT } from '@/lib/lp-content';

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
      firstName,
      lastName,
      email,
      phone,
      companyName,
      jobTitle,
      lookingFor,
      landingPage,
      serviceCluster,
      // UTM parameters
      utmSource,
      utmMedium,
      utmCampaign,
      utmContent,
      utmTerm,
      // URL parameters
      industryParam,
      roleParam,
    } = data;

    // Validate required fields
    if (!firstName || !lastName || !email || !companyName || !jobTitle || !lookingFor || !landingPage) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate email format
    if (!email.includes('@') || !email.includes('.')) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate work email (block personal domains)
    if (!isWorkEmail(email)) {
      return NextResponse.json(
        { error: 'Please use your work email address' },
        { status: 400 }
      );
    }

    // Get service cluster from landing page content if not provided
    const lpContent = LP_CONTENT[landingPage];
    const resolvedServiceCluster = serviceCluster || lpContent?.serviceCluster || 'general';

    // Prepare lead data
    const leadData = {
      first_name: firstName,
      last_name: lastName,
      email: email.toLowerCase().trim(),
      phone: phone || null,
      company_name: companyName,
      job_title: jobTitle,
      looking_for: lookingFor,
      landing_page: landingPage,
      service_cluster: resolvedServiceCluster,
      utm_source: utmSource || null,
      utm_medium: utmMedium || null,
      utm_campaign: utmCampaign || null,
      utm_content: utmContent || null,
      utm_term: utmTerm || null,
      industry_param: industryParam || null,
      role_param: roleParam || null,
      status: 'new',
    };

    // Get IP and user agent from request
    const forwardedFor = request.headers.get('x-forwarded-for');
    const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : 'unknown';
    const userAgent = request.headers.get('user-agent') || null;
    const referrer = request.headers.get('referer') || null;

    const supabase = getServiceSupabase();

    let leadId: string | null = null;

    if (supabase) {
      // Insert into Supabase
      const { data: lead, error } = await supabase
        .from('lp_leads')
        .insert({
          ...leadData,
          ip_address: ip,
          user_agent: userAgent,
          referrer: referrer,
        })
        .select('id')
        .single();

      if (error) {
        console.error('Supabase error:', error);
        // Don't fail the request - still send emails
      } else {
        leadId = lead?.id;
        console.log('[LP Lead] Saved to database:', leadId);
      }
    } else {
      console.log('[LP Lead] Supabase not configured - skipping database save');
      console.log('[LP Lead] Data:', leadData);
    }

    // Send notification email to admin (async, don't block response)
    sendLeadNotificationEmail({
      firstName,
      lastName,
      email,
      phone,
      companyName,
      jobTitle,
      lookingFor,
      landingPage,
      serviceCluster: resolvedServiceCluster,
      utmSource,
      utmCampaign,
    }).catch((err) => {
      console.error('[LP Lead] Failed to send admin notification:', err);
    });

    // Send thank you email to lead (async, don't block response)
    sendThankYouEmail({
      firstName,
      email,
      serviceCluster: resolvedServiceCluster,
      lookingFor,
      ctoText: lpContent?.ctoText || 'your request',
    }).catch((err) => {
      console.error('[LP Lead] Failed to send thank you email:', err);
    });

    // Return success with context for thank you page
    return NextResponse.json({
      success: true,
      leadId,
      thankYouData: {
        firstName,
        serviceCluster: resolvedServiceCluster,
        lookingFor,
      },
    });
  } catch (error) {
    console.error('LP submit error:', error);
    return NextResponse.json(
      { error: 'Failed to submit form' },
      { status: 500 }
    );
  }
}
