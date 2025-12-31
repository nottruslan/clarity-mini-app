import { Task } from './storage';

/**
 * Форматирование времени в строку (HH:MM)
 */
export function formatTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
}

/**
 * Преобразование времени в минуты от полуночи
 */
export function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

/**
 * Преобразование минут от полуночи в строку времени
 */
export function minutesToTime(minutes: number): string {
  return formatTime(minutes);
}

/**
 * Получить время начала дня в миллисекундах для заданной даты
 */
export function getDayStart(date: Date | number): number {
  const d = typeof date === 'number' ? new Date(date) : date;
  const dayStart = new Date(d);
  dayStart.setHours(0, 0, 0, 0);
  return dayStart.getTime();
}

/**
 * Получить время окончания дня в миллисекундах для заданной даты
 */
export function getDayEnd(date: Date | number): number {
  const d = typeof date === 'number' ? new Date(date) : date;
  const dayEnd = new Date(d);
  dayEnd.setHours(23, 59, 59, 999);
  return dayEnd.getTime();
}

/**
 * Преобразовать timestamp в минуты от полуночи того же дня
 */
export function timestampToMinutesOfDay(timestamp: number): number {
  const date = new Date(timestamp);
  return date.getHours() * 60 + date.getMinutes();
}

/**
 * Создать timestamp для заданного дня и времени (в минутах от полуночи)
 */
export function minutesOfDayToTimestamp(day: Date | number, minutes: number): number {
  const d = typeof day === 'number' ? new Date(day) : new Date(day);
  const date = new Date(d);
  date.setHours(Math.floor(minutes / 60), minutes % 60, 0, 0);
  return date.getTime();
}

/**
 * Получить время начала задачи (в минутах от полуночи)
 */
export function getTaskStartMinutes(task: Task, date: Date | number): number | null {
  if (task.startTime) {
    // Если startTime - это timestamp, конвертируем в минуты от полуночи
    if (task.startTime > 86400000) { // больше суток = timestamp
      return timestampToMinutesOfDay(task.startTime);
    }
    // Иначе это уже минуты от полуночи
    return task.startTime;
  }
  return null;
}

/**
 * Получить время окончания задачи (в минутах от полуночи)
 */
export function getTaskEndMinutes(task: Task, date: Date | number): number | null {
  if (task.endTime) {
    if (task.endTime > 86400000) {
      return timestampToMinutesOfDay(task.endTime);
    }
    return task.endTime;
  }
  
  // Если есть startTime и duration, вычисляем endTime
  const startMinutes = getTaskStartMinutes(task, date);
  if (startMinutes !== null && task.duration) {
    return startMinutes + task.duration;
  }
  
  return null;
}

/**
 * Получить длительность задачи в минутах
 */
export function getTaskDuration(task: Task): number | null {
  if (task.duration) {
    return task.duration;
  }
  
  // Вычисляем из startTime и endTime
  const start = task.startTime && task.startTime < 86400000 ? task.startTime : null;
  const end = task.endTime && task.endTime < 86400000 ? task.endTime : null;
  
  if (start !== null && end !== null && end > start) {
    return end - start;
  }
  
  return null;
}

/**
 * Проверить, перекрываются ли две задачи по времени
 */
export function tasksOverlap(task1: Task, task2: Task, date: Date | number): boolean {
  const start1 = getTaskStartMinutes(task1, date);
  const end1 = getTaskEndMinutes(task1, date);
  const start2 = getTaskStartMinutes(task2, date);
  const end2 = getTaskEndMinutes(task2, date);
  
  if (start1 === null || end1 === null || start2 === null || end2 === null) {
    return false;
  }
  
  // Проверяем перекрытие: (start1 < end2) && (end1 > start2)
  return start1 < end2 && end1 > start2;
}

/**
 * Получить список задач для конкретного дня
 */
export function getTasksForDay(tasks: Task[], date: Date | number): Task[] {
  const dayStart = getDayStart(date);
  const dayEnd = getDayEnd(date);
  
  return tasks.filter(task => {
    // Задачи с dueDate в этот день
    if (task.dueDate && task.dueDate >= dayStart && task.dueDate <= dayEnd) {
      return true;
    }
    
    // Задачи с plannedDate в этот день
    if (task.plannedDate && task.plannedDate >= dayStart && task.plannedDate <= dayEnd) {
      return true;
    }
    
    // Задачи с startTime в этот день (если это timestamp)
    if (task.startTime && task.startTime > 86400000) {
      if (task.startTime >= dayStart && task.startTime <= dayEnd) {
        return true;
      }
    }
    
    // Задачи без даты (по умолчанию сегодня)
    if (!task.dueDate && !task.plannedDate && (!task.startTime || task.startTime <= 86400000)) {
      const today = new Date();
      const taskDate = typeof date === 'number' ? new Date(date) : date;
      return today.toDateString() === taskDate.toDateString();
    }
    
    return false;
  });
}

/**
 * Получить задачи, отсортированные по времени начала
 */
export function sortTasksByTime(tasks: Task[], date: Date | number): Task[] {
  return [...tasks].sort((a, b) => {
    const startA = getTaskStartMinutes(a, date) ?? Infinity;
    const startB = getTaskStartMinutes(b, date) ?? Infinity;
    
    if (startA !== startB) {
      return startA - startB;
    }
    
    // Если время одинаковое, сортируем по приоритету
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    const priorityA = priorityOrder[a.priority || 'medium'];
    const priorityB = priorityOrder[b.priority || 'medium'];
    
    return priorityA - priorityB;
  });
}

/**
 * Вычислить свободное время между задачами (в минутах)
 */
export function calculateFreeTime(tasks: Task[], date: Date | number, dayStartMinutes: number = 360, dayEndMinutes: number = 1440): number {
  const dayTasks = getTasksForDay(tasks, date);
  const sortedTasks = sortTasksByTime(dayTasks, date);
  
  let freeTime = dayEndMinutes - dayStartMinutes;
  
  sortedTasks.forEach(task => {
    const duration = getTaskDuration(task);
    if (duration) {
      freeTime -= duration;
    }
  });
  
  return Math.max(0, freeTime);
}

/**
 * Форматировать длительность в читаемый вид
 */
export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} мин`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (mins === 0) {
    return `${hours} ч`;
  }
  return `${hours} ч ${mins} мин`;
}

