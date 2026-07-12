import React from 'react';
import { FiEdit2, FiArchive } from 'react-icons/fi';

export type HabitData = {
  id: string | number;
  name: string;
  description?: string;
  time?: string;
  frequency?: string;
  daysOfWeek?: number[];
  status?: "active" | "inactive";
  category?: { id: string, name: string, color: string };
  history: boolean[];
};

interface HabitTableProps {
  habits: HabitData[];
  onToggleDay: (habitId: string | number, dayIndex: number) => void;
  onEdit?: (habitId: string | number) => void;
  onArchive?: (habitId: string | number) => void;
}

// Helper to format 'HH:mm' to 'h:mm A'
const formatTimeAMPM = (timeString?: string) => {
  if (!timeString) return '';
  const [hourString, minute] = timeString.split(':');
  if (!hourString || !minute) return timeString;
  const hour = parseInt(hourString, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const formattedHour = hour % 12 || 12;
  return `${formattedHour}:${minute} ${ampm}`;
};

const CustomCheckbox = ({ 
  checked, 
  onChange, 
  disabled, 
  title 
}: { 
  checked: boolean; 
  onChange: () => void; 
  disabled?: boolean; 
  title?: string;
}) => {
  return (
    <div
      onClick={disabled ? undefined : onChange}
      title={title}
      className={`w-[14px] h-[14px] rounded-[3px] flex items-center justify-center transition-colors ${
        disabled 
          ? 'bg-[#18181b] border border-[#27272a] opacity-30 cursor-not-allowed'
          : checked 
            ? 'bg-white border border-white cursor-pointer' 
            : 'border border-[#27272a] hover:border-[#3f3f46] cursor-pointer'
        }`}
    >
      {checked && (
        <svg className={`w-2.5 h-2.5 ${disabled ? 'text-gray-500' : 'text-black'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      )}
    </div>
  );
};

const HeaderCheckboxIcon = () => (
  <svg className="w-3.5 h-3.5 text-[#52525b]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="3" ry="3"></rect>
    <polyline points="9 11 12 14 22 4"></polyline>
  </svg>
);

const ProgressCircle = ({ percentage }: { percentage: number }) => {
  const radius = 6.5;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium w-14 text-right">{percentage.toFixed(2)}%</span>
      <svg className="w-4 h-4 transform -rotate-90" viewBox="0 0 16 16">
        <circle cx="8" cy="8" r={radius} stroke="#27272a" strokeWidth="2" fill="none" />
        <circle
          cx="8"
          cy="8"
          r={radius}
          stroke="white"
          strokeWidth="2"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};

const HabitTable: React.FC<HabitTableProps> = ({ habits, onToggleDay, onEdit, onArchive }) => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div className="w-full overflow-x-auto border-t border-[#27272a] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none">
      <table className="w-full text-sm text-left whitespace-nowrap min-w-max">
        <thead>
          <tr className="border-b border-[#27272a] text-[#a1a1aa] text-xs">
            {/* Header: Habit Name */}
            <th className="w-full py-2.5 px-4 font-normal flex items-center gap-1.5 sticky left-0 bg-[#121212] z-10">
              <div className='w-full flex items-center justify-between'>
                <span>Plans</span>
                \
                <span>Days</span>
              </div>
            </th>

            {/* Header: Real Calendar Days */}
            {daysArray.map((day, i) => {
              const date = new Date(currentYear, currentMonth, day);
              const weekday = date.toLocaleDateString('en-US', { weekday: 'narrow' });
              const isToday = day === now.getDate();

              return (
                <th key={day} className="py-1 px-1 font-normal text-center min-w-[28px] w-[28px]">
                  <div className="flex flex-col items-center justify-center text-[10px]">
                    <span className="text-[#52525b] mb-0.5">{weekday}</span>
                    <span className={`w-5 h-5 flex items-center justify-center rounded-full ${isToday ? 'bg-white text-black font-bold' : 'text-[#a1a1aa]'}`}>
                      {day}
                    </span>
                  </div>
                </th>
              );
            })}

            {/* Header: Progress */}
            <th className="py-2.5 px-4 font-normal flex items-center gap-1.5 justify-end">
              <span className="font-serif italic font-medium text-xs">∑</span>
              <span>Progress</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {habits.map((habit) => {
            let targetDaysInMonth = daysInMonth;
            if (habit.daysOfWeek && habit.daysOfWeek.length > 0 && habit.daysOfWeek.length < 7) {
              targetDaysInMonth = daysArray.reduce((acc, day) => {
                const d = new Date(currentYear, currentMonth, day).getDay();
                return habit.daysOfWeek!.includes(d) ? acc + 1 : acc;
              }, 0);
            }

            const completedCount = habit.history.filter(Boolean).length;
            const percentage = targetDaysInMonth > 0 ? (completedCount / targetDaysInMonth) * 100 : 0;

            return (
              <tr key={habit.id} className="border-b border-[#27272a] hover:bg-white/2 transition-colors group">
                {/* Data: Habit Name */}
                <td className="relative py-2.5 px-4 left-0 bg-[#121212] group-hover:bg-[#18181b] transition-colors z-10 shadow-[1px_0_0_0_#27272a] overflow-hidden group/cell">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between gap-2">

                      <div className='flex items-center gap-2'>
                        <div className="size-3 rounded-full" style={{ backgroundColor: habit?.category?.color }} />
                        <span className="font-bold text-white">{habit.name}</span>
                      </div>

                      {habit.time && <span className="text-[12px] text-gray-400 px-1.5 py-0.5 rounded">{formatTimeAMPM(habit.time)}</span>}
                    </div>
                  </div>

                  {/* Hover Backdrop Actions */}
                  <div className="absolute inset-0 bg-black/80 backdrop-blur-[2px] flex items-center justify-center gap-4 opacity-0 group-hover/cell:opacity-100 transition-opacity">
                    <button
                      onClick={() => onEdit && onEdit(habit.id)}
                      className="text-xs font-medium text-white hover:text-gray-300 transition-colors flex items-center gap-1.5"
                    >
                      <FiEdit2 size={12} /> Edit
                    </button>
                    <button
                      onClick={() => onArchive && onArchive(habit.id)}
                      className="text-xs font-medium text-white hover:text-red-400 transition-colors flex items-center gap-1.5"
                    >
                      <FiArchive size={12} /> Inactive
                    </button>
                  </div>
                </td>

                {/* Data: Calendar Days Checkboxes */}
                {daysArray.map((_, index) => {
                  const dayDate = new Date(currentYear, currentMonth, index + 1);
                  const dayOfWeek = dayDate.getDay();
                  const isAvailable = !habit.daysOfWeek || habit.daysOfWeek.length === 0 || habit.daysOfWeek.includes(dayOfWeek);

                  return (
                    <td key={index} className="py-2.5 px-1 text-center">
                      <div className="flex justify-center">
                        <CustomCheckbox
                          checked={!!habit.history[index]}
                          onChange={() => onToggleDay(habit.id, index)}
                          disabled={!isAvailable}
                          title={!isAvailable ? "This habit is not set for this day" : undefined}
                        />
                      </div>
                    </td>
                  );
                })}

                {/* Data: Progress */}
                <td className="py-2.5 px-4 text-[#d4d4d8] flex justify-end">
                  <ProgressCircle percentage={percentage} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export const HabitTableSkeleton = () => {
  const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div className="w-full overflow-x-auto border-t border-[#27272a] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none">
      <table className="w-full text-sm text-left whitespace-nowrap min-w-max">
        <thead>
          <tr className="border-b border-[#27272a]">
            <th className="py-2.5 px-4 sticky left-0 bg-[#121212] z-10 w-[200px]">
              <div className="h-4 bg-[#27272a] rounded animate-pulse w-24"></div>
            </th>
            {daysArray.map((day) => (
              <th key={day} className="py-1 px-1 min-w-[28px] w-[28px]">
                <div className="flex flex-col items-center justify-center space-y-1">
                  <div className="h-2 w-3 bg-[#27272a] rounded animate-pulse"></div>
                  <div className="h-4 w-4 bg-[#27272a] rounded-full animate-pulse"></div>
                </div>
              </th>
            ))}
            <th className="py-2.5 px-4 justify-end flex">
              <div className="h-4 bg-[#27272a] rounded animate-pulse w-16"></div>
            </th>
          </tr>
        </thead>
        <tbody>
          {[1, 2, 3, 4].map((row) => (
            <tr key={row} className="border-b border-[#27272a]">
              <td className="py-3 px-4 sticky left-0 bg-[#121212] z-10">
                <div className="h-4 bg-[#27272a] rounded animate-pulse w-32"></div>
              </td>
              {daysArray.map((_, index) => (
                <td key={index} className="py-3 px-1 text-center">
                  <div className="h-3.5 w-3.5 bg-[#27272a] rounded-[3px] mx-auto animate-pulse"></div>
                </td>
              ))}
              <td className="py-3 px-4 flex justify-end items-center gap-2">
                <div className="h-4 bg-[#27272a] rounded animate-pulse w-8"></div>
                <div className="h-4 w-4 bg-[#27272a] rounded-full animate-pulse"></div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HabitTable;
