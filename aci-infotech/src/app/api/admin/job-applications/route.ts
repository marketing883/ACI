import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

function getSupabase() {
  return createClient(supabaseUrl, supabaseServiceKey);
}

// GET - List all job applications
export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabase();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const jobId = searchParams.get('job_id');

    // Page through. PostgREST caps a single response at 1000 rows, so this
    // used to return exactly 1000 and the dashboard reported that as the
    // total: a truncated list that looked complete.
    const PAGE_SIZE = 1000;
    const applications: unknown[] = [];

    for (let from = 0; ; from += PAGE_SIZE) {
      let query = supabase
        .from('job_applications')
        .select(`
          *,
          jobs:job_id (
            id,
            title,
            department,
            location
          )
        `)
        .order('created_at', { ascending: false })
        .range(from, from + PAGE_SIZE - 1);

      if (status) {
        query = query.eq('status', status);
      }

      if (jobId) {
        query = query.eq('job_id', jobId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching applications:', error);
        return NextResponse.json({ error: 'Failed to fetch applications' }, { status: 500 });
      }

      const page = data ?? [];
      applications.push(...page);
      if (page.length < PAGE_SIZE) break;
    }

    return NextResponse.json({ applications });
  } catch (error) {
    console.error('Error in GET /api/admin/job-applications:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
