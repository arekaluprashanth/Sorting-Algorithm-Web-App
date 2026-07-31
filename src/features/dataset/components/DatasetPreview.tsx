import React from 'react';
import { motion } from 'framer-motion';

interface DatasetPreviewProps {
  data: number[];
  maxHeight?: number;
}

export const DatasetPreview: React.FC<DatasetPreviewProps> = ({ data, maxHeight = 120 }) => {
  if (!data || data.length === 0) {
    return (
      <div
        className="w-full flex items-center justify-center border border-dashed border-white/10 rounded-lg text-neutral-500 text-xs font-mono"
        style={{ height: maxHeight }}
      >
        No dataset generated yet
      </div>
    );
  }

  // Downsample data if too large for visual preview
  const maxDisplayBars = 80;
  const step = Math.max(1, Math.floor(data.length / maxDisplayBars));
  const sampledData: number[] = [];

  for (let i = 0; i < data.length; i += step) {
    sampledData.push(data[i]!);
  }

  const maxVal = Math.max(...sampledData, 1);
  const minVal = Math.min(...sampledData, 0);
  const range = maxVal - minVal || 1;

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center text-[11px] font-mono text-neutral-400">
        <span>Dataset Distribution Preview</span>
        <span>{data.length.toLocaleString()} elements ({sampledData.length} bars shown)</span>
      </div>

      <div
        className="w-full glass-panel rounded-lg p-3 flex items-end justify-between gap-0.5 overflow-hidden"
        style={{ height: maxHeight }}
      >
        {sampledData.map((val, idx) => {
          const heightPercent = Math.max(8, ((val - minVal) / range) * 100);
          return (
            <motion.div
              key={idx}
              initial={{ height: 0 }}
              animate={{ height: `${heightPercent}%` }}
              transition={{ duration: 0.25, delay: idx * 0.002 }}
              className="flex-1 bg-gradient-to-t from-blue-600/60 to-indigo-400/90 rounded-t-[1px] hover:from-blue-400 hover:to-indigo-300 transition-colors"
              title={`Val: ${val}`}
            />
          );
        })}
      </div>
    </div>
  );
};
