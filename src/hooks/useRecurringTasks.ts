import { useMemo } from 'react';
import { Task } from '../utils/storage';
import {
  isParentTask,
  isRecurrenceInstance,
  getParentTask,
  getRecurrenceInstances
} from '../utils/taskRecurrence';

export interface UseRecurringTasksOptions {
  tasks: Task[];
}

export function useRecurringTasks({ tasks }: UseRecurringTasksOptions) {
  const parentTasks = useMemo(() => {
    return tasks.filter(task => task.recurrence && !task.parentTaskId);
  }, [tasks]);

  const instanceTasks = useMemo(() => {
    return tasks.filter(task => isRecurrenceInstance(task));
  }, [tasks]);

  const regularTasks = useMemo(() => {
    return tasks.filter(task => !task.recurrence && !task.parentTaskId);
  }, [tasks]);

  /**
   * Получить все экземпляры для родительской задачи
   */
  const getInstancesForParent = (parentId: string): Task[] => {
    return getRecurrenceInstances(
      tasks.find(t => t.id === parentId)!,
      tasks
    );
  };

  /**
   * Получить родительскую задачу для экземпляра
   */
  const getParentForInstance = (instanceId: string): Task | undefined => {
    const instance = tasks.find(t => t.id === instanceId);
    if (!instance || !instance.parentTaskId) {
      return undefined;
    }
    return getParentTask(instance, tasks);
  };

  /**
   * Проверить, является ли задача родительской
   */
  const checkIsParent = (taskId: string): boolean => {
    const task = tasks.find(t => t.id === taskId);
    return task ? isParentTask(task, tasks) : false;
  };

  return {
    parentTasks,
    instanceTasks,
    regularTasks,
    getInstancesForParent,
    getParentForInstance,
    checkIsParent
  };
}

