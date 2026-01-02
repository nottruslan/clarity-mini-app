import { type DiaryEntry } from '../../utils/storage';
import DiaryEntryCard from './DiaryEntryCard';

interface DiaryEntryListProps {
  entries: DiaryEntry[];
  onView: (entry: DiaryEntry) => void;
  onOpenMenu: (entry: DiaryEntry) => void;
}

export default function DiaryEntryList({ entries, onView, onOpenMenu }: DiaryEntryListProps) {
  if (entries.length === 0) {
    return (
      <div
        style={{
          padding: '40px 20px',
          textAlign: 'center',
          color: 'var(--tg-theme-hint-color, #999999)'
        }}
      >
        У вас пока нет записей. Создайте первую запись!
      </div>
    );
  }

  // Группируем записи по месяцам
  const groupedByMonth: Record<string, DiaryEntry[]> = {};
  
  entries.forEach(entry => {
    const date = new Date(entry.date);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    if (!groupedByMonth[monthKey]) {
      groupedByMonth[monthKey] = [];
    }
    groupedByMonth[monthKey].push(entry);
  });

  // Сортируем месяцы по убыванию (новые сначала)
  const sortedMonths = Object.keys(groupedByMonth).sort((a, b) => b.localeCompare(a));

  // Форматируем название месяца
  const formatMonthHeader = (monthKey: string) => {
    const [year, month] = monthKey.split('-');
    const monthNames = [
      'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
      'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
    ];
    return `${monthNames[parseInt(month) - 1]} ${year} г.`;
  };

  return (
    <div style={{ padding: '12px' }}>
      {sortedMonths.map(monthKey => (
        <div key={monthKey}>
          <div
            style={{
              fontSize: '16px',
              fontWeight: '600',
              color: 'var(--tg-theme-text-color, #000000)',
              marginBottom: '12px',
              marginTop: monthKey !== sortedMonths[0] ? '20px' : '0'
            }}
          >
            {formatMonthHeader(monthKey)}
          </div>
          {groupedByMonth[monthKey]
            .sort((a, b) => b.date - a.date) // Сортируем записи внутри месяца по убыванию даты
            .map(entry => (
              <DiaryEntryCard
                key={entry.id}
                entry={entry}
                onView={() => onView(entry)}
                onOpenMenu={() => onOpenMenu(entry)}
              />
            ))}
        </div>
      ))}
    </div>
  );
}

