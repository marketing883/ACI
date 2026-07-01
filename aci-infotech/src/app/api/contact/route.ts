import { NextRequest, NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { generateIntelligence } from '@/lib/intelligence';
import { isWorkEmail, validateEmail } from '@/lib/email-validation';
import { detectBot, checkHoneypot } from '@/lib/bot-detection';
import { checkRateLimit } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  try {
    // Rate limiting check (5 submissions per hour per IP)
    const rateLimited = await checkRateLimit(request, 'contact');
    if (rateLimited) {
      return NextResponse.json(
        { error: 'Too many submissions. Please try again later.' },
        { status: 429 }
      );
    }

    const data = await request.json();

    const {
      name,
      email,
      company,
      phone,
      inquiry_type,
      reason, // Legacy field name support
      message,
      source,
      // Anti-bot fields
      _honeypot,
      _formLoadTime,
      _submitTime,
    } = data;

    // Support both 'inquiry_type' (new) and 'reason' (legacy)
    const inquiryType = inquiry_type || reason;

    // Check 1: Honeypot field (if filled, it's definitely a bot)
    if (checkHoneypot(_honeypot)) {
      // Return fake success to not alert bots - but don't save
      console.log('Bot detected: honeypot filled', { email });
      return NextResponse.json({ success: true });
    }

    // Validate required fields
    if (!name || !email || !inquiryType || !message) {
      return NextResponse.json(
        { error: 'Please fill in all required fields.' },
        { status: 400 }
      );
    }

    // Check 2: Email validation (format + work email)
    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) {
      return NextResponse.json(
        { error: emailValidation.error },
        { status: 400 }
      );
    }

    // Check 3: Bot detection (gibberish names, speed, etc.)
    const botCheck = detectBot({
      name,
      email,
      company,
      message,
      honeypot: _honeypot,
      formLoadTime: _formLoadTime,
      submitTime: _submitTime,
    });

    // If honeypot was filled (should be caught above, but double-check)
    if (botCheck.action === 'block' && botCheck.flags.includes('honeypot_filled')) {
      console.log('Bot detected: honeypot', { email, flags: botCheck.flags });
      return NextResponse.json({ success: true }); // Fake success
    }

    // Determine status based on bot detection
    let submissionStatus = 'new';
    let spamScore = botCheck.score;
    let spamFlags = botCheck.flags;

    if (botCheck.action === 'block') {
      submissionStatus = 'spam';
      console.log('Spam submission blocked:', { email, score: botCheck.score, flags: botCheck.flags });
    } else if (botCheck.action === 'flag') {
      submissionStatus = 'spam'; // Flag suspicious submissions
      console.log('Suspicious submission flagged:', { email, score: botCheck.score, flags: botCheck.flags });
    }

    // If Supabase not configured, return success for development
    if (!isSupabaseConfigured()) {
      console.log('Contact form submitted (no database):', { name, email, reason, status: submissionStatus });
      return NextResponse.json({ success: true, warning: 'Database not configured' });
    }

    // Collect the first-touch attribution the client attached (utm/gclid/
    // referrer/landing). Stored as one jsonb column; null when empty.
    const attributionKeys = [
      'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content',
      'gclid', 'gbraid', 'wbraid', 'fbclid', 'li_fat_id', 'referrer', 'landing_page',
    ] as const;
    const attribution: Record<string, string> = {};
    for (const k of attributionKeys) {
      if (typeof data[k] === 'string' && data[k]) attribution[k] = data[k];
    }
    const attributionValue = Object.keys(attribution).length ? attribution : null;

    // Insert into Supabase with spam detection data
    const { data: contact, error } = await supabase
      .from('contacts')
      .insert([
        {
          name,
          email,
          company: company || null,
          phone: phone || null,
          inquiry_type: inquiryType,
          message,
          source: source || 'website_contact_form',
          status: submissionStatus,
          spam_score: spamScore,
          spam_flags: spamFlags.length > 0 ? spamFlags : null,
          attribution: attributionValue,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      // If the spam_score/spam_flags/attribution columns don't exist yet,
      // retry without them so the form still works before the migration runs.
      if (
        error.message?.includes('spam_score') ||
        error.message?.includes('spam_flags') ||
        error.message?.includes('attribution')
      ) {
        const { data: contactFallback, error: fallbackError } = await supabase
          .from('contacts')
          .insert([
            {
              name,
              email,
              company: company || null,
              phone: phone || null,
              inquiry_type: inquiryType,
              message,
              source: source || 'website_contact_form',
              status: submissionStatus,
            },
          ])
          .select()
          .single();

        if (fallbackError) {
          return NextResponse.json(
            { error: 'Failed to submit form. Please try again.' },
            { status: 500 }
          );
        }

        return NextResponse.json({ success: true, id: contactFallback?.id });
      }

      return NextResponse.json(
        { error: error.message || 'Failed to submit form', details: error.code },
        { status: 500 }
      );
    }

    // Generate and store AI intelligence in background (only for non-spam)
    if (contact?.id && submissionStatus === 'new') {
      generateIntelligence({
        name,
        email,
        company,
        phone,
        inquiry_type: inquiryType,
        message,
        service_interest: inquiryType,
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
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
