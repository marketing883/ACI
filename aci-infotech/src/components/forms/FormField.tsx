'use client';

import { forwardRef } from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';

interface FormFieldProps {
  label: string;
  name: string;
  type?: 'text' | 'email' | 'tel' | 'password' | 'number' | 'search' | 'url' | 'textarea' | 'select';
  error?: string;
  helpText?: string;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  rows?: number;
  options?: { value: string; label: string }[];
  registration?: UseFormRegisterReturn;
  className?: string;
}

const FormField = forwardRef<
  HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement,
  FormFieldProps
>(({
  label,
  name,
  type = 'text',
  error,
  helpText,
  required,
  disabled,
  placeholder,
  rows = 4,
  options = [],
  registration,
  className = '',
}, ref) => {
  // Base input styles
  const inputStyles = `
    w-full px-4 py-3
    bg-white border rounded-lg
    text-[var(--aci-secondary)] text-base
    placeholder:text-gray-400
    transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-[var(--aci-primary)] focus:border-transparent
    disabled:bg-gray-100 disabled:cursor-not-allowed
    ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 hover:border-gray-400'}
    ${className}
  `.trim();

  const errorId = `${name}-error`;

  const renderInput = () => {
    if (type === 'textarea') {
      return (
        <textarea
          id={name}
          rows={rows}
          placeholder={placeholder}
          disabled={disabled}
          className={inputStyles}
          aria-describedby={error ? errorId : undefined}
          aria-invalid={!!error}
          ref={ref as React.Ref<HTMLTextAreaElement>}
          {...registration}
        />
      );
    }

    if (type === 'select') {
      return (
        <select
          id={name}
          disabled={disabled}
          className={inputStyles}
          aria-describedby={error ? errorId : undefined}
          aria-invalid={!!error}
          ref={ref as React.Ref<HTMLSelectElement>}
          {...registration}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      );
    }

    return (
      <input
        id={name}
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        className={inputStyles}
        aria-describedby={error ? errorId : undefined}
        aria-invalid={!!error}
        ref={ref as React.Ref<HTMLInputElement>}
        {...registration}
      />
    );
  };

  return (
    <div className="w-full space-y-1.5">
      <label
        htmlFor={name}
        className="block text-sm font-medium text-[var(--aci-secondary)]"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {renderInput()}

      {error && (
        <p id={errorId} className="text-sm text-red-600 flex items-center gap-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
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
});

FormField.displayName = 'FormField';

export default FormField;
