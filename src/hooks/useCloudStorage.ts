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
    console.log('[DEBUG] loadAllData CALLED - this will overwrite current state!', { 
      timestamp: Date.now(),
      stackTrace: new Error().stack 
    });
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
      // ВАЖНО: не перезаписываем существующие задачи при генерации экземпляров
      console.log('[DEBUG] loadAllData: loaded tasks', { 
        tasksCount: tasksData.length,
        taskIds: tasksData.map(t => ({ id: t.id, text: t.text }))
      });
      const newInstances = generateUpcomingInstances(tasksData, 30);
      
      // Объединяем задачи: сначала существующие, потом новые экземпляры
      // Это гарантирует, что существующие задачи (включая отредактированные) не перезаписываются
      const allTasks = [...tasksData, ...newInstances];
      
      console.log('[DEBUG] loadAllData: after generating instances', { 
        originalCount: tasksData.length, 
        newInstancesCount: newInstances.length, 
        totalCount: allTasks.length,
        taskIds: allTasks.map(t => ({ id: t.id, text: t.text }))
      });
      
      // Сохраняем новые экземпляры, если они есть
      // ВАЖНО: сохраняем только если есть новые экземпляры, чтобы не перезаписать отредактированные задачи
      if (newInstances.length > 0) {
        console.log('[DEBUG] Saving new recurrence instances', { count: newInstances.length });
        await saveTasks(allTasks);
      }
      
      console.log('[DEBUG] loadAllData: ABOUT TO OVERWRITE STATE with setTasks', { 
        tasksCount: allTasks.length,
        taskIds: allTasks.map(t => ({ id: t.id, text: t.text }))
      });
      setTasks(allTasks);
      console.log('[DEBUG] loadAllData: setTasks called - STATE OVERWRITTEN', { tasksCount: allTasks.length });
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
    console.log('[DEBUG] saveTasksToStorage ENTRY', { tasksCount: newTasks.length });
    fetch('http://127.0.0.1:7249/ingest/c9d9c789-1dcb-42c5-90ab-68af3eb2030c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'useCloudStorage.ts:141',message:'saveTasksToStorage entry',data:{tasksCount:newTasks.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
    // #endregion
    try {
      console.log('[DEBUG] Calling saveTasks', { tasksCount: newTasks.length });
      await saveTasks(newTasks);
      // #region agent log
      console.log('[DEBUG] saveTasks completed successfully');
      fetch('http://127.0.0.1:7249/ingest/c9d9c789-1dcb-42c5-90ab-68af3eb2030c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'useCloudStorage.ts:144',message:'saveTasksToStorage success',data:{tasksCount:newTasks.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
      // #endregion
      console.log('Tasks saved successfully');
    } catch (error) {
      // #region agent log
      const errorStr = error instanceof Error ? error.message : String(error);
      console.log('[DEBUG] saveTasksToStorage error caught', { error: errorStr, errorType: error?.constructor?.name });
      fetch('http://127.0.0.1:7249/ingest/c9d9c789-1dcb-42c5-90ab-68af3eb2030c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'useCloudStorage.ts:146',message:'saveTasksToStorage error',data:{error:String(error)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
      // #endregion
      console.error('Error saving tasks:', error);
      // В случае ошибки fallback на localStorage должен был сработать в setStorageData
      // Проверяем, сохранились ли данные в localStorage
      try {
        const saved = localStorage.getItem('tasks');
        if (saved) {
          console.log('[DEBUG] Data found in localStorage after error, fallback worked');
        } else {
          console.warn('[DEBUG] No data in localStorage after error, fallback may have failed');
        }
      } catch (e) {
        console.error('[DEBUG] Error checking localStorage:', e);
      }
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
    console.log('[DEBUG] updateTask ENTRY', { id, updatesKeys: Object.keys(updates), updates });
    fetch('http://127.0.0.1:7249/ingest/c9d9c789-1dcb-42c5-90ab-68af3eb2030c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'useCloudStorage.ts:173',message:'updateTask entry',data:{id,updatesKeys:Object.keys(updates),updates},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    try {
      // НЕ фильтруем undefined значения, так как они могут означать явное удаление полей
      // Контроль того, какие поля передавать, осуществляется в вызывающем коде через modifiedFields
      // undefined значения применяются для явного удаления полей (например, удаление категории, описания)
      
      console.log('Updating task:', id, 'with updates:', updates);
      
      setTasks(prevTasks => {
        const taskIndex = prevTasks.findIndex(task => task.id === id);
        // #region agent log
        console.log('[DEBUG] setTasks callback entry', { id, prevTasksCount: prevTasks.length, taskIndex, taskFound: taskIndex !== -1 });
        fetch('http://127.0.0.1:7249/ingest/c9d9c789-1dcb-42c5-90ab-68af3eb2030c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'useCloudStorage.ts:182',message:'setTasks callback entry',data:{id,prevTasksCount:prevTasks.length,taskIndex},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
        // #endregion
        if (taskIndex === -1) {
          console.warn('Task not found:', id);
          return prevTasks;
        }
        
        const originalTask = prevTasks[taskIndex];
        // Применяем обновления: undefined значения перезапишут существующие поля
        const updatedTask = { ...originalTask, ...updates };
        
        // #region agent log
        console.log('[DEBUG] Task updated in state', { id, originalTask: { id: originalTask.id, text: originalTask.text }, updatedTask: { id: updatedTask.id, text: updatedTask.text } });
        fetch('http://127.0.0.1:7249/ingest/c9d9c789-1dcb-42c5-90ab-68af3eb2030c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'useCloudStorage.ts:190',message:'Task updated in state',data:{id,originalTask:{id:originalTask.id,text:originalTask.text},updatedTask:{id:updatedTask.id,text:updatedTask.text}},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
        // #endregion
        
        console.log('Original task:', originalTask);
        console.log('Updated task:', updatedTask);
        
        const newTasks = prevTasks.map(task => 
          task.id === id ? updatedTask : task
        );
        
        // #region agent log
        console.log('[DEBUG] Before saveTasksToStorage', { newTasksCount: newTasks.length, updatedTaskId: id });
        fetch('http://127.0.0.1:7249/ingest/c9d9c789-1dcb-42c5-90ab-68af3eb2030c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'useCloudStorage.ts:199',message:'Before saveTasksToStorage',data:{newTasksCount:newTasks.length,updatedTaskId:id},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
        // #endregion
        
        // Асинхронно сохраняем в хранилище (без обновления состояния, оно уже обновлено)
        saveTasksToStorage(newTasks).then(() => {
          console.log('[DEBUG] saveTasksToStorage completed successfully');
          // #region agent log
          fetch('http://127.0.0.1:7249/ingest/c9d9c789-1dcb-42c5-90ab-68af3eb2030c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'useCloudStorage.ts:258',message:'saveTasksToStorage completed',data:{taskId:id,updatedText:updatedTask.text},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
          // #endregion
          // Проверяем, что данные действительно сохранились в localStorage
          // Проверяем сразу и с задержкой для надежности
          const verifyStorage = () => {
            try {
              const saved = localStorage.getItem('tasks');
              if (saved) {
                const parsed = JSON.parse(saved);
                const savedTask = parsed.find((t: Task) => t.id === id);
                if (savedTask) {
                  const textMatches = savedTask.text === updatedTask.text;
                  const allFieldsMatch = JSON.stringify(savedTask) === JSON.stringify(updatedTask);
                  console.log('[DEBUG] Task verified in localStorage after save', {
                    found: true,
                    textMatches,
                    allFieldsMatch,
                    savedText: savedTask.text,
                    expectedText: updatedTask.text,
                    taskId: id
                  });
                  // #region agent log
                  fetch('http://127.0.0.1:7249/ingest/c9d9c789-1dcb-42c5-90ab-68af3eb2030c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'useCloudStorage.ts:270',message:'Task verified in localStorage',data:{taskId:id,textMatches,allFieldsMatch,savedText:savedTask.text,expectedText:updatedTask.text},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
                  // #endregion
                  if (!textMatches || !allFieldsMatch) {
                    console.warn('[DEBUG] Task data mismatch in localStorage!', {
                      savedTask,
                      expectedTask: updatedTask
                    });
                  }
                } else {
                  console.warn('[DEBUG] Task NOT found in localStorage after save!', {
                    taskId: id,
                    totalTasksInStorage: parsed.length
                  });
                  // #region agent log
                  fetch('http://127.0.0.1:7249/ingest/c9d9c789-1dcb-42c5-90ab-68af3eb2030c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'useCloudStorage.ts:285',message:'Task NOT found in localStorage',data:{taskId:id,totalTasksInStorage:parsed.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
                  // #endregion
                }
              } else {
                console.error('[DEBUG] No tasks data in localStorage after save!');
                // #region agent log
                fetch('http://127.0.0.1:7249/ingest/c9d9c789-1dcb-42c5-90ab-68af3eb2030c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'useCloudStorage.ts:293',message:'No tasks data in localStorage',data:{taskId:id},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
                // #endregion
              }
            } catch (e) {
              console.error('[DEBUG] Error verifying task in localStorage:', e);
              // #region agent log
              fetch('http://127.0.0.1:7249/ingest/c9d9c789-1dcb-42c5-90ab-68af3eb2030c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'useCloudStorage.ts:298',message:'Error verifying task in localStorage',data:{error:String(e),taskId:id},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
              // #endregion
            }
          };
          // Проверяем сразу
          verifyStorage();
          // И с задержкой для надежности
          setTimeout(verifyStorage, 100);
        }).catch(err => {
          // #region agent log
          fetch('http://127.0.0.1:7249/ingest/c9d9c789-1dcb-42c5-90ab-68af3eb2030c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'useCloudStorage.ts:201',message:'saveTasksToStorage error',data:{error:String(err)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
          // #endregion
          console.error('Error saving task:', err);
          // В случае ошибки можно попробовать восстановить состояние
        });
        
        return newTasks;
      });
    } catch (error) {
      console.error('Error updating task:', error);
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

