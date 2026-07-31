import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../shared/lib/utils';

export interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({ size = 'md', className }) => {
  const sizeMap = {
    sm: 'w-3.5 h-3.5',
    md: 'w-6 h-6',
    lg: 'w-9 h-9',
  };

  return <Loader2 className={cn('animate-spin text-blue-500', sizeMap[size], className)} />;
};
