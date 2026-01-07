'use client';

import { ReactNode, forwardRef } from 'react';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';

export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  onClick?: () => void;
  href?: string;
  target?: '_blank' | '_self';
  type?: 'button' | 'submit' | 'reset';
  children: ReactNode;
  className?: string;
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
    },
    ref
  ) => {
    // Base styles
    const baseStyles =
      'inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

    // Variant styles
    const variantStyles = {
      primary:
        'bg-[var(--aci-primary)] text-white hover:bg-[var(--aci-primary-dark)] focus:ring-[var(--aci-primary)]',
      secondary:
        'bg-white text-[var(--aci-secondary)] border border-gray-300 hover:bg-gray-50 hover:border-gray-400 focus:ring-gray-300',
      ghost:
        'bg-transparent text-[var(--aci-primary)] hover:bg-[var(--aci-primary)]/10 focus:ring-[var(--aci-primary)]',
      danger:
        'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    };

    // Size styles
    const sizeStyles = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base',
      xl: 'px-8 py-4 text-lg',
    };

    // Combined class names
    const combinedClassName = `
      ${baseStyles}
      ${variantStyles[variant]}
      ${sizeStyles[size]}
      ${fullWidth ? 'w-full' : ''}
      ${className}
    `.trim();

    // Content with loading state
    const content = (
      <>
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
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
