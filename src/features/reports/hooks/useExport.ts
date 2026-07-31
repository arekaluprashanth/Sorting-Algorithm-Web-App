import { useState, useCallback, useRef } from 'react';
import type { ExportConfiguration, ExportResult, ExportStatus, ReportData, ReportMetadata, ReportStatistics } from '../types';
import type { BenchmarkSession } from '../../benchmark/engine/types';
import { ExportService } from '../services/export-service';

export function useExport() {
  const [status, setStatus] = useState<ExportStatus>({
    isExporting: false,
    progress: 0,
    step: '',
    error: null,
  });

  const exportService = useRef(new ExportService());

  /**
   * Helper to build the enriched ReportData required by the export service.
   */
  const buildReportData = useCallback((session: BenchmarkSession, config: ExportConfiguration): ReportData => {
    // Determine fastest/slowest
    let fastest = session.results[0]!;
    let slowest = session.results[0]!;
    let totalTime = 0;
    let totalMem = 0;
    let totalComps = 0;
    let totalSwaps = 0;

    session.results.forEach((r) => {
      if (r.executionTimeMs < fastest.executionTimeMs) fastest = r;
      if (r.executionTimeMs > slowest.executionTimeMs) slowest = r;
      totalTime += r.executionTimeMs;
      totalMem += r.memoryEstimateBytes;
      totalComps += r.comparisons;
      totalSwaps += r.swaps;
    });

    const statistics: ReportStatistics = {
      fastestAlgorithm: fastest.algorithmName,
      slowestAlgorithm: slowest.algorithmName,
      averageExecutionTimeMs: session.results.length > 0 ? totalTime / session.results.length : 0,
      totalMemoryUsedBytes: totalMem,
      totalComparisons: totalComps,
      totalSwaps: totalSwaps,
    };

    const metadata: ReportMetadata = {
      title: config.reportTitle || 'Sorting Benchmark Report',
      generatedAt: new Date().toLocaleString(),
      appVersion: '1.0.0', // Could be dynamic
      format: config.format,
    };

    return { session, metadata, statistics };
  }, []);

  /**
   * Trigger an export operation.
   */
  const startExport = useCallback(
    async (
      session: BenchmarkSession,
      config: ExportConfiguration,
      chartElementIds: string[] = []
    ): Promise<ExportResult> => {
      setStatus({ isExporting: true, progress: 0, step: 'Preparing data', error: null });

      const reportData = buildReportData(session, config);

      const result = await exportService.current.generateExport(
        reportData,
        config,
        chartElementIds,
        (s) => setStatus(s)
      );

      // Handle automatic download if successful (excluding print)
      if (result.success && result.blob && config.format !== 'print') {
        const ext = config.format === 'png' || config.format === 'svg' 
          ? config.format 
          : config.format;
        
        const filename = config.filename || `benchmark-${session.id.substring(0, 8)}.${ext}`;
        exportService.current.downloadBlob(result.blob, filename);
      }

      // Reset state after a brief delay if successful
      if (result.success) {
        setTimeout(() => {
          setStatus({ isExporting: false, progress: 0, step: '', error: null });
        }, 1500);
      }

      return result;
    },
    [buildReportData]
  );

  return {
    status,
    startExport,
  };
}
