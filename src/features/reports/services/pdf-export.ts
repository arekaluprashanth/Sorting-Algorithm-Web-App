import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import type { ReportData, ExportResult, ExportConfiguration } from '../types';

export class PDFExportService {
  /**
   * Generates a multi-page PDF document.
   * This service builds the PDF programmatically for text/tables, 
   * and can embed snapshots of charts via html2canvas.
   */
  async export(
    data: ReportData,
    config: ExportConfiguration,
    chartElementIds: string[] = [],
  ): Promise<ExportResult> {
    try {
      const orientation = config.orientation === 'landscape' ? 'l' : 'p';
      const doc = new jsPDF({
        orientation,
        unit: 'mm',
        format: config.paperSize === 'letter' ? 'letter' : 'a4',
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 15;
      let yPos = margin;

      const addHeader = () => {
        doc.setFontSize(22);
        doc.setTextColor(33, 33, 33);
        doc.text(config.reportTitle || 'Benchmark Report', margin, yPos);
        yPos += 10;
        
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text(`Generated: ${data.metadata.generatedAt}`, margin, yPos);
        doc.text(`v${data.metadata.appVersion}`, pageWidth - margin - 20, yPos);
        yPos += 15;
        
        doc.setDrawColor(200, 200, 200);
        doc.line(margin, yPos, pageWidth - margin, yPos);
        yPos += 10;
      };

      const checkPageBreak = (neededSpace: number) => {
        if (yPos + neededSpace > pageHeight - margin) {
          doc.addPage();
          yPos = margin;
          addHeader();
        }
      };

      // 1. Initial Header
      addHeader();

      // 2. Summary & Stats
      doc.setFontSize(14);
      doc.setTextColor(50, 50, 50);
      doc.text('Summary', margin, yPos);
      yPos += 8;

      doc.setFontSize(11);
      doc.setTextColor(80, 80, 80);
      const { session, statistics } = data;
      
      const statsLeft = [
        `Dataset Type: ${session.config.datasetType}`,
        `Dataset Size: ${session.config.datasetSize.toLocaleString()}`,
        `Algorithms Tested: ${session.results.length}`,
      ];
      
      const statsRight = [
        `Fastest: ${statistics.fastestAlgorithm}`,
        `Slowest: ${statistics.slowestAlgorithm}`,
        `Avg Time: ${statistics.averageExecutionTimeMs.toFixed(2)} ms`,
      ];

      statsLeft.forEach((text, i) => {
        doc.text(text, margin, yPos + (i * 6));
      });
      statsRight.forEach((text, i) => {
        doc.text(text, pageWidth / 2, yPos + (i * 6));
      });
      
      yPos += 30;

      // 3. Algorithm Data Table (Simple manual table for dependency reduction)
      checkPageBreak(50);
      doc.setFontSize(14);
      doc.setTextColor(50, 50, 50);
      doc.text('Algorithm Metrics', margin, yPos);
      yPos += 8;

      const headers = ['Algorithm', 'Time (ms)', 'Comps', 'Swaps', 'Memory'];
      const colWidths = [45, 30, 30, 30, 30];
      
      // Table Header
      doc.setFontSize(10);
      doc.setTextColor(255, 255, 255);
      doc.setFillColor(59, 130, 246); // Blue-500
      doc.rect(margin, yPos, pageWidth - (margin * 2), 8, 'F');
      
      let xOffset = margin + 2;
      headers.forEach((h, i) => {
        doc.text(h, xOffset, yPos + 6);
        xOffset += colWidths[i]!;
      });
      yPos += 10;

      // Table Rows
      doc.setTextColor(80, 80, 80);
      session.results.forEach((r, idx) => {
        checkPageBreak(15);
        if (idx % 2 === 0) {
          doc.setFillColor(245, 245, 245);
          doc.rect(margin, yPos - 2, pageWidth - (margin * 2), 8, 'F');
        }
        
        let cx = margin + 2;
        doc.text(r.algorithmName.substring(0, 20), cx, yPos + 4);
        cx += colWidths[0]!;
        doc.text(r.executionTimeMs.toFixed(2), cx, yPos + 4);
        cx += colWidths[1]!;
        doc.text(r.comparisons.toLocaleString(), cx, yPos + 4);
        cx += colWidths[2]!;
        doc.text(r.swaps.toLocaleString(), cx, yPos + 4);
        cx += colWidths[3]!;
        doc.text((r.memoryEstimateBytes / 1024).toFixed(2) + ' KB', cx, yPos + 4);
        
        yPos += 8;
      });
      yPos += 15;

      // 4. Capture & Embed Charts (if requested)
      if (config.includeCharts && chartElementIds.length > 0) {
        checkPageBreak(30);
        doc.setFontSize(14);
        doc.setTextColor(50, 50, 50);
        doc.text('Performance Charts', margin, yPos);
        yPos += 10;

        for (const id of chartElementIds) {
          const el = document.getElementById(id);
          if (el) {
            checkPageBreak(100);
            try {
              const canvas = await html2canvas(el, { scale: 2, logging: false });
              const imgData = canvas.toDataURL('image/png');
              
              // Calculate aspect ratio to fit within margins
              const imgWidth = pageWidth - (margin * 2);
              const imgHeight = (canvas.height * imgWidth) / canvas.width;
              
              doc.addImage(imgData, 'PNG', margin, yPos, imgWidth, imgHeight);
              yPos += imgHeight + 15;
            } catch (err) {
              console.warn(`Failed to capture chart ${id} for PDF`, err);
            }
          }
        }
      }

      // Add Footer with page numbers
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(9);
        doc.setTextColor(150, 150, 150);
        doc.text(
          `Page ${i} of ${pageCount}`,
          pageWidth / 2,
          pageHeight - 10,
          { align: 'center' }
        );
      }

      const blob = doc.output('blob');
      
      return {
        success: true,
        format: 'pdf',
        blob,
        downloadUrl: URL.createObjectURL(blob),
      };
    } catch (error: any) {
      return {
        success: false,
        format: 'pdf',
        error: error.message || 'Failed to generate PDF export.',
      };
    }
  }
}
