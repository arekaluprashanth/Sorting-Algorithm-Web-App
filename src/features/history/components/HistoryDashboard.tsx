import React from 'react';
import { motion } from 'framer-motion';
import { Database, Timer, BarChart3, Star, Calendar, HardDrive } from 'lucide-react';
import { formatDuration, formatBytes } from '../../../shared/lib/utils';
import type { HistorySession, StorageStats } from '../types';
import { StorageIndicator } from './StorageIndicator';

interface HistoryDashboardProps {
  sessions: HistorySession[];
  storageStats: StorageStats;
}

export const HistoryDashboard: React.FC<HistoryDashboardProps> = ({ sessions, storageStats }) => {
  const totalSessions = sessions.length;
  const favoriteCount = sessions.filter((s) => s.favorite).length;

  const avgBenchmarkTime =
    totalSessions > 0
      ? sessions.reduce((sum, s) => sum + (s.session.completedAt - s.session.startedAt), 0) / totalSessions
      : 0;

  // Most used algorithm
  const algoCounts: Record<string, number> = {};
  sessions.forEach((s) =>
    s.session.results.forEach((r) => {
      algoCounts[r.algorithmName] = (algoCounts[r.algorithmName] || 0) + 1;
    }),
  );
  const mostUsedAlgo = Object.entries(algoCounts).sort((a, b) => b[1] - a[1])[0];

  const lastBenchmark = sessions.length > 0 ? sessions[0]!.createdAt : null;

  const cards = [
    { title: 'Total Sessions', value: totalSessions.toString(), icon: Database, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
    { title: 'Avg Duration', value: formatDuration(avgBenchmarkTime), icon: Timer, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
    { title: 'Most Used Algo', value: mostUsedAlgo ? mostUsedAlgo[0] : '—', icon: BarChart3, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
    { title: 'Favorites', value: favoriteCount.toString(), icon: Star, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
    { title: 'Last Benchmark', value: lastBenchmark ? new Date(lastBenchmark).toLocaleDateString() : '—', icon: Calendar, color: 'text-sky-400', bg: 'bg-sky-500/10', border: 'border-sky-500/20' },
    { title: 'Storage Used', value: formatBytes(storageStats.usedBytes), icon: HardDrive, color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20' },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {cards.map((card, idx) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className={`p-4 rounded-xl border ${card.border} bg-black/40 backdrop-blur-sm relative overflow-hidden`}
          >
            <div className={`absolute top-0 right-0 w-16 h-16 ${card.bg} rounded-full blur-2xl -mr-8 -mt-8`} />
            <div className="flex items-center gap-2 mb-2 relative z-10">
              <card.icon className={`w-3.5 h-3.5 ${card.color}`} />
              <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider">{card.title}</span>
            </div>
            <div className={`text-lg font-bold text-white tracking-tight relative z-10 truncate`}>{card.value}</div>
          </motion.div>
        ))}
      </div>
      <StorageIndicator stats={storageStats} />
    </div>
  );
};
