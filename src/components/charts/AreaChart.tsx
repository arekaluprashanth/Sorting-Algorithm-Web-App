import React from 'react';
import { AreaChart as RechartsAreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { ChartContainer } from './ChartContainer';
import { CustomTooltip } from './ChartTooltip';

interface AreaChartProps {
  data: any[];
  xAxisKey: string;
  areas: { key: string; color: string; name: string }[];
  loading?: boolean;
  empty?: boolean;
  height?: number | string;
}

export const AreaChart: React.FC<AreaChartProps> = ({ data, xAxisKey, areas, loading, empty, height }) => {
  return (
    <ChartContainer loading={loading} empty={empty} height={height}>
      <RechartsAreaChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
        <defs>
          {areas.map((area) => (
            <linearGradient key={`color${area.key}`} id={`color${area.key}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={area.color} stopOpacity={0.8}/>
              <stop offset="95%" stopColor={area.color} stopOpacity={0}/>
            </linearGradient>
          ))}
        </defs>
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
        {areas.map((area) => (
          <Area 
            key={area.key}
            type="monotone" 
            dataKey={area.key} 
            name={area.name} 
            stroke={area.color} 
            strokeWidth={2}
            fillOpacity={1} 
            fill={`url(#color${area.key})`}
            animationDuration={1500}
          />
        ))}
      </RechartsAreaChart>
    </ChartContainer>
  );
};
