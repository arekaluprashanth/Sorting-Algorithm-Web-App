import React from 'react';
import { AlertCircle, CheckCircle2, Info, AlertTriangle } from 'lucide-react';
import { cn } from '../../shared/lib/utils';

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
}

export const Alert: React.FC<AlertProps> = ({
  children,
  className,
  variant = 'info',
  title,
  ...props
}) => {
  const iconMap = {
    info: Info,
    success: CheckCircle2,
    warning: AlertTriangle,
    error: AlertCircle,
  };

  const styleMap = {
    info: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
    success: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
    warning: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
    error: 'bg-rose-500/10 border-rose-500/20 text-rose-400',
  };

  const Icon = iconMap[variant];

  return (
    <div
      className={cn(
        'p-4 rounded-xl border flex items-start gap-3 text-xs leading-relaxed',
        styleMap[variant],
        className
      )}
      {...props}
    >
      <Icon className="w-5 h-5 shrink-0 mt-0.5" />
      <div className="space-y-1">
        {title && <h5 className="font-semibold text-sm tracking-tight">{title}</h5>}
        <div>{children}</div>
      </div>
    </div>
  );
};
