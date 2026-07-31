import React from 'react';
import { useBenchmarkQueue } from '../hooks/useBenchmarkQueue';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Play, Pause, XCircle, RefreshCw, Trash2, ListOrdered } from 'lucide-react';

export const QueueControlPanel: React.FC = () => {
  const {
    jobs,
    status,
    pauseQueue,
    resumeQueue,
    cancelCurrentJob,
    retryJob,
    removeJob,
    clearQueue,
  } = useBenchmarkQueue();

  if (jobs.length === 0) return null;

  return (
    <div className="glass-panel p-5 rounded-xl border border-white/10 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-white/5">
        <div className="flex items-center gap-2">
          <ListOrdered className="w-5 h-5 text-blue-400" />
          <h3 className="font-semibold text-white">Benchmark Queue ({jobs.length})</h3>
          <Badge variant={status === 'RUNNING' ? 'info' : status === 'PAUSED' ? 'warning' : 'default'}>
            {status}
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          {status === 'RUNNING' ? (
            <Button variant="outline" size="sm" onClick={pauseQueue} className="flex items-center gap-1.5 text-xs">
              <Pause className="w-3.5 h-3.5 text-amber-400" /> Pause Queue
            </Button>
          ) : (
            <Button variant="outline" size="sm" onClick={resumeQueue} className="flex items-center gap-1.5 text-xs">
              <Play className="w-3.5 h-3.5 text-emerald-400" /> Resume Queue
            </Button>
          )}

          <Button variant="ghost" size="sm" onClick={clearQueue} className="text-xs text-neutral-400 hover:text-rose-400">
            <Trash2 className="w-3.5 h-3.5" /> Clear Queue
          </Button>
        </div>
      </div>

      {/* Queue Items List */}
      <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
        {jobs.map((job, index) => {
          let badgeVariant: 'default' | 'info' | 'success' | 'warning' | 'error' = 'default';
          if (job.status === 'RUNNING') badgeVariant = 'info';
          if (job.status === 'COMPLETED') badgeVariant = 'success';
          if (job.status === 'FAILED' || job.status === 'CANCELLED') badgeVariant = 'error';

          return (
            <div
              key={job.id}
              className="p-3 bg-black/40 rounded-lg border border-white/5 flex items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <span className="font-mono text-neutral-500 w-4">{index + 1}.</span>
                <div className="truncate">
                  <span className="font-medium text-white block truncate">{job.name}</span>
                  <span className="text-neutral-400 text-[11px]">
                    Dataset Sizes: {job.config.datasetSizes.join(', ')} ({job.config.datasetType})
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                {job.status === 'RUNNING' && (
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 transition-all duration-300"
                        style={{ width: `${job.progress}%` }}
                      />
                    </div>
                    <span className="font-mono text-neutral-300 w-8 text-right">{job.progress}%</span>
                    <button
                      onClick={cancelCurrentJob}
                      className="p-1 text-rose-400 hover:text-rose-300 transition-colors"
                      title="Cancel benchmark"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {job.status !== 'RUNNING' && (
                  <Badge variant={badgeVariant} className="uppercase text-[10px]">
                    {job.status}
                  </Badge>
                )}

                {(job.status === 'FAILED' || job.status === 'CANCELLED') && (
                  <button
                    onClick={() => retryJob(job.id)}
                    className="p-1 text-amber-400 hover:text-amber-300 transition-colors"
                    title="Retry job"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                )}

                {job.status !== 'RUNNING' && (
                  <button
                    onClick={() => removeJob(job.id)}
                    className="p-1 text-neutral-500 hover:text-neutral-300 transition-colors"
                    title="Remove item"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Screen Reader ARIA Live Status */}
      <div className="sr-only" aria-live="polite">
        Queue contains {jobs.length} jobs. Current status: {status}.
      </div>
    </div>
  );
};
