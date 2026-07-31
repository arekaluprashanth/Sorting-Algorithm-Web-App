import React from 'react';
import {
  Shuffle,
  TrendingUp,
  TrendingDown,
  ListOrdered,
  Copy,
  Layers,
  Edit3,
  RefreshCw,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import type { DatasetOptions } from '../types';
import { DATASET_TYPE_DESCRIPTORS, DATASET_SIZE_PRESETS } from '../constants';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Slider } from '../../../components/ui/Slider';
import { Alert } from '../../../components/ui/Alert';
import { useDatasetValidation } from '../hooks/useDatasetValidation';

const ICON_MAP: Record<string, React.ElementType> = {
  Shuffle,
  TrendingUp,
  TrendingDown,
  ListOrdered,
  Copy,
  Layers,
  Edit3,
};

export interface DatasetGenerationPanelProps {
  options: DatasetOptions;
  onChange: (options: DatasetOptions) => void;
  onGenerate: () => void;
  onReset: () => void;
  onRandomizeSeed: () => void;
  isGenerating?: boolean;
}

export const DatasetGenerationPanel: React.FC<DatasetGenerationPanelProps> = ({
  options,
  onChange,
  onGenerate,
  onReset,
  onRandomizeSeed,
  isGenerating = false,
}) => {
  const validation = useDatasetValidation(options);

  const updateOption = <K extends keyof DatasetOptions>(key: K, val: DatasetOptions[K]) => {
    onChange({ ...options, [key]: val });
  };

  return (
    <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h3 className="text-lg font-bold text-white tracking-tight">Dataset Generator Panel</h3>
          <p className="text-xs text-neutral-400">Configure parameters, seed, and data distribution strategy</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" leftIcon={<RotateCcw className="w-3.5 h-3.5" />} onClick={onReset} disabled={isGenerating}>
            Reset
          </Button>
          <Button variant="primary" size="sm" isLoading={isGenerating} leftIcon={<RefreshCw className="w-3.5 h-3.5" />} onClick={onGenerate} disabled={!validation.isValid}>
            Generate Dataset
          </Button>
        </div>
      </div>

      {/* Validation Errors Banners */}
      {!validation.isValid && (
        <Alert variant="error" title="Configuration Validation Errors">
          <ul className="list-disc pl-4 space-y-0.5">
            {validation.errors.map((err: string, i: number) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
        </Alert>
      )}

      {/* Distribution Type Selection Grid */}
      <div className="space-y-2">
        <label className="text-xs font-mono text-neutral-400 uppercase tracking-wider">Distribution Strategy</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {DATASET_TYPE_DESCRIPTORS.map((desc) => {
            const Icon = ICON_MAP[desc.iconName] || Shuffle;
            const isSelected = options.type === desc.id;
            return (
              <button
                key={desc.id}
                type="button"
                onClick={() => updateOption('type', desc.id)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer select-none ${
                  isSelected
                    ? 'bg-blue-600/20 border-blue-500 text-white shadow-md shadow-blue-500/10 font-semibold'
                    : 'bg-neutral-900/50 border-white/10 text-neutral-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-blue-400' : 'text-neutral-500'}`} />
                  <span className="text-xs font-mono truncate">{desc.name}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Settings Options Form */}
      {options.type === 'custom' ? (
        <div className="space-y-2">
          <label className="text-xs font-mono text-neutral-300">Custom Dataset Values (CSV / Space / Newline)</label>
          <textarea
            value={options.customInput || ''}
            onChange={(e) => updateOption('customInput', e.target.value)}
            rows={4}
            placeholder="Enter values separated by commas or spaces e.g. 42, 17, 89, 3, 56, 12, 94"
            className="w-full p-3 bg-neutral-900 border border-white/10 rounded-xl text-xs font-mono text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500"
          />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Preset Buttons & Slider for Array Size */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <label className="text-xs font-mono text-neutral-400">Array Size Presets (n):</label>
              <div className="flex flex-wrap items-center gap-1.5">
                {DATASET_SIZE_PRESETS.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => updateOption('size', preset)}
                    className={`px-2 py-0.5 rounded text-[11px] font-mono border transition-all cursor-pointer ${
                      options.size === preset
                        ? 'bg-blue-600 text-white border-blue-500 font-bold'
                        : 'bg-black/30 border-white/10 text-neutral-400 hover:text-white'
                    }`}
                  >
                    {preset >= 1000 ? `${preset / 1000}K` : preset}
                  </button>
                ))}
              </div>
            </div>

            <Slider
              min={10}
              max={1000000}
              step={10}
              value={options.size}
              onChange={(e) => updateOption('size', Number(e.target.value))}
              label="Array Size (10 to 1,000,000 elements)"
            />
          </div>

          {/* Range & Special Parameters Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              type="number"
              label="Min Value"
              value={options.min}
              onChange={(e) => updateOption('min', Number(e.target.value))}
            />
            <Input
              type="number"
              label="Max Value"
              value={options.max}
              onChange={(e) => updateOption('max', Number(e.target.value))}
            />

            {/* Seed Control with Randomize Button */}
            <div className="space-y-1.5">
              <label className="block text-xs font-mono text-neutral-300">PRNG Seed (Deterministic)</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={options.seed ?? ''}
                  onChange={(e) => updateOption('seed', e.target.value ? Number(e.target.value) : undefined)}
                  placeholder="Random seed"
                  className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded-lg text-xs text-white font-mono focus:outline-none focus:border-blue-500"
                />
                <Button variant="outline" size="sm" leftIcon={<Sparkles className="w-3.5 h-3.5" />} onClick={onRandomizeSeed} title="Generate Random Seed">
                  Seed
                </Button>
              </div>
            </div>
          </div>

          {/* Conditional Options for Nearly Sorted & Duplicate Heavy */}
          {options.type === 'nearly-sorted' && (
            <Slider
              min={1}
              max={50}
              step={1}
              value={options.nearlySortedPercentage ?? 5}
              onChange={(e) => updateOption('nearlySortedPercentage', Number(e.target.value))}
              label="Swapped Elements Percentage (%)"
            />
          )}

          {options.type === 'many-duplicates' && (
            <Slider
              min={0.01}
              max={0.9}
              step={0.01}
              value={options.duplicateRatio ?? 0.1}
              onChange={(e) => updateOption('duplicateRatio', Number(e.target.value))}
              label={`Unique Value Ratio (${((options.duplicateRatio ?? 0.1) * 100).toFixed(0)}% unique values)`}
            />
          )}
        </div>
      )}
    </div>
  );
};
