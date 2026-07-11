import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  valueColor?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, valueColor = "text-white" }) => {
  return (
    <div className="bg-[#18181b] border border-[#27272a] rounded-xl p-5 flex flex-col justify-between h-[110px]">
      <div className="flex justify-between items-center text-sm font-medium text-gray-400">
        <span>{title}</span>
        {icon}
      </div>
      <div className={`text-3xl font-bold ${valueColor}`}>
        {value}
      </div>
    </div>
  );
};

export default StatCard;
