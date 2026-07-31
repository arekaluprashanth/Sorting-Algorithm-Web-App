import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../shared/lib/utils';

export interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  label?: string;
}

export const Loader: React.FC<LoaderProps> = ({ size = 'md', className, label }) => {
  const sizeMap = {
    sm: 'w-4 h-4',
    md: 'w-7 h-7',
    lg: 'w-10 h-10',
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 gap-3 text-neutral-400">
      <Loader2 className={cn('animate-spin text-blue-500', sizeMap[size], className)} />
      {label && <p className="text-xs font-mono">{label}</p>}
    </div>
  );
};
