import { useMemo } from 'react';
import { Task, TaskCategory } from '../utils/storage';
import { getTasksForDay, getTaskStartMinutes } from '../utils/taskTimeUtils';

export type GroupingType = 'none' | 'status' | 'category' | 'time' | 'priority' | 'energy';

export interface UseTaskGroupingOptions {
  tasks: Task[];
  categories: TaskCategory[];
  grouping: GroupingType;
  date?: Date;
}

export interface GroupedTasks {
  [key: string]: Task[];
}

export function useTaskGrouping({
  tasks,
  categories,
  grouping,
  date = new Date()
}: UseTaskGroupingOptions) {
  const groupedTasks = useMemo(() => {
    if (grouping === 'none') {
      return { 'all': tasks };
    }

    const groups: GroupedTasks = {};

    tasks.forEach(task => {
      let groupKey = 'other';

      switch (grouping) {
        case 'status':
          groupKey = task.status || (task.completed ? 'completed' : 'todo');
          break;

        case 'category':
          if (task.categoryId) {
            const category = categories.find(c => c.id === task.categoryId);
            groupKey = category?.name || 'Без категории';
          } else {
            groupKey = 'Без категории';
          }
          break;

        case 'time':
          const startMinutes = getTaskStartMinutes(task, date);
          if (startMinutes !== null) {
            const hours = Math.floor(startMinutes / 60);
            if (hours < 12) {
              groupKey = 'Утро (до 12:00)';
            } else if (hours < 18) {
              groupKey = 'День (12:00-18:00)';
            } else {
              groupKey = 'Вечер (после 18:00)';
            }
          } else {
            groupKey = 'Без времени';
          }
          break;

        case 'priority':
          groupKey = task.priority || 'Без приоритета';
          break;

        case 'energy':
          groupKey = task.energyLevel || 'Без оценки';
          break;
      }

      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(task);
    });

    // Сортируем группы
    const sortedGroups: GroupedTasks = {};
    const sortedKeys = Object.keys(groups).sort((a, b) => {
      // Порядок для статусов
      if (grouping === 'status') {
        const statusOrder: { [key: string]: number } = {
          'todo': 0,
          'in-progress': 1,
          'completed': 2
        };
        return (statusOrder[a] || 99) - (statusOrder[b] || 99);
      }
      
      // Порядок для приоритетов
      if (grouping === 'priority') {
        const priorityOrder: { [key: string]: number } = {
          'high': 0,
          'medium': 1,
          'low': 2,
          'Без приоритета': 3
        };
        return (priorityOrder[a] || 99) - (priorityOrder[b] || 99);
      }
      
      // Порядок для времени
      if (grouping === 'time') {
        const timeOrder: { [key: string]: number } = {
          'Утро (до 12:00)': 0,
          'День (12:00-18:00)': 1,
          'Вечер (после 18:00)': 2,
          'Без времени': 3
        };
        return (timeOrder[a] || 99) - (timeOrder[b] || 99);
      }
      
      // Порядок для энергии
      if (grouping === 'energy') {
        const energyOrder: { [key: string]: number } = {
          'high': 0,
          'medium': 1,
          'low': 2,
          'Без оценки': 3
        };
        return (energyOrder[a] || 99) - (energyOrder[b] || 99);
      }
      
      return a.localeCompare(b);
    });

    sortedKeys.forEach(key => {
      sortedGroups[key] = groups[key];
    });

    return sortedGroups;
  }, [tasks, categories, grouping, date]);

  return groupedTasks;
}

