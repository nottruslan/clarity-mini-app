/**
 * Утилиты для работы с Telegram Cloud Storage
 */

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

const STORAGE_KEYS = {
  HABITS: 'habits',
  FINANCE: 'finance',
  ONBOARDING: 'onboarding',
  YEARLY_REPORTS: 'yearly-reports',
  TASKS: 'tasks',
  COVEY_MATRIX: 'covey-matrix-data',
  BOOKS: 'books'
} as const;

// Константы для синхронизации
const CLOUD_STORAGE_MIN_VERSION: [number, number] = [6, 1]; // [major, minor] для правильного сравнения версий
const CLOUD_STORAGE_TIMEOUT = 3000; // 3 секунды для медленных соединений
const SET_ITEM_MAX_RETRIES = 3;
const SET_ITEM_RETRY_DELAY = 1000; // 1 секунда между попытками

/**
 * Безопасно парсит версию Telegram WebApp
 * Поддерживает форматы: "6.1", "6.1.0", "6.10", "6.10.0"
 * Возвращает версию как массив [major, minor] для правильного сравнения
 */
function parseVersion(version: string): [number, number] | null {
  try {
    // Убираем возможные префиксы типа "v"
    const cleanVersion = version.replace(/^v/i, '').trim();
    
    // Парсим версию: берем major и minor части
    const parts = cleanVersion.split('.');
    if (parts.length === 0) return null;
    
    const major = parseInt(parts[0], 10);
    if (isNaN(major)) return null;
    
    // Если minor часть отсутствует (например, версия "6"), используем 0
    // Если minor часть есть, но пустая (например, "6."), также используем 0
    const minorStr = parts.length > 1 ? parts[1] : '0';
    const minor = minorStr === '' ? 0 : parseInt(minorStr, 10);
    if (isNaN(minor)) return null;
    
    // Возвращаем версию как массив [major, minor] для правильного сравнения
    // [6, 1] для "6.1", [6, 10] для "6.10"
    return [major, minor];
  } catch (error) {
    console.error('Error parsing version:', error);
    return null;
  }
}

/**
 * Сравнивает две версии [major, minor]
 * Возвращает true, если version1 >= version2
 */
function compareVersions(version1: [number, number], version2: [number, number]): boolean {
  if (version1[0] > version2[0]) return true;
  if (version1[0] < version2[0]) return false;
  // major одинаковый, сравниваем minor
  return version1[1] >= version2[1];
}

/**
 * Проверяет, поддерживается ли CloudStorage API
 */
function isCloudStorageSupported(): boolean {
  const cloudStorage = window.Telegram?.WebApp?.CloudStorage;
  if (!cloudStorage || typeof cloudStorage.getItem !== 'function' || typeof cloudStorage.setItem !== 'function') {
    return false;
  }
  
  const webAppVersion = window.Telegram?.WebApp?.version;
  if (!webAppVersion) {
    // Если версия не указана, но API доступен, предполагаем поддержку
    return true;
  }
  
  const version = parseVersion(webAppVersion);
  if (version === null) {
    // Если не удалось распарсить версию, но API доступен, предполагаем поддержку
    return true;
  }
  
  return compareVersions(version, CLOUD_STORAGE_MIN_VERSION);
}

/**
 * Получает метаданные для разрешения конфликтов
 * Добавляет timestamp к данным для определения более свежей версии
 */
interface DataWithMetadata<T> {
  data: T;
  _syncTimestamp?: number;
  _syncVersion?: number;
}

/**
 * Обертывает данные метаданными для синхронизации
 */
function wrapDataWithMetadata<T>(data: T): DataWithMetadata<T> {
  return {
    data,
    _syncTimestamp: Date.now(),
    _syncVersion: 1
  };
}

/**
 * Извлекает данные из обертки с метаданными
 * Безопасно обрабатывает примитивные типы, массивы и null
 */
function unwrapData<T>(wrapped: DataWithMetadata<T> | T): T {
  // Проверяем, что wrapped не null/undefined и является объектом
  // Примитивные типы (string, number, boolean) не могут быть обернуты метаданными
  // Массивы тоже могут быть обернуты, поэтому проверяем наличие _syncTimestamp
  if (wrapped !== null && 
      wrapped !== undefined && 
      typeof wrapped === 'object' &&
      '_syncTimestamp' in wrapped) {
    return (wrapped as DataWithMetadata<T>).data;
  }
  return wrapped as T;
}

