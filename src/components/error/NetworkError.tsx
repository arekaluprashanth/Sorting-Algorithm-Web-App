import React from 'react';
import { WifiOff, RefreshCw } from 'lucide-react';
import { Button } from '../ui/Button';

export interface NetworkErrorProps {
  message?: string;
  onRetry?: () => void;
}

export const NetworkError: React.FC<NetworkErrorProps> = ({
  message = 'Unable to connect to backend server. Please check your network connection or VITE_API_URL settings.',
  onRetry,
}) => {
  return (
    <div className="glass-panel p-8 rounded-2xl border border-rose-500/30 text-center space-y-4 max-w-md mx-auto">
      <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
        <WifiOff className="w-7 h-7" />
      </div>
      <div className="space-y-1">
        <h4 className="text-base font-semibold text-white tracking-tight">Network Connection Error</h4>
        <p className="text-xs text-neutral-400 leading-relaxed">{message}</p>
      </div>
      {onRetry && (
        <Button variant="danger" size="sm" leftIcon={<RefreshCw className="w-3.5 h-3.5" />} onClick={onRetry}>
          Retry Connection
        </Button>
      )}
    </div>
  );
};
