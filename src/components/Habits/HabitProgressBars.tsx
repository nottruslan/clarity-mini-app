import { Habit } from '../../utils/storage';
import { generateWeekData, generateMonthData } from '../../utils/habitVisualization';

interface HabitProgressBarsProps {
  habit: Habit;
  period?: 'week' | 'month';
}

export default function HabitProgressBars({ habit, period = 'week' }: HabitProgressBarsProps) {
  const data = period === 'week' ? generateWeekData(habit, 4) : generateMonthData(habit, 6);

  return (
    <div style={{ marginTop: '16px' }}>
      <h4 style={{ 
        fontSize: '14px', 
        fontWeight: '600', 
        marginBottom: '12px',
        color: 'var(--tg-theme-text-color)'
      }}>
        Прогресс по {period === 'week' ? 'неделям' : 'месяцам'}
      </h4>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {data.map((item, index) => (
          <div key={index}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '4px',
              fontSize: '12px'
            }}>
              <span style={{ color: 'var(--tg-theme-text-color)' }}>
                {period === 'week' ? `Неделя ${item.week}` : `Месяц ${item.week}`}
              </span>
              <span style={{ color: 'var(--tg-theme-hint-color)' }}>
                {item.completed}/{item.total} ({item.percentage}%)
              </span>
            </div>
            <div style={{
              width: '100%',
              height: '8px',
              background: 'var(--tg-theme-secondary-bg-color)',
              borderRadius: '4px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${item.percentage}%`,
                height: '100%',
                background: item.percentage === 100 
                  ? 'linear-gradient(90deg, #4caf50 0%, #45a049 100%)'
                  : 'linear-gradient(90deg, #3390ec 0%, #1e6bc7 100%)',
                transition: 'width 0.3s ease',
                borderRadius: '4px'
              }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

