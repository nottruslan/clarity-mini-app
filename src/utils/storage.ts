/**
 * Утилиты для работы с Telegram Cloud Storage
 */

// ============================================================================
// ИНТЕРФЕЙСЫ И ТИПЫ ДАННЫХ
// ============================================================================

export interface StorageData {
  habits: Habit[];
  finance: FinanceData;
  onboarding: OnboardingFlags;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  date?: number; // timestamp начала дня (00:00:00)
  time?: string; // формат "HH:mm" (например "14:30")
  priority?: 'low' | 'medium' | 'high';
  completed: boolean;
  pinned: boolean;
  recurring?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  createdAt: number;
  updatedAt: number;
}

export interface InBoxItem {
  id: string;
  text: string;
  createdAt: number;
}

export interface TasksData {
  inbox: InBoxItem[];
  tasks: Task[];
  completedTasks: Task[];
}

export interface CoveyTask {
  id: string;
  title: string;
  description?: string;
  important: boolean;  // Важность
  urgent: boolean;    // Срочность
  quadrant: 'q1' | 'q2' | 'q3' | 'q4'; // Вычисляется из important + urgent
  date?: number;     // timestamp
  completed: boolean;
  order?: number;    // Для ручной сортировки
  createdAt: number;
  updatedAt: number;
}

export interface CoveyMatrixData {
  tasks: CoveyTask[];
  completedTasks: CoveyTask[];
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
  icon?: string;
  order?: number;
}

