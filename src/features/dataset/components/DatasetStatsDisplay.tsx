import React from 'react';
import type { DatasetStatistics } from '../types';
import { StatisticCard } from '../../../components/ui/Card';
import { formatBytes, formatNumber } from '../../../utils/formatters';
import { Hash, TrendingUp, TrendingDown, Layers, Cpu, Timer } from 'lucide-react';

export interface DatasetStatsDisplayProps {
  stats: DatasetStatistics | null;
}

export const DatasetStatsDisplay: React.FC<DatasetStatsDisplayProps> = ({ stats }) => {
  if (!stats || stats.length === 0) return null;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      <StatisticCard
        title="Elements"
        value={formatNumber(stats.length)}
        subtitle="Array length (n)"
        icon={Hash}
      />
      <StatisticCard
        title="Min Value"
        value={stats.min}
        subtitle="Minimum element"
        icon={TrendingDown}
      />
      <StatisticCard
        title="Max Value"
        value={stats.max}
        subtitle="Maximum element"
        icon={TrendingUp}
      />
      <StatisticCard
        title="Unique Count"
        value={formatNumber(stats.uniqueCount)}
        subtitle={`${stats.duplicatePercentage.toFixed(1)}% duplicates`}
        icon={Layers}
      />
      <StatisticCard
        title="Est. Memory"
        value={formatBytes(stats.estimatedMemoryBytes)}
        subtitle="Float64 buffer size"
        icon={Cpu}
      />
      <StatisticCard
        title="Gen Time"
        value={`${stats.generationDurationMs.toFixed(1)}ms`}
        subtitle="CPU generation speed"
        icon={Timer}
      />
    </div>
  );
};
