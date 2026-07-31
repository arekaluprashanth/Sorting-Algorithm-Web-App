export interface PerformanceMetricsSnapshot {
  datasetSize: number;
  estimatedDatasetMemoryBytes: number;
  estimatedAuxiliaryMemoryBytes: number;
  totalMemoryEstimateBytes: number;
  throughputOpsPerSec: number;
  cpuTimeEstimateMs: number;
  isLargeDataset: boolean;
}

export class PerformanceMonitor {
  private static BYTES_PER_NUMBER = 8; // JS Float64 standard

  /**
   * Estimates memory usage for a dataset size and algorithm space complexity.
   *
   * @param size - Dataset element count (e.g. 100 to 1,000,000)
   * @param spaceComplexity - Optional Big-O space string (e.g. "O(N)", "O(1)")
   */
  public static estimateMemory(size: number, spaceComplexity: string = 'O(1)'): PerformanceMetricsSnapshot {
    const rawDatasetBytes = size * this.BYTES_PER_NUMBER;
    let auxFactor = 0;

    if (spaceComplexity.includes('O(n)') || spaceComplexity.includes('O(N)')) {
      auxFactor = 1.0;
    } else if (spaceComplexity.includes('log')) {
      auxFactor = 0.1;
    }

    const estimatedAuxBytes = Math.round(rawDatasetBytes * auxFactor);
    const totalMemoryBytes = rawDatasetBytes + estimatedAuxBytes;

    return {
      datasetSize: size,
      estimatedDatasetMemoryBytes: rawDatasetBytes,
      estimatedAuxiliaryMemoryBytes: estimatedAuxBytes,
      totalMemoryEstimateBytes: totalMemoryBytes,
      throughputOpsPerSec: 0,
      cpuTimeEstimateMs: 0,
      isLargeDataset: size >= 50000,
    };
  }

  /**
   * Formats bytes into a human readable string (KB, MB, GB).
   */
  public static formatBytes(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}
