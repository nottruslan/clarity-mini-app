import { useState } from 'react';
import DateRangeBottomSheet from './DateRangeBottomSheet';

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

// Функция для форматирования диапазона дат для отображения (DD.MM - DD.MM)
const formatDateRangeForDisplay = (startDate?: string, endDate?: string): string => {
  if (!startDate || !endDate) {
    return 'Дата';
  }

  try {
    const [startYear, startMonth, startDay] = startDate.split('-').map(Number);
    const [endYear, endMonth, endDay] = endDate.split('-').map(Number);
    
    const startFormatted = `${String(startDay).padStart(2, '0')}.${String(startMonth).padStart(2, '0')}`;
    const endFormatted = `${String(endDay).padStart(2, '0')}.${String(endMonth).padStart(2, '0')}`;
    
    return `${startFormatted} - ${endFormatted}`;
  } catch (e) {
    return 'Дата';
  }
};

export default function PeriodSelector({ value, onChange, startDate, endDate, onDateRangeChange }: PeriodSelectorProps) {
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handlePeriodChange = (period: Period) => {
    if (period === 'date') {
      // При выборе периода 'date', открываем bottom sheet
      setShowDatePicker(true);
      // Устанавливаем период в 'date', если он еще не установлен
      if (value !== 'date') {
        onChange(period);
      }
    } else {
      onChange(period);
    }
  };

  const handleDateRangeApply = (start: string, end: string) => {
    if (onDateRangeChange) {
      onDateRangeChange(start, end);
    }
    // Убеждаемся, что период установлен в 'date'
    if (value !== 'date') {
      onChange('date');
    }
    setShowDatePicker(false);
  };

  const handleDatePickerClose = () => {
    setShowDatePicker(false);
  };

  // Определяем текст для кнопки "Выбрать..."
  const getDateButtonLabel = (): string => {
    if (periods.find(p => p.value === 'date')) {
      const datePeriod = periods.find(p => p.value === 'date');
      if (value === 'date' && startDate && endDate) {
        return formatDateRangeForDisplay(startDate, endDate);
      }
      return datePeriod?.label || 'Выбрать...';
    }
    return 'Выбрать...';
  };

  return (
    <>
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
          const isDatePeriod = period.value === 'date';
          const buttonLabel = isDatePeriod ? getDateButtonLabel() : period.label;
          
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
              <span>{buttonLabel}</span>
            </button>
          );
        })}
      </div>

      {showDatePicker && (
        <DateRangeBottomSheet
          startDate={startDate}
          endDate={endDate}
          onApply={handleDateRangeApply}
          onClose={handleDatePickerClose}
        />
      )}
    </>
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

