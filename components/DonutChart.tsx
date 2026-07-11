import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

export interface DonutChartData {
  name: string;
  value: number; // percentage
  count: number;
  color: string;
  monthlyCounts?: Record<string, string>;
}

interface DonutChartProps {
  data: DonutChartData[];
  totalLogs?: number;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload as DonutChartData;
    return (
      <div className="bg-black text-white p-3 rounded-lg shadow-lg text-sm border border-[#27272a] z-50">
        <p className="font-bold mb-1" style={{ color: data.color }}>{data.name}</p>
        <p className="text-gray-300 mb-1">{data.count} logs ({data.value}%)</p>
        {data.monthlyCounts && Object.keys(data.monthlyCounts).length > 0 && (
          <div className="mt-2 pt-2 border-t border-[#27272a] text-xs text-gray-400 grid grid-cols-2 gap-x-3 gap-y-1">
            {Object.entries(data.monthlyCounts).map(([month, val]) => (
              <span key={month}>{month}: {val}</span>
            ))}
          </div>
        )}
      </div>
    );
  }
  return null;
};

const DonutChart: React.FC<DonutChartProps> = ({ data, totalLogs }) => {
  return (
    <div className="bg-[#18181b] border border-[#27272a] rounded-xl p-6 flex flex-col items-center col-span-1 h-full w-full">
      <h2 className="text-gray-400 font-bold mb-4 w-full text-left">Distribution</h2>
      
      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mb-4 text-xs text-gray-400 w-full">
        {data.length === 0 && <span>No data yet</span>}
        {data.map((item) => (
          <div key={item.name} className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: item.color }} />
            <span>{item.name} ({item.count})</span>
          </div>
        ))}
      </div>

      <div className="relative flex-1 w-full flex items-center justify-center min-h-[200px]">
        {data.length > 0 && (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="count"
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} className="transition-all duration-300 hover:opacity-80 outline-none cursor-pointer" />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        )}

        {/* Center Text */}
        {totalLogs !== undefined && data.length > 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-2xl font-bold text-white">{totalLogs}</span>
            <span className="text-[10px] text-gray-400">Total Logs</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default DonutChart;
