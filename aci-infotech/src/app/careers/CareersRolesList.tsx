'use client';

/**
 * Client-side filters + open-roles list for /careers, on the v4 grammar:
 * hairline department tabs, a hairline work-type select, and hairline
 * rows in place of the old card grid. Filtering behavior matches the
 * previous implementation exactly (same state, same matching, live
 * counts, departments with zero openings hidden).
 */

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { v4Display } from '@/components/v4/fonts';

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
}

interface LocationTypeOption {
  name: string;
  value: string;
}

interface CareersRolesListProps {
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

export default function CareersRolesList({
  jobs,
  departments,
  locationTypes,
}: CareersRolesListProps) {
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
    <div className="mt-12">
      {/* Filters: hairline tabs for department, hairline select for work type */}
      <div className="flex flex-col gap-5 border-b border-gray-200 pb-5 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
        <div className="flex flex-wrap gap-x-6 gap-y-2">
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
                aria-pressed={selected}
                className={`border-b pb-1 text-sm font-semibold transition-colors ${
                  selected
                    ? 'border-blue-700 text-blue-700'
                    : 'border-transparent text-gray-500 hover:text-black'
                }`}
              >
                {dept.name}
                <span className="ml-1 text-xs font-medium text-gray-400">({count})</span>
              </button>
            );
          })}
        </div>

        <label className="flex shrink-0 items-baseline gap-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-500">
          Work type
          <select
            value={activeLocation}
            onChange={(e) => setActiveLocation(e.target.value)}
            className="border-0 border-b border-gray-300 bg-transparent py-1 pr-6 text-sm font-semibold normal-case tracking-normal text-black focus:border-blue-700 focus:outline-none focus:ring-0"
          >
            {locationTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* Roles as hairline rows */}
      {visibleJobs.length > 0 ? (
        <ul>
          {visibleJobs.map((job) => (
            <li key={job.id} className="border-b border-gray-200">
              <Link
                href={`/careers/${job.slug}`}
                className="group grid gap-x-6 gap-y-1 py-6 sm:grid-cols-12 sm:items-baseline"
              >
                <div className="sm:col-span-6">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-400">
                    {job.department}
                  </p>
                  <h3
                    className={`mt-1 text-lg font-semibold text-black transition-colors group-hover:text-blue-700 md:text-xl ${v4Display}`}
                  >
                    {job.title}
                  </h3>
                  {job.show_salary && job.salary_min ? (
                    <p className="mt-1 text-sm text-gray-500">
                      {formatSalary(job.salary_min, job.salary_max, job.salary_currency)}
                    </p>
                  ) : null}
                </div>
                <p className="text-sm text-gray-500 sm:col-span-2">{job.location}</p>
                <p className="text-sm capitalize text-gray-500 sm:col-span-2">
                  {job.location_type} / {job.employment_type.replace('-', ' ')}
                </p>
                <span className="mt-2 flex items-center gap-1 text-sm font-semibold text-blue-700 sm:col-span-2 sm:mt-0 sm:justify-end">
                  View role
                  <ArrowUpRight
                    size={15}
                    aria-hidden="true"
                    className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div className="border-b border-gray-200 py-12">
          <p className={`text-lg font-semibold text-black ${v4Display}`}>
            Zero matches for that combination
          </p>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-gray-600">
            Try a wider filter to see more of the open&nbsp;roles.
          </p>
        </div>
      )}
    </div>
  );
}
