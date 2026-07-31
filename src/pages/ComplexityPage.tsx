import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';

export const ComplexityPage: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 max-w-7xl mx-auto pb-12"
    >
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold text-white tracking-tight">Complexity Study</h1>
          </div>
          <p className="text-xs text-neutral-400">
            Big-O notation theory, algorithm complexity classes, and asymptotic growth bounds
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Big-O Time Complexity Classes</CardTitle>
            <CardDescription>Theoretical lower & upper bounds for sorting algorithms</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-xs font-mono text-neutral-300">
            <div className="p-3 rounded-lg bg-black/40 border border-white/10 space-y-1">
              <span className="text-emerald-400 font-bold">O(1) Constant Time</span>
              <p className="text-[11px] text-neutral-400">Fixed number of operations regardless of input size n.</p>
            </div>
            <div className="p-3 rounded-lg bg-black/40 border border-white/10 space-y-1">
              <span className="text-blue-400 font-bold">O(n) Linear Time</span>
              <p className="text-[11px] text-neutral-400">Operations scale linearly with input size n (e.g. Best case Bubble/Insertion).</p>
            </div>
            <div className="p-3 rounded-lg bg-black/40 border border-white/10 space-y-1">
              <span className="text-indigo-400 font-bold">O(n log n) Linearithmic Time</span>
              <p className="text-[11px] text-neutral-400">Optimal worst-case for comparison sorting (e.g. Merge, Heap, Quick Sort avg).</p>
            </div>
            <div className="p-3 rounded-lg bg-black/40 border border-white/10 space-y-1">
              <span className="text-rose-400 font-bold">O(n²) Quadratic Time</span>
              <p className="text-[11px] text-neutral-400">Operations scale quadratically (e.g. Bubble, Selection, Insertion worst case).</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Space Complexity & Memory Bounds</CardTitle>
            <CardDescription>Auxiliary array allocations and call stack recursion memory</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-xs font-mono text-neutral-300">
            <div className="p-3 rounded-lg bg-black/40 border border-white/10 space-y-1">
              <span className="text-purple-400 font-bold">O(1) In-Place Sorting</span>
              <p className="text-[11px] text-neutral-400">Sorts array directly using constant extra memory (Bubble, Heap, Insertion).</p>
            </div>
            <div className="p-3 rounded-lg bg-black/40 border border-white/10 space-y-1">
              <span className="text-amber-400 font-bold">O(n) Auxiliary Array Memory</span>
              <p className="text-[11px] text-neutral-400">Requires additional array buffers equal to input size n (Merge Sort, Radix Sort).</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};
