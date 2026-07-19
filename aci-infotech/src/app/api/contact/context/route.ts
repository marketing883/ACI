import { NextRequest, NextResponse } from 'next/server';
import { readLeadContext } from '@/lib/copilot/session';
import { checkRateLimit } from '@/lib/rate-limit';

/**
 * Contact-page context lookup: given the visitor's own Atheros session
 * id (held in their localStorage), return the fields the chat already
 * captured so the form can offer to prefill instead of re-asking.
 *
 * Scope is deliberately narrow: only fields the visitor themselves
 * typed into the chat, keyed by an unguessable session id, and no
 * scoring or internal fields ever leave the server.
 */
export async function POST(request: NextRequest) {
  const rateLimited = await checkRateLimit(request, 'contact');
  if (rateLimited) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  let sessionId: unknown;
  try {
    const body = await request.json();
    sessionId = body?.sessionId;
  } catch {
    return NextResponse.json({ context: null });
  }

  if (typeof sessionId !== 'string' || !/^[a-zA-Z0-9_-]{8,64}$/.test(sessionId)) {
    return NextResponse.json({ context: null });
  }

  const { state } = await readLeadContext(sessionId);
  const hasAnything =
    state.name || state.email || state.company || state.industry ||
    state.serviceInterest || state.painPoint;
  if (!hasAnything) return NextResponse.json({ context: null });

  return NextResponse.json({
    context: {
      name: state.name ?? null,
      email: state.email ?? null,
      company: state.company ?? null,
      industry: state.industry ?? null,
      serviceInterest: state.serviceInterest ?? null,
      painPoint: state.painPoint ?? null,
    },
  });
}
