import type { BenchmarkSession } from '../../benchmark/engine/types';

/**
 * Available formats for export.
 */
export type ExportFormat = 'csv' | 'json' | 'pdf' | 'png' | 'svg' | 'print';

/**
 * Detailed export configuration.
 */
export interface ExportConfiguration {
  format: ExportFormat;
  filename?: string;
  reportTitle?: string;
  includeCharts?: boolean;
  includeAlgorithms?: string[]; // IDs of algorithms to include (empty means all)
  theme?: 'light' | 'dark';
  paperSize?: 'a4' | 'letter';
  orientation?: 'portrait' | 'landscape';
  imageQuality?: number; // 0 to 1 for PNG/JPEG
}

/**
 * Subset of configuration exposed to the user in basic options.
 */
export interface ExportOptions {
  filename: string;
  format: ExportFormat;
  includeCharts: boolean;
}

/**
 * Enriched data model passed to export templates.
 */
export interface ReportData {
  session: BenchmarkSession;
  metadata: ReportMetadata;
  statistics: ReportStatistics;
}

export interface ReportMetadata {
  title: string;
  generatedAt: string;
  appVersion: string;
  format: ExportFormat;
}

export interface ReportStatistics {
  fastestAlgorithm: string;
  slowestAlgorithm: string;
  averageExecutionTimeMs: number;
  totalMemoryUsedBytes: number;
  totalComparisons: number;
  totalSwaps: number;
}

/**
 * Result returned by an export service.
 */
export interface ExportResult {
  success: boolean;
  format: ExportFormat;
  blob?: Blob;
  downloadUrl?: string;
  error?: string;
}

/**
 * Configuration for exporting a single chart to image.
 */
export interface ChartExportOptions {
  targetElementId: string;
  filename: string;
  format: 'png' | 'svg';
  scale?: number;
  transparentBackground?: boolean;
}

/**
 * Progress/status tracking for the UI.
 */
export interface ExportStatus {
  isExporting: boolean;
  progress: number; // 0 to 100
  step: string; // e.g. "Rendering charts", "Generating PDF"
  error: string | null;
}
