import { useState } from 'react';
import { Habit } from '../../utils/storage';
import MonthCalendar from './MonthCalendar';
import HabitHeatmap from './HabitHeatmap';

interface HabitsCalendarViewProps {
  habits: Habit[];
}

export default function HabitsCalendarView({ habits }: HabitsCalendarViewProps) {
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(habits.length > 0 ? habits[0] : null);
  const [viewType, setViewType] = useState<'calendar' | 'heatmap'>('calendar');

  if (habits.length === 0) {
    return (
      <div style={{
        padding: '40px 20px',
        textAlign: 'center',
        color: 'var(--tg-theme-hint-color)'
      }}>
        Нет привычек для отображения календаря
      </div>
    );
  }

  return (
    <div style={{
      background: 'var(--tg-theme-section-bg-color)',
      padding: '20px 16px',
      paddingBottom: '40px'
    }}>
      {/* Переключатель типа представления */}
      <div style={{
        display: 'flex',
        gap: '8px',
        marginBottom: '20px',
        backgroundColor: 'var(--tg-theme-secondary-bg-color)',
        borderRadius: '12px',
        padding: '4px'
      }}>
        <button
          onClick={() => setViewType('calendar')}
          style={{
            flex: 1,
            padding: '10px 8px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: viewType === 'calendar'
              ? 'var(--tg-theme-button-color)'
              : 'transparent',
            color: viewType === 'calendar'
              ? 'var(--tg-theme-button-text-color)'
              : 'var(--tg-theme-text-color)',
            fontSize: '14px',
            fontWeight: viewType === 'calendar' ? '600' : '400',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          Календарь
        </button>
        <button
          onClick={() => setViewType('heatmap')}
          style={{
            flex: 1,
            padding: '10px 8px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: viewType === 'heatmap'
              ? 'var(--tg-theme-button-color)'
              : 'transparent',
            color: viewType === 'heatmap'
              ? 'var(--tg-theme-button-text-color)'
              : 'var(--tg-theme-text-color)',
            fontSize: '14px',
            fontWeight: viewType === 'heatmap' ? '600' : '400',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          Тепловая карта
        </button>
      </div>

      {/* Выбор привычки */}
      {habits.length > 1 && (
        <div style={{
          marginBottom: '20px',
          overflowX: 'auto',
          WebkitOverflowScrolling: 'touch'
        }}>
          <div style={{
            display: 'flex',
            gap: '8px',
            minWidth: 'max-content'
          }}>
            {habits.map((habit) => (
              <button
                key={habit.id}
                onClick={() => setSelectedHabit(habit)}
                style={{
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: `2px solid ${selectedHabit?.id === habit.id ? 'var(--tg-theme-button-color)' : 'var(--tg-theme-secondary-bg-color)'}`,
                  background: selectedHabit?.id === habit.id
                    ? 'rgba(51, 144, 236, 0.1)'
                    : 'var(--tg-theme-bg-color)',
                  color: 'var(--tg-theme-text-color)',
                  fontSize: '14px',
                  fontWeight: selectedHabit?.id === habit.id ? '600' : '400',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <span>{habit.icon || '🔥'}</span>
                <span>{habit.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Отображение календаря или тепловой карты */}
      {selectedHabit && (
        <div style={{
          background: 'var(--tg-theme-bg-color)',
          borderRadius: '12px',
          padding: '20px',
          border: '1px solid var(--tg-theme-secondary-bg-color)'
        }}>
          {viewType === 'calendar' ? (
            <MonthCalendar
              habit={selectedHabit}
              onDateClick={() => {}}
            />
          ) : (
            <HabitHeatmap habit={selectedHabit} days={365} />
          )}
        </div>
      )}
    </div>
  );
}

