/**
 * Утилиты для работы с localStorage
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



/**
 * Получить данные из хранилища
 */
export async function getStorageData<T>(key: string): Promise<T | null> {
  try {
    const data = localStorage.getItem(key);
    if (!data) return null;
    return JSON.parse(data) as T;
  } catch (error) {
    console.error(`Error loading data for key "${key}":`, error);
    return null;
  }
}


/**
 * Сохранить данные в хранилище
 */
export async function setStorageData<T>(key: string, data: T): Promise<void> {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving data for key "${key}":`, error);
    throw error;
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


