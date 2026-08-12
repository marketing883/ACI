import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Diagnostics for the admin data layer. Every lead page reads through a
// service-role client, so when SUPABASE_SERVICE_ROLE_KEY is wrong the
// pages go empty or show a raw upstream error and there is no way to tell
// a broken key from an empty pipeline. This reports which project the
// running server is pointed at, what its service key claims to be, and
// whether each lead table actually reads.
//
// Auth: lives under /api/admin/*, so src/middleware.ts gates it. Do not
// add it to PUBLIC_READ_ADMIN_PATHS in src/lib/auth/roles.ts.
//
// It never returns key material - only the `ref` and `role` claims, which
// identify the project and the privilege level without being a credential.

export const dynamic = 'force-dynamic';

// Leads and CMS content both go through the service-role client, so a
// broken key takes out lead capture and publishing together. Check both
// here: "I cannot post blogs" and "leads are not showing" are usually the
// same fault, and this is the one request that proves it.
const CHECKED_TABLES = [
  // Leads
  'contacts',
  'chat_leads',
  'event_leads',
  'lp_leads',
  'playbook_leads',
  'whitepaper_leads',
  'newsletter_subscribers',
  'job_applications',
  // CMS content
  'blog_posts',
  'case_studies',
  'whitepapers',
];

interface KeyInfo {
  present: boolean;
  format: 'jwt' | 'publishable' | 'secret' | 'unknown' | 'absent';
  ref?: string;
  role?: string;
  expired?: boolean;
}

// Reads the public claims out of a Supabase key. Legacy keys are
// unsigned-readable JWTs; the newer sb_publishable_/sb_secret_ keys are
// opaque, so all we can report is the format.
function inspectKey(key: string | undefined): KeyInfo {
  if (!key) return { present: false, format: 'absent' };
  if (key.startsWith('sb_publishable_')) return { present: true, format: 'publishable' };
  if (key.startsWith('sb_secret_')) return { present: true, format: 'secret' };

  const parts = key.split('.');
  if (parts.length !== 3) return { present: true, format: 'unknown' };

  try {
    const claims = JSON.parse(Buffer.from(parts[1], 'base64').toString()) as {
      ref?: string;
      role?: string;
      exp?: number;
    };
    return {
      present: true,
      format: 'jwt',
      ref: claims.ref,
      role: claims.role,
      expired: typeof claims.exp === 'number' ? claims.exp * 1000 < Date.now() : undefined,
    };
  } catch {
    return { present: true, format: 'unknown' };
  }
}

function projectRefFromUrl(url: string | undefined): string | null {
  if (!url) return null;
  const match = url.match(/^https:\/\/([a-z0-9]+)\.supabase\./);
  return match ? match[1] : null;
}

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const urlRef = projectRefFromUrl(url);
  const service = inspectKey(serviceKey);
  const anon = inspectKey(anonKey);

  const problems: string[] = [];
  if (!url) problems.push('NEXT_PUBLIC_SUPABASE_URL is not set.');
  if (!serviceKey) {
    problems.push(
      'SUPABASE_SERVICE_ROLE_KEY is not set. Admin lead pages fall back to demo rows.',
    );
  }
  if (service.format === 'jwt' && service.role && service.role !== 'service_role') {
    problems.push(
      `SUPABASE_SERVICE_ROLE_KEY carries role "${service.role}", not "service_role". ` +
        'Row Level Security will hide lead rows from every admin page.',
    );
  }
  if (service.expired) problems.push('SUPABASE_SERVICE_ROLE_KEY has expired.');
  if (service.ref && urlRef && service.ref !== urlRef) {
    problems.push(
      `SUPABASE_SERVICE_ROLE_KEY belongs to project "${service.ref}" but ` +
        `NEXT_PUBLIC_SUPABASE_URL points at "${urlRef}". They must match.`,
    );
  }
  if (anon.ref && urlRef && anon.ref !== urlRef) {
    problems.push(
      `NEXT_PUBLIC_SUPABASE_ANON_KEY belongs to project "${anon.ref}" but ` +
        `NEXT_PUBLIC_SUPABASE_URL points at "${urlRef}".`,
    );
  }

  const tables: Record<string, { ok: boolean; count?: number; error?: string; code?: string }> = {};

  if (url && serviceKey) {
    const supabase = createClient(url, serviceKey);
    await Promise.all(
      CHECKED_TABLES.map(async (table) => {
        const { count, error } = await supabase
          .from(table)
          .select('*', { count: 'exact', head: true });
        if (error) {
          tables[table] = { ok: false, error: error.message, code: error.code };
        } else {
          tables[table] = { ok: true, count: count ?? 0 };
        }
      }),
    );

    for (const [table, result] of Object.entries(tables)) {
      if (!result.ok) problems.push(`Cannot read ${table}: ${result.error}`);
    }
  }

  return NextResponse.json({
    healthy: problems.length === 0,
    project: { url: url ?? null, ref: urlRef },
    serviceRoleKey: service,
    anonKey: anon,
    tables,
    problems,
  });
}
