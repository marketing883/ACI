import { Metadata } from 'next';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import { MapPin, Clock, Briefcase, ArrowRight, Heart, Building2, Users, Globe, Zap, Award, Coffee, TrendingUp, Search, Filter } from 'lucide-react';
import Button from '@/components/ui/Button';

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

function formatSalary(min: number | null, max: number | null, currency: string = 'USD'): string {
  if (!min && !max) return '';
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  });
  if (min && max) {
    return `${formatter.format(min)} - ${formatter.format(max)}`;
  }
  if (min) return `From ${formatter.format(min)}`;
  if (max) return `Up to ${formatter.format(max)}`;
  return '';
}

function getDepartmentColor(department: string): string {
  const dept = departments.find(d => d.value === department);
  return dept?.color || 'bg-gray-100 text-gray-700 border-gray-200';
}

export default async function CareersPage() {
  const jobs = await getJobs();

  // Group jobs by department for counts
  const jobsByDepartment = jobs.reduce((acc, job) => {
    if (!acc[job.department]) {
      acc[job.department] = [];
    }
    acc[job.department].push(job);
    return acc;
  }, {} as Record<string, Job[]>);

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-[var(--aci-secondary)] pt-32 pb-24 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
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
                ? `Find your next opportunity. ${jobs.length} roles across ${Object.keys(jobsByDepartment).length} departments.`
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
            <>
              {/* Filters */}
              <div className="bg-gray-50 rounded-2xl p-6 mb-8">
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Department Filter */}
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Department
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {departments.map((dept) => {
                        const count = dept.value === 'all' ? jobs.length : (jobsByDepartment[dept.value]?.length || 0);
                        if (dept.value !== 'all' && count === 0) return null;
                        return (
                          <button
                            key={dept.value}
                            data-department={dept.value}
                            className={`px-4 py-2 rounded-full text-sm font-medium border transition-all filter-btn ${
                              dept.value === 'all'
                                ? 'bg-[var(--aci-primary)] text-white border-[var(--aci-primary)]'
                                : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            {dept.name}
                            <span className="ml-1 text-xs opacity-70">({count})</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Location Type Filter */}
                  <div className="lg:w-64">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Work Type
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {locationTypes.map((type) => (
                        <button
                          key={type.value}
                          data-location={type.value}
                          className={`px-4 py-2 rounded-full text-sm font-medium border transition-all location-btn ${
                            type.value === 'all'
                              ? 'bg-[var(--aci-secondary)] text-white border-[var(--aci-secondary)]'
                              : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          {type.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Job Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" id="job-grid">
                {jobs.map((job) => (
                  <Link
                    key={job.id}
                    href={`/careers/${job.slug}`}
                    data-job-department={job.department}
                    data-job-location={job.location_type}
                    className="group bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-blue-200 transition-all duration-300 job-card"
                  >
                    {/* Department Badge */}
                    <div className="flex items-center justify-between mb-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getDepartmentColor(job.department)}`}>
                        {job.department}
                      </span>
                      <span className="text-xs text-gray-400 capitalize">
                        {job.location_type}
                      </span>
                    </div>

                    {/* Job Title */}
                    <h3 className="text-lg font-semibold text-[var(--aci-secondary)] group-hover:text-[var(--aci-primary)] transition-colors mb-3 line-clamp-2">
                      {job.title}
                    </h3>

                    {/* Meta Info */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <MapPin className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">{job.location}</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {job.employment_type.replace('-', ' ')}
                        </span>
                        <span className="flex items-center gap-1">
                          <Briefcase className="w-4 h-4" />
                          {job.experience_level}
                        </span>
                      </div>
                    </div>

                    {/* Skills */}
                    {job.skills && job.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {job.skills.slice(0, 3).map((skill) => (
                          <span
                            key={skill}
                            className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded"
                          >
                            {skill}
                          </span>
                        ))}
                        {job.skills.length > 3 && (
                          <span className="px-2 py-0.5 text-gray-400 text-xs">
                            +{job.skills.length - 3}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Salary if shown */}
                    {job.show_salary && job.salary_min && (
                      <p className="text-sm font-medium text-green-600 mb-4">
                        {formatSalary(job.salary_min, job.salary_max, job.salary_currency)}
                      </p>
                    )}

                    {/* CTA */}
                    <div className="flex items-center text-[var(--aci-primary)] font-medium text-sm group-hover:gap-2 transition-all">
                      View Position
                      <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                ))}
              </div>

              {/* No results message (hidden by default, shown via JS) */}
              <div id="no-results" className="hidden text-center py-16">
                <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">No matching positions</h3>
                <p className="text-gray-500">Try adjusting your filters to see more results.</p>
              </div>
            </>
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

      {/* Client-side filtering script */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            document.addEventListener('DOMContentLoaded', function() {
              let activeDepartment = 'all';
              let activeLocation = 'all';

              const filterBtns = document.querySelectorAll('.filter-btn');
              const locationBtns = document.querySelectorAll('.location-btn');
              const jobCards = document.querySelectorAll('.job-card');
              const noResults = document.getElementById('no-results');

              function updateFilters() {
                let visibleCount = 0;

                jobCards.forEach(card => {
                  const dept = card.dataset.jobDepartment;
                  const loc = card.dataset.jobLocation;

                  const deptMatch = activeDepartment === 'all' || dept === activeDepartment;
                  const locMatch = activeLocation === 'all' || loc === activeLocation;

                  if (deptMatch && locMatch) {
                    card.style.display = '';
                    visibleCount++;
                  } else {
                    card.style.display = 'none';
                  }
                });

                if (noResults) {
                  noResults.style.display = visibleCount === 0 ? 'block' : 'none';
                }
              }

              filterBtns.forEach(btn => {
                btn.addEventListener('click', function() {
                  activeDepartment = this.dataset.department;

                  filterBtns.forEach(b => {
                    if (b.dataset.department === activeDepartment) {
                      b.classList.remove('bg-white', 'text-gray-600', 'border-gray-200');
                      b.classList.add('bg-[var(--aci-primary)]', 'text-white', 'border-[var(--aci-primary)]');
                    } else {
                      b.classList.add('bg-white', 'text-gray-600', 'border-gray-200');
                      b.classList.remove('bg-[var(--aci-primary)]', 'text-white', 'border-[var(--aci-primary)]');
                    }
                  });

                  updateFilters();
                });
              });

              locationBtns.forEach(btn => {
                btn.addEventListener('click', function() {
                  activeLocation = this.dataset.location;

                  locationBtns.forEach(b => {
                    if (b.dataset.location === activeLocation) {
                      b.classList.remove('bg-white', 'text-gray-600', 'border-gray-200');
                      b.classList.add('bg-[var(--aci-secondary)]', 'text-white', 'border-[var(--aci-secondary)]');
                    } else {
                      b.classList.add('bg-white', 'text-gray-600', 'border-gray-200');
                      b.classList.remove('bg-[var(--aci-secondary)]', 'text-white', 'border-[var(--aci-secondary)]');
                    }
                  });

                  updateFilters();
                });
              });
            });
          `,
        }}
      />
    </main>
  );
}