export interface OnboardingFlags {
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

export interface Note {
  id: string;
  bookId: string;
  content: string;
  page?: number;
  createdAt: number;
  updatedAt: number;
}

export interface Quote {
  id: string;
  bookId: string;
  text: string;
  page?: number;
  chapter?: string;
  createdAt: number;
}

export interface Reflection {
  id: string;
  bookId: string;
  title?: string;
  content: string;
  createdAt: number;
  updatedAt: number;
}

export interface Book {
  id: string;
  title: string;
  author?: string;
  status: 'want-to-read' | 'reading' | 'completed' | 'paused' | 'abandoned';
  rating?: number; // 1-5
  coverUrl?: string; // base64 или URL
  genre?: string;
  startDate?: number; // timestamp
  completedDate?: number; // timestamp
  notes: Note[];
  quotes: Quote[];
  reflections: Reflection[];
  createdAt: number;
  updatedAt: number;
}

export interface BookGoal {
  id: string;
  targetCount: number;
  period: 'year' | 'month';
  year?: number; // для года
  month?: number; // для месяца (1-12)
  startDate: number; // timestamp начала периода
  endDate: number; // timestamp конца периода
  completedCount: number; // автоматически рассчитывается
  createdAt: number;
}

export interface BooksData {
  books: Book[];
  goals: BookGoal[];
}

// ============================================================================
// КОНСТАНТЫ
// ============================================================================

const STORAGE_KEYS = {
  HABITS: 'habits',
  FINANCE: 'finance',
  ONBOARDING: 'onboarding',
  YEARLY_REPORTS: 'yearly-reports',
  TASKS: 'tasks',
  COVEY_MATRIX: 'covey-matrix-data',
  BOOKS: 'books'
} as const;

const CLOUD_STORAGE_MIN_VERSION = [6, 1] as const;
const CLOUD_STORAGE_TIMEOUT = 3000;
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

// ============================================================================
// ТИПЫ ДЛЯ СИНХРОНИЗАЦИИ
// ============================================================================

interface StoredData<T> {
  data: T;
  timestamp: number;
}

// ============================================================================
// ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
// ============================================================================

function isCloudStorageSupported(): boolean {
  const cloudStorage = window.Telegram?.WebApp?.CloudStorage;
  if (!cloudStorage || !cloudStorage.getItem || !cloudStorage.setItem) {
    return false;
  }

  const version = window.Telegram?.WebApp?.version;
  if (!version) {
    return true; // Если версия не указана, предполагаем поддержку
  }

  try {
    const parts = version.split('.').map(Number);
    const major = parts[0] || 0;
    const minor = parts[1] || 0;
    return major > CLOUD_STORAGE_MIN_VERSION[0] || 
           (major === CLOUD_STORAGE_MIN_VERSION[0] && minor >= CLOUD_STORAGE_MIN_VERSION[1]);
  } catch {
    return true; // При ошибке парсинга предполагаем поддержку
  }
}

function wrapData<T>(data: T): StoredData<T> {
  return {
    data,
    timestamp: Date.now()
  };
}

function unwrapData<T>(wrapped: StoredData<T> | T): T {
  if (wrapped && typeof wrapped === 'object' && 'timestamp' in wrapped && 'data' in wrapped) {
    return (wrapped as StoredData<T>).data;
  }
  return wrapped as T;
}

function getCloudStorage() {
  if (!isCloudStorageSupported()) {
    return null;
  }
  return window.Telegram?.WebApp?.CloudStorage || null;
}

function loadFromCloudStorage<T>(key: string): Promise<{ data: T; timestamp: number } | null> {
  const cloudStorage = getCloudStorage();
  if (!cloudStorage) {
    return Promise.resolve(null);
  }

  return new Promise((resolve) => {
    const timeout = setTimeout(() => {
      resolve(null);
    }, CLOUD_STORAGE_TIMEOUT);

    try {
      cloudStorage.getItem(key, (error: Error | null, value: string | null) => {
        clearTimeout(timeout);
        if (error || !value) {
          resolve(null);
          return;
        }
        try {
          const parsed = JSON.parse(value);
          if (parsed && typeof parsed === 'object' && 'timestamp' in parsed && 'data' in parsed) {
            resolve({
              data: parsed.data as T,
              timestamp: parsed.timestamp || 0
            });
          } else {
            // Старый формат без обертки
            resolve({
              data: parsed as T,
              timestamp: 0
            });
          }
        } catch {
          resolve(null);
        }
      });
    } catch {
      clearTimeout(timeout);
      resolve(null);
    }
  });
}

function saveToCloudStorage(key: string, jsonData: string): Promise<boolean> {
  const cloudStorage = getCloudStorage();
  if (!cloudStorage) {
    return Promise.resolve(false);
  }

  return new Promise((resolve) => {
    let attempts = 0;
    
    const trySave = () => {
      attempts++;
      try {
        cloudStorage.setItem(key, jsonData, (error: Error | null) => {
          if (error && attempts < MAX_RETRIES) {
            setTimeout(trySave, RETRY_DELAY);
          } else {
            resolve(!error);
          }
        });
      } catch {
        if (attempts < MAX_RETRIES) {
          setTimeout(trySave, RETRY_DELAY);
        } else {
          resolve(false);
        }
      }
    };

    trySave();
  });
}

// ============================================================================
// БАЗОВЫЕ ФУНКЦИИ ХРАНЕНИЯ
// ============================================================================

export async function getStorageData<T>(key: string): Promise<T | null> {
  // Загружаем из localStorage (кэш)
  let localData: T | null = null;
  let localTimestamp = 0;
  try {
    const stored = localStorage.getItem(key);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed && typeof parsed === 'object' && 'timestamp' in parsed && 'data' in parsed) {
        localTimestamp = parsed.timestamp || 0;
        localData = parsed.data as T;
      } else {
        // Старый формат без обертки
        localData = parsed as T;
      }
    }
  } catch (error) {
    console.error(`Error loading from localStorage (${key}):`, error);
  }

  // Загружаем из Cloud Storage
  const cloudResult = await loadFromCloudStorage<T>(key);

  // Выбираем более новые данные
  if (cloudResult && localData) {
    if (cloudResult.timestamp > localTimestamp) {
      // Cloud Storage новее - обновляем localStorage
      try {
        const wrapped = wrapData(cloudResult.data);
        localStorage.setItem(key, JSON.stringify(wrapped));
      } catch {}
      return cloudResult.data;
    }
    // Локальные данные новее или равны - возвращаем локальные
    return localData;
  }

  if (cloudResult && !localData) {
    // Данные только в Cloud Storage - сохраняем в localStorage
    try {
      const wrapped = wrapData(cloudResult.data);
      localStorage.setItem(key, JSON.stringify(wrapped));
    } catch {}
    return cloudResult.data;
  }

  return localData;
}

