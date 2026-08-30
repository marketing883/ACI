import { NextRequest, NextResponse } from 'next/server';
import { verifyTapResumeRequest } from '@/lib/tapresume';

/**
 * Phase-2 export routes (contract 2.2): historical import only, NOT called
 * in phase 1, schemas pending an addendum. The contract asks for the route
 * family to exist behind the same signature verification, answering 503
 * until the addendum lands - and to be disabled again permanently after
 * signed migration completion.
 *
 * These will eventually export application data. That makes the
 * signature gate non-optional even as a stub: nothing about these paths
 * may be reachable unauthenticated, today or later.
 */
export async function exportStub(request: NextRequest): Promise<NextResponse> {
  const auth = verifyTapResumeRequest(request, '');
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

  return NextResponse.json(
    { error: 'export routes are not enabled; phase-2 addendum pending' },
    { status: 503 },
  );
}
