import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// GET - List published jobs (public)
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const { searchParams } = new URL(request.url);
    const department = searchParams.get('department');
    const location_type = searchParams.get('location_type');
    const experience_level = searchParams.get('experience_level');

    let query = supabase
      .from('jobs')
      .select('id, title, slug, department, location, location_type, employment_type, experience_level, skills, salary_min, salary_max, show_salary, salary_currency, published_at, closes_at')
      .eq('status', 'published')
      .order('published_at', { ascending: false });

    if (department) {
      query = query.eq('department', department);
    }

    if (location_type) {
      query = query.eq('location_type', location_type);
    }

    if (experience_level) {
      query = query.eq('experience_level', experience_level);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching jobs:', error);
      return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 });
    }

    // Filter out closed jobs
    const now = new Date();
    const activeJobs = data?.filter(job => {
      if (!job.closes_at) return true;
      return new Date(job.closes_at) > now;
    });

    return NextResponse.json({ jobs: activeJobs });
  } catch (error) {
    console.error('Error in GET /api/jobs:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
