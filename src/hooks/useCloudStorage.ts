import { useState, useEffect, useCallback, useRef } from 'react';
import {
  getHabits,
  saveHabits,
  getFinanceData,
  saveFinanceData,
  getOnboardingFlags,
  saveOnboardingFlags,
  getYearlyReports,
  saveYearlyReports,
  getTasksData,
  saveTasksData,
  getCoveyMatrixData,
  saveCoveyMatrixData,
  getBooksData,
  saveBooksData,
  calculateQuadrant,
  getQuadrantValues,
  initializePendingSavesProcessor,
  type Habit,
  type FinanceData,
  type Category,
  type OnboardingFlags,
  type YearlyReport,
  type Task,
  type InBoxItem,
  type TasksData,
  type CoveyTask,
  type CoveyMatrixData,
  type Book,
  type Note,
  type Quote,
  type Reflection,
  type BookGoal,
  type BooksData
} from '../utils/storage';

export function useCloudStorage() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [finance, setFinance] = useState<FinanceData>({ transactions: [], categories: [], budgets: [] });
  const [onboarding, setOnboarding] = useState<OnboardingFlags>({
    habits: false,
    finance: false,
    languages: false,
    'yearly-report': false
  });
  const [yearlyReports, setYearlyReports] = useState<YearlyReport[]>([]);
  const [tasksData, setTasksData] = useState<TasksData>({ inbox: [], tasks: [], completedTasks: [] });
  const [coveyMatrixData, setCoveyMatrixData] = useState<CoveyMatrixData>({ tasks: [], completedTasks: [] });
  const [books, setBooks] = useState<BooksData>({ books: [], goals: [] });
  const [loading, setLoading] = useState(true);
  const isLoadingRef = useRef(false);
  const hasLoadedRef = useRef(false); // Флаг для отслеживания, были ли данные уже загружены

  // Загрузка данных при монтировании
  useEffect(() => {
    loadAllData();
    // Инициализируем обработку очереди отложенных сохранений
    initializePendingSavesProcessor();
  }, []);

  const loadAllData = async () => {
    // Защита от множественных одновременных вызовов
    if (isLoadingRef.current) {
      console.log('[DIAG] loadAllData - already loading, skipping duplicate call');
      return;
    }
    
    // Если данные уже загружены, не загружаем снова
    // (защита от повторных вызовов при перемонтировании)
    if (hasLoadedRef.current) {
      console.log('[DIAG] loadAllData - data already loaded, skipping');
      return;
    }
    
    isLoadingRef.current = true;
    try {
      setLoading(true);
      const loadStartTime = Date.now();
      
      // Загружаем данные из localStorage (быстро и надежно)
      // Cloud Storage синхронизируется в фоне автоматически
      const [habitsData, financeData, onboardingData, reportsData, tasksData, coveyMatrixData, booksData] = await Promise.all([
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
          return { habits: false, finance: false, languages: false, 'yearly-report': false };
        }),
        getYearlyReports().catch(err => {
          console.error('Error loading reports:', err);
          return [];
        }),
        getTasksData().catch(err => {
          console.error('Error loading tasks:', err);
          return { inbox: [], tasks: [], completedTasks: [] };
        }),
        getCoveyMatrixData().catch(err => {
          console.error('Error loading covey matrix:', err);
          return { tasks: [], completedTasks: [] };
        }),
        getBooksData().catch(err => {
          console.error('Error loading books:', err);
          return { books: [], goals: [] };
        })
      ]);
      
      const loadTime = Date.now() - loadStartTime;
      console.log(`✅ Данные загружены за ${loadTime}ms`);
      
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
      
      setHabits(migratedHabits);
      console.log('[Finance] loadAllData - Loading finance data:', {
        transactionsCount: financeData.transactions?.length || 0,
        categoriesCount: financeData.categories?.length || 0,
        budgetsCount: financeData.budgets?.length || 0
      });
      console.log('[setFinance] Calling setFinance from loadAllData with:', {
        transactionsCount: financeData.transactions?.length || 0,
        transactions: financeData.transactions
      });
      setFinance(financeData);
      console.log('[Finance] loadAllData - Finance state updated');
      setOnboarding(onboardingData);
      setYearlyReports(reportsData);
      setTasksData(tasksData);
      setCoveyMatrixData(coveyMatrixData);
      setBooks(booksData);
      
      // Сохраняем мигрированные привычки, если они изменились
      if (migratedHabits.length > 0 && JSON.stringify(migratedHabits) !== JSON.stringify(habitsData)) {
        await saveHabits(migratedHabits);
      }
      
      // Отмечаем, что данные загружены
      hasLoadedRef.current = true;
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
      isLoadingRef.current = false;
    }
  };

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
      console.log('[Finance] addTransaction - START, transaction:', {
        ...transaction,
        dateISO: new Date(transaction.date).toISOString(),
        dateLocal: new Date(transaction.date).toString(),
        timestamp: transaction.date
      });
      
      setFinance(prevFinance => {
        console.log('[Finance] addTransaction - Inside setFinance callback, prevFinance:', {
          transactionsCount: prevFinance.transactions?.length || 0,
          existingTransactions: prevFinance.transactions?.map(t => ({
            id: t.id,
            date: new Date(t.date).toISOString(),
            timestamp: t.date
          })) || []
        });
        
        // Убеждаемся, что transactions всегда является массивом
        const prevTransactions = prevFinance.transactions || [];
        console.log('[Finance] addTransaction - Prev transactions:', prevTransactions.length);
        
        const newFinance = {
          ...prevFinance,
          transactions: [...prevTransactions, transaction]
        };
        console.log('[Finance] addTransaction - New finance object:', {
          transactionsCount: newFinance.transactions.length,
          lastTransactionId: newFinance.transactions[newFinance.transactions.length - 1]?.id,
          lastTransactionDate: newFinance.transactions[newFinance.transactions.length - 1] 
            ? new Date(newFinance.transactions[newFinance.transactions.length - 1].date).toISOString()
            : null,
          allTransactions: newFinance.transactions.map(t => ({
            id: t.id,
            date: new Date(t.date).toISOString(),
            timestamp: t.date
          }))
        });
        
        // Сохраняем в хранилище асинхронно
        console.log('[Finance] addTransaction - Calling saveFinanceData...');
        saveFinanceData(newFinance)
          .then(() => {
            console.log('[Finance] addTransaction - Transaction saved successfully to storage');
          })
          .catch(err => {
            console.error('[Finance] addTransaction - Error saving finance:', err);
          });
        
        console.log('[Finance] addTransaction - Returning newFinance from setFinance callback:', {
          transactionsCount: newFinance.transactions.length,
          transactions: newFinance.transactions
        });
        return newFinance;
      });
      
      // После вызова setFinance проверяем, что данные сохранились
      // Даем небольшую задержку для завершения асинхронной операции сохранения
      setTimeout(async () => {
        try {
          const savedData = await getFinanceData();
          console.log('[Finance] addTransaction - Verification after save:', {
            savedTransactionsCount: savedData.transactions?.length || 0,
            transactionIds: savedData.transactions?.map(t => t.id) || [],
            lastTransactionId: transaction.id,
            savedTransactions: savedData.transactions?.map(t => ({
              id: t.id,
              date: new Date(t.date).toISOString(),
              dateLocal: new Date(t.date).toString(),
              timestamp: t.date
            })) || []
          });
          if (savedData.transactions && savedData.transactions.length > 0) {
            const found = savedData.transactions.some(t => t.id === transaction.id);
            if (!found) {
              console.error('[Finance] addTransaction - WARNING: Transaction not found in saved data!', {
                savedIds: savedData.transactions.map(t => t.id),
                expectedId: transaction.id,
                savedTransactions: savedData.transactions.map(t => ({
                  id: t.id,
                  date: new Date(t.date).toISOString(),
                  timestamp: t.date
                }))
              });
            } else {
              console.log('[Finance] addTransaction - Transaction verified in saved data:', {
                transactionId: transaction.id,
                transactionDate: new Date(transaction.date).toISOString()
              });
            }
          }
        } catch (error) {
          console.error('[Finance] addTransaction - Error verifying saved data:', error);
        }
      }, 100);
      
      console.log('[Finance] addTransaction - setFinance called, state update scheduled');
    } catch (error) {
      console.error('[Finance] addTransaction - Exception:', error);
      throw error;
    }
  }, []);

  const updateTransaction = useCallback(async (id: string, updates: Partial<FinanceData['transactions'][0]>) => {
    try {
      console.log('[Finance] updateTransaction - START, id:', id, 'updates:', updates);
      setFinance(prevFinance => {
        console.log('[setFinance] Inside setFinance callback in updateTransaction, prevFinance:', {
          transactionsCount: prevFinance.transactions?.length || 0
        });
        const transactionIndex = prevFinance.transactions.findIndex(t => t.id === id);
        if (transactionIndex === -1) {
          console.warn('[Finance] updateTransaction - Transaction not found:', id);
          return prevFinance;
        }
        
        const updatedTransaction = { ...prevFinance.transactions[transactionIndex], ...updates };
        const newFinance = {
          ...prevFinance,
          transactions: prevFinance.transactions.map(t => 
            t.id === id ? updatedTransaction : t
          )
        };
        
        console.log('[Finance] updateTransaction - Saving updated finance data');
        saveFinanceData(newFinance).catch(err => console.error('[Finance] updateTransaction - Error saving:', err));
        return newFinance;
      });
    } catch (error) {
      console.error('[Finance] updateTransaction - Exception:', error);
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
      console.log('[setFinance] Calling setFinance from addCategory');
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
        const categoryToDelete = prevFinance.categories.find(c => c.id === id);
        if (!categoryToDelete) {
          return prevFinance;
        }

        const newFinance = {
          ...prevFinance,
          categories: prevFinance.categories.filter(c => c.id !== id),
          transactions: prevFinance.transactions.filter(t => 
            // Удаляем транзакции с этой категорией
            t.category !== categoryToDelete.name
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

  const updateCategory = useCallback(async (id: string, updates: Partial<Category>) => {
    try {
      console.log('[setFinance] Calling setFinance from updateCategory');
      setFinance(prevFinance => {
        // Находим категорию, которую обновляем, чтобы получить старое название
        const categoryToUpdate = prevFinance.categories.find(c => c.id === id);
        if (!categoryToUpdate) {
          return prevFinance;
        }

        const oldName = categoryToUpdate.name;
        const newName = updates.name;

        // Если изменяется название категории
        let updatedTransactions = prevFinance.transactions;
        if (newName && newName !== oldName) {
          // Обновляем все транзакции, которые используют старое название
          updatedTransactions = prevFinance.transactions.map(transaction => 
            transaction.category === oldName 
              ? { ...transaction, category: newName }
              : transaction
          );
        }

        const newFinance = {
          ...prevFinance,
          categories: prevFinance.categories.map(c => 
            c.id === id ? { ...c, ...updates } : c
          ),
          transactions: updatedTransactions
        };
        saveFinanceData(newFinance).catch(err => console.error('Error saving finance:', err));
        return newFinance;
      });
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    }
  }, []);

  const moveCategoryUp = useCallback(async (id: string) => {
    try {
      setFinance(prevFinance => {
        const category = prevFinance.categories.find(c => c.id === id);
        if (!category) {
          return prevFinance;
        }

        // Фильтруем категории того же типа и сортируем по order
        const sameTypeCategories = prevFinance.categories
          .filter(c => c.type === category.type)
          .sort((a, b) => (a.order ?? 999) - (b.order ?? 999));

        const categoryIndex = sameTypeCategories.findIndex(c => c.id === id);
        if (categoryIndex === 0) {
          return prevFinance;
        }

        // Меняем местами order
        const prevCategory = sameTypeCategories[categoryIndex - 1];
        const categoryOrder = category.order ?? categoryIndex;
        const prevCategoryOrder = prevCategory.order ?? categoryIndex - 1;

        const newCategories = prevFinance.categories.map(c => {
          if (c.id === id) {
            return { ...c, order: prevCategoryOrder };
          }
          if (c.id === prevCategory.id) {
            return { ...c, order: categoryOrder };
          }
          return c;
        });

        const newFinance = {
          ...prevFinance,
          categories: newCategories
        };
        saveFinanceData(newFinance).catch(err => console.error('Error saving finance:', err));
        return newFinance;
      });
    } catch (error) {
      console.error('Error moving category up:', error);
      throw error;
    }
  }, []);

  const moveCategoryDown = useCallback(async (id: string) => {
    try {
      setFinance(prevFinance => {
        const category = prevFinance.categories.find(c => c.id === id);
        if (!category) {
          return prevFinance;
        }

        // Фильтруем категории того же типа и сортируем по order
        const sameTypeCategories = prevFinance.categories
          .filter(c => c.type === category.type)
          .sort((a, b) => (a.order ?? 999) - (b.order ?? 999));

        const categoryIndex = sameTypeCategories.findIndex(c => c.id === id);
        if (categoryIndex === sameTypeCategories.length - 1) {
          return prevFinance;
        }

        // Меняем местами order
        const nextCategory = sameTypeCategories[categoryIndex + 1];
        const categoryOrder = category.order ?? categoryIndex;
        const nextCategoryOrder = nextCategory.order ?? categoryIndex + 1;

        const newCategories = prevFinance.categories.map(c => {
          if (c.id === id) {
            return { ...c, order: nextCategoryOrder };
          }
          if (c.id === nextCategory.id) {
            return { ...c, order: categoryOrder };
          }
          return c;
        });

        const newFinance = {
          ...prevFinance,
          categories: newCategories
        };
        saveFinanceData(newFinance).catch(err => console.error('Error saving finance:', err));
        return newFinance;
      });
    } catch (error) {
      console.error('Error moving category down:', error);
      throw error;
    }
  }, []);

  const addBudget = useCallback(async (budget: FinanceData['budgets'][0]) => {
    try {
      console.log('[setFinance] Calling setFinance from addBudget');
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
      console.log('[setFinance] Calling setFinance from deleteBudget');
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

  // Tasks
  const updateTasksData = useCallback(async (newTasksData: TasksData) => {
    setTasksData(newTasksData);
    await saveTasksData(newTasksData);
  }, []);

  const addTask = useCallback(async (task: Task) => {
    try {
      setTasksData(prevData => {
        const newData = {
          ...prevData,
          tasks: [...prevData.tasks, task]
        };
        saveTasksData(newData).catch(err => console.error('Error saving tasks:', err));
        return newData;
      });
    } catch (error) {
      console.error('Error adding task:', error);
      throw error;
    }
  }, []);

  const updateTask = useCallback(async (id: string, updates: Partial<Task>) => {
    try {
      setTasksData(prevData => {
        const taskIndex = prevData.tasks.findIndex(t => t.id === id);
        if (taskIndex === -1) {
          console.warn('Task not found:', id);
          return prevData;
        }
        
        const updatedTask = { ...prevData.tasks[taskIndex], ...updates, updatedAt: Date.now() };
        const newData = {
          ...prevData,
          tasks: prevData.tasks.map(t => t.id === id ? updatedTask : t)
        };
        
        saveTasksData(newData).catch(err => console.error('Error saving tasks:', err));
        return newData;
      });
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  }, []);

  const deleteTask = useCallback(async (id: string) => {
    try {
      setTasksData(prevData => {
        const newData = {
          ...prevData,
          tasks: prevData.tasks.filter(t => t.id !== id),
          completedTasks: prevData.completedTasks.filter(t => t.id !== id)
        };
        saveTasksData(newData).catch(err => console.error('Error saving tasks:', err));
        return newData;
      });
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  }, []);

  const completeTask = useCallback(async (id: string) => {
    try {
      setTasksData(prevData => {
        const taskIndex = prevData.tasks.findIndex(t => t.id === id);
        if (taskIndex === -1) {
          console.warn('Task not found:', id);
          return prevData;
        }
        
        const task = prevData.tasks[taskIndex];
        const updatedTask = { ...task, completed: true, updatedAt: Date.now() };
        
        const newData = {
          ...prevData,
          tasks: prevData.tasks.filter(t => t.id !== id),
          completedTasks: [...prevData.completedTasks, updatedTask]
        };
        
        saveTasksData(newData).catch(err => console.error('Error saving tasks:', err));
        return newData;
      });
    } catch (error) {
      console.error('Error completing task:', error);
      throw error;
    }
  }, []);

  const uncompleteTask = useCallback(async (id: string) => {
    try {
      setTasksData(prevData => {
        const taskIndex = prevData.completedTasks.findIndex(t => t.id === id);
        if (taskIndex === -1) {
          console.warn('Completed task not found:', id);
          return prevData;
        }
        
        const task = prevData.completedTasks[taskIndex];
        const updatedTask = { ...task, completed: false, updatedAt: Date.now() };
        
        const newData = {
          ...prevData,
          tasks: [...prevData.tasks, updatedTask],
          completedTasks: prevData.completedTasks.filter(t => t.id !== id)
        };
        
        saveTasksData(newData).catch(err => console.error('Error saving tasks:', err));
        return newData;
      });
    } catch (error) {
      console.error('Error uncompleting task:', error);
      throw error;
    }
  }, []);

  // InBox
  const addInBoxItem = useCallback(async (item: InBoxItem) => {
    try {
      setTasksData(prevData => {
        const newData = {
          ...prevData,
          inbox: [...prevData.inbox, item]
        };
        saveTasksData(newData).catch(err => console.error('Error saving inbox:', err));
        return newData;
      });
    } catch (error) {
      console.error('Error adding inbox item:', error);
      throw error;
    }
  }, []);

  const deleteInBoxItem = useCallback(async (id: string) => {
    try {
      setTasksData(prevData => {
        const newData = {
          ...prevData,
          inbox: prevData.inbox.filter(item => item.id !== id)
        };
        saveTasksData(newData).catch(err => console.error('Error saving inbox:', err));
        return newData;
      });
    } catch (error) {
      console.error('Error deleting inbox item:', error);
      throw error;
    }
  }, []);

  // Covey Matrix
  const updateCoveyMatrixData = useCallback(async (data: CoveyMatrixData) => {
    setCoveyMatrixData(data);
    await saveCoveyMatrixData(data);
  }, []);

  const addCoveyTask = useCallback(async (task: CoveyTask) => {
    try {
      setCoveyMatrixData((prevData: CoveyMatrixData) => {
        const newData = {
          ...prevData,
          tasks: [...prevData.tasks, task]
        };
        saveCoveyMatrixData(newData).catch(err => console.error('Error saving covey matrix:', err));
        return newData;
      });
    } catch (error) {
      console.error('Error adding covey task:', error);
      throw error;
    }
  }, []);

  const updateCoveyTask = useCallback(async (id: string, updates: Partial<CoveyTask>) => {
    try {
      setCoveyMatrixData((prevData: CoveyMatrixData) => {
        const updatedTasks = prevData.tasks.map((task: CoveyTask) => {
          if (task.id === id) {
            const updated = { ...task, ...updates, updatedAt: Date.now() };
            // Пересчитываем квадрант, если изменились important или urgent
            if (updates.important !== undefined || updates.urgent !== undefined) {
              updated.quadrant = calculateQuadrant(
                updates.important !== undefined ? updates.important : task.important,
                updates.urgent !== undefined ? updates.urgent : task.urgent
              );
            }
            return updated;
          }
          return task;
        });
        const newData = {
          ...prevData,
          tasks: updatedTasks
        };
        saveCoveyMatrixData(newData).catch(err => console.error('Error saving covey matrix:', err));
        return newData;
      });
    } catch (error) {
      console.error('Error updating covey task:', error);
      throw error;
    }
  }, []);

  const deleteCoveyTask = useCallback(async (id: string) => {
    try {
      setCoveyMatrixData((prevData: CoveyMatrixData) => {
        const newData = {
          ...prevData,
          tasks: prevData.tasks.filter((task: CoveyTask) => task.id !== id),
          completedTasks: prevData.completedTasks.filter((task: CoveyTask) => task.id !== id)
        };
        saveCoveyMatrixData(newData).catch(err => console.error('Error saving covey matrix:', err));
        return newData;
      });
    } catch (error) {
      console.error('Error deleting covey task:', error);
      throw error;
    }
  }, []);

  const moveCoveyTask = useCallback(async (id: string, quadrant: 'q1' | 'q2' | 'q3' | 'q4') => {
    try {
      const { important, urgent } = getQuadrantValues(quadrant);
      await updateCoveyTask(id, { important, urgent, quadrant });
    } catch (error) {
      console.error('Error moving covey task:', error);
      throw error;
    }
  }, [updateCoveyTask]);

  const completeCoveyTask = useCallback(async (id: string) => {
    try {
      setCoveyMatrixData((prevData: CoveyMatrixData) => {
        const task = prevData.tasks.find((t: CoveyTask) => t.id === id);
        if (!task) return prevData;

        const updatedTask = { ...task, completed: true, updatedAt: Date.now() };
        const newData = {
          tasks: prevData.tasks.filter((t: CoveyTask) => t.id !== id),
          completedTasks: [...prevData.completedTasks, updatedTask]
        };
        saveCoveyMatrixData(newData).catch(err => console.error('Error saving covey matrix:', err));
        return newData;
      });
    } catch (error) {
      console.error('Error completing covey task:', error);
      throw error;
    }
  }, []);

  const uncompleteCoveyTask = useCallback(async (id: string) => {
    try {
      setCoveyMatrixData((prevData: CoveyMatrixData) => {
        const task = prevData.completedTasks.find((t: CoveyTask) => t.id === id);
        if (!task) return prevData;

        const updatedTask = { ...task, completed: false, updatedAt: Date.now() };
        const newData = {
          tasks: [...prevData.tasks, updatedTask],
          completedTasks: prevData.completedTasks.filter((t: CoveyTask) => t.id !== id)
        };
        saveCoveyMatrixData(newData).catch(err => console.error('Error saving covey matrix:', err));
        return newData;
      });
    } catch (error) {
      console.error('Error uncompleting covey task:', error);
      throw error;
    }
  }, []);

  // Books
  const updateBooks = useCallback(async (newBooks: BooksData) => {
    setBooks(newBooks);
    await saveBooksData(newBooks);
  }, []);

  const addBook = useCallback(async (book: Book) => {
    try {
      setBooks(prevBooks => {
        const newBooks = {
          ...prevBooks,
          books: [...prevBooks.books, book]
        };
        saveBooksData(newBooks).catch(err => console.error('Error saving books:', err));
        return newBooks;
      });
    } catch (error) {
      console.error('Error adding book:', error);
      throw error;
    }
  }, []);

  const updateBook = useCallback(async (id: string, updates: Partial<Book>) => {
    try {
      setBooks(prevBooks => {
        const bookIndex = prevBooks.books.findIndex(book => book.id === id);
        if (bookIndex === -1) {
          console.warn('Book not found:', id);
          return prevBooks;
        }
        
        const updatedBook = { ...prevBooks.books[bookIndex], ...updates, updatedAt: Date.now() };
        const newBooks = {
          ...prevBooks,
          books: prevBooks.books.map(book => book.id === id ? updatedBook : book)
        };
        
        saveBooksData(newBooks).catch(err => console.error('Error saving books:', err));
        return newBooks;
      });
    } catch (error) {
      console.error('Error updating book:', error);
      throw error;
    }
  }, []);

  const deleteBook = useCallback(async (id: string) => {
    try {
      setBooks(prevBooks => {
        const newBooks = {
          ...prevBooks,
          books: prevBooks.books.filter(book => book.id !== id)
        };
        saveBooksData(newBooks).catch(err => console.error('Error saving books:', err));
        return newBooks;
      });
    } catch (error) {
      console.error('Error deleting book:', error);
      throw error;
    }
  }, []);

  const addNote = useCallback(async (bookId: string, note: Note) => {
    try {
      setBooks(prevBooks => {
        const bookIndex = prevBooks.books.findIndex(book => book.id === bookId);
        if (bookIndex === -1) {
          console.warn('Book not found:', bookId);
          return prevBooks;
        }
        
        const updatedBook = {
          ...prevBooks.books[bookIndex],
          notes: [...prevBooks.books[bookIndex].notes, note],
          updatedAt: Date.now()
        };
        const newBooks = {
          ...prevBooks,
          books: prevBooks.books.map(book => book.id === bookId ? updatedBook : book)
        };
        
        saveBooksData(newBooks).catch(err => console.error('Error saving books:', err));
        return newBooks;
      });
    } catch (error) {
      console.error('Error adding note:', error);
      throw error;
    }
  }, []);

  const updateNote = useCallback(async (bookId: string, noteId: string, updates: Partial<Note>) => {
    try {
      setBooks(prevBooks => {
        const bookIndex = prevBooks.books.findIndex(book => book.id === bookId);
        if (bookIndex === -1) {
          console.warn('Book not found:', bookId);
          return prevBooks;
        }
        
        const updatedNotes = prevBooks.books[bookIndex].notes.map(note =>
          note.id === noteId ? { ...note, ...updates, updatedAt: Date.now() } : note
        );
        const updatedBook = {
          ...prevBooks.books[bookIndex],
          notes: updatedNotes,
          updatedAt: Date.now()
        };
        const newBooks = {
          ...prevBooks,
          books: prevBooks.books.map(book => book.id === bookId ? updatedBook : book)
        };
        
        saveBooksData(newBooks).catch(err => console.error('Error saving books:', err));
        return newBooks;
      });
    } catch (error) {
      console.error('Error updating note:', error);
      throw error;
    }
  }, []);

  const deleteNote = useCallback(async (bookId: string, noteId: string) => {
    try {
      setBooks(prevBooks => {
        const bookIndex = prevBooks.books.findIndex(book => book.id === bookId);
        if (bookIndex === -1) {
          console.warn('Book not found:', bookId);
          return prevBooks;
        }
        
        const updatedBook = {
          ...prevBooks.books[bookIndex],
          notes: prevBooks.books[bookIndex].notes.filter(note => note.id !== noteId),
          updatedAt: Date.now()
        };
        const newBooks = {
          ...prevBooks,
          books: prevBooks.books.map(book => book.id === bookId ? updatedBook : book)
        };
        
        saveBooksData(newBooks).catch(err => console.error('Error saving books:', err));
        return newBooks;
      });
    } catch (error) {
      console.error('Error deleting note:', error);
      throw error;
    }
  }, []);

  const addQuote = useCallback(async (bookId: string, quote: Quote) => {
    try {
      setBooks(prevBooks => {
        const bookIndex = prevBooks.books.findIndex(book => book.id === bookId);
        if (bookIndex === -1) {
          console.warn('Book not found:', bookId);
          return prevBooks;
        }
        
        const updatedBook = {
          ...prevBooks.books[bookIndex],
          quotes: [...prevBooks.books[bookIndex].quotes, quote],
          updatedAt: Date.now()
        };
        const newBooks = {
          ...prevBooks,
          books: prevBooks.books.map(book => book.id === bookId ? updatedBook : book)
        };
        
        saveBooksData(newBooks).catch(err => console.error('Error saving books:', err));
        return newBooks;
      });
    } catch (error) {
      console.error('Error adding quote:', error);
      throw error;
    }
  }, []);

  const deleteQuote = useCallback(async (bookId: string, quoteId: string) => {
    try {
      setBooks(prevBooks => {
        const bookIndex = prevBooks.books.findIndex(book => book.id === bookId);
        if (bookIndex === -1) {
          console.warn('Book not found:', bookId);
          return prevBooks;
        }
        
        const updatedBook = {
          ...prevBooks.books[bookIndex],
          quotes: prevBooks.books[bookIndex].quotes.filter(quote => quote.id !== quoteId),
          updatedAt: Date.now()
        };
        const newBooks = {
          ...prevBooks,
          books: prevBooks.books.map(book => book.id === bookId ? updatedBook : book)
        };
        
        saveBooksData(newBooks).catch(err => console.error('Error saving books:', err));
        return newBooks;
      });
    } catch (error) {
      console.error('Error deleting quote:', error);
      throw error;
    }
  }, []);

  const addReflection = useCallback(async (bookId: string, reflection: Reflection) => {
    try {
      setBooks(prevBooks => {
        const bookIndex = prevBooks.books.findIndex(book => book.id === bookId);
        if (bookIndex === -1) {
          console.warn('Book not found:', bookId);
          return prevBooks;
        }
        
        const updatedBook = {
          ...prevBooks.books[bookIndex],
          reflections: [...prevBooks.books[bookIndex].reflections, reflection],
          updatedAt: Date.now()
        };
        const newBooks = {
          ...prevBooks,
          books: prevBooks.books.map(book => book.id === bookId ? updatedBook : book)
        };
        
        saveBooksData(newBooks).catch(err => console.error('Error saving books:', err));
        return newBooks;
      });
    } catch (error) {
      console.error('Error adding reflection:', error);
      throw error;
    }
  }, []);

  const updateReflection = useCallback(async (bookId: string, reflectionId: string, updates: Partial<Reflection>) => {
    try {
      setBooks(prevBooks => {
        const bookIndex = prevBooks.books.findIndex(book => book.id === bookId);
        if (bookIndex === -1) {
          console.warn('Book not found:', bookId);
          return prevBooks;
        }
        
        const updatedReflections = prevBooks.books[bookIndex].reflections.map(reflection =>
          reflection.id === reflectionId ? { ...reflection, ...updates, updatedAt: Date.now() } : reflection
        );
        const updatedBook = {
          ...prevBooks.books[bookIndex],
          reflections: updatedReflections,
          updatedAt: Date.now()
        };
        const newBooks = {
          ...prevBooks,
          books: prevBooks.books.map(book => book.id === bookId ? updatedBook : book)
        };
        
        saveBooksData(newBooks).catch(err => console.error('Error saving books:', err));
        return newBooks;
      });
    } catch (error) {
      console.error('Error updating reflection:', error);
      throw error;
    }
  }, []);

  const deleteReflection = useCallback(async (bookId: string, reflectionId: string) => {
    try {
      setBooks(prevBooks => {
        const bookIndex = prevBooks.books.findIndex(book => book.id === bookId);
        if (bookIndex === -1) {
          console.warn('Book not found:', bookId);
          return prevBooks;
        }
        
        const updatedBook = {
          ...prevBooks.books[bookIndex],
          reflections: prevBooks.books[bookIndex].reflections.filter(reflection => reflection.id !== reflectionId),
          updatedAt: Date.now()
        };
        const newBooks = {
          ...prevBooks,
          books: prevBooks.books.map(book => book.id === bookId ? updatedBook : book)
        };
        
        saveBooksData(newBooks).catch(err => console.error('Error saving books:', err));
        return newBooks;
      });
    } catch (error) {
      console.error('Error deleting reflection:', error);
      throw error;
    }
  }, []);

  const addBookGoal = useCallback(async (goal: BookGoal) => {
    try {
      setBooks(prevBooks => {
        const newBooks = {
          ...prevBooks,
          goals: [...prevBooks.goals, goal]
        };
        saveBooksData(newBooks).catch(err => console.error('Error saving books:', err));
        return newBooks;
      });
    } catch (error) {
      console.error('Error adding book goal:', error);
      throw error;
    }
  }, []);

  const updateBookGoal = useCallback(async (id: string, updates: Partial<BookGoal>) => {
    try {
      setBooks(prevBooks => {
        const goalIndex = prevBooks.goals.findIndex(goal => goal.id === id);
        if (goalIndex === -1) {
          console.warn('Book goal not found:', id);
          return prevBooks;
        }
        
        const updatedGoal = { ...prevBooks.goals[goalIndex], ...updates };
        const newBooks = {
          ...prevBooks,
          goals: prevBooks.goals.map(goal => goal.id === id ? updatedGoal : goal)
        };
        
        saveBooksData(newBooks).catch(err => console.error('Error saving books:', err));
        return newBooks;
      });
    } catch (error) {
      console.error('Error updating book goal:', error);
      throw error;
    }
  }, []);

  const deleteBookGoal = useCallback(async (id: string) => {
    try {
      setBooks(prevBooks => {
        const newBooks = {
          ...prevBooks,
          goals: prevBooks.goals.filter(goal => goal.id !== id)
        };
        saveBooksData(newBooks).catch(err => console.error('Error saving books:', err));
        return newBooks;
      });
    } catch (error) {
      console.error('Error deleting book goal:', error);
      throw error;
    }
  }, []);

  // Возвращаем объект напрямую
  return {
    // Data
    habits,
    finance,
    onboarding,
    yearlyReports,
    tasksData,
    books,
    loading,
    
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
    updateCategory,
    moveCategoryUp,
    moveCategoryDown,
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
    
    // Tasks
    updateTasksData,
    addTask,
    updateTask,
    deleteTask,
    completeTask,
    uncompleteTask,
    
    // InBox
    addInBoxItem,
    deleteInBoxItem,
    
    // Covey Matrix
    coveyMatrixData,
    updateCoveyMatrixData,
    addCoveyTask,
    updateCoveyTask,
    deleteCoveyTask,
    moveCoveyTask,
    completeCoveyTask,
    uncompleteCoveyTask,
    
    // Books
    updateBooks,
    addBook,
    updateBook,
    deleteBook,
    addNote,
    updateNote,
    deleteNote,
    addQuote,
    deleteQuote,
    addReflection,
    updateReflection,
    deleteReflection,
    addBookGoal,
    updateBookGoal,
    deleteBookGoal,
    
    // Reload
    reload: loadAllData
  };
}
