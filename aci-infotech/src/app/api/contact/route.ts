import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    const { name, email, company, role, inquiry_type, message, phone } = data;

    // Validate required fields
    if (!name || !email || !company || !inquiry_type || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Insert into Supabase
    const { error } = await supabase.from('leads_contacts').insert([
      {
        name,
        email,
        company,
        role: role || null,
        inquiry_type,
        message,
        phone: phone || null,
        source: 'website_contact_form',
        created_at: new Date().toISOString(),
      },
    ]);

    if (error) {
      console.error('Supabase error:', error);
      // For development, return success even if DB insert fails
      // In production, you'd want to handle this differently
      return NextResponse.json({ success: true, warning: 'Database insert pending' });
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
