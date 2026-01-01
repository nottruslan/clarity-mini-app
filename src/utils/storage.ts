/**
 * Утилиты для работы с Telegram Cloud Storage
 */

export interface StorageData {
  habits: Habit[];
  finance: FinanceData;
  onboarding: OnboardingFlags;
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
  HABITS: 'habits',
  FINANCE: 'finance',
  ONBOARDING: 'onboarding',
  YEARLY_REPORTS: 'yearly-reports'
} as const;

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
      localData = JSON.parse(data);
    }
  } catch (parseError) {
    console.error('Error parsing localStorage data:', parseError);
  }

  // Проверяем доступность CloudStorage для синхронизации
  const cloudStorage = window.Telegram?.WebApp?.CloudStorage;
  const webAppVersion = window.Telegram?.WebApp?.version;
  const versionNum = webAppVersion ? parseFloat(webAppVersion) : null;
  const hasCloudStorage = cloudStorage && typeof cloudStorage.getItem === 'function';
  const isCloudStorageSupported = hasCloudStorage && (versionNum === null || versionNum >= 6.1);

  // Если Cloud Storage недоступен, возвращаем данные из localStorage
  if (!hasCloudStorage || !isCloudStorageSupported) {
    console.log(`[SYNC] Cloud Storage недоступен для ключа "${key}", используем localStorage`);
    return localData;
  }

  // Пытаемся загрузить из Cloud Storage (приоритетный источник для синхронизации)
  // Используем короткий таймаут для быстрой синхронизации
  const cloudPromise = new Promise<T | null>((resolve) => {
    let resolved = false;
    const timeoutId = setTimeout(() => {
      if (!resolved) {
        resolved = true;
        resolve(null); // Таймаут - используем localStorage
      }
    }, 500); // 500ms таймаут для быстрой синхронизации Cloud Storage

    try {
      cloudStorage.getItem(key, (error, value) => {
        if (resolved) return;
        
        clearTimeout(timeoutId);
        resolved = true;
        
        if (error) {
          resolve(null); // Ошибка - используем localStorage
          return;
        }
        
        try {
          resolve(value ? JSON.parse(value) : null);
        } catch (parseError) {
          console.error('Error parsing Cloud Storage data:', parseError);
          resolve(null);
        }
      });
    } catch (syncError) {
      if (resolved) return;
      clearTimeout(timeoutId);
      resolved = true;
      resolve(null);
    }
  });

  // Ждем Cloud Storage с коротким таймаутом, но не блокируем надолго
  // Если Cloud Storage вернул данные - они приоритетнее (синхронизированы между устройствами)
  // cloudPromise уже имеет встроенный таймаут 500ms, поэтому просто ждем его
  try {
    const cloudData = await cloudPromise;

    if (cloudData !== null) {
      // Cloud Storage вернул данные - они приоритетнее для синхронизации
      // Обновляем localStorage для кэширования
      try {
        localStorage.setItem(key, JSON.stringify(cloudData));
        console.log('[SYNC] Cloud Storage data synced to localStorage for key:', key);
        return cloudData;
      } catch (error) {
        console.error('Error syncing Cloud Storage data to localStorage:', error);
        return cloudData; // Возвращаем данные из Cloud Storage даже если не удалось сохранить в localStorage
      }
    }
  } catch (error) {
    console.error('Error loading from Cloud Storage:', error);
  }

  // Если Cloud Storage не вернул данные или произошла ошибка - используем localStorage
  return localData;
}

/**
 * Сохранить данные в хранилище
 * Согласно документации Telegram: сохраняет в оба хранилища одновременно
 * - localStorage: для быстрого доступа на текущем устройстве (кэш)
 * - Cloud Storage: для синхронизации между устройствами пользователя
 * Если Cloud Storage недоступен - данные все равно сохраняются в localStorage
 */
export async function setStorageData<T>(key: string, data: T): Promise<void> {
  const jsonData = JSON.stringify(data);

  // Сначала сохраняем в localStorage (быстро и надежно)
  try {
    localStorage.setItem(key, jsonData);
  } catch (localStorageError) {
    console.error('Error saving to localStorage:', localStorageError);
    throw localStorageError; // Если localStorage не работает - это критическая ошибка
  }

  // Параллельно пытаемся сохранить в Cloud Storage (в фоне, не блокируем)
  const cloudStorage = window.Telegram?.WebApp?.CloudStorage;
  const webAppVersion = window.Telegram?.WebApp?.version;
  const versionNum = webAppVersion ? parseFloat(webAppVersion) : null;
  const hasCloudStorage = cloudStorage && typeof cloudStorage.setItem === 'function';
  const isCloudStorageSupported = hasCloudStorage && (versionNum === null || versionNum >= 6.1);

  if (!hasCloudStorage || !isCloudStorageSupported) {
    return; // Cloud Storage недоступен - данные уже сохранены в localStorage
  }

  // Сохраняем в Cloud Storage немедленно (в фоне, не блокируем)
  // Используем setImmediate или setTimeout(0) для немедленного выполнения
  try {
    // Вызываем сразу, без задержек
    cloudStorage.setItem(key, jsonData, (error) => {
      if (error) {
        console.warn(`Failed to save to Cloud Storage for key "${key}":`, error);
        // Данные уже сохранены в localStorage, так что это не критично
      }
    });
  } catch (syncError) {
    console.warn(`Sync error saving to Cloud Storage for key "${key}":`, syncError);
    // Данные уже сохранены в localStorage, так что это не критично
  }
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
 * Создать резервную копию всех пользовательских данных
 */
export async function createBackup(): Promise<string | null> {
  try {
    const backup: any = {};
    const userDataKeys = [
      STORAGE_KEYS.HABITS,
      STORAGE_KEYS.FINANCE,
      STORAGE_KEYS.YEARLY_REPORTS
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