export async function setStorageData<T>(key: string, data: T): Promise<void> {
  const wrapped = wrapData(data);
  const jsonData = JSON.stringify(wrapped);

  // Сохраняем в localStorage (быстро)
  try {
    localStorage.setItem(key, jsonData);
  } catch (error) {
    console.error(`Error saving to localStorage (${key}):`, error);
    throw error;
  }

  // Сохраняем в Cloud Storage (асинхронно, не блокируем)
  saveToCloudStorage(key, jsonData).catch(() => {
    // Игнорируем ошибки Cloud Storage, данные уже в localStorage
  });
}

// ============================================================================
// API ФУНКЦИИ ДЛЯ КОНКРЕТНЫХ ТИПОВ ДАННЫХ
// ============================================================================

export async function getHabits(): Promise<Habit[]> {
  const habits = await getStorageData<Habit[]>(STORAGE_KEYS.HABITS);
  return habits || [];
}

export async function saveHabits(habits: Habit[]): Promise<void> {
  await setStorageData(STORAGE_KEYS.HABITS, habits);
}

export async function getFinanceData(): Promise<FinanceData> {
  const data = await getStorageData<FinanceData>(STORAGE_KEYS.FINANCE);
  if (!data) {
    const defaultData: FinanceData = {
      transactions: [],
      categories: [],
      budgets: []
    };
    await saveFinanceData(defaultData);
    return defaultData;
  }
  // Инициализация полей, если их нет
  if (!data.transactions) data.transactions = [];
  if (!data.categories) data.categories = [];
  if (!data.budgets) data.budgets = [];
  return data;
}

export async function saveFinanceData(data: FinanceData): Promise<void> {
  await setStorageData(STORAGE_KEYS.FINANCE, data);
}

export function getDefaultCategories(): Category[] {
  const iconMap: Record<string, string> = {
    'Зарплата': '💰',
    'Подарки': '🎁',
    'Инвестиции': '💹',
    'Фриланс': '💼',
    'Прочее': '📦',
    'Еда': '🍔',
    'Транспорт': '🚗',
    'Развлечения': '🎬',
    'Здоровье': '🏥',
    'Покупки': '🛍️',
    'Жилье': '🏠',
    'Образование': '📚'
  };

  const incomeCategories: Category[] = [
    { id: generateId(), name: 'Зарплата', type: 'income', color: '#4caf50', icon: iconMap['Зарплата'], order: 0 },
    { id: generateId(), name: 'Подарки', type: 'income', color: '#4caf50', icon: iconMap['Подарки'], order: 1 },
    { id: generateId(), name: 'Инвестиции', type: 'income', color: '#4caf50', icon: iconMap['Инвестиции'], order: 2 },
    { id: generateId(), name: 'Фриланс', type: 'income', color: '#4caf50', icon: iconMap['Фриланс'], order: 3 },
    { id: generateId(), name: 'Прочее', type: 'income', color: '#4caf50', icon: iconMap['Прочее'], order: 4 }
  ];

  const expenseCategories: Category[] = [
    { id: generateId(), name: 'Еда', type: 'expense', color: '#f44336', icon: iconMap['Еда'], order: 0 },
    { id: generateId(), name: 'Транспорт', type: 'expense', color: '#f44336', icon: iconMap['Транспорт'], order: 1 },
    { id: generateId(), name: 'Развлечения', type: 'expense', color: '#f44336', icon: iconMap['Развлечения'], order: 2 },
    { id: generateId(), name: 'Здоровье', type: 'expense', color: '#f44336', icon: iconMap['Здоровье'], order: 3 },
    { id: generateId(), name: 'Покупки', type: 'expense', color: '#f44336', icon: iconMap['Покупки'], order: 4 },
    { id: generateId(), name: 'Жилье', type: 'expense', color: '#f44336', icon: iconMap['Жилье'], order: 5 },
    { id: generateId(), name: 'Образование', type: 'expense', color: '#f44336', icon: iconMap['Образование'], order: 6 },
    { id: generateId(), name: 'Прочее', type: 'expense', color: '#f44336', icon: iconMap['Прочее'], order: 7 }
  ];

  return [...incomeCategories, ...expenseCategories];
}

