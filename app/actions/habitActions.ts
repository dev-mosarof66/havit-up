"use server";

import { getDataSource, Habit, HabitLog, Category } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { Like } from "typeorm";
import { getSession } from "@/app/actions/authActions";
import { logger } from "@/lib/logger";

export async function createHabit(data: {
  name: string;
  description?: string;
  time?: string;
  frequency: "daily" | "weekly" | "custom";
  daysOfWeek: number[];
  categoryId: string;
}) {
  try {
    const session = await getSession();
    if (!session) return { success: false, error: "Unauthorized" };

    const dataSource = await getDataSource();
    const habitRepo = dataSource.getRepository(Habit);
    
    const newHabit = habitRepo.create({
      name: data.name,
      description: data.description,
      time: data.time,
      frequency: data.frequency,
      daysOfWeek: data.daysOfWeek,
      categoryId: data.categoryId,
      userId: session.id,
    });
    
    await habitRepo.save(newHabit);
    
    revalidatePath("/habits");
    
    // Next.js requires Server Actions to return plain objects, not class instances
    const plainHabit = {
      id: newHabit.id,
      name: newHabit.name,
      description: newHabit.description,
      time: newHabit.time,
      frequency: newHabit.frequency,
      daysOfWeek: newHabit.daysOfWeek,
      status: newHabit.status,
      categoryId: newHabit.categoryId,
      createdAt: newHabit.createdAt,
      updatedAt: newHabit.updatedAt
    };
    
    return { success: true, habit: plainHabit };
  } catch (error) {
    logger.error("HabitActions", "Failed to create habit", error);
    return { success: false, error: "Failed to create habit in database" };
  }
}

export async function getCategories() {
  try {
    const session = await getSession();
    if (!session) return { success: false, error: "Unauthorized", categories: [] };

    const dataSource = await getDataSource();
    const categoryRepo = dataSource.getRepository(Category);
    const categories = await categoryRepo.find({ order: { name: 'ASC' } });
    
    return { success: true, categories: categories.map(c => ({ id: c.id, name: c.name, color: c.color })) };
  } catch (error) {
    logger.error("HabitActions", "Failed to fetch categories", error);
    return { success: false, error: "Failed to fetch categories", categories: [] };
  }
}

export async function createCategory(name: string, color: string = "#9ca3af") {
  try {
    const session = await getSession();
    if (!session) return { success: false, error: "Unauthorized" };

    const dataSource = await getDataSource();
    const categoryRepo = dataSource.getRepository(Category);
    
    // check if it already exists
    const existing = await categoryRepo.findOne({ where: { name } });
    if (existing) {
      return { success: false, error: "Category already exists" };
    }

    const newCategory = categoryRepo.create({ name, color });
    await categoryRepo.save(newCategory);
    
    return { success: true, category: { id: newCategory.id, name: newCategory.name, color: newCategory.color } };
  } catch (error) {
    logger.error("HabitActions", "Failed to create category", error);
    return { success: false, error: "Failed to create category" };
  }
}

export async function getHabits() {
  try {
    const session = await getSession();
    if (!session) return { success: false, error: "Unauthorized", habits: [] };

    const dataSource = await getDataSource();
    const habitRepo = dataSource.getRepository(Habit);
    
    const habits = await habitRepo.find({
      where: { userId: session.id },
      order: { time: 'ASC' },
      relations: {
        logs: true,
        category: true,
      },
    });
    
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    
    const formattedHabits = habits.map(h => {
      const history = Array(daysInMonth).fill(false);
      
      if (h.logs) {
        h.logs.forEach(log => {
          const [yearStr, monthStr, dayStr] = log.date.split('-');
          const year = parseInt(yearStr, 10);
          const month = parseInt(monthStr, 10) - 1; // 0-indexed month
          const day = parseInt(dayStr, 10);
          
          if (year === currentYear && month === currentMonth) {
            history[day - 1] = true;
          }
        });
      }

      return {
        id: h.id, 
        name: h.name,
        description: h.description,
        frequency: h.frequency,
        daysOfWeek: h.daysOfWeek,
        time: h.time,
        status: h.status,
        category: h.category ? { id: h.category.id, name: h.category.name, color: h.category.color } : undefined,
        history
      };
    }).sort((a, b) => {
      if (!a.time && !b.time) return 0;
      if (!a.time) return 1;
      if (!b.time) return -1;
      return a.time.localeCompare(b.time);
    });
    
    return { success: true, habits: formattedHabits };
  } catch (error) {
    logger.error("HabitActions", "Failed to fetch habits", error);
    return { success: false, error: "Failed to fetch habits from database", habits: [] };
  }
}

