import React from 'react';
import { Play, Loader2, RotateCcw } from 'lucide-react';
import { useBenchmark } from '../hooks/use-benchmark';

export const BenchmarkControls: React.FC = () => {
  const {
    selectedAlgorithms,
    dataset,
    datasetConfig,
    isRunning,
    warmupIterations,
    setWarmupIterations,
    runCurrentBenchmark,
    clearSession,
  } = useBenchmark();

  const canRun = selectedAlgorithms.length > 0 && dataset.length > 0 && !isRunning;

  return (
    <div className="glass-panel p-6 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
      {/* Run Summary */}
      <div className="space-y-1">
        <h4 className="text-sm font-semibold text-white tracking-tight flex items-center gap-2">
          <span>Run Configuration</span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
            {selectedAlgorithms.length} Algorithms
          </span>
        </h4>
        <p className="text-xs text-neutral-400 font-mono">
          Dataset: {dataset.length.toLocaleString()} elements ({datasetConfig.type})
        </p>
      </div>

      {/* Options & Action Buttons */}
      <div className="flex flex-wrap items-center gap-4">
        {/* Warmup iterations selector */}
        <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
          <span>Warmup Runs:</span>
          <select
            value={warmupIterations}
            onChange={(e) => setWarmupIterations(Number(e.target.value))}
            className="bg-neutral-900 border border-white/10 rounded-lg px-2 py-1 text-white focus:outline-none focus:border-blue-500"
          >
            <option value={0}>0 (No Warmup)</option>
            <option value={1}>1 Run (Default)</option>
            <option value={3}>3 Runs</option>
          </select>
        </div>

        {/* Clear Button */}
        <button
          onClick={clearSession}
          disabled={isRunning}
          className="p-2.5 rounded-lg border border-white/10 text-neutral-400 hover:text-white hover:bg-white/5 transition-all disabled:opacity-50 cursor-pointer"
          title="Clear Results"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {/* Execute Benchmark Primary Button */}
        <button
          onClick={runCurrentBenchmark}
          disabled={!canRun}
          className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium text-sm transition-all shadow-lg shadow-blue-600/25 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {isRunning ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-white" />
              <span>Benchmarking...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              <span>Run Benchmark</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
