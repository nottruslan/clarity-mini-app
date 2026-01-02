import { type DiaryEntry } from '../../utils/storage';

interface DiaryEntryCardProps {
  entry: DiaryEntry;
  onEdit: () => void;
  onDelete: () => void;
}

export default function DiaryEntryCard({ entry, onEdit, onDelete }: DiaryEntryCardProps) {
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
      style={{
        backgroundColor: 'var(--tg-theme-bg-color, #ffffff)',
        borderRadius: '12px',
        padding: '16px',
        marginBottom: '12px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
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
            // Показываем меню для редактирования/удаления
            const menu = document.createElement('div');
            menu.style.position = 'fixed';
            menu.style.top = `${e.clientY}px`;
            menu.style.left = `${e.clientX}px`;
            menu.style.backgroundColor = 'var(--tg-theme-bg-color)';
            menu.style.border = '1px solid var(--tg-theme-secondary-bg-color)';
            menu.style.borderRadius = '8px';
            menu.style.padding = '8px 0';
            menu.style.zIndex = '10000';
            menu.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
            menu.style.minWidth = '120px';
            
            const editBtn = document.createElement('button');
            editBtn.textContent = 'Редактировать';
            editBtn.style.width = '100%';
            editBtn.style.padding = '8px 16px';
            editBtn.style.border = 'none';
            editBtn.style.background = 'transparent';
            editBtn.style.color = 'var(--tg-theme-text-color)';
            editBtn.style.textAlign = 'left';
            editBtn.style.cursor = 'pointer';
            editBtn.onclick = () => {
              document.body.removeChild(menu);
              onEdit();
            };
            
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Удалить';
            deleteBtn.style.width = '100%';
            deleteBtn.style.padding = '8px 16px';
            deleteBtn.style.border = 'none';
            deleteBtn.style.background = 'transparent';
            deleteBtn.style.color = '#ff4444';
            deleteBtn.style.textAlign = 'left';
            deleteBtn.style.cursor = 'pointer';
            deleteBtn.onclick = () => {
              document.body.removeChild(menu);
              onDelete();
            };
            
            menu.appendChild(editBtn);
            menu.appendChild(deleteBtn);
            document.body.appendChild(menu);
            
            const removeMenu = (e: MouseEvent) => {
              if (!menu.contains(e.target as Node)) {
                document.body.removeChild(menu);
                document.removeEventListener('click', removeMenu);
              }
            };
            setTimeout(() => document.addEventListener('click', removeMenu), 0);
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
            color: 'var(--tg-theme-hint-color, #999999)'
          }}
        >
          ⋯
        </button>
      </div>
    </div>
  );
}

