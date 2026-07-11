import React from 'react';
import { FaTrashRestore } from "react-icons/fa";
import { FaDeleteLeft } from "react-icons/fa6";

export interface InactiveHabit {
  id: string | number;
  name: string;
  description?: string;
  time?: string;
  frequency?: string;
}

interface InactiveHabitsProps {
  habits: InactiveHabit[];
  onReactivate?: (id: string | number) => Promise<void> | void;
  onDelete?: (id: string | number) => void;
}

const formatTimeAMPM = (timeString?: string) => {
  if (!timeString) return '';
  const [hourString, minute] = timeString.split(':');
  if (!hourString || !minute) return timeString;
  const hour = parseInt(hourString, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const formattedHour = hour % 12 || 12;
  return `${formattedHour}:${minute} ${ampm}`;
};

export default function InactiveHabits({ habits, onReactivate, onDelete }: InactiveHabitsProps) {
  const [reactivatingId, setReactivatingId] = React.useState<string | number | null>(null);

  if (habits.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-32 border border-dashed border-[#27272a] bg-[#121212]/50">
        <p className="text-gray-500 text-sm">No inactive habits.</p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto border-t border-[#27272a]">
      <table className="w-full text-sm text-left whitespace-nowrap min-w-max">
        <thead>
          <tr className="border-b border-[#27272a] text-[#a1a1aa] text-xs">
            <th className="py-2.5 px-4 font-normal">Plan</th>
            <th className="py-2.5 px-4 font-normal">Time</th>
            <th className="py-2.5 px-4 font-normal">Frequency</th>
            <th className="py-2.5 px-4 font-normal text-right">Action</th>
          </tr>
        </thead>
        <tbody>
          {habits.map(habit => (
            <tr key={habit.id} className="border-b border-[#27272a] hover:bg-[#18181b] transition-colors group">
              <td className="py-3 px-4 bg-[#121212] group-hover:bg-[#18181b] transition-colors">
                <div className="flex flex-col">
                  <span className="font-bold text-white">{habit.name}</span>
                  {habit.description && (
                    <span className="text-xs text-gray-500 mt-0.5 truncate max-w-[300px]">{habit.description}</span>
                  )}
                </div>
              </td>
              <td className="py-3 px-4 bg-[#121212] group-hover:bg-[#18181b] transition-colors">
                {habit.time ? (
                  <span className="text-[12px] text-gray-400 px-1.5 py-0.5 bg-[#27272a] rounded">
                    {formatTimeAMPM(habit.time)}
                  </span>
                ) : (
                  <span className="text-gray-600">-</span>
                )}
              </td>
              <td className="py-3 px-4 bg-[#121212] group-hover:bg-[#18181b] transition-colors">
                <span className="text-xs text-gray-400 capitalize">{habit.frequency}</span>
              </td>
              <td className="py-3 px-4 bg-[#121212] group-hover:bg-[#18181b] transition-colors text-right">
                <div className='flex items-center gap-2 justify-end'>
                  <button
                    onClick={async () => {
                      if (onReactivate) {
                        setReactivatingId(habit.id);
                        await onReactivate(habit.id);
                        setReactivatingId(null);
                      }
                    }}
                    disabled={reactivatingId === habit.id}
                    title='Restore'
                    className="text-xs font-medium text-white hover:text-black hover:bg-white bg-[#27272a] px-3 py-1.5 rounded-md transition-colors disabled:opacity-50 flex items-center justify-center min-w-[36px]"
                  >
                    {reactivatingId === habit.id ? (
                      <svg className="animate-spin h-3.5 w-3.5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      <FaTrashRestore className='text-sm' />
                    )}
                  </button>
                  <button
                    onClick={() => onDelete && onDelete(habit.id)}
                    title='Delete'
                    className="font-medium text-white hover:text-black hover:bg-white bg-[#27272a] px-3 py-1.5 rounded-md transition-colors"
                  >
                    <FaDeleteLeft className='text-md text-red-600' />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export const InactiveHabitsSkeleton = () => {
  return (
    <div className="w-full overflow-x-auto border-t border-[#27272a]">
      <table className="w-full text-sm text-left whitespace-nowrap min-w-max">
        <thead>
          <tr className="border-b border-[#27272a] text-[#a1a1aa] text-xs">
            <th className="py-2.5 px-4 font-normal sticky left-0 bg-[#121212] z-10 w-[200px]">
              <div className="h-4 bg-[#27272a] rounded animate-pulse w-24"></div>
            </th>
            <th className="py-2.5 px-4 font-normal">
              <div className="h-4 bg-[#27272a] rounded animate-pulse w-16"></div>
            </th>
            <th className="py-2.5 px-4 font-normal">
              <div className="h-4 bg-[#27272a] rounded animate-pulse w-12"></div>
            </th>
            <th className="py-2.5 px-4 font-normal">
              <div className="h-4 bg-[#27272a] rounded animate-pulse w-16"></div>
            </th>
            <th className="py-2.5 px-4 font-normal flex justify-end">
              <div className="h-4 bg-[#27272a] rounded animate-pulse w-16"></div>
            </th>
          </tr>
        </thead>
        <tbody>
          {[1, 2, 3].map((row) => (
            <tr key={row} className="border-b border-[#27272a]">
              <td className="py-3 px-4 sticky left-0 bg-[#121212] z-10">
                <div className="h-4 bg-[#27272a] rounded animate-pulse w-32"></div>
              </td>
              <td className="py-3 px-4">
                <div className="h-4 bg-[#27272a] rounded animate-pulse w-20"></div>
              </td>
              <td className="py-3 px-4">
                <div className="h-4 bg-[#27272a] rounded animate-pulse w-14"></div>
              </td>
              <td className="py-3 px-4">
                <div className="h-4 bg-[#27272a] rounded animate-pulse w-16"></div>
              </td>
              <td className="py-3 px-4 flex justify-end items-center gap-2">
                <div className="h-7 w-8 bg-[#27272a] rounded animate-pulse"></div>
                <div className="h-7 w-8 bg-[#27272a] rounded animate-pulse"></div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
