import React from 'react';

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

interface LandingHeatmapProps {
  days: { date: string; active: boolean }[];
}

const LandingHeatmap: React.FC<LandingHeatmapProps> = ({ days }) => {
  return (
    <div className="bg-[#09090b] border border-white/10 p-6 shadow-2xl relative overflow-hidden backdrop-blur-md rounded-none">
      
      {/* Background glow */}
      <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-white/5 blur-[100px] rounded-full pointer-events-none" />

      {/* Header */}
      <div className="flex justify-between items-start mb-6 relative z-10">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight mb-1">Consistency Overview</h2>
          <p className="text-sm text-gray-400">Your habit journey at a glance</p>
        </div>
      </div>

      {/* Heatmap Grid */}
      <div className="overflow-x-auto pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none relative z-10">
        <div className="inline-flex flex-col">

          {/* Months Header */}
          <div className="flex ml-[30px] mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            {monthNames.map((month) => (
              <div key={month} className="flex-1 min-w-[44px]" style={{ width: '44px' }}>
                {month}
              </div>
            ))}
          </div>

          <div className="flex">
            {/* Day Labels */}
            <div className="flex flex-col justify-between text-[10px] font-semibold text-gray-500 pr-3 py-1 h-[112px] uppercase tracking-widest">
              <span className="invisible">Sun</span>
              <span>Mon</span>
              <span className="invisible">Tue</span>
              <span>Wed</span>
              <span className="invisible">Thu</span>
              <span>Fri</span>
              <span className="invisible">Sat</span>
            </div>

            {/* Grid Cells */}
            <div className="grid grid-rows-7 grid-flow-col gap-[3px]">
              {days.map((day, idx) => {
                const dateObj = new Date(day.date);
                const formattedDate = dateObj.toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'short',
                  year:"numeric"
                });

                return (
                  <div
                    key={idx}
                    title={formattedDate}
                    className={`w-[11px] h-[11px] rounded-none transition-all duration-300 ${
                      day.active 
                        ? 'bg-blue-500 scale-110' 
                        : 'bg-[#18181b] border border-[#27272a]'
                    }`}
                  />
                );
              })}
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};

export default LandingHeatmap;
