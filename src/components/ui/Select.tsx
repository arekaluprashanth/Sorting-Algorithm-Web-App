import React, { forwardRef } from 'react';
import { cn } from '../../shared/lib/utils';

export interface SelectOption {
  value: string | number;
  label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  error?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, options, error, id, ...props }, ref) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="space-y-1.5 w-full">
        {label && (
          <label htmlFor={selectId} className="block text-xs font-mono text-neutral-300">
            {label}
          </label>
        )}
        <select
          id={selectId}
          ref={ref}
          className={cn(
            'w-full px-3 py-2 bg-neutral-900/80 border rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer transition-all',
            error ? 'border-rose-500/80 focus:ring-rose-500' : 'border-white/10 focus:border-blue-500',
            className
          )}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-neutral-900 text-white">
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p className="text-[11px] font-mono text-rose-400">{error}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';
