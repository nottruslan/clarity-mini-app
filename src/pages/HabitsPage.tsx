import { useState } from 'react';
import { useCloudStorage } from '../hooks/useCloudStorage';
import { generateId, type Habit } from '../utils/storage';
import HabitList from '../components/Habits/HabitList';
import WizardContainer from '../components/Wizard/WizardContainer';
import Step1Name from '../components/Habits/CreateHabit/Step1Name';
import Step2Icon from '../components/Habits/CreateHabit/Step2Icon';
import Step3Frequency from '../components/Habits/CreateHabit/Step3Frequency';
import { useOnboarding } from '../hooks/useOnboarding';
import LottieAnimation from '../components/LottieAnimation';
import { sectionColors } from '../utils/sectionColors';

interface HabitsPageProps {
  storage: ReturnType<typeof useCloudStorage>;
}

export default function HabitsPage({ storage }: HabitsPageProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [createStep, setCreateStep] = useState(0);
  const [habitData, setHabitData] = useState<{
    name?: string;
    icon?: string;
  }>({});
  
  const { shouldShow: showOnboarding, handleClose: closeOnboarding } = useOnboarding('habits');

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

  const handleStep3Complete = async (frequency: 'daily' | 'weekly') => {
    const newHabit: Habit = {
      id: generateId(),
      name: habitData.name!,
      icon: habitData.icon || '🔥',
      frequency,
      createdAt: Date.now(),
      history: {},
      streak: 0
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

  const handleCheck = async (id: string) => {
    const habit = storage.habits.find(h => h.id === id);
    if (!habit) return;

    const today = new Date().toISOString().split('T')[0];
    const isAlreadyChecked = habit.history[today];

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
        
        if (newHistory[dateKey]) {
          streak++;
        } else if (i > 0) {
          break;
        }
      }
      
      await storage.updateHabit(id, { history: newHistory, streak });
    } else {
      // Добавляем отметку
      const newHistory = { ...habit.history, [today]: true };
      
      // Пересчитываем streak
      let streak = 1;
      const date = new Date();
      for (let i = 1; i < 365; i++) {
        const checkDate = new Date(date);
        checkDate.setDate(checkDate.getDate() - i);
        const dateKey = checkDate.toISOString().split('T')[0];
        
        if (newHistory[dateKey]) {
          streak++;
        } else {
          break;
        }
      }
      
      await storage.updateHabit(id, { history: newHistory, streak });
    }
  };

  if (showOnboarding) {
    return (
      <div style={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px 16px',
        textAlign: 'center'
      }}>
        <div style={{ width: '200px', height: '200px', marginBottom: '24px' }}>
          <LottieAnimation loop={true} autoplay={true} />
        </div>
        <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '8px' }}>
          Привычки
        </h2>
        <p style={{ 
          fontSize: '16px', 
          color: 'var(--tg-theme-hint-color)',
          marginBottom: '32px',
          maxWidth: '300px'
        }}>
          Отслеживайте свои привычки каждый день. Смотрите календарь выполнения и ведите счетчик серий.
        </p>
        <button className="tg-button" onClick={closeOnboarding}>
          Понятно
        </button>
      </div>
    );
  }

  if (isCreating) {
    const colors = sectionColors.habits;
    
    return (
      <WizardContainer 
        currentStep={createStep + 1} 
        totalSteps={3}
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
          <Step3Frequency 
            name={habitData.name!}
            onComplete={handleStep3Complete}
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

