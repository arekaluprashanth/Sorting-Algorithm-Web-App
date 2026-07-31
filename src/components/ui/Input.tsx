import React, { forwardRef } from 'react';
import { Search, X, Plus, Minus } from 'lucide-react';
import { cn } from '../../shared/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, helperText, error, leftIcon, rightIcon, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="space-y-1.5 w-full">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-mono text-neutral-300">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3 text-neutral-400 pointer-events-none">{leftIcon}</div>
          )}
          <input
            id={inputId}
            ref={ref}
            className={cn(
              'w-full px-3 py-2 bg-neutral-900/80 border rounded-lg text-xs text-white placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all',
              error ? 'border-rose-500/80 focus:ring-rose-500' : 'border-white/10 focus:border-blue-500',
              leftIcon && 'pl-9',
              rightIcon && 'pr-9',
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 text-neutral-400">{rightIcon}</div>
          )}
        </div>
        {error ? (
          <p className="text-[11px] font-mono text-rose-400">{error}</p>
        ) : (
          helperText && <p className="text-[11px] font-mono text-neutral-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export interface SearchInputProps extends Omit<InputProps, 'leftIcon' | 'rightIcon'> {
  onClear?: () => void;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ value, onChange, onClear, ...props }, ref) => {
    return (
      <Input
        ref={ref}
        value={value}
        onChange={onChange}
        leftIcon={<Search className="w-4 h-4" />}
        rightIcon={
          value ? (
            <button
              type="button"
              onClick={onClear}
              className="text-neutral-400 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          ) : undefined
        }
        placeholder="Search..."
        {...props}
      />
    );
  }
);

SearchInput.displayName = 'SearchInput';

export interface NumberInputProps extends Omit<InputProps, 'type'> {
  min?: number;
  max?: number;
  step?: number;
  onValueChange?: (val: number) => void;
}

export const NumberInput: React.FC<NumberInputProps> = ({
  value,
  min,
  max,
  step = 1,
  onValueChange,
  ...props
}) => {
  const currentVal = Number(value) || 0;

  const handleIncrement = () => {
    const next = max !== undefined ? Math.min(max, currentVal + step) : currentVal + step;
    onValueChange?.(next);
  };

  const handleDecrement = () => {
    const next = min !== undefined ? Math.max(min, currentVal - step) : currentVal - step;
    onValueChange?.(next);
  };

  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        onClick={handleDecrement}
        disabled={min !== undefined && currentVal <= min}
        className="p-2 bg-neutral-900 border border-white/10 rounded-lg text-neutral-400 hover:text-white disabled:opacity-50 cursor-pointer"
      >
        <Minus className="w-3.5 h-3.5" />
      </button>
      <Input
        type="number"
        value={value}
        min={min}
        max={max}
        step={step}
        className="text-center font-mono"
        {...props}
      />
      <button
        type="button"
        onClick={handleIncrement}
        disabled={max !== undefined && currentVal >= max}
        className="p-2 bg-neutral-900 border border-white/10 rounded-lg text-neutral-400 hover:text-white disabled:opacity-50 cursor-pointer"
      >
        <Plus className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