/**
 * Сравнивает две версии данных и возвращает более свежую
 * Использует timestamp для определения более новой версии
 */
function resolveConflict<T>(localData: T | null, cloudData: T | null): T | null {
  if (!localData && !cloudData) return null;
  if (!localData) return cloudData;
  if (!cloudData) return localData;
  
  // Безопасно проверяем наличие метаданных перед использованием
  const localHasMetadata = localData && 
    typeof localData === 'object' && 
    '_syncTimestamp' in localData;
  
  const cloudHasMetadata = cloudData && 
    typeof cloudData === 'object' && 
    '_syncTimestamp' in cloudData;
  
  // Если оба данных имеют метаданные, сравниваем по timestamp
  if (localHasMetadata && cloudHasMetadata) {
    const localWrapped = localData as unknown as DataWithMetadata<T>;
    const cloudWrapped = cloudData as unknown as DataWithMetadata<T>;
    
    const localTimestamp = localWrapped._syncTimestamp || 0;
    const cloudTimestamp = cloudWrapped._syncTimestamp || 0;
    
    // CloudStorage имеет приоритет при одинаковом timestamp
    return cloudTimestamp >= localTimestamp ? cloudData : localData;
  }
  
  // Если метаданных нет, приоритет у CloudStorage (синхронизированные данные)
  return cloudData;
}

/**
 * Результат загрузки из CloudStorage
 */
interface CloudStorageLoadResult<T> {
  data: T | null;
  hasError: boolean; // true если была ошибка, false если данных просто нет
}

/**
 * Получить данные из хранилища
 * Согласно документации Telegram: Cloud Storage - основной источник для синхронизации между устройствами
 * localStorage используется как кэш для быстрого доступа
 * Приоритет: Cloud Storage (синхронизированные данные) > localStorage (кэш)
 */
export async function getStorageData<T>(key: string): Promise<T | null> {
  // Сначала загружаем из localStorage для быстрого старта (кэш)
  let localData: T | null = null;
  try {
    const data = localStorage.getItem(key);
    if (data) {
      const parsed = JSON.parse(data);
      localData = unwrapData<T>(parsed);
    }
  } catch (parseError) {
    console.error('Error parsing localStorage data:', parseError);
  }

  // Проверяем доступность CloudStorage для синхронизации
  if (!isCloudStorageSupported()) {
    console.log(`[SYNC] Cloud Storage недоступен для ключа "${key}", используем localStorage`);
    return localData;
  }

  const cloudStorage = window.Telegram?.WebApp?.CloudStorage!;

  // Пытаемся загрузить из Cloud Storage (приоритетный источник для синхронизации)
  // Используем увеличенный таймаут для медленных соединений
  const cloudPromise = new Promise<CloudStorageLoadResult<T>>((resolve) => {
    let resolved = false;
    const timeoutId = setTimeout(() => {
      if (!resolved) {
        resolved = true;
        console.warn(`[SYNC] Timeout loading from Cloud Storage for key "${key}"`);
        resolve({ data: null, hasError: true }); // Таймаут считается ошибкой
      }
    }, CLOUD_STORAGE_TIMEOUT);

    try {
      cloudStorage.getItem(key, (error, value) => {
        if (resolved) return;
        
        clearTimeout(timeoutId);
        resolved = true;
        
        if (error) {
          console.warn(`[SYNC] Error loading from Cloud Storage for key "${key}":`, error);
          resolve({ data: null, hasError: true }); // Ошибка загрузки
          return;
        }
        
        // value === null означает, что данных нет в CloudStorage (не ошибка)
        // value === "" (пустая строка) также означает отсутствие данных
        if (value === null || value === '') {
          resolve({ data: null, hasError: false });
          return;
        }
        
        try {
          const parsed = JSON.parse(value);
          const unwrapped = unwrapData<T>(parsed);
          resolve({ data: unwrapped, hasError: false });
        } catch (parseError) {
          console.error('Error parsing Cloud Storage data:', parseError);
          resolve({ data: null, hasError: true }); // Ошибка парсинга
        }
      });
    } catch (syncError) {
      if (resolved) return;
      clearTimeout(timeoutId);
      resolved = true;
      console.error(`[SYNC] Exception loading from Cloud Storage for key "${key}":`, syncError);
      resolve({ data: null, hasError: true });
    }
  });

  // Ждем Cloud Storage с таймаутом
  try {
    const result = await cloudPromise;

    // Если Cloud Storage вернул данные - они приоритетнее для синхронизации
    if (result.data !== null) {
      // Обновляем localStorage для кэширования
      // Всегда оборачиваем данные метаданными с новым timestamp при сохранении в localStorage
      // Это обеспечивает актуальность метаданных для разрешения конфликтов
      try {
        const wrapped = wrapDataWithMetadata(result.data);
        localStorage.setItem(key, JSON.stringify(wrapped));
        console.log(`[SYNC] Cloud Storage data synced to localStorage for key: "${key}"`);
      } catch (error) {
        console.error('Error syncing Cloud Storage data to localStorage:', error);
      }
      // Возвращаем данные без метаданных (unwrapData уже был вызван при загрузке)
      return result.data;
    }

    // Если данных нет в CloudStorage, но есть в localStorage
    // Разрешаем конфликт: если localStorage содержит данные, используем их
    // но если это была ошибка загрузки, также используем localStorage как fallback
    if (localData !== null) {
      if (result.hasError) {
        console.log(`[SYNC] Cloud Storage error for key "${key}", using localStorage as fallback`);
      } else {
        console.log(`[SYNC] No data in Cloud Storage for key "${key}", using localStorage`);
      }
      // Используем resolveConflict для единообразной обработки
      return resolveConflict(localData, null);
    }

    // Нет данных ни в CloudStorage, ни в localStorage
    return null;
  } catch (error) {
    console.error('Error loading from Cloud Storage:', error);
    // При любой ошибке возвращаем localStorage как fallback
    return localData;
  }
}

