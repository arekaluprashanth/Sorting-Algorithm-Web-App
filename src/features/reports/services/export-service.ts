import { CSVExportService } from './csv-export';
import { JSONExportService } from './json-export';
import { ImageExportService } from './image-export';
import { PDFExportService } from './pdf-export';
import type { ExportConfiguration, ReportData, ExportResult, ChartExportOptions, ExportStatus } from '../types';

export class ExportService {
  private csvService = new CSVExportService();
  private jsonService = new JSONExportService();
  private imageService = new ImageExportService();
  private pdfService = new PDFExportService();

  /**
   * Main orchestrator for generating exports.
   * Dispatches to the correct underlying service based on the format.
   * Can optionally report progress via an onProgress callback.
   */
  async generateExport(
    data: ReportData,
    config: ExportConfiguration,
    chartElementIds: string[] = [],
    onProgress?: (status: ExportStatus) => void,
  ): Promise<ExportResult> {
    try {
      this.updateProgress(onProgress, 10, `Initializing ${config.format.toUpperCase()} export`);
      
      let result: ExportResult;
      
      // A tiny delay to allow React state to render the initial progress
      await new Promise(res => setTimeout(res, 50));

      switch (config.format) {
        case 'csv':
          this.updateProgress(onProgress, 50, 'Generating CSV data');
          result = await this.csvService.export(data, config.filename || 'export.csv');
          break;
          
        case 'json':
          this.updateProgress(onProgress, 50, 'Serializing JSON data');
          result = await this.jsonService.export(data, config.filename || 'export.json');
          break;
          
        case 'pdf':
          this.updateProgress(onProgress, 30, 'Preparing PDF document');
          // PDF might take a while if rendering charts
          if (config.includeCharts && chartElementIds.length > 0) {
            this.updateProgress(onProgress, 60, 'Rendering charts to images');
          } else {
            this.updateProgress(onProgress, 60, 'Writing PDF tables');
          }
          result = await this.pdfService.export(data, config, chartElementIds);
          break;
          
        case 'png':
        case 'svg':
          this.updateProgress(onProgress, 50, 'Capturing element');
          // For standalone image export, we expect chartElementIds to contain exactly 1 ID.
          const targetId = chartElementIds[0];
          if (!targetId) {
            throw new Error('No target element provided for image export.');
          }
          const imgOpts: ChartExportOptions = {
            targetElementId: targetId,
            format: config.format,
            filename: config.filename || `chart.${config.format}`,
          };
          result = await this.imageService.exportChart(imgOpts);
          break;
          
        case 'print':
          // Print is handled externally via window.print(), but we can return success
          result = { success: true, format: 'print' };
          break;
          
        default:
          throw new Error(`Unsupported export format: ${config.format}`);
      }

      this.updateProgress(onProgress, 100, 'Export complete');
      return result;
      
    } catch (error: any) {
      const errStatus: ExportStatus = {
        isExporting: false,
        progress: 0,
        step: 'Failed',
        error: error.message || 'Unknown export error',
      };
      onProgress?.(errStatus);
      
      return {
        success: false,
        format: config.format,
        error: error.message,
      };
    }
  }

  /**
   * Helper to download a generated Blob directly in the browser.
   */
  downloadBlob(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    this.downloadUrl(url, filename);
    // Cleanup
    setTimeout(() => URL.revokeObjectURL(url), 10000);
  }

  downloadUrl(url: string, filename: string): void {
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  private updateProgress(onProgress: ((status: ExportStatus) => void) | undefined, progress: number, step: string) {
    onProgress?.({
      isExporting: progress < 100,
      progress,
      step,
      error: null,
    });
  }
}
