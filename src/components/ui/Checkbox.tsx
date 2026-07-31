import React, { forwardRef } from 'react';
import { Check } from 'lucide-react';
import { cn } from '../../shared/lib/utils';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  description?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, description, checked, disabled, id, onChange, ...props }, ref) => {
    const checkboxId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <label
        htmlFor={checkboxId}
        className={cn(
          'flex items-start gap-3 select-none cursor-pointer group',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      >
        <div className="relative flex items-center mt-0.5">
          <input
            id={checkboxId}
            ref={ref}
            type="checkbox"
            checked={checked}
            disabled={disabled}
            onChange={onChange}
            className="sr-only"
            {...props}
          />
          <div
            className={cn(
              'w-4 h-4 rounded border flex items-center justify-center transition-colors',
              checked
                ? 'bg-blue-600 border-blue-500 text-white'
                : 'border-white/20 bg-neutral-900 group-hover:border-white/40',
              disabled && 'bg-neutral-800 border-white/10'
            )}
          >
            {checked && <Check className="w-3 h-3 stroke-[3]" />}
          </div>
        </div>
        {(label || description) && (
          <div>
            {label && <span className="text-xs font-mono font-medium text-white">{label}</span>}
            {description && <p className="text-[11px] text-neutral-400 leading-normal">{description}</p>}
          </div>
        )}
      </label>
    );
  }
);

Checkbox.displayName = 'Checkbox';
