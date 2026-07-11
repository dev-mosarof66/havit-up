import React from 'react';
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface LineChartProps {
  title: string;
  data: { name: string; count: number }[];
  color?: string;
  height?: string;
}

const LineChart: React.FC<LineChartProps> = ({ title, data, color = '#fbbf24', height = '200px' }) => {
  return (
    <div className="bg-[#18181b] border border-[#27272a] rounded-xl p-6 flex flex-col h-full w-full">
      <h2 className="text-gray-400 font-bold mb-6">{title}</h2>
      
      <div className="flex-1 w-full" style={{ minHeight: height }}>
        <ResponsiveContainer width="100%" height="100%">
          <RechartsLineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
            <XAxis 
              dataKey="name" 
              tick={{ fill: '#71717a', fontSize: 12 }} 
              axisLine={false} 
              tickLine={false} 
            />
            <YAxis 
              tick={{ fill: '#71717a', fontSize: 12 }} 
              axisLine={false} 
              tickLine={false}
              allowDecimals={false}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#000', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
              itemStyle={{ color: '#fff' }}
              formatter={(value: any) => [`${value} logs`, 'Count']}
              labelStyle={{ color: '#a1a1aa', marginBottom: '4px' }}
            />
            <Line 
              type="monotone" 
              dataKey="count" 
              stroke={color} 
              strokeWidth={3} 
              dot={{ fill: '#18181b', stroke: color, strokeWidth: 2, r: 4 }} 
              activeDot={{ r: 6, fill: color, stroke: '#18181b' }}
            />
          </RechartsLineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default LineChart;
