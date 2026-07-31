import React from 'react';
import type { AlgorithmMetadata } from '../types';
import { Badge } from '../../../components/ui/Badge';
import { ArrowRight, Box, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

interface AlgorithmCardProps {
  algorithm: AlgorithmMetadata;
}

export const AlgorithmCard: React.FC<AlgorithmCardProps> = ({ algorithm }) => {
  return (
    <Link 
      to={`/learning/${algorithm.id}`} 
      className="block p-5 glass-panel rounded-xl border border-white/5 hover:border-blue-500/30 transition-all group"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
            {algorithm.name}
          </h3>
          <p className="text-xs text-neutral-400 mt-1">{algorithm.inventor} • {algorithm.year}</p>
        </div>
        <ArrowRight className="w-5 h-5 text-neutral-500 group-hover:text-blue-400 transform group-hover:translate-x-1 transition-all" />
      </div>

      <p className="text-sm text-neutral-300 line-clamp-2 mb-4">
        {algorithm.description}
      </p>

      <div className="flex flex-wrap gap-2 mb-4">
        <Badge variant={algorithm.isStable ? 'success' : 'warning'}>
          {algorithm.isStable ? 'Stable' : 'Unstable'}
        </Badge>
        <Badge variant={algorithm.isInPlace ? 'success' : 'default'}>
          {algorithm.isInPlace ? 'In-Place' : 'Requires Memory'}
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/5">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase text-neutral-500 tracking-wider mb-1 flex items-center gap-1">
            <Clock className="w-3 h-3" /> Time (Avg)
          </span>
          <span className="font-mono text-sm text-white">{algorithm.complexity.average}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] uppercase text-neutral-500 tracking-wider mb-1 flex items-center gap-1">
            <Box className="w-3 h-3" /> Space
          </span>
          <span className="font-mono text-sm text-white">{algorithm.complexity.space}</span>
        </div>
      </div>
    </Link>
  );
};