export async function updateHabit(id: string | number, data: {
  name: string;
  description?: string;
  time?: string;
  frequency: "daily" | "weekly" | "custom";
  daysOfWeek: number[];
  status?: "active" | "inactive";
  categoryId?: string;
}) {
  try {
    const dataSource = await getDataSource();
    const habitRepo = dataSource.getRepository(Habit);
    
    const session = await getSession();
    if (!session) return { success: false, error: "Unauthorized" };

    const habit = await habitRepo.findOne({ where: { id: id as any, userId: session.id } });
    if (!habit) return { success: false, error: "Habit not found" };

    habit.name = data.name;
    if (data.description !== undefined) habit.description = data.description;
    if (data.time !== undefined) habit.time = data.time;
    habit.frequency = data.frequency;
    habit.daysOfWeek = data.daysOfWeek;
    if (data.status !== undefined) habit.status = data.status;
    if (data.categoryId !== undefined) habit.categoryId = data.categoryId;
    
    await habitRepo.save(habit);
    
    revalidatePath("/habits");
    return { success: true, habit: { ...habit } };
  } catch (error) {
    logger.error("HabitActions", "Failed to update habit", error);
    return { success: false, error: "Failed to update habit in database" };
  }
}

export async function deleteHabit(id: string | number) {
  try {
    const dataSource = await getDataSource();
    const habitRepo = dataSource.getRepository(Habit);
    
    const session = await getSession();
    if (!session) return { success: false, error: "Unauthorized" };

    const habit = await habitRepo.findOne({ where: { id: id as any, userId: session.id } });
    if (!habit) return { success: false, error: "Habit not found" };
    const result = await habitRepo.delete({ id: id as any });
    if (result.affected === 0) {
      return { success: false, error: "Habit not found" };
    }
    
    revalidatePath("/habits");
    return { success: true };
  } catch (error) {
    logger.error("HabitActions", "Failed to delete habit", error);
    return { success: false, error: "Failed to delete habit from database" };
  }
}

