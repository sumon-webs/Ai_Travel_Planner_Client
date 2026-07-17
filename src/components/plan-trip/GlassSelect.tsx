'use client';

import { forwardRef, type SelectHTMLAttributes } from 'react';

interface GlassSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  hasError?: boolean;
  options: { value: string; label: string }[];
  placeholder?: string;
}

const GlassSelect = forwardRef<HTMLSelectElement, GlassSelectProps>(
  ({ hasError, options, placeholder, className = '', ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={`
          w-full rounded-xl bg-white/5 backdrop-blur-sm
          border px-4 py-3 text-sm text-white
          outline-none transition-all duration-200 appearance-none
          bg-[url("data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='16'%20height='16'%20fill='%239ca3af'%20viewBox='0%200%2016%2016'%3E%3Cpath%20d='M1.646%204.646a.5.5%200%200%201%20.708%200L8%2010.293l5.646-5.647a.5.5%200%200%201%20.708.708l-6%206a.5.5%200%200%201-.708%200l-6-6a.5.5%200%200%201%200-.708z'/%3E%3C/svg%3E")]
          bg-[position:right_12px_center] bg-no-repeat
          ${
            hasError
              ? 'border-red-500/60 focus:border-red-400 focus:ring-2 focus:ring-red-500/20'
              : 'border-white/10 hover:border-white/20 focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/20'
          }
          ${className}
        `}
        {...props}
      >
        {placeholder && (
          <option value="" className="bg-slate-900 text-slate-500">
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-slate-900 text-white">
            {opt.label}
          </option>
        ))}
      </select>
    );
  }
);

GlassSelect.displayName = 'GlassSelect';
export default GlassSelect;
