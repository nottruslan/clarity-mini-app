export type Period = 'day' | 'week' | 'month' | 'year' | 'date';

interface PeriodSelectorProps {
  value: Period;
  onChange: (period: Period) => void;
  selectedDate?: string; // YYYY-MM-DD format
  onDateChange?: (date: string) => void;
}

const periods: { value: Period; label: string; icon: string }[] = [
  { value: 'day', label: 'День', icon: '📅' },
  { value: 'week', label: 'Неделя', icon: '📆' },
  { value: 'month', label: 'Месяц', icon: '🗓️' },
  { value: 'year', label: 'Год', icon: '📊' },
  { value: 'date', label: 'Дата', icon: '📌' }
];

// Функция для форматирования даты в YYYY-MM-DD в локальном времени
const formatDateToInput = (timestamp: number): string => {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default function PeriodSelector({ value, onChange, selectedDate, onDateChange }: PeriodSelectorProps) {
  // Если выбран период 'date', используем selectedDate или текущую дату
  const dateValue = value === 'date' 
    ? (selectedDate || formatDateToInput(Date.now()))
    : formatDateToInput(Date.now());

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onDateChange) {
      onDateChange(e.target.value);
    }
  };

  const handlePeriodChange = (period: Period) => {
    onChange(period);
    // При выборе периода 'date', инициализируем дату текущей датой, если она еще не задана
    if (period === 'date' && onDateChange && !selectedDate) {
      onDateChange(formatDateToInput(Date.now()));
    }
  };

  return (
    <div style={{
      display: 'flex',
      gap: '8px',
      padding: '8px',
      backgroundColor: 'var(--tg-theme-secondary-bg-color)',
      borderRadius: '12px',
      overflowX: 'auto' as const,
      WebkitOverflowScrolling: 'touch' as any,
      scrollbarWidth: 'none',
      msOverflowStyle: 'none',
      alignItems: 'center'
    }}>
      {periods.map((period) => {
        // Если это период 'date' и он выбран, показываем input вместо кнопки
        if (period.value === 'date' && value === 'date') {
          return (
            <input
              key={period.value}
              type="date"
              value={dateValue}
              onChange={handleDateChange}
              style={{
                minWidth: '140px',
                padding: '10px 12px',
                borderRadius: '8px',
                border: '2px solid var(--tg-theme-button-color)',
                backgroundColor: 'var(--tg-theme-button-color)',
                color: 'var(--tg-theme-button-text-color)',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                flex: '0 0 auto',
                touchAction: 'manipulation',
                WebkitTapHighlightColor: 'transparent'
              }}
            />
          );
        }
        
        return (
          <button
            key={period.value}
            onClick={() => handlePeriodChange(period.value)}
            onTouchEnd={(e) => {
              e.preventDefault();
              handlePeriodChange(period.value);
            }}
            style={{
              flex: '1 1 0',
              minWidth: '70px',
              padding: '10px 16px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: value === period.value
                ? 'var(--tg-theme-button-color)'
                : 'transparent',
              color: value === period.value
                ? 'var(--tg-theme-button-text-color)'
                : 'var(--tg-theme-text-color)',
              fontSize: '14px',
              fontWeight: value === period.value ? '600' : '500',
              cursor: 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              touchAction: 'manipulation',
              WebkitTapHighlightColor: 'transparent',
              whiteSpace: 'nowrap',
              flexShrink: 0
            }}
          >
            <span style={{ fontSize: '18px' }}>{period.icon}</span>
            <span>{period.label}</span>
          </button>
        );
      })}
    </div>
  );
}

/**
 * Получить даты начала и конца для периода
 * Использует локальное время для корректной работы с датами транзакций
 */
export function getPeriodDates(period: Period, selectedDate?: string): { start: number; end: number } {
  const now = new Date();
  
  // Получаем компоненты локальной даты для корректной работы с часовым поясом
  const getLocalDate = (year: number, month: number, day: number, hour = 0, minute = 0, second = 0, ms = 0) => {
    const date = new Date(year, month, day, hour, minute, second, ms);
    return date.getTime();
  };

  let start: number;
  let end: number;

  switch (period) {
    case 'day':
      start = getLocalDate(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
      end = getLocalDate(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
      break;
    case 'week':
      const dayOfWeek = now.getDay();
      const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // Понедельник
      const weekStart = new Date(now.getFullYear(), now.getMonth(), diff);
      const weekEnd = new Date(now.getFullYear(), now.getMonth(), diff + 6);
      start = getLocalDate(weekStart.getFullYear(), weekStart.getMonth(), weekStart.getDate(), 0, 0, 0, 0);
      end = getLocalDate(weekEnd.getFullYear(), weekEnd.getMonth(), weekEnd.getDate(), 23, 59, 59, 999);
      break;
    case 'month':
      start = getLocalDate(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
      // Последний день месяца
      const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
      end = getLocalDate(now.getFullYear(), now.getMonth(), lastDay, 23, 59, 59, 999);
      break;
    case 'year':
      // Период "Год" означает последние 12 месяцев от текущей даты
      // Это более практично для финансового анализа, чем календарный год
      const endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
      const startDate = new Date(endDate);
      startDate.setMonth(startDate.getMonth() - 11); // 11 месяцев назад + текущий месяц = 12 месяцев
      startDate.setDate(1); // Первый день начального месяца
      startDate.setHours(0, 0, 0, 0);
      start = startDate.getTime();
      end = endDate.getTime();
      break;
    case 'date':
      // Период "Дата" - выбор конкретной даты
      if (selectedDate) {
        const [year, month, day] = selectedDate.split('-').map(Number);
        const selectedDateObj = new Date(year, month - 1, day);
        start = getLocalDate(year, month - 1, day, 0, 0, 0, 0);
        end = getLocalDate(year, month - 1, day, 23, 59, 59, 999);
      } else {
        // Если дата не выбрана, используем текущую дату
        start = getLocalDate(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
        end = getLocalDate(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
      }
      break;
    default:
      // Fallback на текущий день, если период не распознан
      start = getLocalDate(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
      end = getLocalDate(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
      break;
  }

  return { start, end };
}

/**
 * Фильтровать транзакции по периоду
 */
export function filterTransactionsByPeriod<T extends { date: number }>(
  transactions: T[],
  period: Period,
  selectedDate?: string
): T[] {
  const { start, end } = getPeriodDates(period, selectedDate);
  console.log('[filterTransactionsByPeriod] Filtering transactions:', {
    period,
    selectedDate,
    startDate: new Date(start).toISOString(),
    endDate: new Date(end).toISOString(),
    inputCount: transactions.length,
    transactions: transactions.map((t, index) => ({
      index,
      date: new Date(t.date).toISOString(),
      timestamp: t.date,
      inRange: t.date >= start && t.date <= end
    }))
  });
  const filtered = transactions.filter(t => t.date >= start && t.date <= end);
  console.log('[filterTransactionsByPeriod] Filtered result:', {
    filteredCount: filtered.length,
    filteredDates: filtered.map(t => new Date(t.date).toISOString())
  });
  return filtered;
}