export async function toggleHabitLog(habitId: string | number, dayIndex: number) {
  try {
    const session = await getSession();
    if (!session) return { success: false, error: "Unauthorized" };

    const dataSource = await getDataSource();
    const logRepo = dataSource.getRepository(HabitLog);
    
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    const day = dayIndex + 1;
    
    const monthStr = String(currentMonth + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    const dateStr = `${currentYear}-${monthStr}-${dayStr}`;

    const habitRepo = dataSource.getRepository(Habit);
    const habit = await habitRepo.findOne({ where: { id: habitId as any, userId: session.id } });
    if (!habit) return { success: false, error: "Habit not found" };

    const existingLog = await logRepo.findOne({
      where: { habit: { id: habitId as any, userId: session.id }, date: dateStr }
    });

    if (existingLog) {
      await logRepo.remove(existingLog);
    } else {
      const newLog = logRepo.create({
        habit: { id: habitId as any },
        date: dateStr
      });
      await logRepo.save(newLog);
    }

    revalidatePath("/habits");
    return { success: true };
  } catch (error) {
    logger.error("HabitActions", "Failed to toggle habit log", error);
    return { success: false, error: "Failed to update log in database" };
  }
}

export async function getDashboardStats(year: number) {
  try {
    const session = await getSession();
    if (!session) return { success: false, error: "Unauthorized", activeHabits: 0, days: [], distribution: [], weekdayData: [], totalLogs: 0 };

    const dataSource = await getDataSource();
    const habitRepo = dataSource.getRepository(Habit);
    const logRepo = dataSource.getRepository(HabitLog);

    const activeHabitsCount = await habitRepo.count({
      where: { status: "active", userId: session.id }
    });

    const logs = await logRepo.find({
      where: {
        date: Like(`${year}-%`),
        habit: { userId: session.id }
      },
      relations: {
        habit: true
      }
    });

    const days: { date: string; active: boolean }[] = [];
    const start = new Date(year, 0, 1);
    const end = new Date(year + 1, 0, 1);
    
    const activeDates = new Set(logs.map(log => log.date));

    // Calculate distribution and monthly breakdown by habit name
    const distributionMap: Record<string, number> = {};
    const monthlyMap: Record<string, Record<string, number>> = {};
    const weekdayCounts = new Array(7).fill(0);
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    let totalLogs = 0;
    
    logs.forEach(log => {
      // Weekday
      const dateObj = new Date(log.date);
      const dayOfWeek = dateObj.getDay();
      weekdayCounts[dayOfWeek]++;


      if (log.habit && log.habit.name) {
        const habitName = log.habit.name;
        distributionMap[habitName] = (distributionMap[habitName] || 0) + 1;
        
        // Extract month (1-12) from 'YYYY-MM-DD'
        const monthMatch = log.date.split('-')[1];
        if (monthMatch) {
          const monthInt = parseInt(monthMatch, 10);
          const monthName = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][monthInt - 1];
          
          if (!monthlyMap[habitName]) {
            monthlyMap[habitName] = {};
          }
          monthlyMap[habitName][monthName] = (monthlyMap[habitName][monthName] || 0) + 1;
        }
        
        totalLogs++;
      }
    });

    // We can assign fixed colors or generate them. Let's use a standard array of colors.
    const colors = ['#38bdf8', '#f472b6', '#4ade80', '#c084fc', '#22d3ee', '#fbbf24', '#f87171', '#34d399', '#a78bfa'];
    
    const distribution = Object.keys(distributionMap)
      .map((name, index) => {
        const count = distributionMap[name];
        // Provide the exact count of logs per month to avoid confusing percentages
        const monthlyCounts: Record<string, string> = {};
        if (monthlyMap[name]) {
          Object.keys(monthlyMap[name]).forEach(month => {
            monthlyCounts[month] = `${monthlyMap[name][month]} logs`;
          });
        }
        
        return {
          name,
          count,
          value: totalLogs > 0 ? Math.round((count / totalLogs) * 100) : 0,
          color: colors[index % colors.length],
          monthlyCounts
        };
      })
      .sort((a, b) => b.count - a.count); // sort by highest count

    for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
      const yearStr = d.getFullYear();
      const monthStr = String(d.getMonth() + 1).padStart(2, '0');
      const dayStr = String(d.getDate()).padStart(2, '0');
      const dateStr = `${yearStr}-${monthStr}-${dayStr}`;

      days.push({
        date: dateStr,
        active: activeDates.has(dateStr)
      });
    }

    const weekdayData = dayNames.map((name, i) => ({ name, count: weekdayCounts[i] }));
    const sortedWeekdayData = [...weekdayData.slice(1), weekdayData[0]];

    return {
      success: true,
      activeHabits: activeHabitsCount,
      days,
      distribution,
      weekdayData: sortedWeekdayData,
      totalLogs
    };
  } catch (error) {
    logger.error("HabitActions", "Failed to fetch dashboard stats", error);
    return { success: false, error: "Failed to fetch stats", activeHabits: 0, days: [], distribution: [], weekdayData: [], totalLogs: 0 };
  }
}

