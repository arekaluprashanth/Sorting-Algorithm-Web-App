import React from 'react';
import { Download } from 'lucide-react';
import { Modal } from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';
import { AnalyticsDashboard } from '../../analytics/components';
import { Badge } from '../../../components/ui/Badge';
import { ExportModal, PrintableReport } from '../../reports';
import type { HistorySession } from '../types';

interface SessionDetailModalProps {
  entry: HistorySession | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateNotes: (id: string, notes: string) => void;
}

export const SessionDetailModal: React.FC<SessionDetailModalProps> = ({
  entry,
  isOpen,
  onClose,
  onUpdateNotes,
}) => {
  const [isExportOpen, setIsExportOpen] = React.useState(false);

  if (!entry) return null;

  const { session } = entry;
  const date = new Date(entry.createdAt);

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title={entry.name} className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <div className="absolute top-4 right-12 pr-4 flex items-center">
          <Button variant="outline" size="sm" onClick={() => setIsExportOpen(true)} className="gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>

        {/* Metadata Section */}
      <div className="flex flex-wrap items-center gap-2 mb-4 pb-4 border-b border-white/10">
        <Badge variant="info">{session.config.datasetType}</Badge>
        <Badge variant="default">{session.config.datasetSize.toLocaleString()} items</Badge>
        <Badge variant="default">{session.results.length} algorithms</Badge>
        <span className="text-[10px] font-mono text-neutral-500 ml-auto">
          {date.toLocaleDateString()} {date.toLocaleTimeString()}
        </span>
      </div>

      {/* Notes */}
      <div className="mb-6">
        <label className="block text-xs font-mono text-neutral-400 mb-2">Session Notes</label>
        <textarea
          value={entry.notes}
          onChange={(e) => onUpdateNotes(session.id, e.target.value)}
          placeholder="Add notes about this benchmark session..."
          className="w-full h-20 bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
        />
      </div>

        {/* Reuse the Analytics Dashboard from Phase 6 */}
        <AnalyticsDashboard session={session} />
      </Modal>

      {/* Export Modal */}
      {isExportOpen && (
        <ExportModal
          session={session}
          isOpen={isExportOpen}
          onClose={() => setIsExportOpen(false)}
          // Provide IDs of charts that the export service can capture via html2canvas
          chartElementIds={['chart-execution-time', 'chart-operations']} 
        />
      )}

      {/* Print-only layout */}
      <PrintableReport session={session} />
    </>
  );
};
