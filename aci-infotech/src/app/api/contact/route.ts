import { NextRequest, NextResponse } from 'next/server';
import { getServerClient, isSupabaseConfigured } from '@/lib/supabase';
import { generateIntelligence } from '@/lib/intelligence';
import { isWorkEmail, validateEmail } from '@/lib/email-validation';
import { detectBot, checkHoneypot } from '@/lib/bot-detection';
import { checkRateLimit } from '@/lib/rate-limit';
import { parseContactIntent, intentServiceInterest, humanizeTopic } from '@/lib/contact-intent';
import { readLeadContext } from '@/lib/copilot/session';

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

    // Service-role client so the insert and the follow-up intelligence
    // update bypass RLS. With the anon client, an RLS-enabled contacts
    // table silently drops the write, and the lead never lands.
    const supabase = getServerClient();

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

    // Structured intent from the CTA that brought the visitor here.
    // Re-validated server-side through the same closed vocabulary the
    // client used, so nothing unvalidated reaches the database.
    const intent = parseContactIntent(
      (data.intent && typeof data.intent === 'object' ? data.intent : {}) as Record<string, string>,
    );
    const hasIntent = Object.keys(intent).length > 0;

    // The visitor's own Atheros chat session id, if the form offered a
    // prefill. Lets us join the two lead channels on one contact row.
    const atherosSessionId =
      typeof data.atheros_session_id === 'string' &&
      /^[a-zA-Z0-9_-]{8,64}$/.test(data.atheros_session_id)
        ? data.atheros_session_id
        : null;

    // The smart-form answers: job title plus the structured project
    // questions. Length-capped, and focus areas are bounded plain
    // strings, so nothing free-form leaks into the qualification data.
    const jobTitle =
      typeof data.job_title === 'string' && data.job_title.trim()
        ? data.job_title.trim().slice(0, 120)
        : null;
    const VALID_STAGES = new Set(['exploring', 'scoping', 'live-project', 'urgent']);
    const stage =
      typeof data.stage === 'string' && VALID_STAGES.has(data.stage) ? data.stage : null;
    const focusAreas = Array.isArray(data.focus_areas)
      ? data.focus_areas
          .filter((f: unknown): f is string => typeof f === 'string' && f.length > 0 && f.length <= 60)
          .slice(0, 8)
      : [];

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
    const spamScore = botCheck.score;
    const spamFlags = botCheck.flags;

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

    // Merge the Atheros chat channel: if the visitor chatted before
    // filling the form, pull what the chat already captured so the two
    // lead channels land on one contact row instead of two silos.
    let chatContext: Record<string, string | number> | null = null;
    if (atherosSessionId) {
      try {
        const { state, score } = await readLeadContext(atherosSessionId);
        const chat: Record<string, string | number> = {};
        if (state.jobTitle) chat.job_title = state.jobTitle;
        if (state.industry) chat.industry = state.industry;
        if (state.role) chat.role = state.role;
        if (state.serviceInterest) chat.service_interest = state.serviceInterest;
        if (state.painPoint) chat.pain_point = state.painPoint;
        if (state.budget) chat.budget = state.budget;
        if (state.timeline) chat.timeline = state.timeline;
        if (state.team) chat.team = state.team;
        if (state.priority) chat.priority = state.priority;
        if (state.decisionRole) chat.decision_role = state.decisionRole;
        if (state.intent) chat.intent_level = state.intent;
        if (typeof score === 'number') chat.lead_score = score;
        if (Object.keys(chat).length) chatContext = chat;
      } catch (e) {
        console.error('Chat context merge failed:', e);
      }
    }

    // service_interest: the resolved intent label (client sends it too,
    // but we recompute server-side), falling back to what the chat knew.
    const serviceInterest =
      intentServiceInterest(intent) ||
      (typeof chatContext?.service_interest === 'string' ? chatContext.service_interest : null);

    // The smart-form answers travel with the row as one qualification
    // object next to intent and chat context.
    const qualification =
      jobTitle || stage || focusAreas.length
        ? {
            ...(jobTitle ? { job_title: jobTitle } : {}),
            ...(stage ? { stage } : {}),
            ...(focusAreas.length ? { focus_areas: focusAreas } : {}),
          }
        : null;

    const metadataValue =
      hasIntent || atherosSessionId || chatContext || qualification
        ? {
            ...(hasIntent ? { intent } : {}),
            ...(atherosSessionId ? { atheros_session_id: atherosSessionId } : {}),
            ...(chatContext ? { chat_context: chatContext } : {}),
            ...(qualification ? { qualification } : {}),
          }
        : null;

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
          service_interest: serviceInterest,
          source: source || 'website_contact_form',
          status: submissionStatus,
          spam_score: spamScore,
          spam_flags: spamFlags.length > 0 ? spamFlags : null,
          attribution: attributionValue,
          ...(metadataValue ? { metadata: metadataValue } : {}),
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
        error.message?.includes('attribution') ||
        error.message?.includes('service_interest') ||
        error.message?.includes('metadata')
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
      // Give the analyst everything both channels know: which page/CTA
      // the visitor converted from, and what the chat already captured.
      const requirementsParts: string[] = [];
      if (hasIntent) {
        const intentBits: string[] = [];
        if (intent.service) intentBits.push(`service page: ${humanizeTopic(intent.service)}`);
        if (intent.platform) intentBits.push(`platform page: ${humanizeTopic(intent.platform)}`);
        if (intent.industry) intentBits.push(`industry page: ${humanizeTopic(intent.industry)}`);
        if (intent.topic) intentBits.push(`section topic: ${humanizeTopic(intent.topic)}`);
        if (intent.playbook) intentBits.push(`playbook: ${humanizeTopic(intent.playbook)}`);
        if (intent.source) intentBits.push(`CTA position: ${intent.source}`);
        if (intent.reason) intentBits.push(`reason: ${intent.reason}`);
        requirementsParts.push(`Converted via ${intentBits.join(', ')}.`);
      }
      if (stage || focusAreas.length) {
        const stageLabels: Record<string, string> = {
          exploring: 'just exploring',
          scoping: 'scoping, wants an estimate',
          'live-project': 'live project needs help',
          urgent: 'something is broken right now',
        };
        const qualBits: string[] = [];
        if (stage) qualBits.push(`stage: ${stageLabels[stage] ?? stage}`);
        if (focusAreas.length) qualBits.push(`focus areas: ${focusAreas.join(', ')}`);
        requirementsParts.push(`From the form's project questions, ${qualBits.join('; ')}.`);
      }
      if (chatContext) {
        const chatBits = Object.entries(chatContext)
          .filter(([k]) => k !== 'lead_score')
          .map(([k, v]) => `${k.replace(/_/g, ' ')}: ${v}`);
        if (chatBits.length) {
          requirementsParts.push(`From their Atheros chat session: ${chatBits.join('; ')}.`);
        }
      }

      generateIntelligence({
        name,
        email,
        company,
        phone,
        job_title:
          jobTitle ??
          (typeof chatContext?.job_title === 'string' ? chatContext.job_title : null),
        inquiry_type: inquiryType,
        message,
        service_interest: serviceInterest || inquiryType,
        requirements: requirementsParts.length ? requirementsParts.join(' ') : undefined,
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
