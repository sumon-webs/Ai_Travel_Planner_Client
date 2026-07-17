'use client';

import type { ReactNode } from 'react';

interface FormFieldProps {
  label: string;
  htmlFor: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
}

export default function FormField({
  label,
  htmlFor,
  error,
  required,
  children,
  className = '',
}: FormFieldProps) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label
        htmlFor={htmlFor}
        className="text-sm font-medium text-slate-300 flex items-center gap-1"
      >
        {label}
        {required && (
          <span className="text-violet-400" aria-hidden>
            *
          </span>
        )}
      </label>
      {children}
      {error && (
        <p className="text-xs text-red-400 mt-0.5 animate-[slide-down_0.2s_ease-out]">
          {error}
        </p>
      )}
    </div>
  );
}
