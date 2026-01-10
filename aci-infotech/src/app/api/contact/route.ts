import { NextRequest, NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { generateIntelligence } from '@/lib/intelligence';

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

    // If Supabase not configured, return success for development
    if (!isSupabaseConfigured()) {
      console.log('Contact form submitted (no database):', { name, email, reason });
      return NextResponse.json({ success: true, warning: 'Database not configured' });
    }

    // Insert into Supabase
    const { data: contact, error } = await supabase
      .from('contacts')
      .insert([
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
      ])
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to submit form' },
        { status: 500 }
      );
    }

    // Generate and store AI intelligence in background (don't block response)
    if (contact?.id) {
      generateIntelligence({
        name,
        email,
        company,
        phone,
        inquiry_type: reason,
        message,
        service_interest: reason,
      }).then(async (intelligence) => {
        try {
          await supabase
            .from('contacts')
            .update({ intelligence })
            .eq('id', contact.id);
          console.log('Intelligence generated for contact:', contact.id);
        } catch (e) {
          console.error('Failed to save intelligence:', e);
        }
      }).catch((e) => {
        console.error('Intelligence generation failed:', e);
      });
    }

    return NextResponse.json({ success: true, id: contact?.id });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
