import React from 'react';
import { Timer, ArrowUpDown, Repeat, Cpu, GitFork, CheckCircle2, XCircle } from 'lucide-react';
import type { BenchmarkSession } from '../engine/types';
import { formatBytes, formatDuration, formatNumber } from '../../../shared/lib/utils';
import { MetricCard } from './MetricCard';

interface ResultsPanelProps {
  session: BenchmarkSession | null;
}

export const ResultsPanel: React.FC<ResultsPanelProps> = ({ session }) => {
  if (!session || session.results.length === 0) {
    return (
      <div className="glass-panel p-12 rounded-xl text-center space-y-4">
        <Timer className="w-12 h-12 text-neutral-600 mx-auto" />
        <h3 className="text-lg font-semibold text-white">No Benchmark Results</h3>
        <p className="text-sm text-neutral-400 max-w-md mx-auto">
          Select sorting algorithms above and click <strong>"Run Benchmark"</strong> to view execution time, comparison counts, memory usage, and recursion depth metrics.
        </p>
      </div>
    );
  }

  // Find min and max execution times to calculate relative badges
  const times = session.results.map((r) => r.executionTimeMs);
  const minTime = Math.min(...times);
  const maxTime = Math.max(...times);

  // Fast algorithm stats summary
  const fastest = session.results.reduce((prev, curr) =>
    curr.executionTimeMs < prev.executionTimeMs ? curr : prev
  );

  return (
    <div className="space-y-6">
      {/* Session Header Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6 rounded-xl border-l-4 border-blue-500">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-blue-400 mb-1">
            <CheckCircle2 className="w-4 h-4" />
            <span>Benchmark Session Completed</span>
          </div>
          <h3 className="text-xl font-bold text-white tracking-tight">
            Fastest: <span className="text-blue-400">{fastest.algorithmName}</span> ({formatDuration(fastest.executionTimeMs)})
          </h3>
          <p className="text-xs text-neutral-400 mt-1">
            Tested on {session.config.datasetSize.toLocaleString()} elements ({session.config.datasetType} distribution)
          </p>
        </div>

        <div className="text-right text-xs font-mono text-neutral-400 space-y-1">
          <div>Algorithms Tested: <span className="text-white">{session.results.length}</span></div>
          <div>Warmup Runs: <span className="text-white">{session.config.warmupIterations}</span></div>
        </div>
      </div>

      {/* Highlights Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Execution Time"
          value={formatDuration(fastest.executionTimeMs)}
          subtitle={`Best: ${fastest.algorithmName}`}
          icon={Timer}
          trend="best"
          colorScheme="blue"
        />
        <MetricCard
          title="Comparisons"
          value={formatNumber(fastest.comparisons)}
          subtitle="Least comparisons"
          icon={ArrowUpDown}
          colorScheme="purple"
        />
        <MetricCard
          title="Swaps"
          value={formatNumber(fastest.swaps)}
          subtitle="Total array swaps"
          icon={Repeat}
          colorScheme="emerald"
        />
        <MetricCard
          title="Peak Memory"
          value={formatBytes(fastest.memoryEstimateBytes)}
          subtitle="Auxiliary allocations"
          icon={Cpu}
          colorScheme="amber"
        />
      </div>

      {/* Detailed Comparative Metrics Table */}
      <div className="glass-panel rounded-xl overflow-hidden">
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <h4 className="font-semibold text-base text-white tracking-tight">Comparative Metrics Table</h4>
          <span className="text-xs font-mono text-neutral-400">Lower is better</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-black/40 text-xs font-mono text-neutral-400 uppercase tracking-wider">
                <th className="py-3 px-5">Algorithm</th>
                <th className="py-3 px-5">Status</th>
                <th className="py-3 px-5 text-right">Time (ms)</th>
                <th className="py-3 px-5 text-right">Comparisons</th>
                <th className="py-3 px-5 text-right">Swaps</th>
                <th className="py-3 px-5 text-right">Mem (Bytes)</th>
                <th className="py-3 px-5 text-right">Max Recursion</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm font-mono text-neutral-200">
              {session.results.map((res) => {
                const isFastest = res.executionTimeMs === minTime;
                const isSlowest = res.executionTimeMs === maxTime && session.results.length > 1;

                return (
                  <tr key={res.algorithmId} className="hover:bg-white/5 transition-colors">
                    <td className="py-3.5 px-5 font-semibold text-white flex items-center gap-2">
                      <span>{res.algorithmName}</span>
                      {isFastest && (
                        <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.5 rounded uppercase">
                          Fastest
                        </span>
                      )}
                      {isSlowest && (
                        <span className="text-[10px] bg-rose-500/20 text-rose-400 border border-rose-500/30 px-1.5 py-0.5 rounded uppercase">
                          Slowest
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-5">
                      {res.correct ? (
                        <span className="flex items-center gap-1 text-xs text-emerald-400">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Valid
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-xs text-rose-400">
                          <XCircle className="w-3.5 h-3.5" /> Invalid
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-5 text-right font-bold text-blue-400">
                      {formatDuration(res.executionTimeMs)}
                    </td>

                    <td className="py-3.5 px-5 text-right text-indigo-300">
                      {formatNumber(res.comparisons)}
                    </td>

                    <td className="py-3.5 px-5 text-right text-purple-300">
                      {formatNumber(res.swaps)}
                    </td>

                    <td className="py-3.5 px-5 text-right text-amber-300">
                      {formatBytes(res.memoryEstimateBytes)}
                    </td>

                    <td className="py-3.5 px-5 text-right text-neutral-400 flex items-center justify-end gap-1">
                      <GitFork className="w-3 h-3 text-neutral-500" />
                      {res.maxRecursionDepth}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
