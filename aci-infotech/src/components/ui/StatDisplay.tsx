'use client';

import { ReactNode } from 'react';

interface StatDisplayProps {
  number: string;
  unit?: string;
  label: string;
  description?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'primary' | 'dark' | 'gradient';
  icon?: ReactNode;
  className?: string;
}

export default function StatDisplay({
  number,
  unit,
  label,
  description,
  size = 'md',
  variant = 'default',
  icon,
  className = '',
}: StatDisplayProps) {
  // Size styles for number
  const numberSizeStyles = {
    sm: 'text-2xl',
    md: 'text-4xl',
    lg: 'text-5xl',
    xl: 'text-6xl',
  };

  // Size styles for unit
  const unitSizeStyles = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl',
  };

  // Size styles for label
  const labelSizeStyles = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-lg',
  };

  // Variant styles
  const variantStyles = {
    default: {
      number: 'text-[var(--aci-secondary)]',
      label: 'text-gray-600',
    },
    primary: {
      number: 'text-[var(--aci-primary)]',
      label: 'text-gray-600',
    },
    dark: {
      number: 'text-white',
      label: 'text-gray-300',
    },
    gradient: {
      number: 'bg-gradient-to-r from-[var(--aci-primary)] to-[var(--aci-primary-light)] bg-clip-text text-transparent',
      label: 'text-gray-600',
    },
  };

  return (
    <div className={`text-center ${className}`}>
      {icon && (
        <div className="mb-3 flex justify-center text-[var(--aci-primary)]">
          {icon}
        </div>
      )}

      <div className="flex items-baseline justify-center gap-1">
        <span
          className={`
            font-bold font-[var(--font-title)]
            ${numberSizeStyles[size]}
            ${variantStyles[variant].number}
          `}
        >
          {number}
        </span>
        {unit && (
          <span
            className={`
              font-semibold
              ${unitSizeStyles[size]}
              ${variantStyles[variant].number}
            `}
          >
            {unit}
          </span>
        )}
      </div>

      <p
        className={`
          font-medium mt-1
          ${labelSizeStyles[size]}
          ${variantStyles[variant].label}
        `}
      >
        {label}
      </p>

      {description && (
        <p className="text-sm text-gray-500 mt-1">{description}</p>
      )}
    </div>
  );
}

// Stats Grid Component for displaying multiple stats
interface StatsGridProps {
  stats: {
    number: string;
    unit?: string;
    label: string;
    description?: string;
  }[];
  columns?: 2 | 3 | 4 | 5;
  variant?: 'default' | 'primary' | 'dark' | 'gradient';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function StatsGrid({
  stats,
  columns = 4,
  variant = 'default',
  size = 'md',
  className = '',
}: StatsGridProps) {
  const columnStyles = {
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-4',
    5: 'grid-cols-2 md:grid-cols-5',
  };

  return (
    <div className={`grid ${columnStyles[columns]} gap-8 ${className}`}>
      {stats.map((stat, index) => (
        <StatDisplay
          key={index}
          number={stat.number}
          unit={stat.unit}
          label={stat.label}
          description={stat.description}
          variant={variant}
          size={size}
        />
      ))}
    </div>
  );
}