/**
 * Сохранить данные в CloudStorage с повторными попытками
 */
function saveToCloudStorageWithRetry(
  key: string,
  jsonData: string,
  retries: number = SET_ITEM_MAX_RETRIES
): Promise<boolean> {
  return new Promise((resolve) => {
    const cloudStorage = window.Telegram?.WebApp?.CloudStorage!;
    let attempt = 0;

    const trySave = () => {
      attempt++;
      
      try {
        cloudStorage.setItem(key, jsonData, (error) => {
          if (error) {
            if (attempt < retries) {
              console.warn(
                `[SYNC] Attempt ${attempt}/${retries} failed to save to Cloud Storage for key "${key}", retrying...`,
                error
              );
              setTimeout(trySave, SET_ITEM_RETRY_DELAY);
            } else {
              console.error(
                `[SYNC] All ${retries} attempts failed to save to Cloud Storage for key "${key}":`,
                error
              );
              resolve(false);
            }
          } else {
            if (attempt > 1) {
              console.log(`[SYNC] Successfully saved to Cloud Storage for key "${key}" after ${attempt} attempts`);
            } else {
              console.log(`[SYNC] Successfully saved to Cloud Storage for key "${key}"`);
            }
            resolve(true);
          }
        });
      } catch (syncError) {
        if (attempt < retries) {
          console.warn(
            `[SYNC] Attempt ${attempt}/${retries} exception saving to Cloud Storage for key "${key}", retrying...`,
            syncError
          );
          setTimeout(trySave, SET_ITEM_RETRY_DELAY);
        } else {
          console.error(
            `[SYNC] All ${retries} attempts failed with exception for key "${key}":`,
            syncError
          );
          resolve(false);
        }
      }
    };

    trySave();
  });
}

/**
 * Сохранить данные в хранилище
 * Согласно документации Telegram: сохраняет в оба хранилища одновременно
 * - localStorage: для быстрого доступа на текущем устройстве (кэш)
 * - Cloud Storage: для синхронизации между устройствами пользователя
 * Если Cloud Storage недоступен - данные все равно сохраняются в localStorage
 */
