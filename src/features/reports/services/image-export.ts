import html2canvas from 'html2canvas';
import type { ChartExportOptions, ExportResult } from '../types';

export class ImageExportService {
  /**
   * Exports a specific DOM element (like a chart) to PNG or SVG.
   * For SVG, if the element contains an actual <svg>, it will attempt to extract it.
   */
  async exportChart(options: ChartExportOptions): Promise<ExportResult> {
    try {
      const element = document.getElementById(options.targetElementId);
      if (!element) {
        throw new Error(`Element with id "${options.targetElementId}" not found.`);
      }

      if (options.format === 'svg') {
        return this.exportSVG(element);
      } else {
        return this.exportPNG(element, options);
      }
    } catch (error: any) {
      return {
        success: false,
        format: options.format,
        error: error.message || `Failed to export ${options.format.toUpperCase()}.`,
      };
    }
  }

  private async exportPNG(element: HTMLElement, options: ChartExportOptions): Promise<ExportResult> {
    const canvas = await html2canvas(element, {
      scale: options.scale || 2,
      backgroundColor: options.transparentBackground ? null : '#09090b', // fallback to app dark bg
      logging: false,
    });

    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error('Canvas to Blob conversion failed.'));
          return;
        }
        resolve({
          success: true,
          format: 'png',
          blob,
          downloadUrl: URL.createObjectURL(blob),
        });
      }, 'image/png');
    });
  }

  private async exportSVG(element: HTMLElement): Promise<ExportResult> {
    // Recharts renders SVGs inside responsive containers.
    // We try to find the actual <svg> tag.
    const svgElement = element.tagName.toLowerCase() === 'svg' ? element : element.querySelector('svg');

    if (!svgElement) {
      throw new Error('No SVG element found inside the target container.');
    }

    // Clone the SVG so we can modify it safely
    const clone = svgElement.cloneNode(true) as SVGSVGElement;
    
    // Ensure XML namespace is present
    if (!clone.getAttribute('xmlns')) {
      clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    }

    // Serialize to string
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(clone);

    const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });

    return {
      success: true,
      format: 'svg',
      blob,
      downloadUrl: URL.createObjectURL(blob),
    };
  }
}
