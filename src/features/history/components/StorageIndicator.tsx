import React from 'react';
import { formatBytes } from '../../../shared/lib/utils';
import type { StorageStats } from '../types';

interface StorageIndicatorProps {
  stats: StorageStats;
}

export const StorageIndicator: React.FC<StorageIndicatorProps> = ({ stats }) => {
  const isWarning = stats.usagePercent > 80;
  const isDanger = stats.usagePercent > 95;

  const barColor = isDanger
    ? 'bg-rose-500'
    : isWarning
      ? 'bg-amber-500'
      : 'bg-blue-500';

  return (
    <div className="glass-panel p-3 rounded-lg border border-white/5">
      <div className="flex items-center justify-between text-xs font-mono mb-2">
        <span className="text-neutral-400">
          LocalStorage: {formatBytes(stats.usedBytes)} / {formatBytes(stats.estimatedQuotaBytes)}
        </span>
        <span className={isDanger ? 'text-rose-400' : isWarning ? 'text-amber-400' : 'text-neutral-500'}>
          {stats.usagePercent}%
        </span>
      </div>
      <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${barColor}`}
          style={{ width: `${Math.min(stats.usagePercent, 100)}%` }}
        />
      </div>
      {isWarning && (
        <p className="text-[10px] mt-1.5 text-amber-400 font-mono">
          ⚠ Storage usage is high. Consider clearing old sessions.
        </p>
      )}
    </div>
  );
};
