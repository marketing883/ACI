import { NextRequest, NextResponse } from 'next/server';
import { generateIntelligence, type LeadData } from '@/lib/intelligence';

// On-demand "analyze this lead now" endpoint for the admin dashboard.
// Delegates to the single canonical generateIntelligence() in
// src/lib/intelligence.ts, which is grounded in src/lib/company.ts
// (positioning, 11 practices, ICP, scoring rubric). This route used to
// carry its own drifted copy of the prompt and company facts; that copy
// is gone so the on-demand and background analyses can never disagree.
// Auth is enforced by middleware (every /api/admin/* path is gated).

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { lead } = (await request.json()) as { lead: LeadData };

    if (!lead || (!lead.email && !lead.company)) {
      return NextResponse.json(
        { error: 'Need at least email or company name' },
        { status: 400 },
      );
    }

    if (!process.env.ANTHROPIC_API_KEY && !process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'No AI API configured. Set ANTHROPIC_API_KEY or OPENAI_API_KEY for AI-powered lead intelligence.' },
        { status: 503 },
      );
    }

    const report = await generateIntelligence(lead);
    return NextResponse.json(report);
  } catch (error) {
    console.error('Lead intelligence error:', error);
    return NextResponse.json({ error: 'Failed to generate intelligence' }, { status: 500 });
  }
}
