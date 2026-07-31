import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card';
import { LineChart, RadarChart } from '../../../components/charts';

interface OperationsDashboardProps {
  chartData: any;
}

export const OperationsDashboard: React.FC<OperationsDashboardProps> = ({ chartData }) => {
  const compLines = useMemo(() => {
    return chartData.lines.map((l: any) => ({
      key: `${l.name}_comparisons`,
      name: l.name,
      color: l.color,
    }));
  }, [chartData]);

  const swapLines = useMemo(() => {
    return chartData.lines.map((l: any) => ({
      key: `${l.name}_swaps`,
      name: l.name,
      color: l.color,
    }));
  }, [chartData]);

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
            <CardTitle>Comparisons vs Input Size</CardTitle>
          </CardHeader>
          <CardContent id="chart-operations">
            <LineChart 
              data={chartData.sizesData} 
              xAxisKey="formattedSize" 
              lines={compLines} 
              height={300}
            />
          </CardContent>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Swaps vs Input Size</CardTitle>
          </CardHeader>
          <CardContent id="chart-swaps">
            <LineChart 
              data={chartData.sizesData} 
              xAxisKey="formattedSize" 
              lines={swapLines} 
              height={300}
            />
          </CardContent>
        </Card>
      </motion.div>

      <motion.div className="lg:col-span-2" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Multi-dimensional Analysis (Normalized)</CardTitle>
          </CardHeader>
          <CardContent id="chart-radar">
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
