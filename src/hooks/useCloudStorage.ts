import { useState, useEffect, useCallback } from 'react';
import {
  getTasks,
  saveTasks,
  getHabits,
  saveHabits,
  getFinanceData,
  saveFinanceData,
  getOnboardingFlags,
  saveOnboardingFlags,
  getYearlyReports,
  saveYearlyReports,
  getTaskCategories,
  saveTaskCategories,
  getTaskTags,
  saveTaskTags,
  getInBoxNotes,
  saveInBoxNotes,
  type Task,
  type Habit,
  type FinanceData,
  type OnboardingFlags,
  type YearlyReport,
  type TaskCategory,
  type TaskTag,
  type InBoxNote
} from '../utils/storage';
import { generateUpcomingInstances } from '../utils/taskRecurrence';

export function useCloudStorage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [finance, setFinance] = useState<FinanceData>({ transactions: [], categories: [], budgets: [] });
  const [onboarding, setOnboarding] = useState<OnboardingFlags>({
    tasks: false,
    habits: false,
    finance: false,
    languages: false,
    'yearly-report': false
  });
  const [yearlyReports, setYearlyReports] = useState<YearlyReport[]>([]);
  const [taskCategories, setTaskCategories] = useState<TaskCategory[]>([]);
  const [taskTags, setTaskTags] = useState<TaskTag[]>([]);
  const [inBoxNotes, setInBoxNotes] = useState<InBoxNote[]>([]);
  const [loading, setLoading] = useState(true);

  // Загрузка данных при монтировании
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      setLoading(true);
      const [tasksData, habitsData, financeData, onboardingData, reportsData, categoriesData, tagsData, notesData] = await Promise.all([
        getTasks().catch(err => {
          console.error('Error loading tasks:', err);
          return [];
        }),
        getHabits().catch(err => {
          console.error('Error loading habits:', err);
          return [];
        }),
        getFinanceData().catch(err => {
          console.error('Error loading finance:', err);
          return { transactions: [], categories: [], budgets: [] };
        }),
        getOnboardingFlags().catch(err => {
          console.error('Error loading onboarding:', err);
          return { tasks: false, habits: false, finance: false, languages: false, 'yearly-report': false };
        }),
        getYearlyReports().catch(err => {
          console.error('Error loading reports:', err);
          return [];
        }),
        getTaskCategories().catch(err => {
          console.error('Error loading task categories:', err);
          return [];
        }),
        getTaskTags().catch(err => {
          console.error('Error loading task tags:', err);
          return [];
        }),
        getInBoxNotes().catch(err => {
          console.error('Error loading inbox notes:', err);
          return [];
        })
      ]);
      
      // Миграция привычек при загрузке
      const migratedHabits = habitsData.map(habit => {
        if (habit.history && Object.keys(habit.history).length > 0) {
          const firstValue = Object.values(habit.history)[0];
          if (typeof firstValue === 'boolean') {
            const newHistory: Habit['history'] = {};
            Object.keys(habit.history).forEach(date => {
              const oldValue = habit.history[date];
              if (typeof oldValue === 'boolean') {
                newHistory[date] = { completed: oldValue };
              } else {
                newHistory[date] = oldValue;
              }
            });
            return { ...habit, history: newHistory };
          }
        }
        return habit;
      });
      
      // Генерируем экземпляры повторяющихся задач
      const newInstances = generateUpcomingInstances(tasksData, 30);
      const allTasks = [...tasksData, ...newInstances];
      
      // Сохраняем новые экземпляры, если они есть
      if (newInstances.length > 0) {
        await saveTasks(allTasks);
      }
      
      setTasks(allTasks);
      setHabits(migratedHabits);
      setFinance(financeData);
      setOnboarding(onboardingData);
      setYearlyReports(reportsData);
      setTaskCategories(categoriesData);
      setTaskTags(tagsData);
      setInBoxNotes(notesData);
      
      // Сохраняем мигрированные данные, если была миграция
      if (migratedHabits.length > 0 && JSON.stringify(migratedHabits) !== JSON.stringify(habitsData)) {
        await saveHabits(migratedHabits);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Tasks
  // Функция только для сохранения в хранилище (без обновления состояния)
  const saveTasksToStorage = useCallback(async (newTasks: Task[]) => {
    // #region agent log
    console.log('[DEBUG]', JSON.stringify({location:'useCloudStorage.ts:141',message:'saveTasksToStorage called',data:{tasksCount:newTasks.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'}));
    // #endregion
    try {
      await saveTasks(newTasks);
      // #region agent log
      console.log('[DEBUG]', JSON.stringify({location:'useCloudStorage.ts:144',message:'saveTasksToStorage success',data:{tasksCount:newTasks.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'}));
      // #endregion
    } catch (error) {
      console.error('Error saving tasks:', error);
      // #region agent log
      console.log('[DEBUG]', JSON.stringify({location:'useCloudStorage.ts:146',message:'saveTasksToStorage error',data:{error:error instanceof Error?error.message:String(error)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'}));
      // #endregion
      throw error;
    }
  }, []);

  // Функция для обновления состояния и сохранения (используется напрямую, когда нужно)
  const updateTasks = useCallback(async (newTasks: Task[]) => {
    // Сначала обновляем состояние, чтобы UI сразу отобразил изменения
    setTasks(newTasks);
    // Затем пытаемся сохранить в хранилище
    await saveTasksToStorage(newTasks);
  }, [saveTasksToStorage]);

  const addTask = useCallback(async (task: Task) => {
    try {
      setTasks(prevTasks => {
        const newTasks = [...prevTasks, task];
        // Асинхронно сохраняем в хранилище (без обновления состояния, оно уже обновлено)
        saveTasksToStorage(newTasks).catch(err => console.error('Error saving task:', err));
        return newTasks;
      });
    } catch (error) {
      console.error('Error adding task:', error);
      throw error;
    }
  }, [saveTasksToStorage]);

  const updateTask = useCallback(async (id: string, updates: Partial<Task>) => {
    // #region agent log
    console.log('[DEBUG]', JSON.stringify({location:'useCloudStorage.ts:172',message:'updateTask called',data:{id,updatesKeys:Object.keys(updates),updates},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'}));
    // #endregion
    try {
      setTasks(prevTasks => {
        const taskIndex = prevTasks.findIndex(task => task.id === id);
        // #region agent log
        console.log('[DEBUG]', JSON.stringify({location:'useCloudStorage.ts:175',message:'updateTask taskIndex found',data:{id,taskIndex,totalTasks:prevTasks.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'}));
        // #endregion
        if (taskIndex === -1) {
          console.warn('Task not found:', id);
          // #region agent log
          console.log('[DEBUG]', JSON.stringify({location:'useCloudStorage.ts:177',message:'updateTask task not found',data:{id},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'}));
          // #endregion
          return prevTasks;
        }
        
        const originalTask = prevTasks[taskIndex];
        const updatedTask = { ...originalTask, ...updates };
        // #region agent log
        console.log('[DEBUG]', JSON.stringify({location:'useCloudStorage.ts:182',message:'updateTask merge complete',data:{id,originalTask:{id:originalTask.id,text:originalTask.text,dueDate:originalTask.dueDate,plannedDate:originalTask.plannedDate},updatedTask:{id:updatedTask.id,text:updatedTask.text,dueDate:updatedTask.dueDate,plannedDate:updatedTask.plannedDate}},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'}));
        // #endregion
        
        const newTasks = prevTasks.map(task => 
          task.id === id ? updatedTask : task
        );
        
        // Асинхронно сохраняем в хранилище
        // #region agent log
        console.log('[DEBUG]', JSON.stringify({location:'useCloudStorage.ts:189',message:'updateTask calling saveTasksToStorage',data:{id,newTasksCount:newTasks.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'}));
        // #endregion
        saveTasksToStorage(newTasks).catch(err => {
          console.error('Error saving task:', err);
          // #region agent log
          console.log('[DEBUG]', JSON.stringify({location:'useCloudStorage.ts:191',message:'updateTask saveTasksToStorage error',data:{id,error:err instanceof Error?err.message:String(err)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'}));
          // #endregion
        });
        
        return newTasks;
      });
    } catch (error) {
      console.error('Error updating task:', error);
      // #region agent log
      console.log('[DEBUG]', JSON.stringify({location:'useCloudStorage.ts:196',message:'updateTask catch error',data:{id,error:error instanceof Error?error.message:String(error)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'}));
      // #endregion
      throw error;
    }
  }, [saveTasksToStorage]);

  const deleteTask = useCallback(async (id: string) => {
    try {
      setTasks(prevTasks => {
        const newTasks = prevTasks.filter(task => task.id !== id);
        // Асинхронно сохраняем в хранилище (без обновления состояния, оно уже обновлено)
        saveTasksToStorage(newTasks).catch(err => console.error('Error saving task:', err));
        return newTasks;
      });
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  }, [saveTasksToStorage]);

  // Habits
  const updateHabits = useCallback(async (newHabits: Habit[]) => {
    // Миграция старой структуры history (boolean) в новую (объект)
    const migratedHabits = newHabits.map(habit => {
      if (habit.history && Object.keys(habit.history).length > 0) {
        const firstValue = Object.values(habit.history)[0];
        if (typeof firstValue === 'boolean') {
          const newHistory: Habit['history'] = {};
          Object.keys(habit.history).forEach(date => {
            const oldValue = habit.history[date];
            if (typeof oldValue === 'boolean') {
              newHistory[date] = { completed: oldValue };
            } else {
              newHistory[date] = oldValue;
            }
          });
          return { ...habit, history: newHistory };
        }
      }
      // Убеждаемся, что history всегда объект с правильной структурой
      if (!habit.history) {
        return { ...habit, history: {} };
      }
      return habit;
    });
    
    setHabits(migratedHabits);
    await saveHabits(migratedHabits);
  }, []);

  const addHabit = useCallback(async (habit: Habit) => {
    const newHabits = [...habits, habit];
    await updateHabits(newHabits);
  }, [habits, updateHabits]);

  const updateHabit = useCallback(async (id: string, updates: Partial<Habit>) => {
    const newHabits = habits.map(habit => 
      habit.id === id ? { ...habit, ...updates } : habit
    );
    await updateHabits(newHabits);
  }, [habits, updateHabits]);

  const deleteHabit = useCallback(async (id: string) => {
    const newHabits = habits.filter(habit => habit.id !== id);
    await updateHabits(newHabits);
  }, [habits, updateHabits]);

  // Finance
  const updateFinance = useCallback(async (newFinance: FinanceData) => {
    setFinance(newFinance);
    await saveFinanceData(newFinance);
  }, []);

  const addTransaction = useCallback(async (transaction: FinanceData['transactions'][0]) => {
    const newFinance: FinanceData = {
      ...finance,
      transactions: [...finance.transactions, transaction]
    };
    await updateFinance(newFinance);
  }, [finance, updateFinance]);

  const updateTransaction = useCallback(async (id: string, updates: Partial<FinanceData['transactions'][0]>) => {
    const newFinance: FinanceData = {
      ...finance,
      transactions: finance.transactions.map(t => 
        t.id === id ? { ...t, ...updates } : t
      )
    };
    await updateFinance(newFinance);
  }, [finance, updateFinance]);

  const deleteTransaction = useCallback(async (id: string) => {
    const newFinance: FinanceData = {
      ...finance,
      transactions: finance.transactions.filter(t => t.id !== id)
    };
    await updateFinance(newFinance);
  }, [finance, updateFinance]);

  const addCategory = useCallback(async (category: FinanceData['categories'][0]) => {
    const newFinance: FinanceData = {
      ...finance,
      categories: [...finance.categories, category]
    };
    await updateFinance(newFinance);
  }, [finance, updateFinance]);

  const deleteCategory = useCallback(async (categoryId: string) => {
    // Проверяем, используется ли категория в транзакциях
    const category = finance.categories.find(c => c.id === categoryId);
    if (!category) return;

    const isUsed = finance.transactions.some(t => t.category === category.name);
    if (isUsed) {
      // Категория используется, не удаляем
      return false;
    }

    const newFinance: FinanceData = {
      ...finance,
      categories: finance.categories.filter(c => c.id !== categoryId)
    };
    await updateFinance(newFinance);
    return true;
  }, [finance, updateFinance]);

  const addBudget = useCallback(async (budget: FinanceData['budgets'][0]) => {
    const newFinance: FinanceData = {
      ...finance,
      budgets: [...(finance.budgets || []), budget]
    };
    await updateFinance(newFinance);
  }, [finance, updateFinance]);

  const updateBudget = useCallback(async (budget: FinanceData['budgets'][0]) => {
    const newFinance: FinanceData = {
      ...finance,
      budgets: (finance.budgets || []).map(b => 
        b.categoryId === budget.categoryId ? budget : b
      )
    };
    await updateFinance(newFinance);
  }, [finance, updateFinance]);

  const deleteBudget = useCallback(async (categoryId: string) => {
    const newFinance: FinanceData = {
      ...finance,
      budgets: (finance.budgets || []).filter(b => b.categoryId !== categoryId)
    };
    await updateFinance(newFinance);
  }, [finance, updateFinance]);

  // Onboarding
  const markOnboardingShown = useCallback(async (section: keyof OnboardingFlags) => {
    const newOnboarding = { ...onboarding, [section]: true };
    setOnboarding(newOnboarding);
    await saveOnboardingFlags(newOnboarding);
  }, [onboarding]);

  // Yearly Reports
  const updateYearlyReports = useCallback(async (newReports: YearlyReport[]) => {
    setYearlyReports(newReports);
    await saveYearlyReports(newReports);
  }, []);

  const addYearlyReport = useCallback(async (report: YearlyReport) => {
    const newReports = [...yearlyReports, report];
    await updateYearlyReports(newReports);
  }, [yearlyReports, updateYearlyReports]);

  const updateYearlyReport = useCallback(async (id: string, updates: Partial<YearlyReport>) => {
    const newReports = yearlyReports.map(report => 
      report.id === id ? { ...report, ...updates, updatedAt: Date.now() } : report
    );
    await updateYearlyReports(newReports);
  }, [yearlyReports, updateYearlyReports]);

  const deleteYearlyReport = useCallback(async (id: string) => {
    const newReports = yearlyReports.filter(report => report.id !== id);
    await updateYearlyReports(newReports);
  }, [yearlyReports, updateYearlyReports]);

  // Task Categories
  const updateTaskCategories = useCallback(async (newCategories: TaskCategory[]) => {
    setTaskCategories(newCategories);
    await saveTaskCategories(newCategories);
  }, []);

  const addTaskCategory = useCallback(async (category: TaskCategory) => {
    const newCategories = [...taskCategories, category];
    await updateTaskCategories(newCategories);
  }, [taskCategories, updateTaskCategories]);

  const updateTaskCategory = useCallback(async (id: string, updates: Partial<TaskCategory>) => {
    const newCategories = taskCategories.map(cat => 
      cat.id === id ? { ...cat, ...updates } : cat
    );
    await updateTaskCategories(newCategories);
  }, [taskCategories, updateTaskCategories]);

  const deleteTaskCategory = useCallback(async (id: string) => {
    const newCategories = taskCategories.filter(cat => cat.id !== id);
    await updateTaskCategories(newCategories);
  }, [taskCategories, updateTaskCategories]);

  // Task Tags
  const updateTaskTags = useCallback(async (newTags: TaskTag[]) => {
    setTaskTags(newTags);
    await saveTaskTags(newTags);
  }, []);

  const addTaskTag = useCallback(async (tag: TaskTag) => {
    const newTags = [...taskTags, tag];
    await updateTaskTags(newTags);
  }, [taskTags, updateTaskTags]);

  const updateTaskTag = useCallback(async (id: string, updates: Partial<TaskTag>) => {
    const newTags = taskTags.map(tag => 
      tag.id === id ? { ...tag, ...updates } : tag
    );
    await updateTaskTags(newTags);
  }, [taskTags, updateTaskTags]);

  const deleteTaskTag = useCallback(async (id: string) => {
    const newTags = taskTags.filter(tag => tag.id !== id);
    await updateTaskTags(newTags);
  }, [taskTags, updateTaskTags]);

  // InBox Notes
  const updateInBoxNotes = useCallback(async (newNotes: InBoxNote[]) => {
    setInBoxNotes(newNotes);
    await saveInBoxNotes(newNotes);
  }, []);

  const addInBoxNote = useCallback(async (note: InBoxNote) => {
    const newNotes = [...inBoxNotes, note];
    await updateInBoxNotes(newNotes);
  }, [inBoxNotes, updateInBoxNotes]);

  const updateInBoxNote = useCallback(async (id: string, updates: Partial<InBoxNote>) => {
    const newNotes = inBoxNotes.map(note => 
      note.id === id ? { ...note, ...updates } : note
    );
    await updateInBoxNotes(newNotes);
  }, [inBoxNotes, updateInBoxNotes]);

  const deleteInBoxNote = useCallback(async (id: string) => {
    const newNotes = inBoxNotes.filter(note => note.id !== id);
    await updateInBoxNotes(newNotes);
  }, [inBoxNotes, updateInBoxNotes]);

  return {
    // Data
    tasks,
    habits,
    finance,
    onboarding,
    yearlyReports,
    taskCategories,
    taskTags,
    inBoxNotes,
    loading,
    
    // Tasks
    updateTasks,
    addTask,
    updateTask,
    deleteTask,
    
    // Habits
    updateHabits,
    addHabit,
    updateHabit,
    deleteHabit,
    
    // Finance
    updateFinance,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    addCategory,
    deleteCategory,
    addBudget,
    updateBudget,
    deleteBudget,
    
    // Onboarding
    markOnboardingShown,
    
    // Yearly Reports
    updateYearlyReports,
    addYearlyReport,
    updateYearlyReport,
    deleteYearlyReport,
    
    // Task Categories
    updateTaskCategories,
    addTaskCategory,
    updateTaskCategory,
    deleteTaskCategory,
    
    // Task Tags
    updateTaskTags,
    addTaskTag,
    updateTaskTag,
    deleteTaskTag,
    
    // InBox Notes
    updateInBoxNotes,
    addInBoxNote,
    updateInBoxNote,
    deleteInBoxNote,
    
    // Reload
    reload: loadAllData
  };
}

