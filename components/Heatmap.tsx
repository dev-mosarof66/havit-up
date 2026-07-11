import React from 'react';

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

interface HeatmapProps {
  days: { date: string; active: boolean }[];
  currentStreak: number;
  selectedYear: string;
  onYearChange: (year: string) => void;
  onToggleDay: (index: number) => void;
}

const Heatmap: React.FC<HeatmapProps> = ({ days, currentStreak, selectedYear, onYearChange, onToggleDay }) => {
  return (
    <div className="bg-[#18181b] border border-[#27272a] rounded-xl p-6 col-span-2">

      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-lg font-bold text-white mb-1">Habit Streak</h2>
          <p className="text-xs text-gray-400">Streak: {currentStreak} days</p>
        </div>
        <select
          value={selectedYear}
          onChange={(e) => onYearChange(e.target.value)}
          className="bg-[#121212] border border-[#27272a] text-sm text-gray-300 rounded-md px-3 py-1.5 focus:outline-none focus:border-gray-500 cursor-pointer"
        >
          <option value="2026">2026</option>
          <option value="2025">2025</option>
        </select>
      </div>

      {/* Heatmap Grid */}
      <div className="overflow-x-auto pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none">
        <div className="inline-flex flex-col">

          {/* Months Header */}
          <div className="flex ml-[30px] mb-2 text-xs text-gray-400">
            {monthNames.map((month) => (
              <div key={month} className="flex-1 min-w-[44px]" style={{ width: '44px' }}>
                {month}
              </div>
            ))}
          </div>

          <div className="flex">
            {/* Day Labels */}
            <div className="flex flex-col justify-between text-[10px] text-gray-400 pr-2 py-1 h-[112px]">
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
                    className={`w-[11px] h-[11px] rounded-[2px] cursor-pointer transition-colors duration-200 hover:ring-1 hover:ring-gray-400 ${day.active ? 'bg-[#22c55e]' : 'bg-[#1a251d]'
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

export default Heatmap;
