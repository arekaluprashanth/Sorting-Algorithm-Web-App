import React from 'react';
import { ScatterChart as RechartsScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ZAxis } from 'recharts';
import { ChartContainer } from './ChartContainer';
import { CustomTooltip } from './ChartTooltip';

interface ScatterChartProps {
  data: any[];
  xAxisKey: string;
  yAxisKey: string;
  zAxisKey?: string;
  name: string;
  color: string;
  loading?: boolean;
  empty?: boolean;
  height?: number | string;
}

export const ScatterChart: React.FC<ScatterChartProps> = ({ data, xAxisKey, yAxisKey, zAxisKey, name, color, loading, empty, height }) => {
  return (
    <ChartContainer loading={loading} empty={empty} height={height}>
      <RechartsScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
        <XAxis 
          type="number" 
          dataKey={xAxisKey} 
          name="X Axis" 
          tick={{ fill: '#a3a3a3', fontSize: 12, fontFamily: 'monospace' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis 
          type="number" 
          dataKey={yAxisKey} 
          name="Y Axis" 
          tick={{ fill: '#a3a3a3', fontSize: 12, fontFamily: 'monospace' }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(val) => val.toLocaleString()}
        />
        {zAxisKey && <ZAxis type="number" dataKey={zAxisKey} range={[40, 400]} name="Z Axis" />}
        <Tooltip cursor={{ strokeDasharray: '3 3' }} content={<CustomTooltip />} />
        <Legend wrapperStyle={{ paddingTop: '20px', fontSize: '12px' }} />
        <Scatter name={name} data={data} fill={color} animationDuration={1000} />
      </RechartsScatterChart>
    </ChartContainer>
  );
};
