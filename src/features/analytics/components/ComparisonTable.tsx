import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpDown, Search } from 'lucide-react';
import { Input } from '../../../components/ui/Input';
import { Badge } from '../../../components/ui/Badge';
import type { BenchmarkResult } from '../../benchmark/engine/types';
import { formatDuration, formatNumber, formatBytes } from '../../../shared/lib/utils';

interface ComparisonTableProps {
  results: BenchmarkResult[];
}

type SortKey = 'algorithmName' | 'executionTimeMs' | 'comparisons' | 'swaps' | 'memoryEstimateBytes' | 'maxRecursionDepth';

type SortConfig = {
  key: SortKey;
  direction: 'asc' | 'desc';
};

export const ComparisonTable: React.FC<ComparisonTableProps> = ({ results }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'executionTimeMs', direction: 'asc' });

  const handleSort = (key: SortKey) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const processedData = useMemo(() => {
    let data = [...results];

    // Filter
    if (searchTerm) {
      data = data.filter(r => r.algorithmName.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    // Sort
    data.sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];

      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return data;
  }, [results, searchTerm, sortConfig]);

  if (!results.length) return null;

  return (
    <div className="glass-panel rounded-xl overflow-hidden flex flex-col">
      <div className="p-4 border-b border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 bg-black/20">
        <h3 className="text-lg font-semibold text-white tracking-tight">Detailed Analysis Table</h3>
        <div className="relative w-full sm:w-64">
          <Input
            type="text"
            placeholder="Search algorithms..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 h-9 bg-black/40 border-white/10 text-sm"
          />
          <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-2.5" />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-black/40 text-xs font-mono text-neutral-400 uppercase tracking-wider border-b border-white/10">
              <th className="py-3 px-4 cursor-pointer hover:text-white transition-colors" onClick={() => handleSort('algorithmName')}>
                <div className="flex items-center gap-2">Algorithm <ArrowUpDown className="w-3 h-3" /></div>
              </th>
              <th className="py-3 px-4 cursor-pointer hover:text-white transition-colors text-right" onClick={() => handleSort('executionTimeMs')}>
                <div className="flex items-center justify-end gap-2">Time (ms) <ArrowUpDown className="w-3 h-3" /></div>
              </th>
              <th className="py-3 px-4 cursor-pointer hover:text-white transition-colors text-right" onClick={() => handleSort('comparisons')}>
                <div className="flex items-center justify-end gap-2">Comparisons <ArrowUpDown className="w-3 h-3" /></div>
              </th>
              <th className="py-3 px-4 cursor-pointer hover:text-white transition-colors text-right" onClick={() => handleSort('swaps')}>
                <div className="flex items-center justify-end gap-2">Swaps <ArrowUpDown className="w-3 h-3" /></div>
              </th>
              <th className="py-3 px-4 cursor-pointer hover:text-white transition-colors text-right" onClick={() => handleSort('memoryEstimateBytes')}>
                <div className="flex items-center justify-end gap-2">Memory <ArrowUpDown className="w-3 h-3" /></div>
              </th>
              <th className="py-3 px-4 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-sm">
            {processedData.length > 0 ? (
              processedData.map((res, idx) => (
                <motion.tr 
                  key={res.algorithmId} 
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="hover:bg-white/5 transition-colors group"
                >
                  <td className="py-3 px-4 font-semibold text-white flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: `var(--color-${res.algorithmId.toLowerCase()})` }} />
                    {res.algorithmName}
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-blue-400 font-bold">
                    {formatDuration(res.executionTimeMs)}
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-indigo-300">
                    {formatNumber(res.comparisons)}
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-emerald-400">
                    {formatNumber(res.swaps)}
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-amber-300">
                    {formatBytes(res.memoryEstimateBytes)}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {res.correct ? (
                      <Badge variant="success" className="text-[10px] px-2 py-0.5">Valid</Badge>
                    ) : (
                      <Badge variant="error" className="text-[10px] px-2 py-0.5">Failed</Badge>
                    )}
                  </td>
                </motion.tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="py-8 text-center text-neutral-500 text-sm">
                  No algorithms match your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
