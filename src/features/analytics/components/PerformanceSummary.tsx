import React from 'react';
import { motion } from 'framer-motion';
import { Timer, ArrowUpDown, Cpu, Trophy } from 'lucide-react';
import { formatDuration, formatNumber, formatBytes } from '../../../shared/lib/utils';
import type { BenchmarkSession } from '../../benchmark/engine/types';

interface PerformanceSummaryProps {
  session: BenchmarkSession | null;
}

export const PerformanceSummary: React.FC<PerformanceSummaryProps> = ({ session }) => {
  if (!session || !session.results.length) return null;

  const results = session.results;
  const fastest = results.reduce((prev, curr) => curr.executionTimeMs < prev.executionTimeMs ? curr : prev);
  const mostMemoryEfficient = results.reduce((prev, curr) => curr.memoryEstimateBytes < prev.memoryEstimateBytes ? curr : prev);
  const leastComparisons = results.reduce((prev, curr) => curr.comparisons < prev.comparisons ? curr : prev);
  
  const maxTime = Math.max(...results.map(r => r.executionTimeMs)) || 1;
  const maxMem = Math.max(...results.map(r => r.memoryEstimateBytes)) || 1;
  const maxComp = Math.max(...results.map(r => r.comparisons)) || 1;

  const bestOverall = results.reduce((prev, curr) => {
    const prevScore = (prev.executionTimeMs / maxTime) + (prev.memoryEstimateBytes / maxMem) + (prev.comparisons / maxComp);
    const currScore = (curr.executionTimeMs / maxTime) + (curr.memoryEstimateBytes / maxMem) + (curr.comparisons / maxComp);
    return currScore < prevScore ? curr : prev;
  });

  const cards = [
    {
      title: 'Fastest Algorithm',
      value: fastest.algorithmName,
      subValue: formatDuration(fastest.executionTimeMs),
      icon: Timer,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/20'
    },
    {
      title: 'Fewest Comparisons',
      value: leastComparisons.algorithmName,
      subValue: formatNumber(leastComparisons.comparisons) + ' ops',
      icon: ArrowUpDown,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/20'
    },
    {
      title: 'Memory Efficient',
      value: mostMemoryEfficient.algorithmName,
      subValue: formatBytes(mostMemoryEfficient.memoryEstimateBytes),
      icon: Cpu,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20'
    },
    {
      title: 'Best Overall Score',
      value: bestOverall.algorithmName,
      subValue: 'Balanced Performer',
      icon: Trophy,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: idx * 0.1 }}
          className={`p-5 rounded-xl border ${card.border} bg-black/40 backdrop-blur-sm relative overflow-hidden`}
        >
          <div className={`absolute top-0 right-0 w-24 h-24 ${card.bg} rounded-full blur-2xl -mr-10 -mt-10`} />
          <div className="flex items-center gap-3 mb-3 relative z-10">
            <div className={`p-2 rounded-lg ${card.bg} ${card.color}`}>
              <card.icon className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-semibold text-neutral-300">{card.title}</h4>
          </div>
          <div className="space-y-1 relative z-10">
            <div className="text-xl font-bold text-white tracking-tight">{card.value}</div>
            <div className={`text-xs font-mono ${card.color}`}>{card.subValue}</div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
