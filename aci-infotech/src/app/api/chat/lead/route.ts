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
  serviceInterest?: string;
  requirements?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, leadInfo, conversation } = body as {
      sessionId: string;
      leadInfo: LeadInfo;
      conversation: ConversationMessage[];
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

    // Calculate lead score based on info completeness
    let leadScore = 0;
    if (leadInfo.name) leadScore += 15;
    if (leadInfo.email) leadScore += 20;
    if (leadInfo.company) leadScore += 20;
    if (leadInfo.phone) leadScore += 10;
    if (leadInfo.serviceInterest) leadScore += 20;
    if (conversation.length > 4) leadScore += 15;

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
        service_interest: leadInfo.serviceInterest || null,
        requirements: userMessages || null,
        conversation: conversation,
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
            message: `[Chat Lead]\n\nService Interest: ${leadInfo.serviceInterest || 'Not specified'}\n\nConversation Summary:\n${userMessages}`,
            source: 'chat_widget',
            status: 'new',
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
