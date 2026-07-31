import { QueueManager } from './QueueManager';
import { WorkerPool } from './WorkerPool';
import type { WorkerProgressPayload } from '../types/worker.types';
import type { BenchmarkResult } from '../engine/types';

export class BenchmarkScheduler {
  private queueManager: QueueManager;
  private workerPool: WorkerPool;
  private activeJobId: string | null = null;

  constructor(queueManager: QueueManager, workerPool: WorkerPool) {
    this.queueManager = queueManager;
    this.workerPool = workerPool;
    this.setupWorkerListeners();
  }

  private setupWorkerListeners(): void {
    const worker = this.workerPool.getPrimaryWorker();
    worker.setListeners({
      onProgress: (progress: WorkerProgressPayload) => {
        this.queueManager.updateJobProgress(
          progress.jobId,
          progress.completedPercentage,
          progress.algorithmName
        );
      },
      onComplete: (results: BenchmarkResult[]) => {
        if (this.activeJobId) {
          this.queueManager.markJobCompleted(this.activeJobId, results);
          this.activeJobId = null;
        }
        this.processNext();
      },
      onError: (error: string) => {
        if (this.activeJobId) {
          this.queueManager.markJobFailed(this.activeJobId, error);
          this.activeJobId = null;
        }
        this.processNext();
      },
      onCancel: () => {
        if (this.activeJobId) {
          this.queueManager.markJobCancelled(this.activeJobId);
          this.activeJobId = null;
        }
        this.processNext();
      },
    });
  }

  public start(): void {
    this.queueManager.setStatus('RUNNING');
    this.processNext();
  }

  public pause(): void {
    this.queueManager.setStatus('PAUSED');
  }

  public cancelCurrentJob(): void {
    if (this.activeJobId) {
      this.workerPool.getPrimaryWorker().cancelJob(this.activeJobId);
    }
  }

  private processNext(): void {
    if (this.queueManager.getStatus() === 'PAUSED') {
      return;
    }

    const nextJob = this.queueManager.getNextPendingJob();
    if (!nextJob) {
      this.queueManager.setStatus('IDLE');
      return;
    }

    this.activeJobId = nextJob.id;
    this.queueManager.markJobStarted(nextJob.id);

    const worker = this.workerPool.getPrimaryWorker();
    worker.runJob(nextJob.id, nextJob.config);
  }
}
