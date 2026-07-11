'use client';
import React, { useState, useEffect } from 'react';
import PageHeader from '@/components/PageHeader';
import BarChart from '@/components/BarChart';
import LineChart from '@/components/LineChart';
import DonutChart, { DonutChartData } from '@/components/DonutChart';
import Leaderboard from '@/components/Leaderboard';
import { getAnalyticsData } from '@/app/actions/habitActions';

export default function AnalyticsPage() {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [isLoading, setIsLoading] = useState(true);
  
  const [monthlyData, setMonthlyData] = useState<{name: string, count: number}[]>([]);
  const [weekdayData, setWeekdayData] = useState<{name: string, count: number}[]>([]);
  const [categoryData, setCategoryData] = useState<DonutChartData[]>([]);
  const [leaderboardData, setLeaderboardData] = useState<{habitName: string, longestStreak: number}[]>([]);
  const [totalLogs, setTotalLogs] = useState(0);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      const res = await getAnalyticsData(parseInt(selectedYear, 10));
      if (res.success && res.data) {
        setMonthlyData(res.data.monthlyData);
        setWeekdayData(res.data.weekdayData);
        setCategoryData(res.data.categoryData);
        setLeaderboardData(res.data.leaderboard);
        setTotalLogs(res.data.totalLogs);
      }
      setIsLoading(false);
    }
    fetchData();
  }, [selectedYear]);

  return (
    <div className="p-8 w-full min-h-screen flex flex-col gap-6">
      <div className="flex justify-between items-start">
        <PageHeader
          title="Analytics"
          subtitle="Deep dive into your habit tracking history and performance."
        />
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="bg-[#121212] border border-[#27272a] text-sm text-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-gray-500 cursor-pointer"
        >
          <option value="2026">2026</option>
          <option value="2025">2025</option>
        </select>
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-6 w-full animate-pulse">
          {/* Top Row Skeletons */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-80">
            <div className="bg-[#18181b] border border-[#27272a] rounded-xl h-full w-full"></div>
            <div className="bg-[#18181b] border border-[#27272a] rounded-xl h-full w-full"></div>
          </div>
          {/* Bottom Row Skeletons */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-80">
            <div className="bg-[#18181b] border border-[#27272a] rounded-xl h-full w-full"></div>
            <div className="bg-[#18181b] border border-[#27272a] rounded-xl h-full w-full"></div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          
          {/* Top Row: Trends */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-80">
            <BarChart 
              title="Monthly Completions" 
              data={monthlyData} 
              color="#38bdf8"
            />
            <LineChart 
              title="Weekday Consistency" 
              data={weekdayData} 
              color="#fbbf24"
            />
          </div>

          {/* Bottom Row: Distribution & Leaderboard */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DonutChart 
              data={categoryData} 
              totalLogs={totalLogs} 
            />
            <Leaderboard 
              data={leaderboardData} 
            />
          </div>

        </div>
      )}
    </div>
  );
}
