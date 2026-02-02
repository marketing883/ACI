import { createClient } from '@supabase/supabase-js';
import { NextRequest } from 'next/server';

// Supabase client for audit logging
function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    return null;
  }

  return createClient(url, serviceKey);
}

export type AuditAction = 'create' | 'update' | 'delete' | 'login' | 'logout' | 'upload';

export type ResourceType =
  | 'blog'
  | 'case_study'
  | 'job'
  | 'job_application'
  | 'whitepaper'
  | 'playbook'
  | 'webinar'
  | 'news'
  | 'file'
  | 'user'
  | 'settings';

interface AuditLogEntry {
  user_id?: string;
  user_email?: string;
  action: AuditAction;
  resource_type: ResourceType;
  resource_id?: string;
  resource_title?: string;
  changes?: Record<string, unknown>;
  ip_address?: string;
  user_agent?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Get client IP from request
 */
function getClientIp(request: NextRequest): string {
  const forwardedFor = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const cfConnectingIp = request.headers.get('cf-connecting-ip');

  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }

  return realIp || cfConnectingIp || 'unknown';
}

/**
 * Log an admin action for audit trail
 * Fails silently if audit logging is not configured
 */
export async function logAuditEvent(
  entry: AuditLogEntry,
  request?: NextRequest
): Promise<void> {
  try {
    const supabase = getSupabase();

    if (!supabase) {
      // Audit logging not configured, fail silently
      return;
    }

    const logEntry = {
      ...entry,
      ip_address: request ? getClientIp(request) : entry.ip_address,
      user_agent: request
        ? request.headers.get('user-agent') || undefined
        : entry.user_agent,
      created_at: new Date().toISOString(),
    };

    const { error } = await supabase.from('admin_audit_log').insert(logEntry);

    if (error) {
      console.error('Failed to write audit log:', error);
    }
  } catch (error) {
    // Fail silently - audit logging should never break the main operation
    console.error('Audit logging error:', error);
  }
}

/**
 * Helper to compute changes between old and new data
 */
export function computeChanges(
  oldData: Record<string, unknown> | null,
  newData: Record<string, unknown>
): Record<string, unknown> | undefined {
  if (!oldData) {
    return undefined;
  }

  const changes: Record<string, { old: unknown; new: unknown }> = {};

  for (const key of Object.keys(newData)) {
    if (JSON.stringify(oldData[key]) !== JSON.stringify(newData[key])) {
      changes[key] = {
        old: oldData[key],
        new: newData[key],
      };
    }
  }

  return Object.keys(changes).length > 0 ? changes : undefined;
}

/**
 * Cleanup old audit logs (call this from a scheduled job or manually)
 * Keeps only the last N days of logs
 */
export async function cleanupAuditLogs(retentionDays: number = 90): Promise<{
  success: boolean;
  deletedCount?: number;
  error?: string;
}> {
  try {
    const supabase = getSupabase();

    if (!supabase) {
      return { success: false, error: 'Supabase not configured' };
    }

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - retentionDays);

    // First count how many will be deleted
    const { count } = await supabase
      .from('admin_audit_log')
      .select('*', { count: 'exact', head: true })
      .lt('created_at', cutoffDate.toISOString());

    // Delete old records
    const { error } = await supabase
      .from('admin_audit_log')
      .delete()
      .lt('created_at', cutoffDate.toISOString());

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, deletedCount: count || 0 };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