export async function setStorageData<T>(key: string, data: T): Promise<void> {
  // Обертываем данные метаданными для синхронизации
  const wrappedData = wrapDataWithMetadata(data);
  const jsonData = JSON.stringify(wrappedData);

  // Сначала сохраняем в localStorage (быстро и надежно)
  try {
    localStorage.setItem(key, jsonData);
  } catch (localStorageError) {
    console.error('Error saving to localStorage:', localStorageError);
    throw localStorageError; // Если localStorage не работает - это критическая ошибка
  }

  // Параллельно пытаемся сохранить в Cloud Storage (в фоне, не блокируем)
  if (!isCloudStorageSupported()) {
    console.log(`[SYNC] Cloud Storage недоступен для ключа "${key}", данные сохранены только в localStorage`);
    return; // Cloud Storage недоступен - данные уже сохранены в localStorage
  }

  // Сохраняем в Cloud Storage с повторными попытками
  // Не ждем завершения, чтобы не блокировать UI
  saveToCloudStorageWithRetry(key, jsonData).catch((error) => {
    console.error(`[SYNC] Unexpected error in saveToCloudStorageWithRetry for key "${key}":`, error);
  });
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
  // Убеждаемся, что transactions всегда существует (защита от потери данных)
  let needsSave = false;
  if (!data.transactions) {
    data.transactions = [];
    needsSave = true;
  }
  // Если категорий нет, добавляем их
  if (!data.categories || data.categories.length === 0) {
    data.categories = getDefaultCategories();
    needsSave = true;
  }
  // Если budgets нет, инициализируем пустым массивом
  if (!data.budgets) {
    data.budgets = [];
    needsSave = true;
  }
  // Сохраняем изменения, если что-то было инициализировано
  if (needsSave) {
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
 * Получить данные задач
 */
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
  // Инициализация полей, если их нет
  if (!data.inbox) data.inbox = [];
  if (!data.tasks) data.tasks = [];
  if (!data.completedTasks) data.completedTasks = [];
  return data;
}

/**
 * Сохранить данные задач
 */
export async function saveTasksData(data: TasksData): Promise<void> {
  await setStorageData(STORAGE_KEYS.TASKS, data);
}

/**
 * Получить данные матрицы Эйзенхауэра
 */
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
  // Инициализация полей, если их нет
  if (!data.tasks) data.tasks = [];
  if (!data.completedTasks) data.completedTasks = [];
  return data;
}

/**
 * Сохранить данные матрицы Эйзенхауэра
 */
export async function saveCoveyMatrixData(data: CoveyMatrixData): Promise<void> {
  await setStorageData(STORAGE_KEYS.COVEY_MATRIX, data);
}

/**
 * Получить данные книг
 */
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
  // Инициализация полей, если их нет
  if (!data.books) data.books = [];
  if (!data.goals) data.goals = [];
  return data;
}

/**
 * Сохранить данные книг
 */
export async function saveBooksData(data: BooksData): Promise<void> {
  await setStorageData(STORAGE_KEYS.BOOKS, data);
}

/**
 * Вычислить квадрант на основе важности и срочности
 */
export function calculateQuadrant(important: boolean, urgent: boolean): 'q1' | 'q2' | 'q3' | 'q4' {
  if (important && urgent) return 'q1';
  if (important && !urgent) return 'q2';
  if (!important && urgent) return 'q3';
  return 'q4';
}

/**
 * Получить значения важности и срочности по квадранту
 */
export function getQuadrantValues(quadrant: 'q1' | 'q2' | 'q3' | 'q4'): { important: boolean; urgent: boolean } {
  switch (quadrant) {
    case 'q1': return { important: true, urgent: true };
    case 'q2': return { important: true, urgent: false };
    case 'q3': return { important: false, urgent: true };
    case 'q4': return { important: false, urgent: false };
  }
}

/**
 * Получить список задач (только активные, без выполненных)
 */
export async function getTasks(): Promise<Task[]> {
  const data = await getTasksData();
  return data.tasks || [];
}

/**
 * Сохранить список задач
 */
export async function saveTasks(tasks: Task[]): Promise<void> {
  const data = await getTasksData();
  data.tasks = tasks;
  await saveTasksData(data);
}

/**
 * Получить список InBox заметок
 */
