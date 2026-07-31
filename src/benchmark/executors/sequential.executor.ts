import type { BenchmarkJob, BenchmarkResult } from '../types';
import { ExecutionContext } from '../engine/execution-context';
import { cloneDataset } from '../utils/dataset';
import { AlgorithmRegistry } from '../../features/algorithms/core/AlgorithmRegistry';
import { BenchmarkTimer } from '../metrics/timer';
import { calculateAverageMetrics, calculateStatistics } from '../metrics/statistics';
import type { SortingMetrics } from '../../features/algorithms/types';
import { logger } from '../core/logger';

export class SequentialExecutor {
  /**
   * Executes a single BenchmarkJob containing one algorithm.
   */
  public async execute(job: BenchmarkJob, context: ExecutionContext, onIterationProgress?: (iteration: number) => void): Promise<BenchmarkResult> {
    const { algorithmId, dataset, configuration } = job;
    const algorithmInfo = AlgorithmRegistry.getAllMetadata().find((m) => m.id === algorithmId);
    
    if (!algorithmInfo) {
      throw new Error(`Algorithm ${algorithmId} not found in registry.`);
    }

    const totalTimer = new BenchmarkTimer();
    totalTimer.start();
    
    // Warm-up runs
    for (let i = 0; i < configuration.warmUpRuns; i++) {
      if (context.isAborted) throw new Error('Aborted');
      
      const clone = cloneDataset(dataset);
      // Run it but discard the metrics
      AlgorithmRegistry.run(algorithmId, clone);
      
      // Small yield to UI every run
      await context.yieldThread(configuration.delayBetweenRunsMs);
    }

    const runMetrics: SortingMetrics[] = [];
    let error: string | undefined;

    // Measured runs
    for (let i = 0; i < configuration.measuredRuns; i++) {
      if (context.isAborted) throw new Error('Aborted');

      if (onIterationProgress) {
        onIterationProgress(i + 1);
      }

      const clone = cloneDataset(dataset);
      
      try {
        const result = AlgorithmRegistry.run(algorithmId, clone);
        if (!result.success) {
          throw new Error(result.error ?? 'Unknown sorting error');
        }
        runMetrics.push(result.metrics);
      } catch (err) {
        error = err instanceof Error ? err.message : String(err);
        logger.error(`Execution failed for ${algorithmId} at iteration ${i}`, err);
        break; // Stop iterations on error
      }

      await context.yieldThread(configuration.delayBetweenRunsMs);
    }

    const totalElapsedMs = totalTimer.stop();
    const success = error === undefined && runMetrics.length > 0;
    
    let statistics;
    let metrics;

    if (success) {
      statistics = calculateStatistics(runMetrics);
      metrics = calculateAverageMetrics(runMetrics);
    }

    return {
      algorithmId,
      algorithmInfo,
      success,
      statistics,
      metrics,
      runMetrics,
      error,
      totalElapsedMs,
    };
  }
}
