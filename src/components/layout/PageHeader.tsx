import React from 'react';
import { Breadcrumb } from './Breadcrumb';

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  showBreadcrumb?: boolean;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  action,
  showBreadcrumb = true,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4 mb-6">
      <div className="space-y-1">
        {showBreadcrumb && <Breadcrumb />}
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight leading-tight">
          {title}
        </h1>
        {subtitle && <p className="text-xs sm:text-sm text-neutral-400">{subtitle}</p>}
      </div>
      {action && <div className="flex items-center gap-3 shrink-0">{action}</div>}
    </div>
  );
};
