export type Period = 'day' | 'week' | 'month' | 'year';

interface PeriodSelectorProps {
  value: Period;
  onChange: (period: Period) => void;
}

const periods: { value: Period; label: string; icon: string }[] = [
  { value: 'day', label: 'День', icon: '📅' },
  { value: 'week', label: 'Неделя', icon: '📆' },
  { value: 'month', label: 'Месяц', icon: '🗓️' },
  { value: 'year', label: 'Год', icon: '📊' }
];

export default function PeriodSelector({ value, onChange }: PeriodSelectorProps) {
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
      msOverflowStyle: 'none'
    }}>
      {periods.map((period) => (
        <button
          key={period.value}
          onClick={() => onChange(period.value)}
          onTouchEnd={(e) => {
            e.preventDefault();
            onChange(period.value);
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
            whiteSpace: 'nowrap'
          }}
        >
          <span style={{ fontSize: '18px' }}>{period.icon}</span>
          <span>{period.label}</span>
        </button>
      ))}
    </div>
  );
}

/**
 * Получить даты начала и конца для периода
 * Использует локальное время для корректной работы с датами транзакций
 */
export function getPeriodDates(period: Period): { start: number; end: number } {
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
  }

  return { start, end };
}

/**
 * Фильтровать транзакции по периоду
 */
export function filterTransactionsByPeriod<T extends { date: number }>(
  transactions: T[],
  period: Period
): T[] {
  const { start, end } = getPeriodDates(period);
  console.log('[filterTransactionsByPeriod] Filtering transactions:', {
    period,
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

