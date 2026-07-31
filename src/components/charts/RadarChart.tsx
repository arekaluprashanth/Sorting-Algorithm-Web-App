import React from 'react';
import { Radar, RadarChart as RechartsRadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Tooltip, Legend } from 'recharts';
import { ChartContainer } from './ChartContainer';
import { CustomTooltip } from './ChartTooltip';

interface RadarChartProps {
  data: any[];
  polarKey: string;
  radars: { key: string; color: string; name: string }[];
  loading?: boolean;
  empty?: boolean;
  height?: number | string;
}

export const RadarChart: React.FC<RadarChartProps> = ({ data, polarKey, radars, loading, empty, height }) => {
  return (
    <ChartContainer loading={loading} empty={empty} height={height}>
      <RechartsRadarChart cx="50%" cy="50%" outerRadius="70%" data={data} margin={{ top: 10, right: 30, bottom: 20, left: 30 }}>
        <PolarGrid stroke="rgba(255,255,255,0.1)" />
        <PolarAngleAxis dataKey={polarKey} tick={{ fill: '#e5e5e5', fontSize: 12, fontFamily: 'monospace' }} />
        <PolarRadiusAxis angle={30} tick={false} axisLine={false} />
        <Tooltip content={<CustomTooltip />} />
        <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
        {radars.map((radar) => (
          <Radar
            key={radar.key}
            name={radar.name}
            dataKey={radar.key}
            stroke={radar.color}
            fill={radar.color}
            fillOpacity={0.4}
            animationDuration={1500}
          />
        ))}
      </RechartsRadarChart>
    </ChartContainer>
  );
};
