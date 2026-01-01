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
  type Habit,
  type FinanceData,
  type OnboardingFlags,
  type YearlyReport
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
  const [loading, setLoading] = useState(true);
  const isLoadingRef = useRef(false);
  const hasLoadedRef = useRef(false); // Флаг для отслеживания, были ли данные уже загружены

  // Загрузка данных при монтировании
  useEffect(() => {
    loadAllData();
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
      const [habitsData, financeData, onboardingData, reportsData] = await Promise.all([
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
      setFinance(financeData);
      setOnboarding(onboardingData);
      setYearlyReports(reportsData);
      
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

  // Возвращаем объект напрямую
  return {
    // Data
    habits,
    finance,
    onboarding,
    yearlyReports,
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
    
    // Reload
    reload: loadAllData
  };
}