export async function getInbox(): Promise<InBoxItem[]> {
  const data = await getTasksData();
  return data.inbox || [];
}

/**
 * Сохранить список InBox заметок
 */
export async function saveInbox(inbox: InBoxItem[]): Promise<void> {
  const data = await getTasksData();
  data.inbox = inbox;
  await saveTasksData(data);
}

/**
 * Создать резервную копию всех пользовательских данных
 */
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

/**
 * Восстановить данные из резервной копии
 */
export async function restoreFromBackup(backupJson: string): Promise<void> {
  try {
    const backup = JSON.parse(backupJson);
    const keys = Object.keys(backup);
    
    for (const key of keys) {
      if (Object.values(STORAGE_KEYS).includes(key as any)) {
        try {
          await setStorageData(key, backup[key]);
          console.log(`✅ Восстановлено: ${key}`);
        } catch (error) {
          console.error(`❌ Ошибка восстановления ${key}:`, error);
        }
      }
    }
    console.log('✅ Все данные восстановлены из резервной копии');
  } catch (error) {
    console.error('❌ Ошибка восстановления из резервной копии:', error);
  }
}

/**
 * Очистить только технический кэш (не пользовательские данные)
 * Очищает только onboarding флаги и другие технические данные
 */
async function clearTechnicalCache(): Promise<void> {
  // Очищаем только технические данные
  try {
    await setStorageData(STORAGE_KEYS.ONBOARDING, {
      habits: false,
      finance: false,
      languages: false,
      'yearly-report': false
    });
    console.log('✅ Технический кэш очищен');
  } catch (error) {
    console.error('❌ Ошибка очистки технического кэша:', error);
  }
}

/**
 * Проверить доступность sessionStorage
 */
function isSessionStorageAvailable(): boolean {
  try {
    const test = '__sessionStorage_test__';
    sessionStorage.setItem(test, test);
    sessionStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Очистить кэш с сохранением пользовательских данных
 * Создает резервную копию, очищает localStorage, затем восстанавливает данные
 */
export async function clearCacheWithBackup(): Promise<void> {
  // Проверяем доступность sessionStorage
  if (!isSessionStorageAvailable()) {
    console.error('❌ sessionStorage недоступен! Операция отменена.');
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.showAlert('sessionStorage недоступен. Очистка кэша невозможна.');
    } else {
      alert('sessionStorage недоступен. Очистка кэша невозможна.');
    }
    return;
  }
  
  console.log('💾 Создаю резервную копию данных...');
  const backup = await createBackup();
  
  if (!backup) {
    console.error('❌ Не удалось создать резервную копию! Операция отменена.');
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.showAlert('Не удалось создать резервную копию. Операция отменена.');
    } else {
      alert('Не удалось создать резервную копию. Операция отменена.');
    }
    return;
  }
  
  // Сохраняем резервную копию в sessionStorage (не удаляется при очистке localStorage)
  try {
    sessionStorage.setItem('clarity_backup', backup);
    // Очищаем флаги восстановления
    sessionStorage.removeItem('clarity_restored');
    sessionStorage.removeItem('clarity_restoring');
    console.log('✅ Резервная копия создана и сохранена');
  } catch (error) {
    console.error('❌ Ошибка сохранения резервной копии:', error);
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.showAlert('Ошибка сохранения резервной копии. Операция отменена.');
    } else {
      alert('Ошибка сохранения резервной копии. Операция отменена.');
    }
    return;
  }
  
  console.log('🧹 Очищаю кэш...');
  
  // Очищаем только технический кэш
  await clearTechnicalCache();
  
  // Очищаем весь localStorage (данные восстановятся из резервной копии)
  try {
    localStorage.clear();
    console.log('✅ localStorage очищен');
  } catch (error) {
    console.error('❌ Ошибка очистки localStorage:', error);
  }
  
  console.log('🔄 Перезагружаю страницу...');
  // Перезагружаем страницу - данные восстановятся автоматически
  window.location.reload();
}

/**
 * Принудительная перезагрузка страницы с обходом кэша
 */
export function forceReload(): void {
  const url = new URL(window.location.href);
  url.searchParams.set('_t', Date.now().toString());
  window.location.href = url.toString();
}

