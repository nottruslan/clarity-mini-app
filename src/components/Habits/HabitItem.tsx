import { Habit } from '../../utils/storage';

interface HabitItemProps {
  habit: Habit;
  onCheck: () => void;
}

export default function HabitItem({ habit, onCheck }: HabitItemProps) {
  // Генерируем календарь за последние 30 дней
  const getCalendarDays = () => {
    const days = [];
    const today = new Date();
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateKey = date.toISOString().split('T')[0];
      const isCompleted = habit.history[dateKey] || false;
      const isToday = i === 0;
      
      days.push({
        date: date,
        dateKey,
        isCompleted,
        isToday
      });
    }
    
    return days;
  };

  const calendarDays = getCalendarDays();
  const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

  // Вычисляем streak
  const calculateStreak = () => {
    let streak = 0;
    const today = new Date();
    
    for (let i = 0; i < 365; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateKey = date.toISOString().split('T')[0];
      
      if (habit.history[dateKey]) {
        streak++;
      } else if (i > 0) {
        break;
      }
    }
    
    return streak;
  };

  const streak = calculateStreak();

  return (
    <div style={{
      background: 'var(--tg-theme-section-bg-color)',
      borderBottom: '1px solid var(--tg-theme-secondary-bg-color)',
      padding: '16px'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '16px'
      }}>
        <span style={{ fontSize: '32px' }}>{habit.icon || '🔥'}</span>
        <div style={{ flex: 1 }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: '500',
            marginBottom: '4px'
          }}>
            {habit.name}
          </h3>
          <p style={{
            fontSize: '14px',
            color: 'var(--tg-theme-hint-color)'
          }}>
            Серия: {streak} {streak === 1 ? 'день' : streak < 5 ? 'дня' : 'дней'} 🔥
          </p>
        </div>
      </div>

      <div style={{ marginBottom: '16px' }}>
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
                title={day.dateKey}
              >
                {day.date.getDate()}
              </div>
            );
          })}
        </div>
      </div>

      <button
        className="tg-button"
        onClick={onCheck}
        style={{ width: '100%' }}
      >
        Отметить сегодня
      </button>
    </div>
  );
}

