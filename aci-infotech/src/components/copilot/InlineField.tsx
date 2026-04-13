'use client';

import { useState, type FormEvent } from 'react';
import type { RequestFieldArgs } from '@/lib/copilot/tools';

export interface InlineFieldProps {
  field: RequestFieldArgs;
  onSubmit: (value: string) => void;
  autoFocus?: boolean;
}

const LABELS: Record<RequestFieldArgs['fieldName'], string> = {
  email: 'Work email',
  phone: 'Phone',
  company: 'Company',
  role: 'Role',
  team: 'Team',
  timeline: 'Timeline',
};

export default function InlineField({ field, onSubmit, autoFocus }: InlineFieldProps) {
  const [value, setValue] = useState('');
  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
    setValue('');
  }
  return (
    <form
      onSubmit={submit}
      className="mt-2 flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 focus-within:border-[color:var(--aci-primary,#0052CC)]"
    >
      <label
        htmlFor={`atheros-field-${field.fieldName}`}
        className="text-xs font-medium text-gray-500"
      >
        {LABELS[field.fieldName]}
      </label>
      <input
        id={`atheros-field-${field.fieldName}`}
        type={field.inputType ?? 'text'}
        placeholder={field.placeholder}
        autoComplete={
          field.fieldName === 'email'
            ? 'email'
            : field.fieldName === 'phone'
              ? 'tel'
              : field.fieldName === 'company'
                ? 'organization'
                : 'off'
        }
        autoFocus={autoFocus}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="flex-1 bg-transparent text-sm outline-none placeholder:text-gray-400"
      />
      <button
        type="submit"
        className="rounded-full bg-[color:var(--aci-primary,#0052CC)] px-3 py-1 text-xs font-semibold text-white hover:bg-[color:var(--aci-primary-dark,#003D99)]"
      >
        Send
      </button>
    </form>
  );
}
