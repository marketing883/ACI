import { NextRequest } from 'next/server';
import { exportStub } from '../_stub';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  return exportStub(request);
}
