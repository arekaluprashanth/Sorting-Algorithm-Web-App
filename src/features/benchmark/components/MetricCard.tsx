import React from 'react';
import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import { cn } from '../../../shared/lib/utils';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: 'best' | 'worst' | 'neutral';
  colorScheme?: 'blue' | 'purple' | 'emerald' | 'amber' | 'rose';
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  colorScheme = 'blue',
}) => {
  const schemeStyles = {
    blue: 'border-blue-500/20 text-blue-400 bg-blue-500/10',
    purple: 'border-purple-500/20 text-purple-400 bg-purple-500/10',
    emerald: 'border-emerald-500/20 text-emerald-400 bg-emerald-500/10',
    amber: 'border-amber-500/20 text-amber-400 bg-amber-500/10',
    rose: 'border-rose-500/20 text-rose-400 bg-rose-500/10',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel p-5 rounded-xl space-y-3 relative overflow-hidden group"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider">{title}</span>
        <div className={cn('p-2 rounded-lg border', schemeStyles[colorScheme])}>
          <Icon className="w-4 h-4" />
        </div>
      </div>

      <div className="flex items-baseline justify-between">
        <div className="text-2xl font-bold text-white tracking-tight font-mono">{value}</div>
        {trend && (
          <span
            className={cn(
              'text-[10px] font-mono px-2 py-0.5 rounded border uppercase',
              trend === 'best'
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                : trend === 'worst'
                ? 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                : 'bg-neutral-800 text-neutral-400 border-white/10'
            )}
          >
            {trend}
          </span>
        )}
      </div>

      {subtitle && <p className="text-[11px] text-neutral-500 font-mono truncate">{subtitle}</p>}
    </motion.div>
  );
};
