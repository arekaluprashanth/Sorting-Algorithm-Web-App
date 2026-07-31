import React from 'react';
import { AlertOctagon, Database, RefreshCw } from 'lucide-react';
import { Button } from '../ui/Button';

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'An Error Occurred',
  message = 'Something went wrong while executing the requested action. Please try again.',
  onRetry,
}) => (
  <div className="glass-panel p-8 rounded-2xl border border-rose-500/30 text-center space-y-4 max-w-md mx-auto">
    <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
      <AlertOctagon className="w-7 h-7" />
    </div>
    <div className="space-y-1">
      <h4 className="text-base font-semibold text-white tracking-tight">{title}</h4>
      <p className="text-xs text-neutral-400 leading-relaxed">{message}</p>
    </div>
    {onRetry && (
      <Button variant="danger" size="sm" leftIcon={<RefreshCw className="w-3.5 h-3.5" />} onClick={onRetry}>
        Try Again
      </Button>
    )}
  </div>
);

export interface NoDataStateProps {
  title?: string;
  message?: string;
}

export const NoDataState: React.FC<NoDataStateProps> = ({
  title = 'No Data Available',
  message = 'No records or benchmarks found matching your parameters.',
}) => (
  <div className="glass-panel p-8 rounded-2xl border border-white/10 text-center space-y-3 max-w-md mx-auto">
    <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 text-neutral-400 flex items-center justify-center mx-auto">
      <Database className="w-6 h-6" />
    </div>
    <div className="space-y-1">
      <h4 className="text-sm font-semibold text-white tracking-tight">{title}</h4>
      <p className="text-xs text-neutral-400 leading-relaxed">{message}</p>
    </div>
  </div>
);
