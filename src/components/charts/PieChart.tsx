import React from 'react';
import { PieChart as RechartsPieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { ChartContainer } from './ChartContainer';
import { CustomTooltip } from './ChartTooltip';

interface PieChartProps {
  data: { name: string; value: number; color: string }[];
  dataKey?: string;
  nameKey?: string;
  loading?: boolean;
  empty?: boolean;
  height?: number | string;
}

export const PieChart: React.FC<PieChartProps> = ({ 
  data, 
  dataKey = "value", 
  nameKey = "name", 
  loading, 
  empty, 
  height 
}) => {
  return (
    <ChartContainer loading={loading} empty={empty} height={height}>
      <RechartsPieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          paddingAngle={5}
          dataKey={dataKey}
          nameKey={nameKey}
          animationDuration={1500}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
      </RechartsPieChart>
    </ChartContainer>
  );
};
