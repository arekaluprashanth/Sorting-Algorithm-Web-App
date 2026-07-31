import React from 'react';
import type { AlgorithmMetadata } from '../types';

interface ComparisonTableProps {
  algorithms: AlgorithmMetadata[];
}

export const ComparisonTable: React.FC<ComparisonTableProps> = ({ algorithms }) => {
  return (
    <div className="overflow-x-auto rounded-xl border border-white/10 bg-black/40 glass-panel">
      <table className="w-full text-sm text-left">
        <thead className="text-xs text-neutral-400 uppercase bg-white/5 border-b border-white/10">
          <tr>
            <th className="px-6 py-4 font-semibold">Algorithm</th>
            <th className="px-6 py-4 font-semibold">Best Case</th>
            <th className="px-6 py-4 font-semibold">Average Case</th>
            <th className="px-6 py-4 font-semibold">Worst Case</th>
            <th className="px-6 py-4 font-semibold">Space</th>
            <th className="px-6 py-4 font-semibold text-center">Stable</th>
            <th className="px-6 py-4 font-semibold text-center">In-Place</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {algorithms.map(algo => (
            <tr key={algo.id} className="hover:bg-white/5 transition-colors">
              <td className="px-6 py-4 font-medium text-white">{algo.name}</td>
              <td className="px-6 py-4 font-mono text-blue-400">{algo.complexity.best}</td>
              <td className="px-6 py-4 font-mono text-amber-400">{algo.complexity.average}</td>
              <td className="px-6 py-4 font-mono text-rose-400">{algo.complexity.worst}</td>
              <td className="px-6 py-4 font-mono text-purple-400">{algo.complexity.space}</td>
              <td className="px-6 py-4 text-center">
                {algo.isStable 
                  ? <span className="text-emerald-400 font-medium">Yes</span> 
                  : <span className="text-neutral-500">No</span>}
              </td>
              <td className="px-6 py-4 text-center">
                {algo.isInPlace 
                  ? <span className="text-emerald-400 font-medium">Yes</span> 
                  : <span className="text-neutral-500">No</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
