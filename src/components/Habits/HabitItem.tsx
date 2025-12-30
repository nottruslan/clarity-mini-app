import { useState } from 'react';
import { Habit } from '../../utils/storage';
import LevelIndicator from './LevelIndicator';
import HabitHeatmap from './HabitHeatmap';
import HabitCharts from './HabitCharts';
import HabitProgressBars from './HabitProgressBars';
import HabitStats from './HabitStats';
import { calculateGoalProgress } from '../../utils/habitCalculations';
import EditHabitModal from './EditHabitModal';
import EditHistoryModal from './EditHistoryModal';

interface HabitItemProps {
  habit: Habit;
  onCheck: (value?: number) => void;
  onUpdate: (updates: Partial<Habit>) => void;
  onHistoryUpdate: (history: Habit['history']) => void;
}

export default function HabitItem({ habit, onCheck, onUpdate, onHistoryUpdate }: HabitItemProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [inputValue, setInputValue] = useState<string>('');

  // Генерируем календарь за последние 30 дней
  const getCalendarDays = () => {
    const days = [];
    const today = new Date();
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateKey = date.toISOString().split('T')[0];
      const historyEntry = habit.history[dateKey];
      const isCompleted = historyEntry?.completed || false;
      const isToday = i === 0;
      
      days.push({
        date: date,
        dateKey,
        isCompleted,
        isToday,
        value: historyEntry?.value
      });
    }
    
    return days;
  };

  const calendarDays = getCalendarDays();
  const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
  const goalProgress = calculateGoalProgress(habit);

  const handleCheck = () => {
    if (habit.unit && habit.targetValue) {
      // Если есть единица измерения, нужно ввести значение
      const value = inputValue ? parseFloat(inputValue) : undefined;
      onCheck(value);
      setInputValue('');
    } else {
      onCheck();
    }
  };

  const today = new Date().toISOString().split('T')[0];
  const isTodayCompleted = habit.history[today]?.completed || false;

  return (
    <>
      <div style={{
        background: 'var(--tg-theme-section-bg-color)',
        borderBottom: '1px solid var(--tg-theme-secondary-bg-color)',
        padding: '16px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '12px'
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
                fontSize: '18px',
                fontWeight: '500',
                margin: 0
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
              fontSize: '14px',
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
              justifyContent: 'center'
            }}
            title="Редактировать"
          >
            ✏️
          </button>
        </div>

        <LevelIndicator habit={habit} />

        {habit.goalDays && goalProgress.percentage < 100 && (
          <div style={{ marginTop: '12px' }}>
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
              height: '6px',
              background: 'var(--tg-theme-secondary-bg-color)',
              borderRadius: '3px',
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

        <div style={{ marginTop: '16px', marginBottom: '16px' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: '4px',
            marginBottom: '8px'
          }}>
            {weekDays.map((day) => (
              <div key={day} style={{
                textAlign: 'center',
                fontSize: '12px',
                color: 'var(--tg-theme-hint-color)',
                padding: '4px'
              }}>
                {day}
              </div>
            ))}
          </div>
          <div className="habit-calendar">
            {calendarDays.map((day) => {
              return (
                <div
                  key={day.dateKey}
                  className={`calendar-day ${day.isCompleted ? 'completed' : ''}`}
                  style={{
                    opacity: day.isToday ? 1 : day.isCompleted ? 1 : 0.3,
                    border: day.isToday ? '2px solid var(--tg-theme-button-color)' : 'none'
                  }}
                  title={day.dateKey + (day.value ? `: ${day.value} ${habit.unit || ''}` : '')}
                >
                  {day.date.getDate()}
                </div>
              );
            })}
          </div>
        </div>

        {habit.unit && habit.targetValue && !isTodayCompleted && (
          <div style={{ marginBottom: '12px' }}>
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

        <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
          <button
            className="tg-button"
            onClick={handleCheck}
            style={{ flex: 1 }}
            disabled={isTodayCompleted}
          >
            {isTodayCompleted ? '✓ Выполнено сегодня' : 'Отметить сегодня'}
          </button>
          <button
            onClick={() => setShowHistoryModal(true)}
            style={{
              padding: '12px',
              borderRadius: '10px',
              border: 'none',
              background: 'var(--tg-theme-secondary-bg-color)',
              color: 'var(--tg-theme-text-color)',
              fontSize: '14px',
              cursor: 'pointer',
              minWidth: '44px'
            }}
            title="Редактировать историю"
          >
            📅
          </button>
        </div>

        <button
          onClick={() => setShowDetails(!showDetails)}
          style={{
            width: '100%',
            padding: '8px',
            borderRadius: '8px',
            border: 'none',
            background: 'var(--tg-theme-secondary-bg-color)',
            color: 'var(--tg-theme-text-color)',
            fontSize: '14px',
            cursor: 'pointer'
          }}
        >
          {showDetails ? '▼ Скрыть детали' : '▶ Показать детали'}
        </button>

        {showDetails && (
          <div style={{ marginTop: '16px' }}>
            <HabitStats habit={habit} />
            <HabitProgressBars habit={habit} period="week" />
            <HabitHeatmap habit={habit} days={365} />
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
          onClose={() => setShowHistoryModal(false)}
        />
      )}
    </>
  );
}