export async function getOnboardingFlags(): Promise<OnboardingFlags> {
  const flags = await getStorageData<OnboardingFlags>(STORAGE_KEYS.ONBOARDING);
  return flags || {
    habits: false,
    finance: false,
    languages: false,
    'yearly-report': false
  };
}

export async function saveOnboardingFlags(flags: OnboardingFlags): Promise<void> {
  await setStorageData(STORAGE_KEYS.ONBOARDING, flags);
}

export async function getYearlyReports(): Promise<YearlyReport[]> {
  const reports = await getStorageData<YearlyReport[]>(STORAGE_KEYS.YEARLY_REPORTS);
  return reports || [];
}

export async function saveYearlyReports(reports: YearlyReport[]): Promise<void> {
  await setStorageData(STORAGE_KEYS.YEARLY_REPORTS, reports);
}

export async function getYearlyReport(year: number): Promise<YearlyReport | null> {
  const reports = await getYearlyReports();
  return reports.find(r => r.year === year) || null;
}

export async function getTasksData(): Promise<TasksData> {
  const data = await getStorageData<TasksData>(STORAGE_KEYS.TASKS);
  if (!data) {
    const defaultData: TasksData = {
      inbox: [],
      tasks: [],
      completedTasks: []
    };
    await saveTasksData(defaultData);
    return defaultData;
  }
  if (!data.inbox) data.inbox = [];
  if (!data.tasks) data.tasks = [];
  if (!data.completedTasks) data.completedTasks = [];
  return data;
}

export async function saveTasksData(data: TasksData): Promise<void> {
  await setStorageData(STORAGE_KEYS.TASKS, data);
}

export async function getCoveyMatrixData(): Promise<CoveyMatrixData> {
  const data = await getStorageData<CoveyMatrixData>(STORAGE_KEYS.COVEY_MATRIX);
  if (!data) {
    const defaultData: CoveyMatrixData = {
      tasks: [],
      completedTasks: []
    };
    await saveCoveyMatrixData(defaultData);
    return defaultData;
  }
  if (!data.tasks) data.tasks = [];
  if (!data.completedTasks) data.completedTasks = [];
  return data;
}

export async function saveCoveyMatrixData(data: CoveyMatrixData): Promise<void> {
  await setStorageData(STORAGE_KEYS.COVEY_MATRIX, data);
}

export async function getBooksData(): Promise<BooksData> {
  const data = await getStorageData<BooksData>(STORAGE_KEYS.BOOKS);
  if (!data) {
    const defaultData: BooksData = {
      books: [],
      goals: []
    };
    await saveBooksData(defaultData);
    return defaultData;
  }
  if (!data.books) data.books = [];
  if (!data.goals) data.goals = [];
  return data;
}

export async function saveBooksData(data: BooksData): Promise<void> {
  await setStorageData(STORAGE_KEYS.BOOKS, data);
}

// ============================================================================
// ВСПОМОГАТЕЛЬНЫЕ API ФУНКЦИИ
// ============================================================================

export async function getTasks(): Promise<Task[]> {
  const data = await getTasksData();
  return data.tasks || [];
}

export async function saveTasks(tasks: Task[]): Promise<void> {
  const data = await getTasksData();
  data.tasks = tasks;
  await saveTasksData(data);
}

