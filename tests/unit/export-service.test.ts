import { describe, it, expect } from 'vitest';
import { CSVExportService } from '../../src/features/reports/services/csv-export';
import { JSONExportService } from '../../src/features/reports/services/json-export';
import type { BenchmarkSession } from '../../src/features/benchmark/engine/types';
import type { ReportData } from '../../src/features/reports/types';

describe('Export Services', () => {
  const sampleSession: BenchmarkSession = {
    id: 'export-session-1',
    startedAt: 1000,
    completedAt: 2000,
    config: {
      algorithmIds: ['quick-sort'],
      datasetSize: 100,
      datasetType: 'random',
      warmupIterations: 1,
    },
    results: [
      {
        algorithmId: 'quick-sort',
        algorithmName: 'Quick Sort',
        datasetSize: 100,
        datasetType: 'random',
        executionTimeMs: 1.5,
        comparisons: 500,
        swaps: 200,
        memoryEstimateBytes: 800,
        maxRecursionDepth: 10,
        correct: true,
        timestamp: 1000,
      },
    ],
  };

  const sampleReportData: ReportData = {
    session: sampleSession,
    metadata: {
      title: 'Test Report',
      description: 'Report description',
      generatedAt: new Date().toISOString(),
      appVersion: '1.0.0',
    },
    statistics: {
      totalAlgorithms: 1,
      totalDatasetSize: 100,
      fastestAlgorithm: 'Quick Sort',
      slowestAlgorithm: 'Quick Sort',
      averageExecutionTimeMs: 1.5,
      totalMemoryUsedBytes: 800,
      totalComparisons: 500,
      totalSwaps: 200,
    },
  };

  it('should generate valid CSV export result', async () => {
    const csvService = new CSVExportService();
    const result = await csvService.export(sampleReportData, 'test.csv');

    expect(result.success).toBe(true);
    expect(result.format).toBe('csv');
    expect(result.blob).toBeDefined();
  });

  it('should generate valid JSON export result', async () => {
    const jsonService = new JSONExportService();
    const result = await jsonService.export(sampleReportData, 'test.json');

    expect(result.success).toBe(true);
    expect(result.format).toBe('json');
    expect(result.blob).toBeDefined();
  });
});
