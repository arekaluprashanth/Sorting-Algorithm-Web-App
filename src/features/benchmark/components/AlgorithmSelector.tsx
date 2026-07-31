import React, { useState } from 'react';
import { Check, ShieldCheck } from 'lucide-react';
import { getAllAlgorithms } from '../engine/algorithms';
import type { AlgorithmCategory } from '../engine/types';
import { cn } from '../../../shared/lib/utils';

interface AlgorithmSelectorProps {
  selectedIds: string[];
  onChange: (ids: string[]) => void;
}

export const AlgorithmSelector: React.FC<AlgorithmSelectorProps> = ({ selectedIds, onChange }) => {
  const [activeCategory, setActiveCategory] = useState<AlgorithmCategory | 'all'>('all');
  const allAlgorithms = getAllAlgorithms();

  const filteredAlgorithms = activeCategory === 'all'
    ? allAlgorithms
    : allAlgorithms.filter((a) => a.category === activeCategory);

  const toggleAlgorithm = (id: string) => {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((i) => i !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredAlgorithms.length) {
      onChange([]);
    } else {
      onChange(filteredAlgorithms.map((a) => a.id));
    }
  };

  return (
    <div className="glass-panel p-6 rounded-xl space-y-6">
      {/* Header & Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h3 className="text-lg font-semibold text-white tracking-tight">Algorithm Selection</h3>
          <p className="text-xs text-neutral-400">Choose algorithms to include in the benchmark run</p>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-1 bg-black/40 p-1 rounded-lg border border-white/10 text-xs font-mono">
          {(['all', 'comparison', 'non-comparison', 'hybrid'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                'px-3 py-1 rounded-md capitalize transition-all cursor-pointer',
                activeCategory === cat
                  ? 'bg-blue-600 text-white font-medium shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Select All Toggle Bar */}
      <div className="flex items-center justify-between text-xs font-mono text-neutral-400">
        <span>Selected: <strong className="text-blue-400">{selectedIds.length}</strong> / {allAlgorithms.length}</span>
        <button
          onClick={toggleSelectAll}
          className="text-blue-400 hover:underline cursor-pointer"
        >
          {selectedIds.length === filteredAlgorithms.length ? 'Deselect All' : 'Select Filtered All'}
        </button>
      </div>

      {/* Algorithm Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredAlgorithms.map((algo) => {
          const isSelected = selectedIds.includes(algo.id);
          return (
            <div
              key={algo.id}
              onClick={() => toggleAlgorithm(algo.id)}
              className={cn(
                'p-4 rounded-xl border transition-all cursor-pointer select-none relative group',
                isSelected
                  ? 'bg-blue-900/20 border-blue-500/50 shadow-lg shadow-blue-500/10'
                  : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
              )}
            >
              {/* Checkbox indicator */}
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      'w-4 h-4 rounded border flex items-center justify-center transition-colors',
                      isSelected ? 'bg-blue-600 border-blue-500 text-white' : 'border-white/30 bg-black/40'
                    )}
                  >
                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <h4 className="font-semibold text-sm text-white tracking-tight">{algo.name}</h4>
                </div>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-white/5 text-neutral-400 border border-white/10">
                  {algo.category}
                </span>
              </div>

              {/* Description */}
              <p className="text-xs text-neutral-400 mb-3 line-clamp-2 leading-relaxed">{algo.description}</p>

              {/* Complexities Badges */}
              <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono pt-2 border-t border-white/10">
                <span className="text-neutral-500">Time:</span>
                <span className="text-indigo-300">{algo.timeComplexity.average}</span>
                <span className="text-neutral-500 ml-auto">Space:</span>
                <span className="text-purple-300">{algo.spaceComplexity}</span>
                {algo.stable && (
                  <span className="flex items-center gap-1 text-[10px] text-emerald-400 ml-1" title="Stable sort">
                    <ShieldCheck className="w-3 h-3" />
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
