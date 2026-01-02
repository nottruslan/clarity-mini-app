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

// Диагностическое логирование: отключено вне локальной разработки (чтобы не ловить CORS в Telegram)
const LOG_ENABLED = typeof window !== 'undefined' && window.location?.hostname === '127.0.0.1';
const logFetch: typeof fetch =
  LOG_ENABLED && typeof fetch !== 'undefined' ? fetch : ((() => Promise.resolve()) as any);

function logDebug(payload: Record<string, any>): void {
  if (!LOG_ENABLED) return;
  try {
    logFetch('http://127.0.0.1:7250/ingest/ee1f61b1-2553-4bd0-a919-0157b6f4b1e5', {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).catch(() => {});
  } catch {
    // ignore
  }
}

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
  if (wrapped && typeof wrapped === 'object' && !Array.isArray(wrapped)) {
    const obj = wrapped as any;
    if (obj.timestamp !== undefined && obj.data !== undefined) {
      return obj.data as T;
    }
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
    // #region agent log
  logFetch('http://127.0.0.1:7250/ingest/ee1f61b1-2553-4bd0-a919-0157b6f4b1e5',{method:'POST',mode:'no-cors',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'storage.ts:358',message:'loadFromCloudStorage start',data:{key},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
    // #endregion
    const timeout = setTimeout(() => {
      // #region agent log
      logFetch('http://127.0.0.1:7250/ingest/ee1f61b1-2553-4bd0-a919-0157b6f4b1e5',{method:'POST',mode:'no-cors',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'storage.ts:361',message:'cloud getItem timeout',data:{key},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
      // #endregion
      resolve(null);
    }, CLOUD_STORAGE_TIMEOUT);

    try {
      cloudStorage.getItem(key, (error: Error | null, value: string | null) => {
        clearTimeout(timeout);
        // #region agent log
        logFetch('http://127.0.0.1:7250/ingest/ee1f61b1-2553-4bd0-a919-0157b6f4b1e5',{method:'POST',mode:'no-cors',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'storage.ts:366',message:'cloud getItem callback',data:{key,error:!!error,hasValue:!!value,valueLength:value?.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
        // #endregion
        if (error || !value) {
          resolve(null);
          return;
        }
        try {
          const parsed = JSON.parse(value);
          // #region agent log
          logFetch('http://127.0.0.1:7250/ingest/ee1f61b1-2553-4bd0-a919-0157b6f4b1e5',{method:'POST',mode:'no-cors',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'storage.ts:372',message:'cloud parsed structure',data:{key,isObject:typeof parsed==='object',isArray:Array.isArray(parsed),hasData:parsed?.hasOwnProperty?.('data'),hasTimestamp:parsed?.hasOwnProperty?.('timestamp')},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
          // #endregion
          // Проверяем наличие обертки с timestamp и data
          if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
            const obj = parsed as any;
            if (obj.timestamp !== undefined && obj.data !== undefined) {
              // #region agent log
              logFetch('http://127.0.0.1:7250/ingest/ee1f61b1-2553-4bd0-a919-0157b6f4b1e5',{method:'POST',mode:'no-cors',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'storage.ts:374',message:'cloud data unwrapped',data:{key,timestamp:obj.timestamp},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
              // #endregion
              resolve({
                data: obj.data as T,
                timestamp: obj.timestamp || 0
              });
            } else {
              // Старый формат без обертки
              // #region agent log
              logFetch('http://127.0.0.1:7250/ingest/ee1f61b1-2553-4bd0-a919-0157b6f4b1e5',{method:'POST',mode:'no-cors',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'storage.ts:379',message:'cloud data old format',data:{key},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
              // #endregion
              resolve({
                data: parsed as T,
                timestamp: 0
              });
            }
          } else {
            // Не объект (массив или примитив)
            // #region agent log
            logFetch('http://127.0.0.1:7250/ingest/ee1f61b1-2553-4bd0-a919-0157b6f4b1e5',{method:'POST',mode:'no-cors',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'storage.ts:385',message:'cloud data non-object',data:{key},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
            // #endregion
            resolve({
              data: parsed as T,
              timestamp: 0
            });
          }
        } catch {
          // #region agent log
          logFetch('http://127.0.0.1:7250/ingest/ee1f61b1-2553-4bd0-a919-0157b6f4b1e5',{method:'POST',mode:'no-cors',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'storage.ts:392',message:'cloud parse error',data:{key},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
          // #endregion
          resolve(null);
        }
      });
    } catch {
      clearTimeout(timeout);
      // #region agent log
      logFetch('http://127.0.0.1:7250/ingest/ee1f61b1-2553-4bd0-a919-0157b6f4b1e5',{method:'POST',mode:'no-cors',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'storage.ts:401',message:'cloud getItem exception',data:{key},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
      // #endregion
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
      // #region agent log
      logFetch('http://127.0.0.1:7250/ingest/ee1f61b1-2553-4bd0-a919-0157b6f4b1e5',{method:'POST',mode:'no-cors',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'storage.ts:407',message:'saveToCloudStorage attempt',data:{key,attempts},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
      // #endregion
      try {
        cloudStorage.setItem(key, jsonData, (error: Error | null) => {
          // #region agent log
          logFetch('http://127.0.0.1:7250/ingest/ee1f61b1-2553-4bd0-a919-0157b6f4b1e5',{method:'POST',mode:'no-cors',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'storage.ts:410',message:'cloud setItem callback',data:{key,error:!!error,attempts},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
          // #endregion
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
  // #region agent log
  logFetch('http://127.0.0.1:7250/ingest/ee1f61b1-2553-4bd0-a919-0157b6f4b1e5',{method:'POST',mode:'no-cors',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'storage.ts:445',message:'getStorageData called',data:{key},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
  // #endregion
  // Загружаем из localStorage (основной источник)
  let localData: T | null = null;
  let localTimestamp = 0;
  
  try {
    const stored = localStorage.getItem(key);
    // #region agent log
    logFetch('http://127.0.0.1:7250/ingest/ee1f61b1-2553-4bd0-a919-0157b6f4b1e5',{method:'POST',mode:'no-cors',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'storage.ts:451',message:'localStorage.getItem result',data:{key,found:!!stored,length:stored?.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
    // #endregion
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // #region agent log
        logFetch('http://127.0.0.1:7250/ingest/ee1f61b1-2553-4bd0-a919-0157b6f4b1e5',{method:'POST',mode:'no-cors',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'storage.ts:455',message:'parsed data structure check',data:{key,isObject:typeof parsed==='object',isArray:Array.isArray(parsed),hasData:parsed?.hasOwnProperty?.('data'),hasTimestamp:parsed?.hasOwnProperty?.('timestamp'),keys:Object.keys(parsed||{})},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
        // #endregion
        // Проверяем структуру обертки: объект с полями data и timestamp
        if (parsed && typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) {
          const obj = parsed as any;
          // Безопасная проверка наличия свойств через Object.prototype.hasOwnProperty
          if (Object.prototype.hasOwnProperty.call(obj, 'data') && Object.prototype.hasOwnProperty.call(obj, 'timestamp')) {
            localTimestamp = obj.timestamp || 0;
            localData = obj.data;
            // #region agent log
            logFetch('http://127.0.0.1:7250/ingest/ee1f61b1-2553-4bd0-a919-0157b6f4b1e5',{method:'POST',mode:'no-cors',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'storage.ts:460',message:'unwrapped data successfully',data:{key,timestamp:localTimestamp,dataExists:!!localData},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
            // #endregion
          } else {
            // Старый формат или данные напрямую
            localData = parsed as T;
            // #region agent log
            logFetch('http://127.0.0.1:7250/ingest/ee1f61b1-2553-4bd0-a919-0157b6f4b1e5',{method:'POST',mode:'no-cors',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'storage.ts:464',message:'using unwrapped format',data:{key},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
            // #endregion
          }
        } else {
          // Массив или примитив - данные напрямую
          localData = parsed as T;
        }
      } catch (parseError) {
        // #region agent log
        logFetch('http://127.0.0.1:7250/ingest/ee1f61b1-2553-4bd0-a919-0157b6f4b1e5',{method:'POST',mode:'no-cors',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'storage.ts:467',message:'parse error',data:{key,error:String(parseError)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
        // #endregion
      }
    }
  } catch (error) {
    // #region agent log
    logFetch('http://127.0.0.1:7250/ingest/ee1f61b1-2553-4bd0-a919-0157b6f4b1e5',{method:'POST',mode:'no-cors',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'storage.ts:471',message:'localStorage getItem error',data:{key,error:String(error)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
    // #endregion
  }

  // Загружаем из Cloud Storage (ожидаем результат, чтобы не потерять данные)
  const cloudResult = await loadFromCloudStorage<T>(key).catch(() => null);
  // #region agent log
  logFetch('http://127.0.0.1:7250/ingest/ee1f61b1-2553-4bd0-a919-0157b6f4b1e5',{method:'POST',mode:'no-cors',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'storage.ts:476',message:'cloud storage result',data:{key,hasResult:!!cloudResult},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
  // #endregion

  if (cloudResult && (!localData || cloudResult.timestamp > localTimestamp)) {
    // #region agent log
    logFetch('http://127.0.0.1:7250/ingest/ee1f61b1-2553-4bd0-a919-0157b6f4b1e5',{method:'POST',mode:'no-cors',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'storage.ts:480',message:'using cloud data',data:{key},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
    // #endregion
    try {
      const wrapped = wrapData(cloudResult.data);
      localStorage.setItem(key, JSON.stringify(wrapped));
    } catch {}
    // #region agent log
    logFetch('http://127.0.0.1:7250/ingest/ee1f61b1-2553-4bd0-a919-0157b6f4b1e5',{method:'POST',mode:'no-cors',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'storage.ts:492',message:'returning cloud data',data:{key},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
    // #endregion
    return cloudResult.data;
  }

  // Возвращаем локальные данные (если они есть)
  // #region agent log
  logFetch('http://127.0.0.1:7250/ingest/ee1f61b1-2553-4bd0-a919-0157b6f4b1e5',{method:'POST',mode:'no-cors',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'storage.ts:492',message:'returning local data',data:{key,hasData:!!localData},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
  // #endregion
  return localData;
}

export async function setStorageData<T>(key: string, data: T): Promise<void> {
  // #region agent log
  logFetch('http://127.0.0.1:7250/ingest/ee1f61b1-2553-4bd0-a919-0157b6f4b1e5',{method:'POST',mode:'no-cors',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'storage.ts:497',message:'setStorageData called',data:{key,dataType:typeof data,isArray:Array.isArray(data)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
  // #endregion
  const wrapped = wrapData(data);
  const jsonData = JSON.stringify(wrapped);
  // #region agent log
  logFetch('http://127.0.0.1:7250/ingest/ee1f61b1-2553-4bd0-a919-0157b6f4b1e5',{method:'POST',mode:'no-cors',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'storage.ts:500',message:'wrapped data structure',data:{key,jsonLength:jsonData.length,hasData:jsonData.includes('"data"'),hasTimestamp:jsonData.includes('"timestamp"')},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
  // #endregion

  // Сохраняем в localStorage (быстро)
  try {
    localStorage.setItem(key, jsonData);
    // #region agent log
    logFetch('http://127.0.0.1:7250/ingest/ee1f61b1-2553-4bd0-a919-0157b6f4b1e5',{method:'POST',mode:'no-cors',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'storage.ts:505',message:'localStorage.setItem success',data:{key},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
    // #endregion
    // Проверяем, что данные действительно сохранились
    const verify = localStorage.getItem(key);
    // #region agent log
    logFetch('http://127.0.0.1:7250/ingest/ee1f61b1-2553-4bd0-a919-0157b6f4b1e5',{method:'POST',mode:'no-cors',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'storage.ts:508',message:'verification after save',data:{key,verified:!!verify,verifyLength:verify?.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
    // #endregion
  } catch (error) {
    // #region agent log
    logFetch('http://127.0.0.1:7250/ingest/ee1f61b1-2553-4bd0-a919-0157b6f4b1e5',{method:'POST',mode:'no-cors',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'storage.ts:510',message:'localStorage.setItem error',data:{key,error:String(error)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
    // #endregion
    throw error;
  }

  // Сохраняем в Cloud Storage (асинхронно, не блокируем)
  saveToCloudStorage(key, jsonData).then((success) => {
    // #region agent log
    logFetch('http://127.0.0.1:7250/ingest/ee1f61b1-2553-4bd0-a919-0157b6f4b1e5',{method:'POST',mode:'no-cors',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'storage.ts:516',message:'cloud storage save result',data:{key,success},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
    // #endregion
  }).catch((err) => {
    // #region agent log
    logFetch('http://127.0.0.1:7250/ingest/ee1f61b1-2553-4bd0-a919-0157b6f4b1e5',{method:'POST',mode:'no-cors',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'storage.ts:519',message:'cloud storage error',data:{key,error:String(err)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
    // #endregion
  });
}

function normalizeHabitHistory(history: Habit['history'] | undefined): Habit['history'] {
  if (!history || typeof history !== 'object') return {};
  const normalized: Habit['history'] = {};
  for (const dateKey of Object.keys(history)) {
    const entry = (history as any)[dateKey];
    if (typeof entry === 'boolean') {
      normalized[dateKey] = { completed: entry, value: undefined };
    } else if (entry && typeof entry === 'object') {
      const completed = Boolean((entry as any).completed);
      const value = (entry as any).value;
      normalized[dateKey] = value !== undefined ? { completed, value } : { completed };
    } else {
      normalized[dateKey] = { completed: !!entry };
    }
  }
  return normalized;
}

// ============================================================================
// API ФУНКЦИИ ДЛЯ КОНКРЕТНЫХ ТИПОВ ДАННЫХ
// ============================================================================

export async function getHabits(): Promise<Habit[]> {
  const raw = await getStorageData<Habit[]>(STORAGE_KEYS.HABITS);
  const habits = Array.isArray(raw) ? raw : [];
  return habits.map((habit) => {
    const normalizedHistory = normalizeHabitHistory(habit.history);
    return normalizedHistory === habit.history ? habit : { ...habit, history: normalizedHistory };
  });
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
