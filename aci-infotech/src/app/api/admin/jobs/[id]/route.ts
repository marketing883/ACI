import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { checkRateLimit } from '@/lib/rate-limit';
import { logAuditEvent, computeChanges } from '@/lib/audit-log';
import { formatJobLocation } from '@/lib/jobs-location';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

function getSupabase() {
  return createClient(supabaseUrl, supabaseServiceKey);
}

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET - Get single job
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const supabase = getSupabase();

    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    return NextResponse.json({ job: data });
  } catch (error) {
    console.error('Error in GET /api/admin/jobs/[id]:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT - Update job
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    // Rate limiting
    const rateLimited = await checkRateLimit(request, 'standard');
    if (rateLimited) return rateLimited;

    const { id } = await params;
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
      // `location` is intentionally not destructured — we recompute
      // it from the structured fields below so the denormalized
      // column always matches city/state/country.
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

    // Get current job to check status change
    const { data: currentJob } = await supabase
      .from('jobs')
      .select('status, published_at')
      .eq('id', id)
      .single();

    const updateData: Record<string, unknown> = {
      title,
      department,
      description,
      responsibilities: responsibilities || [],
      requirements: requirements || [],
      nice_to_have: nice_to_have || [],
      city: city?.trim() || null,
      state_region: state_region?.trim() || null,
      country: country?.trim() || null,
      location,
      location_type,
      employment_type,
      salary_min: salary_min || null,
      salary_max: salary_max || null,
      salary_currency: salary_currency || 'USD',
      show_salary: show_salary || false,
      experience_level,
      skills: skills || [],
      benefits: benefits || [],
      meta_title: meta_title || title,
      meta_description: meta_description || description?.substring(0, 160),
      status,
      closes_at: closes_at || null,
    };

    // Set published_at if status changed to published
    if (status === 'published' && currentJob?.status !== 'published') {
      updateData.published_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from('jobs')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating job:', error);
      return NextResponse.json({ error: 'Failed to update job' }, { status: 500 });
    }

    // Audit log the update
    logAuditEvent({
      action: 'update',
      resource_type: 'job',
      resource_id: id,
      resource_title: data.title,
      changes: computeChanges(currentJob, data),
    }, request);

    return NextResponse.json({ job: data });
  } catch (error) {
    console.error('Error in PUT /api/admin/jobs/[id]:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE - Delete job
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    // Rate limiting
    const rateLimited = await checkRateLimit(request, 'standard');
    if (rateLimited) return rateLimited;

    const { id } = await params;
    const supabase = getSupabase();

    // Get job details before deletion for audit log
    const { data: jobToDelete } = await supabase
      .from('jobs')
      .select('title')
      .eq('id', id)
      .single();

    const { error } = await supabase
      .from('jobs')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting job:', error);
      return NextResponse.json({ error: 'Failed to delete job' }, { status: 500 });
    }

    // Audit log the deletion
    logAuditEvent({
      action: 'delete',
      resource_type: 'job',
      resource_id: id,
      resource_title: jobToDelete?.title,
    }, request);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in DELETE /api/admin/jobs/[id]:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
