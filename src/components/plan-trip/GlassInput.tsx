'use client';

import { forwardRef, type InputHTMLAttributes } from 'react';

interface GlassInputProps extends InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean;
}

const GlassInput = forwardRef<HTMLInputElement, GlassInputProps>(
  ({ hasError, className = '', ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={`
          w-full rounded-xl bg-white/5 backdrop-blur-sm
          border px-4 py-3 text-sm text-white
          placeholder:text-slate-500
          outline-none transition-all duration-200
          ${
            hasError
              ? 'border-red-500/60 focus:border-red-400 focus:ring-2 focus:ring-red-500/20'
              : 'border-white/10 hover:border-white/20 focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/20'
          }
          ${className}
        `}
        {...props}
      />
    );
  }
);

GlassInput.displayName = 'GlassInput';
export default GlassInput;
