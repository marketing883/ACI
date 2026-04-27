import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    const { email, source } = data;

    // Validate email
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Insert into Supabase
    const { error } = await supabase.from('newsletter_subscribers').insert([
      {
        email: email.toLowerCase().trim(),
        source: source || 'website_footer',
        status: 'active',
      },
    ]);

    if (error) {
      // Check if it's a duplicate email error
      if (error.code === '23505') {
        return NextResponse.json({ success: true, message: 'Already subscribed' });
      }
      console.error('Supabase error:', error);
      // For development without Supabase
      if (error.message?.includes('placeholder')) {
        return NextResponse.json({ success: true, warning: 'Database not configured' });
      }
      return NextResponse.json(
        { error: 'Failed to subscribe' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Newsletter form error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
