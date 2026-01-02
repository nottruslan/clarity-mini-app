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
const CLOUD_STORAGE_SAVE_TIMEOUT = 5000; // 5 секунд таймаут для ожидания сохранения
const PENDING_SAVES_QUEUE_MAX_SIZE = 10; // Максимальный размер очереди отложенных сохранений
const PENDING_SAVES_PROCESS_INTERVAL = 5000; // Интервал обработки очереди (5 секунд)

/**
 * Задача для отложенного сохранения в CloudStorage
 */
interface PendingSaveTask {
  key: string;
  jsonData: string;
  timestamp: number; // Время добавления в очередь
  attempts: number; // Количество попыток сохранения
}

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
  console.log('[SYNC] isCloudStorageSupported - START');
  
  const cloudStorage = window.Telegram?.WebApp?.CloudStorage;
  const hasCloudStorage = !!cloudStorage;
  const hasGetItem = cloudStorage && typeof cloudStorage.getItem === 'function';
  const hasSetItem = cloudStorage && typeof cloudStorage.setItem === 'function';
  
  console.log('[SYNC] isCloudStorageSupported - API check:', {
    hasCloudStorage,
    hasGetItem,
    hasSetItem,
    cloudStorageType: typeof cloudStorage
  });
  
  if (!cloudStorage || !hasGetItem || !hasSetItem) {
    console.log('[SYNC] isCloudStorageSupported - RESULT: false (API not available)');
    return false;
  }
  
  const webAppVersion = window.Telegram?.WebApp?.version;
  console.log('[SYNC] isCloudStorageSupported - Version check:', {
    webAppVersion,
    hasVersion: !!webAppVersion
  });
  
  if (!webAppVersion) {
    // Если версия не указана, но API доступен, предполагаем поддержку
    console.log('[SYNC] isCloudStorageSupported - RESULT: true (version not specified, but API available)');
    return true;
  }
  
  const version = parseVersion(webAppVersion);
  console.log('[SYNC] isCloudStorageSupported - Parsed version:', {
    originalVersion: webAppVersion,
    parsedVersion: version,
    minRequiredVersion: CLOUD_STORAGE_MIN_VERSION
  });
  
  if (version === null) {
    // Если не удалось распарсить версию, но API доступен, предполагаем поддержку
    console.log('[SYNC] isCloudStorageSupported - RESULT: true (version parse failed, but API available)');
    return true;
  }
  
  const isSupported = compareVersions(version, CLOUD_STORAGE_MIN_VERSION);
  console.log('[SYNC] isCloudStorageSupported - Version comparison:', {
    parsedVersion: version,
    minVersion: CLOUD_STORAGE_MIN_VERSION,
    isSupported,
    comparison: `${version[0]}.${version[1]} >= ${CLOUD_STORAGE_MIN_VERSION[0]}.${CLOUD_STORAGE_MIN_VERSION[1]}`
  });
  
  console.log('[SYNC] isCloudStorageSupported - RESULT:', isSupported);
  return isSupported;
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
  const timestamp = Date.now();
  const wrapped = {
    data,
    _syncTimestamp: timestamp,
    _syncVersion: 1
  };
  
  // Логируем размер данных для диагностики
  // Безопасно вычисляем размер данных (JSON.stringify(undefined) возвращает undefined)
  const dataJson = JSON.stringify(data);
  const dataSize = dataJson !== undefined ? dataJson.length : 0;
  const wrappedSize = JSON.stringify(wrapped).length;
  
  console.log('[SYNC] wrapDataWithMetadata:', {
    timestamp,
    dataSize,
    wrappedSize,
    overhead: wrappedSize - dataSize,
    dataType: Array.isArray(data) ? 'array' : typeof data,
    dataPreview: Array.isArray(data) 
      ? `array[${(data as any[]).length}]` 
      : typeof data === 'object' && data !== null
      ? `object with ${Object.keys(data as object).length} keys`
      : typeof data
  });
  
  return wrapped;
}

/**
 * Извлекает данные из обертки с метаданными
 * Безопасно обрабатывает примитивные типы, массивы и null
 */
function unwrapData<T>(wrapped: DataWithMetadata<T> | T): T {
  // Проверяем, что wrapped не null/undefined и является объектом
  // Примитивные типы (string, number, boolean) не могут быть обернуты метаданными
  // Массивы тоже могут быть обернуты, поэтому проверяем наличие _syncTimestamp
  const hasMetadata = wrapped !== null && 
      wrapped !== undefined && 
      typeof wrapped === 'object' &&
      '_syncTimestamp' in wrapped;
  
  if (hasMetadata) {
    const wrappedWithMeta = wrapped as DataWithMetadata<T>;
    const unwrapped = wrappedWithMeta.data;
    const timestamp = wrappedWithMeta._syncTimestamp;
    
    // Логируем извлечение данных
    const unwrappedSize = JSON.stringify(unwrapped).length;
    const wrappedSize = JSON.stringify(wrapped).length;
    
    console.log('[SYNC] unwrapData:', {
      hasMetadata: true,
      timestamp,
      syncVersion: wrappedWithMeta._syncVersion,
      unwrappedSize,
      wrappedSize,
      dataType: Array.isArray(unwrapped) ? 'array' : typeof unwrapped,
      dataPreview: Array.isArray(unwrapped) 
        ? `array[${(unwrapped as any[]).length}]` 
        : typeof unwrapped === 'object' && unwrapped !== null
        ? `object with ${Object.keys(unwrapped as object).length} keys`
        : typeof unwrapped,
      // Специальная проверка для finance данных
      isFinanceData: unwrapped && typeof unwrapped === 'object' && 'transactions' in unwrapped,
      transactionsCount: (unwrapped as any)?.transactions?.length || 0
    });
    
    return unwrapped;
  }
  
  // Данные не обернуты метаданными
  console.log('[SYNC] unwrapData:', {
    hasMetadata: false,
    dataType: typeof wrapped,
    isNull: wrapped === null,
    isUndefined: wrapped === undefined
  });
  
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
    
    // Выбираем более новые данные
    if (cloudTimestamp > localTimestamp) {
      return cloudData; // CloudStorage новее
    } else if (localTimestamp > cloudTimestamp) {
      return localData; // localStorage новее
    } else {
      // При одинаковом timestamp сохраняем локальные данные (они уже в состоянии)
      return localData;
    }
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
  originalWrapped?: any; // Оригинальный объект с метаданными из CloudStorage
}

// Очередь для отложенного сохранения в CloudStorage
const pendingCloudStorageSaves: PendingSaveTask[] = [];
let pendingSavesProcessIntervalId: number | null = null;

/**
 * Получить данные из хранилища
 * Согласно документации Telegram: Cloud Storage - основной источник для синхронизации между устройствами
 * localStorage используется как кэш для быстрого доступа
 * Приоритет: Cloud Storage (синхронизированные данные) > localStorage (кэш)
 */
