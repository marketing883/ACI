import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    const { name, email, company, whitepaper_slug, whitepaper_title } = data;

    // Validate required fields
    if (!name || !email || !company || !whitepaper_slug) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate download token
    const downloadToken = uuidv4();
    const tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Insert into Supabase
    const { error } = await supabase.from('whitepaper_leads').insert([
      {
        name,
        email,
        company,
        whitepaper_slug,
        whitepaper_title,
        download_token: downloadToken,
        token_expires_at: tokenExpiry.toISOString(),
        token_used: false,
        source: 'whitepaper_download',
        status: 'new',
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
    console.error('Whitepaper lead error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  // Admin endpoint to list whitepaper leads
  try {
    const { data, error } = await supabase
      .from('whitepaper_leads')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch leads' },
        { status: 500 }
      );
    }

    return NextResponse.json({ leads: data || [] });
  } catch (error) {
    console.error('Fetch whitepaper leads error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
