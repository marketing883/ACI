import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendJobApplicationNotificationEmail } from '@/lib/email';
import { getSiteUrl } from '@/lib/site-url';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
// Canonical origin: always production, so staging builds can never
// self-canonicalize (see src/lib/site-url.ts).
const siteUrl = getSiteUrl();

function getSupabase() {
  return createClient(supabaseUrl, supabaseServiceKey);
}

// Resume URLs are stored as the relative path inside the `resumes` storage
// bucket. RMG India needs a clickable link in their email — so mint a signed
// URL with a 7-day TTL. Long enough for triage, short enough that copies of
// the email forwarded outside the org won't grant indefinite access.
const RESUME_LINK_TTL_SECONDS = 7 * 24 * 60 * 60;

// POST - Submit job application
export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabase();

    // Get form data (for file upload support)
    const formData = await request.formData();

    const job_id = formData.get('job_id') as string;
    const first_name = formData.get('first_name') as string;
    const last_name = formData.get('last_name') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const linkedin_url = formData.get('linkedin_url') as string;
    const portfolio_url = formData.get('portfolio_url') as string;
    const location = formData.get('location') as string;
    const current_company = formData.get('current_company') as string;
    const current_title = formData.get('current_title') as string;
    const years_experience = formData.get('years_experience') as string;
    const work_authorization = formData.get('work_authorization') as string;
    const notice_period = formData.get('notice_period') as string;
    const salary_expectation = formData.get('salary_expectation') as string;
    const heard_from = formData.get('heard_from') as string;
    const cover_letter = formData.get('cover_letter') as string;
    const source = formData.get('source') as string;
    const referral_name = formData.get('referral_name') as string;
    const resume = formData.get('resume') as File | null;

    // Validate required fields
    if (!job_id || !first_name || !last_name || !email || !phone?.trim()) {
      return NextResponse.json(
        { error: 'Missing required fields: job_id, first_name, last_name, email, phone' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    // Verify job exists and is published. `location` comes along so the
    // RMG notification email can stamp the role's geography in the
    // header without a second lookup.
    const { data: job, error: jobError } = await supabase
      .from('jobs')
      .select('id, title, status, closes_at, location, slug, notification_emails, managed_by, application_url')
      .eq('id', job_id)
      .single();

    if (jobError || !job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    // TapResume-managed roles apply on TapResume only (contract section
    // 1: no candidate PII or resumes on this site). The page renders an
    // external link for these, so this is a backstop against direct form
    // POSTs to a managed job.
    if (job.managed_by === 'tapresume') {
      return NextResponse.json(
        {
          error: 'Applications for this role are handled externally',
          ...(job.application_url ? { application_url: job.application_url } : {}),
        },
        { status: 400 },
      );
    }

    if (job.status !== 'published') {
      return NextResponse.json({ error: 'This position is not accepting applications' }, { status: 400 });
    }

    if (job.closes_at && new Date(job.closes_at) < new Date()) {
      return NextResponse.json({ error: 'This position is no longer accepting applications' }, { status: 400 });
    }

    // Check for duplicate application
    const { data: existingApp } = await supabase
      .from('job_applications')
      .select('id')
      .eq('job_id', job_id)
      .eq('email', email.toLowerCase())
      .single();

    if (existingApp) {
      return NextResponse.json(
        { error: 'You have already applied for this position' },
        { status: 400 }
      );
    }

    // Handle resume upload
    let resume_url = null;
    let resume_filename = null;

    if (resume && resume.size > 0) {
      // Validate file type
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(resume.type)) {
        return NextResponse.json(
          { error: 'Invalid resume format. Please upload PDF or Word document' },
          { status: 400 }
        );
      }

      // Validate file size (5MB max)
      if (resume.size > 5 * 1024 * 1024) {
        return NextResponse.json(
          { error: 'Resume file too large. Maximum size is 5MB' },
          { status: 400 }
        );
      }

      // Generate unique filename
      const fileExt = resume.name.split('.').pop();
      const fileName = `${job_id}/${Date.now()}-${first_name.toLowerCase()}-${last_name.toLowerCase()}.${fileExt}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('resumes')
        .upload(fileName, resume, {
          contentType: resume.type,
          upsert: false,
        });

      if (uploadError) {
        // Hard-fail the application instead of silently storing it
        // without the resume. The previous behavior left admins with
        // candidates whose resume was simply missing, with no signal.
        // The most common cause is the 'resumes' storage bucket not
        // existing; the supabase/migrations/20260414_resumes_bucket.sql
        // migration creates it.
        console.error('Resume upload error:', uploadError);
        return NextResponse.json(
          {
            error:
              'We could not save your resume. Please try again, or email it directly to careers@aciinfotech.com.',
            details:
              process.env.NODE_ENV === 'development'
                ? uploadError.message
                : undefined,
          },
          { status: 500 },
        );
      }

      resume_url = fileName;
      resume_filename = resume.name;
    }

    // Get client info
    const ip_address = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '';
    const user_agent = request.headers.get('user-agent') || '';

    // Create application
    const applicationData = {
      job_id,
      first_name: first_name.trim(),
      last_name: last_name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone?.trim() || null,
      location: location?.trim() || null,
      linkedin_url: linkedin_url?.trim() || null,
      portfolio_url: portfolio_url?.trim() || null,
      current_company: current_company?.trim() || null,
      current_title: current_title?.trim() || null,
      years_experience: years_experience ? parseInt(years_experience) : null,
      work_authorization: work_authorization?.trim() || null,
      notice_period: notice_period?.trim() || null,
      salary_expectation: salary_expectation?.trim() || null,
      heard_from: heard_from?.trim() || null,
      resume_url,
      resume_filename,
      cover_letter: cover_letter?.trim() || null,
      source: source?.trim() || 'direct',
      referral_name: referral_name?.trim() || null,
      status: 'new',
      ip_address,
      user_agent,
    };

    const { data, error } = await supabase
      .from('job_applications')
      .insert([applicationData])
      .select()
      .single();

    if (error) {
      console.error('Error creating application:', error);
      return NextResponse.json({ error: 'Failed to submit application' }, { status: 500 });
    }

    // Fire-and-forget notification to RMG India. Email failure must
    // not bubble up to the candidate — the application is already
    // persisted, so a Resend outage or a missing API key shouldn't
    // surface as a failed submission. We await so any synchronous
    // throw is caught locally; the response below still ships.
    try {
      let resumeDownloadUrl: string | null = null;
      if (resume_url) {
        const { data: signed, error: signError } = await supabase.storage
          .from('resumes')
          .createSignedUrl(resume_url, RESUME_LINK_TTL_SECONDS);
        if (signError) {
          console.warn('[Email] Could not sign resume URL:', signError.message);
        } else {
          resumeDownloadUrl = signed?.signedUrl ?? null;
        }
      }

      await sendJobApplicationNotificationEmail({
        jobTitle: job.title,
        jobLocation: (job as { location?: string | null }).location ?? null,
        applicationId: data.id,
        firstName: applicationData.first_name,
        lastName: applicationData.last_name,
        email: applicationData.email,
        phone: applicationData.phone,
        location: applicationData.location,
        linkedinUrl: applicationData.linkedin_url,
        portfolioUrl: applicationData.portfolio_url,
        currentCompany: applicationData.current_company,
        currentTitle: applicationData.current_title,
        yearsExperience: applicationData.years_experience,
        workAuthorization: applicationData.work_authorization,
        noticePeriod: applicationData.notice_period,
        salaryExpectation: applicationData.salary_expectation,
        heardFrom: applicationData.heard_from,
        coverLetter: applicationData.cover_letter,
        source: applicationData.source,
        referralName: applicationData.referral_name,
        resumeFilename: applicationData.resume_filename,
        resumeDownloadUrl,
        adminViewUrl: `${siteUrl}/admin/job-applications`,
        notificationEmailsRaw:
          (job as { notification_emails?: string | null }).notification_emails ?? null,
      });
    } catch (notifyErr) {
      console.error('[Email] Job application notification threw:', notifyErr);
    }

    return NextResponse.json({
      success: true,
      message: 'Application submitted successfully',
      application_id: data.id,
    }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/jobs/apply:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
