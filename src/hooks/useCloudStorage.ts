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
  type Task,
  type Habit,
  type FinanceData,
  type OnboardingFlags
} from '../utils/storage';

export function useCloudStorage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [finance, setFinance] = useState<FinanceData>({ transactions: [], categories: [], budgets: [] });
  const [onboarding, setOnboarding] = useState<OnboardingFlags>({
    tasks: false,
    habits: false,
    finance: false,
    languages: false
  });
  const [loading, setLoading] = useState(true);

  // Загрузка данных при монтировании
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      setLoading(true);
      const [tasksData, habitsData, financeData, onboardingData] = await Promise.all([
        getTasks(),
        getHabits(),
        getFinanceData(),
        getOnboardingFlags()
      ]);
      
      setTasks(tasksData);
      setHabits(habitsData);
      setFinance(financeData);
      setOnboarding(onboardingData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Tasks
  const updateTasks = useCallback(async (newTasks: Task[]) => {
    setTasks(newTasks);
    await saveTasks(newTasks);
  }, []);

  const addTask = useCallback(async (task: Task) => {
    const newTasks = [...tasks, task];
    await updateTasks(newTasks);
  }, [tasks, updateTasks]);

  const updateTask = useCallback(async (id: string, updates: Partial<Task>) => {
    const newTasks = tasks.map(task => 
      task.id === id ? { ...task, ...updates } : task
    );
    await updateTasks(newTasks);
  }, [tasks, updateTasks]);

  const deleteTask = useCallback(async (id: string) => {
    const newTasks = tasks.filter(task => task.id !== id);
    await updateTasks(newTasks);
  }, [tasks, updateTasks]);

  // Habits
  const updateHabits = useCallback(async (newHabits: Habit[]) => {
    setHabits(newHabits);
    await saveHabits(newHabits);
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

  return {
    // Data
    tasks,
    habits,
    finance,
    onboarding,
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
    
    // Reload
    reload: loadAllData
  };
}

