import { NextRequest, NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

interface ConversationMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
}

interface LeadInfo {
  name?: string;
  email?: string;
  company?: string;
  phone?: string;
  jobTitle?: string;
  location?: string;
  serviceInterest?: string;
  requirements?: string;
  preferredTime?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, leadInfo, conversation, entryPage, pagesVisited } = body as {
      sessionId: string;
      leadInfo: LeadInfo;
      conversation: ConversationMessage[];
      entryPage?: string;
      pagesVisited?: string[];
    };

    // Validate required fields
    if (!leadInfo.email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // If Supabase is not configured, just return success (for development)
    if (!isSupabaseConfigured()) {
      console.log('Chat lead captured (no database):', {
        sessionId,
        leadInfo,
        messageCount: conversation.length,
      });
      return NextResponse.json({ success: true, id: sessionId });
    }

    // Extract requirements from conversation
    const userMessages = conversation
      .filter(m => m.role === 'user')
      .map(m => m.content)
      .join('\n');

    // Calculate lead score based on info completeness and engagement
    let leadScore = 0;
    if (leadInfo.name) leadScore += 15;
    if (leadInfo.email) leadScore += 20;
    if (leadInfo.company) leadScore += 15;
    if (leadInfo.phone) leadScore += 5;
    if (leadInfo.jobTitle) leadScore += 10;
    if (leadInfo.location) leadScore += 5;
    if (leadInfo.serviceInterest) leadScore += 15;
    if (leadInfo.preferredTime) leadScore += 10; // Shows high intent
    if (conversation.length > 4) leadScore += 5;
    // Engagement bonus for multi-page visits
    if (pagesVisited && pagesVisited.length > 2) leadScore += Math.min(pagesVisited.length, 5);

    // Save to chat_leads table
    const { data: chatLead, error: chatError } = await supabase
      .from('chat_leads')
      .insert({
        session_id: sessionId,
        name: leadInfo.name || null,
        email: leadInfo.email,
        company: leadInfo.company || null,
        phone: leadInfo.phone || null,
        job_title: leadInfo.jobTitle || null,
        location: leadInfo.location || null,
        service_interest: leadInfo.serviceInterest || null,
        requirements: userMessages || null,
        preferred_time: leadInfo.preferredTime || null,
        conversation: conversation,
        entry_page: entryPage || null,
        pages_visited: pagesVisited || [],
        lead_score: leadScore,
        status: 'new',
        source: 'chat_widget',
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (chatError) {
      // If table doesn't exist, try to save to contacts table as fallback
      if (chatError.code === '42P01') {
        const { data: contact, error: contactError } = await supabase
          .from('contacts')
          .insert({
            name: leadInfo.name || 'Chat Lead',
            email: leadInfo.email,
            company: leadInfo.company || null,
            phone: leadInfo.phone || null,
            inquiry_type: leadInfo.serviceInterest || 'General Inquiry',
            message: `[Chat Lead]\n\nService Interest: ${leadInfo.serviceInterest || 'Not specified'}\nJob Title: ${leadInfo.jobTitle || 'Not specified'}\nLocation: ${leadInfo.location || 'Not specified'}\nPreferred Time: ${leadInfo.preferredTime || 'Not specified'}\nEntry Page: ${entryPage || 'Not tracked'}\nPages Visited: ${pagesVisited?.join(', ') || 'Not tracked'}\n\nConversation Summary:\n${userMessages}`,
            source: 'chat_widget',
          })
          .select()
          .single();

        if (contactError) {
          console.error('Error saving to contacts:', contactError);
          return NextResponse.json(
            { error: 'Failed to save lead' },
            { status: 500 }
          );
        }

        return NextResponse.json({ success: true, id: contact?.id });
      }

      console.error('Error saving chat lead:', chatError);
      return NextResponse.json(
        { error: 'Failed to save lead' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      id: chatLead?.id,
      leadScore,
    });

  } catch (error) {
    console.error('Chat lead API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
