import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    const { name, email, company, phone, reason, message } = data;

    // Validate required fields
    if (!name || !email || !reason || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate email format
    if (!email.includes('@')) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Insert into Supabase
    const { error } = await supabase.from('contacts').insert([
      {
        name,
        email,
        company: company || null,
        phone: phone || null,
        inquiry_type: reason,
        message,
        source: 'website_contact_form',
        status: 'new',
      },
    ]);

    if (error) {
      console.error('Supabase error:', error);
      // For development without Supabase, still return success
      if (error.message?.includes('placeholder')) {
        return NextResponse.json({ success: true, warning: 'Database not configured' });
      }
      return NextResponse.json(
        { error: 'Failed to submit form' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
