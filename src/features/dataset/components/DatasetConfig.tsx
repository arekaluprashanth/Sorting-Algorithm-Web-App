import React, { useState } from 'react';
import { Shuffle, TrendingUp, TrendingDown, Copy, RefreshCw, Key } from 'lucide-react';
import type { DatasetConfig, DatasetType, DatasetTypeDescriptor } from '../types';
import { DATASET_TYPES } from '../constants';
import { DatasetPreview } from './DatasetPreview';
import { generateDataset } from '../generators';

interface DatasetConfigProps {
  onDatasetGenerated: (dataset: number[], config: DatasetConfig, datasetSizes: number[]) => void;
}

const ICON_MAP = {
  Shuffle,
  TrendingUp,
  TrendingDown,
  Copy,
};

export const DatasetConfigComponent: React.FC<DatasetConfigProps> = ({ onDatasetGenerated }) => {
  const [sizeMode, setSizeMode] = useState<'single' | 'multiple' | 'range'>('single');
  const [size, setSize] = useState<number>(1000);
  const [multipleSizesText, setMultipleSizesText] = useState<string>('1000, 5000, 10000');
  const [rangeStart, setRangeStart] = useState<number>(1000);
  const [rangeEnd, setRangeEnd] = useState<number>(10000);
  const [rangeStep, setRangeStep] = useState<number>(1000);

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
      let datasetSizes: number[] = [];
      if (sizeMode === 'single') {
        datasetSizes = [size];
      } else if (sizeMode === 'multiple') {
        datasetSizes = multipleSizesText
          .split(',')
          .map((s) => parseInt(s.trim(), 10))
          .filter((s) => !isNaN(s) && s > 0);
        if (datasetSizes.length === 0) datasetSizes = [1000];
      } else if (sizeMode === 'range') {
        for (let s = rangeStart; s <= rangeEnd; s += rangeStep) {
          datasetSizes.push(s);
        }
        if (datasetSizes.length === 0) datasetSizes = [1000];
      }

      const previewSize = datasetSizes[0] || 1000;

      const config: DatasetConfig = {
        size: previewSize, // Used just for the preview in the config type
        type,
        min,
        max,
        seed: useSeed ? seed : undefined,
      };

      const data = generateDataset(config);
      setPreviewData(data);
      onDatasetGenerated(data, config, datasetSizes);
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
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-12 space-y-3">
          <div className="flex items-center gap-4 border-b border-white/10 pb-2">
            <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider">Input Size Mode</span>
            <div className="flex gap-2 bg-neutral-900 p-1 rounded-lg">
              <button
                onClick={() => setSizeMode('single')}
                className={`px-3 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
                  sizeMode === 'single' ? 'bg-blue-600 text-white' : 'text-neutral-400 hover:text-white'
                }`}
              >
                Single
              </button>
              <button
                onClick={() => setSizeMode('multiple')}
                className={`px-3 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
                  sizeMode === 'multiple' ? 'bg-blue-600 text-white' : 'text-neutral-400 hover:text-white'
                }`}
              >
                Multiple
              </button>
              <button
                onClick={() => setSizeMode('range')}
                className={`px-3 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
                  sizeMode === 'range' ? 'bg-blue-600 text-white' : 'text-neutral-400 hover:text-white'
                }`}
              >
                Range
              </button>
            </div>
          </div>

          <div className="bg-white/5 p-4 rounded-xl border border-white/10">
            {sizeMode === 'single' && (
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono text-neutral-400">
                  <span>Size (n)</span>
                  <span className="text-blue-400 font-semibold">{size.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min={50}
                  max={100000}
                  step={50}
                  value={size}
                  onChange={(e) => setSize(Number(e.target.value))}
                  className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                <div className="flex justify-between text-[10px] text-neutral-500 font-mono">
                  <span>50</span>
                  <span>100,000</span>
                </div>
              </div>
            )}
            {sizeMode === 'multiple' && (
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-neutral-400">Comma-separated sizes</label>
                <input
                  type="text"
                  value={multipleSizesText}
                  onChange={(e) => setMultipleSizesText(e.target.value)}
                  placeholder="e.g. 100, 500, 1000, 5000"
                  className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            )}
            {sizeMode === 'range' && (
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-neutral-400">Start</label>
                  <input
                    type="number"
                    value={rangeStart}
                    onChange={(e) => setRangeStart(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-neutral-400">End</label>
                  <input
                    type="number"
                    value={rangeEnd}
                    onChange={(e) => setRangeEnd(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-neutral-400">Step</label>
                  <input
                    type="number"
                    value={rangeStep}
                    onChange={(e) => setRangeStep(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="md:col-span-12 grid grid-cols-2 gap-4">

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
