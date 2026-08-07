import { NextRequest, NextResponse } from 'next/server';
import { getServerClient } from '@/lib/supabase';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    // Service-role client so the insert bypasses RLS and the lead lands.
    const db = getServerClient();
    const data = await request.json();

    const { name, email, company, playbook_slug, playbook_title } = data;

    // Validate required fields
    if (!name || !email || !company || !playbook_slug) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate download token
    const downloadToken = crypto.randomUUID();
    const tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Insert into Supabase
    const { error } = await db.from('playbook_leads').insert([
      {
        name,
        email,
        company,
        playbook_slug,
        playbook_title,
        download_token: downloadToken,
        token_expiry: tokenExpiry.toISOString(),
        token_used: false,
        source: 'playbook_download',
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

    return NextResponse.json({
      success: true,
      downloadToken
    });
  } catch (error) {
    console.error('Playbook lead error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// No GET here on purpose, for the same reason as the whitepaper one: a
// lead-listing endpoint on a public path. It only ever returned empty
// because RLS denies the anon client it used, so it was one policy change
// away from handing over every playbook lead. The admin page reads
// /api/admin/playbook-leads, which sits behind the middleware auth gate.
