import { NextRequest, NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase';
import crypto from 'crypto';
import { sendWhitepaperLeadNotification, sendWhitepaperThankYouEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    const { name, email, company, title, whitepaper_slug, whitepaper_title } = data;

    // Validate required fields
    if (!name || !email || !company || !whitepaper_slug) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate download token
    const downloadToken = crypto.randomUUID();
    const tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Use service role client to bypass RLS for server-side insert
    const supabase = getServiceSupabase();

    // Insert into Supabase
    const { error } = await supabase.from('whitepaper_leads').insert([
      {
        name,
        email,
        company,
        job_title: title || null,
        whitepaper_slug,
        whitepaper_title,
        download_token: downloadToken,
        token_expiry: tokenExpiry.toISOString(),
        token_used: false,
        source: 'whitepaper_download',
      },
    ]);

    if (error) {
      console.error('Supabase error:', error);
      // For development without Supabase table, still return success with token
      if (error.message?.includes('relation') || error.code === '42P01') {
        return NextResponse.json({
          success: true,
          downloadToken,
          warning: 'Database table not configured - using mock token'
        });
      }
      return NextResponse.json(
        { error: 'Failed to submit form' },
        { status: 500 }
      );
    }

    // Send emails (async, non-blocking)
    sendWhitepaperLeadNotification({
      name,
      email,
      company,
      whitepaperSlug: whitepaper_slug,
      whitepaperTitle: whitepaper_title,
    }).catch(err => console.error('[Whitepaper Lead] Admin notification failed:', err));

    sendWhitepaperThankYouEmail({
      name,
      email,
      company,
      whitepaperSlug: whitepaper_slug,
      whitepaperTitle: whitepaper_title,
    }).catch(err => console.error('[Whitepaper Lead] Thank you email failed:', err));

    return NextResponse.json({
      success: true,
      downloadToken
    });
  } catch (error) {
    console.error('Whitepaper lead error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// No GET here on purpose. This path is public (it is the download-gate
// POST target), so the listing endpoint that used to live here handed
// every whitepaper lead to any unauthenticated caller through a
// service-role client. The admin page reads /api/admin/whitepaper-leads,
// which sits behind the middleware auth gate.
