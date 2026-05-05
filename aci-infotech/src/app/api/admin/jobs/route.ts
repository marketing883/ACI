import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { formatJobLocation } from '@/lib/jobs-location';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

function getSupabase() {
  return createClient(supabaseUrl, supabaseServiceKey);
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

// GET - List all jobs
export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabase();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const department = searchParams.get('department');

    let query = supabase
      .from('jobs')
      .select('*')
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    if (department) {
      query = query.eq('department', department);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching jobs:', error);
      return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 });
    }

    return NextResponse.json({ jobs: data });
  } catch (error) {
    console.error('Error in GET /api/admin/jobs:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Create new job
export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabase();
    const body = await request.json();

    const {
      title,
      department,
      description,
      responsibilities,
      requirements,
      nice_to_have,
      city,
      state_region,
      country,
      // `location` is intentionally not destructured from the body —
      // we recompute it from the structured fields below so the
      // denormalized column always matches city/state/country.
      location_type,
      employment_type,
      salary_min,
      salary_max,
      salary_currency,
      show_salary,
      experience_level,
      skills,
      benefits,
      meta_title,
      meta_description,
      status,
      closes_at,
    } = body;

    const location = formatJobLocation({ city, state_region, country });

    // Generate slug from title
    let slug = generateSlug(title);

    // Check if slug exists and make unique if needed
    const { data: existing } = await supabase
      .from('jobs')
      .select('slug')
      .like('slug', `${slug}%`);

    if (existing && existing.length > 0) {
      slug = `${slug}-${existing.length + 1}`;
    }

    const jobData = {
      title,
      slug,
      department,
      description,
      responsibilities: responsibilities || [],
      requirements: requirements || [],
      nice_to_have: nice_to_have || [],
      city: city?.trim() || null,
      state_region: state_region?.trim() || null,
      country: country?.trim() || null,
      location,
      location_type: location_type || 'hybrid',
      employment_type: employment_type || 'full-time',
      salary_min: salary_min || null,
      salary_max: salary_max || null,
      salary_currency: salary_currency || 'USD',
      show_salary: show_salary || false,
      experience_level: experience_level || 'mid',
      skills: skills || [],
      benefits: benefits || [],
      meta_title: meta_title || title,
      meta_description: meta_description || description?.substring(0, 160),
      status: status || 'draft',
      published_at: status === 'published' ? new Date().toISOString() : null,
      closes_at: closes_at || null,
    };

    const { data, error } = await supabase
      .from('jobs')
      .insert([jobData])
      .select()
      .single();

    if (error) {
      console.error('Error creating job:', error);
      return NextResponse.json({ error: 'Failed to create job' }, { status: 500 });
    }

    return NextResponse.json({ job: data }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/admin/jobs:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
