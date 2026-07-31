import type { ReportData, ExportResult } from '../types';

export class CSVExportService {
  /**
   * Generates a CSV string and returns an ExportResult containing a Blob.
   */
  async export(data: ReportData, _filename?: string): Promise<ExportResult> {
    try {
      const csvContent = this.generateCSVString(data);
      // Ensure UTF-8 with BOM for Excel compatibility
      const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);

      return {
        success: true,
        format: 'csv',
        blob,
        downloadUrl: url,
      };
    } catch (error: any) {
      return {
        success: false,
        format: 'csv',
        error: error.message || 'Failed to generate CSV export.',
      };
    }
  }

  private generateCSVString(data: ReportData): string {
    const { session, metadata, statistics } = data;
    const lines: string[] = [];

    // --- Header Section ---
    lines.push(`Report Title,${this.escapeCell(metadata.title)}`);
    lines.push(`Generated At,${metadata.generatedAt}`);
    lines.push(`App Version,${metadata.appVersion}`);
    lines.push(`Session ID,${session.id}`);
    lines.push(''); // blank line

    // --- Dataset Info ---
    lines.push('--- Dataset Configuration ---');
    lines.push('Type,Size');
    lines.push(
      `${session.config.datasetType},"${session.config.datasetSizes.join(',')}"`,
    );
    lines.push('');

    // --- Statistics ---
    lines.push('--- Overall Statistics ---');
    lines.push(`Fastest Algorithm,${statistics.fastestAlgorithm}`);
    lines.push(`Slowest Algorithm,${statistics.slowestAlgorithm}`);
    lines.push(`Average Execution Time (ms),${statistics.averageExecutionTimeMs.toFixed(2)}`);
    lines.push(`Total Memory Used (bytes),${statistics.totalMemoryUsedBytes}`);
    lines.push(`Total Comparisons,${statistics.totalComparisons}`);
    lines.push(`Total Swaps,${statistics.totalSwaps}`);
    lines.push('');

    // --- Algorithm Results ---
    lines.push('--- Algorithm Results ---');
    lines.push(
      'Algorithm,Execution Time (ms),Comparisons,Swaps,Memory Estimate (bytes),Correct',
    );

    for (const result of session.results) {
      lines.push(
        [
          this.escapeCell(result.algorithmName),
          result.executionTimeMs.toFixed(4),
          result.comparisons,
          result.swaps,
          result.memoryEstimateBytes,
          result.correct ? 'Yes' : 'No',
        ].join(','),
      );
    }

    return lines.join('\n');
  }

  /**
   * Escapes a CSV cell if it contains quotes, commas, or newlines.
   */
  private escapeCell(value: string | number): string {
    const str = String(value);
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  }
}
