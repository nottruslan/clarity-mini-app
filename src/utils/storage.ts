/**
 * Утилиты для работы с Telegram Cloud Storage
 */

export interface StorageData {
  tasks: Task[];
  habits: Habit[];
  finance: FinanceData;
  onboarding: OnboardingFlags;
  taskCategories?: TaskCategory[];
  taskTags?: TaskTag[];
}

export interface Subtask {
  id: string;
  text: string;
  completed: boolean;
}

export interface RecurrenceRule {
  type: 'daily' | 'weekly' | 'monthly' | 'custom';
  interval?: number; // интервал повторения (например, каждые 2 дня)
  daysOfWeek?: number[]; // дни недели для weekly/custom (0-6, где 0 = воскресенье)
  dayOfMonth?: number; // день месяца для monthly
  endDate?: number; // дата окончания повторений (timestamp)
  count?: number; // количество повторений
}

export interface TaskCategory {
  id: string;
  name: string;
  color: string;
  icon?: string;
}

export interface TaskTag {
  id: string;
  name: string;
  color?: string;
}

export interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
  priority?: 'low' | 'medium' | 'high';
  dueDate?: number; // дата дедлайна (timestamp)
  
  // Временные поля
  startTime?: number; // время начала (timestamp, или только время дня в минутах от полуночи)
  endTime?: number; // время окончания (timestamp, или только время дня в минутах от полуночи)
  duration?: number; // длительность в минутах
  
  // Подзадачи
  subtasks?: Subtask[];
  
  // Описание
  description?: string;
  
  // Категории и теги
  categoryId?: string;
  tags?: string[]; // массив ID тегов
  
  // Повторения
  recurrence?: RecurrenceRule;
  parentTaskId?: string; // ID родительской задачи для повторяющихся задач
  recurrenceInstanceDate?: number; // дата конкретного экземпляра повторяющейся задачи
  
  // Энергозатратность
  energyLevel?: 'low' | 'medium' | 'high';
  
  // Статус
  status?: 'todo' | 'in-progress' | 'completed';
  
  // Время выполнения
  timeSpent?: number; // в минутах
  
  // Планирование
  plannedDate?: number; // дата планирования задачи (timestamp)
}

