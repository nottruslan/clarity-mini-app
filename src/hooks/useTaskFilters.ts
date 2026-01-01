import { useMemo } from 'react';
import { Task, TaskCategory, TaskTag } from '../utils/storage';

export interface TaskFilterOptions {
  status?: 'all' | 'todo' | 'in-progress' | 'completed';
  priority?: 'all' | 'low' | 'medium' | 'high';
  categoryId?: string | null;
  tagIds?: string[];
  energyLevel?: 'all' | 'low' | 'medium' | 'high';
  dateFilter?: 'all' | 'today' | 'tomorrow' | 'this-week' | 'overdue';
  searchQuery?: string;
}

export type TaskSortOption = 
  | 'time' 
  | 'priority' 
  | 'status' 
  | 'category' 
  | 'date-created'
  | 'energy-level';

export interface UseTaskFiltersOptions {
  tasks: Task[];
  categories: TaskCategory[];
  tags: TaskTag[];
  filters: TaskFilterOptions;
  sortBy?: TaskSortOption;
  date?: Date;
}

export function useTaskFilters({
  tasks,
  categories,
  tags,
  filters,
  sortBy = 'time',
  date = new Date()
}: UseTaskFiltersOptions) {
  const filteredAndSortedTasks = useMemo(() => {
    let result = [...tasks];

    // Фильтр по статусу
    if (filters.status && filters.status !== 'all') {
      if (filters.status === 'completed') {
        result = result.filter(t => t.status === 'completed' || t.completed);
      } else {
        result = result.filter(t => t.status === filters.status);
      }
    }

    // Фильтр по приоритету
    if (filters.priority && filters.priority !== 'all') {
      result = result.filter(t => t.priority === filters.priority);
    }

    // Фильтр по категории
    if (filters.categoryId) {
      result = result.filter(t => t.categoryId === filters.categoryId);
    }


    // Фильтр по энергозатратности
    if (filters.energyLevel && filters.energyLevel !== 'all') {
      result = result.filter(t => t.energyLevel === filters.energyLevel);
    }

    // Фильтр по дате
    if (filters.dateFilter && filters.dateFilter !== 'all') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      switch (filters.dateFilter) {
        case 'today':
          result = result.filter(task => {
            const taskDate = task.plannedDate || task.dueDate;
            // Задачи без дат показываются в списке
            if (!taskDate) return true;
            const d = new Date(taskDate);
            d.setHours(0, 0, 0, 0);
            return d.getTime() === today.getTime();
          });
          break;
          
        case 'tomorrow':
          const tomorrow = new Date(today);
          tomorrow.setDate(tomorrow.getDate() + 1);
          result = result.filter(task => {
            const taskDate = task.plannedDate || task.dueDate;
            // Задачи без дат показываются в списке
            if (!taskDate) return true;
            const d = new Date(taskDate);
            d.setHours(0, 0, 0, 0);
            return d.getTime() === tomorrow.getTime();
          });
          break;
          
        case 'this-week':
          const weekStart = new Date(today);
          weekStart.setDate(weekStart.getDate() - weekStart.getDay());
          const weekEnd = new Date(weekStart);
          weekEnd.setDate(weekEnd.getDate() + 6);
          result = result.filter(task => {
            const taskDate = task.plannedDate || task.dueDate;
            // Задачи без дат показываются в списке
            if (!taskDate) return true;
            return taskDate >= weekStart.getTime() && taskDate <= weekEnd.getTime();
          });
          break;
          
        case 'overdue':
          result = result.filter(task => {
            const taskDate = task.plannedDate || task.dueDate;
            // Просроченные задачи должны иметь дату
            if (!taskDate) return false;
            return taskDate < today.getTime() && 
                   (task.status !== 'completed' && !task.completed);
          });
          break;
      }
    }

    // Поиск по тексту
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      result = result.filter(task => 
        task.text.toLowerCase().includes(query) ||
        task.description?.toLowerCase().includes(query)
      );
    }

    // Сортировка
    result.sort((a, b) => {
      switch (sortBy) {
        case 'time':
          const timeA = a.startTime || a.plannedDate || a.dueDate || 0;
          const timeB = b.startTime || b.plannedDate || b.dueDate || 0;
          return timeA - timeB;
          
        case 'priority':
          const priorityOrder = { high: 0, medium: 1, low: 2, undefined: 3 };
          const priorityA = priorityOrder[a.priority || 'undefined'];
          const priorityB = priorityOrder[b.priority || 'undefined'];
          if (priorityA !== priorityB) return priorityA - priorityB;
          // Если приоритеты равны, сортируем по времени
          const timeA2 = a.startTime || a.plannedDate || a.dueDate || 0;
          const timeB2 = b.startTime || b.plannedDate || b.dueDate || 0;
          return timeA2 - timeB2;
          
        case 'status':
          const statusOrder = { 'todo': 0, 'in-progress': 1, 'completed': 2, undefined: 0 };
          const statusA = statusOrder[a.status || 'todo'];
          const statusB = statusOrder[b.status || 'todo'];
          if (statusA !== statusB) return statusA - statusB;
          return (a.createdAt || 0) - (b.createdAt || 0);
          
        case 'category':
          const categoryA = categories.find(c => c.id === a.categoryId)?.name || '';
          const categoryB = categories.find(c => c.id === b.categoryId)?.name || '';
          if (categoryA !== categoryB) return categoryA.localeCompare(categoryB);
          return (a.createdAt || 0) - (b.createdAt || 0);
          
        case 'date-created':
          return (b.createdAt || 0) - (a.createdAt || 0);
          
        case 'energy-level':
          const energyOrder = { high: 0, medium: 1, low: 2, undefined: 3 };
          const energyA = energyOrder[a.energyLevel || 'undefined'];
          const energyB = energyOrder[b.energyLevel || 'undefined'];
          if (energyA !== energyB) return energyA - energyB;
          return (a.createdAt || 0) - (b.createdAt || 0);
          
        default:
          return 0;
      }
    });

    return result;
  }, [tasks, categories, tags, filters, sortBy, date]);

  return filteredAndSortedTasks;
}

