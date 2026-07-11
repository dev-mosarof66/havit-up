'use client'
import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { MdTrackChanges, MdLocalFireDepartment } from 'react-icons/md';
import { FiPercent } from 'react-icons/fi';
import StatCard from '@/components/StatCard';
import Heatmap from '@/components/Heatmap';
import PageHeader from '@/components/PageHeader';
import LineChart from '@/components/LineChart';
import { getDashboardStats } from '@/app/actions/habitActions';

export default function Home() {
  const [days, setDays] = useState<{ date: string; active: boolean }[]>([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [activeHabitsCount, setActiveHabitsCount] = useState(0);
  const [weekdayData, setWeekdayData] = useState<{name: string, count: number}[]>([]);
  const [totalLogs, setTotalLogs] = useState(0);

  useEffect(() => {
    async function loadStats() {
      const res = await getDashboardStats(parseInt(selectedYear, 10));
      if (res.success && res.days) {
        setDays(res.days);
        setActiveHabitsCount(res.activeHabits || 0);
        setWeekdayData(res.weekdayData || []);
        setTotalLogs(res.totalLogs || 0);
      }
    }
    loadStats();
  }, [selectedYear]);

  const toggleDay = (index: number) => {
    // Toggle on dashboard doesn't save to DB right now, but we'll leave it as a visual interaction or disable it.
    // For now we'll just leave it as visual.
    const newDays = [...days];
    newDays[index].active = !newDays[index].active;
    setDays(newDays);
  };

  const metrics = useMemo(() => {
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    let activeDays = 0;

    const todayStr = new Date().toISOString().split('T')[0];

    for (let i = 0; i < days.length; i++) {
      const isFuture = days[i].date > todayStr;
      
      if (days[i].active) {
        activeDays++;
        tempStreak++;
        if (tempStreak > longestStreak) longestStreak = tempStreak;
        if (!isFuture) currentStreak = tempStreak;
      } else {
        tempStreak = 0;
        // Only reset current streak if the day is not in the future
        // We also want to allow yesterday to be inactive without breaking today's potential streak? 
        // Actually, if a past day is inactive, the streak breaks.
        if (!isFuture) currentStreak = 0;
      }
    }

    const totalDays = days.length > 0 ? days.length : 365;
    const completionRate = Math.round((activeDays / totalDays) * 100);

    return {
      activeHabits: activeHabitsCount,
      completionRate: completionRate,
      currentStreak: currentStreak,
      longestStreak: longestStreak,
    };
  }, [days, activeHabitsCount]);

  return (
    <div className="p-8 w-full min-h-screen flex flex-col gap-4">
      <PageHeader
        title="Dashboard"
        subtitle="Welcome back! Here's a summary of your habits."
        action={
          <div className="flex items-center gap-3">
            <Link href="/habits" className="px-4 py-2 text-sm font-medium border border-foreground/20 hover:bg-foreground/10 text-foreground rounded-md transition-colors">
              Log Progress
            </Link>
            <Link href="/habits" className="px-4 py-2 text-sm font-medium bg-foreground text-background hover:bg-foreground/90 rounded-md transition-colors">
              + New Habit
            </Link>
          </div>
        }
      />

      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Active Habits"
          value={metrics.activeHabits}
          icon={<MdTrackChanges size={20} />}
        />
        <StatCard
          title="Completion Rate"
          value={`${metrics.completionRate}%`}
          icon={<FiPercent size={18} className="text-[#ef4444]" />}
          valueColor="text-[#ef4444]"
        />
        <StatCard
          title="Current Streak"
          value={metrics.currentStreak}
          icon={<MdLocalFireDepartment size={20} className="text-[#ef4444]" />}
          valueColor="text-[#ef4444]"
        />
        <StatCard
          title="Longest Streak"
          value={metrics.longestStreak}
          icon={<MdLocalFireDepartment size={20} className="text-[#22c55e]" />}
          valueColor="text-[#22c55e]"
        />
      </div>

      {/* Habit Streak Heatmap Area */}
      <div className='w-full grid grid-cols-3 gap-4'>
        <Heatmap
          days={days}
          currentStreak={metrics.currentStreak}
          selectedYear={selectedYear}
          onYearChange={setSelectedYear}
          onToggleDay={toggleDay}
        />
        <LineChart title="Weekly Consistency" data={weekdayData} color="#fbbf24" />
      </div>

    </div>
  );
}