export interface Habit {
  id: string;
  name: string;
  icon?: string;
  category?: string;
  frequency: 'daily' | 'weekly' | 'custom' | 'flexible';
  customDays?: number[]; // массив дней недели (0-6, где 0 = воскресенье)
  timesPerDay?: number; // количество раз в день
  timesPerWeek?: number; // количество раз в неделю
  timesPerMonth?: number; // количество раз в месяц
  unit?: string; // единица измерения (литры, минуты, разы и т.д.)
  targetValue?: number; // целевое значение
  goalDays?: number; // цель по дням (например, 30 дней подряд)
  level?: number; // текущий уровень
  experience?: number; // опыт
  createdAt: number;
  history: { [date: string]: { completed: boolean; value?: number } };
  streak: number;
  order?: number; // порядок сортировки для drag & drop
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

export interface Budget {
  id?: string;
  categoryId: string;
  categoryName: string;
  limit: number;
  period: 'month' | 'year';
}

export interface FinanceData {
  transactions: Transaction[];
  categories: Category[];
  budgets: Budget[];
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
  'yearly-report'?: boolean;
}

export interface PastYearData {
  calendarEvents?: string[]; // Важные события из календаря
  lifeAreas?: {
    personal?: string;
    friends?: string;
    health?: string;
    habits?: string;
    career?: string;
    hobbies?: string;
    psychology?: string;
    betterTomorrow?: string;
  };
  importantMoments?: {
    wisestDecision?: string;
    biggestLesson?: string;
    biggestRisk?: string;
    biggestSurprise?: string;
    importantForOthers?: string;
    biggestCompletion?: string;
  };
  questions?: {
    proudOf?: string;
    threePeopleInfluenced?: string[];
    threePeopleInfluencedBy?: string[];
    unfinished?: string;
    bestDiscovery?: string;
    mostGrateful?: string;
  };
  bestMoments?: string; // Текст или описание лучших моментов
  achievements?: Array<{
    achievement: string;
    howAchieved: string;
    whoHelped: string;
  }>;
  challenges?: Array<{
    challenge: string;
    whoHelped: string;
    whatLearned: string;
  }>;
  forgiveness?: string; // Что нужно простить
  summary?: {
    threeWords?: string[];
    bookTitle?: string;
    goodbye?: string;
  };
}

export interface FutureYearData {
  dreams?: string; // Видение идеального года
  lifeAreas?: {
    personal?: string;
    friends?: string;
    health?: string;
    habits?: string;
    career?: string;
    hobbies?: string;
    psychology?: string;
    betterTomorrow?: string;
  };
  magicTriples1?: {
    love?: string[];
    letGo?: string[];
    achieve?: string[];
    support?: string[];
    try?: string[];
    sayNo?: string[];
  };
  magicTriples2?: {
    coziness?: string[];
    morning?: string[];
    treat?: string[];
    places?: string[];
    relationships?: string[];
    gifts?: string[];
  };
  wishes?: {
    notPostpone?: string;
    energyFrom?: string;
    bravestWhen?: string;
    sayYesWhen?: string;
    advice?: string;
    specialBecause?: string;
  };
  wordOfYear?: string;
  secretWish?: string;
}

export interface YearlyReport {
  id: string;
  year: number;
  pastYear: PastYearData;
  futureYear: FutureYearData;
  createdAt: number;
  updatedAt: number;
}

const STORAGE_KEYS = {
  TASKS: 'tasks',
  HABITS: 'habits',
  FINANCE: 'finance',
  ONBOARDING: 'onboarding',
  YEARLY_REPORTS: 'yearly-reports',
  TASK_CATEGORIES: 'task-categories',
  TASK_TAGS: 'task-tags'
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
    if (!window.Telegram?.WebApp?.CloudStorage) {
      const data = localStorage.getItem(key);
      resolve(data ? JSON.parse(data) : null);
      return;
    }
    
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
    if (!window.Telegram?.WebApp?.CloudStorage) {
      localStorage.setItem(key, jsonData);
      resolve();
      return;
    }
    
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
  const loadedTasks = tasks || [];
  
  // Миграция существующих задач к новой структуре
  const migratedTasks = migrateTasks(loadedTasks);
  
  // Если была миграция, сохраняем обновленные задачи
  if (JSON.stringify(migratedTasks) !== JSON.stringify(loadedTasks)) {
    await saveTasks(migratedTasks);
  }
  
  return migratedTasks;
}

/**
 * Миграция задач к новой структуре данных
 */
function migrateTasks(tasks: Task[]): Task[] {
  return tasks.map(task => {
    // Если задача имеет старую структуру, преобразуем её
    const migrated: Task = {
      ...task,
      // Убеждаемся, что есть все необходимые поля
      status: task.status || (task.completed ? 'completed' : 'todo'),
      // Если есть dueDate, но нет plannedDate, используем dueDate для plannedDate
      plannedDate: task.plannedDate || task.dueDate,
      // Если есть только completed, но нет status, устанавливаем status
      completed: task.completed !== undefined ? task.completed : (task.status === 'completed')
    };
    
    return migrated;
  });
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
 * Категории по умолчанию
 */
export function getDefaultCategories(): Category[] {
  const incomeCategories: Category[] = [
    { id: generateId(), name: 'Зарплата', type: 'income', color: '#4caf50' },
    { id: generateId(), name: 'Подарки', type: 'income', color: '#4caf50' },
    { id: generateId(), name: 'Инвестиции', type: 'income', color: '#4caf50' },
    { id: generateId(), name: 'Фриланс', type: 'income', color: '#4caf50' },
    { id: generateId(), name: 'Прочее', type: 'income', color: '#4caf50' }
  ];

  const expenseCategories: Category[] = [
    { id: generateId(), name: 'Еда', type: 'expense', color: '#f44336' },
    { id: generateId(), name: 'Транспорт', type: 'expense', color: '#f44336' },
    { id: generateId(), name: 'Развлечения', type: 'expense', color: '#f44336' },
    { id: generateId(), name: 'Здоровье', type: 'expense', color: '#f44336' },
    { id: generateId(), name: 'Покупки', type: 'expense', color: '#f44336' },
    { id: generateId(), name: 'Жилье', type: 'expense', color: '#f44336' },
    { id: generateId(), name: 'Образование', type: 'expense', color: '#f44336' },
    { id: generateId(), name: 'Прочее', type: 'expense', color: '#f44336' }
  ];

  return [...incomeCategories, ...expenseCategories];
}

/**
 * Получить финансовые данные
 */
export async function getFinanceData(): Promise<FinanceData> {
  const data = await getStorageData<FinanceData>(STORAGE_KEYS.FINANCE);
  if (!data) {
    // Инициализируем с категориями по умолчанию
    const defaultData: FinanceData = {
      transactions: [],
      categories: getDefaultCategories(),
      budgets: []
    };
    await saveFinanceData(defaultData);
    return defaultData;
  }
  // Если категорий нет, добавляем их
  if (!data.categories || data.categories.length === 0) {
    data.categories = getDefaultCategories();
    await saveFinanceData(data);
  }
  // Если budgets нет, инициализируем пустым массивом
  if (!data.budgets) {
    data.budgets = [];
    await saveFinanceData(data);
  }
  return data;
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
    languages: false,
    'yearly-report': false
  };
}

/**
 * Сохранить флаги onboarding
 */
export async function saveOnboardingFlags(flags: OnboardingFlags): Promise<void> {
  await setStorageData(STORAGE_KEYS.ONBOARDING, flags);
}

/**
 * Получить все годовые отчеты
 */
export async function getYearlyReports(): Promise<YearlyReport[]> {
  const reports = await getStorageData<YearlyReport[]>(STORAGE_KEYS.YEARLY_REPORTS);
  return reports || [];
}

/**
 * Сохранить годовые отчеты
 */
export async function saveYearlyReports(reports: YearlyReport[]): Promise<void> {
  await setStorageData(STORAGE_KEYS.YEARLY_REPORTS, reports);
}

/**
 * Получить отчет по году
 */
export async function getYearlyReport(year: number): Promise<YearlyReport | null> {
  const reports = await getYearlyReports();
  return reports.find(r => r.year === year) || null;
}

/**
 * Генерация уникального ID
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Получить категории задач
 */
export async function getTaskCategories(): Promise<TaskCategory[]> {
  const categories = await getStorageData<TaskCategory[]>(STORAGE_KEYS.TASK_CATEGORIES);
  if (!categories || categories.length === 0) {
    const defaultCategories = getDefaultTaskCategories();
    await saveTaskCategories(defaultCategories);
    return defaultCategories;
  }
  return categories;
}

/**
 * Сохранить категории задач
 */
export async function saveTaskCategories(categories: TaskCategory[]): Promise<void> {
  await setStorageData(STORAGE_KEYS.TASK_CATEGORIES, categories);
}

/**
 * Предустановленные категории задач
 */
export function getDefaultTaskCategories(): TaskCategory[] {
  return [
    { id: generateId(), name: 'Работа', color: '#3390ec', icon: '💼' },
    { id: generateId(), name: 'Личное', color: '#ff6b35', icon: '👤' },
    { id: generateId(), name: 'Здоровье', color: '#4caf50', icon: '💚' },
    { id: generateId(), name: 'Образование', color: '#9c27b0', icon: '📚' },
    { id: generateId(), name: 'Семья', color: '#ff9800', icon: '👨‍👩‍👧‍👦' },
    { id: generateId(), name: 'Дом', color: '#607d8b', icon: '🏠' },
    { id: generateId(), name: 'Хобби', color: '#e91e63', icon: '🎨' },
    { id: generateId(), name: 'Спорт', color: '#00bcd4', icon: '⚽' },
    { id: generateId(), name: 'Прочее', color: '#9e9e9e', icon: '📝' }
  ];
}

/**
 * Получить теги задач
 */
export async function getTaskTags(): Promise<TaskTag[]> {
  const tags = await getStorageData<TaskTag[]>(STORAGE_KEYS.TASK_TAGS);
  return tags || [];
}

/**
 * Сохранить теги задач
 */
export async function saveTaskTags(tags: TaskTag[]): Promise<void> {
  await setStorageData(STORAGE_KEYS.TASK_TAGS, tags);
}

