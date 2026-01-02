export type Period = 'day' | 'week' | 'month' | 'year' | 'date';

interface PeriodSelectorProps {
  value: Period;
  onChange: (period: Period) => void;
  startDate?: string; // YYYY-MM-DD format
  endDate?: string; // YYYY-MM-DD format
  onDateRangeChange?: (startDate: string, endDate: string) => void;
}

const periods: { value: Period; label: string; icon: string }[] = [
  { value: 'day', label: 'День', icon: '📅' },
  { value: 'week', label: 'Неделя', icon: '📆' },
  { value: 'month', label: 'Месяц', icon: '🗓️' },
  { value: 'year', label: 'Год', icon: '📊' },
  { value: 'date', label: 'Выбрать...', icon: '📌' }
];

// Функция для форматирования даты в YYYY-MM-DD в локальном времени
const formatDateToInput = (timestamp: number): string => {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default function PeriodSelector({ value, onChange, startDate, endDate, onDateRangeChange }: PeriodSelectorProps) {
  // Если выбран период 'date', используем startDate/endDate или текущую дату
  const currentDate = formatDateToInput(Date.now());
  const startDateValue = value === 'date' 
    ? (startDate || currentDate)
    : currentDate;
  const endDateValue = value === 'date' 
    ? (endDate || currentDate)
    : currentDate;

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onDateRangeChange) {
      onDateRangeChange(e.target.value, endDateValue);
    }
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onDateRangeChange) {
      onDateRangeChange(startDateValue, e.target.value);
    }
  };

  const handlePeriodChange = (period: Period) => {
    onChange(period);
    // При выборе периода 'date', инициализируем обе даты текущей датой, если они еще не заданы
    if (period === 'date' && onDateRangeChange && (!startDate || !endDate)) {
      const today = formatDateToInput(Date.now());
      onDateRangeChange(today, today);
    }
  };

  return (
    <div style={{
      display: 'flex',
      gap: '4px',
      padding: '6px',
      backgroundColor: 'var(--tg-theme-secondary-bg-color)',
      borderRadius: '12px',
      alignItems: 'center',
      flexWrap: 'nowrap'
    }}>
      {periods.map((period) => {
        // Если это период 'date' и он выбран, показываем два input вместо кнопки
        if (period.value === 'date' && value === 'date') {
          return (
            <div
              key={period.value}
              style={{
                display: 'flex',
                gap: '3px',
                alignItems: 'center',
                flex: '1 1 0',
                minWidth: 0
              }}
            >
              <input
                type="date"
                value={startDateValue}
                onChange={handleStartDateChange}
                style={{
                  flex: '1 1 0',
                  minWidth: 0,
                  width: 0,
                  padding: '4px 6px',
                  borderRadius: '8px',
                  border: '2px solid var(--tg-theme-button-color)',
                  backgroundColor: 'var(--tg-theme-button-color)',
                  color: 'var(--tg-theme-button-text-color)',
                  fontSize: '10px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  touchAction: 'manipulation',
                  WebkitTapHighlightColor: 'transparent',
                  boxSizing: 'border-box'
                }}
              />
              <span style={{ 
                fontSize: '10px', 
                color: 'var(--tg-theme-hint-color)',
                whiteSpace: 'nowrap',
                flexShrink: 0
              }}>
                —
              </span>
              <input
                type="date"
                value={endDateValue}
                onChange={handleEndDateChange}
                style={{
                  flex: '1 1 0',
                  minWidth: 0,
                  width: 0,
                  padding: '4px 6px',
                  borderRadius: '8px',
                  border: '2px solid var(--tg-theme-button-color)',
                  backgroundColor: 'var(--tg-theme-button-color)',
                  color: 'var(--tg-theme-button-text-color)',
                  fontSize: '10px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  touchAction: 'manipulation',
                  WebkitTapHighlightColor: 'transparent',
                  boxSizing: 'border-box'
                }}
              />
            </div>
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
              minWidth: '55px',
              padding: '6px 10px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: value === period.value
                ? 'var(--tg-theme-button-color)'
                : 'transparent',
              color: value === period.value
                ? 'var(--tg-theme-button-text-color)'
                : 'var(--tg-theme-text-color)',
              fontSize: '12px',
              fontWeight: value === period.value ? '600' : '500',
              cursor: 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '2px',
              touchAction: 'manipulation',
              WebkitTapHighlightColor: 'transparent',
              whiteSpace: 'nowrap',
              flexShrink: 0
            }}
          >
            <span style={{ fontSize: '16px' }}>{period.icon}</span>
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
export function getPeriodDates(period: Period, startDate?: string, endDate?: string): { start: number; end: number } {
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
      const endDateYear = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
      const startDateYear = new Date(endDateYear);
      startDateYear.setMonth(startDateYear.getMonth() - 11); // 11 месяцев назад + текущий месяц = 12 месяцев
      startDateYear.setDate(1); // Первый день начального месяца
      startDateYear.setHours(0, 0, 0, 0);
      start = startDateYear.getTime();
      end = endDateYear.getTime();
      break;
    case 'date':
      // Период "Выбрать..." - выбор диапазона дат (от и до)
      if (startDate && endDate) {
        const [startYear, startMonth, startDay] = startDate.split('-').map(Number);
        const [endYear, endMonth, endDay] = endDate.split('-').map(Number);
        
        // Используем диапазон от startDate (00:00:00) до endDate (23:59:59)
        start = getLocalDate(startYear, startMonth - 1, startDay, 0, 0, 0, 0);
        end = getLocalDate(endYear, endMonth - 1, endDay, 23, 59, 59, 999);
      } else if (startDate) {
        // Если указана только начальная дата, используем один день
        const [year, month, day] = startDate.split('-').map(Number);
        start = getLocalDate(year, month - 1, day, 0, 0, 0, 0);
        end = getLocalDate(year, month - 1, day, 23, 59, 59, 999);
      } else {
        // Если даты не выбраны, используем текущую дату
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
  startDate?: string,
  endDate?: string
): T[] {
  const { start, end } = getPeriodDates(period, startDate, endDate);
  console.log('[filterTransactionsByPeriod] Filtering transactions:', {
    period,
    startDate,
    endDate,
    computedStartDate: new Date(start).toISOString(),
    computedEndDate: new Date(end).toISOString(),
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

