import React from 'react';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { ChartContainer } from './ChartContainer';
import { CustomTooltip } from './ChartTooltip';

interface BarChartProps {
  data: any[];
  xAxisKey: string;
  bars: { key: string; color: string; name: string }[];
  loading?: boolean;
  empty?: boolean;
  height?: number | string;
}

export const BarChart: React.FC<BarChartProps> = ({ data, xAxisKey, bars, loading, empty, height }) => {
  return (
    <ChartContainer loading={loading} empty={empty} height={height}>
      <RechartsBarChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
        <XAxis 
          dataKey={xAxisKey} 
          tick={{ fill: '#a3a3a3', fontSize: 12, fontFamily: 'monospace' }} 
          axisLine={false} 
          tickLine={false}
          dy={10}
        />
        <YAxis 
          tick={{ fill: '#a3a3a3', fontSize: 12, fontFamily: 'monospace' }} 
          axisLine={false} 
          tickLine={false}
          tickFormatter={(value) => value.toLocaleString()}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
        <Legend wrapperStyle={{ paddingTop: '20px', fontSize: '12px' }} />
        {bars.map((bar) => (
          <Bar 
            key={bar.key} 
            dataKey={bar.key} 
            name={bar.name} 
            fill={bar.color} 
            radius={[4, 4, 0, 0]} 
            animationDuration={1000}
          />
        ))}
      </RechartsBarChart>
    </ChartContainer>
  );
};
