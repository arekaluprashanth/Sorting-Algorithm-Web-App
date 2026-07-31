import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card';
import { BarChart, RadarChart } from '../../../components/charts';

interface OperationsDashboardProps {
  chartData: any;
}

export const OperationsDashboard: React.FC<OperationsDashboardProps> = ({ chartData }) => {
  const opBars = useMemo(() => [
    { key: 'Comparisons', name: 'Comparisons', color: '#a855f7' },
    { key: 'Swaps', name: 'Swaps', color: '#10b981' }
  ], []);

  const radars = useMemo(() => {
    if (!chartData.sortedResults) return [];
    return chartData.sortedResults.map((r: any) => ({
      key: r.algorithmName,
      name: r.algorithmName,
      color: `var(--color-${r.algorithmId.toLowerCase()})`
    }));
  }, [chartData]);

  // Pivot radar data so Algorithms are the lines and Metrics are the corners
  const pivotedRadarData = useMemo(() => {
    if (!chartData.sortedResults) return [];
    const metrics = ['Time (Normalized)', 'Comparisons (Normalized)', 'Swaps (Normalized)', 'Memory (Normalized)'];
    
    return metrics.map(metric => {
      const point: any = { metric: metric.replace(' (Normalized)', '') };
      chartData.radarData.forEach((algData: any) => {
        point[algData.name] = algData[metric];
      });
      return point;
    });
  }, [chartData]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Comparisons vs Swaps</CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart 
              data={chartData.operationsData} 
              xAxisKey="name" 
              bars={opBars} 
              height={350}
            />
          </CardContent>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Multi-dimensional Analysis (Normalized)</CardTitle>
          </CardHeader>
          <CardContent>
             <RadarChart 
                data={pivotedRadarData} 
                polarKey="metric" 
                radars={radars} 
                height={350} 
             />
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
