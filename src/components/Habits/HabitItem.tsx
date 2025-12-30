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
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedHistoryDate, setSelectedHistoryDate] = useState<string>('');
  const [inputValue, setInputValue] = useState<string>('');

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
              onClick={() => setShowDeleteConfirm(true)}
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

        <MonthCalendar 
          habit={habit}
          onDateClick={(dateKey, value) => {
            // При клике на дату открываем модальное окно редактирования истории
            setSelectedHistoryDate(dateKey);
            setShowHistoryModal(true);
          }}
        />

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
          className="tg-button"
          style={{
            width: '100%',
            background: showDetails 
              ? 'var(--tg-theme-secondary-bg-color)' 
              : 'var(--tg-theme-button-color)',
            color: showDetails 
              ? 'var(--tg-theme-text-color)' 
              : 'var(--tg-theme-button-text-color)',
            fontSize: '15px',
            fontWeight: '500'
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
          onClose={() => {
            setShowHistoryModal(false);
            setSelectedHistoryDate('');
          }}
          initialDate={selectedHistoryDate}
        />
      )}

      {showDeleteConfirm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000,
          padding: '20px'
        }} onClick={() => setShowDeleteConfirm(false)}>
          <div style={{
            background: 'var(--tg-theme-bg-color)',
            borderRadius: '16px',
            padding: '20px',
            maxWidth: '320px',
            width: '100%',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
          }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              marginBottom: '12px',
              color: 'var(--tg-theme-text-color)'
            }}>
              Удалить привычку?
            </h3>
            <p style={{
              fontSize: '14px',
              color: 'var(--tg-theme-hint-color)',
              marginBottom: '20px',
              lineHeight: '1.5'
            }}>
              Вы уверены, что хотите удалить "{habit.name}"? Это действие нельзя отменить.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                className="tg-button"
                onClick={() => {
                  onDelete();
                  setShowDeleteConfirm(false);
                }}
                style={{
                  flex: 1,
                  background: 'var(--tg-theme-destructive-text-color)',
                  color: 'white'
                }}
              >
                Удалить
              </button>
              <button
                className="tg-button"
                onClick={() => setShowDeleteConfirm(false)}
                style={{
                  flex: 1,
                  background: 'var(--tg-theme-secondary-bg-color)',
                  color: 'var(--tg-theme-text-color)'
                }}
              >
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
