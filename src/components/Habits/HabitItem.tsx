import { useState } from 'react';
import { Habit } from '../../utils/storage';
import LevelIndicator from './LevelIndicator';
import HabitCharts from './HabitCharts';
import HabitProgressBars from './HabitProgressBars';
import HabitStats from './HabitStats';
import { calculateGoalProgress } from '../../utils/habitCalculations';
import EditHabitModal from './EditHabitModal';
import EditHistoryModal from './EditHistoryModal';
import MonthCalendar from './MonthCalendar';

interface HabitItemProps {
  habit: Habit;
  onCheck: (value?: number) => void;
  onUpdate: (updates: Partial<Habit>) => void;
  onHistoryUpdate: (history: Habit['history']) => void;
  onDelete: () => void;
}

export default function HabitItem({ habit, onCheck, onUpdate, onHistoryUpdate, onDelete }: HabitItemProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedHistoryDate, setSelectedHistoryDate] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [inputValue, setInputValue] = useState<string>('');

  const goalProgress = calculateGoalProgress(habit);

  const handleCheck = () => {
    if (selectedDate) {
      // Если выбрана дата, отмечаем её
      const value = habit.unit && habit.targetValue && inputValue ? parseFloat(inputValue) : undefined;
      // Вызываем onCheck с выбранной датой через специальный обработчик
      handleDateCheck(selectedDate, value);
      setSelectedDate('');
      setInputValue('');
    } else {
      // Обычная логика для сегодня
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
    // Создаем новую историю с отметкой на выбранную дату
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
    
    onHistoryUpdate(newHistory);
  };

  const handleCancel = () => {
    if (selectedDate) {
      // Проверяем, отмечена ли выбранная дата в истории
      const historyEntry = habit.history[selectedDate];
      const isChecked = historyEntry?.completed || false;
      
      if (isChecked) {
        // Если дата отмечена, убираем её из истории
        const newHistory = { ...habit.history };
        delete newHistory[selectedDate];
        onHistoryUpdate(newHistory);
      }
      
      // Сбрасываем выбор даты
      setSelectedDate('');
      setInputValue('');
    }
  };

  const handleDeleteClick = () => {
    if (window.Telegram?.WebApp?.showConfirm) {
      window.Telegram.WebApp.showConfirm(
        `Удалить "${habit.name}"?`,
        (confirmed: boolean) => {
          if (confirmed) {
            onDelete();
          }
        }
      );
    } else {
      // Fallback на обычный confirm
      if (window.confirm(`Удалить "${habit.name}"?`)) {
        onDelete();
      }
    }
  };

  const today = new Date().toISOString().split('T')[0];
  const isTodayCompleted = habit.history[today]?.completed || false;
  const isSelectedDateCompleted = selectedDate ? habit.history[selectedDate]?.completed || false : false;

  return (
    <>
      <div className="list-item" style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <span style={{ fontSize: '32px' }}>{habit.icon || '🔥'}</span>
          <div style={{ flex: 1 }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '4px'
            }}>
              <h3 style={{
                fontSize: '16px',
                fontWeight: '500',
                margin: 0,
                color: 'var(--tg-theme-text-color)'
              }}>
                {habit.name}
              </h3>
              {habit.category && (
                <span style={{
                  fontSize: '11px',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  background: 'var(--tg-theme-secondary-bg-color)',
                  color: 'var(--tg-theme-hint-color)'
                }}>
                  {habit.category}
                </span>
              )}
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              fontSize: '12px',
              color: 'var(--tg-theme-hint-color)'
            }}>
              <span>
                Серия: {habit.streak} {habit.streak === 1 ? 'день' : habit.streak < 5 ? 'дня' : 'дней'} 🔥
              </span>
              {habit.goalDays && (
                <span>
                  Цель: {goalProgress.current}/{goalProgress.target}
                </span>
              )}
            </div>
          </div>
          <div style={{
            display: 'flex',
            gap: '4px',
            alignItems: 'center'
          }}>
            <button
              onClick={() => setShowEditModal(true)}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                border: 'none',
                background: 'var(--tg-theme-secondary-bg-color)',
                fontSize: '16px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background 0.2s'
              }}
              title="Редактировать"
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(51, 144, 236, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'var(--tg-theme-secondary-bg-color)';
              }}
            >
              ✏️
            </button>
            <button
              onClick={handleDeleteClick}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                border: 'none',
                background: 'var(--tg-theme-secondary-bg-color)',
                fontSize: '16px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background 0.2s'
              }}
              title="Удалить"
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 59, 48, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'var(--tg-theme-secondary-bg-color)';
              }}
            >
              🗑️
            </button>
          </div>
        </div>

        <LevelIndicator habit={habit} />

        {habit.goalDays && goalProgress.percentage < 100 && (
          <div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '12px',
              color: 'var(--tg-theme-hint-color)',
              marginBottom: '4px'
            }}>
              <span>Прогресс к цели</span>
              <span>{goalProgress.percentage}%</span>
            </div>
            <div style={{
              width: '100%',
              height: '8px',
              background: 'var(--tg-theme-secondary-bg-color)',
              borderRadius: '4px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${goalProgress.percentage}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #ff9800 0%, #f57c00 100%)',
                transition: 'width 0.3s ease'
              }} />
            </div>
          </div>
        )}

        <MonthCalendar 
          habit={habit}
          selectedDate={selectedDate}
          onDateClick={(dateKey, value) => {
            // При клике на дату просто выбираем её
            if (selectedDate === dateKey) {
              // Если кликнули на уже выбранную дату - снимаем выбор
              setSelectedDate('');
            } else {
              setSelectedDate(dateKey);
            }
          }}
        />

        {habit.unit && habit.targetValue && (
          (selectedDate && !isSelectedDateCompleted) || (!selectedDate && !isTodayCompleted)
        ) && (
          <div>
            <label style={{
              fontSize: '12px',
              color: 'var(--tg-theme-hint-color)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
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

        <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
          {selectedDate ? (
            <>
              <button
                className="tg-button"
                onClick={handleCheck}
                style={{ flex: 1 }}
                disabled={isSelectedDateCompleted}
              >
                {isSelectedDateCompleted 
                  ? `✓ Выполнено ${new Date(selectedDate).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}`
                  : `Отметить ${new Date(selectedDate).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}`
                }
              </button>
              <button
                onClick={handleCancel}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: '1px solid var(--tg-theme-button-color)',
                  background: 'transparent',
                  color: 'var(--tg-theme-button-color)',
                  fontSize: '16px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  minWidth: '60px'
                }}
              >
                Отменить
              </button>
            </>
          ) : (
            <button
              className="tg-button"
              onClick={handleCheck}
              style={{ flex: 1 }}
              disabled={isTodayCompleted}
            >
              {isTodayCompleted ? '✓ Выполнено сегодня' : 'Отметить сегодня'}
            </button>
          )}
          <button
            onClick={handleDeleteClick}
            style={{
              padding: '8px 16px',
              borderRadius: '10px',
              border: '1px solid var(--tg-theme-destructive-text-color)',
              background: 'transparent',
              color: 'var(--tg-theme-destructive-text-color)',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              minHeight: '36px',
              minWidth: '60px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background 0.2s'
            }}
            title="Удалить привычку"
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 59, 48, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
            }}
          >
            ✕
          </button>
        </div>

        <button
          onClick={() => setShowDetails(!showDetails)}
          className="tg-button"
          style={{
            width: '100%',
            background: showDetails 
              ? 'var(--tg-theme-secondary-bg-color)' 
              : 'var(--tg-theme-button-color)',
            color: showDetails 
              ? 'var(--tg-theme-text-color)' 
              : 'var(--tg-theme-button-text-color)',
            fontSize: '16px',
            fontWeight: '500'
          }}
        >
          {showDetails ? '▼ Скрыть детали' : '▶ Показать детали'}
        </button>

        {showDetails && (
          <div>
            <HabitStats habit={habit} />
            <HabitProgressBars habit={habit} period="week" />
            <HabitCharts habit={habit} />
          </div>
        )}
      </div>

      {showEditModal && (
        <EditHabitModal
          habit={habit}
          onSave={onUpdate}
          onClose={() => setShowEditModal(false)}
        />
      )}

      {showHistoryModal && (
        <EditHistoryModal
          habit={habit}
          onSave={onHistoryUpdate}
          onClose={() => {
            setShowHistoryModal(false);
            setSelectedHistoryDate('');
          }}
          initialDate={selectedHistoryDate}
        />
      )}

    </>
  );
}