export async function getAnalyticsData(year: number) {
  try {
    const session = await getSession();
    if (!session) return { success: false, error: "Unauthorized", data: null };

    const dataSource = await getDataSource();
    const habitRepo = dataSource.getRepository(Habit);
    const logRepo = dataSource.getRepository(HabitLog);

    // Fetch all logs for the year
    const logs = await logRepo.find({
      where: { date: Like(`${year}-%`), habit: { userId: session.id } },
      relations: { habit: { category: true } }
    });

    const habits = await habitRepo.find({ where: { userId: session.id }, relations: { logs: true } });

    // 1. Monthly Completions
    const monthlyCounts = new Array(12).fill(0);
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    // 2. Weekday Distribution
    const weekdayCounts = new Array(7).fill(0);
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    // 3. Category Distribution
    const categoryMap: Record<string, { count: number; color: string; name: string }> = {};

    logs.forEach(log => {
      // Monthly
      const month = parseInt(log.date.split('-')[1], 10) - 1;
      if (month >= 0 && month < 12) monthlyCounts[month]++;

      // Weekday
      const dateObj = new Date(log.date);
      const dayOfWeek = dateObj.getDay();
      weekdayCounts[dayOfWeek]++;

      // Category
      if (log.habit && log.habit.category) {
        const cat = log.habit.category;
        if (!categoryMap[cat.id]) {
          categoryMap[cat.id] = { count: 0, color: cat.color, name: cat.name };
        }
        categoryMap[cat.id].count++;
      } else {
        if (!categoryMap['unassigned']) {
          categoryMap['unassigned'] = { count: 0, color: '#9ca3af', name: 'Unassigned' };
        }
        categoryMap['unassigned'].count++;
      }
    });

    const monthlyData = monthNames.map((name, i) => ({ name, count: monthlyCounts[i] }));
    const weekdayData = dayNames.map((name, i) => ({ name, count: weekdayCounts[i] }));
    
    // Sort weekday so Monday is first
    const sortedWeekdayData = [...weekdayData.slice(1), weekdayData[0]];

    const categoryData = Object.values(categoryMap).map(c => ({
      name: c.name,
      count: c.count,
      color: c.color,
      value: logs.length > 0 ? Math.round((c.count / logs.length) * 100) : 0
    })).sort((a, b) => b.count - a.count);

    // 4. Streaks Leaderboard
    const todayStr = new Date().toISOString().split('T')[0];
    const leaderboard = habits.map(h => {
      let longestStreak = 0;
      let tempStreak = 0;
      
      // Sort logs by date ascending
      const sortedLogs = h.logs ? h.logs.sort((a, b) => a.date.localeCompare(b.date)) : [];
      const logDates = new Set(sortedLogs.map(l => l.date));

      if (logDates.size > 0) {
        // Find min date and max date, iterate through all days in between
        const minDate = sortedLogs[0].date;
        // Don't iterate past today
        const maxDate = todayStr;
        
        let d = new Date(minDate);
        const endD = new Date(maxDate);
        
        while (d <= endD) {
          const dStr = d.toISOString().split('T')[0];
          if (logDates.has(dStr)) {
            tempStreak++;
            if (tempStreak > longestStreak) longestStreak = tempStreak;
          } else {
            tempStreak = 0;
          }
          d.setDate(d.getDate() + 1);
        }
      }

      return {
        habitName: h.name,
        longestStreak
      };
    }).sort((a, b) => b.longestStreak - a.longestStreak).slice(0, 5); // top 5

    return {
      success: true,
      data: {
        monthlyData,
        weekdayData: sortedWeekdayData,
        categoryData,
        leaderboard,
        totalLogs: logs.length
      }
    };
  } catch (error) {
    logger.error("HabitActions", "Failed to fetch analytics stats", error);
    return { success: false, error: "Failed to fetch analytics" };
  }
}

