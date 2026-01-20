'use client';

import { ReactNode, forwardRef } from 'react';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';

export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'secondary-dark' | 'ghost' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  onClick?: (e?: React.MouseEvent) => void;
  href?: string;
  target?: '_blank' | '_self';
  type?: 'button' | 'submit' | 'reset';
  children: ReactNode;
  className?: string;
  withLimeDot?: boolean;
}

const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      disabled = false,
      fullWidth = false,
      leftIcon,
      rightIcon,
      onClick,
      href,
      target,
      type = 'button',
      children,
      className = '',
      withLimeDot = false,
    },
    ref
  ) => {
    // Base styles - updated with 6px border-radius and lift hover effect
    const baseStyles =
      'inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5';

    // Variant styles - standard button styling rules
    // Primary: blue bg, white text | hover: blue bg, lime green text
    // Secondary (light): transparent, black border & text | hover: blue border & text
    // Secondary-dark: transparent, white border & text | hover: lime green border & text
    const variantStyles = {
      primary:
        'bg-[#0052CC] text-white hover:text-[#C4FF61] focus:ring-[#0052CC] cursor-pointer',
      secondary:
        'bg-transparent text-[#0A1628] border border-[#0A1628] hover:border-[#0052CC] hover:text-[#0052CC] focus:ring-[#0052CC] cursor-pointer',
      'secondary-dark':
        'bg-transparent text-white border border-white hover:border-[#C4FF61] hover:text-[#C4FF61] focus:ring-white cursor-pointer',
      ghost:
        'bg-transparent text-[#0052CC] hover:bg-[#0052CC]/10 focus:ring-[#0052CC] cursor-pointer',
      danger:
        'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 cursor-pointer',
      outline:
        'bg-transparent text-white border-2 border-white/30 hover:border-[#C4FF61] hover:text-[#C4FF61] focus:ring-white/50 cursor-pointer',
    };

    // Size styles - border radius max 8px (rounded-lg)
    const sizeStyles = {
      sm: 'px-4 py-2 text-sm rounded-lg',
      md: 'px-5 py-2.5 text-sm rounded-lg',
      lg: 'px-6 py-3 text-base rounded-lg',
      xl: 'px-8 py-4 text-lg rounded-lg',
    };

    // Combined class names
    const combinedClassName = `
      ${baseStyles}
      ${variantStyles[variant]}
      ${sizeStyles[size]}
      ${fullWidth ? 'w-full' : ''}
      ${className}
    `.trim();

    // Lime dot accent element
    const limeDot = withLimeDot ? (
      <span
        className="flex-shrink-0"
        style={{
          width: '5px',
          height: '5px',
          backgroundColor: '#C4FF61',
          borderRadius: '50%',
        }}
      />
    ) : null;

    // Content with loading state
    const content = (
      <>
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" strokeWidth={1.5} />
        ) : limeDot ? (
          limeDot
        ) : leftIcon ? (
          <span className="flex-shrink-0">{leftIcon}</span>
        ) : null}
        <span>{children}</span>
        {rightIcon && !loading && (
          <span className="flex-shrink-0">{rightIcon}</span>
        )}
      </>
    );

    // Render as Link if href is provided
    if (href && !disabled) {
      return (
        <Link
          href={href}
          target={target}
          className={combinedClassName}
          ref={ref as React.Ref<HTMLAnchorElement>}
        >
          {content}
        </Link>
      );
    }

    // Render as button
    return (
      <button
        type={type}
        onClick={onClick}
        disabled={disabled || loading}
        className={combinedClassName}
        ref={ref as React.Ref<HTMLButtonElement>}
      >
        {content}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
