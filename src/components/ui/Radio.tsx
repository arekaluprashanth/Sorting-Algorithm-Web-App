import React from 'react';
import { cn } from '../../shared/lib/utils';

export interface RadioOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

export interface RadioGroupProps {
  name: string;
  options: RadioOption[];
  selectedValue: string;
  onChange: (value: string) => void;
  className?: string;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  name,
  options,
  selectedValue,
  onChange,
  className,
}) => {
  return (
    <div className={cn('space-y-2', className)}>
      {options.map((opt) => {
        const isSelected = selectedValue === opt.value;
        return (
          <label
            key={opt.value}
            className={cn(
              'flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer select-none',
              isSelected
                ? 'bg-blue-600/10 border-blue-500/50 text-white'
                : 'bg-neutral-900/50 border-white/10 text-neutral-400 hover:border-white/20',
              opt.disabled && 'opacity-50 cursor-not-allowed'
            )}
          >
            <input
              type="radio"
              name={name}
              value={opt.value}
              checked={isSelected}
              disabled={opt.disabled}
              onChange={() => onChange(opt.value)}
              className="sr-only"
            />
            <div className="mt-0.5 w-4 h-4 rounded-full border border-white/30 flex items-center justify-center">
              {isSelected && <div className="w-2 h-2 rounded-full bg-blue-500" />}
            </div>
            <div>
              <span className="text-xs font-mono font-medium text-white">{opt.label}</span>
              {opt.description && (
                <p className="text-[11px] text-neutral-400 leading-normal mt-0.5">{opt.description}</p>
              )}
            </div>
          </label>
        );
      })}
    </div>
  );
};

export const Radio = RadioGroup;
