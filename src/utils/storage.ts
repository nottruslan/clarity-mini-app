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

export interface InBoxNote {
  id: string;
  text: string;
  createdAt: number;
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
  
  // InBox флаги
  movedToList?: boolean; // помечена как перемещенная в список
  
  // Закрепление
  pinned?: boolean; // закреплена ли задача
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
  TASK_TAGS: 'task-tags',
  INBOX_NOTES: 'inbox-notes'
} as const;

/**
 * Получить данные из Cloud Storage
 */
export async function getStorageData<T>(key: string): Promise<T | null> {
  console.log('[DEBUG] getStorageData: entry', { key });
  // Проверяем доступность CloudStorage и версию WebApp
  const cloudStorage = window.Telegram?.WebApp?.CloudStorage;
  const webAppVersion = window.Telegram?.WebApp?.version;
  const versionNum = webAppVersion ? parseFloat(webAppVersion) : null;
  const hasCloudStorage = cloudStorage && typeof cloudStorage.getItem === 'function';
  const isCloudStorageSupported = hasCloudStorage && (versionNum === null || versionNum >= 6.1);

  if (!hasCloudStorage || !isCloudStorageSupported) {
    console.warn('[DEBUG] Cloud Storage not available or not supported, using localStorage fallback', {
      hasCloudStorage,
      webAppVersion,
      versionNum,
      isCloudStorageSupported
    });
    try {
      const data = localStorage.getItem(key);
      if (data) {
        const parsed = JSON.parse(data);
        console.log('[DEBUG] Data loaded from localStorage', { key, dataLength: data.length, parsedType: Array.isArray(parsed) ? 'array' : typeof parsed });
        return parsed;
      } else {
        console.log('[DEBUG] No data in localStorage for key', { key });
        return null;
      }
    } catch (parseError) {
      console.error('[DEBUG] Error parsing localStorage data:', parseError);
      return null;
    }
  }

  return new Promise((resolve) => {
    try {
      cloudStorage.getItem(key, (error, value) => {
        if (error) {
          console.error('[DEBUG] Error getting from Cloud Storage:', error);
          // Fallback to localStorage
          try {
            const data = localStorage.getItem(key);
            resolve(data ? JSON.parse(data) : null);
          } catch (parseError) {
            console.error('Error parsing localStorage data:', parseError);
            resolve(null);
          }
          return;
        }
        resolve(value ? JSON.parse(value) : null);
      });
    } catch (syncError) {
      // Синхронная ошибка при вызове getItem
      console.error('[DEBUG] Synchronous error calling CloudStorage.getItem:', syncError);
      try {
        const data = localStorage.getItem(key);
        resolve(data ? JSON.parse(data) : null);
      } catch (parseError) {
        console.error('Error parsing localStorage data:', parseError);
        resolve(null);
      }
    }
  });
}

/**
 * Сохранить данные в Cloud Storage
 */
