'use client';

import { forwardRef, InputHTMLAttributes, TextareaHTMLAttributes } from 'react';

interface BaseInputProps {
  label?: string;
  error?: string;
  helpText?: string;
  fullWidth?: boolean;
}

interface TextInputProps
  extends BaseInputProps,
    Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  variant?: 'text' | 'email' | 'tel' | 'password' | 'number' | 'search';
}

interface TextareaProps
  extends BaseInputProps,
    TextareaHTMLAttributes<HTMLTextAreaElement> {
  variant: 'textarea';
  rows?: number;
}

type InputProps = TextInputProps | TextareaProps;

const Input = forwardRef<HTMLInputElement | HTMLTextAreaElement, InputProps>(
  (props, ref) => {
    const {
      label,
      error,
      helpText,
      fullWidth = true,
      className = '',
      ...rest
    } = props;

    const isTextarea = 'variant' in props && props.variant === 'textarea';

    // Base styles
    const baseStyles = `
      w-full px-4 py-3
      bg-white border rounded-lg
      text-[var(--aci-secondary)] text-base
      placeholder:text-gray-400
      transition-all duration-200
      focus:outline-none focus:ring-2 focus:ring-[var(--aci-primary)] focus:border-transparent
      disabled:bg-gray-100 disabled:cursor-not-allowed
    `;

    // Error styles
    const errorStyles = error
      ? 'border-red-500 focus:ring-red-500'
      : 'border-gray-300 hover:border-gray-400';

    const combinedClassName = `${baseStyles} ${errorStyles} ${className}`.trim();

    const wrapperClass = fullWidth ? 'w-full' : '';

    return (
      <div className={`${wrapperClass} space-y-1.5`}>
        {label && (
          <label className="block text-sm font-medium text-[var(--aci-secondary)]">
            {label}
            {rest.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        {isTextarea ? (
          <textarea
            ref={ref as React.Ref<HTMLTextAreaElement>}
            className={combinedClassName}
            rows={(rest as TextareaProps).rows || 4}
            {...(rest as TextareaHTMLAttributes<HTMLTextAreaElement>)}
          />
        ) : (
          <input
            ref={ref as React.Ref<HTMLInputElement>}
            type={(rest as TextInputProps).variant || 'text'}
            className={combinedClassName}
            {...(rest as InputHTMLAttributes<HTMLInputElement>)}
          />
        )}

        {error && (
          <p className="text-sm text-red-600 flex items-center gap-1">
            <svg
              className="w-4 h-4"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </p>
        )}

        {helpText && !error && (
          <p className="text-sm text-gray-500">{helpText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
