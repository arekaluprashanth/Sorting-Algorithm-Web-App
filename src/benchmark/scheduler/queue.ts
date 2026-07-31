import type { BenchmarkJob } from '../types';

/**
 * Manages the pending execution queue for Benchmark Engine.
 */
export class BenchmarkQueue {
  private queue: BenchmarkJob[] = [];

  public enqueue(job: BenchmarkJob): void {
    this.queue.push(job);
  }

  public enqueueMany(jobs: BenchmarkJob[]): void {
    this.queue.push(...jobs);
  }

  public dequeue(): BenchmarkJob | undefined {
    return this.queue.shift();
  }

  public get size(): number {
    return this.queue.length;
  }

  public clear(): void {
    this.queue = [];
  }

  public isEmpty(): boolean {
    return this.queue.length === 0;
  }
}
