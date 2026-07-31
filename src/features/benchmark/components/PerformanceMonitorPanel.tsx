import React from 'react';
import { usePerformanceMonitor } from '../hooks/usePerformanceMonitor';
import { PerformanceMonitor } from '../services/PerformanceMonitor';
import { Cpu, HardDrive, Zap, Clock, ShieldCheck, Activity } from 'lucide-react';
import type { WorkerProgressPayload } from '../types/worker.types';

interface PerformanceMonitorPanelProps {
  datasetSize: number;
  progress?: WorkerProgressPayload | null;
  isRunning?: boolean;
}

export const PerformanceMonitorPanel: React.FC<PerformanceMonitorPanelProps> = ({
  datasetSize,
  progress,
  isRunning = false,
}) => {
  const metrics = usePerformanceMonitor(datasetSize);

  return (
    <div className="glass-panel p-5 rounded-xl border border-white/10 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-white/5">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-emerald-400" />
          <h3 className="font-semibold text-white">Engine Performance & Resource Estimates</h3>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
          <ShieldCheck className="w-4 h-4 text-blue-400" />
          <span>Web Worker Isolated</span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Estimated Memory */}
        <div className="p-3 bg-black/30 rounded-lg border border-white/5 flex flex-col">
          <span className="text-[11px] text-neutral-400 uppercase tracking-wider mb-1 flex items-center gap-1">
            <HardDrive className="w-3.5 h-3.5 text-blue-400" /> RAM Footprint
          </span>
          <span className="font-mono text-lg font-bold text-white">
            {PerformanceMonitor.formatBytes(metrics.totalMemoryEstimateBytes)}
          </span>
          <span className="text-[10px] text-neutral-500 mt-0.5">
            Dataset: {PerformanceMonitor.formatBytes(metrics.estimatedDatasetMemoryBytes)}
          </span>
        </div>

        {/* Throughput */}
        <div className="p-3 bg-black/30 rounded-lg border border-white/5 flex flex-col">
          <span className="text-[11px] text-neutral-400 uppercase tracking-wider mb-1 flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-amber-400" /> Throughput
          </span>
          <span className="font-mono text-lg font-bold text-white">
            {progress?.throughputOpsPerSec ? `${progress.throughputOpsPerSec.toLocaleString()} ops/s` : 'Idle'}
          </span>
          <span className="text-[10px] text-neutral-500 mt-0.5">
            {datasetSize >= 50000 ? 'High-Volume Dataset' : 'Standard Dataset'}
          </span>
        </div>

        {/* Elapsed / Estimated Time */}
        <div className="p-3 bg-black/30 rounded-lg border border-white/5 flex flex-col">
          <span className="text-[11px] text-neutral-400 uppercase tracking-wider mb-1 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-purple-400" /> Execution Time
          </span>
          <span className="font-mono text-lg font-bold text-white">
            {progress ? `${(progress.elapsedTimeMs / 1000).toFixed(2)}s` : '0.00s'}
          </span>
          <span className="text-[10px] text-neutral-500 mt-0.5">
            {progress?.estimatedTimeRemainingMs
              ? `ETA: ~${(progress.estimatedTimeRemainingMs / 1000).toFixed(1)}s`
              : 'ETA: N/A'}
          </span>
        </div>

        {/* Execution Mode */}
        <div className="p-3 bg-black/30 rounded-lg border border-white/5 flex flex-col">
          <span className="text-[11px] text-neutral-400 uppercase tracking-wider mb-1 flex items-center gap-1">
            <Cpu className="w-3.5 h-3.5 text-emerald-400" /> Engine Thread
          </span>
          <span className="font-mono text-sm font-semibold text-emerald-400 mt-1">
            {isRunning ? 'Background Worker' : 'Ready'}
          </span>
          <span className="text-[10px] text-neutral-500 mt-0.5">
            UI Unblocked (60 FPS)
          </span>
        </div>
      </div>

      {/* Active Progress Bar if Running */}
      {isRunning && progress && (
        <div className="space-y-2 pt-2 border-t border-white/5">
          <div className="flex justify-between text-xs text-neutral-300">
            <span>
              Benchmarking <strong className="text-blue-400">{progress.algorithmName}</strong> ({progress.currentAlgorithmIndex}/{progress.totalAlgorithms})
            </span>
            <span className="font-mono">{progress.completedPercentage}%</span>
          </div>
          <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-300"
              style={{ width: `${progress.completedPercentage}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
