/**
 * Outcome Copy admin CRUD.
 *
 *   GET    /api/admin/copilot/outcome-copy           -> list all rows
 *   POST   /api/admin/copilot/outcome-copy           -> create
 *   PATCH  /api/admin/copilot/outcome-copy?id=<uuid> -> update
 *   DELETE /api/admin/copilot/outcome-copy?id=<uuid> -> delete
 *
 * Save is voice-rule linted via lintOutcomeCopy(). Any issue blocks
 * the write so admin-edited copy can never violate the brand rules.
 */

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';
import { getUser } from '@/lib/supabase-server';
import { log } from '@/lib/copilot/logger';
import {
  invalidateOutcomeOverrideCache,
  lintOutcomeCopy,
} from '@/lib/copilot/outcomeCopyResolver';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const SURFACE = z.enum([
  'idle',
  'peek.proactive',
  'peek.narration',
  'panel.primary_oc',
  'chip',
  'welcome',
]);

const writeSchema = z.object({
  route_pattern: z.string().trim().min(1).max(200),
  surface: SURFACE,
  variant_key: z
    .string()
    .trim()
    .max(40)
    .nullable()
    .optional()
    .transform((v) => (v && v.length > 0 ? v : null)),
  text: z.string().trim().min(1).max(280),
  is_active: z.boolean().optional().default(true),
  notes: z.string().trim().max(500).optional().nullable(),
});

function serviceRoleClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

async function requireAdmin() {
  const user = await getUser();
  if (!user) return null;
  return user;
}

export async function GET() {
  const user = await requireAdmin();
  if (!user) return NextResponse.json({ ok: false, reason: 'unauthorized' }, { status: 401 });
  const supabase = serviceRoleClient();
  if (!supabase) return NextResponse.json({ ok: false, reason: 'no-service-role' }, { status: 500 });
  const { data, error } = await supabase
    .from('outcome_copy_overrides')
    .select('*')
    .order('updated_at', { ascending: false });
  if (error) {
    log.warn('init', error, { route: '/api/admin/copilot/outcome-copy/GET' });
    return NextResponse.json({ ok: false, reason: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true, rows: data ?? [] });
}

export async function POST(request: Request) {
  const user = await requireAdmin();
  if (!user) return NextResponse.json({ ok: false, reason: 'unauthorized' }, { status: 401 });
  const supabase = serviceRoleClient();
  if (!supabase) return NextResponse.json({ ok: false, reason: 'no-service-role' }, { status: 500 });

  let body: z.infer<typeof writeSchema>;
  try {
    const raw = (await request.json()) as unknown;
    body = writeSchema.parse(raw);
  } catch (err) {
    return NextResponse.json(
      { ok: false, reason: 'bad-request', detail: (err as Error).message },
      { status: 400 },
    );
  }

  const issues = lintOutcomeCopy(body.text);
  if (issues.length > 0) {
    return NextResponse.json({ ok: false, reason: 'voice-lint', issues }, { status: 422 });
  }

  const { data, error } = await supabase
    .from('outcome_copy_overrides')
    .insert({
      route_pattern: body.route_pattern,
      surface: body.surface,
      variant_key: body.variant_key,
      text: body.text,
      is_active: body.is_active,
      notes: body.notes ?? null,
      updated_by: user.id,
    })
    .select()
    .single();
  if (error) {
    log.warn('init', error, { route: '/api/admin/copilot/outcome-copy/POST' });
    return NextResponse.json({ ok: false, reason: error.message }, { status: 500 });
  }
  invalidateOutcomeOverrideCache();
  return NextResponse.json({ ok: true, row: data });
}

export async function PATCH(request: Request) {
  const user = await requireAdmin();
  if (!user) return NextResponse.json({ ok: false, reason: 'unauthorized' }, { status: 401 });
  const id = new URL(request.url).searchParams.get('id');
  if (!id) return NextResponse.json({ ok: false, reason: 'missing-id' }, { status: 400 });
  const supabase = serviceRoleClient();
  if (!supabase) return NextResponse.json({ ok: false, reason: 'no-service-role' }, { status: 500 });

  let body: Partial<z.infer<typeof writeSchema>>;
  try {
    body = (await request.json()) as Partial<z.infer<typeof writeSchema>>;
  } catch {
    return NextResponse.json({ ok: false, reason: 'bad-request' }, { status: 400 });
  }

  if (typeof body.text === 'string') {
    const issues = lintOutcomeCopy(body.text);
    if (issues.length > 0) {
      return NextResponse.json({ ok: false, reason: 'voice-lint', issues }, { status: 422 });
    }
  }

  const { data, error } = await supabase
    .from('outcome_copy_overrides')
    .update({ ...body, updated_by: user.id })
    .eq('id', id)
    .select()
    .single();
  if (error) {
    log.warn('init', error, { route: '/api/admin/copilot/outcome-copy/PATCH' });
    return NextResponse.json({ ok: false, reason: error.message }, { status: 500 });
  }
  invalidateOutcomeOverrideCache();
  return NextResponse.json({ ok: true, row: data });
}

export async function DELETE(request: Request) {
  const user = await requireAdmin();
  if (!user) return NextResponse.json({ ok: false, reason: 'unauthorized' }, { status: 401 });
  const id = new URL(request.url).searchParams.get('id');
  if (!id) return NextResponse.json({ ok: false, reason: 'missing-id' }, { status: 400 });
  const supabase = serviceRoleClient();
  if (!supabase) return NextResponse.json({ ok: false, reason: 'no-service-role' }, { status: 500 });
  const { error } = await supabase.from('outcome_copy_overrides').delete().eq('id', id);
  if (error) {
    log.warn('init', error, { route: '/api/admin/copilot/outcome-copy/DELETE' });
    return NextResponse.json({ ok: false, reason: error.message }, { status: 500 });
  }
  invalidateOutcomeOverrideCache();
  return NextResponse.json({ ok: true });
}
