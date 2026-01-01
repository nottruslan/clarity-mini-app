import { useState, useEffect, useCallback, useRef } from 'react';
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
  const tasksRef = useRef<Task[]>([]);
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
      
      // Каждый getStorageData() имеет свой таймаут 3 секунды
      // Если какой-то ключ зависает, он автоматически переключится на localStorage
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
      const migratedHabits = habitsData.map((habit: Habit) => {
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
      
      // #region agent log
      console.log('[DEBUG]', JSON.stringify({location:'useCloudStorage.ts:111',message:'loadAllData tasks loaded',data:{tasksDataCount:tasksData.length,newInstancesCount:newInstances.length,allTasksCount:allTasks.length,firstTaskId:allTasks[0]?.id,firstTaskText:allTasks[0]?.text},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'}));
      // #endregion
      
      // Сохраняем новые экземпляры, если они есть
      if (newInstances.length > 0) {
        await saveTasks(allTasks);
      }
      
      setTasks(allTasks);
      tasksRef.current = allTasks;
      
      // #region agent log
      console.log('[DEBUG]', JSON.stringify({location:'useCloudStorage.ts:121',message:'loadAllData setTasks called',data:{allTasksCount:allTasks.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'}));
      // #endregion
      
      setHabits(migratedHabits);
      setFinance(financeData);
      setOnboarding(onboardingData);
      setYearlyReports(reportsData);
      setTaskCategories(categoriesData);
      setTaskTags(tagsData);
      setInBoxNotes(notesData);
      
      // Сохраняем мигрированные привычки, если они изменились
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
  const saveTasksToStorage = useCallback(async (newTasks: Task[], editingTaskId?: string) => {
    // #region agent log
    // Ищем задачу, которая была недавно обновлена - проверяем все задачи на наличие изменений
    const allTaskIds = newTasks.map(t => t.id);
    const editingTask = editingTaskId ? newTasks.find(t => t.id === editingTaskId) : null;
    console.log('[DEBUG]', JSON.stringify({location:'useCloudStorage.ts:151',message:'saveTasksToStorage called',data:{tasksCount:newTasks.length,editingTaskId,editingTaskFound:!!editingTask,editingTaskText:editingTask?.text,allTaskIds:allTaskIds.slice(0, 10)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'}));
    // #endregion
    try {
      await saveTasks(newTasks);
      // #region agent log
      console.log('[DEBUG]', JSON.stringify({location:'useCloudStorage.ts:156',message:'saveTasksToStorage success',data:{tasksCount:newTasks.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'}));
      // #endregion
      
      // Проверяем, что данные действительно записались - читаем обратно
      try {
        const verifyTasks = await getTasks();
        // Если есть editingTaskId, проверяем конкретно эту задачу
        if (editingTaskId && editingTask) {
          const savedTask = verifyTasks.find(t => t.id === editingTaskId);
          // #region agent log
          console.log('[DEBUG]', JSON.stringify({location:'useCloudStorage.ts:163',message:'saveTasksToStorage verification for editingTask',data:{editingTaskId,editingTaskText:editingTask.text,savedTaskFound:!!savedTask,savedTaskText:savedTask?.text,textMatches:editingTask.text === savedTask?.text,allFieldsMatch:JSON.stringify(editingTask) === JSON.stringify(savedTask)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'}));
          // #endregion
        }
        // Проверяем все задачи, которые были в newTasks
        const savedTasksInfo = newTasks.slice(0, 3).map(originalTask => {
          const savedTask = verifyTasks.find(t => t.id === originalTask.id);
          return {
            id: originalTask.id,
            originalText: originalTask.text,
            savedText: savedTask?.text,
            found: !!savedTask,
            textMatches: originalTask.text === savedTask?.text
          };
        });
        // #region agent log
        console.log('[DEBUG]', JSON.stringify({location:'useCloudStorage.ts:174',message:'saveTasksToStorage verification read',data:{verifyTasksCount:verifyTasks.length,savedTasksInfo},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'}));
        // #endregion
      } catch (verifyError) {
        // #region agent log
        console.log('[DEBUG]', JSON.stringify({location:'useCloudStorage.ts:179',message:'saveTasksToStorage verification error',data:{error:verifyError instanceof Error?verifyError.message:String(verifyError)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'}));
        // #endregion
      }
    } catch (error) {
      console.error('Error saving tasks:', error);
      // #region agent log
      console.log('[DEBUG]', JSON.stringify({location:'useCloudStorage.ts:184',message:'saveTasksToStorage error',data:{error:error instanceof Error?error.message:String(error)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'}));
      // #endregion
      throw error;
    }
  }, []);

  const updateTasks = useCallback(async (newTasks: Task[]) => {
    setTasks(newTasks);
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
    fetch('http://127.0.0.1:7249/ingest/c9d9c789-1dcb-42c5-90ab-68af3eb2030c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'useCloudStorage.ts:222',message:'updateTask called',data:{id,updatesKeys:Object.keys(updates),updatesText:updates.text},timestamp:Date.now(),sessionId:'debug-session',runId:'run2',hypothesisId:'C'})}).catch(()=>{});
    // #endregion
    try {
      // Используем функциональное обновление, чтобы получить актуальное состояние
      let newTasks: Task[] = [];
      
      setTasks(prevTasks => {
        // #region agent log
        fetch('http://127.0.0.1:7249/ingest/c9d9c789-1dcb-42c5-90ab-68af3eb2030c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'useCloudStorage.ts:230',message:'updateTask setTasks callback',data:{id,prevTasksCount:prevTasks.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run2',hypothesisId:'C'})}).catch(()=>{});
        // #endregion
        const taskIndex = prevTasks.findIndex(task => task.id === id);
        
        if (taskIndex === -1) {
          console.warn('Task not found:', id);
          // #region agent log
          fetch('http://127.0.0.1:7249/ingest/c9d9c789-1dcb-42c5-90ab-68af3eb2030c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'useCloudStorage.ts:237',message:'updateTask task not found',data:{id},timestamp:Date.now(),sessionId:'debug-session',runId:'run2',hypothesisId:'A'})}).catch(()=>{});
          // #endregion
          return prevTasks;
        }
        
        // Создаем обновленную задачу
        const originalTask = prevTasks[taskIndex];
        const updatedTask = { ...originalTask, ...updates };
        
        // Создаем НОВЫЙ массив с обновленной задачей
        newTasks = [...prevTasks];
        newTasks[taskIndex] = updatedTask;
        
        // Обновляем ref
        tasksRef.current = newTasks;
        
        // #region agent log
        fetch('http://127.0.0.1:7249/ingest/c9d9c789-1dcb-42c5-90ab-68af3eb2030c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'useCloudStorage.ts:252',message:'updateTask newTasks created',data:{id,newTasksCount:newTasks.length,updatedTaskText:updatedTask.text,updatedTaskId:updatedTask.id},timestamp:Date.now(),sessionId:'debug-session',runId:'run2',hypothesisId:'C'})}).catch(()=>{});
        // #endregion
        
        return newTasks;
      });
      
      // Сохраняем в хранилище СИНХРОННО после обновления состояния
      // #region agent log
      fetch('http://127.0.0.1:7249/ingest/c9d9c789-1dcb-42c5-90ab-68af3eb2030c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'useCloudStorage.ts:260',message:'updateTask before saveTasksToStorage',data:{id,newTasksCount:newTasks.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run2',hypothesisId:'D'})}).catch(()=>{});
      // #endregion
      await saveTasksToStorage(newTasks, id);
      // #region agent log
      fetch('http://127.0.0.1:7249/ingest/c9d9c789-1dcb-42c5-90ab-68af3eb2030c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'useCloudStorage.ts:263',message:'updateTask after saveTasksToStorage',data:{id,tasksRefCount:tasksRef.current.length,tasksRefFirstId:tasksRef.current[0]?.id},timestamp:Date.now(),sessionId:'debug-session',runId:'run2',hypothesisId:'C'})}).catch(()=>{});
      // #endregion
    } catch (error) {
      console.error('Error updating task:', error);
      // #region agent log
      fetch('http://127.0.0.1:7249/ingest/c9d9c789-1dcb-42c5-90ab-68af3eb2030c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'useCloudStorage.ts:267',message:'updateTask error',data:{id,error:error instanceof Error?error.message:String(error)},timestamp:Date.now(),sessionId:'debug-session',runId:'run2',hypothesisId:'C'})}).catch(()=>{});
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
    setHabits(newHabits);
    await saveHabits(newHabits);
  }, []);

  const addHabit = useCallback(async (habit: Habit) => {
    try {
      setHabits(prevHabits => {
        const newHabits = [...prevHabits, habit];
        saveHabits(newHabits).catch(err => console.error('Error saving habit:', err));
        return newHabits;
      });
    } catch (error) {
      console.error('Error adding habit:', error);
      throw error;
    }
  }, []);

  const updateHabit = useCallback(async (id: string, updates: Partial<Habit>) => {
    try {
      setHabits(prevHabits => {
        const habitIndex = prevHabits.findIndex(habit => habit.id === id);
        if (habitIndex === -1) {
          console.warn('Habit not found:', id);
          return prevHabits;
        }
        
        const updatedHabit = { ...prevHabits[habitIndex], ...updates };
        const newHabits = prevHabits.map(habit => 
          habit.id === id ? updatedHabit : habit
        );
        
        saveHabits(newHabits).catch(err => console.error('Error saving habit:', err));
        return newHabits;
      });
    } catch (error) {
      console.error('Error updating habit:', error);
      throw error;
    }
  }, []);

  const deleteHabit = useCallback(async (id: string) => {
    try {
      setHabits(prevHabits => {
        const newHabits = prevHabits.filter(habit => habit.id !== id);
        saveHabits(newHabits).catch(err => console.error('Error saving habit:', err));
        return newHabits;
      });
    } catch (error) {
      console.error('Error deleting habit:', error);
      throw error;
    }
  }, []);

  // Finance
  const updateFinance = useCallback(async (newFinance: FinanceData) => {
    setFinance(newFinance);
    await saveFinanceData(newFinance);
  }, []);

  const addTransaction = useCallback(async (transaction: FinanceData['transactions'][0]) => {
    try {
      setFinance(prevFinance => {
        const newFinance = {
          ...prevFinance,
          transactions: [...prevFinance.transactions, transaction]
        };
        saveFinanceData(newFinance).catch(err => console.error('Error saving finance:', err));
        return newFinance;
      });
    } catch (error) {
      console.error('Error adding transaction:', error);
      throw error;
    }
  }, []);

  const updateTransaction = useCallback(async (id: string, updates: Partial<FinanceData['transactions'][0]>) => {
    try {
      setFinance(prevFinance => {
        const transactionIndex = prevFinance.transactions.findIndex(t => t.id === id);
        if (transactionIndex === -1) {
          console.warn('Transaction not found:', id);
          return prevFinance;
        }
        
        const updatedTransaction = { ...prevFinance.transactions[transactionIndex], ...updates };
        const newFinance = {
          ...prevFinance,
          transactions: prevFinance.transactions.map(t => 
            t.id === id ? updatedTransaction : t
          )
        };
        
        saveFinanceData(newFinance).catch(err => console.error('Error saving finance:', err));
        return newFinance;
      });
    } catch (error) {
      console.error('Error updating transaction:', error);
      throw error;
    }
  }, []);

  const deleteTransaction = useCallback(async (id: string) => {
    try {
      setFinance(prevFinance => {
        const newFinance = {
          ...prevFinance,
          transactions: prevFinance.transactions.filter(t => t.id !== id)
        };
        saveFinanceData(newFinance).catch(err => console.error('Error saving finance:', err));
        return newFinance;
      });
    } catch (error) {
      console.error('Error deleting transaction:', error);
      throw error;
    }
  }, []);

  const addCategory = useCallback(async (category: FinanceData['categories'][0]) => {
    try {
      setFinance(prevFinance => {
        const newFinance = {
          ...prevFinance,
          categories: [...prevFinance.categories, category]
        };
        saveFinanceData(newFinance).catch(err => console.error('Error saving finance:', err));
        return newFinance;
      });
    } catch (error) {
      console.error('Error adding category:', error);
      throw error;
    }
  }, []);

  const deleteCategory = useCallback(async (id: string) => {
    try {
      setFinance(prevFinance => {
        const newFinance = {
          ...prevFinance,
          categories: prevFinance.categories.filter(c => c.id !== id),
          transactions: prevFinance.transactions.map(t => 
            t.category === id ? { ...t, category: '' } : t
          )
        };
        saveFinanceData(newFinance).catch(err => console.error('Error saving finance:', err));
        return newFinance;
      });
    } catch (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
  }, []);

  const addBudget = useCallback(async (budget: FinanceData['budgets'][0]) => {
    try {
      setFinance(prevFinance => {
        const newFinance = {
          ...prevFinance,
          budgets: [...(prevFinance.budgets || []), budget]
        };
        saveFinanceData(newFinance).catch(err => console.error('Error saving finance:', err));
        return newFinance;
      });
    } catch (error) {
      console.error('Error adding budget:', error);
      throw error;
    }
  }, []);

  const updateBudget = useCallback(async (budget: FinanceData['budgets'][0]) => {
    try {
      setFinance(prevFinance => {
        const newFinance = {
          ...prevFinance,
          budgets: (prevFinance.budgets || []).map(b => 
            b.categoryId === budget.categoryId ? budget : b
          )
        };
        saveFinanceData(newFinance).catch(err => console.error('Error saving finance:', err));
        return newFinance;
      });
    } catch (error) {
      console.error('Error updating budget:', error);
      throw error;
    }
  }, []);

  const deleteBudget = useCallback(async (categoryId: string) => {
    try {
      setFinance(prevFinance => {
        const newFinance = {
          ...prevFinance,
          budgets: (prevFinance.budgets || []).filter(b => b.categoryId !== categoryId)
        };
        saveFinanceData(newFinance).catch(err => console.error('Error saving finance:', err));
        return newFinance;
      });
    } catch (error) {
      console.error('Error deleting budget:', error);
      throw error;
    }
  }, []);

  // Onboarding
  const markOnboardingShown = useCallback(async (section: keyof OnboardingFlags) => {
    try {
      setOnboarding(prev => {
        const newOnboarding = { ...prev, [section]: true };
        saveOnboardingFlags(newOnboarding).catch(err => console.error('Error saving onboarding:', err));
        return newOnboarding;
      });
    } catch (error) {
      console.error('Error marking onboarding as shown:', error);
      throw error;
    }
  }, []);

  // Yearly Reports
  const updateYearlyReports = useCallback(async (newReports: YearlyReport[]) => {
    setYearlyReports(newReports);
    await saveYearlyReports(newReports);
  }, []);

  const addYearlyReport = useCallback(async (report: YearlyReport) => {
    try {
      setYearlyReports(prevReports => {
        const newReports = [...prevReports, report];
        saveYearlyReports(newReports).catch(err => console.error('Error saving reports:', err));
        return newReports;
      });
    } catch (error) {
      console.error('Error adding yearly report:', error);
      throw error;
    }
  }, []);

  const updateYearlyReport = useCallback(async (id: string, updates: Partial<YearlyReport>) => {
    try {
      setYearlyReports(prevReports => {
        const reportIndex = prevReports.findIndex(r => r.id === id);
        if (reportIndex === -1) {
          console.warn('Yearly report not found:', id);
          return prevReports;
        }
        
        const updatedReport = { ...prevReports[reportIndex], ...updates };
        const newReports = prevReports.map(r => 
          r.id === id ? updatedReport : r
        );
        
        saveYearlyReports(newReports).catch(err => console.error('Error saving reports:', err));
        return newReports;
      });
    } catch (error) {
      console.error('Error updating yearly report:', error);
      throw error;
    }
  }, []);

  const deleteYearlyReport = useCallback(async (id: string) => {
    try {
      setYearlyReports(prevReports => {
        const newReports = prevReports.filter(r => r.id !== id);
        saveYearlyReports(newReports).catch(err => console.error('Error saving reports:', err));
        return newReports;
      });
    } catch (error) {
      console.error('Error deleting yearly report:', error);
      throw error;
    }
  }, []);

  // Task Categories
  const updateTaskCategories = useCallback(async (newCategories: TaskCategory[]) => {
    setTaskCategories(newCategories);
    await saveTaskCategories(newCategories);
  }, []);

  const addTaskCategory = useCallback(async (category: TaskCategory) => {
    try {
      setTaskCategories(prevCategories => {
        const newCategories = [...prevCategories, category];
        saveTaskCategories(newCategories).catch(err => console.error('Error saving categories:', err));
        return newCategories;
      });
    } catch (error) {
      console.error('Error adding task category:', error);
      throw error;
    }
  }, []);

  const updateTaskCategory = useCallback(async (id: string, updates: Partial<TaskCategory>) => {
    try {
      setTaskCategories(prevCategories => {
        const categoryIndex = prevCategories.findIndex(c => c.id === id);
        if (categoryIndex === -1) {
          console.warn('Task category not found:', id);
          return prevCategories;
        }
        
        const updatedCategory = { ...prevCategories[categoryIndex], ...updates };
        const newCategories = prevCategories.map(c => 
          c.id === id ? updatedCategory : c
        );
        
        saveTaskCategories(newCategories).catch(err => console.error('Error saving categories:', err));
        return newCategories;
      });
    } catch (error) {
      console.error('Error updating task category:', error);
      throw error;
    }
  }, []);

  const deleteTaskCategory = useCallback(async (id: string) => {
    try {
      setTaskCategories(prevCategories => {
        const newCategories = prevCategories.filter(c => c.id !== id);
        saveTaskCategories(newCategories).catch(err => console.error('Error saving categories:', err));
        return newCategories;
      });
    } catch (error) {
      console.error('Error deleting task category:', error);
      throw error;
    }
  }, []);

  // Task Tags
  const updateTaskTags = useCallback(async (newTags: TaskTag[]) => {
    setTaskTags(newTags);
    await saveTaskTags(newTags);
  }, []);

  const addTaskTag = useCallback(async (tag: TaskTag) => {
    try {
      setTaskTags(prevTags => {
        const newTags = [...prevTags, tag];
        saveTaskTags(newTags).catch(err => console.error('Error saving tags:', err));
        return newTags;
      });
    } catch (error) {
      console.error('Error adding task tag:', error);
      throw error;
    }
  }, []);

  const updateTaskTag = useCallback(async (id: string, updates: Partial<TaskTag>) => {
    try {
      setTaskTags(prevTags => {
        const tagIndex = prevTags.findIndex(t => t.id === id);
        if (tagIndex === -1) {
          console.warn('Task tag not found:', id);
          return prevTags;
        }
        
        const updatedTag = { ...prevTags[tagIndex], ...updates };
        const newTags = prevTags.map(t => 
          t.id === id ? updatedTag : t
        );
        
        saveTaskTags(newTags).catch(err => console.error('Error saving tags:', err));
        return newTags;
      });
    } catch (error) {
      console.error('Error updating task tag:', error);
      throw error;
    }
  }, []);

  const deleteTaskTag = useCallback(async (id: string) => {
    try {
      setTaskTags(prevTags => {
        const newTags = prevTags.filter(t => t.id !== id);
        saveTaskTags(newTags).catch(err => console.error('Error saving tags:', err));
        return newTags;
      });
    } catch (error) {
      console.error('Error deleting task tag:', error);
      throw error;
    }
  }, []);

  // InBox Notes
  const updateInBoxNotes = useCallback(async (newNotes: InBoxNote[]) => {
    setInBoxNotes(newNotes);
    await saveInBoxNotes(newNotes);
  }, []);

  const addInBoxNote = useCallback(async (note: InBoxNote) => {
    try {
      setInBoxNotes(prevNotes => {
        const newNotes = [...prevNotes, note];
        saveInBoxNotes(newNotes).catch(err => console.error('Error saving notes:', err));
        return newNotes;
      });
    } catch (error) {
      console.error('Error adding inbox note:', error);
      throw error;
    }
  }, []);

  const updateInBoxNote = useCallback(async (id: string, updates: Partial<InBoxNote>) => {
    try {
      setInBoxNotes(prevNotes => {
        const noteIndex = prevNotes.findIndex(n => n.id === id);
        if (noteIndex === -1) {
          console.warn('Inbox note not found:', id);
          return prevNotes;
        }
        
        const updatedNote = { ...prevNotes[noteIndex], ...updates };
        const newNotes = prevNotes.map(n => 
          n.id === id ? updatedNote : n
        );
        
        saveInBoxNotes(newNotes).catch(err => console.error('Error saving notes:', err));
        return newNotes;
      });
    } catch (error) {
      console.error('Error updating inbox note:', error);
      throw error;
    }
  }, []);

  const deleteInBoxNote = useCallback(async (id: string) => {
    try {
      setInBoxNotes(prevNotes => {
        const newNotes = prevNotes.filter(n => n.id !== id);
        saveInBoxNotes(newNotes).catch(err => console.error('Error saving notes:', err));
        return newNotes;
      });
    } catch (error) {
      console.error('Error deleting inbox note:', error);
      throw error;
    }
  }, [updateInBoxNotes]);

  // Возвращаем объект напрямую - React увидит изменения в tasks, так как это новое состояние
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
