import type { SortingMetrics } from '../types';
import { estimateMemory } from '../helpers';

/**
 * MetricsCollector — Stateful collector measuring precision metrics for an algorithm execution.
 */
export class MetricsCollector {
  private startTime = 0;
  private endTime = 0;
  private inputLength = 0;

  public comparisons = 0;
  public swaps = 0;
  public writes = 0;
  public reads = 0;
  public iterations = 0;
  public recursiveCalls = 0;
  public maxRecursionDepth = 0;
  public currentRecursionDepth = 0;
  public auxiliaryMemoryBytes = 0;

  constructor(inputLength = 0) {
    this.inputLength = inputLength;
  }

  /** Start timer */
  public start(): void {
    this.startTime = performance.now();
  }

  /** Stop timer */
  public stop(): void {
    this.endTime = performance.now();
  }

  /** Record a comparison */
  public compare(count = 1): void {
    this.comparisons += count;
  }

  /** Record a swap */
  public swap(count = 1): void {
    this.swaps += count;
    this.reads += count * 2;
    this.writes += count * 2;
  }

  /** Record array read operations */
  public read(count = 1): void {
    this.reads += count;
  }

  /** Record array write operations */
  public write(count = 1): void {
    this.writes += count;
  }

  /** Record loop iterations */
  public iterate(count = 1): void {
    this.iterations += count;
  }

  /** Track recursion entry */
  public enterRecursion(): void {
    this.recursiveCalls++;
    this.currentRecursionDepth++;
    if (this.currentRecursionDepth > this.maxRecursionDepth) {
      this.maxRecursionDepth = this.currentRecursionDepth;
    }
  }

  /** Track recursion exit */
  public exitRecursion(): void {
    this.currentRecursionDepth = Math.max(0, this.currentRecursionDepth - 1);
  }

  /** Add auxiliary memory buffer bytes */
  public addMemory(bytes: number): void {
    this.auxiliaryMemoryBytes += bytes;
  }

  /** Add auxiliary memory allocated for array length */
  public addMemoryForArrayLength(length: number): void {
    this.auxiliaryMemoryBytes += estimateMemory(length);
  }

  /** Compile final snapshot metrics */
  public snapshot(outputLength: number): SortingMetrics {
    const duration = this.endTime > 0 ? this.endTime - this.startTime : performance.now() - this.startTime;

    return {
      executionTimeMs: duration,
      comparisons: this.comparisons,
      swaps: this.swaps,
      writes: this.writes,
      reads: this.reads,
      iterations: this.iterations,
      recursiveCalls: this.recursiveCalls,
      maxRecursionDepth: this.maxRecursionDepth,
      estimatedMemoryBytes: this.auxiliaryMemoryBytes,
      inputSize: this.inputLength,
      outputSize: outputLength,
      timestamp: Date.now(),
    };
  }
}
