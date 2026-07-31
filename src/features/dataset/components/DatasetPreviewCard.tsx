import React, { useState } from 'react';
import { Eye, Layers, Copy, Check } from 'lucide-react';
import { Modal } from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { EmptyState } from '../../../components/error/EmptyState';
import { copyToClipboard } from '../../../utils/helpers';
import { toast } from '../../../components/ui/Toast';

export interface DatasetPreviewCardProps {
  data: number[];
}

export const DatasetPreviewCard: React.FC<DatasetPreviewCardProps> = ({ data }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!data || data.length === 0) {
    return (
      <EmptyState
        title="No Dataset Generated"
        description="Configure parameters on the panel and click 'Generate Dataset' to preview values and statistics."
        icon={Layers}
      />
    );
  }

  const first20 = data.slice(0, 20);
  const last20 = data.length > 20 ? data.slice(-20) : [];
  const middleCount = Math.max(0, data.length - 40);

  const handleCopyAll = async () => {
    const success = await copyToClipboard(data.join(', '));
    if (success) {
      setCopied(true);
      toast.success(`Copied ${data.length.toLocaleString()} elements to clipboard!`);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4 font-mono text-xs">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <h4 className="font-semibold text-sm text-white tracking-tight">Dataset Elements Preview</h4>
          <Badge variant="info">{data.length.toLocaleString()} Elements</Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" leftIcon={copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />} onClick={handleCopyAll}>
            {copied ? 'Copied' : 'Copy CSV'}
          </Button>
          <Button variant="outline" size="sm" leftIcon={<Eye className="w-3.5 h-3.5" />} onClick={() => setIsModalOpen(true)}>
            View All ({data.length.toLocaleString()})
          </Button>
        </div>
      </div>

      {/* First 20 Elements */}
      <div className="space-y-1.5">
        <span className="text-[11px] text-neutral-400">First 20 Elements (Indices 0..19):</span>
        <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-3 rounded-xl bg-black/40 border border-white/10">
          {first20.map((val, idx) => (
            <span key={idx} className="px-2 py-1 rounded bg-white/5 text-blue-300 border border-white/10 text-[11px]">
              <span className="text-neutral-500 mr-1">[{idx}]</span>
              {val}
            </span>
          ))}
        </div>
      </div>

      {/* Middle Truncation Indicator */}
      {middleCount > 0 && (
        <div className="text-center py-1 text-neutral-500 text-[11px]">
          ... {middleCount.toLocaleString()} elements omitted for preview ...
        </div>
      )}

      {/* Last 20 Elements */}
      {last20.length > 0 && (
        <div className="space-y-1.5">
          <span className="text-[11px] text-neutral-400">Last 20 Elements (Indices {data.length - last20.length}..{data.length - 1}):</span>
          <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-3 rounded-xl bg-black/40 border border-white/10">
            {last20.map((val, idx) => {
              const actualIdx = data.length - last20.length + idx;
              return (
                <span key={actualIdx} className="px-2 py-1 rounded bg-white/5 text-purple-300 border border-white/10 text-[11px]">
                  <span className="text-neutral-500 mr-1">[{actualIdx}]</span>
                  {val}
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* Full Array Inspection Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Full Dataset Inspection (${data.length.toLocaleString()} items)`}
        description="Scrollable view of all elements in the dataset array"
        className="max-w-3xl"
      >
        <div className="max-h-96 overflow-y-auto p-4 rounded-xl bg-black/60 border border-white/10 flex flex-wrap gap-1.5 font-mono text-xs">
          {data.slice(0, 5000).map((val, idx) => (
            <span key={idx} className="px-2 py-0.5 rounded bg-white/5 text-neutral-200 border border-white/10 text-[11px]">
              <span className="text-neutral-500 mr-1">#{idx}</span>
              {val}
            </span>
          ))}
          {data.length > 5000 && (
            <div className="w-full text-center py-3 text-amber-400 text-xs">
              Showing first 5,000 items out of {data.length.toLocaleString()} total items for rendering speed.
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};
