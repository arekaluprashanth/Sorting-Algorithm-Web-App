import React, { type ReactNode } from 'react';
import { ResponsiveContainer } from 'recharts';
import { Loader2 } from 'lucide-react';
import { EmptyState } from '../error/EmptyState';

interface ChartContainerProps {
  children: ReactNode;
  height?: number | string;
  minHeight?: number;
  loading?: boolean;
  empty?: boolean;
  emptyMessage?: string;
}

export const ChartContainer: React.FC<ChartContainerProps> = ({
  children,
  height = 350,
  minHeight = 250,
  loading = false,
  empty = false,
  emptyMessage = 'No data available for this chart.',
}) => {
  if (loading) {
    return (
      <div 
        className="w-full flex flex-col items-center justify-center bg-black/10 rounded-xl border border-white/5"
        style={{ height, minHeight }}
      >
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-4" />
        <p className="text-sm text-neutral-400 font-mono animate-pulse">Rendering Visualization...</p>
      </div>
    );
  }

  if (empty) {
    return (
      <div style={{ height, minHeight }} className="w-full flex items-center justify-center">
        <EmptyState title="No Data" description={emptyMessage} />
      </div>
    );
  }

  return (
    <div style={{ height, minHeight }} className="w-full">
      <ResponsiveContainer width="100%" height="100%">
        {children}
      </ResponsiveContainer>
    </div>
  );
};
