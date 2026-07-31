import React from 'react';
import { useLocation } from 'react-router-dom';
import { ChevronRight, Cpu, Sparkles } from 'lucide-react';

const ROUTE_TITLES: Record<string, { title: string; subtitle: string }> = {
  '/': { title: 'Dashboard Overview', subtitle: 'System stats and high-level performance indicators' },
  '/benchmark': { title: 'Algorithm Benchmarking', subtitle: 'Configure datasets and execute performance runs' },
  '/results': { title: 'Benchmark Results', subtitle: 'Detailed comparative metric analysis' },
  '/history': { title: 'Execution History', subtitle: 'Historical benchmark comparisons and logs' },
  '/complexity': { title: 'Complexity Study', subtitle: 'Big-O theoretical and empirical algorithm study' },
};

export const Header: React.FC = () => {
  const location = useLocation();
  const currentRoute = ROUTE_TITLES[location.pathname] || {
    title: 'Benchmark Engine',
    subtitle: 'High performance sorting analysis',
  };

  return (
    <header className="sticky top-0 z-20 h-16 border-b border-white/10 glass-panel px-8 flex items-center justify-between">
      {/* Title & Breadcrumbs */}
      <div>
        <div className="flex items-center gap-2 text-xs text-neutral-400 font-mono mb-0.5">
          <span>SortBench</span>
          <ChevronRight className="w-3 h-3 text-neutral-600" />
          <span className="text-blue-400 capitalize">{location.pathname === '/' ? 'home' : location.pathname.substring(1)}</span>
        </div>
        <h2 className="text-base font-semibold text-white tracking-tight leading-tight">
          {currentRoute.title}
        </h2>
      </div>

      {/* Header Actions & Specs */}
      <div className="flex items-center gap-4 text-xs font-mono text-neutral-400">
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
          <Cpu className="w-3.5 h-3.5 text-indigo-400" />
          <span>JS Engine JIT Warmup: Active</span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Vite Engine</span>
        </div>
      </div>
    </header>
  );
};
