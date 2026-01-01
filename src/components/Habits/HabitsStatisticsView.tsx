import { Habit } from '../../utils/storage';
import HabitCharts from './HabitCharts';
import HabitProgressBars from './HabitProgressBars';
import HabitStats from './HabitStats';

interface HabitsStatisticsViewProps {
  habits: Habit[];
}

export default function HabitsStatisticsView({ habits }: HabitsStatisticsViewProps) {
  if (habits.length === 0) {
    return (
      <div style={{
        padding: '40px 20px',
        textAlign: 'center',
        color: 'var(--tg-theme-hint-color)'
      }}>
        Нет привычек для отображения статистики
      </div>
    );
  }

  return (
    <div style={{
      background: 'var(--tg-theme-section-bg-color)',
      padding: '20px 16px',
      paddingBottom: '40px'
    }}>
      {habits.map((habit) => (
        <div
          key={habit.id}
          style={{
            marginBottom: '32px',
            padding: '20px',
            background: 'var(--tg-theme-bg-color)',
            borderRadius: '12px',
            border: '1px solid var(--tg-theme-secondary-bg-color)'
          }}
        >
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '16px'
          }}>
            <span style={{ fontSize: '32px' }}>{habit.icon || '🔥'}</span>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: 'var(--tg-theme-text-color)',
              margin: 0
            }}>
              {habit.name}
            </h3>
          </div>
          
          <HabitStats habit={habit} />
          <HabitProgressBars habit={habit} period="week" />
          <HabitCharts habit={habit} />
        </div>
      ))}
    </div>
  );
}

