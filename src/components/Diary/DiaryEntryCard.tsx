import { type DiaryEntry } from '../../utils/storage';

interface DiaryEntryCardProps {
  entry: DiaryEntry;
  onView: () => void;
  onOpenMenu: () => void;
}

export default function DiaryEntryCard({ entry, onView, onOpenMenu }: DiaryEntryCardProps) {
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const weekDays = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
    const months = ['янв.', 'фев.', 'мар.', 'апр.', 'мая', 'июн.', 'июл.', 'авг.', 'сент.', 'окт.', 'нояб.', 'дек.'];
    
    const dayOfWeek = weekDays[date.getDay()];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    
    return `${dayOfWeek}, ${day} ${month} ${year} г.`;
  };

  return (
    <div
      onClick={onView}
      style={{
        backgroundColor: 'var(--tg-theme-bg-color, #ffffff)',
        borderRadius: '12px',
        padding: '16px',
        marginBottom: '12px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        cursor: 'pointer'
      }}
    >
      {entry.title && (
        <div
          style={{
            fontSize: '18px',
            fontWeight: '600',
            color: 'var(--tg-theme-text-color, #000000)',
            marginBottom: '12px',
            lineHeight: '1.4'
          }}
        >
          {entry.title}
        </div>
      )}
      <div
        style={{
          fontSize: '16px',
          color: 'var(--tg-theme-text-color, #000000)',
          lineHeight: '1.5',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          marginBottom: '12px'
        }}
      >
        {entry.content}
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <div
          style={{
            fontSize: '14px',
            color: 'var(--tg-theme-hint-color, #999999)'
          }}
        >
          {formatDate(entry.date)}
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpenMenu();
          }}
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            border: 'none',
            backgroundColor: 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            fontSize: '20px',
            color: 'var(--tg-theme-hint-color, #999999)',
            flexShrink: 0
          }}
        >
          ⋯
        </button>
      </div>
    </div>
  );
}

