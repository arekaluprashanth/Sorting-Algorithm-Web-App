import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card';
import { BarChart, LineChart } from '../../../components/charts';
import type { BenchmarkSession } from '../../benchmark/engine/types';

interface ExecutionTimeDashboardProps {
  session: BenchmarkSession | null;
  chartData: any;
}

export const ExecutionTimeDashboard: React.FC<ExecutionTimeDashboardProps> = ({ session, chartData }) => {
  const bars = useMemo(() => [{ key: 'Time (ms)', name: 'Execution Time (ms)', color: '#3b82f6' }], []);
  
  const lines = useMemo(() => {
    if (!session) return [];
    return session.results.map(r => ({
      key: r.algorithmName,
      name: r.algorithmName,
      color: `var(--color-${r.algorithmId.toLowerCase()})`
    }));
  }, [session]);

  if (!session) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Total Execution Time Comparison</CardTitle>
          </CardHeader>
          <CardContent id="chart-execution-time">
            <BarChart 
              data={chartData.executionTimeData} 
              xAxisKey="name" 
              bars={bars} 
              height={300}
            />
          </CardContent>
        </Card>
      </motion.div>
      
      <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Execution Time Over Iterations</CardTitle>
          </CardHeader>
          <CardContent id="chart-timeline">
            {chartData.timelineData.length > 0 ? (
              <LineChart 
                data={chartData.timelineData} 
                xAxisKey="iteration" 
                lines={lines} 
                height={300}
              />
            ) : (
              <div className="h-[300px] flex items-center justify-center text-sm text-neutral-500">
                Timeline data requires multiple measured runs.
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
