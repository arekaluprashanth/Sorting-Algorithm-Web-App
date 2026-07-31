import React from 'react';
import { Loader } from '../ui/Loader';
import { Skeleton } from '../ui/Skeleton';

export interface LoadingStateProps {
  type?: 'full' | 'card' | 'table';
  label?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  type = 'full',
  label = 'Loading view...',
}) => {
  if (type === 'full') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader size="lg" label={label} />
      </div>
    );
  }

  if (type === 'table') {
    return (
      <div className="space-y-3 glass-panel p-6 rounded-xl">
        <Skeleton className="h-6 w-1/4" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-3 glass-panel p-6 rounded-xl">
      <Skeleton className="h-5 w-1/3" />
      <Skeleton className="h-20 w-full" />
    </div>
  );
};
