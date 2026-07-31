import type { ReportData, ExportResult } from '../types';

export class JSONExportService {
  /**
   * Serialises the full ReportData object into a downloadable JSON file.
   */
  async export(data: ReportData, _filename?: string): Promise<ExportResult> {
    try {
      const jsonString = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8;' });
      const url = URL.createObjectURL(blob);

      return {
        success: true,
        format: 'json',
        blob,
        downloadUrl: url,
      };
    } catch (error: any) {
      return {
        success: false,
        format: 'json',
        error: error.message || 'Failed to generate JSON export.',
      };
    }
  }
}
