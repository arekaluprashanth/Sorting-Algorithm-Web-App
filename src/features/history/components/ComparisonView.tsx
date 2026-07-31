import React from 'react';
import { motion } from 'framer-motion';
import { Modal } from '../../../components/ui/Modal';
import { BarChart } from '../../../components/charts';
import { Badge } from '../../../components/ui/Badge';
import { formatDuration, formatNumber, formatBytes } from '../../../shared/lib/utils';
import type { ComparisonResult } from '../types';

interface ComparisonViewProps {
  result: ComparisonResult | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ComparisonView: React.FC<ComparisonViewProps> = ({ result, isOpen, onClose }) => {
  if (!result) return null;

  const { sessionA, sessionB, algorithms, winner } = result;

  // Build chart data for time comparison
  const timeChartData = algorithms.map((a) => ({
    name: a.algorithmName,
    'Session A': a.sessionA?.executionTimeMs ?? 0,
    'Session B': a.sessionB?.executionTimeMs ?? 0,
  }));

  const timeBars = [
    { key: 'Session A', name: sessionA.name.slice(0, 30), color: '#3b82f6' },
    { key: 'Session B', name: sessionB.name.slice(0, 30), color: '#a855f7' },
  ];

  const opsChartData = algorithms.map((a) => ({
    name: a.algorithmName,
    'Session A': a.sessionA?.comparisons ?? 0,
    'Session B': a.sessionB?.comparisons ?? 0,
  }));

  const opsBars = [
    { key: 'Session A', name: sessionA.name.slice(0, 30), color: '#10b981' },
    { key: 'Session B', name: sessionB.name.slice(0, 30), color: '#f59e0b' },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Session Comparison" className="max-w-5xl max-h-[90vh] overflow-y-auto">
      {/* Winner Banner */}
      <motion.div
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        className={`p-4 rounded-xl border mb-6 text-center ${
          winner === 'A'
            ? 'border-blue-500/30 bg-blue-500/10'
            : winner === 'B'
              ? 'border-purple-500/30 bg-purple-500/10'
              : 'border-white/10 bg-white/5'
        }`}
      >
        <p className="text-xs font-mono text-neutral-400 mb-1">Overall Winner (Average Execution Time)</p>
        <p className="text-lg font-bold text-white">
          {winner === 'tie' ? "It's a Tie!" : winner === 'A' ? `🏆 ${sessionA.name}` : `🏆 ${sessionB.name}`}
        </p>
      </motion.div>

      {/* Session Labels */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-3 rounded-lg border border-blue-500/20 bg-blue-500/5">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <span className="text-xs font-mono text-neutral-400">Session A</span>
          </div>
          <p className="text-sm font-semibold text-white truncate">{sessionA.name}</p>
        </div>
        <div className="p-3 rounded-lg border border-purple-500/20 bg-purple-500/5">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-3 h-3 rounded-full bg-purple-500" />
            <span className="text-xs font-mono text-neutral-400">Session B</span>
          </div>
          <p className="text-sm font-semibold text-white truncate">{sessionB.name}</p>
        </div>
      </div>

      {/* Time Chart */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-white mb-3">Execution Time Comparison</h4>
        <BarChart data={timeChartData} xAxisKey="name" bars={timeBars} height={280} />
      </div>

      {/* Operations Chart */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-white mb-3">Comparisons Count</h4>
        <BarChart data={opsChartData} xAxisKey="name" bars={opsBars} height={280} />
      </div>

      {/* Algorithm Delta Table */}
      <div className="glass-panel rounded-xl overflow-hidden">
        <div className="p-4 border-b border-white/10">
          <h4 className="text-sm font-semibold text-white">Per-Algorithm Deltas</h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-black/40 text-neutral-400 font-mono uppercase tracking-wider border-b border-white/10">
                <th className="py-2 px-4">Algorithm</th>
                <th className="py-2 px-4 text-right">Time Δ</th>
                <th className="py-2 px-4 text-right">Comps Δ</th>
                <th className="py-2 px-4 text-right">Swaps Δ</th>
                <th className="py-2 px-4 text-right">Memory Δ</th>
                <th className="py-2 px-4 text-center">Faster</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {algorithms.map((a) => {
                const timeFaster =
                  a.timeDeltaMs > 0 ? 'A' : a.timeDeltaMs < 0 ? 'B' : 'tie';

                return (
                  <tr key={a.algorithmId} className="hover:bg-white/5 transition-colors">
                    <td className="py-2 px-4 font-semibold text-white">{a.algorithmName}</td>
                    <td className={`py-2 px-4 text-right font-mono ${a.timeDeltaMs > 0 ? 'text-emerald-400' : a.timeDeltaMs < 0 ? 'text-rose-400' : 'text-neutral-500'}`}>
                      {a.timeDeltaMs > 0 ? '+' : ''}{formatDuration(a.timeDeltaMs)}
                    </td>
                    <td className={`py-2 px-4 text-right font-mono ${a.comparisonsDelta > 0 ? 'text-emerald-400' : a.comparisonsDelta < 0 ? 'text-rose-400' : 'text-neutral-500'}`}>
                      {a.comparisonsDelta > 0 ? '+' : ''}{formatNumber(a.comparisonsDelta)}
                    </td>
                    <td className={`py-2 px-4 text-right font-mono ${a.swapsDelta > 0 ? 'text-emerald-400' : a.swapsDelta < 0 ? 'text-rose-400' : 'text-neutral-500'}`}>
                      {a.swapsDelta > 0 ? '+' : ''}{formatNumber(a.swapsDelta)}
                    </td>
                    <td className={`py-2 px-4 text-right font-mono ${a.memoryDeltaBytes > 0 ? 'text-emerald-400' : a.memoryDeltaBytes < 0 ? 'text-rose-400' : 'text-neutral-500'}`}>
                      {a.memoryDeltaBytes > 0 ? '+' : ''}{formatBytes(Math.abs(a.memoryDeltaBytes))}
                    </td>
                    <td className="py-2 px-4 text-center">
                      {timeFaster === 'A' && <Badge variant="info">A</Badge>}
                      {timeFaster === 'B' && <Badge variant="warning">B</Badge>}
                      {timeFaster === 'tie' && <Badge variant="default">—</Badge>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </Modal>
  );
};
