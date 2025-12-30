import { Habit } from './storage';

/**
 * Рассчитать процент выполнения привычки за период
 */
export function calculateCompletionRate(
  habit: Habit,
  startDate: Date,
  endDate: Date
): number {
  const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  if (totalDays <= 0) return 0;

  let completedDays = 0;
  const currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    const dateKey = currentDate.toISOString().split('T')[0];
    const historyEntry = habit.history[dateKey];
    
    if (historyEntry?.completed) {
      completedDays++;
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return Math.round((completedDays / totalDays) * 100);
}

/**
 * Рассчитать опыт за выполнение привычки
 */
export function calculateExperience(habit: Habit, date: string): number {
  const historyEntry = habit.history[date];
  if (!historyEntry?.completed) return 0;

  let baseExp = 10; // Базовый опыт за выполнение

  // Бонус за достижение целевого значения
  if (habit.targetValue && historyEntry.value && historyEntry.value >= habit.targetValue) {
    baseExp += 5;
  }

  // Бонус за серию дней
  if (habit.streak > 0) {
    baseExp += Math.min(habit.streak * 2, 50); // Максимум 50 бонусных очков
  }

  return baseExp;
}

/**
 * Рассчитать уровень на основе опыта
 */
export function calculateLevel(experience: number): number {
  // Формула: level = floor(sqrt(experience / 100))
  return Math.floor(Math.sqrt(experience / 100)) + 1;
}

/**
 * Рассчитать опыт, необходимый для следующего уровня
 */
export function getExperienceForNextLevel(currentLevel: number): number {
  return Math.pow(currentLevel, 2) * 100;
}

/**
 * Рассчитать прогресс к цели по дням
 */
export function calculateGoalProgress(habit: Habit): { current: number; target: number; percentage: number } {
  if (!habit.goalDays) {
    return { current: habit.streak, target: 0, percentage: 0 };
  }

  const percentage = Math.min(Math.round((habit.streak / habit.goalDays) * 100), 100);
  return {
    current: habit.streak,
    target: habit.goalDays,
    percentage
  };
}

/**
 * Проверить, выполнена ли привычка в указанный день
 */
export function isHabitCompleted(habit: Habit, date: string): boolean {
  return habit.history[date]?.completed || false;
}

/**
 * Получить значение выполнения привычки в указанный день
 */
export function getHabitValue(habit: Habit, date: string): number | undefined {
  return habit.history[date]?.value;
}

/**
 * Рассчитать общий опыт привычки
 */
export function calculateTotalExperience(habit: Habit): number {
  let totalExp = habit.experience || 0;
  
  // Пересчитываем опыт на основе истории
  Object.keys(habit.history).forEach(date => {
    const entry = habit.history[date];
    if (entry?.completed) {
      totalExp += calculateExperience(habit, date);
    }
  });

  return totalExp;
}

