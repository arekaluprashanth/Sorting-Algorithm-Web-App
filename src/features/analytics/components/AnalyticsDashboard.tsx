import React from 'react';
import { motion } from 'framer-motion';
import type { BenchmarkSession } from '../../benchmark/engine/types';
import { PerformanceSummary } from './PerformanceSummary';
import { ExecutionTimeDashboard } from './ExecutionTimeDashboard';
import { OperationsDashboard } from './OperationsDashboard';
import { ComparisonTable } from './ComparisonTable';
import { InsightsPanel } from './InsightsPanel';
import { useChartData } from '../hooks/useChartData';

interface AnalyticsDashboardProps {
  session: BenchmarkSession | null;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ session }) => {
  const chartData = useChartData(session);

  if (!session || session.results.length === 0) {
    return null; // The parent component (ResultsPanel/BenchmarkPage) should handle the empty state
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-8"
    >
      {/* 1. Header & Quick Summary */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white tracking-tight">Analytics & Visualization Dashboard</h2>
        <p className="text-sm text-neutral-400">
          Comprehensive breakdown of algorithm performance on {session.config.datasetSize.toLocaleString()} elements.
        </p>
      </div>

      {/* 2. Top Level Metric Counters */}
      <PerformanceSummary session={session} />

      {/* 3. AI Generated Insights */}
      <InsightsPanel session={session} />

      {/* 4. Deep Dive Charts - Time */}
      <div className="pt-4">
        <h3 className="text-lg font-bold text-white mb-4">Runtime Performance</h3>
        <ExecutionTimeDashboard session={session} chartData={chartData} />
      </div>

      {/* 5. Deep Dive Charts - Operations */}
      <div className="pt-4">
        <h3 className="text-lg font-bold text-white mb-4">Operational Efficiency</h3>
        <OperationsDashboard chartData={chartData} />
      </div>

      {/* 6. Raw Data Table */}
      <div className="pt-4">
        <ComparisonTable results={session.results} />
      </div>
    </motion.div>
  );
};
