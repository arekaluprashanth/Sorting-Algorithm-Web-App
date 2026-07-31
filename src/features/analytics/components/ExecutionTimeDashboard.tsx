import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card';
import { LineChart } from '../../../components/charts';
import type { BenchmarkSession } from '../../benchmark/engine/types';

interface ExecutionTimeDashboardProps {
  session: BenchmarkSession | null;
  chartData: any;
}

export const ExecutionTimeDashboard: React.FC<ExecutionTimeDashboardProps> = ({ session, chartData }) => {
  const lines = useMemo(() => {
    return chartData.lines.map((l: any) => ({
      key: `${l.name}_time`,
      name: l.name,
      color: l.color,
    }));
  }, [chartData]);

  const memoryLines = useMemo(() => {
    return chartData.lines.map((l: any) => ({
      key: `${l.name}_memory`,
      name: l.name,
      color: l.color,
    }));
  }, [chartData]);

  if (!session || chartData.sizesData.length === 0) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Execution Time vs Input Size (ms)</CardTitle>
          </CardHeader>
          <CardContent id="chart-execution-time">
            <LineChart 
              data={chartData.sizesData} 
              xAxisKey="formattedSize" 
              lines={lines} 
              height={300}
            />
          </CardContent>
        </Card>
      </motion.div>
      
      <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Memory Usage vs Input Size (Bytes)</CardTitle>
          </CardHeader>
          <CardContent id="chart-memory">
            <LineChart 
              data={chartData.sizesData} 
              xAxisKey="formattedSize" 
              lines={memoryLines} 
              height={300}
            />
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
