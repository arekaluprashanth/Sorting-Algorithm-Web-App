import React from 'react';
import { cn } from '../../shared/lib/utils';

export const Skeleton: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => {
  return (
    <div
      className={cn('animate-pulse rounded-lg bg-white/10 dark:bg-white/5', className)}
      {...props}
    />
  );
};
