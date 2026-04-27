'use client';

/**
 * Client-side filter + job grid for the /careers page.
 *
 * The previous implementation lived in the server-rendered page with
 * an inline <script dangerouslySetInnerHTML> attaching a
 * DOMContentLoaded listener. Next's App Router hydrates AFTER
 * DOMContentLoaded has already fired, so the listener never attached
 * and the filter capsules were dead on arrival. This component moves
 * the filter state into React, makes the buttons real <button>
 * elements, and keeps everything else (card styling, copy, icons,
 * helper functions) identical to what the page used before.
 */

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  MapPin,
  Clock,
  Briefcase,
  ArrowRight,
  Search,
} from 'lucide-react';

export interface CareerJob {
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

interface DepartmentOption {
  name: string;
  value: string;
  color?: string;
}

interface LocationTypeOption {
  name: string;
  value: string;
}

interface CareersJobGridProps {
  jobs: CareerJob[];
  departments: DepartmentOption[];
  locationTypes: LocationTypeOption[];
}

function formatSalary(
  min: number | null,
  max: number | null,
  currency: string = 'USD',
): string {
  if (!min && !max) return '';
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  });
  if (min && max) return `${formatter.format(min)} - ${formatter.format(max)}`;
  if (min) return `From ${formatter.format(min)}`;
  if (max) return `Up to ${formatter.format(max)}`;
  return '';
}

function getDepartmentColor(department: string): string {
  const colors: Record<string, string> = {
    'Data Engineering': 'bg-blue-100 text-blue-700 border-blue-200',
    'AI & ML': 'bg-purple-100 text-purple-700 border-purple-200',
    Cloud: 'bg-cyan-100 text-cyan-700 border-cyan-200',
    MarTech: 'bg-green-100 text-green-700 border-green-200',
    Cybersecurity: 'bg-red-100 text-red-700 border-red-200',
    'Digital Transformation': 'bg-orange-100 text-orange-700 border-orange-200',
  };
  return colors[department] || 'bg-gray-100 text-gray-700 border-gray-200';
}

export default function CareersJobGrid({
  jobs,
  departments,
  locationTypes,
}: CareersJobGridProps) {
  const [activeDepartment, setActiveDepartment] = useState('all');
  const [activeLocation, setActiveLocation] = useState('all');

  const jobsByDepartment = useMemo(() => {
    return jobs.reduce<Record<string, CareerJob[]>>((acc, job) => {
      if (!acc[job.department]) acc[job.department] = [];
      acc[job.department].push(job);
      return acc;
    }, {});
  }, [jobs]);

  const visibleJobs = useMemo(() => {
    return jobs.filter((job) => {
      const deptMatch =
        activeDepartment === 'all' || job.department === activeDepartment;
      const locMatch =
        activeLocation === 'all' || job.location_type === activeLocation;
      return deptMatch && locMatch;
    });
  }, [jobs, activeDepartment, activeLocation]);

  return (
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
                const count =
                  dept.value === 'all'
                    ? jobs.length
                    : jobsByDepartment[dept.value]?.length || 0;
                if (dept.value !== 'all' && count === 0) return null;
                const selected = activeDepartment === dept.value;
                return (
                  <button
                    key={dept.value}
                    type="button"
                    onClick={() => setActiveDepartment(dept.value)}
                    className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                      selected
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
              {locationTypes.map((type) => {
                const selected = activeLocation === type.value;
                return (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setActiveLocation(type.value)}
                    className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                      selected
                        ? 'bg-[var(--aci-secondary)] text-white border-[var(--aci-secondary)]'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {type.name}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Job Grid */}
      {visibleJobs.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleJobs.map((job) => (
            <Link
              key={job.id}
              href={`/careers/${job.slug}`}
              className="group bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-blue-200 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium border ${getDepartmentColor(job.department)}`}
                >
                  {job.department}
                </span>
                <span className="text-xs text-gray-400 capitalize">
                  {job.location_type}
                </span>
              </div>

              <h3 className="text-lg font-semibold text-[var(--aci-secondary)] group-hover:text-[var(--aci-primary)] transition-colors mb-3 line-clamp-2">
                {job.title}
              </h3>

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

              {job.show_salary && job.salary_min && (
                <p className="text-sm font-medium text-green-600 mb-4">
                  {formatSalary(job.salary_min, job.salary_max, job.salary_currency)}
                </p>
              )}

              <div className="flex items-center text-[var(--aci-primary)] font-medium text-sm group-hover:gap-2 transition-all">
                View Position
                <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            No matching positions
          </h3>
          <p className="text-gray-500">
            Try adjusting your filters to see more results.
          </p>
        </div>
      )}
    </>
  );
}
