import { Task, RecurrenceRule, generateId } from './storage';

/**
 * Генерация экземпляров повторяющихся задач для заданного периода
 */
export function generateRecurrenceInstances(
  parentTask: Task,
  startDate: Date,
  endDate: Date
): Task[] {
  if (!parentTask.recurrence) {
    return [];
  }

  const instances: Task[] = [];
  const rule = parentTask.recurrence;
  const current = new Date(startDate);
  current.setHours(0, 0, 0, 0);
  
  const end = new Date(endDate);
  end.setHours(23, 59, 59, 999);

  let count = 0;
  const maxInstances = 365; // ограничение для безопасности

  while (current <= end && count < maxInstances) {
    if (rule.endDate && current.getTime() > rule.endDate) {
      break;
    }

    if (rule.count && count >= rule.count) {
      break;
    }

    let shouldCreate = false;

    switch (rule.type) {
      case 'daily':
        shouldCreate = shouldCreateDailyInstance(current, rule);
        break;
      case 'weekly':
        shouldCreate = shouldCreateWeeklyInstance(current, rule);
        break;
      case 'monthly':
        shouldCreate = shouldCreateMonthlyInstance(current, rule);
        break;
      case 'custom':
        shouldCreate = shouldCreateCustomInstance(current, rule);
        break;
    }

    if (shouldCreate) {
      const instance = createTaskInstance(parentTask, current);
      instances.push(instance);
      count++;
    }

    // Переходим к следующему дню
    current.setDate(current.getDate() + 1);
  }

  return instances;
}

/**
 * Проверка, нужно ли создать экземпляр для ежедневного повторения
 */
function shouldCreateDailyInstance(date: Date, rule: RecurrenceRule): boolean {
  const interval = rule.interval || 1;
  // Для ежедневных задач просто проверяем интервал
  // Это упрощенная версия - в реальности нужно отслеживать первый день
  return true; // Упрощение для первой версии
}

/**
 * Проверка, нужно ли создать экземпляр для еженедельного повторения
 */
function shouldCreateWeeklyInstance(date: Date, rule: RecurrenceRule): boolean {
  const dayOfWeek = date.getDay(); // 0 = воскресенье, 6 = суббота
  const interval = rule.interval || 1;
  
  if (!rule.daysOfWeek || rule.daysOfWeek.length === 0) {
    // Если дни недели не указаны, создаем в тот же день недели, что и родительская задача
    return true; // Упрощение
  }
  
  return rule.daysOfWeek.includes(dayOfWeek);
}

/**
 * Проверка, нужно ли создать экземпляр для ежемесячного повторения
 */
function shouldCreateMonthlyInstance(date: Date, rule: RecurrenceRule): boolean {
  if (rule.dayOfMonth !== undefined) {
    return date.getDate() === rule.dayOfMonth;
  }
  // Если день месяца не указан, используем тот же день месяца, что и у родительской задачи
  return true; // Упрощение
}

/**
 * Проверка, нужно ли создать экземпляр для произвольного повторения
 */
function shouldCreateCustomInstance(date: Date, rule: RecurrenceRule): boolean {
  // Для произвольного повторения проверяем дни недели
  if (rule.daysOfWeek && rule.daysOfWeek.length > 0) {
    const dayOfWeek = date.getDay();
    return rule.daysOfWeek.includes(dayOfWeek);
  }
  return false;
}

/**
 * Создание экземпляра задачи для конкретной даты
 */
