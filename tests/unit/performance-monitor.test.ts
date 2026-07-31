import { describe, it, expect } from 'vitest';
import { PerformanceMonitor } from '../../src/features/benchmark/services/PerformanceMonitor';

describe('PerformanceMonitor Service', () => {
  it('should estimate RAM usage for a dataset size', () => {
    const metrics = PerformanceMonitor.estimateMemory(1000, 'O(1)');

    expect(metrics.datasetSize).toBe(1000);
    expect(metrics.estimatedDatasetMemoryBytes).toBe(8000); // 1000 * 8 bytes
    expect(metrics.isLargeDataset).toBe(false);
  });

  it('should flag large datasets >= 50,000 items', () => {
    const metrics = PerformanceMonitor.estimateMemory(100000, 'O(N)');

    expect(metrics.isLargeDataset).toBe(true);
    expect(metrics.estimatedAuxiliaryMemoryBytes).toBeGreaterThan(0);
  });

  it('should format byte counts correctly', () => {
    expect(PerformanceMonitor.formatBytes(0)).toBe('0 B');
    expect(PerformanceMonitor.formatBytes(1024)).toBe('1 KB');
    expect(PerformanceMonitor.formatBytes(1048576)).toBe('1 MB');
  });
});
