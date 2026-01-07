'use client';

import Image from 'next/image';
import Badge from './Badge';

interface TechItem {
  name: string;
  logo_url?: string;
  badge?: string;
  badge_style?: 'gold' | 'silver';
}

interface TechStackProps {
  technologies: TechItem[];
  columns?: 3 | 4 | 5 | 6;
  showBadges?: boolean;
  variant?: 'default' | 'compact' | 'detailed';
  className?: string;
}

export default function TechStack({
  technologies,
  columns = 4,
  showBadges = true,
  variant = 'default',
  className = '',
}: TechStackProps) {
  const columnStyles = {
    3: 'grid-cols-2 sm:grid-cols-3',
    4: 'grid-cols-2 sm:grid-cols-4',
    5: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-5',
    6: 'grid-cols-3 sm:grid-cols-4 lg:grid-cols-6',
  };

  if (variant === 'compact') {
    return (
      <div className={`flex flex-wrap gap-2 ${className}`}>
        {technologies.map((tech, index) => (
          <span
            key={index}
            className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full text-sm font-medium text-gray-700"
          >
            {tech.logo_url && (
              <Image
                src={tech.logo_url}
                alt={tech.name}
                width={16}
                height={16}
                className="object-contain"
              />
            )}
            {tech.name}
          </span>
        ))}
      </div>
    );
  }

  return (
    <div className={`grid ${columnStyles[columns]} gap-6 ${className}`}>
      {technologies.map((tech, index) => (
        <div
          key={index}
          className="flex flex-col items-center p-4 bg-white rounded-xl border border-gray-200 hover:shadow-md transition-shadow"
        >
          {tech.logo_url ? (
            <div className="relative w-16 h-16 mb-3">
              <Image
                src={tech.logo_url}
                alt={tech.name}
                fill
                className="object-contain"
              />
            </div>
          ) : (
            <div className="w-16 h-16 mb-3 bg-gray-100 rounded-lg flex items-center justify-center text-2xl font-bold text-gray-400">
              {tech.name.charAt(0)}
            </div>
          )}

          <span className="text-sm font-medium text-center text-[var(--aci-secondary)]">
            {tech.name}
          </span>

          {showBadges && tech.badge && (
            <Badge
              variant={tech.badge_style === 'gold' ? 'warning' : 'info'}
              size="sm"
              className="mt-2"
            >
              {tech.badge}
            </Badge>
          )}
        </div>
      ))}
    </div>
  );
}

// Simple logo-only tech grid for partner sections
interface TechLogoGridProps {
  logos: { name: string; logo_url: string }[];
  columns?: 4 | 5 | 6 | 8;
  className?: string;
}

export function TechLogoGrid({
  logos,
  columns = 6,
  className = '',
}: TechLogoGridProps) {
  const columnStyles = {
    4: 'grid-cols-2 sm:grid-cols-4',
    5: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-5',
    6: 'grid-cols-3 sm:grid-cols-4 lg:grid-cols-6',
    8: 'grid-cols-4 sm:grid-cols-6 lg:grid-cols-8',
  };

  return (
    <div className={`grid ${columnStyles[columns]} gap-8 items-center ${className}`}>
      {logos.map((logo, index) => (
        <div
          key={index}
          className="flex items-center justify-center p-4 grayscale hover:grayscale-0 transition-all duration-300 opacity-70 hover:opacity-100"
        >
          <Image
            src={logo.logo_url}
            alt={logo.name}
            width={120}
            height={48}
            className="object-contain max-h-12"
          />
        </div>
      ))}
    </div>
  );
}
