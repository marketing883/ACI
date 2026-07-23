import { NextRequest, NextResponse } from 'next/server';
import { cleanupAuditLogs } from '@/lib/audit-log';

// Secret key to protect the cron endpoint
const CRON_SECRET = process.env.CRON_SECRET;

/**
 * Cleanup old audit logs.
 *
 * Scheduling runs in Supabase via pg_cron (see
 * supabase/migrations/20260723_schedule_audit_log_cleanup.sql, daily,
 * 90-day retention). This endpoint is a manual fallback for ad-hoc runs
 * with a custom retention, e.g. ?days=30 — no external cron service
 * needs to call it.
 *
 * URL: https://yourdomain.com/api/cron/cleanup-audit-logs
 * Header: Authorization: Bearer YOUR_CRON_SECRET
 */
export async function POST(request: NextRequest) {
  try {
    // Verify the request is authorized
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!CRON_SECRET) {
      console.log('CRON_SECRET not configured - skipping auth check');
    } else if (token !== CRON_SECRET) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get retention days from query params (default 90)
    const { searchParams } = new URL(request.url);
    const retentionDays = parseInt(searchParams.get('days') || '90');

    // Run cleanup
    const result = await cleanupAuditLogs(retentionDays);

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: `Cleaned up ${result.deletedCount} audit log entries older than ${retentionDays} days`,
        deletedCount: result.deletedCount,
      });
    } else {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Cron cleanup error:', error);
    return NextResponse.json(
      { error: 'Failed to run cleanup' },
      { status: 500 }
    );
  }
}

// Also support GET for easy testing (with auth)
export async function GET(request: NextRequest) {
  return POST(request);
}
