import React from 'react';
import { cn } from '../../shared/lib/utils';

export interface SliderProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  showValue?: boolean;
}

export const Slider: React.FC<SliderProps> = ({
  label,
  min,
  max,
  step = 1,
  value,
  onChange,
  showValue = true,
  className,
  ...props
}) => {
  return (
    <div className="space-y-1.5 w-full font-mono">
      {(label || showValue) && (
        <div className="flex justify-between items-center text-xs text-neutral-400">
          {label && <span>{label}</span>}
          {showValue && <span className="text-blue-400 font-semibold">{value.toLocaleString()}</span>}
        </div>
      )}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={onChange}
        className={cn(
          'w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-blue-500 focus:outline-none',
          className
        )}
        {...props}
      />
      <div className="flex justify-between text-[10px] text-neutral-500">
        <span>{min.toLocaleString()}</span>
        <span>{max.toLocaleString()}</span>
      </div>
    </div>
  );
};
