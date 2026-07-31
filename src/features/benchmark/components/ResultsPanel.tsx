import React from 'react';
import { Timer, CheckCircle2 } from 'lucide-react';
import type { BenchmarkSession } from '../engine/types';
import { AnalyticsDashboard } from '../../analytics/components';

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

  return (
    <div className="space-y-6">
      {/* Session Header Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6 rounded-xl border-l-4 border-blue-500">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-blue-400 mb-1">
            <CheckCircle2 className="w-4 h-4" />
            <span>Benchmark Session Completed</span>
          </div>
          <h3 className="text-lg font-bold text-white tracking-tight">Benchmark Results</h3>
        </div>

        <div className="text-right text-xs font-mono text-neutral-400 space-y-1">
          <div>Algorithms Tested: <span className="text-white">{session.results.length}</span></div>
          <div>Warmup Runs: <span className="text-white">{session.config.warmupIterations}</span></div>
        </div>
      </div>

      <AnalyticsDashboard session={session} />
    </div>
  );
};
