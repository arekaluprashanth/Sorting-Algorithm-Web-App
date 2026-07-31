import React from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, Sparkles } from 'lucide-react';
import { useInsights } from '../hooks/useInsights';
import type { BenchmarkSession } from '../../benchmark/engine/types';

interface InsightsPanelProps {
  session: BenchmarkSession | null;
}

export const InsightsPanel: React.FC<InsightsPanelProps> = ({ session }) => {
  const insights = useInsights(session);

  if (!insights.length) return null;

  return (
    <div className="glass-panel p-6 rounded-xl border-l-4 border-amber-500 bg-gradient-to-br from-amber-500/10 via-transparent to-transparent">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-amber-400" />
        <h3 className="text-lg font-bold text-white tracking-tight">AI Benchmark Insights</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {insights.map((insight, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 * idx }}
            className="flex items-start gap-3 p-4 rounded-lg bg-black/40 border border-white/5 shadow-inner"
          >
            <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <p 
              className="text-sm text-neutral-300 leading-relaxed" 
              dangerouslySetInnerHTML={{ __html: insight.replace(/\*\*(.*?)\*\*/g, '<span class="text-white font-bold">$1</span>') }}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
};
