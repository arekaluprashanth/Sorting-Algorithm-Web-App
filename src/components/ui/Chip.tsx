import React from 'react';
import { X } from 'lucide-react';
import { cn } from '../../shared/lib/utils';

export interface ChipProps {
  label: string;
  onRemove?: () => void;
  variant?: 'default' | 'blue' | 'emerald' | 'purple';
  className?: string;
}

export const Chip: React.FC<ChipProps> = ({
  label,
  onRemove,
  variant = 'default',
  className,
}) => {
  const variantStyles = {
    default: 'bg-white/10 text-neutral-300 border-white/10',
    blue: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    emerald: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    purple: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono border select-none',
        variantStyles[variant],
        className
      )}
    >
      <span>{label}</span>
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </span>
  );
};
