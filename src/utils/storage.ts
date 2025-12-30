/**
 * Утилиты для работы с Telegram Cloud Storage
 */

export interface StorageData {
  tasks: Task[];
  habits: Habit[];
  finance: FinanceData;
  onboarding: OnboardingFlags;
}

export interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
  priority?: 'low' | 'medium' | 'high';
  dueDate?: number;
}

export interface Habit {
  id: string;
  name: string;
  icon?: string;
  frequency: 'daily' | 'weekly';
  createdAt: number;
  history: { [date: string]: boolean };
  streak: number;
}

export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  date: number;
  description?: string;
  createdAt: number;
}

export interface FinanceData {
  transactions: Transaction[];
  categories: Category[];
}

export interface Category {
  id: string;
  name: string;
  type: 'income' | 'expense';
  color?: string;
}

export interface OnboardingFlags {
  tasks: boolean;
  habits: boolean;
  finance: boolean;
  languages: boolean;
}

const STORAGE_KEYS = {
  TASKS: 'tasks',
  HABITS: 'habits',
  FINANCE: 'finance',
  ONBOARDING: 'onboarding'
} as const;

/**
 * Получить данные из Cloud Storage
 */
export async function getStorageData<T>(key: string): Promise<T | null> {
  if (!window.Telegram?.WebApp?.CloudStorage) {
    console.warn('Cloud Storage not available, using localStorage fallback');
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  }

  return new Promise((resolve) => {
    window.Telegram.WebApp.CloudStorage.getItem(key, (error, value) => {
      if (error) {
        console.error('Error getting from Cloud Storage:', error);
        // Fallback to localStorage
        const data = localStorage.getItem(key);
        resolve(data ? JSON.parse(data) : null);
        return;
      }
      resolve(value ? JSON.parse(value) : null);
    });
  });
}

/**
 * Сохранить данные в Cloud Storage
 */
export async function setStorageData<T>(key: string, data: T): Promise<void> {
  const jsonData = JSON.stringify(data);

  if (!window.Telegram?.WebApp?.CloudStorage) {
    console.warn('Cloud Storage not available, using localStorage fallback');
    localStorage.setItem(key, jsonData);
    return;
  }

  return new Promise((resolve, reject) => {
    window.Telegram.WebApp.CloudStorage.setItem(key, jsonData, (error) => {
      if (error) {
        console.error('Error saving to Cloud Storage:', error);
        // Fallback to localStorage
        localStorage.setItem(key, jsonData);
        reject(error);
        return;
      }
      resolve();
    });
  });
}

/**
 * Получить все задачи
 */
export async function getTasks(): Promise<Task[]> {
  const tasks = await getStorageData<Task[]>(STORAGE_KEYS.TASKS);
  return tasks || [];
}

/**
 * Сохранить задачи
 */
export async function saveTasks(tasks: Task[]): Promise<void> {
  await setStorageData(STORAGE_KEYS.TASKS, tasks);
}

/**
 * Получить все привычки
 */
export async function getHabits(): Promise<Habit[]> {
  const habits = await getStorageData<Habit[]>(STORAGE_KEYS.HABITS);
  return habits || [];
}

/**
 * Сохранить привычки
 */
export async function saveHabits(habits: Habit[]): Promise<void> {
  await setStorageData(STORAGE_KEYS.HABITS, habits);
}

/**
 * Получить финансовые данные
 */
export async function getFinanceData(): Promise<FinanceData> {
  const data = await getStorageData<FinanceData>(STORAGE_KEYS.FINANCE);
  return data || { transactions: [], categories: [] };
}

/**
 * Сохранить финансовые данные
 */
export async function saveFinanceData(data: FinanceData): Promise<void> {
  await setStorageData(STORAGE_KEYS.FINANCE, data);
}

/**
 * Получить флаги onboarding
 */
export async function getOnboardingFlags(): Promise<OnboardingFlags> {
  const flags = await getStorageData<OnboardingFlags>(STORAGE_KEYS.ONBOARDING);
  return flags || {
    tasks: false,
    habits: false,
    finance: false,
    languages: false
  };
}

/**
 * Сохранить флаги onboarding
 */
export async function saveOnboardingFlags(flags: OnboardingFlags): Promise<void> {
  await setStorageData(STORAGE_KEYS.ONBOARDING, flags);
}

/**
 * Генерация уникального ID
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

