import { describe, it, expect } from 'vitest';
import { runBenchmarkSession } from '../../src/features/benchmark/engine/benchmark-runner';
import type { BenchmarkConfig } from '../../src/features/benchmark/engine/types';

describe('Benchmark Runner Engine', () => {
  it('should run a complete benchmark session for multiple algorithms', () => {
    const config: BenchmarkConfig = {
      algorithmIds: ['quick-sort', 'merge-sort', 'heap-sort'],
      dataset: [5, 3, 8, 1, 9, 2],
      datasetType: 'random',
      warmupIterations: 1,
    };

    const session = runBenchmarkSession(config);

    expect(session.id).toBeDefined();
    expect(session.results).toHaveLength(3);
    expect(session.startedAt).toBeLessThanOrEqual(session.completedAt);

    session.results.forEach((result) => {
      expect(result.correct).toBe(true);
      expect(result.executionTimeMs).toBeGreaterThanOrEqual(0);
      expect(result.datasetSize).toBe(6);
    });
  });

  it('should not mutate original input dataset during benchmarking', () => {
    const originalDataset = [10, 4, 1, 7, 3];
    const originalCopy = [...originalDataset];

    runBenchmarkSession({
      algorithmIds: ['bubble-sort', 'quick-sort'],
      dataset: originalDataset,
      datasetType: 'random',
      warmupIterations: 1,
    });

    expect(originalDataset).toEqual(originalCopy);
  });
});
