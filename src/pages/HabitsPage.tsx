import { useState, useRef } from 'react';
import { useCloudStorage } from '../hooks/useCloudStorage';
import { generateId, type Habit } from '../utils/storage';
import HabitList from '../components/Habits/HabitList';
import HabitsStatisticsView from '../components/Habits/HabitsStatisticsView';
import HabitBottomSheet from '../components/Habits/HabitBottomSheet';
import HabitDetailsBottomSheet from '../components/Habits/HabitDetailsBottomSheet';
import EditHabitModal from '../components/Habits/EditHabitModal';
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

const sectionTitles = ['Привычки', 'Статистика'];

export default function HabitsPage({ storage }: HabitsPageProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const touchStartRef = useRef<number | null>(null);
  const touchEndRef = useRef<number | null>(null);
  const minSwipeDistance = 50;
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [menuHabit, setMenuHabit] = useState<Habit | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editHabit, setEditHabit] = useState<Habit | null>(null);
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
      // На первом шаге закрываем визард и возвращаемся в раздел привычек
      setIsCreating(false);
      setHabitData({});
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchEndRef.current = null;
    touchStartRef.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndRef.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartRef.current || !touchEndRef.current) return;
    
    const distance = touchStartRef.current - touchEndRef.current;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && currentSlide < sectionTitles.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
    if (isRightSwipe && currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
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


  const handleDelete = async (id: string) => {
    await storage.deleteHabit(id);
  };

  const handleOpenDetails = (habit: Habit) => {
    setSelectedHabit(habit);
    setShowDetails(true);
  };

  const handleOpenMenu = (habit: Habit) => {
    setMenuHabit(habit);
    setShowMenu(true);
  };

  const handleMenuEdit = () => {
    if (menuHabit) {
      setShowMenu(false);
      setEditHabit(menuHabit);
      setShowEditModal(true);
      setMenuHabit(null);
    }
  };

  const handleEdit = (habit: Habit) => {
    setEditHabit(habit);
    setShowEditModal(true);
  };

  const handleMenuDelete = () => {
    if (menuHabit) {
      if (window.Telegram?.WebApp?.showConfirm) {
        window.Telegram.WebApp.showConfirm(
          `Удалить "${menuHabit.name}"?`,
          (confirmed: boolean) => {
            if (confirmed) {
              handleDelete(menuHabit.id);
            }
          }
        );
      } else {
        if (window.confirm(`Удалить "${menuHabit.name}"?`)) {
          handleDelete(menuHabit.id);
        }
      }
      setShowMenu(false);
      setMenuHabit(null);
    }
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
          <Step1Name onNext={handleStep1Complete} onBack={handleBack} />
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
    <>
      {/* FAB кнопка для создания привычки - всегда видна */}
      <button 
        onClick={handleStartCreate}
        aria-label="Создать привычку"
        style={{
          position: 'fixed',
          bottom: 'calc(20px + env(safe-area-inset-bottom))',
          right: '20px',
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          backgroundColor: 'var(--tg-theme-button-color)',
          color: 'var(--tg-theme-button-text-color)',
          border: 'none',
          fontSize: '32px',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10001,
          transition: 'transform 0.2s, box-shadow 0.2s'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.05)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
        }}
        onMouseDown={(e) => {
          e.currentTarget.style.transform = 'scale(0.95)';
        }}
        onMouseUp={(e) => {
          e.currentTarget.style.transform = 'scale(1.05)';
        }}
      >
        +
      </button>

      <div style={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {/* Заголовки разделов */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-around',
          padding: '12px 16px',
          borderBottom: '1px solid var(--tg-theme-secondary-bg-color)',
          backgroundColor: 'var(--tg-theme-bg-color)'
        }}>
          {sectionTitles.map((title, index) => (
            <div
              key={index}
              onClick={() => setCurrentSlide(index)}
              style={{
                fontSize: '16px',
                fontWeight: currentSlide === index ? '600' : '400',
                color: currentSlide === index 
                  ? 'var(--tg-theme-button-color)' 
                  : 'var(--tg-theme-hint-color)',
                cursor: 'pointer',
                padding: '8px 12px',
                borderBottom: currentSlide === index 
                  ? '2px solid var(--tg-theme-button-color)' 
                  : '2px solid transparent',
                transition: 'all 0.2s'
              }}
            >
              {title}
            </div>
          ))}
        </div>

        {/* Контейнер со слайдами */}
        <div
          className="slide-container"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Слайд 0: Список */}
          <div className={`slide ${currentSlide === 0 ? 'active' : currentSlide > 0 ? 'prev' : 'next'}`}>
            <div style={{ 
              flex: 1, 
              display: 'flex', 
              flexDirection: 'column', 
              position: 'relative',
              paddingTop: '0px',
              paddingBottom: 'calc(100px + env(safe-area-inset-bottom))',
              overflow: 'hidden'
            }}>
              <HabitList 
                habits={storage.habits}
                onCheck={handleCheck}
                onUpdate={handleUpdate}
                onHistoryUpdate={handleHistoryUpdate}
                onDelete={handleDelete}
                onOpenDetails={handleOpenDetails}
                onOpenMenu={handleOpenMenu}
                onEdit={handleEdit}
              />
            </div>
          </div>

          {/* Слайд 1: Статистика */}
          <div className={`slide ${currentSlide === 1 ? 'active' : currentSlide > 1 ? 'prev' : 'next'}`}>
            <div style={{ 
              flex: 1, 
              display: 'flex', 
              flexDirection: 'column', 
              position: 'relative',
              paddingTop: '0px',
              paddingBottom: 'calc(100px + env(safe-area-inset-bottom))',
              overflowY: 'auto',
              overflowX: 'hidden'
            }}>
              <HabitsStatisticsView habits={storage.habits} />
            </div>
          </div>

        </div>
      </div>

      {/* BottomSheet для деталей привычки */}
      {showDetails && selectedHabit && (
        <HabitDetailsBottomSheet
          habit={selectedHabit}
          onClose={() => {
            setShowDetails(false);
            setSelectedHabit(null);
          }}
          onCheck={(value) => handleCheck(selectedHabit.id, value)}
          onHistoryUpdate={(history) => handleHistoryUpdate(selectedHabit.id, history)}
        />
      )}

      {/* BottomSheet для меню */}
      {showMenu && menuHabit && (
        <HabitBottomSheet
          onClose={() => {
            setShowMenu(false);
            setMenuHabit(null);
          }}
          onEdit={handleMenuEdit}
          onDelete={handleMenuDelete}
        />
      )}

      {/* Модальное окно редактирования */}
      {showEditModal && editHabit && (
        <EditHabitModal
          habit={editHabit}
          onSave={(updates) => {
            handleUpdate(editHabit.id, updates);
            setShowEditModal(false);
            setEditHabit(null);
          }}
          onClose={() => {
            setShowEditModal(false);
            setEditHabit(null);
          }}
        />
      )}
    </>
  );
}
