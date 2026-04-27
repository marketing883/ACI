'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface CardProps {
  variant?: 'default' | 'bordered' | 'elevated' | 'flat';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
  href?: string;
  onClick?: () => void;
  children: ReactNode;
  className?: string;
}

interface CardImageProps {
  src: string;
  alt: string;
  aspectRatio?: 'video' | 'square' | 'wide' | 'auto';
  className?: string;
}

interface CardHeaderProps {
  children: ReactNode;
  className?: string;
}

interface CardContentProps {
  children: ReactNode;
  className?: string;
}

interface CardFooterProps {
  children: ReactNode;
  className?: string;
}

// Main Card Component
export default function Card({
  variant = 'default',
  padding = 'md',
  hover = true,
  href,
  onClick,
  children,
  className = '',
}: CardProps) {
  // Variant styles - updated with new design system
  const variantStyles = {
    default: 'bg-white border border-gray-200',
    bordered: 'bg-white border-2 border-gray-300',
    elevated: 'bg-white shadow-md',
    flat: 'bg-[#FAFAFA]',
  };

  // Padding styles
  const paddingStyles = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  // Hover styles - subtler lift effect and softer shadow
  const hoverStyles = hover
    ? 'transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5'
    : '';

  const combinedClassName = `
    rounded-[6px] overflow-hidden
    ${variantStyles[variant]}
    ${paddingStyles[padding]}
    ${hoverStyles}
    ${className}
  `.trim();

  // Render as link if href provided
  if (href) {
    return (
      <Link href={href} className={`block ${combinedClassName}`}>
        {children}
      </Link>
    );
  }

  // Render as clickable div if onClick provided
  if (onClick) {
    return (
      <div
        onClick={onClick}
        className={`cursor-pointer ${combinedClassName}`}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && onClick()}
      >
        {children}
      </div>
    );
  }

  // Default render
  return <div className={combinedClassName}>{children}</div>;
}

// Card Image Sub-component
export function CardImage({
  src,
  alt,
  aspectRatio = 'video',
  className = '',
}: CardImageProps) {
  const aspectStyles = {
    video: 'aspect-video',
    square: 'aspect-square',
    wide: 'aspect-[21/9]',
    auto: '',
  };

  return (
    <div className={`relative overflow-hidden ${aspectStyles[aspectRatio]} ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    </div>
  );
}

// Card Header Sub-component
export function CardHeader({ children, className = '' }: CardHeaderProps) {
  return (
    <div className={`${className}`}>
      {children}
    </div>
  );
}

// Card Content Sub-component
export function CardContent({ children, className = '' }: CardContentProps) {
  return (
    <div className={`${className}`}>
      {children}
    </div>
  );
}

// Card Footer Sub-component
export function CardFooter({ children, className = '' }: CardFooterProps) {
  return (
    <div className={`mt-auto pt-4 ${className}`}>
      {children}
    </div>
  );
}
