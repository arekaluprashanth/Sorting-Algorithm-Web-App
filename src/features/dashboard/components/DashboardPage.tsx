import React from 'react';
import { Link } from 'react-router-dom';
import { Gauge, Cpu, BarChart3, ArrowRight, ShieldCheck, Layers, Sparkles } from 'lucide-react';
import { getAllAlgorithms } from '../../benchmark';
import type { SortingAlgorithm } from '../../benchmark';

export const DashboardPage: React.FC = () => {
  const algorithms = getAllAlgorithms();

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Hero Banner */}
      <div className="glass-panel p-8 md:p-12 rounded-2xl relative overflow-hidden bg-gradient-to-br from-blue-900/20 via-indigo-900/10 to-transparent border border-white/10">
        <div className="max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-mono text-blue-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Developer Benchmarking Platform</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Sorting Algorithm <br />
            <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
              Performance Benchmark
            </span>
          </h1>

          <p className="text-neutral-400 text-sm md:text-base leading-relaxed">
            Instrument, analyze, and benchmark execution time, comparisons, swaps, memory allocation, and recursion depth across 10 sorting algorithms with high precision.
          </p>

          <div className="pt-2 flex items-center gap-4">
            <Link
              to="/benchmark"
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm transition-all shadow-lg shadow-blue-600/30 active:scale-95 cursor-pointer"
            >
              <Gauge className="w-4 h-4" />
              <span>Launch Benchmark</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Decorative Grid SVG */}
        <div className="absolute right-0 bottom-0 opacity-15 pointer-events-none hidden lg:block">
          <Layers className="w-96 h-96 text-blue-500 stroke-1" />
        </div>
      </div>

      {/* Quick Specs Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="glass-panel p-6 rounded-xl space-y-2">
          <div className="p-2.5 rounded-lg bg-blue-500/10 text-blue-400 w-fit border border-blue-500/20">
            <Cpu className="w-5 h-5" />
          </div>
          <h3 className="text-2xl font-bold text-white font-mono">{algorithms.length} Algorithms</h3>
          <p className="text-xs text-neutral-400">Comparison, Non-Comparison & Hybrid sorting strategies instrumented</p>
        </div>

        <div className="glass-panel p-6 rounded-xl space-y-2">
          <div className="p-2.5 rounded-lg bg-purple-500/10 text-purple-400 w-fit border border-purple-500/20">
            <BarChart3 className="w-5 h-5" />
          </div>
          <h3 className="text-2xl font-bold text-white font-mono">4 Data Distributions</h3>
          <p className="text-xs text-neutral-400">Random, Nearly Sorted, Reversed & Few Unique dataset PRNG generators</p>
        </div>

        <div className="glass-panel p-6 rounded-xl space-y-2">
          <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400 w-fit border border-emerald-500/20">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-2xl font-bold text-white font-mono">JIT Warmup</h3>
          <p className="text-xs text-neutral-400">Eliminates JS engine compilation noise for reliable metrics</p>
        </div>
      </div>

      {/* Algorithm Catalog Overview */}
      <div className="space-y-4">
        <div className="flex justify-between items-end">
          <div>
            <h3 className="text-lg font-semibold text-white tracking-tight">Algorithm Catalog</h3>
            <p className="text-xs text-neutral-400">Supported algorithms and theoretical complexities</p>
          </div>
          <Link to="/benchmark" className="text-xs font-mono text-blue-400 hover:underline">
            View All in Benchmark →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {algorithms.map((algo: SortingAlgorithm) => (
            <div key={algo.id} className="glass-panel p-5 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-white">{algo.name}</h4>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-white/5 text-neutral-400 border border-white/10">
                  {algo.category}
                </span>
              </div>
              <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">{algo.description}</p>
              <div className="flex items-center justify-between text-xs font-mono pt-2 border-t border-white/10 text-neutral-400">
                <span>Avg: <strong className="text-indigo-300">{algo.timeComplexity.average}</strong></span>
                <span>Space: <strong className="text-purple-300">{algo.spaceComplexity}</strong></span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