export async function getInbox(): Promise<InBoxItem[]> {
  const data = await getTasksData();
  return data.inbox || [];
}

export async function saveInbox(inbox: InBoxItem[]): Promise<void> {
  const data = await getTasksData();
  data.inbox = inbox;
  await saveTasksData(data);
}

// ============================================================================
// УТИЛИТЫ
// ============================================================================

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function calculateQuadrant(important: boolean, urgent: boolean): 'q1' | 'q2' | 'q3' | 'q4' {
  if (important && urgent) return 'q1';
  if (important && !urgent) return 'q2';
  if (!important && urgent) return 'q3';
  return 'q4';
}

export function getQuadrantValues(quadrant: 'q1' | 'q2' | 'q3' | 'q4'): { important: boolean; urgent: boolean } {
  switch (quadrant) {
    case 'q1': return { important: true, urgent: true };
    case 'q2': return { important: true, urgent: false };
    case 'q3': return { important: false, urgent: true };
    case 'q4': return { important: false, urgent: false };
  }
}

// ============================================================================
// РЕЗЕРВНОЕ КОПИРОВАНИЕ
// ============================================================================

export async function createBackup(): Promise<string | null> {
  try {
    const backup: any = {};
    const userDataKeys = [
      STORAGE_KEYS.HABITS,
      STORAGE_KEYS.FINANCE,
      STORAGE_KEYS.YEARLY_REPORTS,
      STORAGE_KEYS.TASKS,
      STORAGE_KEYS.COVEY_MATRIX,
      STORAGE_KEYS.BOOKS
    ];
    
    for (const key of userDataKeys) {
      try {
        const data = await getStorageData(key);
        if (data !== null && data !== undefined) {
          backup[key] = data;
        }
      } catch (error) {
        console.error(`Error backing up ${key}:`, error);
      }
    }
    
    return JSON.stringify(backup);
  } catch (error) {
    console.error('Error creating backup:', error);
    return null;
  }
}

export async function restoreFromBackup(backupJson: string): Promise<void> {
  try {
    const backup = JSON.parse(backupJson);
    const keys = Object.keys(backup);
    
    for (const key of keys) {
      if (Object.values(STORAGE_KEYS).includes(key as any)) {
        try {
          await setStorageData(key, backup[key]);
        } catch (error) {
          console.error(`Error restoring ${key}:`, error);
        }
      }
    }
  } catch (error) {
    console.error('Error restoring from backup:', error);
  }
}

function isSessionStorageAvailable(): boolean {
  try {
    const test = '__sessionStorage_test__';
    sessionStorage.setItem(test, test);
    sessionStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}

export async function clearCacheWithBackup(): Promise<void> {
  if (!isSessionStorageAvailable()) {
    const message = 'sessionStorage недоступен. Очистка кэша невозможна.';
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.showAlert(message);
    } else {
      alert(message);
    }
    return;
  }
  
  const backup = await createBackup();
  if (!backup) {
    const message = 'Не удалось создать резервную копию. Операция отменена.';
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.showAlert(message);
    } else {
      alert(message);
    }
    return;
  }
  
  try {
    sessionStorage.setItem('clarity_backup', backup);
    sessionStorage.removeItem('clarity_restored');
    sessionStorage.removeItem('clarity_restoring');
  } catch (error) {
    console.error('Error saving backup to sessionStorage:', error);
    return;
  }
  
  try {
    localStorage.clear();
    window.location.reload();
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
}

export function forceReload(): void {
  const url = new URL(window.location.href);
  url.searchParams.set('_t', Date.now().toString());
  window.location.href = url.toString();
}

// ============================================================================
// ИНИЦИАЛИЗАЦИЯ ОТЛОЖЕННЫХ СОХРАНЕНИЙ (для совместимости)
// ============================================================================

export function initializePendingSavesProcessor(): void {
  // Упрощенная версия - теперь не нужна, так как сохранения неблокирующие
  // Оставлена для совместимости с useCloudStorage
}
