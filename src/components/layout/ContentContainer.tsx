import React from 'react';
import { cn } from '../../shared/lib/utils';

export interface ContentContainerProps {
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  className?: string;
}

export const ContentContainer: React.FC<ContentContainerProps> = ({
  children,
  maxWidth = 'xl',
  className,
}) => {
  const maxWidthMap = {
    sm: 'max-w-3xl',
    md: 'max-w-5xl',
    lg: 'max-w-6xl',
    xl: 'max-w-7xl',
    full: 'max-w-full',
  };

  return (
    <div className={cn('mx-auto w-full space-y-6 pb-12', maxWidthMap[maxWidth], className)}>
      {children}
    </div>
  );
};