function createTaskInstance(parentTask: Task, date: Date): Task {
  const instanceDate = new Date(date);
  
  // Вычисляем время для экземпляра
  let startTime: number | undefined;
  let endTime: number | undefined;
  
  if (parentTask.startTime) {
    if (parentTask.startTime > 86400000) {
      // Это timestamp, нужно преобразовать в новый день
      const originalDate = new Date(parentTask.startTime);
      instanceDate.setHours(
        originalDate.getHours(),
        originalDate.getMinutes(),
        0,
        0
      );
      startTime = instanceDate.getTime();
    } else {
      // Это минуты от полуночи, создаем timestamp для нового дня
      instanceDate.setHours(
        Math.floor(parentTask.startTime / 60),
        parentTask.startTime % 60,
        0,
        0
      );
      startTime = instanceDate.getTime();
    }
  }
  
  if (parentTask.endTime) {
    if (parentTask.endTime > 86400000) {
      const originalDate = new Date(parentTask.endTime);
      instanceDate.setHours(
        originalDate.getHours(),
        originalDate.getMinutes(),
        0,
        0
      );
      endTime = instanceDate.getTime();
    } else {
      instanceDate.setHours(
        Math.floor(parentTask.endTime / 60),
        parentTask.endTime % 60,
        0,
        0
      );
      endTime = instanceDate.getTime();
    }
  }
  
  // Устанавливаем plannedDate для экземпляра
  const plannedDate = new Date(date);
  plannedDate.setHours(0, 0, 0, 0);
  
  // Устанавливаем dueDate, если он был в родительской задаче
  let dueDate: number | undefined;
  if (parentTask.dueDate) {
    const due = new Date(parentTask.dueDate);
    due.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
    dueDate = due.getTime();
  }
  
  const instance: Task = {
    ...parentTask,
    id: generateId(),
    parentTaskId: parentTask.id,
    recurrenceInstanceDate: plannedDate.getTime(),
    plannedDate: plannedDate.getTime(),
    dueDate: dueDate || plannedDate.getTime(),
    startTime,
    endTime,
    completed: false,
    status: 'todo',
    createdAt: Date.now()
  };
  
  return instance;
}

/**
 * Получить все экземпляры повторяющейся задачи
 */
export function getRecurrenceInstances(parentTask: Task, allTasks: Task[]): Task[] {
  return allTasks.filter(
    task => task.parentTaskId === parentTask.id
  );
}

/**
 * Проверить, является ли задача родительской (имеет повторения)
 */
export function isParentTask(task: Task, allTasks: Task[]): boolean {
  return allTasks.some(t => t.parentTaskId === task.id);
}

/**
 * Проверить, является ли задача экземпляром повторяющейся задачи
 */
export function isRecurrenceInstance(task: Task): boolean {
  return !!task.parentTaskId;
}

/**
 * Получить родительскую задачу для экземпляра
 */
export function getParentTask(instance: Task, allTasks: Task[]): Task | undefined {
  if (!instance.parentTaskId) {
    return undefined;
  }
  return allTasks.find(t => t.id === instance.parentTaskId);
}

/**
 * Автоматическое создание следующих экземпляров повторяющихся задач
 * Вызывается при загрузке задач или по расписанию
 */
export function generateUpcomingInstances(
  allTasks: Task[],
  daysAhead: number = 30
): Task[] {
  const now = new Date();
  const endDate = new Date(now);
  endDate.setDate(endDate.getDate() + daysAhead);
  
  const parentTasks = allTasks.filter(
    task => task.recurrence && !task.parentTaskId
  );
  
  const newInstances: Task[] = [];
  
  parentTasks.forEach(parentTask => {
    const existingInstances = getRecurrenceInstances(parentTask, allTasks);
    const existingDates = new Set(
      existingInstances
        .map(i => i.recurrenceInstanceDate)
        .filter(Boolean)
        .map(d => new Date(d!).toDateString())
    );
    
    // Генерируем экземпляры только для дат, которых еще нет
    const instances = generateRecurrenceInstances(parentTask, now, endDate);
    const newOnes = instances.filter(instance => {
      if (!instance.recurrenceInstanceDate) return false;
      const instanceDate = new Date(instance.recurrenceInstanceDate).toDateString();
      return !existingDates.has(instanceDate);
    });
    
    newInstances.push(...newOnes);
  });
  
  return newInstances;
}

