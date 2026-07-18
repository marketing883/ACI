import { Metadata } from 'next';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import { ArrowUpRight } from 'lucide-react';
import CtaSection from '@/components/v4/hero/CtaSection';
import { v4Sans, v4Display } from '@/components/v4/fonts';
import { SectionHead, CheckBadge, FactsRow, cardShadow, glueWidow } from '@/components/v4/page/kit';
import { getSiteUrl } from '@/lib/site-url';
import CareersRolesList from './CareersRolesList';

// Revalidate every 60 seconds for fresh content
export const revalidate = 60;

// Canonical origin: always production, so staging builds can never
// self-canonicalize (see src/lib/site-url.ts).
const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  title: { absolute: 'Careers at ACI Infotech | Join Our Team' },
  description: 'Shape the future of enterprise technology. Join 1,200+ experts working with Fortune 500 clients on transformative data, AI, and cloud projects.',
  alternates: {
    canonical: `${siteUrl}/careers`,
  },
};

interface Job {
  id: string;
  title: string;
  slug: string;
  department: string;
  location: string;
  location_type: string;
  employment_type: string;
  experience_level: string;
  skills: string[];
  salary_min: number | null;
  salary_max: number | null;
  show_salary: boolean;
  salary_currency: string;
  published_at: string;
}

async function getJobs(): Promise<Job[]> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return [];
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  const { data, error } = await supabase
    .from('jobs')
    .select('id, title, slug, department, location, location_type, employment_type, experience_level, skills, salary_min, salary_max, show_salary, salary_currency, published_at, closes_at')
    .eq('status', 'published')
    .order('published_at', { ascending: false });

  if (error) {
    console.error('Error fetching jobs:', error);
    return [];
  }

  // Filter out closed jobs
  const now = new Date();
  return (data || []).filter(job => {
    if (!job.closes_at) return true;
    return new Date(job.closes_at) > now;
  });
}

const departments = [
  { name: 'All Departments', value: 'all' },
  { name: 'Data Engineering', value: 'Data Engineering' },
  { name: 'AI & ML', value: 'AI & ML' },
  { name: 'Cloud', value: 'Cloud' },
  { name: 'MarTech', value: 'MarTech' },
  { name: 'Cybersecurity', value: 'Cybersecurity' },
  { name: 'Digital Transformation', value: 'Digital Transformation' },
];

const locationTypes = [
  { name: 'All Locations', value: 'all' },
  { name: 'Remote', value: 'remote' },
  { name: 'Hybrid', value: 'hybrid' },
  { name: 'On-site', value: 'onsite' },
];

// The same six benefits the page has always listed, restated plainly.
const BENEFITS = [
  {
    title: 'Health and wellness',
    body: 'Comprehensive medical, dental, and vision coverage for you and your family.',
  },
  {
    title: 'Flexible work',
    body: 'Remote-first culture with flexible hours and work-from-anywhere options.',
  },
  {
    title: 'Growth and learning',
    body: 'Annual learning budget, certifications, and conference attendance.',
  },
  {
    title: 'Global projects',
    body: 'Work with Fortune 500 clients across industries worldwide.',
  },
  {
    title: 'Recognition',
    body: 'Performance bonuses, spot awards, and career advancement paths.',
  },
  {
    title: 'Work-life balance',
    body: 'Generous PTO, paid holidays, and mental health days.',
  },
];

const FACTS = [
  {
    label: 'Recognition',
    line: 'Great Place to Work Certified, 2024 to 2025.',
  },
  {
    label: 'Scale',
    line: '1,200+ engineers, architects, and data scientists. Founded 2006.',
  },
  {
    label: 'Footprint',
    line: '11 global delivery hubs. Remote, hybrid, and on-site roles.',
  },
  {
    label: 'Track record',
    line: '500+ enterprise projects for Fortune 500 clients across data, AI, and cloud.',
  },
];

export default async function CareersPage() {
  const jobs = await getJobs();
  // Distinct-department count is used only in the section copy below.
  // The filter + roles list handles its own per-department counts in
  // the client component. No shared state needed here.
  const departmentCount = new Set(jobs.map((j) => j.department)).size;

  const rolesSub =
    jobs.length > 0
      ? `${jobs.length} open ${jobs.length === 1 ? 'role' : 'roles'} across ${departmentCount} ${departmentCount === 1 ? 'department' : 'departments'}. Filter by team or work type, then read the full brief.`
      : 'Every current opening is filled. We are always interested in talented people, so send your resume and we will reach out when a match opens.';

  return (
    <main className={`min-h-screen bg-white text-black ${v4Sans}`}>
      {/* Header */}
      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 pb-14 pt-12 md:pt-16">
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
            / Careers
          </p>
          <h1
            className={`max-w-4xl text-3xl font-bold tracking-tight sm:text-4xl lg:text-[44px] ${v4Display}`}
            style={{ lineHeight: 1.06 }}
          >
            Build the platforms enterprises{' '}
            <span style={{ color: '#1D4ED8' }}>actually&nbsp;run</span>
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-gray-700 md:text-lg">
            We design, build, and run data, AI, and cloud systems for Fortune
            500 clients. Small pods, senior engineers, and the same people from
            the first whiteboard to production support. The org chart is short
            on&nbsp;purpose.
          </p>

          <FactsRow facts={FACTS} />
        </div>
      </section>

      {/* Culture and benefits */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <SectionHead
            kicker="How we work"
            title={<>Why engineers&nbsp;stay</>}
            sub="Good work comes from people with room to do it. Here is what that room looks like in practice."
          />

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {BENEFITS.map((benefit) => (
              <div
                key={benefit.title}
                className={`flex items-start gap-3 rounded-2xl bg-white p-6 ${cardShadow}`}
              >
                <CheckBadge />
                <div>
                  <h3 className={`text-lg font-semibold text-black ${v4Display}`}>
                    {benefit.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-600">
                    {glueWidow(benefit.body)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open roles */}
      <section id="openings" className="scroll-mt-24 border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <SectionHead
            kicker="Open roles"
            title={<>Where we are&nbsp;hiring</>}
            sub={rolesSub}
          />

          {jobs.length === 0 ? (
            <div className="mt-12 border-t border-gray-200 pt-10">
              <Link
                href="/contact?reason=careers"
                className="group inline-flex items-center gap-1.5 text-[15px] font-semibold text-blue-700"
              >
                <span className="relative">
                  Send your resume
                  <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-current transition-transform duration-300 ease-out group-hover:scale-x-100" />
                </span>
                <ArrowUpRight
                  size={16}
                  aria-hidden="true"
                  className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </Link>
            </div>
          ) : (
            <CareersRolesList
              jobs={jobs}
              departments={departments}
              locationTypes={locationTypes}
            />
          )}
        </div>
      </section>

      {/* Closing CTA */}
      <CtaSection label="Send Us Your Resume" href="/contact?reason=careers" />
    </main>
  );
}
