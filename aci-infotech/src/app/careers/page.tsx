import { Metadata } from 'next';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import { MapPin, Clock, Briefcase, ArrowRight, Building2, Users, Globe, Heart } from 'lucide-react';
import Button from '@/components/ui/Button';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://aciinfotech.com';

export const metadata: Metadata = {
  title: 'Careers | Join Our Team | ACI Infotech',
  description: 'Join ACI Infotech and work on transformative projects for Fortune 500 clients. Explore opportunities in Data Engineering, AI/ML, Cloud, and more.',
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
  { name: 'Data Engineering', icon: '📊', color: 'bg-blue-100 text-blue-700' },
  { name: 'AI & ML', icon: '🤖', color: 'bg-purple-100 text-purple-700' },
  { name: 'Cloud', icon: '☁️', color: 'bg-cyan-100 text-cyan-700' },
  { name: 'MarTech', icon: '📈', color: 'bg-green-100 text-green-700' },
  { name: 'Cybersecurity', icon: '🔒', color: 'bg-red-100 text-red-700' },
  { name: 'Digital Transformation', icon: '🚀', color: 'bg-orange-100 text-orange-700' },
];

const benefits = [
  { icon: Heart, title: 'Health & Wellness', description: 'Comprehensive medical, dental, and vision coverage for you and your family' },
  { icon: Building2, title: 'Flexible Work', description: 'Remote-first culture with flexible hours and work-from-anywhere options' },
  { icon: Users, title: 'Growth & Learning', description: 'Annual learning budget, certifications, and conference attendance' },
  { icon: Globe, title: 'Global Projects', description: 'Work with Fortune 500 clients across industries worldwide' },
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

export default async function CareersPage() {
  const jobs = await getJobs();

  // Group jobs by department
  const jobsByDepartment = jobs.reduce((acc, job) => {
    if (!acc[job.department]) {
      acc[job.department] = [];
    }
    acc[job.department].push(job);
    return acc;
  }, {} as Record<string, Job[]>);

  const departmentsWithJobs = departments.filter(d => jobsByDepartment[d.name]?.length > 0);

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-[var(--aci-secondary)] pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <p className="text-[var(--aci-primary-light)] font-medium mb-4 tracking-wide uppercase">
              Careers at ACI Infotech
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Build the Future of
              <span className="text-[var(--aci-primary-light)]"> Enterprise Tech</span>
            </h1>
            <p className="text-xl text-gray-400 mb-8">
              Join a team of experts solving complex challenges for the world's leading companies.
              We're always looking for talented people who are passionate about technology.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="#openings"
                className="px-6 py-3 bg-[var(--aci-primary)] text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                View Open Positions ({jobs.length})
              </a>
              <Button href="/about" variant="ghost" className="text-white border-white hover:bg-white/10">
                Learn About Us
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-4xl font-bold text-[var(--aci-primary)]">500+</p>
              <p className="text-gray-600">Team Members</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-[var(--aci-primary)]">10+</p>
              <p className="text-gray-600">Global Offices</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-[var(--aci-primary)]">150+</p>
              <p className="text-gray-600">Fortune 500 Clients</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-[var(--aci-primary)]">95%</p>
              <p className="text-gray-600">Employee Satisfaction</p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[var(--aci-secondary)] mb-4">
              Why Join ACI Infotech?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We invest in our people because we believe great work comes from supported, empowered teams.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                  <benefit.icon className="w-6 h-6 text-[var(--aci-primary)]" />
                </div>
                <h3 className="text-lg font-semibold text-[var(--aci-secondary)] mb-2">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section id="openings" className="py-20 bg-white scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[var(--aci-secondary)] mb-4">
              Open Positions
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {jobs.length > 0
                ? `We have ${jobs.length} open positions across ${departmentsWithJobs.length} departments.`
                : 'No open positions at the moment. Check back soon or send us your resume.'}
            </p>
          </div>

          {jobs.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
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
            <div className="space-y-12">
              {departmentsWithJobs.map((dept) => (
                <div key={dept.name}>
                  <div className="flex items-center gap-3 mb-6">
                    <span className={`px-4 py-2 rounded-full text-sm font-medium ${dept.color}`}>
                      {dept.icon} {dept.name}
                    </span>
                    <span className="text-gray-400 text-sm">
                      {jobsByDepartment[dept.name].length} position{jobsByDepartment[dept.name].length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className="grid gap-4">
                    {jobsByDepartment[dept.name].map((job) => (
                      <Link
                        key={job.id}
                        href={`/careers/${job.slug}`}
                        className="group flex flex-col md:flex-row md:items-center justify-between p-6 bg-gray-50 rounded-xl hover:bg-blue-50 hover:shadow-md transition-all"
                      >
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-[var(--aci-secondary)] group-hover:text-[var(--aci-primary)] mb-2">
                            {job.title}
                          </h3>
                          <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {job.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {job.employment_type.charAt(0).toUpperCase() + job.employment_type.slice(1).replace('-', ' ')}
                            </span>
                            <span className="flex items-center gap-1">
                              <Briefcase className="w-4 h-4" />
                              {job.experience_level.charAt(0).toUpperCase() + job.experience_level.slice(1)}
                            </span>
                            {job.show_salary && job.salary_min && (
                              <span className="text-green-600 font-medium">
                                {formatSalary(job.salary_min, job.salary_max, job.salary_currency)}
                              </span>
                            )}
                          </div>
                          {job.skills && job.skills.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-3">
                              {job.skills.slice(0, 4).map((skill) => (
                                <span
                                  key={skill}
                                  className="px-2 py-1 bg-white text-gray-600 text-xs rounded border"
                                >
                                  {skill}
                                </span>
                              ))}
                              {job.skills.length > 4 && (
                                <span className="px-2 py-1 text-gray-400 text-xs">
                                  +{job.skills.length - 4} more
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                        <div className="mt-4 md:mt-0 md:ml-6">
                          <span className="inline-flex items-center gap-2 text-[var(--aci-primary)] font-medium group-hover:gap-3 transition-all">
                            Apply Now <ArrowRight className="w-4 h-4" />
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-[var(--aci-primary)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Don't See the Right Role?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            We're always looking for talented people. Send us your resume and we'll reach out when we have a match.
          </p>
          <Button href="/contact?reason=careers" variant="secondary" size="lg">
            Send Your Resume
          </Button>
        </div>
      </section>
    </main>
  );
}
