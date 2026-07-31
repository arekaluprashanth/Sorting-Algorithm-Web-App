import React, { useState } from 'react';
import { Shuffle, TrendingUp, TrendingDown, Copy, RefreshCw, Key } from 'lucide-react';
import type { DatasetConfig, DatasetType, DatasetTypeDescriptor } from '../types';
import { DATASET_TYPES } from '../constants';
import { DatasetPreview } from './DatasetPreview';
import { generateDataset } from '../generators';

interface DatasetConfigProps {
  onDatasetGenerated: (dataset: number[], config: DatasetConfig) => void;
}

const ICON_MAP = {
  Shuffle,
  TrendingUp,
  TrendingDown,
  Copy,
};

export const DatasetConfigComponent: React.FC<DatasetConfigProps> = ({ onDatasetGenerated }) => {
  const [size, setSize] = useState<number>(1000);
  const [type, setType] = useState<DatasetType>('random');
  const [min, setMin] = useState<number>(1);
  const [max, setMax] = useState<number>(10000);
  const [seed, setSeed] = useState<number | undefined>(12345);
  const [useSeed, setUseSeed] = useState<boolean>(false);
  const [previewData, setPreviewData] = useState<number[]>(() =>
    generateDataset({ size: 1000, type: 'random', min: 1, max: 10000, seed: 12345 })
  );

  const handleGenerate = () => {
    try {
      const config: DatasetConfig = {
        size,
        type,
        min,
        max,
        seed: useSeed ? seed : undefined,
      };

      const data = generateDataset(config);
      setPreviewData(data);
      onDatasetGenerated(data, config);
    } catch (error) {
      console.error('Failed to generate dataset:', error);
    }
  };

  return (
    <div className="glass-panel p-6 rounded-xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <h3 className="text-lg font-semibold text-white tracking-tight">Dataset Configuration</h3>
          <p className="text-xs text-neutral-400">Generate or customize input arrays for benchmarking</p>
        </div>
        <button
          onClick={handleGenerate}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs transition-all shadow-lg shadow-blue-600/20 active:scale-95 cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Generate Dataset</span>
        </button>
      </div>

      {/* Dataset Type Selector Cards */}
      <div className="space-y-2">
        <label className="text-xs font-mono text-neutral-400 uppercase tracking-wider">Distribution Type</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {DATASET_TYPES.map((item: DatasetTypeDescriptor) => {
            const Icon = ICON_MAP[item.iconName as keyof typeof ICON_MAP] || Shuffle;
            const isSelected = type === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setType(item.id)}
                className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-blue-600/20 border-blue-500 text-white shadow-md shadow-blue-500/10'
                    : 'bg-white/5 border-white/10 text-neutral-400 hover:bg-white/10 hover:text-neutral-200'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Icon className={`w-4 h-4 ${isSelected ? 'text-blue-400' : 'text-neutral-400'}`} />
                  <span className="text-xs font-semibold">{item.name}</span>
                </div>
                <p className="text-[11px] leading-tight line-clamp-2 opacity-80">{item.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Dataset Size & Range Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Size */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-mono text-neutral-400">
            <span>Size (n)</span>
            <span className="text-blue-400 font-semibold">{size.toLocaleString()}</span>
          </div>
          <input
            type="range"
            min={50}
            max={50000}
            step={50}
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
            className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
          <div className="flex justify-between text-[10px] text-neutral-500 font-mono">
            <span>50</span>
            <span>50,000</span>
          </div>
        </div>

        {/* Min */}
        <div className="space-y-1.5">
          <label className="text-xs font-mono text-neutral-400">Min Value</label>
          <input
            type="number"
            value={min}
            onChange={(e) => setMin(Number(e.target.value))}
            className="w-full px-3 py-1.5 bg-neutral-900 border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Max */}
        <div className="space-y-1.5">
          <label className="text-xs font-mono text-neutral-400">Max Value</label>
          <input
            type="number"
            value={max}
            onChange={(e) => setMax(Number(e.target.value))}
            className="w-full px-3 py-1.5 bg-neutral-900 border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* PRNG Seed Control */}
      <div className="flex items-center gap-4 pt-2 border-t border-white/10">
        <label className="flex items-center gap-2 text-xs font-mono text-neutral-300 cursor-pointer">
          <input
            type="checkbox"
            checked={useSeed}
            onChange={(e) => setUseSeed(e.target.checked)}
            className="rounded bg-neutral-900 border-white/20 text-blue-600 focus:ring-0"
          />
          <Key className="w-3.5 h-3.5 text-neutral-400" />
          <span>Enable Seeded PRNG (Deterministic Reproducibility)</span>
        </label>
        {useSeed && (
          <input
            type="number"
            value={seed ?? 12345}
            onChange={(e) => setSeed(Number(e.target.value))}
            placeholder="Seed value"
            className="w-32 px-3 py-1 bg-neutral-900 border border-white/10 rounded-lg text-xs text-white font-mono focus:outline-none focus:border-blue-500"
          />
        )}
      </div>

      {/* Visual Preview */}
      <DatasetPreview data={previewData} />
    </div>
  );
};
