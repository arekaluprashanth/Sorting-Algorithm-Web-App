import { describe, it, expect } from 'vitest';
import { getAllAlgorithms } from '../../src/features/benchmark/engine/algorithms';
import { createMetricsCollector } from '../../src/features/benchmark/engine/metrics-collector';

describe('Sorting Algorithm Implementations', () => {
  const algorithms = getAllAlgorithms();

  algorithms.forEach((algorithm) => {
    describe(`Algorithm: ${algorithm.name} (${algorithm.id})`, () => {
      it('should sort a standard unsorted array correctly', () => {
        const input = [5, 2, 9, 1, 5, 6];
        const collector = createMetricsCollector();
        const output = algorithm.sort([...input], collector);
        expect(output).toEqual([1, 2, 5, 5, 6, 9]);
      });

      it('should handle an empty array', () => {
        const input: number[] = [];
        const collector = createMetricsCollector();
        const output = algorithm.sort([...input], collector);
        expect(output).toEqual([]);
      });

      it('should handle a single element array', () => {
        const input = [42];
        const collector = createMetricsCollector();
        const output = algorithm.sort([...input], collector);
        expect(output).toEqual([42]);
      });

      it('should handle numeric arrays', () => {
        const input = algorithm.id === 'radix-sort' ? [3, 10, 5, 0, 7] : [-3, 10, -5, 0, 7];
        const collector = createMetricsCollector();
        const output = algorithm.sort([...input], collector);
        const expected = algorithm.id === 'radix-sort' ? [0, 3, 5, 7, 10] : [-5, -3, 0, 7, 10];
        expect(output).toEqual(expected);
      });

      it('should handle duplicate values', () => {
        const input = [4, 2, 4, 1, 2];
        const collector = createMetricsCollector();
        const output = algorithm.sort([...input], collector);
        expect(output).toEqual([1, 2, 2, 4, 4]);
      });

      it('should handle an already sorted array', () => {
        const input = [1, 2, 3, 4, 5];
        const collector = createMetricsCollector();
        const output = algorithm.sort([...input], collector);
        expect(output).toEqual([1, 2, 3, 4, 5]);
      });

      it('should handle a reverse sorted array', () => {
        const input = [5, 4, 3, 2, 1];
        const collector = createMetricsCollector();
        const output = algorithm.sort([...input], collector);
        expect(output).toEqual([1, 2, 3, 4, 5]);
      });

      it('should collect non-negative metrics during sorting', () => {
        const input = [3, 1, 4, 1, 5, 9, 2, 6];
        const collector = createMetricsCollector();
        algorithm.sort([...input], collector);
        const metrics = collector.getMetrics();

        expect(metrics.comparisons).toBeGreaterThanOrEqual(0);
        expect(metrics.swaps).toBeGreaterThanOrEqual(0);
        expect(metrics.memoryAllocations).toBeGreaterThanOrEqual(0);
        expect(metrics.peakMemoryElements).toBeGreaterThanOrEqual(0);
      });
    });
  });
});
