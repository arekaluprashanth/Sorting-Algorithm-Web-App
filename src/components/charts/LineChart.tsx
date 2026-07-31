import React from 'react';
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { ChartContainer } from './ChartContainer';
import { CustomTooltip } from './ChartTooltip';

interface LineChartProps {
  data: any[];
  xAxisKey: string;
  lines: { key: string; color: string; name: string }[];
  loading?: boolean;
  empty?: boolean;
  height?: number | string;
}

export const LineChart: React.FC<LineChartProps> = ({ data, xAxisKey, lines, loading, empty, height }) => {
  return (
    <ChartContainer loading={loading} empty={empty} height={height}>
      <RechartsLineChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
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
        <Tooltip content={<CustomTooltip />} />
        <Legend wrapperStyle={{ paddingTop: '20px', fontSize: '12px' }} />
        {lines.map((line) => (
          <Line 
            key={line.key}
            type="monotone" 
            dataKey={line.key} 
            name={line.name} 
            stroke={line.color} 
            strokeWidth={3}
            dot={{ r: 4, strokeWidth: 2, fill: '#000' }}
            activeDot={{ r: 6 }}
            animationDuration={1500}
          />
        ))}
      </RechartsLineChart>
    </ChartContainer>
  );
};
