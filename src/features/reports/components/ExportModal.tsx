import React, { useState } from 'react';
import { Download, FileText, FileJson, Image, Printer, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { Modal } from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';
import { Select } from '../../../components/ui/Select';
import { Input } from '../../../components/ui/Input';
import type { BenchmarkSession } from '../../benchmark/engine/types';
import type { ExportFormat, ExportConfiguration } from '../types';
import { useExport } from '../hooks/useExport';

interface ExportModalProps {
  session: BenchmarkSession;
  isOpen: boolean;
  onClose: () => void;
  /** IDs of DOM elements containing charts to export, e.g., ['chart-execution-time', 'chart-memory'] */
  chartElementIds?: string[]; 
}

const FORMAT_OPTIONS: { value: ExportFormat; label: string; icon: React.FC<any>; description: string }[] = [
  { value: 'csv', label: 'CSV Spreadsheet', icon: FileText, description: 'Raw metrics for Excel or Google Sheets' },
  { value: 'json', label: 'JSON Data', icon: FileJson, description: 'Complete raw data dump for API or backups' },
  { value: 'pdf', label: 'PDF Report', icon: FileText, description: 'Professional, paginated document' },
  { value: 'png', label: 'PNG Image', icon: Image, description: 'Export the primary chart as a high-res image' },
  { value: 'svg', label: 'SVG Vector', icon: Image, description: 'Export chart as scalable vector graphics' },
  { value: 'print', label: 'Printable HTML', icon: Printer, description: 'Format for physical printing via browser' },
];

export const ExportModal: React.FC<ExportModalProps> = ({ session, isOpen, onClose, chartElementIds = [] }) => {
  const { status, startExport } = useExport();
  
  const [config, setConfig] = useState<ExportConfiguration>({
    format: 'pdf',
    filename: `benchmark-${session.id.substring(0, 8)}`,
    reportTitle: 'Benchmark Report',
    includeCharts: true,
    paperSize: 'a4',
    orientation: 'portrait',
  });

  const handleExport = async () => {
    if (config.format === 'print') {
      // For print, we just trigger the browser's native print dialog.
      // We assume there is a PrintableReport component rendered somewhere with @media print CSS.
      window.print();
      return;
    }

    await startExport(session, config, chartElementIds);
  };

  const selectedFormatDef = FORMAT_OPTIONS.find((f) => f.value === config.format);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Export Benchmark Results" className="max-w-2xl">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Column: Format Selection */}
        <div className="md:col-span-1 space-y-3">
          <h4 className="text-sm font-semibold text-white mb-2">Export Format</h4>
          {FORMAT_OPTIONS.map((fmt) => (
            <button
              key={fmt.value}
              onClick={() => setConfig((prev) => ({ ...prev, format: fmt.value }))}
              className={`w-full flex items-center gap-3 p-3 rounded-lg border text-left transition-all ${
                config.format === fmt.value
                  ? 'border-blue-500 bg-blue-500/10 ring-1 ring-blue-500/30'
                  : 'border-white/10 hover:border-white/20 bg-black/40'
              }`}
            >
              <fmt.icon className={`w-5 h-5 ${config.format === fmt.value ? 'text-blue-400' : 'text-neutral-500'}`} />
              <div>
                <div className={`text-sm font-medium ${config.format === fmt.value ? 'text-white' : 'text-neutral-300'}`}>
                  {fmt.label}
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Right Column: Configuration & Status */}
        <div className="md:col-span-2 space-y-6">
          <div className="glass-panel p-4 rounded-xl border border-white/5 space-y-4">
            <div>
              <h4 className="text-sm font-semibold text-white">Configuration</h4>
              <p className="text-xs text-neutral-400 mb-3">{selectedFormatDef?.description}</p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs text-neutral-400 mb-1">Filename</label>
                <div className="flex items-center gap-2">
                  <Input
                    value={config.filename}
                    onChange={(e) => setConfig((prev) => ({ ...prev, filename: e.target.value }))}
                    className="flex-1"
                  />
                  <span className="text-sm text-neutral-500 font-mono">
                    .{config.format === 'print' ? 'pdf' : config.format}
                  </span>
                </div>
              </div>

              {config.format === 'pdf' && (
                <>
                  <div>
                    <label className="block text-xs text-neutral-400 mb-1">Report Title</label>
                    <Input
                      value={config.reportTitle}
                      onChange={(e) => setConfig((prev) => ({ ...prev, reportTitle: e.target.value }))}
                    />
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <label className="text-sm text-neutral-300">Include Charts</label>
                    <input
                      type="checkbox"
                      checked={config.includeCharts}
                      onChange={(e) => setConfig((prev) => ({ ...prev, includeCharts: e.target.checked }))}
                      className="w-4 h-4 rounded border-white/20 bg-black/40 accent-blue-500"
                    />
                  </div>
                </>
              )}

              {(config.format === 'pdf' || config.format === 'print') && (
                <div className="grid grid-cols-2 gap-3 mt-4">
                  <div>
                    <label className="block text-xs text-neutral-400 mb-1">Paper Size</label>
                    <Select
                      options={[{ value: 'a4', label: 'A4' }, { value: 'letter', label: 'Letter' }]}
                      value={config.paperSize!}
                      onChange={(e) => setConfig((prev) => ({ ...prev, paperSize: e.target.value as any }))}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-neutral-400 mb-1">Orientation</label>
                    <Select
                      options={[{ value: 'portrait', label: 'Portrait' }, { value: 'landscape', label: 'Landscape' }]}
                      value={config.orientation!}
                      onChange={(e) => setConfig((prev) => ({ ...prev, orientation: e.target.value as any }))}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Export Action & Status */}
          <div className="pt-2">
            {status.isExporting ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-blue-400 flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {status.step}...
                  </span>
                  <span className="font-mono text-neutral-400">{status.progress}%</span>
                </div>
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 rounded-full transition-all duration-300"
                    style={{ width: `${status.progress}%` }}
                  />
                </div>
              </div>
            ) : status.error ? (
              <div className="flex items-center gap-2 text-sm text-rose-400 bg-rose-500/10 p-3 rounded-lg">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span className="truncate">{status.error}</span>
              </div>
            ) : status.progress === 100 ? (
              <div className="flex items-center gap-2 text-sm text-emerald-400 bg-emerald-500/10 p-3 rounded-lg">
                <CheckCircle2 className="w-4 h-4" />
                Export completed successfully
              </div>
            ) : (
              <div className="flex justify-end gap-3">
                <Button variant="ghost" onClick={onClose}>Cancel</Button>
                <Button variant="primary" onClick={handleExport} className="gap-2">
                  <Download className="w-4 h-4" />
                  {config.format === 'print' ? 'Open Print Dialog' : 'Export File'}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};
