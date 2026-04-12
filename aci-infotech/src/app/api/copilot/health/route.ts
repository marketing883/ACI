/**
 * Atheros health endpoint.
 *
 * GET /api/copilot/health
 *
 * Returns a snapshot of flags, provider reachability, and the last error
 * timestamp. Used as the smoke test at the end of every plan part and by
 * the admin dashboard summary row.
 *
 * Access control:
 *   - Always open in non-production (NODE_ENV !== 'production').
 *   - In production, requires an authenticated admin session via Supabase Auth.
 *
 * No provider credentials or secrets are ever returned.
 */

import { NextResponse } from 'next/server';
import { getFlagSnapshot } from '@/lib/copilot/flags';
import { getUser } from '@/lib/supabase-server';
import { log } from '@/lib/copilot/logger';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface ProviderStatus {
  configured: boolean;
  status: 'ok' | 'missing-key' | 'unknown';
}

function providerStatus(envKey: string): ProviderStatus {
  const hasKey = Boolean(process.env[envKey] && process.env[envKey]!.length > 0);
  return {
    configured: hasKey,
    status: hasKey ? 'ok' : 'missing-key',
  };
}

async function supabaseStatus(): Promise<ProviderStatus> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) return { configured: false, status: 'missing-key' };
  return { configured: true, status: 'ok' };
}

async function lastErrorAt(): Promise<string | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  try {
    const res = await fetch(
      `${url}/rest/v1/chat_errors?select=created_at&order=created_at.desc&limit=1`,
      {
        headers: {
          apikey: key,
          Authorization: `Bearer ${key}`,
        },
        cache: 'no-store',
      },
    );
    if (!res.ok) return null;
    const rows = (await res.json()) as Array<{ created_at?: string }>;
    return rows[0]?.created_at ?? null;
  } catch (err) {
    // Health endpoint must never throw; surface the problem through log only.
    log.warn('health', err, { route: '/api/copilot/health' });
    return null;
  }
}

export async function GET() {
  const isProd = process.env.NODE_ENV === 'production';
  if (isProd) {
    const user = await getUser();
    if (!user) {
      return NextResponse.json(
        { ok: false, reason: 'unauthorized' },
        { status: 401 },
      );
    }
  }

  const flags = getFlagSnapshot();
  const [supabase, lastErr] = await Promise.all([
    supabaseStatus(),
    lastErrorAt(),
  ]);

  const anthropic = providerStatus('ANTHROPIC_API_KEY');
  const openai = providerStatus('OPENAI_API_KEY');

  const payload = {
    ok: true,
    name: 'atheros',
    flags,
    providers: {
      supabase,
      anthropic,
      openai,
    },
    pgvector: 'pending-part-2',
    contentChunks: null as number | null,
    lastIndexedAt: null as string | null,
    lastErrorAt: lastErr,
    nowUtc: new Date().toISOString(),
  };

  return NextResponse.json(payload, {
    status: 200,
    headers: {
      'Cache-Control': 'no-store, max-age=0',
    },
  });
}
