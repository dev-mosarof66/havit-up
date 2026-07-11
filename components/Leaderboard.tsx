import React from 'react';

interface LeaderboardProps {
  data: { habitName: string; longestStreak: number }[];
}

const Leaderboard: React.FC<LeaderboardProps> = ({ data }) => {
  return (
    <div className="bg-[#18181b] border border-[#27272a] rounded-xl p-6 flex flex-col h-full">
      <h2 className="text-gray-400 font-bold mb-6">Longest Streaks Leaderboard</h2>
      
      <div className="flex flex-col gap-4">
        {data.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-4">No data available.</p>
        ) : (
          data.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-[#121212] border border-[#27272a]">
              <div className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  index === 0 ? 'bg-yellow-500/20 text-yellow-500' :
                  index === 1 ? 'bg-gray-300/20 text-gray-300' :
                  index === 2 ? 'bg-orange-500/20 text-orange-500' :
                  'bg-white/10 text-white'
                }`}>
                  {index + 1}
                </div>
                <span className="text-white font-medium">{item.habitName}</span>
              </div>
              <div className="text-sm">
                <span className="font-bold text-[#22c55e]">{item.longestStreak}</span>
                <span className="text-gray-500 ml-1">days</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
