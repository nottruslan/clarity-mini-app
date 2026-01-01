import { useEffect, useRef, useState } from 'react';
import { Habit } from '../../utils/storage';
import LevelIndicator from './LevelIndicator';
import HabitStats from './HabitStats';
import HabitCharts from './HabitCharts';
import HabitProgressBars from './HabitProgressBars';
import MonthCalendar from './MonthCalendar';
import { calculateGoalProgress } from '../../utils/habitCalculations';

interface HabitDetailsBottomSheetProps {
  habit: Habit;
  onClose: () => void;
  onCheck: (value?: number) => void;
  onHistoryUpdate: (history: Habit['history']) => void;
}

export default function HabitDetailsBottomSheet({
  habit: initialHabit,
  onClose,
  onCheck,
  onHistoryUpdate
}: HabitDetailsBottomSheetProps) {
  const backdropRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [inputValue, setInputValue] = useState<string>('');
  const [habit, setHabit] = useState<Habit>(initialHabit);

  // Обновляем локальное состояние habit при изменении пропса
  useEffect(() => {
    setHabit(initialHabit);
  }, [initialHabit]);

  const goalProgress = calculateGoalProgress(habit);
  const today = new Date().toISOString().split('T')[0];
  const isTodayCompleted = habit.history[today]?.completed || false;
  const isSelectedDateCompleted = selectedDate ? habit.history[selectedDate]?.completed || false : false;

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    if (sheetRef.current) {
      setTimeout(() => {
        if (sheetRef.current) {
          sheetRef.current.style.transform = 'translateY(0)';
        }
      }, 10);
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === backdropRef.current) {
      handleClose();
    }
  };

  const handleClose = () => {
    if (sheetRef.current) {
      sheetRef.current.style.transform = 'translateY(100%)';
      setTimeout(() => {
        onClose();
      }, 300);
    } else {
      onClose();
    }
  };

  const handleCheck = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    
    if (selectedDate) {
      const value = habit.unit && habit.targetValue && inputValue ? parseFloat(inputValue) : undefined;
      handleDateCheck(selectedDate, value);
      setSelectedDate('');
      setInputValue('');
    } else {
      if (habit.unit && habit.targetValue) {
        const value = inputValue ? parseFloat(inputValue) : undefined;
        onCheck(value);
        setInputValue('');
      } else {
        onCheck();
      }
    }
  };

  const handleDateCheck = (dateKey: string, value?: number) => {
    const historyEntry = habit.history[dateKey];
    const isAlreadyChecked = historyEntry?.completed || false;

    let newHistory: Habit['history'];
    
    if (isAlreadyChecked) {
      // Убираем отметку
      newHistory = { ...habit.history };
      delete newHistory[dateKey];
    } else {
      // Добавляем отметку
      newHistory = {
        ...habit.history,
        [dateKey]: {
          completed: true,
          value: value
        }
      };
    }
    
    // Обновляем локальное состояние сразу для немедленного отображения
    setHabit({ ...habit, history: newHistory });
    
    // Вызываем callback для сохранения
    onHistoryUpdate(newHistory);
  };

  const handleCancel = (e?: React.MouseEvent<HTMLButtonElement>) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    
    // Сбрасываем выбор даты и введенное значение
    setSelectedDate('');
    setInputValue('');
    
    // Принудительно обновляем компонент календаря
    // Это должно работать через обновление пропса selectedDate
  };

  return (
    <div
      ref={backdropRef}
      onClick={handleBackdropClick}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 10000,
        display: 'flex',
        alignItems: 'flex-end',
        animation: 'fadeIn 0.2s ease-out'
      }}
    >
      <div
        ref={sheetRef}
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '500px',
          backgroundColor: 'var(--tg-theme-bg-color)',
          borderTopLeftRadius: '20px',
          borderTopRightRadius: '20px',
          padding: '8px 0 20px',
          paddingBottom: 'calc(20px + env(safe-area-inset-bottom))',
          transform: 'translateY(100%)',
          transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          maxHeight: '85vh',
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        {/* Индикатор */}
        <div
          style={{
            width: '40px',
            height: '4px',
            backgroundColor: 'var(--tg-theme-hint-color)',
            borderRadius: '2px',
            margin: '8px auto 16px',
            opacity: 0.3
          }}
        />

        <div style={{ padding: '0 20px' }}>
          {/* Заголовок */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '24px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <span style={{ fontSize: '32px' }}>{habit.icon || '🔥'}</span>
              <div>
                <h2 style={{
                  fontSize: '20px',
                  fontWeight: '600',
                  color: 'var(--tg-theme-text-color)',
                  margin: 0,
                  marginBottom: '4px'
                }}>
                  {habit.name}
                </h2>
                {habit.category && (
                  <div style={{
                    fontSize: '12px',
                    color: 'var(--tg-theme-hint-color)'
                  }}>
                    {habit.category}
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={handleClose}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                border: 'none',
                backgroundColor: 'var(--tg-theme-secondary-bg-color)',
                fontSize: '24px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--tg-theme-text-color)'
              }}
            >
              ×
            </button>
          </div>

          {/* Уровень */}
          <LevelIndicator habit={habit} />

          {/* Серия и цель */}
          <div style={{
            display: 'flex',
            gap: '16px',
            marginTop: '16px',
            padding: '12px',
            background: 'var(--tg-theme-secondary-bg-color)',
            borderRadius: '8px'
          }}>
            <div style={{ flex: 1 }}>
              <div style={{
                fontSize: '12px',
                color: 'var(--tg-theme-hint-color)',
                marginBottom: '4px'
              }}>
                Серия
              </div>
              <div style={{
                fontSize: '18px',
                fontWeight: '600',
                color: 'var(--tg-theme-text-color)'
              }}>
                {habit.streak} {habit.streak === 1 ? 'день' : habit.streak < 5 ? 'дня' : 'дней'} 🔥
              </div>
            </div>
            {habit.goalDays && (
              <div style={{ flex: 1 }}>
                <div style={{
                  fontSize: '12px',
                  color: 'var(--tg-theme-hint-color)',
                  marginBottom: '4px'
                }}>
                  Цель
                </div>
                <div style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: 'var(--tg-theme-text-color)'
                }}>
                  {goalProgress.current}/{goalProgress.target} дней
                </div>
              </div>
            )}
          </div>

          {/* Календарь */}
          <div style={{ marginTop: '20px' }}>
            <MonthCalendar 
              key={`calendar-${selectedDate || 'none'}`}
              habit={habit}
              selectedDate={selectedDate}
              onDateClick={(dateKey, value) => {
                // Разрешаем выбирать любую прошедшую дату или сегодня
                // Парсим dateKey (формат YYYY-MM-DD) в локальное время
                const [year, month, day] = dateKey.split('-').map(Number);
                const date = new Date(year, month - 1, day);
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                
                if (date <= today) {
                  if (selectedDate === dateKey) {
                    setSelectedDate('');
                  } else {
                    setSelectedDate(dateKey);
                  }
                }
              }}
            />
          </div>

          {/* Ввод значения */}
          {habit.unit && habit.targetValue && (
            (selectedDate && !isSelectedDateCompleted) || (!selectedDate && !isTodayCompleted)
          ) && (
            <div style={{ marginTop: '16px' }}>
              <label style={{
                fontSize: '14px',
                color: 'var(--tg-theme-hint-color)',
                marginBottom: '8px',
                display: 'block'
              }}>
                Введите значение ({habit.unit}):
              </label>
              <input
                type="number"
                className="wizard-input"
                placeholder={`Цель: ${habit.targetValue} ${habit.unit}`}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                min="0"
                step="0.1"
                style={{ marginTop: 0 }}
              />
            </div>
          )}

          {/* Кнопки действий */}
          <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
            {selectedDate ? (
              <>
                <button
                  className="tg-button"
                  onClick={(e) => handleCheck(e)}
                  style={{ flex: 1 }}
                >
                  {isSelectedDateCompleted 
                    ? (() => {
                        const [year, month, day] = selectedDate.split('-').map(Number);
                        const date = new Date(year, month - 1, day);
                        return `✓ Выполнено ${date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}`;
                      })()
                    : (() => {
                        const [year, month, day] = selectedDate.split('-').map(Number);
                        const date = new Date(year, month - 1, day);
                        return `Отметить ${date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}`;
                      })()
                  }
                </button>
                <button
                  className="tg-button"
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    handleCancel(e);
                  }}
                  style={{
                    background: 'var(--tg-theme-secondary-bg-color)',
                    color: 'var(--tg-theme-text-color)',
                    minWidth: '100px'
                  }}
                >
                  Отменить
                </button>
              </>
            ) : (
              <button
                className="tg-button"
                onClick={(e) => handleCheck(e)}
                style={{ flex: 1 }}
                disabled={isTodayCompleted}
              >
                {isTodayCompleted ? '✓ Выполнено сегодня' : 'Отметить сегодня'}
              </button>
            )}
          </div>

          {/* Статистика и графики */}
          <div style={{ marginTop: '24px' }}>
            <HabitStats habit={habit} />
            <HabitProgressBars habit={habit} period="week" />
            <HabitCharts habit={habit} />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

