import { useState } from 'react';
import { useCloudStorage } from '../hooks/useCloudStorage';
import { generateId, type Habit } from '../utils/storage';
import HabitList from '../components/Habits/HabitList';
import WizardContainer from '../components/Wizard/WizardContainer';
import Step1Name from '../components/Habits/CreateHabit/Step1Name';
import Step2Icon from '../components/Habits/CreateHabit/Step2Icon';
import Step3Category from '../components/Habits/CreateHabit/Step3Category';
import Step4Frequency from '../components/Habits/CreateHabit/Step4Frequency';
import Step5Unit from '../components/Habits/CreateHabit/Step5Unit';
import Step6Goal from '../components/Habits/CreateHabit/Step6Goal';
import { sectionColors } from '../utils/sectionColors';
import { calculateExperience, calculateLevel, calculateTotalExperience } from '../utils/habitCalculations';

interface HabitsPageProps {
  storage: ReturnType<typeof useCloudStorage>;
}

export default function HabitsPage({ storage }: HabitsPageProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [createStep, setCreateStep] = useState(0);
  const [habitData, setHabitData] = useState<{
    name?: string;
    icon?: string;
    category?: string;
    frequency?: {
      type: 'daily' | 'weekly' | 'custom' | 'flexible';
      customDays?: number[];
      timesPerDay?: number;
      timesPerWeek?: number;
      timesPerMonth?: number;
    };
    unit?: string;
    targetValue?: number;
    goalDays?: number;
  }>({});

  const handleStartCreate = () => {
    setIsCreating(true);
    setCreateStep(0);
    setHabitData({});
  };

  const handleStep1Complete = (name: string) => {
    setHabitData({ name });
    setCreateStep(1);
  };

  const handleStep2Complete = (icon: string) => {
    setHabitData(prev => ({ ...prev, icon }));
    setCreateStep(2);
  };

  const handleStep3Complete = (category: string) => {
    setHabitData(prev => ({ ...prev, category }));
    setCreateStep(3);
  };

  const handleStep4Complete = (frequency: {
    type: 'daily' | 'weekly' | 'custom' | 'flexible';
    customDays?: number[];
    timesPerDay?: number;
    timesPerWeek?: number;
    timesPerMonth?: number;
  }) => {
    setHabitData(prev => ({ ...prev, frequency }));
    setCreateStep(4);
  };

  const handleStep5Complete = (unit: string, targetValue: number | undefined) => {
    setHabitData(prev => ({ ...prev, unit, targetValue }));
    setCreateStep(5);
  };

  const handleStep6Complete = async (goalDays: number | undefined) => {
    const newHabit: Habit = {
      id: generateId(),
      name: habitData.name!,
      icon: habitData.icon || '🔥',
      category: habitData.category,
      frequency: habitData.frequency?.type || 'daily',
      customDays: habitData.frequency?.customDays,
      timesPerDay: habitData.frequency?.timesPerDay,
      timesPerWeek: habitData.frequency?.timesPerWeek,
      timesPerMonth: habitData.frequency?.timesPerMonth,
      unit: habitData.unit,
      targetValue: habitData.targetValue,
      goalDays: goalDays,
      level: 1,
      experience: 0,
      createdAt: Date.now(),
      history: {},
      streak: 0,
      order: storage.habits.length
    };

    await storage.addHabit(newHabit);
    setIsCreating(false);
    setCreateStep(0);
    setHabitData({});
  };

  const handleBack = () => {
    if (createStep > 0) {
      setCreateStep(createStep - 1);
    } else {
      setIsCreating(false);
      setHabitData({});
    }
  };

  const handleCheck = async (id: string, value?: number) => {
    const habit = storage.habits.find(h => h.id === id);
    if (!habit) return;

    const today = new Date().toISOString().split('T')[0];
    const historyEntry = habit.history[today];
    const isAlreadyChecked = historyEntry?.completed || false;

    if (isAlreadyChecked) {
      // Убираем отметку
      const newHistory = { ...habit.history };
      delete newHistory[today];
      
      // Пересчитываем streak
      let streak = 0;
      const date = new Date();
      for (let i = 0; i < 365; i++) {
        const checkDate = new Date(date);
        checkDate.setDate(checkDate.getDate() - i);
        const dateKey = checkDate.toISOString().split('T')[0];
        
        if (newHistory[dateKey]?.completed) {
          streak++;
        } else if (i > 0) {
          break;
        }
      }
      
      // Пересчитываем опыт и уровень
      const totalExp = calculateTotalExperience({ ...habit, history: newHistory, streak });
      const level = calculateLevel(totalExp);
      
      await storage.updateHabit(id, { 
        history: newHistory, 
        streak,
        experience: totalExp,
        level
      });
    } else {
      // Добавляем отметку
      const newHistory = { 
        ...habit.history, 
        [today]: { 
          completed: true,
          value: value
        }
      };
      
      // Пересчитываем streak
      let streak = 1;
      const date = new Date();
      for (let i = 1; i < 365; i++) {
        const checkDate = new Date(date);
        checkDate.setDate(checkDate.getDate() - i);
        const dateKey = checkDate.toISOString().split('T')[0];
        
        if (newHistory[dateKey]?.completed) {
          streak++;
        } else {
          break;
        }
      }
      
      // Рассчитываем опыт за сегодня
      const todayExp = calculateExperience({ ...habit, history: newHistory, streak }, today);
      const totalExp = (habit.experience || 0) + todayExp;
      const level = calculateLevel(totalExp);
      
      await storage.updateHabit(id, { 
        history: newHistory, 
        streak,
        experience: totalExp,
        level
      });
    }
  };

  const handleUpdate = async (id: string, updates: Partial<Habit>) => {
    await storage.updateHabit(id, updates);
  };

  const handleHistoryUpdate = async (id: string, history: Habit['history']) => {
    // Пересчитываем streak после обновления истории
    let streak = 0;
    const date = new Date();
    for (let i = 0; i < 365; i++) {
      const checkDate = new Date(date);
      checkDate.setDate(checkDate.getDate() - i);
      const dateKey = checkDate.toISOString().split('T')[0];
      
      if (history[dateKey]?.completed) {
        streak++;
      } else if (i > 0) {
        break;
      }
    }
    
    const habit = storage.habits.find(h => h.id === id);
    if (habit) {
      const totalExp = calculateTotalExperience({ ...habit, history, streak });
      const level = calculateLevel(totalExp);
      
      await storage.updateHabit(id, { 
        history, 
        streak,
        experience: totalExp,
        level
      });
    }
  };

  const handleReorder = async (habits: Habit[]) => {
    await storage.updateHabits(habits);
  };

  if (isCreating) {
    const colors = sectionColors.habits;
    
    return (
      <WizardContainer 
        currentStep={createStep + 1} 
        totalSteps={6}
        progressColor={colors.primary}
      >
        <div 
          className={`wizard-slide ${createStep === 0 ? 'active' : createStep > 0 ? 'prev' : 'next'}`}
        >
          <Step1Name onNext={handleStep1Complete} />
        </div>
        <div 
          className={`wizard-slide ${createStep === 1 ? 'active' : createStep > 1 ? 'prev' : 'next'}`}
        >
          <Step2Icon 
            name={habitData.name!}
            onNext={handleStep2Complete}
            onBack={handleBack}
          />
        </div>
        <div 
          className={`wizard-slide ${createStep === 2 ? 'active' : createStep > 2 ? 'prev' : 'next'}`}
        >
          <Step3Category 
            name={habitData.name!}
            onNext={handleStep3Complete}
            onBack={handleBack}
          />
        </div>
        <div 
          className={`wizard-slide ${createStep === 3 ? 'active' : createStep > 3 ? 'prev' : 'next'}`}
        >
          <Step4Frequency 
            name={habitData.name!}
            onNext={handleStep4Complete}
            onBack={handleBack}
          />
        </div>
        <div 
          className={`wizard-slide ${createStep === 4 ? 'active' : createStep > 4 ? 'prev' : 'next'}`}
        >
          <Step5Unit 
            name={habitData.name!}
            onNext={handleStep5Complete}
            onBack={handleBack}
          />
        </div>
        <div 
          className={`wizard-slide ${createStep === 5 ? 'active' : createStep > 5 ? 'prev' : 'next'}`}
        >
          <Step6Goal 
            name={habitData.name!}
            onComplete={handleStep6Complete}
            onBack={handleBack}
          />
        </div>
      </WizardContainer>
    );
  }

  return (
    <div style={{ 
      flex: 1, 
      display: 'flex', 
      flexDirection: 'column', 
      position: 'relative',
      paddingTop: '0px',
      overflow: 'hidden'
    }}>
      <HabitList 
        habits={storage.habits}
        onCheck={handleCheck}
        onUpdate={handleUpdate}
        onHistoryUpdate={handleHistoryUpdate}
        onReorder={handleReorder}
      />
      <button 
        className="fab"
        onClick={handleStartCreate}
        aria-label="Создать привычку"
      >
        +
      </button>
    </div>
  );
}
