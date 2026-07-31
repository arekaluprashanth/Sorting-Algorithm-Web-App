import type { BenchmarkJob, QueueStatus, QueueConfig } from '../types/queue.types';
import type { BenchmarkConfig } from '../engine/types';

export type QueueListener = (jobs: BenchmarkJob[], status: QueueStatus) => void;

export class QueueManager {
  private jobs: BenchmarkJob[] = [];
  private status: QueueStatus = 'IDLE';
  private config: QueueConfig = { maxConcurrentJobs: 1, autoStart: true };

  public getConfig(): QueueConfig {
    return { ...this.config };
  }
  private listeners: Set<QueueListener> = new Set();

  public subscribe(listener: QueueListener): () => void {
    this.listeners.add(listener);
    listener(this.jobs, this.status);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public getJobs(): BenchmarkJob[] {
    return [...this.jobs];
  }

  public getStatus(): QueueStatus {
    return this.status;
  }

  public setStatus(status: QueueStatus): void {
    this.status = status;
    this.notify();
  }

  public addJob(name: string, config: BenchmarkConfig): BenchmarkJob {
    const job: BenchmarkJob = {
      id: `job-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      name,
      config,
      status: 'PENDING',
      createdAt: Date.now(),
      progress: 0,
    };
    this.jobs.push(job);
    this.notify();
    return job;
  }

  public removeJob(jobId: string): void {
    this.jobs = this.jobs.filter(j => j.id !== jobId);
    this.notify();
  }

  public reorderQueue(startIndex: number, endIndex: number): void {
    const pendingJobs = this.jobs.filter(j => j.status === 'PENDING');
    const result = Array.from(pendingJobs);
    const [removed] = result.splice(startIndex, 1);
    if (removed) {
      result.splice(endIndex, 0, removed);
    }
    
    // Replace pending jobs order while maintaining running/completed items
    const nonPending = this.jobs.filter(j => j.status !== 'PENDING');
    this.jobs = [...nonPending, ...result];
    this.notify();
  }

  public updateJobProgress(jobId: string, progress: number, currentAlgorithm?: string): void {
    const job = this.jobs.find(j => j.id === jobId);
    if (job) {
      job.progress = progress;
      if (currentAlgorithm) job.currentAlgorithm = currentAlgorithm;
      this.notify();
    }
  }

  public markJobStarted(jobId: string): void {
    const job = this.jobs.find(j => j.id === jobId);
    if (job) {
      job.status = 'RUNNING';
      job.startedAt = Date.now();
      this.notify();
    }
  }

  public markJobCompleted(jobId: string, results: BenchmarkJob['results']): void {
    const job = this.jobs.find(j => j.id === jobId);
    if (job) {
      job.status = 'COMPLETED';
      job.completedAt = Date.now();
      job.progress = 100;
      job.results = results;
      this.notify();
    }
  }

  public markJobFailed(jobId: string, error: string): void {
    const job = this.jobs.find(j => j.id === jobId);
    if (job) {
      job.status = 'FAILED';
      job.completedAt = Date.now();
      job.error = error;
      this.notify();
    }
  }

  public markJobCancelled(jobId: string): void {
    const job = this.jobs.find(j => j.id === jobId);
    if (job) {
      job.status = 'CANCELLED';
      job.completedAt = Date.now();
      this.notify();
    }
  }

  public retryJob(jobId: string): void {
    const job = this.jobs.find(j => j.id === jobId);
    if (job && (job.status === 'FAILED' || job.status === 'CANCELLED')) {
      job.status = 'PENDING';
      job.progress = 0;
      job.error = undefined;
      this.notify();
    }
  }

  public clearQueue(): void {
    this.jobs = this.jobs.filter(j => j.status === 'RUNNING');
    this.notify();
  }

  public getNextPendingJob(): BenchmarkJob | undefined {
    return this.jobs.find(j => j.status === 'PENDING');
  }

  private notify(): void {
    this.listeners.forEach(l => l([...this.jobs], this.status));
  }
}
