import { useState } from 'react';
import { Habit } from '../../utils/storage';

interface MonthCalendarProps {
  habit: Habit;
  selectedDate?: string;
  onDateClick: (date: string, value?: number) => void;
}

export default function MonthCalendar({ habit, selectedDate, onDateClick }: MonthCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
  const monthNames = [
    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
  ];

  const getDaysInMonth = (year: number, month: number) => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = (firstDay.getDay() + 6) % 7; // Понедельник = 0

    const days = [];
    
    // Пустые ячейки для дней предыдущего месяца
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Дни текущего месяца
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateKey = date.toISOString().split('T')[0];
      const historyEntry = habit.history[dateKey];
      const isCompleted = historyEntry?.completed || false;
      const today = new Date();
      const isToday = date.toDateString() === today.toDateString();
      
      days.push({
        day,
        date,
        dateKey,
        isCompleted,
        isToday,
        value: historyEntry?.value
      });
    }

    return days;
  };

  const days = getDaysInMonth(currentYear, currentMonth);
  const today = new Date();

  const goToPreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const goToToday = () => {
    setCurrentMonth(today.getMonth());
    setCurrentYear(today.getFullYear());
  };

  const handleDateClick = (day: typeof days[0]) => {
    if (!day) return;
    
    const date = new Date(day.date);
    const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const isPastDate = date < todayDate;
    const isToday = date.toDateString() === today.toDateString();
    
    // Разрешаем клик на любую дату (прошлую, сегодня, будущую)
    // Но будущие даты будут disabled визуально
    if (!isPastDate && !isToday) {
      // Будущие даты - не обрабатываем
      return;
    }
    
    // Для прошлых дат и сегодня - вызываем callback
    onDateClick(day.dateKey, day.value);
  };

  return (
    <div style={{ marginTop: '16px', marginBottom: '16px' }}>
      {/* Навигация по месяцам */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '12px',
        padding: '0 4px'
      }}>
        <button
          onClick={goToPreviousMonth}
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            border: 'none',
            background: 'var(--tg-theme-secondary-bg-color)',
            color: 'var(--tg-theme-text-color)',
            fontSize: '18px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          title="Предыдущий месяц"
        >
          ‹
        </button>
        
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '4px',
          flex: 1
        }}>
          <span style={{
            fontSize: '18px',
            fontWeight: '600',
            color: 'var(--tg-theme-text-color)'
          }}>
            {monthNames[currentMonth]} {currentYear}
          </span>
          {(currentMonth !== today.getMonth() || currentYear !== today.getFullYear()) && (
            <button
              onClick={goToToday}
              style={{
                fontSize: '12px',
                color: 'var(--tg-theme-hint-color)',
                background: 'transparent',
                border: '1px solid var(--tg-theme-hint-color)',
                borderRadius: '6px',
                cursor: 'pointer',
                padding: '4px 12px'
              }}
            >
              Сегодня
            </button>
          )}
        </div>

        <button
          onClick={goToNextMonth}
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            border: 'none',
            background: 'var(--tg-theme-secondary-bg-color)',
            color: 'var(--tg-theme-text-color)',
            fontSize: '18px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          title="Следующий месяц"
          disabled={currentMonth === today.getMonth() && currentYear === today.getFullYear()}
        >
          ›
        </button>
      </div>

      {/* Дни недели */}
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
            padding: '4px',
            fontWeight: '500'
          }}>
            {day}
          </div>
        ))}
      </div>

      {/* Календарь */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        gap: '4px'
      }}>
        {days.map((day, index) => {
          if (!day) {
            return (
              <div
                key={`empty-${index}`}
                style={{
                  aspectRatio: '1',
                  borderRadius: '4px'
                }}
              />
            );
          }

          const isPastDate = day.date < new Date(today.getFullYear(), today.getMonth(), today.getDate());
          const isFutureDate = day.date > new Date(today.getFullYear(), today.getMonth(), today.getDate());
          const isSelected = selectedDate === day.dateKey;

          return (
            <button
              key={day.dateKey}
              onClick={() => handleDateClick(day)}
              className={`calendar-day ${day.isCompleted ? 'completed' : ''}`}
              style={{
                aspectRatio: '1',
                borderRadius: '4px',
                border: isSelected 
                  ? '2px solid var(--tg-theme-accent-text-color)' 
                  : day.isToday 
                  ? '2px solid var(--tg-theme-button-color)' 
                  : 'none',
                background: isSelected
                  ? 'rgba(51, 144, 236, 0.2)'
                  : day.isCompleted 
                  ? 'var(--tg-theme-button-color)' 
                  : 'var(--tg-theme-secondary-bg-color)',
                color: day.isCompleted 
                  ? 'var(--tg-theme-button-text-color)' 
                  : 'var(--tg-theme-text-color)',
                fontSize: '12px',
                fontWeight: (isSelected || day.isToday) ? '600' : '400',
                cursor: isFutureDate ? 'not-allowed' : 'pointer',
                opacity: isFutureDate ? 0.3 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 0,
                transition: 'all 0.2s'
              }}
              disabled={isFutureDate}
              title={day.dateKey + (day.value ? `: ${day.value} ${habit.unit || ''}` : '')}
            >
              {day.day}
            </button>
          );
        })}
      </div>
    </div>
  );
}

