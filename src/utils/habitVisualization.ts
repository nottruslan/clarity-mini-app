import { Habit } from './storage';

export interface HeatmapData {
  date: string;
  value: number;
  intensity: number; // 0-4 для разных уровней интенсивности
}

export interface ChartData {
  date: string;
  completed: number;
  target?: number;
}

export interface WeekData {
  week: number;
  completed: number;
  total: number;
  percentage: number;
}

/**
 * Генерация данных для heatmap
 */
export function generateHeatmapData(habit: Habit, days: number = 365): HeatmapData[] {
  const data: HeatmapData[] = [];
  const today = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateKey = date.toISOString().split('T')[0];
    
    const historyEntry = habit.history[dateKey];
    const completed = historyEntry?.completed ? 1 : 0;
    
    // Интенсивность на основе значения (если есть)
    let intensity = 0;
    if (completed) {
      if (habit.targetValue && historyEntry?.value) {
        const ratio = historyEntry.value / habit.targetValue;
        intensity = Math.min(Math.floor(ratio * 4), 4);
      } else {
        intensity = 2; // Средняя интенсивность для простого выполнения
      }
    }
    
    data.push({
      date: dateKey,
      value: historyEntry?.value || 0,
      intensity
    });
  }
  
  return data;
}

/**
 * Генерация данных для графика за период
 */
export function generateChartData(
  habit: Habit,
  startDate: Date,
  endDate: Date
): ChartData[] {
  const data: ChartData[] = [];
  const currentDate = new Date(startDate);
  
  while (currentDate <= endDate) {
    const dateKey = currentDate.toISOString().split('T')[0];
    const historyEntry = habit.history[dateKey];
    
    data.push({
      date: dateKey,
      completed: historyEntry?.completed ? (historyEntry.value || 1) : 0,
      target: habit.targetValue
    });
    
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return data;
}

/**
 * Генерация данных по неделям
 */
export function generateWeekData(habit: Habit, weeks: number = 12): WeekData[] {
  const data: WeekData[] = [];
  const today = new Date();
  
  for (let w = weeks - 1; w >= 0; w--) {
    const weekStart = new Date(today);
    weekStart.setDate(weekStart.getDate() - (w * 7) - (today.getDay() || 7) + 1);
    
    let completed = 0;
    let total = 0;
    
    for (let d = 0; d < 7; d++) {
      const date = new Date(weekStart);
      date.setDate(date.getDate() + d);
      const dateKey = date.toISOString().split('T')[0];
      
      total++;
      if (habit.history[dateKey]?.completed) {
        completed++;
      }
    }
    
    data.push({
      week: weeks - w,
      completed,
      total,
      percentage: total > 0 ? Math.round((completed / total) * 100) : 0
    });
  }
  
  return data;
}

/**
 * Генерация данных по месяцам
 */
export function generateMonthData(habit: Habit, months: number = 12): WeekData[] {
  const data: WeekData[] = [];
  const today = new Date();
  
  for (let m = months - 1; m >= 0; m--) {
    const monthStart = new Date(today.getFullYear(), today.getMonth() - m, 1);
    const monthEnd = new Date(today.getFullYear(), today.getMonth() - m + 1, 0);
    
    let completed = 0;
    let total = 0;
    
    const currentDate = new Date(monthStart);
    while (currentDate <= monthEnd) {
      const dateKey = currentDate.toISOString().split('T')[0];
      
      total++;
      if (habit.history[dateKey]?.completed) {
        completed++;
      }
      
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    data.push({
      week: months - m,
      completed,
      total,
      percentage: total > 0 ? Math.round((completed / total) * 100) : 0
    });
  }
  
  return data;
}

/**
 * Получить статистику за период
 */
export function getPeriodStats(
  habit: Habit,
  startDate: Date,
  endDate: Date
): {
  totalDays: number;
  completedDays: number;
  completionRate: number;
  averageValue: number;
  totalValue: number;
} {
  let completedDays = 0;
  let totalValue = 0;
  let valueCount = 0;
  
  const currentDate = new Date(startDate);
  const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  
  while (currentDate <= endDate) {
    const dateKey = currentDate.toISOString().split('T')[0];
    const historyEntry = habit.history[dateKey];
    
    if (historyEntry?.completed) {
      completedDays++;
      if (historyEntry.value !== undefined) {
        totalValue += historyEntry.value;
        valueCount++;
      }
    }
    
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return {
    totalDays,
    completedDays,
    completionRate: totalDays > 0 ? Math.round((completedDays / totalDays) * 100) : 0,
    averageValue: valueCount > 0 ? totalValue / valueCount : 0,
    totalValue
  };
}

