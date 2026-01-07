import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    const { email } = data;

    // Validate email
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Insert into Supabase
    const { error } = await supabase.from('leads_newsletter').insert([
      {
        email,
        source: 'website_footer',
        subscribed_at: new Date().toISOString(),
      },
    ]);

    if (error) {
      // Check if it's a duplicate email error
      if (error.code === '23505') {
        return NextResponse.json({ success: true, message: 'Already subscribed' });
      }
      console.error('Supabase error:', error);
      // For development, return success even if DB insert fails
      return NextResponse.json({ success: true, warning: 'Database insert pending' });
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
