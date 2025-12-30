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
 */
export function getPeriodDates(period: Period): { start: number; end: number } {
  const now = new Date();
  const start = new Date();
  const end = new Date();

  switch (period) {
    case 'day':
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      break;
    case 'week':
      const dayOfWeek = now.getDay();
      const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // Понедельник
      start.setDate(diff);
      start.setHours(0, 0, 0, 0);
      end.setDate(diff + 6);
      end.setHours(23, 59, 59, 999);
      break;
    case 'month':
      start.setDate(1);
      start.setHours(0, 0, 0, 0);
      end.setMonth(now.getMonth() + 1, 0);
      end.setHours(23, 59, 59, 999);
      break;
    case 'year':
      start.setMonth(0, 1);
      start.setHours(0, 0, 0, 0);
      end.setMonth(11, 31);
      end.setHours(23, 59, 59, 999);
      break;
  }

  return {
    start: start.getTime(),
    end: end.getTime()
  };
}

/**
 * Фильтровать транзакции по периоду
 */
export function filterTransactionsByPeriod<T extends { date: number }>(
  transactions: T[],
  period: Period
): T[] {
  const { start, end } = getPeriodDates(period);
  return transactions.filter(t => t.date >= start && t.date <= end);
}

