import { Metadata } from 'next';
import Image from 'next/image';
import { createClient } from '@supabase/supabase-js';
import { Briefcase, Heart, Building2, Globe, Zap, Award, Coffee, TrendingUp, ArrowRight } from 'lucide-react';
import Button from '@/components/ui/Button';
import CareersJobGrid from '@/components/careers/CareersJobGrid';

// Revalidate every 60 seconds for fresh content
export const revalidate = 60;

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://aciinfotech.com';

export const metadata: Metadata = {
  title: 'Careers | Join Our Team | ACI Infotech',
  description: 'Shape the future of enterprise technology. Join 6,250+ engineers working with Fortune 500 clients on transformative data, AI, and cloud projects.',
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
  { name: 'Data Engineering', value: 'Data Engineering', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  { name: 'AI & ML', value: 'AI & ML', color: 'bg-purple-100 text-purple-700 border-purple-200' },
  { name: 'Cloud', value: 'Cloud', color: 'bg-cyan-100 text-cyan-700 border-cyan-200' },
  { name: 'MarTech', value: 'MarTech', color: 'bg-green-100 text-green-700 border-green-200' },
  { name: 'Cybersecurity', value: 'Cybersecurity', color: 'bg-red-100 text-red-700 border-red-200' },
  { name: 'Digital Transformation', value: 'Digital Transformation', color: 'bg-orange-100 text-orange-700 border-orange-200' },
];

const locationTypes = [
  { name: 'All Locations', value: 'all' },
  { name: 'Remote', value: 'remote' },
  { name: 'Hybrid', value: 'hybrid' },
  { name: 'On-site', value: 'onsite' },
];

const benefits = [
  {
    icon: Heart,
    title: 'Health & Wellness',
    description: 'Comprehensive medical, dental, and vision coverage for you and your family',
    gradient: 'from-rose-500 to-pink-500'
  },
  {
    icon: Building2,
    title: 'Flexible Work',
    description: 'Remote-first culture with flexible hours and work-from-anywhere options',
    gradient: 'from-blue-500 to-cyan-500'
  },
  {
    icon: TrendingUp,
    title: 'Growth & Learning',
    description: 'Annual learning budget, certifications, and conference attendance',
    gradient: 'from-green-500 to-emerald-500'
  },
  {
    icon: Globe,
    title: 'Global Projects',
    description: 'Work with Fortune 500 clients across industries worldwide',
    gradient: 'from-purple-500 to-indigo-500'
  },
  {
    icon: Award,
    title: 'Recognition',
    description: 'Performance bonuses, spot awards, and career advancement paths',
    gradient: 'from-amber-500 to-orange-500'
  },
  {
    icon: Coffee,
    title: 'Work-Life Balance',
    description: 'Generous PTO, paid holidays, and mental health days',
    gradient: 'from-teal-500 to-cyan-500'
  },
];

export default async function CareersPage() {
  const jobs = await getJobs();
  // Distinct-department count is used only in the hero copy below.
  // The filter + job grid handles its own per-department counts in
  // the client component. No shared state needed here.
  const departmentCount = new Set(jobs.map((j) => j.department)).size;

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-[var(--aci-secondary)] pt-32 pb-24 overflow-hidden">
        {/* Photographic background. The image is pre-optimised (44 KB
            jpg / 29 KB webp); Next's Image optimiser serves AVIF/WebP
            on modern browsers. A layered scrim (base dark fill + dark
            gradient + subtle accent blobs) keeps the headline and
            stats strip legible regardless of what is on top of the
            photo. */}
        <Image
          src="/images/happy-team.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-gradient-to-b from-[#0A1628]/80 via-[#0A1628]/75 to-[#0A1628]/90"
          aria-hidden
        />
        <div className="absolute inset-0 opacity-10 pointer-events-none" aria-hidden>
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-500 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-blue-300 text-sm font-medium mb-8 backdrop-blur-sm">
              <Zap className="w-4 h-4" />
              We're Hiring — {jobs.length} Open Positions
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Shape the Future of
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                Enterprise Technology
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 mb-4 leading-relaxed max-w-3xl mx-auto">
              Join 6,250+ engineers, architects, and data scientists building
              transformative solutions for the world's most ambitious companies.
            </p>

            <p className="text-gray-400 mb-10">
              19 years. 80+ Fortune 500 clients. Real impact at enterprise scale.
            </p>

            {/* Quick scroll to jobs */}
            <a
              href="#openings"
              className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors group"
            >
              <span className="text-sm font-medium">Explore Opportunities</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
      </section>

      {/* Stats Strip */}
      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-100">
            <div className="py-8 px-4 text-center">
              <p className="text-3xl md:text-4xl font-bold text-[var(--aci-primary)]">19</p>
              <p className="text-sm text-gray-500 mt-1">Years in Business</p>
            </div>
            <div className="py-8 px-4 text-center">
              <p className="text-3xl md:text-4xl font-bold text-[var(--aci-primary)]">6,250+</p>
              <p className="text-sm text-gray-500 mt-1">Technologists Globally</p>
            </div>
            <div className="py-8 px-4 text-center">
              <p className="text-3xl md:text-4xl font-bold text-[var(--aci-primary)]">80+</p>
              <p className="text-sm text-gray-500 mt-1">Fortune 500 Clients</p>
            </div>
            <div className="py-8 px-4 text-center">
              <p className="text-3xl md:text-4xl font-bold text-[var(--aci-primary)]">10</p>
              <p className="text-sm text-gray-500 mt-1">Countries</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Join ACI Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500" />
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full opacity-50 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-100 rounded-full opacity-50 blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--aci-secondary)] mb-4">
              Why Engineers Choose ACI
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              We invest in our people because exceptional work comes from supported, empowered teams.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="group relative bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-gray-200 transition-all duration-300"
              >
                {/* Gradient accent on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${benefit.gradient} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity`} />

                <div className="relative">
                  <div className={`w-12 h-12 bg-gradient-to-br ${benefit.gradient} rounded-xl flex items-center justify-center mb-4 shadow-sm`}>
                    <benefit.icon className="w-6 h-6 text-white" />
                  </div>
                  <h5 className="text-base font-semibold text-[var(--aci-secondary)] mb-2">
                    {benefit.title}
                  </h5>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section id="openings" className="py-20 bg-white scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--aci-secondary)] mb-4">
              Open Positions
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {jobs.length > 0
                ? `Find your next opportunity. ${jobs.length} roles across ${departmentCount} departments.`
                : 'No open positions at the moment. Check back soon or send us your resume.'}
            </p>
          </div>

          {jobs.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 rounded-2xl">
              <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Open Positions</h3>
              <p className="text-gray-500 mb-6">
                We don't have any open positions right now, but we're always interested in talented people.
              </p>
              <Button href="/contact?reason=careers">
                Send Your Resume
              </Button>
            </div>
          ) : (
            <CareersJobGrid
              jobs={jobs}
              departments={departments}
              locationTypes={locationTypes}
            />
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-[var(--aci-secondary)] to-[#0a1628]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Don't See the Right Role?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            We're always looking for exceptional talent. Send us your resume and we'll reach out when we have a match.
          </p>
          <Button href="/contact?reason=careers" variant="secondary" size="lg">
            Send Your Resume
          </Button>
        </div>
      </section>

    </main>
  );
}