export async function setStorageData<T>(key: string, data: T): Promise<void> {
  const jsonData = JSON.stringify(data);

  // Проверяем доступность CloudStorage и метода setItem
  const cloudStorage = window.Telegram?.WebApp?.CloudStorage;
  const hasCloudStorage = cloudStorage && typeof cloudStorage.setItem === 'function';
  
  // Дополнительная проверка: если версия WebApp 6.0, CloudStorage не поддерживается
  const webAppVersion = window.Telegram?.WebApp?.version;
  const versionNum = webAppVersion ? parseFloat(webAppVersion) : null;
  const isCloudStorageSupported = hasCloudStorage && (versionNum === null || versionNum >= 6.1);

  if (!hasCloudStorage || !isCloudStorageSupported) {
    console.warn('[DEBUG] Cloud Storage not available or not supported, using localStorage fallback', { 
      hasCloudStorage, 
      webAppVersion,
      versionNum,
      isCloudStorageSupported 
    });
    try {
      localStorage.setItem(key, jsonData);
      // Проверяем, что данные действительно сохранились
      const saved = localStorage.getItem(key);
      if (saved === jsonData) {
        console.log('[DEBUG] Data saved to localStorage (direct fallback) - verified', { key, dataLength: jsonData.length });
        // Для задач проверяем содержимое
        if (key === 'tasks') {
          try {
            const parsed = JSON.parse(saved);
            console.log('[DEBUG] Tasks saved to localStorage verified', { 
              tasksCount: Array.isArray(parsed) ? parsed.length : 0,
              taskIds: Array.isArray(parsed) ? parsed.map((t: any) => ({ id: t.id, text: t.text })) : []
            });
          } catch (e) {
            console.error('[DEBUG] Error parsing saved tasks for verification:', e);
          }
        }
      } else {
        console.warn('[DEBUG] Data saved to localStorage but verification failed', { 
          key,
          expectedLength: jsonData.length, 
          savedLength: saved?.length 
        });
      }
      return;
    } catch (localStorageError) {
      console.error('[DEBUG] Error saving to localStorage:', localStorageError);
      throw localStorageError;
    }
  }

  return new Promise((resolve, reject) => {
    try {
      cloudStorage.setItem(key, jsonData, (error) => {
        if (error) {
          console.error('[DEBUG] Error saving to Cloud Storage:', error);
          // Проверяем, является ли ошибка WebAppMethodUnsupported
          const errorStr = error?.toString() || String(error);
          const isUnsupportedError = errorStr.includes('WebAppMethodUnsupported') || 
                                     errorStr.includes('not supported') ||
                                     errorStr.includes('MethodUnsupported');
          
          if (isUnsupportedError) {
            console.warn('[DEBUG] CloudStorage method not supported, falling back to localStorage');
          }
          
          // Fallback to localStorage при любой ошибке
          try {
            localStorage.setItem(key, jsonData);
            // Проверяем, что данные действительно сохранились
            const saved = localStorage.getItem(key);
            if (saved === jsonData) {
              console.log('[DEBUG] Data saved to localStorage as fallback successfully - verified');
            } else {
              console.warn('[DEBUG] Data saved to localStorage but verification failed', { 
                expectedLength: jsonData.length, 
                savedLength: saved?.length 
              });
            }
            resolve(); // Успешно сохранили в localStorage, разрешаем промис
          } catch (localStorageError) {
            console.error('[DEBUG] Error saving to localStorage:', localStorageError);
            reject(localStorageError);
          }
          return;
        }
        console.log('[DEBUG] Data saved to Cloud Storage successfully');
        resolve();
      });
    } catch (syncError) {
      // Синхронная ошибка при вызове setItem (например, метод не поддерживается)
      console.error('[DEBUG] Synchronous error calling CloudStorage.setItem:', syncError);
      try {
        localStorage.setItem(key, jsonData);
        // Проверяем, что данные действительно сохранились
        const saved = localStorage.getItem(key);
        if (saved === jsonData) {
          console.log('[DEBUG] Data saved to localStorage as fallback (sync error) - verified');
        } else {
          console.warn('[DEBUG] Data saved to localStorage but verification failed (sync error)');
        }
        resolve();
      } catch (localStorageError) {
        console.error('[DEBUG] Error saving to localStorage:', localStorageError);
        reject(localStorageError);
      }
    }
  });
}

/**
 * Получить все задачи
 */
export async function getTasks(): Promise<Task[]> {
  const tasks = await getStorageData<Task[]>(STORAGE_KEYS.TASKS);
  const loadedTasks = tasks || [];
  
  console.log('[DEBUG] getTasks: loaded from storage', { 
    tasksCount: loadedTasks.length,
    taskIds: loadedTasks.map(t => ({ id: t.id, text: t.text }))
  });
  
  // Миграция существующих задач к новой структуре
  const migratedTasks = migrateTasks(loadedTasks);
  
  // Если была миграция, сохраняем обновленные задачи
  if (JSON.stringify(migratedTasks) !== JSON.stringify(loadedTasks)) {
    console.log('[DEBUG] getTasks: migration detected, saving migrated tasks');
    await saveTasks(migratedTasks);
  }
  
  console.log('[DEBUG] getTasks: returning tasks', { 
    tasksCount: migratedTasks.length,
    taskIds: migratedTasks.map(t => ({ id: t.id, text: t.text }))
  });
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

/**
 * Получить заметки InBox
 */
export async function getInBoxNotes(): Promise<InBoxNote[]> {
  const notes = await getStorageData<InBoxNote[]>(STORAGE_KEYS.INBOX_NOTES);
  return notes || [];
}

/**
 * Сохранить заметки InBox
 */
export async function saveInBoxNotes(notes: InBoxNote[]): Promise<void> {
  await setStorageData(STORAGE_KEYS.INBOX_NOTES, notes);
}

/**
 * Создать резервную копию всех пользовательских данных
 */
export async function createBackup(): Promise<string | null> {
  try {
    const backup: any = {};
    const userDataKeys = [
      STORAGE_KEYS.TASKS,
      STORAGE_KEYS.HABITS,
      STORAGE_KEYS.FINANCE,
      STORAGE_KEYS.YEARLY_REPORTS,
      STORAGE_KEYS.TASK_CATEGORIES,
      STORAGE_KEYS.TASK_TAGS,
      STORAGE_KEYS.INBOX_NOTES
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
      tasks: false,
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

