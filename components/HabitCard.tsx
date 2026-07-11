import React from 'react';
import { MdCheck } from 'react-icons/md';

interface HabitCardProps {
  name: string;
  icon: React.ReactNode;
  color: string;
  currentStreak: number;
  totalDays: number;
  history: boolean[]; // Array of 7 booleans representing trailing 7 days
  isCompletedToday: boolean;
  onToggleToday: () => void;
}

const HabitCard: React.FC<HabitCardProps> = ({ 
  name, 
  icon, 
  color, 
  currentStreak, 
  totalDays, 
  history, 
  isCompletedToday,
  onToggleToday
}) => {
  return (
    <div className="bg-[#18181b] border border-[#27272a] rounded-xl p-5 hover:border-gray-500 transition-colors group">
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg text-white" style={{ backgroundColor: color }}>
            {icon}
          </div>
          <div>
            <h3 className="text-white font-bold text-lg">{name}</h3>
            <p className="text-gray-400 text-sm">Streak: <span className="text-white font-medium">{currentStreak} days</span></p>
          </div>
        </div>

        {/* Action Button */}
        <button 
          onClick={onToggleToday}
          className={`h-10 px-4 rounded-md font-medium text-sm transition-all duration-200 flex items-center gap-2 ${
            isCompletedToday 
              ? 'bg-[#1a251d] text-[#22c55e] border border-[#22c55e]/30' 
              : 'bg-foreground/10 text-white hover:bg-foreground/20'
          }`}
        >
          {isCompletedToday ? (
            <>
              <MdCheck size={18} />
              Done
            </>
          ) : (
            'Log Today'
          )}
        </button>
      </div>

      <div className="flex justify-between items-end">
        {/* Trailing 7 days */}
        <div>
          <p className="text-xs text-gray-400 mb-2 font-medium">Last 7 Days</p>
          <div className="flex gap-1.5">
            {history.map((isCompleted, idx) => (
              <div 
                key={idx} 
                className={`w-4 h-4 rounded-[3px] ${isCompleted ? 'opacity-100' : 'bg-[#27272a]'}`}
                style={isCompleted ? { backgroundColor: color } : {}}
              />
            ))}
          </div>
        </div>

        <div className="text-right">
          <p className="text-xs text-gray-400 mb-1 font-medium">Total Days</p>
          <p className="text-2xl font-bold font-stack text-white leading-none">{totalDays}</p>
        </div>
      </div>
    </div>
  );
};

export default HabitCard;
