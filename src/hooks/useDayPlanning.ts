import { useMemo } from 'react';
import { Task } from '../utils/storage';
import { getTasksForDay, sortTasksByTime, getTaskDuration } from '../utils/taskTimeUtils';

export interface DayPlanningStats {
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  todoTasks: number;
  totalDuration: number; // в минутах
  freeTime: number; // в минутах
  tasksByEnergy: {
    low: number;
    medium: number;
    high: number;
  };
}

export interface UseDayPlanningOptions {
  tasks: Task[];
  date: Date;
  dayStartMinutes?: number; // время начала дня в минутах от полуночи (по умолчанию 6:00)
  dayEndMinutes?: number; // время окончания дня в минутах от полуночи (по умолчанию 24:00)
}

export function useDayPlanning({
  tasks,
  date,
  dayStartMinutes = 360, // 6:00
  dayEndMinutes = 1440 // 24:00
}: UseDayPlanningOptions) {
  const dayTasks = useMemo(() => {
    return getTasksForDay(tasks, date);
  }, [tasks, date]);

  const sortedTasks = useMemo(() => {
    return sortTasksByTime(dayTasks, date);
  }, [dayTasks, date]);

  const stats: DayPlanningStats = useMemo(() => {
    const stats: DayPlanningStats = {
      totalTasks: dayTasks.length,
      completedTasks: 0,
      inProgressTasks: 0,
      todoTasks: 0,
      totalDuration: 0,
      freeTime: 0,
      tasksByEnergy: {
        low: 0,
        medium: 0,
        high: 0
      }
    };

    dayTasks.forEach(task => {
      // Статистика по статусам
      if (task.status === 'completed' || task.completed) {
        stats.completedTasks++;
      } else if (task.status === 'in-progress') {
        stats.inProgressTasks++;
      } else {
        stats.todoTasks++;
      }

      // Статистика по длительности
      const duration = getTaskDuration(task);
      if (duration) {
        stats.totalDuration += duration;
      }

      // Статистика по энергозатратности
      if (task.energyLevel === 'low') {
        stats.tasksByEnergy.low++;
      } else if (task.energyLevel === 'medium') {
        stats.tasksByEnergy.medium++;
      } else if (task.energyLevel === 'high') {
        stats.tasksByEnergy.high++;
      }
    });

    // Вычисляем свободное время
    stats.freeTime = (dayEndMinutes - dayStartMinutes) - stats.totalDuration;
    stats.freeTime = Math.max(0, stats.freeTime);

    return stats;
  }, [dayTasks, dayStartMinutes, dayEndMinutes]);

  /**
   * Рекомендация по распределению задач по уровню энергии
   * Возвращает задачи, отсортированные по оптимальному порядку выполнения
   */
  const optimalTaskOrder = useMemo(() => {
    // Сортируем задачи: сначала высокоэнергетические, потом средне, потом низкоэнергетические
    return [...sortedTasks].sort((a, b) => {
      const energyOrder = { high: 0, medium: 1, low: 2, undefined: 1 };
      const energyA = energyOrder[a.energyLevel || 'undefined'];
      const energyB = energyOrder[b.energyLevel || 'undefined'];
      
      if (energyA !== energyB) {
        return energyA - energyB;
      }
      
      // Если энергозатратность одинаковая, сортируем по приоритету
      const priorityOrder = { high: 0, medium: 1, low: 2, undefined: 1 };
      const priorityA = priorityOrder[a.priority || 'undefined'];
      const priorityB = priorityOrder[b.priority || 'undefined'];
      
      return priorityA - priorityB;
    });
  }, [sortedTasks]);

  return {
    dayTasks: sortedTasks,
    stats,
    optimalTaskOrder
  };
}