export async function getStorageData<T>(key: string): Promise<T | null> {
  const startTime = Date.now();
  console.log(`[SYNC] getStorageData - START for key: "${key}"`);
  
  // Сначала загружаем из localStorage для быстрого старта (кэш)
  let localData: T | null = null;
  let localWrapped: any = null; // Сохраняем оригинальный wrapped объект для сравнения timestamp
  try {
    const data = localStorage.getItem(key);
    if (data) {
      const dataSize = data.length;
      console.log(`[SYNC] getStorageData - localStorage data found for key "${key}":`, {
        dataSize,
        hasData: true
      });
      
      const parsed = JSON.parse(data);
      localWrapped = parsed; // Сохраняем для сравнения timestamp
      console.log(`[SYNC] getStorageData - Parsed localStorage data for key "${key}":`, {
        hasSyncTimestamp: '_syncTimestamp' in parsed,
        hasData: 'data' in parsed,
        dataType: typeof parsed.data,
        parsedKeys: parsed.data && typeof parsed.data === 'object' ? Object.keys(parsed.data) : []
      });
      
      localData = unwrapData<T>(parsed);
      
      // Если unwrapData вернул null, но parsed существует, это может быть валидный null в данных
      // В этом случае localData остается null, но localWrapped сохраняется для проверки метаданных
      
      const localDataSize = localData ? JSON.stringify(localData).length : 0;
      console.log(`[SYNC] getStorageData - Unwrapped localStorage data for key "${key}":`, {
        hasData: !!localData,
        localDataSize,
        dataType: Array.isArray(localData) ? 'array' : typeof localData,
        preview: Array.isArray(localData) 
          ? `array[${localData.length}]` 
          : typeof localData === 'object' && localData !== null
          ? `object with ${Object.keys(localData).length} keys`
          : typeof localData
      });
    } else {
      console.log(`[SYNC] getStorageData - No data in localStorage for key "${key}"`);
    }
  } catch (parseError) {
    console.error(`[SYNC] getStorageData - Error parsing localStorage data for key "${key}":`, parseError);
  }

  // Проверяем доступность CloudStorage для синхронизации
  const isSupported = isCloudStorageSupported();
  if (!isSupported) {
    console.log(`[SYNC] getStorageData - Cloud Storage недоступен для ключа "${key}", используем localStorage`);
    const elapsed = Date.now() - startTime;
    console.log(`[SYNC] getStorageData - END for key "${key}" (localStorage only, ${elapsed}ms)`);
    return localData;
  }

  const cloudStorage = window.Telegram?.WebApp?.CloudStorage!;
  console.log(`[SYNC] getStorageData - CloudStorage available, attempting to load key "${key}"`);

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
      const getItemStartTime = Date.now();
      console.log(`[SYNC] getStorageData - Calling CloudStorage.getItem for key "${key}"`);
      
      cloudStorage.getItem(key, (error, value) => {
        const getItemElapsed = Date.now() - getItemStartTime;
        
        if (resolved) {
          console.log(`[SYNC] getStorageData - getItem callback already resolved for key "${key}" (ignored)`);
          return;
        }
        
        clearTimeout(timeoutId);
        resolved = true;
        
        console.log(`[SYNC] getStorageData - CloudStorage.getItem callback for key "${key}":`, {
          elapsed: `${getItemElapsed}ms`,
          hasError: !!error,
          error: error ? String(error) : null,
          hasValue: value !== null && value !== '',
          valueType: typeof value,
          valueLength: value ? value.length : 0,
          valuePreview: value && value.length > 0 ? value.substring(0, 100) + (value.length > 100 ? '...' : '') : null
        });
        
        if (error) {
          console.warn(`[SYNC] getStorageData - Error loading from Cloud Storage for key "${key}":`, error);
          resolve({ data: null, hasError: true }); // Ошибка загрузки
          return;
        }
        
        // value === null означает, что данных нет в CloudStorage (не ошибка)
        // value === "" (пустая строка) также означает отсутствие данных
        if (value === null || value === '') {
          console.log(`[SYNC] getStorageData - No data in CloudStorage for key "${key}" (not an error)`);
          resolve({ data: null, hasError: false });
          return;
        }
        
        try {
          console.log(`[SYNC] getStorageData - Parsing CloudStorage value for key "${key}"`);
          const parsed = JSON.parse(value);
          console.log(`[SYNC] getStorageData - Parsed CloudStorage data for key "${key}":`, {
            hasSyncTimestamp: '_syncTimestamp' in parsed,
            hasData: 'data' in parsed,
            parsedType: typeof parsed
          });
          
          const unwrapped = unwrapData<T>(parsed);
          const unwrappedSize = unwrapped ? JSON.stringify(unwrapped).length : 0;
          
          console.log(`[SYNC] getStorageData - Unwrapped CloudStorage data for key "${key}":`, {
            hasData: !!unwrapped,
            unwrappedSize,
            dataType: Array.isArray(unwrapped) ? 'array' : typeof unwrapped
          });
          
          // Сохраняем оригинальный wrapped объект для сохранения timestamp
          resolve({ data: unwrapped, hasError: false, originalWrapped: parsed });
        } catch (parseError) {
          console.error(`[SYNC] getStorageData - Error parsing Cloud Storage data for key "${key}":`, parseError);
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
    const cloudWaitStartTime = Date.now();
    console.log(`[SYNC] getStorageData - Waiting for CloudStorage response for key "${key}"`);
    
    const result = await cloudPromise;
    const cloudWaitElapsed = Date.now() - cloudWaitStartTime;
    
    console.log(`[SYNC] getStorageData - CloudStorage response received for key "${key}":`, {
      elapsed: `${cloudWaitElapsed}ms`,
      hasData: result.data !== null,
      hasError: result.hasError
    });

    // Если Cloud Storage вернул данные - сравниваем с локальными данными
    // Проверяем originalWrapped, так как result.data может быть null (валидное значение)
    // но originalWrapped будет установлен, если данные были успешно загружены
    if (result.originalWrapped !== null && result.originalWrapped !== undefined) {
      // Безопасно вычисляем размер данных для логирования
      const cloudDataSize = result.data !== null && result.data !== undefined 
        ? JSON.stringify(result.data).length 
        : 0;
      console.log(`[SYNC] getStorageData - CloudStorage data found for key "${key}":`, {
        dataSize: cloudDataSize,
        dataType: Array.isArray(result.data) ? 'array' : typeof result.data,
        isNull: result.data === null,
        isUndefined: result.data === undefined
      });
      
      // Сравниваем с локальными данными для выбора более новых
      let finalData: T | null;
      let finalWrapped: any;
      
      // Проверяем, есть ли метаданные для сравнения
      const localHasMetadata = localWrapped !== null && 
        typeof localWrapped === 'object' && 
        '_syncTimestamp' in localWrapped;
      const cloudHasMetadata = result.originalWrapped !== null && 
        result.originalWrapped !== undefined &&
        typeof result.originalWrapped === 'object' && 
        '_syncTimestamp' in result.originalWrapped;
      
      // Проверяем наличие локальных данных (не null и не undefined)
      const hasLocalData = localData !== null && localData !== undefined;
      
      if (hasLocalData && localHasMetadata && cloudHasMetadata) {
        // Оба источника имеют данные с метаданными - разрешаем конфликт
        const resolved = resolveConflict(localWrapped, result.originalWrapped);
        if (resolved === localWrapped) {
          // Локальные данные новее - используем их
          console.log(`[SYNC] getStorageData - Local data is newer, keeping local data for key "${key}"`);
          finalData = localData;
          finalWrapped = localWrapped;
        } else {
          // CloudStorage данные новее - используем их
          console.log(`[SYNC] getStorageData - CloudStorage data is newer, using cloud data for key "${key}"`);
          finalData = result.data;
          finalWrapped = result.originalWrapped;
        }
      } else if (hasLocalData && localHasMetadata && !cloudHasMetadata) {
        // Локальные данные с метаданными, CloudStorage без метаданных - используем локальные
        console.log(`[SYNC] getStorageData - Local data has metadata, CloudStorage doesn't, using local data for key "${key}"`);
        finalData = localData;
        finalWrapped = localWrapped;
      } else if (hasLocalData && !localHasMetadata && cloudHasMetadata) {
        // Локальные данные без метаданных, CloudStorage с метаданными - используем CloudStorage
        console.log(`[SYNC] getStorageData - CloudStorage has metadata, local doesn't, using cloud data for key "${key}"`);
        finalData = result.data;
        finalWrapped = result.originalWrapped;
      } else if (hasLocalData && !localHasMetadata && !cloudHasMetadata) {
        // Оба без метаданных - используем локальные (они уже в состоянии приложения)
        console.log(`[SYNC] getStorageData - Both sources have no metadata, using local data for key "${key}"`);
        finalData = localData;
        finalWrapped = localWrapped;
      } else {
        // Нет локальных данных (null или undefined) - используем CloudStorage
        console.log(`[SYNC] getStorageData - No local data, using cloud data for key "${key}"`);
        finalData = result.data;
        // Используем originalWrapped если доступен, иначе создаем новые метаданные
        finalWrapped = result.originalWrapped || null;
      }
      
      // Обновляем localStorage для кэширования
      // Сохраняем выбранные данные с их оригинальными метаданными
      try {
        if (finalWrapped) {
          const wrappedJson = JSON.stringify(finalWrapped);
          localStorage.setItem(key, wrappedJson);
          console.log(`[SYNC] getStorageData - Final data synced to localStorage for key "${key}":`, {
            wrappedSize: wrappedJson.length,
            timestamp: finalWrapped._syncTimestamp,
            source: finalWrapped === localWrapped ? 'local' : 'cloud'
          });
        } else {
          // Fallback: если метаданные недоступны, создаем новые
          const wrapped = wrapDataWithMetadata(finalData);
          const wrappedJson = JSON.stringify(wrapped);
          localStorage.setItem(key, wrappedJson);
          console.log(`[SYNC] getStorageData - Final data synced to localStorage for key "${key}" with new timestamp (fallback):`, {
            wrappedSize: wrappedJson.length
          });
        }
      } catch (error) {
        console.error(`[SYNC] getStorageData - Error syncing final data to localStorage for key "${key}":`, error);
      }
      
      // Возвращаем данные без метаданных
      const elapsed = Date.now() - startTime;
      console.log(`[SYNC] getStorageData - END for key "${key}" (resolved, ${elapsed}ms)`);
      return finalData;
    }

    // Если данных нет в CloudStorage, но есть в localStorage
    // Используем локальные данные как fallback
    if (localData !== null && localData !== undefined) {
      const elapsed = Date.now() - startTime;
      
      if (result.hasError) {
        console.log(`[SYNC] getStorageData - CloudStorage error for key "${key}", using localStorage as fallback (${elapsed}ms)`);
      } else {
        console.log(`[SYNC] getStorageData - No data in CloudStorage for key "${key}", using localStorage (${elapsed}ms)`);
      }
      
      console.log(`[SYNC] getStorageData - END for key "${key}" (localStorage fallback, ${elapsed}ms)`);
      return localData;
    }

    // Нет данных ни в CloudStorage, ни в localStorage
    const elapsed = Date.now() - startTime;
    console.log(`[SYNC] getStorageData - END for key "${key}" (no data found, ${elapsed}ms)`);
    return null;
  } catch (error) {
    const elapsed = Date.now() - startTime;
    console.error(`[SYNC] getStorageData - Exception loading from CloudStorage for key "${key}" (${elapsed}ms):`, error);
    // При любой ошибке возвращаем localStorage как fallback
    console.log(`[SYNC] getStorageData - END for key "${key}" (exception fallback to localStorage, ${elapsed}ms)`);
    return localData;
  }
}

/**
 * Добавляет задачу в очередь отложенного сохранения
 */
function queuePendingSave(key: string, jsonData: string): void {
  const dataSize = jsonData.length;
  
  // Удаляем существующую задачу для этого ключа (если есть)
  const existingIndex = pendingCloudStorageSaves.findIndex(task => task.key === key);
  if (existingIndex !== -1) {
    const existingTask = pendingCloudStorageSaves[existingIndex];
    console.log(`[SYNC] queuePendingSave - Replacing existing pending save for key "${key}":`, {
      existingAttempts: existingTask.attempts,
      existingAge: Date.now() - existingTask.timestamp
    });
    pendingCloudStorageSaves.splice(existingIndex, 1);
  }
  
  // Проверяем размер очереди
  if (pendingCloudStorageSaves.length >= PENDING_SAVES_QUEUE_MAX_SIZE) {
    // Удаляем самую старую задачу
    const oldestTask = pendingCloudStorageSaves.shift();
    console.warn(`[SYNC] queuePendingSave - Queue full (max: ${PENDING_SAVES_QUEUE_MAX_SIZE}), removing oldest task:`, {
      key: oldestTask?.key,
      age: oldestTask ? Date.now() - oldestTask.timestamp : 0,
      attempts: oldestTask?.attempts
    });
  }
  
  // Добавляем новую задачу
  const task: PendingSaveTask = {
    key,
    jsonData,
    timestamp: Date.now(),
    attempts: 0
  };
  
  pendingCloudStorageSaves.push(task);
  console.log(`[SYNC] queuePendingSave - Added task to queue for key "${key}":`, {
    queueSize: pendingCloudStorageSaves.length,
    dataSize,
    maxQueueSize: PENDING_SAVES_QUEUE_MAX_SIZE,
    allKeys: pendingCloudStorageSaves.map(t => t.key)
  });
}

/**
 * Обрабатывает очередь отложенных сохранений
 */
async function processPendingSaves(): Promise<void> {
  if (pendingCloudStorageSaves.length === 0) {
    return;
  }
  
  console.log(`[SYNC] processPendingSaves - Processing ${pendingCloudStorageSaves.length} pending saves`);
  
  const tasksToProcess = [...pendingCloudStorageSaves]; // Копируем массив для безопасной итерации
  
  for (const task of tasksToProcess) {
    task.attempts++;
    
    console.log(`[SYNC] processPendingSaves - Attempting to save key "${task.key}" (attempt ${task.attempts})`);
    
    try {
      const success = await saveToCloudStorageWithRetry(task.key, task.jsonData);
      
      if (success) {
        // Успешно сохранено - удаляем из очереди
        const index = pendingCloudStorageSaves.findIndex(t => t.key === task.key && t.timestamp === task.timestamp);
        if (index !== -1) {
          pendingCloudStorageSaves.splice(index, 1);
          console.log(`[SYNC] processPendingSaves - Successfully saved key "${task.key}", removed from queue`);
        }
      } else {
        // Не удалось сохранить - оставляем в очереди для следующей попытки
        console.warn(`[SYNC] processPendingSaves - Failed to save key "${task.key}", keeping in queue`);
        
        // Если слишком много попыток, удаляем задачу (возможно, проблема с данными)
        if (task.attempts >= 5) {
          const index = pendingCloudStorageSaves.findIndex(t => t.key === task.key && t.timestamp === task.timestamp);
          if (index !== -1) {
            pendingCloudStorageSaves.splice(index, 1);
            console.error(`[SYNC] processPendingSaves - Removed key "${task.key}" from queue after ${task.attempts} failed attempts`);
          }
        }
      }
    } catch (error) {
      console.error(`[SYNC] processPendingSaves - Error processing task for key "${task.key}":`, error);
    }
  }
  
  console.log(`[SYNC] processPendingSaves - Completed, ${pendingCloudStorageSaves.length} tasks remaining in queue`);
}

/**
 * Инициализирует периодическую обработку очереди отложенных сохранений
 * Экспортируется для вызова при загрузке приложения
 */
export function initializePendingSavesProcessor(): void {
  if (pendingSavesProcessIntervalId !== null) {
    console.log('[SYNC] initializePendingSavesProcessor - Already initialized, skipping');
    return;
  }
  
  const queueSize = pendingCloudStorageSaves.length;
  const isSupported = isCloudStorageSupported();
  
  console.log('[SYNC] initializePendingSavesProcessor - Starting periodic processing:', {
    queueSize,
    isCloudStorageSupported: isSupported,
    processInterval: PENDING_SAVES_PROCESS_INTERVAL,
    queueKeys: pendingCloudStorageSaves.map(t => t.key)
  });
  
  // Обрабатываем очередь сразу при инициализации
  if (queueSize > 0) {
    console.log(`[SYNC] initializePendingSavesProcessor - Processing ${queueSize} pending saves immediately`);
    processPendingSaves();
  }
  
  // Затем обрабатываем периодически
  if (typeof window !== 'undefined') {
    pendingSavesProcessIntervalId = window.setInterval(() => {
      const currentQueueSize = pendingCloudStorageSaves.length;
      if (currentQueueSize > 0) {
        console.log(`[SYNC] initializePendingSavesProcessor - Periodic processing: ${currentQueueSize} tasks in queue`);
        processPendingSaves();
      }
    }, PENDING_SAVES_PROCESS_INTERVAL);
    
    console.log('[SYNC] initializePendingSavesProcessor - Periodic processor started');
  } else {
    console.warn('[SYNC] initializePendingSavesProcessor - window is undefined, cannot start interval');
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
  const startTime = Date.now();
  console.log(`[SYNC] saveToCloudStorageWithRetry - START for key "${key}":`, {
    jsonDataSize: jsonData.length,
    maxRetries: retries,
    retryDelay: SET_ITEM_RETRY_DELAY
  });
  
  return new Promise((resolve) => {
    const cloudStorage = window.Telegram?.WebApp?.CloudStorage!;
    let attempt = 0;

    const trySave = () => {
      attempt++;
      const attemptStartTime = Date.now();
      
      console.log(`[SYNC] saveToCloudStorageWithRetry - Attempt ${attempt}/${retries} for key "${key}":`, {
        jsonDataSize: jsonData.length,
        jsonDataPreview: jsonData.substring(0, 100) + (jsonData.length > 100 ? '...' : '')
      });
      
      try {
        cloudStorage.setItem(key, jsonData, (error) => {
          const attemptElapsed = Date.now() - attemptStartTime;
          
          if (error) {
            console.warn(`[SYNC] saveToCloudStorageWithRetry - Attempt ${attempt}/${retries} failed for key "${key}" (${attemptElapsed}ms):`, {
              error: String(error),
              errorType: typeof error,
              errorMessage: error?.message || 'Unknown error'
            });
            
            if (attempt < retries) {
              console.log(`[SYNC] saveToCloudStorageWithRetry - Retrying in ${SET_ITEM_RETRY_DELAY}ms...`);
              setTimeout(trySave, SET_ITEM_RETRY_DELAY);
            } else {
              const totalElapsed = Date.now() - startTime;
              console.error(`[SYNC] saveToCloudStorageWithRetry - All ${retries} attempts failed for key "${key}" (${totalElapsed}ms)`);
              resolve(false);
            }
          } else {
            const totalElapsed = Date.now() - startTime;
            if (attempt > 1) {
              console.log(`[SYNC] saveToCloudStorageWithRetry - SUCCESS for key "${key}" after ${attempt} attempts (${totalElapsed}ms)`);
            } else {
              console.log(`[SYNC] saveToCloudStorageWithRetry - SUCCESS for key "${key}" on first attempt (${totalElapsed}ms)`);
            }
            resolve(true);
          }
        });
      } catch (syncError) {
        const attemptElapsed = Date.now() - attemptStartTime;
        console.warn(`[SYNC] saveToCloudStorageWithRetry - Exception on attempt ${attempt}/${retries} for key "${key}" (${attemptElapsed}ms):`, {
          error: syncError,
          errorType: typeof syncError,
          errorMessage: syncError instanceof Error ? syncError.message : String(syncError)
        });
        
        if (attempt < retries) {
          console.log(`[SYNC] saveToCloudStorageWithRetry - Retrying after exception in ${SET_ITEM_RETRY_DELAY}ms...`);
          setTimeout(trySave, SET_ITEM_RETRY_DELAY);
        } else {
          const totalElapsed = Date.now() - startTime;
          console.error(`[SYNC] saveToCloudStorageWithRetry - All ${retries} attempts failed with exception for key "${key}" (${totalElapsed}ms)`);
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
  const startTime = Date.now();
  console.log(`[SYNC] setStorageData - START for key "${key}"`);
  
  // Логируем исходные данные
  // Безопасно вычисляем размер данных (JSON.stringify(undefined) возвращает undefined)
  const dataJson = JSON.stringify(data);
  const dataSize = dataJson !== undefined ? dataJson.length : 0;
  console.log(`[SYNC] setStorageData - Input data for key "${key}":`, {
    dataSize,
    dataType: Array.isArray(data) ? 'array' : typeof data,
    isNull: data === null,
    isUndefined: data === undefined,
    dataPreview: Array.isArray(data) 
      ? `array[${(data as any[]).length}]` 
      : typeof data === 'object' && data !== null
      ? `object with ${Object.keys(data as object).length} keys`
      : typeof data
  });
  
  // Обертываем данные метаданными для синхронизации
  const wrappedData = wrapDataWithMetadata(data);
  const jsonData = JSON.stringify(wrappedData);
  const wrappedSize = jsonData.length;
  
  console.log(`[SYNC] setStorageData - Wrapped data for key "${key}":`, {
    wrappedSize,
    overhead: wrappedSize - dataSize,
    hasSyncTimestamp: !!wrappedData._syncTimestamp,
    syncTimestamp: wrappedData._syncTimestamp
  });

  // Сначала сохраняем в localStorage (быстро и надежно)
  try {
    const localStorageStartTime = Date.now();
    localStorage.setItem(key, jsonData);
    const localStorageElapsed = Date.now() - localStorageStartTime;
    console.log(`[SYNC] setStorageData - Saved to localStorage for key "${key}" (${localStorageElapsed}ms)`);
  } catch (localStorageError) {
    console.error(`[SYNC] setStorageData - Error saving to localStorage for key "${key}":`, localStorageError);
    throw localStorageError; // Если localStorage не работает - это критическая ошибка
  }

  // Пытаемся сохранить в Cloud Storage с ожиданием завершения (с таймаутом)
  const isSupported = isCloudStorageSupported();
  if (!isSupported) {
    const elapsed = Date.now() - startTime;
    console.log(`[SYNC] setStorageData - Cloud Storage недоступен для ключа "${key}", данные сохранены только в localStorage (${elapsed}ms)`);
    return; // Cloud Storage недоступен - данные уже сохранены в localStorage
  }

  // Сохраняем в Cloud Storage с повторными попытками и ожиданием завершения
  console.log(`[SYNC] setStorageData - Starting CloudStorage save for key "${key}" (awaiting completion with timeout)`);
  
  try {
    // Создаем Promise с таймаутом
    const savePromise = saveToCloudStorageWithRetry(key, jsonData);
    const timeoutPromise = new Promise<boolean>((resolve) => {
      setTimeout(() => {
        console.warn(`[SYNC] setStorageData - Timeout waiting for CloudStorage save for key "${key}" (${CLOUD_STORAGE_SAVE_TIMEOUT}ms)`);
        resolve(false);
      }, CLOUD_STORAGE_SAVE_TIMEOUT);
    });
    
    // Ждем либо завершения сохранения, либо таймаута
    const success = await Promise.race([savePromise, timeoutPromise]);
    
    const elapsed = Date.now() - startTime;
    
    if (success) {
      console.log(`[SYNC] setStorageData - CloudStorage save completed successfully for key "${key}" (${elapsed}ms)`);
    } else {
      // Сохранение не удалось или истек таймаут - добавляем в очередь для отложенного сохранения
      console.warn(`[SYNC] setStorageData - CloudStorage save failed or timed out for key "${key}" (${elapsed}ms), adding to pending queue`);
      queuePendingSave(key, jsonData);
      
      // Инициализируем обработчик очереди, если еще не инициализирован
      initializePendingSavesProcessor();
    }
  } catch (error) {
    const elapsed = Date.now() - startTime;
    console.error(`[SYNC] setStorageData - Unexpected error in saveToCloudStorageWithRetry for key "${key}" (${elapsed}ms):`, error);
    
    // При ошибке также добавляем в очередь
    queuePendingSave(key, jsonData);
    initializePendingSavesProcessor();
  }
  
  const elapsed = Date.now() - startTime;
  console.log(`[SYNC] setStorageData - END for key "${key}" (localStorage saved, CloudStorage processed, ${elapsed}ms)`);
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
 * Список названий базовых категорий для миграции
 */
const DEFAULT_CATEGORY_NAMES = {
  income: ['Зарплата', 'Подарки', 'Инвестиции', 'Фриланс', 'Прочее'],
  expense: ['Еда', 'Транспорт', 'Развлечения', 'Здоровье', 'Покупки', 'Жилье', 'Образование', 'Прочее']
};

/**
 * Проверяет, является ли категория базовой (по названию)
 */
function isDefaultCategory(category: Category): boolean {
  const defaultNames = category.type === 'income' 
    ? DEFAULT_CATEGORY_NAMES.income 
    : DEFAULT_CATEGORY_NAMES.expense;
  return defaultNames.includes(category.name);
}

/**
 * Получить финансовые данные
 */
export async function getFinanceData(): Promise<FinanceData> {
  console.log('[getFinanceData] START - Loading finance data from storage');
  const data = await getStorageData<FinanceData>(STORAGE_KEYS.FINANCE);
  console.log('[getFinanceData] Data loaded from storage:', {
    hasData: !!data,
    transactionsCount: data?.transactions?.length || 0,
    categoriesCount: data?.categories?.length || 0,
    budgetsCount: data?.budgets?.length || 0
  });
  
  if (!data) {
    console.log('[getFinanceData] No data found, initializing default data');
    // Инициализируем с пустыми категориями (базовые категории больше не создаются)
    const defaultData: FinanceData = {
      transactions: [],
      categories: [],
      budgets: []
    };
    await saveFinanceData(defaultData);
    return defaultData;
  }
  // Убеждаемся, что transactions всегда существует (защита от потери данных)
  let needsSave = false;
  if (!data.transactions) {
    console.warn('[getFinanceData] WARNING - transactions is missing, initializing empty array');
    data.transactions = [];
    needsSave = true;
  }
  // Если categories нет, инициализируем пустым массивом (базовые категории больше не создаются)
  if (!data.categories) {
    console.log('[getFinanceData] Categories missing, initializing empty array');
    data.categories = [];
    needsSave = true;
  } else {
    // Миграция: удаляем базовые категории, сохраняем пользовательские
    const originalCount = data.categories.length;
    const filteredCategories = data.categories.filter(cat => !isDefaultCategory(cat));
    if (filteredCategories.length !== originalCount) {
      console.log(`[getFinanceData] Migration: removing default categories. Before: ${originalCount}, After: ${filteredCategories.length}`);
      data.categories = filteredCategories;
    needsSave = true;
    }
  }
  // Если budgets нет, инициализируем пустым массивом
  if (!data.budgets) {
    console.log('[getFinanceData] Budgets missing, initializing empty array');
    data.budgets = [];
    needsSave = true;
  }
  // Сохраняем изменения, если что-то было инициализировано
  if (needsSave) {
    console.log('[getFinanceData] Saving initialized data back to storage');
    await saveFinanceData(data);
  }
  console.log('[getFinanceData] END - Returning finance data:', {
    transactionsCount: data.transactions?.length || 0,
    categoriesCount: data.categories?.length || 0,
    budgetsCount: data.budgets?.length || 0,
    transactions: data.transactions?.map(t => ({
      id: t.id,
      date: new Date(t.date).toISOString(),
      dateLocal: new Date(t.date).toString(),
      timestamp: t.date,
      type: t.type,
      amount: t.amount,
      category: t.category
    })) || []
  });
  return data;
}

/**
 * Сохранить финансовые данные
 */
export async function saveFinanceData(data: FinanceData): Promise<void> {
  console.log('[saveFinanceData] START - Saving finance data:', {
    transactionsCount: data.transactions?.length || 0,
    categoriesCount: data.categories?.length || 0,
    budgetsCount: data.budgets?.length || 0,
    transactions: data.transactions?.map(t => ({
      id: t.id,
      date: new Date(t.date).toISOString(),
      dateLocal: new Date(t.date).toString(),
      timestamp: t.date,
      type: t.type,
      amount: t.amount,
      category: t.category
    })) || []
  });
  try {
    await setStorageData(STORAGE_KEYS.FINANCE, data);
    console.log('[saveFinanceData] SUCCESS - Finance data saved to storage');
  } catch (error) {
    console.error('[saveFinanceData] ERROR - Failed to save finance data:', error);
    throw error;
  }
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

/**
 * Виртуальный тест синхронизации между устройствами
 * Симулирует два устройства и тестирует различные сценарии синхронизации
 * 
 * Использование: window.testSync() в консоли браузера
 */
export async function testSync(): Promise<void> {
  console.log('🧪 [TEST] ========================================');
  console.log('🧪 [TEST] Starting virtual sync test...');
  console.log('🧪 [TEST] This will simulate two devices and test synchronization scenarios');
  console.log('🧪 [TEST] ========================================\n');
  
  // Сохраняем оригинальные значения
  const originalCloudStorage = window.Telegram?.WebApp?.CloudStorage;
  const originalVersion = window.Telegram?.WebApp?.version;
  
  // Убеждаемся, что Telegram.WebApp существует для тестов
  if (!window.Telegram) {
    (window as any).Telegram = { WebApp: {} };
  }
  if (!window.Telegram?.WebApp) {
    (window.Telegram as any).WebApp = {};
  }
  
  // Устанавливаем версию для поддержки CloudStorage
  if (window.Telegram?.WebApp && !window.Telegram.WebApp.version) {
    window.Telegram.WebApp.version = '6.1';
  }
  
  // Тест 1: Сохранение на устройстве 1, загрузка на устройстве 2
  console.log('\n📱 [TEST] ========================================');
  console.log('📱 [TEST] Scenario 1: Save on Device 1, Load on Device 2');
  console.log('📱 [TEST] ========================================');
  try {
    // Устройство 1: сохраняем данные
    const testKey = '__sync_test_key__';
    const testData = { 
      device: 'device1', 
      timestamp: Date.now(),
      data: { test: 'value', count: 1 }
    };
    
    console.log('[TEST] Device 1: Initial data to save:', testData);
    
    // Симулируем CloudStorage для устройства 1 (хранит данные в памяти)
    let device1CloudStorage: Record<string, string> = {};
    
    const mockCloudStorage1 = {
      getItem: (key: string, callback: (error: Error | null, value: string | null) => void) => {
        setTimeout(() => {
          const value = device1CloudStorage[key] || null;
          console.log(`[TEST] Device 1 CloudStorage.getItem("${key}"):`, value ? `found (${value.length} bytes)` : 'null');
          callback(null, value);
        }, 50);
      },
      setItem: (key: string, value: string, callback: (error: Error | null) => void) => {
        setTimeout(() => {
          device1CloudStorage[key] = value;
          console.log(`[TEST] Device 1 CloudStorage.setItem("${key}"):`, `saved (${value.length} bytes)`);
          console.log(`[TEST] Device 1 CloudStorage.setItem value preview:`, value.substring(0, 150) + (value.length > 150 ? '...' : ''));
          callback(null);
        }, 50);
      }
    };
    
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.CloudStorage = mockCloudStorage1 as any;
    }
    
    // Очищаем localStorage перед тестом
    localStorage.removeItem(testKey);
    
    console.log('[TEST] Device 1: Calling setStorageData...');
    await setStorageData(testKey, testData);
    
    // Ждем завершения асинхронного сохранения в CloudStorage
    // Проверяем каждые 50ms, максимум 1 секунду
    let waitAttempts = 0;
    const maxWaitAttempts = 20; // 20 * 50ms = 1 секунда максимум
    while (!device1CloudStorage[testKey] && waitAttempts < maxWaitAttempts) {
      await new Promise(resolve => setTimeout(resolve, 50));
      waitAttempts++;
    }
    
    if (waitAttempts >= maxWaitAttempts) {
      console.warn('[TEST] Device 1: Timeout waiting for CloudStorage save');
    } else {
      console.log(`[TEST] Device 1: CloudStorage save completed after ${waitAttempts * 50}ms`);
    }
    
    // Проверяем, что данные сохранились в localStorage
    const savedInLocalStorage = localStorage.getItem(testKey);
    console.log('[TEST] Device 1: localStorage after save:', savedInLocalStorage ? `found (${savedInLocalStorage.length} bytes)` : 'not found');
    
    // Проверяем, что данные сохранились в CloudStorage (симуляция)
    const savedInCloudStorage = device1CloudStorage[testKey];
    console.log('[TEST] Device 1: CloudStorage after save:', savedInCloudStorage ? `found (${savedInCloudStorage.length} bytes)` : 'not found');
    
    if (savedInLocalStorage) {
      const parsed = JSON.parse(savedInLocalStorage);
      console.log('[TEST] Device 1: localStorage data structure:', {
        hasSyncTimestamp: !!parsed._syncTimestamp,
        syncTimestamp: parsed._syncTimestamp,
        hasData: !!parsed.data,
        dataDevice: parsed.data?.device,
        dataKeys: parsed.data ? Object.keys(parsed.data) : []
      });
    }
    
    if (savedInCloudStorage) {
      const parsed = JSON.parse(savedInCloudStorage);
      console.log('[TEST] Device 1: CloudStorage data structure:', {
        hasSyncTimestamp: !!parsed._syncTimestamp,
        syncTimestamp: parsed._syncTimestamp,
        hasData: !!parsed.data,
        dataDevice: parsed.data?.device
      });
    }
    
    // Устройство 2: загружаем данные (симулируем, что CloudStorage вернул данные с устройства 1)
    console.log('\n[TEST] Device 2: Simulating different device (empty localStorage, CloudStorage has Device 1 data)...');
    
    // Очищаем localStorage для устройства 2 (симуляция нового устройства)
    localStorage.removeItem(testKey);
    
    // Симулируем, что CloudStorage содержит данные с устройства 1
    const mockCloudStorage2 = {
      getItem: (key: string, callback: (error: Error | null, value: string | null) => void) => {
        setTimeout(() => {
          if (key === testKey && savedInCloudStorage) {
            // Симулируем, что CloudStorage вернул данные с устройства 1
            console.log(`[TEST] Device 2 CloudStorage.getItem("${key}"):`, `returning Device 1 data (${savedInCloudStorage.length} bytes)`);
            console.log(`[TEST] Device 2 CloudStorage value preview:`, savedInCloudStorage.substring(0, 150) + (savedInCloudStorage.length > 150 ? '...' : ''));
            callback(null, savedInCloudStorage);
          } else {
            console.log(`[TEST] Device 2 CloudStorage.getItem("${key}"):`, 'null (no data)');
            callback(null, null);
          }
        }, 100);
      },
      setItem: (key: string, value: string, callback: (error: Error | null) => void) => {
        setTimeout(() => {
          console.log(`[TEST] Device 2 CloudStorage.setItem("${key}"):`, `saved (${value.length} bytes)`);
          callback(null);
        }, 50);
      }
    };
    
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.CloudStorage = mockCloudStorage2 as any;
    }
    
    console.log('[TEST] Device 2: Calling getStorageData...');
    const loadedData = await getStorageData<typeof testData>(testKey);
    
    console.log('[TEST] Device 2: Final loaded data:', loadedData);
    console.log('[TEST] Device 2: Data validation:', {
      hasData: !!loadedData,
      device: loadedData?.device,
      expectedDevice: 'device1',
      matches: loadedData?.device === 'device1',
      hasTimestamp: !!loadedData?.timestamp,
      hasDataField: !!loadedData?.data
    });
    
    const passed = loadedData && loadedData.device === 'device1';
    console.log(`\n[TEST] Scenario 1 Result: ${passed ? '✅ PASSED' : '❌ FAILED'}`);
    if (!passed) {
      console.error('[TEST] Expected device: "device1", got:', loadedData?.device);
      console.error('[TEST] Full loaded data:', JSON.stringify(loadedData, null, 2));
    }
    
    // Очищаем тестовые данные
    localStorage.removeItem(testKey);
    device1CloudStorage = {};
  } catch (error) {
    console.error('[TEST] Scenario 1 ERROR:', error);
    console.error('[TEST] Error stack:', (error as Error).stack);
  }
  
  // Тест 2: Конфликт данных (разные данные на разных устройствах)
  console.log('\n📱 [TEST] ========================================');
  console.log('📱 [TEST] Scenario 2: Data Conflict (Different data on different devices)');
  console.log('📱 [TEST] ========================================');
  try {
    const testKey = '__sync_test_conflict__';
    
    // Устройство 1: сохраняет данные с timestamp T1 (старые)
    const device1Data = { 
      device: 'device1', 
      timestamp: Date.now() - 10000, // Старые данные
      data: { version: 1 }
    };
    const wrapped1 = wrapDataWithMetadata(device1Data);
    localStorage.setItem(testKey, JSON.stringify(wrapped1));
    console.log('[TEST] Device 1: Saved data with timestamp:', wrapped1._syncTimestamp);
    console.log('[TEST] Device 1: Data:', device1Data);
    
    // Устройство 2: сохраняет данные с timestamp T2 (новее)
    const device2Data = { 
      device: 'device2', 
      timestamp: Date.now(), // Новые данные
      data: { version: 2 }
    };
    const wrapped2 = wrapDataWithMetadata(device2Data);
    console.log('[TEST] Device 2: Has data with timestamp:', wrapped2._syncTimestamp);
    console.log('[TEST] Device 2: Data:', device2Data);
    console.log('[TEST] Timestamp comparison:', {
      device1: wrapped1._syncTimestamp,
      device2: wrapped2._syncTimestamp,
      device2Newer: wrapped2._syncTimestamp! > wrapped1._syncTimestamp!
    });
    
    // Симулируем CloudStorage с данными устройства 2 (более новые)
    const mockCloudStorage2 = {
      getItem: (key: string, callback: (error: Error | null, value: string | null) => void) => {
        setTimeout(() => {
          if (key === testKey) {
            console.log('[TEST] CloudStorage returning Device 2 data (newer)');
            callback(null, JSON.stringify(wrapped2));
          } else {
            callback(null, null);
          }
        }, 100);
      },
      setItem: (key: string, value: string, callback: (error: Error | null) => void) => {
        setTimeout(() => callback(null), 50);
      }
    };
    
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.CloudStorage = mockCloudStorage2 as any;
    }
    
    const resolvedData = await getStorageData<typeof device1Data>(testKey);
    console.log('[TEST] Resolved data:', resolvedData);
    const passed = resolvedData && resolvedData.device === 'device2';
    console.log(`[TEST] Scenario 2: ${passed ? '✅ PASSED (CloudStorage priority)' : '❌ FAILED'}`);
    if (!passed) {
      console.error('[TEST] Expected device: "device2", got:', resolvedData?.device);
    }
    
    localStorage.removeItem(testKey);
  } catch (error) {
    console.error('[TEST] Scenario 2 ERROR:', error);
  }
  
  // Тест 3: Отсутствие данных в CloudStorage
  console.log('\n📱 [TEST] ========================================');
  console.log('📱 [TEST] Scenario 3: No data in CloudStorage');
  console.log('📱 [TEST] ========================================');
  try {
    const testKey = '__sync_test_no_cloud__';
    const localData = { device: 'local', data: { test: 'local-only' } };
    const wrapped = wrapDataWithMetadata(localData);
    localStorage.setItem(testKey, JSON.stringify(wrapped));
    console.log('[TEST] localStorage has data:', localData);
    
    const mockCloudStorage3 = {
      getItem: (key: string, callback: (error: Error | null, value: string | null) => void) => {
        setTimeout(() => {
          console.log('[TEST] CloudStorage returning null (no data)');
          callback(null, null); // Нет данных в CloudStorage
        }, 100);
      },
      setItem: (key: string, value: string, callback: (error: Error | null) => void) => {
        setTimeout(() => callback(null), 50);
      }
    };
    
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.CloudStorage = mockCloudStorage3 as any;
    }
    
    const loadedData = await getStorageData<typeof localData>(testKey);
    console.log('[TEST] Loaded data (should be from localStorage):', loadedData);
    const passed = loadedData && loadedData.device === 'local';
    console.log(`[TEST] Scenario 3: ${passed ? '✅ PASSED (localStorage fallback)' : '❌ FAILED'}`);
    if (!passed) {
      console.error('[TEST] Expected device: "local", got:', loadedData?.device);
    }
    
    localStorage.removeItem(testKey);
  } catch (error) {
    console.error('[TEST] Scenario 3 ERROR:', error);
  }
  
  // Тест 4: Ошибка CloudStorage
  console.log('\n📱 [TEST] ========================================');
  console.log('📱 [TEST] Scenario 4: CloudStorage Error');
  console.log('📱 [TEST] ========================================');
  try {
    const testKey = '__sync_test_error__';
    const localData = { device: 'local', data: { test: 'fallback' } };
    const wrapped = wrapDataWithMetadata(localData);
    localStorage.setItem(testKey, JSON.stringify(wrapped));
    console.log('[TEST] localStorage has data:', localData);
    
    const mockCloudStorage4 = {
      getItem: (key: string, callback: (error: Error | null, value: string | null) => void) => {
        setTimeout(() => {
          console.log('[TEST] CloudStorage returning error');
          callback(new Error('CloudStorage error'), null);
        }, 100);
      },
      setItem: (key: string, value: string, callback: (error: Error | null) => void) => {
        setTimeout(() => callback(null), 50);
      }
    };
    
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.CloudStorage = mockCloudStorage4 as any;
    }
    
    const loadedData = await getStorageData<typeof localData>(testKey);
    console.log('[TEST] Loaded data (should be from localStorage after error):', loadedData);
    const passed = loadedData && loadedData.device === 'local';
    console.log(`[TEST] Scenario 4: ${passed ? '✅ PASSED (error fallback)' : '❌ FAILED'}`);
    if (!passed) {
      console.error('[TEST] Expected device: "local", got:', loadedData?.device);
    }
    
    localStorage.removeItem(testKey);
  } catch (error) {
    console.error('[TEST] Scenario 4 ERROR:', error);
  }
  
  // Восстанавливаем оригинальные значения
  if (window.Telegram?.WebApp) {
    if (originalCloudStorage) {
      window.Telegram.WebApp.CloudStorage = originalCloudStorage;
    } else {
      delete (window.Telegram.WebApp as any).CloudStorage;
    }
    if (window.Telegram?.WebApp) {
      if (originalVersion) {
        window.Telegram.WebApp.version = originalVersion;
      } else {
        delete (window.Telegram.WebApp as any).version;
      }
    }
  }
  
  console.log('\n🧪 [TEST] ========================================');
  console.log('🧪 [TEST] Virtual sync test completed!');
  console.log('🧪 [TEST] Check the logs above to see detailed synchronization flow');
  console.log('🧪 [TEST] ========================================\n');
}

/**
 * Диагностическая функция для проверки состояния синхронизации
 * Показывает текущее состояние localStorage и CloudStorage для всех ключей
 */
export async function diagnoseSync(): Promise<void> {
  console.log('🔍 [DIAG] ========================================');
  console.log('🔍 [DIAG] Starting sync diagnosis...');
  console.log('🔍 [DIAG] ========================================\n');
  
  // Проверка доступности CloudStorage
  console.log('📊 [DIAG] CloudStorage Availability:');
  const isSupported = isCloudStorageSupported();
  console.log('  - Supported:', isSupported);
  console.log('  - Telegram.WebApp exists:', !!window.Telegram?.WebApp);
  console.log('  - CloudStorage exists:', !!window.Telegram?.WebApp?.CloudStorage);
  console.log('  - Version:', window.Telegram?.WebApp?.version || 'not set');
  console.log('');
  
  // Проверка всех ключей
  const keys = Object.values(STORAGE_KEYS);
  console.log(`📊 [DIAG] Checking ${keys.length} storage keys:\n`);
  
  for (const key of keys) {
    console.log(`🔑 [DIAG] Key: "${key}"`);
    
    // Проверка localStorage
    const localData = localStorage.getItem(key);
    if (localData) {
      try {
        const parsed = JSON.parse(localData);
        const hasMetadata = '_syncTimestamp' in parsed;
        const size = localData.length;
        console.log(`  📦 localStorage:`, {
          exists: true,
          size,
          hasMetadata,
          timestamp: hasMetadata ? parsed._syncTimestamp : 'N/A',
          dataPreview: hasMetadata && parsed.data 
            ? (Array.isArray(parsed.data) ? `array[${parsed.data.length}]` : `object`)
            : 'N/A'
        });
      } catch (e) {
        console.log(`  📦 localStorage: exists but invalid JSON`);
      }
    } else {
      console.log(`  📦 localStorage: no data`);
    }
    
    // Проверка CloudStorage (если доступен)
    if (isSupported && window.Telegram?.WebApp?.CloudStorage) {
      try {
        await new Promise<void>((resolve) => {
          const timeout = setTimeout(() => {
            console.log(`  ☁️  CloudStorage: timeout (no response)`);
            resolve();
          }, 2000);
          
          window.Telegram?.WebApp?.CloudStorage?.getItem(key, (error, value) => {
            clearTimeout(timeout);
            if (error) {
              console.log(`  ☁️  CloudStorage: error - ${error}`);
            } else if (value === null || value === '') {
              console.log(`  ☁️  CloudStorage: no data`);
            } else {
              try {
                const parsed = JSON.parse(value);
                const hasMetadata = '_syncTimestamp' in parsed;
                const size = value.length;
                console.log(`  ☁️  CloudStorage:`, {
                  exists: true,
                  size,
                  hasMetadata,
                  timestamp: hasMetadata ? parsed._syncTimestamp : 'N/A',
                  dataPreview: hasMetadata && parsed.data 
                    ? (Array.isArray(parsed.data) ? `array[${parsed.data.length}]` : `object`)
                    : 'N/A'
                });
                
                // Сравнение с localStorage
                if (localData) {
                  const localParsed = JSON.parse(localData);
                  const localHasMeta = '_syncTimestamp' in localParsed;
                  const cloudHasMeta = '_syncTimestamp' in parsed;
                  
                  if (localHasMeta && cloudHasMeta) {
                    const localTs = localParsed._syncTimestamp;
                    const cloudTs = parsed._syncTimestamp;
                    const diff = cloudTs - localTs;
                    console.log(`  🔄 Sync Status:`, {
                      localTimestamp: localTs,
                      cloudTimestamp: cloudTs,
                      difference: `${diff > 0 ? '+' : ''}${diff}ms`,
                      cloudNewer: cloudTs > localTs,
                      inSync: Math.abs(diff) < 1000 // Считаем синхронизированным если разница < 1 сек
                    });
                  } else {
                    console.log(`  🔄 Sync Status: metadata missing (cannot compare)`);
                  }
                }
              } catch (e) {
                console.log(`  ☁️  CloudStorage: exists but invalid JSON`);
              }
            }
            resolve();
          });
        });
      } catch (e) {
        console.log(`  ☁️  CloudStorage: exception - ${e}`);
      }
    } else {
      console.log(`  ☁️  CloudStorage: not available`);
    }
    
    console.log('');
  }
  
  console.log('🔍 [DIAG] ========================================');
  console.log('🔍 [DIAG] Diagnosis completed!');
  console.log('🔍 [DIAG] ========================================\n');
}

// Делаем функции доступными в глобальной области для вызова из консоли
if (typeof window !== 'undefined') {
  (window as any).testSync = testSync;
  (window as any).diagnoseSync = diagnoseSync;
  console.log('🧪 [TEST] Virtual sync test function available: call window.testSync() in console');
  console.log('🔍 [DIAG] Sync diagnosis function available: call window.diagnoseSync() in console');
}

